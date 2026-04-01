import { caseInfo, caseLawMatrix, standardsMatrix, timelineEvents, caseDocuments } from "@/data/caseData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, BookOpen, FlaskConical, Clock, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const variant = status === "VERIFIED" ? "default" : status === "SECONDARY" ? "secondary" : "outline";
  const icon = status === "VERIFIED" ? <CheckCircle2 className="h-3 w-3" /> : status === "SECONDARY" ? <Info className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />;
  return (
    <Badge variant={variant} className="gap-1 text-xs">
      {icon} {status}
    </Badge>
  );
};

export const DashboardView = () => {
  const verifiedCount = caseLawMatrix.filter((c) => c.status === "VERIFIED").length;
  const pendingCount = caseLawMatrix.filter((c) => c.status === "PENDING").length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Case Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{caseInfo.title}</h2>
            <p className="text-muted-foreground mt-1">{caseInfo.summary}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="destructive">{caseInfo.charges}</Badge>
              <Badge variant="outline">{caseInfo.court}</Badge>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{caseInfo.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Case Documents", value: caseDocuments.length, icon: FileText, color: "text-blue-500" },
          { label: "Case Law Citations", value: caseLawMatrix.length, icon: BookOpen, color: "text-emerald-500" },
          { label: "Standards Referenced", value: standardsMatrix.length, icon: FlaskConical, color: "text-violet-500" },
          { label: "Timeline Events", value: timelineEvents.length, icon: Clock, color: "text-amber-500" },
        ].map((s) => (
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

      {/* Verification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Citation Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verified</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(verifiedCount / caseLawMatrix.length) * 120}px` }} />
                <span className="text-sm font-medium">{verifiedCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Secondary</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-secondary" style={{ width: `${((caseLawMatrix.length - verifiedCount - pendingCount) / caseLawMatrix.length) * 120}px` }} />
                <span className="text-sm font-medium">{caseLawMatrix.length - verifiedCount - pendingCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(pendingCount / caseLawMatrix.length) * 120}px` }} />
                <span className="text-sm font-medium">{pendingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defence Strategy Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                "Chain-of-custody gaps in forensic sampling",
                "Weather contamination during sample collection",
                "Absence of contractor representation",
                "Non-representative / haphazard sampling method",
                "FSL report foundation challenge",
                "BIS/IS procedural non-compliance",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
