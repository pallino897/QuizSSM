/*
  Service Worker per Quiz Medicina.

  ── COME AGGIORNARE L'APP IN FUTURO ──
  CACHE_VERSION segue la STESSA data mostrata nel tag "v2026.07.25" in
  home (index.html, vicino al titolo "Quiz medicina"). Ogni volta che si
  aggiunge/modifica una feature, aggiorna la data in ENTRAMBI i punti
  (qui sotto e quel tag), nel formato vAAAA.MM.GG. Senza questo passaggio,
  i telefoni che hanno già installato l'app potrebbero continuare a vedere
  la versione vecchia dalla cache anche dopo aver aggiornato il repository
  GitHub.
*/
const CACHE_VERSION = 'v2026.07.30';
const CACHE_NAME = 'quiz-medicina-' + CACHE_VERSION;

const ASSET_DA_CACHARE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* ── Installazione: precarica l'app shell ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSET_DA_CACHARE))
  );
  self.skipWaiting(); // attiva subito la nuova versione, senza aspettare la chiusura di tutte le schede
});

/* ── Attivazione: elimina le cache delle versioni precedenti ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomi) =>
      Promise.all(
        nomi
          .filter((n) => n.startsWith('quiz-medicina-') && n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

/*
  ── Strategia di risposta ──
  Per la pagina HTML principale: "network first" — prova sempre a scaricare
  la versione più recente da internet; se non c'è connessione, usa la copia
  in cache (così l'app resta utilizzabile offline).
  Per tutto il resto (manifest, icone): "cache first" — più veloce, e questi
  file cambiano raramente.
*/
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then((r) => r || fetch(req))
    );
  }
});
