// 광고 차단 서비스 워커
// 광고 필터 리스트
const adPatterns = [
  // Google Ads
  /google.*ads/i,
  /adservice\.google/i,
  /pagead2\.googlesyndication/i,
  
  // Facebook Ads
  /facebook.*ads/i,
  /ads\.facebook/i,
  /connect\.facebook/i,
  
  // Ad Networks
  /doubleclick\.net/i,
  /adnxs\.com/i,
  /ads\.twitter/i,
  /ads\.linkedin/i,
  /ads\.criteo/i,
  /scorecardresearch\.com/i,
  /quantserve/i,
  /taboola/i,
  /outbrain/i,
  
  // Tracking
  /analytics\.google/i,
  /facebook\.com.*tracker/i,
  /track/i,
  /beacon/i,
  
  // Common ad patterns
  /\.ad\./i,
  /ads\./i,
  /advert/i,
  /banner/i,
  /popup/i
];

// 확장프로그램 설치 시
chrome.runtime.onInstalled.addListener(() => {
  console.log('Ad Blocker 확장프로그램이 설치되었습니다.');
  chrome.storage.local.set({
    enabled: true,
    blockedCount: 0,
    whitelist: []
  });
});

// 웹 요청 필터링 (Chrome 구 버전용)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url.toLowerCase();
    
    // 패턴과 매칭 확인
    for (let pattern of adPatterns) {
      if (pattern.test(url)) {
        // 광고 차단
        chrome.storage.local.get(['blockedCount'], (result) => {
          chrome.storage.local.set({
            blockedCount: (result.blockedCount || 0) + 1
          });
        });
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    chrome.storage.local.get(['blockedCount'], (result) => {
      sendResponse({ blockedCount: result.blockedCount || 0 });
    });
  }
});
