// Minimal service worker for PWA install only - no caching
// This service worker is required for PWA installation but doesn't cache anything

// Install event - just skip waiting
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed (no caching)');
    self.skipWaiting();
});

// Activate event - clean up any old caches and claim clients
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Delete all existing caches
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Service Worker: Clearing cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - always go to network, no caching
self.addEventListener('fetch', (event) => {
    // Just pass through to network, no caching
    event.respondWith(fetch(event.request));
});
