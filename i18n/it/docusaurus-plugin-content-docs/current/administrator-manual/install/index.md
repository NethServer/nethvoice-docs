---
title: Installazione
sidebar_position: 1
---

# Guida all'installazione

Questa sezione copre il processo di installazione completo per NethVoice, dall'installazione dell'infrastruttura NethServer 8 sottostante alla configurazione di NethVoice stesso.

## Panoramica {#overview}

L'installazione di NethVoice è un processo in due fasi:

1. **[Installazione di NethServer 8](nethserver.md)** - Installa la piattaforma base NethServer 8  
2. **[Installazione di NethVoice](nethvoice_install.md)** - Installa e configurare l'applicazione NethVoice  

## Cos'è NethServer 8? {#what-is-nethserver-8}

NethServer 8 (NS8) è la piattaforma infrastruttura Linux sottostante su cui gira NethVoice. Fornisce:

- Gestione dell'infrastruttura Linux unificata open-source
- Supporto cluster per alta disponibilità e scalabilità
- Architettura dell'applicazione modulare
- Interfaccia di amministrazione basata su web
- Hardening della sicurezza e aggiornamenti

:::info
NethVoice richiede che NethServer 8 sia installato per primo. Assicurati di completare l'installazione di NethServer 8 prima di procedere con NethVoice.
:::

## Percorso di installazione {#installation-path}

### Passaggio 1: Prerequisiti {#step-1-prerequisites}

Prima di iniziare, assicurati di avere:

- Una macchina fisica o virtuale dedicata
- Distribuzione Linux supportata installata (Rocky Linux, AlmaLinux, CentOS Stream o Debian)
- Indirizzo IP statico configurato
- Server DNS esterni configurati
- Connessione Internet funzionante
- Nome di dominio completamente qualificato (FQDN) registrato e risolto

### Passaggio 2: Installa NethServer 8 {#step-2-install-nethserver-8}

