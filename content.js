// 광고 영역으로 자주 쓰이는 클래스나 아이디 선택자 목록
const adSelectors = [
  'iframe[src*="ads"]',
  'ins.adsbygoogle',
  '.ad-banner',
  '.advertisement',
  'div[id^="google_ads_iframe"]'
];

function hideAds() {
  adSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = 'none';
    });
  });
}

// 동적으로 생성되는 광고를 감시하기 위한 Observer 설정
const observer = new MutationObserver(() => {
  hideAds();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// 초기 실행
window.addEventListener('DOMContentLoaded', hideAds);
