#!/usr/bin/env python3
"""
NethVoice API Migration Status Extractor

Parses nethcti-server (Node.js) and nethcti-middleware (Go/Gin) source code
to produce a JSON report categorising each REST endpoint by migration status.

Output schema:
  generated_at        ISO-8601 timestamp
  sources             commit SHAs for both repos
  stats               summary counts and migration percentage
  endpoints.server[]  all legacy server endpoints with migration status
  endpoints.middleware[] all middleware-native endpoints with class
"""

import argparse
import contextlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path


# ─── helpers ────────────────────────────────────────────────────────────────

def git_sha(repo_path: str) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", repo_path, "rev-parse", "HEAD"],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except Exception:
        return "unknown"


@contextlib.contextmanager
def clone_repo(repo: str, branch: str):
    """Clone repo from GitHub at a specific branch into a temp dir (shallow clone)."""
    tmpdir = tempfile.mkdtemp(prefix="migration-clone-")
    try:
        result = subprocess.run(
            ["git", "clone", "--depth", "1", "--branch", branch,
             f"https://github.com/{repo}.git", tmpdir],
            capture_output=True,
        )
        if result.returncode != 0:
            print(f"Error: could not clone '{repo}' branch '{branch}':\n{result.stderr.decode()}", file=sys.stderr)
            sys.exit(1)
        yield tmpdir
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def normalize_path(path: str) -> str:
    """Replace :param segments with {param} so paths can be compared."""
    return re.sub(r":([^/]+)", "{param}", path)


# ─── nethcti-server extraction ───────────────────────────────────────────────

def _extract_api_block(content: str) -> str | None:
    """
    Locate the  api: { ... }  object inside a JS plugin file.
    Uses brace counting to handle nesting correctly.
    """
    match = re.search(r"\bapi\s*:\s*\{", content)
    if not match:
        return None
    depth = 0
    for i in range(match.end() - 1, len(content)):
        if content[i] == "{":
            depth += 1
        elif content[i] == "}":
            depth -= 1
            if depth == 0:
                return content[match.start() : i + 1]
    return None


def _extract_string_array(block: str, method: str) -> list[str]:
    """Return items in the  'method': [ ... ]  array inside an api block."""
    arr_match = re.search(
        rf"'{re.escape(method)}'\s*:\s*\[([^\]]*)\]", block, re.DOTALL
    )
    if not arr_match:
        return []
    return re.findall(r"'([^']+)'", arr_match.group(1))


def extract_server_endpoints(server_path: str) -> list[dict]:
    """Walk plugins_rest/*.js files and return all declared REST endpoints."""
    plugins_dir = Path(server_path) / "root/usr/lib/node/nethcti-server/plugins"
    if not plugins_dir.exists():
        print(f"[WARN] plugins dir not found: {plugins_dir}", file=sys.stderr)
        return []

    endpoints = []
    method_map = {
        "get": "GET",
        "post": "POST",
        "put": "PUT",
        "del": "DELETE",
        "head": "HEAD",
    }

    for js_file in sorted(plugins_dir.rglob("plugins_rest/*.js")):
        content = js_file.read_text(encoding="utf-8", errors="replace")
        block = _extract_api_block(content)
        if not block:
            continue

        root_match = re.search(r"'root'\s*:\s*'([^']+)'", block)
        if not root_match:
            continue
        root = root_match.group(1)

        # Relative plugin name for traceability (e.g. com_user_rest)
        plugin = js_file.parts[-3]

        for js_method, http_method in method_map.items():
            for sub in _extract_string_array(block, js_method):
                endpoints.append(
                    {
                        "method": http_method,
                        "path": f"/{root}/{sub}",
                        "plugin": plugin,
                    }
                )

    return endpoints


# ─── nethcti-middleware extraction ───────────────────────────────────────────

_ROUTE_RE = re.compile(
    r'\b(?:router|api)\.(GET|POST|PUT|DELETE|HEAD|PATCH)\s*\(\s*"([^"]+)"'
)


def extract_middleware_endpoints(middleware_path: str) -> list[dict]:
    """Parse main.go and return all natively declared REST endpoints."""
    main_go = Path(middleware_path) / "main.go"
    if not main_go.exists():
        print(f"[WARN] main.go not found: {main_go}", file=sys.stderr)
        return []

    endpoints = []
    in_legacy_compat = False
    prev_was_blank = False

    for line in main_go.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()

        # Track the LEGACY COMPATIBILITY comment block
        if "LEGACY COMPATIBILITY" in stripped:
            in_legacy_compat = True
            prev_was_blank = False
            continue
        # Handle content inside the compat block
        if in_legacy_compat:
            if stripped == "":
                prev_was_blank = True
                continue
            if stripped.startswith("//"):
                # A comment after a blank line means a new section — end the block
                if prev_was_blank:
                    in_legacy_compat = False
                    prev_was_blank = False
                    continue
                # Continuation comment (same block, no blank before), keep going
                prev_was_blank = False
                continue
            prev_was_blank = False
        # A non-comment, non-blank, non-route line ends the compat block
        if in_legacy_compat and not _ROUTE_RE.search(stripped):
            in_legacy_compat = False

        m = _ROUTE_RE.search(stripped)
        if not m:
            continue

        http_method = m.group(1)
        path = m.group(2)

        # Classify the endpoint — skip admin and websocket (not REST migration targets)
        if path.startswith("/admin/") or path.startswith("/ws"):
            prev_was_blank = False
            continue
        elif in_legacy_compat:
            cls = "deprecated"
        else:
            cls = "native"

        endpoints.append({"method": http_method, "path": path, "class": cls})

    return endpoints


