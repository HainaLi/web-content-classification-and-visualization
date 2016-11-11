//Author: Haina Li
//University of Virginia

chrome.tabs.onUpdated.addListener(function(tabId,info, tab) {
   if (info.status == "complete") {
	chrome.tabs.executeScript(tabId, { file: "extras/jquery-2.1.4.min.js" }, function(){
	chrome.tabs.executeScript(tabId, { file: "extras/bootstrap.min.js" }, function() {

	chrome.tabs.executeScript(tabId, {file: "contentscript.js"}, function (test){
		console.log(test);
	});
	});
	});
	
}	
   });
 
