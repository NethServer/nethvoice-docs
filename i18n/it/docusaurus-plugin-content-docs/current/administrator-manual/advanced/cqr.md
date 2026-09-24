---
title: Call Query Routing (CQR)
sidebar_position: 5
---

## Panoramica {#overview}

Il Call Query Routing (CQR) inverte il concetto di IVR tradizionale spostando la decisione su come gestire le chiamate in ingresso dal chiamante a NethVoice stesso. Invece di affidarsi all'input del chiamante attraverso un menu IVR, CQR consente a NethVoice di interrogare database esterni o interni (MySQL o MSSQL) in tempo reale per ottenere informazioni sul chiamante e instradare la chiamata di conseguenza.

Riconoscendo il chiamante attraverso il suo numero di telefono o un codice cliente, NethVoice può:
- Interrogare database per informazioni relative al chiamante
- Prendere decisioni di instradamento in base ai risultati della query
- Instradare le chiamate a destinazioni diverse in base allo stato del cliente

Questo rende CQR uno strumento flessibile che ottiene informazioni in tempo reale e adatta il comportamento dinamicamente. Con il cambio delle informazioni nel database, il comportamento di CQR si adatta automaticamente.

## Casi di utilizzo tipici {#use-cases}

Un esempio tipico è l'utilizzo di CQR per discriminare se un chiamante è un cliente pagante o meno:

- **Clienti paganti**: Instrada alla coda di supporto
- **Clienti insoluti**: Instrada all'amministrazione
- **Potenziali clienti**: Instrada al team commerciale

I requisiti chiave per CQR sono:
- Database accessibili da NethVoice
- Query correttamente configurate per interrogare il database

## Configurazione {#configuration}

### Prerequisiti {#prerequisites}

Il database deve essere raggiungibile da NethVoice e l'utente del database deve avere i permessi per eseguire le query configurate.

Il supporto MSSQL è già incluso in NethVoice. Configura la connessione usando i campi CQR descritti di seguito.

### Impostazioni di connessione MSSQL {#mssql-connection-settings}

Queste impostazioni si applicano sia alla query principale sia alla ricerca opzionale del codice cliente:

- **Tipo DB**: seleziona `MSSQL`.
- **URL DB**: inserisci il nome host o l'indirizzo IP del server, eventualmente seguito da due punti e dalla porta TCP, ad esempio `sql.example.com:1433`. Se la porta è omessa, CQR usa `1433`.
- **Nome DB**: inserisci il nome del database, ad esempio `customers`.
- **Utente** e **Password**: inserisci le credenziali del database.

Abilita TCP/IP su SQL Server e consenti le connessioni da NethVoice alla porta di ascolto dell'istanza. Per SQL Server Express, usa la porta TCP effettivamente configurata per l'istanza.

:::note SQL Server Express: sintassi con due punti e virgola
In alcune versioni di SQL Server Express, l'indirizzo del server richiede una virgola tra host e porta (`sql.example.com,1433`) anziché i due punti (`sql.example.com:1433`).

Se l'amministratore del database fornisce un indirizzo come `sql.example.com,1433`, inseriscilo come `sql.example.com:1433` nel campo **URL DB**. CQR gestisce automaticamente il formato richiesto.
:::

### Impostazioni di base {#basic-settings}

| Campo | Descrizione |
|-------|-------------|
| **Nome** | Nome del CQR utilizzato da NethVoice nelle destinazioni di instradamento |
| **Descrizione** | Descrizione del CQR |

### Risoluzione del codice cliente {#customer-code-resolution}

Abilita la ricerca del codice cliente se desideri che CQR risolva il codice cliente dal numero di telefono del chiamante.