# ─── migration annotation parsing ───────────────────────────────────────────

_REPLACES_RE = re.compile(
    r"^//\s*@migration-replaces:\s+(GET|POST|PUT|DELETE|PATCH|HEAD)\s+(\S+)\s*$"
)
_NOTE_RE = re.compile(r"^//\s*@migration-note:\s+(.+)$")


def parse_migration_annotations(middleware_path: str) -> list[dict]:
    """
    Parse @migration-replaces / @migration-note annotations from main.go.

    Each annotation block must appear on consecutive lines (blank lines and
    plain comments allowed) immediately before a route definition.

    Returns a list of mappings with the same schema as the old migration-map.json:
      server_endpoints   list of {method, path}
      middleware_endpoint {method, path}
      notes              optional string
    """
    main_go = Path(middleware_path) / "main.go"
    if not main_go.exists():
        return []

    mappings: list[dict] = []
    pending_replaces: list[dict] = []
    pending_note: str = ""

    for line in main_go.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()

        m = _REPLACES_RE.match(stripped)
        if m:
            pending_replaces.append({"method": m.group(1), "path": m.group(2)})
            continue

        n = _NOTE_RE.match(stripped)
        if n:
            pending_note = n.group(1)
            continue

        # Blank lines and plain comments don't interrupt the block
        if stripped == "" or stripped.startswith("//"):
            continue

        r = _ROUTE_RE.search(stripped)
        if r and pending_replaces:
            mappings.append({
                "middleware_endpoint": {"method": r.group(1), "path": r.group(2)},
                "server_endpoints": pending_replaces,
                "notes": pending_note,
            })

        if pending_replaces and not r:
            print(
                f"[WARN] @migration-replaces annotation not followed by a route: {stripped!r}",
                file=sys.stderr,
            )

        # Any non-blank, non-comment line resets the pending block
        pending_replaces = []
        pending_note = ""

    if pending_replaces:
        print("[WARN] @migration-replaces annotation at EOF was never associated with a route.", file=sys.stderr)

    return mappings


# ─── categorisation ─────────────────────────────────────────────────────────

def categorise(
    server_eps: list[dict],
    middleware_eps: list[dict],
    manual_maps: list[dict],
) -> tuple[list[dict], list[dict]]:
    """
    Enrich server and middleware endpoint lists with migration status.

    Server endpoint statuses:
      migrated        exact path match found in middleware (after normalisation)
      manually-mapped explicitly declared via @migration-replaces annotations
      legacy-only     no native middleware counterpart

    Middleware endpoint classes stay as set by the extractor (native,
    deprecated).  Manually-mapped ones get an extra
    'migrated_from' field.
    """
    # Index middleware endpoints by normalised path for fast lookup
    mw_index: dict[tuple, dict] = {}
    for ep in middleware_eps:
        key = (ep["method"], normalize_path(ep["path"]))
        mw_index[key] = ep

    # Index server endpoints by normalised path
    srv_index: dict[tuple, dict] = {}
    for ep in server_eps:
        key = (ep["method"], normalize_path(ep["path"]))
        srv_index[key] = ep

    # Apply manual mappings first
    manually_mapped_srv: set[tuple] = set()
    manually_mapped_mw: set[tuple] = set()
    # Build lookup: (method, normalized_server_path) → new middleware path
    srv_to_replacement: dict[tuple, str] = {}
    for mapping in manual_maps:
        mw_ep = mapping.get("middleware_endpoint", {})
        mw_key = (mw_ep.get("method", ""), normalize_path(mw_ep.get("path", "")))
        notes = mapping.get("notes", "")
        for srv_ep in mapping.get("server_endpoints", []):
            srv_key = (srv_ep.get("method", ""), normalize_path(srv_ep.get("path", "")))
            manually_mapped_srv.add(srv_key)
            srv_to_replacement[srv_key] = mw_ep.get("path", "")
            # Annotate the matching server endpoint
            if srv_key in srv_index:
                srv_index[srv_key]["status"] = "manually-mapped"
                srv_index[srv_key]["mapped_to"] = mw_ep.get("path", "")
                srv_index[srv_key]["notes"] = notes
        # Annotate the matching middleware endpoint
        if mw_key in mw_index:
            mw_index[mw_key]["migrated_from"] = [
                ep.get("path", "") for ep in mapping.get("server_endpoints", [])
            ]
            mw_index[mw_key]["manually_mapped"] = True
            manually_mapped_mw.add(mw_key)

    # Auto-match remaining server endpoints by normalised path
    annotated_server: list[dict] = []
    for ep in server_eps:
        key = (ep["method"], normalize_path(ep["path"]))
        if "status" in ep:
            # Already handled by manual mapping
            annotated_server.append(ep)
            continue
        if key in mw_index:
            ep["status"] = "migrated"
            ep["migrated_to"] = mw_index[key]["path"]
        else:
            ep["status"] = "legacy-only"
        annotated_server.append(ep)

    # Auto-annotate middleware endpoints that auto-matched a server endpoint
    annotated_middleware: list[dict] = []
    for ep in middleware_eps:
        key = (ep["method"], normalize_path(ep["path"]))
        if ep.get("class") == "deprecated" and key in srv_to_replacement:
            ep["replaced_by"] = srv_to_replacement[key]
            ep["manually_mapped"] = True
        elif key not in manually_mapped_mw and key in srv_index:
            ep["migrated_from"] = [srv_index[key]["path"]]
        annotated_middleware.append(ep)

    return annotated_server, annotated_middleware


