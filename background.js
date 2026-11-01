const AD_HOST_PATTERNS = [
  /doubleclick\.net/i,
  /googlesyndication\.com/i,
  /googleadservices\.com/i,
  /google-analytics\.com/i,
  /adsystem\.com/i,
  /adservice\.google/i,
  /facebook\.com\/ads/i,
  /facebook\.com\/ad/i,
  /adnxs\.com/i,
  /taboola\.com/i,
  /outbrain\.com/i,
  /moatads\.com/i,
  /amazon-adsystem\.com/i,
  /googletagmanager\.com/i,
  /googletagservices\.com/i
];

const BLOCKED_RULES = [
  {
    id: 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: '*://*.doubleclick.net/*',
      resourceTypes: ['script', 'image', 'stylesheet', 'sub_frame', 'font', 'media']
    }
  },
  {
    id: 2,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: '*://*.googlesyndication.com/*',
      resourceTypes: ['script', 'image', 'sub_frame', 'stylesheet', 'font']
    }
  },
  {
    id: 3,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: '*://*.googleadservices.com/*',
      resourceTypes: ['script', 'image', 'sub_frame', 'stylesheet']
    }
  },
  {
    id: 4,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: '*://*.adsystem.com/*',
      resourceTypes: ['script', 'image', 'sub_frame', 'stylesheet']
    }
  }
];

function safeGetBlockedCount(callback) {
  chrome.storage.local.get({ blockedCount: 0 }, (result) => {
    callback(Number(result.blockedCount) || 0);
  });
}

function incrementBlockedCount() {
  safeGetBlockedCount((count) => {
    const nextCount = count + 1;
    chrome.storage.local.set({ blockedCount: nextCount }, () => {
      chrome.runtime.sendMessage({ type: 'stats:update', count: nextCount });
    });
  });
}

function isAdUrl(url) {
  if (!url) return false;

  const normalized = url.toLowerCase();
  if (normalized.startsWith('chrome-extension://')) return false;

  if (/(\/ads?\b|\/advert|\/ad_click|\/tracking|\/analytics|\/pixel|\/beacon)/i.test(normalized)) {
    return true;
  }

  return AD_HOST_PATTERNS.some((pattern) => pattern.test(normalized));
}

function ensureInit() {
  chrome.storage.local.get({ blockedCount: 0 }, (result) => {
    if (typeof result.blockedCount !== 'number') {
      chrome.storage.local.set({ blockedCount: 0 });
    }
  });

  if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateDynamicRules) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: BLOCKED_RULES,
      removeRuleIds: BLOCKED_RULES.map((rule) => rule.id)
    }).catch(() => {
      // ignore declarative rule setup errors for compatibility
    });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureInit();
});

chrome.runtime.onStartup.addListener(() => {
  ensureInit();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message && message.type === 'getStats') {
    safeGetBlockedCount((count) => sendResponse({ count }));
    return true;
  }

  if (message && message.type === 'resetStats') {
    chrome.storage.local.set({ blockedCount: 0 }, () => {
      chrome.runtime.sendMessage({ type: 'stats:update', count: 0 });
      sendResponse({ ok: true });
    });
    return true;
  }

  return false;
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!details || !details.url) {
      return { cancel: false };
    }

    if (isAdUrl(details.url)) {
      incrementBlockedCount();
      return { cancel: true };
    }

    return { cancel: false };
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

ensureInit();
