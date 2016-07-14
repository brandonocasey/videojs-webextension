var document = require('global/document');
var merge = require('lodash.merge');
var FileTypes = require('../utils/file-types');

// if we are on firefox we only have local storage
if (!chrome.storage.sync) {
	chrome.storage.sync = chrome.storage.local;
}

var Save = function() {
	var settings = {
		playerSettings: {
			autoplay: document.getElementById('autoplay').checked,
		},
		fileTypes: {},
	};
	Object.keys(FileTypes).forEach(function(t) {
		settings.fileTypes[t] = document.getElementById(t).checked;
	});
	// tell background about a potential data-change event
	chrome.storage.sync.set({settings: settings}, function() {
		chrome.runtime.sendMessage({type: 'data-change'});
	});
};

var Restore = function() {
	chrome.storage.sync.get('settings', function(o) {
		var defaults = {
			fileTypes: {},
			playerSettings: {autoplay: true}
		};
		Object.keys(FileTypes).forEach(function(t) {
			defaults.fileTypes[t] = true;
		});
		var settings = merge(defaults, o.settings);
		document.getElementById('autoplay').checked = settings.playerSettings.autoplay;

		Object.keys(FileTypes).forEach(function(t) {
			document.getElementById(t).checked = settings.fileTypes[t];
		});
	});
};

var addFileTypes = function(container) {
	var legend = document.createElement('h3');
	var list = document.createElement('ul');
	var allButton = document.createElement('button');
	var clearButton = document.createElement('button');

	container.appendChild(legend);
	container.appendChild(allButton);
	container.appendChild(clearButton);
	container.appendChild(list);

	legend.innerText = 'Open files with the following extensions using video.js';

	allButton.innerText = 'Check All';
	allButton.addEventListener('click', function(e) {
		Object.keys(FileTypes).forEach(function(t) {
			document.getElementById(t).checked = true;
		});
		Save();
	});

	clearButton.innerText = 'Uncheck All';
	clearButton.addEventListener('click', function(e) {
		Object.keys(FileTypes).forEach(function(t) {
			document.getElementById(t).checked = false;
		});
		Save();
	});

	// setup file-type el's
	Object.keys(FileTypes).forEach(function(t) {
		var item = document.createElement('li');
		var input = document.createElement('input');
		var label = document.createElement('label');
		list.appendChild(item);
		item.appendChild(input);
		item.appendChild(label);

		label.innerText = ' .' + t;
		input.type = 'checkbox';
		input.id = t;

		input.addEventListener('click', function(e) {
			Save();
		});
	});
};

var addAutoPlay = function(container) {
	var input = document.createElement('input');
	var label = document.createElement('label');
	container.appendChild(input);
	container.appendChild(label);

	label.innerText = 'autoplay';
	input.type = 'checkbox';
	input.id = 'autoplay';

	input.addEventListener('click', function(e) {
		Save();
	});
};

var reload = function() {
	var container = document.getElementById('container');
	var fileTypeContainer = document.createElement('div');
	var autoplayContainer = document.createElement('div');
	var label = document.createElement('h3');
	label.innerText = 'Options';

	container.appendChild(label);
	container.appendChild(autoplayContainer);
	addAutoPlay(autoplayContainer);

	container.appendChild(fileTypeContainer);
	addFileTypes(fileTypeContainer);

	Restore();
	chrome.storage.sync.get('settigns', function(o) {
		if (typeof o.settings === undefined) {
			Save();
		}
	});
};
document.addEventListener('DOMContentLoaded', reload);
