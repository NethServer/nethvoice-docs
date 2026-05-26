---
title: Wizard
sidebar_position: 3
---

The initial configuration wizard facilitates easy installation and setup of all NethVoice components.

The wizard will guide you through the following sections:
- **Extensions**: Configure user extensions.
- **Trunks**: Set up trunk connections.
- **Routes**: Define call routing rules.
- **Devices**: Manage phone devices and provisioning.

At the end of the wizard:
- each section will be accessible from the main menu for further modifications
- a new [Dashboard](./dashboard) page will be available to monitor system status and performance
- a new [Applications](./applications) section will be available to manage CTI features

## Extensions - Users {#extensions}

VoIP (Voice over Internet Protocol) extensions are virtual phone numbers that let people make and receive calls using the network instead of a traditional phone line. Each extension is a unique number inside your NethVoice system — colleagues can call one another by dialing that number. An extension can also receive external calls once the system’s phone lines are configured.

During the initial setup, assign one extension to each user (we recommend starting from 200). Enter the extension number in the field and click Add to link it to the user.

This will list all users available in the user domain associated with the NethVoice instance.
You can manage users (create, update, reset passwords, delete) by accessing the dedicated section through the button **Link to the Portal**, which opens the User Domain Portal in a new tab.

Enter the corresponding extension for each user:

1. Click the extension input for the selected user and enter a numeric extension (recommended starting at 200). Use digits only — no spaces or punctuation.  
2. Click Add to assign the extension to the user.  
3. On success the user row is highlighted and a green checkmark appears.

