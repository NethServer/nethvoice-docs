---
title: Queue Alarm Management
sidebar_position: 10
---

# Queue Alarm Management

The **NethVoice CTI Queue Manager** includes an alert system that monitors call queue activity and identifies critical situations, such as excessive numbers of waiting calls, long waiting times, or insufficient available operators.

Alerts are automatically triggered when specific thresholds are exceeded. These thresholds can be customized by the system administrator.

## Alert Types

The system provides four types of alerts:

| Alert | Description | Trigger condition |
|---|---|---|
| `queueload` | **High queue load** | The number of waiting calls exceeds MAX_CALLS **and** the average waiting time exceeds MAX_HOLDTIME. |
| `queuemaxwait` | **Excessive caller waiting time** | The number of waiting calls exceeds MAX_CALLS **and** the longest-waiting caller has been waiting for more than CALLERS_MAX_WAIT. |
| `queuefewop` | **Insufficient available operators** | The number of waiting calls exceeds the number of available operators multiplied by MAX_CALLS_PER_OP. |
| `queueholdtime` | **High average waiting time** | The average queue waiting time exceeds MAX_HOLDTIME. |

:::info
Alert conditions are evaluated periodically. For alerts with multiple conditions, all conditions must be met simultaneously.
:::

### Alert Examples

- **High queue load (`queueload`)**: A queue has 12 waiting calls, and the average waiting time is 150 seconds.
- **Excessive caller waiting time (`queuemaxwait`)**: A queue has 11 waiting calls, and the longest-waiting caller has been waiting for 300 seconds.
- **Insufficient available operators (`queuefewop`)**: There are 3 available operators and 7 waiting calls. The threshold is 3 × 2 = 6 calls.
- **High average waiting time (`queueholdtime`)**: The average waiting time reaches 140 seconds, regardless of the number of waiting calls.

## Alert Threshold Configuration

Alerts are enabled by default and use the following environment variables:

| Environment variable | Default value | Description |
|---|---|---|
| `NETHCTI_ALERTS` | `true` | Enables or disables the alert system. |
| `NETHCTI_ALERTS_MAX_CALLS` | `10` | Maximum number of waiting calls used by the high queue load and excessive caller waiting time alerts. |
| `NETHCTI_ALERTS_CALLERS_MAX_WAIT` | `250` | Maximum waiting time for the longest-waiting caller, in seconds. |
| `NETHCTI_ALERTS_CHECK_INTERVAL` | `30` | Interval between alert condition checks, in seconds. |
| `NETHCTI_ALERTS_MAX_CALLS_PER_OP` | `2` | Maximum number of waiting calls per available operator. |
| `NETHCTI_ALERTS_MAX_HOLDTIME` | `120` | Average queue waiting time threshold, in seconds. |

### Changing Alert Thresholds

Alert thresholds can be customized by modifying the corresponding environment variables of the `nethcti-server` service.

For example, to configure:

- A maximum threshold of 15 waiting calls.
- An average waiting time threshold of 180 seconds.
- An alert check interval of 20 seconds.

```bash
runagent -m nethvoiceX vim environment
```

Set the following values:

```bash
NETHCTI_ALERTS_MAX_CALLS=15
NETHCTI_ALERTS_MAX_HOLDTIME=180
NETHCTI_ALERTS_CHECK_INTERVAL=20
```

After modifying the environment variables, **restart the `nethcti-server` service** for the changes to take effect.

```bash
runagent -m nethvoiceX systemctl --user restart nethcti-server
```

:::info
Restarting the `nethcti-server` service disconnects CTI clients for a few seconds, then they reconnect automatically.
:::

### Disabling Alerts

To completely disable the alert system, set:

```bash
NETHCTI_ALERTS=false
```

To re-enable it:

```bash
NETHCTI_ALERTS=true
```

In both cases, restart the `nethcti-server` service to apply the changes.

## Alert Check Interval

The system periodically evaluates alert conditions according to the interval defined by `NETHCTI_ALERTS_CHECK_INTERVAL`.

The default value is **30 seconds**.

This means that exceeding a threshold does not necessarily trigger an alert immediately. The condition is detected during one of the subsequent checks.

A shorter interval allows critical conditions to be detected more quickly but increases the frequency of checks.

