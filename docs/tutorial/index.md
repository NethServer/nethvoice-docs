---
title: Getting started
sidebar_position: 1
---


# Getting Started with NethVoice

NethVoice is a telephony and unified communications platform that provides PBX features for small and medium businesses.  
It offers call routing, voicemail, conferencing, and user management through an intuitive web interface.  
Designed to run on [NethServer](https://www.nethserver.org/), NethVoice supports scalable deployments and secure remote access via the NethVoice Proxy.

This guide will walk you through the basic steps to set up NethVoice on your system.

## 1. Install NethServer 8 {#1-install-nethserver-8}

Begin by installing NethServer 8 on your server.  
- Download and follow the installation instructions from the [official guide](https://raw.githubusercontent.com/NethServer/ns8-docs/refs/heads/main/install.rst).
- After installation, access the web interface at `https://<server_ip_or_fqdn>/cluster-admin/` using:
  - **Username:** `admin`
  - **Password:** `Nethesis,1234`
- Create a cluster and ensure your server has a static IP address and a valid FQDN.

## 2. Install and Configure NethVoice Proxy {#2-install-and-configure-nethvoice-proxy}

The NethVoice Proxy is required to enable secure remote access to NethVoice services.
- Install the NethVoice Proxy module from the Software Center.
- Assign a valid FQDN (e.g., `proxy.yourdomain.org`) and ensure the DNS record is configured.
- Configure the network interface and public IP as needed.
- Only one NethVoice Proxy can be installed per node.
- For detailed steps, refer to the [NethVoice Proxy documentation](https://raw.githubusercontent.com/NethServer/ns8-docs/refs/heads/main/nethvoice_proxy.rst).

## 3. Install NethVoice Module {#3-install-nethvoice-module}

Once the proxy is configured, you can install the NethVoice module:
- Open the **Software Center** from the web interface.
- Search for the NethVoice application and click **Install**.
- For more information, see the [Software Center documentation](https://raw.githubusercontent.com/NethServer/ns8-docs/refs/heads/main/software_center.rst).

## 4. Configure NethVoice {#4-configure-nethvoice}

After installation, configure your NethVoice instance:
- Follow the [NethVoice configuration guide](https://github.com/NethServer/ns8-docs/blob/main/nethvoice.rst) for detailed setup instructions.
- Complete the initial configuration, add users, and set up your telephony environment as needed.

---

For each step, refer to the linked documentation for comprehensive, step-by-step instructions.

## New test section: Test Translation Agent  {#new-test-section-test-translation-agent}

This section has been created for testing purpose. A new agent has been developed with the aim of translating new contents from and to English and Italian, in order to allow users to create new documentation just in one of the two language and generate the other specular version automatically. 
