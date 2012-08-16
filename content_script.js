
// a content-script listener to paste-over the current selection

// http://stackoverflow.com/questions/11973525/how-can-i-replace-a-selected-text-range-in-a-textarea-in-chrome


var dActiveElement = null;

function _dom_trackActiveElement(evt) {
  console.log("focus focusevent ");
   if (evt && evt.target) {
      dActiveElement = evt.target;
      console.log("focus on: " + dActiveElement.nodeName);
   }
}

if (document.addEventListener) {
  document.addEventListener("focus",_dom_trackActiveElement,true);
}

function insertTextAtCursor(text) {
    if (dActiveElement.nodeName =="TEXTAREA") {
      var ta = dActiveElement;
      console.log("selection in textarea!");
      var newvalue = ta.value.slice(0,ta.selectionStart) + text + ta.value.slice(ta.selectionEnd,ta.length);
      console.log("output : " + newvalue );
      ta.value = newvalue;
    }
}

function foo() {
	alert("insert: " + text);
	var sel = window.getSelection();

	// selection operations...
	// http://help.dottoro.com/ljikwsqs.php
	// sel.deleteFromDocument();
	// range.insertNode( document.createTextNode("test"));
	
	var range = sel.getRangeAt(0);
	range.collapse();	
	range.insertNode( document.createTextNode("test"));

	// var range = sel.getRangeAt(0);
	// range.deleteContents();
	// range.insertNode( document.createTextNode(text) );
	
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
      // alert(request.data);
      
      // pasteHTMLAtCaret("test");
      insertTextAtCursor(request.data);
      // replaceSelectedText("test");
      
      // sendResponse({data: document.getElementById('header').innerHTML});
      sendResponse({}); // nothing
    } else {
      sendResponse({}); // snub them.
    }
});
