// Service Worker para GoL - Compre com Inteligência
const CACHE_NAME = 'gol-cache-v1';
const urlsToCache = [
  '/scanner-mercado/',
  '/scanner-mercado/index.html',
  '/scanner-mercado/manifest.json',
  '/scanner-mercado/logo.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://unpkg.com/@zxing/library@0.21.2',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('Erro ao abrir cache:', err);
      })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }

        // Clonar a requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Verificar se a resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar a resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Se offline e não estiver no cache, retornar página offline
          if (event.request.mode === 'navigate') {
            return caches.match('/scanner-mercado/index.html');
          }
        });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('Sincronizando dados...');
}

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do GoL',
    icon: '/scanner-mercado/logo.png',
    badge: '/scanner-mercado/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('GoL - Compre com Inteligência', options)
  );
});
