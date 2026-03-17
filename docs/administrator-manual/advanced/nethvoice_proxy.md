---
title: NethVoice Proxy
sidebar_position: 5
---

# NethVoice Proxy

## Overview {#overview}

NethVoice Proxy is a critical component that handles all external VoIP traffic for NethVoice instances. It acts as a gateway for internet-based SIP and RTP connections, enabling secure external access to your telephony system.

:::info What is NethVoice Proxy?
NethVoice Proxy provides:
- **External VoIP Gateway**: Single entry point for all internet-based voice traffic
- **Traffic Routing**: Intelligent SIP/RTP traffic delegation to multiple NethVoice installations on the same node
- **SSL/TLS Termination**: Secure encrypted connections for external VoIP traffic
- **Load Balancing**: Distributes incoming calls across multiple NethVoice instances
- **NAT Traversal**: Handles Network Address Translation for remote and mobile users

**Important**: NethVoice Proxy is required for every NethVoice deployment, even with a single instance. It manages external internet access and must be installed and configured before deploying any NethVoice instances.
:::

## Architecture {#architecture}

NethVoice Proxy module is built on two main open-source components:

| Component | Purpose |
|-----------|---------|
| **[Kamailio](https://www.kamailio.org)** | SIP proxy server for managing all SIP (Session Initiation Protocol) connections |
| **[RTP Engine](https://github.com/sipwise/rtpengine/)** | RTP proxy for managing RTP (Real-time Transport Protocol) connections |

These components work together to manage all incoming and outgoing SIP and RTP connections between your NethVoice instances and external VoIP networks (internet, trunks, remote offices, mobile users).

## Role in NethVoice Deployments {#role-in-nethvoice-deployments}

### Single Instance Deployment {#single-instance-deployment}

Even with a single NethVoice installation, NethVoice Proxy is essential:
- Acts as the external interface for internet-based VoIP traffic
- Handles SSL/TLS encryption for remote users
- Manages NAT traversal for mobile and remote connections
- Provides a single domain for external users to reach your PBX

### Multi-Instance Deployment {#multi-instance-deployment}

With multiple NethVoice instances on the same node, NethVoice Proxy provides:
- **Single External Entry Point**: External callers use one FQDN (the proxy domain)
- **Traffic Routing**: Proxy intelligently routes calls to the appropriate NethVoice instance
- **Load Distribution**: Distributes calls across multiple instances
- **Shared SSL Certificates**: Manages external security for all instances
- **Centralized Trunk Management**: External trunks can be shared or routed to specific instances

:::info Multi-Instance Architecture
```
Internet/External Trunks
        ↓
   NethVoice Proxy
   (proxy.domain.com)
    ↙        ↓        ↘
Instance 1  Instance 2  Instance 3
(tenant A) (tenant B)  (tenant C)
```

In this scenario:
- All external traffic arrives at the proxy
- Proxy routes calls to the appropriate NethVoice instance based on routing rules
- Each instance operates independently while sharing external access
:::

## Installation {#installation}

### Recommended Installation {#installation-steps}

NethVoice proxy is installed as part of the NethVoice module setup wizard. See [NethVoice Installation](../install/nethvoice_install.md) for the complete installation sequence.

### Manual Installation (not recommended)

:::note
You can install only one NethVoice Proxy per node from the Software Center.
:::

NethVoice Proxy must be installed **before** deploying any NethVoice instances.

1. **Open NethServer Management Interface**
2. **Navigate to Software Center**
3. **Search for "NethVoice Proxy"**
4. **Click "Install"** and wait for installation to complete
5. **Proceed to configuration** (see section below)

## Configuration {#configuration}

### Prerequisites {#prerequisites}

Before configuring NethVoice Proxy, ensure:

1. **DNS Records Created**: Create a DNS A/AAAA record for the proxy domain (e.g., `proxy.nethserver.org`) pointing to your public IP address
2. **Public IP Address**: Identify the public IPv4 or IPv6 address where the proxy will be accessible from the internet
3. **Network Interface**: Identify which network interface will handle VoIP traffic

### Configuration Steps {#configuration-steps}

NethVoice Proxy is usually configured during the setup wizard of a NethVoice module (see [NethVoice Installation](../install/nethvoice_install.md) for the complete installation sequence). To review or modify the proxy configuration:

1. **Access the proxy configuration page** in the NethServer management interface
2. **Enter the Proxy Domain**: Set a valid FQDN (e.g., `proxy.nethserver.org`)
   - This domain must have a valid DNS A/AAAA record pointing to your public IP
   - External VoIP devices and remote offices will use this domain to reach your system
3. **Request SSL Certificate**:
   - Enable Let's Encrypt to automatically manage SSL certificates for the proxy domain
   - This requires the DNS record to be publicly resolvable
4. **Select Network Interface**: Choose the network interface that will handle VoIP traffic from the dropdown menu
   - This is typically the interface connected to your WAN/Internet
5. **Configure Public IP Address**: 
   - Enter the public IPv4 or IPv6 address if different from the interface IP
   - This is necessary if your node is behind a router/NAT
   - Leave blank if the interface has a direct public IP address

### Configuration Example {#configuration-example}

**Scenario**: Single node with private network interface, public IP behind NAT

| Setting | Value | Notes |
|---------|-------|-------|
| Proxy Domain | `proxy.example.com` | Public FQDN, DNS record created |
| Network Interface | `eth0` (WAN interface) | Private IP: 192.168.1.10 |
| Public IP Address | `203.0.113.45` | Public routable IP address |
| Let's Encrypt | Enabled | Automatic certificate for `proxy.example.com` |

**Result**: External devices connect to `proxy.example.com` (203.0.113.45), traffic routes internally to 192.168.1.10

### Special Cases {#special-cases}

#### Local Network Only (No Internet Access) {#local-network-only-no-internet-access}

If the proxy is only accessible within a local network and not from the internet:

```
Proxy Domain: proxy.internal.local
Network Interface: eth0 (Private network)
Public IP Address: <blank> or internal IP (192.168.1.10)
Let's Encrypt: Disabled
```

Use the private IP address that devices on your local network use to reach the proxy.

#### Multiple External IPs {#multiple-external-ips}

If your node has multiple public IP addresses, configure the proxy with the specific public IP you want for VoIP traffic:

1. Set the Network Interface to the interface receiving traffic
2. Enter the specific public IP in the "Public IP Address" field
3. Ensure DNS records point to this IP address

:::info Network Diagram
```
External Users/Trunks
        ↓ (Internet)
   Public IP (e.g., 203.0.113.45)
        ↓
   NethVoice Proxy
   (SIP/RTP traffic management)
        ↓ (Internal network)
   NethVoice Instance(s)
   (CTI, extensions, features)
```

The proxy acts as a gateway between external VoIP traffic and internal NethVoice instances.
:::
