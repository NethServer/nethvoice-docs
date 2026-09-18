---
title: What are the exact steps to remove a user from the NethVoice user domain?
sidebar_position: 12
---

# What are the exact steps to remove a user from the NethVoice user domain?

Removing a user from NethVoice requires first removing all NethVoice resources associated with that user.

## 1. Remove associated devices

Open the **NethVoice configuration wizard** and go to:

**Users → Configurations**

Select the user and:

- disassociate all assigned devices

## 2. Remove the extension from the user

Go to:

**Users → Extensions**

Select the user, remove the assigned extension number, and save the changes.

After a short time, the user will appear as inactive in NethVoice.

## 3. Delete the user from the domain

NethVoice users are provided by the **account provider** configured for the user domain, so the user must be deleted from the domain itself and not directly from NethVoice.

If the user domain is managed locally on NS8, open the account provider that manages the domain and delete the user there.

If NethVoice uses a **remote account provider**, such as an external LDAP or Active Directory server, the user must instead be deleted from the remote user directory.

> Before deleting the user from the domain, always remove its devices, WebRTC configuration, and extension from NethVoice.

