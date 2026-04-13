# vtenext CRM Integration

## Guide Objective

The purpose of this guide is to explain how to configure the [vtenext CRM](https://www.vtenext.com/) integration scripts on NethVoice 8 **to let the two systems exchange data**.

## Introduction to the Concept

Data exchange between the two systems can go both ways:

- from vtenext CRM to NethVoice:

    1. show CRM contact info on incoming phone call.
    2. populate NethVoice centralized phone directory with company contacts from vtenext.

- from NethVoice to vtenext CRM:

    3. NethVoice can register caller info in vtenext for incoming calls.

## 1. Show Caller Info

### Definition

This feature allows you to show caller info, taken from vtenext CRM, while receiving an incoming call.

### How it Works

* a contact registered in vtenext CRM calls.
* its info show up in CTI while phone rings.

## 2. Populate NethVoice Phone Directory with vtenext Contacts Data

### Definition

Phone data for vtenext contacts are periodically imported in NethVoice centralized phone directory.

### How it Works

Periodically, contacts phone data are updated automatically, importing them from vtenext into NethVoice phone directory.

You can check import frequency with command

```bash
systemctl --user list-timers
```

## 3. Register Incoming Calls into vtenext

:::info this function needs a proprietary plugin, available from vtenext, that implements the `notify_incoming_call` endpoint. :::

### Definition

On incoming call, the event is registered in vtenext, attributed to called phone extension owner and an incoming call notification is shown. 

### How it Works

When a phone extension receives an inbound call, NethVoice notifies vtenext through an API call and event is registered in CRM, connected to phone extension owner as defined in Asterisk configuration under user preferences.

---

## Configuration Instructions

### Prerequisites

- version 1.6 or later of the NethVoice image.
- version 2 of vtenext CRM.
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

1. Get plugin from vtenext.
2. Open **Settings** (gear icon at the bottom left).
3. Select **Business Process Manager** (buildings icon on the left).
4. Go to **Module Manager**.
5. Select the **Custom Modules** tab.
6. Press the button **Import new module**.
7. Press the file selection button and choose the plugin .ZIP file from your disk.
8. Press **Import**.
9. Verify that the **NethVoice** module appears in the **Standard Modules** list.

### Install the scripts in NethVoice

1. Access the machine via **ssh**.
2. To enter NethVoice module, run the command:
    ```
    runagent -m nethvoice1
    ```
3. To enter freepbx container, run the command:
    ```
    podman exec -ti freepbx /bin/sh    
    ```
4. Copy the files:
    -   `lookup_vte.php` from `/usr/src/nethvoice/samples` to `/usr/src/nethvoice/lookup.d`
    -   `vte.php` from `/usr/share/phonebooks/samples/` to `/usr/share/phonebooks/scripts`
    -   `vte_incoming_call.php` from `/usr/src/nethvoice/samples` to `/var/lib/asterisk/agi-bin`
5. Edit all three scripts to update:
    -   the API base URL
    -   the username
    -   the Access Key
6. Define `NETHCTI_CDR_SCRIPT_EXTENSION_RING` environment variable in the module environment, pointing at `lookup_vte.php` script

:::info The following command will close all running calls, so execute it when suitable :::

7. To apply changes, restart freepbx with the command:
    ```
    systemctl --user restart freepbx
    ```
