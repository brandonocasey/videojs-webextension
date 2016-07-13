var pkg = require('../package.json');
var FileTypes = require('./file-types.js');

module.exports = {
  "manifest_version": 2,
  // application is a work around for a bug in firefox 49 alpha
  "applications": {
    "gecko": {
      "id": "nope@example.com"
    }
  },
  "name": pkg.name,
  "version": pkg.version,
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
  "permissions": [
    "storage",
    "activeTab",
    "downloads",
    "tabs"
  ]
};
