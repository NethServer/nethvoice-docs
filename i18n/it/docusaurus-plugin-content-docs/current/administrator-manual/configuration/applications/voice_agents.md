---
title: Agenti vocali
sidebar_position: 7
---

# Agenti vocali

Gli agenti vocali rispondono alle chiamate tramite una conversazione e possono trasferire il chiamante verso le destinazioni PBX autorizzate. **Receptionist** è l'agente predefinito; gli amministratori possono creare anche agenti personalizzati di tipo **Basic Voice**. L'instradamento verso code e IVR è una capacità dell'agente, non una conversazione con un agente separato.

:::info Disponibilità
Questa pagina descrive la funzionalità degli agenti vocali in sviluppo. Richiede versioni compatibili di NethVoice e Satellite che la includano; non è disponibile nelle installazioni che non mostrano **Agent** nel Wizard. Questa versione alfa supporta soltanto nuove installazioni del formato di configurazione corrente (v8). I database delle precedenti versioni di sviluppo vengono rifiutati; non è previsto un aggiornamento o azzeramento automatico. Eseguire un backup della precedente installazione di prova e usare una nuova istanza o una procedura di azzeramento verificata esplicitamente prima di installare la coppia di immagini compatibili.
:::

## Prima di iniziare {#before-you-start}

Utilizzare un account amministratore NethVoice e un account OpenAI o Grok supportato. L'utilizzo del provider può comportare costi. Per i trasporti SIP, il provider deve poter raggiungere l'indirizzo webhook HTTPS mostrato nell'interfaccia. Configurare un percorso di prova e una destinazione di fallback sicura prima di esporre un agente alle chiamate ordinarie.

Gli agenti condividono il servizio Satellite con la trascrizione, ma non richiedono che la trascrizione delle chiamate o delle caselle vocali sia abilitata. Pianificare i riavvii del servizio in una finestra di manutenzione, poiché possono interessare entrambe le funzionalità.

## Configurare un trunk del provider {#configure-provider-trunk}

1. Aprire **Agent** dal menu delle applicazioni del Wizard. L'interfaccia degli agenti si apre in una scheda separata utilizzando l'accesso amministrativo esistente.
2. Aprire **Trunk dei provider** e creare un trunk OpenAI o Grok.
3. Inserire le credenziali richieste e le impostazioni di verifica del webhook. Configurare il webhook del provider usando l'indirizzo mostrato nell'interfaccia. Salvare un trunk non configura l'account del provider.
4. Salvare il trunk. Le credenziali possono essere scritte ma non rilette: lasciare vuota una credenziale esistente durante una modifica ne conserva il valore.

Una chiave API del provider configurata nelle integrazioni del modulo NethVoice può fornire la credenziale predefinita quando non è memorizzata una chiave esplicita nel trunk. Le credenziali esplicite del trunk hanno la precedenza. Scegliere modello e voce nella pagina di ciascun agente; le opzioni disponibili dipendono dal provider e dal trasporto. Grok SIP utilizza un modello gestito dal provider.

## Configurare e pubblicare un agente {#configure-publish-agent}

1. Aprire **Agenti** e selezionare **Receptionist**, oppure creare un agente personalizzato.
2. Selezionare trunk del provider, modello, lingua e voce. Configurare saluto, istruzioni e durata massima della chiamata.
3. Verificare gli strumenti dell'agente e le autorizzazioni sulle destinazioni come descritto di seguito.
4. Selezionare **Salva bozza**, quindi **Pubblica**. La pubblicazione attiva l'agente; non esiste un interruttore di abilitazione separato.

Salvare una bozza non modifica la configurazione pubblicata. Le nuove chiamate utilizzano la versione pubblicata; quelle già in corso mantengono la versione selezionata all'avvio. Pubblicare esplicitamente le modifiche successive. Receptionist non può essere eliminato.

Una nuova installazione crea Receptionist disabilitato e non pubblicato. Salvare e pubblicare una configurazione completa prima di assegnare la destinazione nativa. Bozze e pubblicazioni rimangono separate; ripetere l’installazione non sovrascrive modifiche o credenziali.

## Verificare le autorizzazioni di instradamento {#review-routing-permissions}

Ogni agente ha impostazioni indipendenti per gli strumenti. Espandere la configurazione di uno strumento per verificare quali destinazioni può trovare e utilizzare. Uno strumento disabilitato non può essere utilizzato, anche se le istruzioni lo richiedono.

Per gli agenti appena configurati, i valori predefiniti sono:

| Categoria | Valore predefinito | Controllo dell'amministratore |
| --- | --- | --- |
| Interni diretti | Disabilitati; nessun interno selezionato | Abilitare la categoria e selezionare esplicitamente gli interni consentiti. |
| Code | Abilitate; tutte le code ammesse | Escludere le code che l'agente non deve usare. |
| IVR | Disabilitati | L’editor corrente non espone l’attivazione degli IVR. |
| Chiamanti interni recenti | Abilitati; finestra di sette giorni | Impostare la finestra da 1 a 90 giorni ed escludere gli interni non ammessi. |

Questi valori richiedono comunque che lo strumento corrispondente sia abilitato. Le nuove code diventano disponibili se non escluse; i nuovi interni diretti restano indisponibili finché non vengono autorizzati. Verificare i permessi quando cambia l'inventario PBX.

Un IVR consentito segue le proprie opzioni native, comprese le destinazioni configurate al suo interno. Consentire l'IVR significa quindi consentire il relativo flusso di chiamata, non soltanto il primo annuncio.

