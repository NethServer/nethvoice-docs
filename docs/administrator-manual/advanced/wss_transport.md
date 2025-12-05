---
title: WSS Transport
sidebar_position: 7
---

# WSS Transport {#wss-transport}

NethVoice on NethServer 8 supports WebSocket Secure (WSS) transport for extensions. Each NethVoice instance exposes a specific WSS port dedicated to WebSocket connections.

:::warning Network Constraint
This configuration relies on direct connectivity and **does not work behind NAT**. Ensure that NethVoice has direct network visibility to the client endpoints.
:::

## Service Configuration {#service-configuration}

The WSS port assigned to the specific NethVoice instance is dynamically defined.

* **Variable:** `ASTERISK_WSS_PORT`
* **Location:** Within the module's environment variables.

Clients connecting to NethVoice via WebRTC or other WebSocket-based protocols must target this specific port.

## Extension Setup {#extension-setup}

To use WSS, the extension must be configured within the **Advanced Interface** (FreePBX).

### Prerequisites {#prerequisites}

1. Create a new **Custom Device** or modify an existing one.
2. Access the **Advanced Interface**.

### Transport Settings {#transport-settings}

Modify the `Advanced` settings of the extension with the following parameters to enable secure WebSocket transport:

1. **Outbound Proxy:** Remove proxy configurations for this specific extension.
2. **Transport:** Set to `0.0.0.0-wss`.
3. **Enable AVPF:** Set to `Yes`.
4. **Enable ICE Support:** Set to `Yes`.
5. **Enable rtcp Mux:** Set to `Yes`.
6. **Media Encryption:** Set to `DTLS`.
7. **Enable WebRTC Defaults:** Enable this setting to apply standard WebRTC optimizations.

## Client Configuration {#client-configuration}

Configure your client with the following settings. Ensure that the client device has network access to the NethVoice instance.

| Parameter | Value / Instruction |
| :--- | :--- |
| **SIP Server / Domain** | The FQDN of your NethVoice instance. |
| **SIP Proxy** | (Leave empty). |
| **Transport Protocol** | **WSS** (Secure WebSocket). |
| **Port** | The value of `ASTERISK_WSS_PORT` (check the module's environment variables). |
| **Path** | `/ws` (Default WebSocket path for Asterisk). |
| **Username / Extension** | The extension number (e.g., `1001`). |
| **Password / Secret** | The extension's secret defined in FreePBX. |
| **Media Encryption** | **DTLS** (Mandatory for WebRTC/WSS). |
| **AVPF** | Enabled / Yes. |
| **ICE Support** | Enabled / Yes. |

:::warning SSL Certificate Trust
WSS requires a valid SSL certificate. If using a self-signed certificate, the client device (or browser) **must explicitly trust the Certificate Authority (CA)** before the connection can be established.
:::