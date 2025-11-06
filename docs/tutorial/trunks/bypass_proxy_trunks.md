---
title: Bypass proxy for unsupported trunks
sidebar_position: 6
---

## Introduction — proxy bypass overview

This page explains why and how to bypass the SIP proxy for unsupported trunks. It collects practical notes, common failure modes and a small proof‑of‑concept for a port‑forwarding approach aimed at on‑premise installations where the proxy causes connectivity issues.

## When to consider bypassing the proxy

- Use this only when trunks consistently fail through the proxy and the provider or device cannot be adjusted.
- Prefer configuration changes in the trunk/provider first (credentials, host, port, transport, codecs).
- Use bypass only after testing in a staging environment and assessing security and NAT implications.

## High level

- The proxy acts as an outbound/inbound mediator for most trunks, but some trunks and devices (notably certain Mediant setups) do not behave correctly when routed through the proxy.
- Bypassing the proxy can be required to restore service for problematic trunks or to support operator‑specific configurations that the proxy cannot handle.
- The decision to bypass should be taken after assessing operational constraints (firewall/NAT, port usage, certificate management and provider requirements).

## Trunks with registration

- Default behaviour: the wizard sets the proxy as the outbound proxy for registered trunks.
- To bypass for a registered trunk, remove the **Outbound proxy** value in the [FreePBX advanced](/docs/administrator-manual/advanced/freepbx) for that trunk.
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


## Port‑forwarding experiment (HIGHLY EXPERIMENTAL)

Purpose: allow a complete bypass of the incoming SIP proxy for extreme cases (typical: on‑prem Mediant TIM expecting 5060).

### Typical scenario

- On‑prem installation where the Mediant must be reachable on UDP 5060.
- Constraint: 5060 must be reserved for trunks; phones should continue using 5061.

### Limitations and requirements

- Cannot remap 5061 (would require certificate and provisioning changes for phones).
- After enabling port forward, FreePBX NAT settings must be updated: set public IP, local networks and include the NethServer network in local nets.
- Port forward is not visible in the proxy UI.
- Port forward should be limited to a single source IP when possible.

### Example firewall commands (udp 5060 only)

Export a variable with the Asterisk SIP port:

```bash
export $(runagent -m nethvoice1 grep ASTERISK_SIP_PORT environment)
```

Add a global forward rule:

```bash
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT"
firewall-cmd reload
```

Limit forward to a single IP (example 1.2.3.4):

```bash
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT source address=1.2.3.4"
firewall-cmd reload
```

### Verification and removal

List rules:

```bash
firewall-cmd --list-rich-rules
```

Remove the global rule:

```bash
firewall-cmd --permanent --remove-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT"
```

Remove the IP‑limited rule:

```bash
firewall-cmd --permanent --remove-rich-rule="rule family=ipv4 forward-port port=5060 protocol=udp to-port=$ASTERISK_SIP_PORT source address=1.2.3.4"
```

Apply changes:

```bash
firewall-cmd reload
```

### Notes

- IPv6 and TCP variants require equivalent rules.
- This is an experimental mitigation and should be used only for constrained cases where provider/device fixes are not available.