| Campo | Descrizione |
|-------|-------------|
| **Usa codice cliente** | Abilita per attivare la ricerca del codice cliente dal numero del chiamante |
| **Tipo DB** | Tipo di database (MySQL o MSSQL) |
| **URL DB** | Indirizzo del server database; per MSSQL, vedi [Impostazioni di connessione MSSQL](#mssql-connection-settings) |
| **Nome DB** | Nome del database |
| **Utente** | Utente del database con permessi di query |
| **Password** | Password dell'utente del database |
| **Query** | Query SQL per recuperare il codice cliente dall'ID del chiamante; usa il placeholder `%CID%` per il numero del chiamante |
| **Inserimento manuale codice** | Abilita per richiedere l'inserimento manuale del codice cliente se la query fallisce |
| **Annuncio** | Registrazione di sistema da riprodurre quando si richiede l'inserimento manuale del codice |
| **Annuncio errore** | Registrazione di sistema da riprodurre se l'inserimento manuale del codice fallisce |
| **Lunghezza codice** | Lunghezza prevista del codice cliente per la convalida |
| **Max tentativi** | Numero di tentativi consentiti per l'inserimento manuale del codice |
| **Query di validazione** | Query per convalidare il codice cliente inserito manualmente; usa il placeholder `%CODCLI%` per il codice cliente |

#### Esempi di query del codice cliente

Recupera il codice cliente dal numero di telefono:
```sql
SELECT `customer_code` FROM `phonebook` WHERE `caller_id` = '%CID%'
```

Convalida il codice cliente inserito manualmente:
```sql
SELECT `customer_code` FROM `phonebook` WHERE `customer_code` = '%CODCLI%'
```

### Opzioni CQR {#cqr-options}

| Campo | Descrizione |
|-------|-------------|
| **Annuncio** | Messaggio riprodotto al chiamante mentre CQR elabora. La durata dovrebbe corrispondere al tempo di esecuzione della query |
| **Tipo DB** | Tipo di database (MySQL o MSSQL) per la query principale |
| **URL DB** | Indirizzo del server database per la query principale; per MSSQL, vedi [Impostazioni di connessione MSSQL](#mssql-connection-settings) |
| **Nome DB** | Nome del database |
| **Utente** | Utente del database con permessi di query |
| **Password** | Password dell'utente del database |
| **Query** | Query SQL per la decisione di instradamento; usa `%CID%` per l'ID del chiamante o `%CUSTOMERCODE%` se usi la ricerca del codice cliente |
| **Destinazione predefinita** | Route per le condizioni non corrispondenti o errori del database |

#### Esempi di query

Query per ID del chiamante:
```sql
SELECT `name` FROM `phonebook` WHERE `workphone` = '%CID%'
```

Query per codice cliente:
```sql
SELECT `name` FROM `phonebook` WHERE `customercode` = '%CUSTOMERCODE%'
```

### Regole di instradamento {#routing-rules}

Definisci le condizioni e le loro destinazioni corrispondenti. Ogni regola viene valutata in ordine in base alla posizione.

| Campo | Descrizione |
|-------|-------------|
| **Posizione** | Ordine in cui NethVoice valuta il risultato |
| **Condizione** | Valore di risultato della query possibile (uno per riga) |
| **Destinazione** | Destinazione di instradamento se il risultato della query corrisponde alla condizione |
| **Elimina** | Rimuovi questa regola di instradamento |

## Come funziona {#how-it-works}

1. **Chiamata in ingresso**: Il chiamante avvia la chiamata a NethVoice
2. **Identificazione del chiamante**: Estrai il numero di telefono del chiamante
3. **Ricerca codice cliente** (opzionale): Se abilitato, interroga il database per risolvere il codice cliente dall'ID del chiamante
4. **Inserimento manuale codice** (se necessario): Se la ricerca del codice cliente fallisce e l'inserimento manuale è abilitato, richiedi il codice al chiamante
5. **Query principale**: Interroga il database utilizzando l'ID del chiamante o il codice cliente
6. **Decisione di instradamento**: Valuta il risultato della query rispetto alle condizioni definite
7. **Instradamento della chiamata**: Instrada la chiamata alla destinazione corrispondente o alla destinazione predefinita se non c'è corrispondenza

## Migliori pratiche {#best-practices}

- **Prestazioni del database**: Assicurati che le query del database siano ottimizzate e responsabili
- **Durata dell'annuncio**: Imposta la durata dell'annuncio più lunga del tempo di esecuzione tipico della query
- **Placeholder delle query**: Usa sempre i placeholder `%CID%` o `%CUSTOMERCODE%`; non codificare mai i valori
- **Gestione degli errori**: Definisci sempre una destinazione predefinita per gli scenari di errore
- **Test**: Testa la connettività del database e l'accuratezza della query prima di distribuire in produzione
- **Connettività MSSQL**: Controlla l'indirizzo del server, la porta TCP, il nome del database e le credenziali configurate in CQR e verifica che SQL Server accetti connessioni da NethVoice
