---
title: Problemi di Audio
sidebar_position: 3
---

# Problemi di Audio e Disconnessioni delle Chiamate

Questa guida affronta i problemi comuni di audio in NethVoice, incluse le chiamate che cadono dopo 30 secondi, audio mono-direzionale o assente. Questi problemi si verificano tipicamente in configurazioni di rete specifiche dove è coinvolto il NAT (Network Address Translation), come telefoni remoti che si collegano via VPN o TLS, o ambienti multi-subnet.

:::warning

La configurazione diretta del NAT su FreePBX è **necessaria solo** se il Proxy è stato bypassato nella vostra configurazione.

Negli ambienti di deploy di NethVoice standard, il Proxy gestisce la traduzione NAT, e dovete configurare le impostazioni NAT solo attraverso l'interfaccia di amministrazione di NethVoice (come descritto sopra).

:::

## Scenari {#scenarios}

### Scenario 1: Chiamate che Cadono Dopo 30 Secondi (On-Premises, Multiple Subnet)

**Situazione:** NethVoice è installato on-premises con telefoni client che si collegano da subnet differenti dovute all'infrastruttura di rete, risultando in chiamate che cadono dopo circa 30 secondi.

**Causa Principale:** Questo è tipicamente un timeout lato server dovuto a cattiva gestione dell'audio. Quando il server non riceve audio da almeno un partecipante della chiamata per più di 30 secondi, termina la chiamata.

### Scenario 2: Telefoni Remoti via VPN (Audio Mono-direzionale o Assente)

**Situazione:** Telefoni registrati da sedi remote tramite VPN hanno audio mono-direzionale o assente.

**Causa Principale:** Configurazione NAT (Network Address Translation) che non tiene conto degli indirizzi di subnet VPN remoti.

### Scenario 3: Telefoni Remoti via TLS (Audio Mono-direzionale o Assente)

**Situazione:** Telefoni registrati da sedi remote utilizzando crittografia TLS hanno audio mono-direzionale o assente.

![VoIP Provider ACK Issue](/img/tutorial/sngrep_trunk.png)

**Causa Principale:** Configurazione dell'indirizzo IP esterno non correttamente pubblicizzata ai client TLS-connessi.

### Scenario 4: Problema ACK del Provider VoIP

**Situazione:** NethVoice invia una risposta **200 OK** al provider, ma il provider non restituisce un **ACK** (acknowledgment). Questo tipicamente indica una segnalazione di chiamata incompleta.

**Causa Principale:** NethVoice pubblicizza un indirizzo IP pubblico differente rispetto a quello da cui la segnalazione è effettivamente inviata, causando al provider di instradare l'ACK a una destinazione errata.

## Soluzione: Configurare le Impostazioni NAT {#nat-settings}

Per risolvere questi problemi, dovete configurare correttamente le impostazioni NAT in NethVoice.

### Accedere alla Configurazione NAT

1. Accedete all'interfaccia web di NethVoice.
2. Navigare alla sezione di amministrazione avanzata.
3. Individuate la sezione **Configurazione NAT**.

### Opzioni di Configurazione

#### Indirizzo Esterno {#external-address}

Il campo **Indirizzo Esterno** deve contenere l'**indirizzo IP pubblico** dove NethVoice riceverà l'audio da dispositivi al di fuori delle reti locali.

**Scopo:**
- Utilizzato per dispositivi che si collegano da subnet non locali (uffici remoti, VPN, telefoni remoti).
- Pubblicizzato nella segnalazione SIP per istruire i dispositivi esterni dove inviare l'audio.
- Per lo Scenario 4 specificamente, questo IP è utilizzato negli header di segnalazione inviati al provider VoIP, assicurando che la risposta ACK del provider vada alla destinazione corretta.

**Come trovare il vostro IP pubblico:**
Potete identificare il vostro IP pubblico dalla variabile di ambiente sul sistema NethVoice, o utilizzare un comando come `curl ifconfig.me`.

#### Reti Locali {#local-networks}

Il campo **Reti Locali** specifica quali subnet riceveranno l'indirizzo IP della **interfaccia green (interna)** di NethVoice per il routing dell'audio.

**Esempio:**
Se configurate `192.168.1.0/24` e `192.168.2.0/24` come reti locali:
- I telefoni che si collegano da queste subnet riceveranno l'indirizzo IP interno green.
- Questi telefoni invieranno l'audio all'IP interno (ottimale per le prestazioni LAN).
- I telefoni da altre reti riceveranno invece l'**Indirizzo Esterno**.

#### Casi Speciali

**Scenario 2 (Telefoni Remoti via VPN):**
- Aggiungete la subnet remota (rete VPN) alla configurazione **Reti Locali**.
- Questo dice a NethVoice di pubblicizzare il suo IP interno a quei telefoni, supponendo che la VPN fornisca connettività di rete.

**Scenario 3 (Telefoni Remoti via TLS):**
- Nessuna configurazione NAT è richiesta in questo scenario.
- I telefoni che si presentano da una sorgente IP pubblica non necessitano di alcun trattamento NAT speciale.

**Scenario 4 (Problema ACK del Provider):**
- Assicuratevi che l'**Indirizzo Esterno** sia correttamente configurato.
- Questo indirizzo esterno sarà utilizzato negli header di segnalazione SIP verso il provider.

### Applicare le Modifiche

Dopo aver configurato le impostazioni NAT:

1. Cliccate su **Salva Impostazioni NAT**.
2. NethVoice riavvierà il core telefonico per rendere operative le modifiche.
3. **Importante:** Le chiamate attive saranno terminate durante questo riavvio.

## Scenario Multi-WAN (Modalità Balance) {#multiwan-warning}

Se la vostra rete utilizza Multi-WAN in modalità balance (traffico instradato casualmente su più connessioni), i problemi di audio possono persistere anche con la configurazione NAT corretta. Questo perché l'IP sorgente utilizzato per la segnalazione può differire dall'Indirizzo Esterno configurato.

**Raccomandazione:**
Configurate una o più **rotte statiche** per forzare il traffico destinato all'Indirizzo Esterno a utilizzare la specifica connessione WAN che corrisponde al vostro Indirizzo Esterno configurato. Questo assicura routing coerente e qualità audio.

## Prossimi Passi

Se i problemi persistono dopo aver configurato le impostazioni NAT:
- Consultate la [Configurazione del Firewall](../../administrator-manual/configuration/firewall.md) per assicurarvi che le regole firewall permettano le porte necessarie.
- Controllate la guida [sngrep](./sngrep.md) per analizzare la segnalazione SIP in dettaglio.
