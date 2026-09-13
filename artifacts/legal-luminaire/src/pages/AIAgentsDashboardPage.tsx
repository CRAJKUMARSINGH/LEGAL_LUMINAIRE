/**
 * AI Agents for Legal Workflows — dedicated AI agents panel.
 * Statutory feature: "AI Agents for Legal Workflows"
 * Shows each agent's capability, status, and links to the relevant page.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot, Search, Edit3, ShieldCheck, Clock, BarChart3,
  BookOpen, FlaskConical, GraduationCap, Zap, ArrowRight,
  CheckCircle2, Info, Sparkles, Scale, MessageSquare, FileText,
} from "lucide-react";
import { Link } from "wouter";
import { useCaseContext } from "@/context/CaseContext";

// ── Agent Definitions ─────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "research",
    name: "Research Agent",
    nameHi: "शोध एजेंट",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "border-blue-200",
    status: "ACTIVE",
    description: "Searches Manupatra, SCC Online, Indian Kanoon and scores every precedent on the 3-axis Fact-Fit Gate (0–100). Only COURT_SAFE / VERIFIED citations reach your draft.",
    capabilities: ["Fact-Fit Gate scoring (3-axis)", "5-tier citation verification", "25+ authority search", "IS/ASTM standard guard"],
    route: "/case-research",
    badge: "Core",
  },
  {
    id: "drafting",
    name: "Drafting Agent",
    nameHi: "प्रारूपण एजेंट",
    icon: Edit3,
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "border-violet-200",
    status: "ACTIVE",
    description: "Generates bilingual (Hindi + English) court documents — discharge applications, bail applications, written submissions, notices — with verbatim citation blocks.",
    capabilities: ["Discharge Application (v6)", "Bail Application", "Written Submissions", "Notice Reply", "Bilingual Hindi + English"],
    route: "/ai-draft-engine",
    badge: "Core",
  },
  {
    id: "citation",
    name: "Citation Verification Agent",
    nameHi: "उद्धरण सत्यापन एजेंट",
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-50",
    ring: "border-green-200",
    status: "ACTIVE",
    description: "Every citation must carry full case name + reporter + court + date + verified URL + para number. PENDING = auto-blocked from all drafts. FATAL_ERROR = rejected.",
    capabilities: ["COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR tiers", "Live Citation Safety Gate", "Deep-link to source paragraph", "Verbatim holding enforcement"],
    route: "/verification",
    badge: "Core",
  },
  {
    id: "chronology",
    name: "Chronology Agent",
    nameHi: "कालक्रम एजेंट",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "border-amber-200",
    status: "ACTIVE",
    description: "Converts case documents and facts into a structured, source-cited timeline. Every entry requires advocate acceptance. Undated entries surface in a 'Needs Dating' amber lane.",
    capabilities: ["3-parser timeline generation", "Accept / edit / reject workflow", "Needs-Dating amber lane", "Export to Markdown / Print"],
    route: "/chronology",
    badge: "W10",
  },
  {
    id: "deadline",
    name: "Deadline Engine Agent",
    nameHi: "समय-सीमा इंजन एजेंट",
    icon: BarChart3,
    color: "text-red-600",
    bg: "bg-red-50",
    ring: "border-red-200",
    status: "ACTIVE",
    description: "Tracks limitation periods, filing deadlines, and court vacation exclusions under the Limitation Act 1963 + court rules. Kanban board + month calendar views.",
    capabilities: ["Limitation Act 1963 rules", "Court vacation exclusions", "Kanban board + calendar", "Bilingual EN + HI labels"],
    route: "/deadlines",
    badge: "W10",
  },
  {
    id: "standards",
    name: "Standards Explorer Agent",
    nameHi: "मानक अन्वेषक एजेंट",
    icon: FlaskConical,
    color: "text-teal-600",
    bg: "bg-teal-50",
    ring: "border-teal-200",
    status: "ACTIVE",
    description: "50+ IS, ASTM, NABL, and BIS standards translated into plain-language courtroom arguments. Enforces IS 2250:1981 for masonry mortar — flags IS 1199:2018 misuse.",
    capabilities: ["IS 2250:1981 / ASTM C1324 enforcement", "Plain-language translation", "Source URL + clause number", "Usage reporting"],
    route: "/standards-index",
    badge: "W11",
  },
  {
    id: "copilot",
    name: "Ask Luminaire Copilot",
    nameHi: "लुमिनेयर सहायक",
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/5",
    ring: "border-primary/30",
    status: "ACTIVE",
    description: "Read-only conversational agent grounded strictly to the active case record. Refuses out-of-scope queries. Every response cites pinpoint paragraph source with deep-link.",
    capabilities: ["Grounded to case record only", "Out-of-scope refusal", "Citation deep-links", "Streaming responses"],
    route: "/copilot",
    badge: "W7–9",
  },
  {
    id: "academy",
    name: "Accuracy Academy Agent",
    nameHi: "सटीकता अकादमी एजेंट",
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    ring: "border-indigo-200",
    status: "ACTIVE",
    description: "Interactive branching simulation teaching advocates to evaluate AI trade-offs: verification depth, time spent, client safety risk. Uses real Legal Luminaire citation gate logic.",
    capabilities: ["Branching decision walkthrough", "Live trade-off meters", "Citation gate simulation", "Client safety risk scores"],
    route: "/academy",
    badge: "W12",
  },
];

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  BETA:   { label: "Beta",   color: "bg-amber-100 text-amber-700" },
  COMING: { label: "Coming", color: "bg-gray-100 text-gray-600"   },
};

export default function AIAgentsDashboardPage() {
  const { isDemoMode, selectedCaseId } = useCaseContext();

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Agents for Legal Workflows
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            विधिक कार्यप्रवाह के लिए AI एजेंट — dedicated agents for research, drafting, verification, chronology, deadlines, standards, and copilot
          </p>
        </div>
        {isDemoMode && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>}
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Agents", value: AGENTS.filter(a => a.status === "ACTIVE").length, icon: Bot, color: "text-green-500" },
          { label: "Core (Always-On)", value: AGENTS.filter(a => a.badge === "Core").length, icon: ShieldCheck, color: "text-primary" },
          { label: "Integration Agents", value: AGENTS.filter(a => a.badge !== "Core").length, icon: Sparkles, color: "text-violet-500" },
        ].map(s => (
          <Card key={s.label} className="glass-surface">
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className={`h-7 w-7 ${s.color}`} />
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map(agent => {
          const Icon = agent.icon;
          const statusCfg = STATUS_CONFIG[agent.status as keyof typeof STATUS_CONFIG];
          const href = agent.route.startsWith("/") && !agent.route.startsWith("/case")
            ? `/case/${selectedCaseId}${agent.route}`
            : agent.route;

          return (
            <Card key={agent.id} className={`hover:shadow-lg transition-all border ${agent.ring} group`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${agent.bg}`}>
                      <Icon className={`h-5 w-5 ${agent.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{agent.nameHi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[9px]">{agent.badge}</Badge>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground border border-border/60">
                      <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />{cap}
                    </span>
                  ))}
                </div>
                <Link href={href}>
                  <Button variant="outline" size="sm" className="w-full mt-3 gap-1.5 group-hover:border-primary/40 group-hover:text-primary transition-colors text-xs">
                    Launch Agent <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accuracy Non-Negotiables */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Accuracy Non-Negotiables (always enforced across all agents)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Every citation: full case name + reporter + court + date + verified URL + para number",
              "Holdings verbatim — paraphrasing is forbidden in all code paths",
              "PENDING / FATAL_ERROR citations hard-blocked from all draft output",
              "IS 2250:1981 for masonry mortar — IS 1199:2018 auto-flagged as wrong standard",
              "Fact-Fit Gate: score < 30 = auto-rejected, never cited as primary authority",
              "Every draft includes Verification Report + Pre-Filing Checklist",
            ].map(rule => (
              <div key={rule} className="flex items-start gap-2 text-xs text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>All agents operate on <strong>SYNTHETIC / DEMO</strong> data in this deployment. Core accuracy agents (Research, Citation Verification, Standards) are always-on and cannot be disabled by feature flags.</span>
      </div>
    </div>
  );
}
