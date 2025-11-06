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
- **Available (Green)**: Ready to receive calls
- **Busy (Red)**: Currently on a call or unavailable
- **Away (Yellow)**: Away from your desk
- **Do Not Disturb (Gray)**: Do not want to receive calls

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

## Voice Transcription {#voice-transcription}

Voice transcription automatically converts your call audio into text in real-time. This feature is available if your administrator has configured a Deepgram API key in NethVoice.

### Requirements {#transcription-requirements}

- Voice transcription must be enabled and configured in NethVoice by your administrator
- A valid Deepgram API key must be configured in the phone system
- You must have the appropriate permissions to use this feature

### Starting a Transcription {#starting-transcription}

During an active call:

1. Look for the transcription button in the side panel (accessible through the side actions expansion button)
2. Click the **Start Transcription** button
3. The transcription will begin immediately and appear on your screen
4. Audio will be transcribed in real-time as the call progresses

### Stopping a Transcription {#stopping-transcription}

To stop recording the transcription:

1. Click the **Stop Transcription** button (or the close button on the transcription panel)
2. The transcription will be stopped immediately
3. Any previously transcribed text will remain available for review

### Accessing Transcription History

Transcription history is currently not available and will be implemented in future releases.

## Settings {#settings}

Customize your NethVoice CTI by accessing Settings:

![Settings](/img/nethcti/Impostazioni.png)

### Available Settings {#available-settings}

- **Devices**: Control your phones and their status
- **Mobile App**: Generate QR code to connect your [smartphone](https://docs.nethvoice.it/it/latest/app_manual.html) (subject to specific permissions)
- **Customer Card**: Configure how the customer card behaves (subject to specific permissions)
- **Queues**: Decide how to automate your queue access (subject to specific permissions)
- **Profile Picture**: Modify your avatar
- **Theme**: Choose light or dark theme based on your preferences
- **Integrations**: Integrate your Phone Island with external tools
- **Cache**: Clearing browser cache can help resolve some page loading issues

## Supported Browsers {#supported-browsers}

Currently supported browsers are:
- Google Chrome - Version 121.0.6167.189 and later
- Mozilla Firefox - Version 123.0 and later
- Microsoft Edge - Version 122.0.2365.59 and later
