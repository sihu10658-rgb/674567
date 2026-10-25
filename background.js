// 서비스 워커 환경에서 Emscripten 컴파일 결과물 로드
importScripts('ad_filter.js');

// Wasm 모듈 초기화 및 C++ 함수 래핑
var Module = {
    onRuntimeInitialized: () => {
        try {
            // C++로 작성된 should_block 함수 바인딩
            const checkUrl = Module.cwrap('should_block', 'number', ['string']);
            console.log("C++ Wasm 필터 엔진 초기화 완료!");

            // 네트워크 요청 가로채기 및 C++ 필터 검사
            chrome.webRequest.onBeforeRequest.addListener(
                (details) => {
                    const isBlocked = checkUrl(details.url);
                    if (isBlocked) {
                        console.log("C++ 엔진이 차단함:", details.url);
                        return { cancel: true };
                    }
                    return { cancel: false };
                },
                { urls: ["<all_urls>"] },
                ["blocking"]
            );
        } catch (e) {
            console.error("Wasm 함수 래핑 중 에러 발생:", e);
        }
    }
};