Segui la [guida all'installazione di NethServer](nethserver.md) per:
- Installare i componenti core di NethServer 8
- Configurare la rete e il DNS
- Accedere all'interfaccia di amministrazione web
- Creare il tuo cluster

### Passaggio 3: Installare e configurare NethVoice {#step-3-install-nethvoice}

Segui la [Guida all'installazione di NethVoice](nethvoice_install.md) per:  
- Installare NethVoice  
- Completare la configurazione guidata:  
  - Configurare un provider di account  
  - Installare e configurare un NethVoice Proxy  
  - Configurare virtual host, certificati e password di amministrazione  
- Accedere all'interfaccia di amministrazione di NethVoice e CTI  

## Quick Reference {#quick-reference}

### Requisiti minimi di sistema {#system-requirements-minimum}

| Componente | Requisito |
|-----------|-------------|
| CPU | 2 vCPU/core (x86-64) |
| RAM | 2GB |
| Archiviazione | 40GB SSD |
| Rete | Indirizzo IP statico |
| OS | **Rocky Linux 9** (subscription supportato) - AlmaLinux 9, CentOS Stream 9, Debian 12 (community supportato) |
| Browser | Firefox, Chrome o Chromium (versione attuale) |

### Metodi di installazione {#installation-methods}

**NethServer 8** può essere installato tramite:
- Script di installazione standard (consigliato)
- Immagine di macchina virtuale pre-costruita (per Proxmox o VMWare)

**NethVoice** è installato tramite:
- Interfaccia del Software Center di NethServer

### Credenziali predefinite

Dopo l'installazione, utilizza queste credenziali temporanee:

| Componente | Nome utente | Password |
|-----------|----------|----------|
| Interfaccia amministratore di NethServer 8 | admin | Nethesis,1234 |
| Interfaccia amministratore di NethVoice | admin | Nethesis,1234 |

:::warning
Cambia le credenziali predefinite immediatamente dopo il primo accesso per motivi di sicurezza.
:::

## Guide dettagliate

### [Installazione di NethServer 8](nethserver.md) {#nethserver-8-installation}

Guida completa che copre:
- Requisiti di sistema e consigli hardware
- Distribuzioni Linux supportate
- Configurazione di rete e DNS
- Procedura di installazione standard
- Distribuzione di immagini pre-costruite
- Passaggi post-installazione
- Configurazione del cluster
- Risoluzione dei problemi

### [Installazione di NethVoice](nethvoice_install.md) {#nethvoice-installation}

Guida completa che copre:  
- Installazione del software NethVoice  
- Configurazione guidata:  
  - Dominio utenti  
  - NethVoice Proxy  
  - Virtual host (host base)  
  - Certificati Let's Encrypt  
  - Password di amministrazione  
- Accesso amministratore  
- Configurazione iniziale  

### [Installazione di NethVoice Proxy](../advanced/nethvoice_proxy.md) {#nethvoice-proxy-installation}

Guida completa che copre:
- Panoramica del proxy e architettura
- Ruolo nelle distribuzioni con una e più istanze
- Passaggi di installazione
- Configurazione (dominio, interfaccia, IP pubblico)
- Configurazione del certificato SSL
- Verifica e test
- Deve essere installato prima di NethVoice

## Checklist dell'installazione {#installation-checklist}

Prima di iniziare, assicurati che:

- [ ] L'hardware soddisfa i requisiti minimi (2 vCPU, 2GB RAM, 40GB SSD)
- [ ] Distribuzione Linux supportata disponibile
- [ ] Indirizzo IP statico configurato
- [ ] Server DNS esterni configurati
- [ ] FQDN registrato presso il provider DNS
- [ ] Il firewall consente le porte richieste (80, 443, 55820 per il clustering)
- [ ] La connessione Internet è stabile
- [ ] Hai accesso amministrativo al server

## Note importanti {#important-notes}

:::info
**Solo piattaforme supportate**: Installa NethServer 8 solo su distribuzioni supportate. Sistemi desktop e server che eseguono altri servizi non sono supportati.
:::

:::info
**Indirizzo IP statico**: DHCP non è supportato. Configura un indirizzo IP statico prima o durante l'installazione di NethServer 8.
:::

:::warning
**Configurazione DNS**: Una corretta configurazione DNS è essenziale per i certificati TLS, il clustering e la funzionalità complessiva del sistema. Non saltare i passaggi di configurazione DNS.
:::

:::warning
**Credenziali predefinite**: Cambia le password amministratore predefinite immediatamente dopo l'installazione. Questo è un requisito di sicurezza, non facoltativo.
:::

## Scalabilità

Dopo l'installazione iniziale, NethServer 8 supporta:

- **Configurazione cluster**: Aggiungi più nodi per la scalabilità
- **Nodi worker**: Distribuisci applicazioni tra i nodi del cluster
- **Bilanciamento del carico**: Bilanciamento del carico integrato per le applicazioni
- **VPN**: Configurazione VPN automatica per la comunicazione sicura tra nodi

Vedi la [documentazione di NethServer 8](https://docs.nethserver.org/projects/ns8/) per i dettagli del clustering.

## Limiti di scalabilità di NethVoice {#nethvoice-limits}

**NethVoice** prevede i seguenti limiti tecnici:

- **Massimo 22 istanze NethVoice** per nodo NethServer 8.
- **Massimo 250 chiamate contemporanee** (interne e/o esterne) per istanza **NethVoice**.

Questi limiti sono determinati dalla disponibilità delle porte UDP utilizzate per la gestione del traffico RTP.
Il numero massimo di istanze installabili su un singolo nodo e il numero massimo di chiamate contemporanee per istanza sono quindi vincoli tecnici, indipendenti dalle risorse hardware disponibili.

:::info
Il raggiungimento dei limiti tecnici non garantisce che il sistema sia in grado di gestire il carico massimo. La capacità effettiva dipende anche dalle risorse hardware disponibili, dalla configurazione delle istanze e dalle funzionalità utilizzate.
:::

Per installazioni che richiedono un numero maggiore di istanze, è necessario distribuire il carico su più nodi del cluster NethServer 8.

Per installazioni che richiedono un numero di chiamate contemporaneo maggiore di 250 rivolgersi al supporto tecnico.

## Risoluzione dei problemi {#troubleshooting}

### Problemi comuni {#common-issues}

**Non è possibile accedere all'interfaccia web**
- Verifica la configurazione dell'indirizzo IP statico
- Controlla che il firewall consenta la porta 443
- Assicurati che il DNS risolva correttamente l'FQDN
- Vedi la guida all'installazione di NethServer 8

**Problemi di connettività di rete**
- Configura l'indirizzo IP statico
- Verifica che i server DNS siano raggiungibili e non locali
- Controlla la configurazione dell'interfaccia di rete
- Testa la risoluzione DNS da riga di comando

**Installazione dello script non riuscita**
- Assicurati che la connessione Internet sia stabile
- Installa curl se non disponibile
- Esegui come utente root
- Verifica che i requisiti di sistema siano soddisfatti

Per ulteriore aiuto, consulta le guide dettagliate o la documentazione di NethServer 8.

## Passaggi successivi {#next-steps}

Dopo l'installazione completata con successo:

1. **Configura NethVoice**: Completa la procedura guidata di configurazione di NethVoice
2. **Configura utenti**: Crea domini utente (LDAP o Active Directory)
3. **Provisioning di telefoni**: Vedi la [guida al provisioning dei telefoni](../provisioning/index.md)
4. **Formazione utenti**: Utilizza il [Manuale utente](../../user-manual/index.md) per formare gli utenti finali
5. **Hardening della sicurezza**: Configura firewall e controlli di accesso

---

**Pronto per iniziare?** Inizia con la [guida all'installazione di NethServer 8](nethserver.md).