# ─── stats ──────────────────────────────────────────────────────────────────

def compute_stats(server_eps: list[dict], middleware_eps: list[dict]) -> dict:
    total_legacy = len(server_eps)
    migrated = sum(
        1 for ep in server_eps if ep.get("status") in ("migrated", "manually-mapped")
    )
    legacy_only = total_legacy - migrated

    # Only count endpoints that were in the legacy server
    migration_pct = round(migrated / total_legacy * 100, 1) if total_legacy else 0.0

    mw_by_class: dict[str, int] = {}
    for ep in middleware_eps:
        cls = ep.get("class", "native")
        mw_by_class[cls] = mw_by_class.get(cls, 0) + 1

    new_mw = sum(
        1 for ep in middleware_eps
        if not ep.get("migrated_from") and ep.get("class") not in ("deprecated",)
    )

    return {
        "total_legacy": total_legacy,
        "migrated": migrated,
        "legacy_only": legacy_only,
        "migration_percentage": migration_pct,
        "middleware_by_class": mw_by_class,
        "new_in_middleware": new_mw,
    }


# ─── main ───────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
OUTPUT_PATH = REPO_ROOT / "static" / "migration-data.json"

SERVER_REPO = "nethesis/nethcti-server"
MIDDLEWARE_REPO = "nethesis/nethcti-middleware"


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract NethVoice API migration status")
    parser.add_argument("--server-branch", default="ns8", help="nethcti-server branch (default: ns8)")
    parser.add_argument("--middleware-branch", default="main", help="nethcti-middleware branch (default: main)")
    parser.add_argument("--force", action="store_true", help="Always write output even if endpoint data has not changed")
    args = parser.parse_args()

    with clone_repo(SERVER_REPO, args.server_branch) as server_path, \
         clone_repo(MIDDLEWARE_REPO, args.middleware_branch) as middleware_path:

        server_eps = extract_server_endpoints(server_path)
        middleware_eps = extract_middleware_endpoints(middleware_path)
        manual_maps = parse_migration_annotations(middleware_path)

        server_eps, middleware_eps = categorise(server_eps, middleware_eps, manual_maps)
        stats = compute_stats(server_eps, middleware_eps)

        output = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "sources": {
                "nethcti_server": {
                    "repo": SERVER_REPO,
                    "branch": args.server_branch,
                    "commit": git_sha(server_path),
                },
                "nethcti_middleware": {
                    "repo": MIDDLEWARE_REPO,
                    "branch": args.middleware_branch,
                    "commit": git_sha(middleware_path),
                },
            },
            "stats": stats,
            "endpoints": {
                "server": server_eps,
                "middleware": middleware_eps,
            },
        }

        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

        def endpoint_data(d: dict) -> dict:
            """Return only the parts that matter for change detection (not timestamps or commit SHAs)."""
            return {k: v for k, v in d.items() if k not in ("generated_at", "sources")}

        existing = {}
        if OUTPUT_PATH.exists():
            try:
                existing = json.loads(OUTPUT_PATH.read_text())
            except Exception:
                pass

        if not args.force and endpoint_data(output) == endpoint_data(existing):
            print("No changes to migration data, skipping write.", file=sys.stderr)
        else:
            OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
            print(
                f"Generated {OUTPUT_PATH}: "
                f"{stats['total_legacy']} legacy endpoints, "
                f"{stats['migrated']} migrated ({stats['migration_percentage']}%)",
                file=sys.stderr,
            )


if __name__ == "__main__":
    main()
