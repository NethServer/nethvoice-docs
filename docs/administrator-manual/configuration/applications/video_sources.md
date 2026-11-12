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
3. **The device sends H.264 video**, if possible (see [Types of source](#source-types)).
4. **The intercom is an extension of NethVoice**, if users must see its video when it calls them or open doors with DTMF codes: create it in the Users section first, as any other extension.

## Creating a video source {#creating-video-source}

Open **Applications** > **Video sources** in the wizard and click **Create new source**. Fill in the form:

- **Name**: the name of the source, as users see it in NethVoice CTI. It must contain at least a letter or a digit and it must be different from the names of the other sources (names that differ only in case or symbols are considered the same).
- **Extension**: the extension of the intercom, if any. When this extension calls a user who can see the source, NethVoice CTI and NethLink show its video in the call preview. The extension is also the destination of the DTMF codes of the [doors](#gates). Leave it empty for a camera that does not make calls.
- **URL**: the address of the stream or of the snapshot, for example `rtsp://192.0.2.10:554/stream1` or `https://192.0.2.10/cgi-bin/snapshot.jpg`. Use `rtsp://` or `rtsps://` for a video stream, `http://` or `https://` for a JPEG snapshot. For a video stream, the form reminds you to forward the RTSP port of the device and shows the public IP address of the PBX to be allowed.
- **Username** and **Password**: the credentials of the device, if it requires them. The **Password** field is enabled after typing the **Username**. If you paste a URL that contains the credentials (`rtsp://user:password@host/...`), they are moved to these fields when the source is saved.
- **Gates**: the doors and gates that users can open from this source. See [Doors and gates](#gates).
- **Skip TLS certificate verification**: shown only when the source URL or a URL gate uses TLS (`rtsps://` or `https://`). See [TLS certificates](#tls-certificates).
- **Profile**: the CTI profiles whose users can see the source and open its doors. Select at least one profile. See [Permissions](#permissions).

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
- type the **Username** and the **Password** if the device requires them (HTTP Basic or Digest authentication);
- the device must be reachable from the PBX, like the source itself;
- URL gates can be opened at any time, with or without a call.

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
| *Connection error* | Any other error: the details are shown below the message. |

### Certificate not pinned or certificate changed {#certificate-problems}

- **Certificate not pinned**: the source skips the TLS verification and was saved by an older version of NethVoice. Open it with **Modify**, click **Check** and **Save**.
- *The device certificate changed: the PBX refuses the device until the source is saved again*: the device presents a certificate different from the pinned one. Make sure that the device has not been replaced by somebody else, then open the source with **Modify**, type the password again, click **Check** and **Save**.

### The video does not start {#video-not-starting}

If the connection check succeeds but users do not see the video:

- *Your browser cannot play the video format of this source*: the device sends H.265 or another codec the browser cannot play. Configure the device to send H.264.
- *The video source is not reachable, retrying...*: the PBX cannot read the stream from the device, or the client cannot reach the video gateway. Open the list of sources in the wizard: if the check of the source fails, fix the connection to the device; if it succeeds, see the last item.
- *You are not allowed to watch this source*: the source is not enabled in the profile of the user (see [Permissions](#permissions)).
- *Too many open videos: close one to watch this*: the user reached the [limits](#limits). Close other videos, for example in another browser tab or on another computer.
- The video keeps loading, then shows *The video source is not reachable, retrying...*, while the check of the source succeeds: the client probably cannot reach the video gateway ICE ports. Check that both ports are allowed by every firewall between the clients and the PBX, and forwarded if the PBX is behind NAT (see [Network requirements](#network-requirements)).

### A door does not open {#door-not-opening}

- *Answer the call to open*: DTMF doors can be opened only after answering the call of the intercom.
- *The device is not reachable* (*The device is unreachable* in the Phone Island) or *The device did not respond in time*: the PBX cannot reach the device of a URL gate. Check the URL, the port-forward and the firewall.
- *The device responded with an error* (*Unable to open the door* in the Phone Island): the device answered the request of a URL gate with an error status. Check the URL, the method and the credentials of the gate.
- *Sending the opening code failed*: the PBX could not send the DTMF code to the intercom extension. Without a call in progress, the PBX calls the intercom first: check that the intercom extension is registered and answers incoming calls automatically.
- *Command sent* is shown but the door stays closed: check the DTMF code, or the URL and the method, against the manual of the intercom.

## Security notes {#security-notes}

- Allow the RTSP and HTTP(S) ports of the devices only from the public IP address of the PBX: never expose them to the whole Internet.
- When the device allows it, read the stream with a dedicated user that has only the rights needed to watch the video.
- Enable **Skip TLS certificate verification** only for devices with a self-signed certificate, after checking that the address really belongs to your device: the certificate presented when the source is saved is trusted from then on.
