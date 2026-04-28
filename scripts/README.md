# Scripts

This directory contains utility scripts for managing the NethVoice documentation.

## Migration Status Dashboard

### Generate migration-data.json

The script fetches `nethcti-server` and `nethcti-middleware` from GitHub (shallow clone)
and produces `static/migration-data.json`, read by the migration status dashboard page.
The Docusaurus build runs this extractor automatically through a plugin, so manual
invocation is only needed when refreshing the file outside a site build.

Default usage — always fetches the production reference branches (`ns8` for
`nethcti-server`, `main` for `nethcti-middleware`):

> **Requires Python 3.10 or later.**

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

Output is always written to `static/migration-data.json`. If the generated data is
identical to the existing file (excluding the `generated_at` timestamp and the `sources`
section which contains commit SHAs), the file is left unchanged so that CI does not
produce spurious commits. This means the commit SHAs shown in the dashboard reflect the
last run that actually changed endpoint data, not necessarily the latest commit.

### Manual endpoint mappings

When a legacy path is replaced by a new path with a different name in the middleware,
add `@migration-replaces` annotations in `nethcti-middleware/main.go` directly above
the route definition:

```go
// @migration-replaces: POST /authentication/old_endpoint
// @migration-note: Optional explanation of the change.
api.POST("/new/endpoint", methods.Handler)
```

- `@migration-replaces` must include the HTTP method and the **legacy** path.
- Multiple `@migration-replaces` lines can appear before a single route (one per legacy path).
- `@migration-note` is optional and accepts free-form text.
- The annotation block may contain blank lines and plain `//` comments between entries, but
  must not be interrupted by any other code before the route declaration.

The extraction script reads these annotations directly from the cloned middleware source —
no separate mapping file is needed.



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
