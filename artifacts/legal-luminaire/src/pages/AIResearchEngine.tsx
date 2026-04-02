import { useState, useMemo } from "react";
import {
  ClipboardCopy, ExternalLink, Search, AlertTriangle,
  CheckCircle2, Database, Zap, ShieldCheck, XCircle,
  Info, BarChart3, FileText,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import {
  buildResearchPrompt, scorePrecedentFit, computeAccuracyReport,
  validateForFiling, fitLevelLabel, fitLevelClass,
  DATABASES, TIER_LABELS, TIER_CLASSES,
  type DatabaseSource, type ResearchQuery, type FitLevel,
  type VerificationTier, type PrecedentResult, type StandardResult,
} from "@/lib/ai-research";
import { CASE01_PRECEDENTS, CASE01_STANDARDS } from "@/lib/case01-data";
import PrecedentFitGate from "@/components/PrecedentFitGate";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Default query for Case 01 ─────────────────────────────────────────────────
const DEFAULT_QUERY: ResearchQuery = {
  caseTitle: "Special Session Case No. 1/2025 — Hemraj Vardar, Stadium Wall Collapse, Udaipur",
  brief: "Discharge application u/s 250 BNSS 2023. FSL mortar report challenged on chain-of-custody, ex-parte sampling, wrong IS standard, rain contamination.",
  incidentType: "building collapse construction wall forensic mortar sampling",
  evidenceType: "material sampling forensic lab report chain of custody mortar concrete",
  proceduralDefects: [
    "no panchnama", "no chain of custody", "no contractor representative",
    "wrong IS standard IS 1199 used instead of IS 2250",
    "rain storm sampling", "no sealing", "no FSL inward register",
  ],
  jurisdiction: "Rajasthan — Special Session Court (PCA), Udaipur",
};

// ── Tier badge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: VerificationTier }) {
  const icons: Record<VerificationTier, React.ElementType> = {
    COURT_SAFE: ShieldCheck, VERIFIED: CheckCircle2,
    SECONDARY: Info, PENDING: AlertTriangle, FATAL_ERROR: XCircle,
  };
  const Icon = icons[tier];
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-semibold ${TIER_CLASSES[tier]}`}>
      <Icon className="h-3 w-3" /> {TIER_LABELS[tier]}
    </Badge>
  );
}

// ── Fit score bar ─────────────────────────────────────────────────────────────
function FitBar({ score, max, label }: { score: number; max: number; label: string }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right font-mono text-foreground">{score}/{max}</span>
    </div>
  );
}

export default function AIResearchEngine() {
  const { selectedCase } = useCaseContext();
  const [query, setQuery] = useState<ResearchQuery>(DEFAULT_QUERY);
  const [filterLevel, setFilterLevel] = useState<FitLevel | "all">("all");
  const [filterTier, setFilterTier] = useState<VerificationTier | "all">("all");
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"precedents" | "standards" | "accuracy" | "databases">("precedents");

  // Score all precedents against current query
  const scoredPrecedents = useMemo<PrecedentResult[]>(() => {
    return CASE01_PRECEDENTS.map((p) => {
      const fit = scorePrecedentFit(p.tags, query);
      return {
        ...p,
        fitScore: fit.total,
        fitLevel: fit.level,
        fitReason: fit.reasons.join(" | "),
        verificationTier: p.status as VerificationTier,
        verificationNote: p.statusNote,
        paraRef: null,
        requiredActions: [],
        blockedFromDraft: p.status === "PENDING",
        source: "manupatra" as DatabaseSource,
        sourceUrl: p.sourceUrl,
      };
    });
  }, [query]);

  const scoredStandards = useMemo<StandardResult[]>(() => {
    return CASE01_STANDARDS.map((s) => ({
      ...s,
      applicabilityReason: s.violation,
      exactClauseText: null,
      clauseRef: s.keyClause,
      source: "bis" as DatabaseSource,
      sourceUrl: s.sourceUrl,
      verificationTier: s.confidence as VerificationTier,
      requiredActions: [],
    }));
  }, []);

  const accuracyReport = useMemo(() => computeAccuracyReport(scoredPrecedents), [scoredPrecedents]);
  const filingValidation = useMemo(() => validateForFiling(scoredPrecedents, scoredStandards), [scoredPrecedents, scoredStandards]);

  const filteredPrecedents = useMemo(() => {
    return scoredPrecedents.filter((p) => {
      if (filterLevel !== "all" && p.fitLevel !== filterLevel) return false;
      if (filterTier !== "all" && p.verificationTier !== filterTier) return false;
      return true;
    }).sort((a, b) => b.fitScore - a.fitScore);
  }, [scoredPrecedents, filterLevel, filterTier]);

  const researchPrompt = buildResearchPrompt(query, []);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(researchPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scoreColor = accuracyReport.overallScore >= 70 ? "text-emerald-600"
    : accuracyReport.overallScore >= 40 ? "text-amber-600" : "text-red-600";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> AI Research Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fact-Fit Gate enforced · 8 databases · Zero-hallucination · {selectedCase.title}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors">
            <Zap className="w-3.5 h-3.5" /> {showPrompt ? "Hide" : "Show"} Research Prompt
          </button>
          {showPrompt && (
            <button onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg">
              <ClipboardCopy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy Prompt"}
            </button>
          )}
        </div>
      </div>

      {/* Research prompt */}
      {showPrompt && (
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Research Prompt (paste into Manupatra AI / SCC AI / GPT-4)
          </p>
          <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {researchPrompt}
          </pre>
        </div>
      )}

      {/* Accuracy score bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <p className={`text-3xl font-bold ${scoreColor}`}>{accuracyReport.overallScore}</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy Score</p>
            <p className={`text-xs font-semibold mt-1 ${accuracyReport.readyToFile ? "text-emerald-600" : "text-amber-600"}`}>
              {accuracyReport.readyToFile ? "✓ Ready to file" : "⚠ Actions needed"}
            </p>
          </CardContent>
        </Card>
        {[
          { label: "Court-Safe", value: accuracyReport.courtSafe, color: "text-emerald-600" },
          { label: "Verified",   value: accuracyReport.verified,  color: "text-blue-600" },
          { label: "Secondary",  value: accuracyReport.secondary, color: "text-amber-600" },
          { label: "Pending",    value: accuracyReport.pending,   color: "text-orange-600" },
          { label: "Blocked",    value: accuracyReport.blocked,   color: "text-red-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fatal errors */}
      {accuracyReport.fatalErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Fatal Errors Detected
          </p>
          {accuracyReport.fatalErrors.map((e, i) => (
            <p key={i} className="text-xs text-red-700">{e}</p>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {([
          { id: "precedents" as const, label: `Precedents (${scoredPrecedents.length})`, icon: FileText },
          { id: "standards"  as const, label: `Standards (${scoredStandards.length})`,   icon: ShieldCheck },
          { id: "accuracy"   as const, label: "Filing Validation",                        icon: BarChart3 },
          { id: "databases"  as const, label: "Databases",                                icon: Database },
        ]).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── PRECEDENTS TAB ── */}
      {activeTab === "precedents" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Fit Level:</span>
              {(["all", "exact", "analogous", "weak", "rejected"] as const).map((l) => (
                <button key={l} onClick={() => setFilterLevel(l)}
                  className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${
                    filterLevel === l ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}>
                  {l === "all" ? "All" : l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Tier:</span>
              {(["all", "COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING"] as const).map((t) => (
                <button key={t} onClick={() => setFilterTier(t)}
                  className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${
                    filterTier === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}>
                  {t === "all" ? "All" : TIER_LABELS[t as VerificationTier]}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filteredPrecedents.length} of {scoredPrecedents.length} precedents · sorted by fit score
          </p>

          {filteredPrecedents.map((p) => (
            <div key={p.id} className={`border rounded-xl overflow-hidden ${
              p.fitLevel === "rejected" ? "border-red-300 opacity-80" :
              p.fitLevel === "exact" ? "border-emerald-300" :
              p.fitLevel === "analogous" ? "border-blue-300" : "border-amber-300"
            }`}>
              {/* Header */}
              <div className={`p-4 ${
                p.fitLevel === "rejected" ? "bg-red-50" :
                p.fitLevel === "exact" ? "bg-emerald-50/50" :
                p.fitLevel === "analogous" ? "bg-blue-50/50" : "bg-amber-50/50"
              }`}>
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <span className="font-semibold text-sm text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{p.citation}</span>
                  <Badge variant="outline" className={`text-xs ${fitLevelClass(p.fitLevel)}`}>
                    {p.fitScore}/100 · {p.fitLevel}
                  </Badge>
                  <TierBadge tier={p.verificationTier} />
                  {p.blockedFromDraft && (
                    <Badge variant="destructive" className="text-xs">BLOCKED FROM DRAFT</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{p.court} · {p.date}</p>

                {/* Fit score breakdown */}
                <div className="mt-3 space-y-1">
                  <FitBar score={p.fitScore >= 40 ? 40 : p.fitScore} max={40} label="[A] Incident" />
                  <FitBar score={Math.min(35, Math.max(0, p.fitScore - 40))} max={35} label="[B] Evidence" />
                  <FitBar score={Math.min(25, Math.max(0, p.fitScore - 75))} max={25} label="[C] Procedure" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{p.fitReason}</p>
              </div>

              {/* Body */}
              {p.fitLevel !== "rejected" && (
                <div className="p-4 bg-card space-y-3">
                  <div className="p-3 bg-muted/40 rounded-lg">
                    <p className="text-xs font-semibold text-foreground mb-1">Holding (verbatim):</p>
                    <p className="text-xs text-foreground/80 italic leading-relaxed">{p.holding}</p>
                    {p.paraRef && <p className="text-xs text-emerald-700 mt-1 font-semibold">Para: {p.paraRef}</p>}
                  </div>
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <p className="text-xs font-semibold text-accent-foreground mb-1">Application to this case:</p>
                    <p className="text-xs text-accent-foreground/80 leading-relaxed">{p.application}</p>
                  </div>
                  {p.verificationNote && (
                    <p className="text-xs text-muted-foreground italic">{p.verificationNote}</p>
                  )}
                  <div className="flex flex-wrap gap-2 items-center">
                    <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" /> {DATABASES.find(d => d.id === p.source)?.label || p.source}
                    </a>
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.fitLevel === "rejected" && (
                <div className="p-3 bg-red-50 border-t border-red-200">
                  <p className="text-xs text-red-700 font-semibold">
                    ⚠ FATAL ERROR — Fit score {p.fitScore}/100 (below 30 threshold).
                    DO NOT use as primary authority. Reason: {p.fitReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── STANDARDS TAB ── */}
      {activeTab === "standards" && (
        <div className="space-y-3">
          {/* Wrong standards first */}
          {(["wrong", "correct", "partial"] as const).map((app) => {
            const group = scoredStandards.filter((s) => s.applicability === app);
            if (!group.length) return null;
            const label = app === "wrong" ? "⛔ Wrong Standard — Prosecution Error"
              : app === "correct" ? "✅ Correct Standard — Defence Argument"
              : "⚠ Partial Applicability";
            return (
              <div key={app}>
                <h3 className="text-sm font-semibold text-foreground mb-2">{label} ({group.length})</h3>
                <div className="space-y-2">
                  {group.map((s) => (
                    <div key={s.code} className={`border rounded-xl p-4 ${
                      app === "wrong" ? "border-red-300 bg-red-50/30" :
                      app === "correct" ? "border-emerald-300 bg-emerald-50/30" : "border-amber-300 bg-amber-50/30"
                    }`}>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono font-semibold text-sm text-foreground">{s.code}</span>
                        <TierBadge tier={s.verificationTier} />
                        <Badge variant="outline" className={`text-xs ${
                          app === "wrong" ? "text-red-700 border-red-300" :
                          app === "correct" ? "text-emerald-700 border-emerald-300" : "text-amber-700 border-amber-300"
                        }`}>
                          {app === "wrong" ? "WRONG STANDARD" : app === "correct" ? "CORRECT" : "PARTIAL"}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.applicabilityReason}</p>
                      {s.clauseRef && (
                        <p className="text-xs text-blue-600 mt-1">Clause: {s.clauseRef}</p>
                      )}
                      {!s.exactClauseText && (
                        <p className="text-xs text-amber-700 mt-1">
                          ⚠ Official clause text not yet obtained — do not cite specific clause language without official copy.
                        </p>
                      )}
                      <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                        <ExternalLink className="w-3 h-3" /> {s.sourceUrl}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ACCURACY / FILING VALIDATION TAB ── */}
      {activeTab === "accuracy" && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-4 ${filingValidation.canFile ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <p className={`font-semibold text-sm ${filingValidation.canFile ? "text-emerald-800" : "text-amber-800"}`}>
              {filingValidation.canFile ? "✓ Ready to file" : `⚠ ${filingValidation.errors.length} errors + ${filingValidation.warnings.length} warnings before filing`}
            </p>
          </div>

          {filingValidation.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-700">Errors (must fix before filing):</p>
              {filingValidation.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {e}
                </p>
              ))}
            </div>
          )}

          {filingValidation.warnings.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-700">Warnings:</p>
              {filingValidation.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {w}
                </p>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Pre-Filing Checklist</p>
            <div className="space-y-2">
              {filingValidation.checklist.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs ${
                  item.critical ? "border-amber-200 bg-amber-50/50" : "border-border bg-muted/20"
                }`}>
                  <div className={`w-4 h-4 rounded border-2 shrink-0 mt-0.5 ${
                    item.done ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/40"
                  }`} />
                  <span className={item.critical ? "text-amber-800" : "text-muted-foreground"}>{item.item}</span>
                  {item.critical && <Badge variant="outline" className="text-[10px] shrink-0 ml-auto border-amber-300 text-amber-700">Critical</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DATABASES TAB ── */}
      {activeTab === "databases" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Search these databases in priority order. Every citation must be verified on at least one primary source before use in court.
          </p>
          {DATABASES.map((db) => (
            <div key={db.id} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-card hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{db.priority}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{db.label}</span>
                  <Badge variant="outline" className="text-xs capitalize">{db.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{db.description}</p>
                <a href={db.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> {db.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
