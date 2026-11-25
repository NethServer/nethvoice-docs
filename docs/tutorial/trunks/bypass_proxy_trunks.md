---
title: Bypass proxy for unsupported trunks
sidebar_position: 6
---

## Introduction — proxy bypass overview

This page explains why and how to bypass the SIP proxy for unsupported trunks. It collects practical notes, common failure modes and the proxy bypass setting, aimed at on‑premise installations where the proxy causes connectivity issues.

## When to consider bypassing the proxy

- Use this only when trunks consistently fail through the proxy and the provider or device cannot be adjusted.
- Prefer configuration changes in the trunk/provider first (credentials, host, port, transport, codecs).
- Use bypass only after testing in a staging environment and assessing security and NAT implications.

## High level

- The proxy acts as an outbound/inbound mediator for most trunks, but some trunks and devices (notably certain Mediant setups) do not behave correctly when routed through the proxy.
- Bypassing the proxy can be required to restore service for problematic trunks or to support operator‑specific configurations that the proxy cannot handle.
- The decision to bypass should be taken after assessing operational constraints (firewall/NAT, port usage, certificate management and provider requirements).

## Trunks with registration {#trunks-with-registration}

- Default behaviour: the wizard sets the proxy as the outbound proxy for registered trunks.
- To bypass for a registered trunk, remove the **Outbound proxy** value in the [FreePBX advanced](/docs/administrator-manual/advanced/freepbx) for that trunk.
- Change the name of the trunk by adding the suffix `Custom-`: this is important, otherwise the configuration will be overwritten during updates.
- Then, configure the NAT settings in FreePBX as described in the [audio problems troubleshooting guide](../troubleshooting/audio_problems.md#nat-settings) to ensure proper handling of SIP and RTP traffic.

## Trunks without registration

- For non‑registered trunks, proxy routing is configured using the [specific page](/docs/administrator-manual/advanced/trunks_without_registration); incoming routes can be added based on numbers.
- Some devices/operators send a Request‑URI containing an unknown domain. Rules based on domain (in addition to number) are planned and will simplify handling these cases. If you have this problem, please contact Nethesis support for guidance.

## Notes on Mediant devices

- Mediant configurations are often managed by the telco technician and may be immutable or incorrect.
- Common issues:
  - Devices expecting to use port 5060 while the proxy occupies that port.
  - Request‑URI contains an unrecognized domain, causing proxy rejection.
- Workarounds:
  - Use custom domain mapping (similar to numbering rules) — this is in the roadmap.
  - When only the operator can change the Mediant, adapt PBX configuration (or bypass proxy) to make the trunk work.

## Recurring operational problems

- PBX installers may be unable to change operator due to portability constraints.
- Some environments migrated from older NethVoice versions (where things worked) and see regressions.
- Providers can change trunk parameters unilaterally.
- The proxy requires hairpin NAT in some topologies; many PBX installers cannot or will not modify their firewall.


## Proxy bypass for a device {#proxy-bypass}

Purpose: let a single device skip the incoming SIP proxy and talk directly to NethVoice, for extreme cases (typical: on‑prem Mediant TIM expecting 5060).

Use with care!

### Typical scenario {#proxy-bypass-scenario}

- On‑prem installation where the Mediant must reach NethVoice on UDP 5060.
- The proxy keeps serving phones and the other trunks on the same ports.

### Configuration {#proxy-bypass-configuration}

The bypass is configured in the settings of the NethVoice Proxy application running on the same node as NethVoice:

1. Open the **Settings** page of the NethVoice Proxy application and expand **Advanced**.
2. Under **Proxy bypass**, click **Add IP address**.
3. Enter the IP address of the device, for example `192.168.1.245`.
4. Select the NethVoice instance that receives its calls. Only the instances running on the node of the proxy are listed.
5. Click **Save**.

If the **Proxy bypass** list is missing, update the NethVoice Proxy application.

For each address the proxy creates the firewall rules by itself:

- SIP traffic over UDP sent by the device to the SIP port of the proxy is redirected to the NethVoice instance. The rule takes precedence over the ones of the [local networks](/docs/administrator-manual/advanced/nethvoice_proxy#local-networks), so a device inside a local network is bypassed too.
- The SIP port of the NethVoice instance is opened for the device. Without it, incoming calls are closed after about 30 seconds.
- The rules follow the [SIP port](/docs/administrator-manual/advanced/nethvoice_proxy#sip-ports) of the proxy, and they are removed when the address is removed from the list.

On the NethVoice side, configure the trunk of the device as described in [Trunks with registration](#trunks-with-registration): no **Outbound proxy**, and the `Custom-` suffix in the trunk name.

### Limitations and requirements {#proxy-bypass-limitations}

- Only SIP over UDP is bypassed.
- The NethVoice instance must run on the same node as the proxy.
- A device that is already sending SIP traffic to the proxy keeps reaching it until it stays silent for about two minutes. To apply a change at once, stop the device for that time or restart the node.
- FreePBX NAT settings must be updated: set public IP, local networks and include the NethServer network in local nets. See the [audio problems troubleshooting guide](../troubleshooting/audio_problems.md#nat-settings).
- As an alternative to the bypass, the proxy SIP port can be moved (for example to 5070) to leave 5060 free: see [SIP ports](/docs/administrator-manual/advanced/nethvoice_proxy#sip-ports). Phones, gateways and the mobile app provisioned by NethVoice follow the new ports.

### Verification {#proxy-bypass-verification}

List the firewall rules on the node:

```bash
firewall-cmd --list-rich-rules
```

Two rules with `priority="-10"` are listed for each address: one with `forward-port` and one with `accept`.

### Rules added by hand {#proxy-bypass-manual-rules}

Earlier versions of this page added the port forward with `firewall-cmd` commands. Those rules are not managed by the proxy: they do not follow its SIP ports, they are ignored when the device belongs to a local network of the proxy, and they do not open the SIP port of NethVoice.

Before adding a device to the **Proxy bypass** list, remove the rules added by hand for it. List them, then remove each one by passing its text as printed:

```bash
firewall-cmd --list-rich-rules
firewall-cmd --permanent --remove-rich-rule='<rule text>'
firewall-cmd --reload
```

Do not remove the rules created by the proxy, such as the ones with `priority="-10"` and the ones of the local networks.
