---
title: Introduction
sidebar_position: 0
---

# NethVoice Administrator Manual

## What is NethVoice? {#what-is-nethvoice}

NethVoice is a comprehensive, unified communications platform built on open-source technologies. It integrates voice, video, and mobile capabilities into a single, powerful PBX system that organizations of any size can deploy and manage.

Unlike traditional proprietary PBX systems, NethVoice combines the flexibility of FreePBX/Asterisk with modern web-based interfaces, WebRTC technology, and advanced provisioning capabilities to deliver enterprise-grade communications.

:::info
This documentation covers the complete installation, configuration, and management of NethVoice on NethServer 8. Whether you're deploying your first system or managing multiple instances, you'll find comprehensive guides for every aspect of NethVoice.
:::

## Quick Navigation {#quick-navigation}

Get started quickly by jumping to the most important sections:

- **[Installation Guide](./install/index.md)** - Complete setup instructions from NethServer prerequisites to NethVoice deployment
- **[Configuration](./configuration/index.md)** - NethVoice management after the initial setup.
- **[Phone Provisioning](./provisioning/index.md)** - Automated phone device management and provisioning
- **[Advanced Resources](./advanced/index.md)** - System configuration and advanced topics

## Core Components {#core-components}

NethVoice is built on seven main open-source components:

