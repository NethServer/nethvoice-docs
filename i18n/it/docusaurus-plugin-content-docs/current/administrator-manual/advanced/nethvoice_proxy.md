---
title: NethVoice Proxy
sidebar_position: 5
---

# NethVoice Proxy

## Panoramica

NethVoice Proxy è un componente critico che gestisce tutto il traffico VoIP esterno per le istanze di NethVoice. Agisce come gateway per le connessioni SIP e RTP basate su Internet, abilitando l'accesso esterno sicuro al tuo sistema telefonico.

:::info Cos'è NethVoice Proxy?
NethVoice Proxy fornisce:
- **Gateway VoIP esterno**: Punto di ingresso unico per tutto il traffico vocale basato su Internet
- **Instradamento del traffico**: Delegazione intelligente del traffico SIP/RTP a più installazioni di NethVoice sullo stesso nodo
- **Terminazione SSL/TLS**: Connessioni crittografate sicure per il traffico VoIP esterno
- **Bilanciamento del carico**: Distribuisce le chiamate in arrivo su più istanze di NethVoice
- **Attraversamento NAT**: Gestisce la traduzione degli indirizzi di rete per utenti remoti e mobili

**Importante**: NethVoice Proxy è richiesto per ogni distribuzione di NethVoice, anche con una singola istanza. Gestisce l'accesso a Internet esterno e deve essere installato e configurato prima di distribuire eventuali istanze di NethVoice.
:::

## Architettura

Il modulo NethVoice Proxy è costruito su due componenti open-source principali:

