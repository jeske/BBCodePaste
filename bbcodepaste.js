
var helper = null;

// how to access current page from background
// http://stackoverflow.com/questions/2779579/in-background-html-how-can-i-access-current-web-page-to-get-dom


function convertHTMLToBBCode(textinput) {
  return "bbcode : " + textinput;
}



function bbcodePasteHandler(info, tab) {	
   // grab the clipboard data...
   bg = chrome.extension.getBackgroundPage();

   if (helper === null) {
	   helper = bg.document.createElement("textarea");
	   helper.style.position = "absolute";
	   helper.style.border = "none";
	   // helper.style.fontSize = "1pt";
	   // helper.style.margin = "-100";
	   document.body.appendChild(helper);
   }
   
   helper.select(); 
   bg.document.execCommand("Paste");
   
   var data = helper.value;
   console.log("bbcode paste clipboard data: " + data);
   
   // convert the clipboard contents to BBCode...

   var convertedData = convertHTMLToBBCode(data);

   // send the data to the page...
   chrome.tabs.sendMessage(tab.id, {method: "getSelection", data: convertedData }, function(response) {
	  if (response) { 
		  console.log(response.data);
	  } else {
	  	  console.log("empty response");
	  }
	});
   
}


chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
      // do nothing...
    });
});

chrome.extension.onRequest.addListener(function(request,sender,sendResponse) {
  // do nothing...
});

chrome.contextMenus.create(
     {"title" : "BBCode Paste",
      "contexts" : ["editable"],
      "onclick" : bbcodePasteHandler });
      
      

// A generic onclick callback function.

/* 

function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  
	chrome.tabs.sendMessage(tab.id, {method: "getSelection", data: "test123" }, function(response) {
	  if (response) { 
		  console.log(response.data);
	  } else {
	  	  console.log("empty response");
	  }
	});

}

chrome.contextMenus.create(
     {"title" : "BBCode Test",
      "contexts" : ["editable"],
      "onclick" : genericOnClick });

*/
      
      