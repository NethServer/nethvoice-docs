# ElevenLabs

[Elevenlabs](https://elevenlabs.io) is an AI platform for voice and audio. It enables highly realistic text-to-speech generation, voice cloning, audio transcription, multilingual dubbing, and the creation of conversational voice agents.

You can use it for, among other things:

* **Text-to-Speech (TTS):** converting written text into natural-sounding speech
* **AI voice assistants:** building chatbots and real-time conversational agents

---

## NethVoice – ElevenLabs Integration

The integration between NethVoice and ElevenLabs allows the use of AI voice services directly within phone calls, with the following configuration steps:

### 1. Configure the ElevenLabs trunk in NethVoice

* In the NethVoice administration interface, go to **Lines → VoIP**.
* Add a new trunk from the supported providers list and select **ElevenLabs**.
* Use a **dummy phone number** and credentials (username/password).
* These credentials will later be used in the ElevenLabs configuration.

---

### 2. Create a SIP extension in advanced NethVoice settings

* Access the advanced NethVoice interface.
* Create a **PJSIP extension** that will be used to forward calls to ElevenLabs.

In the extension advanced settings, replace the **Dial** field with:

```
PJSIP/NOME_TRUNK/sip:NUMERO_TEL@sip.rtc.elevenlabs.io
```

Where:

* **NOME_TRUNK** = the name assigned to the ElevenLabs trunk in NethVoice
* **NUMERO_TEL** = the dummy phone number used during trunk configuration

Example:

```
PJSIP/ElevenLabs/sip:+39333333333@sip.rtc.elevenlabs.io
```

---

### 3. Configure ElevenLabs SIP Phone Number

In ElevenLabs, create a new **SIP Trunk phone number** using the same dummy numbering defined in NethVoice.

#### Inbound settings:

* Media Encryption: **Disabled**
* SIP Trunk Username and Password: same credentials configured in the NethVoice trunk

#### Outbound settings:

* Address: **FQDN of NethVoice**
* Transport Type: **TCP**
* Media Encryption: **Disabled**
* Enabled Codecs: must match those enabled in the NethVoice trunk
* SIP Trunk Username and Password: same credentials configured in NethVoice

