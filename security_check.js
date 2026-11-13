#!/usr/bin/env node
'use strict';

/**
 * Lightweight, offline security checks for this extension's source tree.
 * This is a static heuristic scanner, not a substitute for a full audit.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const TEXT_EXTENSIONS = new Set(['.js', '.html', '.json', '.css']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);
const findings = [];

function report(severity, file, line, message) {
  findings.push({ severity, file, line, message });
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      inspectFile(fullPath);
    }
  }
}

function inspectFile(fullPath) {
  const relativePath = path.relative(ROOT, fullPath).split(path.sep).join('/');
  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    report('ERROR', relativePath, 1, `파일을 읽지 못했습니다: ${error.message}`);
    return;
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((text, index) => {
    const line = index + 1;
    const checks = [
      [/\beval\s*\(/, 'WARNING', 'eval()은 실행 중인 코드 삽입 위험이 있습니다.'],
      [/\bnew\s+Function\s*\(/, 'WARNING', 'new Function()은 동적 코드 실행을 만듭니다.'],
      [/\bdocument\.write\s*\(/, 'WARNING', 'document.write() 사용을 검토하세요.'],
      [/\binnerHTML\s*=(?!=)/, 'WARNING', 'innerHTML에 신뢰할 수 없는 값이 들어가는지 확인하세요.'],
      [/(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{8,}["']/i, 'WARNING', '비밀값처럼 보이는 하드코딩 문자열이 있습니다.'],
      [/http:\/\//i, 'WARNING', '암호화되지 않은 HTTP URL이 있습니다.']
    ];
    for (const [pattern, severity, message] of checks) {
      if (pattern.test(text)) report(severity, relativePath, line, message);
    }
  });

  if (path.basename(fullPath) === 'manifest.json') inspectManifest(content, relativePath);
  if (path.extname(fullPath).toLowerCase() === '.html' && /<script\b[^>]*\bsrc\s*=\s*["']https?:\/\//i.test(content)) {
    report('WARNING', relativePath, 1, '외부 호스트에서 로드하는 스크립트가 있습니다. 출처와 무결성을 확인하세요.');
  }
}

function inspectManifest(content, file) {
  let manifest;
  try {
    manifest = JSON.parse(content);
  } catch (error) {
    report('ERROR', file, 1, `manifest.json 형식이 올바르지 않습니다: ${error.message}`);
    return;
  }

  const permissions = [...(manifest.permissions || []), ...(manifest.host_permissions || [])];
  if (permissions.includes('<all_urls>')) {
    report('WARNING', file, 1, '<all_urls> 권한은 모든 사이트에 접근합니다. 필요한 도메인으로 제한하는 것을 검토하세요.');
  }
  for (const permission of ['webRequestBlocking', 'debugger', 'nativeMessaging']) {
    if (permissions.includes(permission)) {
      report('WARNING', file, 1, `강한 브라우저 권한 '${permission}'이 요청됩니다. 필요성을 확인하세요.`);
    }
  }
}

walk(ROOT);

if (findings.length === 0) {
  console.log('보안 검사 완료: 정적 검사에서 의심 항목을 찾지 못했습니다.');
  console.log('참고: 이 도구는 휴리스틱 기반이며 취약점이 없음을 보장하지 않습니다.');
  process.exit(0);
}

console.log(`보안 검사 결과: ${findings.length}개 항목`);
for (const finding of findings) {
  console.log(`[${finding.severity}] ${finding.file}:${finding.line} ${finding.message}`);
}
console.log('이 결과는 검토가 필요한 정적 검사 신호이며, 실제 취약점 여부는 수동 확인이 필요합니다.');
process.exit(findings.some(({ severity }) => severity === 'ERROR') ? 1 : 0);
