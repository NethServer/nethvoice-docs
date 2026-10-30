---
title: Chat
sidebar_position: 3
---

# Chat

NethVoice CTI includes a chat to write to colleagues, alone or in groups, and to people outside the company through an invite link. The same conversations are available in [NethLink](../nethlink/usage.md#chat) and in the [NethVoice mobile app](../mobile_app.md#messages).

The chat is available when the administrator has [enabled it](../../administrator-manual/configuration/chat.md) and your profile has the **Chat** permission.

## Messages page {#messages-page}

The **Messages** entry in the menu opens the list of your conversations: one-to-one chats, groups, NethVoice CTI groups and queues. Each row shows the last message, its time and the number of unread messages; the unread count also appears next to the **Messages** entry.

- Click a row, or **Open chat**, to open the conversation.
- The **⋮** menu of a row lets you mute or unmute notifications, open the details of the operator, group or queue, and delete the conversation or leave the group.
- The search box looks for names, usernames and the text of the messages: matches are highlighted and clicking a result opens the chat at that message.

## Start a chat {#start-chat}

Press **New chat** and choose who you want to write to:

- **One colleague**: press **Start chat**.
- **Two or more colleagues**: optionally add a picture and a name, then press **Create group**. Without a name, the group takes the first names of its members.
- **External people**: see [Chat with people outside the company](#external-people).

You can also start a chat with a colleague from their operator card, from the operator drawer (**Open chat**) and from the call menu.

## The chat window {#chat-window}

Chats open in a window at the bottom right of the page. Open chats appear as round heads next to the window: click a head to switch chat, drag the window to move it.

- **Pin to side panel** keeps the chat on the right side of the page while you work; **Unpin** brings back the floating window.
- The header shows who you are chatting with and their presence. In a group, click the name to see the members, with their presence, and to start a chat or a call with one of them.
- The **call** button calls your colleague on the device you choose (web phone, NethLink or mobile app); the call is noted in the chat.
- The **search** icon looks for text in the conversation, including older messages: use the arrows to move between results.

## Messages {#messages}

- Write in the box at the bottom and press Enter to send; Shift+Enter starts a new line.
- Text can be formatted with Markdown: `**bold**`, `*italic*`, `~~strikethrough~~`, `` `code` ``, code blocks, lists and links.
- Emoji can be chosen from the picker or typed as shortcodes, e.g. `:+1:`.
- Mention a colleague with `@` followed by their username.
- Hover a message to **react** with an emoji, **reply** to it (the original message is quoted) or **delete** it. You can delete only your own messages; in a group you can delete it for everyone.
- Ticks show when your message has been delivered and read. In a group, the message is read when every member has read it.
- While your colleague is typing, the chat shows it.

In a group, each person's name has a colour of its own, so it is easy to follow who is writing.

## Attachments and voice notes {#attachments}

- Press the paper clip, or drag files onto the chat, to send images, documents and other files, also several at once with a caption.
- Press the microphone to record a voice note and send it.
- Images are shown in the chat; other files can be downloaded.

The size of each file and the space for your attachments are set by the administrator.

## Groups {#groups}

The owner of a group can open its settings with the **gear** icon to:

- change its name and picture;
- add members with **Add members** and remove them;
- [share it with people outside the company](#share-group).

Any member can leave a group; when the owner leaves, another member becomes the owner.

NethVoice CTI groups and queues appear as group chats automatically, with their members; they cannot be left or deleted.

## Notifications {#notifications}

- A new message in a chat that is not open shows a notification in the page and plays a sound.
- With the browser notifications allowed, you are notified even when NethVoice CTI is in a background tab or closed.
- Muted chats give no sound and no notification.

## Chat with people outside the company {#external-people}

You can chat with customers, suppliers and anyone without a NethVoice account. They receive a link, open it in the browser, write their name and join.

### Create a chat with people outside {#create-external}

In **New chat**, select **External people** at the top of the list, as you would select a colleague:

- **External people alone**: write the name of the chat and press **Create link**. The chat is between you and the people you invite.
- **External people and one or more colleagues**: add a picture and a name if you want, then press **Create group**. The group is created and shared at once.

The invite link appears: copy it with the icon inside the field and send it by email, message or any other channel, then press **Open chat**. The link works for 30 days.

### Share an existing group {#share-group}

The owner of a group made from **New chat** can open it to people outside: press the **gear** icon, then **Share with external people** and confirm. Remember that people outside will read all the history of the group.

NethVoice CTI groups and queues cannot be shared.

### Manage the link and the people outside {#manage-external}

In the group settings, the owner can:

- **New link**: create a new link; the previous one stops working.
- **Make private**: disable the link. Nobody new can join and who already joined stays; when nobody from outside is left, the group goes back to a normal group.
- **Remove** a person outside from the chat.

The other members see the people outside in the list of members but cannot manage them.

People outside are marked **External** next to their name and in the list of members, and the chat is marked **External** in its title.

### What people outside see {#guest-page}

Whoever opens the link sees a page with the name of the chat:

1. They write their name and press **Join**. The name is visible to everyone in the chat and must be different from the other people in it.
2. They see all the history of the chat and the names of its members.
3. They can write, reply, react, use emoji, send files and voice notes, search the chat and delete their own messages.
4. While the page is open, they can receive browser notifications for new messages: the browser asks for the permission when they join.

The page follows the light or dark theme of the browser.