| Componente | Scopo |
|-----------|-------|
| **[Kamailio](https://www.kamailio.org)** | Server proxy SIP per gestire tutte le connessioni SIP (Session Initiation Protocol) |
| **[RTP Engine](https://github.com/sipwise/rtpengine/)** | Proxy RTP per gestire le connessioni RTP (Real-time Transport Protocol) |

Questi componenti lavorano insieme per gestire tutte le connessioni SIP e RTP in entrata e in uscita tra le tue istanze di NethVoice e le reti VoIP esterne (Internet, trunk, uffici remoti, utenti mobili).

## Ruolo nelle distribuzioni di NethVoice

### Distribuzione con singola istanza

Anche con una singola installazione di NethVoice, NethVoice Proxy è essenziale:
- Agisce come interfaccia esterna per il traffico VoIP basato su Internet
- Gestisce la crittografia SSL/TLS per gli utenti remoti
- Gestisce l'attraversamento NAT per le connessioni mobili e remote
- Fornisce un singolo dominio affinché gli utenti esterni raggiungano il tuo PBX

### Distribuzione con più istanze

Con più istanze di NethVoice sullo stesso nodo, NethVoice Proxy fornisce:
- **Punto di ingresso esterno unico**: I chiamanti esterni utilizzano un FQDN (il dominio proxy)
- **Instradamento del traffico**: Il proxy instrada intelligentemente le chiamate all'istanza di NethVoice appropriata
- **Distribuzione del carico**: Distribuisce le chiamate su più istanze
- **Certificati SSL condivisi**: Gestisce la sicurezza esterna per tutte le istanze
- **Gestione trunk centralizzata**: I trunk esterni possono essere condivisi o inoltrati a istanze specifiche

:::example Architettura multi-istanza
```
Internet/Trunk esterni
        ↓
   NethVoice Proxy
   (proxy.domain.com)
    ↙        ↓        ↘
Istanza 1  Istanza 2  Istanza 3
(tenant A) (tenant B)  (tenant C)
```

In questo scenario:
- Tutto il traffico esterno arriva al proxy
- Il proxy instrada le chiamate all'istanza di NethVoice appropriata in base alle regole di instradamento
- Ogni istanza opera in modo indipendente mentre condivide l'accesso esterno
:::

## Installazione

:::note
Puoi installare solo un NethVoice Proxy per nodo dal Software Center.
:::

NethVoice Proxy deve essere installato **prima** di distribuire qualsiasi istanza di NethVoice. Vedi [Installazione di NethVoice](../install/nethvoice_install.md) per la sequenza di installazione completa.

### Passaggi di installazione

1. **Apri l'interfaccia di gestione di NethServer** sul tuo nodo
2. **Naviga a Software Center**
3. **Cerca "NethVoice Proxy"**
4. **Fai clic su "Installa"** e attendi il completamento dell'installazione
5. **Procedi alla configurazione** (vedi la sezione sottostante)

:::warning Ordine di installazione
Non tentare di installare NethVoice prima di installare e configurare NethVoice Proxy. L'installazione non riuscirà se il proxy non è disponibile.

## Configurazione

La configurazione di NethVoice Proxy è essenziale prima di installare le istanze di NethVoice. Il proxy richiede un FQDN dedicato e impostazioni di rete appropriate.

:::warning Configurazione richiesta
NethVoice Proxy deve essere completamente configurato e operativo prima di installare le istanze di NethVoice. Verifica che la configurazione sia completa e che il proxy sia in esecuzione prima di procedere all'installazione di NethVoice.
:::

### Prerequisiti

Prima di configurare NethVoice Proxy, assicurati che:

1. **Record DNS creati**: Crea un record DNS A/AAAA per il dominio proxy (ad es. `proxy.nethserver.org`) che punta al tuo indirizzo IP pubblico
2. **Indirizzo IP pubblico**: Conosci l'indirizzo IPv4 o IPv6 pubblico dove il proxy sarà accessibile da Internet
3. **Interfaccia di rete**: Identifica quale interfaccia di rete gestirà il traffico VoIP

### Passaggi di configurazione

1. **Accedi alla pagina di configurazione del proxy** nell'interfaccia di gestione di NethServer
2. **Inserisci il dominio proxy**: Imposta un FQDN valido (ad es. `proxy.nethserver.org`)
   - Questo dominio deve avere un record DNS A/AAAA valido che punta al tuo IP pubblico
   - I dispositivi VoIP esterni e gli uffici remoti utilizzeranno questo dominio per raggiungere il tuo sistema
3. **Seleziona interfaccia di rete**: Scegli l'interfaccia di rete che gestirà il traffico VoIP dal menu a discesa
   - Tipicamente l'interfaccia collegata alla tua WAN/Internet
4. **Configura indirizzo IP pubblico**: 
   - Immetti l'indirizzo IPv4 o IPv6 pubblico se diverso dall'IP dell'interfaccia
   - Questo è necessario se il tuo nodo è dietro un router/NAT
   - Lascia vuoto se l'interfaccia ha un indirizzo IP pubblico diretto
5. **Richiedi certificato SSL**:
   - Abilita Let's Encrypt se desideri la gestione automatica dei certificati SSL
   - Richiede che il record DNS sia risolvibile pubblicamente

### Esempio di configurazione

**Scenario**: Nodo singolo con interfaccia di rete privata, IP pubblico dietro NAT

| Impostazione | Valore | Note |
|---------|-------|-------|
| Dominio proxy | `proxy.example.com` | FQDN pubblico, record DNS creato |
| Interfaccia di rete | `eth0` (interfaccia WAN) | IP privato: 192.168.1.10 |
| Indirizzo IP pubblico | `203.0.113.45` | Indirizzo IP pubblico instradabile |
| Let's Encrypt | Abilitato | Certificato automatico per `proxy.example.com` |

**Risultato**: I dispositivi esterni si connettono a `proxy.example.com` (203.0.113.45), il traffico si instrada internamente a 192.168.1.10

### Casi speciali

#### Solo rete locale (senza accesso a Internet)

Se il proxy è accessibile solo all'interno di una rete locale e non da Internet:

```
Dominio proxy: proxy.internal.local
Interfaccia di rete: eth0 (Rete privata)
Indirizzo IP pubblico: <vuoto> o IP interno (192.168.1.10)
Let's Encrypt: Disabilitato
```

Utilizza l'indirizzo IP privato che i dispositivi sulla tua rete locale usano per raggiungere il proxy.

#### Più IP esterni

Se il tuo nodo ha più indirizzi IP pubblici, configura il proxy con l'IP pubblico specifico che desideri per il traffico VoIP:

1. Imposta l'interfaccia di rete sull'interfaccia che riceve il traffico
2. Inserisci l'IP pubblico specifico nel campo "Indirizzo IP pubblico"
3. Assicurati che i record DNS puntino a questo indirizzo IP

### Passaggi successivi

Una volta che NethVoice Proxy è completamente configurato e in esecuzione:

1. **Verifica che il proxy sia operativo**: Controlla lo stato del proxy nell'interfaccia di gestione di NethServer
2. **Procedi all'installazione di NethVoice**: Vedi [Installazione di NethVoice](../install/nethvoice_install.md)
3. **Configura istanze di NethVoice**: Ogni istanza richiede una configurazione separata con FQDN dedicati

:::info Diagramma di rete
```
Utenti/Trunk esterni
        ↓ (Internet)
   IP pubblico (ad es. 203.0.113.45)
        ↓
   NethVoice Proxy
   (gestione traffico SIP/RTP)
        ↓ (rete interna)
   Istanza/e NethVoice
   (CTI, interni, funzionalità)
```

Il proxy agisce come gateway tra il traffico VoIP esterno e le istanze interne di NethVoice.
:::

Ora puoi installare e configurare una o più istanze di NethVoice. Vedi [Installazione di NethVoice](../install/nethvoice_install.md) per i passaggi dettagliati.
