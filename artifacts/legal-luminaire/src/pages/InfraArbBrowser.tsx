/**
 * InfraArbBrowser — Infrastructure Arbitration Case Browser (TC-22 to TC-26)
 * Artemis-II Accuracy: Fact-Fit Gate + Contradiction Radar + Case Strength Snapshot
 * Demo Mode: No API key required. Full lifecycle showcase.
 */
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, Truck, Droplets, Zap, Trees,
  ArrowRight, CheckCircle2, AlertTriangle, Info,
  Scale, FileText, BarChart3, ShieldAlert, ShieldCheck,
  Target, BookOpen, ChevronDown, ChevronUp, Gavel,
} from "lucide-react";
import { INFRA_ARB_SUMMARY, INFRA_ARB_CASES } from "@/data/demo-cases/infra-arb-cases";
import { useCaseContext } from "@/context/CaseContext";

const CASE_ICONS = [Building2, Truck, Droplets, Zap, Trees];
const CASE_COLORS = [
  "from-blue-500/10 to-blue-600/5 border-blue-500/20",
  "from-amber-500/10 to-amber-600/5 border-amber-500/20",
  "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
  "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
  "from-green-500/10 to-green-600/5 border-green-500/20",
];
const SCORE_COLOR = (score: number) =>
  score >= 90 ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
  score >= 80 ? "text-blue-600 bg-blue-50 border-blue-200" :
  "text-amber-600 bg-amber-50 border-amber-200";

// Contradiction data per case
const CONTRADICTIONS: Record<string, Array<{ issue: string; finding: string; severity: "High" | "Medium" }>> = {
  "TC-22": [
    { issue: "RMSCL denies payment delay", finding: "Standing Committee Minutes 08.01.2026 direct Finance to pay bills — admission of liability", severity: "High" },
    { issue: "RMSCL claims slow progress", finding: "Termination notice silent on RMSCL's own 45-day site handover delay", severity: "High" },
  ],
  "TC-23": [
    { issue: "NHAI claims no possession delay", finding: "Forest Dept. letters confirm clearance pending for 78 days after LOA", severity: "High" },
    { issue: "NHAI claims contractor failed FIDIC 20.2 notice", finding: "42 emails on record — NHAI had actual knowledge", severity: "Medium" },
    { issue: "NHAI Standing Committee silent on possession delay", finding: "Minutes recommend termination but omit NHAI's own 78-day default", severity: "High" },
  ],
  "TC-24": [
    { issue: "WRD claims contractor slow progress", finding: "Slow progress caused by geological surprise + WRD's own design changes", severity: "High" },
    { issue: "WRD Standing Committee silent on design changes", finding: "Minutes recommend termination but omit 2 design changes issued by WRD", severity: "High" },
  ],
  "TC-25": [
    { issue: "RVPNL claims contractor slow progress", finding: "52% progress consistent with 5-month GIS delay + 7-month RoW blockage", severity: "High" },
    { issue: "RVPNL Standing Committee silent on GIS delay", finding: "Minutes recommend termination but omit RVPNL's own 5-month equipment delay", severity: "High" },
  ],
  "TC-26": [
    { issue: "USCL blames contractor for poor plantation survival", finding: "USCL's own water supply log shows supply stopped September 2024", severity: "High" },
    { issue: "USCL claims slow progress", finding: "19 Variation Orders by USCL massively expanded scope — delay caused by USCL", severity: "High" },
  ],
};

// Case strength data
const STRENGTH_DATA: Record<string, { defence: number; evidence: number; risk: number; strongest: string }> = {
  "TC-22": { defence: 91, evidence: 88, risk: 22, strongest: "Site Handover Delay (GCC Cl. 5) — 94% Fact-Fit" },
  "TC-23": { defence: 94, evidence: 92, risk: 18, strongest: "78-Day Possession Delay (FIDIC 2.1) — 96% Fact-Fit" },
  "TC-24": { defence: 93, evidence: 90, risk: 20, strongest: "Geological Surprise (FIDIC 4.12) — 97% Fact-Fit" },
  "TC-25": { defence: 92, evidence: 89, risk: 24, strongest: "GIS Equipment Delay (Special Cl. 12) — 95% Fact-Fit" },
  "TC-26": { defence: 90, evidence: 91, risk: 19, strongest: "Scope Creep — 19 VOs (CPWD Cl. 12) — 94% Fact-Fit" },
};

