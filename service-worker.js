const CACHE_NAME = 'gol-buy-smart-v1';
const urlsToCache = [
  './index.html',
  './logo.png',
  './manifest.json',
  './service-worker.js',
  'https://unpkg.com/@zxing/library@0.21.2',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
