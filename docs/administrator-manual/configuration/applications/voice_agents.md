---
title: Voice agents
sidebar_position: 7
---

# Voice agents

Voice agents answer calls conversationally and can transfer callers to permitted PBX destinations. **Receptionist** is the built-in agent; administrators can also create custom **Basic Voice** agents. Queue and IVR routing are capabilities of an agent, rather than separate conversational agents.

:::info Availability
This page describes the voice-agent feature under development. It requires matching NethVoice and Satellite versions containing the feature; it is not available in installations that do not show **Agent** in Wizard. This alpha supports fresh installations of the current configuration format (v8) only. Earlier development databases are rejected; there is no automatic upgrade or reset. Back up an earlier test installation and use a fresh instance or an explicitly reviewed reset before installing the matching image pair.
:::

## Before you start {#before-you-start}

Use a NethVoice administrator account and a supported OpenAI or Grok account. Provider usage may incur charges. For SIP transports, the provider must be able to reach the HTTPS webhook address displayed by the interface. Configure a test route and a safe fallback before exposing an agent to normal calls.

Agents share the Satellite service with transcription, but do not require call or voicemail transcription to be enabled. Plan service restarts in a maintenance window because they can affect both features.

## Configure a provider trunk {#configure-provider-trunk}

1. Open **Agent** from Wizard's applications menu. The Agents interface opens in a separate tab using the existing administrator sign-in.
2. Open **Provider trunks** and create an OpenAI or Grok trunk.
3. Enter the required provider credentials and webhook verification settings. Configure the corresponding provider webhook using the address displayed by the interface. Saving a trunk does not configure the provider account.
4. Save the trunk. Credentials are write-only: leaving an existing credential blank during an edit preserves it.

A provider API key configured in the NethVoice module's integrations can supply the default credential when no explicit trunk key is stored. Explicit trunk credentials take precedence. Choose the conversation model and voice on each agent's page; available choices depend on the provider and transport. Grok SIP uses a provider-managed model.

## Configure and publish an agent {#configure-publish-agent}

1. Open **Agents** and select **Receptionist**, or create a custom agent.
2. Select the provider trunk, model, language and voice. Configure the greeting, instructions and maximum call duration.
3. Review the agent's tools and their destination permissions as described below.
4. Select **Save draft**, then **Publish**. Publishing activates the agent; there is no separate enable switch.

Saving a draft does not change the published configuration. New calls use the published version; calls already in progress keep the version selected when they started. Publish later changes explicitly. Receptionist cannot be deleted.

A fresh installation creates a disabled, unpublished Receptionist. Save and publish a complete configuration before assigning its native destination. Drafts and publications remain separate; repeating installation does not overwrite edits or credentials.

## Review routing permissions {#review-routing-permissions}

Each agent has independent tool settings. Expand a tool's configuration to review which destinations it can find and use. A disabled tool cannot be used, even if the instructions ask for it.

For newly configured agents, the routing defaults are:

| Category | Default | Administrator control |
| --- | --- | --- |
| Direct extensions | Disabled; no extension selected | Enable the category and explicitly select permitted extensions. |
| Queues | Enabled; all queues eligible | Exclude queues that the agent must not use. |
| IVRs | Disabled | IVR activation is not exposed by the current editor. |
| Recent internal callers | Enabled; seven-day window | Change the window from 1 to 90 days and exclude ineligible extensions. |

These category defaults still require the corresponding tool to be enabled. New queues become eligible unless excluded; new direct extensions remain unavailable until approved. Review permissions when the PBX inventory changes.

An allowed IVR follows its native options, including destinations configured inside that IVR. Allowing the IVR is therefore a decision to allow its configured call flow, not just its first announcement.

### Return a recent call {#return-recent-call}

Recent-caller lookup uses the actual incoming caller number and PBX call history to find internal contacts that recently called that number. Answered and missed outbound calls can qualify. Its extension exclusions are independent of the direct-extension permissions.

The default Receptionist instructions name a single matching contact and ask for confirmation. If several contacts match, the agent names them and asks which one the caller wants to reach. Unknown or anonymous caller numbers, deleted extensions and missing matches must not be treated as a verified contact. A contact found for one call cannot be reused as authorization in another call.

This is a routing convenience. Caller ID can be spoofed and does not authenticate a caller for access to confidential information.

### Optional call ending {#optional-call-ending}

**End the call** starts disabled. Enable it on the agent page, set **Maximum goodbye playback (seconds)** from 1 to 10 seconds, then save and publish. It allows the agent to end its own call after an explicit caller request or a completed conversation. The runtime bounds goodbye playback and verifies ownership of the caller channel. Successful termination appears as **Ended by agent**. An unsuccessful or unconfirmed operation is reported as a failure; it never transfers the caller to fallback after accepting an ending request.

## Add the agent to VisualPlan {#add-to-visualplan}

Use the native **Agent** object in VisualPlan and select an enabled, published and synchronized agent. **New agent** opens the Agents editor in a new tab. Connect the object's **Fallback** output to an appropriate native destination; an unconnected fallback uses Hangup.

Configure fallback routing in VisualPlan. Publish the agent and check synchronization before sending calls to it. A synchronization error requires resolution or an explicit retry; a saved draft alone does not make an agent destination available.

## Inspect calls and performance {#inspect-calls-performance}

Open **Activity** to filter call history by date, agent, provider or outcome and inspect a run. Run details show lifecycle events, a parent-linked trace, available provider usage and transfer or fallback outcomes. Summaries include call counts, latency and tool measurements. Percentiles are approximate, and overlapping phase durations must not be added to estimate the call length.

Check monitoring health and completeness alongside the call outcome. Missing measurements remain unavailable, rather than being reported as zero. A confirmed transfer can coexist with an incomplete trace. Interrupted collection or delivery recovery can leave measurements incomplete.

Metadata retention defaults to 90 days. Administrators can override it through the module environment variable `VOICE_AGENT_MONITORING_RETENTION_DAYS` (1–3650 days), followed by normal module configuration and a planned service restart. There is no retention control for metadata in the agent editor. Reducing the window removes older data during scheduled cleanup; increasing it does not recover deleted history. Native PBX call-history retention is separate.

### Optional call transcription {#optional-call-transcription}

Under **Debug**, **Call transcription** starts disabled. When enabled and published, supported OpenAI calls can retain encrypted caller and agent text for administrators. Select retention from 1 to 24 hours. Input transcription may add provider charges. This setting does not enable general audio recording and is separate from Satellite's existing transcription feature.

## Troubleshooting and verification {#troubleshooting-verification}

- If the agent is unavailable in VisualPlan, check publication and native synchronization.
- If a requested destination is unavailable, check the agent's tool toggle, category settings and current PBX inventory. Direct-extension permission and recent-caller eligibility are separate.
- If a call ends or takes fallback during connection, inspect the run's provider, phase and fixed error category, then check provider credentials and webhook reachability.
- If monitoring is incomplete or stale, inspect delivery health before interpreting latency or usage summaries.

A provider connection or media-bridge event does not prove that the caller heard speech. During an authorized test call, verify audio in both directions and the actual transfer destination. GPT-Live uses a primary provider WebSocket and a private Asterisk media WebSocket; OpenAI Realtime and Grok retain their separate SIP transports. There is no transport selector or automatic SIP fallback. Protocol and media measurements are separate from human listening; conversational quality, long calls and behavior under transcription load still require live acceptance.
