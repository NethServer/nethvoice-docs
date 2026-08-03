---
title: Call event scripts
sidebar_position: 8
---

# Call event scripts {#call-event-scripts}

NethVoice can execute custom scripts when a call is received and when it ends. This feature can be used to integrate NethVoice with CRM platforms, ticketing systems, business applications, or external HTTP services.

:::warning
Scripts run in the `freepbx` container. They must terminate quickly, handle errors without blocking the process, and treat all received data as untrusted input.
:::

## Prerequisites {#prerequisites}

Before proceeding:

* identify the NethVoice instance identifier, for example `nethvoice1`
* copy the script to the `/tmp` directory on the node
* access the instance environment:

```bash
runagent -m nethvoice1
```

* copy the script into the application, for example `SCRIPT.name`:

```bash
podman cp /tmp/SCRIPT.name freepbx:/var/lib/asterisk/agi-bin/SCRIPT.name
```

* change the owner and group:

```bash
podman exec freepbx chown asterisk.asterisk /var/lib/asterisk/agi-bin/SCRIPT.name
```

* make the script executable inside the container:

```bash
podman exec freepbx chmod 750 /var/lib/asterisk/agi-bin/SCRIPT.name
```

## Run a script when a call ends {#run-script-call-end}

Open `~/.config/state/environment` in the instance environment and add:

```ini
NETHCTI_CDR_SCRIPT=/var/lib/asterisk/agi-bin/SCRIPT.name
```

Restart the service to apply the environment variables. This restarts Asterisk and therefore terminates all active calls:

```bash
systemctl --user restart freepbx
```

To disable the hook, set an empty value and restart the service:

```ini
NETHCTI_CDR_SCRIPT=
```

NethVoice passes the following arguments to the script, in the same order:

| Position | Parameter            | Description                                                          |
| -------: | -------------------- | -------------------------------------------------------------------- |
|        1 | `source`             | Source number                                                        |
|        2 | `channel`            | Source channel                                                       |
|        3 | `endtime`            | End date and time                                                    |
|        4 | `duration`           | Total duration in seconds                                            |
|        5 | `amaflags`           | CDR AMA flags                                                        |
|        6 | `uniqueid`           | Unique channel identifier                                            |
|        7 | `callerid`           | Full caller ID                                                       |
|        8 | `starttime`          | Start date and time                                                  |
|        9 | `answertime`         | Answer date and time, if available                                   |
|       10 | `destination`        | Destination                                                          |
|       11 | `disposition`        | CDR result, for example `ANSWERED`, `NO ANSWER`, `BUSY`, or `FAILED` |
|       12 | `lastapplication`    | Last Asterisk application executed                                   |
|       13 | `billableseconds`    | Duration from when the call was answered until it ended              |
|       14 | `destinationcontext` | Destination context                                                  |
|       15 | `destinationchannel` | Destination channel                                                  |
|       16 | `accountcode`        | Channel account code                                                 |

## Run a script for an incoming external call {#run-script-incoming-call}

Open `~/.config/state/environment` in the instance environment and add:

```ini
NETHCTI_CDR_SCRIPT_CALL_IN=/var/lib/asterisk/agi-bin/SCRIPT.name
```

Restart the service to apply the environment variables. This restarts Asterisk and therefore terminates all active calls:

```bash
systemctl --user restart freepbx
```

To disable the hook, set an empty value and restart the service:

```ini
NETHCTI_CDR_SCRIPT_CALL_IN=
```

NethVoice passes the following arguments to the script, in the same order:

| Position | Parameter   | Description                       |
| -------: | ----------- | --------------------------------- |
|        1 | `callerNum` | Caller number                     |
|        2 | `uniqueId`  | Unique call or channel identifier |
|      ::: |             |                                   |

