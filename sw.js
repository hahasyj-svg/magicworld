// Service Worker for My Study Planner PWA
const CACHE_NAME = 'study-planner-v4';

// 캐시할 핵심 파일 목록
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  
  // 동물 캐릭터 이미지 (칭찬용)
  './assets/cute_egg.png',
  './assets/cute_baby_bird.png',
  './assets/cute_baby_bunny.png',
  './assets/cute_baby_cat.png',
  './assets/cute_baby_dog.png',
  './assets/cute_baby_dragon.png',
  './assets/cute_baby_monkey.png',
  './assets/cute_baby_panda.png',
  './assets/cute_baby_sea.png',
  './assets/cute_baby_tiger.png',
  
  './assets/cute_kid_bird.png',
  './assets/cute_kid_bunny.png',
  './assets/cute_kid_cat.png',
  './assets/cute_kid_dog.png',
  './assets/cute_kid_dragon.png',
  './assets/cute_kid_monkey.png',
  './assets/cute_kid_panda.png',
  './assets/cute_kid_sea.png',
  './assets/cute_kid_tiger.png',
  
  './assets/cute_junior_bird.png',
  './assets/cute_junior_bunny.png',
  './assets/cute_junior_cat.png',
  './assets/cute_junior_dog.png',
  './assets/cute_junior_dragon.png',
  './assets/cute_junior_monkey.png',
  './assets/cute_junior_panda.png',
  './assets/cute_junior_sea.png',
  './assets/cute_junior_tiger.png',
  
  './assets/cute_hero_bird.png',
  './assets/cute_hero_bunny.png',
  './assets/cute_hero_cat.png',
  './assets/cute_hero_dog.png',
  './assets/cute_hero_dragon.png',
  './assets/cute_hero_monkey.png',
  './assets/cute_hero_panda.png',
  './assets/cute_hero_sea.png',
  './assets/cute_hero_tiger.png',
  
  './assets/cute_legend_bird.png',
  './assets/cute_legend_bunny.png',
  './assets/cute_legend_cat.png',
  './assets/cute_legend_dog.png',
  './assets/cute_legend_dragon.png',
  './assets/cute_legend_monkey.png',
  './assets/cute_legend_panda.png',
  './assets/cute_legend_sea.png',
  './assets/cute_legend_tiger.png',
  
  // AI 선생님 이미지 (칭찬용)
  './assets/ai-teacher/female_default.png',
  './assets/ai-teacher/female_all_done.png',
  './assets/ai-teacher/female_half_done.png',
  './assets/ai-teacher/female_first_done.png',
  './assets/ai-teacher/female_partial_done.png',
  './assets/ai-teacher/female_high_weekly.png',
  './assets/ai-teacher/female_high_coins.png',
  './assets/ai-teacher/female_med_weekly.png',
  './assets/ai-teacher/female_low_weekly.png',
  
  './assets/ai-teacher/male_default.png',
  './assets/ai-teacher/male_all_done.png',
  './assets/ai-teacher/male_half_done.png',
  './assets/ai-teacher/male_first_done.png',
  './assets/ai-teacher/male_partial_done.png',
  './assets/ai-teacher/male_high_weekly.png',
  './assets/ai-teacher/male_high_coins.png',
  './assets/ai-teacher/male_med_weekly.png',
  './assets/ai-teacher/male_low_weekly.png'
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
