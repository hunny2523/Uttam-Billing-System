// Minimal service worker for PWA installability only
// No caching - all requests go directly to the network

self.addEventListener('install', (event) => {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Clear all caches if any exist
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    // Claim clients to take control immediately
    self.clients.claim();
});

// Fetch event - always use network, no caching
self.addEventListener('fetch', (event) => {
    // Pass through all requests to the network
    // No caching logic - just fetch from network
    event.respondWith(fetch(event.request));
});
