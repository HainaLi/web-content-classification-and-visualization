//Author: Haina Li
//University of Virginia

chrome.tabs.onUpdated.addListener(function(tabId,info, tab) {
   if (info.status == "complete") {

	chrome.tabs.executeScript(details.tabId, {file: "contentscript.js"}, function (test){
		console.log(test);
	});
   }
}); 
