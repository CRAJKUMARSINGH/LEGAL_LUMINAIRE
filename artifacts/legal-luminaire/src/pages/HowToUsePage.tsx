/**
 * How To Use — Complete user manual for Legal Luminaire.
 * Covers all 12 Statutory-aligned features with step-by-step guides.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  BookOpen, Search, Edit3, ShieldCheck, Clock, FlaskConical,
  GraduationCap, MessageSquare, Users, Gavel, Zap, Bot,
  ChevronDown, ChevronRight, ArrowRight, CheckCircle2,
  Info, AlertTriangle, Scale, Upload, FileText, Home,
} from "lucide-react";

// ── Section Type ──────────────────────────────────────────────────────────
interface ManualSection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  titleHi: string;
  badge?: string;
  StatutoryFeature: string; // matching Statutory bullet title
  overview: string;
  route: string;
  steps: { step: string; desc: string }[];
  tips: string[];
  accuracyNote?: string;
}

// ── Manual Sections (one per Statutory feature) ─────────────────────────────
const SECTIONS: ManualSection[] = [
  {
    id: "research",
    icon: Search,
    color: "text-blue-600",
    title: "AI-Powered Legal Research",
    titleHi: "AI-सहायक विधिक शोध",
    badge: "Core",
    StatutoryFeature: "AI-Powered Legal Research",
    overview: "Find relevant case laws, statutes, and legal authorities faster. Every precedent is scored on the 3-axis Fact-Fit Gate before it reaches your draft. Score < 30 means auto-rejected — it will never appear in a court document.",
    route: "/case-research",
    steps: [
      { step: "Open a case", desc: "From Home, select an existing case or click 'New Case Intake' to upload your FIR, charge-sheet, and FSL report." },
      { step: "Go to Case Research", desc: "Navigate to Research → Case Law Research in the sidebar, or use the URL /case/{id}/case-research." },
      { step: "Enter a legal issue", desc: "Type the legal issue (e.g. 'discharge application under Section 227 CrPC') in the search box. The AI queries 25+ verified authorities." },
      { step: "Review Fact-Fit scores", desc: "Each precedent shows a score: ≥70 = Exact (primary authority), 50–69 = Analogous (use with qualification), 30–49 = Weak (supporting only), <30 = Rejected." },
      { step: "Check verification tier", desc: "Look for the tier badge: COURT_SAFE > VERIFIED > SECONDARY > PENDING. Only COURT_SAFE and VERIFIED citations may enter your draft." },
      { step: "Add to case", desc: "Click 'Add to Case' on any VERIFIED citation to include it in the active case's citation library." },
    ],
    tips: [
      "Always research IS standards separately via Standards Index — IS 2250:1981 for masonry mortar, NOT IS 1199:2018.",
      "Use the AI Research Engine (/ai-research) for multi-issue research across all 12 grounds simultaneously.",
      "Cross-Reference Matrix (/cross-reference) maps each legal proposition to its supporting authorities.",
    ],
    accuracyNote: "Score < 30 = FATAL ERROR if cited as primary authority. The system will hard-block this in the Citation Gate.",
  },
  {
    id: "drafting",
    icon: Edit3,
    color: "text-violet-600",
    title: "AI Legal Drafting",
    titleHi: "AI विधिक प्रारूपण",
    badge: "Core",
    StatutoryFeature: "AI Legal Drafting",
    overview: "Generate court-ready bilingual (Hindi + English) drafts — discharge applications, bail applications, written submissions, notices, oral argument notes. Every draft includes inline citation blocks with verbatim holdings.",
    route: "/ai-draft-engine",
    steps: [
      { step: "Open AI Draft Engine", desc: "Navigate to Drafting → AI Draft Engine in the sidebar." },
      { step: "Select document type", desc: "Choose from: Discharge Application, Bail Application, Written Submissions, Notice Reply, Oral Arguments." },
      { step: "Select language", desc: "Toggle between English, Hindi, or Both (bilingual). The bilingual output is suitable for Rajasthan sessions courts." },
      { step: "Review auto-populated citations", desc: "The engine pulls all COURT_SAFE and VERIFIED citations from your case library and inserts them with verbatim holdings." },
      { step: "Open Safe Draft Editor", desc: "For manual editing, use Safe Draft Editor (/safe-draft). The Citation Gate panel is live on the right side — BLOCKED means a PENDING citation is present." },
      { step: "Export or print", desc: "Use 'Export PDF' or 'Print' once the Citation Gate shows SAFE on all citations. The pre-filing checklist auto-generates." },
    ],
    tips: [
      "Discharge Application v6 (/discharge-print) has inline citation blocks — each decision shows holding + annexure reference + verification badge.",
      "Use Safe Draft Editor for final manual review. The gate panel updates live as you type.",
      "Hindi drafts: all holdings are presented verbatim in the source language — no auto-translation of legal text.",
    ],
    accuracyNote: "Holdings are NEVER paraphrased. All verbatim quotes come from verified source documents only.",
  },
  {
    id: "citation_verification",
    icon: ShieldCheck,
    color: "text-green-600",
    title: "Citation Verification",
    titleHi: "उद्धरण सत्यापन",
    badge: "Core",
    StatutoryFeature: "Citation Verification",
    overview: "4-layer citation verification system. Every citation must carry: full case name + reporter + court + date + verified URL + para number. PENDING = blocked. FATAL_ERROR = permanently rejected.",
    route: "/verification",
    steps: [
      { step: "Go to Verification Panel", desc: "Navigate to Review → Verification in the sidebar, or from any draft click 'Verify Citations'." },
      { step: "Review each citation tier", desc: "COURT_SAFE: certified copy + para number confirmed. VERIFIED: confirmed on official source. SECONDARY: credible secondary source. PENDING: unverified — BLOCKED. FATAL_ERROR: fabricated — BLOCKED." },
      { step: "Resolve PENDING citations", desc: "For each PENDING citation, either (a) find and verify the source URL, upgrade to VERIFIED, or (b) remove from draft." },
      { step: "Check Citation Safety Gate", desc: "Open Safe Draft Editor — the right-side panel shows SAFE (green), WARN (amber), or BLOCKED (red). Draft export is disabled until all citations clear." },
      { step: "Open Citation Deep-Links", desc: "Each VERIFIED citation has a 🔗 icon linking to the exact paragraph in the source document (Manupatra / SCC Online / Indian Kanoon)." },
      { step: "Export Verification Report", desc: "Every draft auto-generates a Verification Report listing tier of each citation. Attach it to the filing as exhibit." },
    ],
    tips: [
      "Never remove the Citation Gate — it enforces Accuracy Rule 6 (protected file).",
      "Use Citation Explorer (/citation-search) to search 25+ verified judicial authorities.",
      "Citation Authority viewer (/authority/:id) shows full judgment text with highlighted paragraph.",
    ],
    accuracyNote: "PENDING citations MUST NOT appear in any court document. The gate physically prevents export if PENDING citations exist.",
  },
  {
    id: "chronology",
    icon: Clock,
    color: "text-amber-600",
    title: "Case Chronology Generation",
    titleHi: "केस कालक्रम निर्माण",
    badge: "W10",
    StatutoryFeature: "Case Chronology Generation",
    overview: "Automatically convert case documents and facts into a structured, source-cited timeline. Three independent parsers extract events. Every entry requires advocate acceptance before export.",
    route: "/chronology",
    steps: [
      { step: "Open Chronology Studio", desc: "Navigate to /case/{id}/chronology. The studio shows three panels: Generate, Filter, and Export." },
      { step: "Click Generate", desc: "Three parsers run simultaneously: Case Facts Timeline parser, Cross-Reference Matrix parser, Deadline Events parser." },
      { step: "Review proposed entries", desc: "All entries start as 'Proposed'. Each shows: date, event (EN + HI), source citation, confidence tier (VERIFIED / SECONDARY), needs_review flag." },
      { step: "Accept / Edit / Reject each entry", desc: "Accept: confirms the entry. Edit: opens a dialog to correct event text (EN + HI) or fix the date. Reject: moves to rejected lane (kept for audit trail, not exported)." },
      { step: "Handle 'Needs Dating' entries", desc: "Entries with no date appear in the amber 'Needs Dating' lane. Edit them to add a confirmed date before accepting." },
      { step: "Export", desc: "Markdown export (clipboard) or Print (window.print()). Only ACCEPTED entries appear in the output. Source citations preserved." },
    ],
    tips: [
      "Undated entries are never silently guessed — they always surface in the Needs Dating lane.",
      "Rejected entries remain in the store for audit trail — they are never deleted.",
      "Export Markdown is suitable as Annexure to written submissions.",
    ],
  },
  {
    id: "case_management",
    icon: Scale,
    color: "text-primary",
    title: "Case Management",
    titleHi: "केस प्रबंधन",
    badge: "Core",
    StatutoryFeature: "Case Management",
    overview: "Organise matters, documents, hearings, tasks, and case information in one place. 26 synthetic demo cases. LocalStorage-first — works fully offline.",
    route: "/cases",
    steps: [
      { step: "View all cases", desc: "Click 'All Cases' in the sidebar, or go to /cases. The case selector shows all active cases with court, case number, and status." },
      { step: "Create a new case", desc: "Click 'New Case Intake' (/intake) to create a new case manually, or use 'AI Case Ingest' (/new-case-ingest) to upload documents and auto-populate." },
      { step: "Load a demo case", desc: "Click '26 Demo Cases' to browse the synthetic case library. Select any TC-01 to TC-26 to load it as the active case." },
      { step: "Switch between cases", desc: "Click any case in the sidebar case selector or in the Home page 'Recent Cases' widget. All tools update to the selected case instantly." },
      { step: "Manage documents", desc: "Go to /case/{id}/documents to view, organise, and tag uploaded documents. Use /case/{id}/upload to add new files." },
      { step: "Dashboard view", desc: "Go to /case/{id}/dashboard for the full bento-grid dashboard showing all case stats, timeline, citations, and strategy pillars." },
    ],
    tips: [
      "Cases persist in localStorage — no backend required for the demo.",
      "Demo cases (TC-01 to TC-26) cover criminal defence, NDPS, NI Act, electronic evidence, infrastructure arbitration, and more.",
      "Use 'Duplicate Case' to create a working copy before major edits.",
    ],
  },
  {
    id: "court_tracking",
    icon: Gavel,
    color: "text-orange-600",
    title: "Court & Case Tracking",
    titleHi: "न्यायालय और वाद अनुसरण",
    badge: "NEW",
    StatutoryFeature: "Court & Case Tracking",
    overview: "Track case status, hearings, orders, and court information. View hearing history, court orders (interim, final, bail), and upcoming dates — all in one timeline.",
    route: "/court-tracker",
    steps: [
      { step: "Open Court Tracker", desc: "Navigate to /court-tracker or click 'Court Tracker' in the Case Setup sidebar group." },
      { step: "View Hearing History", desc: "The default tab shows all hearings with status: Listed / Adjourned / Disposed / Reserved / Part Heard. Each hearing shows date, judge, purpose, and order summary." },
      { step: "Check next hearing", desc: "The blue alert card at the top always shows the next listed hearing date, court, and judge." },
      { step: "View Court Orders", desc: "Switch to the 'Court Orders' tab to see all orders: Interim, Final, Procedural, Bail. Orders show verification status." },
      { step: "Case Info tab", desc: "Shows a structured summary: case title, case number, court, status, total hearings, orders passed." },
      { step: "Refresh", desc: "Click 'Refresh' to simulate a live eCourts status check (demo: re-renders with same synthetic data)." },
    ],
    tips: [
      "Real deployment: connect to eCourts India Case Status API for live hearing updates.",
      "Filter hearings by judge, court, or purpose using the search bar.",
      "Unverified orders are flagged with an amber warning icon — verify before citing.",
    ],
  },
  {
    id: "deadlines",
    icon: AlertTriangle,
    color: "text-red-600",
    title: "Limitation & Deadline Tracking",
    titleHi: "परिसीमा और समय-सीमा अनुसरण",
    badge: "W10",
    StatutoryFeature: "Limitation & Deadline Tracking",
    overview: "Keep track of limitation periods, filing deadlines, and case-related dates. Kanban board (Overdue / This Week / Upcoming / Filed) and month calendar with bilingual labels.",
    route: "/deadlines",
    steps: [
      { step: "Open Deadline Board", desc: "Navigate to /case/{id}/deadlines. The board shows 4 Kanban columns: Overdue (red), This Week (amber), Upcoming (blue), Filed (green)." },
      { step: "Read each deadline card", desc: "Each card shows: deadline name (EN + HI), rule ID, statutory basis in English and Hindi, due date, and days remaining." },
      { step: "Switch to Calendar view", desc: "Click the calendar toggle to see deadlines as chips on a monthly calendar. Navigate months with arrow keys." },
      { step: "Click a chip for details", desc: "Any calendar chip expands to show rule_id, basis_en, basis_hi, and computed due date." },
      { step: "Check overdue on Home", desc: "The Home dashboard shows an overdue deadlines card (red) if any deadlines are past due. Click 'View All Deadlines' to go to the board." },
      { step: "Mark as filed", desc: "Click 'Mark Filed' on any deadline card to move it to the Filed column." },
    ],
    tips: [
      "Limitation Act 1963 court vacation exclusions are applied automatically.",
      "All dates in demo mode are synthetic — adjust for your actual case date.",
      "The deadline engine rule ID maps to the specific Limitation Act provision (e.g. Art. 113, Art. 131).",
    ],
  },
  {
    id: "documents",
    icon: FileText,
    color: "text-blue-500",
    title: "Document Management",
    titleHi: "दस्तावेज़ प्रबंधन",
    badge: "Core",
    StatutoryFeature: "Document Management",
    overview: "Store and organise case-related documents. Smart ingest classifies documents automatically. Client-side PII redaction before any AI processing.",
    route: "/new-case-ingest",
    steps: [
      { step: "AI Case Ingest", desc: "Go to /new-case-ingest. Drag PDF, DOCX, images, or scanned documents into the OmniDropzone." },
      { step: "Auto-classification", desc: "The smart drop agent classifies each file: FIR, Charge Sheet, FSL Report, Expert Opinion, Order, Pleading, etc." },
      { step: "PII Redaction (before AI)", desc: "Before any text is sent to AI, the client-side redaction layer strips PII: names, addresses, phone numbers, PAN/Aadhaar." },
      { step: "Review & Register", desc: "Review the extraction preview — extracted timeline events, citations, standard references. Click 'Register to Case' to add to the active case." },
      { step: "Manage documents", desc: "View all registered documents at /case/{id}/documents. Tag, rename, or remove documents." },
      { step: "Upload additional files", desc: "Use /case/{id}/upload for batch upload with drag-and-drop state machine: Idle → Uploading → Processing → Complete." },
    ],
    tips: [
      "PII redaction runs entirely in-browser — no file content leaves your device during redaction.",
      "Supported formats: PDF, DOCX, DOC, PNG, JPG, TIFF (scanned), TXT.",
      "OCR for Hindi scanned documents works best with high-resolution (300 DPI+) scans.",
    ],
  },
  {
    id: "client_matter",
    icon: Users,
    color: "text-indigo-600",
    title: "Client & Matter Management",
    titleHi: "मुवक्किल और वाद प्रबंधन",
    badge: "NEW",
    StatutoryFeature: "Client & Matter Management",
    overview: "Maintain case-wise and client-wise information in a centralised workspace. Client profiles link to all their active matters. Stored locally — no PII transmitted.",
    route: "/client-matter",
    steps: [
      { step: "Open Client & Matter", desc: "Navigate to /client-matter or click 'Clients & Matters' in the Case Setup group." },
      { step: "Switch between Matters and Clients tabs", desc: "Matters tab: see all matters with status, court, next date, charges. Clients tab: see client profiles with matter count." },
      { step: "Filter by client", desc: "Use the client filter pills below the tab bar to show only matters for a specific client." },
      { step: "Search", desc: "Search by matter title, court name, or case number in the search bar." },
      { step: "View client matters", desc: "From the Clients tab, click 'View Matters' on any client to switch to the Matters tab pre-filtered for that client." },
      { step: "Add new matter", desc: "Click 'New Matter' to create a new matter record linked to a client." },
    ],
    tips: [
      "All data is stored in localStorage — fully private, no server upload.",
      "Link a matter to a Legal Luminaire case by using the same case number.",
      "Next hearing dates surface in the Matters list for quick overview.",
    ],
  },
  {
    id: "workflow_automation",
    icon: Zap,
    color: "text-yellow-600",
    title: "Litigation Workflow Automation",
    titleHi: "मुकदमेबाजी कार्यप्रवाह स्वचालन",
    badge: "NEW",
    StatutoryFeature: "Litigation Workflow Automation",
    overview: "Guided, step-by-step automation for discharge applications, bail applications, written submissions, and trial preparation. Each step links directly to the relevant tool.",
    route: "/litigation-workflow",
    steps: [
      { step: "Open Workflow Automation", desc: "Navigate to /litigation-workflow or click 'Workflow Automation' in the sidebar." },
      { step: "Select workflow type", desc: "Choose from: Discharge Application, Bail Application, Written Submissions, Trial Preparation." },
      { step: "Follow the step sequence", desc: "Each step shows its status: Done (green), In Progress (blue), Pending (grey), Blocked (red). Steps marked 'AI-Automated' run automatically." },
      { step: "Click Continue or Start", desc: "For In Progress steps, click Continue to return to the tool. For Pending steps, click Start to launch the tool for that step." },
      { step: "Track overall progress", desc: "The large percentage meter at top right shows how far through the workflow you are." },
      { step: "BLOCKED steps", desc: "Blocked steps (e.g. Pre-Filing Checklist) require manual advocate sign-off and cannot be auto-completed." },
    ],
    tips: [
      "Discharge Application workflow follows all 12 grounds used in the Hemraj demo case.",
      "AI-Automated steps use the full accuracy stack — Fact-Fit Gate, citation verification, IS standard check.",
      "Non-AI steps (marked without the badge) require human judgement — never skip them.",
    ],
  },
  {
    id: "ai_agents",
    icon: Bot,
    color: "text-primary",
    title: "AI Agents for Legal Workflows",
    titleHi: "विधिक कार्यप्रवाह के लिए AI एजेंट",
    badge: "NEW",
    StatutoryFeature: "AI Agents for Legal Workflows",
    overview: "Dedicated AI agents: Research, Drafting, Citation Verification, Chronology, Deadline Engine, Standards Explorer, Ask Luminaire Copilot, Accuracy Academy — each with defined scope and accuracy constraints.",
    route: "/ai-agents",
    steps: [
      { step: "Open AI Agents Dashboard", desc: "Navigate to /ai-agents. See all 8 active agents with their capabilities, status, and launch buttons." },
      { step: "Understand agent scope", desc: "Each agent has a strictly defined scope. The Copilot, for example, is read-only and refuses out-of-scope queries." },
      { step: "Launch an agent", desc: "Click 'Launch Agent' on any card to go directly to that agent's tool." },
      { step: "Check accuracy rules", desc: "The 'Accuracy Non-Negotiables' panel at the bottom lists the 6 rules all agents enforce — these cannot be overridden." },
      { step: "Core vs Integration agents", desc: "Core agents (Research, Drafting, Citation Verification) are always-on. Integration agents (Chronology, Deadline, Standards, Copilot, Academy) are behind feature flags." },
    ],
    tips: [
      "Core accuracy agents cannot be disabled — they are hardwired into the accuracy stack.",
      "Use the AI Agents Dashboard as the starting point for any new matter.",
      "Each agent's badge shows which integration week it was delivered in (Core, W7, W10, W11, W12).",
    ],
    accuracyNote: "All 8 agents enforce the same 5 accuracy rules: verbatim holdings, PENDING blocking, IS standard guard, Fact-Fit Gate, SYNTHETIC data labelling.",
  },
  {
    id: "integrated_workspace",
    icon: Home,
    color: "text-muted-foreground",
    title: "Integrated Litigation Workspace",
    titleHi: "एकीकृत मुकदमेबाजी कार्यस्थान",
    badge: "Core",
    StatutoryFeature: "Integrated Litigation Workspace",
    overview: "Legal Luminaire is the integrated workspace — a single platform replacing multiple tools: research databases, drafting software, deadline trackers, standards databases, and document stores.",
    route: "/",
    steps: [
      { step: "Start at Home", desc: "The Home page is your command centre — active case stats, quick-access tool grid, overdue deadlines alert, Priority Actions, Defence Strength Radar." },
      { step: "Use the Guided Flow", desc: "Click 'Start Guided Flow' on the Home page for a step-by-step walkthrough: Intake → Research → Draft → Review." },
      { step: "Four sidebar groups", desc: "Case Setup (intake, documents), Research (case law, standards, AI engine), Drafting (AI draft, safe editor, oral arguments), Review (verification, checklist, academy)." },
      { step: "Case-scoped navigation", desc: "All main tools are case-scoped: switching the active case updates every tool — research, timeline, citations, drafts — to the new case instantly." },
      { step: "Demo Mode", desc: "Click the Demo Mode card to load the Hemraj building collapse case and see a pre-populated accuracy-first workflow in action." },
      { step: "Export & file", desc: "Every output — drafts, verification reports, chronology exports, pre-filing checklists — can be exported as PDF or Markdown for filing." },
    ],
    tips: [
      "The workspace runs fully offline once loaded — no internet required for demo mode.",
      "All 26 synthetic demo cases demonstrate different practice area workflows.",
      "The /system/flags route lets developers toggle feature flags at runtime.",
    ],
  },
];

// ── Section Accordion ─────────────────────────────────────────────────────
function SectionCard({ section }: { section: ManualSection }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <Card className="overflow-hidden">
      <button
        className="w-full text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <CardHeader className="pb-3 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted`}>
                <Icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  {section.badge && <Badge variant="outline" className="text-[9px]">{section.badge}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{section.titleHi} · Statutory: "{section.StatutoryFeature}"</p>
              </div>
            </div>
            {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="pt-0 space-y-5 border-t">
          {/* Overview */}
          <div className="pt-4">
            <p className="text-sm leading-relaxed text-foreground/80">{section.overview}</p>
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Step-by-Step Guide</p>
            <div className="space-y-2">
              {section.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{s.step}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs font-semibold text-blue-800 mb-2">💡 Tips & Best Practices</p>
            <ul className="space-y-1.5">
              {section.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accuracy Note */}
          {section.accuracyNote && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700"><strong>Accuracy Rule:</strong> {section.accuracyNote}</p>
            </div>
          )}

          {/* Launch Button */}
          <Link href={section.route}>
            <Button size="sm" className="gap-1.5 text-xs">
              Open {section.title} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      )}
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function HowToUsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const filtered = SECTIONS.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.titleHi.includes(searchTerm) ||
    s.StatutoryFeature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/15 p-3 shrink-0">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Legal Luminaire — How To Use</h1>
            <p className="text-sm text-muted-foreground mt-1">उपयोग मार्गदर्शिका — Complete user manual for all 12 features</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-primary/10 text-primary border-primary/30">12 Features</Badge>
              <Badge variant="outline">Bilingual EN + हिंदी</Badge>
              <Badge variant="outline">Accuracy-First</Badge>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20">SYNTHETIC / DEMO</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Quick Start — 5 minutes to your first accuracy-gated draft
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { step: "1", label: "Load Demo Case", route: "/demo-browser" },
              { step: "2", label: "Research Precedents", route: "/case-research" },
              { step: "3", label: "Check Standards", route: "/standards-index" },
              { step: "4", label: "Draft Document", route: "/ai-draft-engine" },
              { step: "5", label: "Run Citation Gate", route: "/safe-draft" },
            ].map(s => (
              <Link key={s.step} href={s.route}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-200 text-xs font-medium text-green-800 hover:bg-green-100 transition-colors cursor-pointer">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white text-[9px] font-bold">{s.step}</span>
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Rules Summary */}
      <Card className="border-red-100 bg-red-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            6 Accuracy Rules — Enforced Across Every Feature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Every citation: full case name + reporter + court + date + verified URL + para number",
              "Holdings verbatim — paraphrasing is forbidden in all output",
              "PENDING / FATAL_ERROR citations hard-blocked from all drafts",
              "IS 2250:1981 for masonry mortar — IS 1199:2018 auto-flagged",
              "Fact-Fit Gate score < 30 = FATAL ERROR if cited as primary",
              "Every draft includes Verification Report + Pre-Filing Checklist",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[9px] shrink-0 mt-0.5">{i + 1}</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search + Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search features, e.g. 'chronology', 'bail', 'IS standard'…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setExpandAll(!expandAll)} className="shrink-0 text-xs">
          {expandAll ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {SECTIONS.length} features · Click any section to expand</p>

      {/* Feature Sections */}
      <div className="space-y-3">
        {filtered.map(section => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>
          Legal Luminaire is an accuracy-first legal AI workbench for Indian courts.
          All demo data is <strong>SYNTHETIC</strong>. No real client data, PII, or court records are stored.
          For issues or contributions, see the{" "}
          <a href="https://github.com/CRAJKUMARSINGH/legal-luminaire" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub repository</a>.
        </span>
      </div>
    </div>
  );
}
