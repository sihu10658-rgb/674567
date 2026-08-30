# 🚫 Ad Blocker - 광고 차단 확장프로그램

모던하고 효율적인 Chrome 광고 차단 확장프로그램입니다.

## 📋 기능

- ✅ **Google Ads 차단** - Google AdSense 광고 자동 차단
- ✅ **Facebook 광고 차단** - Facebook 광고 제거
- ✅ **팝업 광고 차단** - 모든 팝업 광고 차단
- ✅ **추적 차단** - 광고 추적 스크립트 차단
- ✅ **비디오 광고 차단** - YouTube 등 비디오 광고 차단
- ✅ **실시간 통계** - 차단된 광고 개수 표시
- ✅ **경량 리소스** - CPU와 메모리 사용 최소화

## 🚀 설치 방법

### Chrome에 설치

1. Chrome 주소창에 `chrome://extensions/` 입력
2. 우측 상단의 "개발자 모드" 활성화
3. "압축해제된 확장프로그램 로드" 클릭
4. 이 폴더를 선택하여 설치

## 📁 파일 구조

```
├── manifest.json      # 확장프로그램 설정 파일
├── background.js      # 백그라운드 서비스 워커
├── content.js         # 콘텐츠 스크립트
├── popup.html         # 팝업 UI
├── popup.css          # 팝업 스타일
├── popup.js           # 팝업 로직
└── README.md          # 문서
```

## 🔧 파일 설명

### manifest.json
- 확장프로그램의 메타데이터 및 권한 정의
- Manifest Version 3 사용 (최신 표준)

### background.js
- 백그라운드에서 실행되는 서비스 워커
- 광고 URL 패턴 매칭
- 네트워크 요청 필터링
- 차단된 광고 통계 관리

### content.js
- 웹페이지에 주입되는 스크립트
- DOM 요소 기반 광고 제거
- 동적 광고 감시 (MutationObserver)
- iframe 광고 차단

### popup.html/css/js
- 확장프로그램 팝업 UI
- 실시간 통계 표시
- 활성화/비활성화 토글
- 설정 관리

## ⚙️ 광고 차단 방식

1. **URL 필터링**: 광고 도메인 차단
   - Google Ads
   - Facebook Ads
   - DoubleClick
   - 등 주요 광고 네트워크

2. **DOM 요소 제거**: CSS 선택자를 이용한 광고 요소 삭제
   - .adsbygoogle
   - [data-ad-client]
   - [class*="advertisement"]
   - 등

3. **동적 감시**: 페이지 로드 후 추가되는 광고도 감시
   - MutationObserver 사용
   - iframe 동적 모니터링

## 📊 통계

팝업에서 차단된 광고의 개수를 실시간으로 확인할 수 있습니다.

- 차단된 광고 카운트 표시
- 통계 초기화 기능
- 세션별 통계 추적

## 🔐 권한 설명

| 권한 | 용도 |
|------|------|
| webRequest | 네트워크 요청 필터링 |
| tabs | 현재 탭 정보 접근 |
| storage | 통계 저장 |
| scripting | 콘텐츠 스크립트 실행 |
| activeTab | 현재 탭 접근 |
| \<all_urls\> | 모든 웹사이트 접근 |



## 📝 향후 기능

- [ ] 화이트리스트 기능
- [ ] 사용자 정의 필터
- [ ] 광고 차단 통계 그래프
- [ ] 다국어 지원
- [ ] 성능 최적화
- [ ] Firefox 호환성

## 📄 라이선스

MIT License

## 👨‍💻 개발자

만든이: sihu10658-rgb

## 🤝 기여

Issue 및 PR은 언제든 환영합니다!

---

**광고 없는 깨끗한 웹 경험을 즐기세요!** 🎉
