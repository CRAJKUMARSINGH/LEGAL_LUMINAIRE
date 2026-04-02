import { useState } from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, ShieldCheck,
  ExternalLink, Download, Copy, Info, Lock, Unlock,
  FileText, FlaskConical, ChevronDown, ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PRECEDENT_ACCURACY, STANDARDS_ACCURACY,
  overallAccuracyScore, generateAccuracyReport,
  type AccuracyTier, type PrecedentAccuracy, type StandardAccuracy,
} from "@/lib/verification-engine";

// ── Tier config ───────────────────────────────────────────────────────────────
const TIER_CFG: Record<AccuracyTier, {
  label: string; icon: React.ElementType;
  badge: string; row: string; border: string;
}> = {
  COURT_SAFE:  { label: "Court-Safe",   icon: ShieldCheck,    badge: "bg-emerald-100 text-emerald-800 border-emerald-300", row: "bg-emerald-50/40", border: "border-emerald-300" },
  VERIFIED:    { label: "Verified",     icon: CheckCircle2,   badge: "bg-blue-100 text-blue-800 border-blue-300",          row: "bg-blue-50/30",    border: "border-blue-300" },
  SECONDARY:   { label: "Secondary",    icon: Info,           badge: "bg-amber-100 text-amber-800 border-amber-300",       row: "bg-amber-50/20",   border: "border-amber-300" },
  PENDING:     { label: "⚠ Pending",    icon: AlertTriangle,  badge: "bg-orange-100 text-orange-800 border-orange-300",    row: "bg-orange-50/30",  border: "border-orange-300" },
  FATAL_ERROR: { label: "⛔ Fatal",     icon: XCircle,        badge: "bg-red-100 text-red-800 border-red-300",             row: "bg-red-50/30",     border: "border-red-300" },
};

function TierBadge({ tier }: { tier: AccuracyTier }) {
  const cfg = TIER_CFG[tier];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-semibold ${cfg.badge}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </Badge>
  );
}

