// 콘텐츠 스크립트 - 웹페이지에서 실행

const adSelectors = [
  // Google Ads
  '.adsbygoogle',
  'ins.adsbygoogle',
  '[data-ad-client]',
  '[data-ad-slot]',
  
  // Facebook Ads
  '[data-fb-xfbml-state]',
  '.facebook-ad',
  
  // General ad patterns
  '[id*="google_ads"]',
  '[id*="ad-banner"]',
  '[class*="advertisement"]',
  '[class*="ad-banner"]',
  '[class*="ad-container"]',
  '[class*="ad-wrapper"]',
  '[class*="sponsored-ad"]',
  '[class*="native-ad"]',
  
  // Video ads
  '.ytp-ad-button',
  '.ytp-ad-player-overlay',
  '.video-ads',
  
  // Popup ads
  '.popup-ad',
  '.modal-ad',
  '.overlay-ad'
];

// 광고 요소 제거 함수
function removeAds() {
  let adCount = 0;
  adSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.style.display = 'none';
          el.remove();
          adCount++;
        }
      });
    } catch (e) {
      // 잘못된 선택자 무시
    }
  });
  
  if (adCount > 0) {
    // 백그라운드에 광고 차단 수 전달
    chrome.runtime.sendMessage({ action: 'blockAd' });
  }
}

// 동적으로 추가되는 광고도 감지하여 제거
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      removeAds();
    }
  });
});

// 초기 로드 시 광고 제거
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    removeAds();
    
    // 문서가 준비된 시점에 observer도 시작
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  });
} else {
  removeAds();
  
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// 페이지 내 iframe 광고 제거
window.addEventListener('load', () => {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const src = (iframe.src || '').toLowerCase();
      if (src.includes('ads') || src.includes('ad-') || src.includes('doubleclick')) {
        iframe.style.display = 'none';
        iframe.remove();
      }
    } catch (e) {
      // cross-origin 접근 등 예외 무시
    }
  });
});

console.log('Ad Blocker 활성화됨');
