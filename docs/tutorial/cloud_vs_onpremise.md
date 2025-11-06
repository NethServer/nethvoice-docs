---
title: Cloud vs on-premise
sidebar_position: 7
---

The decision between a **Cloud (IaaS/SaaS)** and an **On-Premise** (local) installation of NethVoice on NethServer largely depends on business requirements, available IT resources, and specific needs regarding control, security, and scalability.

**NethVoice cannot be accessed or configured using an IP address alone, even in an On-Premise environment.**

This is a fundamental change from previous versions (e.g., NethVoice 14) and is mandated by modern best practices for **Security** (enabling valid SSL/TLS certificates) and **Maintainability** (simplified centralized management). A **publicly resolvable FQDN** is a non-negotiable prerequisite.


### Option 1: Cloud Deployment (IaaS or SaaS)

This option involves hosting NethServer and NethVoice with a Cloud Provider (IaaS) or utilizing a pre-configured SaaS solution.

#### Key Advantages

* **Provider Certification**: In general, it is always recommended to choose certified provider that fully integrate with the NethVoice proxy to avoid potential connection and registration issues.
* **Native Firewall Management**: The firewall component is managed natively by NethServer within the cloud environment.
* **Consolidation**: Multiple small PBX systems can be efficiently consolidated into a single NethServer node.
* **Simplified Migration**: When Media gateways are not involved, direct migration from existing hardware is possible, reducing switchover times.

NethVoice is designed with cloud and Multi-Tenant architectures in mind, leveraging a Proxy (Kamailio/RTP Engine) to manage networking complexity.

### Option 2: On-Premise Deployment

The On-Premise installation involves hosting NethServer and NethVoice on the company's own physical servers or as a virtual machine (VM) within the local network infrastructure.

#### Key Challenges and Considerations

* **Firewall Management**: The client is responsible for configuring and managing the firewall (router/edge device).
* **FQDN / SSL Mandate**: A public FQDN is still mandatory. Features like NethLink and the Mobile App require public FQDN, SSL, and external reachability on specific ports.
* **Networking and Audio Issues**: Audio problems (e.g., one-way audio) in on-premise deployments are often caused by NAT configuration issues. For troubleshooting steps, refer to: [troubleshooting guide](./troubleshooting/audio_problems.md).
* **Networking Complexity**: Requires Hairpin NAT and careful firewall configuration to allow local clients to access the server via its public FQDN.


### Synthesis Comparison Table

| Feature | ☁️ Cloud Installation (IaaS/SaaS) | 🖥️ On-Premise Installation |
| :--- | :--- | :--- |
| **Access Method** | FQDN only (Mandatory). | FQDN only (Mandatory). |
| **Firewall Management** | **Managed natively by NethServer** (Simpler). | **Managed by the client** (Requires expertise). |
| **Proxy Use** | **Recommended** (Choose certified providers). | Recommended to avoid NAT/audio issues. |
| **Migration** | Direct migration possible; reduced switchover time. | Requires traditional migration/switchover process. |
| **Network Complexity** | Low: Single FQDN, no Hairpin NAT needed for clients. | High: Requires Hairpin NAT and/or Split DNS setup. |

---

Given the architectural benefits for networking, security, and the significant operational advantages like native firewall and simplified migration, the **Cloud Deployment** is the recommended choice for a robust and simplified NethVoice solution.

