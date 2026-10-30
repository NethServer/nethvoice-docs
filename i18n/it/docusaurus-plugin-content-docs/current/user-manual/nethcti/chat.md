---
title: Chat
sidebar_position: 3
---

# Chat

NethVoice CTI include una chat per scrivere ai colleghi, singolarmente o in gruppo, e a persone esterne all'azienda tramite un link d'invito. Le stesse conversazioni sono disponibili in [NethLink](../nethlink/usage.md#chat) e nell'[app mobile NethVoice](../mobile_app.md#messages).

La chat è disponibile quando l'amministratore l'ha [abilitata](../../administrator-manual/configuration/chat.md) e il tuo profilo ha il permesso **Chat**.

## Pagina Messaggi {#messages-page}

La voce **Messaggi** del menu apre l'elenco delle tue conversazioni: chat uno a uno, gruppi, gruppi di NethVoice CTI e code. Ogni riga mostra l'ultimo messaggio, l'orario e il numero di messaggi non letti; il conteggio dei non letti compare anche accanto alla voce **Messaggi**.

- Fai clic su una riga, o su **Apri chat**, per aprire la conversazione.
- Il menu **⋮** di una riga permette di silenziare o riattivare le notifiche, aprire i dettagli dell'operatore, del gruppo o della coda, ed eliminare la conversazione o uscire dal gruppo.
- La casella di ricerca cerca nomi, nomi utente e testo dei messaggi: le corrispondenze sono evidenziate e facendo clic su un risultato si apre la chat su quel messaggio.

## Iniziare una chat {#start-chat}

Premi **Nuova chat** e scegli a chi scrivere:

- **Un collega**: premi **Avvia chat**.
- **Due o più colleghi**: aggiungi se vuoi un'immagine e un nome, poi premi **Crea gruppo**. Senza nome, il gruppo prende i nomi dei suoi membri.
- **Persone esterne**: vedi [Chat con persone esterne all'azienda](#external-people).

Puoi anche iniziare una chat con un collega dalla sua scheda operatore, dal pannello dell'operatore (**Apri chat**) e dal menu di chiamata.

## La finestra di chat {#chat-window}

Le chat si aprono in una finestra in basso a destra della pagina. Le chat aperte compaiono come icone rotonde accanto alla finestra: fai clic su un'icona per cambiare chat, trascina la finestra per spostarla.

- **Aggancia al pannello laterale** tiene la chat sul lato destro della pagina mentre lavori; **Sgancia dal pannello laterale** riporta la finestra mobile.
- L'intestazione mostra con chi stai scrivendo e la sua presenza. In un gruppo, fai clic sul nome per vedere i membri, con la loro presenza, e iniziare una chat o una chiamata con uno di loro.
- Il pulsante **Chiama** chiama il collega sul dispositivo che scegli (telefono web, NethLink o app mobile); la chiamata viene annotata nella chat.
- L'icona di **ricerca** cerca un testo nella conversazione, compresi i messaggi più vecchi: usa le frecce per passare da un risultato all'altro.

## Messaggi {#messages}

- Scrivi nella casella in basso e premi Invio per inviare; Maiusc+Invio va a capo.
- Il testo si può formattare con Markdown: `**grassetto**`, `*corsivo*`, `~~barrato~~`, `` `codice` ``, blocchi di codice, elenchi e link.
- Le emoji si scelgono dal selettore o si scrivono come codici brevi, ad esempio `:+1:`.
- Menziona un collega con `@` seguito dal suo nome utente.
- Passa sopra un messaggio per **reagire** con un'emoji, **rispondere** (il messaggio originale viene citato) o **eliminarlo**. Puoi eliminare solo i tuoi messaggi; in un gruppo puoi eliminarli per tutti.
- Le spunte indicano quando il messaggio è stato consegnato e letto. In un gruppo il messaggio è letto quando lo hanno letto tutti i membri.
- Quando un collega sta scrivendo, la chat lo mostra.

In un gruppo il nome di ogni persona ha un colore proprio, così è facile seguire chi sta scrivendo.

## Allegati e messaggi vocali {#attachments}

- Premi la graffetta, o trascina i file sulla chat, per inviare immagini, documenti e altri file, anche più di uno insieme con una didascalia.
- Premi il microfono per registrare un messaggio vocale e inviarlo.
- Le immagini vengono mostrate nella chat; gli altri file si possono scaricare.

La dimensione massima di un file e lo spazio per i tuoi allegati sono impostati dall'amministratore.

## Gruppi {#groups}

Il proprietario di un gruppo apre le sue impostazioni con l'icona a **ingranaggio** per:

- cambiarne nome e immagine;
- aggiungere membri con **Aggiungi membri** e rimuoverli;
- [condividerlo con persone esterne all'azienda](#share-group).

Ogni membro può uscire da un gruppo; quando esce il proprietario, un altro membro diventa proprietario.

I gruppi di NethVoice CTI e le code compaiono in automatico come chat di gruppo, con i loro membri; non è possibile uscirne né eliminarli.

## Notifiche {#notifications}

- Un nuovo messaggio in una chat non aperta mostra una notifica nella pagina e riproduce un suono.
- Con le notifiche del browser consentite, ricevi la notifica anche quando NethVoice CTI è in una scheda in secondo piano o chiuso.
- Le chat silenziate non danno suono né notifica.

## Chat con persone esterne all'azienda {#external-people}

Puoi scrivere a clienti, fornitori e a chiunque non abbia un account NethVoice. Ricevono un link, lo aprono nel browser, scrivono il proprio nome ed entrano.

### Creare una chat con persone esterne {#create-external}

In **Nuova chat**, seleziona **Persone esterne** in cima all'elenco, come selezioneresti un collega:

- **Solo Persone esterne**: scrivi il nome della chat e premi **Crea link**. La chat è tra te e le persone che inviti.
- **Persone esterne e uno o più colleghi**: aggiungi se vuoi un'immagine e un nome, poi premi **Crea gruppo**. Il gruppo viene creato e condiviso subito.

Compare il link d'invito: copialo con l'icona dentro il campo e invialo per email, messaggio o qualsiasi altro canale, poi premi **Apri chat**. Il link vale 30 giorni.

### Condividere un gruppo esistente {#share-group}

Il proprietario di un gruppo creato da **Nuova chat** può aprirlo a persone esterne: premi l'icona a **ingranaggio**, poi **Condividi con persone esterne** e conferma. Ricorda che le persone esterne leggeranno tutta la cronologia del gruppo.

I gruppi di NethVoice CTI e le code non si possono condividere.

### Gestire il link e le persone esterne {#manage-external}

Nelle impostazioni del gruppo il proprietario può:

- **Nuovo link**: creare un nuovo link; quello precedente smette di funzionare.
- **Rendi privato**: disattivare il link. Non entra più nessuno e chi è già entrato resta; quando non resta nessuna persona esterna, il gruppo torna un gruppo normale.
- **Rimuovere** una persona esterna dalla chat.

Gli altri membri vedono le persone esterne nell'elenco dei membri ma non possono gestirle.

Le persone esterne sono contrassegnate come **Esterno** accanto al nome e nell'elenco dei membri, e la chat è contrassegnata come **Esterna** nel titolo.

### Cosa vedono le persone esterne {#guest-page}

Chi apre il link vede una pagina con il nome della chat:

1. Scrive il proprio nome e preme **Entra**. Il nome è visibile a tutti nella chat e deve essere diverso da quello delle altre persone presenti.
2. Vede tutta la cronologia della chat e i nomi dei membri.
3. Può scrivere, rispondere, reagire, usare le emoji, inviare file e messaggi vocali, cercare nella chat ed eliminare i propri messaggi.
4. Mentre la pagina è aperta può ricevere le notifiche del browser per i nuovi messaggi: il browser chiede il permesso al momento dell'ingresso.

La pagina segue il tema chiaro o scuro del browser.
