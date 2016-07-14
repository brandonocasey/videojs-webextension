var url = require('url');
var path = require('path');

var getUrlFileExtension = function(uri) {
	return path.extname(url.parse(uri).pathname).replace('.', '');
};
