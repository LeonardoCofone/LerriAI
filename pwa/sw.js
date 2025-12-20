const CACHE_NAME = 'lerri-v1';
const urlsToCache = [
  'pwa/',
  '/pwa/index.html',
  '/pwa/app.js',
  '/pwa/app.css',
  '/pwa/schedule-manager.js',
  '/pwa/schedule-manager.css',
  '/pwa/icon/icon-192.png',
  '/pwa/icon/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('✅ Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('push', event => {
  console.log('📬 Push notification received');
  
  let data = { title: 'LerriAI', body: 'New notification', icon: '/pwa/icon/icon-192.png' };
  
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
      icon: data.icon || '/pwa/icon/icon-192.png',
      badge: data.badge || '/pwa/icon/icon-192.png',
      data: data.data || { url: '/pwa/index.html' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/pwa/index.html')
  );
});