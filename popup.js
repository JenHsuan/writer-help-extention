let checkboxs = [];

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#clear').addEventListener('click', clear);
  document.querySelector('#selectAll').addEventListener('click', selectAll);
  document.querySelector('#unselectAll').addEventListener('click', unselectAll);
  document.querySelector('#copyAll').addEventListener('click', copyAll);
  
  let main = document.getElementById('main');
  chrome.storage.sync.get("test9",function(items) {
  let data = items['test9'];
  
  for (ele of data) {
      let section = document.createElement('div');
      section.className = 'section'

      let sectionLink = document.createElement('a');
      sectionLink.innerHTML = ele.title;
      sectionLink.className = 'sectionLink';
      sectionLink.href = ele.url;

      section.appendChild(sectionLink);

      let arrow = document.createElement('i');
      arrow.className = "fa fa-angle-double-down arrowContainer";
      arrow.style = "font-size:16px";
      arrow.setAttribute("id", `${ele.id}-arrow`);

      let arrowContainer = document.createElement('div');
      arrowContainer.className = "arrow";
      arrowContainer.appendChild(arrow);
      let id = ele.id;
      arrowContainer.onclick = function(){
        controlContent(id);
      };
      section.appendChild(arrowContainer);
      main.appendChild(section);

      let contentContainer = document.createElement('div');
      contentContainer.className = 'contentContainer';
      contentContainer.setAttribute("id", ele.id);
      
      for (eleContent of ele.contents) {
        let id = eleContent.id;
        checkboxs.push(id);

        let contentCheckbox = document.createElement('input');
        contentCheckbox.className = 'contentCheckbox';
        contentCheckbox.checked = eleContent.checked;
        contentCheckbox.setAttribute("id", `${id}-checkbox`);
        contentCheckbox.setAttribute("type", "checkbox");
        contentCheckbox.onchange = function() {
          toggleCheckbox(id);
        };

        let contentCheckboxLabel = document.createElement('label');
        contentCheckboxLabel.setAttribute("for", "contentCheckbox");
        contentCheckboxLabel.className="contentCheckboxLabel";
        contentCheckboxLabel.setAttribute("id", `${id}-contentCheckboxLabel`);

        let contentCheckboxSpan = document.createElement('span');


        contentCheckboxLabel.appendChild(contentCheckbox);
        contentCheckboxLabel.appendChild(contentCheckboxSpan);
        
        let contentDate = document.createElement('div');
        contentDate.className = 'contentDate';
        contentDate.setAttribute("id", `${id}-date`);
        contentDate.innerHTML = eleContent.type ;

        let content = null;
        if (eleContent.type === 'code') {
          content = createCodeBlockElement(eleContent);
        } else if (eleContent.type === 'link') {
          content = createTitleLinkElement(ele.title, ele.url)
        } else if (eleContent.type === 'H1') {
          content = createH1Element(eleContent);
        } else if (eleContent.type === 'H2') {
          content = createH3Element(eleContent);
        } else if (eleContent.type === 'H3') {
          content = createH3Element(eleContent);
        } else if (eleContent.type === 'H4') {
          content = createH4Element(eleContent);
        } else if (eleContent.type === 'H5') {
          content = createH5Element(eleContent);
        } else if (eleContent.type === 'H6') {
          content = createH6Element(eleContent);
        }
        content.setAttribute("id", id);

        let deleteBtn = document.createElement('div');
        deleteBtn.className = className = "fa fa-trash deleteBtn";
        deleteBtn.setAttribute("id", `${id}-deleteBtn`);
        deleteBtn.style = "font-size:22px";
        deleteBtn.onclick = function() {
          clearItem(id);
        };
        let copyBtn = document.createElement('div');
        copyBtn.className = className = "fa fa-copy copyBtn";
        copyBtn.setAttribute("id", `${id}-copyBtn`);
        copyBtn.style = "font-size:22px";
        copyBtn.onclick = function(){
          copyItem(id);
        };

        contentContainer.appendChild(contentCheckboxLabel);
        contentContainer.appendChild(contentDate);
        contentContainer.appendChild(content);
        contentContainer.appendChild(copyBtn);
        contentContainer.appendChild(deleteBtn);
        
        main.appendChild(contentContainer);
      }
    }
  });
  //How much capacities the user use
  let usedCapacity = document.getElementById('usedCapacity');
  chrome.storage.sync.getBytesInUse("test9", function(bytes){
    let kBUnit = 1024;
    let mBUnit= 1048576;
    let consumed = (bytes/chrome.storage.sync.QUOTA_BYTES * 100).toFixed(2);
    if (bytes >= kBUnit) {
      usedCapacity.innerHTML = `You have used ${(bytes/1024).toFixed(2)} KB (${consumed}%)`;
    } else if (bytes >= mBUnit) {
      usedCapacity.innerHTML = `You have used ${(bytes/1048576).toFixed(2)} MB (${consumed}%)`;
    } else {
      usedCapacity.innerHTML = `You have used ${bytes} Bytes (${consumed}%)`;
    }


    let status = document.getElementById("status");
    if (consumed < 70) {
      status.src = 'images/green.png';
    } else if (consumed >= 70) {
      status.src = 'images/yellow.png';
    } else if (consumed >= 90) {
      status.src = 'images/red.png';
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

quicknote: 

setting: {
  seletedTab:
}
 */

function toggleCheckbox(id){  
  chrome.storage.sync.get("test9",function(items) {
    let data = items['test9'];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].contents.length; j++) {
        if (data[i].contents[j].id === id) {
          data[i].contents[j].checked = !data[i].contents[j].checked; 
        }
      }  
    }
           
    chrome.storage.sync.set({'test9':data},function() {});
  });
}

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

