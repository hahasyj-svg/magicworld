// Service Worker for My Study Planner PWA
const CACHE_NAME = 'study-planner-v1';

// 캐시할 핵심 파일 목록
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

// ─── 설치: 핵심 파일 캐싱 ───────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── 활성화: 오래된 캐시 제거 ──────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── 요청 처리: Network-First (온라인 우선, 실패 시 캐시) ────────────────────
self.addEventListener('fetch', event => {
  // 외부 CDN 요청은 캐시 처리 제외 (항상 네트워크)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 성공 응답은 캐시에 저장
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 오프라인 시 캐시에서 응답
        return caches.match(event.request).then(cached => {
          return cached || caches.match('./index.html');
        });
      })
  );
});
