---
title: Prune old voicemail messages
sidebar_position: 4
---

# Prune old voicemail messages

*How to automatically delete voicemail messages older than a specified number of days on NethVoice*

## Guide Objective

The purpose of this guide is to **explain how to configure automatic voicemail pruning** on NethVoice and to **describe the setup, operation, and data backup procedures** to ensure safe deletion of old messages.

## Introduction

NethVoice stores voicemail messages in a MariaDB database. Over time, this database can grow significantly, consuming disk space. The **voicemail pruning feature** allows you to **automatically delete voicemail messages older than a configurable number of days** (default: 10 days) using systemd timers and services.

### How it Works

* A systemd timer triggers a service every day at midnight.
* The service executes a MariaDB query that deletes voicemails older than the configured retention period.
* The retention period is **configurable** (default: 10 days).
* Deleted messages are **permanently removed** from the database.

### Use Cases

* **Disk space management**: Prevent database bloat by removing old messages automatically.
* **Data retention compliance**: Maintain organization-specific retention policies.
* **Performance optimization**: Keeping the database lean improves query performance.


## Prerequisites

* SSH access to the NethServer 8 cluster where NethVoice is running.
* Familiarity with systemd user services.

## Setup Instructions

### Step 1: Access the Application

First, connect to NethServer using SSH, then access the NethVoice container environment:

```bash
runagent -m nethvoice1
```

Then navigate to the systemd user directory:

```bash
cd ~/.config/systemd/user/
```

*(The full path is `/home/nethvoice1/.config/systemd/user/`)*

### Step 2: Create the Timer File

Create a file named `voicemail-prune.timer` with the following content:

**File: voicemail-prune.timer**

```ini
[Unit]
Description=Daily timer to prune old voicemails

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

This file defines a **daily timer** that triggers the pruning service every day. The `Persistent=true` setting ensures the timer runs even if the system was shut down at the scheduled time.

### Step 3: Create the Service File

Create a file named `voicemail-prune.service` with the following content:

**File: voicemail-prune.service**

```ini
[Unit]
Description=Prune old voicemail messages
Wants=voicemail-prune.timer

[Service]
Type=oneshot
Environment=PODMAN_SYSTEMD_UNIT=%n
EnvironmentFile=%S/state/passwords.env
WorkingDirectory=%S/state
Environment=DAYS=10
ExecStart=podman exec -i mariadb mysql -uroot -p"${MARIADB_ROOT_PASSWORD}" asteriskcdrdb -e "DELETE FROM voicemessages WHERE msgnum <> -1 AND CAST(origtime AS UNSIGNED) < (UNIX_TIMESTAMP() - ${DAYS}*24*60*60);OPTIMIZE TABLE voicemessages;"
```

The `Environment=DAYS=10` line sets the retention period to 10 days. You can change this value to modify how many days of voicemail to retain.


### Step 4: Enable and Start the Timer

Enable the timer to start automatically at boot:

```bash
systemctl --user daemon-reload
systemctl --user enable --now voicemail-prune.timer
```

**Done!** The voicemail pruning service is now configured to run once a day.

---

## Backup and Restore Procedures

Before relying on automatic pruning in production, it is **strongly recommended** to create a backup of your voicemail data.

Before executing any commands, ensure you are in the NethVoice application environment:
```bash
runagent -m nethvoice1
```

### Creating a Backup

To back up the voicemessages table:

```bash
export MARIADB_ROOT_PASSWORD="$(awk -F= '/^MARIADB_ROOT_PASSWORD=/{sub(/^[^=]*=/,""); print}' ~/.config/state/passwords.env)"
podman exec -ti mariadb mysqldump -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb voicemessages > backup.dump
```

This command:
* Extracts the MariaDB root password from the `passwords.env` file.
* Uses `mysqldump` to export the `voicemessages` table to a file named `backup.dump` inside the host environment.

### Restoring from a Backup

To restore the voicemessages table from a backup:

```bash
podman cp backup.dump mariadb:/tmp
podman exec -ti mariadb /bin/bash -c "mysql -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb < /tmp/backup.dump"
podman exec -ti mariadb rm /tmp/backup.dump
```

This command:
* Copies the backup file into the MariaDB container.
* Restores the data from the backup using the `mysql` command.

---

## Management and Troubleshooting

Before executing any commands, ensure you are in the NethVoice application environment:
```bash
runagent -m nethvoice1
```

### Run Service Manually

To test the pruning service manually:

```bash
systemctl --user start voicemail-prune.service
```

### Check Timer Status

To view the timer and its last execution:

```bash
systemctl --user status voicemail-prune.timer
```

### View Service Logs

To see the output of the pruning service:

```bash
api-server-logs logs --entity module --name nethvoice1
```

This displays the logs for the NethVoice module. Look for entries related to the voicemail pruning service:

```
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Starting Prune old voicemail messages...
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Finished Prune old voicemail messages.
```

### Adjust the Retention Period

To change the retention period from the default 10 days:

1. Edit the `voicemail-prune.service` file.
2. Locate the line: `Environment=DAYS=10`
3. Replace `10` with your desired number of days.
4. Save the file.
5. Reload the systemd user daemon: `systemctl --user daemon-reload`

### Disable the Pruning Service

To disable the timer and stop automatic pruning:

```bash
systemctl --user disable --now voicemail-prune.timer
```

To remove the service and timer files:

```bash
rm ~/.config/systemd/user/voicemail-prune.service
rm ~/.config/systemd/user/voicemail-prune.timer
systemctl --user daemon-reload
```

### Common Issues

**Timer not running:**
* Check if the timer is enabled: `systemctl --user list-timers`
* Verify the service files are in the correct location: `ls -la ~/.config/systemd/user/voicemail-prune.*`
* Reload the systemd user daemon: `systemctl --user daemon-reload`

**Database connection errors:**
* Confirm the MariaDB container is running: `podman ps | grep mariadb`
* Test the MariaDB connection manually using the provided credentials.
