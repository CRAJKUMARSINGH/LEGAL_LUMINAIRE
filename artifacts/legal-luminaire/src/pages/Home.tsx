import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale, FileText, BookOpen, FlaskConical, Clock,
  AlertTriangle, CheckCircle2, Info, ArrowRight,
  MessageSquare, LayoutDashboard, Files, Upload, PlayCircle,
} from "lucide-react";
import {
  caseInfo, caseLawMatrix, standardsMatrix,
  timelineEvents, caseDocuments,
} from "@/data/caseData";

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

export default function Home() {
  const verifiedCount  = caseLawMatrix.filter((c) => c.status === "VERIFIED").length;
  const pendingCount   = caseLawMatrix.filter((c) => c.status === "PENDING").length;
  const secondaryCount = caseLawMatrix.length - verifiedCount - pendingCount;
  const total          = caseLawMatrix.length;

  const stats = [
    { label: "Case Documents",      value: caseDocuments.length,   icon: FileText,    color: "text-blue-500" },
    { label: "Case Law Citations",  value: caseLawMatrix.length,   icon: BookOpen,    color: "text-emerald-500" },
    { label: "Standards Referenced",value: standardsMatrix.length, icon: FlaskConical,color: "text-violet-500" },
    { label: "Timeline Events",     value: timelineEvents.length,  icon: Clock,       color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">

      {/* ── Demo CTA Banner ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-center gap-4">
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

      {/* ── Case Header ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3 shrink-0">
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

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
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
