var FileTypes = require('../file-types');
var path = require('path');
var querystring = require('querystring');

// if we are on firefox we only have local storage
if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
}

chrome.downloads.onCreated.addListener(function(downloadItem) {
	handleURL(downloadItem.url, function() {
		chrome.downloads.cancel(downloadItem.id, function() {
			chrome.downloads.erase({id: downloadItem.id}, function() {
				chrome.tabs.query({url: downloadItem.url}, function(tabs) {
					var tab = tabs[0];
					if (tabs.length > 1) {
						tabs.forEach(function(t) {
							if (t.active) {
								tab = t;
							}
						});
					}

					if (!tab) {
						chrome.tabs.create({}, function(tab) {
							changeTab(downloadItem.url, tab);
						});
					} else {
						changeTab(downloadItem.url, tab);
					}
				});
			});
		});
	})
});

var handleURL = function(url, cb) {
	var extension = path.extname(url).replace('.', '');

	if (Object.keys(FileTypes).indexOf(extension.toLowerCase()) === -1) {
		return;
	}

	chrome.storage.sync.get('settings', function(o) {
		o.settings = o.settings || {autoplay: true, fileTypes: {}};
		o.settings.fileTypes = o.settings.fileTypes || {};
		if (o.settings.fileTypes[extension] === false) {
			return;
		}
		chrome.storage.sync.get('recentVideos', function(o) {
			o.recentVideos = o.recentVideos || [];
			if (o.recentVideos.indexOf(url) === -1) {
				o.recentVideos.push(url);
			}
			if (o.recentVideos.length > 10) {
				o.recentVideos.pop();
			}
			chrome.storage.sync.set(o);
		});

		cb();
	});
};

var changeTab = function(url, tab) {
	var type = FileTypes[path.extname(url).replace('.', '')];
	chrome.storage.sync.get('settings', function(o) {
		o.settings = o.settings || {};
		var options = {
			autoplay: o.settings.autoplay || true,
			src: url,
			type: type
		};
		chrome.tabs.update(tab.id, {url: '/client/index.html?' + querystring.stringify(options)});
	});
};
