---
title: Gestione allarmi code
sidebar_position: 11
---

# Gestione degli allarmi delle code

Il **Gestore Code di NethVoice CTI** dispone di un sistema di allarmi che permette di monitorare il carico delle code telefoniche e individuare eventuali situazioni critiche, come un numero elevato di chiamate in attesa, tempi di attesa eccessivi o un numero insufficiente di operatori disponibili.

Gli allarmi vengono attivati automaticamente quando vengono superate determinate soglie, configurabili dall'amministratore di sistema.

## Tipologie di allarme

Il sistema prevede quattro tipologie di allarme:

| Allarme | Descrizione | Condizione di attivazione |
|---|---|---|
| `queueload` | **Carico elevato della coda** | Il numero di chiamate in attesa è superiore a MAX_CALLS **e** il tempo medio di attesa supera MAX_HOLDTIME. |
| `queuemaxwait` | **Attesa eccessiva di un chiamante** | Il numero di chiamate in attesa è superiore a MAX_CALLS **e** il chiamante in attesa da più tempo ha superato CALLERS_MAX_WAIT. |
| `queuefewop` | **Operatori disponibili insufficienti** | Il numero di chiamate in attesa supera il numero di operatori disponibili moltiplicato per MAX_CALLS_PER_OP. |
| `queueholdtime` | **Tempo medio di attesa elevato** | Il tempo medio di attesa della coda supera MAX_HOLDTIME. |

:::info
Le condizioni vengono valutate periodicamente. Per gli allarmi che prevedono più condizioni, queste devono verificarsi contemporaneamente.

Il tempo medio di attesa è calcolato da Asterisk solo sulle chiamate risposte.

Ogni utente vede solo gli allarmi delle code abilitate nei permessi Gestore Code del proprio profilo.
:::

### Esempi di attivazione

- **Carico elevato (`queueload`)**: una coda contiene 12 chiamate in attesa e il tempo medio di attesa è di 150 secondi.
- **Attesa eccessiva (`queuemaxwait`)**: una coda contiene 11 chiamate in attesa e il chiamante in attesa da più tempo ha raggiunto 300 secondi.
- **Operatori insufficienti (`queuefewop`)**: sono disponibili 3 operatori e ci sono 7 chiamate in attesa. La soglia è 3 × 2 = 6 chiamate.
- **Tempo medio elevato (`queueholdtime`)**: il tempo medio di attesa raggiunge 140 secondi, indipendentemente dal numero di chiamate in coda.

## Configurazione delle soglie

Gli allarmi sono abilitati per impostazione predefinita e utilizzano le seguenti variabili d'ambiente:

| Variabile | Valore predefinito | Descrizione |
|---|---|---|
| `NETHCTI_ALERTS` | `true` | Abilita o disabilita il sistema di allarmi. |
| `NETHCTI_ALERTS_MAX_CALLS` | `10` | Numero massimo di chiamate in attesa utilizzato dagli allarmi di carico e attesa eccessiva. |
| `NETHCTI_ALERTS_CALLERS_MAX_WAIT` | `250` | Soglia massima di attesa del chiamante più vecchio, in secondi. |
| `NETHCTI_ALERTS_CHECK_INTERVAL` | `30` | Intervallo tra le verifiche delle condizioni di allarme, in secondi. |
| `NETHCTI_ALERTS_MAX_CALLS_PER_OP` | `2` | Numero massimo di chiamate in attesa per ogni operatore disponibile. |
| `NETHCTI_ALERTS_MAX_HOLDTIME` | `120` | Soglia del tempo medio di attesa, in secondi. |

### Modifica delle soglie

Le soglie possono essere personalizzate modificando le corrispondenti variabili d'ambiente nell'environment dell'applicazione.

Ad esempio, per impostare:

- Un massimo di 15 chiamate in attesa.
- Un tempo medio di attesa di 180 secondi.
- Un intervallo di verifica di 20 secondi.

```bash
runagent -m nethvoiceX vim environment
```

Configurare i seguenti valori:

```bash
NETHCTI_ALERTS_MAX_CALLS=15
NETHCTI_ALERTS_MAX_HOLDTIME=180
NETHCTI_ALERTS_CHECK_INTERVAL=20
```

Dopo aver modificato le variabili d'ambiente, è necessario **riavviare il servizio `nethcti-server`** affinché le nuove impostazioni vengano applicate.

```bash
runagent -m nethvoiceX systemctl --user restart nethcti-server
```

:::info
Il riavvio del servizio `nethcti-server` disconnette i client CTI per qualche secondo, poi si riconnettono automaticamente.
:::

### Disabilitazione degli allarmi

Per disabilitare completamente il sistema di allarmi, impostare:

```bash
NETHCTI_ALERTS=false
```

Per riabilitarlo:

```bash
NETHCTI_ALERTS=true
```

Anche in questo caso è necessario riavviare il servizio `nethcti-server`.

## Frequenza di verifica

Il sistema verifica periodicamente le condizioni di allarme secondo l'intervallo definito dalla variabile `NETHCTI_ALERTS_CHECK_INTERVAL`.

Il valore predefinito è **30 secondi**.

Questo significa che il superamento di una soglia non viene necessariamente rilevato nell'istante in cui si verifica, ma durante una delle successive verifiche.

Un intervallo più breve permette di rilevare più rapidamente le condizioni critiche, aumentando però la frequenza dei controlli.

