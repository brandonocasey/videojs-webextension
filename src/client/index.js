var document = require('global/document');
var window = require('global/window');
var FileTypes = require('../utils/file-types');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var merge = require('lodash.merge');
var port = chrome.runtime.connect();

// clear the non-sense body that exists now
document.body.innerText = "";

// firefox does not support storage access in client script
port.onMessage.addListener(function(msg) {
	console.log('here');
	if (msg.type === 'storage-response') {
		setup(msg.data);
	}
});

port.postMessage({type: 'storage', data: 'settings'});

var getHREF = function() {
	var href = window.location.href;
	if (url.parse(href).pathname === '/client/index.html') {
		href = querystring.parse(url.parse(href).query).url;
	}
	return href;
}

var setup = function(o) {
	var container = document.createElement('div');
	document.body.style = 'margin:0;padding:0;';
	container.style = 'margin:0;padding:0;background-color:rgb(38,38,38);height:100%;width:100%;display:flex;justify-content: center;align-items: center;'
	document.body.appendChild(container);

	var videoContainer = document.createElement('div');
	container.appendChild(videoContainer);

	o.settings = o.settings || {};
	o.settings.playerSettings = o.settings.playerSettings || {};
	var options = merge({autoplay: true}, o.settings.playerSettings)
	var href = getHREF();
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

	player.src({src: href, type: FileTypes[extension]});

	port.postMessage({type: 'recent-video', data: href});
};

