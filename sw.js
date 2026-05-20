const CACHE = 'cassian-v9';
const ASSETS = [
  // Pages
  '/', '/index.html', '/numberblocks.html',
  '/games.html', '/chess.html', '/jokes.html', '/cosmo.html',
  '/bitcoin.html', '/books.html', '/puzzles.html', '/learning-path.html',
  '/focus.html', '/world.html', '/robotics.html',
  // App shell
  '/manifest.json', '/cassian-profile.js', '/cosmo-hints.js',
  // Icons
  '/icon-192.png', '/icon-512.png',
  // Self-hosted fonts (offline-safe, no Google Fonts)
  '/fonts/fonts.css',
  '/fonts/nunito-bold.woff2',
  '/fonts/playfair-bold.woff2',
  '/fonts/playfair-italic.woff',
  '/fonts/jakarta-sans.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // Cache each asset individually — a missing file won't crash the whole install
      Promise.allSettled(ASSETS.map(url => c.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Don't intercept AI/API calls — those need live internet anyway
  if (e.request.url.includes('anthropic') || e.request.url.includes('workers.dev')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache anything new we successfully fetch (e.g. future pages)
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached || new Response('Offline — open the app while connected first to cache this page.', { status: 503 }));
    })
  );
});
