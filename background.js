let idMap = {}
function createElementsFromLocalStorage(info, tab, type){
    chrome.storage.sync.get('test9',function(items) {
        let list = items['test9'];
        let newTitle = tab.title;
        let text = info.selectionText;
        let url = info.pageUrl;
        let current_datetime = new Date()
        let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
        let newKey = getHash(newTitle + text);
        idMap[newKey] = idMap.hasOwnProperty(newKey) ? idMap[newKey]+1 : 0;
        let newId = `${newKey}-${idMap[newKey]}`;
        
        let newTitleKey = getHash(newTitle);
        idMap[newTitleKey] = idMap.hasOwnProperty(newTitleKey) ? idMap[newTitleKey]+1 : 0;
        let newTitleId = `${newTitleKey}-${idMap[newTitleKey]}`;
        
        let newData = {
            'type': type,
            'text': text,
            'date': formatted_date,
            'id': newId,
            'checked': false
         };
 
        if (list === undefined) {
            list = [{
                'title': newTitle,
                'contents': [newData],
                'url': url,
                'id': newTitleId
            }]
        } 
        else if (list.find(data => data.title === newTitle) === undefined) {
            list.push({
                 'title': newTitle,
                 'contents': [newData],
                 'url': url,
                 'id': newTitleId
             })
        } 
        else {
            let ele = list.find(data => data.title === newTitle);
            ele.contents.push(newData) 
        }

        chrome.storage.sync.set({'test9':list},function() {	
            chrome.storage.sync.get('test9',function(newItems) {	
                //alert(JSON.stringify(newItems))	
            });	
        });
    });
}

function referenceClick(info, tab) {
    createElementsFromLocalStorage(info, tab, 'link');
}

function h1Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H1');
}

function h2Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H2');
}

function h3Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H3');
}

function h4Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H4');
}

function h5Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H5');
}

function h6Click(info, tab) {
    createElementsFromLocalStorage(info, tab, 'H6');
}

function refClick(info, tab) {
    createElementsFromLocalStorage(info, tab, 'ref');
}

function singleLineCodeClick(info, tab) {
   createElementsFromLocalStorage(info, tab, 'code');
}

function getHash(key) {
    const hash = Array.from(key).reduce(
       (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),0,);
       return hash;
}

chrome.runtime.onInstalled.addListener(function() {
    let parent = chrome.contextMenus.create({
        "title": "Format and copy to the clipboard",
        "contexts": ['all']    
    });

    let selected = chrome.contextMenus.create({  
        "title": "Turn selected content into markdown syntax",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent
    });

    let code = chrome.contextMenus.create({  
        "title": "Code block",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": singleLineCodeClick  
    });  

    let link = chrome.contextMenus.create({  
        "title": "Get the link of the current tab",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent,  
        "onclick": referenceClick  
    });  

    let h1 = chrome.contextMenus.create({  
        "title": "H1",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h1Click  
    });  

    let h2 = chrome.contextMenus.create({  
        "title": "H2",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h2Click  
    });  

    let h3 = chrome.contextMenus.create({  
        "title": "H3",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h3Click  
    });  

    let h4 = chrome.contextMenus.create({  
        "title": "H4",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h4Click  
    });  

    let h5 = chrome.contextMenus.create({  
        "title": "H5",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h5Click  
    });  

    let h6 = chrome.contextMenus.create({  
        "title": "H6",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": h6Click  
    });  

    let ref = chrome.contextMenus.create({  
        "title": "Reference",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": selected,  
        "onclick": refClick  
    });  


});

