---
title: Sorgenti video
sidebar_position: 4
---

# Sorgenti video

Le sorgenti video sono i videocitofoni e le telecamere IP collegati a NethVoice. Con esse puoi:

- guardare telecamere e citofoni nella pagina **Sorgenti video** di NethVoice CTI;
- vedere chi c'è alla porta quando un citofono ti chiama, prima di rispondere e durante la chiamata;
- aprire porte e cancelli con i pulsanti **Apri**.

Vedi solo le sorgenti video che l'amministratore ha abilitato per il tuo profilo. Se non vedi una sorgente che ti serve, chiedi al tuo amministratore. Gli amministratori configurano le sorgenti come descritto in [Sorgenti video](../../administrator-manual/configuration/applications/video_sources.md).

## Pagina Sorgenti video {#video-sources-page}

Apri **Applicazioni** in NethVoice CTI e clicca su **Vai a Sorgenti video**. La pagina mostra una scheda per ogni sorgente che puoi vedere:

- i citofoni e le telecamere che inviano un flusso video mostrano il **video dal vivo**. Il video viene riprodotto mentre la scheda è visibile sullo schermo e si ferma quando la scorri fuori dalla vista o passi a un'altra scheda del browser;
- le altre sorgenti mostrano un'**immagine** della telecamera, aggiornata periodicamente.

Usa **Filtra sorgenti** per cercare una sorgente per nome e il pulsante di ordinamento per ordinare le sorgenti alfabeticamente.

Passa il mouse su una scheda per mostrarne i pulsanti:

- **Chiama** (icona della cornetta): chiama il citofono dal tuo telefono. Presente solo quando la sorgente ha un interno;
- **Cattura schermata** (icona della fotocamera): salva l'immagine corrente in un file JPEG;
- **Apri porta** (icona del lucchetto): apre una porta o un cancello. Vedi [Aprire una porta](#opening-a-door);
- **Espandi** / **Riduci**: mostra la sorgente in una finestra più grande, con gli stessi pulsanti. Premi `Esc` o clicca fuori dalla finestra per chiuderla.

Se la sorgente invia anche l'audio, sul video compare un pulsante con l'altoparlante: l'audio è disattivato all'inizio, clicca su **Attiva audio** per ascoltarlo.

## Chiamate da un citofono {#intercom-calls}

Quando un citofono collegato a una sorgente video ti chiama, la Phone Island mostra il suo video nell'anteprima della chiamata, così puoi vedere chi c'è alla porta **prima di rispondere**. Il video resta visibile dopo la risposta, insieme ai pulsanti della chiamata (microfono, riaggancia, cattura schermata) e ai pulsanti delle porte. Lo stesso accade quando sei tu a chiamare il citofono.

Il video compare solo per le sorgenti abilitate per il tuo profilo: le chiamate degli altri citofoni appaiono come chiamate normali.

L'anteprima funziona in NethVoice CTI e in [NethLink](../nethlink/usage.md#receiving-a-call), che mostra la stessa Phone Island.

## Aprire una porta {#opening-a-door}

Ogni sorgente può avere una o più porte o cancelli. Il pulsante con il lucchetto li apre:

- con una sola porta, il pulsante la apre direttamente. Il suo suggerimento indica quale, per esempio **Apri Ingresso principale**;
- con più porte, il pulsante mostra l'elenco delle porte (**Scegli cosa aprire**): clicca su quella da aprire.

Dopo averlo premuto compare **Comando inviato**: il comando è arrivato al citofono, ma NethVoice non può sapere se la porta si è davvero aperta. Controlla dal video.

Alcune porte si aprono inviando un codice nella chiamata con il citofono. Per queste porte:

- quando il citofono ti sta chiamando, rispondi prima alla chiamata: fino ad allora la Phone Island mostra queste porte come disabilitate, con il suggerimento **Rispondi alla chiamata per aprire**;
- quando non c'è alcuna chiamata con il citofono, premendo il pulsante il centralino chiama il citofono e invia il codice quando il citofono risponde. Se il citofono non risponde, la porta non viene aperta e compare un errore (possono servire fino a circa 30 secondi).

Le altre porte vengono aperte direttamente dal centralino e funzionano in qualsiasi momento, anche senza chiamata.

## Messaggi {#messages}

| Messaggio | Significato |
|-----------|-------------|
| *Flusso video non disponibile* | Il video non può essere mostrato. Una seconda riga, se presente, ne indica il motivo. |
| *La sorgente video non è raggiungibile, nuovo tentativo in corso...* | Il citofono o la telecamera non risponde: NethVoice continua a riprovare. Se il problema persiste, contatta il tuo amministratore. |
| *Il browser non può riprodurre il formato video di questa sorgente* | La telecamera invia un formato video che il tuo browser non supporta (per esempio H.265). Prova un altro browser o chiedi al tuo amministratore. |
| *Non hai i permessi per vedere questa sorgente* | La sorgente non è più abilitata per il tuo profilo. |
| *Troppi video aperti: chiudine uno per vedere questo* | Stai guardando troppi video contemporaneamente, per esempio in altre schede del browser o su altri computer: puoi guardare la stessa sorgente al massimo 3 volte e 30 video in totale. Chiudine qualcuno. |
| *Rispondi alla chiamata per aprire* | La porta si apre con un codice inviato nella chiamata: rispondi prima al citofono. |
| *Il certificato del dispositivo è cambiato: contatta l'amministratore* | Per motivi di sicurezza NethVoice non si fida più del citofono: l'amministratore deve verificarlo. |

## App mobile NethVoice {#mobile-app}

L'app mobile NethVoice non ha una pagina Sorgenti video e non mostra l'anteprima video prima della risposta. Quando un citofono ti chiama:

- se il citofono invia il video nella chiamata, lo vedi come in una normale videochiamata;
- per aprire la porta, digita il codice di apertura sul tastierino durante la chiamata. Chiedi il codice al tuo amministratore. Le porte aperte dal centralino senza codice non possono essere aperte dall'app.

Vedi anche [App mobile NethVoice](../mobile_app.md#door-intercoms).
