# AdGuard Lite

Chrome 광고 차단 확장 프로그램입니다. URL 차단, DOM 광고 숨김, 실시간 통계를 함께 제공합니다.

## 기능
- 광고 URL 차단
- 동적 광고 요소 숨김
- 차단 수 통계 집계
- 팝업에서 통계 초기화
- 오프라인 정적 보안 검사 (`security_check.js`)

## 설치
1. Chrome에서 `chrome://extensions/` 이동
2. `개발자 모드` 활성화
3. `압축해제된 확장 프로그램 로드` 선택
4. 이 폴더를 선택

## 보안 검사
Node.js가 설치된 상태에서 저장소 루트에서 실행하세요.

```bash
node security_check.js
```

스크립트는 외부 네트워크에 접속하지 않습니다. manifest 권한과 소스 내 일부 위험 패턴·비밀값처럼 보이는 문자열을 찾아 경고합니다. 정적 휴리스틱 검사이므로 결과를 직접 검토해야 하며, 취약점이 없음을 보장하지 않습니다.

## 구조
- `manifest.json` — 확장 프로그램 설정
- `background.js` — 네트워크 필터 및 통계 처리
- `content.js` — 페이지 광고 요소 숨김
- `popup.html` / `popup.js` — 통계 팝업
- `rules.json` — 차단 규칙 예시
- `security_check.js` — 로컬 정적 보안 검사 도구

## 메모
- 광고 차단은 URL 패턴과 DOM 필터를 함께 사용해 안정성과 차단률을 높였습니다.
- 통계는 `chrome.storage.local`에 저장되며, 팝업에서 초기화할 수 있습니다.
