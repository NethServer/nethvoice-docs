---
title: Trunk
sidebar_position: 4
---

# Trunk

Imparate come configurare e gestire i trunk all'interno della piattaforma. Questa sezione copre le basi della configurazione dei trunk, i diversi tipi di trunk, le migliori pratiche e suggerimenti per la risoluzione dei problemi.

Un trunk è una connessione che collega il vostro PBX NethVoice alla rete telefonica pubblica (PSTN) o a un altro sistema VoIP, consentendovi di effettuare e ricevere chiamate esterne.

## Tipi di Trunk

Ci sono due tipi principali di trunk SIP utilizzati in NethVoice, distinti dal loro metodo di autenticazione.

### Trunk con Registrazione (Trunk Registrazione)

Questo è il tipo di trunk più comune, generalmente utilizzato per connettersi a un provider di servizi di telefonia internet (ITSP).

- **Autenticazione**: Il trunk si autentica presso il provider utilizzando un nome utente e una password. NethVoice invia una richiesta `REGISTER` al server del provider, che conferma la connessione.
- **Indirizzo IP**: Questo metodo è appropriato per ambienti in cui NethVoice ha un indirizzo IP pubblico dinamico, poiché il processo di registrazione informa il provider dell'IP attuale.
- **Caso d'Uso**: Ideale per la maggior parte delle connessioni aziendali che si affidano a una linea internet standard.

### Trunk senza Registrazione (Basato su IP o Peer Trunk)

Questo tipo di trunk si autentica in base all'indirizzo IP del vostro sistema NethVoice.

- **Autenticazione**: Il provider è configurato per fidarsi e accettare chiamate provenienti dall'indirizzo IP pubblico statico specifico. Nessun nome utente o password viene scambiato per la registrazione.
- **Indirizzo IP**: Questo metodo richiede che il vostro sistema NethVoice abbia un indirizzo IP pubblico statico che non cambia.
- **Caso d'Uso**: Comunemente utilizzato per connessioni dirette tra due PBX in uffici diversi o per la connessione a provider che offrono autenticazione basata su IP.

## Migliori Pratiche per la Gestione dei Trunk

Seguire queste migliori pratiche aiuterà a garantire che le vostre connessioni di trunk siano sicure, affidabili ed efficienti.

1.  **Sicurezza Prima**:
    - Per i trunk registrati, utilizzate sempre password forti e univoche.
    - Per i trunk basati su IP, configurate il vostro firewall per consentire il traffico SIP e RTP **solo** dagli indirizzi IP specifici del provider. Ciò previene i tentativi di accesso non autorizzati.

2.  **Codec Coerenti**:
    - Configurate il vostro trunk per utilizzare un set limitato di codec esplicitamente supportati dal vostro provider (ad esempio, G.711 A-law, G.711 U-law, G.729).
    - Assicuratevi che la priorità del codec in NethVoice corrisponda alla preferenza del provider per evitare transcodifica non necessaria, che consuma risorse di sistema e può degradare la qualità audio.

3.  **Utilizzare Convenzioni di Denominazione Chiare**:
    - Date ai vostri trunk nomi descrittivi che siano facili da identificare, come `ProviderName_Main_Office` o `Backup_Provider_VoIP`. Ciò semplifica la gestione e la risoluzione dei problemi, specialmente in ambienti con più trunk.

4.  **Monitoraggio Regolare**:
    - Controllate periodicamente lo stato dei vostri trunk dall'interfaccia NethVoice per assicurarvi che siano registrati e che passino il traffico correttamente.
    - Impostate avvisi se il vostro sistema di monitoraggio lo supporta per essere notificati dei guasti dei trunk.

5.  **Pianificare la Ridondanza**:
    - Se la continuità delle chiamate è critica, considerate l'impostazione di un trunk secondario con un provider diverso.
    - Configurate le route di chiamate in uscita per effettuare automaticamente il failover al trunk di backup se quello primario diventa non disponibile.

6.  **Configurare le Regole di Composizione con Attenzione**:
    - Verificate due volte le vostre regole di composizione in uscita (rotte in uscita) per assicurarvi che le chiamate siano indirizzate attraverso il trunk corretto. Le non configurazioni possono portare a chiamate non riuscite o fatturazione inaspettata.

7.  **Nuovo elemento di test**:
    - Nuovo elemento di elenco di test utilizzato per testare la conversione dalla lingua italiana alla lingua inglese all'interno di una sezione esistente.
