var UrlMatches = require('../utils/url-matches');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var fileTypes = {};
var FIREFOX = false;

if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
	FIREFOX = true;
}

var reloadSettings = function() {
	chrome.storage.sync.get('settings', function(o) {
		o.settings = o.settings || {};
		o.settings.fileTypes = o.settings.fileTypes || {};
		fileTypes = o.settings.fileTypes;
	});
};

// due to firefox not letting us re-write the content-type
// we have to do something silly
if (FIREFOX) {
	chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
		var extension = path.extname(url.parse(details.url).pathname).replace('.', '');

		if (details.type !== 'main_frame' || !extension ||
			(typeof fileTypes[extension] !== undefined && fileTypes[extension] === false)) {
			return;
		}
		var uri = chrome.runtime.getURL('/client/index.html') +
			'?' + querystring.stringify({url: details.url});

		chrome.tabs.update(details.tabId, {url: uri});

	}, {urls: UrlMatches}, ['blocking']);
} else {
	chrome.webRequest.onHeadersReceived.addListener(function(details) {
		var extension = path.extname(url.parse(details.url).pathname).replace('.', '');

		if (details.type !== 'main_frame' || !extension ||
			(typeof fileTypes[extension] !== undefined && fileTypes[extension] === false)) {
			return;
		}

		var i = details.responseHeaders.length;
		while(i--) {
			if (!(/Content-Type/i).test(details.responseHeaders[i].name)) {
				continue;
			}
			details.responseHeaders[i].value = 'text/html; charset=utf-8';
			break;
		}
		return {responseHeaders: details.responseHeaders};
	}, {urls: UrlMatches}, ['blocking', 'responseHeaders']);
}

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		if (msg.type === 'data-change') {
			reloadSettings();
		} else if (msg.type === 'storage') {
			chrome.storage.sync.get(msg.data, function(o) {
				port.postMessage({type: 'storage-response', data: o});
			});
		} else if (msg.type === 'recent-video') {
			var href = msg.data;
			chrome.storage.sync.get('recentVideos', function(o) {
				o.recentVideos = o.recentVideos || [];
				if (o.recentVideos.indexOf(href) === -1) {
					o.recentVideos.push(href);
				}
				if (o.recentVideos.length > 10) {
					o.recentVideos.pop();
				}
				chrome.storage.sync.set(o);
			});

		}
	});
});

// load settings when first loaded
reloadSettings();
