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
| `http://` o `https://` | **Immagine (HTTP)** | Un'immagine JPEG del dispositivo, aggiornata periodicamente |

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
3. **Il dispositivo invii video H.264**, se possibile (vedi [Tipi di sorgente](#source-types)).
4. **Il citofono sia un interno di NethVoice**, se gli utenti devono vederne il video quando li chiama o aprire le porte con i codici DTMF: crealo prima nella sezione Utenti, come qualsiasi altro interno.

## Creazione di una sorgente video {#creating-video-source}

Apri **Applicazioni** > **Sorgenti video** nel wizard e clicca su **Crea nuova sorgente**. Compila il form:

- **Nome**: il nome della sorgente, come la vedono gli utenti in NethVoice CTI. Deve contenere almeno una lettera o una cifra e deve essere diverso dai nomi delle altre sorgenti (nomi che differiscono solo per maiuscole o simboli sono considerati uguali).
- **Interno**: l'interno del citofono, se presente. Quando questo interno chiama un utente che può vedere la sorgente, NethVoice CTI e NethLink ne mostrano il video nell'anteprima della chiamata. L'interno è anche la destinazione dei codici DTMF delle [porte](#gates). Lascialo vuoto per una telecamera che non effettua chiamate.
- **URL**: l'indirizzo del flusso o dell'immagine, per esempio `rtsp://192.0.2.10:554/stream1` o `https://192.0.2.10/cgi-bin/snapshot.jpg`. Usa `rtsp://` o `rtsps://` per un flusso video, `http://` o `https://` per un'immagine JPEG. Per un flusso video il form ricorda di inoltrare la porta RTSP del dispositivo e mostra l'indirizzo IP pubblico del centralino da consentire.
- **Nome utente** e **Password**: le credenziali del dispositivo, se richieste. Il campo **Password** si abilita dopo aver inserito il **Nome utente**. Se incolli un URL che contiene le credenziali (`rtsp://utente:password@host/...`), queste vengono spostate in questi campi al salvataggio della sorgente.
- **Varchi**: le porte e i cancelli che gli utenti possono aprire da questa sorgente. Vedi [Porte e varchi](#gates).
- **Salta la verifica del certificato TLS**: mostrata solo quando l'URL della sorgente o un varco URL usa TLS (`rtsps://` o `https://`). Vedi [Certificati TLS](#tls-certificates).
- **Profilo**: i profili CTI i cui utenti possono vedere la sorgente e aprirne le porte. Seleziona almeno un profilo. Vedi [Permessi](#permissions).

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

## Porte e varchi {#gates}

Ogni sorgente può avere fino a 10 varchi (apriporta). Clicca su **Aggiungi varco** per aggiungerne uno. Ogni varco ha:

- un nome, mostrato agli utenti nel pulsante **Apri** *nome* (per esempio **Apri Porta 1**). I nuovi varchi si chiamano *Porta 1*, *Porta 2* e così via: dai loro nomi significativi, come *Ingresso principale* o *Garage*;
- un tipo, **DTMF** o **URL**.

Usa le frecce per cambiare l'ordine dei varchi e l'icona del cestino per rimuoverne uno.

I varchi **DTMF** inviano un codice DTMF (fino a 30 caratteri tra `0-9`, `A-D`, `*`, `#` e `+`) all'interno della sorgente:

- la sorgente deve avere un **Interno**;
- quando il citofono sta chiamando un utente, l'utente deve rispondere alla chiamata prima di aprire: fino ad allora le porte DTMF non possono essere aperte, perché i toni andrebbero persi;
- quando non c'è alcuna chiamata in corso con il citofono, il centralino chiama l'interno del citofono e invia il codice quando il citofono risponde.

I varchi **URL** vengono aperti con una richiesta HTTP che il centralino invia al citofono o al controller della porta:

- scegli il metodo, **GET** o **POST**, e inserisci l'URL, che deve iniziare con `http://` o `https://`, per esempio `http://192.0.2.10/cgi-bin/open?door=1`;
- inserisci **Nome utente** e **Password** se il dispositivo li richiede (autenticazione HTTP Basic o Digest);
- il dispositivo deve essere raggiungibile dal centralino, come la sorgente stessa;
- i varchi URL possono essere aperti in qualsiasi momento, con o senza chiamata.

Dopo che un utente ha premuto un pulsante **Apri**, l'interfaccia mostra *Comando inviato*: il centralino sa solo che il comando è stato consegnato (per i varchi URL, che il dispositivo ha risposto con uno stato di successo), non se la porta si è davvero aperta.

:::note
Gli utenti dell'app mobile NethVoice aprono le porte DTMF digitando il codice sul tastierino durante la chiamata. I varchi URL non sono disponibili nell'app mobile.
:::

## Certificati TLS {#tls-certificates}

I certificati dei dispositivi `rtsps://` e `https://` vengono verificati con le autorità di certificazione, come fa un browser. Molti citofoni e telecamere usano invece un certificato autofirmato: in questo caso la verifica fallisce con *Certificato TLS non valido*.

Per questi dispositivi abilita **Salta la verifica del certificato TLS**. L'opzione vale per tutto ciò che il centralino contatta per quella sorgente: l'URL della sorgente e i suoi varchi URL `https://`. Con l'opzione abilitata:

- al salvataggio della sorgente il centralino legge il certificato presentato da ogni dispositivo e lo **fissa**: da quel momento si fida solo di quel certificato. La sua impronta SHA-256 è mostrata come **Certificato fissato**, per la sorgente e per ogni varco URL;
- la sorgente non può essere salvata se non è possibile leggere il certificato di uno dei suoi dispositivi: verifica che il dispositivo sia raggiungibile, oppure disabilita l'opzione;
- se in seguito il certificato di un dispositivo cambia (rinnovo, ripristino di fabbrica, sostituzione del dispositivo), il centralino rifiuta di collegarsi al dispositivo: il video smette di funzionare e le sue porte rispondono *Il certificato del dispositivo è cambiato: contatta l'amministratore*. La verifica della connessione mostra *Il certificato del dispositivo è cambiato: il PBX rifiuta il dispositivo finché la sorgente non viene salvata di nuovo*. Assicurati che il dispositivo sia davvero il tuo, poi apri la sorgente, clicca su **Verifica** e su **Salva** per fissare il nuovo certificato.

Le sorgenti salvate prima che NethVoice fissasse i certificati sono contrassegnate come **Certificato non fissato** nell'elenco delle sorgenti: i loro dispositivi vengono contattati senza alcun controllo del certificato. Apri ognuna di esse con **Modifica** e salvala di nuovo per fissarne i certificati.

## Permessi {#permissions}

Ogni sorgente video crea un permesso con il nome della sorgente, nella sezione **Sorgenti Video** dei profili CTI. Gli utenti vedono, e possono aprirne le porte, solo le sorgenti abilitate nel loro profilo.

- Il campo **Profilo** della sorgente abilita la sorgente nei profili selezionati.
- Gli stessi permessi sono elencati in **Profili**, sezione **Sorgenti Video**, dove deve essere abilitato anche il permesso generale della sezione: senza di esso gli utenti del profilo non vedono alcuna sorgente video. Vedi [Permessi delle sorgenti video](../wizard.md#video-sources-permissions).
- Quando una sorgente viene tolta da un profilo, gli utenti di quel profilo smettono di vederla: i video di quella sorgente che stanno guardando vengono chiusi quando la nuova configurazione viene applicata.

Le credenziali dei dispositivi sono salvate sul centralino e non vengono mai inviate a NethVoice CTI, a NethLink o ai browser: gli utenti ricevono il video tramite il gateway video, con token di accesso monouso e di breve durata, verificati in base ai loro permessi.

## Requisiti di rete {#network-requirements}

| Da | A | Porta | Scopo |
|----|---|-------|-------|
| Centralino | Dispositivo | Porta RTSP del dispositivo (di solito `554`), TCP | Flusso video |
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
| *Errore di connessione* | Qualsiasi altro errore: i dettagli sono mostrati sotto il messaggio. |

### Certificato non fissato o certificato cambiato {#certificate-problems}

- **Certificato non fissato**: la sorgente è stata salvata da una versione precedente di NethVoice. Aprila con **Modifica**, clicca su **Verifica** e su **Salva**.
- *Il certificato del dispositivo è cambiato: il PBX rifiuta il dispositivo finché la sorgente non viene salvata di nuovo*: il dispositivo presenta un certificato diverso da quello fissato. Assicurati che il dispositivo non sia stato sostituito da qualcun altro, poi apri la sorgente, clicca su **Verifica** e su **Salva**.

### Il video non parte {#video-not-starting}

Se la verifica della connessione riesce ma gli utenti non vedono il video:

- *Il browser non può riprodurre il formato video di questa sorgente*: il dispositivo invia H.265 o un altro codec che il browser non può riprodurre. Configura il dispositivo per inviare H.264.
- *La sorgente video non è raggiungibile, nuovo tentativo in corso...*: il centralino non riesce a leggere il flusso dal dispositivo. Clicca su **Verifica** sulla sorgente nel wizard.
- *Non hai i permessi per vedere questa sorgente*: la sorgente non è abilitata nel profilo dell'utente (vedi [Permessi](#permissions)).
- *Troppi video aperti: chiudine uno per vedere questo*: l'utente ha raggiunto i [limiti](#limits). Chiudi altri video, per esempio in un'altra scheda del browser o su un altro computer.
- Il video resta in caricamento e non parte mai: probabilmente il client non raggiunge le porte ICE del gateway video. Verifica che entrambe le porte siano consentite da tutti i firewall tra i client e il centralino, e inoltrate se il centralino è dietro NAT (vedi [Requisiti di rete](#network-requirements)).

### Una porta non si apre {#door-not-opening}

- *Rispondi alla chiamata per aprire*: le porte DTMF si possono aprire solo dopo aver risposto alla chiamata del citofono.
- *Il dispositivo non è raggiungibile* o *Il dispositivo non ha risposto in tempo*: il centralino non raggiunge il dispositivo di un varco URL. Controlla l'URL, l'inoltro della porta e il firewall.
- *Il dispositivo ha risposto con un errore*: il dispositivo ha risposto alla richiesta di un varco URL con uno stato di errore. Controlla l'URL, il metodo e le credenziali del varco.
- *Invio del codice di apertura non riuscito*: il centralino non è riuscito a inviare il codice DTMF all'interno del citofono.
- Compare *Comando inviato* ma la porta resta chiusa: controlla il codice DTMF, oppure l'URL e il metodo, sul manuale del citofono.

## Note sulla sicurezza {#security-notes}

- Consenti le porte RTSP e HTTP(S) dei dispositivi solo dall'indirizzo IP pubblico del centralino: non esporle mai a tutta Internet.
- Quando il dispositivo lo permette, leggi il flusso con un utente dedicato che abbia solo i diritti necessari per vedere il video.
- Abilita **Salta la verifica del certificato TLS** solo per i dispositivi con un certificato autofirmato, dopo aver verificato che l'indirizzo appartenga davvero al tuo dispositivo: il certificato presentato al salvataggio della sorgente è considerato attendibile da quel momento in poi.
