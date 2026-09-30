---
title: Avviare la migrazione
sidebar_position: 2
---

# Avviare la migrazione

Questa guida vi guida attraverso il processo effettivo di migrazione di NethVoice da NethServer 7 a NethServer 8. La migrazione coinvolge il collegamento del sistema NS7 al cluster NS8, la sincronizzazione dei dati e l'esecuzione del passaggio finale.

## Panoramica

Il processo di migrazione converte l'installazione di NethVoice su NethServer 7 in un'applicazione NethServer 8 preservando:

- Tutte le registrazioni delle chiamate e i file audio
- Database CDR (Call Detail Records)
- Configurazioni delle estensioni
- Impostazioni dei trunk
- Configurazioni delle rotte
- Impostazioni di utenti e gruppi
- Dati della segreteria telefonica

**Cronologia della migrazione**:
- Configurazione iniziale: 15-30 minuti
- Sincronizzazione dei dati: 1-8 ore (dipende dal volume dei dati)
- Cicli di sincronizzazione multipli: Come necessario per ridurre al minimo il downtime
- Passaggio finale: 30 minuti - 2 ore

:::info Installazione automatica di NethVoice Proxy
Se NethVoice Proxy non è già installato sul nodo di destinazione, lo strumento di migrazione lo installerà automaticamente. Tuttavia, dovrete configurarlo manualmente dopo il completamento della migrazione. Vedi [Documentazione Proxy NethVoice](../../administrator-manual/advanced/nethvoice_proxy.md) per i dettagli di configurazione.
:::

## Passaggio 1: Installare lo strumento di migrazione su NS7

La migrazione inizia con l'installazione dello strumento di migrazione sul sistema NethServer 7.

### Passaggi di installazione

1. **Accedere all'interfaccia Cockpit di NS7**
   - Aprire il browser web
   - Navigare verso: `https://<ns7-server>:9090`
   - Accedere con le credenziali root o amministrative

2. **Navigare al Software Center**
   - Fare clic su **Software Center** nella barra laterale sinistra
   - Attendere il caricamento dell'elenco delle applicazioni

3. **Installare Migrazione a NS8**
   - Nella casella di ricerca, digitare: `Migration to NS8`
   - Individuare l'applicazione "Migration to NS8"
   - Fare clic sul pulsante **Install**
   - Attendere il completamento dell'installazione (in genere 2-5 minuti)

4. **Aprire l'applicazione di migrazione**
   - Dopo l'installazione, l'applicazione appare nella barra laterale sinistra
   - Fare clic su **NS8 Migration** per aprirla
   - Verrà visualizzata la pagina di connessione

:::tip Verifica dell'installazione
Dopo l'installazione, dovreste vedere un modulo di connessione che richiede i dettagli del cluster NS8. Se visualizzate un errore, controllate i log del sistema NS7 e assicuratevi che tutti gli aggiornamenti siano installati.
:::

## Passaggio 2: Connettere NS7 al cluster NS8

Questo passaggio stabilisce una connessione sicura tra il sistema NS7 e il cluster NS8.

### Parametri di connessione

Compilate il modulo di connessione con le seguenti informazioni:

#### Campi obbligatori

| Campo | Descrizione | Esempio |
|-------|-------------|---------|
| **Nodo leader NS8** | Nome host o indirizzo IP del leader del cluster NS8 | `ns8.example.com` o `192.168.1.100` |
| **Nome utente amministratore NS8** | Nome utente dell'amministratore per NS8 | `admin` |
| **Password amministratore NS8** | Password dell'amministratore per NS8 | La vostra password sicura |
| **Dominio utente LDAP** | (Solo se si utilizza OpenLDAP locale) Nome di dominio univoco in NS8 | `nethvoice.local` |
| **Convalidazione TLS** | Casella di controllo per la convalidazione del certificato | Deselezionare se nessun certificato TLS valido |

#### Dettagli del campo

**Nodo leader NS8**:
- Inserire il nome di dominio completamente qualificato (FQDN) del vostro leader NS8
- In alternativa, utilizzare l'indirizzo IP se il DNS non è configurato
- Dovrebbe essere lo stesso indirizzo utilizzato per accedere all'interfaccia web NS8

**Credenziali amministratore NS8**:
- Queste credenziali vengono utilizzate solo per creare un account di migrazione temporaneo (`ns7admin1`)
- L'account temporaneo viene rimosso automaticamente al completamento della migrazione
- La vostra password amministratore non viene archiviata in modo permanente

