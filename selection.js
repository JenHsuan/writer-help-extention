chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {  
  if(request.action){
    //alert('The response is : ' + request.action);
    //chrome.tabs.getSelected(null, function(tabs) {
      sendResponse({data: window.getSelection().toString()});
      return true;
      //});  
  }
  //alert('The response is : ');
});