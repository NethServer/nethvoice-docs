---
title: Sorgenti video
sidebar_position: 4
---

# Sorgenti video

La sezione *Sorgenti video* collega videocitofoni e telecamere IP a NethVoice. Gli utenti di NethVoice CTI con i permessi necessari possono:

- vedere le sorgenti nella pagina **Sorgenti video** di NethVoice CTI;
- vedere il video del citofono nell'anteprima della chiamata quando il citofono li chiama, prima di rispondere e durante la chiamata, sia in NethVoice CTI sia in NethLink;
- aprire porte e cancelli collegati al citofono con i pulsanti **Apri**.

Consulta [Sorgenti video](../../../user-manual/nethcti/video_sources.md) nel manuale utente per sapere cosa vedono gli utenti.

## Tipi di sorgente {#source-types}

Lo schema dell'URL determina il tipo di sorgente:

| URL | Tipo mostrato nel wizard | Cosa vedono gli utenti |
|-----|--------------------------|------------------------|
| `rtsp://` o `rtsps://` | **Flusso video (RTSP)** | Video dal vivo (e audio, se il dispositivo lo invia), riprodotto tramite il gateway video integrato in NethVoice |
| `http://` o `https://` | **Immagine (HTTP)** | Un'immagine JPEG del dispositivo, aggiornata circa ogni secondo |

Per i flussi video:

- il dispositivo dovrebbe inviare video **H.264**, riprodotto da tutti i browser supportati. Il video **H.265** (HEVC) è riprodotto solo da alcuni browser: quando possibile configura il dispositivo per inviare H.264;
- il centralino legge il flusso dal dispositivo solo mentre almeno un utente lo sta guardando;
- il centralino legge il flusso sempre in **TCP**;
- il video arriva agli utenti tramite WebRTC: i browser e NethLink devono poter raggiungere le porte del gateway video dell'istanza NethVoice (vedi [Requisiti di rete](#network-requirements)).

Per le immagini, l'URL deve restituire un'immagine JPEG o PNG (al massimo 5 MB). La maggior parte dei citofoni e delle telecamere ha un URL di "snapshot" per questo scopo.

## Requisiti {#requirements}

Prima di creare una sorgente di tipo flusso video, verifica che:

1. **Il centralino possa raggiungere il dispositivo.** È il centralino che si collega al dispositivo, non il contrario. Se il dispositivo si trova nella LAN del cliente e il centralino altrove (per esempio in cloud), sul router della sede inoltra la porta RTSP del dispositivo (di solito `554`) consentendola solo dall'indirizzo IP pubblico del centralino, oppure collega centralino e sede con una VPN. NethVoice non prevede un relay da installare presso il cliente.
2. **Gli utenti possano raggiungere il gateway video.** Vedi [Requisiti di rete](#network-requirements).
3. **Il dispositivo invii video H.264**, se possibile (vedi [Tipi di sorgente](#source-types)), con le [impostazioni del flusso consigliate](#stream-settings).
4. **Il citofono sia un interno di NethVoice**, se gli utenti devono vederne il video quando li chiama o aprire le porte con i codici DTMF: crealo prima nella sezione Utenti, come qualsiasi altro interno.

### Impostazioni del flusso consigliate {#stream-settings}

Configura il flusso di videocitofoni e telecamere con queste impostazioni:

- **Codec**: H.264, profilo Baseline o Main, senza B-frame;
- **Flusso**: il flusso principale, se il dispositivo mantiene piccoli i keyframe con le impostazioni qui sotto; altrimenti il flusso secondario (sub stream), che è anche la scelta per le connessioni lente;
- **Risoluzione**: VGA (640x480), al massimo fino a 720p;
- **Bitrate**: circa 0,5–1 Mbit/s;
- **Intervallo tra i keyframe (I-frame)**: 1–2 secondi.

Il browser può iniziare a mostrare il video solo a partire da un keyframe completo: keyframe grandi o rari fanno partire il video lentamente e con ritardo.

:::note Videocitofoni Fanvil serie i
Provato su un Fanvil i62 con firmware 2.12.51:

- i percorsi dei flussi sono `/h264/stream.live0` per il flusso principale e `/h264/stream.live1` per il flusso secondario;
- nell'URL usa l'indirizzo IP del dispositivo, non un nome host: con un nome host questo firmware risponde `400 Bad Request` alla verifica della connessione, anche con le credenziali corrette;
- a 720p con il bitrate di fabbrica (3 Mbit/s) il firmware tronca i keyframe più grandi di circa 100 KB, quindi il video parte solo dopo una lunga attesa e con ritardo. Il provisioning di NethVoice riduce il flusso principale a 1 Mbit/s con un keyframe al secondo: con queste impostazioni il flusso principale parte subito e si vede meglio del flusso secondario. Senza provisioning, riduci il bitrate del flusso principale oppure usa il flusso secondario;
- il flusso secondario può impiegare alcuni secondi per partire la prima volta che viene aperto.
:::

## Creazione di una sorgente video {#creating-video-source}

Apri **Applicazioni** > **Sorgenti video** nel wizard e clicca su **Crea nuova sorgente**, oppure su **Crea da un citofono** per un citofono configurato da NethVoice con il provisioning (vedi [Creazione di una sorgente da un citofono](#door-phone)). Compila il form:

- **Nome**: il nome della sorgente, come la vedono gli utenti in NethVoice CTI. Deve contenere almeno una lettera o una cifra e deve essere diverso dai nomi delle altre sorgenti (nomi che differiscono solo per maiuscole o simboli sono considerati uguali).
- **Interno**: l'interno del citofono, se presente. Quando questo interno chiama un utente che può vedere la sorgente, NethVoice CTI e NethLink ne mostrano il video nell'anteprima della chiamata. L'interno è anche la destinazione dei codici DTMF delle [porte](#gates). Lascialo vuoto per una telecamera che non effettua chiamate.
- **Tipo di dispositivo**: *Altro*, oppure un dispositivo di cui NethVoice conosce i flussi (*Fanvil i-series*): con un dispositivo noto il form compila la porta e il percorso del flusso, mantiene l'indirizzo inserito e mostra la scelta **Qualità video**.
- **URL**: l'indirizzo del flusso o dell'immagine, per esempio `rtsp://192.0.2.10:554/stream1` o `https://192.0.2.10/cgi-bin/snapshot.jpg`. Usa `rtsp://` o `rtsps://` per un flusso video, `http://` o `https://` per un'immagine JPEG. Per un flusso video il form ricorda di inoltrare la porta RTSP del dispositivo e mostra l'indirizzo IP pubblico del centralino da consentire. Quando inserisci l'URL, il form verifica se il centralino riesce ad aprire una connessione verso l'indirizzo e la porta del dispositivo (solo una connessione TCP, al dispositivo non viene inviato nulla; porte predefinite `554` per `rtsp://`, `322` per `rtsps://`, `80` per `http://` e `443` per `https://`). La verifica avviene solo sulle porte dei dispositivi video (`554`, `8554` e `322` per RTSP, `80` e `8080` per HTTP, `443` e `8443` per HTTPS, e la porta RTSP del modello di citofono) e mai verso gli indirizzi del nodo NethVoice o della VPN del cluster: in questi casi, e dopo molte verifiche in poco tempo, il form non mostra alcun risultato. Quando il centralino non raggiunge il dispositivo, per esempio perché il centralino è nel cloud e l'indirizzo appartiene alla rete locale della sede, un avviso spiega cosa fare: inoltrare la porta del dispositivo sul suo router, consentirla solo dall'indirizzo IP pubblico del centralino e inserire nell'URL l'indirizzo pubblico del dispositivo. Puoi comunque salvare la sorgente, per esempio per prepararla prima che il port forward sia pronto.
- **Nome utente** e **Password**: le credenziali del dispositivo, se richieste. Il campo **Password** si abilita dopo aver inserito il **Nome utente**. Se incolli un URL che contiene le credenziali (`rtsp://utente:password@host/...`), queste vengono spostate in questi campi al salvataggio della sorgente. Con le credenziali e un URL `http://` o `rtsp://` il form avvisa che viaggiano in chiaro, insieme al video nel caso di `rtsp://` (vedi [Note sulla sicurezza](#security-notes)).
- **Varchi**: le porte e i cancelli che gli utenti possono aprire da questa sorgente. Vedi [Porte e varchi](#gates).
- **Salta la verifica del certificato TLS**: mostrata solo quando l'URL della sorgente o un varco URL usa TLS (`rtsps://` o `https://`). Vedi [Certificati TLS](#tls-certificates).
- **Profilo**: i profili CTI i cui utenti possono vedere la sorgente e aprirne le porte. Per una nuova sorgente il form propone il profilo dell'utente dell'**Interno** selezionato, oppure il profilo *Base* senza interno, e segue l'interno finché non cambi tu il profilo; la modifica di una sorgente mantiene i suoi profili. Seleziona almeno un profilo. Vedi [Permessi](#permissions).

### Verifica della connessione {#connection}

Clicca su **Verifica** accanto a **Connessione**. Il centralino contatta il dispositivo con l'URL e le credenziali del form e mostra:

- il risultato: un segno di spunta verde, oppure il motivo dell'errore (vedi [Errori della verifica](#check-errors));
- per i flussi video, i codec in **Video**, per esempio `H264 1920x1080, PCM_ALAW 8000 Hz`;
- un fotogramma del video, o l'immagine, in **Anteprima**;
- per i dispositivi TLS con **Salta la verifica del certificato TLS** abilitata, l'impronta SHA-256 del certificato in **Certificato del dispositivo**.

Viene mostrato un avviso quando il video è H.265 o usa un codec che i browser non possono riprodurre.

Il pulsante **Salva** si abilita solo dopo una verifica riuscita: quando modifichi l'URL o le credenziali, clicca di nuovo su **Verifica**.

### Salvataggio della sorgente {#saving-video-source}

Clicca su **Salva**. La sorgente compare come scheda nell'elenco delle sorgenti, con il suo tipo (**Flusso video (RTSP)** o **Immagine (HTTP)**) e il risultato di una verifica della connessione, ripetuta ogni volta che si apre la pagina. Clicca su **Info** nella scheda per vedere i dettagli: interno, URL, nome utente, varchi, codec e anteprima.

Usa **Modifica** per cambiare una sorgente ed **Elimina** per rimuoverla. Quando una sorgente viene eliminata, il suo permesso viene rimosso da tutti i profili e gli utenti che la stanno guardando vengono disconnessi.

Quando modifichi una sorgente, i campi password mostrano *Invariata*: lasciali vuoti per mantenere la password salvata. Se cambi l'indirizzo o la porta del dispositivo, inserisci di nuovo la password: NethVoice non invia mai una password salvata a un dispositivo diverso.

## Creazione di una sorgente da un citofono {#door-phone}

Per i citofoni che NethVoice configura con il provisioning (vedi [Telefoni supportati](../../provisioning/supported_phones.md#fanvil)), il wizard compila per te il form della sorgente.

1. Quando installi il citofono, aggiungilo all'inventario dei dispositivi con il suo indirizzo MAC, scegli il modello (per esempio *Fanvil i62*) e assegnalo a un interno, come per un telefono. Il citofono scarica la sua configurazione dal centralino tramite RPS, oppure tramite l'URL di provisioning inserito nella sua interfaccia web: l'URL con il codice segreto, mostrato da **Info** in **Dispositivi** > **Telefoni** (vedi [Provisioning dei telefoni](../../provisioning/phone_provisioning.md)). L'indirizzo senza codice segreto, per esempio quello fornito dall'opzione DHCP 66, dà a un citofono solo una configurazione senza segreti e senza URL di provisioning: per i citofoni non funziona. Aggiungi il citofono all'inventario solo quando lo stai installando (vedi [Note sulla sicurezza](#security-notes)).
2. Apri **Applicazioni** > **Sorgenti video** e clicca su **Crea da un citofono**. L'elenco mostra i citofoni configurati con il provisioning e assegnati a un interno, con il loro indirizzo IP quando sono registrati e le sorgenti che già li usano.
3. Clicca su **Usa** accanto al citofono. Si apre il form di una nuova sorgente con:
   - **Nome**: il nome dell'interno;
   - **Interno**: l'interno del citofono;
   - **URL**: il flusso principale del dispositivo, per esempio `rtsp://192.0.2.10:554/h264/stream.live0` per i Fanvil i6x, con l'indirizzo del citofono;
   - **Qualità video**: *Alta (flusso principale)*, la scelta predefinita, oppure *Standard (flusso secondario, per connessioni lente)*, per i citofoni con due flussi. La scelta cambia solo il percorso dell'URL; un percorso inserito a mano mostra *Percorso personalizzato*;
   - **Profilo**: il profilo dell'utente dell'interno del citofono;
   - una porta DTMF per ogni relè del citofono: *Porta 1* con il codice del relè 1 (`*` come predefinito) e, per i citofoni con due relè, *Porta 2* con il codice del relè 2 (`#` come predefinito). Vedi [Porte e varchi](#gates).
4. Modifica quello che serve, seleziona i profili, clicca su **Verifica** e su **Salva**.

**Tasti di chiamata e relè.** I tasti di chiamata e i relè del citofono si impostano nelle impostazioni del telefono, come i tasti di un telefono: apri **Utenti**, l'utente del citofono, clicca sulla matita accanto al modello del dispositivo tra i suoi dispositivi associati.

- **Line key**: un tasto per ogni pulsante di chiamata del citofono (cinque sull'i63, uno sugli altri modelli). L'unico tipo è **Speed Dial**: inserisci il numero che il pulsante chiama, per esempio l'interno della reception o un gruppo di chiamata. Un tasto senza numero non viene scritto, quindi il citofono mantiene il pulsante impostato nella sua interfaccia web.
- **Relè**: per ogni relè, **Relè 1: codice DTMF di apertura** e **Relè 1: tempo di apertura (secondi)**, e lo stesso per il relè 2 sui citofoni con due relè (l'i60 ne ha uno). Un codice ha da 1 a 16 caratteri tra `0-9`, `A-D`, `*` e `#`; il tempo di apertura va da 1 a 600 secondi: con altri valori le impostazioni non si possono salvare. I codici predefiniti sono `*` per il relè 1 e `#` per il relè 2. Il citofono apre il relè quando riceve il suo codice durante una chiamata; i varchi delle sorgenti create dal citofono inviano questi codici.

I citofoni li configura solo l'amministratore: non compaiono tra i dispositivi dell'utente in NethVoice CTI, quindi l'utente dell'interno del citofono non può cambiarne i tasti.

**Credenziali.** La prima volta che un citofono viene usato, il centralino genera per lui una password RTSP casuale, la aggiunge alla configurazione di provisioning del dispositivo e chiede al citofono di scaricare di nuovo la configurazione. Questa password protegge solo il flusso video (RTSP) del citofono: l'interfaccia web del citofono riceve la [password di amministrazione dei telefoni](../../provisioning/phone_provisioning.md#password-amministratore), con l'utente `admin`. La password non viene mai mostrata nelle sorgenti video e il form non ha i campi nome utente e password per una sorgente collegata a un citofono, anche quando la modifichi, finché l'URL punta al citofono: il centralino invia la password salvata solo all'indirizzo da cui il citofono si registra, o all'indirizzo pubblico proposto da **Usa l'indirizzo pubblico**. Se il citofono non è registrato, o inserisci un altro indirizzo (per esempio un nome host o un port forward su un altro indirizzo pubblico), il form mostra **Nome utente** e **Password** e la verifica chiede la password: inserisci la password RTSP del citofono. Una sorgente salvata con una password inserita a mano non è più collegata al citofono e non segue i cambi della sua password. Per leggere o cambiare la password, apri **Utenti**, l'utente del citofono, clicca sulla matita accanto al modello del dispositivo tra i suoi dispositivi associati e apri **Preferenze**: il campo è **Password RTSP (flusso video)**, con il pulsante a forma di occhio per mostrarla. Quando la salvi lì, il citofono riceve la nuova password con il provisioning successivo e le sorgenti create dal citofono prendono la nuova password. Per usare altre credenziali per il video di un citofono, crea invece la sorgente con **Crea nuova sorgente**. Il form segnala quando la password è appena stata generata: se la verifica non riesce, attendi un minuto perché il citofono applichi la nuova configurazione, oppure riavvia il citofono. In seguito lo stesso citofono mantiene la stessa password.

**Indirizzo.** L'indirizzo IP viene dalla registrazione SIP del citofono, quindi è l'indirizzo del dispositivo nella sua rete: il form verifica se il centralino lo raggiunge, come per qualsiasi sorgente (vedi [Creazione di una sorgente video](#creating-video-source)). Se il citofono si registra da un indirizzo pubblico che il centralino raggiunge sulla stessa porta, l'avviso propone anche **Usa l'indirizzo pubblico**. Se il citofono non è registrato, l'URL è vuoto: inseriscilo, insieme alla password RTSP del citofono.

Le sorgenti create in questo modo sono sorgenti normali: **Modifica** ed **Elimina** funzionano come per tutte le altre. **Crea nuova sorgente** continua a funzionare per qualsiasi altro dispositivo.

:::note Citofoni Fanvil i6x
Il provisioning dei Fanvil i60/i60K, i61, i62, i63 e i64 modifica solo queste impostazioni del citofono: l'account SIP (con DTMF RFC 2833), fuso orario e server dell'ora, il server di provisioning, i flussi della telecamera, il server RTSP (abilitato, con autenticazione e la password RTSP generata dal centralino, vedi sopra), i pulsanti di chiamata con un numero (speed dial), i relè con un codice DTMF (aperti tramite DTMF, con il loro codice e tempo di apertura) e la password dell'utente web `admin`, che è la password di amministrazione dei telefoni. Tutto il resto mantiene i valori impostati nell'interfaccia web del citofono. In particolare, configura sul citofono:

- le regole di accesso e le password di apertura della porta (**EGS Setting**), e le uscite che il provisioning non scrive;
- i flussi della telecamera (**Intercom settings** > **Camera Settings**), seguendo le [impostazioni del flusso consigliate](#stream-settings): il provisioning riduce il bitrate del flusso principale a 1 Mbit/s e imposta un keyframe al secondo su entrambi i flussi, quindi il wizard propone il flusso principale, `/h264/stream.live0`, e offre il flusso secondario, `/h264/stream.live1`, come qualità *Standard*.
:::

## Porte e varchi {#gates}

Ogni sorgente può avere fino a 10 varchi (apriporta). Clicca su **Aggiungi varco** per aggiungerne uno. Ogni varco ha:

- un nome, mostrato agli utenti nell'elenco delle porte e nel suggerimento **Apri** *nome* (per esempio **Apri Porta 1**). I nuovi varchi si chiamano *Porta 1*, *Porta 2* e così via: dai loro nomi significativi, come *Ingresso principale* o *Garage*;
- un tipo, **DTMF** o **URL**.

Usa le frecce per cambiare l'ordine dei varchi e l'icona del cestino per rimuoverne uno.

I varchi **DTMF** inviano un codice DTMF (fino a 30 caratteri tra `0-9`, `A-D`, `*`, `#` e `+`) all'interno della sorgente:

- la sorgente deve avere un **Interno**;
- quando il citofono sta chiamando un utente, l'utente deve rispondere alla chiamata prima di aprire: fino ad allora le porte DTMF non possono essere aperte, perché i toni andrebbero persi;
- quando non c'è alcuna chiamata in corso con il citofono, il centralino chiama l'interno del citofono e invia il codice quando il citofono risponde. Il citofono deve rispondere automaticamente: se non è registrato, è occupato o non risponde entro circa 30 secondi, la porta non viene aperta e l'utente vede *Invio del codice di apertura non riuscito*.

I varchi **URL** vengono aperti con una richiesta HTTP che il centralino invia al citofono o al controller della porta:

- scegli il metodo, **GET** o **POST**, e inserisci l'URL, che deve iniziare con `http://` o `https://`, per esempio `http://192.0.2.10/cgi-bin/open?door=1`;
- inserisci **Nome utente** e **Password** se il dispositivo li richiede (autenticazione HTTP Basic o Digest, come chiede il dispositivo). Con un URL `http://` il form avvisa che nome utente e password viaggiano in chiaro (vedi [Note sulla sicurezza](#security-notes));
- il dispositivo deve essere raggiungibile dal centralino, come la sorgente stessa;
- i varchi URL possono essere aperti in qualsiasi momento, con o senza chiamata.

Per una sorgente creata da un citofono (vedi [Creazione di una sorgente da un citofono](#door-phone)), ogni varco apre un relè del citofono: il primo varco il relè 1, il secondo varco il relè 2. Una sorgente può avere al massimo un varco per relè (**Un varco per ogni relè del citofono**), quindi due varchi per i Fanvil i61, i62, i63 e i64 e uno per l'i60.

- Un varco DTMF invia il codice del suo relè, impostato nella sezione [Relè](#door-phone) delle impostazioni del telefono: il codice è mostrato in sola lettura (**Codice del relè del citofono** 1, **impostato dal provisioning del citofono**). Per cambiarlo, cambia il codice del relè nelle impostazioni del telefono. Un codice inserito a mano, per un relè senza codice, deve avere il formato dei codici dei relè: da 1 a 16 caratteri tra `0-9`, `A-D`, `*` e `#`.
- Quando imposti un varco su **URL**, il form propone l'URL che apre il relè, `http://<citofono>/cgi-bin/ConfigManApp.com?egs&outputN=OUTN_SOS` (`N` è il relè), con il metodo **GET** e il nome utente `admin`: inserisci a mano la password dell'interfaccia web del citofono, cioè la password di amministrazione dei telefoni. L'URL può essere modificato.

Per i citofoni preferisci i varchi DTMF: il codice viaggia dentro la chiamata e il varco non ha bisogno di credenziali. Un varco URL serve per aprire la porta senza una chiamata.

Dopo che un utente ha premuto un pulsante **Apri**, l'interfaccia mostra *Comando inviato*: il centralino sa solo che il comando è stato consegnato (per i varchi URL, che il dispositivo ha risposto con uno stato di successo), non se la porta si è davvero aperta.

:::note
Gli utenti dell'app mobile NethVoice aprono le porte DTMF digitando il codice sul tastierino durante la chiamata. I varchi URL non sono disponibili nell'app mobile.
:::

## Certificati TLS {#tls-certificates}

I certificati dei dispositivi `rtsps://` e `https://` vengono verificati con le autorità di certificazione, come fa un browser. Molti citofoni e telecamere usano invece un certificato autofirmato: in questo caso la verifica fallisce con *Certificato TLS non valido*.

Per questi dispositivi abilita **Salta la verifica del certificato TLS**. L'opzione vale per tutto ciò che il centralino contatta per quella sorgente: l'URL della sorgente e i suoi varchi URL `https://`. Con l'opzione abilitata:

- al salvataggio della sorgente il centralino legge il certificato presentato da ogni dispositivo e lo **fissa**: da quel momento si fida solo di quel certificato. La sua impronta SHA-256 è mostrata come **Certificato fissato**, per la sorgente e per ogni varco URL;
- la sorgente non può essere salvata se non è possibile leggere il certificato di uno dei suoi dispositivi: verifica che il dispositivo sia raggiungibile, oppure disabilita l'opzione;
- se in seguito il certificato di un dispositivo cambia (rinnovo, ripristino di fabbrica, sostituzione del dispositivo), il centralino rifiuta di collegarsi al dispositivo: il video dal vivo si ferma (gli utenti vedono *La sorgente video non è raggiungibile, nuovo tentativo in corso...*), le immagini non si aggiornano più e i varchi URL rispondono *Il certificato del dispositivo è cambiato: contatta l'amministratore*. La scheda della sorgente mostra *Il certificato del dispositivo è cambiato: modifica la sorgente, inserisci di nuovo la password e salvala*. Assicurati che il dispositivo sia davvero il tuo, poi apri la sorgente con **Modifica**, inserisci di nuovo la password (la password salvata non viene mai inviata a un dispositivo il cui certificato è cambiato: senza di essa la verifica fallisce), clicca su **Verifica**, che mostra *Il certificato del dispositivo è cambiato: il PBX rifiuta il dispositivo finché la sorgente non viene salvata di nuovo*, e su **Salva** per fissare il nuovo certificato.

Le sorgenti con **Salta la verifica del certificato TLS** salvate da una versione precedente di NethVoice, che non fissava i certificati, sono contrassegnate come **Certificato non fissato** nell'elenco delle sorgenti: i loro dispositivi vengono contattati senza alcun controllo del certificato. Le sorgenti senza questa opzione non sono interessate. Apri ognuna di esse con **Modifica** e salvala di nuovo per fissarne i certificati.

## Permessi {#permissions}

Ogni sorgente video crea un permesso con il nome della sorgente, nella sezione **Sorgenti Video** dei profili CTI. Gli utenti vedono, e possono aprirne le porte, solo le sorgenti abilitate nel loro profilo.

- Il campo **Profilo** della sorgente abilita la sorgente nei profili selezionati.
- Gli stessi permessi sono elencati in **Profili**, sezione **Sorgenti Video**, dove deve essere abilitato anche il permesso generale della sezione: senza di esso gli utenti del profilo non vedono alcuna sorgente video. Vedi [Permessi delle sorgenti video](../wizard.md#video-sources-permissions).
- Quando una sorgente viene tolta da un profilo, gli utenti di quel profilo smettono di vederla: i video di quella sorgente che stanno guardando vengono chiusi quando la nuova configurazione viene applicata.
- Le sorgenti create prima dell'aggiornamento mantengono il loro nome, e quindi il loro permesso e i profili in cui è abilitato. Il loro codice di apertura diventa un varco DTMF chiamato *Door 1*, che puoi rinominare.

Le credenziali dei dispositivi sono salvate sul centralino e non vengono mai inviate a NethVoice CTI, a NethLink o ai browser: gli utenti ricevono il video tramite il gateway video, con token di accesso monouso e di breve durata, verificati in base ai loro permessi.

## Requisiti di rete {#network-requirements}

| Da | A | Porta | Scopo |
|----|---|-------|-------|
| Centralino | Dispositivo | Porta RTSP del dispositivo (di solito `554`; senza porta nell'URL, `554` per `rtsp://` e `322` per `rtsps://`), TCP | Flusso video |
| Centralino | Dispositivo | Porta HTTP o HTTPS del dispositivo | Immagini, varchi URL, fissaggio dei certificati |
| Browser e NethLink | Nome host di NethVoice CTI | `443` TCP | Avvio del video (HTTPS) |
| Browser e NethLink | Nodo di NethVoice | Porte ICE del gateway video, una UDP e una TCP | Video (WebRTC) |

Le porte ICE del gateway video sono assegnate a ogni istanza NethVoice e aperte automaticamente nel firewall del nodo. Per conoscerne i numeri, apri l'applicazione NethVoice nella pagina di amministrazione di NethServer, vai in **Stato** e cerca **Video gateway ICE (UDP)** e **Video gateway ICE (TCP)** nella tabella **Servizi interni**. Se davanti al nodo c'è un firewall o un NAT, consenti e inoltra anche queste due porte: vedi [Firewall](../firewall.md).

Tieni presente che:

- i client che raggiungono il centralino solo sulla porta `443` (per esempio dietro un proxy restrittivo) non possono riprodurre i flussi video: non esiste un'alternativa via HTTPS;
- il centralino rifiuta gli indirizzi dei dispositivi che puntano al centralino stesso o a reti link-local: loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`, `fe80::/10`) e indirizzi non specificati, anche quando sono il risultato della risoluzione di un nome host. Usa l'indirizzo LAN, pubblico o VPN del dispositivo;
- il centralino non segue i redirect HTTP dei dispositivi.

## Limiti {#limits}

- Fino a 10 varchi per ogni sorgente.
- Ogni utente può guardare la stessa sorgente al massimo 3 volte contemporaneamente (per esempio in NethVoice CTI e in NethLink su due computer) e al massimo 30 video in totale. Oltre il limite l'utente vede *Troppi video aperti: chiudine uno per vedere questo*.
- Ogni sorgente può essere guardata al massimo da 100 spettatori contemporaneamente, considerando tutti gli utenti.
- Citofoni Fanvil i6x: al massimo un varco per relè. Dopo aver aperto un relè il citofono chiude la chiamata dopo alcuni secondi (riscontrato sull'i64), quindi si può aprire un solo relè per chiamata: per aprire l'altro relè, chiama di nuovo il citofono.

## Risoluzione dei problemi {#troubleshooting}

### Errori della verifica {#check-errors}

| Messaggio | Significato e cosa fare |
|-----------|-------------------------|
| *Nome utente o password errati* | Il dispositivo ha rifiutato le credenziali. Controlla **Nome utente** e **Password** e che l'utente possa leggere il flusso sul dispositivo. |
| *Connessione rifiutata: verifica l'indirizzo, la porta e l'inoltro della porta del dispositivo* | L'indirizzo risponde, ma nessuno accetta connessioni su quella porta. Controlla la porta nell'URL e l'inoltro della porta sul router della sede. |
| *Il dispositivo non risponde: verifica l'indirizzo e il firewall* | Nessuna risposta in tempo utile. Controlla l'indirizzo, l'inoltro della porta e che il firewall davanti al dispositivo consenta l'indirizzo IP pubblico del centralino. |
| *Flusso non trovato: verifica il percorso nell'URL* | Il dispositivo ha risposto, ma il percorso non esiste. Cerca il percorso del flusso nel manuale del dispositivo. |
| *Certificato TLS non valido* | Il certificato del dispositivo non è attendibile. Se il dispositivo ha un certificato autofirmato, abilita **Salta la verifica del certificato TLS**. |
| *URL o flusso non supportato* | L'URL non è un flusso video né un'immagine, oppure il flusso non contiene video. |
| *Indirizzo non consentito: il PBX stesso e gli indirizzi link-local non possono essere sorgenti video* | L'indirizzo del dispositivo è rifiutato: vedi [Requisiti di rete](#network-requirements). |
| *Errore di connessione* | Qualsiasi altro errore: i dettagli sono mostrati sotto il messaggio. Se i dettagli mostrano `400 Bad Request` anche con le credenziali corrette, nell'URL usa l'indirizzo IP del dispositivo invece del nome host (riscontrato su Fanvil i62, vedi [Impostazioni del flusso consigliate](#stream-settings)). |

### Certificato non fissato o certificato cambiato {#certificate-problems}

- **Certificato non fissato**: la sorgente salta la verifica TLS ed è stata salvata da una versione precedente di NethVoice. Aprila con **Modifica**, clicca su **Verifica** e su **Salva**.
- *Il certificato del dispositivo è cambiato: il PBX rifiuta il dispositivo finché la sorgente non viene salvata di nuovo*: il dispositivo presenta un certificato diverso da quello fissato. Assicurati che il dispositivo non sia stato sostituito da qualcun altro, poi apri la sorgente con **Modifica**, inserisci di nuovo la password, clicca su **Verifica** e su **Salva**.

### Il video non parte {#video-not-starting}

Se la verifica della connessione riesce ma gli utenti non vedono il video:

- *Il browser non può riprodurre il formato video di questa sorgente*: il dispositivo invia H.265 o un altro codec che il browser non può riprodurre. Configura il dispositivo per inviare H.264.
- *La sorgente video non è raggiungibile, nuovo tentativo in corso...*: il centralino non riesce a leggere il flusso dal dispositivo, oppure il client non raggiunge il gateway video. Apri l'elenco delle sorgenti nel wizard: se la verifica della sorgente fallisce, correggi la connessione al dispositivo; se riesce, vedi l'ultimo punto.
- *Non hai i permessi per vedere questa sorgente*: la sorgente non è abilitata nel profilo dell'utente (vedi [Permessi](#permissions)).
- *Troppi video aperti: chiudine uno per vedere questo*: l'utente ha raggiunto i [limiti](#limits). Chiudi altri video, per esempio in un'altra scheda del browser o su un altro computer.
- Il video resta in caricamento, poi mostra *La sorgente video non è raggiungibile, nuovo tentativo in corso...*, mentre la verifica della sorgente riesce: probabilmente il client non raggiunge le porte ICE del gateway video. Verifica che entrambe le porte siano consentite da tutti i firewall tra i client e il centralino, e inoltrate se il centralino è dietro NAT (vedi [Requisiti di rete](#network-requirements)). Se le porte sono a posto, probabilmente il dispositivo invia keyframe incompleti o troppo rari: riduci la risoluzione o il bitrate, oppure usa il flusso secondario (vedi [Impostazioni del flusso consigliate](#stream-settings)).

### Una porta non si apre {#door-not-opening}

- *Rispondi alla chiamata per aprire*: le porte DTMF si possono aprire solo dopo aver risposto alla chiamata del citofono.
- *Il dispositivo non è raggiungibile* o *Il dispositivo non ha risposto in tempo*: il centralino non raggiunge il dispositivo di un varco URL. Controlla l'URL, l'inoltro della porta e il firewall.
- *Il dispositivo ha risposto con un errore* (*Impossibile aprire la porta* nella Phone Island): il dispositivo ha risposto alla richiesta di un varco URL con uno stato di errore. Controlla l'URL, il metodo e le credenziali del varco.
- *Invio del codice di apertura non riuscito*: il centralino non è riuscito a inviare il codice DTMF all'interno del citofono. Senza una chiamata in corso il centralino chiama prima il citofono: verifica che l'interno del citofono sia registrato e risponda automaticamente alle chiamate.
- Compare *Comando inviato* ma la porta resta chiusa: controlla il codice DTMF, oppure l'URL e il metodo, sul manuale del citofono.

## Note sulla sicurezza {#security-notes}

- Consenti le porte RTSP e HTTP(S) dei dispositivi solo dall'indirizzo IP pubblico del centralino: non esporle mai a tutta Internet.
- Quando il dispositivo lo permette, leggi il flusso con un utente dedicato che abbia solo i diritti necessari per vedere il video.
- Con gli URL `rtsp://` e `http://` niente è cifrato: le credenziali del dispositivo, le immagini e il video viaggiano in chiaro tra il centralino e il dispositivo, e chiunque si trovi sul percorso di rete può leggerli. Preferisci `rtsps://` e `https://` quando il dispositivo li supporta. Altrimenti tieni il centralino e i dispositivi nella stessa rete fidata, metti citofoni e telecamere in una VLAN separata, oppure collegali tramite una VPN. Il form avvisa per queste sorgenti quando hanno credenziali.
- Con `http://` il centralino invia una password con HTTP Basic solo quando il dispositivo chiede Basic, e mai a un dispositivo che ha già usato Digest: un dispositivo che all'improvviso chiede Basic non riceve alcuna password.
- I varchi URL con un URL `http://` inviano nome utente e password in chiaro. Usali solo quando il centralino e il dispositivo sono nella stessa rete fidata o collegati tramite una VPN; usa `https://` quando il dispositivo lo supporta.
- I varchi URL dei citofoni Fanvil i-series usano l'utente web `admin` con la [password di amministrazione dei telefoni](../../provisioning/phone_provisioning.md#password-amministratore), che è la stessa per tutti i telefoni e i citofoni del centralino: chi la legge può aprire la porta e l'interfaccia web di ogni telefono. Per i citofoni preferisci i varchi DTMF, che viaggiano dentro la chiamata e non hanno bisogno di credenziali.
- I codici DTMF che aprono le porte viaggiano nell'audio (RTP) della chiamata: verifica che la crittografia (TLS/SRTP) sia abilitata per il dispositivo dell'interno del citofono (**Crittografia** del dispositivo fisico nelle impostazioni dell'utente, vedi [Dispositivi](../wizard.md#dispositivi)), altrimenti i codici viaggiano in chiaro.
- Aggiungi un citofono all'inventario dei dispositivi solo quando lo stai installando: finché il citofono non scarica la sua configurazione per la prima volta, il suo primo URL di provisioning resta valido, e chi lo conosce (l'URL è registrato anche sul servizio RPS del produttore) può scaricare la configurazione del citofono, codici e password compresi. Se l'installazione viene rimandata, togli il citofono dall'inventario e aggiungilo di nuovo più tardi.
- Abilita **Salta la verifica del certificato TLS** solo per i dispositivi con un certificato autofirmato, dopo aver verificato che l'indirizzo appartenga davvero al tuo dispositivo: il certificato presentato al salvataggio della sorgente è considerato attendibile da quel momento in poi.
