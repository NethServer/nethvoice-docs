---
title: NethServer Installation
sidebar_position: 2
---

# NethServer 8 Installation

NethVoice runs on top of **NethServer 8 (NS8)**, an open-source unified Linux infrastructure platform. This page guides you through installing NethServer 8, which is a prerequisite for NethVoice installation.

:::tip
If you want a ready-to-use NethServer installation, please consider our **[NethServer 8 SaaS](saas.md#nethserver-8-saas)** service, which provides a fully managed NethServer instance in the cloud.
:::

## System Requirements {#system-requirements}

Before installing NethServer 8, ensure your system meets the following requirements:

### Hardware Requirements {#hardware-requirements}

For a single node installation:

- **CPU**: 2 vCPU/cores, x86-64 architecture (minimum)
- **RAM**: 2GB minimum
- **Storage**: 40GB Solid-state drive minimum
- **Type**: Physical or virtual machine (Proxmox LXC and container-based virtualization not supported)

:::info
Additional nodes can be added later. When scaling, use similar hardware and the same Linux distribution for consistency. Requirements should be increased based on users, applications, and load.
:::

### Supported Linux Distributions {#supported-linux-distributions}

NethServer 8 can be installed on the following distributions:

**With Nethesis Subscription Support:**
- Rocky Linux 9

**With Community Support:**
- Rocky Linux 9
- CentOS Stream 9
- AlmaLinux 9
- Debian 12

:::warning
Install on a **clean Linux server** only. Do not install on desktop systems or servers running other services.
:::

### Network Requirements {#network-requirements}

#### Static IP Address {#static-ip-address}

- **Mandatory**: Assign a static IP address to the node
- **Not allowed**: DHCP and dynamic IP discovery protocols
- **Internet**: Working internet connection required for installation, configuration, and updates

#### Name Resolution {#name-resolution}

Configure DNS servers for the node:

- DNS servers must be **external** to the NethServer 8 installation
- Configure one or more nameserver entries in `/etc/resolv.conf` pointing to external DNS servers
- These servers can be on the same LAN or public Internet

:::warning
**Avoid these configurations:**
- Do not use `127.0.0.1` or any IP assigned to the node itself
- Do not use NS8-provided DNS services (Samba AD, DNSMasq) as the node resolver
- Do not mix DNS servers from different scopes (e.g., public Cloudflare + private DNS)
:::

#### DNS Configuration {#dns-configuration}

The node's **Fully Qualified Domain Name (FQDN)** must be properly configured:

1. **FQDN Format**: hostname + domain suffix (e.g., `jupiter.example.org`)
2. **DNS Records**: Register the FQDN with:
   - Type A record for IPv4 addresses
   - Type AAAA record for IPv6 addresses
3. **Routable IP**: The FQDN must resolve to a routable IP address
4. **TLS Certificates**: Correct FQDN and DNS setup are essential for TLS encryption to work properly

#### Worker Node Requirements (for clustering) {#worker-node-requirements-for-clustering}

If adding worker nodes to a cluster:

1. Worker node must resolve the leader's FQDN to the correct routable address
2. HTTPS server (TCP port 443) at that address must handle API requests
3. VPN UDP port (default 55820) must not be blocked by firewalls or network appliances

### Web Browser Requirements {#web-browser-requirements}

To access the NethServer 8 web interface, use an up-to-date version of:
- Firefox
- Chrome
- Chromium

## Installation Methods {#installation-methods}

NethServer 8 can be installed using two methods:

### Method 1: Standard Procedure {#method-1-standard-procedure}

For most installations, use the standard installation procedure.

#### Installation Steps {#installation-steps}

1. **Install curl** (if not already available):
```bash
apt install curl || dnf install curl
```

2. **Run the installation script** as `root`:
```bash
curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash
```

3. **Wait for completion**: The script will install all NethServer 8 core components.

### Method 2: Pre-built Virtual Machine Image {#method-2-pre-built-virtual-machine-image}

A pre-built Rocky Linux 9 image is available for quick deployment on virtual platforms.

See the official NethServer documentation for more details: [NethServer 8 Pre-built Images](https://docs.nethserver.org/projects/ns8/en/latest/install.html#pre-built-image).


## Post-Installation Steps {#post-installation-steps}

After installation completes:

1. Access the Web Interface

   Open your browser and navigate to: `https://<server_ip_or_fqdn>/cluster-admin/`

2. Initial Login
   Use the default credentials:
   - Username: `admin`
   - Password: `Nethesis,1234`

Follow the wizard to create a cluster and configure the node.
More info available in the [official NethServerdocumentation](https://docs.nethserver.org/projects/ns8/en/latest/install.html#post-installation-steps).


After cluster setup, you can:

1. **Install User Domain**: [Set up LDAP or Active Directory](#user-domains)
2. **Install NethVoice**: Proceed with [NethVoice installation](nethvoice_install) via the Software Center
3. **Register NethServer**: Activate your [Enterprise subscription](#register-nethserver)


## User Domains {#user-domains}

User domains store users and groups in an LDAP database. NethVoice requires at least one user domain to manage extensions, users, and authentication.

### Overview {#overview}

NethServer 8 supports two types of LDAP account providers:

| Provider | Type | Best For | Features |
|----------|------|----------|----------|
| **OpenLDAP (RFC2307)** | Internal | Unix/Linux clients, simple setup | Lightweight, easy configuration, smaller deployments, multiple instances per node |
| **Active Directory (Samba)** | Internal | Windows clients, SMB file sharing | Domain controller, Windows compatibility, higher complexity, one instance per node |
| **External LDAP** | External | Existing LDAP infrastructure | Connect to existing servers (Active Directory, OpenLDAP, etc.) |


:::info NethVoice Requirement
NethVoice requires at least one configured user domain. Choose **OpenLDAP (RFC2307)** for simpler deployments or **Active Directory** if you need Windows client support.
:::

### Quick Setup: OpenLDAP (Recommended for NethVoice) {#quick-setup-openldap-recommended-for-nethvoice}

OpenLDAP is the simplest option for NethVoice-only deployments:

1. **Access the NethServer 8 web interface** after installation completes
2. **Navigate to Domains and users** section
3. **Click "Create domain"** and choose **"Internal"**
4. **Select "OpenLDAP"** as the provider
5. **Enter domain name** (e.g., `nethvoice.local`) - this is a logical name, not DNS-related
6. **Set OpenLDAP admin username and password**
7. **Click "Install provider"**

The domain will be ready immediately. You can now:
- Create users and groups for NethVoice extensions
- Manage user authentication
- Configure NethVoice to use this domain

:::tip
Keep the OpenLDAP admin credentials in a secure location. You'll need them for administrative tasks.
:::


For advanced scenarios (external LDAP, Active Directory, DNS setup, password policies, user management), see the [official NethServer 8 User Domains documentation](https://docs.nethserver.org/projects/ns8/en/latest/user_domains.htm).

Key topics in the official docs:
- **Active Directory Setup**: Complete domain controller configuration
- **External LDAP Connection**: Binding to existing LDAP servers
- **Password Policies**: Age, strength, and expiration settings
- **User Management Portal**: Self-service password changes
- **LDAP Provider Replicas**: Fault tolerance and redundancy
- **LDAP binding settings**: Connect external application to a local-running LDAP server

## Register NethServer {#register-nethserver}

NethServer must have an Enterprise subscription to unlock all NethVoice features.
See [subscription section](../index.md#subscription) for more info.

### Registration Steps {#registration-steps}

1. **Obtain a subscription token**:
   - Log in to [my.nethesis.it](https://my.nethesis.it/) portal 
   - Follow the portal procedures to generate a unique subscription token for your cluster

   :::warning Important
   The subscription token is a secret. Never share or communicate it with anyone else.
   :::

2. **Register the cluster**:
   - Access the NethServer 8 web interface
   - Go to `Settings` → `Subscription` card
   - Paste the token in the **Authentication token** field
   - Click the **Register** button
   - NethVoice will automatically inherit the NethServer subscription and activate its features

3. **Verify registration**:
   - After successful registration, the Subscription page displays:
     - **System ID**: Unique identifier for your cluster
     - **Plan**: Subscription type
     - **Expiration date**: When your subscription expires

### Removing a Subscription {#removing-subscription}

If you need to remove a subscription:

1. Go to `Settings` → `Subscription` card
2. Click the **Remove subscription** button
3. Confirm the action when prompted

## Troubleshooting {#troubleshooting}

### Node Unreachable {#node-unreachable}

If the node is unreachable after installation:
- Verify static IP configuration
- Check DNS resolution for the FQDN
- Ensure firewall allows HTTPS (port 443)
- Review network interface configuration

### Network Configuration Issues {#network-configuration-issues}

If you need to reconfigure network settings:
- Access the console directly or via IPMI/KVM
- Log in as root
- Update network configuration using:
  - **Rocky Linux**: Use `nmtui` or edit NetworkManager files
  - **Debian**: Use `netplan` or `/etc/network/interfaces`
  - **CentOS Stream/AlmaLinux**: Use `nmcli` or `nmtui`
