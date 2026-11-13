const AD_SELECTOR = [
  'iframe[src*="ads"]',
  'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]',
  'iframe[src*="googleadservices"]',
  'ins.adsbygoogle',
  'div[id^="google_ads_iframe"]',
  'div[id*="google_ads_iframe"]',
  'div[id*="ad_"]',
  'div[class*="ad-"]',
  'div[class*="ads"]',
  'div[class*="advertisement"]',
  'img[src*="ads"]',
  'img[src*="adview"]',
  'a[href*="ads"]',
  'a[href*="ad-"]',
  'script[src*="ads"]',
  'script[src*="doubleclick"]'
].join(', ');

const HIDE_STYLE = [
  ['display', 'none'],
  ['visibility', 'hidden'],
  ['opacity', '0'],
  ['max-height', '0'],
  ['max-width', '0'],
  ['overflow', 'hidden'],
  ['pointer-events', 'none']
];

// Keep references only in this isolated content-script world; don't add marker
// attributes to the host page's DOM.
const hiddenElements = new WeakSet();
const pendingRoots = new Set();
let frameScheduled = false;

function hideElement(element) {
  if (hiddenElements.has(element) || !element.matches(AD_SELECTOR)) return;

  for (const [property, value] of HIDE_STYLE) {
    element.style.setProperty(property, value, 'important');
  }
  hiddenElements.add(element);
}

function scanRoot(root) {
  if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

  hideElement(root);
  root.querySelectorAll(AD_SELECTOR).forEach(hideElement);
}

function flushPendingRoots() {
  frameScheduled = false;
  for (const root of pendingRoots) scanRoot(root);
  pendingRoots.clear();
}

function scheduleScan(root) {
  if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
  pendingRoots.add(root);
  if (frameScheduled) return;
  frameScheduled = true;
  requestAnimationFrame(flushPendingRoots);
}

function startObserver() {
  const root = document.documentElement;
  if (!root) return;

  // Do one initial scan. Later mutations are limited to changed/inserted nodes
  // instead of repeatedly searching the entire page.
  scanRoot(root);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        scheduleScan(mutation.target);
        continue;
      }
      for (const node of mutation.addedNodes) scheduleScan(node);
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'class', 'id']
  });
}

if (document.documentElement) {
  startObserver();
} else {
  document.addEventListener('DOMContentLoaded', startObserver, { once: true });
}
