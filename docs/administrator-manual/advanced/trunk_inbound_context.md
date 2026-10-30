---
title: Trunk inbound context
sidebar_position: 8
---

# Trunk inbound context

Every call coming from a trunk enters the Asterisk dialplan in the **context** configured on that trunk. The context decides which number is used as the called number (DID) when the [inbound routes](../configuration/wizard.md#inbound) are matched and, in some cases, which number is shown as caller ID. NethVoice sets the context automatically when the trunk is created with the [configuration wizard](../configuration/wizard.md#trunks); change it only when the provider delivers the numbers in a non-standard way.

## Available contexts {#available-contexts}

| Context | Called number (DID) taken from | Notes |
|---|---|---|
| `from-pstn` | Request-URI of the INVITE | Asterisk default context for incoming calls. |
| `from-pstn-toheader` | `To` header | Default for most VoIP providers configured by the wizard. |
| `from-pstn-identity` | Request-URI | Default for physical gateways. The caller number is taken from the `P-Asserted-Identity` or `P-Preferred-Identity` header when present. |
| `from-pstn-preferredin` | `P-Preferred-Identity` header | For multi-number trunks whose provider sends the called DID in this header. Available from NethVoice 1.8. |

All contexts hand the call over to `from-pstn`, so the inbound routes and the rest of the inbound call flow do not change.

## Change the context of a trunk {#change-the-context-of-a-trunk}

1. Go to **Administration -> Advanced** to open the FreePBX UI, then to **Connectivity -> Trunks** and open the trunk.
2. Open the **PJSIP Settings** tab, then the **Advanced** tab.
3. Set the **Context** field to the desired context, for example `from-pstn-preferredin`.
4. Click **Submit** at the bottom, then **Apply Config** at the top-right to activate the change.

## DID in the P-Preferred-Identity header {#did-in-the-p-preferred-identity-header}

Some providers deliver a multi-number trunk with the same number in the Request-URI of every call, and carry the DID actually dialed by the caller in the `P-Preferred-Identity` header:

```text
P-Preferred-Identity: <sip:0123456789@provider.example>
```

With the default contexts the inbound routes cannot tell the DIDs of the trunk apart. Set the trunk context to `from-pstn-preferredin`: the dialplan extracts the number from the header (`0123456789` in the example) and uses it as the called number, so an inbound route can be created for each DID. When the header is missing, the call falls back to the number of the Request-URI.

To verify the behaviour, call one of the DIDs and look for the line `Goto(from-pstn,<DID>,1)` in the [Asterisk logs](../../tutorial/troubleshooting/quick_checks.md#step-3--collect-asterisk-logs), where `<DID>` is the number carried by the header.

:::info
With a [trunk without registration](./trunks_without_registration.md) behind the NethVoice Proxy, the provider must still prepend the **Root** prefix to the Request-URI so that the proxy routes the call to the right NethVoice instance. The DID taken from the header has no prefix: create the inbound routes on the bare number.
:::

:::warning
Before NethVoice 1.8 the same behaviour was obtained by adding a custom `[from-pstn-preferredin]` context to `extensions_custom.conf`. Remove that custom context after the update, otherwise Asterisk logs warnings about duplicate priorities at every configuration reload.
:::
