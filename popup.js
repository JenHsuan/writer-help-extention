document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#clear').addEventListener('click', clear);
    
  let main = document.getElementById('main');
  chrome.storage.sync.get("test9",function(items) {
  let data = items['test9'];
  
  for (ele of data) {
      let section = document.createElement('div');
      section.className = 'section'

      let sectionLink = document.createElement('a');
      sectionLink.innerHTML = ele.title;
      sectionLink.className = 'sectionLink'
      sectionLink.href = ele.url

      section.appendChild(sectionLink)

      let arrow = document.createElement('i');
      arrow.className = "fa fa-angle-double-down arrowContainer";
      arrow.style = "font-size:16px";
      arrow.setAttribute("id", `${ele.id}-arrow`);

      let arrowContainer = document.createElement('div');
      arrowContainer.className = "arrow";
      arrowContainer.appendChild(arrow)
      let id = ele.id
      arrowContainer.onclick = function(){
        controlContent(id);
      }
      section.appendChild(arrowContainer);
      main.appendChild(section);

      let contentContainer = document.createElement('div');
      contentContainer.className = 'contentContainer';
      contentContainer.setAttribute("id", ele.id);
      
      for (eleContent of ele.contents) {
        let id = eleContent.id

        let contentDate = document.createElement('div');
        contentDate.className = 'contentDate'
        contentDate.setAttribute("id", `${id}-date`);
        contentDate.innerHTML = eleContent.date ;

        let content = null;
        if (eleContent.type === 'code') {
          content = createCodeBlockElement(eleContent);
        } else if (eleContent.type === 'link') {
          content = createTitleLinkElement(ele.title, ele.url)
        }
        content.setAttribute("id", id);

        let deleteBtn = document.createElement('div');
        deleteBtn.className = className = "fa fa-trash deleteBtn";
        deleteBtn.setAttribute("id", `${id}-deleteBtn`);
        deleteBtn.style = "font-size:22px";
        deleteBtn.onclick = function() {
          clearItem(id)
        }

        let copyBtn = document.createElement('div');
        copyBtn.className = className = "fa fa-copy copyBtn";
        copyBtn.setAttribute("id", `${id}-copyBtn`);
        copyBtn.style = "font-size:22px";
        copyBtn.onclick = function(){
          copyItem(id)
        }

        contentContainer.appendChild(contentDate);
        contentContainer.appendChild(content);
        contentContainer.appendChild(copyBtn);
        contentContainer.appendChild(deleteBtn);
        
        main.appendChild(contentContainer);
      }
    }
  });
});
/*
alayman-writer: [
        {
            title: title1,
            contents:[{
                type:
                text
            }],
            url:[]
        }
    ]
 */

function controlContent(id) {
  let contentContainer = document.getElementById(id);
  let arrow = document.getElementById(`${id}-arrow`);
  
  if (contentContainer.className === 'contentContainer') {
    contentContainer.className = 'contentContainer-show'
    arrow.className = "fa fa-angle-double-up arrowContainer";
  } else {
    contentContainer.className = 'contentContainer'
    arrow.className = "fa fa-angle-double-down arrowContainer";
  }
}

function createTitleLinkElement(title, url) {
  let content = document.createElement('textarea');
  content.className = 'content'
  content.value = `[${title}](${url})`;

  return content;
}

function createCodeBlockElement(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content'
  content.value = '```';
  content.value = content.value + '\n' + eleContent.text + '\n';
  content.value = content.value + '```';
  return content;
}

function getHash(key) {
  const hash = Array.from(key).reduce(
     (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),0,);
     return hash;
}

function clearItem(id) {
  let x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = `remove the text`;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 6000);

  let content = document.getElementById(id);
  if (content) {
    content.remove();
  }
  let contentDate = document.getElementById(`${id}-date`);
  if (contentDate) {
    contentDate.remove();
  }
  let contentDeleteBtn = document.getElementById(`${id}-deleteBtn`);
  if (contentDeleteBtn) {
    contentDeleteBtn.remove();
  }
  let contentcopyBtn = document.getElementById(`${id}-copyBtn`);
  if (contentcopyBtn) {
    contentcopyBtn.remove();
  }

  chrome.storage.sync.get("test9",function(items) {
    let data = items['test9'];
    data.forEach((ele, index) => {
      return data[index].contents = ele.contents.filter(content => content.id !== id)
    })
    data = data.filter(ele => ele.contents.length !== 0);
    chrome.storage.sync.set({'test9':data},function() {});
  });
}

function clear() {
  let x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = `Remove all...`;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        alert.error(error);
    } else {
        let sections = document.getElementsByClassName("section");
        if (sections !== undefined) {
          Array.from(sections).map(section => {
            section.remove()
          })
        }

        let contentContainer = document.getElementsByClassName("contentContainer-show");
        if (contentContainer !== undefined) {
          for (let i = 0; i < contentContainer.length; i++) {
            contentContainer[i].remove();
          }
        }
    }
  });
}

function copyItem(id) {
  //alert(id);
  let copyText = document.getElementById(id);
  //alert(copyText)

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  //alert("Copied the text: " + copyText.value);
  let x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = `Copied the text: ${copyText.value}`;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 6000);
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
