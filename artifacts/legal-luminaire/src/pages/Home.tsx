import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scale, FileText, BookOpen, FlaskConical, Clock,
  MessageSquare, LayoutDashboard, Files, Upload,
  ShieldCheck, Zap, ArrowRight, CheckCircle2,
  Gavel, ScrollText, Search,
} from "lucide-react";

// ── Feature cards ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Zero-Hallucination",
    desc: "Every citation verified — VERIFIED / SECONDARY / PENDING badges on all precedents before filing.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Gavel,
    title: "Court-Ready Drafts",
    desc: "Hindi discharge applications u/s 250 BNSS 2023, bail applications, written submissions — print-ready.",
    color: "text-primary",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: Search,
    title: "Multi-Agent Research",
    desc: "Researcher → Verifier → Drafter pipeline. Checks Indian Kanoon, SCC Online, BIS portal automatically.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: FlaskConical,
    title: "IS / ASTM Standards",
    desc: "IS 2250, IS 3535, ASTM C1324, NABL — forensic sampling protocol violations mapped to legal grounds.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: ScrollText,
    title: "Chain-of-Custody Analysis",
    desc: "Kattavellai (2025 INSC 845) binding precedent applied. CoC defect scoring with litigation impact.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Zap,
    title: "RAG + CrewAI Backend",
    desc: "ChromaDB vector store, LangChain agents, Tavily web search — all wired to your uploaded case docs.",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
];

// ── Quick access tools ─────────────────────────────────────────────────────
const TOOLS = [
  { href: "/case/case01/dashboard", label: "Case Dashboard", icon: LayoutDashboard, color: "text-primary" },
  { href: "/case/case01/discharge-application", label: "Discharge Application", icon: Scale, color: "text-emerald-600" },
  { href: "/case/case01/defence-reply", label: "Defence Reply v3", icon: FileText, color: "text-blue-600" },
  { href: "/case/case01/case-law", label: "Case Law Matrix", icon: BookOpen, color: "text-violet-600" },
  { href: "/case/case01/standards", label: "Standards Matrix", icon: FlaskConical, color: "text-amber-600" },
  { href: "/case/case01/timeline", label: "Case Timeline", icon: Clock, color: "text-rose-600" },
  { href: "/case/case01/chat", label: "AI Drafter Chat", icon: MessageSquare, color: "text-teal-600" },
  { href: "/case/case01/documents", label: "Documents", icon: Files, color: "text-slate-600" },
  { href: "/case/case01/upload", label: "Upload Files", icon: Upload, color: "text-indigo-600" },
  { href: "/case/case01/oral-arguments", label: "Oral Arguments", icon: Gavel, color: "text-orange-600" },
];

// ── Active case pill ───────────────────────────────────────────────────────
const ACTIVE_CASE = {
  id: "case01",
  title: "Hemraj Vardar — Stadium Wall Collapse",
  caseNo: "Special Session 1/2025 · Udaipur",
  status: "Active — Defence Preparation",
  docs: 16,
  drafts: 3,
};

export default function Home() {
  return (
    <div className="min-h-full bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Subtle radial gradient backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(43 85% 50% / 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, hsl(230 45% 14% / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-20 flex flex-col items-center text-center gap-6">
          {/* Logo mark */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-sidebar shadow-lg mb-2">
            <Scale className="w-8 h-8 text-sidebar-primary" />
          </div>

          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/5"
          >
            <ShieldCheck className="w-3 h-3" />
            Zero-Hallucination · Fact-Fit Enforced · Court-Ready
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight max-w-4xl">
            Legal Luminaire
            <span className="block text-primary mt-1">Defence AI Platform</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Multi-agent AI for Indian criminal defence — verified citations, IS/ASTM forensic
            standards analysis, chain-of-custody scoring, and court-ready Hindi drafts.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link href="/case/case01/dashboard">
              <Button size="lg" className="gap-2 shadow-md font-semibold px-6">
                <LayoutDashboard className="w-4 h-4" />
                Open Case Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/case/case01/discharge-application">
              <Button size="lg" variant="outline" className="gap-2 px-6">
                <Scale className="w-4 h-4" />
                View Discharge Application
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-muted-foreground">
            {[
              "Kattavellai 2025 INSC 845",
              "IS 2250:1981 · IS 3535:1986",
              "ASTM C1324 · NABL ISO 17025",
              "BNSS 2023 §250 Discharge",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVE CASE BANNER ───────────────────────────────────────────── */}
      <section className="border-b border-border bg-sidebar/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-sm font-semibold text-foreground">{ACTIVE_CASE.title}</span>
              <span className="text-xs text-muted-foreground ml-2">{ACTIVE_CASE.caseNo}</span>
            </div>
            <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-xs">
              {ACTIVE_CASE.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Files className="w-3.5 h-3.5" /> {ACTIVE_CASE.docs} Documents</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {ACTIVE_CASE.drafts} Drafts</span>
            <Link href={`/case/${ACTIVE_CASE.id}/dashboard`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                Open <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-14 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Built for Indian Criminal Defence
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Every feature designed around the realities of Indian courts — BNSS, BNS, PC Act, BIS standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`rounded-xl border border-border p-5 space-y-3 ${f.bg} hover:shadow-sm transition-shadow`}
              >
                <div className={`w-9 h-9 rounded-lg bg-background/80 flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── QUICK ACCESS TOOLS ───────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              Quick Access — Case 01 · Hemraj Vardar
            </h2>
            <Link href="/intake">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" /> New Case
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href}>
                  <div className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer text-center">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className={`w-5 h-5 ${tool.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className="text-xs font-medium text-foreground leading-tight">{tool.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Legal Luminaire</span>
            <span>· AI-Assisted Defence Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Strictly Confidential</span>
            <span>·</span>
            <span>Special Session 1/2025 · Udaipur</span>
            <span>·</span>
            <span>v3 FINAL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