### Richiamare un contatto recente {#return-recent-call}

La ricerca usa il numero effettivo del chiamante in ingresso e lo storico PBX per trovare i contatti interni che hanno chiamato quel numero di recente. Sono considerate sia le chiamate in uscita risposte sia quelle senza risposta. Le esclusioni degli interni sono indipendenti dai permessi per gli interni diretti.

Le istruzioni predefinite di Receptionist indicano il nome di un singolo contatto trovato e chiedono conferma. Se ci sono più contatti, l'agente li nomina e chiede quale si desidera raggiungere. Numeri sconosciuti o anonimi, interni eliminati e assenza di corrispondenze non devono essere interpretati come un contatto verificato. Un contatto trovato per una chiamata non può autorizzare il trasferimento in un'altra chiamata.

Questa funzione facilita l'instradamento. L'identificativo del chiamante può essere falsificato e non autentica l'accesso a informazioni riservate.

### Chiusura facoltativa della chiamata {#optional-call-ending}

**Termina la chiamata** è inizialmente disabilitato. Abilitarlo nella pagina dell’agente, impostare **Attesa massima per il saluto finale (secondi)** da 1 a 10 secondi, quindi salvare e pubblicare. Consente all’agente di terminare la propria chiamata dopo una richiesta esplicita del chiamante o una conversazione completata. Il runtime limita la riproduzione del saluto e verifica la proprietà del canale del chiamante. La terminazione riuscita appare come **Terminata dall’agente**. Un’operazione fallita o non confermata è riportata come errore; dopo aver accettato la richiesta di chiusura, non trasferisce mai il chiamante al fallback.

## Aggiungere l'agente a VisualPlan {#add-to-visualplan}

Usare l'oggetto nativo **Agent** in VisualPlan e selezionare un agente abilitato, pubblicato e sincronizzato. **Nuovo agente** apre l'editor in una nuova scheda. Collegare l'uscita **Fallback** dell'oggetto a una destinazione nativa appropriata; un fallback non collegato termina la chiamata.

Configurare il fallback in VisualPlan. Pubblicare l'agente e verificare la sincronizzazione prima di inviargli chiamate. Un errore di sincronizzazione richiede una correzione o un nuovo tentativo esplicito; una bozza salvata non rende disponibile la destinazione dell'agente.

## Consultare chiamate e prestazioni {#inspect-calls-performance}

Aprire **Attività** per filtrare lo storico per data, agente, provider o esito e consultare un'esecuzione. I dettagli mostrano eventi del ciclo di vita, una traccia gerarchica, l'utilizzo disponibile del provider e gli esiti di trasferimento o fallback. I riepiloghi includono conteggi, latenze e misure degli strumenti. I percentili sono approssimativi e le durate delle fasi sovrapposte non devono essere sommate per stimare la durata della chiamata.

Verificare lo stato e la completezza del monitoraggio insieme all'esito della chiamata. Le misure mancanti restano indisponibili, anziché essere riportate come zero. Un trasferimento confermato può avere una traccia incompleta. Interruzioni della raccolta o il recupero della consegna possono lasciare misure incomplete.

La conservazione dei metadati è di 90 giorni per impostazione predefinita. Gli amministratori possono modificarla tramite la variabile d'ambiente del modulo `VOICE_AGENT_MONITORING_RETENTION_DAYS` (1–3650 giorni), seguita dalla normale configurazione del modulo e da un riavvio pianificato del servizio. L'editor dell'agente non offre un controllo per questa conservazione. Ridurre la finestra elimina i dati precedenti durante la pulizia programmata; aumentarla non recupera i dati eliminati. La conservazione dello storico nativo PBX è separata.

### Trascrizione facoltativa della chiamata {#optional-call-transcription}

In **Debug**, **Trascrizione chiamata** è inizialmente disabilitata. Dopo abilitazione e pubblicazione, le chiamate OpenAI supportate possono conservare il testo cifrato del chiamante e dell'agente per gli amministratori. Selezionare una conservazione da 1 a 24 ore. La trascrizione in ingresso può aggiungere costi del provider. Questa impostazione non abilita la registrazione audio generale ed è separata dalla trascrizione esistente di Satellite.

## Risoluzione dei problemi e verifica {#troubleshooting-verification}

- Se l'agente non è disponibile in VisualPlan, verificare pubblicazione e sincronizzazione nativa.
- Se una destinazione richiesta non è disponibile, verificare lo strumento, le categorie e l'inventario PBX corrente. Il permesso per l'interno diretto è distinto dall'idoneità per le richiamate recenti.
- Se la chiamata termina o segue il fallback durante la connessione, consultare provider, fase e categoria di errore dell'esecuzione, quindi verificare credenziali e raggiungibilità del webhook.
- Se il monitoraggio è incompleto o non aggiornato, verificare lo stato della consegna dei dati prima di interpretare latenze e utilizzo.

Una connessione al provider o un evento di collegamento multimediale non dimostrano che il chiamante abbia sentito la voce. Durante una chiamata di prova autorizzata, verificare l'audio in entrambe le direzioni e la destinazione effettiva del trasferimento. GPT-Live utilizza un WebSocket primario del provider e un WebSocket multimediale Asterisk privato; OpenAI Realtime e Grok mantengono i rispettivi trasporti SIP separati. Non esistono un selettore del trasporto o un fallback SIP automatico. Le misure di protocollo e audio sono distinte dall’ascolto umano; qualità della conversazione, chiamate lunghe e comportamento sotto carico di trascrizione richiedono ancora verifiche dal vivo.
