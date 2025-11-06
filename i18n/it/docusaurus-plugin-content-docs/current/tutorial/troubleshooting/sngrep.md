---
title: Debug delle chiamate con SNGREP
sidebar_position: 4
---

## SNGREP: cos'è e perché usarlo {#sngrep-what-it-is-and-why-to-use-it}

**Sngrep** è uno strumento a riga di comando che cattura tutto il traffico SIP VoIP che passa sulle interfacce di rete e lo visualizza raggruppato per conversazione per una migliore leggibilità.

È particolarmente utile per:
- Vedere cosa avviene a livello **SIP**.
- Comprendere cosa invia e riceve **NethVoice**.
- Ridurre i tempi necessari per identificare **errori di configurazione**.
- Salvare catture da inviare direttamente al supporto Nethesis, velocizzando la risoluzione dei problemi.
- Catturare problemi **sporadici** difficili da riprodurre o monitorare in tempo reale.

:::note
Sngrep interpreta solo il traffico **SIP in chiaro**. Non cattura:
 - Traffico da telefoni configurati con **TLS**
 - Traffico tra l'app proxy (Flexysip) e le applicazioni
 - Traffico **WebRTC CTI** (da *Janus* ai client nel browser)

Per analizzare anche questi casi è necessario **abilitare il supporto TLS** in Sngrep come descritto di seguito.

:::

## Installazione {#installation}

Se sngrep non è già installato su NethServer, puoi installarlo facilmente. Esegui il seguente comando come root dal cluster:

```bash
dnf -y install http://repo.okay.com.mx/centos/9/x86_64/release/sngrep-1.6.0-1.el9.x86_64.rpm 
```

## Avviare Sngrep {#launching-sngrep}

Il modo più rapido per avviare una cattura live è eseguire (come root):

```bash
sngrep
```

### Opzioni utili {#useful-options}

| Opzione        | Descrizione                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `-r`          | Cattura anche il traffico **RTP**, utile se vuoi salvare gli stream audio.   |
| `-I [file]`   | Legge un file di cattura salvato invece di catturare in tempo reale.         |
| `-O [file]`   | Salva la cattura corrente direttamente su file.                              |
| `-c`          | Cattura solo i messaggi **INVITE** (chiamate in ingresso/uscita).           |
| `-d [device]` | Limita la cattura a una specifica interfaccia di rete (default: any).        |


## Utilizzo dell'interfaccia {#using-the-interface}

Una volta avviato, Sngrep inizierà a mostrare tutte le dialoghi SIP in tempo reale. In alto puoi vedere il numero di dialoghi catturati (limite predefinito: 20.000).

### Controlli principali {#main-controls}

* **Freccia su/giù:** scorrere tra i dialoghi.
* **Enter:** visualizzare i messaggi SIP del dialogo selezionato.
* **Spacebar:** selezionare/deselezionare un messaggio o dialogo.
* **F2:** salvare un file di cattura `.pcap` (include audio se avviato con `-r`).
* **F3:** visualizzare gli stream RTP, i pacchetti e le informazioni sui codec.
* **F7:** impostare filtri (utile per rimuovere dialoghi irrilevanti come `OPTIONS` o `SUBSCRIBE`).
* **F10:** aggiungere o rimuovere colonne (es. “Time”).
* **ESC:** uscire da Sngrep.


## Abilitare TLS in SNGREP {#enable-tls-in-sngrep}

Per visualizzare il traffico TLS in SNGREP per NethVoice, segui questi passaggi.

### 1. Abilitare `siptrace` in Kamailio {#1-enable-siptrace-in-kamailio}

```bash
runagent -m nethvoice-proxy1 kamcmd siptrace.status on
```


### 2. Creare il file di configurazione {#2-create-the-configuration-file}

Creare `/root/.sngrephep2rc` con il seguente contenuto:

```bash
cat > /root/.sngrephep2rc <<'EOF'
set capture.device lo
set eep.listen on
set eep.listen.version 2
set eep.listen.address 127.0.0.1
set eep.listen.port 5065
EOF
```


### 3. Avviare SNGREP {#3-start-sngrep}

Esegui:

```bash
sngrep -f ~/.sngrephep2rc -d any
```

> **Nota:**
> Solo **un utente alla volta** può eseguire Sngrep con questa configurazione. Sessioni simultanee non sono supportate.


### 4. (Facoltativo) Abilitare il debug di Kamailio {#4-optional-enable-kamailio-debug-logging}

Per abilitare il logging di debug:

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvSet debug int 1
```

#### Disabilitalo al termine {#disable-it-when-finished}

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvSet debug int 0
```

#### Verificare lo stato corrente del debug {#check-current-debug-status}

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvGet debug
```


## Esempi di schermate {#example-screens}

* **Schermata principale:** mostra i dialoghi SIP catturati e i loro stati.

  ![Main screen](/img/administrator-manual/sngrep1.png)

* **Esempio chiamata in ingresso:** screenshot di una chiamata in ingresso (INVITE) dal trunk che è stata risposta dall'interno 201. Si vedono le due gambe di chiamata: quella tra il trunk e NethVoice e quella tra NethVoice e l'interno 200.

  ![Incoming call example](/img/administrator-manual/sngrep2.png)

* **Vista multipla dialoghi:** permette di confrontare i messaggi SIP scambiati in parallelo tra le gambe di chiamata.

  ![Multiple dialog view](/img/administrator-manual/sngrep3.png)


## Riepilogo {#summary}

Con questa configurazione, SNGREP può catturare e visualizzare sia il traffico **SIP** che **TLS** su NethVoice NS8.
È uno strumento essenziale per:

* Analisi chiamate
* Troubleshooting rapido della configurazione
* Supporto tecnico avanzato

Ricorda sempre di **disabilitare il debug di Kamailio** al termine dell'analisi.
