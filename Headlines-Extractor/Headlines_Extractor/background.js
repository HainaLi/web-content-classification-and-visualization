//Author: Haina Li
//University of Virginia

/*
chrome.tabs.onUpdated.addListener(function(tabId,info, tab) {
   if (info.status == "complete") {
	   */

	chrome.tabs.executeScript(null,{file: "contentscript.js"}, function (test){
		console.log(test);
	});
/*
   }
}); 
*/
