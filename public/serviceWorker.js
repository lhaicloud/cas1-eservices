var staticCacheName = "pwa-v" + new Date().getTime();

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName.startsWith("pwa-"))
                    .filter(cacheName => cacheName !== staticCacheName)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    // Network-first for HTML navigation — always get fresh index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    const clone = networkResponse.clone();
                    caches.open(staticCacheName).then(cache => cache.put(event.request, clone));
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Never cache API responses — they may contain session-scoped data
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Cache-first for static assets (JS, CSS, images) — safe because Vite hashes filenames
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(staticCacheName).then(cache => cache.put(event.request, clone));
                }
                return networkResponse;
            });
        }).catch(() => null)
    );
});

self.addEventListener("push", (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error("Push data is not JSON", e);
    }

    const title = data.title || "New Message";
    const options = {
        body: data.body || "You have a new notification",
        icon: "/images/icons/icon-192x192.png",
        badge: "/images/icons/icon-72x72.png",
        data: { url: data.url || "/" },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = event.notification.data.url || '/';
    const safeUrl = target.startsWith(self.location.origin) || target.startsWith('/') ? target : '/';
    event.waitUntil(
        clients.openWindow(safeUrl)
    );
});
