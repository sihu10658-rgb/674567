document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['blockedCount'], (result) => {
    const count = result.blockedCount || 0;
    document.getElementById('count').textContent = count;
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  chrome.storage.local.set({ blockedCount: 0 }, () => {
    document.getElementById('count').textContent = 0;
  });
});
