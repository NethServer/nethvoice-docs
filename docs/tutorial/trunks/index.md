---
title: Trunks
sidebar_position: 4
---

# Trunks

Learn how to configure and manage trunks within the platform. This section covers the basics of trunk setup, different trunk types, best practices, and troubleshooting tips.

A trunk is a connection that links your NethVoice PBX to the public telephone network (PSTN) or to another VoIP system, allowing you to make and receive external calls.

## Trunk Types {#trunk-types}

There are two primary types of SIP trunks used in NethVoice, distinguished by their authentication method.

### Trunks with Registration (Register Trunks) {#trunks-with-registration-register-trunks}

This is the most common type of trunk, typically used to connect to an Internet Telephony Service Provider (ITSP).

- **Authentication**: The trunk authenticates with the provider using a username and password. NethVoice sends a `REGISTER` request to the provider's server, which confirms the connection.
- **IP Address**: This method is suitable for environments where NethVoice has a dynamic public IP address, as the registration process informs the provider of the current IP.
- **Use Case**: Ideal for most business connections that rely on a standard internet line.

### Trunks without Registration (IP-Based or Peer Trunks) {#trunks-without-registration-ip-based-or-peer-trunks}

This type of trunk authenticates based on the IP address of your NethVoice system.

- **Authentication**: The provider is configured to trust and accept calls coming from your specific, static public IP address. No username or password is exchanged for registration.
- **IP Address**: This method requires your NethVoice system to have a static, public IP address that does not change.
- **Use Case**: Commonly used for direct inter-office connections between two PBXs or for connecting to providers that offer IP-based authentication.

## Best Practices for Trunk Management {#best-practices-for-trunk-management}

Following these best practices will help ensure your trunk connections are secure, reliable, and efficient.

1.  **Security First**:
    - For registered trunks, always use strong, unique passwords.
    - For IP-based trunks, configure your firewall to allow SIP and RTP traffic **only** from the provider's specific IP addresses. This prevents unauthorized access attempts.

2.  **Consistent Codecs**:
    - Configure your trunk to use a limited set of codecs that are explicitly supported by your provider (e.g., G.711 A-law, G.711 U-law, G.729).
    - Ensure the codec priority in NethVoice matches the provider's preference to avoid unnecessary transcoding, which consumes system resources and can degrade audio quality.

3.  **Use Clear Naming Conventions**:
    - Give your trunks descriptive names that are easy to identify, such as `ProviderName_Main_Office` or `Backup_Provider_VoIP`. This simplifies management and troubleshooting, especially in environments with multiple trunks.

4.  **Regular Monitoring**:
    - Periodically check the status of your trunks from the NethVoice interface to ensure they are registered and passing traffic correctly.
    - Set up alerts if your monitoring system supports it to be notified of trunk failures.

5.  **Plan for Redundancy**:
    - If call continuity is critical, consider setting up a secondary trunk with a different provider.
    - Configure outbound call routes to automatically failover to the backup trunk if the primary one becomes unavailable.

6.  **Configure Dialing Rules Carefully**:
    - Double-check your outbound dialing rules (outbound routes) to ensure that calls are routed through the correct trunk. Misconfigurations can lead to failed calls or unexpected billing.

