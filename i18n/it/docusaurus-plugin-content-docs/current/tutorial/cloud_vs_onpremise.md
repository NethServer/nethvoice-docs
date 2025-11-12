---
title: Cloud vs on-premise
sidebar_position: 7
---

La decisione tra un'installazione **Cloud (IaaS/SaaS)** e **On-Premise** (locale) di NethVoice su NethServer dipende principalmente dai requisiti aziendali, dalle risorse IT disponibili, e dalle esigenze specifiche riguardanti il controllo, la sicurezza e la scalabilità.

NethVoice non può essere accessibile utilizzando un indirizzo IP — i client (telefoni IP, app mobile, integrazioni CTI e NethLink) devono essere sempre configurati per utilizzare l'**FQDN pubblicamente risolvibile**.

Questo è un cambiamento fondamentale rispetto alle versioni precedenti (ad es. NethVoice 14) ed è imposto dalle migliori pratiche moderne per la **Sicurezza** (abilitazione di certificati SSL/TLS validi) e la **Manutenibilità** (gestione centralizzata semplificata). Un FQDN pubblicamente risolvibile è un prerequisito richiesto obbligatoriamente.


### Opzione 1: Deployment Cloud (IaaS o SaaS)

Questa opzione prevede l'hosting di NethServer e NethVoice presso un Cloud Provider (IaaS) o l'utilizzo di una soluzione SaaS pre-configurata.

#### Vantaggi Principali

* **Certificazione del Provider**: In generale, è sempre consigliato scegliere un provider certificato che si integri completamente con il proxy NethVoice per evitare potenziali problemi di connessione e registrazione.
* **Gestione Firewall Nativa**: Il componente firewall è gestito nativamente da NethServer nell'ambiente cloud.
* **Consolidamento**: Più piccoli sistemi PBX possono essere consolidati efficientemente in un singolo nodo NethServer.
* **Migrazione Semplificata**: Quando i media gateway non sono coinvolti, la migrazione diretta dall'hardware esistente è possibile, riducendo i tempi di switchover.

Il proxy NethVoice (Kamailio/RTP Engine) segue rigorosamente gli standard SIP e include misure di hardening aggiuntive per migliorare la sicurezza. Il proxy agisce come punto di terminazione SIP/TLS e relay multimediale, applicando le best practice SIP (parsing rigoroso, autenticazione, ACL, rate-limiting, TLS/SRTP dove applicabile) per ridurre la superficie di attacco e migliorare la resilienza.

Il proxy isola e media la segnalazione e i media esterni, e insieme al firewall, evita l'esposizione diretta di Asterisk migliorando la sicurezza.

### Opzione 2: Deployment On-Premise

L'installazione On-Premise prevede l'hosting di NethServer e NethVoice sui server fisici propri dell'azienda o come macchina virtuale (VM) all'interno dell'infrastruttura di rete locale.

#### Sfide Principali e Considerazioni

* **Gestione Firewall**: Il cliente è responsabile della configurazione e della gestione del firewall (router/dispositivo perimetrale).
* **Mandato FQDN / SSL**: Un FQDN pubblico è ancora obbligatorio. Funzionalità come NethLink e l'App Mobile richiedono FQDN pubblico, SSL, e raggiungibilità esterna su porte specifiche.
* **Problemi di Rete e Audio**: I problemi di audio (ad es. audio unidirezionale) nei deployment on-premise sono spesso causati da problemi di configurazione NAT. Per i passaggi di troubleshooting, fate riferimento a: [guida di troubleshooting](./troubleshooting/audio_problems.md).
* **Complessità di Rete**: Richiede Hairpin NAT e configurazione firewall attenta per permettere ai client locali di accedere al server via il suo FQDN pubblico. In alternativa, Split DNS può essere configurato per risolvere l'FQDN a un indirizzo IP locale per i client interni.
* **Spot di configurazioni errate**: In caso di configurazioni errate, l'analisi e la correzione può richiedere un intervallo di tempo non trascurabile.


### Tabella di Confronto Sintetica

| Funzionalità | ☁️ Installazione Cloud (IaaS/SaaS) | 🖥️ Installazione On-Premise |
| :--- | :--- | :--- |
| **Metodo di Accesso** | Solo FQDN (Obbligatorio). | Solo FQDN (Obbligatorio). |
| **Gestione Firewall** | **Gestita nativamente da NethServer** (Più semplice). | **Gestita dal cliente** (Richiede competenze). |
| **Uso del Proxy** | **Consigliato** (Scegliere provider certificati). | Consigliato per evitare problemi NAT/audio. |
| **Migrazione** | Migrazione diretta possibile; ridotti tempi di switchover. | Richiede processo di migrazione/switchover tradizionale. |
| **Complessità di Rete** | Bassa: FQDN singolo, nessun Hairpin NAT necessario per i client. | Alta: Richiede Hairpin NAT e/o setup Split DNS. |

---

Dati i vantaggi architetturali per la rete, la sicurezza, e i significativi vantaggi operativi come firewall nativo e migrazione semplificata, il **Deployment Cloud** è la scelta consigliata per una soluzione NethVoice robusta e semplificata.

## Feedback

In caso di malfunzionamenti riscontrati, inviaci una segnalazione all'indirizzo [test@example.it](mailto:test@example.it).