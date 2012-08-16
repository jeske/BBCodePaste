
var helper = null;


// how to access current page from background
// http://stackoverflow.com/questions/2779579/in-background-html-how-can-i-access-current-web-page-to-get-dom

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  
	chrome.tabs.sendRequest(tab.id, {method: "getSelection", data: "test123" }, function(response) {
	  if (response) { 
		  console.log(response.data);
	  } else {
	  	  console.log("empty response");
	  }
	});

}


// http://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div

function insertTextAtCursor(tab, text) {
    var sel, range, html;
    if (tab.getSelection) {
        sel = tab.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (tab.document.selection && document.selection.createRange) {
        tab.document.selection.createRange().text = text;
    }
}

function bbcodePasteHandler(info, tab) {
	// insertTextAtCursor(tab, "testtest");

	// var curSelection = window.getSelection();
	// alert(curSelection.toString());
	
	// curSelection.deleteFromDocument();
}

function bbcodePasteHandler2(info, tab) {
   var saveSelectionRange = window.getSelection().getRangeAt(0); // save the cursor insertion point
   bg = chrome.extension.getBackgroundPage();

   if (helper === null) {
	   helper = bg.document.createElement("textarea");
	   helper.style.position = "absolute";
	   helper.style.border = "none";
	   //helper.style.fontSize = "1pt";
	   // helper.style.margin = "-100";
	   document.body.appendChild(helper);
   }
   
   helper.select(); 
   bg.document.execCommand("Paste");
   
   var data = helper.value;
   alert(data);
   
   // restore selection
   var restoreSelection = window.getSelection();
   restoreSelection.removeAllRanges();
   restoreSelection.addRange(saveSelectionRange);
   
   
   restoreSelection.getRangeAt(0).text = "test";
   
}

chrome.contextMenus.create(
     {"title" : "BBCode Paste",
      "contexts" : ["editable"],
      "onclick" : bbcodePasteHandler });
      
      
chrome.contextMenus.create(
     {"title" : "BBCode Test",
      "contexts" : ["editable"],
      "onclick" : genericOnClick });
      
      