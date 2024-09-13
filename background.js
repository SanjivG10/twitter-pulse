chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProfileFromHandle') {
      extractProfileFromHandle(request.handle);
    }
    else if (request.action === 'closeTab'){
      console.log(request.data)
        chrome.tabs.remove(request.tabId);
    }
  });
  


  function extractProfileFromHandle(handle) {
    chrome.tabs.create({url: `https://x.com/${handle}`, active: false}, (tab) => {
      // Listen for the tab to finish loading
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.sendMessage(tabId, { action: "scrapeProfile",tabId });
        }
      });
    });
  }
  

  