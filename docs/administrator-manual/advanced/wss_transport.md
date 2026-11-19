---
title: WSS Transport
sidebar_position: 9
---

# WSS Transport {#wss-transport}

NethVoice on NethServer 8 supports WebSocket Secure (WSS) transport for extensions. Clients connect to the NethVoice host name on the standard HTTPS port (443), using the `/ws` path.

:::warning Network Constraint
This configuration relies on direct connectivity and **does not work behind NAT**. Ensure that NethVoice has direct network visibility to the client endpoints.
:::

## Service Configuration {#service-configuration}

Clients connecting to NethVoice via WebRTC or other WebSocket-based protocols must use the following address:

```
wss://<NethVoice host>/ws
```

* **Host:** the host name set for NethVoice in the application settings (not the NethVoice CTI host name).
* **Port:** 443. The reverse proxy (Traefik) publishes the `/ws` path on the NethVoice host and forwards it to Asterisk.
* **Certificate:** clients see the certificate of the NethVoice host served by the reverse proxy, for example a Let's Encrypt certificate requested in the application settings.
* **Audio:** media does not go through the reverse proxy. It uses the Asterisk RTP port range, which must be reachable from the clients, and is encrypted with DTLS.

No dedicated WSS port is open in the firewall. The `ASTERISK_WSS_PORT` variable must not be used by clients.

:::note Updating from a previous release
Clients configured with the old address `wss://<host>:<ASTERISK_WSS_PORT>/ws` stop registering after the update. Change the server address of each client to `wss://<NethVoice host>/ws` (port 443). The extension setup in the **Advanced Interface** does not change.
:::

## Extension Setup {#extension-setup}

To use WSS, the extension must be configured within the **Advanced Interface** (FreePBX).

### Prerequisites {#prerequisites}

1. Create a new **Custom Device** or modify an existing one.
2. Access the **Advanced Interface**.

## Advanced Settings
Do not change the `HTTPS Bind Address` setting (`Settings` → `Advanced Settings` → `Asterisk Builtin mini-HTTP server`): it must stay `127.0.0.1`.

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
| **SIP Server / Domain** | The NethVoice host name set in the application settings. |
| **SIP Proxy** | (Leave empty). |
| **Transport Protocol** | **WSS** (Secure WebSocket). |
| **Port** | `443`. |
| **Path** | `/ws`. |
| **Username / Extension** | The extension number (e.g., `1001`). |
| **Password / Secret** | The extension's secret defined in FreePBX. |
| **Media Encryption** | **DTLS** (Mandatory for WebRTC/WSS). |
| **AVPF** | Enabled / Yes. |
| **ICE Support** | Enabled / Yes. |

:::warning SSL Certificate Trust
WSS requires a valid SSL certificate: the one of the NethVoice host served by the reverse proxy. If using a self-signed certificate, the client device (or browser) **must explicitly trust the Certificate Authority (CA)** before the connection can be established.
:::
