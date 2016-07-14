var UrlMatches = require('../utils/url-matches');
var url = require('url');
var path = require('path');
var fileTypes = {};


if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
}

var reloadSettings = function() {
	chrome.storage.sync.get('settings', function(o) {
		o.settings = o.settings || {};
		o.settings.fileTypes = o.settings.fileTypes || {};
		fileTypes = o.settings.fileTypes;
	});
};

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

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		if (msg.type === 'data-change') {
			reloadSettings();
		} else if (msg.type === 'storage') {
			chrome.storage.sync.get(msg.data, function(o) {
				port.postMessage({type: 'storage-response', data: o});
			});
		}
	});
});

// load settings when first loaded
reloadSettings();
