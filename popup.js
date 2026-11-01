function updateCount() {
  chrome.storage.local.get({ blockedCount: 0 }, (result) => {
    const value = Number(result.blockedCount) || 0;
    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = String(value);
  });
}

function bindEvents() {
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chrome.storage.local.set({ blockedCount: 0 }, () => {
        updateCount();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCount();
  bindEvents();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'stats:update') {
    updateCount();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedCount) {
    updateCount();
  }
});
