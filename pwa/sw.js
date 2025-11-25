const CACHE_VERSION = 1;
const CACHE_NAME = `lerri-cache-v${CACHE_VERSION}`;
const urlsToCache = [
    "./index.html",
    "./app.css",
    "./app.js",
    "./manifest.json",
];

self.addEventListener("install", event => {
    console.log(`📦 Installing SW version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('💾 Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    console.log(`🔄 Activating SW version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('🗑️ Deleting old cache:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => {
            console.log('✅ SW activated');
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                
                const responseToCache = networkResponse.clone();
                
                caches.open(CACHE_NAME).then(cache => {
                    if (event.request.url.startsWith(self.location.origin)) {
                        cache.put(event.request, responseToCache);
                    }
                });
                
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    if (event.request.destination === "document") {
                        return caches.match("./index.html");
                    }
                });
            })
    );
});

self.addEventListener('push', event => {
    console.log('Push received:', event);
    
    const data = event.data ? event.data.json() : {
        title: 'Notification',
        body: 'You have a new message',
        icon: '/icon/icon-192.png'
    };
    
    const options = {
        body: data.body,
        icon: data.icon || '/icon/icon-192.png',
        badge: data.badge || '/icon/icon-192.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Close' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});