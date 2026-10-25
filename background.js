// 확장프로그램이 설치될 때 차단 규칙을 등록합니다.
chrome.runtime.onInstalled.addListener(() => {
  const rules = [
    {
      id: 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        // 차단할 광고 도메인 패턴 (예시)
        urlFilter: "||googlesyndication.com^",
        resourceTypes: ["script", "image", "sub_frame", "xmlhttprequest"]
      }
    },
    {
      id: 2,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: "||doubleclick.net^",
        resourceTypes: ["script", "image", "sub_frame", "xmlhttprequest"]
      }
    },
    {
      id: 3,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: "||adserver^",
        resourceTypes: ["script", "image", "sub_frame", "xmlhttprequest"]
      }
    }
  ];

  // 기존 규칙을 지우고 새 규칙을 등록
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules
  }, () => {
    console.log("광고 차단 규칙이 적용되었습니다.");
  });
});
