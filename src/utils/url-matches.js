var FileTypes = require('./file-types.js');

var matches = [];
Object.keys(FileTypes).forEach(function(t) {
  matches.push('*://*/*.' + t);
  matches.push('*://*/*.' + t + '?*');
});

module.exports = matches;
