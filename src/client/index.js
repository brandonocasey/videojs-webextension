var document = require('global/document');
var window = require('global/window');
var querystring = require('querystring');

var start = function() {
	var msg = querystring.parse(window.location.search.replace(/^\?/, ''));
	console.log(msg);

	var video = document.createElement('video');
	video.className = 'video-js';
	video.controls = true;
	document.getElementById('container').appendChild(video);
	if (msg.autoplay === "true") {
		msg.autoplay = true;
	} else {
		msg.autoplay = false;
	}

	var player = window.player = videojs(video, {
		autoplay: msg.autoplay
	});

	player.src({src: msg.src, type: msg.type});
};

document.addEventListener('DOMContentLoaded', start);
