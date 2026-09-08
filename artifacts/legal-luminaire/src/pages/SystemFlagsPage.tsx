/**
 * /system/flags — Development-only feature flag inspector
 *
 * Hidden route for local development. Shows the current ON/OFF state of
 * every Week 1 integration flag with bilingual labels.
 * Works under Netlify SPA redirects (/* → /index.html 200).
 *
 * This page is intentionally read-only in the browser: flags are set via
 * VITE_FF_* environment variables at build time. The table below is a
 * live reflection of the compiled flag values — it is not a toggle UI.
 *
 * To enable a flag locally:
 *   echo "VITE_FF_ASK_COPILOT=true" >> artifacts/legal-luminaire/.env.local
 *   pnpm --filter @workspace/legal-luminaire run dev
 */

import React from "react";
import {
  integrationFlags,
  integrationFlagLabels,
  type IntegrationFlags,
} from "@/lib/featureFlags";

export default function SystemFlagsPage(): React.JSX.Element {
  const entries = Object.entries(integrationFlags) as [
    keyof IntegrationFlags,
    boolean,
  ][];

  return (
    <main
      className="max-w-3xl mx-auto px-6 py-10"
      aria-label="System flags / सिस्टम फ्लैग"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          System Flags
          <span className="ml-3 text-lg font-normal text-muted-foreground">
            / सिस्टम फ्लैग
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          12-week integration feature flags — all default OFF.
          <br />
          <span lang="hi">
            12-सप्ताह एकीकरण फ़ीचर फ्लैग — सभी डिफ़ॉल्ट रूप से बंद।
          </span>
        </p>
        <p className="mt-3 text-xs text-muted-foreground border border-border rounded px-3 py-2 bg-muted/40">
          <strong>Dev-only route.</strong> To enable a flag, set{" "}
          <code>VITE_FF_&lt;FLAG_NAME&gt;=true</code> in{" "}
          <code>.env.local</code> and restart the dev server.
        </p>
      </div>

      {/* ── Flag table ─────────────────────────────────────────── */}
      <div
        className="rounded-lg border border-border overflow-hidden"
        role="table"
        aria-label="Feature flag registry"
      >
        {/* Table header */}
        <div
          role="row"
          className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 bg-muted/60 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
        >
          <span role="columnheader">Week</span>
          <span role="columnheader">Flag / फ्लैग</span>
          <span role="columnheader">Status</span>
        </div>

        {/* Flag rows */}
        {entries.map(([key, enabled], i) => {
          const label = integrationFlagLabels[key];
          return (
            <div
              key={key}
              role="row"
              className={[
                "grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 py-3",
                "border-t border-border",
                i % 2 === 0 ? "bg-background" : "bg-muted/20",
              ].join(" ")}
            >
              {/* Week badge */}
              <span
                role="cell"
                className="text-xs font-mono text-muted-foreground w-12"
              >
                {label.week}
              </span>

              {/* Label (EN + HI) + env var */}
              <span role="cell" className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {label.en}
                </span>
                <span
                  lang="hi"
                  className="text-xs text-muted-foreground"
                >
                  {label.hi}
                </span>
                <code className="text-xs text-muted-foreground/70 font-mono">
                  VITE_FF_{key.toUpperCase()}
                </code>
              </span>

              {/* ON / OFF badge */}
              <span role="cell">
                {enabled ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    aria-label="Flag is ON"
                  >
                    <span aria-hidden="true">●</span> ON
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground"
                    aria-label="Flag is OFF"
                  >
                    <span aria-hidden="true">○</span> OFF
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer note ────────────────────────────────────────── */}
      <p className="mt-6 text-xs text-muted-foreground">
        Flags are compiled at build time from{" "}
        <code>VITE_FF_*</code> env vars.{" "}
        <strong>All flags default OFF</strong> — no experimental feature can
        destabilise the Netlify production demo.
        <br />
        <span lang="hi" className="mt-1 block">
          फ्लैग बिल्ड समय पर संकलित किए जाते हैं। सभी डिफ़ॉल्ट रूप से बंद हैं।
        </span>
      </p>
    </main>
  );
}
