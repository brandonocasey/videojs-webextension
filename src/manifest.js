var pkg = require('../package.json');
var UrlMatches = require('./utils/url-matches');

var ucwords = function(str) {
  str = str.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function($1){
      return $1.toUpperCase();
    });
};
var manifest = {
  "manifest_version": 2,
  // application is a work around for a bug in firefox 49 alpha
  "applications": {
    "gecko": {
      "id": "nope@example.com"
    }
  },
  "name": ucwords(pkg.name.replace('-', ' ')),
  "version": pkg.version,
  "description": pkg.description,
  "author": pkg.author,
  "homepage_url": pkg.repository,
  "background": {
    "scripts": ["background/index.js"],
    "persistent": true
  },
  "icons": {
    "16": "img/videojs-logo-16.png",
    "48": "img/videojs-logo-48.png",
    "128": "img/videojs-logo-128.png"
  },
  "browser_action": {
    "default_title": pkg.name,
    "default_popup": "popup/index.html",
  },
  "options_ui": {
    "page": "options/index.html",
    "chrome_style": true
  },
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
  "content_scripts":[{
    "js": [
      "client/index.js"
    ],
    "css": ["client/index.css"],
    "run_at": "document_end",
    "matches": UrlMatches,
  }],
  "permissions": [
    "storage",
    "webRequest",
    "webRequestBlocking"
  ].concat(UrlMatches)
};



module.exports = manifest;
