import { useState } from "react";
import { ExternalLink, Scale, BookOpen, Globe, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { CASE01_PRECEDENTS, CASE01_STANDARDS, type VerificationStatus } from "@/lib/case01-data";

const statusConfig: Record<VerificationStatus, { label: string; color: string; icon: React.ElementType }> = {
  VERIFIED:   { label: "VERIFIED",   color: "bg-green-100 text-green-800 border-green-300",  icon: CheckCircle2 },
  SECONDARY:  { label: "SECONDARY",  color: "bg-blue-100 text-blue-800 border-blue-300",     icon: Clock },
  PENDING:    { label: "⚠ PENDING",  color: "bg-red-100 text-red-800 border-red-300",        icon: AlertTriangle },
};

const fitBadge: Record<string, string> = {
  exact:     "bg-green-100 text-green-800",
  analogous: "bg-blue-100 text-blue-800",
  weak:      "bg-amber-100 text-amber-800",
  rejected:  "bg-red-100 text-red-800",
};

const stdBadge: Record<string, string> = {
  correct: "bg-green-100 text-green-800",
  wrong:   "bg-red-100 text-red-800",
  partial: "bg-amber-100 text-amber-800",
};

export default function CaseResearch() {
  const [fitFilter, setFitFilter] = useState<"all" | "exact" | "analogous" | "pending">("all");
  const [fitChecks, setFitChecks] = useState({
    incidentMatch: false,
    evidenceMatch: false,
    procedureMatch: false,
  });
  const fitScore = Object.values(fitChecks).filter(Boolean).length;

  const filtered = CASE01_PRECEDENTS.filter((p) => {
    if (fitFilter === "all") return true;
    if (fitFilter === "pending") return p.status === "PENDING";
    return p.fitLevel === fitFilter;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">विधिक शोध</h1>
        <p className="text-sm text-muted-foreground">
          Legal Research — Case 01 · Hemraj Vardar · Stadium Collapse
        </p>
      </div>

      {/* Verification legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(Object.entries(statusConfig) as [VerificationStatus, typeof statusConfig[VerificationStatus]][]).map(([k, v]) => {
          const Icon = v.icon;
          return (
            <span key={k} className={`flex items-center gap-1 px-2 py-1 rounded-full border font-medium ${v.color}`}>
              <Icon className="w-3 h-3" /> {v.label}
            </span>
          );
        })}
        <span className="text-muted-foreground ml-2">— PENDING cases: obtain certified copy before filing</span>
      </div>

      {/* Fact-Fit Gate */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h2 className="text-sm font-bold text-amber-900 mb-2">Precedent Fact-Fit Gate (Mandatory)</h2>
        <div className="space-y-2 text-xs text-amber-900">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={fitChecks.incidentMatch} onChange={(e) => setFitChecks((p) => ({ ...p, incidentMatch: e.target.checked }))} />
            Incident type matches (construction wall collapse / forensic mortar sampling)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={fitChecks.evidenceMatch} onChange={(e) => setFitChecks((p) => ({ ...p, evidenceMatch: e.target.checked }))} />
            Evidence type matches (material sampling / forensic chain / lab handling)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={fitChecks.procedureMatch} onChange={(e) => setFitChecks((p) => ({ ...p, procedureMatch: e.target.checked }))} />
            Procedural defect pattern matches (no panchnama, no CoC, no representative)
          </label>
        </div>
        <p className="text-xs mt-2 font-semibold text-amber-900">
          Fit: {fitScore}/3 {fitScore < 2 ? "— Do not use as primary precedent." : "— Usable with proper citation proof."}
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        {(["all", "exact", "analogous", "pending"] as const).map((f) => (
          <button key={f} onClick={() => setFitFilter(f)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              fitFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
            }`}>
            {f === "all" ? `All (${CASE01_PRECEDENTS.length})` :
             f === "pending" ? `⚠ Pending Verification (${CASE01_PRECEDENTS.filter(p => p.status === "PENDING").length})` :
             `${f.charAt(0).toUpperCase() + f.slice(1)} (${CASE01_PRECEDENTS.filter(p => p.fitLevel === f).length})`}
          </button>
        ))}
      </div>

      {/* Precedents */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" /> न्यायिक निर्णय ({filtered.length})
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Source: Case_Law_Matrix_Verified_Pending.md + Full_Case_References.md + forensic_defense_report.md
        </p>
        <div className="space-y-3">
          {filtered.map((p) => {
            const sc = statusConfig[p.status];
            const StatusIcon = sc.icon;
            return (
              <div key={p.id} className={`bg-card border rounded-xl p-5 ${p.status === "PENDING" ? "border-red-200" : "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.citation}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${sc.color}`}>
                      <StatusIcon className="w-3 h-3" /> {sc.label}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fitBadge[p.fitLevel]}`}>
                      Fit: {p.fitScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-2">
                  <div><span className="text-muted-foreground font-medium">न्यायालय:</span> <span>{p.court}</span></div>
                  <div><span className="text-muted-foreground font-medium">दिनांक:</span> <span>{p.date}</span></div>
                </div>

                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-1">मुख्य अभिधारण:</p>
                  <p className="text-xs text-foreground/80 leading-relaxed italic">{p.holding}</p>
                </div>

                <div className="mt-2 p-3 bg-accent/30 rounded-lg">
                  <p className="text-xs font-medium text-accent-foreground mb-1">प्रस्तुत प्रकरण में प्रयोग:</p>
                  <p className="text-xs text-accent-foreground/80">{p.application}</p>
                </div>

                {p.status === "PENDING" && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{p.statusNote}</p>
                  </div>
                )}
                {p.status === "SECONDARY" && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">{p.statusNote}</p>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline">
                    Verify on Indian Kanoon <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> भारतीय एवं अंतर्राष्ट्रीय मानक
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Source: Standards_Matrix_IS_ASTM_NABL.md + forensic_defense_report.md
        </p>
        <div className="space-y-3">
          {CASE01_STANDARDS.map((s) => (
            <div key={s.code} className={`bg-card border rounded-xl p-4 flex gap-4 ${s.applicability === "wrong" ? "border-red-300 bg-red-50/30" : "border-border"}`}>
              <div className="w-32 flex-shrink-0 space-y-1">
                <span className="text-xs font-bold text-primary bg-accent px-2 py-1 rounded-md block text-center">
                  {s.code}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full block text-center ${stdBadge[s.applicability]}`}>
                  {s.applicability === "correct" ? "✅ सही मानक" : s.applicability === "wrong" ? "❌ गलत मानक" : "⚠ आंशिक"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">प्रासंगिक धाराएँ: {s.keyClause}</p>
                <p className="text-xs mt-2 text-red-700 bg-red-50 px-2 py-1 rounded">उल्लंघन: {s.violation}</p>
                <div className="flex items-center gap-2 mt-1">
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Verify source <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${statusConfig[s.confidence].color}`}>
                    {s.confidence}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
