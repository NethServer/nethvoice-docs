---
title: App Mobile
sidebar_position: 3
---

# App Mobile NethVoice

![Nethvoiceapp](/img/nethvoiceapp/nethvoiceapp_presentazione.png)

L'**app mobile NethVoice** (NethCTI) porta le capacità enterprise VoIP sul tuo smartphone o tablet, permettendoti di effettuare e ricevere chiamate utilizzando il tuo numero aziendale da qualsiasi luogo con una connessione internet.

:::warning È richiesta una subscription Enterprise
L'app mobile è **disponibile solo con una subscription Enterprise**. Sebbene l'app stessa sia gratuita da scaricare, l'accesso al servizio di provisioning richiesto per configurarla e abilitarla sul tuo dispositivo è esclusivo per i sottoscrittori Enterprise.
Vedi la pagina [Subscription](/docs/administrator-manual#subscription) per maggiori dettagli.

Gli utenti con subscription Community non possono accedere o utilizzare questa funzionalità.
:::

## Funzionalità principali

L'app mobile NethVoice fornisce un'esperienza completa del sistema telefonico sul tuo dispositivo mobile:

- **Effettua e ricevi chiamate** — Usa il tuo interno aziendale per effettuare chiamate in uscita e ricevere chiamate in ingresso utilizzando il tuo numero aziendale
- **Integrazione rubrica** — Accedi a tutti i contatti aziendali e personali direttamente dall'app
- **Cronologia chiamate** — Visualizza i registri dettagliati delle chiamate includendo chiamate effettuate, ricevute e perse
- **Gestione della disponibilità** — Imposta il tuo stato di disponibilità (disponibile, occupato, assente) e visualizza la disponibilità dei colleghi in tempo reale
- **Gestione delle chiamate** — Trasferisci chiamate, registra conversazioni, metti in attesa le chiamate e gestisci conferenze
- **Integrazione code** — Per gli operatori del call center: accedi/esci dalle code componendo dei semplici feature codes
- **Chiamata rapida** — Visualizza i colleghi che hai inserito tra i preferiti, visualizza il loro stato e chiama rapidamente

## Piattaforme supportate

L'app mobile NethVoice è disponibile per:

- **iOS** — iPhone e iPad (ecosistema Apple)
- **Android** — Smartphone e tablet (ecosistema Google)

Entrambe le piattaforme ricevono aggiornamenti automatici con nuove funzionalità e miglioramenti.

## Installazione

### Download

Scarica l'app mobile NethVoice dall'app store del tuo dispositivo:

- **iOS**: Cerca "NethVoice" su [Apple App Store](https://apps.apple.com/it/app/nethvoice/id6476514784)
- **Android**: Cerca "NethVoice" su [Google Play](https://play.google.com/store/apps/details?id=com.nethesis.nethvoice.it.android&hl=it)

### Configurazione

![Nethvoiceapp](/img/nethvoiceapp/app_accesso.png)

La configurazione è semplice e richiede solo un codice QR:

1. Apri l'app mobile NethVoice
2. Scansiona il codice QR visualizzato nel tuo client web NethVoice (NethCTI)
   - Clicca sull'icona Impostazioni nella barra laterale sinistra
   - Accedi alla sezione App Mobile
   - Clicca sul pulsante **Genera codice QR**
3. L'app si auto-configura in pochi secondi — non è necessaria alcuna immissione manuale
4. Una volta configurata, sei pronto a effettuare e ricevere chiamate

Se in quel momento non puoi accedere al CTI per scannerizzare il codice QR, è possibile configurare l’app anche manualmente.
Basta inserire il proprio username seguito dall’FQDN di NethVoice, e poi la propria password:

| Campo    | Valore                           |
| -------- | -------------------------------- |
| Username | `username@hostnamenethvoice.com` |
| Password | `la-tua-password`                |

L’app si collegherà comunque correttamente al tuo account.

## Sistemi operativi supportati

- **iOS**: iOS 16.0 e successivi
- **Android**: Android 8.0 (livello API 26) e successivi

## Compatibilità dei dispositivi

L'app funziona su:

- Smartphone con una connessione internet attiva
- Tablet (incluso iPad e tablet Android)

## Funzionalità dell'app

### Chiamata rapida

Nella sezione Chiamata Rapida puoi aggiungere o gestire la lista dei contatti preferiti per monitorarne facilmente la disponibilità. Ogni contatto aggiunto mostra uno stato:

* 🟢 Disponibile – quando il contatto non è in chiamata
* 🔴 Sta squillando – quando il telefono del contatto sta squillando
* 🔴 In chiamata – quando il contatto è attualmente in chiamata

Per aggiungere un contatto alla lista, tocca “Modifica” e poi premi “+”. Ti verrà richiesto di inserire il Titolo (Nome e Cognome), il Numero di telefono o l’indirizzo SIP (interno) e verificare lo Stato, che monitora l’attività dell’interno. Puoi anche aggiungere una foto o importare il contatto direttamente dalla Rubrica. Una volta salvato, il contatto apparirà nell’elenco.

### Storico

Nella sezione Storico ci sono tre sottosezioni in cui è possibile visualizzare tutte le chiamate gestite, perse e ricevute.
La sottosezione “Perse” filtra le chiamate in ingresso che non sono state risposte.
La sottosezione “Registrato” elenca tutte le chiamate registrate; toccando l’icona “i”, puoi accedere alla pagina per ascoltare la registrazione. Toccando nuovamente l’icona “i” puoi eliminare la registrazione, inviarla via email, condividerla con altre app o bloccarla per impedirne la cancellazione.
Nella sottosezione “Tutti”, usando il pulsante “Modifica”, puoi eliminare tutte le chiamate o selezionare solo quelle da rimuovere. Accanto a “Modifica” è presente un pulsante che permette di esportare tutte le chiamate generando un file di testo con i relativi dati.

### Tastierino

Nella sezione “Tastierino” puoi comporre un numero per effettuare una chiamata, aggiungere un nuovo contatto o aggiungere il numero digitato a un contatto esistente nella Rubrica. In basso a destra compare il pulsante “Cancella” per eliminare l’ultima cifra o l’intero numero inserito.

### Effettuare una chiamata

Effettuare una chiamata con l’app NethVoice è molto semplice e può essere fatto dal Tastierino o dalla sezione Contatti selezionando il contatto desiderato. Dopo aver composto il numero, tocca l’icona verde del telefono per avviare la chiamata.

Durante la chiamata, lo schermo mostra i seguenti pulsanti:

* Tastierino: per digitare numeri durante la chiamata.
* Metti in attesa: mette in pausa la chiamata in modo che l’interlocutore non possa sentirti (sentirà la musica d’attesa).
* Registra: permette di registrare la chiamata in corso.
* Trasferisci: trasferisce la chiamata senza parlare con il destinatario.
* Aggiungi alla chiamata: aggiunge un altro numero interno o esterno per creare una conferenza. Durante la conferenza compare il pulsante “Split”, che consente di alternare tra le chiamate o chiuderne una delle due.
* Trasferimento assistito: trasferisce la chiamata dopo aver parlato con il destinatario per ottenere il suo consenso.

Sopra questi pulsanti è presente una barra con i seguenti controlli:

* Microfono: attiva/disattiva il microfono.
* Altoparlante: attiva la modalità vivavoce.
* Camera: passa a una videochiamata.

### Contatti

Nella sezione Contatti puoi accedere sia alla tua Rubrica personale sia alla Rubrica NethVoice.
Nella Rubrica personale puoi aggiungere o modificare i contatti, mentre nella Rubrica NethVoice puoi solo consultarli ed effettuare chiamate.
Per creare un nuovo contatto, tocca “+” e compila Nome, Cognome, Azienda, numero di telefono ed email.
Selezionando un contatto esistente puoi modificarlo, effettuare una chiamata o avviare una videochiamata. Puoi anche impostare una suoneria personalizzata per il contatto selezionato.

### Videochiamata

Per avviare una videochiamata, seleziona un utente nella sezione Contatti e tocca l’icona della videocamera. In alternativa, durante una chiamata vocale puoi passare alla videochiamata toccando l’icona della videocamera.

### Impostazioni

Dalla sezione Tastierino, tocca l’icona dell’ingranaggio in alto a destra per aprire le Impostazioni, dove puoi gestire:

* Suonerie: imposta una suoneria diversa da quella predefinita.
* Audio: gestisci impostazioni di eco, altoparlanti, amplificazione e supporto Bluetooth.
* Registrazione delle chiamate: abilita la registrazione automatica delle chiamate con opzioni per formato e impostazioni avanzate.
* Comandi: abilita il controllo dei pulsanti degli auricolari e gestisci il comportamento delle chiamate GSM.
* Non disturbare: crea regole DND per evitare di ricevere chiamate in determinati periodi.
* Ordinamento dei contatti: gestisci l’ordine di visualizzazione dei contatti nella Rubrica.
* Informazioni: informazioni sulla versione e sul dispositivo.
* Utilizzo: statistiche sulla durata delle chiamate e sul numero totale di chiamate.
* Registri: accedi ai registri diagnostici per la risoluzione dei problemi e la raccolta dei log, utili anche per richieste di supporto.
* Disconnettersi: disconnetti l’account dall’app senza rimuoverne la configurazione.
* Reimposta applicazione: reimposta completamente l’app e cancella tutti i dati associati. Per accedere nuovamente, segui le istruzioni nella sezione Access.

### Notifiche

Dopo 7 giorni di inattività nell’app NethVoice, potrebbe apparire un popup che informa che la sessione sta per scadere. Per continuare a ricevere chiamate, devi toccare la notifica o aprire l’app NethVoice.

## Qualità e prestazioni

L'app mobile NethVoice è ottimizzata per:

- **Qualità audio HD** — Riproduzione vocale chiara e naturale con gestione ottimizzata dei codec
- **Latenza ridotta** — Minimo ritardo di chiamata anche su connessioni internet standard
- **Utilizzo dati efficiente** — Ottimizzato per piani dati mobile e WiFi

## Integrazione con piattaforme mobile

### Supporto CarPlay e Android Auto

Mentre sei sulla strada, usa il tuo telefono in sicurezza:

- **Apple CarPlay** — Effettua e ricevi chiamate, usa i comandi vocali di Siri, accedi ai contatti e alla cronologia delle chiamate
- **Android Auto** — Effettua e ricevi chiamate, usa i comandi vocali di Google Assistant

### Notifiche del sistema operativo

Ricevi notifiche di sistema native per:

- Chiamate in ingresso
- Chiamate perse
- Messaggi e avvisi

L'app mobile al momento non espone una interfaccia dedicata per il riassunto chiamata o la trascrizione post-chiamata.
Se trascrizione chiamate e riassunto chiamate sono abilitati dall'amministratore, l'audio delle chiamate supportate può comunque essere elaborato dalla piattaforma e il contenuto risultante può essere consultato successivamente da NethVoice CTI.

## Dispositivi correlati

L'app mobile NethVoice è uno dei vari modi per utilizzare il tuo telefono aziendale. Gli altri tipi di dispositivo disponibili includono:

- **Web Phone** — Soft phone basato su browser in NethVoice CTI
- **NethLink** — Applicazione desktop (Windows/macOS) per la gestione nativa delle chiamate
- **Telefono fisso da scrivania** — Telefono hardware con supporto per il provisioning
- **Phone Link** — Integrazione leggera del telefono desktop

Puoi associare contemporaneamente più tipi di dispositivo al tuo account, permettendo alle chiamate di suonare su tutti i tuoi dispositivi (smartphone, tablet, desktop, web e telefono fisso).

## Supporto e risoluzione dei problemi

Se riscontri problemi con l'app mobile:

- **Aggiorna alla versione più recente** — Controlla l'app store per gli aggiornamenti
- **Verifica la tua connessione internet** — Assicurati di avere una connessione WiFi o dati mobile stabile
- **Controlla la configurazione del codice QR** — Scansiona di nuovo il codice QR per aggiornare la tua configurazione
- **Contatta il tuo amministratore** — Per problemi relativi al provisioning o all'account

Per ulteriore aiuto, contatta il tuo amministratore NethVoice o rivolgiti al tuo provider di servizi.
