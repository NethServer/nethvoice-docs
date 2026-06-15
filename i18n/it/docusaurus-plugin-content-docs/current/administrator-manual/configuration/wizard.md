---
title: Procedura guidata
sidebar_position: 3
---

La procedura guidata di configurazione iniziale facilita l'installazione e la configurazione di tutti i componenti di NethVoice.

La procedura guidata ti guiderà attraverso le seguenti sezioni:
- **Interni**: Configura gli interni degli utenti.
- **Trunk**: Configura le connessioni trunk.
- **Percorsi**: Definisci le regole di instradamento delle chiamate.
- **Dispositivi**: Gestisci i dispositivi telefonici e il provisioning.

Alla fine della procedura guidata:
- ogni sezione sarà accessibile dal menu principale per ulteriori modifiche
- una nuova pagina [Dashboard](./dashboard) sarà disponibile per monitorare lo stato del sistema e le prestazioni
- una nuova sezione [Applicazioni](./applications) sarà disponibile per gestire le funzionalità CTI

## Interni - Utenti

Gli interni VoIP (Voice over Internet Protocol) sono numeri telefonici virtuali che consentono alle persone di effettuare e ricevere chiamate utilizzando la rete invece di una linea telefonica tradizionale. Ogni interno è un numero univoco all'interno del tuo sistema NethVoice — i colleghi possono chiamarsi l'un l'altro componendo quel numero. Un interno può anche ricevere chiamate esterne una volta configurate le linee telefoniche del sistema.

Durante la configurazione iniziale, assegna un interno a ogni utente (consigliamo di iniziare da 200). Immetti il numero dell'interno nel campo e fai clic su Aggiungi per collegarlo all'utente.

Questo elencherà tutti gli utenti disponibili nel dominio utente associato all'istanza di NethVoice.
Puoi gestire gli utenti (creare, aggiornare, reimpostare le password, eliminare) accedendo alla sezione dedicata tramite il pulsante **Link al portale**, che apre il Portale del dominio utente in una nuova scheda.

Inserisci l'interno corrispondente per ogni utente:

1. Fai clic sul campo di input dell'interno per l'utente selezionato e immetti un interno numerico (consigliato a partire da 200). Utilizza solo cifre — nessuno spazio o punteggiatura.  
2. Fai clic su Aggiungi per assegnare l'interno all'utente.  
3. Se ha successo, la riga dell'utente viene evidenziata e appare un segno di spunta verde.

