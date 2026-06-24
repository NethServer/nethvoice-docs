---
title: Getting started
sidebar_position: 1
---


# Getting Started with NethVoice

NethVoice is a telephony and unified communications platform that provides PBX features for small and medium businesses.  
It offers call routing, voicemail, conferencing, and user management through an intuitive web interface.  
Designed to run on [NethServer](https://www.nethserver.org/), NethVoice supports scalable deployments and secure remote access via the NethVoice Proxy.

This guide will walk you through the basic steps to set up NethVoice on your system.

## 1. Install NethServer 8 {#install-nethserver-8}

Begin by installing NethServer 8 on your server.  
- Download and follow the installation instructions from the [official guide](https://docs.nethserver.org/projects/ns8/en/latest/install.html).
- After installation, access the web interface at `https://<server_ip_or_fqdn>/cluster-admin/` using:
  - **Username:** `admin`
  - **Password:** `Nethesis,1234`
- Create a cluster and ensure your server has a static IP address and a valid FQDN.

## 2. Install NethVoice Module {#install-nethvoice-module}

Once the proxy is configured, you can install the NethVoice module:
- Open the **Software Center** from the web interface.
- Search for the NethVoice application and click **Install**.
- For more information, see the [Software Center documentation](https://docs.nethserver.org/projects/ns8/en/latest/software_center.html).

## 3. Configure NethVoice {#configure-nethvoice}

After installation, configure your NethVoice instance:
- Follow the [first-time setup wizard](https://docs.nethvoice.com/docs/administrator-manual/install/nethvoice_install#setup-wizard)
- Follow the [NethVoice configuration guide](https://docs.nethvoice.com/docs/administrator-manual/install/nethvoice_install#module-configuration) for detailed setup instructions.
- Complete the initial configuration, add users, and set up your telephony environment as needed.

---

For each step, refer to the linked documentation for comprehensive, step-by-step instructions.

## Related tutorials {#related-tutorials}

* [Common deployment scenarios](./cloud_vs_onpremise.md)
* [Export phonebook as CSV from NethVoice](./export-phonebook-csv.md)
* [Prune old Voicemail Messages](./voicemail-prune.md)
* [Prune old Call Recordings](./recording-prune.md)
