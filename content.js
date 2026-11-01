const AD_SELECTORS = [
  'iframe[src*="ads"]',
  'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]',
  'iframe[src*="googleadservices"]',
  'ins.adsbygoogle',
  'div[id^="google_ads_iframe"]',
  'div[id*="google_ads_iframe"]',
  'div[id*="ad_" ]',
  'div[class*="ad-" ]',
  'div[class*="ads"]',
  'div[class*="advertisement"]',
  'img[src*="ads"]',
  'img[src*="adview"]',
  'a[href*="ads"]',
  'a[href*="ad-" ]',
  'script[src*="ads"]',
  'script[src*="doubleclick"]'
];

const HIDE_STYLE = {
  display: 'none !important',
  visibility: 'hidden !important',
  opacity: '0 !important',
  maxHeight: '0 !important',
  maxWidth: '0 !important',
  overflow: 'hidden !important',
  pointerEvents: 'none !important'
};

function applyHideStyle(element) {
  if (!element || element.dataset.adGuardHidden === 'true') return;

  Object.entries(HIDE_STYLE).forEach(([key, value]) => {
    element.style.setProperty(key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), value);
  });

  element.dataset.adGuardHidden = 'true';
}

function hideAds() {
  const nodes = document.querySelectorAll(AD_SELECTORS.join(', '));
  nodes.forEach((node) => {
    applyHideStyle(node);
  });
}

function scheduleHide() {
  if (window.__adGuardScheduled) return;
  window.__adGuardScheduled = true;

  requestAnimationFrame(() => {
    hideAds();
    window.__adGuardScheduled = false;
  });
}

const observer = new MutationObserver(() => {
  scheduleHide();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    hideAds();
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'class', 'id']
    });
  }, { once: true });
} else {
  hideAds();
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'class', 'id']
  });
}

window.addEventListener('load', () => {
  hideAds();
}, { once: true });
