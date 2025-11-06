---
title: Trunks without registration
sidebar_position: 6
---

This procedure is only necessary if an unregistered VoIP trunk (e.g., an IP-based trunk without SIP registration credentials).

The goal is to route calls with a specific root (prefix) directly to a NethVoice instance (the internal PBX) **without passing them through the NethVoice Proxy SIP/RTP engine (Kamalio/RTP Engine).**

### 1. Prerequisites {#1-prerequisites}

* The **NethVoice Proxy** module must be installed and configured.
* At least one **NethVoice** instance (e.g., `nethvoice1`) must be installed and configured.
* The VoIP trunk must be configured within the target NethVoice instance (e.g., `nethvoice1`) as a **Peer/Host Trunk** or similar, and it must be an "unregistered" type.

### 2. Accessing Trunk Routing Rules {#2-accessing-trunk-routing-rules}

1.  Access the NethServer 8 administration interface.
2.  In the left navigation panel, select your **NethVoice Proxy** instance (in the example: `nethvoice-proxy1`).
3.  Navigate to the **Trunk routing rules** section.
    * *Note: If you see "No NethVoice application available", you must first install and configure at least one NethVoice instance.*

### 3. Creating the Routing Rule {#3-creating-the-routing-rule}

This rule instructs the NethVoice Proxy to handle calls for a specific prefix and route the traffic directly to the chosen NethVoice instance.

1.  Click the **Add rule** button.
2.  The **Add rule** dialog will appear.
3.  Configure the rule:
    * **Root:** Enter a **unique prefix** that will act as the trigger for this routing rule.
        * **Important:** Choose a numerical string that is **not** part of your internal numbering scheme or standard external prefixes (e.g., `456`, as shown in the example). This prefix will be intercepted by the proxy and routed.
    * **Destination application:** Select the NethVoice instance that contains the VoIP trunk you want to route (e.g., `nethvoice1 [10.5.4.1]`).
4.  Click **Save**.

### 4. Verification and PBX Configuration {#4-verification-and-pbx-configuration}

1.  Once saved, the rule will appear in the **Trunk routing rules** list, and a "Completed" notification will show.
2.  The final and crucial step is to configure your NethVoice instance's PBX (FreePBX/Asterisk) to handle calls using this route prefix:

    * **For Outgoing Calls:** Configure an **Outbound Route** in your NethVoice PBX. The Dial Pattern should include the configured **Root** prefix (e.g., `456`). This route should be directed to the specific unregistered trunk.
        * The PBX should then strip the `456` prefix before sending the number out to the trunk/provider.
    * **For Incoming Calls (from the unregistered trunk):** The provider/gateway sending the call to the NethVoice Proxy must prepend the configured **Root** prefix (`456`) to the destination number (DID). The PBX, upon receiving the call on the unregistered trunk, can then use an **Inbound Route** matching that prefix to direct the call internally.

### How the Route Works {#how-the-route-works}

When a call (outgoing from the PBX or incoming from a gateway/provider) is processed by the NethVoice Proxy, the proxy checks the initial part of the dialing string (the **Root**).

If the call matches the configured prefix (e.g., `456`), the proxy routes the call **directly** to the specified NethVoice PBX system (`nethvoice1`), bypassing its internal SIP and RTP handling (Kamalio/RTP Engine). This ensures that the VoIP traffic from the specific unregistered trunk/gateway, which may have compatibility issues with the proxy, is handled directly by the PBX.
