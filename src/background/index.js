
chrome.webRequest.onHeadersReceived.addListener(function(details) {
	if (details.type === 'main_frame') {
		var i = details.responseHeaders.length;
		while(i--) {
			if ((/Content-type/i).test(details.responseHeaders[i].name)) {
				details.responseHeaders[i].value = 'text/html';
			}
		}
		return {'responseHeaders': details.responseHeaders};
	}
}, {urls: ["<all_urls>"]}, ['blocking', 'responseHeaders']);
