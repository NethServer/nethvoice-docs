# OpenAI

[OpenAI](https://openai.com/api)  is an artificial intelligence platform that provides APIs for speech-to-text, text-to-speech, and natural language understanding.

**NethVoice** uses **OpenAI** services to generate conversation summaries and sentiment analysis.

After creating an **OpenAI** account and obtaining an API key to access these services, the key must be configured in the Integrations section of the **NethVoice** module within the NethServer 8 interface.

See [NethVoice Module Configuration](../../administrator-manual/install/nethvoice_install#module-configuration).

Versions containing the voice-agent feature can also use OpenAI for conversational call handling. Configure a provider trunk, webhook and per-agent permissions as described in [Voice agents](../../administrator-manual/configuration/applications/voice_agents.md). The module integration key can supply a default credential, but enabling this integration alone does not publish an agent or create a call route.
