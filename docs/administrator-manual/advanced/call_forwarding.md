---
title: Call forwarding
---

# Call forwarding

:::info FreePBX 17 upgrade
These rules apply to NethVoice instances upgraded to FreePBX 17 and Asterisk 22. Check them before upgrading an existing installation.
:::

## Outbound permissions {#outbound-permissions}

A forwarded call uses the routing permissions of the extension that owns the forwarding setting. For a user extension, these are the outbound routes allowed by the user's CTI profile. Hotel extensions use their hotel routing restrictions.

For example, if a user's profile does not allow calls to mobile numbers, forwarding that user's calls to a mobile number also fails. Enabling the **Call Forwarding** permission allows the user to configure forwarding; it does not grant access to additional outbound routes.

This changes the behavior of the previous FreePBX 16 integration, where forwarding used the general internal routing context. The new behavior prevents forwarding from bypassing outbound call restrictions.

The rule applies to unconditional forwarding and forwarding on busy or no answer, including forwarding settings on individual ring-group members. Each member uses its own routing permissions. An external number configured directly as a ring-group destination retains the routing of that destination; review it separately.

## Supported extensions {#supported-extensions}

NethVoice must be able to resolve the forwarding owner's routing context from a configured telephone peer. PJSIP extensions and IAX2 peers use their own context. A phone does not need to be registered for its configured PJSIP endpoint to have a context.

Forwarding is rejected when the owner's context cannot be resolved, for example for a virtual or custom extension without a supported peer, a deleted peer, or an unsupported device type. NethVoice does not fall back to unrestricted internal routing. In Asterisk logs, this rejection can appear as hangup cause `21`.

## Before upgrading {#before-upgrading}

1. Review existing forwarding destinations, especially external mobile numbers.
2. Check the outbound routes allowed by each forwarding user's [profile](../configuration/wizard.md#profiles). Grant only the routes that the user should be allowed to use.
3. Review virtual, custom and hotel extensions. Where forwarding has no supported peer context, configure an appropriate supported extension or review the intended call routing with the PBX administrator.
4. Test unconditional, busy and no-answer forwarding, plus ring groups with members assigned to different profiles. Verify both permitted and forbidden destinations.

## Troubleshooting {#troubleshooting}

If forwarding stops working after the upgrade, check the owner's profile and whether its outbound rules match the destination number. For hotel extensions, check the hotel routing rules. If the destination is permitted, verify that the owner still has a configured peer with the intended context.

Changing the forwarding target or enabling the forwarding permission alone does not override these checks. See also [call forwarding in NethVoice CTI](../../user-manual/nethcti/calls.md#call-forwarding).
