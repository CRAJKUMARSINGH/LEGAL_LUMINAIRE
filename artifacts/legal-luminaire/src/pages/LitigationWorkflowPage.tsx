/**
 * Litigation Workflow Automation — automate repetitive tasks across the litigation lifecycle.
 * Statutory feature: "Litigation Workflow Automation"
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap, CheckCircle2, Circle, Clock, AlertTriangle,
  Play, ChevronRight, RotateCcw, Info, Layers,
  FileText, Search, Edit3, ShieldCheck, Printer, Scale,
} from "lucide-react";
import { Link } from "wouter";
import { useCaseContext } from "@/context/CaseContext";

// ── Types ────────────────────────────────────────────────────────────────
type StepStatus = "DONE" | "IN_PROGRESS" | "PENDING" | "BLOCKED";
type WorkflowId = "discharge" | "bail" | "written_submission" | "trial_prep";

interface WorkflowStep {
  id: string;
  label: string;
  labelHi: string;
  status: StepStatus;
  route?: string;
  automatable: boolean;
  description: string;
}

interface Workflow {
  id: WorkflowId;
  title: string;
  titleHi: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  steps: WorkflowStep[];
  estimatedTime: string;
}

// ── Workflow Definitions ──────────────────────────────────────────────────
const WORKFLOWS: Workflow[] = [
  {
    id: "discharge",
    title: "Discharge Application",
    titleHi: "उन्मोचन प्रार्थना-पत्र",
    description: "End-to-end workflow: evidence gap analysis → citation research → IS standard challenge → draft → citation gate → filing checklist.",
    icon: Scale,
    color: "text-primary",
    estimatedTime: "2–4 hours",
    steps: [
      { id: "D1", label: "Case Intake & Document Upload", labelHi: "केस इनटेक और दस्तावेज़ अपलोड", status: "DONE", route: "/intake", automatable: true, description: "Upload FIR, charge-sheet, FSL report, and related documents." },
      { id: "D2", label: "AI Research — Relevant Precedents", labelHi: "AI शोध — प्रासंगिक मिसालें", status: "DONE", route: "/case-research", automatable: true, description: "Fact-Fit Gate scores 25+ precedents. Score ≥70 = exact authority." },
      { id: "D3", label: "IS / ASTM Standards Verification", labelHi: "IS/ASTM मानक सत्यापन", status: "DONE", route: "/standards-index", automatable: true, description: "Verify FSL report used correct standard (IS 2250:1981 for masonry mortar)." },
      { id: "D4", label: "Citation Verification (5-Tier)", labelHi: "उद्धरण सत्यापन (5-स्तरीय)", status: "IN_PROGRESS", route: "/verification", automatable: true, description: "Assign COURT_SAFE / VERIFIED / SECONDARY / PENDING tiers. Block PENDING." },
      { id: "D5", label: "Draft Discharge Application", labelHi: "उन्मोचन प्रार्थना-पत्र लिखें", status: "PENDING", route: "/discharge-application", automatable: true, description: "AI-assisted bilingual draft with inline citations." },
      { id: "D6", label: "Citation Safety Gate Check", labelHi: "उद्धरण सुरक्षा गेट जाँच", status: "PENDING", route: "/safe-draft", automatable: true, description: "Live scan — draft blocked if PENDING citations remain." },
      { id: "D7", label: "Pre-Filing Checklist", labelHi: "फाइलिंग से पहले चेकलिस्ट", status: "BLOCKED", route: "/filing-checklist", automatable: false, description: "Manual review of 12-point filing checklist. Advocate sign-off required." },
    ],
  },
  {
    id: "bail",
    title: "Bail Application",
    titleHi: "जमानत प्रार्थना-पत्र",
    description: "Bail research → grounds analysis → sureties checklist → draft → verification → filing.",
    icon: ShieldCheck,
    color: "text-green-600",
    estimatedTime: "1–2 hours",
    steps: [
      { id: "B1", label: "Case Facts Summary", labelHi: "केस तथ्य सारांश", status: "DONE", route: "/intake", automatable: true, description: "AI extracts key bail-relevant facts from case documents." },
      { id: "B2", label: "Bail Ground Research", labelHi: "जमानत आधार शोध", status: "DONE", route: "/case-research", automatable: true, description: "Research Section 437/439 CrPC grounds with cited precedents." },
      { id: "B3", label: "Draft Bail Application", labelHi: "जमानत प्रार्थना-पत्र लिखें", status: "IN_PROGRESS", route: "/ai-draft-engine", automatable: true, description: "AI-assisted draft with verified citation blocks." },
      { id: "B4", label: "Verification Report", labelHi: "सत्यापन रिपोर्ट", status: "PENDING", route: "/verification", automatable: true, description: "Every citation must reach VERIFIED tier before filing." },
      { id: "B5", label: "Filing Checklist & Sureties", labelHi: "फाइलिंग चेकलिस्ट और जमानतदार", status: "PENDING", route: "/filing-checklist", automatable: false, description: "Manual checklist: surety documents, photo ID, court fee." },
    ],
  },
  {
    id: "written_submission",
    title: "Written Submissions",
    titleHi: "लिखित तर्क",
    description: "Research → draft → cross-reference matrix → citation gate → submission.",
    icon: FileText,
    color: "text-violet-600",
    estimatedTime: "3–6 hours",
    steps: [
      { id: "W1", label: "AI Research Engine — All Issues", labelHi: "AI शोध इंजन — सभी मुद्दे", status: "DONE", route: "/ai-research", automatable: true, description: "Multi-issue research with 4-layer citation verification." },
      { id: "W2", label: "Cross-Reference Matrix", labelHi: "क्रॉस-रेफरेंस मैट्रिक्स", status: "IN_PROGRESS", route: "/cross-reference", automatable: true, description: "Map each legal proposition to its supporting authorities." },
      { id: "W3", label: "Chronology of Events", labelHi: "घटनाओं का कालक्रम", status: "PENDING", route: "/chronology", automatable: true, description: "Source-cited timeline with accept/reject review workflow." },
      { id: "W4", label: "Draft Written Submissions", labelHi: "लिखित तर्क का मसौदा", status: "PENDING", route: "/safe-draft", automatable: true, description: "WYSIWYG editor with live Citation Gate wired in." },
      { id: "W5", label: "Final Verification Report", labelHi: "अंतिम सत्यापन रिपोर्ट", status: "PENDING", route: "/cross-check-report", automatable: true, description: "Comprehensive verification report for all 12 grounds." },
    ],
  },
  {
    id: "trial_prep",
    title: "Trial Preparation",
    titleHi: "विचारण तैयारी",
    description: "Chronology → cross-examination Q&A → FSL challenge → oral argument notes.",
    icon: Layers,
    color: "text-amber-600",
    estimatedTime: "4–8 hours",
    steps: [
      { id: "T1", label: "Case Chronology Studio", labelHi: "कालक्रम स्टूडियो", status: "DONE", route: "/chronology", automatable: true, description: "Source-cited timeline from 3 parsers. Needs-Dating lane for gaps." },
      { id: "T2", label: "FSL / Standards Analysis", labelHi: "FSL/मानक विश्लेषण", status: "IN_PROGRESS", route: "/fsl-analysis", automatable: true, description: "IS 2250:1981 vs IS 1199:2018 — automatic standard mismatch detection." },
      { id: "T3", label: "Cross-Examination Points", labelHi: "जिरह के बिंदु", status: "PENDING", route: "/cross-reference", automatable: false, description: "AI suggests cross-examination questions for each PW." },
      { id: "T4", label: "Oral Argument Notes", labelHi: "मौखिक बहस नोट्स", status: "PENDING", route: "/oral-arguments", automatable: true, description: "Structured argument flow with citation cards." },
      { id: "T5", label: "Limitation & Deadlines Check", labelHi: "सीमा और समय-सीमा जाँच", status: "PENDING", route: "/deadlines", automatable: true, description: "Ensure all procedural deadlines are tracked." },
    ],
  },
];

// ── Step Status Config ────────────────────────────────────────────────────
const STEP_CONFIG: Record<StepStatus, { icon: React.ReactNode; color: string; label: string }> = {
  DONE:        { icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,  color: "text-green-600",  label: "Complete" },
  IN_PROGRESS: { icon: <Clock className="h-4 w-4 text-blue-600 animate-pulse" />, color: "text-blue-600", label: "In Progress" },
  PENDING:     { icon: <Circle className="h-4 w-4 text-muted-foreground" />, color: "text-muted-foreground", label: "Pending" },
  BLOCKED:     { icon: <AlertTriangle className="h-4 w-4 text-red-500" />,  color: "text-red-500",     label: "Blocked" },
};

function progressPct(steps: WorkflowStep[]) {
  const done = steps.filter(s => s.status === "DONE").length;
  return Math.round((done / steps.length) * 100);
}

export default function LitigationWorkflowPage() {
  const { selectedCase, isDemoMode, selectedCaseId } = useCaseContext();
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowId>("discharge");

  const workflow = useMemo(() => WORKFLOWS.find(w => w.id === activeWorkflow)!, [activeWorkflow]);
  const pct = progressPct(workflow.steps);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Litigation Workflow Automation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            मुकदमेबाजी कार्यप्रवाह — automate repetitive tasks across the litigation lifecycle
          </p>
        </div>
        {isDemoMode && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>}
      </div>

      {/* Workflow Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {WORKFLOWS.map(w => {
          const Icon = w.icon;
          const pct2 = progressPct(w.steps);
          return (
            <button
              key={w.id}
              onClick={() => setActiveWorkflow(w.id)}
              className={`rounded-xl border p-3 text-left transition-all hover:shadow-md ${activeWorkflow === w.id ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/30"}`}
            >
              <Icon className={`h-5 w-5 ${w.color} mb-2`} />
              <p className="font-semibold text-xs leading-tight">{w.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{w.titleHi}</p>
              <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct2}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{pct2}% complete</p>
            </button>
          );
        })}
      </div>

      {/* Active Workflow Detail */}
      <Card className="glass-surface">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <workflow.icon className={`h-5 w-5 ${workflow.color}`} />
                {workflow.title}
                <span className="text-muted-foreground font-normal text-sm">· {workflow.titleHi}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary">{pct}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
              <p className="text-[10px] text-muted-foreground mt-1">Est. {workflow.estimatedTime}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {workflow.steps.map((step, i) => {
            const cfg = STEP_CONFIG[step.status];
            return (
              <div key={step.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${step.status === "IN_PROGRESS" ? "border-blue-200 bg-blue-50" : step.status === "DONE" ? "border-green-100 bg-green-50/40" : step.status === "BLOCKED" ? "border-red-200 bg-red-50/40" : "border-border bg-muted/20"}`}>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${cfg.color}`}>{step.label}</span>
                    <span className="text-xs text-muted-foreground">· {step.labelHi}</span>
                    {step.automatable && <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-green-600 border-green-300">AI-Automated</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                {step.route && step.status !== "DONE" && (
                  <Link href={step.status === "BLOCKED" ? "#" : `/case/${selectedCaseId}${step.route}`}>
                    <Button variant="outline" size="sm" disabled={step.status === "BLOCKED"} className="gap-1 shrink-0 text-xs">
                      {step.status === "IN_PROGRESS" ? <><Play className="h-3 w-3" />Continue</> : <><ChevronRight className="h-3 w-3" />Start</>}
                    </Button>
                  </Link>
                )}
                {step.status === "DONE" && (
                  <Button variant="ghost" size="sm" className="gap-1 shrink-0 text-xs text-green-600">
                    <RotateCcw className="h-3 w-3" /> Redo
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>Workflow steps marked <strong>AI-Automated</strong> are handled by the Legal Luminaire accuracy engine. Steps without the badge require manual advocate input. All data is <strong>SYNTHETIC / DEMO</strong>.</span>
      </div>
    </div>
  );
}
