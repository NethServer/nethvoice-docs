---
title: Protect NethVoice from brute-force attacks (CrowdSec)
sidebar_position: 10
---

# Protect NethVoice from brute-force attacks with CrowdSec

Any NethVoice installation reachable from the Internet is a target. Attackers
run automated tools that hammer login forms and SIP endpoints, guessing
credentials thousands of times per hour. Left unchecked, this leads to account
lockouts, toll fraud, and degraded service.

[CrowdSec](https://www.crowdsec.net/) is a threat-detection engine available as
a **NethServer 8 application**. It watches your application logs for known
attack patterns (for example repeated failed logins), and when it finds one it
**bans the source IP address at the firewall** for a configurable amount of
time. This guide explains how to enable it on the node running NethVoice and
how to manage the bans it creates.

You can install **only one CrowdSec instance per node**, and it protects every application running
on that node — including NethVoice.

## CrowdSec protections {#crowdsec-protections}

CrowdSec's hub collections already include scenarios to block standard HTTP
attacks, such as quick brute-force attempts against login endpoints.

The NethServer CrowdSec module also adds NethVoice-specific scenarios that
detect:

- **HTTP brute-force and exploit-scan attacks** against the NethVoice CTI
  middleware.
- **Brute-force attacks** against the NethVoice admin API login endpoint
  (`/freepbx/rest/login`).
- **Brute-force attacks** against the NethVoice reports application login
  (`reports-api`).
- **SIP brute-force attacks** against Kamailio authentication.

Any of these triggers a ban of the source IP, same as the generic collections.

:::note New vs existing installations
These NethVoice protections are **enabled by default on new CrowdSec
installations** since version `1.2.0`. On updated installations where CrowdSec
was already present, the NethVoice scenarios are **disabled by default** and
must be turned on manually — see
[Enable NethVoice and Kamailio protection](#enable-nethvoice-kamailio) below.
:::

## Install CrowdSec {#install}

1. Open the **Software Center** in the NethServer 8 cluster interface.
2. Search for **CrowdSec** and click **Install**, selecting the same node that
   runs NethVoice.
3. Wait for the installation to finish. Protection is active immediately.

CrowdSec exposes a configuration page in the cluster interface where you can
set the ban durations, the IP whitelist, mail notifications, and the CrowdSec
Console enrollment. Those options are common to every NethServer 8
installation, so rather than repeat them here, refer to the [CrowdSec NethServer module documentation](https://docs.nethserver.org/docs/administrator-manual/applications/crowdsec)

## Enable NethVoice and Kamailio protection {#enable-nethvoice-kamailio}

New CrowdSec installations ship with the NethVoice parsers and
scenarios (listed [above](#crowdsec-protections)) already enabled. If your
updating an existing Crowdsec module and the feature is disabled,
turn it on by setting the `NETHVOICE_COLLECTION_ENABLED` variable in the module's `.env` file, then
restarting the module:

```bash
runagent -m crowdsec1 python3 -c 'import agent ; agent.set_env("NETHVOICE_COLLECTION_ENABLED", "True")'
systemctl restart crowdsec1
```

To disable it again, set the variable to `False` and restart:

```bash
runagent -m crowdsec1 python3 -c 'import agent ; agent.set_env("NETHVOICE_COLLECTION_ENABLED", "False")'
systemctl restart crowdsec1
```

:::note SIP protection depends on the NethVoice Proxy
Detecting Kamailio SIP brute-force requires a NethVoice Proxy version that
exposes failed-SIP-auth source IPs to CrowdSec. If SIP bans never trigger,
upgrade the NethVoice Proxy module at least to version `1.6.4`.
:::

## Whitelist your trusted networks {#whitelist}

:::warning Avoid locking yourself out
Before you rely on CrowdSec in production, add your **office, VPN, and
monitoring IP addresses** to the whitelist. Whitelisted addresses are never
banned, so an administrator mistyping a password a few times will not be locked
out of the server.
:::

Open the CrowdSec configuration page in the cluster interface and enter your
trusted IPs or networks (one per line) in the **whitelist** field. Save to
apply.

## Manage bans from the command line {#manage-bans}

CrowdSec provides the `cscli` command-line tool. To use it, enter the module
environment on the node first:

```bash
runagent -m crowdsec1
```

Then use the following commands.

**List the currently banned IPs (active decisions):**

```bash
cscli decisions list
```

**Remove a ban** — for example when a legitimate user was blocked:

```bash
# by IP address
cscli decisions delete --ip 192.0.2.10

# or by decision id (from the list above)
cscli decisions delete --id 12345
```

**Add a manual ban** — block an abusive IP yourself:

```bash
cscli decisions add --ip 192.0.2.10 --duration 4h --reason "manual block"
```

:::tip
`cscli decisions add` accepts flexible durations such as `30m`, `4h`, or `24h`.
Use a short duration when testing so you can quickly undo mistakes.
:::

**Review the detections that triggered** (some alerts do not result in a ban):

```bash
cscli alerts list
```


## Verify it is working {#verify}

From inside the module environment (`runagent -m crowdsec1`), confirm that
the detection rules are loaded and the enforcer is active:

```bash
# enabled protections
cscli scenarios list

# inspect metrics
cscli metrics
```

If NethVoice protection is enabled, `cscli scenarios list` should
include entries with `nethvoice` or `kamailio` in the name. Inspect one for
details, replacing `<name>` with the value from the list:

```bash
cscli scenarios inspect <name>
```

To see CrowdSec react in real time, watch the decisions list while a test
machine (not whitelisted) makes repeated failed logins against the NethVoice
web interface:

```bash
watch cscli decisions list
```

The offending IP should appear as a new decision once the failure threshold is
reached.

## Email alerts {#alerts}

CrowdSec can email a **daily report of banned IPs** and notify you when the
number of bans crosses a threshold. These notifications depend on the node
having a working mail configuration, and both the recipients and the threshold
are set on the CrowdSec configuration page — see the
[NethServer administrator manual](https://docs.nethserver.org/docs/administrator-manual/applications/crowdsec)
for details.

## Defense in depth for SIP {#defense-in-depth-sip}

CrowdSec bans an attacker after it recognizes a pattern, so it complements —
rather than replaces — basic hardening of your telephony ports:

- Publish SIP only to the trunks and remote phones that need it, not to the
  whole Internet.
- Use strong, non-guessable extension secrets.
- Terminate remote phones through the **NethVoice Proxy** rather than exposing
  Asterisk directly — this is also required for CrowdSec's Kamailio detection
  to see failed SIP authentication attempts (see
  [Enable NethVoice and Kamailio protection](#enable-nethvoice-kamailio)).

## Related tutorials {#related-tutorials}

* [Troubleshooting NethVoice](./troubleshooting/index.md)
* [Common deployment scenarios](./cloud_vs_onpremise.md)
