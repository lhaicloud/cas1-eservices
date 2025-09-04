var staticCacheName = "pwa-v" + new Date().getTime();
var filesToCache = [
    '/offline',
    '/css/app.css',
    '/js/app.js',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});

// self.addEventListener("message", (event) => {
//     if (event.data && event.data.type === "SHOW_SUCCESS") {
//         self.registration.showNotification("✅ Subscribed!", {
//         body: "You will now receive notifications.",
//         icon: "/images/icons/icon-192x192.png",
//         badge: "/images/icons/icon-72x72.png",
//         data: { url: "/" }, // link when clicked
//         });
//     }
// });

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
    
    console.log("New push received: ", data)
  } catch (e) {
    console.error("❌ Push data is not JSON", e);
  }

  const title = data.title || "📩 New Message";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/images/icons/icon-192x192.png",
    badge: "/images/icons/icon-72x72.png",
    data: { url: data.url || "/" }, // open link when clicked
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "/")
  );
});