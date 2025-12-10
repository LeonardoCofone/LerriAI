const CACHE_NAME = 'lerri-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/app.css',
    '/schedule-manager.js',
    '/schedule-manager.css',
    '/icon/icon-192.png',
    '/icon/icon-512.png',
    'https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    let notificationData = {
        title: 'LerriAI',
        body: 'You have a new update',
        icon: '/icon/icon-192.png',
        badge: '/icon/icon-192.png',
        data: {
            url: '/'
        }
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData = {
                title: payload.title || notificationData.title,
                body: payload.body || notificationData.body,
                icon: payload.icon || notificationData.icon,
                badge: payload.badge || notificationData.badge,
                data: payload.data || notificationData.data
            };
        } catch (error) {
            console.error('[SW] Error parsing push data:', error);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            data: notificationData.data,
            vibrate: [200, 100, 200],
            tag: 'lerri-notification',
            requireInteraction: false
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (let client of clientList) {
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