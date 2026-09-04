---
title: Script sugli eventi di chiamata
sidebar_position: 9
---

# Script sugli eventi di chiamata {#script-eventi-chiamata}

NethVoice può eseguire script personalizzati in arrivo e chiusura della chiamata. Questa funzione può essere utilizzata per integrare NethVoice con CRM, sistemi di ticketing, applicazioni gestionali o servizi HTTP esterni.

:::warning
Gli script vengono eseguiti nel container `freepbx`. Devono terminare rapidamente, gestire gli errori senza bloccare il processo e trattare tutti i dati ricevuti come input non attendibile.
:::

## Prerequisiti {#prerequisiti}

Prima di procedere:

- individua l'identificatore dell'istanza NethVoice, per esempio `nethvoice1`
- copia lo script nella directory /tmp del nodo
- Accedi all'ambiente dell'istanza:
```bash
runagent -m nethvoice1
 ```
- copia lo script nell'applicazione, per esempio SCRIPT.name
```bash
podman cp /tmp/SCRIPT.name freepbx:/var/lib/asterisk/agi-bin/SCRIPT.name
 ```
- modifica il proprietario e il gruppo
```bash
podman exec freepbx chown asterisk.asterisk /var/lib/asterisk/agi-bin/SCRIPT.name
 ```
- rendi lo script eseguibile nel container
```bash
podman exec freepbx chmod 750 /var/lib/asterisk/agi-bin/SCRIPT.name
 ```

## Eseguire uno script al termine di una chiamata {#script-termine-chiamata}

Apri `~/.config/state/environment` nell'ambiente dell'istanza e aggiungi:

```ini
NETHCTI_CDR_SCRIPT=/var/lib/asterisk/agi-bin/SCRIPT.name
```

Riavvia il servizio per applicare le variabili di ambiente, comporta il riavvio di Asterisk e quindi la chiusura di tutte le chiamate:
```bash
systemctl --user restart freepbx
```

Per disattivare l'hook, imposta un valore vuoto e riavvia il servizio:

```ini
NETHCTI_CDR_SCRIPT=
```

NethVoice passa allo script i seguenti argomenti, nello stesso ordine:

| Posizione | Parametro | Descrizione |
|---:|---|---|
| 1 | `source` | Numero sorgente |
| 2 | `channel` | Canale sorgente |
| 3 | `endtime` | Data e ora di fine |
| 4 | `duration` | Durata totale in secondi |
| 5 | `amaflags` | Flag AMA del CDR |
| 6 | `uniqueid` | Identificatore univoco del canale |
| 7 | `callerid` | Caller ID completo |
| 8 | `starttime` | Data e ora di inizio |
| 9 | `answertime` | Data e ora della risposta, se presente |
| 10 | `destination` | Destinazione |
| 11 | `disposition` | Esito del CDR, per esempio `ANSWERED`, `NO ANSWER`, `BUSY` o `FAILED` |
| 12 | `lastapplication` | Ultima applicazione Asterisk eseguita |
| 13 | `billableseconds` | Durata dalla risposta alla fine della chiamata |
| 14 | `destinationcontext` | Contesto di destinazione |
| 15 | `destinationchannel` | Canale di destinazione |
| 16 | `accountcode` | Account code del canale |

## Eseguire uno script per una chiamata esterna in ingresso {#script-chiamata-ingresso}

Apri `~/.config/state/environment` nell'ambiente dell'istanza e aggiungi:

```ini
NETHCTI_CDR_SCRIPT_CALL_IN=/var/lib/asterisk/agi-bin/SCRIPT.name
```

Riavvia il servizio per applicare le variabili di ambiente, comporta il riavvio di Asterisk e quindi la chiusura di tutte le chiamate:
```bash
systemctl --user restart freepbx
```

Per disattivare l'hook, imposta un valore vuoto e riavvia il servizio:

```ini
NETHCTI_CDR_SCRIPT_CALL_IN=
```

NethVoice passa allo script i seguenti argomenti, nello stesso ordine:

| Posizione | Parametro | Descrizione |
|---:|---|---|
| 1 | `callerNum` | Numero del chiamante |
| 2 | `uniqueId` | Identificatore univoco della chiamata o del canale |

