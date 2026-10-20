// Target domains where content.js should run
const targetDomains = [
  "google.com",
  "bing.com",
  "youtube.com",
  "duckduckgo.com"
];

// Automatically inject content.js dynamically when the page finishes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const urlObj = new URL(tab.url);
      // Check if the current domain matches one of our target platforms
      const isTarget = targetDomains.some(domain => urlObj.hostname.endsWith(domain));
      
      if (isTarget) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).catch(err => console.log("Script injection skipped/already injected:", err));
      }
    } catch (e) {
      // Ignore invalid URLs like chrome://
    }
  }
});
// Dynamic log forwarder that reads credentials from local storage on-the-fly
function sendToSplunk(eventData) {
  chrome.storage.local.get(['splunkHecUrl', 'splunkToken'], (config) => {
    const url = config.splunkHecUrl;
    const token = config.splunkToken;

    // Fail silently if configuration hasn't been set up yet
    if (!url || !token) {
      console.warn("Splunk Logger: Missing configuration credentials. Log skipped.");
      return;
    }

    const payload = {
      event: eventData,
      sourcetype: "browser:activity:extension",
      source: "browser_extension"
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Splunk ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .catch(error => console.error('Splunk Forwarding Error:', error));
  });
}

// Automatically pop up the settings GUI upon installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

// 1. Listen for standard URL updates (Loads and refreshes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    sendToSplunk({
      action: "page_visit",
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString()
    });
  }
});

// [FEATURE B] - Listen for tab visibility shifts (Context switching)
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Fetch the tab metadata since the activation event only provides IDs
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url || tab.url.startsWith('chrome://')) return;

    sendToSplunk({
      action: "tab_switch_focus",
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString()
    });
  });
});

// 3. Listen for search queries from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEARCH_QUERY") {
    sendToSplunk({
      action: "search_input",
      platform: message.platform,
      query: message.query,
      url: sender.tab ? sender.tab.url : "unknown",
      timestamp: message.timestamp
    });
  }
});
