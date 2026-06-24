# vtenext CRM

## Guide Objective

The purpose of this guide is to explain how to configure the [vtenext CRM](https://www.vtenext.com/) integration scripts on NethVoice 8 to let the two systems exchange data.

## Introduction to the Concept

Data exchange between the two systems can go both ways:

- from vtenext CRM to NethVoice:

    1. show CRM contact info on incoming calls inside CTI.
    2. populate NethVoice centralized phone directory with company contacts from vtenext.

- from NethVoice to vtenext CRM:

    3. NethVoice can register caller info in vtenext for incoming calls.

## 1. Show Caller Info

### Definition

This feature allows you to show caller info, taken from vtenext CRM, while receiving an incoming call.

### How it Works

* a contact registered in vtenext CRM calls.
* their information appears in CTI while the phone rings.

## 2. Populate NethVoice Phone Directory with vtenext Contacts Data

### Definition

Phone data for vtenext contacts are periodically imported into the NethVoice centralized phone directory.

### How it Works

Periodically, contacts phone data are updated automatically by importing them from vtenext into the NethVoice phone directory, according to the **Address Book Sources** settings in the **Application** menu.

The update interval can be:

- 15 minutes
- 30 minutes
- 1 hour
- 6 hours
- 24 hours

You can check the import frequency with the command:

```bash
runagent -m nethvoice1
systemctl --user status phonebook-update.timer
```

Output example:

```bash
● phonebook-update.timer - Timer for phonebook source update
     Loaded: loaded (/home/nethvoice136/.config/systemd/user/phonebook-update.timer; enabled; preset: disabled)
     Active: active (waiting) since Tue 2026-03-17 16:21:55 CET; 3 weeks 6 days ago
      Until: Tue 2026-03-17 16:21:55 CET; 3 weeks 6 days ago
    Trigger: Tue 2026-04-14 08:15:44 CEST; 1min 42s left
   Triggers: ● phonebook-update.service
```

## 3. Register Incoming Calls into vtenext

:::info
This function needs a proprietary plugin, available from vtenext, that implements the `notify_incoming_call` endpoint of vtenext API. Please contact vtenext support to obtain the plugin.
:::

### Definition

On an incoming call, the event is registered in vtenext, attributed to the called extension owner, and an incoming call notification is shown in vtenext.

### How it Works

When a phone extension receives an inbound call, NethVoice notifies vtenext through an API call, and the event is registered in CRM and linked to the extension owner as defined in the Asterisk configuration under user preferences.

---

## Configuration Instructions

### Prerequisites

- Version 1.6 or later of the NethVoice image.
    The version number can be checked inside the NethVoice module with the command:
    ```bash
    runagent -m nethvoice1
    env | grep IMAGE_URL
    ```
- Version 2 of vtenext CRM.
- vtenext plugin (needed only if you want to register incoming calls in vtenext).

### VTENEXT Configuration

#### Obtain the Webservice Access Key

1. Log in as the user handling the API calls.
2. Open **Settings** (gear icon at the bottom left).
3. Select **Business Process Manager** (buildings icon on the left).
4. Go to **Webservice REST**.
5. In the **Username** field, select the user that will run the scripts.
6. Press the button **Webservice accesskey – Show**.
7. Authenticate.
8. Copy the content of the **Access Key** field.

#### Install the vtenext plugin

1. Get the plugin from vtenext.
2. Open **Settings** (gear icon at the bottom left).
3. Select **Business Process Manager** (buildings icon on the left).
4. Go to **Module Manager**.
5. Select the **Custom Modules** tab.
6. Press the button **Import new module**.
7. Press the file selection button and choose the plugin ZIP file from your disk.
8. Press **Import**.
9. Verify that the **NethVoice** module appears in the **Standard Modules** list.

### Install the scripts in NethVoice

1. Access the machine via **ssh**.
2. To enter the NethVoice module, run the command:
    ```bash
    runagent -m nethvoice1
    ```
3. To enter the FreePBX container, run the command:
    ```bash
    podman exec -ti freepbx /bin/sh    
    ```
4. Copy the files:
    -   `lookup_vte.php` from `/usr/src/nethvoice/samples` to `/usr/src/nethvoice/lookup.d`
    -   `vte.php` from `/usr/share/phonebooks/samples/` to `/usr/share/phonebooks/scripts`
    -   `vte_incoming_call.php` from `/usr/src/nethvoice/samples` to `/var/lib/asterisk/agi-bin`

    You can run the following commands to do it:
    ```bash
    cp /usr/src/nethvoice/samples/lookup_vte.php /usr/src/nethvoice/lookup.d
    cp /usr/share/phonebooks/samples/vte.php /usr/share/phonebooks/scripts
    cp /usr/src/nethvoice/samples/vte_incoming_call.php /var/lib/asterisk/agi-bin
    ```
5. Edit all three scripts to update:
    -   the API base URL
    -   the username
    -   the Access Key
6. Define the `NETHCTI_CDR_SCRIPT_EXTENSION_RING` environment variable in the module environment, pointing to the `vte_incoming_call.php` script:
    ```bash
    sed -i '/^NETHCTI_CDR_SCRIPT_EXTENSION_RING=/d' environment && echo 'NETHCTI_CDR_SCRIPT_EXTENSION_RING="/var/lib/asterisk/agi-bin/vte_incoming_call.php"' >> environment
    ```
7. To apply changes, restart FreePBX inside the NethVoice module with the command:

    :::warning
    The following command will close all active calls, so execute it when suitable.
    :::

    ```bash
    systemctl --user restart freepbx
    ```
