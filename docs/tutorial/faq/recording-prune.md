---
title: Prune old call recordings
sidebar_position: 3
---

# Prune old call recordings

*How to automatically delete call recordings older than a specified number of days on NethVoice*

## Guide Objective

The purpose of this guide is to **explain how to configure automatic call recording pruning** on NethVoice and to **describe the setup, operation, and data cleanup procedures** to ensure safe deletion of old recordings.

## Introduction

NethVoice stores call recordings as files in the file system and maintains metadata references in a MariaDB database. Over time, recordings can consume significant disk space. The **recording pruning feature** allows you to **automatically delete both recording files and their database metadata for recordings older than a configurable number of days** (default: 10 days) using systemd timers and services.

### How it Works

* A systemd timer triggers a service every day at midnight.
* The service first removes database metadata references for old recordings.
* The service then deletes the actual recording files from the file system.
* The retention period is **configurable** (default: 10 days).
* Deleted recordings and their metadata are **permanently removed**.

### Use Cases

* **Disk space management**: Prevent file system bloat by removing old recordings automatically.
* **Data retention compliance**: Maintain organization-specific retention policies for call records.
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

Create a file named `recording-prune.timer` with the following content:

**File: recording-prune.timer**

```ini
[Unit]
Description=Daily timer to prune old call recordings

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

This file defines a **daily timer** that triggers the pruning service every day. The `Persistent=true` setting ensures the timer runs even if the system was shut down at the scheduled time.

### Step 3: Create the Service File

Create a file named `recording-prune.service` with the following content:

**File: recording-prune.service**

```ini
[Unit]
Description=Prune old call recordings
Wants=recording-prune.timer

[Service]
Type=oneshot
Environment=PODMAN_SYSTEMD_UNIT=%n
EnvironmentFile=%S/state/passwords.env
WorkingDirectory=%S/state
Environment=DAYS=10
ExecStart=/bin/bash -c "podman exec -i mariadb mysql -uroot -p\"${MARIADB_ROOT_PASSWORD}\" asteriskcdrdb -e \"UPDATE asteriskcdrdb.cdr SET recordingfile = '' WHERE calldate < DATE_SUB(NOW(), INTERVAL ${DAYS} DAY) AND recordingfile != '';\""
ExecStart=podman exec -ti freepbx find /var/spool/asterisk/monitor/ -type f -mtime +${DAYS} -delete
```

The `Environment=DAYS=10` line sets the retention period to 10 days. You can change this value to modify how many days of recordings to retain.

**Note:** The service uses two separate `ExecStart` commands:
* The first command updates the database to clear recording file references.
* The second command deletes the actual recording files from disk.


### Step 4: Enable and Start the Timer

Enable the timer to start automatically at boot:

```bash
systemctl --user daemon-reload
systemctl --user enable --now recording-prune.timer
```

**Done!** The recording pruning service is now configured to run once a day.

---

## Backup and Restore Procedures

Before relying on automatic pruning in production, it is **strongly recommended** to create backups of your recording data.

Before executing any commands, ensure you are in the NethVoice application environment:
```bash
runagent -m nethvoice1
```

### Backing Up Recording Metadata

To back up the call recording metadata from the CDR table:

```bash
export MARIADB_ROOT_PASSWORD="$(awk -F= '/^MARIADB_ROOT_PASSWORD=/{sub(/^[^=]*=/,""); print}' ~/.config/state/passwords.env)"
podman exec -ti mariadb mysqldump -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb cdr > cdr_backup.dump
```

This command:
* Extracts the MariaDB root password from the `passwords.env` file.
* Uses `mysqldump` to export the CDR table to a file named `cdr_backup.dump` inside the host environment.

### Backing Up Recording Files

To back up the actual recording files:

```bash
podman exec freepbx tar -cz /var/spool/asterisk/monitor/ > recordings_backup.tar.gz
```

### Restoring Metadata from a Backup

To restore the CDR table from a backup:

```bash
podman cp cdr_backup.dump mariadb:/tmp
podman exec -ti mariadb /bin/bash -c "mysql -p$MARIADB_ROOT_PASSWORD -uroot asteriskcdrdb < /tmp/cdr_backup.dump"
```

This command:
* Copies the backup file into the MariaDB container.
* Restores the CDR data from the backup using the `mysql` command.

### Restoring Recording Files from a Backup

To restore the actual recording files:

```bash
podman cp recordings_backup.tar.gz freepbx:/tmp
podman exec -ti freepbx /bin/bash -c "tar -xz -C / -f /tmp/recordings_backup.tar.gz"
podman exec -ti freepbx chown -R asterisk:asterisk /var/spool/asterisk/monitor/
podman exec -ti freepbx rm /tmp/recordings_backup.tar.gz
```

---

## Management and Troubleshooting

### Run Service Manually

To test the pruning service manually:

```bash
systemctl --user start recording-prune.service
```

### Check Timer Status

To view the timer and its last execution:

```bash
systemctl --user status recording-prune.timer
```

### View Service Logs

To see the output of the pruning service:

```bash
api-server-logs logs --entity module --name nethvoice1
```

This displays the logs for the NethVoice module. Look for entries related to the recording pruning service:

```
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Starting Prune old call recordings...
2026-01-20T13:51:42Z [1:nethvoice1:systemd] Finished Prune old call recordings.
```

### Adjust the Retention Period

To change the retention period from the default 10 days:

1. Edit the `recording-prune.service` file.
2. Locate the line: `Environment=DAYS=10`
3. Replace `10` with your desired number of days.
4. Save the file.
5. Reload the systemd user daemon: `systemctl --user daemon-reload`

### Verify Recording Deletion

To verify that recordings were deleted, check the recording directory:

```bash
ls -lah /var/spool/asterisk/monitor/
```

You can also query the CDR table to see which recordings have empty file references:

```bash
podman exec -ti mariadb mysql -uroot -p$MARIADB_ROOT_PASSWORD -e "SELECT COUNT(*) FROM asteriskcdrdb.cdr WHERE recordingfile = '' AND calldate < DATE_SUB(NOW(), INTERVAL 10 DAY);"
```

### Disable the Pruning Service

To disable the timer and stop automatic pruning:

```bash
systemctl --user disable --now recording-prune.timer
```

To remove the service and timer files:

```bash
rm ~/.config/systemd/user/recording-prune.service
rm ~/.config/systemd/user/recording-prune.timer
systemctl --user daemon-reload
```

### Common Issues

**Timer not running:**
* Check if the timer is enabled: `systemctl --user list-timers`
* Verify the service files are in the correct location: `ls -la ~/.config/systemd/user/recording-prune.*`
* Reload the systemd user daemon: `systemctl --user daemon-reload`

**Database connection errors:**
* Confirm the MariaDB container is running: `podman ps | grep mariadb`
* Test the MariaDB connection manually using the provided credentials.

**Files not being deleted:**
* Verify the FreePBX container is running: `podman ps | grep freepbx`
* Check the permissions on the `/var/spool/asterisk/monitor/` directory.
* Ensure the `DAYS` environment variable matches the intended retention period.

