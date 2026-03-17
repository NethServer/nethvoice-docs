---
title: Scenari tipici di installazione di NethVoice
sidebar_position: 7
---

La decisione tra un'installazione **Cloud (IaaS/SaaS)** e **On-Premise** (locale) di NethVoice su NethServer dipende principalmente dai requisiti aziendali, dalle risorse IT disponibili, e dalle esigenze specifiche riguardanti il controllo, la sicurezza e la scalabilità.

NethVoice non può essere accessibile utilizzando un indirizzo IP — i client (telefoni IP, app mobile, integrazioni CTI e NethLink) devono essere sempre configurati per utilizzare l'**FQDN pubblicamente risolvibile**.

Questo è un cambiamento fondamentale rispetto alle versioni precedenti (ad es. NethVoice 14) ed è imposto dalle migliori pratiche moderne per la **Sicurezza** (abilitazione di certificati SSL/TLS validi) e la **Manutenibilità** (gestione centralizzata semplificata). Un FQDN pubblicamente risolvibile è un prerequisito non negoziabile.


### Opzione 1: Installazione Cloud (IaaS o SaaS)

Questa opzione prevede l'hosting di NethServer e NethVoice presso un Cloud Provider (IaaS) o l'utilizzo di una soluzione SaaS pre-configurata.

#### Vantaggi Principali

* **Certificazione del Provider**: In generale, è sempre consigliato scegliere un provider certificato che si integri completamente con il proxy NethVoice per evitare potenziali problemi di connessione e registrazione.
* **Gestione Firewall Nativa**: Il componente firewall è gestito nativamente da NethServer nell'ambiente cloud.
* **Consolidamento**: Più piccoli sistemi PBX possono essere consolidati efficientemente in un singolo nodo NethServer.
* **Migrazione Semplificata**: Quando i media gateway non sono coinvolti, la migrazione diretta dall'hardware esistente è possibile, riducendo i tempi di switchover.

Il proxy NethVoice (Kamailio/RTP Engine) segue rigorosamente gli standard SIP e include misure di hardening aggiuntive per migliorare la sicurezza. Il proxy agisce come punto di terminazione SIP/TLS e relay multimediale, applicando le best practice SIP (parsing rigoroso, autenticazione, ACL, rate-limiting, TLS/SRTP dove applicabile) per ridurre la superficie di attacco e migliorare la resilienza.

Il proxy isola e media la segnalazione e i media esterni, e insieme al firewall, evita l'esposizione diretta di Asterisk migliorando la sicurezza.

#### Cosa ti serve?

* **FQDN** → che punta all'IP pubblico per **NethVoice proxy**
* **FQDN** → che punta all'IP pubblico per **NethVoice**
* **FQDN** → che punta all'IP pubblico per **NethVoice CTI**
* **IP pubblico** dedicato con le porte necessarie aperte vedi [configurazione firewall](.administrator-manual/configuration/firewall#port-summary)
* Certificato SSL valido per tutti gli FQDN (ottenibile tramite Let’s Encrypt)


### Opzione 2: Installazione On-Premise con accesso pubblico

L'installazione On-Premise prevede l'hosting di NethServer e NethVoice sui server fisici propri dell'azienda o come macchina virtuale (VM) all'interno dell'infrastruttura di rete locale.

#### Sfide Principali e Considerazioni

* **Gestione Firewall**: Il cliente è responsabile della configurazione e della gestione del firewall (router/dispositivo perimetrale).
* **Mandato FQDN / SSL**: Un FQDN pubblico è ancora obbligatorio. Funzionalità come NethLink e l'App Mobile richiedono FQDN pubblico, SSL, e raggiungibilità esterna su porte specifiche.
* **Problemi di Rete e Audio**: I problemi di audio (ad es. audio unidirezionale) nei deployment on-premise sono spesso causati da problemi di configurazione NAT. Per i passaggi di troubleshooting, fate riferimento a: [guida di troubleshooting](./troubleshooting/audio_problems.md).
* **Complessità di Rete**: Richiede Hairpin NAT e configurazione firewall attenta per permettere ai client locali di accedere al server via il suo FQDN pubblico. In alternativa, Split DNS può essere configurato per risolvere l'FQDN a un indirizzo IP locale per i client interni.

#### Cosa ti serve?

* **FQDN** → che punta all'IP pubblico per **NethVoice proxy**
* **FQDN** → che punta all'IP pubblico per **NethVoice**
* **FQDN** → che punta all'IP pubblico per **NethVoice CTI**
* **IP pubblico** dedicato con le porte necessarie aperte vedi [configurazione firewall](.administrator-manual/configuration/firewall#port-summary)
* Certificato SSL valido per tutti gli FQDN (ottenibile tramite Let’s Encrypt)
* Split DNS (preferibile) O DNS pubblico + **HairPIN NAT** correttamente configurato vedi [configurazione firewall](.administrator-manual/configuration/firewall#hairpin-nat)

### Opzione 3: Installazione On-Premise senza accesso pubblico

L'installazione On-Premise senza accesso pubblico mantiene NethVoice interamente all’interno della rete locale, senza esporre i servizi verso l’esterno.

#### Cosa ti serve?

* **FQDN** → che punta all'IP locale per **NethVoice proxy**
* **FQDN** → che punta all'IP locale per **NethVoice**
* **FQDN** → che punta all'IP locale per **NethVoice CTI**
* Certificato SSL valido per tutti gli FQDN (In questo scenario, Let’s Encrypt non può essere utilizzato con la validazione standard HTTP/HTTPS. La validazione basata su DNS potrebbe essere possibile ed è attualmente in fase di valutazione; contattare il supporto Nethesis per maggiori dettagli.)


### Tabella di Confronto Sintetica

| Funzionalità | ☁️ Installazione Cloud (IaaS/SaaS) | 🖥️ Installazione On-Premise Pubblica |  🖥️  Installazione On-Premise Locale |
| :--- | :--- | :--- | :--- |
| **Metodo di Accesso** | Solo FQDN (Obbligatorio). | Solo FQDN (Obbligatorio). | Solo FQDN (Obbligatorio). |
| **Gestione Firewall** | **Gestita nativamente da NethServer** (Più semplice). | **Gestita dal cliente** (Richiede competenze). | Non necessaria. |
| **Uso del Proxy** | **Consigliato** (Scegliere provider certificati). | Consigliato per evitare problemi NAT/audio. | Raccomandato per avere connessioni sicure |
| **Migrazione** | Migrazione diretta possibile; ridotti tempi di switchover. | Richiede processo di migrazione/switchover tradizionale. | Richiede processo di migrazione/switchover tradizionale. |
| **Complessità di Rete** | Bassa: FQDN singolo, nessun Hairpin NAT necessario per i client. | Alta: Richiede Hairpin NAT e/o setup Split DNS. | Bassa: difficoltà nell'ottenere i certificati. |

---

Dati i vantaggi architetturali per la rete, la sicurezza, e i significativi vantaggi operativi come firewall nativo e migrazione semplificata, l'**Installazione Cloud** è la scelta consigliata per una soluzione NethVoice robusta e semplificata.
