---
title: Chat
sidebar_position: 10
---

# Chat

NethVoice includes a chat for its users: one-to-one conversations, groups, attachments and voice notes, available in [NethVoice CTI](../../user-manual/nethcti/chat.md), in [NethLink](../../user-manual/nethlink/usage.md#chat) and in the [NethVoice mobile app](../../user-manual/mobile_app.md#messages).
Users can also chat with **people outside the PBX** (customers, suppliers, partners) through an invite link that opens a chat page in the browser, with nothing to install.

This page describes how to enable the chat and how its options work. For the day-to-day use of the chat, see the [User Manual](../../user-manual/nethcti/chat.md).

## How it works {#how-it-works}

The chat runs inside the NethVoice module, on the same node, and its data never leaves the server:

- every user logs in to the chat with their NethVoice CTI credentials: there are no separate accounts to manage;
- messages, groups and attachments are stored by the NethVoice module and are part of its backup;
- clients reach the chat over HTTPS on the **NethVoice CTI base host**, so no additional port needs to be opened on the firewall;
- people outside the PBX open a page on the same host, under `/chat-gw/g/`.

## Enable the chat {#enable-chat}

The chat is disabled after the installation or the update of NethVoice. To enable it:

1. Open the NethVoice module from the NethServer 8 cluster administration page.
2. Go to the **Integrations** page.
3. In the **Chat** section, turn on **Enable chat**.
4. Review the options described below and press **Save**.

| Option | Default | Allowed values | Description |
|---|---|---|---|
| **Keep chat messages and attachments for (days)** | `365` | 1 – 3650 | Messages and attachments older than this are deleted every day. |
| **Attachments space per user (MB)** | `200` | 10 – 100000 | Space for the files a user sends. When a user goes over it, their oldest attachments are deleted. |
| **Largest attachment (MB)** | `25` | 1 – 1024 | Size limit of a single file. It cannot be larger than the attachments space per user. |

Once saved, the **Messages** entry appears in NethVoice CTI, the chat appears in NethLink and the mobile app gets the messaging configuration at its next login.

### Disable the chat {#disable-chat}

Turn off **Enable chat** and press **Save**: the chat services stop and NethVoice CTI, NethLink and the mobile app hide the chat. The history is kept: when the chat is enabled again, conversations, groups and attachments are still there.

## User permission {#user-permission}

The chat is available to the users whose profile has the **Chat** permission. The permission is set in the wizard, in [**Profiles**](./wizard.md), under the NethVoice CTI permissions.

A user without the permission:

- does not see the chat in NethVoice CTI, NethLink and the mobile app;
- cannot log in to the chat;
- cannot create chats with people outside the PBX.

## Clients {#clients}

- **NethVoice CTI**: the **Messages** page lists every conversation; chats open in a window over the page, which can also be pinned to the side of the screen.
- **NethLink**: the **Chat** section of the desktop client, with the same conversations; when NethLink is running, the chat opens in NethLink instead of the browser.
- **NethVoice mobile app**: the **Messages** section. The app receives the configuration automatically when the user logs in with the QR code or with username and password (with two-factor authentication enabled, only the QR code login is available). New messages arrive as push notifications.

Users see the same conversations, with the same read state, on every client.

## Groups {#groups}

There are three kinds of group chats:

- **Groups made by users**: any user can create a group from NethVoice CTI or NethLink, give it a name and a picture, and add colleagues. The user who creates it is its owner and can rename it, change its picture, add and remove members, and delete it. If the owner leaves, ownership passes to another member.
- **NethVoice CTI groups**: every operator group configured in the wizard becomes a group chat for its members, with the same name. When members are added to or removed from the group in the wizard, the chat follows within a couple of minutes.
- **Queues**: every queue becomes a group chat named `Queue - <name>` for its agents.

NethVoice CTI groups and queues are managed by the PBX: users cannot leave or delete them from the chat.

## Chat with people outside the PBX {#external-people}

Users can invite people without a NethVoice account into a chat. They receive a link, open it in the browser, write their name and join: there is nothing to install and no account to create.

### Who can invite {#external-who}

- Any user with the **Chat** permission can create a chat with people outside the PBX.
- Only groups **made by users** can be shared with people outside. NethVoice CTI groups and queues cannot.
- Only the owner of a chat manages its link and the people outside: the other members can read and write, and see who joined.

### Ways to start {#external-start}

From the **New chat** window, users can select **External people** as if it were a colleague:

- **External people alone**: a chat between the user and people outside, with a name chosen by the user.
- **External people and one or more colleagues**: a group with those colleagues, shared with people outside as soon as it is created.

An existing group can also be shared later from its settings, with **Share with external people**.

In every case the user gets an invite link to send by email, message or any other channel.

### The invite link {#external-link}

- The link is valid for **30 days**. Whoever opens it after that cannot join; who already joined stays.
- The link is shown once, when it is created. **New link** creates a new one and the previous one stops working.
- **Make private** disables the link: nobody new can join, who already joined stays. When nobody from outside is left in the group, it goes back to a normal group and can be shared again.
- The owner can remove any person outside from the chat at any time: their page stops working at once.

### People outside in the chat {#external-guests}

- Up to **10 people outside** can be in the same chat at the same time.
- Each one chooses their name when joining. A name already used by another person in that chat, or equal to the name or username of a NethVoice user, is refused.
- People outside are marked **External** on their messages and in the list of members, so they cannot be mistaken for colleagues.
- They see the whole history of the chat, including the messages written before they joined.
- They can write, reply, react with emoji, send files and images, record voice notes, search the chat and delete their own messages.
- Their page shows the names of the members. It follows the light or dark theme of the browser and can send browser notifications while it is open.

### Security {#external-security}

The page for people outside is designed to be exposed on the Internet:

- the link is a long random token: only its fingerprint is stored on the server;
- each person outside gets an access of their own, valid only for that chat;
- executables and unknown file types sent by people outside are refused, and files are served so that the browser never runs them;
- joins, messages and uploads are rate limited, per address and per person, to protect the server from abuse;
- people outside cannot see other chats, the list of NethVoice users or their presence.

:::warning Visible history
People outside read all the history of the chat they join. Before sharing an existing group, make sure that its history can be read by people outside the company.
:::

## Users removed from NethVoice {#removed-users}

When a user is removed from NethVoice, after a grace period of 24 hours their conversations show **No longer active** and can no longer receive messages; the history stays readable by the other members. If the user owned a group, ownership passes to another member.

## Backup and restore {#backup}

Conversations, groups and attachments are included in the backup of the NethVoice module and are restored with it, together with the chat settings.

## Use the chat in other web applications {#chat-island}

The chat window of NethVoice CTI, called *Chat Island*, can be embedded into other web applications. Each user can get the configuration string from NethVoice CTI, in **Settings** > **Integrations** > **Chat Island configuration**, with **Get Chat Island configuration**. **Revoke Chat Island configuration** disables every Chat Island using the current configuration.
