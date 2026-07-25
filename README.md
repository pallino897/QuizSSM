# 🩺 Quiz Medicina App

Una web-app leggera e performante, progettata per massimizzare la produttività durante la preparazione ai concorsi di specializzazione medica (SSM) e all'esame di abilitazione.

Gira interamente nel browser: nessun server, nessun backend, nessun account. Tutti i dati (domande, immagini, progressi, statistiche) restano sul tuo dispositivo, salvati localmente tramite IndexedDB e localStorage.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Made with AI](https://img.shields.io/badge/Made%20with-AI-purple.svg)]()

---

## 📑 Indice

- [Caratteristiche principali](#-caratteristiche-principali)
- [Guida rapida](#-guida-rapida)
- [Struttura del CSV](#-struttura-del-csv)
- [Modalità di studio](#-modalità-di-studio)
- [Immagini nelle domande](#-immagini-nelle-domande)
- [Spiegazioni assistite da AI](#-spiegazioni-assistite-da-ai)
- [Condivisione e continuità tra dispositivi](#-condivisione-e-continuità-tra-dispositivi)
- [Controlli e accessibilità](#-controlli-e-accessibilità)
- [Modalità orizzontale (landscape)](#-modalità-orizzontale-landscape)
- [Script Python inclusi](#-script-python-inclusi)
- [Privacy e archiviazione dati](#-privacy-e-archiviazione-dati)
- [Copyright e responsabilità sui contenuti](#-copyright-e-responsabilità-sui-contenuti)
- [Sviluppo](#-sviluppo)
- [Contribuire](#-contribuire)
- [Licenza](#-licenza)

---

## 🚀 Caratteristiche principali

### Simulazioni d'esame
- **Simulazione classica**: 140 domande, timer da 210 minuti, navigazione libera tra le domande tramite griglia numerata, punteggio calcolato con i criteri ministeriali (+1 corretta, −0.25 sbagliata, 0 non data).
- **Simulazione proporzionale**: le domande vengono ripartite automaticamente tra le 27 categorie ministeriali secondo le percentuali ufficiali del concorso.
- **Simulazione personalizzata**: assegna un peso a ciascuna specialità e l'app calcola in automatico quante domande estrarre da ognuna, rispettando il totale.
- **Pausa**: sospende il timer e nasconde le domande, per evitare sbirciatine durante un'interruzione reale.

### Modalità ripasso
- **Tutte le specialità** o **specialità singola**, con numero di domande configurabile (10 / 20 / 40 / tutte / personalizzato).
- **Ripassa le sbagliate** e **ripassa i segnalibri**: pool dedicati costruiti dallo storico delle tue risposte.
- **Selezione intelligente**: le domande mai viste o sbagliate hanno priorità maggiore rispetto a quelle già risposte correttamente, per ottimizzare il tempo di studio.
- **Casi clinici multi-domanda**: quando più domande condividono lo stesso caso clinico, l'app le mantiene consecutive nella sessione invece di disperderle casualmente.
- **Modalità countdown**: timer di 90 secondi per domanda anche fuori dalla simulazione, con pausa dedicata.

### Annales (esami degli anni precedenti)
- Sezione dedicata alle domande storiche SSM (dal 2014 in poi, incluse le annate più recenti), navigabili singolarmente o tutte insieme.
- **Modalità Esame per gli Annales**: applica le stesse regole della simulazione ufficiale (140 domande, timer, punteggio) direttamente su un'annata storica.

### Interfaccia
- Design responsive mobile-first, con **layout dedicato per l'orientamento orizzontale** durante quiz e correzione.
- **Dark/Light mode**: segue automaticamente il sistema, con toggle manuale che sovrascrive la preferenza e la ricorda.
- **Schermo intero** con un tap, per sfruttare tutto lo spazio disponibile durante lo studio.
- Scorciatoie da tastiera (tasti **1-5** per le risposte A-E, **0** per saltare/avanzare).
- Supporto **controller Bluetooth / Joy-Con** (vedi [Controlli e accessibilità](#-controlli-e-accessibilità)).

### Strumenti di analisi
- Statistiche dettagliate per specialità, con percentuale di risposte corrette e domande affrontate.
- **Storico simulazioni** con grafico dell'andamento del punteggio nel tempo.
- **Ricerca libera** nel testo di tutte le domande e risposte, con evidenziazione dei risultati.
- **Recap post-quiz** filtrabile (tutte / sbagliate / saltate / corrette / con segnalibro), con possibilità di aggiungere/rimuovere segnalibri direttamente dal recap.
- In landscape, una **griglia colorata** (verde/rosso/giallo) mostra a colpo d'occhio l'esito di ogni domanda della sessione appena conclusa.

---

## 📋 Guida rapida

L'applicazione **non include database di domande precaricati**: devi fornire il tuo file CSV.

1. **Prepara il file** `.csv` (separatore `;`) seguendo la struttura descritta più sotto.
2. **Apri l'app** nel browser (funziona anche offline dopo il primo caricamento).
3. Clicca **"📂 Importa CSV"** in home e seleziona il file: verrà salvato permanentemente nel dispositivo (non serve ricaricarlo ad ogni apertura).
4. *(Opzionale)* Se le tue domande includono immagini, clicca **"🖼 Importa immagini (ZIP)"** e carica un archivio con tutti i file — vedi la sezione dedicata.
5. **Inizia a studiare**: scegli una modalità dalla home e vai.

---

## 📄 Struttura del CSV

Il parser legge le colonne **per nome**, non per posizione: l'ordine delle colonne nel file non è vincolante, purché i nomi corrispondano (case-insensitive per la colonna immagine).

| Colonna | Obbligatoria | Descrizione |
|---|---|---|
| `id` | Consigliata | Identificativo univoco della domanda. Se mancante o duplicato, l'app ne genera uno stabile automaticamente (basato su specialità + numero domanda), così segnalibri e progressi restano coerenti tra le sessioni. |
| `specialita` | Sì | Nome della specialità/categoria. Usato per le statistiche, la selezione per materia e il riconoscimento delle annate Annales (es. `SSM 2024`). |
| `numero_domanda` | Sì | Numero progressivo della domanda all'interno della sua specialità/annata. |
| `domanda` | Sì | Testo della domanda. Supporta il tag `[CASO CLINICO: ...]` per formattare automaticamente il testo del caso clinico in corsivo, separato dalla domanda vera e propria. |
| `A`, `B`, `C`, `D`, `E` | Sì (almeno A-D) | Testo delle opzioni di risposta. |
| `risposta_corretta` | Sì | Lettera della risposta corretta (`A`-`E`). |
| `immagini` *(o* `immagine`*)* | No | Nome file di una o più immagini associate alla domanda, separati da virgola per immagini multiple (es. `ecg_01.png,ecg_01b.png`). Entrambi i nomi di colonna sono riconosciuti automaticamente. |
| `spiegazione` | No | Spiegazione testuale della risposta, mostrata nell'app se presente. Può essere popolata manualmente o tramite il flusso AI descritto sotto. |

Il parser gestisce correttamente CSV con virgolette, punti e virgola dentro i campi di testo e virgolette doppie escapate (`""`), quindi è sicuro incollare testo libero (comprese domande che contengono `;` nel testo) senza preoccuparsi di rompere la struttura del file.

**Esempio minimo:**
```csv
id;specialita;numero_domanda;domanda;A;B;C;D;E;risposta_corretta
1;Cardiologia;1;Qual è il farmaco di prima scelta nello STEMI?;Aspirina;Warfarin;Digossina;Furosemide;Metoprololo;A
```

---

## 🎯 Modalità di studio

| Modalità | Timer | Navigazione | Punteggio | Uso consigliato |
|---|---|---|---|---|
| Quiz libero | No (o countdown 90s/domanda opzionale) | Sequenziale | Solo statistiche | Ripasso quotidiano |
| Ripassa sbagliate/segnalibri | Come sopra | Sequenziale | Solo statistiche | Consolidamento mirato |
| Simulazione (classica/proporzionale/personalizzata) | 210 minuti | Libera (griglia) | Ministeriale (+1/−0.25/0) | Allenamento in condizioni d'esame |
| Annales (modalità esame) | 210 minuti | Libera (griglia) | Ministeriale | Simulare un anno storico come se fosse l'esame vero |

Le sessioni interrotte (per chiusura accidentale del browser o cambio pagina) vengono **salvate automaticamente** e l'app propone di riprenderle al successivo avvio.

---

## 🖼 Immagini nelle domande

1. Prepara un archivio **ZIP** con tutte le immagini referenziate nella colonna `immagini`/`immagine` del CSV (i nomi file devono corrispondere esattamente).
2. Importalo dalla home con **"🖼 Importa immagini (ZIP)"**: vengono salvate in IndexedDB e restano disponibili permanentemente, senza bisogno di ricaricarle.
3. Le immagini vengono caricate **on demand** (solo quando la domanda che le usa viene mostrata), per non appesantire l'avvio dell'app anche con centinaia di file.
4. Tap sull'immagine durante il quiz per aprirla a schermo intero (utile per dettagli su ECG, radiografie, istologia).

---

## 🤖 Spiegazioni assistite da AI

L'app supporta un flusso per arricchire il database con spiegazioni generate da un'intelligenza artificiale, senza richiedere alcuna integrazione diretta o chiave API nell'app stessa:

1. Al termine di un quiz o di una simulazione, usa **"📤 Esporta sbagliate/saltate di questa sessione"** per scaricare un CSV con tutte le domande da approfondire (con tutte le colonne originali, comprese eventuali immagini).
2. Carica il file su un'AI a tua scelta (es. Claude, ChatGPT) chiedendo di generare, per ogni domanda, una spiegazione con formato di output `id;spiegazione`.
3. Usa lo script incluso **`unisci_spiegazioni.py`** per integrare automaticamente le spiegazioni ottenute nel CSV principale, senza sovrascrivere le altre colonne.
4. Ricarica il CSV aggiornato nell'app: le spiegazioni saranno disponibili nelle domande corrispondenti.

---

## 🔗 Condivisione e continuità tra dispositivi

Durante un quiz o una simulazione attiva, l'icona **📤** nell'header permette di esportare lo stato esatto della sessione (domande selezionate, risposte già date, tempo residuo) come:

- **Codice testuale**, copiabile negli appunti e condivisibile via chat/email (es. WhatsApp) o incollabile in un file di testo,
- oppure come **file scaricabile**.

Il codice può essere importato — dalla home, con **"📥 Importa sessione condivisa"** — su qualsiasi altro dispositivo che abbia caricato lo stesso CSV, per:
- **continuare tu stesso** una sessione iniziata su un altro dispositivo,
- **condividere lo stesso identico set di domande** con un'altra persona, così può allenarsi sugli stessi esercizi.

Se il dispositivo che importa ha un CSV leggermente diverso, l'app segnala eventuali domande non trovate e permette comunque di proseguire con quelle disponibili.

---

## 🎮 Controlli e accessibilità

Oltre al tocco touch, l'app supporta:

**Tastiera**
| Tasto | Azione |
|---|---|
| `1`–`5` | Seleziona risposta A–E |
| `0` | Salta domanda / Avanza |

**Controller Bluetooth (Joy-Con e gamepad standard)**
| Pulsante | Azione |
|---|---|
| A / B / X / Y | Risposte A–D |
| L3 / R3 (pressione stick) | Risposta E |
| R / ZR | Prossima domanda |
| L / ZL | Salta domanda |
| + | Pausa |
| − | Segnalibro |

Il collegamento/scollegamento di un controller mostra una notifica visiva a schermo.

---

## 📱 Modalità orizzontale (landscape)

Ruotando il dispositivo durante un quiz o una simulazione (schermi sufficientemente larghi), il layout si riorganizza automaticamente su due colonne:

- **Durante il quiz**: la griglia di navigazione della simulazione si sposta in una colonna fissa a destra, sempre visibile mentre scorri le domande.
- **Nella schermata dei risultati**: punteggio, statistiche e pulsanti si spostano in una colonna laterale insieme a una griglia colorata (verde = corretta, rosso = sbagliata, giallo = non data) cliccabile per saltare direttamente al dettaglio di ogni domanda nel recap.

In verticale l'interfaccia torna al layout a colonna singola ottimizzato per mobile.

---

## 🛠 Script Python inclusi

Il repository include due script di supporto, pensati per essere eseguiti localmente (non richiesti per usare l'app, ma utili per prepararne i contenuti):

- **`estrai_domande.py`** — estrae automaticamente domande, opzioni e risposta corretta da PDF ministeriali, elabora un'intera cartella di file e produce un unico CSV compatibile con l'app.
- **`unisci_spiegazioni.py`** — integra le spiegazioni generate da un'AI (formato `id;spiegazione`) nel CSV principale, rilevando automaticamente il delimitatore e segnalando eventuali id non corrispondenti.

Entrambi richiedono solo Python 3 standard (più `pypdf` per il primo).

---

## 🔒 Privacy e archiviazione dati

- Nessun dato lascia mai il tuo dispositivo: non c'è alcun backend, chiamata di rete verso server propri, o account.
- Domande, immagini, statistiche, segnalibri e storico sono salvati localmente tramite **IndexedDB** e **localStorage** del browser.
- L'unica eccezione è il caricamento delle librerie esterne (JSZip per l'import ZIP delle immagini) da CDN pubblico, effettuato **solo al momento dell'uso effettivo** di quella funzione — l'app resta pienamente utilizzabile offline per tutto il resto.
- Cancellare i dati del browser per questo sito rimuove definitivamente tutti i progressi salvati: usa le funzioni di esportazione se vuoi conservarli altrove.

---

## ⚖️ Copyright e responsabilità sui contenuti

> Questo repository contiene esclusivamente il **codice sorgente** dell'applicazione. Non vengono distribuiti database di domande. È responsabilità dell'utente assicurarsi di utilizzare esclusivamente contenuti per i quali possiede i diritti, che siano di pubblico dominio, o che rientrino in un uso lecito secondo la normativa applicabile.

---

## 🧑‍💻 Sviluppo

Il codice di questa applicazione è stato interamente generato e ottimizzato con il supporto dell'**Intelligenza Artificiale**, puntando a massimizzare l'efficienza, la manutenibilità e la pulizia del codice. È una singola pagina HTML autosufficiente (HTML/CSS/JS vanilla, nessuna build necessaria), pensata per essere scaricata e aperta direttamente in qualunque browser moderno.

---

## 🤝 Contribuire

Se hai suggerimenti, miglioramenti o hai trovato un problema, apri pure una issue o una pull request. Alcune idee di sviluppo futuro, se ti va di contribuire:

- Modalità di ripetizione dilazionata (spaced repetition) per il ripasso delle domande sbagliate
- Statistiche raggruppate per categoria ministeriale (oltre che per specialità)
- Generazione di un QR code per la condivisione rapida delle sessioni tra dispositivi

---

## 📜 Licenza

Distribuito con licenza [MIT](https://opensource.org/licenses/MIT).
ei bug, sentiti libero di aprire una **Issue** o inviare una **Pull Request**.