:::info
Installation without an Enterprise subscription are limited to 8 users.
For more info see [Subscription](/docs/administrator-manual#subscription).
:::

Click the **Next** button to proceed to the Trunks section.

### Import and export users {#import-and-export-users}

The page allows you to import and export users in bulk using CSV files:

- **Import**: Create a plain text CSV file (UTF‑8) with one user per line using this field order:
- **Export**: Download a CSV template containing current users for editing and reimporting.
  The exported file has the same format of the imported one.

Create a plain text CSV file (UTF‑8) with one user per line using this field order:
```
<NICKNAME>,<FULL NAME>,[EXTENSION],[USER PASSWORD],[MOBILE],[VOICEMAIL],[WEBRTC EXTENSION],[CTI GROUPS],[CTI PROFILE]
```

Notes and examples:
- Fields in square brackets are optional.
- Use commas to separate fields. Do not include surrounding quotes unless part of the value.
- Boolean fields accept TRUE or FALSE (case‑insensitive).
- CTI groups are a pipe (|) separated list; groups that do not exist will be created automatically.
- The CTI profile must already exist in the system.

Example:
```
mario,Mario Rossi
paolo,Paolo Bianchi,200
carlo201,Carlo Neri,201,Carlo1@.!
francesco,Francesco Verdi,202,,33312312343,FALSE,TRUE,Sviluppo|Assistenza|Tecnici,Advanced
andrea,Andrea Rossi,203,Andrea1234,,TRUE,TRUE,Commerciali,Standard
```

Import procedure:
1. Click Import and select the CSV file you created.  
2. In the import dialog click Import and wait for the users to be processed.

Behavioral details:
- If EXTENSION is omitted, only the user account is created (no extension assigned).  
- If PASSWORD is omitted, a random password will be generated.  
- When importing to assign extensions to existing users (users already present but without an extension), the PASSWORD field is ignored for those users.  
- Lines starting with `#` are treated as comments and ignored.


:::tip
- Keep the file encoding UTF‑8 and avoid special characters in the nickname field to prevent import issues.
:::

## Trunks {#trunks}

Trunks are the connections that allow your PBX to send and receive calls to and from external networks. They act as the bridge between internal extensions and the public telephone network or cloud telephony providers. Trunks can be implemented as cloud-based VoIP lines or as on‑premise physical connections using gateways to interface with the PSTN.

- VoIP trunks (cloud)
  - Hosted by a service provider and delivered over the Internet using SIP/PJSIP.
  - Pros: quick to provision, highly scalable, lower upfront cost, provider-managed redundancy and features (SIP credentials, codecs, encryption).
  - Cons: depends on internet reliability and bandwidth; may require firewall/NAT and QoS configuration.
  - Best when you prefer flexible, cloud-first deployments and rapid scaling.

- Physical trunks (on‑premise via gateway)
  - Use dedicated hardware gateways to connect the PBX to landline services (FXO/PRI/ISDN).
  - Pros: direct PSTN connectivity, often lower latency and predictable behavior, works without Internet dependency, required in some regulated environments.
  - Cons: higher upfront hardware and maintenance cost, model-specific configuration, limited scalability compared to cloud trunks.
  - Best when local telco connectivity, regulatory constraints, or offline resilience are required.

### Add physical lines {#add-physical-lines}

To add physical lines, you need to configure a supported SIP gateway. See the [Supported Gateways](../provisioning/supported_gateways.md) section for a list of compatible devices.

See the [Gateway provisioning](../provisioning/gateway_provisioning.md) section for detailed instructions on configuring and provisioning your

Once the settings are saved, you can download the configuration file to upload to the device through its interface.

If you do not wish to add physical lines, you can skip this section by clicking the **Next** button to proceed to VoIP trunks.

### Add VoIP trunks {#add-voip-trunks}

You can create VoIP trunks by selecting one of the supported providers and entering the necessary information.

- **Provider**: Choose the provider to use.
- **Trunk Name**: Specify the name of the trunk.
- **Username**: Username given by the provider.
- **Password**: Password given by the provider.
- **Phone Number**: Phone number given by the provider.
- **Allowed codec**: Permitted codec.
- **Force codec**: Allow only the permitted codec.

Press **Save** to create the configuration for that VoIP trunk.

Finally , click the **Next** button to proceed to the Routes section.

## Routes {#routes}

Inbound routes define how incoming calls are matched and routed to internal destinations; outbound routes determine how internal calls are sent out through trunks. Save the route to apply changes and start receiving calls according to the configured rules. In the Routes section you can configure both inbound and outbound routes — each type is explained in detail below.

### Inbound {#inbound}

Inbound routes define how incoming calls from trunks are matched and handled before reaching your internal resources. They typically match on the called number (DID/DDI), caller ID, or time conditions and then forward the call to a destination such as an extension, IVR, queue, ring group, or a Visual Plan flow.

Key points:
- Match criteria: DID/DDI patterns, caller ID, and time conditions (most specific matches take precedence).
- Destinations: any internal endpoint or a Visual Plan route that implements call‑handling logic.
- Additional options: number rewriting (called/caller), call blocking/allow lists, and failover behaviors.
- Best practice: test matches with representative numbers and ensure trunks used for matching are enabled and properly ordered.

Click to **Create new route** to open the Visual Plan application, where you can create, modify, and connect components of NethVoice that will handle the call flow for the incoming number.


By clicking the checkmark symbol in the Visual Plan application, the configuration of your route will be saved.
From that moment on, you can receive calls following the configured flow.

### Outbound {#outbound}

Outbound routes determine how outbound calls from your PBX are matched and sent out through available trunks. Think of them as the rules that map an internal dialed number to a trunk (or sequence of trunks) based on patterns, caller ID, time conditions, and other criteria. Properly configured outbound routes ensure calls take the best available path, provide predictable failover, and comply with local dialing plans.

The wizard shows a list of outbound routes. On first use it proposes default routes that cover common dialing plans:

- National: calls within the country
- Cellphone: mobile number calls
- International: calls outside the country
- Toll: toll-free and premium-rate numbers

Matching patterns are already defined for each route.
Inside each route is possibile to add or remove associated trunks.

By pressing **Save** button, the configuration is written to NethVoice and the route becomes active. 

## Devices {#devices}

Devices are physical (desk) phones that register to the PBX and are associated with users. 

Configure desk phones and their models: add phones by MAC (manual or batch), choose or create models, and adjust provisioning, default settings, and per‑device options.

### Phones {#phones}

During the wizard you can add phones using one of the following methods:

- Copy a list of MAC addresses from a spreadsheet or text file (batch import).
- Enter MAC address and model manually, one phone at a time.

Select the method you prefer: Manual (single-entry) or Paste from file (batch import).

Batch import format for MAC addresses:
 
- Input: plain text, *one MAC address per line*.
- Accepted separators: `:` or `-` between octets, or no separator at all.
- Valid MAC: exactly 12 hexadecimal characters (6 octets); hex digits are case-insensitive.
- Leading and trailing whitespace on each line is ignored.
- Empty lines are ignored and may be used to separate groups.
- Examples of accepted forms (illustrative): `aa:bb:cc:dd:ee:ff`, `aa-bb-cc-dd-ee-ff`, `aabbccddeeff`.

After entering the MAC address, you can select the phone model. Selecting the exact model is required for the correct configuration of the phone.

:::warning
If the model is not selected or the wrong model is chosen, some phone functions, such as provisioning via RPS or line keys, may not be available.
:::


### Models {#models}

The Devices > Models page shows the phone models available in Devices > Phones (built‑in models plus any custom models you create). Use Create new model to base a custom profile on an existing model.

Settings:
- Use **Default Settings** to edit parameters inherited by all models, such as:
  - **Admin Password**: web interface password for administrator user, a random one is generated.
  - **User Password**: web interface password for non‑admin users, a random one is generated.
  - **Phone language**: language setting for the phone.
  - **Tone zone**: audio tone settings for the phone.
  - **Provisioning scheduling**: schedule for automatic provisioning updates.

Saved defaults can be edited later by clicking again **Default Settings** button.

## Configurations {#configurations}

This section configures NethVoice CTI (Computer Telephony Integration) — the web client used by end users to manage calls, presence, contacts, queues and related telephony features. CTI = Computer Telephony Integration.The following subsections explain how to create groups, profiles and permissions that control what features are available in the CTI interface.

### Groups {#groups}

Groups are named collections of users that simplify management and control inside NethVoice CTI. Use groups to control visibility and permissions across multiple users at once.
CTI groups are different from user domains groups.

Common uses
- Control visibility in the Presence Panel and CTI interfaces (show/hide users by group).
- Enable group-level CDR and queue statistics (Group CDR, Queue Agent/Manager visibility).
- Assign shared features like call pickup, group voicemail or shared operator duties.
- Scope permissions and profiles so settings can be applied to many users simultaneously.

Best practices
- Choose clear, descriptive names (e.g., Sales_North, Support_Level1).
- Create groups first, then assign them to profiles and permissions where required.
- Manage membership from the Users or Groups pages; verify group visibility in the relevant CTI panels.
- Test group behavior with a sample user before wide deployment.

You can create user groups that will be visible and usable in applications such as NethVoice CTI.

To create a group, click **Create new group**, specify a name (and optional description), save, then assign users and enable the group where needed in profiles and CTI settings.

Click the **Next** button to proceed to the Profiles section.

### Profiles {#profiles}

Profiles define a reusable set of [permissions](#permissions) that act as role templates. Apply a profile to a user to grant a predefined combination of CTI capabilities, routing access, CDR visibility, phone functions and other NethVoice features.

By default three profiles exist:
- `Basic`: minimal access for standard users (calls, voicemail, limited CTI).
- `Standard`: typical user features (presence, address book, basic CTI and forwarding).
- `Advanced`: broad access for power users (advanced CTI, queue/manager views, recording and monitoring).

Creating and managing profiles:
1. Duplicate an existing profile to preserve a baseline.  
2. Provide a clear name and short description.  
3. Enable or disable feature groups (CTI, Address Book, CDR, Presence, Queues, Phone Lines, etc.), set outbound route access, and select visible user groups.  
4. Assign the profile to users on the Users page.

Best practices:
- Keep a small set of well-documented profiles to simplify administration.  
- Use descriptive names (e.g., Sales_Rep, Support_Level1) and record intended usage.  
- Test profile changes on a sample user before broad rollout.  
- Remember to enable access to the user groups previously created on the profiles where necessary.

Then click **Next** to proceed to the Users section.

#### Permissions {#permissions}

Permissions control specific features and capabilities within NethVoice CTI. They are grouped into sections that correspond to different functional areas. When creating or editing a profile, you can enable or disable individual permissions to tailor the user experience.

##### Settings {#settings}

General permission enables or disables access to all the functionalities of the section and general notification settings.
Available permissions are:

- `DND`: Enables the configuration of Do Not Disturb.
- `Call Forwarding`: Enables the configuration of call forwarding.
- `Recording`: Enables the recording of own conversations. It is also possible to view, listen to, and delete own recordings.
- `Parkings`: Enables the display of the status of parking spaces and the ability to pick up parked calls.
- `Listening`: Enables listening to calls of other users.
- `Intrusion`: Enables intrusion into another user's call (listening to both the caller and called, conversation only with the user).
- `Pickup`: Enables call pickup for calls to other users.
- `Privacy`: Enables the masking of the last three digits (modifiable from the command line) of the called and/or calling number of other users in NethVoice CTI.
- `Physical Phone Buttons`: Enables the configuration of physical phone buttons by the user in NethVoice CTI.
  These correspond to the Line Keys shown on the `wizard-devices` pages.

##### Outbound Routes {#outbound-routes}

All configured outbound routes in NethVoice are displayed, and you can enable/disable their usage individually.

##### NethVoice CTI {#nethvoice-cti}

- `NethVoice CTI`: Enables all the underlying permissions by activating the following functionalities on NethVoice CTI.

##### Address Book {#address-book}

- `Address Book`: Enables access to the address book in NethVoice CTI. If this permission is disabled, the user cannot search or open contacts from either CTI contacts or centralized phonebook sources.
- `Read-only phonebook`: Allows searching and viewing contacts, including contacts imported from centralized phonebook sources, but does not allow creating, editing, or deleting contacts from NethVoice CTI.
- `Private contacts`: Allows creating, editing, and deleting only the user's own private CTI contacts.
- `Advanced Phonebook`: Allows creating, editing, and deleting CTI contacts with private, public, or group visibility. It also allows managing CTI contacts that are not owned by the user.
- Group sharing is available only when the profile includes `Advanced Phonebook` and the user has at least one operator group available through the Presence Panel permissions.
- Contacts imported through Address Book Sources remain read-only in NethVoice CTI regardless of the selected phonebook level.

##### CDR {#cdr}

- `CDR`: The general permission enables the viewing of the call history related to the user.
- `PBX CDR`: Enables the viewing of the call history for the entire PBX.
- `Group CDR`: Enables the viewing of call history for calls within one's assigned group.

##### Customer Cards {#customer-cards}

- `Customer Cards`: The general permission enables the ability to view the customer card on NethVoice CTI.
- For each section of the customer card, you can enable/disable visibility.

##### Presence Panel {#presence-panel}

- The general permission enables the display of the operator's panel in NethVoice CTI.
- `Advanced Recording`: Enables recording of calls from other users.
- `Call Transfer`: Enables call transfer for calls from other users.
- `Advanced Parking`: Enables the ability to park calls from other users and retrieve them.
- `Hang Up`: Enables the ability to hang up calls from other users.
- `Advanced Phone`: Enables phone functionalities (hang up, call, answer) on conversations that do not belong to the user.
- For each configured user group in NethVoice, you can enable/disable visibility.

##### Queue Agent Panel {#queue-agent-panel}

- The general permission enables the Queue section in NethVoice CTI with information about the assigned queues, the ability to log in/out, and enter/exit break.
- `Advanced Queue Agent Panel`: Enables advanced information about the status of queues and agents.
- `Unhanded Calls`: Enables access to the unhanded calls section.

##### Phone Lines {#phone-lines}

- The general permission enables access to the after-hours section of NethVoice CTI, allowing the user to change the path of their incoming calls.
- `Advanced After Hours`: Allows modifying the call path for incoming calls for the user and generic incoming routes.
- `Complete After Hours`: Allows modification of all call paths for incoming calls.

##### Queue Manager {#queue-manager}

- The general permission enables access to the QManager section in NethVoice CTI.
- For each configured queue in NethVoice, you can enable/disable the visibility of the status and data.

##### Operator Station {#operator-station}

- The general permission grants access to the operator station section in NethVoice CTI.
- Only one configured queue in NethVoice needs to be enabled to serve as the source of calls to manage.

## Users {#users}

The Users page lets you configure per-user settings and manage devices associated with each account.

Key configurable settings
- **Profile**: Assigns the permission set that determines the user's capabilities.
- **Group**: Adds the user to a named group to simplify policy and visibility management.
- **Mobile**: Stores a mobile number for display in the operator panel and presence management.
- **Voicemail Box**: Enables a voicemail box to receive calls that the user does not answer.
- **Associate Device**: Assigns an unassociated phone (provisioned or custom) to the user. For devices not supported by provisioning, create a custom device and generate credentials for manual configuration.

Devices overview
- Devices are shown after the user settings and can be either software endpoints (Web Phone, Mobile App, Phone Link, Desktop client) or physical phones managed via provisioning or as custom devices.
- Each user can have up to 9 associated devices.

Common device types
- **Web Phone**: Activates the browser-based telephony client in NethVoice CTI.
- **Mobile App**: Enables smartphone integration through the supported mobile client.
- **Phone Link**: Links a personal computer telephony endpoint (lightweight desktop integration).
- **Desktop Phone / NethLink**: Desktop application (Windows/Mac) for making and receiving calls directly from the computer without opening the CTI web UI.

Physical device details
For each physical device the UI shows and allows management of:
- **Encryption**: Whether TLS/SRTP encryption is enabled. This setting is determined by the initial [device configuration](#devices). If the PBX is accessible from the public network (WAN), encryption must be enabled.
- **Configuration Model**: Select or change the device model used for provisioning.
- **Edit Configuration**: Override model/default parameters for this specific device. Individual device settings inherit from the selected model and [default settings](#devices)
- **MAC Address**: Displays the device MAC address (used for provisioning and identification).
- **Show Password**: Reveals the SIP password for custom devices. Use this, together with the internal and PBX addresses, to manually configure devices not managed by provisioning.
- **Restart**: Reboot the device remotely if it is registered.
- **Disassociate**: Remove the device assignment from the user.

:::warning
If encryption is enabled, ensure the SSL/TLS certificate installed on the system is valid and includes the PBX hostname; otherwise phones will be unable to establish TLS connections.
:::

Click **Next** to configure some final settings inside the Administration section.

## Administration {#administration}

The Administration section provides access to essential management functions for the NethVoice system, including language configuration, settings management, and advanced interface access.

### Languages {#languages}

In the Languages menu, you can set the default language for NethVoice. This language will be used throughout the administration interface and affects how content is displayed to users.

The available languages depend on the language packs installed in your NethVoice instance.

### Settings {#settings-1}

The Settings page allows you to manage various aspects of the NethVoice configuration.

### Password Management {#password-management}

- **Password**: You can change the password for the admin user who is dedicated to accessing the NethVoice web interface.

To change the administrator password:

1. Navigate to **Administration > Settings**
2. Locate the **Password** field
3. Enter a new password that meets your security requirements
4. Click **Save** to apply the changes

:::warning
Ensure that you use a strong password to protect your NethVoice instance from unauthorized access.
:::

### Advanced {#advanced}

The Advanced section provides direct access to the NethVoice advanced interface.
See the [Advanced](../advanced/index.md) section for more details.
