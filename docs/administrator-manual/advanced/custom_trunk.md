---
title: Custom VoIP trunk
sidebar_position: 6
---

# Configure custom VoIP trunks

:::warning
If the trunk has not been tested with the NethVoice proxy, it may not work as expected. Some providers or trunk configurations require proxy-specific handling; verify compatibility with your provider and perform tests in a staging environment before putting the trunk into production.
:::

:::info
This guide applies only to VoIP providers that require registration. For registration-less see [Trunks without registration](/docs/administrator-manual/advanced/trunks_without_registration).
:::

## Overview

If a provider is not listed inside the [Supported trunks](/docs/administrator-manual/provisioning/supported-trunks) page, you can still try to add it manually.

Configuring a non-listed provider usually requires editing parameters that NethVoice sets automatically for known providers. You can either:

- create a PJSIP trunk manually inside [FreePBX](freepbx), or
- create a trunk with the [configuration wizard](/docs/administrator-manual/configuration/wizard) for a similar provider (recommended) and then edit the fields that differ (typically the SIP server and port).

## Prerequisites

- Admin access to NethVoice web UI and FreePBX.
- Provider details: SIP server/host, SIP port (if different from 5060), username, password, authentication details, and any required domain or realm values.
- A staging environment or maintenance window to test changes safely.

## Step-by-step (wizard + edit)

1. In NethVoice [configuration](/docs/administrator-manual/configuration/wizard) navigate to **Trunks** -> **VoIP**.
2. Click **Configure new provider**.
3. Use the wizard to create a new trunk choosing **Clouditalia** (or another similar provider). Give the trunk a clear name and fill the fields with the credentials provided by your SIP provider.
4. Click **Save**.
5. Go to **Administration -> Advanced** to open the FreePBX UI. Then go to **Connectivity -> Trunks** and open the trunk you created.
6. Open the **PJSIP Settings** tab.
7. Edit the following fields as required:

	 - **SIP server**: replace the wizard's host with the SIP server/host provided by your carrier.
	 - **SIP server port**: set the correct port if it differs from 5060.
	 - **From Domain** (in Advanced tab): set the carrier-provided domain or use the provider host if none is given.
	 - Any carrier-specific parameters (authentication realm, codecs, transport, etc.).

8. Keep the configuration for the other fields as set by the wizard, like **Outbound proxy**
9. Click **Submit** at the bottom, then **Apply Config** at the top-right to activate changes.

## Testing and rollback

- After applying, test outbound and inbound calls with a small set of numbers.
- If the trunk fails, rollback options:
	- Revert the edited fields to the previous values in FreePBX and click **Apply Config**.
	- If you used the wizard method, delete the custom trunk and recreate it from a backup or note the original settings.

## Troubleshooting checklist

- Check registration status in FreePBX trunk overview (registered/unregistered).
- Verify SIP server, port, username and password with the provider.
- Check network/firewall rules between NethVoice and the provider (NAT, ports 5060/UDP or transport used).
- Review the [Asterisk logs](/docs/tutorial/troubleshooting/quick_checks#step-3--collect-asterisk-logs) and FreePBX console for authentication or route errors.

