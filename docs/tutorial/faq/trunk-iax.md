---
title: How do I configure a trunk between two NethVoice systems?
sidebar_position: 11
---

# How do I configure a PJSIP trunk between two NethVoice systems?

To connect two **NethVoice on NS8** systems, using a **PJSIP trunk is recommended**.

PJSIP can reuse the standard SIP/RTP ports already used by NethVoice, so it does not require opening an additional dedicated port specifically for the inter-site trunk.

It is also possible to connect the two systems using **IAX**, but this requires allowing the IAX port on both NethVoice systems and their firewalls. 
Moreover, standard IAX configurations do not provide encrypted signaling and media, so this solution is generally not recommended when compared with PJSIP, especially when **TLS/SRTP** can be used.

On both systems, open:

**Advanced → Connectivity → Trunks**

## First NethVoice

Create a new **PJSIP trunk** and configure:

- **Authentication**: `Outbound`
- **Registration**: `Send`
- **Username**: choose a username for the trunk
- **Secret**: choose a password
- **SIP Server**: hostname of the second NethVoice
- **SIP Server Port**: `5060`
- **Context**: `from-internal`
- **Transport**: `0.0.0.0-udp`

In the advanced PJSIP settings, keep **Send Line in Registration** enabled.

## Second NethVoice

Create another **PJSIP trunk** using the same credentials:

- **Authentication**: `Inbound`
- **Registration**: `Receive`
- **Secret**: the same password configured on the first NethVoice
- **SIP Server**: hostname of the first NethVoice
- **SIP Server Port**: `5060`
- **Context**: `from-internal`
- **Transport**: `0.0.0.0-udp`

If the interface does not allow the **SIP Server** to be entered while `Receive` is selected, temporarily set **Registration** to `Send`, enter the server information, and then switch it back to `Receive`.

## How do I route calls between the two sites?

Once the trunk is registered, create the required **outbound routes** on both systems.

The dial patterns should match the extensions available on the remote NethVoice.

For example, if the remote site uses extensions in the `2XX` range, an outbound route can send those numbers through the inter-site trunk.

## Which firewall ports are required?

For PJSIP over UDP, the firewall between the two NethVoice systems must allow:

- SIP signaling on **UDP 5060**
- RTP audio on **UDP 10000-20000**

If TLS is used instead:

- use SIP port **5061**
- set **Transport** to `0.0.0.0-tls`

## What if incoming calls are shown as anonymous?

Depending on the trunk configuration, calls from the remote NethVoice may be received as **anonymous**.

If required, anonymous SIP calls can be enabled from:

**Advanced → Settings → Asterisk SIP Settings**

Enable this only when necessary and when SIP access to the PBX is properly restricted by the firewall.
