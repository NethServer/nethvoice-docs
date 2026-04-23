import type { ReactNode, CSSProperties } from "react";
import { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import useBaseUrl from "@docusaurus/useBaseUrl";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServerEndpoint = {
  method: string;
  path: string;
  plugin: string;
  status: "migrated" | "legacy-only" | "manually-mapped";
  migrated_to?: string;
  mapped_to?: string;
  notes?: string;
};

type MiddlewareEndpoint = {
  method: string;
  path: string;
  class: "native" | "compatibility" | "admin" | "websocket";
  migrated_from?: string[];
  replaced_by?: string;
  manually_mapped?: boolean;
};

type MigrationData = {
  generated_at: string;
  sources: {
    nethcti_server: { repo: string; branch: string; commit: string };
    nethcti_middleware: { repo: string; branch: string; commit: string };
  };
  stats: {
    total_legacy: number;
    migrated: number;
    legacy_only: number;
    migration_percentage: number;
    middleware_by_class: Record<string, number>;
    new_in_middleware: number;
  };
  endpoints: {
    server: ServerEndpoint[];
    middleware: MiddlewareEndpoint[];
  };
};

// ─── Constants ───────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  DELETE: "#f93e3e",
  HEAD: "#9012fe",
  PATCH: "#50e3c2",
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  migrated: { label: "Migrated", color: "#fff", bg: "#28a745" },
  "manually-mapped": { label: "Mapped", color: "#fff", bg: "#17a2b8" },
  "legacy-only": { label: "Legacy", color: "#fff", bg: "#dc3545" },
};

