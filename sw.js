/* Adam's Cork Frame — service worker.
   Keeps the frame shell (page, cork texture, fonts) available offline so the
   frame survives Wi-Fi outages. Photos are cached separately in IndexedDB by
   the app itself; Drive/weather API calls always go straight to the network. */
const CACHE = 'cork-frame-shell-v1';
const PRECACHE = [
  './',
  './index.html',
  './assets/corkboard-texture.jpg',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network first: always serve the freshest page when online, fall back to the
   cached copy when offline. Used for HTML so pushed updates land immediately. */
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (e) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    throw e;
  }
}

/* Stale while revalidate: serve from cache instantly, refresh in the
   background. Used for fonts and static assets. */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  if (hit) return hit;
  const fresh = await refresh;
  return fresh || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFontHost = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  // Photos, Drive API, weather, map tiles: always straight to the network
  if (!sameOrigin && !isFontHost) return;

  if (isFontHost) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
