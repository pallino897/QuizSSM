/* Service Worker condiviso — Studio Medicina (Quiz SSM + Allenamento ECG)
   Strategia: cache-first con aggiornamento in background ("stale-while-revalidate").
   Ogni file richiesto con successo viene aggiunto alla cache, quindi anche
   ecg_pack.json e le eventuali immagini vengono salvati offline dopo il primo
   caricamento, senza doverli elencare qui a mano. */

const CACHE_NAME = "studio-medicina-v08-08";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./quiz.html",
  "./ecg.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch(() => {
            /* Se un file non esiste ancora (es. icon-512.png non creata),
               non blocchiamo l'installazione del service worker. */
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