**Dominio utente LDAP** (Solo OpenLDAP):
- Questo campo appare solo se NS7 utilizza un provider di account OpenLDAP locale
- Scegliete un nome univoco che non entri in conflitto con i domini NS8 esistenti
- Il database LDAP di NS7 verrà rinominato in questo dominio durante la migrazione
- Esempio: Se il vostro dominio NS7 è `example.local`, potreste utilizzare `nethvoice-example.local`

**Convalidazione TLS**:
- Selezionare questa casella se il leader NS8 ha un certificato TLS valido e attendibile
- Deselezionare se si utilizzano certificati autofirmati o accesso tramite indirizzo IP
- Quando deselezionato, la connessione accetta qualsiasi certificato

### Processo di connessione

1. **Compilare tutti i campi obbligatori**
   - Verificare attentamente l'indirizzo del leader NS8
   - Verificare che le credenziali amministrative siano corrette
   - Scegliere il nome di dominio appropriato se si utilizza OpenLDAP

2. **Fare clic sul pulsante "Connect"**
   - Il sistema stabilisce una connessione VPN a NS8
   - Un account amministrativo temporaneo (`ns7admin1`) viene creato
   - NS7 si registra come un nodo speciale nel cluster NS8

3. **Attendere la conferma della connessione**
   - Vedrete un messaggio di successo quando connessi
   - Apparirà la pagina dell'elenco delle applicazioni
   - NethVoice dovrebbe essere elencato tra le applicazioni disponibili

:::warning Impatto dell'abbonamento attivo
Se NS8 ha un piano di abbonamento attivo, gli aggiornamenti automatici del sistema verranno sospesi durante la migrazione. Gli aggiornamenti riprenderanno automaticamente dopo la rimozione di NS7 dal cluster al completamento della migrazione.
:::

### Risoluzione dei problemi di connessione

**Problema: Impossibile connettersi al leader NS8**
- Verificare che l'indirizzo del leader NS8 sia corretto e raggiungibile
- Verificare che la porta VPN 55820 non sia bloccata dai firewall
- Testare la connettività: `nc -zv <ns8-leader> 55820` da NS7

**Problema: Autenticazione non riuscita**
- Verificare che il nome utente e la password dell'amministratore siano corretti
- Assicurarsi che l'account amministratore sia attivo in NS8
- Verificare i requisiti di complessità della password

**Problema: Conflitto di nomi di dominio**
- Scegliere un nome di dominio diverso
- Verificare i domini esistenti in NS8 in "Domains and users"
- Assicurarsi che il nome sia univoco in tutto il cluster

