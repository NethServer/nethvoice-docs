---
title: Debug calls with SNGREP
sidebar_position: 4
---

## SNGREP: what it is and why to use it {#sngrep-what-it-is-and-why-to-use-it}

**Sngrep** is a command-line tool that captures all **VoIP SIP** traffic passing through the network interfaces and displays it grouped by conversation for better readability.

It is especially useful for:
- Viewing what happens at the **SIP** level.  
- Understanding what **NethVoice** sends and receives.  
- Reducing the time needed to identify **configuration errors**.  
- Saving captures to send directly to **Nethesis support**, speeding up troubleshooting.  
- Capturing **sporadic issues** that cannot be easily reproduced or monitored in real time.

:::note
Sngrep only interprets **plain SIP traffic**. It does **not** capture:
 - Traffic from phones configured with **TLS**  
 - Traffic between the **proxy app (Flexysip)** and applications  
 - **WebRTC CTI** traffic (from *Janus* to browser clients)  

To analyze these cases as well, you need to **enable TLS support** in Sngrep as described below.

:::

## Installation {#installation}

If sngrep is not already installed on your NethServer, you can install it easily.
Execute the following command as root from the cluster:

```bash
dnf -y install http://repo.okay.com.mx/centos/9/x86_64/release/sngrep-1.6.0-1.el9.x86_64.rpm 
```

## Launching Sngrep {#launching-sngrep}

The quickest way to start a live capture is to run (as root):

```bash
sngrep
```

### Useful options {#useful-options}

| Option        | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `-r`          | Captures **RTP** traffic as well, useful if you want to save audio streams. |
| `-I [file]`   | Reads a saved capture file instead of capturing live traffic.               |
| `-O [file]`   | Saves the current capture directly to a file.                               |
| `-c`          | Captures only **INVITE** messages (incoming/outgoing calls).                |
| `-d [device]` | Limits the capture to a specific network interface (default: any).          |


## Using the interface {#using-the-interface}

Once started, Sngrep will begin showing all SIP dialogs in real time.
At the top, you can see the number of dialogs captured (default limit: 20,000).

### Main controls {#main-controls}

* **Arrow keys:** scroll through dialogs.
* **Enter:** view SIP messages of the selected dialog.
* **Spacebar:** select or deselect a message or dialog.
* **F2:** save a `.pcap` capture file (includes audio if started with `-r`).
* **F3:** view RTP streams, packets, and codec information.
* **F7:** set filters (useful for removing irrelevant dialogs like `OPTIONS` or `SUBSCRIBE`).
* **F10:** add or remove columns (e.g. “Time”).
* **ESC:** exit Sngrep.


## Enable TLS in SNGREP {#enable-tls-in-sngrep}

To visualize **TLS traffic** in SNGREP for NethVoice, follow these steps.

### 1. Enable `siptrace` in Kamailio {#1-enable-siptrace-in-kamailio}

```bash
runagent -m nethvoice-proxy1 kamcmd siptrace.status on
```


### 2. Create the configuration file {#2-create-the-configuration-file}

Create `/root/.sngrephep2rc` with the following content:

```bash
cat > /root/.sngrephep2rc <<'EOF'
set capture.device lo
set eep.listen on
set eep.listen.version 2
set eep.listen.address 127.0.0.1
set eep.listen.port 5065
EOF
```


### 3. Start SNGREP {#3-start-sngrep}

Run:

```bash
sngrep -f ~/.sngrephep2rc -d any
```

> **Note:**
> Only **one user at a time** can run Sngrep using this configuration.
> Multiple simultaneous sessions are **not supported**.


### 4. (Optional) Enable Kamailio Debug Logging {#4-optional-enable-kamailio-debug-logging}

To enable debug logging:

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvSet debug int 1
```

#### Disable it when finished {#disable-it-when-finished}

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvSet debug int 0
```

#### Check current debug status {#check-current-debug-status}

```bash
runagent -m nethvoice-proxy1 kamcmd pv.shvGet debug
```


## Example screens {#example-screens}

* **Main screen:** shows captured SIP dialogs and their states.

  ![Main screen](/img/administrator-manual/sngrep1.png)

* **Incoming call example:** Screenshot of an incoming call (INVITE) from the trunk that was answered by internal extension 201. You can see the two call legs: the one between the trunk and NethVoice, and the one from NethVoice to internal extension 200.

  ![Incoming call example](/img/administrator-manual/sngrep2.png)

* **Multiple dialog view:** allows comparing SIP messages exchanged in parallel between call legs.

  ![Multiple dialog view](/img/administrator-manual/sngrep3.png)

## Summary {#summary}

With this configuration, SNGREP can capture and visualize both **SIP** and **TLS** traffic on NethVoice NS8.
It is an essential tool for:

* Call analysis
* Quick configuration troubleshooting
* Advanced technical support

Always remember to **disable Kamailio debug logging** after finishing your analysis.
