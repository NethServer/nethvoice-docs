---
title: Trunk senza registrazione
sidebar_position: 6
---

Questa procedura è necessaria solo per un trunk VoIP non registrato (ad esempio, un trunk basato su IP senza credenziali di registrazione SIP).

L'obiettivo è instradare le chiamate con una radice specifica (prefisso) direttamente a un'istanza NethVoice (il PBX interno) **senza farle passare attraverso il motore SIP/RTP di NethVoice Proxy (Kamalio/RTP Engine).**

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

Questa regola istruisce NethVoice Proxy a gestire le chiamate per un prefisso specifico e instradare il traffico direttamente all'istanza NethVoice scelta.

1.  Fai clic sul pulsante **Aggiungi regola**.
2.  Apparirà la finestra di dialogo **Aggiungi regola**.
3.  Configura la regola:
    * **Radice:** Immetti un **prefisso univoco** che agirà come trigger per questa regola di instradamento.
        * **Importante:** Scegli una stringa numerica che **non sia parte** dello schema di numerazione interno o dei prefissi esterni standard (ad esempio, `456`, come mostrato nell'esempio). Questo prefisso verrà intercettato dal proxy e instradato.
    * **Applicazione di destinazione:** Seleziona l'istanza NethVoice che contiene il trunk VoIP che desideri instradare (ad esempio, `nethvoice1 [10.5.4.1]`).
4.  Fai clic su **Salva**.

### 4. Verifica e configurazione del PBX {#4-verification-and-pbx-configuration}

1.  Una volta salvata, la regola apparirà nell'elenco **Regole di instradamento trunk** e verrà visualizzata una notifica "Completato".
2.  Il passaggio finale e cruciale è configurare il PBX dell'istanza NethVoice per gestire le chiamate utilizzando questo prefisso di instradamento:

    * **Per le chiamate in uscita:** Configura una **Rotta in uscita** nel tuo PBX NethVoice. Il modello di composizione dovrebbe includere il prefisso **Radice** configurato (ad esempio, `456`). Questa rotta dovrebbe essere indirizzata al trunk non registrato specifico.
        * Il PBX dovrebbe quindi rimuovere il prefisso `456` prima di inviare il numero al trunk/provider.
    * **Per le chiamate in arrivo (dal trunk non registrato):** Il provider/gateway che invia la chiamata a NethVoice Proxy deve anteporre il prefisso **Radice** configurato (`456`) al numero di destinazione (DID). Il PBX, al ricevimento della chiamata sul trunk non registrato, può quindi utilizzare una **Rotta in arrivo** corrispondente a quel prefisso per indirizzare la chiamata internamente.

### Come funziona l'instradamento {#how-the-route-works}

Quando una chiamata (in uscita dal PBX o in arrivo da un gateway/provider) viene elaborata da NethVoice Proxy, il proxy verifica la parte iniziale della stringa di composizione (la **Radice**).

Se la chiamata corrisponde al prefisso configurato (ad esempio, `456`), il proxy instrada la chiamata **direttamente** al sistema PBX NethVoice specificato (`nethvoice1`), bypassando la sua gestione interna di SIP e RTP (Kamalio/RTP Engine). Ciò garantisce che il traffico VoIP dal trunk/gateway non registrato specifico, che potrebbe avere problemi di compatibilità con il proxy, sia gestito direttamente dal PBX.

### 2. Accessing Trunk Routing Rules {#2-accessing-trunk-routing-rules}

1.  Access the NethServer 8 administration interface.
2.  In the left navigation panel, select your **NethVoice Proxy** instance (in the example: `nethvoice-proxy1`).
3.  Navigate to the **Trunk routing rules** section.
    * *Note: If you see "No NethVoice application available", you must first install and configure at least one NethVoice instance.*

### 3. Creating the Routing Rule {#3-creating-the-routing-rule}

This rule instructs the NethVoice Proxy to handle calls for a specific prefix and route the traffic directly to the chosen NethVoice instance.

1.  Click the **Add rule** button.
2.  The **Add rule** dialog will appear.
3.  Configure the rule:
    * **Root:** Enter a **unique prefix** that will act as the trigger for this routing rule.
        * **Important:** Choose a numerical string that is **not** part of your internal numbering scheme or standard external prefixes (e.g., `456`, as shown in the example). This prefix will be intercepted by the proxy and routed.
    * **Destination application:** Select the NethVoice instance that contains the VoIP trunk you want to route (e.g., `nethvoice1 [10.5.4.1]`).
4.  Click **Save**.

### 4. Verification and PBX Configuration {#4-verification-and-pbx-configuration}

1.  Once saved, the rule will appear in the **Trunk routing rules** list, and a "Completed" notification will show.
2.  The final and crucial step is to configure your NethVoice instance's PBX (FreePBX/Asterisk) to handle calls using this route prefix:

    * **For Outgoing Calls:** Configure an **Outbound Route** in your NethVoice PBX. The Dial Pattern should include the configured **Root** prefix (e.g., `456`). This route should be directed to the specific unregistered trunk.
        * The PBX should then strip the `456` prefix before sending the number out to the trunk/provider.
    * **For Incoming Calls (from the unregistered trunk):** The provider/gateway sending the call to the NethVoice Proxy must prepend the configured **Root** prefix (`456`) to the destination number (DID). The PBX, upon receiving the call on the unregistered trunk, can then use an **Inbound Route** matching that prefix to direct the call internally.

### How the Route Works {#how-the-route-works}

When a call (outgoing from the PBX or incoming from a gateway/provider) is processed by the NethVoice Proxy, the proxy checks the initial part of the dialing string (the **Root**).

If the call matches the configured prefix (e.g., `456`), the proxy routes the call **directly** to the specified NethVoice PBX system (`nethvoice1`), bypassing its internal SIP and RTP handling (Kamalio/RTP Engine). This ensures that the VoIP traffic from the specific unregistered trunk/gateway, which may have compatibility issues with the proxy, is handled directly by the PBX.
