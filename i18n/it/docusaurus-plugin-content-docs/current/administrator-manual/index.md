---
title: Introduzione
sidebar_position: 0
---

# Manuale Amministratore NethVoice

## Cos'è NethVoice?

NethVoice è una piattaforma di comunicazione unificata e completa costruita su tecnologie open-source. Integra capacità voce, video e mobile in un singolo e potente sistema PBX che organizzazioni di qualsiasi dimensione possono distribuire e gestire.

A differenza dei tradizionali sistemi PBX proprietari, NethVoice combina la flessibilità di FreePBX/Asterisk con interfacce moderne basate su web, tecnologia WebRTC e capacità di provisioning avanzate per fornire comunicazioni di classe enterprise.

:::info
Questa documentazione copre l'installazione completa, la configurazione e la gestione di NethVoice su NethServer 8. Che stiate distribuendo il vostro primo sistema o gestendo più istanze, troverete guide complete per ogni aspetto di NethVoice.
:::

## Navigazione Rapida

Iniziate velocemente passando alle sezioni più importanti:

- **[Guida all'Installazione](./install/index.md)** - Istruzioni complete per l'installazione, dai prerequisiti di NethServer al deployment di NethVoice
- **[Configurazione](./configuration/index.md)** - CTI, interni e gestione utenti
- **[Provisioning Telefoni](./provisioning/index.md)** - Gestione automatica dei dispositivi telefonici e provisioning
- **[Risorse Avanzate](./advanced/index.md)** - Configurazione di sistema e argomenti avanzati


## Componenti Principali

NethVoice è costruito su sette principali componenti open-source:

| Componente | Scopo | Link |
|-----------|-------|------|
| **FreePBX** | GUI web per la gestione di Asterisk e l'instradamento delle chiamate | [freepbx.org](https://www.freepbx.org/) |
| **Asterisk** | Server VoIP e motore core delle telecomunicazioni | [asterisk.org](https://www.asterisk.org) |
| **Server NethVoice CTI** | API e eventi WebSocket per operazioni di centralino | [GitHub](https://github.com/nethesis/nethcti-server) |
| **Client NethVoice CTI** | Applicazione web per la gestione delle chiamate e postazioni operatore | [GitHub](https://github.com/nethesis/nethcti) |
| **Report NethVoice** | Analytics e reporting di CDR e code | [GitHub](https://github.com/nethesis/nethvoice-report) |
| **Janus** | Gateway WebRTC per video e comunicazioni web | [janus.conf.meetecho.com](https://janus.conf.meetecho.com/) |
| **Tancredi** | Motore intelligente di provisioning telefonico | [GitHub](https://nethesis.github.io/tancredi) |

I servizi aggiuntivi includono **MariaDB** per l'archiviazione dei dati e **Let's Encrypt** per l'automazione dei certificati SSL.

## Panoramica delle Funzionalità Principali

### Comunicazione e Instradamento

- **Integrazione FreePBX e Asterisk**: GUI web per la gestione di servizi telefonici completi
- **Instradamento Inbound/Outbound**: Editor flusso di chiamata visivo con priorità di instradamento personalizzabili
- **Gestione Trunk**: Configurazione di gateway fisici e trunk VoIP (SIP, PJSIP)
- **Gestione Utenti e Interni**: Associazione di utenti agli interni con controllo granulare
- **Click-to-Call**: Avvia le chiamate da client web o desktop con integrazione NethLink

### Gestione Dispositivi e Provisioning

- **Provisioning Telefonico Automatico**: Motore di provisioning Tancredi per modelli di telefoni supportati
- **Dispositivi Supportati**: Compatibilità con NethPhone, Fanvil, Yealink, Snom, Gigaset, Grandstream, Patton e altri
- **Metodi di Provisioning Multipli**: RPS, DHCP e URL di provisioning manuale
- **Associazione Dispositivi**: Collegamento di più dispositivi per utente (telefono web, app mobile, telefoni fisici)
- **Gestione Firmware**: Caricamento e distribuzione di aggiornamenti firmware ai telefoni
- **Provisioning Gateway**: Configurazione automatica e manuale per gateway supportati
- **Parametri di Provisioning**: Configurazione di tasti soft, tasti linea, tasti di espansione, impostazioni schermo/suoneria, rubrica LDAP

### Gestione Utenti e Autorizzazioni

- **Gestione Gruppi e Profili**: Creazione di gruppi di utenti con profili di autorizzazione granulari
- **Sistema di Autorizzazioni**: Controllo fine-tuned su funzionalità telefoniche, rubrica, CDR, customer card, presenza, code
- **Postazioni Operatore**: Configurazione di ambienti dedicati agli operatori di centralino
- **Domini Utente**: Supporto per integrazione LDAP o Active Directory per gestione utenti centralizzata

### Strumenti di Comunicazione e Interfacce

- **Server e Client CTI**: API e applicazioni web per operazioni di centralino
- **Supporto WebRTC**: Integrazione con Janus per video e comunicazioni web
- **Dashboard**: Panoramica in tempo reale di utenti, dispositivi, trunk e stato del sistema
- **Sistema di Reporting**: Dettagli Registrazione Chiamate (CDR) e analytics delle code

### Funzionalità Avanzate

- **Supporto Multi-istanza**: Installazione di più istanze di NethVoice sullo stesso nodo NethServer
- **Framework Applicazioni**: Creazione e gestione di customer card, sorgenti rubrica e URL parametrizzati
- **Integrazione Rubrica Esterna**: Importazione contatti da MySQL, CSV o script personalizzati
- **URL Parametrizzati**: Attiva URL personalizzati su eventi di chiamata con parametri dinamici
- **Integrazione Let's Encrypt**: Gestione automatica dei certificati SSL

## Introduzione

### Prerequisiti

Prima di distribuire NethVoice, assicuratevi di avere:

- ✅ **Risorse di Sistema**: Minimo 2 vCPU, 2GB RAM, 40GB storage per istanza
- ✅ **Requisiti di Rete**: IP statico, DNS configurato, connettività internet
- ✅ **NethServer 8**: Completamente installato e configurato (vedere [Guida all'Installazione](./install/index.md))
- ✅ **Dominio Utente**: Creato per utenti e autenticazione (vedere [Domini Utente nell'Installazione NethServer](./install/nethserver.md#user-domains))
- ✅ **Proxy NethVoice**: Installato e configurato con FQDN appropriato e record DNS (richiesto per qualsiasi distribuzione di NethVoice)

### Passaggi di Distribuzione

1. **[Verificare i Requisiti di Sistema](./install/nethserver.md#system-requirements)** - Assicuratevi che la vostra infrastruttura soddisfi i requisiti
2. **[Installare NethServer 8](./install/nethserver.md)** - Distribuire la piattaforma infrastruttura base
3. **[Creare Dominio Utente](./install/nethserver.md#user-domains)** - Configurare LDAP per utenti e autenticazione
4. **[Installare e Configurare Proxy NethVoice](./advanced/nethvoice_proxy.md)** - Distribuire il gateway VoIP esterno (RICHIESTO prima di NethVoice)
5. **[Distribuire NethVoice](./install/nethvoice_install.md)** - Installare il modulo NethVoice sopra il proxy
6. **Configurare il Vostro Sistema**:
   - [Provisioning Telefoni](./provisioning/index.md) - Distribuire e configurare dispositivi telefonici
   - [Gestire Interni](../user-manual/nethcti/index.md) - Creare interni e assegnare agli utenti
7. **[Configurazione Avanzata](./advanced/index.md)** - Configurare trunk, gateway, instradamento e funzionalità avanzate

## Sezioni Documentazione Principale

| Sezione | Scopo | Argomenti |
|---------|-------|----------|
| **[Installazione](./install/index.md)** | Setup di sistema e distribuzione | NethServer, installazione NethVoice, prerequisiti |
| **[Provisioning](./provisioning/index.md)** | Gestione dispositivi telefonici | Dispositivi supportati, metodi di provisioning, configurazione |
| **[Manuale Amministratore](./index.md)** | Amministrazione di sistema | Utenti, interni, trunk, gateway, instradamento |
| **[Manuale Utente](../user-manual/index.md)** | Funzionalità per l'utente finale | Client CTI, NethCTI, NethLink, funzionalità di chiamata |

:::tip Distribuzioni Multi-Istanza
Potete installare più istanze di NethVoice sullo stesso nodo NethServer 8 dal Software Center. Ogni istanza richiede una configurazione separata ed esegue in modo indipendente. Questo è utile per distribuzioni multi-tenant o unità di business separate.
:::

:::warning Prerequisiti
Il modulo NethVoice richiede che il **proxy NethVoice** sia già installato, configurato e in esecuzione sul sistema. 

**Perché?** Il Proxy NethVoice:
- Gestisce tutto il traffico VoIP esterno da internet
- Gestisce instradamento del traffico SIP/RTP e delegazione
- Abilita l'accesso esterno anche con una singola istanza di NethVoice
- Instrada il traffico tra più installazioni di NethVoice sullo stesso nodo

Se non avete ancora configurato il proxy, fare riferimento alla [documentazione Proxy NethVoice](./advanced/nethvoice_proxy.md) prima di installare NethVoice.
:::

## Subscription {#subscription}

NethVoice richiede una **subscription a NethServer** per sbloccare tutte le funzionalità avanzate.

:::info Subscription NethServer
Per informazioni dettagliate sui piani di abbondamento, la registrazione e la gestione, consultate la [documentazione Subscription NethServer](https://docs.nethserver.org/projects/ns8/en/latest/subscription.html).
:::

### Piano di Subscription Supportato

**Solo la subscription Enterprise è supportata in NethVoice.** Il piano Enterprise fornisce:

- Aggiornamenti di sicurezza e funzionalità pianificati
- Accesso al supporto remoto
- Monitoraggio del cluster e sistemi di allerta
- Accesso a tutti i moduli e alle funzionalità di NethVoice

Contattate [info@nethesis.it](mailto:info@nethesis.it) per i dettagli sulla subscription Enterprise.

### Limitazioni senza Subscription

Se distribuite NethVoice senza una subscription attiva, si applicano le seguenti limitazioni:

- **Massimo 8 interni** — Limite a 8 interni utente nel sistema
- **Nessun provisioning telefoni** — Il motore di provisioning Tancredi non è disponibile; i telefoni possono essere configurati solo tramite DHCP, quindi funzioneranno solamente se i telefoni e il PBX sono nella stessa rete locale (nessun provisioning cloud)
- **Nessun accesso all'app mobile** — L'app mobile NethVoice non è disponibile
- **Solo supporto comunitario** — Nessun accesso al supporto remoto o assistenza prioritaria

Per sbloccare queste funzionalità e superare il limite di 8 interni, attivate una sottoscrizione Enterprise.

## Supporto e Risorse Aggiuntive

- **Documentazione Ufficiale**: Riferimento tecnico completo e guide di configurazione avanzata
- **Supporto Comunità**: Unitevi alla comunità NethVoice per domande e discussioni
- **Servizi Professionali**: Contattate Nethesis per distribuzioni enterprise e supporto
- **Guida Provisioning**: Informazioni dettagliate su telefoni e gateway supportati nella [sezione Provisioning](./provisioning/index.md)

## Informazioni su Nethesis {#about-nethesis}

**Nethesis** è l'azienda dietro lo sviluppo di NethVoice. È un'importante realtà italiana nella produzione di soluzioni open source per le PMI (piccole e medie imprese). Fondata sul principio che il software open source sia la base ideale per sistemi aziendali sicuri, innovativi e convenienti, Nethesis fornisce soluzioni ICT modulari, user‑friendly e affidabili, con supporto e servizi completamente in italiano.

Con migliaia di installazioni attive e una rete di centinaia di partner in Italia e all'estero, Nethesis si impegna a:

- **Innovazione Open Source**: Costruire su tecnologie comprovate, trasparenti e guidate dalla comunità per garantire sicurezza e flessibilità
- **Design incentrato sull'utente**: Semplificare tecnologie complesse con interfacce web intuitive per esperti e non esperti
- **Supporto locale**: Fornire supporto tecnico e commerciale in lingua italiana, con sviluppo e infrastrutture basate in Italia
- **Partnership a lungo termine**: Dare priorità alle relazioni rispetto alle transazioni, collaborando strettamente con partner, clienti e comunità

### Suite di prodotti Nethesis

Nethesis offre una suite completa di soluzioni ICT modulari e indipendenti che rispondono alle esigenze fondamentali delle aziende moderne:

- **[NethVoice](https://www.nethesis.it/soluzioni/nethvoice)** — PBX VoIP aperto e versatile per comunicazioni unificate. Integra voce, video, mobile e sistemi aziendali con funzionalità come web phone, app mobile, funzionalità di call center e provisioning intelligente dei telefoni. Si installa su NethServer.

- **[NethService](https://www.nethesis.it/soluzioni/nethservice)** — Suite di collaborazione per il cloud privato. Centralizza posta elettronica, calendari, contatti, documenti e chat con Active Directory integrata e servizi cloud aziendali. Si installa su NethServer.

- **[NethSecurity](https://www.nethesis.it/soluzioni/nethsecurity)** — Firewall enterprise per le PMI. Protegge la rete e assicura accesso rapido e sicuro ai servizi cloud con threat intelligence, qualità del servizio, VPN e filtraggio cloud. Firewall UTM basato su OpenWRT.

- **[NethSpot](https://www.nethesis.it/soluzioni/nethspot)** — Gestione hotspot WiFi pubblici. Migliora l'esperienza guest con proximity marketing, login social, gestione centralizzata del WiFi e controllo della banda.

Tutte le soluzioni sono indipendenti dalla modalità di distribuzione: installabili su appliance certificate, macchine virtuali, cloud privati o hardware compatibile. Per maggiori informazioni visitate [www.nethesis.it](https://www.nethesis.it) o contattate [marketing@nethesis.it](mailto:marketing@nethesis.it).

## Nuova sezione di test: Agente di traduzione di prova {#nuova-sezione-di-test-agente-di-traduzione}

Questa sezione è stata creata a scopo di test. È stato sviluppato un nuovo agente con l'obiettivo di tradurre nuovi contenuti da e verso l'inglese e l'italiano, per consentire agli utenti di creare nuova documentazione in una sola delle due lingue e generare automaticamente l'altra versione speculare.