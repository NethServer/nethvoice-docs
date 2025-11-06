---
title: Legacy devices
sidebar_position: 3
---

## Overview {#overview}

Some very old phones and intercoms may not support TLS encryption. These devices **cannot be** provisioned through the NethVoice, which requires TLS for secure connections.

:::warning Unsupported Use Case
Legacy devices without TLS support are not officially supported. This is an edge case that requires special network-level configuration.
:::

## Network Bypass Approach {#network-bypass}

The only way to provision legacy devices without TLS support is through a **network-level bypass**. This approach allows the device to connect directly to Asterisk on the plain-text SIP port, bypassing the proxy.

### How It Works {#how-it-works}

Instead of connecting through the proxy (which enforces TLS), legacy devices connect directly to the Asterisk instance using the unencrypted SIP port. This requires:

1. Identifying the plain-text SIP port for the specific Asterisk instance
2. Opening the firewall to allow the device's IP address to access that port
3. Configuring the device to connect directly to the Asterisk host on the designated port

### Step-by-Step Configuration {#step-by-step}

#### 1. Find the Plain-Text SIP Port {#find-port}

Each NethVoice instance has a unique SIP port for unencrypted connections. Connect to the NethVoice host and run:

```bash
runagent -m nethvoice1
```

Replace `nethvoice1` with the appropriate module name for your instance.

Then check the `ASTERISK_SIP_PORT` environment variable:

```bash
env | grep ASTERISK_SIP_PORT
```

Example output:
```
ASTERISK_SIP_PORT=20098
```

In this example, the plain-text SIP port is `20098`.

#### 2. Open the Firewall for the Device {#open-firewall}

Use a firewall rule to allow **only** the device's IP address to access the Asterisk SIP port. Replace `1.2.3.4` with the actual IP address of the legacy device, and `20098` with the port identified in step 1:

```bash
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address=1.2.3.4 port port=20098 protocol="udp" accept'
firewall-cmd --reload
```

This rule ensures that:
- Only the specified device IP can access the port
- Access is restricted to UDP (SIP protocol)
- The rule persists across firewall restarts

To remove the rule later, use:

```bash
firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address=1.2.3.4 port port=20098 protocol="udp" accept'
firewall-cmd --reload
```

#### 3. Configure the Device {#configure-device}

Configure the legacy device with the following settings:

- **SIP Server**: The hostname or IP address of the NethVoice host
- **SIP Port**: The plain-text SIP port identified in step 1 (e.g., `20098`)
- **Transport**: `UDP` (not TLS)

Refer to your device's documentation for the specific configuration steps.

### Security Considerations {#security}

:::caution Security Warning
Connecting devices directly to Asterisk using unencrypted SIP is **not secure**. The SIP traffic, including credentials, is transmitted in plain text. This approach should only be used for legacy devices that have no other option and in controlled network environments.

- Restrict firewall access to only the necessary device IP address
- Use strong credentials on the device
- Consider network segmentation if possible
- Monitor the connection for unauthorized access
:::

## Alternatives {#alternatives}

If possible, consider these alternatives:

- **Replace the device**: If the device is too old to support TLS, consider upgrading to a modern phone or intercom that supports secure connections
- **Evaluate device support**: Check with the device manufacturer to see if a firmware update adds TLS support
