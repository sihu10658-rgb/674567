// WebAssembly 모듈 로드 완료 후
Module.onRuntimeInitialized = () => {
    // C++로 만든 should_block 함수를 자바스크립트 함수로 래핑
    const checkUrl = Module.cwrap('should_block', 'number', ['string']);

    // 네트워크 요청 감지 (declarativeNetRequest 대신 세밀한 제어가 필요할 때)
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            // C++ 함수로 초고속 차단 여부 판별 (마이크로초 단위 성능!)
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
};