function StrengthGauge({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.includes("emerald") ? "bg-emerald-500" : color.includes("blue") ? "bg-blue-500" : "bg-amber-500"}`}
          style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function InfraArbBrowser() {
  const { setSelectedCaseId } = useCaseContext();
  const [expandedCase, setExpandedCase] = useState<string | null>("TC-23");
  const [activeTab, setActiveTab] = useState<Record<string, "strength" | "contradictions" | "precedents">>(
    Object.fromEntries(INFRA_ARB_SUMMARY.map(c => [c.id, "strength" as const]))
  );

  const totalClaim = INFRA_ARB_SUMMARY.reduce((s, c) => s + parseFloat(c.claim.replace("₹", "").replace(" Cr", "")), 0);
  const totalAward = INFRA_ARB_SUMMARY.reduce((s, c) => s + parseFloat(c.award.replace("₹", "").replace(" Cr", "")), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 shrink-0">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">Infrastructure & Construction Arbitration</h1>
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px] font-black">DEMO MODE</Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              5 full-lifecycle cases — Work Order → Disputes → Notices → Standing Committee → Arbitration → Award → Execution.
              Artemis-II Accuracy: Fact-Fit Gate + Contradiction Radar + Case Strength Snapshot.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">CPWD GCC 2020</Badge>
              <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">FIDIC Red Book 2017</Badge>
              <Badge className="bg-violet-500/10 text-violet-700 border-violet-500/20">NHAI GCC 2022</Badge>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20">A&C Act 1996</Badge>
              <Badge variant="outline">No API Key Required</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Cases", value: "5", sub: "Full lifecycle" },
          { label: "Total Contract Value", value: "₹351.85 Cr", sub: "Combined" },
          { label: "Total Claims", value: `₹${totalClaim.toFixed(2)} Cr`, sub: "All 5 cases" },
          { label: "Total Awards", value: `₹${totalAward.toFixed(2)} Cr`, sub: "Contractor wins" },
        ].map((s) => (
          <Card key={s.label} className="glass-surface">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Case Cards with expandable panels */}
      <div className="space-y-4">
        {INFRA_ARB_SUMMARY.map((c, i) => {
          const Icon = CASE_ICONS[i];
          const colorClass = CASE_COLORS[i];
          const isExpanded = expandedCase === c.id;
          const tab = activeTab[c.id];
          const contradictions = CONTRADICTIONS[c.id] || [];
          const strength = STRENGTH_DATA[c.id];
          const caseData = INFRA_ARB_CASES.find(x => x.id === c.id);

          return (
            <Card key={c.id} className={`bg-gradient-to-br ${colorClass} border transition-all`}>
              {/* Card Header Row */}
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background/60 p-2 shrink-0">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{c.id}</span>
                      <span className="text-sm font-bold text-foreground">{c.label}</span>
                      <Badge className={`text-[10px] font-bold border ${SCORE_COLOR(c.score)}`}>{c.score}% Verified</Badge>
                      <Badge variant="outline" className="text-[10px]">{c.status}</Badge>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Contract: <strong className="text-foreground">{c.value}</strong></span>
                      <span>Claim: <strong className="text-foreground">{c.claim}</strong></span>
                      <span>Award: <strong className="text-emerald-600">{c.award}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/case/${c.id}/dashboard`}>
                      <Button size="sm" className="gap-1 text-xs h-8" onClick={() => setSelectedCaseId(c.id)}>
                        Open <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button
                      size="sm" variant="outline"
                      className="gap-1 text-xs h-8"
                      onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {isExpanded ? "Less" : "Details"}
                    </Button>
                  </div>
                </div>

                {/* Expandable Panel */}
                {isExpanded && (
                  <div className="mt-4 border-t border-border/40 pt-4 space-y-4">
                    {/* Tab Switcher */}
                    <div className="flex gap-1 bg-muted/40 rounded-lg p-1 w-fit">
                      {(["strength", "contradictions", "precedents"] as const).map((t) => (
                        <button
                          key={t}
                      onClick={() => setActiveTab(prev => ({ ...prev, [c.id]: t }))}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {t === "strength" ? "Case Strength" : t === "contradictions" ? "Contradiction Radar" : "Why This Precedent"}
                        </button>
                      ))}
                    </div>

                    {/* Case Strength Snapshot */}
                    {tab === "strength" && strength && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-primary" /> Case Strength Snapshot
                          </p>
                          <StrengthGauge value={strength.defence} label="Defence Viability" color="text-emerald-600" />
                          <StrengthGauge value={strength.evidence} label="Evidence Grounding" color="text-blue-600" />
                          <StrengthGauge value={100 - strength.risk} label="Risk Score (lower = safer)" color="text-amber-600" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Gavel className="h-3.5 w-3.5 text-primary" /> Strongest Ground
                          </p>
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-3">
                            <p className="text-xs font-semibold text-emerald-700">{strength.strongest}</p>
                          </div>
                          <p className="text-xs font-bold text-foreground mt-2">Draft Readiness</p>
                          <div className="flex flex-wrap gap-1.5">
                            {["VERIFIED claims → Safe to draft", "SECONDARY → With qualification", "PENDING → Blocked"].map((item, idx) => (
                              <Badge key={idx} variant="outline" className={`text-[10px] ${idx === 0 ? "border-emerald-500/30 text-emerald-700" : idx === 1 ? "border-blue-500/30 text-blue-700" : "border-red-500/30 text-red-700"}`}>
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contradiction Radar */}
                    {tab === "contradictions" && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Contradiction Radar — Employer's Inconsistencies
                        </p>
                        {contradictions.map((con, idx) => (
                          <div key={idx} className={`rounded-lg border p-3 ${con.severity === "High" ? "border-red-500/20 bg-red-50/40" : "border-amber-500/20 bg-amber-50/40"}`}>
                            <div className="flex items-start gap-2">
                              <AlertTriangle className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${con.severity === "High" ? "text-red-500" : "text-amber-500"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">{con.issue}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-start gap-1">
                                  <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                                  {con.finding}
                                </p>
                              </div>
                              <Badge className={`text-[9px] shrink-0 ${con.severity === "High" ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                                {con.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Why This Precedent */}
                    {tab === "precedents" && caseData?.caseLaw && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary" /> Why This Precedent — Fact-Fit Gate Explained
                        </p>
                        {caseData.caseLaw.map((cl, idx) => (
                          <div key={idx} className="rounded-lg border border-border/60 bg-background/50 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">{cl.case}</p>
                                <p className="text-[10px] text-muted-foreground">{cl.court}</p>
                                {cl.citation && cl.citation !== "Verify on SCC Online" && (
                                  <p className="text-[10px] font-mono text-primary mt-0.5">{cl.citation}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <Badge variant="outline" className={`text-[9px] ${cl.status === "VERIFIED" ? "border-emerald-500/30 text-emerald-700" : cl.status === "SECONDARY" ? "border-blue-500/30 text-blue-700" : "border-amber-500/30 text-amber-700"}`}>
                                  {cl.status}
                                </Badge>
                                {cl.fitScore && (
                                  <span className="text-[10px] font-bold text-primary">{cl.fitScore}% fit</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 rounded bg-muted/40 p-2">
                              <p className="text-[11px] text-foreground italic">"{cl.useForDefence}"</p>
                            </div>
                            <p className="text-[10px] text-amber-600 mt-1.5 flex items-start gap-1">
                              <Info className="h-3 w-3 shrink-0 mt-0.5" />
                              {cl.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick nav links */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                      {[
                        { href: `/case/${c.id}/timeline`, label: "Timeline", icon: BarChart3 },
                        { href: `/case/${c.id}/case-law`, label: "Case Law", icon: BookOpen },
                        { href: `/case/${c.id}/standards`, label: "Standards", icon: ShieldCheck },
                        { href: `/case/${c.id}/documents`, label: "Documents", icon: FileText },
                      ].map(({ href, label, icon: NavIcon }) => (
                        <Link key={href} href={href}>
                          <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setSelectedCaseId(c.id)}>
                            <NavIcon className="h-3 w-3" /> {label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lifecycle Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Full Lifecycle — 16 Documents Per Case (Including Cross-Reference Matrix)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { stage: "Work Order", docs: "LOA / WO + Arbitration Clause" },
              { stage: "Disputes", docs: "Legal Notice + No Satisfaction Letter" },
              { stage: "Proceedings", docs: "Standing Committee Minutes" },
              { stage: "Arbitration", docs: "Sec 11 App + Claim (Hindi + English)" },
              { stage: "Analysis", docs: "Cross-Reference Matrix + Pre-Filing Checklist + Oral Arguments" },
              { stage: "Award + Execution", docs: "Arbitral Award + Sec 36 Execution" },
            ].map((s) => (
              <div key={s.stage} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-foreground">{s.stage}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{s.docs}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-center gap-4">
        <Scale className="h-8 w-8 text-primary shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-foreground">Start Your Own Infrastructure Arbitration Case</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload your Work Order, dispute correspondence, and claim documents — Legal Luminaire builds your case dashboard automatically.
          </p>
        </div>
        <Link href="/intake">
          <Button className="gap-1.5 shrink-0">
            Start Real Case <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
