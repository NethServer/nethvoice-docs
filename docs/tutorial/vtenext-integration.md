# vtenext CRM Integration

## Guide Objective

The purpose of this guide is to explain **how to configure** the vtenext CRM integration scripts on nethvoice 8 **to let the two systems exchange data**, as it happened in nethvoice version 14

## Introduction to the Concept

Data exchange between the two systems can go both ways:

- from vtenext CRM to nethvoice:

    1. show CRM contact info on incoming phone call
    2. populate nethvoice centralized phone directory with company contacts from vtenext

- from nethvoice to vtenext CRM:

    3. nethvoice can register caller info in vtenext for incoming calls 

## 1. Show Caller Info

### Definition

This feature allows you to show caller info, taken from vtenext CRM, while receiving an incoming call

### How it Works

* a user registered in vtenext CRM calls
* its info show up while phone rings

## 2. Populate nethvoice Phone Directory with vtenext Contacts Data

### Definition

Phone data for vtenext contacts are periodically imported in nethvoice centralized phone directory

### How it Works

Periodically, contacts phone data are updated automatically, importing them from vtenext into nethvoice phone directory 

## 3. Register Incoming Calls into vtenext

### Definition

On incoming call, the event is registered in vtenext, attributed to called phone extension owner and an incoming call notification is shown 

### How it Works

When a phone extension receives an inbound call, nethvoice notifies vtenext through an API call and event is registered in CRM, connected to phone extension owner as defined in Asterisk configuration under user preferences

**Note:** this function needs a proprietary plugin, _NethVoice.zip_, available from vtenext, that implements the `notify_incoming_call` endpoint

---

## Configuration Instructions

### Prerequisites

- version 1.6 or later of the nethvoice 8 image
- version 2.x of vtenext CRM
- vtenext _NethVoice.zip_ plugin (needed only if you want to register incoming calls in vtenext)

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

#### Install the vtenext _NethVoice.zip_ plugin


1. Get _NethVoice.zip_ plugin from vtenext.
2. Open **Settings** (gear icon at the bottom left).
3. Select **Business Process Manager** (buildings icon on the left).
4. Go to **Module Manager**.
5. Select the **Custom Modules** tab.
6. Press the button **Import new module**.
7. Press the file selection button and choose the _NethVoice.zip_ file from your disk.
8. Press **Import**.
9. Verify that the _NethVoice_ module appears in the **Standard Modules** list.

### Install the scripts in NethVoice

1. Access the machine via **ssh**.
2. To enter Nethvoice module, run the command:
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
7. To apply changes, restart freepbx with the command:
    ```
    systemctl --user restart freepbx
    ```
