---
title: Video sources
sidebar_position: 4
---

# Video sources

Video sources are the door intercoms and IP cameras connected to NethVoice. With them you can:

- watch the cameras and intercoms in the **Video sources** page of NethVoice CTI;
- see who is at the door when an intercom calls you, before answering and during the call;
- open doors with the **Open** buttons.

You see only the video sources that the administrator has enabled for your profile. If you do not see a source you need, ask your administrator. Administrators configure the sources as described in [Video sources](../../administrator-manual/configuration/applications/video_sources.md).

## Video sources page {#video-sources-page}

Open **Applications** in NethVoice CTI and click **Go to Video sources**. The page shows a card for each source you can see:

- intercoms and cameras that send a video stream show the **live video**. The video plays while the card is visible on screen and stops when you scroll it away or switch to another browser tab;
- other sources show a **picture** of the camera, refreshed about every second.

Use **Filter sources** to search a source by name, and the sort button to order the sources alphabetically.

Move the mouse over a card to show its buttons:

- **Call** (handset icon): calls the intercom from your phone. Shown only when the source has an extension;
- **Take a screenshot** (camera icon): saves the current picture as a JPEG file;
- **Open door** (lock icon): opens a door. Shown only when the source has doors. See [Opening a door](#opening-a-door);
- **Expand** / **Collapse**: shows the source in a larger window, with the same buttons. Press `Esc` or click outside the window to close it.

If the source also sends audio, a speaker button appears on the video: the audio is muted by default, click **Unmute** to listen.

## Calls from an intercom {#intercom-calls}

When an intercom bound to a video source calls you, the Phone Island shows its video in the call preview, so you can see who is at the door **before answering**. The video stays visible after you answer, together with the call buttons (mute, hang up, screenshot) and the door buttons. The same happens when you call the intercom. In the Phone Island the video has no sound: you hear the intercom through the call.

The video appears only for the sources enabled for your profile: calls from other intercoms look like normal calls.

The preview works in NethVoice CTI and in [NethLink](../nethlink/usage.md#receiving-a-call), which shows the same Phone Island.

## Opening a door {#opening-a-door}

Each source can have one or more doors. The lock button opens them:

- with a single door, the button opens it directly. Its tooltip tells which one, for example **Open Main entrance**;
- with several doors, the button shows the list of doors (**Choose what to open**): click the one to open.

After you press it, **Command sent** is shown: the command reached the intercom, but NethVoice cannot know whether the door has really opened. Look at the video to check it.

Some doors are opened by sending a code into the call with the intercom. For these doors:

- when the intercom is calling you, answer the call first: until then the Phone Island shows these doors as disabled, with the hint **Answer the call to open**;
- when there is no call with the intercom, pressing the button makes the PBX call the intercom and send the code when the intercom answers. If the intercom does not answer, the door is not opened and an error is shown (it can take up to about 30 seconds).

Other doors are opened directly by the PBX and work at any time, even without a call.

## Messages {#messages}

| Message | Meaning |
|---------|---------|
| *Video feed not available* | The video cannot be shown. A second line, if present, tells why. |
| *The video source is not reachable, retrying...* | The intercom or camera does not answer: NethVoice keeps trying. If it lasts, contact your administrator. |
| *Your browser cannot play the video format of this source* | The camera sends a video format your browser does not support (for example H.265). Try another browser or ask your administrator. |
| *You are not allowed to watch this source* | The source is no longer enabled for your profile. |
| *Too many open videos: close one to watch this* | You are watching too many videos at the same time, for example in other browser tabs or on other computers: you can watch the same source at most 3 times and 30 videos in total. Close some of them. |
| *Answer the call to open* | The door is opened with a code sent into the call: answer the intercom first. |
| *The device certificate has changed: contact the administrator* | For security reasons NethVoice no longer trusts the intercom: the administrator must check it. |

The Phone Island shows the same messages with slightly different words, for example *The browser cannot play the video format of this source* or *Unable to open the door*.

## NethVoice mobile app {#mobile-app}

The NethVoice mobile app has no Video sources page and does not show the video of the video sources. Calls from an intercom arrive in the app like any other call. To open the door, type the opening code on the in-call keypad: ask your administrator for the code. Doors opened by the PBX without a code cannot be opened from the app.

See also [NethVoice Mobile App](../mobile_app.md#door-intercoms).
