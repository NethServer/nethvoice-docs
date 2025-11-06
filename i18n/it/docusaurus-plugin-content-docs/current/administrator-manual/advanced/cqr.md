---
title: Call Query Routing (CQR)
sidebar_position: 3
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

Per le connessioni a database MSSQL, devi prima configurare la connessione ODBC. Fai riferimento alla documentazione della rubrica centralizzata per i dettagli sulla configurazione ODBC.

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
| **URL DB** | URL di connessione (usa `localhost` per il database interno di NethVoice) |
| **Nome DB** | Nome del database o nome DSN ODBC per MSSQL |
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
| **URL DB** | URL di connessione per la query principale |
| **Nome DB** | Nome del database o nome DSN ODBC per MSSQL |
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
- **Configurazione ODBC**: Per MSSQL, verifica che la configurazione ODBC sia correttamente impostata sull'host NethVoice
