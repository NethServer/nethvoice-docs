---
title: Other features
sidebar_position: 3
---

# Other Features

## Presence and Main Device Management {#presence-and-main-device-management}

Click on your NethVoice CTI Avatar to manage your presence status and select your main telephone device.

### Presence Status {#presence-status}

Communicate your telephone status to your colleagues to let them know if you are available or unavailable to receive calls:

![Presence](/img/nethcti/Presence.png)

Your status color will change accordingly:
* **Available (Green)**: You are available to receive calls.
* **Available with Forwarding (Green with Forward Arrow)**: You are available, but calls are being forwarded.
* **Available with Voicemail (Green with Voicemail Icon)**: You are available, but calls go directly to voicemail.
* **Busy (Red)**: You are currently on a call or unavailable.
* **Do Not Disturb (Black)**: You do not want to receive calls.

### Main Device {#main-device}

If you have multiple phones available, you can select which one to use for making calls:

![Main Device](/img/nethcti/Dispositivo_Principale.png)

This allows you to seamlessly switch between different devices.

## Speed Dial and Recent Calls {#speed-dial-and-recent-calls}

### Speed Dial {#speed-dial}

Add contacts to your speed dial menu for quick access:

![Speed Dial](/img/nethcti/Chiamata_Rapida.png)

Simply click on a speed dial entry to call that contact instantly.

### Recent Calls {#recent-calls}

View your recent incoming and outgoing calls:

![Recent Calls](/img/nethcti/Ultime_Chiamate_Destra.png)

You can quickly redial or check call history from this list.

### Voicemail {#voicemail}

You can access all voicemails left for your extension: 

![Voicemail](/img/nethcti/Casella_Vocale.png)

Each voicemail can be played, downloaded, called back, or deleted.

## Operator Panel {#operator-panel}

View the real-time status of your colleagues:

![Operator Panel](/img/nethcti/Pannello_Operatore.png)

From here you can:
- Call your colleagues
- Check their availability
- Filter and organize the display
- See presence information

## Queues Management {#queues-management}

If you use call queues, you can manage them from here:

![Queues](/img/nethcti/Code.png)

### Queue Operations {#queue-operations}

Monitor incoming calls and calls being handled by colleagues:

![Queue Management](/img/nethcti/Code.png)

**Queue Controls:**
- **Join/Leave Queue**: Enter or exit a specific queue with the "Join/Leave" button
- **Pause**: Temporarily avoid receiving calls with the "Pause" button
- **Manage All Queues**: Use a single button to manage all queues simultaneously

![Queue Access](/img/nethcti/Code_accesso.png)

### Missed Calls {#missed-calls}

Verify if you missed any calls and call back your clients:

![Missed Calls](/img/nethcti/Code_Chiamate.png)

### Statistics {#statistics}

Monitor your call statistics within queues:

![Queue Statistics](/img/nethcti/Code_Statistiche.png)

## Address Book {#address-book}

### Viewing Contacts {#viewing-contacts}

View your NethVoice CTI address book:

![Address Book](/img/nethcti/Rubrica_Sinistra.png)

Search for contacts quickly and efficiently.

### Creating Contacts {#creating-contacts}

Add new contacts using the "Create Contact" function (subject to specific permissions):

![Create Contact](/img/nethcti/crea_contatto.png)

You can add:
- Contact name
- Phone numbers
- Email addresses
- Organization
- Notes

## Call History {#call-history}

Use convenient filters to search for calls from your extension, group, or entire phone system (subject to specific permissions):

![Call History](/img/nethcti/Storico_Chiamate.png)

**Available Filters:**
- Date range
- Call type (incoming/outgoing/missed)
- Contact name
- Duration
- Call status
- Content type, including summary, transcription, and voicemail when available

When AI call insights are enabled by the administrator, History can also show post-call transcription and summary results.
From the call actions menu you can open the available content directly from the selected call.

## Queue Manager {#queue-manager}

Administer configured queues on the phone system (subject to specific permissions):

![Queue Manager](/img/nethcti/Gestore_Code.png)

### Dashboard {#dashboard}

View a summary of all configured queues on the system:

![Queue Manager Dashboard](/img/nethcti/Gestore_Code.png)

See graphs and statistics for all queues.

### Queue Management {#queue-management}

For each queue, view details of managed calls and control agent behavior:

![Queue Management Detail](/img/nethcti/Gestore_Code_Gestione_Code.png)

### Unhandled Clients {#unhandled-clients}

Quickly verify if all calls have been answered:

![Unhandled Clients](/img/nethcti/Gestore_Code_Clienti_non_gestiti.png)

### Real-time Summary {#real-time-summary}

Real-time overview of queue situations:

![Real-time](/img/nethcti/Gestore_Code_In_tempo_Reale.png)

Filter individual queues or operators to verify the day's performance.

### Statistics {#statistics-1}

Summary graphs of queue situations:

![Statistics](/img/nethcti/Gestore_Code_Statistiche.png)

### Monitor {#monitor}

Display the list of queued calls on a monitor:

![Monitor](/img/nethcti/Gestore_Monitor.png)

## Applications {#applications}

![Applications](/img/nethcti/Applicazioni.png)

### Phone Lines and Announcements {#phone-lines-and-announcements}

Find and manage the phone lines of your PBX (subject to specific permissions):

![Phone Lines](/img/nethcti/Linee_telefoniche_e_annunci_gestione_linee.png)

#### Line Details {#line-details}

Click on your phone line to check closures and settings:

![Line Details](/img/nethcti/Dettagli_linea.png)

