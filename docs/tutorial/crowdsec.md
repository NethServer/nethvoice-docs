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

CrowdSec exposes a **Settings** page in the cluster interface where you can
set the ban durations, mail notifications, and the CrowdSec Console
enrollment. Those options are common to every NethServer 8 installation, so
rather than repeat them here, refer to the [CrowdSec NethServer module documentation](https://docs.nethserver.org/docs/administrator-manual/applications/crowdsec)

## Enable NethVoice and Kamailio protection {#enable-nethvoice-kamailio}

New CrowdSec installations ship with the NethVoice parsers and scenarios
(listed [above](#crowdsec-protections)) already enabled — NethVoice, including
Kamailio SIP authentication, is fully protected out of the box.

If you are updating an existing CrowdSec module and the feature is disabled,
turn it on from the **Collections** page of the CrowdSec module in the
cluster interface:

1. Open the CrowdSec module and go to **Collections**.
2. Search for **nethvoice**.
3. Click **Enable** next to the `nethesis/nethvoice` entry.

To disable it again, click **Disable** on the same entry.

:::note SIP protection depends on the NethVoice Proxy
Detecting Kamailio SIP brute-force requires a NethVoice Proxy version that
exposes failed-SIP-auth source IPs to CrowdSec. If SIP bans never trigger,
upgrade the NethVoice Proxy module at least to version `1.6.4`.
:::

## Allowlist your trusted networks {#whitelist}

:::warning Avoid locking yourself out
Before you rely on CrowdSec in production, add your **office, VPN, and
monitoring IP addresses** to the allowlist. Allowlisted addresses are never
banned, so an administrator mistyping a password a few times will not be locked
out of the server.
:::

Open the CrowdSec module, go to **Blocklists**, select the **Allowlist** tab,
and enter your trusted IPs or networks (one per line). Save to apply.

## Detections and blocklists {#detections-blocklists}

The CrowdSec module UI shows what has been detected and blocked — no `cscli`
needed for day-to-day monitoring.

The **Detections** page lists every triggered scenario: date, scenario name,
source IP, country, decision (a red **Ban** tag for an active ban, blue for an
expired one, or `-` when no decision was taken), and event count. Open a
row's overflow menu and choose **Inspect** for full details — message,
scenario and version, attack window, events/capacity/leakspeed, decision,
remediation flag, and the underlying event log.

The **Blocklists** page, **Local** tab, lists every active local ban with its
remaining time. Use a row's overflow menu to remove a single ban, or
**Delete all** to clear every local ban at once.

To see CrowdSec react in real time, make repeated failed logins against the
NethVoice web interface from a test machine that isn't allowlisted, then
watch the offending IP appear on **Blocklists → Local** (or as a new entry on
**Detections**) once the failure threshold is reached.

:::tip Advanced: `cscli`
The `cscli` command-line tool (available via `runagent -m crowdsec1`) still
covers tasks the UI doesn't, such as adding a manual ban:

```bash
cscli decisions add --ip 192.0.2.10 --duration 4h --reason "manual block"
```
:::

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