Per ulteriori dettagli sulla configurazione del provider di account, vedere la [sezione Account Provider](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#account-provider) della guida di migrazione ufficiale.

## Passaggio 3: Migrazione dell'applicazione NethVoice

Una volta connesso, è possibile iniziare il processo di migrazione di NethVoice. Questo coinvolge tre fasi: avvio della migrazione, sincronizzazione dei dati e completamento della migrazione.

### Fase 1: Avvio della migrazione

Questa fase installa NethVoice su NS8 e esegue la sincronizzazione iniziale dei dati.

#### Passaggi per avviare

1. **Individuare NethVoice nell'elenco delle applicazioni**
   - Dopo la connessione riuscita, vedrete un elenco delle applicazioni NS7 installate
   - Trovate **NethVoice** nell'elenco
   - Rivedete lo stato corrente e la configurazione

2. **Fare clic sul pulsante "Start Migration"**
   - Fare clic sul pulsante verde **Start migration** accanto a NethVoice
   - Apparirà una finestra di dialogo con opzioni di migrazione

3. **Selezionare il nodo di destinazione** (Solo cluster multi-nodo)
   - Se il cluster NS8 ha più nodi, selezionare il nodo di destinazione
   - Scegliere un nodo con risorse adeguate
   - Considerare la prossimità della rete agli utenti

4. **Inserire la configurazione specifica di NethVoice**

   Il sistema richiederà due FQDN:

   | Scopo FQDN | Descrizione | Esempio |
   |------------|-------------|---------|
   | **Host base NethVoice** | FQDN per l'interfaccia di amministrazione | `nethvoice.example.com` |
   | **Host base NethVoice CTI** | FQDN per l'applicazione web CTI | `cti.example.com` |

   :::warning Requisiti FQDN
   - Entrambi gli FQDN devono essere univoci e non attualmente in uso
   - Sarà necessario aggiornare i record DNS dopo la migrazione
   - Non possono essere facilmente modificati dopo il completamento della migrazione
   :::

5. **Confermare e avviare**
   - Rivedere attentamente le voci
   - Fare clic su **Confirm** o **Start**
   - Il processo di migrazione inizia

#### Cosa succede durante l'avvio

- L'applicazione NethVoice viene installata sul nodo NS8
- Se NethVoice Proxy non è installato, viene installato automaticamente
- La sincronizzazione iniziale dei dati inizia:
  - Registrazioni delle chiamate
  - File audio
  - Database CDR
  - File di configurazione
  - Dati della segreteria telefonica
- L'avanzamento viene visualizzato sullo schermo

:::info Durata della sincronizzazione iniziale
La prima sincronizzazione può richiedere diverse ore a seconda del volume dei dati. Il sistema utilizza Rsync per il trasferimento efficiente dei dati.
:::

### Fase 2: Sincronizzazione dei dati

Questa è la fase più importante per ridurre al minimo il downtime finale. Eseguite più cicli di sincronizzazione per mantenere i dati di NS8 aggiornati.

#### Processo di sincronizzazione

1. **Monitorare la sincronizzazione iniziale**
   - Osservate l'indicatore di avanzamento
   - Verificate la presenza di messaggi di errore
   - Esaminate i file di log se necessario

2. **Fare clic sul pulsante "Sync Data"**
   - Dopo il completamento della sincronizzazione iniziale, il pulsante **Sync data** diventa disponibile
   - Fare clic per eseguire la sincronizzazione incrementale
   - Solo i dati modificati vengono trasferiti

3. **Ripetere la sincronizzazione più volte**
   - Eseguite sincronizzazioni regolarmente (giornalmente o più frequentemente)
   - Ogni sincronizzazione porta NS8 più vicino allo stato attuale di NS7
   - Il tempo di cutover finale è ridotto significativamente

#### Cosa viene sincronizzato

Ogni sincronizzazione trasferisce:
- **Nuove registrazioni di chiamate** dall'ultima sincronizzazione
- **File audio modificati**
- **Nuove voci CDR** nel database
- **Modifiche di configurazione**
- **Nuovi messaggi della segreteria telefonica**

#### Strategia di sincronizzazione

**Approccio consigliato**:
```
Giorno 1: Avvia migrazione → Sincronizzazione iniziale (più lunga)
Giorno 2: Sincronizza dati → Sincronizzazione incrementale
Giorno 3: Sincronizza dati → Sincronizzazione incrementale
Giorno 4: Sincronizza dati → Sincronizzazione incrementale
Giorno 5: Sincronizzazione finale → Completa migrazione (più breve)
```

:::tip Ridurre al minimo il downtime finale
Più volte eseguite la sincronizzazione, meno dati devono essere trasferiti durante il cutover finale. Puntate ad almeno 3-4 cicli di sincronizzazione prima di completare la migrazione.
:::

#### Monitoraggio dell'avanzamento della sincronizzazione

- **Interfaccia di migrazione NS7**: Mostra l'avanzamento e lo stato
- **File di log**: `/var/log/ns8-migration.log` su NS7
  ```bash
  # Monitorare il log in tempo reale
  tail -f /var/log/ns8-migration.log
  ```
- **Log dell'applicazione NS8**: Verificare il log dell'applicazione NethVoice in NS8

#### Gestione degli errori di sincronizzazione

Se si verificano errori durante la sincronizzazione:

1. **Esaminare i messaggi di errore**
   - Verificare l'interfaccia di migrazione per i dettagli
   - Esaminare `/var/log/ns8-migration.log`

2. **Problemi comuni**:
   - **Timeout di rete**: Verificare la connettività di rete, riprovare la sincronizzazione
   - **Spazio su disco**: Assicurarsi che NS8 abbia spazio sufficiente
   - **Errori di autorizzazione**: Verificare i permessi dei file su NS7

3. **Interrompere se necessario**
   - Se si verificano errori critici, fare clic su **Abort migration**
   - Questo rimuove l'istanza di NethVoice NS8
   - È possibile ricominciare dalla Fase 1
   - Nessun dato su NS7 è interessato

:::warning Non interrompere a meno che non sia necessario
L'interruzione della migrazione rimuove tutti i dati sincronizzati da NS8. Interrompete solo se riscontrate errori persistenti che non possono essere risolti.
:::

### Fase 3: Completamento della migrazione

Questo è il passaggio finale di cutover. Pianificate attentamente per ridurre al minimo l'impatto sull'utente.

#### Elenco di controllo pre-cutover

Prima di fare clic su "Finish migration":

- [ ] Eseguiti almeno 3-4 cicli di sincronizzazione dei dati
- [ ] L'ultima sincronizzazione completata con successo senza errori
- [ ] Finestra di downtime pianificata e comunicata agli utenti
- [ ] Record DNS preparati per l'aggiornamento
- [ ] Team di supporto in standby
- [ ] Piano di rollback documentato

#### Passaggi per completare la migrazione

1. **Pianificare il downtime**
   - Scegliere un periodo di utilizzo basso (sera, fine settimana)
   - Notificare tutti gli utenti in anticipo
   - Pianificare 30 minuti - 2 ore di downtime

2. **Eseguire la sincronizzazione finale**
   - Fare clic su **Sync data** un'ultima volta
   - Questo acquisisce eventuali ultimi cambiamenti
   - Attendere il completamento

3. **Fare clic sul pulsante "Finish Migration"**
   - Apparirà una finestra di dialogo di conferma
   - Rivedere attentamente l'avviso
   - Fare clic su **Confirm** per procedere

4. **L'esecuzione delle operazioni finali**
   - Sincronizzazione finale dei dati tramite Rsync
   - Finalizzazione della configurazione su NS8
   - NethVoice avviato su NS8
   - NethVoice fermato su NS7

#### Cosa accade automaticamente

Quando si completa la migrazione, il sistema esegue queste azioni:

| Azione | Dettagli |
|--------|---------|
| **Configurazione NS8** | NethVoice è completamente configurato con i dati migrati |
| **Inizio servizio NS8** | I servizi NethVoice si avviano su NS8 |
| **Arresto servizio NS7** | NethVoice è fermato e disabilitato su NS7 |
| **Pagina di reindirizzamento** | NS7 visualizza il reindirizzamento HTML ai nuovi FQDN |
| **Provider di account** | Il dominio esterno temporaneo mantiene l'accesso (se applicabile) |
| **Cambio configurazione provisioning** | Ai telefoni viene dato FQDN nuovo (vedi info sotto) | 

:::info PROVISIONING TELEFONI
La finalizzazione della migrazione configura come FQDN di provisioning per i telefoni quello di NethVoice su NS8 e forza il provisioning per recepire il cambiamento (la forzatura può avvenire solo per i telefoni online e registrati). 
Per avere i telefoni funzionanti sul nuovo NethVoice basterà quindi riavviarli.
:::


:::info Pagina di reindirizzamento
Gli utenti che accedono agli URL NethVoice precedenti su NS7 vedranno una pagina di reindirizzamento con link ai nuovi FQDN NS8. Questo aiuta gli utenti a trovare la nuova posizione.
:::

#### Attività post-completamento

Dopo il completamento della migrazione:

1. **Verificare i servizi NS8**
   - Verificare che NethVoice sia in esecuzione su NS8
   - Accedere all'interfaccia di amministrazione
   - Accedere all'interfaccia CTI
   - Esaminare i log per gli errori

2. **NON aggiornare il DNS ancora**
   - Attendere per verificare che tutto funzioni
   - Vedere i prossimi passaggi per le procedure di aggiornamento del DNS

## Passaggio 4: Configurare NethVoice Proxy

Se NethVoice Proxy è stato installato automaticamente durante la migrazione, dovete configurarlo ora.

### Verificare lo stato del proxy

1. **Accedere all'interfaccia NS8**
2. **Navigare verso Applicazioni**
3. **Trovare "NethVoice Proxy"**
4. **Verificare se è appena installato** (installato durante la migrazione)

### Configurazione richiesta

Se il proxy è stato auto-installato, configurate:

1. **FQDN proxy**
   - Impostare un nome di dominio completamente qualificato valido
   - Esempio: `proxy.example.com`

2. **Interfaccia di rete**
   - Selezionare l'interfaccia per il traffico VoIP
   - Tipicamente l'interfaccia di rete principale

3. **Indirizzo IP pubblico**
   - Impostare se diverso dall'IP dell'interfaccia
   - Obbligatorio se dietro NAT

4. **Porte SIP/RTP**
   - Verificare le porte predefinite o personalizzarle
   - Assicurarsi che le porte siano aperte nel firewall

Per i passaggi di configurazione dettagliati, vedere:
➡️ **[Guida alla configurazione di NethVoice Proxy](../../administrator-manual/advanced/nethvoice_proxy.md)**

:::warning La configurazione del proxy è critica
Le chiamate esterne e le registrazioni dei telefoni non funzioneranno correttamente fino a quando il proxy non sarà correttamente configurato. Non saltate questo passaggio!
:::

## Passaggio 5: Aggiornare i record DNS

Una volta verificato che NethVoice funziona su NS8, aggiornate i record DNS.

### Aggiornamenti DNS richiesti

Aggiornare i seguenti record DNS per puntare al nodo NS8:

| Tipo di record | Nome | Punta a | Esempio |
|---|---|---|---|
| **Record A** | FQDN amministratore NethVoice | IP nodo NS8 | `nethvoice.example.com` → `192.168.1.100` |
| **Record A** | FQDN NethVoice CTI | IP nodo NS8 | `cti.example.com` → `192.168.1.100` |
| **Record A** | FQDN NethVoice Proxy | IP nodo NS8 | `proxy.example.com` → `192.168.1.100` |

### Processo di aggiornamento del DNS

1. **Accedere al server DNS**
   - Accedere all'interfaccia di gestione DNS
   - O accedere al pannello di controllo del provider DNS

2. **Aggiornare o creare record A**
   ```
   nethvoice.example.com.  IN  A  192.168.1.100
   cti.example.com.        IN  A  192.168.1.100
   proxy.example.com.      IN  A  192.168.1.100
   ```

3. **Verificare la propagazione del DNS**
   ```bash
   # Verificare la risoluzione del DNS
   nslookup nethvoice.example.com
   nslookup cti.example.com
   nslookup proxy.example.com
   
   # O utilizzare dig
   dig nethvoice.example.com +short
   ```

4. **Attendere la propagazione**
   - DNS interno: Solitamente immediato
   - DNS pubblico: Può richiedere 24-48 ore
   - Un TTL basso aiuta ad accelerare la propagazione

:::tip Test DNS
Testare il DNS da posizioni diverse (rete interna, rete esterna, ISP diversi) per assicurare una corretta propagazione prima di disattivare NS7.
:::

### Abilitare il certificato Let's Encrypt per NethVoice

Se volete utilizzare un certificato TLS fornito da Let's Encrypt per NethVoice:

1. **Aprire le impostazioni dell'applicazione NethVoice**
   - Accedere all'interfaccia web di NS8
   - Aprire la vostra applicazione di **NethVoice**
   - Aprire la sezione **Impostazioni**

2. **Abilitare la richiesta del certificato Let's Encrypt**
   - Individuare la sezione TLS/Certificato
   - Abilitare il toggle **Richiedi certificato Let's Encrypt**
   - Assicurarsi che:
     - Gli FQDN di NethVoice risolvano pubblicamente verso il nodo NS8
     - La porta TCP 443 sia raggiungibile da Internet

3. **Confermare e attendere l'emissione**
   - Salvare la configurazione
   - Attendere che la configurazione venga applicata
   - Se la richiesta fallisce, verificare DNS, firewall e log, quindi riprovare

Usate questo passaggio solo se è necessario (o preferito) un certificato Let's Encrypt invece di un certificato personalizzato.

## Riepilogo del processo di migrazione

Ecco il flusso di lavoro completo della migrazione:

```
1. Installare lo strumento di migrazione su NS7
   ↓
2. Connettere NS7 al cluster NS8
   - Inserire i dettagli del leader NS8
   - Fornire le credenziali amministrative
   - Impostare il nome di dominio (se OpenLDAP)
   ↓
3. Avviare la migrazione di NethVoice
   - Fornire due FQDN
   - Selezionare il nodo di destinazione
   - La sincronizzazione iniziale inizia
   ↓
4. Sincronizzare i dati (più volte)
   - Sincronizzazione #1 (incrementale)
   - Sincronizzazione #2 (incrementale)
   - Sincronizzazione #3+ (incrementale)
   ↓
5. Completare la migrazione
   - Pianificare il downtime
   - Sincronizzazione finale
   - Cutover dei servizi
   ↓
6. Configurare NethVoice Proxy
   - Impostare FQDN
   - Configurare la rete
   - Impostare IP pubblico
   ↓
7. Aggiornare i record DNS
   - Puntare gli FQDN a NS8
   - Verificare la propagazione
   - Testare l'accesso
   - Abilitare Let's Encrypt (opzionale)
   ↓
8. Verificare e testare
   (Vedere i passaggi successivi alla migrazione)
```

## Monitoraggio e log

Durante la migrazione, monitorare questi log:

### Su NethServer 7

**Log di migrazione**:
```bash
# Visualizzare il log di migrazione
tail -f /var/log/ns8-migration.log

# Cercare gli errori
grep -i error /var/log/ns8-migration.log

# Cercare le voci di NethVoice
grep -i nethvoice /var/log/ns8-migration.log
```

**Log di sistema**:
```bash
# Visualizzare i messaggi di sistema
tail -f /var/log/messages
```

### Su NethServer 8

**Log dell'applicazione**:
1. Accedere all'interfaccia web NS8
2. Andare a **Applications**
3. Fare clic sull'istanza di NethVoice
4. Aprire la scheda **Logs**
5. Rivedere l'attività `import-module`

**Via CLI**:
```bash
# Verificare i log dell'applicazione
api-cli run module/<nethvoice-instance>/get-logs
```

## Risoluzione dei problemi comuni

### Problema: Lo strumento di migrazione non viene installato

**Sintomi**: L'installazione non riesce o va in timeout

**Soluzioni**:
- Assicurarsi che NS7 abbia connettività Internet
- Aggiornare NS7 all'ultima versione
- Verificare che il Software Center stia funzionando
- Esaminare `/var/log/messages` per gli errori

### Problema: Impossibile connettersi a NS8

**Sintomi**: La connessione non riesce con timeout o errore di autenticazione

**Soluzioni**:
- Verificare che l'indirizzo del leader NS8 sia corretto
- Testare la porta VPN: `nc -zv <ns8-leader> 55820`
- Verificare le credenziali amministrative
- Verificare le regole del firewall
- Assicurarsi che il cluster NS8 sia in esecuzione

### Problema: NethVoice non è elencato

**Sintomi**: Dopo la connessione, NethVoice non appare nell'elenco delle applicazioni

**Soluzioni**:
- Verificare che NethVoice sia installato e in esecuzione su NS7
- Aggiornare la pagina dello strumento di migrazione
- Verificare i log dello strumento di migrazione
- Riconnettersi al cluster NS8

### Problema: La sincronizzazione continua a non riuscire

**Sintomi**: La sincronizzazione dei dati non riesce ripetutamente

**Soluzioni**:
- Verificare la stabilità della rete
- Verificare che sia disponibile spazio su disco su NS8
- Esaminare i messaggi di errore nei log
- Testare la connettività tra NS7 e NS8
- Verificare i permessi dei file su NS7

### Problema: Il completamento della migrazione si blocca

**Sintomi**: La migrazione finale non si completa

**Soluzioni**:
- Siate pazienti - ciò potrebbe richiedere tempo per set di dati di grandi dimensioni
- Monitorare i log per l'avanzamento
- Verificare l'I/O del disco su entrambi i sistemi
- Verificare che la connessione di rete sia stabile
- Contattate il supporto se bloccato per più di 2 ore

## Risorse aggiuntive

Per informazioni più dettagliate:

- **[Guida di migrazione completa NS8](https://docs.nethserver.org/projects/ns8/en/latest/migration.html)** - Procedure di migrazione complete
- **[Guida alla configurazione di NethVoice Proxy](../../administrator-manual/advanced/nethvoice_proxy.md)** - Guida alla configurazione del proxy
- **[Migrazione del provider di account](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#account-provider)** - Dettagli del provider di account
- **[Documentazione dei log di migrazione](https://docs.nethserver.org/projects/ns8/en/latest/migration.html#logs)** - Posizioni e significati dei file di log

## Passaggi successivi

Dopo il completamento della migrazione e l'aggiornamento del DNS:

➡️ **[Passaggi successivi alla migrazione](./post_migration)** - Verificare, testare e finalizzare la migrazione

:::tip Hai bisogno di aiuto?
Se riscontrate problemi durante la migrazione, consultate i [forum della comunità NethServer](https://community.nethserver.org/) o contattate il supporto NethVoice. Non procedete se non siete sicuri di un passaggio.
:::


