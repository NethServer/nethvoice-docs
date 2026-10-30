---
title: Chat
sidebar_position: 10
---

# Chat

NethVoice include una chat per i suoi utenti: conversazioni uno a uno, gruppi, allegati e messaggi vocali, disponibili in [NethVoice CTI](../../user-manual/nethcti/chat.md), in [NethLink](../../user-manual/nethlink/usage.md#chat) e nell'[app mobile NethVoice](../../user-manual/mobile_app.md#messages).
Gli utenti possono anche scrivere a **persone esterne al centralino** (clienti, fornitori, partner) tramite un link d'invito che apre una pagina di chat nel browser, senza installare nulla.

Questa pagina spiega come abilitare la chat e come funzionano le sue opzioni. Per l'uso quotidiano della chat consulta il [Manuale utente](../../user-manual/nethcti/chat.md).

## Come funziona {#how-it-works}

La chat è parte del modulo NethVoice, gira sullo stesso nodo e i suoi dati non lasciano mai il server:

- ogni utente accede alla chat con le proprie credenziali di NethVoice CTI: non ci sono account separati da gestire;
- messaggi, gruppi e allegati sono salvati dal modulo NethVoice e fanno parte del suo backup;
- i client raggiungono la chat in HTTPS sull'**host di NethVoice CTI**, quindi non serve aprire porte aggiuntive sul firewall;
- le persone esterne aprono una pagina sullo stesso host, sotto `/chat-gw/g/`.

## Abilitare la chat {#enable-chat}

Dopo l'installazione o l'aggiornamento di NethVoice la chat è disabilitata. Per abilitarla:

1. Apri il modulo NethVoice dalla pagina di amministrazione del cluster NethServer 8.
2. Vai alla pagina **Integrazioni**.
3. Nella sezione **Chat**, attiva **Abilita la chat**.
4. Controlla le opzioni descritte sotto e premi **Salva**.

| Opzione | Predefinito | Valori ammessi | Descrizione |
|---|---|---|---|
| **Conserva messaggi e allegati della chat per (giorni)** | `365` | 1 – 3650 | Messaggi e allegati più vecchi vengono cancellati ogni giorno. |
| **Spazio allegati per utente (MB)** | `200` | 10 – 100000 | Spazio per i file inviati da un utente. Se un utente lo supera, i suoi allegati più vecchi vengono cancellati. |
| **Dimensione massima di un allegato (MB)** | `25` | 1 – 1024 | Limite di dimensione di un singolo file. Non può superare lo spazio allegati per utente. |

Dopo il salvataggio, in NethVoice CTI compare la voce **Messaggi**, in NethLink compare la chat e l'app mobile riceve la configurazione dei messaggi al login successivo.

### Disabilitare la chat {#disable-chat}

Disattiva **Abilita la chat** e premi **Salva**: i servizi della chat si fermano e NethVoice CTI, NethLink e l'app mobile nascondono la chat. La cronologia viene conservata: quando la chat viene riabilitata, conversazioni, gruppi e allegati sono ancora presenti.

## Permesso utente {#user-permission}

La chat è disponibile per gli utenti il cui profilo ha il permesso **Chat**. Il permesso si imposta nel wizard, in [**Profili**](./wizard.md), tra i permessi di NethVoice CTI.

Un utente senza il permesso:

- non vede la chat in NethVoice CTI, NethLink e nell'app mobile;
- non può accedere alla chat;
- non può creare chat con persone esterne.

## Client {#clients}

- **NethVoice CTI**: la pagina **Messaggi** elenca tutte le conversazioni; le chat si aprono in una finestra sopra la pagina, che si può anche fissare a lato dello schermo.
- **NethLink**: la sezione **Chat** del client desktop, con le stesse conversazioni; quando NethLink è in esecuzione, la chat si apre in NethLink invece che nel browser.
- **App mobile NethVoice**: la sezione **Messaggi**. L'app riceve la configurazione in automatico quando l'utente accede con il codice QR o con nome utente e password (con l'autenticazione a due fattori attiva è disponibile solo l'accesso con codice QR). I nuovi messaggi arrivano come notifiche push.

Gli utenti vedono le stesse conversazioni, con lo stesso stato di lettura, su tutti i client.

## Gruppi {#groups}

Esistono tre tipi di chat di gruppo:

- **Gruppi creati dagli utenti**: ogni utente può creare un gruppo da NethVoice CTI o NethLink, dargli un nome e un'immagine e aggiungere colleghi. Chi lo crea ne è il proprietario e può rinominarlo, cambiarne l'immagine, aggiungere e rimuovere membri ed eliminarlo. Se il proprietario esce, la proprietà passa a un altro membro.
- **Gruppi di NethVoice CTI**: ogni gruppo di operatori configurato nel wizard diventa una chat di gruppo per i suoi membri, con lo stesso nome. Quando nel wizard si aggiungono o rimuovono membri dal gruppo, la chat si aggiorna entro un paio di minuti.
- **Code**: ogni coda diventa una chat di gruppo chiamata `Queue - <nome>` per i suoi agenti.

I gruppi di NethVoice CTI e le code sono gestiti dal centralino: gli utenti non possono uscirne né eliminarli dalla chat.

## Chat con persone esterne {#external-people}

Gli utenti possono invitare in una chat persone senza un account NethVoice. Queste ricevono un link, lo aprono nel browser, scrivono il proprio nome ed entrano: non c'è nulla da installare e nessun account da creare.

### Chi può invitare {#external-who}

- Ogni utente con il permesso **Chat** può creare una chat con persone esterne.
- Solo i gruppi **creati dagli utenti** si possono condividere con persone esterne. I gruppi di NethVoice CTI e le code no.
- Solo il proprietario di una chat ne gestisce il link e le persone esterne: gli altri membri possono leggere e scrivere e vedono chi è entrato.

### Come iniziare {#external-start}

Dalla finestra **Nuova chat**, gli utenti possono selezionare **Persone esterne** come se fosse un collega:

- **Solo Persone esterne**: una chat tra l'utente e le persone esterne, con un nome scelto dall'utente.
- **Persone esterne e uno o più colleghi**: un gruppo con quei colleghi, condiviso con le persone esterne appena creato.

Un gruppo esistente si può condividere anche in seguito dalle sue impostazioni, con **Condividi con persone esterne**.

In ogni caso l'utente ottiene un link d'invito da inviare per email, messaggio o qualsiasi altro canale.

### Il link d'invito {#external-link}

- Il link vale **30 giorni**. Chi lo apre dopo non può entrare; chi è già entrato resta.
- Il link viene mostrato una sola volta, quando viene creato. **Nuovo link** ne crea uno nuovo e quello precedente smette di funzionare.
- **Rendi privato** disattiva il link: non entra più nessuno, chi è già entrato resta. Quando nel gruppo non resta nessuna persona esterna, torna un gruppo normale e si può condividere di nuovo.
- Il proprietario può rimuovere in qualsiasi momento una persona esterna dalla chat: la sua pagina smette subito di funzionare.

### Le persone esterne nella chat {#external-guests}

- In una stessa chat possono esserci fino a **10 persone esterne** contemporaneamente.
- Ognuna sceglie il proprio nome entrando. Un nome già usato da un'altra persona nella chat, o uguale al nome o al nome utente di un utente NethVoice, viene rifiutato.
- Le persone esterne sono contrassegnate come **Esterno** sui loro messaggi e nell'elenco dei membri, così non si possono scambiare per colleghi.
- Vedono tutta la cronologia della chat, compresi i messaggi scritti prima del loro ingresso.
- Possono scrivere, rispondere, reagire con le emoji, inviare file e immagini, registrare messaggi vocali, cercare nella chat ed eliminare i propri messaggi.
- La loro pagina mostra i nomi dei membri, segue il tema chiaro o scuro del browser e può mostrare notifiche del browser mentre è aperta.

### Sicurezza {#external-security}

La pagina per le persone esterne è pensata per essere esposta su Internet:

- il link è un token casuale lungo: sul server ne viene salvata solo l'impronta;
- ogni persona esterna ha un accesso proprio, valido solo per quella chat;
- eseguibili e tipi di file sconosciuti inviati da persone esterne vengono rifiutati, e i file vengono serviti in modo che il browser non li esegua mai;
- ingressi, messaggi e caricamenti sono limitati nel numero, per indirizzo e per persona, per proteggere il server da abusi;
- le persone esterne non possono vedere altre chat, l'elenco degli utenti NethVoice né la loro presenza.

:::warning Cronologia visibile
Le persone esterne leggono tutta la cronologia della chat in cui entrano. Prima di condividere un gruppo esistente, assicurati che la sua cronologia possa essere letta da persone esterne all'azienda.
:::

## Utenti rimossi da NethVoice {#removed-users}

Quando un utente viene rimosso da NethVoice, dopo un periodo di tolleranza di 24 ore le sue conversazioni mostrano **Non più attivo** e non possono più ricevere messaggi; la cronologia resta leggibile dagli altri membri. Se l'utente era proprietario di un gruppo, la proprietà passa a un altro membro.

## Backup e ripristino {#backup}

Conversazioni, gruppi e allegati sono inclusi nel backup del modulo NethVoice e vengono ripristinati con esso, insieme alle impostazioni della chat.

## Usare la chat in altre applicazioni web {#chat-island}

La finestra di chat di NethVoice CTI, chiamata *Chat Island*, può essere integrata in altre applicazioni web. Ogni utente può ottenere la stringa di configurazione da NethVoice CTI, in **Impostazioni** > **Integrazioni** > **Configurazione della Chat Island**, con **Ottieni la configurazione**. **Revoca la configurazione della Chat Island** disattiva tutte le Chat Island che usano la configurazione attuale.