// ── Precedent row ─────────────────────────────────────────────────────────────
function PrecedentRow({ p }: { p: PrecedentAccuracy }) {
  const [open, setOpen] = useState(false);
  const cfg = TIER_CFG[p.tier];

  return (
    <div className={`border rounded-xl overflow-hidden ${cfg.border} ${p.blockedFromDraft ? "opacity-90" : ""}`}>
      <button
        onClick={() => setOpen((x) => !x)}
        className={`w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors ${cfg.row}`}
      >
        {p.blockedFromDraft
          ? <Lock className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          : <Unlock className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{p.citation}</span>
            <TierBadge tier={p.tier} />
            {p.blockedFromDraft && (
              <Badge variant="destructive" className="text-xs">BLOCKED FROM DRAFT</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{p.court} · {p.date}</p>
          {p.paraRef && (
            <p className="text-xs text-emerald-700 mt-0.5">✓ Para ref: {p.paraRef}</p>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border bg-card p-4 space-y-4">

          {/* Holding comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Draft Holding (currently used)
              </p>
              <div className={`p-3 rounded-lg text-xs leading-relaxed italic border ${p.holdingAccurate ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                "{p.draftHolding}"
                {!p.holdingAccurate && (
                  <p className="mt-1 not-italic font-semibold text-amber-700">
                    ⚠ Accuracy unconfirmed — may be paraphrased
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Verified Holding (from certified copy)
              </p>
              {p.verifiedHolding ? (
                <div className="p-3 rounded-lg text-xs leading-relaxed italic bg-emerald-50 border border-emerald-200 text-emerald-900">
                  "{p.verifiedHolding}"
                  {p.paraRef && <p className="mt-1 not-italic font-semibold">Para: {p.paraRef}</p>}
                </div>
              ) : (
                <div className="p-3 rounded-lg text-xs bg-muted/50 border border-border text-muted-foreground italic">
                  Not yet obtained — certified copy required
                </div>
              )}
            </div>
          </div>

          {/* Verification note */}
          <div className="p-3 bg-muted/40 rounded-lg">
            <p className="text-xs font-semibold text-foreground mb-1">Verification Note</p>
            <p className="text-xs text-muted-foreground">{p.verificationNote}</p>
          </div>

          {/* Required actions */}
          {p.requiredActions.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 mb-2">Required Actions Before Filing</p>
              <ul className="space-y-1">
                {p.requiredActions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                    <span className="shrink-0 font-mono">{i + 1}.</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          <div className="flex flex-wrap gap-2">
            {p.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline border border-primary/20 rounded-md px-2 py-1 bg-primary/5"
              >
                <ExternalLink className="h-3 w-3" />
                {s.label}
                <Badge variant="outline" className="text-[10px] ml-1 py-0">{s.type}</Badge>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Standard row ──────────────────────────────────────────────────────────────
function StandardRow({ s }: { s: StandardAccuracy }) {
  const [open, setOpen] = useState(false);
  const appCfg = {
    correct: { label: "Correct Standard", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    wrong:   { label: "WRONG STANDARD",   color: "text-red-700 bg-red-50 border-red-200" },
    partial: { label: "Partial",          color: "text-amber-700 bg-amber-50 border-amber-200" },
  }[s.applicability];

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((x) => !x)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <FlaskConical className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground font-mono">{s.code}</span>
            <TierBadge tier={s.tier} />
            <Badge variant="outline" className={`text-xs ${appCfg.color}`}>{appCfg.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{s.title}</p>
          {s.clauseRef && <p className="text-xs text-blue-600 mt-0.5">Clause: {s.clauseRef}</p>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">App Statement</p>
              <div className="p-3 rounded-lg text-xs bg-muted/40 border border-border text-foreground leading-relaxed">
                {s.appStatement}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Exact Clause Text (Official)</p>
              {s.exactClauseText ? (
                <div className="p-3 rounded-lg text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 leading-relaxed italic">
                  "{s.exactClauseText}"
                </div>
              ) : (
                <div className="p-3 rounded-lg text-xs bg-amber-50 border border-amber-200 text-amber-800">
                  ⚠ Official clause text not yet obtained. Do not cite specific clause language in court without official copy.
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg">
            <p className="text-xs font-semibold text-foreground mb-1">Applicability Reason</p>
            <p className="text-xs text-muted-foreground">{s.applicabilityReason}</p>
          </div>

          {s.requiredActions.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 mb-2">Required Actions</p>
              <ul className="space-y-1">
                {s.requiredActions.map((a, i) => (
                  <li key={i} className="text-xs text-amber-700 flex gap-2">
                    <span className="font-mono shrink-0">{i + 1}.</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {s.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline border border-primary/20 rounded-md px-2 py-1 bg-primary/5"
              >
                <ExternalLink className="h-3 w-3" /> {src.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VerificationPanel() {
  const stats = overallAccuracyScore();
  const [tab, setTab] = useState<"precedents" | "standards">("precedents");
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateAccuracyReport()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadReport = () => {
    const blob = new Blob([generateAccuracyReport()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "citation_accuracy_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Score colour
  const scoreColor = stats.score >= 70 ? "text-emerald-600" : stats.score >= 40 ? "text-amber-600" : "text-red-600";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Citation Accuracy & Verification Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Every precedent and standard verified before it enters a draft
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-1.5 text-xs">
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy Report"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {/* Accuracy score dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <p className={`text-3xl font-bold ${scoreColor}`}>{stats.score}</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy Score</p>
          </CardContent>
        </Card>
        {[
          { label: "Court-Safe",  value: stats.courtSafe,  color: "text-emerald-600" },
          { label: "Verified",    value: stats.verified,   color: "text-blue-600" },
          { label: "Secondary",   value: stats.secondary,  color: "text-amber-600" },
          { label: "Pending",     value: stats.pending,    color: "text-orange-600" },
          { label: "Blocked",     value: stats.blocked,    color: "text-red-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warning banner if blocked citations exist */}
      {stats.blocked > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {stats.blocked} citation{stats.blocked > 1 ? "s" : ""} blocked from draft output
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              These citations have unverified authenticity. They will NOT appear in generated drafts until certified copies are obtained and the tier is upgraded.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["precedents", "standards"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "precedents" ? <FileText className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
            {t === "precedents" ? `Precedents (${PRECEDENT_ACCURACY.length})` : `Standards (${STANDARDS_ACCURACY.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "precedents" && (
        <div className="space-y-3">
          {/* Court-safe first, then verified, then secondary, then pending */}
          {(["COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING", "FATAL_ERROR"] as AccuracyTier[]).map((tier) => {
            const group = PRECEDENT_ACCURACY.filter((p) => p.tier === tier);
            if (!group.length) return null;
            const cfg = TIER_CFG[tier];
            return (
              <div key={tier}>
                <div className="flex items-center gap-2 mb-2">
                  <cfg.icon className="h-4 w-4" />
                  <h3 className="text-sm font-semibold text-foreground">{cfg.label} ({group.length})</h3>
                </div>
                <div className="space-y-2">
                  {group.map((p) => <PrecedentRow key={p.id} p={p} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "standards" && (
        <div className="space-y-3">
          {/* Wrong standards first (most critical) */}
          {(["wrong", "correct", "partial"] as const).map((app) => {
            const group = STANDARDS_ACCURACY.filter((s) => s.applicability === app);
            if (!group.length) return null;
            const label = app === "wrong" ? "⛔ Wrong Standard (Prosecution Error)" : app === "correct" ? "✅ Correct Standard (Defence)" : "⚠ Partial Applicability";
            return (
              <div key={app}>
                <h3 className="text-sm font-semibold text-foreground mb-2">{label} ({group.length})</h3>
                <div className="space-y-2">
                  {group.map((s) => <StandardRow key={s.code} s={s} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
