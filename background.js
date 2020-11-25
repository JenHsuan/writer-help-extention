// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function genericOnClick(info, tab) {
    /*
    let data = "ID是：" + info.menuItemId + "\n" +  
    "現在的網址是：" + info.pageUrl + "\n" +  
    "選取的文字是：" + (info.selectionText ? info.selectionText : "") + "\n" +  
    "現在hover元素的圖片來源：" + (info.srcUrl ? info.srcUrl : "") + "\n" +  
    "現在hover的連結：" + (info.linkUrl ? info.linkUrl : "") + "\n" +  
    "現在hover的frame是：" + (info.frameUrl ? info.frameUrl : "") + "\n" +
    "tab: " + JSON.stringify(tab);
    */

   chrome.storage.sync.set({"title":tab.title},function() {});
   chrome.storage.sync.set({"content":info.selectionText},function() {});
};

chrome.runtime.onInstalled.addListener(function() {
    let parent = chrome.contextMenus.create({
        "title": "Copy and format",
        "contexts": ['all']    
    });

    let h1 = chrome.contextMenus.create({  
        "title": "H1",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent,  
        "onclick": genericOnClick  
    });  

    let h2 = chrome.contextMenus.create({  
        "title": "H2",  
        "type": "normal",  
        "contexts": ['all'],  
        "parentId": parent,  
        "onclick": genericOnClick  
    });  

});

