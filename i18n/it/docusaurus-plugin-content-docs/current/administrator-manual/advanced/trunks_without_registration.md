---
title: Trunk senza registrazione
sidebar_position: 6
---

Questa procedura è necessaria solo per un trunk VoIP non registrato (ad esempio, un trunk basato su IP senza credenziali di registrazione SIP).

Lo scopo di questa procedura è instradare le chiamate che iniziano con un prefisso radice designato verso una specifica istanza PBX NethVoice. Quando una chiamata—sia in uscita dal PBX che in arrivo da un gateway o provider—raggiunge il NethVoice Proxy, il proxy esamina l'inizio del numero composto (la **radice**). Se la stringa di composizione corrisponde alla radice configurata (ad esempio, `07214055`), il proxy inoltra automaticamente la chiamata all'istanza PBX NethVoice selezionata (ad esempio, `nethvoice1`). In questo modo, le chiamate con il prefisso specificato vengono sempre instradate correttamente verso il PBX interno desiderato.

### 1. Prerequisiti {#1-prerequisites}

* Il modulo **NethVoice Proxy** deve essere installato e configurato.
* Almeno un'istanza **NethVoice** (ad esempio, `nethvoice1`) deve essere installata e configurata.
* Il trunk VoIP deve essere configurato all'interno dell'istanza NethVoice di destinazione (ad esempio, `nethvoice1`) come **Trunk Peer/Host** o simile, e deve essere di tipo "non registrato".

### 2. Accesso alle regole di instradamento trunk {#2-accessing-trunk-routing-rules}

1.  Accedi all'interfaccia di amministrazione di NethServer 8.
2.  Nel pannello di navigazione sinistro, seleziona la tua istanza **NethVoice Proxy** (nell'esempio: `nethvoice-proxy1`).
3.  Vai alla sezione **Regole di instradamento trunk**.
    * *Nota: Se vedi "Nessuna applicazione NethVoice disponibile", devi prima installare e configurare almeno un'istanza NethVoice.*

### 3. Creazione della regola di instradamento {#3-creating-the-routing-rule}

Questa regola istruisce NethVoice Proxy a gestire le chiamate per una radice specifica e instradare il traffico verso l'istanza NethVoice scelta.

1.  Fai clic sul pulsante **Aggiungi regola**.
2.  Apparirà la finestra di dialogo **Aggiungi regola**.
3.  Configura la regola:
    * **Radice:** Immetti un **prefisso univoco** che agirà come trigger per questa regola di instradamento.
        * **Importante:** Scegli una stringa numerica che **non sia parte** dello schema di numerazione interno o dei prefissi esterni standard (ad esempio, `0721`, come mostrato nell'esempio). Questa radice verrà intercettato dal proxy e instradato.
    * **Applicazione di destinazione:** Seleziona l'istanza NethVoice che contiene il trunk VoIP che desideri instradare (ad esempio, `nethvoice1 [10.5.4.1]`).
4.  Fai clic su **Salva**.

### 4. Verifica e configurazione del PBX {#4-verification-and-pbx-configuration}

1.  Una volta salvata, la regola apparirà nell'elenco **Regole di instradamento trunk** e verrà visualizzata una notifica "Completato".
2.  Il passaggio finale e cruciale è configurare il PBX dell'istanza NethVoice per gestire le chiamate utilizzando questo prefisso di instradamento:

    * **Per le chiamate in uscita:** Configura una **Rotta in uscita** nel tuo PBX NethVoice. Il modello di composizione dovrebbe includere il prefisso **Radice** configurato (ad esempio, `456`). Questa rotta dovrebbe essere indirizzata al trunk non registrato specifico.
        * Il PBX dovrebbe quindi rimuovere il prefisso `456` prima di inviare il numero al trunk/provider.
    * **Per le chiamate in arrivo (dal trunk non registrato):** Il provider/gateway che invia la chiamata a NethVoice Proxy deve anteporre il prefisso **Radice** configurato (`456`) al numero di destinazione (DID). Il PBX, al ricevimento della chiamata sul trunk non registrato, può quindi utilizzare una **Rotta in arrivo** corrispondente a quel prefisso per indirizzare la chiamata internamente.

