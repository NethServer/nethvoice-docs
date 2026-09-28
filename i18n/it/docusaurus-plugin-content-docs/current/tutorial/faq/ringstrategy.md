---
title: Quali strategie di squillo sono disponibili per una coda?
sidebar_position: 8
---

# Quali strategie di squillo sono disponibili e come posso ritardare lo squillo per un agente?

Le code NethVoice supportano diverse strategie di squillo di Asterisk:

* `leastrecent` - chiama l'agente che è stato contattato meno recentemente dalla coda
* `fewestcalls` - chiama l'agente con il minor numero di chiamate completate dalla coda
* `random` - chiama un agente casuale
* `rrmemory` - round robin con memoria, riprende dal punto in cui si era interrotto il precedente ciclo di squillo
* `rrordered` - come `rrmemory`, ma mantiene l'ordine dei membri configurato
* `linear` - chiama gli agenti nell'ordine configurato
* `wrandom` - seleziona casualmente gli agenti utilizzando la penalty del membro come fattore di peso

Alcune strategie, come `linear` e quelle round-robin, possono richiedere un **riavvio di Asterisk** dopo una modifica alla configurazione della coda.

:::warning Nota sulla strategia `ringall`

La strategia **`ringall` è sconsigliata**, soprattutto su code con molti agenti.

Con `ringall`, per ogni chiamata in coda Asterisk genera una chiamata verso **tutti gli agenti disponibili contemporaneamente**. Ogni tentativo di chiamata verso un agente deve essere considerato come una **singola chiamata contemporanea**, anche ai fini del **dimensionamento hardware** e del carico del sistema.

Ad esempio, una singola chiamata gestita da una coda `ringall` con 20 agenti disponibili può generare fino a **20 chiamate contemporanee verso gli agenti**.

Questa strategia è inoltre meno efficiente dal punto di vista del servizio: una singola chiamata può impegnare contemporaneamente tutti gli agenti disponibili della coda, invece di distribuire le chiamate tra gli agenti secondo criteri come disponibilità, numero di chiamate gestite o rotazione.

Quando possibile, è quindi preferibile utilizzare strategie come `random`, `leastrecent`, `fewestcalls`, `rrmemory` o `rrordered`, scegliendo quella più adatta al tipo di servizio, abilitando nelle impostazioni avanzatre della coda `Autofill` per distribuire più chiamate contemporaneamente.
:::

## Come posso configurare uno squillo ritardato per un agente?

Utilizzare valori di **Penalty** differenti per i membri della coda.

Ad esempio:

```text
200 - penalty 0
201 - penalty 0
202 - penalty 1
206 - penalty 2
```
Gli agenti con penalty più bassa vengono chiamati per primi, mentre quelli con penalty più alta possono essere coinvolti successivamente.

## Cosa sono i Lazy Members?
Per consentire ad Asterisk di passare agli agenti con una **penalty più alta** anche quando gli agenti con penalty più bassa sono online e raggiungibili, è necessario **abilitare Lazy Members**.

Senza Lazy Members, se un agente con penalty più bassa è disponibile e contattabile, Asterisk continua a considerarlo idoneo e non passa automaticamente al livello di penalty successivo.

Con **Lazy Members abilitato**, la coda può includere progressivamente gli agenti con penalty più alta, consentendo di ottenere uno squillo ritardato in base ai livelli di penalty configurati.

L'opzione può essere abilitata dalla configurazione della coda:

**Opzioni avanzate → Altre opzioni → Lazy Members**

Questa opzione è quindi necessaria quando si utilizzano le penalty per implementare uno squillo progressivo o ritardato tra gruppi di agenti.
