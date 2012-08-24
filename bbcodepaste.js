
var helper = null;
var helperdiv = null;

// how to access current page from background
// http://stackoverflow.com/questions/2779579/in-background-html-how-can-i-access-current-web-page-to-get-dom

function OutputStream() {
  this.string = "";
  this.add = function(content) { this.string += content; };
}


function convertHTMLToBBCode(textinput) {
  var myStream = new OutputStream();
  var myHTMLEmitter = new HTMLParseEmitter(myStream);

  HTMLParseContent(textinput,myHTMLEmitter);

  return myStream.string;
}

// <b> test <i> italics </i></b>

function bbCodeTagMapper(node, os) {
   var bbcodetag = null;

   switch(node.nodeName.toUpperCase()) {
     case "#TEXT":
        console.log("   textnode : " + node.nodeValue);
        os.add(node.nodeValue);
        break;
     case "B":
        os.add("[B]");
        bbcodetag = "B";
        break;
     case "I":
        os.add("[I]");
        bbcodetag = "I";
        break;
     case "U":
        os.add("[U]");
        bbcodetag = "U";
        break;
     case "UL":
        os.add("[LIST]");
        bbcodetag = "LIST";
        break;
     case "LI":
        os.add("[*]");
        bbcodetag = "*";
        break;
     case "OL":
        os.add("[LIST=]");
        bbcodetag = "*";
        break;
     case "A":
        os.add("[URL=" + node.href + "]");
        bbcodetag = "URL";
        break;
     case "IMG":
        os.add("[IMG=" + node.src + "]");
        bbcodetag = "IMG";
        break;
     case "PRE":
        os.add("[CODE]");
        bbcodetag = "CODE";
        break;
   }

   return bbcodetag;
}

function walkChildrenOf(node, os) {
   var bbcodetag = bbCodeTagMapper(node, os);
   
   // walk children...
   var subnode = node.firstChild;
   while(subnode) {
      walkChildrenOf(subnode, os);
      subnode = subnode.nextSibling;
   }

   // add the end of the bbcode tag...
   if (bbcodetag != null) {
      os.add("[/" + bbcodetag + "]");
   }
  

   console.log("endtag : " + node.nodeName);
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
   if (helperdiv == null) {
	   helperdiv = bg.document.createElement("div");
           document.body.appendChild(helperdiv);
   }
   
   helper.select(); 
   bg.document.execCommand("Paste");
   
   var data = helper.value;
   console.log("bbcode paste clipboard data: " + data);

   helperdiv.innerHTML = data;
   console.log("innerText = " + helperdiv.innerText);

   // iterate the tags...
   
   var myConvertedOutputStream = new OutputStream();
   walkChildrenOf(helperdiv, myConvertedOutputStream);

   // convert the clipboard contents to BBCode...

   // var convertedData = convertHTMLToBBCode(data);
   // var convertedData = helperdiv.innerText;
   var convertedData = myConvertedOutputStream.string;

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
      
      