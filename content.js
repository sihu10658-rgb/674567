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
  adSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.style.display = 'none';
          el.remove();
        }
      });
    } catch (e) {
      // 잘못된 선택자 무시
    }
  });
}

// 초기 로드 시 광고 제거
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAds);
} else {
  removeAds();
}

// 동적으로 추가되는 광고도 감지하여 제거
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      removeAds();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 페이지 내 iframe 광고 제거
window.addEventListener('load', () => {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.src.toLowerCase();
    if (src.includes('ads') || src.includes('ad-') || src.includes('doubleclick')) {
      iframe.style.display = 'none';
      iframe.remove();
    }
  });
});

console.log('Ad Blocker 활성화됨');
