(function(){
  chrome.storage.sync.get("title",function(items) {
    var text = document.getElementById('text'); 
    text.innerHTML = "";
    text.innerHTML = text.innerHTML + "Title:\n";
    text.innerHTML = text.innerHTML + `${items.title}\n`;
  });
  chrome.storage.sync.get("content",function(items) {
    var text = document.getElementById('text'); 
    text.innerHTML = text.innerHTML + `\n`;
    text.innerHTML = text.innerHTML + `Selected content:\n`;
    text.innerHTML = text.innerHTML + `${items.content}\n`;
  });
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#copy').addEventListener(
      'click', copy);
    document.querySelector('#clear').addEventListener(
      'click', clear);
  });
  //$('#paste').click(function(){pasteSelection();});
})();

function clear() {
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        alert.error(error);
    } else {
        text.innerHTML = "";
    }
  });
}

function copy() {
  var copyText = document.getElementById("text");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}

function pasteSelection() {
  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
      //tabs.map(tab => {
        var text = document.getElementById('text'); 
        chrome.tabs.sendMessage(tabs[0].id, { action: "response" }, function(response){
          
        text.innerHTML = text.innerHTML + tabs[0].url + '\n';
        text.innerHTML = text.innerHTML + tabs[0].title + '\n';
         //alert('The response is : ' + response.data);
          text.innerHTML = text.innerHTML + response.data;
      });
      //})
  });
}
