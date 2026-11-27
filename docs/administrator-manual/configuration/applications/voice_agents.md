---
title: Voice agents
sidebar_position: 7
---

# Voice agents

Voice agents answer calls conversationally and transfer callers to permitted PBX destinations. Start with the built-in **Receptionist** or create a **Basic Voice** agent.

:::info Availability
The opt-in preview supports OpenAI GPT-Live over WebSocket. SIP transports, including OpenAI Realtime, Grok and external CleverAI, require the separate lab switch and fresh media acceptance tests. The preview requires a fresh Agents installation. See [Recover an alpha installation](#recover-alpha) for earlier development databases.
:::

## Before you start {#before-you-start}

1. Sign in to the NS8 NethVoice application as an administrator. Under **Integrations**, enable **Voice agents preview**. The switch defaults to off.
2. Enter an OpenAI project key here if agents will share the module credential. Agents can use this key with both transcription features disabled. Provider usage may incur charges.
3. Save and check the Satellite apply status. If calls or transcription are in progress, Satellite waits for them to finish before applying new settings. A pending change still uses the previous configuration. For a failed apply, inspect the module task or service log and retry after correcting the cause.
4. Open **Voice agents** in the NethVoice Wizard's applications menu. The editor uses your existing administrator sign-in. Set up a test route and a native fallback destination before routing normal calls.

Disabling the preview preserves its drafts, publications and credentials for the next time you enable it. A clone starts with the preview disabled. Before enabling a clone, verify its hostname, credentials and routing independently of the source.

## Configure a provider trunk {#configure-provider-trunk}

1. Open **Provider trunks**, create an OpenAI trunk, and enter the **OpenAI project ID** if the trunk will also support SIP calls.
2. Choose **NethVoice integrations key** to inherit the module credential, or **Dedicated key** and enter a project key for this trunk. On edit, leaving a dedicated key blank preserves it. Select inheritance explicitly to clear the dedicated override.
3. Save the trunk. NethVoice checks the credential when the key or project changes. Correct a rejected key in its selected location. If access is restricted or the provider cannot be reached, retry the check or choose **Save without verification**.
4. Select the conversation model and voice on the agent's page. Choose GPT-Live for the preview. It uses an outbound WebSocket and needs no provider signing secret or public webhook.

Before removing a shared key in **Integrations**, review the list of published agents that inherit it. Once the removal takes effect their new calls take native fallback until a valid key is available.

### Automatic OpenAI SIP webhook setup in the lab {#automatic-openai-webhook}

After saving an OpenAI trunk for local Realtime SIP calls, select **Configure webhook** in its row. NethVoice checks the project's existing endpoints, creates a recognizable `NethVoice <trunk ID> <hostname>` endpoint if needed, and encrypts the returned signing secret in the existing server-side credential store. The endpoint ID and its association are retained privately; the browser receives only setup status. The URL comes from NethVoice's configured public hostname and ends in `/satellite-webhooks/openai`; the subscribed event is `realtime.call.incoming`.

Setup targets **the API key's project**. Check that the entered project ID belongs to that same project. NethVoice does not verify this association, and does not require an Admin API key. The project key needs permission to list and create webhook endpoints. Check public HTTPS reachability before placing calls.

The **Webhook** column reports automatic setup, a manually stored secret, changed configuration or required recovery. Repeated setup reuses a matching endpoint when an associated signing secret is stored locally, including shared-project trunks using the same key and project ID. An unrelated or conflicting endpoint is never changed. Changing the API key, project ID or public hostname requires reviewing the setup again. Endpoint discovery does not verify webhook delivery or call readiness.

If an endpoint exists but its signing secret is unavailable, recover the secret you retained or explicitly rotate it in the OpenAI dashboard, then edit the trunk and save that secret manually. After the action has identified the endpoint, **Configure webhook** can associate the manually supplied secret with it. NethVoice never rotates or deletes provider secrets automatically. The provider returns the full secret only at creation or rotation.

If OpenAI times out, returns an incomplete creation response, or local persistence fails, retry **Configure webhook** to inspect the existing endpoints. An unresolved creation remains blocked even if it is not yet visible in the list, to avoid duplicates; inspect the API key's project and complete manual recovery. Check database availability and the encryption key for local save errors. Credentials and provider response bodies are not included in errors.

This action is unavailable for Grok, CleverAI and trunks used only by GPT-Live. A shared OpenAI trunk can still configure the webhook for its Realtime SIP agents. GPT-Live uses WebSockets and does not need this webhook. Setup does not publish agents or change routes.

### Manual webhook setup in the lab {#manual-webhook}

For OpenAI Realtime SIP, create or select an endpoint in the correct OpenAI project using the **Provider webhook endpoint** displayed in the trunk editor and subscribe to `realtime.call.incoming`. Retain the signing secret when OpenAI returns it, enter it in **Webhook signing secret**, and save the trunk. The manual signing secret remains unverified until a signed, correlated test call connects media. Test a non-production route and check the trunk status again. SIP agents require a signing secret before publishing.

For Grok, continue registering the displayed Grok endpoint and signing secret manually; both the API credential and signing secret are required when saving. For CleverAI, configure the OpenAI incoming-call webhook externally to point to CleverAI, and enter only the name and project ID in NethVoice.

## Configure and publish an agent {#configure-publish-agent}

1. Open **Agents**. Follow the setup notice to complete the next missing step. Open **Receptionist** to configure the built-in agent or select **Create agent** for a new agent.
2. For a new basic voice agent, complete **General**, **Conversation** and **Tools**. Choose a provider trunk, voice model, voice and language. Add conversation instructions. The greeting is optional.
3. To finish later, select **Cancel**, then **Save draft**. Give the draft a name before saving.
4. Select **Publish**. After publication and synchronization, **Agents** opens. If validation fails, correct the fields in the saved draft. If another administrator saved settings while you were editing, choose **Save my changes** or **Discard my changes**.
5. Open **Inbound routes** to route calls to the agent. The setup notice clears once a routable agent is used in a saved inbound route.

Saving a draft does not change the published configuration. New calls use the published version; calls already in progress keep the version selected when they started. Publish later changes explicitly. Receptionist cannot be deleted.

A fresh installation creates a disabled, unpublished Receptionist. Save and publish a complete configuration before assigning its native destination. Drafts and publications remain separate; repeating installation does not overwrite edits or credentials.

### Compare voice models {#compare-voice-models}

The standard preview uses [OpenAI GPT-Live](https://developers.openai.com/api/docs/models/gpt-live-1). It bills for active session time and uses a separate companion model for reasoning and tools. Under **Advanced**, the companion defaults to GPT-6 Luna. Choose GPT-6 Sol for more complex tasks. Reasoning effort defaults to Medium, response detail to Low, service tier to Default and maximum output to 2,048 tokens.

The SIP lab adds [OpenAI Realtime models](https://developers.openai.com/api/docs/models/gpt-realtime-2.1), which bill by audio and text tokens. OpenAI positions [Realtime 2.1 Mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini) as a faster, lower-cost model. Grok selects its own SIP model and publishes [speech-to-speech rates](https://docs.x.ai/developers/pricing). Configure CleverAI models and billing in CleverAI.

Compare call quality and response speed using the same call script and PBX route. Check whether the agent recognizes names and numbers, handles interruptions and uses the correct tools. Compare provider usage for completed calls.

## Review routing permissions {#review-routing-permissions}

Each agent has independent tool settings. Turn on a tool to show its settings. For **Transfer calls**, select **Manage destinations** to choose the extensions and queues the agent can use. A disabled tool cannot be used, even if the instructions ask for it.

For newly configured agents, the routing defaults are:

| Category | Default | Administrator control |
| --- | --- | --- |
| Direct extensions | Disabled; no extension selected | In **Manage destinations**, select each permitted extension. |
| Queues | Disabled; no queue selected | In **Manage destinations**, select each queue the agent may find and transfer to. |
| IVRs | Disabled | IVR activation is not exposed by the current editor. |
| Recent contacts | Enabled; seven-day window | Set **Lookback period** from 1 to 90 days. To exclude extensions, choose **All extensions except the selected ones** and select them. |

Publish the grants for the agent. Newly created queues and extensions stay unavailable until explicitly granted and published. The agent asks the caller to confirm the destination before requesting a transfer. **Monitoring** records a successful transfer after the native PBX confirms the handoff. IVRs can be native fallback destinations.

### Return a recent call {#return-recent-call}

Recent-caller lookup uses the actual incoming caller number and PBX call history to find internal contacts that recently called that number. Answered and missed outbound calls can qualify. The target must be on the published extension allowlist and outside the recent-caller exclusions. The direct-extension toggle can remain off.

The default Receptionist instructions name a single matching contact and ask for confirmation. If several contacts match, the agent names them and asks which one the caller wants to reach. Unknown or anonymous caller numbers, deleted extensions and missing matches must not be treated as a verified contact. A contact found for one call cannot be reused as authorization in another call.

This is a routing convenience. Caller ID can be spoofed and does not authenticate a caller for access to confidential information.

### Optional call ending {#optional-call-ending}

**End the call** starts disabled. Enable it on the agent page, set **Maximum goodbye duration** from 1 to 10 seconds, then save and publish. It allows the agent to end its own call after an explicit caller request or a completed conversation. The runtime bounds goodbye playback and verifies ownership of the caller channel. Successful termination appears as **Ended by agent**. An unsuccessful or unconfirmed operation is reported as a failure; it never transfers the caller to fallback after accepting an ending request.

## Add the agent to VisualPlan {#add-to-visualplan}

Use the native **Agent** object in VisualPlan and select an enabled, published and synchronized agent. **New agent** opens agent creation in a new tab. Connect the object's **Fallback** output to an appropriate native destination; an unconnected fallback uses Hangup.

Configure fallback routing in VisualPlan. Publish the agent and check synchronization before sending calls to it. A synchronization error requires resolution or an explicit retry; a saved draft alone does not make an agent destination available.

An extension using a CTI profile reaches the agent through a supported VisualPlan route. A number created only in FreePBX **Misc Applications** is outside that extension's dialing context. Test using an extension with the same CTI profile as the intended callers.

### Capacity, duration and fallback {#capacity-and-fallback}

The preview defaults to two concurrent GPT-Live calls per instance. A private GPT-Live consultation with a colleague also uses a slot. An excess caller takes the configured PBX fallback and **Monitoring** records the capacity reason. When the maximum call duration approaches, the agent requests a brief notice in the configured language. Fallback starts at the deadline even if the notice cannot play.

If the Asterisk control connection drops, Satellite attempts native fallback for active calls. A recovered connection accepts new calls. Test the configured fallback by calling the route, and place a second test call after reconnection.

## Inspect calls and performance {#inspect-calls-performance}

Open **Monitoring** to filter call history by period, agent, provider, adapter or outcome. Search by caller number, called number, agent or run ID. The call list and details show local times, call durations, outcomes, and numbers when available. Daily totals use UTC.

Open **Diagnostics** for monitoring health and delivery. **Performance diagnostics** contains the latency and tool measurements. The call details have their own **Diagnostics** section with the run ID, provider adapter, trace, error codes and reported usage. Percentiles are approximate and some traces can be incomplete.

Metadata retention defaults to 90 days. Administrators can override it through the module environment variable `VOICE_AGENT_MONITORING_RETENTION_DAYS` (1–3650 days), followed by normal module configuration and a planned service restart. There is no retention control for metadata in the agent editor. Reducing the window removes older data during scheduled cleanup; increasing it does not recover deleted history. Native PBX call-history retention is separate.

### Optional call transcription {#optional-call-transcription}

Under **Debug**, **Call transcription** starts disabled. When enabled and published, supported OpenAI calls can retain encrypted caller and agent text for administrators. Select retention from 1 to 24 hours. Input transcription may add provider charges. This setting does not enable general audio recording and is separate from Satellite's existing transcription feature.

## Troubleshooting and verification {#troubleshooting-verification}

- If the agent is unavailable in VisualPlan, check publication and native synchronization.
- If a requested destination is unavailable, check the agent's tool toggle, category settings and current PBX inventory. Direct-extension permission and recent-caller eligibility are separate.
- If a call ends or takes fallback during connection, inspect the run's provider, phase and fixed error category, then check provider credentials and webhook reachability.
- If monitoring is incomplete or stale, inspect delivery health before interpreting latency or usage summaries.

A provider connection or media-bridge event does not prove that the caller heard speech. During an authorized test call, verify audio in both directions and the actual transfer destination. GPT-Live uses a primary provider WebSocket and a private Asterisk media WebSocket. SIP media testing requires the lab switch. There is no transport selector or automatic SIP fallback. Protocol and media measurements are separate from human listening; conversational quality, long calls and behavior under transcription load still require live acceptance.

## Recover an alpha installation {#recover-alpha}

1. Leave the preview disabled if setup reports an unsupported development database, including alpha-v8. Preserve the original instance. Do not drop Agents tables or run setup repeatedly against the alpha data.
2. Make a protected NS8 backup of the complete NethVoice application. Retain the module, FreePBX and Satellite image versions or digests used to write the data, and verify that the backup includes the MariaDB data, module secret file with the original `SATELLITE_AGENT_CONFIG_KEY`, and voice-agent event volume. The original key is needed to decrypt dedicated trunk credentials.
3. To recover the alpha, restore the backup to an isolated instance with the matching alpha images. Keep it isolated from production routing and provider webhooks while verifying the drafts, publications and credentials. Retain the original backup until recovery has been tested.
4. To try the preview, install matching preview images on a fresh Agents instance and configure it there. An ordinary NethVoice upgrade can leave the preview off and continue serving PBX calls, chat and transcription.
