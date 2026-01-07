const CACHE_NAME = 'lerri-v1.0';
const baseUrl = 'https://www.lerriai.com/pwa/';

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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('push', event => {
  console.log('[SW] Push received');
  
  let data = { 
    title: 'LerriAI', 
    body: 'New notification', 
    icon: 'https://www.lerriai.com/pwa/icon/icon-192.png',
    badge: 'https://www.lerriai.com/pwa/icon/icon-192.png',
    tag: 'lerri-notification-' + Date.now(),
    requireInteraction: true,
    renotify: true,
    silent: false,
    data: { url: 'https://www.lerriai.com/pwa/index.html' }
  };
  
  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: data.vibrate || [200, 100, 200],
      tag: data.tag,
      requireInteraction: data.requireInteraction !== false,
      renotify: true,
      silent: false,
      timestamp: data.timestamp || Date.now(),
      data: data.data
    })
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || `${baseUrl}index.html`;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});