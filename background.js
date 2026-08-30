let blockedCount = 0;

chrome.declarativeNetRequest.onRuleMatchedDebug.forEach?.(() => {
  blockedCount++;
  chrome.storage.local.set({ blockedCount });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blockedCount: 0 });
});