:::info
Le installazioni senza una subscription Enterprise sono limitate a 8 utenti.
Per maggiori informazioni, vedi [Subscription](/docs/administrator-manual#subscription).  
:::

Fai clic sul pulsante **Avanti** per procedere alla sezione Trunk.

### Importazione ed esportazione utenti {#import-and-export-users}

Questa pagina consente di importare ed esportare utenti in blocco utilizzando file CSV:

- **Importa**: crea un file CSV in testo semplice (UTF‑8) con un utente per riga usando il seguente ordine dei campi.  
- **Esporta**: scarica un modello CSV contenente gli utenti correnti per modificarlo e reimportarlo. Il file esportato ha lo stesso formato di quello importabile.

Crea un file CSV in testo semplice (UTF‑8) con un utente per riga usando il seguente ordine dei campi:
```
<NICKNAME>,<FULL NAME>,[EXTENSION],[USER PASSWORD],[MOBILE],[VOICEMAIL],[WEBRTC EXTENSION],[CTI GROUPS],[CTI PROFILE]
```

Note ed esempi:
- I campi tra parentesi quadre sono opzionali.  
- Usa la virgola per separare i campi. Non includere virgolette attorno ai valori a meno che non facciano parte del valore stesso.  
- I campi booleani accettano TRUE o FALSE (non case‑sensitive).  
- I gruppi CTI sono una lista separata da pipe (|); i gruppi non esistenti verranno creati automaticamente.  
- Il profilo CTI deve esistere già nel sistema.

Esempio:
```
mario,Mario Rossi
paolo,Paolo Bianchi,200
carlo201,Carlo Neri,201,Carlo1@.!
francesco,Francesco Verdi,202,,33312312343,FALSE,TRUE,Sviluppo|Assistenza|Tecnici,Advanced
andrea,Andrea Rossi,203,Andrea1234,,TRUE,TRUE,Commerciali,Standard
```

Procedura di importazione:
1. Clicca su Importa e seleziona il file CSV che hai creato.  
2. Nella finestra di importazione clicca Importa e attendi che gli utenti vengano elaborati.

Dettagli di comportamento:
- Se EXTENSION è omesso, viene creato solo l'account utente (nessuna interno assegnato).  
- Se PASSWORD è omesso, verrà generata una password casuale.  
- Quando si importa per assegnare interni ad utenti già esistenti (utenti presenti ma senza interno), il campo PASSWORD viene ignorato per quegli utenti.  
- Le righe che iniziano con `#` sono trattate come commenti e vengono ignorate.

:::tip
- Mantieni la codifica del file in UTF‑8 ed evita caratteri speciali nel campo nickname per prevenire problemi di importazione.
:::

## Trunk

I trunk sono le connessioni che consentono al tuo PBX di inviare e ricevere chiamate verso e da reti esterne. Agiscono come ponte tra gli interni interni e la rete telefonica pubblica o i provider di telefonia cloud. I trunk possono essere implementati come linee VoIP basate su cloud o come connessioni fisiche on-premise utilizzando gateway per interfacciarsi con la PSTN.

- Trunk VoIP (cloud)
  - Ospitati da un provider di servizi e forniti su Internet utilizzando SIP/PJSIP.
  - Pro: rapido da implementare, altamente scalabile, costo iniziale inferiore, ridondanza e funzionalità gestite dal provider (credenziali SIP, codec, crittografia).
  - Contro: dipende dall'affidabilità e dalla larghezza di banda di Internet; potrebbe richiedere la configurazione di firewall/NAT e QoS.
  - Ideale quando preferisci implementazioni flessibili e incentrate sul cloud e scalabilità rapida.

- Trunk fisici (on-premise tramite gateway)
  - Utilizzano gateway hardware dedicati per collegare il PBX ai servizi linea terrestre (FXO/PRI/ISDN).
  - Pro: connettività PSTN diretta, spesso latenza inferiore e comportamento prevedibile, funziona senza dipendenza da Internet, richiesto in alcuni ambienti regolamentati.
  - Contro: costo hardware e manutenzione iniziale più elevato, configurazione specifica del modello, scalabilità limitata rispetto ai trunk cloud.
  - Ideale quando è richiesta la connettività telco locale, i vincoli normativi o la resilienza offline.

### Aggiungi linee fisiche

Per aggiungere linee fisiche, è necessario configurare un gateway SIP supportato. Vedi la sezione [Gateway supportati](../provisioning/supported_gateways.md) per un elenco dei dispositivi compatibili.

Vedi la sezione [Provisioning del gateway](../provisioning/gateway_provisioning.md) per istruzioni dettagliate su come configurare e fornire il tuo gateway.

Una volta salvate le impostazioni, puoi scaricare il file di configurazione da caricare sul dispositivo tramite la sua interfaccia.

Se non desideri aggiungere linee fisiche, puoi saltare questa sezione facendo clic sul pulsante **Avanti** per procedere ai trunk VoIP.

### Aggiungi trunk VoIP

Puoi creare trunk VoIP selezionando uno dei provider supportati e immettendo le informazioni necessarie.

- **Provider**: Scegli il provider da utilizzare.
- **Nome trunk**: Specifica il nome del trunk.
- **Nome utente**: Nome utente fornito dal provider.
- **Password**: Password fornita dal provider.
- **Numero telefonico**: Numero telefonico fornito dal provider.
- **Codec consentito**: Codec consentito.
- **Forza codec**: Consenti solo il codec consentito.

Premere **Salva** per creare la configurazione per quel trunk VoIP.

Infine, fai clic sul pulsante **Avanti** per procedere alla sezione Percorsi.

## Percorsi

I percorsi in entrata definiscono come le chiamate in arrivo vengono abbinate e instradate verso destinazioni interne; i percorsi in uscita determinano come le chiamate interne vengono inviate tramite trunk. Salva il percorso per applicare le modifiche e iniziare a ricevere chiamate secondo le regole configurate. Nella sezione Percorsi puoi configurare sia i percorsi in entrata che in uscita — ogni tipo è spiegato in dettaglio di seguito.

### In entrata

I percorsi in entrata definiscono come le chiamate in arrivo dai trunk vengono abbinate e gestite prima di raggiungere le tue risorse interne. In genere corrispondono al numero chiamato (DID/DDI), all'ID chiamante o alle condizioni di tempo e quindi inoltrano la chiamata a una destinazione come un interno, IVR, coda, gruppo ring o un flusso Visual Plan.

Punti chiave:
- Criteri di corrispondenza: pattern DID/DDI, ID chiamante e condizioni di tempo (le corrispondenze più specifiche hanno la precedenza).
- Destinazioni: qualsiasi endpoint interno o un percorso Visual Plan che implementa la logica di gestione delle chiamate.
- Opzioni aggiuntive: riscrittura dei numeri (chiamato/chiamante), elenchi di blocco/permesso delle chiamate e comportamenti di failover.
- Best practice: testare le corrispondenze con numeri rappresentativi e assicurarsi che i trunk utilizzati per la corrispondenza siano abilitati e opportunamente ordinati.

Fai clic su **Crea nuovo percorso** per aprire l'applicazione Visual Plan, dove puoi creare, modificare e connettere i componenti di NethVoice che gestirà il flusso di chiamate per il numero in arrivo.

Facendo clic sul simbolo di spunta nell'applicazione Visual Plan, la configurazione del tuo percorso verrà salvata.
Da quel momento in poi, puoi ricevere chiamate seguendo il flusso configurato.

### In uscita

I percorsi in uscita determinano come le chiamate in uscita dal tuo PBX vengono abbinate e inviate attraverso i trunk disponibili. Pensale come le regole che mappano un numero composto internamente a un trunk (o una sequenza di trunk) in base a pattern, ID chiamante, condizioni di tempo e altri criteri. I percorsi in uscita configurati correttamente garantiscono che le chiamate prendano il percorso disponibile migliore, forniscano failover prevedibile e rispettino i piani di composizione locali.

La procedura guidata mostra un elenco di percorsi in uscita. Al primo utilizzo suggerisce percorsi predefiniti che coprono piani di composizione comuni:

- Nazionale: chiamate all'interno del paese
- Cellulare: chiamate a numeri mobile
- Internazionale: chiamate al di fuori del paese
- Pagamento: numeri toll-free e tariffari premium

I modelli di corrispondenza sono già definiti per ogni percorso.
All'interno di ogni percorso è possibile aggiungere o rimuovere i trunk associati.

Premendo il pulsante **Salva**, la configurazione viene scritta in NethVoice e il percorso diventa attivo. 

## Dispositivi

I dispositivi sono telefoni fisici (da scrivania) che si registrano al PBX e sono associati agli utenti. 

Configura i telefoni da scrivania e i loro modelli: aggiungi telefoni per MAC (manuale o batch), scegli o crea modelli e regola il provisioning, le impostazioni predefinite e le opzioni per dispositivo.

### Telefoni

Durante la procedura guidata puoi aggiungere telefoni utilizzando uno dei seguenti metodi:

- Copia un elenco di indirizzi MAC da un foglio di calcolo o file di testo (importazione batch).
- Immetti l'indirizzo MAC e il modello manualmente, uno telefono alla volta.

Seleziona il metodo che preferisci: Manuale (immissione singola) o Incolla da file (importazione batch).

Formato di importazione batch per gli indirizzi MAC:
 
- Input: testo semplice, *un indirizzo MAC per riga*.
- Separatori accettati: `:` o `-` tra i numeri, o nessun separatore.
- MAC valido: esattamente 12 caratteri esadecimali (6 ottetti); i numeri esadecimali non fanno distinzione tra maiuscole e minuscole.
- Gli spazi bianchi iniziali e finali su ogni riga vengono ignorati.
- Le righe vuote vengono ignorate e possono essere utilizzate per separare i gruppi.
- Esempi di forme accettate (illustrativi): `aa:bb:cc:dd:ee:ff`, `aa-bb-cc-dd-ee-ff`, `aabbccddeeff`.

Dopo aver immesso l'indirizzo MAC, puoi selezionare il modello di telefono. Selezionare il modello esatto è necessario per la corretta configurazione del telefono.

:::warning
Se il modello non è selezionato o viene scelto il modello sbagliato, alcune funzioni del telefono, come il provisioning tramite RPS o i tasti linea, potrebbero non essere disponibili.
:::

### Modelli

La pagina Dispositivi > Modelli mostra i modelli di telefono disponibili in Dispositivi > Telefoni (modelli integrati più eventuali modelli personalizzati creati). Utilizza Crea nuovo modello per basare un profilo personalizzato su un modello esistente.

Impostazioni:
- Utilizza **Impostazioni predefinite** per modificare i parametri ereditati da tutti i modelli, come:
  - **Password amministratore**: password dell'interfaccia web per l'utente amministratore, ne viene generata una casuale.
  - **Password utente**: password dell'interfaccia web per utenti non amministratori, ne viene generata una casuale.
  - **Lingua del telefono**: impostazione della lingua per il telefono.
  - **Zona tono**: impostazioni del tono audio per il telefono.
  - **Pianificazione del provisioning**: programma per gli aggiornamenti automatici del provisioning.

I valori predefiniti salvati possono essere modificati in seguito facendo clic di nuovo sul pulsante **Impostazioni predefinite**.

## Configurazioni

Questa sezione configura NethVoice CTI (Computer Telephony Integration) — il client web utilizzato dagli utenti finali per gestire le chiamate, la presenza, i contatti, le code e le funzionalità telefoniche correlate. CTI = Integrazione Telefonica Computerizzata. Le seguenti sottosezioni spiegano come creare gruppi, profili e autorizzazioni che controllano quali funzionalità sono disponibili nell'interfaccia CTI.

### Gruppi

I gruppi sono raccolte denominate di utenti che semplificano la gestione e il controllo all'interno di NethVoice CTI. Utilizza i gruppi per controllare la visibilità e le autorizzazioni su più utenti contemporaneamente.
I gruppi CTI sono diversi dai gruppi dei domini utente.

Usi comuni
- Controllare la visibilità nel Pannello di presenza e nelle interfacce CTI (mostra/nascondi gli utenti per gruppo).
- Abilitare le statistiche CDR e coda a livello di gruppo (Group CDR, visibilità Queue Agent/Manager).
- Assegnare funzionalità condivise come il prelevamento delle chiamate, la segreteria telefonica di gruppo o i compiti dell'operatore condivisi.
- Ambito autorizzazioni e profili in modo che le impostazioni possano essere applicate a molti utenti simultaneamente.

Best practice
- Scegli nomi chiari e descrittivi (ad es. Sales_North, Support_Level1).
- Crea i gruppi prima, quindi assegnarli ai profili e alle autorizzazioni dove richiesto.
- Gestisci l'iscrizione dalle pagine Utenti o Gruppi; verifica la visibilità del gruppo nei relativi pannelli CTI.
- Testare il comportamento del gruppo con un utente di esempio prima della distribuzione diffusa.

Puoi creare gruppi di utenti che saranno visibili e utilizzabili in applicazioni come NethVoice CTI.

Per creare un gruppo, fai clic su **Crea nuovo gruppo**, specifica un nome (e una descrizione facoltativa), salva, quindi assegna gli utenti e abilita il gruppo dove necessario nei profili e nelle impostazioni CTI.

Fai clic su **Avanti** per procedere alla sezione Profili.

### Profili

I profili definiscono un set riutilizzabile di [autorizzazioni](#autorizzazioni) che agiscono come modelli di ruolo. Applica un profilo a un utente per concedere una combinazione predefinita di funzionalità CTI, accesso di instradamento, visibilità CDR, funzioni telefoniche e altre funzionalità di NethVoice.

Per impostazione predefinita, esistono tre profili:
- `Basic`: accesso minimo per gli utenti standard (chiamate, segreteria telefonica, CTI limitato).
- `Standard`: funzionalità tipiche dell'utente (presenza, rubrica, CTI di base e inoltro).
- `Advanced`: accesso ampio per gli utenti esperti (CTI avanzato, viste coda/manager, registrazione e monitoraggio).

Creazione e gestione dei profili:
1. Duplica un profilo esistente per preservare una linea di base.  
2. Fornisci un nome chiaro e una breve descrizione.  
3. Abilita o disabilita gruppi di funzionalità (CTI, Rubrica, CDR, Presenza, Code, Linee telefoniche, ecc.), imposta l'accesso alle rotte in uscita e seleziona i gruppi di utenti visibili.  
4. Assegna il profilo agli utenti nella pagina Utenti.

Best practice:
- Mantieni un piccolo set di profili ben documentati per semplificare l'amministrazione.  
- Utilizza nomi descrittivi (ad es. Sales_Rep, Support_Level1) e registra l'utilizzo previsto.  
- Testare le modifiche del profilo su un utente di esempio prima del rollout diffuso.  
- Ricordati di abilitare l'accesso ai gruppi di utenti precedentemente creati nei profili dove necessario.

Quindi fai clic su **Avanti** per procedere alla sezione Utenti.

#### Autorizzazioni

Le autorizzazioni controllano funzionalità e capacità specifiche all'interno di NethVoice CTI. Sono raggruppate in sezioni che corrispondono a diverse aree funzionali. Quando crei o modifichi un profilo, puoi abilitare o disabilitare le singole autorizzazioni per personalizzare l'esperienza dell'utente.

##### Impostazioni

L'autorizzazione generale abilita o disabilita l'accesso a tutte le funzionalità della sezione e alle impostazioni generali di notifica.
Le autorizzazioni disponibili sono:

- `DND`: Abilita la configurazione di Non disturbare.
- `Inoltro di chiamata`: Abilita la configurazione dell'inoltro di chiamata.
- `Registrazione`: Abilita la registrazione delle proprie conversazioni. È inoltre possibile visualizzare, ascoltare ed eliminare le proprie registrazioni.
- `Parcheggi`: Abilita la visualizzazione dello stato dei posti auto e la possibilità di prelevare le chiamate parcheggiate.
- `Ascolto`: Abilita l'ascolto delle chiamate di altri utenti.
- `Intrusione`: Abilita l'intrusione nella chiamata di un altro utente (ascolto sia del chiamante che del chiamato, conversazione solo con l'utente).
- `Prelevamento`: Abilita il prelevamento delle chiamate per le chiamate ad altri utenti.
- `Privacy`: Abilita la mascheratura degli ultimi tre cifre (modificabili da riga di comando) del numero chiamato e/o del numero chiamante di altri utenti in NethVoice CTI.
- `Pulsanti telefono fisico`: Abilita la configurazione dei pulsanti del telefono fisico da parte dell'utente in NethVoice CTI.
  Questi corrispondono ai tasti linea mostrati nelle pagine `wizard-devices`.

##### Percorsi in uscita

Tutti i percorsi in uscita configurati in NethVoice vengono visualizzati e puoi abilitare/disabilitare il loro utilizzo singolarmente.

##### NethVoice CTI

- `NethVoice CTI`: Abilita tutte le autorizzazioni sottostanti attivando le seguenti funzionalità su NethVoice CTI.

##### Rubrica

- `Rubrica`: abilita l'accesso alla rubrica in NethVoice CTI. Se questa autorizzazione è disabilitata, l'utente non può cercare o aprire contatti CTI o contatti provenienti da fonti centralizzate.
- `Access phonebook`: consente di cercare e visualizzare i contatti, inclusi quelli importati dalle fonti centralizzate, ma non consente di creare, modificare, eliminare o condividere contatti CTI.
- `Manage private contacts`: consente di creare, modificare ed eliminare solo i contatti CTI privati dell'utente.
- `Manage private and shared contacts`: consente di creare, modificare ed eliminare contatti CTI con visibilità privata, pubblica o di gruppo. Consente anche di gestire contatti CTI non appartenenti all'utente.
- La condivisione per gruppi è disponibile solo con `Manage private and shared contacts`. I gruppi selezionabili sono quelli abilitati nei permessi del Pannello di presenza, più i gruppi operatori a cui appartiene l'utente. Se il permesso `all_groups` del Pannello di presenza è abilitato, sono disponibili tutti i gruppi operatori.
- I contatti importati tramite Fonti della rubrica restano in sola lettura in NethVoice CTI, indipendentemente dal livello di permesso rubrica selezionato.
- Per compatibilità con i profili esistenti, il permesso legacy `ad_phonebook` viene trattato come livello massimo, equivalente a `Manage private and shared contacts`.

##### CDR

- `CDR`: L'autorizzazione generale abilita la visualizzazione della cronologia delle chiamate relativa all'utente.
- `PBX CDR`: Abilita la visualizzazione della cronologia delle chiamate per l'intero PBX.
- `Group CDR`: Abilita la visualizzazione della cronologia delle chiamate per le chiamate all'interno del gruppo assegnato.

##### Schede cliente

- `Schede cliente`: L'autorizzazione generale abilita la possibilità di visualizzare la scheda cliente su NethVoice CTI.
- Per ogni sezione della scheda cliente, puoi abilitare/disabilitare la visibilità.

##### Pannello di presenza

- L'autorizzazione generale abilita la visualizzazione del pannello dell'operatore in NethVoice CTI.
- `Registrazione avanzata`: Abilita la registrazione delle chiamate di altri utenti.
- `Trasferimento di chiamata`: Abilita il trasferimento di chiamata per le chiamate di altri utenti.
- `Parcheggio avanzato`: Abilita la possibilità di parcheggiare le chiamate di altri utenti e recuperarle.
- `Riattacca`: Abilita la possibilità di riattaccare le chiamate di altri utenti.
- `Telefono avanzato`: Abilita le funzionalità del telefono (riattacca, chiama, rispondi) sulle conversazioni che non appartengono all'utente.
- Per ogni gruppo di utenti configurato in NethVoice, puoi abilitare/disabilitare la visibilità.

##### Pannello agente coda

- L'autorizzazione generale abilita la sezione Queue in NethVoice CTI con informazioni sulle code assegnate, la possibilità di accedere/uscire e entrare/uscire pausa.
- `Pannello agente coda avanzato`: Abilita informazioni avanzate sullo stato delle code e degli agenti.
- `Chiamate non riscosse`: Abilita l'accesso alla sezione delle chiamate non riscosse.

##### Linee telefoniche

- L'autorizzazione generale abilita l'accesso alla sezione orari di chiusura di NethVoice CTI, consentendo all'utente di modificare il percorso delle proprie chiamate in arrivo.
- `Orari di chiusura avanzati`: Consente di modificare il percorso delle chiamate in arrivo per l'utente e i percorsi in arrivo generici.
- `Orari di chiusura completi`: Consente la modifica di tutti i percorsi delle chiamate in arrivo.

##### Gestore coda

- L'autorizzazione generale abilita l'accesso alla sezione QManager in NethVoice CTI.
- Per ogni coda configurata in NethVoice, puoi abilitare/disabilitare la visibilità dello stato e dei dati.

##### Stazione operatore

- L'autorizzazione generale concede l'accesso alla sezione della stazione dell'operatore in NethVoice CTI.
- È necessario abilitare solo una coda configurata in NethVoice per servire come fonte di chiamate da gestire.

## Utenti

La pagina Utenti ti consente di configurare le impostazioni per utente e gestire i dispositivi associati a ogni account.

Impostazioni configurabili chiave
- **Profilo**: Assegna il set di autorizzazioni che determina le funzionalità dell'utente.
- **Gruppo**: Aggiunge l'utente a un gruppo denominato per semplificare la gestione delle policy e della visibilità.
- **Mobile**: Archivia un numero mobile per la visualizzazione nel pannello dell'operatore e la gestione della presenza.
- **Cassetta postale della segreteria telefonica**: Abilita una cassetta postale della segreteria telefonica per ricevere le chiamate che l'utente non risponde.
- **Associa dispositivo**: Assegna un telefono non associato (con provisioning o personalizzato) all'utente. Per i dispositivi non supportati dal provisioning, crea un dispositivo personalizzato e genera le credenziali per la configurazione manuale.

Panoramica dei dispositivi
- I dispositivi vengono visualizzati dopo le impostazioni dell'utente e possono essere endpoint software (Web Phone, Mobile App, Phone Link, client Desktop) o telefoni fisici gestiti tramite provisioning o come dispositivi personalizzati.
- Ogni utente può avere fino a 9 dispositivi associati.

Tipi di dispositivi comuni
- **Web Phone**: Attiva il client telefonico basato su browser in NethVoice CTI.
- **Mobile App**: Abilita l'integrazione dello smartphone attraverso il client mobile supportato.
- **Phone Link**: Collega un endpoint di telefonia personale del computer (integrazione desktop leggera).
- **Desktop Phone / NethLink**: Applicazione desktop (Windows/Mac) per effettuare e ricevere chiamate direttamente dal computer senza aprire l'interfaccia CTI web.

Dettagli del dispositivo fisico
Per ogni dispositivo fisico l'interfaccia utente mostra e consente la gestione di:
- **Crittografia**: Se la crittografia TLS/SRTP è abilitata. Questa impostazione è determinata dalla [configurazione del dispositivo](#dispositivi) iniziale. Se il PBX è accessibile dalla rete pubblica (WAN), la crittografia deve essere abilitata.
- **Modello di configurazione**: Seleziona o cambia il modello di dispositivo utilizzato per il provisioning.
- **Modifica configurazione**: Sostituisci i parametri a livello di modello/predefinito per questo specifico dispositivo. Le impostazioni del singolo dispositivo ereditano dal modello selezionato e dalle [impostazioni predefinite](#dispositivi)
- **Indirizzo MAC**: Visualizza l'indirizzo MAC del dispositivo (utilizzato per il provisioning e l'identificazione).
- **Mostra password**: Rivela la password SIP per i dispositivi personalizzati. Utilizzalo, insieme agli indirizzi interni e PBX, per configurare manualmente i dispositivi non gestiti dal provisioning.
- **Riavvia**: Riavvia il dispositivo in remoto se è registrato.
- **Scollega**: Rimuovi l'assegnazione del dispositivo dall'utente.

:::warning
Se la crittografia è abilitata, assicurati che il certificato SSL/TLS installato nel sistema sia valido e includa il nome host del PBX; in caso contrario, i telefoni non potranno stabilire connessioni TLS.
:::

Fai clic su **Avanti** per configurare alcune impostazioni finali nella sezione Amministrazione.

## Amministrazione

La sezione Amministrazione fornisce l'accesso alle funzioni di gestione essenziali per il sistema NethVoice, inclusa la configurazione della lingua, la gestione delle impostazioni e l'accesso all'interfaccia avanzata.

### Lingue

Nel menu Lingue, puoi impostare la lingua predefinita per NethVoice. Questa lingua verrà utilizzata in tutta l'interfaccia di amministrazione e influenzerà il modo in cui il contenuto viene visualizzato agli utenti.

Le lingue disponibili dipendono dai language pack installati nell'istanza di NethVoice.

### Impostazioni

La pagina Impostazioni ti consente di gestire vari aspetti della configurazione di NethVoice.

### Gestione password

- **Password**: Puoi cambiare la password per l'utente amministratore dedicato all'accesso all'interfaccia web di NethVoice.

Per modificare la password dell'amministratore:

1. Naviga in **Amministrazione > Impostazioni**
2. Individua il campo **Password**
3. Immetti una nuova password che soddisfi i tuoi requisiti di sicurezza
4. Fai clic su **Salva** per applicare le modifiche

:::warning
Assicurati di utilizzare una password forte per proteggere l'istanza di NethVoice dall'accesso non autorizzato.
:::

### Avanzate

La sezione Avanzate fornisce accesso diretto all'interfaccia avanzata di NethVoice.
Vedi la sezione [Avanzate](../advanced/index.md) per maggiori dettagli.
