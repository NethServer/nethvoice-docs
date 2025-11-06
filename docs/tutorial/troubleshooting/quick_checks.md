---
title: Quick Checks
sidebar_position: 2
---

## Overview {#overview}

To provide you with effective and timely support for **NethVoice on NS8**, we need a minimum set of diagnostic information.  
Without these details, it is not possible to perform an accurate analysis.

Please describe in as much detail as possible the **network conditions** of any devices external to NethVoice — such as phones, media gateways, DECT base stations, routers, or separate networks not directly configured on NethServer interfaces.

## Step 1 – Check System Resource Usage {#step-1--check-system-resource-usage}

Before opening a support ticket, check system performance to rule out resource-related issues. The commands below show a quick snapshot of CPU, memory and disk usage — instead of attaching files, copy and paste the terminal output into your ticket body inside triple backticks so support can read it quickly.

Run these commands as root and copy-paste their output. Example commands and how to paste them safely into a ticket:

```bash
# snapshot of processes and realtime load (non-interactive)
top -b -n 1

# disk usage (human readable)
df -h

# memory usage, including swap (human readable)
free -h
```

How to paste into the ticket (recommended):

1. Run the command on the server.
2. Select the full output in your terminal and copy it.


What to look for:

- Load / CPU: check the "load average" values in `top` (first line). A load significantly higher than the number of CPU cores may indicate CPU pressure. Inside `top`, look for processes using high %CPU.
- Memory: `free -h` shows used and available memory and swap. Persistent high swap usage suggests memory exhaustion.
- Disk: `df -h` shows filesystem usage. Pay attention to the partition where `/var` and `/var/log` live — if they are full, services may fail or logs may be truncated.

Quick inspection commands (run and copy-paste their outputs):

```bash
# top-like list of top CPU processes
ps aux --sort=-%cpu | head -n 10

# biggest directories in /var (helpful if logs fill disk)
du -sh /var/* | sort -h | tail -n 20
```

If you still prefer attaching files, please compress them first, but copy-pasting the command outputs in the ticket body is preferred and usually quicker for support to inspect.

Suggested immediate remediation steps (if you find problems):

- High CPU by a specific process: investigate that process (check its logs, consider restarting it if safe).
- Low available memory / high swap: consider restarting memory-heavy services or provisioning more RAM; check for memory leaks.
- Full filesystem: remove or rotate old logs, clear temporary files, or increase disk capacity.

Collecting these snapshots before and after reproducing the issue helps support identify transient vs persistent problems.

## Step 2 – Verify Network Configuration {#step-2--verify-network-configuration}

To ensure the network configuration is correct, check network interfaces and routing tables:

```bash
ip a
ip r
```

These outputs will help you confirm that:

* All required interfaces are **up**.
* Routing tables are **properly configured**.

A valid and consistent network setup is critical for VoIP and SIP communication.


## Step 3 – Collect Asterisk Logs {#step-3--collect-asterisk-logs}

Logs are essential to understand what happens at the moment of the issue.

Follow these steps to collect **Asterisk logs**:

1. Connect to the **NS8 cluster** via SSH.

2. Identify the NethVoice module name with:

   ```bash
   loginctl list-users | grep nethvoice
   ```

   For example, the module might be called `nethvoice1`.

3. Access the module environment:

   ```bash
   runagent -m nethvoiceX
   ```

   Replace `nethvoiceX` with the correct instance name.

4. Launch the Asterisk CLI in verbose mode:

   ```bash
   asterisk -rvvvvvv
   ```

5. Reproduce the issue.

6. Copy the relevant log output and save it into a text file.

7. Attach that file to your **support ticket**.

> **Tip:** Try to capture logs immediately before, during, and after the malfunction to provide full context.


## Step 4 – Capture SIP Traffic (Using SNGREP) {#step-4--capture-sip-traffic-using-sngrep}

To complement log analysis, you can also capture SIP traffic with **SNGREP**.

### Run a capture {#run-a-capture}

From the cluster, as root:

```bash
sngrep -r
```

If the command is **not recognized**, it means SNGREP is not installed. See how to [install SNGREP](./sngrep.md#installation).

Once the capture is complete:

1. Save the capture file.
2. Transfer it from the cluster to your local machine using an **SCP client** (for example, *WinSCP* on Windows).
3. Attach the capture file to your **support ticket**.

For a complete guide on how to use SNGREP for traffic analysis, refer to [the SNGREP troubleshooting guide](./sngrep.md).


## Summary {#summary}

Before requesting support for NethVoice, ensure you:

1. Verify system resources (`top`, `df -h`, `free -h`)
2. Check network interfaces and routing (`ip a`, `ip r`)
3. Collect **Asterisk logs** during the issue
4. Capture **SIP traffic** with SNGREP

Providing this information enables faster, more accurate diagnostics and helps the support team identify the root cause efficiently.

