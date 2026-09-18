---
title: Debug and reset NethVoie CTI user 2FA
sidebar_position: 5
---

# How to debug and reset CTI user 2FA

A CTI user may have enabled **Two-Factor Authentication (2FA)** and no longer be able to log in. You may also need to identify which users currently have 2FA enabled or reset the 2FA configuration for a specific user.

## Where is the CTI 2FA configuration stored?

In NethVoice, CTI user 2FA information is stored in the filesystem, inside the volume used by the `nethcti-middleware` container.

It will be used as a reference for NethVoice instance `nethvoice1`; it must be adjusted to match the actual instance number.

The configuration is stored under:

```text
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/
```

Inside this directory, there is one directory for each CTI user.

For example:

```text
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/giulias
/home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/andrear
```

The following files are related to the 2FA configuration:

* `secret` - 2FA secret key
* `codes` - recovery codes
* `status` - 2FA status

## How can I check if a user has 2FA enabled?

Enter the user's directory:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
```

Then list its contents:

```bash
ls
```

A user with **2FA enabled** typically has:

```text
codes
secret
status
```

For example:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/giulias
ls
```

Output:

```text
codes
secret
status
```

A user without active 2FA may only have:

```text
secret
```

or an empty directory.

## How can I list all users with 2FA enabled?

Run:

```bash
find /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/ \
  -mindepth 2 -maxdepth 2 \
  -type f -name status \
  -exec grep -q '^1$' {} \; \
  -print | sed 's|/status$||; s|.*/||'
```

The command checks for users whose `status` file contains `1` and prints their usernames.

Example output:

```text
giulias
user1
user2
```

## How can I reset 2FA for a CTI user?

Enter the user's 2FA directory:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
```

To reset the current 2FA activation while keeping the existing secret, remove `codes` and `status`:

```bash
rm -f codes status
```

Alternatively, to completely remove the stored 2FA configuration, including the secret key, remove all files from the user's directory:

```bash
rm -f *
```

After the reset:

* 2FA will no longer be active for the user
* the user will be able to log in to the CTI without entering an OTP code
* the user can configure 2FA again from the CTI profile if needed

## Quick reference

List users with 2FA enabled:

```bash
find /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/ \
  -mindepth 2 -maxdepth 2 \
  -type f -name status \
  -exec grep -q '^1$' {} \; \
  -print | sed 's|/status$||; s|.*/||'
```

Check a specific user:

```bash
cd /home/nethvoice1/.local/share/containers/storage/volumes/nethcti-middleware-secrets/_data/<username>
ls
```

Reset 2FA:

```bash
rm -f codes status
```

Completely remove the user's stored 2FA configuration:

```bash
rm -f *
```
