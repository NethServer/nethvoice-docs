---
title: Installation
sidebar_position: 1
---

# Installation Guide

This section covers the complete installation process for NethVoice, from setting up the underlying NethServer 8 infrastructure to configuring NethVoice itself.

## Overview {#overview}

NethVoice installation is a two-step process:

1. **[NethServer 8 Installation](nethserver.md)** - Install the NethServer 8 base platform
2. **[NethVoice Installation](nethvoice_install.md)** - Install and configure NethVoice application

## What is NethServer 8? {#what-is-nethserver-8}

NethServer 8 (NS8) is the underlying Linux infrastructure platform on which NethVoice runs. It provides:

- Open-source unified Linux infrastructure management
- Cluster support for high availability and scalability
- Modular application architecture
- Web-based administration interface
- Security hardening and updates

:::info
NethVoice requires NethServer 8 to be installed first. Ensure you complete the NethServer 8 installation before proceeding with NethVoice.
:::

## Installation Path {#installation-path}

### Step 1: Prerequisites {#step-1-prerequisites}

Before starting, ensure you have:

- A dedicated physical or virtual machine
- Supported Linux distribution installed (Rocky Linux, AlmaLinux, CentOS Stream, or Debian)
- Static IP address configured
- External DNS servers configured
- Working internet connection
- Fully Qualified Domain Name (FQDN) registered and resolved

### Step 2: Install NethServer 8 {#step-2-install-nethserver-8}

Follow the [NethServer Installation guide](nethserver.md) to:
- Install NethServer 8 core components
- Configure network and DNS
- Access the web administration interface
- Create your cluster

### Step 3: Install and configure NethVoice {#step-3-install-nethvoice}

Follow the [NethVoice Installation guide](nethvoice_install.md) to:
- Install NethVoice
- Complete the setup configuration wizard:
  - Configure an account provider
  - Install and configure a NethVoice Proxy
  - Set up virtual hosts, certificates and administration password
- Access NethVoice administration interface and CTI

## Quick Reference {#quick-reference}

### Minimum System Requirements {#system-requirements-minimum}

| Component | Requirement |
|-----------|-------------|
| CPU | 2 vCPU/cores (x86-64) |
| RAM | 2GB |
| Storage | 40GB SSD |
| Network | Static IP address |
| OS | **Rocky Linux 9** (subscription supported) - AlmaLinux 9, CentOS Stream 9, Debian 12 (community supported) |
| Browser | Firefox, Chrome, or Chromium (current version) |

### Installation Methods {#installation-methods}

**NethServer 8** can be installed via:
- Standard installation script (recommended)
- Pre-built virtual machine image (for Proxmox or VMWare)

**NethVoice** is installed via:
- NethServer Software Center interface

### Default Credentials {#default-credentials}

After installation, use these temporary credentials:

| Component | Username | Password |
|-----------|----------|----------|
| NethServer 8 Admin Interface | admin | Nethesis,1234 |
| NethVoice Admin Interface | admin | Nethesis,1234 |

:::warning
Change default credentials immediately after first login for security.
:::

## Detailed Guides {#detailed-guides}

### [NethServer 8 Installation](nethserver.md) {#nethserver-8-installation}

Complete guide covering:
- System requirements and hardware recommendations
- Supported Linux distributions
- Network and DNS configuration
- Standard installation procedure
- Pre-built image deployment
- Post-installation steps
- Cluster configuration
- Troubleshooting

### [NethVoice Installation](nethvoice_install.md) {#nethvoice-installation}

Complete guide covering:
- NethVoice software installation
- Setup wizard:
  - User domain
  - NethVoice Proxy
  - Virtual hosts (base hosts)
  - Let's Encrypt certificates
  - Administration password
- Administrator access
- Initial configuration

### [NethVoice Proxy Installation](../advanced/nethvoice_proxy.md) {#nethvoice-proxy-installation}

Complete guide covering:
- Proxy overview and architecture
- Role in single and multi-instance deployments
- Installation steps
- Configuration (domain, interface, public IP)
- SSL certificate setup
- Verification and testing
- Must be installed before NethVoice

## Installation Checklist {#installation-checklist}

Before you begin, ensure:

- [ ] Hardware meets minimum requirements (2 vCPU, 2GB RAM, 40GB SSD)
- [ ] Supported Linux distribution available
- [ ] Static IP address configured
- [ ] External DNS servers configured
- [ ] FQDN registered with DNS provider
- [ ] Firewall allows required ports (80, 443, 55820 for clustering)
- [ ] Internet connection is stable
- [ ] You have administrative access to the server

## Important Notes {#important-notes}

:::info
**Supported Platforms Only**: Install NethServer 8 on supported distributions only. Desktop systems and servers running other services are not supported.
:::

:::info
**Static IP Address**: DHCP is not supported. Configure a static IP address before or during NethServer 8 installation.
:::

:::warning
**DNS Configuration**: Proper DNS setup is essential for TLS certificates, clustering, and overall system functionality. Do not skip DNS configuration steps.
:::

:::warning
**Default Credentials**: Change default admin passwords immediately after installation. This is a security requirement, not optional.
:::

## Scaling {#scaling}

After initial installation, NethServer 8 supports:

- **Cluster Setup**: Add multiple nodes for scalability
- **Worker Nodes**: Distribute applications across cluster nodes
- **Load Balancing**: Built-in load balancing for applications
- **VPN**: Automatic VPN setup for secure inter-node communication

See the [NethServer 8 documentation](https://docs.nethserver.org/projects/ns8/) for clustering details.

## NethVoice scalability limits {#nethvoice-limits}

**NethVoice** has the following technical limits:

- **Maximum of 22 NethVoice instances** per NethServer 8 node.
- **Maximum of 250 concurrent calls** (internal and/or external) per **NethVoice** instance.

These limits are determined by the availability of UDP ports used to handle RTP traffic.

The maximum number of instances that can be installed on a single node and the maximum number of concurrent calls per instance are therefore technical constraints, regardless of the available hardware resources.

:::info
Reaching these technical limits does not guarantee that the system can handle the maximum load. The actual capacity also depends on the available hardware resources, instance configuration, and features in use.
:::

For deployments requiring more instances, the load must be distributed across multiple nodes in the NethServer 8 cluster.

For deployments requiring more than 250 concurrent calls per instance, please contact technical support.

## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

**Cannot access web interface**
- Verify static IP configuration
- Check firewall allows port 443
- Ensure DNS resolves the FQDN correctly
- See NethServer 8 installation guide

**Network connectivity issues**
- Configure static IP address
- Verify DNS servers are reachable and not local
- Check network interface configuration
- Test DNS resolution from command line

**Installation script fails**
- Ensure internet connection is stable
- Install curl if not available
- Run as root user
- Check system requirements are met

For additional help, refer to the detailed guides or NethServer 8 documentation.

## Next Steps {#next-steps}

After successful installation:

1. **Configure NethVoice**: Complete the NethVoice configuration wizard
2. **Set up Users**: Create user domains (LDAP or Active Directory)
3. **Provision Phones**: See [Phone Provisioning guide](../provisioning/index.md)
4. **User Training**: Use [User Manual](../../user-manual/index.md) to train end users
5. **Security Hardening**: Configure firewalls and access controls

---

**Ready to get started?** Begin with the [NethServer 8 Installation guide](nethserver.md).
