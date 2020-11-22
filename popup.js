(function(){
  document.addEventListener('DOMContentLoaded', function() {
    console.log(123)
    document.querySelector('#paste').addEventListener(
        'click', pasteSelection);
  });
  //$('#paste').click(function(){pasteSelection();});
})();


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
