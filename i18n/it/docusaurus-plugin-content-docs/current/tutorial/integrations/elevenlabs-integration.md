# ElevenLabs

[ElevenLabs](https://elevenlabs.io) è una piattaforma di intelligenza artificiale dedicata alla voce e all'audio. Consente di generare sintesi vocale altamente realistica, clonare voci, trascrivere audio, effettuare doppiaggio multilingua e creare agenti vocali conversazionali.

Può essere utilizzata, tra le altre cose, per:

* **Text-to-Speech (TTS):** convertire testo scritto in voce naturale
* **Assistenti vocali AI:** creare chatbot e agenti conversazionali in tempo reale

---

## Integrazione NethVoice – ElevenLabs

L'integrazione tra NethVoice ed ElevenLabs permette di utilizzare i servizi vocali AI direttamente durante le chiamate telefoniche.

### 1. Configurare il trunk ElevenLabs in NethVoice

* Nell'interfaccia di amministrazione di NethVoice, andare in **Linee → VoIP**
* Aggiungere un nuovo trunk dall'elenco dei provider supportati e selezionare **ElevenLabs**
* Utilizzare un **numero di telefono fittizio** e delle credenziali (username/password)
* Queste credenziali verranno utilizzate successivamente nella configurazione di ElevenLabs

---

### 2. Creare un interno SIP nelle impostazioni avanzate di NethVoice

* Accedere all'interfaccia avanzata di NethVoice
* Creare un **interno PJSIP** che verrà utilizzato per inoltrare le chiamate verso ElevenLabs

Nelle impostazioni avanzate dell'interno, sostituire il campo **Dial** con:

```text
PJSIP/NOME_TRUNK/sip:NUMERO_TEL@sip.rtc.elevenlabs.io
````

Dove:

* **NOME_TRUNK** = nome assegnato al trunk ElevenLabs in NethVoice
* **NUMERO_TEL** = numero di telefono fittizio utilizzato durante la configurazione del trunk

Esempio:

```text
PJSIP/ElevenLabs/sip:+39333333333@sip.rtc.elevenlabs.io
```

---

### 3. Configurare il SIP Phone Number in ElevenLabs

In ElevenLabs, creare un nuovo **SIP Trunk phone number** utilizzando la stessa numerazione fittizia configurata in NethVoice.

#### Impostazioni Inbound

* **Media Encryption:** `Disabled`
* **SIP Trunk Username and Password:** utilizzare le stesse credenziali configurate nel trunk NethVoice

#### Impostazioni Outbound

* **Address:** FQDN di NethVoice
* **Transport Type:** `TCP`
* **Media Encryption:** `Disabled`
* **Enabled Codecs:** devono corrispondere ai codec abilitati nel trunk NethVoice
* **SIP Trunk Username and Password:** utilizzare le stesse credenziali configurate in NethVoice


