---
title: Controlli rapidi
sidebar_position: 2
---

## Panoramica {#overview}

Per fornire assistenza efficace e tempestiva per **NethVoice su NS8**, abbiamo bisogno di un set minimo di informazioni diagnostiche. Senza questi dettagli non è possibile effettuare un'analisi accurata.

Descrivi nel modo più dettagliato possibile le **condizioni di rete** di eventuali dispositivi esterni a NethVoice — come telefoni, gateway media, stazioni DECT, router o reti separate non configurate direttamente sulle interfacce di NethServer.

## Passaggio 1 – Controlla l'utilizzo delle risorse di sistema {#step-1--check-system-resource-usage}

Prima di aprire una segnalazione, verifica le prestazioni del sistema per escludere problemi legati alle risorse. I comandi qui sotto mostrano rapidamente utilizzo di CPU, memoria e disco — invece di inviare file allegati, copia e incolla l'output del terminale nel corpo della tua segnalazione racchiudendolo tra triple backtick, così il supporto può leggerlo velocemente.

Esegui questi comandi come root e copia/incolla l'output. Esempio di comandi e come incollarli in modo sicuro in una segnalazione:

```bash
# snapshot dei processi e del carico (non interattivo)
top -b -n 1

# utilizzo disco (formato leggibile)
df -h

# utilizzo memoria, compreso lo swap (formato leggibile)
free -h
```

Come incollare nella segnalazione (consigliato):

1. Esegui il comando sul server.
2. Seleziona l'output intero nel terminale e copialo.

Cosa controllare:

- Carico / CPU: verifica i valori "load average" in `top` (prima riga). Un carico molto più alto del numero di core CPU può indicare pressione sulla CPU. All'interno di `top`, cerca processi con alto valore %CPU.
- Memoria: `free -h` mostra memoria utilizzata e disponibile e lo swap. Un uso persistente elevato dello swap suggerisce esaurimento di memoria.
- Disco: `df -h` mostra l'uso dei filesystem. Presta attenzione alla partizione che contiene `/var` e `/var/log` — se sono piene, i servizi possono fallire o i log essere troncati.

Comandi rapidi per ispezioni puntuali (esegui e copia/incolla i risultati):

```bash
# elenco dei processi che consumano più CPU
ps aux --sort=-%cpu | head -n 10

# le directory più grandi in /var (utile se i log riempiono il disco)
du -sh /var/* | sort -h | tail -n 20
```

Se preferisci ancora allegare file, comprimili prima; tuttavia incollare gli output dei comandi nel corpo della segnalazione è preferibile e solitamente più rapido per il supporto.

Suggerimenti di intervento immediato (se trovi problemi):

- CPU alta dovuta a un processo specifico: indaga quel processo (controlla i log, valuta un riavvio se appropriato).
- Memoria disponibile bassa / swap elevato: considera il riavvio dei servizi che consumano molta memoria o l'incremento della RAM; verifica eventuali memory leak.
- Filesystem pieno: ruota o elimina vecchi log, pulisci i temporanei o aumenta la capacità del disco.

Raccogliere questi snapshot prima e dopo la riproduzione del problema aiuta il supporto a distinguere tra problemi transitori e persistenti.

## Passaggio 2 – Verifica della configurazione di rete {#step-2--verify-network-configuration}

Per assicurarti che la configurazione di rete sia corretta, controlla le interfacce di rete e le tabelle di routing:

```bash
ip a
ip r
```

Questi output ti aiutano a confermare che:

* Tutte le interfacce richieste sono **up**.
* Le tabelle di routing sono **correttamente configurate**.

Una configurazione di rete valida e coerente è fondamentale per la comunicazione VoIP e SIP.


## Passaggio 3 – Raccolta dei log di Asterisk {#step-3--collect-asterisk-logs}

I log sono fondamentali per capire cosa accade al momento del problema.

Segui questi passaggi per raccogliere i **log di Asterisk**:

1. Connettiti al **cluster NS8** via SSH.

2. Individua il nome del modulo NethVoice con:

   ```bash
   loginctl list-users | grep nethvoice
   ```

   Per esempio, il modulo potrebbe chiamarsi `nethvoice1`.

3. Accedi all'ambiente del modulo:

   ```bash
   runagent -m nethvoiceX
   ```

   Sostituisci `nethvoiceX` con il nome corretto dell'istanza.

4. Avvia la CLI di Asterisk in modalità verbosa:

   ```bash
   asterisk -rvvvvvv
   ```

5. Riproduci il problema.

6. Copia le parti rilevanti dell'output dei log e incollale nella segnalazione.

> **Suggerimento:** cerca di catturare i log immediatamente prima, durante e dopo il malfunzionamento per fornire il contesto completo.


## Passaggio 4 – Catturare il traffico SIP (con SNGREP) {#step-4--capture-sip-traffic-using-sngrep}

Per completare l'analisi dei log, puoi anche catturare il traffico SIP con **SNGREP**.

### Eseguire una cattura {#run-a-capture}

Dal cluster, come root:

```bash
sngrep -r
```

Se il comando non è riconosciuto, significa che SNGREP non è installato. Vedi come [installare SNGREP](./sngrep.md#installation).

Una volta terminata la cattura:

1. Salva il file di cattura.
2. Trasferiscilo dal cluster al tuo computer locale usando un client **SCP** (ad esempio *WinSCP* su Windows).
3. Allegalo alla segnalazione di supporto.

Per una guida completa all'uso di SNGREP per l'analisi del traffico, consulta [la guida SNGREP](./sngrep.md).


## Riepilogo {#summary}

Prima di richiedere supporto per NethVoice, assicurati di:

1. Verificare le risorse di sistema (`top`, `df -h`, `free -h`)
2. Controllare le interfacce di rete e il routing (`ip a`, `ip r`)
3. Raccogliere i **log di Asterisk** durante il problema
4. Catturare il **traffico SIP** con SNGREP

Fornire queste informazioni permette diagnosi più rapide e accurate e aiuta il team di supporto a identificare efficacemente la causa primaria.
