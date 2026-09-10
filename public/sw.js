// Service Worker for PromtPicGallery PWA
//
// Strategy:
//  - Development (localhost): the service worker only cleans up after itself.
//    The Next.js dev server already handles hot reloading, and a stale SW here
//    serves outdated HTML/JS bundles which breaks the app after code changes.
//  - Production: offline support.
//     * Navigations (pages): network-first — always serve fresh HTML, fall back
//       to the cached copy only when offline.
//     * Static assets (/ _next/static/...): cache-first — these URLs are
//       content-hashed, so a cached entry is always the version the page asked
//       for; revalidated in the background.
//     * API calls: never intercepted.

const IS_DEV = ["localhost", "127.0.0.1"].includes(self.location.hostname);

const CACHE_NAME = "promtpicgallery-v2";
const STATIC_CACHE = "promtpic-static-v2";
const DYNAMIC_CACHE = "promtpic-dynamic-v2";

// Non-navigation assets to pre-cache on install
const PRECACHE_ASSETS = ["/manifest.json", "/favicon.ico"];

if (IS_DEV) {
  // Development: unregister and clear every cache so the app always runs
  // against fresh code from the dev server.
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      Promise.all([
        self.registration.unregister(),
        caches
          .keys()
          .then((cacheNames) =>
            Promise.all(cacheNames.map((name) => caches.delete(name)))
          ),
      ])
    );
    self.clients.claim();
  });
} else {
  // Install event — pre-cache critical assets
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
    );
    self.skipWaiting();
  });

  // Activate event — clean up old caches
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name))
        );
      })
    );
    self.clients.claim();
  });

  // Fetch event — network-first for pages, cache-first for static assets
  self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin GET requests
    if (request.method !== "GET") return;
    if (url.origin !== self.location.origin) return;

    // Never intercept API calls — always go to the network
    if (url.pathname.startsWith("/api/")) return;

    // Navigation requests: network-first
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() =>
            caches.match(request).then((cached) => cached || caches.match("/"))
          )
      );
      return;
    }

    // Static assets: cache-first with background revalidation
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Revalidate in the background without blocking the response
        event.waitUntil(
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                const clone = networkResponse.clone();
                return caches
                  .open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, clone));
              }
            })
            .catch(() => {
              // Network failed — cached copy is fine
            })
        );

        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        });
      })
    );
  });
}