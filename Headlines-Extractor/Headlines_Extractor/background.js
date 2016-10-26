//Author: Haina Li
//University of Virginia
chrome.webNavigation.onCompleted.addListener(function(details) {

	chrome.tabs.executeScript(details.tabId, {file: "contentscript.js"}, function (test){
		console.log(test);
	});
}); 