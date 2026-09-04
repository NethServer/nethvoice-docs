---
title: Richiama su Occupato
sidebar_position: 4
---

## Panoramica {#overview}

La funzionalità **Richiamata su Occupato** (Recall on Busy) consente a un interno di prenotare automaticamente una nuova chiamata verso un altro interno del centralino che, al momento del tentativo di chiamata, risulta occupato.

Quando l'interno chiamato torna disponibile, NethVoice avvia automaticamente la procedura di richiamata.

## Requisiti e configurazione {#requisites}

Per utilizzare la funzionalità devono essere soddisfatti i seguenti requisiti:

* **Abilitazione globale**: la funzionalità deve essere abilitata nella sezione **Avanzate → Applications → Recall on Busy**.
* **Feature code**: deve essere configurato e abilitato il codice funzione associato alla Richiamata su Occupato.
* **Compatibilità dei terminali**: la funzionalità è gestita dal dialplan del centralino e dalla segnalazione SIP. Può essere utilizzata sia con telefoni IP fisici sia tramite le funzionalità telefoniche disponibili nel CTI Web/Desktop Phone di NethVoice.
* **Ambito di utilizzo**: la Richiamata su Occupato è disponibile esclusivamente per chiamate tra interni appartenenti allo stesso sistema NethVoice.

## Funzionamento {#function}

Il funzionamento della Richiamata su Occupato avviene nelle seguenti fasi:

1. **Chiamata verso un interno occupato**: un utente chiama un altro interno che risulta già impegnato in una conversazione.

2. **Prenotazione della richiamata**: dopo aver ricevuto il tono di occupato, il chiamante digita il feature code configurato per la Richiamata su Occupato prima di terminare la chiamata.

3. **Monitoraggio dell'interno chiamato**: NethVoice monitora lo stato dell'interno di destinazione tramite i meccanismi di presenza e device state del PBX.

4. **Disponibilità dell'interno**: quando l'interno precedentemente occupato termina la conversazione e torna disponibile, NethVoice avvia la procedura di richiamata.

5. **Richiamata del chiamante**: il centralino fa squillare l'interno che aveva richiesto la richiamata.

6. **Completamento della chiamata**: quando il chiamante risponde, NethVoice genera automaticamente una nuova chiamata verso l'interno precedentemente occupato.

La chiamata viene quindi gestita come una normale chiamata interna.

