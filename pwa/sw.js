const CACHE_NAME = 'lerri-v1.4';
const baseUrl = self.location.origin + '/LerriAI_dev/pwa/';

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
  console.log('[SW] Push event received:', event);
  
  let data = { 
    title: 'LerriAI', 
    body: 'New notification', 
    icon: 'https://leonardocofone.github.io/LerriAI_dev/pwa/icon/icon-192.png',
    badge: 'https://leonardocofone.github.io/LerriAI_dev/pwa/icon/icon-192.png',
    tag: 'lerri-notification',
    requireInteraction: false,
    data: { url: 'https://leonardocofone.github.io/LerriAI_dev/pwa/index.html' }
  };
  
  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
      console.log('[SW] Parsed notification data:', data);
    } catch (e) {
      data.body = event.data.text();
      console.log('[SW] Text notification:', data.body);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [200, 100, 200],
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      data: data.data,
      actions: []
    }).then(() => {
      console.log('[SW] Notification shown successfully');
    }).catch(err => {
      console.error('[SW] Notification error:', err);
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