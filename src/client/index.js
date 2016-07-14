var document = require('global/document');
var window = require('global/window');
var FileTypes = require('../file-types');
var path = require('path');
var url = require('url');
var merge = require('lodash.merge');

if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
}

chrome.storage.sync.get('settings', function(o) {
	document.body.innerText = "";

	o.settings = o.settings || {};
	o.settings.playerSettings = o.settings.playerSettings || {};
	var options = merge({autoplay: true}, o.settings.playerSettings)
	var href = window.location.href;
	var pathname = url.parse(href).pathname;
	var extension = path.extname(pathname).replace('.', '');

	var video = document.createElement('video');
	video.className = 'video-js';
	video.controls = true;
	document.body.appendChild(video);
	document.body.appendChild(document.createElement('br'));

	var download = document.createElement('a');
	download.innerText = 'Download m3u8';
	download.download = path.basename(pathname);
	download.href = href;
	document.body.appendChild(download);

	var player = window.player = videojs(video, options);

	player.src({src: window.location.href, type: FileTypes[extension]});

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
});

