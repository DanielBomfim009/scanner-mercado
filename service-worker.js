const CACHE_NAME = "scanner-mercado-v1";
const FILES_TO_CACHE = [
  "/scanner-mercado/",
  "/scanner-mercado/index.html",
  "/scanner-mercado/manifest.json",
  "/scanner-mercado/logo.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
