const CACHE_NAME = 'lerri-v1.2';
const baseUrl = '/LerriAI_dev/pwa/';

// Only cache files that definitely exist
const urlsToCache = [
  `${baseUrl}index.html`,
  `${baseUrl}app.js`,
  `${baseUrl}app.css`,
  `${baseUrl}manifest.json`,
  `${baseUrl}icon/icon-192.png`,
  `${baseUrl}icon/icon-512.png`,
  `${baseUrl}schedule-manager.css`,
  `${baseUrl}schedule-manager.js`
];

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching essential files');
        // Cache files one by one to see which one fails
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error('[SW] Failed to cache:', url, err);
            });
          })
        );
      })
      .then(() => {
        console.log('[SW] Installation complete, skip waiting');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
      .then(() => {
        console.log('[SW] Activation complete');
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  let data = { 
    title: 'LerriAI', 
    body: 'New notification', 
    icon: `${baseUrl}icon/icon-192.png` 
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || `${baseUrl}icon/icon-192.png`,
      badge: data.badge || `${baseUrl}icon/icon-192.png`,
      vibrate: [200, 100, 200],
      data: data.data || { url: `${baseUrl}index.html` }
    })
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || `${baseUrl}index.html`)
  );
});