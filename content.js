// 콘텐츠 스크립트 - 성능 최적화를 위해 requestAnimationFrame 및 debounce 적용

const adSelectors = [
  '.adsbygoogle',
  'ins.adsbygoogle',
  '[data-ad-client]',
  '[data-ad-slot]',
  '[id*="google_ads"]',
  '[id*="ad-banner"]',
  '[class*="advertisement"]',
  '[class*="ad-banner"]',
  '[class*="ad-container"]',
  '[class*="ad-wrapper"]',
  '[class*="sponsored-ad"]',
  '[class*="native-ad"]',
  '.ytp-ad-button',
  '.ytp-ad-player-overlay',
  '.video-ads',
  '.popup-ad',
  '.modal-ad',
  '.overlay-ad'
];

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
      // 무시
    }
  });

  if (adCount > 0) {
    chrome.runtime.sendMessage({ action: 'blockAd' });
  }
}

// 성능 최적화를 위한 잦은 DOM 조작 방지 (Debounce)
let timeout = null;
const observer = new MutationObserver((mutations) => {
  if (timeout) return;
  timeout = setTimeout(() => {
    timeout = null;
    removeAds();
  }, 250);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    removeAds();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
} else {
  removeAds();
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

window.addEventListener('load', () => {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const src = (iframe.src || '').toLowerCase();
      if (src.includes('ads') || src.includes('ad-') || src.includes('doubleclick')) {
        iframe.style.display = 'none';
        iframe.remove();
      }
    } catch (e) {}
  });
});
