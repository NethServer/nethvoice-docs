---
title: Proteggere NethVoice dagli attacchi brute-force (CrowdSec)
sidebar_position: 10
---

# Proteggere NethVoice dagli attacchi brute-force con CrowdSec

Qualsiasi installazione di NethVoice raggiungibile da Internet è un bersaglio.
Gli aggressori utilizzano strumenti automatizzati che colpiscono i moduli di
login e gli endpoint SIP, tentando di indovinare le credenziali migliaia di
volte all'ora. Se non controllato, ciò porta al blocco degli account, a frodi
telefoniche e a un degrado del servizio.

[CrowdSec](https://www.crowdsec.net/) è un motore di rilevamento delle minacce
disponibile come **applicazione di NethServer 8**. Monitora i log delle
applicazioni per individuare schemi di attacco noti (ad esempio tentativi di
accesso falliti ripetuti) e, quando ne rileva uno, **banna l'indirizzo IP
sorgente al firewall** per un periodo di tempo configurabile. Questa guida
spiega come abilitarlo sul nodo che esegue NethVoice e come gestire i ban che
crea.

È possibile installare **una sola istanza di CrowdSec per nodo**, e protegge
ogni applicazione in esecuzione su quel nodo — inclusa NethVoice.

## Protezioni di CrowdSec {#crowdsec-protections}

Le collezioni dell'hub di CrowdSec includono già scenari per bloccare gli
attacchi HTTP standard, come i tentativi di brute-force rapidi contro gli
endpoint di login.

Il modulo CrowdSec di NethServer aggiunge inoltre scenari specifici per
NethVoice che rilevano:

- **Attacchi di brute-force ed exploit-scan HTTP** contro il middleware CTI di
  NethVoice.
- **Attacchi di brute-force** contro l'endpoint di login dell'API di
  amministrazione di NethVoice (`/freepbx/rest/login`).
- **Attacchi di brute-force** contro il login dell'applicazione dei report di
  NethVoice (`reports-api`).
- **Attacchi di brute-force SIP** contro l'autenticazione di Kamailio.

Ciascuno di questi attiva un ban dell'IP sorgente, come per le collezioni
generiche.

:::note Nuove installazioni vs installazioni esistenti
Queste protezioni NethVoice sono **abilitate per impostazione
predefinita sulle nuove installazioni di CrowdSec** a partire dalla versione
`1.2.0`. Sulle installazioni aggiornate in cui CrowdSec era già presente, gli
scenari NethVoice sono **disabilitati per impostazione predefinita** e devono
essere attivati manualmente — vedere
[Abilitare la protezione NethVoice e Kamailio](#enable-nethvoice-kamailio) più
sotto.
:::

## Installare CrowdSec {#install}

1. Aprire il **Software Center** nell'interfaccia del cluster di NethServer 8.
2. Cercare **CrowdSec** e fare clic su **Install**, selezionando lo stesso
   nodo che esegue NethVoice.
3. Attendere il completamento dell'installazione. La protezione è attiva
   immediatamente.

CrowdSec espone una pagina di configurazione nell'interfaccia del cluster
dove è possibile impostare la durata dei ban, la whitelist degli IP, le
notifiche via email e l'iscrizione alla CrowdSec Console. Queste opzioni sono
comuni a ogni installazione di NethServer 8, quindi, invece di ripeterle qui,
fare riferimento alla [documentazione del modulo CrowdSec di NethServer](https://docs.nethserver.org/docs/administrator-manual/applications/crowdsec)

## Abilitare la protezione NethVoice e Kamailio {#enable-nethvoice-kamailio}

Le nuove installazioni di CrowdSec includono i parser e gli scenari NethVoice
(elencati [sopra](#crowdsec-protections)) già abilitati — NethVoice, inclusa
l'autenticazione SIP di Kamailio, è protetta completamente fin da subito.

Se si sta aggiornando un modulo CrowdSec esistente e la funzionalità è
disabilitata, abilitarla dalla pagina **Collections** del modulo CrowdSec
nell'interfaccia del cluster:

1. Aprire il modulo CrowdSec e andare su **Collections**.
2. Cercare **nethvoice**.
3. Fare clic su **Enable** accanto alla voce `nethesis/nethvoice`.

Per disabilitarla di nuovo, fare clic su **Disable** sulla stessa voce.

:::note La protezione SIP dipende dal NethVoice Proxy
Rilevare il brute-force SIP di Kamailio richiede una versione del NethVoice
Proxy che esponga a CrowdSec gli IP sorgente dei tentativi di autenticazione
SIP falliti. Se i ban SIP non si attivano mai, aggiornare il modulo NethVoice
Proxy almeno alla versione `1.6.4`.
:::

## Aggiungere alla whitelist le reti attendibili {#whitelist}

:::warning Evitare di bloccarsi fuori
Prima di utilizzare CrowdSec in produzione, aggiungere gli indirizzi IP della
propria **sede, VPN e monitoraggio** alla whitelist. Gli indirizzi in
whitelist non vengono mai bannati, quindi un amministratore che sbaglia a
digitare una password alcune volte non verrà bloccato fuori dal server.
:::

Aprire la pagina di configurazione di CrowdSec nell'interfaccia del cluster e
inserire i propri IP o reti attendibili (uno per riga) nel campo
**whitelist**. Salvare per applicare.

## Gestire i ban dalla riga di comando {#manage-bans}

CrowdSec fornisce lo strumento a riga di comando `cscli`. Per utilizzarlo,
accedere prima all'ambiente del modulo sul nodo:

```bash
runagent -m crowdsec1
```

Quindi utilizzare i seguenti comandi.

**Elencare gli IP attualmente bannati (decisioni attive):**

```bash
cscli decisions list
```

**Rimuovere un ban** — ad esempio quando un utente legittimo è stato bloccato:

```bash
# per indirizzo IP
cscli decisions delete --ip 192.0.2.10

# oppure per ID decisione (dall'elenco sopra)
cscli decisions delete --id 12345
```

**Aggiungere un ban manuale** — bloccare manualmente un IP abusivo:

```bash
cscli decisions add --ip 192.0.2.10 --duration 4h --reason "manual block"
```

:::tip
`cscli decisions add` accetta durate flessibili come `30m`, `4h` o `24h`.
Utilizzare una durata breve durante i test per poter correggere rapidamente
eventuali errori.
:::

**Esaminare i rilevamenti che hanno attivato una decisione** (alcuni avvisi
non portano a un ban):

```bash
cscli alerts list
```


## Verificare il funzionamento {#verify}

Dall'interno dell'ambiente del modulo (`runagent -m crowdsec1`), confermare
che le regole di rilevamento siano caricate e che l'enforcer sia attivo:

```bash
# protezioni abilitate
cscli scenarios list

# metriche
cscli metrics
```

Se la protezione NethVoice è abilitata, `cscli scenarios list` dovrebbe
includere voci con `nethvoice` o `kamailio` nel nome. Esaminarne una per i
dettagli, sostituendo `<name>` con il valore dell'elenco:

```bash
cscli scenarios inspect <name>
```

Per vedere CrowdSec reagire in tempo reale, osservare l'elenco delle decisioni
mentre una macchina di test (non in whitelist) effettua ripetuti tentativi di
accesso falliti contro l'interfaccia web di NethVoice:

```bash
watch cscli decisions list
```

L'IP responsabile dovrebbe apparire come una nuova decisione una volta
raggiunta la soglia di fallimenti.

## Avvisi via email {#alerts}

CrowdSec può inviare un **report giornaliero degli IP bannati** e notificare
quando il numero di ban supera una certa soglia. Queste notifiche dipendono
dal fatto che il nodo abbia una configurazione di posta funzionante, e sia i
destinatari che la soglia si impostano nella pagina di configurazione di
CrowdSec — vedere il
[manuale amministratore di NethServer](https://docs.nethserver.org/docs/administrator-manual/applications/crowdsec)
per i dettagli.

## Difesa in profondità per SIP {#defense-in-depth-sip}

CrowdSec banna un aggressore dopo aver riconosciuto uno schema, quindi
completa — senza sostituire — l'hardening di base delle porte di telefonia:

- Pubblicare SIP solo verso i trunk e i telefoni remoti che ne hanno bisogno,
  non verso l'intera Internet.
- Utilizzare segreti delle estensioni forti e non facilmente indovinabili.
- Terminare i telefoni remoti tramite il **NethVoice Proxy** piuttosto che
  esporre direttamente Asterisk — questo è anche necessario perché il
  rilevamento Kamailio di CrowdSec possa vedere i tentativi di autenticazione
  SIP falliti (vedere
  [Abilitare la protezione NethVoice e Kamailio](#enable-nethvoice-kamailio)).

## Tutorial correlati {#related-tutorials}

* [Risoluzione dei problemi di NethVoice](./troubleshooting/index.md)
* [Scenari comuni di distribuzione](./cloud_vs_onpremise.md)
