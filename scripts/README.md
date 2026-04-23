# Scripts

This directory contains utility scripts for managing the NethVoice documentation.

## Migration Status Dashboard

### Generate migration-data.json

The script fetches `nethcti-server` and `nethcti-middleware` from GitHub (shallow clone)
and produces `static/migration-data.json`, read by the migration status dashboard page.

Default usage — always fetches the production reference branches (`ns8` for
`nethcti-server`, `main` for `nethcti-middleware`):

```bash
# run from the nethvoice-docs repo root
python3 scripts/extract-migration-status.py
```

To test against a different branch before merging:

```bash
python3 scripts/extract-migration-status.py \
  --server-branch my-feature-branch \
  --middleware-branch my-feature-branch
```

Only one of the two flags is needed if you want to override a single branch:

```bash
python3 scripts/extract-migration-status.py --server-branch my-fix
```

> **Note:** The script always clones directly from GitHub remote — it never reads
> local repository files. The branches it clones must therefore already be pushed to
> `origin`. There is nothing to commit or stash locally before running the script.

To force regeneration even when endpoint data has not changed (e.g. to update commit
SHAs or timestamps for a new deployment):

```bash
python3 scripts/extract-migration-status.py --force
```

 If the generated data is
identical to the existing file (excluding the `generated_at` timestamp and the `sources`
section which contains commit SHAs), the file is left unchanged so that CI does not
produce spurious commits. This means the commit SHAs shown in the dashboard reflect the
last run that actually changed endpoint data, not necessarily the latest commit.



### Import a RST Document

Enter this directory:
```
cd scripts
```

then run:
```
./import.sh https://raw.githubusercontent.com/NethServer/ns8-docs/refs/heads/main/nethvoice_proxy.rst
```

### Import a Freshdesk FAQ

```bash
FRESHDESK_API_TOKEN=xxx ./import-freshdesk-faq.sh https://helpdesk.nethesis.it/a/solutions/articles/3000128249
```

````
