// Keeps the launcher page itself available offline (the app needs the internet anyway).
const CACHE = "foul-oracle-launcher-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
               "icons/apple-touch-icon.png", "icons/favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (new URL(e.request.url).origin !== location.origin) return;     // the app itself is never cached
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
                .catch(() => caches.match(e.request)));
});
