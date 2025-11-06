---
title: Firewall
sidebar_position: 12
---

# Configurazione del Firewall

## Panoramica

Se il tuo nodo NS8 è configurato direttamente con un indirizzo IP pubblico (senza un firewall dedicato davanti), il firewall perimetrale NS8 apre automaticamente tutte le porte necessarie. Non è richiesta alcuna configurazione aggiuntiva del firewall in questo scenario.

Quando si distribuisce NethVoice in un'infrastruttura con un firewall dedicato davanti al nodo NS8, è necessario aprire porte specifiche per garantire che tutti i servizi funzionino correttamente. Questa guida fornisce informazioni dettagliate sui requisiti del firewall per le distribuzioni di NethVoice.

Se c'è un firewall dedicato davanti alla tua infrastruttura NS8, devi aprire esplicitamente le porte richieste da NethVoice. Vedi l'elenco di seguito.

### Porte del Proxy

Il servizio proxy richiede le seguenti porte:

- **TCP**: 5060-5061
- **UDP**: 5060-5061, 10000-20000

### Porte Specifiche dell'Istanza NethVoice

Ogni istanza di NethVoice ha porte di servizio specifiche.
Per identificare tutte le porte richieste per una determinata istanza, accedi alla pagina di amministrazione del cluster NethServer e vai alle impostazioni del firewall in **Impostazioni > Firewall**.

Ecco un elenco delle porte comunemente utilizzate:

- Porta CTI TLS (TCP), ad es. `20107`: questa porta è riservata per la comunicazione TLS di NethCTI (attualmente non utilizzata attivamente ma disponibile per uso futuro).
- Porta LDAP della Rubrica (TCP), ad es. `20092`: utilizzata per l'integrazione dei servizi di directory LDAP con la rubrica. I telefoni che devono accedere alla rubrica LDAP devono essere in grado di raggiungere questa porta.
- Porta SFTP (TCP), ad es. `20149`: utilizzata per l'accesso SFTP da parte di servizi specifici (ad es. caricamento/download di registrazioni).
- Porta IAX (UDP), ad es. `20110`: singola porta UDP per il protocollo IAX (Inter-Asterisk eXchange).
- Porte RTP e Janus (UDP): utilizzate per lo streaming audio in NethCTI, è un intervallo di porte, di solito intorno a 1000 porte.

### Porte Generiche

**WireGuard VPN**
- Porta: 55820, utilizzata per connettere i nodi NethServer
- Protocollo: UDP

**HTTPS**
- HTTPS: Porta 443 (TCP), utilizzata per accedere a CTI e all'interfaccia web di amministrazione

**SSH**
- Porta: 22 (predefinita), utilizzata per la gestione remota
- Protocollo: TCP

### Tabella di Riepilogo delle Porte {#port-summary}

| Servizio | Porta/e | Protocollo | Scopo |
|----------|---------|-----------|-------|
| Proxy SIP | 5060-5061 | TCP/UDP | Segnalazione SIP |
| RTP | 10000-20000 | UDP | Streaming media (proxy) |
| Janus RTP | Intervallo variabile* | UDP | Streaming audio CTI |
| IAX | Variabile* | UDP | Inter-Asterisk Exchange |
| CTI TLS | Variabile* | TCP | Comunicazione sicura CTI |
| LDAP | Variabile* | TCP | Servizi di directory |
| SFTP | Variabile* | TCP | Gestione registrazioni |
| WireGuard VPN | 55820 | UDP | Accesso VPN |
| HTTPS | 443 | TCP | Servizi web |
| SSH | 22 | TCP | Gestione remota |

*Le porte variabili sono specifiche dell'istanza. Utilizza il metodo di ispezione delle variabili di ambiente descritto sopra per determinare i numeri di porta esatti per la tua distribuzione.

## Best Practice del Firewall

### NAT Helper

Le funzioni di NAT helper sui firewall dovrebbero essere **disabilitate** quando possibile. Queste funzionalità sono spesso implementate male e possono causare comportamenti inaspettati con i protocolli di comunicazione di NethVoice.

### Hairpin NAT {#hairpin-nat}

Quando un proxy viene distribuito dietro un firewall con Network Address Translation (NAT), il **hairpin NAT** (noto anche come NAT reflection, NAT hairpining o loopback NAT) deve essere abilitato sul firewall.

#### Perché l'Hairpin NAT è Importante

Hairpin NAT consente ai dispositivi della rete locale di raggiungere il proxy utilizzando l'indirizzo IP esterno (pubblico) o l'FQDN, anche se si trovano sulla stessa rete locale. Ciò è essenziale per il corretto provisioning e funzionamento dei dispositivi.

#### Abilitazione di Hairpin NAT

La maggior parte dei firewall dispone di funzionalità di NAT reflection o hairpin NAT disponibili. Consulta la documentazione del tuo firewall per istruzioni specifiche. Termini comuni da cercare:

- NAT Reflection
- Hairpin NAT
- NAT Hairpining
- Loopback NAT
- NAT on a Stick

## Risoluzione dei Problemi

Se riscontri problemi di connettività dopo aver aperto le porte del firewall:

1. **Verifica che tutte le porte siano aperte**: Utilizza strumenti di scansione delle porte per confermare il funzionamento delle regole del firewall
2. **Controlla la configurazione NAT**: Se dietro NAT, assicurati che hairpin NAT sia abilitato
3. **Disabilita NAT helper**: Prova a disabilitare le funzioni NAT helper/ALG se la connettività è intermittente
4. **Verifica le porte dell'istanza**: Verifica di aver aperto le porte corrette per la tua istanza specifica di NethVoice
5. **Contatta il supporto**: Apri un ticket con il supporto Nethesis se i problemi persistono
