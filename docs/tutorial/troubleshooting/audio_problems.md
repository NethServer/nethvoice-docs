---
title: Audio Problems
sidebar_position: 3
---

# Audio Problems and Call Disconnections

This guide addresses common audio issues in NethVoice, including calls dropping after 30 seconds, unidirectional audio, or no audio. These problems typically occur in specific network configurations where NAT (Network Address Translation) is involved, such as remote phones connecting via VPN or TLS, or multi-subnet environments.

:::warning

Direct NAT configuration on FreePBX is **only necessary** if the Proxy has been bypassed in your setup.

In standard NethVoice deployments, the Proxy handles NAT translation, and you should only configure NAT settings through the NethVoice administration interface (as described above).

:::

## Scenarios {#scenarios}

### Scenario 1: Calls Dropping After 30 Seconds (On-Premises, Multiple Subnets)

**Situation:** NethVoice is installed on-premises with client phones connecting from different subnets due to network infrastructure, resulting in calls dropping after approximately 30 seconds.

**Root Cause:** This is typically a server-side timeout due to poor audio handling. When the server doesn't receive audio from at least one call participant for more than 30 seconds, it terminates the call.

### Scenario 2: Remote Phones via VPN (Unidirectional or No Audio)

**Situation:** Phones registered from remote locations via VPN experience unidirectional or no audio.

**Root Cause:** NAT (Network Address Translation) configuration not accounting for remote VPN subnet addresses.

### Scenario 3: Remote Phones via TLS (Unidirectional or No Audio)

**Situation:** Phones registered from remote locations using TLS encryption experience unidirectional or no audio.

**Root Cause:** External IP address configuration not properly advertised to TLS-connected clients.

### Scenario 4: VoIP Provider ACK Issue

**Situation:** NethVoice sends a **200 OK** response to the provider, but the provider doesn't send back an **ACK** (acknowledgment). This typically indicates incomplete call signaling.

![VoIP Provider ACK Issue](/img/tutorial/sngrep_trunk.png)

**Root Cause:** NethVoice advertises a different public IP address than the one from which the signaling is actually sent, causing the provider to route the ACK to an incorrect destination.

## Solution: Configure NAT Settings {#nat-settings}

To resolve these issues, you must properly configure the NAT settings in NethVoice.

### Access NAT Configuration

1. Log in to the NethVoice web interface.
2. Navigate to the advanced administration section.
3. Locate the **NAT Configuration** section.

### Configuration Options

#### External Address {#external-address}

The **External Address** field should contain the **public IP address** where NethVoice will receive audio from devices outside local networks.

**Purpose:**
- Used for devices connecting from non-local subnets (remote offices, VPN, remote phones).
- Advertised in SIP signaling to instruct external devices where to send audio.
- For Scenario 4 specifically, this IP is used in signaling headers sent to the VoIP provider, ensuring the provider's ACK response goes to the correct destination.

**How to find your public IP:**
You can identify your public IP from the environment variable on the NethVoice system, or use a command like `curl ifconfig.me`.

#### Local Networks {#local-networks}

The **Local Networks** field specifies which subnets will receive NethVoice's **green interface (internal) IP address** for audio routing.

**Example:**
If you configure `192.168.1.0/24` and `192.168.2.0/24` as local networks:
- Phones connecting from these subnets will receive the internal green IP address.
- These phones will send audio to the internal IP (optimal for LAN performance).
- Phones from other networks will receive the **External Address** instead.

#### Special Cases

**Scenario 2 (Remote VPN Phones):**
- Add the remote subnet (VPN network) to the **Local Networks** configuration.
- This tells NethVoice to advertise its internal IP to those phones, assuming the VPN provides network connectivity.

**Scenario 3 (Remote TLS Phones):**
- No NAT configuration is required in this scenario.
- Phones presenting from a public IP source do not need special NAT treatment.

**Scenario 4 (Provider ACK Issue):**
- Ensure the **External Address** is correctly configured.
- This external address will be used in SIP signaling headers to the provider.

### Applying Changes

After configuring the NAT settings:

1. Click **Save NAT Settings**.
2. NethVoice will restart the telephony core to apply the changes.
3. **Important:** Active calls will be terminated during this restart.

## Multi-WAN Scenario (Balance Mode) {#multiwan-warning}

If your network uses Multi-WAN in balance mode (traffic randomly routed across multiple connections), audio problems may persist even with correct NAT configuration. This is because the source IP used for signaling may differ from the configured External Address.

**Recommendation:**
Configure one or more **static routes** to force traffic destined for the External Address to use the specific WAN connection matching your configured External Address. This ensures consistent routing and audio quality.

## Next Steps

If issues persist after configuring NAT settings:
- Review the [Firewall Configuration](../../administrator-manual/configuration/firewall.md) guide to ensure firewall rules permit the necessary ports.
- Check the [sngrep](./sngrep.md) guide to analyze SIP signaling in detail.