You can control:
- **When to activate closure**: Manually activate, select specific days, or set automatic start/end periods
- **Play announcement**: Have an announcement played
- **Announcement + Voicemail**: Play announcement and leave voicemail option
- **Forward call**: Forward calls to another number

#### Announcements {#announcements}

Use the Announcements menu to upload or record new announcements. You can also listen to or delete existing announcements (subject to specific permissions):

![Announcements](/img/nethcti/Linee_telefoniche_e_annunci_annunci.png)

### Video Sources {#video-sources}

Advanced video intercom management. Manage and control your video intercoms (subject to specific permissions).

### PBX Report {#pbx-report}

Access [Advanced Reporting](https://docs.nethvoice.it/it/latest/pbxreport_manual.html) for your phone system (subject to specific permissions).

## Voice Transcription and Call Summary {#voice-transcription}

NethVoice can provide two related AI-assisted call features:

- **Live transcription**: text generated while a call is in progress and shown in Phone Island.
- **Post-call content**: transcription and, when enabled, an AI-generated summary available after the call from **History > Calls**.

### Requirements {#transcription-requirements}

Two separate things are required: a per-user permission to **view** the content, and the features **enabled on the system** by an administrator.

- **Permission to view (per user)**: your user profile must include the **Speech-To-Text** permission. It lets you open live transcription during a call and view post-call transcriptions and summaries from History. Without it the transcription and summary controls are not available, even when the feature is enabled on the system.
- **Enabling transcription and summaries (administrator, NethVoice Integrations page)**: an administrator turns the features on from the NethVoice **Integrations** page. Call transcription requires a valid Deepgram API key; AI-generated summaries additionally require an OpenAI API key with the call summary option enabled.

Generated content is available only for calls with usable audio: very short, silent, or failed calls may not produce a transcript or summary.

AI-generated text can contain mistakes. Review important content before copying, sharing, or saving it.

### Supported calls and limitations {#supported-calls}

All calls are supported for transcription and summary; the only exception is **multi-party conferences**, which are not transcribed or summarized.

:::warning Transferred calls are in beta
Transcription and summary for **transferred calls** are still in beta and may not always work reliably. Your privacy is always preserved: you only see the transcriptions and summaries of conversations you took part in, never those of other users.
:::

### Live transcription during calls {#live-transcription-during-calls}

During an active call:

1. Open the Phone Island side actions.
2. Select **Open transcription** when the action is available.
3. The live transcription panel opens and starts receiving text for the current call.
4. Interim text may change until final segments are confirmed.
5. Close the transcription panel to stop live transcription for that call.

Live transcription is for the active call only. Completed-call content is reviewed later from History.

### Post-call transcription and summary {#after-the-call}

After a supported answered call ends, NethVoice processes the available call audio. Processing can take some time, depending on call length and service availability.

When processing is complete, the call can expose:

- **Transcription**: the full post-call transcript, shown read-only.
- **Summary**: an AI-generated summary. The summary can be edited and saved from the drawer.

To review generated content:

1. Open **History > Calls**.
2. Use the content filter when needed: **Summary**, **Transcription**, or **Voicemail**.
3. Open the call actions menu.
4. Select **View summary** when a summary is available, or **View transcription** when only the transcript is available.

When a summary is available, the summary drawer also lets you expand and review the full transcription.

### Summary notifications {#summary-notifications}

When call summary is enabled for your user, CTI can notify you when a summary becomes ready.

From **Settings > Notifications** you can enable or disable **Call summary notifications**. The preference is shared between the web phone and NethLink.

CTI shows an in-app notification when a summary is ready. If browser notifications are allowed and the CTI page is not focused, CTI can also show a system notification. Opening the notification or the in-app action opens the related summary drawer.

## Settings {#settings}

Customize your NethVoice CTI by accessing Settings:

![Settings](/img/nethcti/Impostazioni.png)

### Available Settings {#available-settings}

- **Devices**: Control your phones and their status
- **Mobile App**: Generate QR code to connect your [smartphone](https://docs.nethvoice.it/it/latest/app_manual.html) (subject to specific permissions)
- **Incoming calls**: Control how your application behaves when receiving external calls. This includes choosing your ringtone, selecting where the sound plays, and configuring optional automatic URL actions triggered by incoming calls.
- **Notifications**: Configure notifications for AI-generated call summaries when the feature is enabled for your user.
- **Customer Card**: Configure how the customer card behaves (subject to specific permissions)
- **Queues**: Decide how to automate your queue access (subject to specific permissions)
- **Profile Picture**: Modify your avatar
- **Theme**: Choose light or dark theme based on your preferences
- **Integrations**: Integrate your Phone Island with external tools
- **Cache**: Clearing browser cache can help resolve some page loading issues

#### Incoming calls {#incoming-calls}
The Incoming Calls settings allow you to configure how the system handles external calls, including ringtone behavior, audio output, and automated URL actions:

1. Ringtone Settings: Choose the sound that plays when an incoming call is received.
2. Ringtone Output Device: Select which audio device will play the ringtone.
3. Parameterized URL: You can configure the system to automatically open a URL whenever an external call comes in. This is useful for CRM lookups, customer information pages, or internal tools.
4. URL Opened on External Incoming Call: The URL is configured by system administrator.
5. Pop-Up Permissions: Your browser must allow pop-ups for this feature to work.
6. URL Opening Trigger: Choose when the configured URL should be opened.


## Supported Browsers {#supported-browsers}

Currently supported browsers are:
- Google Chrome - Version 121.0.6167.189 and later
- Mozilla Firefox - Version 123.0 and later
- Microsoft Edge - Version 122.0.2365.59 and later
