---
title: Video sources
sidebar_position: 4
---

# Video sources

The *Video sources* section connects door intercoms and IP cameras to NethVoice. Users of NethVoice CTI with the right permissions can:

- watch the sources in the **Video sources** page of NethVoice CTI;
- see the video of an intercom in the call preview when the intercom calls them, before answering and during the call, both in NethVoice CTI and in NethLink;
- open doors and gates connected to the intercom with the **Open** buttons.

See [Video sources](../../../user-manual/nethcti/video_sources.md) in the user manual for what users see.

## Types of source {#source-types}

The scheme of the URL sets the type of the source:

| URL | Type shown in the wizard | What users see |
|-----|--------------------------|----------------|
| `rtsp://` or `rtsps://` | **Video stream (RTSP)** | Live video (and audio, if the device sends it), played through the video gateway built into NethVoice |
| `http://` or `https://` | **Image (HTTP)** | A JPEG snapshot of the device, refreshed about every second |

For video streams:

- the device should send **H.264** video, which plays in every supported browser. **H.265** (HEVC) video plays only in some browsers: configure the device to send H.264 when possible;
- the PBX reads the stream from the device only while at least one user is watching it;
- the PBX always reads the stream over **TCP**;
- the video reaches the users through WebRTC: browsers and NethLink must be able to reach the video gateway ports of the NethVoice instance (see [Network requirements](#network-requirements)).

For images, the URL must return a JPEG or PNG picture (at most 5 MB). Most intercoms and cameras have a "snapshot" URL for this purpose.

## Requirements {#requirements}

Before creating a video stream source, check that:

1. **The PBX can reach the device.** The PBX connects to the device, not the other way round. If the device is in a customer LAN and the PBX is somewhere else (for example in the cloud), forward the RTSP port of the device (usually `554`) on the router of the site and allow it only from the public IP address of the PBX, or connect the PBX and the site with a VPN. NethVoice does not provide a relay to be installed at the customer site.
2. **The users can reach the video gateway.** See [Network requirements](#network-requirements).
3. **The device sends H.264 video**, if possible (see [Types of source](#source-types)), with the [recommended stream settings](#stream-settings).
4. **The intercom is an extension of NethVoice**, if users must see its video when it calls them or open doors with DTMF codes: create it in the Users section first, as any other extension.

### Recommended stream settings {#stream-settings}

Configure the stream of door intercoms and cameras with these settings:

- **Codec**: H.264, Baseline or Main profile, without B-frames;
- **Stream**: the main stream, if the device keeps its keyframes small at the settings below; otherwise the secondary stream (sub stream), which is also the choice for slow connections;
- **Resolution**: VGA (640x480), up to 720p at most;
- **Bitrate**: about 0.5–1 Mbit/s;
- **Keyframe (I-frame) interval**: 1–2 seconds.

The browser can start showing the video only from a complete keyframe: large or rare keyframes make the video start slowly and with a delay.

:::note Fanvil i-series door phones
Tested on a Fanvil i62 with firmware 2.12.51:

- the stream paths are `/h264/stream.live0` for the main stream and `/h264/stream.live1` for the sub stream;
- use the IP address of the device in the URL, not a host name: with a host name this firmware answers `400 Bad Request` to the connection check, even with the right credentials;
- at 720p with the factory bitrate (3 Mbit/s) the firmware truncates the keyframes larger than about 100 KB, so the video starts only after a long wait and with a delay. The NethVoice provisioning lowers the main stream to 1 Mbit/s with a keyframe every second: with these settings the main stream starts immediately and looks better than the sub stream. Without provisioning, lower the bitrate of the main stream, or use the sub stream;
- the sub stream can take a few seconds to start the first time it is opened.
:::

## Creating a video source {#creating-video-source}

Open **Applications** > **Video sources** in the wizard and click **Create new source**, or **Create from a door phone** for a door phone provisioned by NethVoice (see [Creating a source from a door phone](#door-phone)). Fill in the form:

- **Name**: the name of the source, as users see it in NethVoice CTI. It must contain at least a letter or a digit and it must be different from the names of the other sources (names that differ only in case or symbols are considered the same).
- **Extension**: the extension of the intercom, if any. When this extension calls a user who can see the source, NethVoice CTI and NethLink show its video in the call preview. The extension is also the destination of the DTMF codes of the [doors](#gates). Leave it empty for a camera that does not make calls.
- **Device type**: *Other*, or a device whose streams NethVoice knows (*Fanvil i-series*): with a known device the form fills the port and the path of the stream, keeps the address you typed and shows the **Video quality** choice.
- **URL**: the address of the stream or of the snapshot, for example `rtsp://192.0.2.10:554/stream1` or `https://192.0.2.10/cgi-bin/snapshot.jpg`. Use `rtsp://` or `rtsps://` for a video stream, `http://` or `https://` for a JPEG snapshot. For a video stream, the form reminds you to forward the RTSP port of the device and shows the public IP address of the PBX to be allowed. When you type the URL, the form checks whether the PBX can open a connection to the address and port of the device (only a TCP connection, nothing is sent to the device; default ports `554` for `rtsp://`, `322` for `rtsps://`, `80` for `http://` and `443` for `https://`). The check is never made towards the addresses of the NethVoice node or of the cluster VPN: in that case, and after many checks in a short time, the form shows no result. When the PBX cannot reach the device, for example because the PBX is in the cloud and the address belongs to the LAN of the site, a warning explains what to do: forward the port of the device on its router, allow it only from the public IP address of the PBX, and type the public address of the device in the URL. When several devices of the same site share one public address, forward a different public port to each of them (for example `1554`, `2554` and `3554`, all forwarded to port `554` of each device) and type that port in the URL: `rtsp://203.0.113.7:2554/stream1`. You can save the source anyway, for example to prepare it before the port-forward is ready.
- **Username** and **Password**: the credentials of the device, if it requires them. The **Password** field is enabled after typing the **Username**. If you paste a URL that contains the credentials (`rtsp://user:password@host/...`), they are moved to these fields when the source is saved. With credentials and an `http://` or `rtsp://` URL the form warns that they travel in clear text, together with the video for `rtsp://` (see [Security notes](#security-notes)).
- **Gates**: the doors and gates that users can open from this source. See [Doors and gates](#gates).
- **Skip TLS certificate verification**: shown only when the source URL or a URL gate uses TLS (`rtsps://` or `https://`). See [TLS certificates](#tls-certificates).
- **Profile**: the CTI profiles whose users can see the source and open its doors. For a new source the form proposes the profile of the user of the selected **Extension**, or the *Base* profile without an extension, and follows the extension until you change the profile yourself; modifying a source keeps its profiles. Select at least one profile. See [Permissions](#permissions).

### Connection check {#connection}

Click **Check** next to **Connection**. The PBX contacts the device with the URL and the credentials of the form and shows:

- the result: a green mark, or the reason of the failure (see [Check errors](#check-errors));
- for video streams, the codecs under **Video**, for example `H264 1920x1080, PCM_ALAW 8000 Hz`;
- a frame of the video, or the snapshot, under **Preview**;
- for TLS devices with **Skip TLS certificate verification** enabled, the SHA-256 fingerprint of the certificate under **Device certificate**.

A warning is shown when the video is H.265 or uses a codec that browsers cannot play.

The **Save** button is enabled only after a successful check: when you change the URL or the credentials, click **Check** again.

### Saving the source {#saving-video-source}

Click **Save**. The source appears as a card in the list of sources, with its type (**Video stream (RTSP)** or **Image (HTTP)**) and the result of a connection check, made again every time the page is opened. Click **Info** on the card to see the details: extension, URL, username, gates, codecs and preview.

Use **Modify** to change a source and **Delete** to remove it. When a source is deleted, its permission is removed from all profiles and the users who are watching it are disconnected.

When you modify a source, the password fields show *Unchanged*: leave them empty to keep the stored password. If you change the address or the port of the device, type the password again: NethVoice never sends a stored password to a different device.

## Creating a source from a door phone {#door-phone}

For the door phones that NethVoice configures through provisioning (see [Supported phones](../../provisioning/supported_phones.md#fanvil)), the wizard fills the form of the source for you.

1. When you install the door phone, add it to the device inventory with its MAC address, choose its model (for example *Fanvil i62*) and assign it to an extension, as you do for a phone. The door phone downloads its configuration from the PBX through RPS, or through the provisioning URL typed on its web interface: the URL with the secret, shown by **Info** in **Devices** > **Phones** (see [Phone provisioning](../../provisioning/phone_provisioning.md)). The address without the secret, for example the one given by DHCP option 66, gives a door phone only a configuration without secrets and without the provisioning URL: it does not work for door phones. Add the door phone to the inventory only when you are installing it (see [Security notes](#security-notes)).
2. Open **Applications** > **Video sources** and click **Create from a door phone**. The list shows the provisioned door phones assigned to an extension, with their IP address when they are registered and the sources that already use them.
3. Click **Use** next to the door phone. The form of a new source opens with:
   - **Name**: the name of the extension;
   - **Extension**: the extension of the door phone;
   - **URL**: the main stream of the device, for example `rtsp://192.0.2.10:554/h264/stream.live0` for the Fanvil i6x, with the address of the door phone;
   - **Video quality**: *High (main stream)*, the default, or *Standard (sub stream, for slow connections)*, for door phones with two streams. The choice changes only the path of the URL; a path typed by hand shows *Custom path*;
   - **Profile**: the profile of the user of the door phone extension;
   - one DTMF gate for each relay of the door phone: *Door 1* with the code of relay 1 (`*` by default) and, for door phones with two relays, *Door 2* with the code of relay 2 (`#` by default). See [Doors and gates](#gates).
4. Change what you need, select the profiles, click **Check** and **Save**.

**Call buttons and relays.** The call buttons and the relays of the door phone are set in the phone settings, like the keys of a phone: open **Users**, the user of the door phone, click the pencil next to the model of the device in its linked devices.

- **Line keys**: one key for each call button of the door phone (five on the i63, one on the other models). The only type is **Speed Dial**: type the number that the button calls, for example the extension of the reception or a ring group. A key without a number is not written, so the door phone keeps the button set on its web interface.
- **Relays**: for each relay, **Relay 1: DTMF code to open** and **Relay 1: open time (seconds)**, and the same for relay 2 on the door phones with two relays (the i60 has one). A code has 1 to 16 characters among `0-9`, `A-D`, `*` and `#`; the open time is from 1 to 600 seconds: the settings cannot be saved with other values. The default codes are `*` for relay 1 and `#` for relay 2. The door phone opens the relay when it receives its code during a call; the gates of the sources created from the door phone send these codes.

Only the administrator configures door phones: they are not listed in the devices of the user in NethVoice CTI, so the user of the door phone extension cannot change its keys.

**Credentials.** The first time a door phone is used, the PBX generates a random RTSP password for it, adds it to the provisioning configuration of the device and asks the door phone to download its configuration again. This password protects only the video stream (RTSP) of the door phone: the web interface of the door phone gets the [admin password of the phones](../../provisioning/phone_provisioning.md#admin-password), with the user `admin`. The password is never shown in the video sources and the form has no username and password fields for a source linked to a door phone, also when you modify it, as long as the URL points to the door phone: the PBX sends the stored password only to the address the door phone registers from, or to the public address offered by **Use public address**. If the door phone is not registered, or you type another address (for example a host name or a port-forward on another public address), the form shows **Username** and **Password** and the check asks for the password: type the RTSP password of the door phone. A source saved with a typed password is no longer linked to the door phone and does not follow its password changes. To read or change the password, open **Users**, the user of the door phone, click the pencil next to the model of the device in its linked devices and open **Preferences**: the field is **RTSP password (video stream)**, with the eye button to show it. When you save it there, the door phone gets the new password with its next provisioning and the sources created from it take the new password. To give a door phone video other credentials, create the source with **Create new source** instead. The form says when the password has just been generated: if the check fails, wait a minute so that the door phone applies the new configuration, or restart the door phone. Later, the same door phone keeps the same password.

**Address.** The IP address comes from the SIP registration of the door phone, so it is the address of the device in its own network: the form checks whether the PBX reaches it, like for any source (see [Creating a video source](#creating-video-source)). If the door phone registers from a public address that the PBX reaches on the same port, the warning also offers **Use public address**. If the door phone is not registered, the URL is empty: type it, together with the RTSP password of the door phone.

Sources created this way are normal sources: **Modify** and **Delete** work as for any other source. **Create new source** still works for every other device.

:::note Fanvil i6x door phones
The provisioning of the Fanvil i60/i60K, i61, i62, i63 and i64 changes only these settings of the door phone: the SIP account (with RFC 2833 DTMF), time zone and time server, the provisioning server, the camera streams, the RTSP server (enabled, with authentication and the RTSP password generated by the PBX, see above), the call buttons with a number (speed dial), the relays with a DTMF code (opened by DTMF, with their code and open time) and the password of the web user `admin`, which is the admin password of the phones. Everything else keeps the values set on the web interface of the door phone. In particular, configure on the door phone:

- the access rules and the door-open passwords (**EGS Setting**), and the outputs that the provisioning does not write;
- the camera streams (**Intercom settings** > **Camera Settings**), following the [recommended stream settings](#stream-settings): the provisioning lowers the bitrate of the main stream to 1 Mbit/s and sets a keyframe every second on both streams, so the wizard proposes the main stream, `/h264/stream.live0`, and offers the sub stream, `/h264/stream.live1`, as *Standard* quality.
:::

## Doors and gates {#gates}

Every source can have up to 10 gates (door openers). Click **Add gate** to add one. Each gate has:

- a name, shown to users in the list of doors and in the tooltip **Open** *name* (for example **Open Door 1**). New gates are named *Door 1*, *Door 2* and so on: give them meaningful names, like *Main entrance* or *Garage*;
- a type, **DTMF** or **URL**.

Use the arrows to change the order of the gates and the trash icon to remove one.

**DTMF** gates send a DTMF code (up to 30 characters among `0-9`, `A-D`, `*`, `#` and `+`) to the extension of the source:

- the source needs an **Extension**;
- when the intercom is calling a user, the user must answer the call before opening: until then the DTMF doors cannot be opened, because the tones would get lost;
- when there is no call in progress with the intercom, the PBX calls the intercom extension and sends the code when the intercom answers. The intercom must answer automatically: if it is not registered, is busy or does not answer within about 30 seconds, the door is not opened and the user sees *Sending the opening code failed*.

**URL** gates are opened by an HTTP request that the PBX sends to the intercom or to the door controller:

- choose the method, **GET** or **POST**, and type the URL, which must start with `http://` or `https://`, for example `http://192.0.2.10/cgi-bin/open?door=1`;
- type the **Username** and the **Password** if the device requires them (HTTP Basic or Digest authentication, as the device asks). With an `http://` URL the form warns that the username and the password are sent in clear text (see [Security notes](#security-notes));
- the device must be reachable from the PBX, like the source itself;
- URL gates can be opened at any time, with or without a call.

For a source created from a door phone (see [Creating a source from a door phone](#door-phone)), each gate opens one relay of the door phone: the first gate relay 1, the second gate relay 2. A source can have at most one gate per relay (**One gate per relay of the door phone**), so two gates for the Fanvil i61, i62, i63 and i64 and one for the i60.

- A DTMF gate sends the code of its relay, set in the [Relays](#door-phone) section of the phone settings: the code is shown read-only (**Code of the door phone relay** 1, **set in the door phone provisioning**). To change it, change the relay code in the phone settings. A code typed by hand, for a relay without a code, must have the format of the relay codes: 1 to 16 characters among `0-9`, `A-D`, `*` and `#`.
- When you switch a gate to **URL**, the form proposes the URL that opens the relay, `http://<door phone>/cgi-bin/ConfigManApp.com?egs&outputN=OUTN_SOS` (`N` is the relay), with the method **GET** and the username `admin`: type the password of the web interface of the door phone, that is the admin password of the phones, by hand. The URL can be changed.

Prefer DTMF gates for door phones: the code travels inside the call and the gate needs no credentials. A URL gate is useful to open the door without a call.

After a user presses an **Open** button, the user interface shows *Command sent*: the PBX knows only that the command was delivered (for URL gates, that the device answered with a success status), not whether the door really opened.

:::note
Users of the NethVoice mobile app open DTMF doors by typing the code on the in-call keypad. URL gates are not available in the mobile app.
:::

## TLS certificates {#tls-certificates}

The certificates of `rtsps://` and `https://` devices are verified against the certification authorities, as a browser does. Many intercoms and cameras use a self-signed certificate instead: in that case the check fails with *TLS certificate not valid*.

For these devices, enable **Skip TLS certificate verification**. The option applies to everything the PBX contacts for that source: the source URL and its `https://` URL gates. With the option enabled:

- when the source is saved, the PBX reads the certificate that each device presents and **pins** it: from then on it trusts only that certificate. Its SHA-256 fingerprint is shown as **Pinned certificate**, for the source and for each URL gate;
- the source cannot be saved if the certificate of one of its devices cannot be read: check that the device is reachable, or disable the option;
- if a device certificate changes later (renewal, factory reset, replacement of the device), the PBX refuses to connect to the device: the live video stops (users see *The video source is not reachable, retrying...*), the snapshots stop updating and the URL gates answer *The device certificate has changed: contact the administrator*. The card of the source shows *The device certificate changed: modify the source, type the password again and save it*. Make sure that the device is really yours, then open the source with **Modify**, type the password again (the stored password is never sent to a device whose certificate changed: without it the check fails), click **Check**, which shows *The device certificate changed: the PBX refuses the device until the source is saved again*, and **Save** to pin the new certificate.

Sources with **Skip TLS certificate verification** saved by an older version of NethVoice, which did not pin the certificates, are marked **Certificate not pinned** in the list of sources: their devices are contacted without any certificate check. Sources without this option are not affected. Open each of them with **Modify** and save it again to pin the certificates.

## Permissions {#permissions}

Every video source creates a permission named after the source, in the **Streaming** section of the CTI profiles. Users see, and can open the doors of, only the sources enabled in their profile.

- The **Profile** field of the source enables the source in the selected profiles.
- The same permissions are listed in **Profiles**, section **Streaming**, where the general permission of the section must be enabled too: without it the users of the profile do not see any video source. See [Video sources permissions](../wizard.md#video-sources-permissions).
- When a source is removed from a profile, the users of that profile stop seeing it: the videos of that source they are watching are closed when the new configuration is applied.
- Sources created before the update keep their name, and so their permission and the profiles where it is enabled. Their opening code becomes a DTMF gate named *Door 1*, which you can rename.

The credentials of the devices are stored on the PBX and are never sent to NethVoice CTI, NethLink or the browsers: users receive the video through the video gateway, with short-lived, single-use access tokens checked against their permissions.

## Network requirements {#network-requirements}

| From | To | Port | Purpose |
|------|----|------|---------|
| PBX | Device | RTSP port of the device (usually `554`; without a port in the URL, `554` for `rtsp://` and `322` for `rtsps://`), TCP | Video stream |
| PBX | Device | HTTP or HTTPS port of the device | Snapshots, URL gates, certificate pinning |
| Browsers and NethLink | NethVoice CTI host name | `443` TCP | Setup of the video (HTTPS) |
| Browsers and NethLink | NethVoice node | Video gateway ICE ports, one UDP and one TCP | Video (WebRTC) |

The video gateway ICE ports are allocated to each NethVoice instance and opened in the firewall of the node automatically. To find their numbers, open the NethVoice application in the NethServer administration page, go to **Status** and look for **Video gateway ICE (UDP)** and **Video gateway ICE (TCP)** in the **Internal service details** table. If there is a firewall or a NAT in front of the node, allow and forward both ports too: see [Firewall](../firewall.md).

Keep in mind that:

- clients that can reach the PBX only on port `443` (for example behind a strict proxy) cannot play the video streams: there is no fallback over HTTPS;
- the PBX refuses device addresses that point to the PBX itself or to link-local networks: loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`, `fe80::/10`) and unspecified addresses, also when a host name resolves to them. Use the LAN, public or VPN address of the device;
- the PBX does not follow the HTTP redirects of the devices.

## Limits {#limits}

- Up to 10 gates for each source.
- Each user can watch the same source at most 3 times at the same time (for example in NethVoice CTI and in NethLink on two computers) and at most 30 videos in total. Over the limit the user sees *Too many open videos: close one to watch this*.
- Each source can be watched by at most 100 viewers at the same time, all users together.
- Fanvil i6x door phones: at most one gate per relay. After opening a relay the door phone ends the call after a few seconds (seen on the i64), so only one relay can be opened in each call: to open the other relay, call the door phone again.

## Troubleshooting {#troubleshooting}

### Check errors {#check-errors}

| Message | Meaning and what to do |
|---------|------------------------|
| *Wrong username or password* | The device refused the credentials. Check **Username** and **Password**, and that the user is allowed to read the stream on the device. |
| *Connection refused: check the address, the port and the port-forward of the device* | The address answers, but nothing accepts connections on that port. Check the port in the URL and the port-forward on the router of the site. |
| *The device does not answer: check the address and the firewall* | No answer in time. Check the address, the port-forward and that the firewall in front of the device allows the public IP address of the PBX. |
| *Stream not found: check the path in the URL* | The device answered, but the path does not exist. Look for the stream path in the manual of the device. |
| *TLS certificate not valid* | The certificate of the device is not trusted. If the device has a self-signed certificate, enable **Skip TLS certificate verification**. |
| *Unsupported URL or stream* | The URL is not a video stream or an image, or the stream contains no video. |
| *Address not allowed: the PBX itself and link-local addresses cannot be video sources* | The address of the device is refused: see [Network requirements](#network-requirements). |
| *Connection error* | Any other error: the details are shown below the message. If the details show `400 Bad Request` although the credentials are right, use the IP address of the device in the URL instead of the host name (seen on Fanvil i62, see [Recommended stream settings](#stream-settings)). |

### Certificate not pinned or certificate changed {#certificate-problems}

- **Certificate not pinned**: the source skips the TLS verification and was saved by an older version of NethVoice. Open it with **Modify**, click **Check** and **Save**.
- *The device certificate changed: the PBX refuses the device until the source is saved again*: the device presents a certificate different from the pinned one. Make sure that the device has not been replaced by somebody else, then open the source with **Modify**, type the password again, click **Check** and **Save**.

### The video does not start {#video-not-starting}

If the connection check succeeds but users do not see the video:

- *Your browser cannot play the video format of this source*: the device sends H.265 or another codec the browser cannot play. Configure the device to send H.264.
- *The video source is not reachable, retrying...*: the PBX cannot read the stream from the device, or the client cannot reach the video gateway. Open the list of sources in the wizard: if the check of the source fails, fix the connection to the device; if it succeeds, see the last item.
- *You are not allowed to watch this source*: the source is not enabled in the profile of the user (see [Permissions](#permissions)).
- *Too many open videos: close one to watch this*: the user reached the [limits](#limits). Close other videos, for example in another browser tab or on another computer.
- The video keeps loading, then shows *The video source is not reachable, retrying...*, while the check of the source succeeds: the client probably cannot reach the video gateway ICE ports. Check that both ports are allowed by every firewall between the clients and the PBX, and forwarded if the PBX is behind NAT (see [Network requirements](#network-requirements)). If the ports are fine, the device probably sends incomplete or too rare keyframes: lower the resolution or the bitrate, or use the sub stream (see [Recommended stream settings](#stream-settings)).

### A door does not open {#door-not-opening}

- *Answer the call to open*: DTMF doors can be opened only after answering the call of the intercom.
- *The device is not reachable* (*The device is unreachable* in the Phone Island) or *The device did not respond in time*: the PBX cannot reach the device of a URL gate. Check the URL, the port-forward and the firewall.
- *The device responded with an error* (*Unable to open the door* in the Phone Island): the device answered the request of a URL gate with an error status. Check the URL, the method and the credentials of the gate.
- *Sending the opening code failed*: the PBX could not send the DTMF code to the intercom extension. Without a call in progress, the PBX calls the intercom first: check that the intercom extension is registered and answers incoming calls automatically.
- *Command sent* is shown but the door stays closed: check the DTMF code, or the URL and the method, against the manual of the intercom.

## Security notes {#security-notes}

- Allow the RTSP and HTTP(S) ports of the devices only from the public IP address of the PBX: never expose them to the whole Internet.
- When the device allows it, read the stream with a dedicated user that has only the rights needed to watch the video.
- With `rtsp://` and `http://` URLs nothing is encrypted: the credentials of the device, the snapshots and the video travel in clear text between the PBX and the device, and anyone on the network path can read them. Prefer `rtsps://` and `https://` when the device supports them. Otherwise keep the PBX and the devices in the same trusted network, put door phones and cameras on a separate VLAN, or connect them through a VPN. The form warns about these sources when they have credentials.
- Over `http://` the PBX sends a password with HTTP Basic only when the device asks for Basic, and never to a device that has already used Digest: a device that suddenly asks for Basic gets no password.
- URL gates with an `http://` URL send the username and the password in clear text. Use them only when the PBX and the device are in the same trusted network or connected through a VPN; use `https://` when the device supports it.
- The URL gates of the Fanvil i-series door phones use the web user `admin` with the [admin password of the phones](../../provisioning/phone_provisioning.md#admin-password), which is the same for all the phones and door phones of the PBX: whoever reads it can open the door and the web interface of every phone. For door phones prefer DTMF gates, which travel inside the call and need no credentials.
- The DTMF codes that open the doors travel in the audio (RTP) of the call: check that encryption (TLS/SRTP) is enabled for the device of the door phone extension (**Encryption** of the physical device in the user settings, see [Devices](../wizard.md#devices)), otherwise the codes travel in clear text.
- Add a door phone to the device inventory only when you are installing it: until the door phone downloads its configuration for the first time, its first provisioning URL stays valid, and whoever knows it (the URL is also registered on the RPS service of the manufacturer) can download the configuration of the door phone, codes and passwords included. If the installation is postponed, remove the door phone from the inventory and add it again later.
- Enable **Skip TLS certificate verification** only for devices with a self-signed certificate, after checking that the address really belongs to your device: the certificate presented when the source is saved is trusted from then on.
