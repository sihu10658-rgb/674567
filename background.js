// 광고 차단 서비스 워커 (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('Ad Blocker 확장프로그램이 설치되었습니다.');
  chrome.storage.local.set({
    enabled: true,
    blockedCount: 0,
    whitelist: []
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'blockAd') {
    chrome.storage.local.get(['blockedCount'], (result) => {
      chrome.storage.local.set({
        blockedCount: (result.blockedCount || 0) + 1
      });
    });
  } else if (request.action === 'getStats') {
    chrome.storage.local.get(['blockedCount'], (result) => {
      sendResponse({ blockedCount: result.blockedCount || 0 });
    });
  }
});
