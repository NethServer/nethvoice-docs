---
title: Installazione di NethServer
sidebar_position: 2
---

# Installazione di NethServer 8

NethVoice gira sopra **NethServer 8 (NS8)**, una piattaforma infrastruttura Linux unificata open-source. Questa pagina ti guida attraverso l'installazione di NethServer 8, che è un prerequisito per l'installazione di NethVoice.


:::tip
Se desideri un'installazione pronta all'uso di NethServer, prendi in considerazione il nostro servizio **[NethServer 8 SaaS](saas.md#nethserver-8-saas)**, che fornisce un'istanza NethServer completamente gestita nel cloud.
:::

## Requisiti di sistema {#system-requirements}

Prima di installare NethServer 8, assicurati che il tuo sistema soddisfi i seguenti requisiti:

### Requisiti hardware

Per un'installazione a nodo singolo:

- **CPU**: 2 vCPU/core, architettura x86-64 (minimo)
- **RAM**: 2GB minimo
- **Archiviazione**: unità a stato solido da 40GB minimo
- **Tipo**: Macchina fisica o virtuale (virtualizzazione basata su container e LXC Proxmox non supportati)

:::info
È possibile aggiungere nodi aggiuntivi in seguito. Durante il ridimensionamento, utilizzare hardware simile e la stessa distribuzione Linux per coerenza. I requisiti dovrebbero essere aumentati in base a utenti, applicazioni e carico.
:::

### Distribuzioni Linux supportate

NethServer 8 può essere installato sulle seguenti distribuzioni:

**Con supporto abbonamento Nethesis:**
- Rocky Linux 9

**Con supporto della comunità:**
- Rocky Linux 9
- CentOS Stream 9
- AlmaLinux 9
- Debian 12

:::warning
Installa solo su un **server Linux pulito**. Non installare su sistemi desktop o server che eseguono altri servizi.
:::

### Requisiti di rete

#### Indirizzo IP statico

- **Obbligatorio**: Assegna un indirizzo IP statico al nodo
- **Non consentito**: DHCP e protocolli di individuazione IP dinamici
- **Internet**: Connessione Internet funzionante richiesta per l'installazione, la configurazione e gli aggiornamenti

#### Risoluzione dei nomi

Configura i server DNS per il nodo:

- I server DNS devono essere **esterni** all'installazione di NethServer 8
- Configura una o più voci nameserver in `/etc/resolv.conf` che puntano a server DNS esterni
- Questi server possono trovarsi sulla stessa LAN o su Internet pubblico

:::warning
**Evita queste configurazioni:**
- Non utilizzare `127.0.0.1` o alcun IP assegnato al nodo stesso
- Non utilizzare servizi DNS forniti da NS8 (Samba AD, DNSMasq) come risolutore del nodo
- Non mescolare server DNS da ambiti diversi (ad es. Cloudflare pubblico + DNS privato)
:::

#### Configurazione DNS

L'**FQDN (Fully Qualified Domain Name)** del nodo deve essere configurato correttamente:

1. **Formato FQDN**: hostname + suffisso di dominio (ad es. `jupiter.example.org`)
2. **Record DNS**: Registra l'FQDN con:
   - Record di tipo A per indirizzi IPv4
   - Record di tipo AAAA per indirizzi IPv6
3. **IP instradabile**: L'FQDN deve risolvere in un indirizzo IP instradabile
4. **Certificati TLS**: La corretta configurazione di FQDN e DNS è essenziale affinché la crittografia TLS funzioni correttamente

#### Requisiti del nodo worker (per il clustering)

Se si aggiungono nodi worker a un cluster:

1. Il nodo worker deve risolvere l'FQDN del leader all'indirizzo instradabile corretto
2. Il server HTTPS (porta TCP 443) a tale indirizzo deve gestire le richieste API
3. La porta UDP del VPN (default 55820) non deve essere bloccata da firewall o appliance di rete

### Requisiti del browser web

Per accedere all'interfaccia web di NethServer 8, utilizza una versione aggiornata di:
- Firefox
- Chrome
- Chromium

## Metodi di installazione

NethServer 8 può essere installato utilizzando due metodi:

### Metodo 1: Procedura standard

Per la maggior parte delle installazioni, utilizza la procedura di installazione standard.

#### Passaggi di installazione

1. **Installa curl** (se non già disponibile):
```bash
apt install curl || dnf install curl
```

2. **Esegui lo script di installazione** come `root`:
```bash
curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash
```

3. **Attendi il completamento**: Lo script installerà tutti i componenti core di NethServer 8.

### Metodo 2: Immagine di macchina virtuale pre-costruita

Un'immagine Rocky Linux 9 pre-costruita è disponibile per la distribuzione rapida su piattaforme virtuali.

Vedi la documentazione ufficiale di NethServer per più dettagli: [Immagini pre-costruite di NethServer 8](https://docs.nethserver.org/projects/ns8/en/latest/install.html#pre-built-image).

## Passaggi post-installazione

Dopo il completamento dell'installazione:

1. Accedi all'interfaccia web

   Apri il tuo browser e naviga a: `https://<server_ip_or_fqdn>/cluster-admin/`

2. Login iniziale
   Utilizza le credenziali predefinite:
   - Nome utente: `admin`
   - Password: `Nethesis,1234`

Segui la procedura guidata per creare un cluster e configurare il nodo.
Ulteriori informazioni disponibili nella [documentazione ufficiale di NethServer](https://docs.nethserver.org/projects/ns8/en/latest/install.html#post-installation-steps).

Dopo la configurazione del cluster, puoi:

1. **Installa dominio utente**: [Configura LDAP o Active Directory](#user-domains)
2. **Installa NethVoice**: Procedi con l'[installazione di NethVoice](nethvoice_install) tramite il Software Center
3. **Registra NethServer**: Attiva il tuo [abbonamento Enterprise](#register-nethserver)

## Domini utente {#user-domains}

I domini utente archiviano utenti e gruppi in un database LDAP. NethVoice richiede almeno un dominio utente per gestire interni, utenti e autenticazione.

### Panoramica

NethServer 8 supporta due tipi di provider di account LDAP:

| Provider | Tipo | Ideale per | Funzionalità |
|----------|------|----------|----------|
| **OpenLDAP (RFC2307)** | Interno | Client Unix/Linux, setup semplice | Lightweight, configurazione facile, distribuzioni più piccole, più istanze per nodo |
| **Active Directory (Samba)** | Interno | Client Windows, condivisione file SMB | Domain controller, compatibilità Windows, complessità più elevata, un'istanza per nodo |
| **LDAP esterno** | Esterno | Infrastruttura LDAP esistente | Connessione a server esistenti (Active Directory, OpenLDAP, ecc.) |

:::info Requisito di NethVoice
NethVoice richiede almeno un dominio utente configurato. Scegli **OpenLDAP (RFC2307)** per distribuzioni più semplici o **Active Directory** se hai bisogno del supporto del client Windows.
:::

### Setup veloce: OpenLDAP (consigliato per NethVoice)

OpenLDAP è l'opzione più semplice per distribuzioni solo NethVoice:

1. **Accedi all'interfaccia web di NethServer 8** dopo il completamento dell'installazione
2. **Naviga alla sezione Domini e utenti**
3. **Fai clic su "Crea dominio"** e scegli **"Interno"**
4. **Seleziona "OpenLDAP"** come provider
5. **Immetti il nome del dominio** (ad es. `nethvoice.local`) - questo è un nome logico, non correlato a DNS
6. **Imposta il nome utente e la password dell'amministratore di OpenLDAP**
7. **Fai clic su "Installa provider"**

Il dominio sarà pronto immediatamente. Puoi ora:
- Creare utenti e gruppi per gli interni di NethVoice
- Gestire l'autenticazione dell'utente
- Configurare NethVoice per utilizzare questo dominio

:::tip
Mantieni le credenziali dell'amministratore di OpenLDAP in un luogo sicuro. Le avrai bisogno per attività amministrative.
:::

Per scenari avanzati (LDAP esterno, Active Directory, setup DNS, policy di password, gestione utenti), vedi la [documentazione ufficiale dei domini utente di NethServer 8](https://docs.nethserver.org/projects/ns8/en/latest/user_domains.htm).

Argomenti chiave nella documentazione ufficiale:
- **Setup di Active Directory**: Configurazione completa del domain controller
- **Connessione LDAP esterna**: Binding a server LDAP esistenti
- **Policy di password**: Impostazioni di età, forza e scadenza
- **Portale di gestione utenti**: Modifiche della password self-service
- **Repliche del provider LDAP**: Tolleranza ai guasti e ridondanza
- **Impostazioni di binding LDAP**: Connessione di applicazione esterna a un server LDAP in esecuzione localmente

## Registra NethServer {#register-nethserver}

NethServer deve avere una subscription Enterprise per sbloccare tutte le funzionalità di NethVoice.
Consulta la [sezione subscription](../index.md#subscription) per ulteriori informazioni.

### Passaggi di registrazione {#registration-steps}

1. **Ottieni un token per la subscription**:
   - Accedi al portale [my.nethesis.it](https://my.nethesis.it/)
   - Segui le procedure del portale per generare un token di subscription univoco per il tuo cluster

   :::warning Importante
   Il token di subscription è un segreto. Non condividerlo mai con nessuno.
   :::

2. **Registra il cluster**:
   - Accedi all'interfaccia web di NethServer 8
   - Vai a `Impostazioni` → scheda `Subscription`
   - Incolla il token nel campo **Token di autenticazione**
   - Fai clic sul pulsante **Registra**
   - NethVoice erediterà automaticamente la subscription di NethServer e attiverà le sue funzionalità

3. **Verifica la registrazione**:
   - Dopo la registrazione riuscita, la pagina Subscription visualizza:
     - **ID di sistema**: Identificatore univoco per il tuo cluster
     - **Piano**: Tipo di subscription
     - **Data di scadenza**: Quando scade la tua subscription

### Rimozione di una subscription {#removing-subscription}

Se hai bisogno di rimuovere una subscription:

1. Vai a `Impostazioni` → scheda `Subscription`
2. Fai clic sul pulsante **Rimuovi subscription**
3. Conferma l'azione quando richiesto

## Risoluzione dei problemi {#troubleshooting}

### Nodo non raggiungibile {#node-unreachable}

Se il nodo non è raggiungibile dopo l'installazione:
- Verifica la configurazione dell'indirizzo IP statico
- Controlla la risoluzione DNS per l'FQDN
- Assicurati che il firewall consenta HTTPS (porta 443)
- Rivedi la configurazione dell'interfaccia di rete

### Problemi di configurazione della rete {#network-configuration-issues}

Se hai bisogno di riconfigurare le impostazioni di rete:
- Accedi alla console direttamente o tramite IPMI/KVM
- Accedi come root
- Aggiorna la configurazione di rete utilizzando:
  - **Rocky Linux**: Utilizza `nmtui` o modifica i file di NetworkManager
  - **Debian**: Utilizza `netplan` o `/etc/network/interfaces`
  - **CentOS Stream/AlmaLinux**: Utilizza `nmcli` o `nmtui`
