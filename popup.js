const checkboxs = [];
const instruction = "https://github.com/JenHsuan/writer-help-extention";
const author = "https://jenhsuan.github.io/ALayman/profile.html";
const dailyLearning = "https://daily-learning.herokuapp.com/";
const markdownStyleEnum = {
  H1: "#",
  H2: "##",
  H3: "###",
  H4: "####",
  H5: "#####",
  H6: "######",
};


document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#clear').addEventListener('click', clear);
  document.querySelector('#selectAll').addEventListener('click', selectAll);
  document.querySelector('#unselectAll').addEventListener('click', unselectAll);
  document.querySelector('#copyAll').addEventListener('click', copyAll);
  document.querySelector('#instruction').addEventListener('click', () => window.open(instruction));
  document.querySelector('#author').addEventListener('click', () => window.open(author));
  document.querySelector('#dailyLearning').addEventListener('click', () => window.open(dailyLearning));
  
  let main = document.getElementById('main');

  chrome.storage.sync.get('test9', function(items) {
  let data = items['test9'];
  
  for (ele of data) {
      let id = ele.id;
    
      let section = createGeneralElement('div', 'section');
      let sectionLink = createGeneralElement('a', 'sectionLink', '', ele.title, ele.url);
      section.appendChild(sectionLink);

      let arrow = createGeneralElement('i', 'fa fa-angle-double-down arrowContainer', `${id}-arrow`);
      let arrowContainer = createGeneralElement('div', 'arrow');
      arrowContainer.onclick = () => controlContent(id);
      arrowContainer.appendChild(arrow);

      section.appendChild(arrowContainer);
      main.appendChild(section);

      let contentContainer = createGeneralElement('div', 'contentContainer', ele.id);
      
      for (eleContent of ele.contents) {
        let id = eleContent.id;
        checkboxs.push(id);

        let contentCheckbox = createGeneralElement('input', 'contentCheckbox', `${id}-checkbox`, '', 'checkbox');
        contentCheckbox.checked = eleContent.checked;
        contentCheckbox.onchange = () => toggleCheckbox(id);

        let contentCheckboxLabel = createGeneralElement('label', 'contentCheckboxLabel', `${id}-contentCheckboxLabel`);
        contentCheckboxLabel.setAttribute("for", "contentCheckbox");
        
        let contentCheckboxSpan = document.createElement('span');

        contentCheckboxLabel.appendChild(contentCheckbox);
        contentCheckboxLabel.appendChild(contentCheckboxSpan);
        
        let contentDate = createGeneralElement('div', 'contentDate', `${id}-date`, eleContent.type );
        
        let content = null;
        if (eleContent.type === 'code') {
          content = createCodeBlockElement(eleContent);
        } else if (eleContent.type === 'link') {
          content = createTitleLinkElement(ele.title, ele.url);
        } else {
          content = createGeneralMarkdownElement(eleContent, markdownStyleEnum[eleContent.type]);
        } 
        content.setAttribute("id", id);
        
        let deleteBtn = createGeneralElement('div', 'fa fa-trash deleteBtn', `${id}-deleteBtn`);
        deleteBtn.onclick = () => clearItem(id);
        
        let copyBtn = createGeneralElement('div', 'fa fa-copy copyBtn', `${id}-copyBtn`);
        copyBtn.onclick = () => copyItem(id);

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

const toggleCheckbox = id => {  
  chrome.storage.sync.get("test9", function(items) {
    let data = items['test9'];
    for (let i = 0; i < data.length; i++) {
      let index = data[i].contents.findIndex(content => content.id === id);
      data[i].contents[index].checked = !data[i].contents[index].checked;
    }
    chrome.storage.sync.set({'test9':data},function() {});
  });
};

const controlContent = id => {
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


const createGeneralElement = (
  eleType = 'div', 
  className = '', 
  id = '', 
  innerHTML = '',
  type = '', 
  value = ''
) => {
  let content = document.createElement(eleType);
  content.className = className;
  content.innerHTML = innerHTML;
  content.setAttribute("id", id);
  if (eleType === 'input') {
    content.setAttribute("type", type);
  }
  return content;
};

const createGeneralMarkdownElement = (eleContent, style) => {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `${style} ${eleContent.text}`;
  return content;
};

const createTitleLinkElement = (title, url) => {
  let content = document.createElement('textarea');
  content.className = 'content';
  content.value = `[${title}](${url})`;
  return content;
};

const createCodeBlockElement = eleContent => {
  let content = document.createElement('textarea');
  content.className = 'content'
  content.value = '```';
  content.value = content.value + '\r\n' + eleContent.text + '\r\n';
  content.value = content.value + '```';
  return content;
};

const getHash = key => {
  return Array.from(key).reduce(
      (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),0,);
};

const clearItem = id => {
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
};

const createWarningMsg = (content, time) => {
  let x = document.getElementById('snackbar');
  x.className = 'show';
  x.innerHTML = content;
  setTimeout(function(){ x.className = x.className.replace('show', ''); }, time);
};

const clear = () => {
  createWarningMsg('Remove all...', 3000)
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
};

const selectAll = () => {
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
};

const unselectAll = () => {
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
};

const copyItem = id => {
  createWarningMsg('Copied the text', 3000)
  let copyText = document.getElementById(id);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
};

const copyAll = () => {
  createWarningMsg('Copied all', 3000)
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
};

const openTab = tabName => {
  let x = document.getElementsByClassName("tab");
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  document.getElementById(tabName).style.display = "block";  
};