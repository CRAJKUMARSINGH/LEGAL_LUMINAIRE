import { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale, FileText, BookOpen, FlaskConical, Clock,
  AlertTriangle, CheckCircle2, Info, ArrowRight,
  MessageSquare, LayoutDashboard, Files, Upload, PlayCircle,
  Zap, Target,
} from "lucide-react";
import {
  caseInfo, caseLawMatrix, standardsMatrix,
  timelineEvents, caseDocuments,
} from "@/data/caseData";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";

// ── Status badge (mirrors DashboardView from update) ──────────────────────
type VS = "VERIFIED" | "SECONDARY" | "PENDING";
const StatusBadge = ({ status }: { status: VS }) => {
  const cfg: Record<VS, { variant: "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
    VERIFIED:  { variant: "default",    icon: <CheckCircle2 className="h-3 w-3" /> },
    SECONDARY: { variant: "secondary",  icon: <Info className="h-3 w-3" /> },
    PENDING:   { variant: "outline",    icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const { variant, icon } = cfg[status];
  return (
    <Badge variant={variant} className="gap-1 text-xs">
      {icon} {status}
    </Badge>
  );
};

// ── Quick-access nav (same tools as sidebar) ──────────────────────────────
const QUICK_LINKS = [
  { href: "/case/case01/dashboard",             label: "Dashboard",            icon: LayoutDashboard },
  { href: "/case/case01/chat",                  label: "AI Drafter",           icon: MessageSquare },
  { href: "/case/case01/timeline",              label: "Case Timeline",        icon: Clock },
  { href: "/case/case01/case-law",              label: "Case Law Matrix",      icon: BookOpen },
  { href: "/case/case01/standards",             label: "Standards Matrix",     icon: FlaskConical },
  { href: "/case/case01/documents",             label: "Documents",            icon: Files },
  { href: "/case/case01/upload",                label: "Upload Files",         icon: Upload },
  { href: "/case/case01/discharge-application", label: "Discharge App",        icon: Scale },
  { href: "/case/case01/defence-reply",         label: "Defence Reply v4",     icon: FileText },
];

const STRATEGY_PILLARS = [
  "Chain-of-custody gaps in forensic sampling",
  "Weather contamination during sample collection",
  "Absence of contractor representation",
  "Non-representative / haphazard sampling method",
  "FSL report foundation challenge",
  "BIS/IS procedural non-compliance",
];

// ── Defence Strength Radar data (derived from case evidence) ──────────────
const RADAR_DATA = [
  { pillar: "Chain of Custody",   score: 72, fullMark: 100 },
  { pillar: "Sampling Method",    score: 80, fullMark: 100 },
  { pillar: "Weather Evidence",   score: 58, fullMark: 100 },
  { pillar: "Standards (BIS/IS)", score: 65, fullMark: 100 },
  { pillar: "Natural Justice",    score: 85, fullMark: 100 },
  { pillar: "FSL Challenge",      score: 70, fullMark: 100 },
];

const overallStrength = Math.round(
  RADAR_DATA.reduce((sum, d) => sum + d.score, 0) / RADAR_DATA.length
);

// ── Priority Action Items (auto-derived from pending case law) ─────────────
const PRIORITY_ACTIONS = caseLawMatrix
  .filter((c) => c.status === "PENDING")
  .map((c) => ({ task: c.action, citation: c.case.split(",")[0], court: c.court }))
  .concat(
    timelineEvents
      .filter((e) => e.note)
      .map((e) => ({ task: e.note, citation: e.title, court: "Evidence" }))
  )
  .slice(0, 5);

export default function Home() {
  const verifiedCount  = useMemo(() => caseLawMatrix.filter((c) => c.status === "VERIFIED").length, []);
  const pendingCount   = useMemo(() => caseLawMatrix.filter((c) => c.status === "PENDING").length, []);
  const secondaryCount = useMemo(() => caseLawMatrix.length - verifiedCount - pendingCount, [verifiedCount, pendingCount]);
  const total          = caseLawMatrix.length;

  const stats = useMemo(() => [
    { label: "Case Documents",      value: caseDocuments.length,   icon: FileText,    color: "text-blue-500" },
    { label: "Case Law Citations",  value: caseLawMatrix.length,   icon: BookOpen,    color: "text-emerald-500" },
    { label: "Standards Referenced",value: standardsMatrix.length, icon: FlaskConical,color: "text-violet-500" },
    { label: "Timeline Events",     value: timelineEvents.length,  icon: Clock,       color: "text-amber-500" },
  ], []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">

      {/* ── Demo CTA Banner ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 backdrop-blur-md p-4 flex items-center gap-4 hover-elevate transition-colors">
        <PlayCircle className="h-8 w-8 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900 text-sm">Try the Demo — No API key needed</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Explore 21 pre-loaded case types: forensic defence, NDPS bail, writ petitions, consumer complaints and more.
          </p>
        </div>
        <Link href="/case/case01/dashboard">
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" /> Try Demo
          </Button>
        </Link>
      </div>

      {/* ── Bento grid (2025 layout) ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Case Header (hero tile) */}
        <div className="lg:col-span-8 rounded-xl glass-surface-strong neon-ring p-6 hover-elevate">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3 shrink-0">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground">{caseInfo.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{caseInfo.summary}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="destructive">{caseInfo.charges}</Badge>
                <Badge variant="outline">{caseInfo.court}</Badge>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{caseInfo.status}</Badge>
              </div>
            </div>
            <Link href="/case/case01/dashboard">
              <Button size="sm" className="gap-1.5 shrink-0 hidden sm:flex">
                Open Case <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access tile */}
        <div className="lg:col-span-4 rounded-xl glass-surface p-5 hover-elevate">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Quick Access</p>
            <Badge variant="outline" className="text-[10px]">Bento</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUICK_LINKS.slice(0, 6).map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground leading-tight">{label}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/60">
            <Link href="/case/case01/upload">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Upload documents
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-surface hover-elevate">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Gift: Defence Strength Radar + Priority Actions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Radar Chart */}
        <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Defence Strength Analysis
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs">
                {overallStrength}% Overall
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Pillar-by-pillar strength based on verified evidence &amp; precedents
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="pillar"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`${v}%`, "Strength"]}
                />
                <Radar
                  name="Defence"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {RADAR_DATA.map((d) => (
                <div key={d.pillar} className="flex flex-col items-center gap-0.5">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-center leading-tight">{d.pillar}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Action Items */}
        <Card className="glass-surface hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Priority Actions
              <Badge className="ml-auto bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                {PRIORITY_ACTIONS.length} pending
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Auto-generated from pending citations &amp; evidence gaps
            </p>
          </CardHeader>
          <CardContent className="pt-0 space-y-2.5">
            {PRIORITY_ACTIONS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug">{item.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {item.citation} · {item.court}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-1">
              <Link href="/case/case01/case-law">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  <BookOpen className="h-3 w-3" /> View Full Case Law Matrix
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Verification + Strategy ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Citation Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Citation Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Verified",   count: verifiedCount,  barClass: "bg-primary",    pct: verifiedCount / total },
              { label: "Secondary",  count: secondaryCount, barClass: "bg-secondary-foreground/30", pct: secondaryCount / total },
              { label: "Pending",    count: pendingCount,   barClass: "bg-amber-500",  pct: pendingCount / total },
            ].map(({ label, count, barClass, pct }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barClass} transition-all duration-500`}
                    style={{ width: `${Math.round(pct * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="pt-2 border-t border-border flex flex-wrap gap-3">
              {caseLawMatrix.slice(0, 4).map((c) => (
                <div key={c.case} className="flex items-center gap-1.5 min-w-0">
                  <StatusBadge status={c.status as VS} />
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">{c.case.split(",")[0]}</span>
                </div>
              ))}
              {caseLawMatrix.length > 4 && (
                <Link href="/case/case01/case-law">
                  <span className="text-xs text-primary hover:underline cursor-pointer">
                    +{caseLawMatrix.length - 4} more →
                  </span>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Defence Strategy Pillars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defence Strategy Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {STRATEGY_PILLARS.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <Link href="/case/case01/discharge-application">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <Scale className="h-3.5 w-3.5" /> View Discharge Application
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Access Nav ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Quick Access
            <Link href="/intake">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                + New Case
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="group flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-center">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground leading-tight">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Case Law (top 3) ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Key Precedents
            <Link href="/case/case01/case-law">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseLawMatrix.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <StatusBadge status={c.status as VS} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.case}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.useForDefence}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{c.court}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
