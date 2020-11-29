// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
        
        //alert(newTitleId)
        let newData = {
            'type': type,
            'text': text,
            'date': formatted_date,
            'id': newId
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

function singleLineCodeClick(info, tab) {
    /*
    let data = "ID是：" + info.menuItemId + "\n" +  
    "現在的網址是：" + info.pageUrl + "\n" +  
    "選取的文字是：" + (info.selectionText ? info.selectionText : "") + "\n" +  
    "現在hover元素的圖片來源：" + (info.srcUrl ? info.srcUrl : "") + "\n" +  
    "現在hover的連結：" + (info.linkUrl ? info.linkUrl : "") + "\n" +  
    "現在hover的frame是：" + (info.frameUrl ? info.frameUrl : "") + "\n" +
    "tab: " + JSON.stringify(tab);

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
   createElementsFromLocalStorage(info, tab, 'code');
/*
   chrome.storage.sync.get('title',function(items) {
       let titles = item.title;
       titles.push(tab.title);
       chrome.storage.sync.set({"title":titles},function() {});
   });
   chrome.storage.sync.set({"content-0":[info.selectionText]},function() {});
   chrome.storage.sync.set({"url":[info.pageUrl]},function() {});
   */
};

function getHash(key) {
    const hash = Array.from(key).reduce(
       (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),0,);
       return hash;
}

chrome.runtime.onInstalled.addListener(function() {
    let parent = chrome.contextMenus.create({
        "title": "Copy and format",
        "contexts": ['all']    
    });

    let code = chrome.contextMenus.create({  
        "title": "Single line code block",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent,  
        "onclick": singleLineCodeClick  
    });  

    let link = chrome.contextMenus.create({  
        "title": "Get the tab reference",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent,  
        "onclick": referenceClick  
    });  

});

