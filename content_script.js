// BBCodePaste
// Authored by David W. Jeske
// Licensed as free open-source in the Public Domain


// a content-script listener to paste-over the current selection

// http://stackoverflow.com/questions/11973525/how-can-i-replace-a-selected-text-range-in-a-textarea-in-chrome

// http://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div


var dActiveElement = null;

function _dom_trackActiveElement(evt) {
   if (evt && evt.target) {
      dActiveElement = evt.target;
      console.log("focus on: " + dActiveElement.nodeName + " id: " + dActiveElement.id);
   } else {
     console.log("focus else..");
   }
}

if (document.addEventListener) {
  document.addEventListener("focus",_dom_trackActiveElement,true);
}

function insertTextAtCursor(text) {
    console.log("insertTextAtCursor : " + text);    

    if (dActiveElement.nodeName.toUpperCase() == "TEXTAREA") {
      console.log("selection in textarea!  id: " + dActiveElement.id);

      var ta = dActiveElement;
      var saveSelectionStart = ta.selectionStart;

      var newvalue = ta.value.slice(0,ta.selectionStart) + text + ta.value.slice(ta.selectionEnd,ta.length);
      console.log("output : " + newvalue  + ", len : " + newvalue.length);
      var newSelectionEnd = ta.selectionStart + text.length;

      ta.value = newvalue;
      ta.selectionStart = ta.selectionEnd = (newSelectionEnd);       
    }
}

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
      // do nothing...
      console.log("BBCodePaste: connected");
    });
});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
      console.log("BBCodePaste: getSelection message received");
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


// JUNK ----------------------------------------

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

console.log("BBCodePaste: loaded...");