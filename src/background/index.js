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
		(typeof fileTypes[extension] !== undefined && !fileTypes[extension])) {
		return;
	}

	var i = details.responseHeaders.length;
	while(i--) {
		if ((/Content-type/i).test(details.responseHeaders[i].name)) {
			details.responseHeaders[i].value = 'text/html';
		}
	}
	return {'responseHeaders': details.responseHeaders};
}, {urls: UrlMatches}, ['blocking', 'responseHeaders']);

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.type === 'data-change') {
		reloadSettings();
	}
});

// load settings when first loaded
reloadSettings();