| Component | Purpose | Link |
|-----------|---------|------|
| **FreePBX** | Web-based GUI for Asterisk management and call routing | [freepbx.org](https://www.freepbx.org/) |
| **Asterisk** | VoIP server and core telecommunications engine | [asterisk.org](https://www.asterisk.org) |
| **NethVoice CTI Server** | APIs and WebSocket events for switchboard operations | [GitHub](https://github.com/nethesis/nethcti-server) |
| **NethVoice CTI Client** | Web application for call management and operator stations | [GitHub](https://github.com/nethesis/nethcti) |
| **NethVoice Report** | CDR and queue analytics and reporting | [GitHub](https://github.com/nethesis/nethvoice-report) |
| **Janus** | WebRTC gateway for video and web communications | [janus.conf.meetecho.com](https://janus.conf.meetecho.com/) |
| **Tancredi** | Intelligent phone provisioning engine | [GitHub](https://nethesis.github.io/tancredi) |

Additional services include **MariaDB** for data storage and **Let's Encrypt** for SSL certificate automation.

## Key Features Overview {#key-features-overview}

### Communication & Routing {#communication--routing}

- **FreePBX & Asterisk Integration**: Web-based GUI for managing complete telephony services
- **Inbound/Outbound Routing**: Visual call flow editor with customizable route priorities
- **Trunk Management**: Configure physical gateways and VoIP trunks (SIP, PJSIP)
- **User and Extension Management**: Associate users with extensions with granular control
- **Click-to-Call**: Initiate calls from web or desktop clients with NethLink integration

### Device Management & Provisioning {#device-management--provisioning}

- **Automated Phone Provisioning**: Tancredi provisioning engine for supported phone models
- **Supported Devices**: Compatibility with NethPhone, Fanvil, Yealink, Snom, Gigaset, Grandstream, Patton and more
- **Multiple Provisioning Methods**: RPS, DHCP, and manual provisioning URLs
- **Device Association**: Link up multiple devices per user (web phone, mobile app, physical phones)
- **Firmware Management**: Upload and distribute firmware updates to phones
- **Gateway Provisioning**: Automated and manual configuration for supported gateways
- **Provisioning Parameters**: Configure soft keys, line keys, expansion keys, screen/ringtone settings, LDAP phonebook

### User Management & Permissions {#user-management--permissions}

- **Group and Profile Management**: Create user groups with granular permission profiles
- **Permissions System**: Fine-grained control over telephony features, address book, CDR, customer cards, presence, queues
- **Operator Stations**: Configure dedicated switchboard operator environments
- **User Domains**: Support for LDAP or Active Directory integration for centralized user management

### Communication Tools & Interfaces {#communication-tools--interfaces}

- **CTI Server and Client**: APIs and web applications for switchboard operations
- **WebRTC Support**: Integration with Janus for video and web communications
- **Dashboard**: Real-time overview of users, devices, trunks, and system status
- **Reporting System**: Call Detail Records (CDR) and queue analytics

### Advanced Features {#advanced-features}

- **Multi-instance Support**: Install multiple NethVoice instances on the same NethServer node
- **Applications Framework**: Create and manage customer cards, address book sources, and parameterized URLs
- **External Address Book Integration**: Import contacts from MySQL, CSV, or custom scripts
- **Parameterized URLs**: Trigger custom URLs on call events with dynamic parameters
- **Let's Encrypt Integration**: Automated SSL certificate management

## Getting Started {#getting-started}

### Prerequisites {#prerequisites}

Before deploying NethVoice, ensure you have:

- ✅ **System Resources**: Minimum 2 vCPU, 2GB RAM, 40GB storage per instance
- ✅ **Network Requirements**: Static IP, DNS configured, internet connectivity
- ✅ **NethServer 8**: Fully installed and configured (see [Installation Guide](./install/index.md))

### Deployment Steps {#deployment-steps}

1. **[Review System Requirements](./install/nethserver.md#system-requirements)** - Ensure your infrastructure meets requirements
2. **[Install NethServer 8](./install/nethserver.md)** - Deploy the base infrastructure platform
3. **[Install & Configure NethVoice](./install/nethvoice_install.md)** - Install NethVoice Proxy and NethVoice modules
4. **Configure Your System**:
   - [Provision Phones](./provisioning/index.md) - Deploy and configure telephone devices
   - [Manage Extensions](../user-manual/nethcti/index.md) - Create extensions and assign to users
5. **[Advanced Configuration](./advanced/index.md)** - Configure trunks, gateways, routing, and advanced features

## Key Documentation Sections {#key-documentation-sections}

| Section | Purpose | Learn About |
|---------|---------|------------|
| **[Installation](./install/index.md)** | System setup and deployment | NethServer, NethVoice installation, prerequisites |
| **[Provisioning](./provisioning/index.md)** | Phone device management | Supported devices, provisioning methods, configuration |
| **[Administrator Manual](./index.md)** | System administration | Users, extensions, trunks, gateways, routing |
| **[User Manual](../user-manual/index.md)** | End-user features | CTI client, NethCTI, NethLink, calling features |

:::tip Multi-Instance Deployments
You can install multiple NethVoice instances on the same NethServer 8 node from the Software Center. Each instance requires separate configuration and runs independently. This is useful for multi-tenant deployments or separate business units.
:::

:::warning Prerequisites
The NethVoice module requires that the **NethVoice proxy** be already installed, configured, and running on the system. 

**Why?** NethVoice Proxy:
- Manages all external VoIP traffic from the internet
- Handles SIP/RTP traffic routing and delegation
- Enables external access even with a single NethVoice instance
- Routes traffic between multiple NethVoice installations on the same node

If you haven't set up the proxy yet, refer to the [NethVoice Proxy documentation](./advanced/nethvoice_proxy.md) before installing NethVoice.
:::

## Subscription {#subscription}

NethVoice requires a **NethServer subscription** to unlock its full capabilities. 

:::info NethServer Subscription
For detailed information about subscription plans, registration, and management, refer to the [NethServer Subscription documentation](https://docs.nethserver.org/projects/ns8/en/latest/subscription.html).
:::

### Supported Subscription Plan

**Only the Enterprise subscription is supported in NethVoice.** The Enterprise plan provides:

- Scheduled security and feature updates
- Remote support access
- Cluster monitoring and alerting
- Access to all NethVoice modules and features

Contact [info@nethesis.it](mailto:info@nethesis.it) for Enterprise subscription details.

### Limitations Without Subscription

If you deploy NethVoice without an active subscription, the following restrictions apply:

- **Maximum 8 extensions** — Limited to 8 user extensions in the system
- **No phone provisioning** — Tancredi provisioning engine is unavailable; phones can be provisioned only via DHCP so it will work only if the phones and the PBX are in the same local network (no cloud provisioning)
- **No mobile app access** — The NethVoice mobile application is not available
- **Community support only** — No access to remote support or priority assistance

To unlock these features and scale beyond 8 extensions, activate an Enterprise subscription.

## Support & Additional Resources {#support--additional-resources}

- **Official Documentation**: Full technical reference and advanced configuration guides
- **Community Support**: Join the NethVoice community for questions and discussions
- **Professional Services**: Reach out to Nethesis for enterprise deployments and support
- **Provisioning Guide**: Detailed information on supported phones and gateways in the [Provisioning section](./provisioning/index.md)

## About Nethesis {#about-nethesis}

**Nethesis** is the company behind NethVoice development. It's a leading Italian producer of open-source business solutions for SMBs (small and medium-sized businesses). Founded on the principle that open-source software is the ideal foundation for secure, innovative, and cost-effective enterprise systems, Nethesis delivers modular, user-friendly, and reliable ICT solutions with support and services entirely in Italian.

With over thousands active installations and a network of hundreds partners across Italy and abroad, Nethesis is committed to:

- **Open Source Innovation**: Building on proven, transparent, community-driven technologies that ensure security and flexibility
- **User-Centric Design**: Simplifying complex technologies with intuitive web interfaces for experts and non-experts alike
- **Local Support**: Providing technical and commercial support, with development and infrastructure based in Italy
- **Long-term Partnerships**: Prioritizing relationships over transactions, working closely with partners, customers, and the community

### Nethesis Product Suite

Nethesis offers a comprehensive suite of modular, independent ICT solutions that address the core needs of modern businesses:

- **[NethVoice](https://www.nethesis.it/soluzioni/nethvoice)** — Open and versatile VoIP PBX for unified communications. Integrate voice, video, mobile, and business systems with features like web phone, mobile app, call center capabilities, and intelligent phone provisioning. It runs on NethServer.

- **[NethService](https://www.nethesis.it/soluzioni/nethservice)** — Collaboration suite for your private cloud. Centralize email, calendars, contacts, documents, and chat with built-in Active Directory and corporate cloud services. It runs on NethServer.

- **[NethSecurity](https://www.nethesis.it/soluzioni/nethsecurity)** — Enterprise firewall for SMBs. Protect your network and ensure fast, safe access to cloud services with threat intelligence, quality of service, VPN, and cloud filtering. UTM firewall based on OpenWRT.

- **[NethSpot](https://www.nethesis.it/soluzioni/nethspot)** — Public WiFi hotspot management. Improve guest experience with proximity marketing, social login, centralized WiFi management, and bandwidth controls.

All solutions are deployment-agnostic: install on certified appliances, virtual machines, private clouds, or compatible hardware. For more information, visit [www.nethesis.it](https://www.nethesis.it) or contact [info@nethesis.it](mailto:info@nethesis.it).