function createH1Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `# ${eleContent.text}`;
  return content;
}

function createH2Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `## ${eleContent.text}`;
  return content;
}

function createH3Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `### ${eleContent.text}`;
  return content;
}

function createH4Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `#### ${eleContent.text}`;
  return content;
}

function createH5Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `##### ${eleContent.text}`;
  return content;
}

function createH6Element(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `###### ${eleContent.text}`;
  return content;
}

function createTitleLinkElement(title, url) {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `[${title}](${url})`;

  return content;
}

function createCodeBlockElement(eleContent) {
  let content = document.createElement('textarea');
  content.className = 'content'
  content.value = '```';
  content.value = content.value + '\r\n' + eleContent.text + '\r\n';
  content.value = content.value + '```';
  return content;
}

function getHash(key) {
  const hash = Array.from(key).reduce(
     (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),0,);
     return hash;
}

function clearItem(id) {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.innerHTML = `remove the text`;
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);

  let content = document.getElementById(id);
  if (content) {
    content.remove();
  }
  let contentCheckboxLabel = document.getElementById(`${id}-contentCheckboxLabel`);
  if (contentCheckboxLabel) {
    contentCheckboxLabel.remove();
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
  chrome.storage.sync.remove("test9",function() {
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

function selectAll(){
  checkboxs.map(id => {
    let checkbox = document.getElementById(`${id}-checkbox`);
    checkbox.checked = true;
  })
  chrome.storage.sync.get("test9",function(items) {
    let data = items['test9'];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].contents.length; j++) {
        data[i].contents[j].checked = true; 
      }  
    }
           
    chrome.storage.sync.set({'test9':data},function() {});
  });
}

function unselectAll(){
  checkboxs.map(id => {
    let checkbox = document.getElementById(`${id}-checkbox`);
    checkbox.checked = false;
  })
  chrome.storage.sync.get("test9",function(items) {
    let data = items['test9'];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].contents.length; j++) {
        data[i].contents[j].checked = false; 
      }  
    }
           
    chrome.storage.sync.set({'test9':data},function() {});
  });
}

function copyItem(id) {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.innerHTML = "Copied the text";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);

  let copyText = document.getElementById(id);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
}

function copyAll() {
  let x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = "Copied all";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

  let noteArea = document.getElementById("noteArea")
  checkboxs.map(id => {
    let checkbox = document.getElementById(`${id}-checkbox`);
    if (checkbox.checked) {
      let content = document.getElementById(id);
      noteArea.value = noteArea.value + "* " +  content.value + '\r\n'; 
    }
  })
  noteArea.style.display = 'block'
  noteArea.select()
  noteArea.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  noteArea.style.display = 'none'
}

function openTab(tabName) {
  let x = document.getElementsByClassName("tab");
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  document.getElementById(tabName).style.display = "block";  
}