const CLASS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  native: { label: "Native", color: "#fff", bg: "#28a745" },
  compatibility: { label: "Deprecated", color: "#212529", bg: "#ffc107" },
  admin: { label: "Admin", color: "#fff", bg: "#6c757d" },
  websocket: { label: "WebSocket", color: "#fff", bg: "#17a2b8" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  return (
    <code
      style={{
        background: METHOD_COLORS[method] ?? "#999",
        color: "#fff",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        display: "inline-block",
        minWidth: 52,
        textAlign: "center",
      }}
    >
      {method}
    </code>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: "0.72rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        background: "var(--ifm-color-emphasis-200)",
        borderRadius: 8,
        height: 12,
        overflow: "hidden",
        flex: 1,
        minWidth: 100,
      }}
    >
      <div
        style={{
          background: "var(--ifm-color-primary)",
          height: "100%",
          width: `${pct}%`,
          transition: "width 0.6s ease",
          borderRadius: 8,
        }}
      />
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "var(--ifm-card-background-color)",
        border: "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: 8,
        padding: "16px 24px",
        textAlign: "center",
        flex: "1 1 0",
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: color ?? "var(--ifm-font-color-base)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--ifm-color-emphasis-600)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function EndpointTable<T extends { method: string; path: string }>({
  endpoints,
  renderExtra,
}: {
  endpoints: T[];
  renderExtra: (ep: T) => ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const methods = ["ALL", ...Array.from(new Set(endpoints.map((e) => e.method))).sort()];
  const filtered = endpoints.filter((ep) => {
    const matchMethod = methodFilter === "ALL" || ep.method === methodFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || ep.path.toLowerCase().includes(q) || ep.method.toLowerCase().includes(q);
    return matchMethod && matchSearch;
  });

  return (
    <div style={{ width: "100%", minWidth: 0, flexShrink: 0 }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="Filter by path…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid var(--ifm-color-emphasis-300)",
            background: "var(--ifm-background-color)",
            color: "var(--ifm-font-color-base)",
            fontSize: "0.9rem",
          }}
        />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid var(--ifm-color-emphasis-300)",
                background: methodFilter === m ? "var(--ifm-color-primary)" : "var(--ifm-background-color)",
                color: methodFilter === m ? "#fff" : "var(--ifm-font-color-base)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: "0.8rem", color: "var(--ifm-color-emphasis-600)", marginBottom: 8 }}>
        {filtered.length} of {endpoints.length} endpoints
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--ifm-color-emphasis-200)" }}>
              <th style={{ ...thStyle, width: "7%" }}>Method</th>
              <th style={{ ...thStyle, width: "55%" }}>Path</th>
              <th style={{ ...thStyle }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: 24, color: "var(--ifm-color-emphasis-500)" }}>
                  No endpoints match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((ep) => (
                <tr
                  key={`${ep.method}:${ep.path}`}
                  style={{ borderBottom: "1px solid var(--ifm-color-emphasis-100)" }}
                >
                  <td style={tdStyle}>
                    <MethodBadge method={ep.method} />
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "var(--ifm-font-family-monospace)", wordBreak: "break-all", overflowWrap: "anywhere" }}>
                    {ep.path}
                  </td>
                  <td style={tdStyle}>{renderExtra(ep)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  color: "var(--ifm-color-emphasis-600)",
  fontWeight: 600,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: CSSProperties = {
  padding: "8px 12px",
  verticalAlign: "top",
};

// ─── Main page ───────────────────────────────────────────────────────────────

type TabKey = "server" | "middleware";

export default function MigrationStatus(): ReactNode {
  const [data, setData] = useState<MigrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("server");
  const [serverFilter, setServerFilter] = useState<string>("ALL");
  const [middlewareFilter, setMiddlewareFilter] = useState<string>("ALL");
  const migrationDataUrl = useBaseUrl("/migration-data.json");

  useEffect(() => {
    fetch(migrationDataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [migrationDataUrl]);

  const filteredServer =
    data?.endpoints.server.filter(
      (ep) => serverFilter === "ALL" ||
        (serverFilter === "migrated" ? (ep.status === "migrated" || ep.status === "manually-mapped") : ep.status === serverFilter)
    ) ?? [];

  const filteredMiddleware =
    data?.endpoints.middleware.filter(
      (ep) => middlewareFilter === "ALL" || ep.class === middlewareFilter
    ) ?? [];

  return (
    <Layout
      title="API Migration Status"
      description="Track migration progress from nethcti-server to nethcti-middleware"
    >
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <Heading as="h1" style={{ marginBottom: 4 }}>
          API Migration Status
        </Heading>
        <p style={{ color: "var(--ifm-color-emphasis-600)", marginBottom: 24 }}>
          Migration progress from{" "}
          <code>nethcti-server</code> (legacy) to{" "}
          <code>nethcti-middleware</code> (new backend).
          Endpoints not yet natively implemented in the middleware are transparently
          proxied to the legacy server.
        </p>

        {/* Error state */}
        {error && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 24,
              color: "#856404",
            }}
          >
            <strong>⚠ Could not load migration data</strong>
            <br />
            {error}. Run{" "}
            <code>python3 scripts/extract-migration-status.py …</code> to generate it.
          </div>
        )}

        {/* Loading state */}
        {!data && !error && (
          <p style={{ color: "var(--ifm-color-emphasis-500)" }}>Loading…</p>
        )}

        {data && (
          <>
            {/* Stats cards */}
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <StatCard value={data.stats.total_legacy} label="Legacy endpoints" />
              <StatCard
                value={data.stats.migrated}
                label="Migrated"
                color="#28a745"
              />
              <StatCard
                value={data.stats.legacy_only}
                label="Still proxied"
                color="#dc3545"
              />
              <StatCard
                value={data.stats.new_in_middleware}
                label="New in middleware"
                color="#5b6af0"
              />
            </div>

            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--ifm-color-emphasis-600)", whiteSpace: "nowrap" }}>
                Migration progress
              </span>
              <ProgressBar pct={data.stats.migration_percentage} />
              <span style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {data.stats.migration_percentage}%
              </span>
            </div>

            {/* Source info */}
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--ifm-color-emphasis-500)",
                marginBottom: 32,
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 24px",
              }}
            >
              <span>
                Updated: {new Date(data.generated_at).toLocaleString()}
              </span>
              <span>
                nethcti-server:{" "}
                <a
                  href={`https://github.com/${data.sources.nethcti_server.repo}/commit/${data.sources.nethcti_server.commit}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <code>{data.sources.nethcti_server.commit.slice(0, 7)}</code>
                </a>
              </span>
              <span>
                nethcti-middleware:{" "}
                <a
                  href={`https://github.com/${data.sources.nethcti_middleware.repo}/commit/${data.sources.nethcti_middleware.commit}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <code>{data.sources.nethcti_middleware.commit.slice(0, 7)}</code>
                </a>
              </span>
            </div>

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Endpoint tabs"
              style={{ borderBottom: "2px solid var(--ifm-color-emphasis-200)", marginBottom: 24, display: "flex", gap: 0 }}
            >
              {(
                [
                  { key: "server", label: `Legacy server (${data.endpoints.server.length})` },
                  { key: "middleware", label: `Middleware native (${data.endpoints.middleware.length})` },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderBottom: tab === key ? "2px solid var(--ifm-color-primary)" : "2px solid transparent",
                    marginBottom: -2,
                    background: "transparent",
                    color: tab === key ? "var(--ifm-color-primary)" : "var(--ifm-color-emphasis-600)",
                    fontWeight: tab === key ? 700 : 400,
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Server tab */}
            {tab === "server" && (
              <>
                {/* Status filter pills */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {["ALL", "legacy-only", "migrated"].map((f) => {
                    const count =
                      f === "ALL"
                        ? data.endpoints.server.length
                        : f === "migrated"
                        ? data.endpoints.server.filter((e) => e.status === "migrated" || e.status === "manually-mapped").length
                        : data.endpoints.server.filter((e) => e.status === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setServerFilter(f)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 16,
                          border: "1px solid var(--ifm-color-emphasis-300)",
                          background: serverFilter === f ? "var(--ifm-color-primary)" : "transparent",
                          color: serverFilter === f ? "#fff" : "var(--ifm-font-color-base)",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                        }}
                      >
                        {f === "ALL" ? "All" : STATUS_BADGE[f]?.label ?? f} ({count})
                      </button>
                    );
                  })}
                </div>

                <EndpointTable
                  endpoints={filteredServer}
                  renderExtra={(ep) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <Badge {...STATUS_BADGE[ep.status === "manually-mapped" ? "migrated" : ep.status]} />
                        {ep.status === "manually-mapped" && (
                          <span style={{
                            fontSize: "0.72rem",
                            padding: "1px 6px",
                            borderRadius: 4,
                            border: "1px solid var(--ifm-color-emphasis-300)",
                            color: "var(--ifm-color-emphasis-600)",
                          }}>Mapped</span>
                        )}
                        <span style={{ fontSize: "0.78rem", color: "var(--ifm-color-emphasis-500)" }}>
                          {ep.plugin.replace("com_", "").replace("_rest", "")}
                        </span>
                      </div>
                      {(ep.migrated_to || ep.mapped_to) && (
                        <div style={{ fontSize: "0.78rem", color: "var(--ifm-color-emphasis-600)" }}>
                          → <code>{ep.migrated_to || ep.mapped_to}</code>
                        </div>
                      )}
                      {ep.notes && (
                        <div style={{ fontSize: "0.75rem", color: "var(--ifm-color-emphasis-500)", fontStyle: "italic" }}>
                          {ep.notes}
                        </div>
                      )}
                    </div>
                  )}
                />
              </>
            )}

            {/* Middleware tab */}
            {tab === "middleware" && (
              <>
                {/* Class filter pills */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {["ALL", "native", "compatibility", "admin", "websocket"].map((f) => {
                    const count =
                      f === "ALL"
                        ? data.endpoints.middleware.length
                        : data.endpoints.middleware.filter((e) => e.class === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setMiddlewareFilter(f)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 16,
                          border: "1px solid var(--ifm-color-emphasis-300)",
                          background: middlewareFilter === f ? "var(--ifm-color-primary)" : "transparent",
                          color: middlewareFilter === f ? "#fff" : "var(--ifm-font-color-base)",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                        }}
                      >
                        {f === "ALL" ? "All" : CLASS_BADGE[f]?.label ?? f} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Class legend */}
                <div
                  style={{
                    background: "var(--ifm-color-emphasis-100)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 16,
                    fontSize: "0.8rem",
                    color: "var(--ifm-color-emphasis-700)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                  }}
                >
                  <span><Badge {...CLASS_BADGE.native} /> Fully implemented in middleware</span>
                  <span><Badge {...CLASS_BADGE.compatibility} /> Legacy path kept for backward compatibility</span>
                  <span><Badge {...CLASS_BADGE.admin} /> Super-admin endpoint (no JWT)</span>
                  <span><Badge {...CLASS_BADGE.websocket} /> WebSocket (not a REST endpoint)</span>
                </div>

                <EndpointTable
                  endpoints={filteredMiddleware}
                  renderExtra={(ep) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <Badge {...CLASS_BADGE[ep.class]} />
                        {ep.manually_mapped && (
                          <span style={{
                            fontSize: "0.72rem",
                            padding: "1px 6px",
                            borderRadius: 4,
                            border: "1px solid var(--ifm-color-emphasis-300)",
                            color: "var(--ifm-color-emphasis-600)",
                          }}>Manually mapped</span>
                        )}
                      </div>
                      {ep.class !== "compatibility" && ep.migrated_from && ep.migrated_from.length > 0 && (
                        <div style={{ fontSize: "0.78rem", color: "var(--ifm-color-emphasis-600)" }}>
                          Replaces:{" "}
                          {ep.migrated_from.map((p, i) => (
                            <span key={i}>
                              <code>{p}</code>
                              {i < ep.migrated_from!.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      {ep.class === "compatibility" && ep.replaced_by && (
                        <div style={{ fontSize: "0.78rem", color: "var(--ifm-color-emphasis-600)" }}>
                          Replaced by: <code>{ep.replaced_by}</code>
                        </div>
                      )}
                    </div>
                  )}
                />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
