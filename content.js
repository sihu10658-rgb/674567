const AD_SELECTOR = [
  'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]',
  'iframe[src*="googleadservices"]',
  'ins.adsbygoogle',
  '[id^="google_ads_iframe"]',
  '[id*="google_ads_iframe"]',
  '[class~="ad-banner"]',
  '[class~="advertisement"]',
  '[data-ad-slot]',
  '[data-ad-client]'
].join(', ');

const HIDE_STYLE = [
  ['display', 'none'],
  ['visibility', 'hidden'],
  ['pointer-events', 'none']
];

const hiddenElements = new WeakSet();
const pendingRoots = new Set();
let frameScheduled = false;

function hideIfAd(element) {
  if (hiddenElements.has(element) || !element.matches(AD_SELECTOR)) return;
  for (const [property, value] of HIDE_STYLE) {
    element.style.setProperty(property, value, 'important');
  }
  hiddenElements.add(element);
}

function scanSubtree(root) {
  if (!(root instanceof Element)) return;
  hideIfAd(root);
  root.querySelectorAll(AD_SELECTOR).forEach(hideIfAd);
}

function scheduleScan(root) {
  if (!(root instanceof Element)) return;

  // Keep only outer roots: scanning an ancestor already covers its descendants.
  for (const existing of pendingRoots) {
    if (existing === root || existing.contains(root)) return;
    if (root.contains(existing)) pendingRoots.delete(existing);
  }
  pendingRoots.add(root);

  if (!frameScheduled) {
    frameScheduled = true;
    requestAnimationFrame(() => {
      frameScheduled = false;
      for (const pendingRoot of pendingRoots) scanSubtree(pendingRoot);
      pendingRoots.clear();
    });
  }
}

function startObserver() {
  const root = document.documentElement;
  if (!root) return;

  // One initial scan; subsequent work is restricted to changed or inserted nodes.
  scanSubtree(root);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        hideIfAd(mutation.target);
      } else {
        for (const node of mutation.addedNodes) scheduleScan(node);
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'class', 'id', 'data-ad-slot', 'data-ad-client']
  });
}

if (document.documentElement) {
  startObserver();
} else {
  document.addEventListener('DOMContentLoaded', startObserver, { once: true });
}
