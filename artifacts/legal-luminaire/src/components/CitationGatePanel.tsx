/**
 * CitationGatePanel — Legal Luminaire
 * ─────────────────────────────────────────────────────────────────────────────
 * Sidebar panel that shows live citation verification results while the lawyer
 * types in the draft editor. Renders per-citation verdicts and a hard-block
 * banner when PENDING/FATAL_ERROR citations are detected.
 */

import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { GateResult, CitationMatch } from "@/lib/citation-gate";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Status colour helpers ────────────────────────────────────────────────────

function statusColor(status: CitationMatch["status"]) {
  switch (status) {
    case "SAFE":    return "text-emerald-600 dark:text-emerald-400";
    case "WARN":    return "text-amber-600 dark:text-amber-400";
    case "BLOCKED": return "text-red-600 dark:text-red-400";
  }
}

function statusBg(status: CitationMatch["status"]) {
  switch (status) {
    case "SAFE":    return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800";
    case "WARN":    return "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800";
    case "BLOCKED": return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
  }
}

function StatusIcon({ status }: { status: CitationMatch["status"] }) {
  const cls = `w-4 h-4 flex-shrink-0 ${statusColor(status)}`;
  switch (status) {
    case "SAFE":    return <CheckCircle2 className={cls} />;
    case "WARN":    return <AlertTriangle className={cls} />;
    case "BLOCKED": return <XCircle className={cls} />;
  }
}

function tierBadge(tier: CitationMatch["tier"]) {
  if (!tier) return null;
  const map: Record<string, string> = {
    COURT_SAFE:    "bg-emerald-100 text-emerald-800 border-emerald-300",
    VERIFIED:      "bg-blue-100 text-blue-800 border-blue-300",
    SECONDARY:     "bg-amber-100 text-amber-800 border-amber-300",
    PENDING:       "bg-red-100 text-red-800 border-red-300",
    FATAL_ERROR:   "bg-red-200 text-red-900 border-red-400",
    UNRECOGNISED:  "bg-gray-100 text-gray-700 border-gray-300",
  };
  return (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${map[tier] ?? map.UNRECOGNISED}`}>
      {tier}
    </span>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface CitationGatePanelProps {
  result: GateResult;
  /** If true, shows a compact inline version (no scroll area) */
  compact?: boolean;
}

export function CitationGatePanel({ result, compact = false }: CitationGatePanelProps) {
  const { overallStatus, matches, hardBlock, summary } = result;

  // ── Overall status banner ──
  const bannerBg =
    hardBlock
      ? "bg-red-600 text-white"
      : overallStatus === "WARN"
      ? "bg-amber-500 text-white"
      : "bg-emerald-600 text-white";

  const BannerIcon =
    hardBlock ? ShieldX : overallStatus === "WARN" ? ShieldAlert : ShieldCheck;

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* ── Banner ── */}
      <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 ${bannerBg}`}>
        <BannerIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-semibold leading-snug">{summary}</p>
      </div>

      {/* ── Hard-block notice ── */}
      {hardBlock && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-700 dark:text-red-300 font-medium leading-snug">
          ⛔ Finalization is BLOCKED. Remove or verify all blocked citations before marking this draft as Final or Sent.
        </div>
      )}

      {/* ── Per-citation list ── */}
      {matches.length === 0 ? (
        <p className="text-xs text-muted-foreground px-1">
          No case law or standards detected in the draft body.
        </p>
      ) : compact ? (
        <CitationList matches={matches} />
      ) : (
        <ScrollArea className="max-h-[420px] pr-1">
          <CitationList matches={matches} />
        </ScrollArea>
      )}

      {/* ── Legend ── */}
      <div className="border-t pt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> COURT_SAFE / VERIFIED</span>
        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> SECONDARY</span>
        <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> PENDING / BLOCKED</span>
      </div>
    </div>
  );
}

function CitationList({ matches }: { matches: CitationMatch[] }) {
  return (
    <div className="space-y-2">
      {matches.map((m, i) => (
        <div
          key={i}
          className={`rounded-lg border px-3 py-2 space-y-1 ${statusBg(m.status)}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <StatusIcon status={m.status} />
              <span className={`font-semibold text-xs truncate ${statusColor(m.status)}`}>
                {m.registryEntry?.name ?? m.rawMatch.slice(0, 50)}
              </span>
            </div>
            {tierBadge(m.tier)}
          </div>

          {m.registryEntry && (
            <p className="text-[10px] text-muted-foreground font-mono pl-5">
              {m.registryEntry.citation}
            </p>
          )}

          <p className="text-[11px] leading-snug pl-5 text-foreground/80">
            {m.reason}
          </p>

          {/* Required actions for blocked/warn */}
          {m.registryEntry && m.registryEntry.requiredActions.length > 0 && m.status !== "SAFE" && (
            <ul className="pl-5 mt-1 space-y-0.5">
              {m.registryEntry.requiredActions.slice(0, 2).map((action, j) => (
                <li key={j} className="text-[10px] text-muted-foreground flex items-start gap-1">
                  <span className="mt-0.5">→</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Source link */}
          {m.registryEntry?.sources?.[0] && (
            <a
              href={m.registryEntry.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-5 flex items-center gap-1 text-[10px] text-blue-600 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {m.registryEntry.sources[0].label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
