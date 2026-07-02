---
title: NethVoice Installation
sidebar_position: 4
---

# NethVoice Installation

NethVoice is a VoIP application that requires a specific installation on NethServer. This guide will walk you through the installation process.

:::tip
If you want a ready-to-use NethVoice installation, please consider:
- our **[NethVoice SaaS](saas.md#nethvoice-as-a-service)** service, which provides a fully managed NethVoice instance in the cloud
- a **[VoiceBox Appliance](voicebox.md)**, a hardware appliance with NethServer and NethVoice pre-installed
:::

## Module Installation {#module-installation}

1. **Access the Software Center** on your NethServer 8 system.
2. **Search for "NethVoice"** in the Software Center search bar.
3. **Click "Install"** next to NethVoice.
4. **Wait for installation** to complete (this may take a few minutes).

## First-time setup wizard {#setup-wizard}

Open the NethVoice application from the **Applications** page or the **Application Launcher** (the 9-dot icon in the top-right corner, or press **Ctrl + Shift + A**) in NethServer 8. A first-time configuration wizard will appear and guide you through:
- Configuring an account provider for NethVoice
- Installing and configuring the NethVoice Proxy
- Configuring the NethVoice application

### Account Provider {#user-domains}

The first step of the setup wizard helps you configure the user domain used by NethVoice.

User domains store users and groups in an LDAP database. NethVoice requires a user domain to manage extensions, users, and authentication. 
NethServer 8 supports two types of LDAP account providers:

| Provider | Type | Best For | Features |
|----------|------|----------|----------|
| **OpenLDAP (RFC2307)** | Internal | Unix/Linux clients, simple setup | Lightweight, easy configuration, smaller deployments, multiple instances per node |
| **Active Directory (Samba)** | Internal | Windows clients, SMB file sharing | Domain controller, Windows compatibility, higher complexity, one instance per node |
| **External LDAP** | External | Existing LDAP infrastructure | Connect to existing servers (Active Directory, OpenLDAP, etc.) |


:::info NethVoice Requirement
NethVoice requires at least one configured user domain. Choose **OpenLDAP (RFC2307)** for simpler deployments or **Active Directory** if you need Windows client support.
:::

#### Quick Setup: OpenLDAP (Recommended for NethVoice) {#quick-setup-openldap-recommended-for-nethvoice}

The setup wizard lets you quickly and easily install an OpenLDAP account provider. To configure it, you have to:

- **Enter domain name** (e.g., `nethvoice.local`) - this is a logical name, not DNS-related
- **Set OpenLDAP admin username and password**

For advanced scenarios (external LDAP, Active Directory, DNS setup, password policies, user management), see the [official NethServer 8 User Domains documentation](https://docs.nethserver.org/projects/ns8/en/latest/user_domains.html).

Key topics in the official docs:
- **Active Directory Setup**: Complete domain controller configuration
- **External LDAP Connection**: Binding to existing LDAP servers
- **Password Policies**: Age, strength, and expiration settings
- **User Management Portal**: Self-service password changes
- **LDAP Provider Replicas**: Fault tolerance and redundancy
- **LDAP binding settings**: Connect external application to a local-running LDAP server

### NethVoice Proxy

The next step of the first setup wizard installs and configures the NethVoice Proxy.

NethVoice Proxy is a component that must be installed and configured before deploying NethVoice application instances. Even with a single NethVoice installation, the proxy is essential for proper network traffic management.

The proxy handles all external internet access and manages SIP/RTP traffic routing. It is required for:
- External access from the internet
- Traffic delegation to multiple NethVoice installations on the same node
- Managing SIP and RTP connections for all NethVoice instances
- SSL/TLS termination for internet-facing VoIP traffic

NethVoice Proxy is a standard NethServer 8 application: its settings can be reviewed and changed by accessing it from the **Applications** page or the **Application Launcher** (the 9-dot icon in the top-right corner, or press **Ctrl + Shift + A**).

#### Prerequisites

Before configuring NethVoice Proxy, ensure:

1. **DNS Records Created**: Create a DNS A/AAAA record for the proxy domain (e.g., `proxy.nethserver.org`) pointing to your public IP address
2. **Public IP Address**: Identify the public IPv4 or IPv6 address where the proxy will be accessible from the internet
3. **Network Interface**: Identify which network interface will handle VoIP traffic

The setup wizard detects automatically if there already is a proxy on the installation node of NethVoice and proposes to install it if needed. Then, to configure the NethVoice Proxy:

1. **Configure the Proxy domain** this is the public FQDN where the proxy will be reachable.
   Do not enter NethServer FQDN but use a dedicated one, like `proxy.nethserver.org`.
   This name will be used by external clients to reach your VoIP services, but
   it will not be used directly by final users.
2. **Enable Request Let's Encrypt certificate** checkbox if needed: a Let's Encrypt certificate will be requested for the proxy domain.
3. **Set the Network interface** that will handle VoIP traffic
4. **Configure Public IP address** if different from the interface IP

The above configuration will be the entrypoint for all external VoIP traffic.

Make sure that:
- the configured FQDN resolves correctly to the public IP address
- any DNS records are properly set up to point to the proxy

These requirements are critical to obtain a valid SSL/TLS certificate for secure communications.

See [NethVoice Proxy Documentation](../advanced/nethvoice_proxy.md) for more info.

### NethVoice application

:::warning DNS configuration
To set up NethVoice, you need to have two dedicated virtual hosts:

- A **NethVoice base host** for the NethVoice administration interface, eg. `nethvoice.nethserver.org`
- A **NethVoice CTI base host** for the NethVoice CTI web application, eg. `cti.nethserver.org`

Before proceeding with the configuration, ensure that you have created the corresponding DNS records for these FQDNs in your DNS server.

If you plan to use a Let's Encrypt certificate as the default certificate, make sure you have the necessary public DNS records.
:::

In the last step of the setup wizard, you will be prompted to provide the following information:

- **NethVoice base host**: Enter a valid FQDN to access the application administration page; this is where you will manage NethVoice settings, e.g. `nethvoice.nethserver.org`.
- **NethVoice CTI base host**: Enter a valid FQDN for the NethVoice CTI web application, e.g. `cti.nethserver.org`.
- **Request Let's Encrypt certificate**: If enabled, a Let's Encrypt certificate will be requested for both the **NethVoice base host** and the **NethVoice CTI base host**.
- **Timezone**: Select the appropriate timezone for your NethVoice application; this is important for accurate call logging and scheduling.
- **Admin password to access user interface**: Sets the password for the NethVoice administration page.

### Next steps {#next-steps}

At the end of the first-time setup wizard, NethVoice will be accessible on the base host configured, e.g.:
```
https://nethvoice.nethserver.org
```

To access the NethVoice administration interface, use the following credentials:

- User: `admin`
- Password: The password you have chosen in the first-time setup wizard

After completing NethVoice configuration in the administration interface, users can access NethVoice CTI on the base host configured, e.g.:
```
https://cti.nethserver.org
```

## Module Configuration {#module-configuration}

The settings of the NethVoice module can be reviewed and changed by accessing the NethVoice module of NethServer 8. To do this:

- Access the NethServer cluster administration page.
- Open the NethVoice application from the **Applications** page or the **Application Launcher** (the 9-dot icon in the top-right corner, or press **Ctrl + Shift + A**).
- Go to the specific configuration page you want to modify.

On the **Settings** page you can review and change most of the configuration parameters:

- **NethVoice base host**: virtual host for the NethVoice administration interface.
- **NethVoice CTI base host**: virtual host for NethVoice CTI web application.
- **Request Let's Encrypt certificate**: if enabled, a Let's Encrypt certificate will be requested for both the **NethVoice base host** and the **NethVoice CTI base host**.
- **Account provider**: user domain used by NethVoice.
- **Timezone**: timezone for your NethVoice application, this is important for accurate call logging and scheduling.
- **Reports prefix**: telephone prefix number used in reports
- **New admin password for NethVoice**: define a new password for the `admin` user

On the **Integrations** page you can configure speech-to-text and AI services:
- **Deepgram API Key**: required to enable call and voicemail transcription.
- **Call transcription**: enables transcription for calls handled by NethVoice. Users with the required profile permission can open live transcription during a call, and supported completed calls can expose post-call transcription data in CTI History. This feature may consume Deepgram credits quickly on systems with many calls.
- **Voicemail transcription**: converts voicemail audio to text with Deepgram and includes the transcription in voicemail messages when the voicemail flow provides an audio attachment.
- **OpenAI API Key**: required to enable AI-generated call summaries. When an OpenAI API Key is configured, users with the required profile permission can review generated summaries from CTI History and configure summary-ready notifications.
- **Call summary**: enables AI-generated summaries of completed calls. It can only be turned on when an OpenAI API Key is configured and **Call transcription** is enabled, since summaries are built from the post-call transcription data.

AI-generated call summaries use the post-call transcription data and require both a working Deepgram configuration and a configured OpenAI API Key.

:::info Transcription and summaries
For user-facing details about live transcription, post-call transcription, summaries, notifications, and History integration, see [Voice Transcription and Call Summary](../../user-manual/nethcti/other.md#voice-transcription) in the User Manual.
:::

On the **Rebranding** page you can customize the NethVoice user interface with the brand identity of your company. To enable this feature, you have to contact Nethesis sales team and have an active Enterprise subscription.

On the **Hotel** page you can configure the Hotel module; an active subscription is required for this feature.

- **Status**: Activate the Hotel module for managing hotel-specific telephony features.
- **Hotel FIAS server host**: Enter the IP address or hostname of the Hotel FIAS server.
- **Hotel FIAS server port**: Specify the port number for the Hotel FIAS server connection.

See [NethVoice Hotel Module Documentation](/docs/administrator-manual/nethhotel/) for more details.
