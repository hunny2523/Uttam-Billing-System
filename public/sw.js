// Minimal service worker for PWA installability only
// No caching - all requests go directly to the network

/* eslint-disable no-undef */
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

// No fetch handler - let browser handle all requests normally
// This allows the app to work but doesn't cache anything
