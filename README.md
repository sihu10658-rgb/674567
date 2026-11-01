# AdGuard Lite

Chrome 광고 차단 확장 프로그램입니다. URL 차단, DOM 광고 숨김, 실시간 통계를 함께 제공합니다.

## 기능
- 광고 URL 차단
- 동적 광고 요소 숨김
- 차단 수 통계 집계
- 팝업에서 통계 초기화

## 설치
1. Chrome에서 `chrome://extensions/` 이동
2. `개발자 모드` 활성화
3. `압축해제된 확장 프로그램 로드` 선택
4. 이 폴더를 선택

## 구조
- `manifest.json` — 확장 프로그램 설정
- `background.js` — 네트워크 필터 및 통계 처리
- `content.js` — 페이지 광고 요소 숨김
- `popup.html` / `popup.js` — 통계 팝업
- `rules.json` — 차단 규칙 예시

## 메모
- 광고 차단은 URL 패턴과 DOM 필터를 함께 사용해 안정성과 차단률을 높였습니다.
- 통계는 `chrome.storage.local`에 저장되며, 팝업에서 초기화할 수 있습니다.
