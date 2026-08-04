# Studio Medicina — Quiz SSM + Allenamento ECG

App unica (PWA) che raggruppa due strumenti di studio, con una schermata
iniziale per scegliere tra i due:

```
/
├── index.html        ← nuova schermata di lancio (menu principale)
├── quiz.html          ← il tuo vecchio index.html (Quiz SSM), rinominato
├── ecg.html            ← il tuo ecg_trainer_3_.html (Allenamento ECG), rinominato
├── manifest.json      ← manifest PWA condiviso (con scorciatoie per le 2 app)
├── sw.js               ← service worker condiviso (cache offline per entrambe)
├── icon-192.png        ← DA COPIARE dal tuo repo esistente
├── icon-512.png        ← consigliata, se non l'hai ancora crea una versione 512×512
├── ecg_pack.json       ← DA COPIARE (generato con export_ecg_pack.py)
└── export_ecg_pack.py  ← script di preprocessing, opzionale nel repo ma utile da tenere
```

## Cosa ho cambiato rispetto ai tuoi file originali

- **Nessuna riga di logica JS toccata** in `quiz.html` o `ecg.html`: le due
  app restano completamente indipendenti (variabili, funzioni e stato
  interno non si toccano). Ho verificato che condividono un solo nome di
  funzione (`iniziaSessione`), ma vivendo in due file separati non c'è
  alcun conflitto.
- Ho aggiunto un piccolo bottone **🏠** nell'header di entrambe le app che
  riporta a `index.html` (il menu principale), senza interferire con i
  pulsanti "Esci"/fullscreen/tema già presenti.
- Ho aggiunto a `ecg.html` il link al `manifest.json` e la registrazione
  del service worker, così l'app funziona in modo installabile/offline
  anche se qualcuno la apre direttamente (bookmark, scorciatoia, ecc.),
  non solo passando dal menu.
- Ho creato un **manifest.json** e un **sw.js** nuovi, pensati per servire
  entrambe le app dalla stessa origine/scope. Se avevi già un
  `manifest.json`/`sw.js` funzionanti, confrontali con questi: puoi
  tenere i tuoi se preferisci, basta che restino compatibili con i nuovi
  nomi di file (`quiz.html`, `ecg.html`).

## Perché file separati e non un'unica pagina "fusa"

Le due app sono entrambe SPA monofile molto grandi (quiz ~4000 righe,
ECG ~2400 righe) con variabili globali proprie (`DB`, `S`, `sessione`,
funzioni `mostraSchermata`, `showScreen`, ecc.). Fonderle in un solo
documento HTML rischierebbe collisioni di nomi difficili da individuare
e da mantenere nel tempo. La struttura a più pagine, con un
`manifest.json`/`sw.js` condivisi, dà lo stesso risultato per l'utente
(un'unica app installabile, funzionante offline, con un menu iniziale)
senza questo rischio, ed è il pattern standard per le PWA "multi-app".

## Prima di pubblicare

1. Copia nel repo `icon-192.png` (e idealmente crea anche `icon-512.png`)
   dal tuo repo attuale.
2. Copia `ecg_pack.json` (generato con `export_ecg_pack.py`) nella root,
   altrimenti `ecg.html` mostrerà il selettore file manuale come già
   previsto.
3. Verifica che `manifest.json`/`sw.js` non abbiano lo stesso nome ma
   contenuto diverso da versioni che avevi già — se avevi un vecchio
   `sw.js` con una `CACHE_NAME` diversa, i client con la PWA già
   installata scaricheranno la nuova versione automaticamente al primo
   avvio online (il service worker nuovo elimina le cache vecchie
   nell'evento `activate`).

## Pubblicare su GitHub Pages

```bash
git init
git add .
git commit -m "Unifica Quiz SSM e Allenamento ECG in un'unica PWA"
git branch -M main
git remote add origin https://github.com/<tuo-utente>/<tuo-repo>.git
git push -u origin main
```

Poi, su GitHub: **Settings → Pages → Source: Deploy from a branch →
main / (root)**. L'app sarà su
`https://<tuo-utente>.github.io/<tuo-repo>/`.

Se il repo esiste già (quello dove avevi solo `index.html`), basta
sostituire i file con questi, con `git add -A && git commit && git push`.
