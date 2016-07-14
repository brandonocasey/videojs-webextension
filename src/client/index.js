var document = require('global/document');
var window = require('global/window');
var FileTypes = require('../utils/file-types');
var path = require('path');
var url = require('url');
var merge = require('lodash.merge');

if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
}

chrome.storage.sync.get('settings', function(o) {
	document.body.innerText = "";
	var container = document.createElement('div');
	document.body.style = 'margin:0;padding:0;';
	container.style = 'margin:0;padding:0;background-color:rgb(38,38,38);height:100%;width:100%;display:flex;justify-content: center;align-items: center;'
	document.body.appendChild(container);

	var videoContainer = document.createElement('div');
	container.appendChild(videoContainer);

	o.settings = o.settings || {};
	o.settings.playerSettings = o.settings.playerSettings || {};
	var options = merge({autoplay: true}, o.settings.playerSettings)
	var href = window.location.href;
	var pathname = url.parse(href).pathname;
	var extension = path.extname(pathname).replace('.', '');

	var video = document.createElement('video');
	video.className = 'video-js';
	video.controls = true;
	videoContainer.appendChild(video);
	videoContainer.appendChild(document.createElement('br'));

	var download = document.createElement('a');
	download.innerHTML = '<button>Download ' + path.basename(pathname) + '</button>';
	download.download = path.basename(pathname);
	download.href = href;
	download.style = 'display: flex;justify-content:center';
	videoContainer.appendChild(download);

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

