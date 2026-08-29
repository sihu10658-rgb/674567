// 팝업 스크립트

// 통계 업데이트
function updateStats() {
  chrome.storage.local.get(['blockedCount'], (result) => {
    document.getElementById('blockedCount').textContent = result.blockedCount || 0;
  });
}

// 토글 스위치 이벤트
document.getElementById('enableToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.local.set({ enabled });
  
  const statusText = document.getElementById('statusText');
  statusText.textContent = enabled ? '확장프로그램 활성화' : '확장프로그램 비활성화';
});

// 초기 상태 설정
chrome.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false;
  document.getElementById('enableToggle').checked = enabled;
  document.getElementById('statusText').textContent = enabled ? '확장프로그램 활성화' : '확장프로그램 비활성화';
});

// 통계 초기화 버튼
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('통계를 초기화하시겠습니까?')) {
    chrome.storage.local.set({ blockedCount: 0 });
    document.getElementById('blockedCount').textContent = '0';
  }
});

// 화이트리스트 버튼
document.getElementById('whitelistBtn').addEventListener('click', () => {
  alert('이 기능은 추후 업데이트 예정입니다.');
});

// 초기 통계 표시
updateStats();

// 주기적으로 통계 업데이트
setInterval(updateStats, 1000);
