---
title: Recall on Busy
sidebar_position: 4
---

## Overview {#overview}

The **Recall on Busy** feature allows an extension to automatically schedule a new call to another PBX extension that is busy when the initial call attempt is made.

When the called extension becomes available again, NethVoice automatically starts the recall procedure.

## Requirements and configuration {#requisites}

The following requirements must be met before using the feature:

* **Global enablement**: the feature must be enabled under **Advanced → Applications → Recall on Busy**.
* **Feature code**: the feature code associated with Recall on Busy must be configured and enabled.
* **Endpoint compatibility**: the feature is handled by the PBX dialplan and SIP signaling. It can be used with both physical IP phones and the telephony features available through the NethVoice CTI Web/Desktop Phone.
* **Scope**: Recall on Busy is available only for calls between extensions belonging to the same NethVoice system.

## How it works {#function}

The Recall on Busy workflow consists of the following steps:

1. **Call to a busy extension**: a user calls another extension that is already engaged in a conversation.

2. **Recall activation**: after receiving the busy tone, the caller enters the feature code configured for Recall on Busy before ending the call.

3. **Called extension monitoring**: NethVoice monitors the destination extension status using the PBX presence and device-state mechanisms.

4. **Extension becomes available**: when the previously busy extension ends the call and becomes available again, NethVoice starts the recall procedure.

5. **Caller notification**: the PBX rings the extension that requested the recall.

6. **Call completion**: when the caller answers, NethVoice automatically places a new call to the extension that was previously busy.

The call is then handled as a standard internal call.

