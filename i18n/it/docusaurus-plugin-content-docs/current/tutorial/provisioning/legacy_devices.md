---
title: Dispositivi legacy
sidebar_position: 3
---

## Panoramica {#overview}

Alcuni telefoni e citofoni molto vecchi potrebbero non supportare la crittografia TLS. Questi dispositivi **non possono essere** provisioning tramite NethVoice, che richiede TLS per le connessioni sicure.

:::warning Caso di uso non supportato
I dispositivi legacy senza supporto TLS non sono ufficialmente supportati. Si tratta di un caso limite che richiede una configurazione speciale a livello di rete.
:::

## Approccio di bypass di rete {#network-bypass}

L'unico modo per eseguire il provisioning di dispositivi legacy senza supporto TLS è attraverso un **bypass a livello di rete**. Questo approccio consente al dispositivo di connettersi direttamente ad Asterisk sulla porta SIP in chiaro, bypassando il proxy.

### Come funziona {#how-it-works}

Invece di connettersi attraverso il proxy (che applica TLS), i dispositivi legacy si collegano direttamente all'istanza di Asterisk utilizzando la porta SIP non crittografata. Questo richiede:

1. Identificazione della porta SIP in chiaro per la specifica istanza di Asterisk
2. Apertura del firewall per consentire al dispositivo di accedere a quella porta
3. Configurazione del dispositivo per connettersi direttamente all'host Asterisk sulla porta designata

### Configurazione passo dopo passo {#step-by-step}

#### 1. Trovare la porta SIP in chiaro {#find-port}

Ogni istanza di NethVoice ha una porta SIP univoca per le connessioni non crittografate. Collegati all'host NethVoice ed esegui:

```bash
runagent -m nethvoice1
```

Sostituisci `nethvoice1` con il nome del modulo appropriato per la tua istanza.

Quindi controlla la variabile di ambiente `ASTERISK_SIP_PORT`:

```bash
env | grep ASTERISK_SIP_PORT
```

Esempio di output:
```
ASTERISK_SIP_PORT=20098
```

In questo esempio, la porta SIP in chiaro è `20098`.

#### 2. Aprire il firewall per il dispositivo {#open-firewall}

Usa una regola del firewall per consentire **solo** all'indirizzo IP del dispositivo di accedere alla porta SIP di Asterisk. Sostituisci `1.2.3.4` con l'indirizzo IP effettivo del dispositivo legacy e `20098` con la porta identificata nel passaggio 1:

```bash
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address=1.2.3.4 port port=20098 protocol="udp" accept'
firewall-cmd --reload
```

Questa regola garantisce che:
- Solo l'indirizzo IP del dispositivo specificato possa accedere alla porta
- L'accesso sia limitato a UDP (protocollo SIP)
- La regola persista nei riavvii del firewall

Per rimuovere la regola in seguito, usa:

```bash
firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address=1.2.3.4 port port=20098 protocol="udp" accept'
firewall-cmd --reload
```

#### 3. Configurare il dispositivo {#configure-device}

Configura il dispositivo legacy con le seguenti impostazioni:

- **Server SIP**: Il nome host o l'indirizzo IP dell'host NethVoice
- **Porta SIP**: La porta SIP in chiaro identificata nel passaggio 1 (es. `20098`)
- **Trasporto**: `UDP` (non TLS)

Fai riferimento alla documentazione del tuo dispositivo per i passaggi di configurazione specifici.

### Considerazioni sulla sicurezza {#security}

:::caution Avvertenza di sicurezza
Connettere i dispositivi direttamente ad Asterisk utilizzando SIP non crittografato **non è sicuro**. Il traffico SIP, comprese le credenziali, viene trasmesso in testo normale. Questo approccio dovrebbe essere utilizzato solo per i dispositivi legacy che non hanno altre opzioni e in ambienti di rete controllati.

- Limitare l'accesso del firewall solo all'indirizzo IP del dispositivo necessario
- Utilizzare credenziali forti sul dispositivo
- Considerare la segmentazione della rete se possibile
- Monitorare la connessione per gli accessi non autorizzati
:::

## Alternative {#alternatives}

Se possibile, considera queste alternative:

- **Sostituire il dispositivo**: Se il dispositivo è troppo vecchio per supportare TLS, considera l'aggiornamento a un telefono o citofono moderno che supporti connessioni sicure
- **Valutare il supporto del dispositivo**: Verifica con il produttore del dispositivo se un aggiornamento del firmware aggiunge il supporto TLS
