---
title: Firewall
sidebar_position: 12
---

# Firewall Configuration

## Overview

If your NS8 node is configured directly with a public IP address (without a dedicated firewall in front), the NS8 perimeter firewall automatically opens all necessary ports. No additional firewall configuration is required in this scenario.

When deploying NethVoice in an infrastructure with a dedicated firewall in front of the NS8 node, specific ports must be opened to ensure all services function correctly. This guide provides detailed information about firewall requirements for NethVoice deployments.

If there is a dedicated firewall in front of your NS8 infrastructure, you must explicitly open the ports required by NethVoice. See the list below.

### Proxy Ports

The proxy service requires the following ports:

- **TCP**: 5060-5061
- **UDP**: 5060-5061, 10000-20000

### NethVoice Instance-Specific Ports

Each NethVoice instance has specific service ports.
To identify all required ports for any specific instance, access the NethServer cluster admin page and go to the firewall settings in **Settings > Firewall**.

Here there is a list of commonly used ports:

- CTI TLS Port (TCP), eg `20107`: this port is reserved for NethCTI TLS communication (currently not actively used but available for future use).
- Phonebook LDAP Port (TCP), eg `20092`: used for LDAP directory services integration with the phonebook. Phones that need to access the LDAP phonebook must be able to reach this port.
- SFTP Port (TCP), eg `20149`: used for SFTP access by specific services (e.g., recording upload/download).
- IAX Port (UDP), eg `20110`: single UDP port for IAX (Inter-Asterisk eXchange) protocol.
- RTP and Janus Ports (UDP): used for audio streaming in NethCTI, it's a range of port, usually around 1000 ports.

### Generic Ports

**WireGuard VPN**
- Port: 55820, used to connect NethServer nodes
- Protocol: UDP

**HTTPS**
- HTTPS: Port 443 (TCP), used to access the CTI and the administration web interface

**SSH**
- Port: 22 (default), used for remote management
- Protocol: TCP

### Port Summary Table {#port-summary}

| Service | Port(s) | Protocol | Purpose |
|---------|---------|----------|---------|
| SIP Proxy | 5060-5061 | TCP/UDP | SIP signaling |
| RTP | 10000-20000 | UDP | Media streaming (proxy) |
| Janus RTP | Variable range* | UDP | CTI audio streaming |
| IAX | Variable* | UDP | Inter-Asterisk Exchange |
| CTI TLS | Variable* | TCP | CTI secure communication |
| LDAP | Variable* | TCP | Directory services |
| SFTP | Variable* | TCP | Recording management |
| WireGuard VPN | 55820 | UDP | VPN access |
| HTTPS | 443 | TCP | Web services |
| SSH | 22 | TCP | Remote management |

*Variable ports are instance-specific. Use the environment variable inspection method described above to determine exact port numbers for your deployment.

## Firewall Best Practices

### NAT Helper

NAT helper functions on firewalls should be **disabled** when possible. These features are often poorly implemented and can cause unexpected behavior with NethVoice communication protocols.

### Hairpin NAT {#hairpin-nat}

When a proxy is deployed behind a firewall with Network Address Translation (NAT), **hairpin NAT** (also known as NAT reflection, NAT hairpining, or loopback NAT) must be enabled on the firewall.

#### Why Hairpin NAT is Important

Hairpin NAT allows local network devices to reach the proxy using the external (public) IP address or FQDN, even though they are on the same local network. This is essential for proper device provisioning and functionality.

#### Enabling Hairpin NAT

Most firewalls have NAT reflection or hairpin NAT functionality available. Consult your firewall documentation for specific instructions. Common terms to look for:

- NAT Reflection
- Hairpin NAT
- NAT Hairpining
- Loopback NAT
- NAT on a Stick

## Troubleshooting

If you encounter connectivity issues after opening firewall ports:

1. **Verify all ports are open**: Use port scanning tools to confirm firewall rules are working
2. **Check NAT configuration**: If behind NAT, ensure hairpin NAT is enabled
3. **Disable NAT helper**: Try disabling NAT helper/ALG functions if connectivity is intermittent
4. **Verify instance ports**: Double-check that you've opened the correct ports for your specific NethVoice instance
5. **Contact support**: Open a ticket with Nethesis support if issues persist