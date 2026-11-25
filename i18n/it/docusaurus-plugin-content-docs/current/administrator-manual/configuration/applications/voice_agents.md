---
title: Agenti vocali
sidebar_position: 7
---

# Agenti vocali

Gli agenti vocali rispondono alle chiamate e possono trasferire il chiamante verso le destinazioni PBX autorizzate. Puoi partire dall’agente predefinito **Receptionist** oppure creare un agente **Basic Voice**.

:::info Disponibilità
L’anteprima è facoltativa e supporta OpenAI GPT-Live tramite WebSocket. I trasporti SIP, inclusi OpenAI Realtime, Grok e CleverAI esterno, richiedono un’opzione separata per il laboratorio e nuovi test audio. L’anteprima richiede una nuova installazione di Agenti vocali. Per i database di sviluppo precedenti, vedi [Recuperare un’installazione alfa](#recover-alpha).
:::

## Prima di iniziare {#before-you-start}

1. Accedi come amministratore all’applicazione NethVoice in NS8. In **Integrazioni**, abilita **Anteprima agenti vocali**. L’opzione è inizialmente disattivata.
2. Inserisci qui una chiave di progetto OpenAI se gli agenti devono usare la credenziale del modulo. Gli agenti possono usare questa chiave anche con entrambe le trascrizioni disattivate. Il provider può addebitare costi di utilizzo.
3. Salva e verifica lo stato di applicazione delle impostazioni di Satellite. Se ci sono chiamate o trascrizioni in corso, Satellite ne attende la conclusione prima di applicare la modifica. Durante l’attesa resta in uso la configurazione precedente. In caso di errore, consulta il registro dell’attività o del servizio del modulo, correggi la causa e riprova.
4. Apri **Agenti vocali** dal menu applicazioni del Wizard NethVoice. L’editor utilizza la sessione amministrativa esistente. Configura un percorso di prova e una destinazione PBX di fallback prima di inoltrare chiamate ordinarie.

Disattivando l’anteprima si conservano bozze, pubblicazioni e credenziali per la successiva riattivazione. Su un clone l’anteprima è inizialmente disattivata. Prima di abilitarla verifica nome host, credenziali e instradamento del clone separatamente dall’istanza di origine.

## Configurare un trunk del provider {#configure-provider-trunk}

1. Apri **Trunk dei provider**, crea un trunk OpenAI e inserisci l’**ID progetto OpenAI** del progetto.
2. Seleziona **Chiave delle integrazioni NethVoice** per usare la credenziale del modulo, oppure **Chiave dedicata** e inserisci una chiave di progetto per il trunk. In modifica, lascia vuoto il campo della chiave dedicata per conservare quella salvata. Per eliminare la chiave dedicata, seleziona esplicitamente la chiave delle integrazioni.
3. Salva il trunk e seleziona **Verifica credenziale**. Se la chiave non è valida, correggila dove è stata impostata. Se l’accesso è negato, verifica i permessi del progetto per la lettura dei modelli. Se OpenAI non è disponibile, riprova più tardi.
4. Nella pagina dell’agente scegli il modello di conversazione e la voce. Per l’anteprima seleziona GPT-Live. La connessione WebSocket in uscita funziona senza segreto di firma o webhook pubblico.

Prima di rimuovere la chiave condivisa in **Integrazioni**, controlla l’elenco degli agenti pubblicati che la utilizzano. Quando la modifica diventa effettiva, le nuove chiamate di questi agenti seguono il fallback nativo fino al ripristino di una chiave valida.

### Configurazione automatica del webhook SIP OpenAI in laboratorio {#automatic-openai-webhook}

Dopo aver salvato un trunk OpenAI per le chiamate SIP Realtime locali, seleziona **Configura webhook** nella sua riga. NethVoice controlla gli endpoint esistenti del progetto, crea se necessario un endpoint riconoscibile `NethVoice <ID trunk> <hostname>` e cifra il segreto di firma restituito nell'archivio delle credenziali lato server esistente. L'ID dell'endpoint e la sua associazione sono conservati privatamente; il browser riceve solo lo stato della configurazione. L'URL deriva dal nome host pubblico configurato in NethVoice e termina con `/satellite-webhooks/openai`; l'evento sottoscritto è `realtime.call.incoming`.

La configurazione riguarda **il progetto della chiave API**. Verifica che l'ID progetto inserito appartenga allo stesso progetto. NethVoice non verifica questa associazione e non richiede una chiave API Admin. La chiave di progetto deve avere i permessi per elencare e creare endpoint webhook. Verifica la raggiungibilità HTTPS pubblica prima di effettuare chiamate.

La colonna **Webhook** mostra la configurazione automatica, un segreto salvato manualmente, una configurazione modificata o un recupero richiesto. Ripetere la configurazione riutilizza un endpoint corrispondente quando il segreto associato è salvato localmente, anche per trunk che condividono progetto, chiave e ID progetto. Gli endpoint estranei o in conflitto non vengono modificati. Se cambi chiave API, ID progetto o nome host pubblico, verifica nuovamente la configurazione. La ricerca degli endpoint non verifica la consegna dei webhook o la disponibilità delle chiamate.

Se un endpoint esiste ma il segreto di firma non è disponibile, recupera il segreto conservato oppure ruotalo esplicitamente nella dashboard OpenAI, poi modifica il trunk e salva manualmente quel segreto. Dopo che l'azione ha identificato l'endpoint, **Configura webhook** può associarlo al segreto inserito manualmente. NethVoice non ruota o elimina automaticamente i segreti del provider. Il provider restituisce il segreto completo solo alla creazione o alla rotazione.

Se OpenAI non risponde in tempo, restituisce una risposta di creazione incompleta o il salvataggio locale fallisce, riprova **Configura webhook** per controllare gli endpoint esistenti. Una creazione non risolta rimane bloccata anche se non è ancora visibile nell'elenco, per evitare duplicati; verifica il progetto della chiave API e completa il recupero manuale. Per gli errori di salvataggio locale, controlla la disponibilità del database e la chiave di cifratura. Gli errori non includono credenziali o contenuti delle risposte del provider.

L'azione non è disponibile per Grok, CleverAI e trunk usati solo da GPT-Live. Un trunk OpenAI condiviso può comunque configurare il webhook per i suoi agenti SIP Realtime. GPT-Live usa WebSocket e non richiede questo webhook. La configurazione non pubblica agenti e non modifica le rotte.

### Configurazione manuale del webhook in laboratorio {#manual-webhook}

Per OpenAI Realtime SIP, crea o seleziona un endpoint nel progetto OpenAI corretto usando l'**Endpoint webhook del provider** mostrato nell'editor del trunk e sottoscrivi `realtime.call.incoming`. Conserva il segreto di firma quando OpenAI lo restituisce, inseriscilo in **Segreto di firma webhook** e salva il trunk. Il segreto inserito manualmente rimane da verificare finché l’audio di una chiamata di prova firmata e associata all’agente non viene collegato. Effettua una chiamata su una rotta di prova e ricontrolla lo stato del trunk. Gli agenti SIP richiedono un segreto di firma prima della pubblicazione.

Per Grok, continua a registrare manualmente l'endpoint Grok visualizzato e il segreto di firma; la credenziale API e il segreto sono entrambi richiesti al salvataggio. Per CleverAI, configura esternamente il webhook delle chiamate in arrivo OpenAI verso CleverAI e inserisci in NethVoice solo nome e ID progetto.

## Configurare e pubblicare un agente {#configure-publish-agent}

1. Aprire **Agenti** e selezionare **Receptionist**, oppure creare un agente personalizzato.
2. Selezionare trunk del provider, modello, lingua e voce. Configurare saluto, istruzioni e durata massima della chiamata.
3. Verificare gli strumenti dell'agente e le autorizzazioni sulle destinazioni come descritto di seguito.
4. Seleziona **Salva bozza**, verifica i **Requisiti per la pubblicazione** e seleziona **Pubblica**. Se la pubblicazione fallisce, puoi correggere la bozza salvata. Se un altro amministratore ha effettuato un salvataggio, confronta la revisione salvata con le tue modifiche prima di riprovare.

Salvare una bozza non modifica la configurazione pubblicata. Le nuove chiamate utilizzano la versione pubblicata; quelle già in corso mantengono la versione selezionata all'avvio. Pubblicare esplicitamente le modifiche successive. Receptionist non può essere eliminato.

Una nuova installazione crea Receptionist disabilitato e non pubblicato. Salvare e pubblicare una configurazione completa prima di assegnare la destinazione nativa. Bozze e pubblicazioni rimangono separate; ripetere l’installazione non sovrascrive modifiche o credenziali.

## Verificare le autorizzazioni di instradamento {#review-routing-permissions}

Ogni agente ha impostazioni indipendenti per gli strumenti. Attivare uno strumento per mostrarne le impostazioni. Per **Trasferisci chiamate**, selezionare **Gestisci destinazioni** per scegliere gli interni e le code che l'agente può usare. Uno strumento disabilitato non può essere utilizzato, anche se le istruzioni lo richiedono.

Per gli agenti appena configurati, i valori predefiniti sono:

| Categoria | Valore predefinito | Controllo dell'amministratore |
| --- | --- | --- |
| Interni diretti | Disabilitati; nessun interno selezionato | In **Gestisci destinazioni**, selezionare ogni interno consentito. |
| Code | Abilitate, nessuna coda selezionata | In **Gestisci destinazioni**, selezionare ogni coda che l’agente può cercare e usare per i trasferimenti. |
| IVR | Disabilitati | L’editor corrente non espone l’attivazione degli IVR. |
| Contatti recenti | Abilitati; finestra di sette giorni | Impostare **Periodo considerato** da 1 a 90 giorni. Per escludere degli interni, scegliere **Tutti gli interni tranne quelli selezionati** e selezionarli. |

Pubblica le autorizzazioni dell’agente. Le nuove code e i nuovi interni restano indisponibili finché non vengono selezionati e pubblicati. L’agente chiede al chiamante di confermare la destinazione prima di avviare il trasferimento. In **Monitoraggio** il trasferimento risulta riuscito dopo la conferma del passaggio al PBX. Gli IVR possono essere usati come destinazioni native di fallback.

### Richiamare un contatto recente {#return-recent-call}

La ricerca usa il numero effettivo del chiamante in ingresso e lo storico PBX per trovare i contatti interni che hanno chiamato quel numero di recente. Sono considerate sia le chiamate in uscita risposte sia quelle senza risposta. Il destinatario deve essere tra gli interni autorizzati nella configurazione pubblicata e fuori dall’elenco delle esclusioni per i chiamanti recenti. L’opzione per la composizione diretta degli interni può rimanere disattivata.

Le istruzioni predefinite di Receptionist indicano il nome di un singolo contatto trovato e chiedono conferma. Se ci sono più contatti, l'agente li nomina e chiede quale si desidera raggiungere. Numeri sconosciuti o anonimi, interni eliminati e assenza di corrispondenze non devono essere interpretati come un contatto verificato. Un contatto trovato per una chiamata non può autorizzare il trasferimento in un'altra chiamata.

Questa funzione facilita l'instradamento. L'identificativo del chiamante può essere falsificato e non autentica l'accesso a informazioni riservate.

### Chiusura facoltativa della chiamata {#optional-call-ending}

**Termina la chiamata** è inizialmente disabilitato. Abilitarlo nella pagina dell’agente, impostare **Durata massima del congedo** da 1 a 10 secondi, quindi salvare e pubblicare. Consente all’agente di terminare la propria chiamata dopo una richiesta esplicita del chiamante o una conversazione completata. Il runtime limita la riproduzione del saluto e verifica la proprietà del canale del chiamante. La terminazione riuscita appare come **Terminata dall’agente**. Un’operazione fallita o non confermata è riportata come errore; dopo aver accettato la richiesta di chiusura, non trasferisce mai il chiamante al fallback.

## Aggiungere l'agente a VisualPlan {#add-to-visualplan}

Usare l'oggetto nativo **Agente** in VisualPlan e selezionare un agente abilitato, pubblicato e sincronizzato. **Nuovo agente** apre l'editor in una nuova scheda. Collegare l'uscita **Destinazione alternativa** dell'oggetto a una destinazione nativa appropriata. Senza collegamento, la chiamata termina.

Configurare il fallback in VisualPlan. Pubblicare l'agente e verificare la sincronizzazione prima di inviargli chiamate. Un errore di sincronizzazione richiede una correzione o un nuovo tentativo esplicito; una bozza salvata non rende disponibile la destinazione dell'agente.

Un interno con profilo CTI raggiunge l’agente tramite una rotta supportata di VisualPlan. Un numero creato solo in **Misc Applications** di FreePBX è fuori dal contesto di composizione di tale interno. Esegui una prova da un interno con lo stesso profilo CTI dei chiamanti previsti.

### Capacità, durata e fallback {#capacity-and-fallback}

Per impostazione predefinita l’anteprima accetta due chiamate GPT-Live simultanee per istanza. Anche la consultazione privata di un collega tramite GPT-Live occupa un posto. La chiamata in eccesso segue il fallback configurato sul PBX e in **Monitoraggio** compare il motivo legato al limite di capacità. Poco prima della durata massima l’agente richiede la riproduzione di un breve avviso nella lingua configurata. Allo scadere del tempo il fallback viene avviato anche se l’avviso non è stato riprodotto.

Se cade la connessione di controllo con Asterisk, Satellite tenta di inviare le chiamate in corso al fallback nativo. Dopo la riconnessione accetta nuove chiamate. Verifica il fallback chiamando la rotta e, dopo la riconnessione, effettua una seconda chiamata di prova.

## Consultare chiamate e prestazioni {#inspect-calls-performance}

Aprire **Monitoraggio** per filtrare lo storico per periodo, agente, provider vocale, adattatore o esito e consultare un'esecuzione. I filtri diversi dal periodo accettano più valori. È anche possibile cercare per agente o ID dell’esecuzione.

I dettagli mostrano gli orari locali, l’amministratore che ha pubblicato la versione, gli eventi del ciclo di vita, i motivi di errore, una traccia gerarchica, i dati di utilizzo del provider disponibili e gli esiti di trasferimento o fallback. Selezionare **Apri il registro della chiamata** per cercare il numero chiamante e quello chiamato con i permessi e i tempi di conservazione previsti per lo storico PBX.

I riepiloghi includono conteggi, latenze e misure degli strumenti. I percentili sono approssimativi. Per misurare la durata della chiamata, usare il valore della durata, poiché le fasi possono sovrapporsi.

Apri **Diagnostica** per controllare lo stato del monitoraggio, la consegna degli eventi e il numero di firme webhook non valide dall’avvio di Satellite. Un errore nella verifica della firma non identifica il chiamante. Le misure mancanti restano indisponibili, anziché essere riportate come zero. Un trasferimento confermato può avere una traccia incompleta. Interruzioni della raccolta o il recupero della consegna possono lasciare misure incomplete.

La conservazione dei metadati è di 90 giorni per impostazione predefinita. Gli amministratori possono modificarla tramite la variabile d'ambiente del modulo `VOICE_AGENT_MONITORING_RETENTION_DAYS` (1–3650 giorni), seguita dalla normale configurazione del modulo e da un riavvio pianificato del servizio. L'editor dell'agente non offre un controllo per questa conservazione. Ridurre la finestra elimina i dati precedenti durante la pulizia programmata; aumentarla non recupera i dati eliminati. La conservazione dello storico nativo PBX è separata.

### Trascrizione facoltativa della chiamata {#optional-call-transcription}

In **Debug**, **Trascrizione chiamata** è inizialmente disabilitata. Dopo abilitazione e pubblicazione, le chiamate OpenAI supportate possono conservare il testo cifrato del chiamante e dell'agente per gli amministratori. Selezionare una conservazione da 1 a 24 ore. La trascrizione in ingresso può aggiungere costi del provider. Questa impostazione non abilita la registrazione audio generale ed è separata dalla trascrizione esistente di Satellite.

## Risoluzione dei problemi e verifica {#troubleshooting-verification}

- Se l'agente non è disponibile in VisualPlan, verificare pubblicazione e sincronizzazione nativa.
- Se una destinazione richiesta non è disponibile, verificare lo strumento, le categorie e l'inventario PBX corrente. Il permesso per l'interno diretto è distinto dall'idoneità per le richiamate recenti.
- Se la chiamata termina o segue il fallback durante la connessione, consultare provider, fase e categoria di errore dell'esecuzione, quindi verificare credenziali e raggiungibilità del webhook.
- Se il monitoraggio è incompleto o non aggiornato, verificare lo stato della consegna dei dati prima di interpretare latenze e utilizzo.

Una connessione al provider o un evento di collegamento multimediale non dimostrano che il chiamante abbia sentito la voce. Durante una chiamata di prova autorizzata, verificare l'audio in entrambe le direzioni e la destinazione effettiva del trasferimento. GPT-Live utilizza un WebSocket primario del provider e un WebSocket multimediale privato di Asterisk. Per i test multimediali SIP è necessaria l’opzione di laboratorio. Non esistono un selettore del trasporto o un fallback SIP automatico. Le misure di protocollo e audio sono distinte dall’ascolto umano; qualità della conversazione, chiamate lunghe e comportamento sotto carico di trascrizione richiedono ancora verifiche dal vivo.

## Recuperare un’installazione alfa {#recover-alpha}

1. Lascia disattivata l’anteprima se l’installazione segnala un database di sviluppo non supportato, incluso alpha-v8. Conserva l’istanza originale. Evita di eliminare le tabelle degli agenti o ripetere l’installazione sui dati alfa.
2. Esegui un backup NS8 protetto dell’intera applicazione NethVoice. Conserva le versioni o i digest delle immagini del modulo, di FreePBX e di Satellite che hanno scritto i dati. Verifica che il backup includa i dati MariaDB, il file dei segreti del modulo con la chiave originale `SATELLITE_AGENT_CONFIG_KEY` e il volume eventi degli agenti vocali. La chiave originale serve per decifrare le credenziali dedicate dei trunk.
3. Per recuperare l’alfa, ripristina il backup in un’istanza isolata con le immagini alfa corrispondenti. Mantienila separata dalle rotte di produzione e dai webhook del provider durante la verifica di bozze, pubblicazioni e credenziali. Conserva il backup originale fino al completamento della prova di ripristino.
4. Per provare l’anteprima, installa le immagini compatibili su un’istanza con una nuova installazione di Agenti vocali e configura lì la funzionalità. Un normale aggiornamento NethVoice può mantenere disattivata l’anteprima e continuare a gestire chiamate PBX, chat e trascrizioni.
