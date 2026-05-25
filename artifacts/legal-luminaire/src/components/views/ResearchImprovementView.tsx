import { AlertTriangle, CheckCircle2, ExternalLink, FileSearch, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESEARCH_IMPROVEMENTS } from "@/data/researchImprovements.generated";

const STATUS_CLASS = {
  READY_FOR_REVIEW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NEEDS_SOURCE_CHECK: "bg-amber-50 text-amber-700 border-amber-200",
  BLOCKED_ACTIVE_MATTER: "bg-red-50 text-red-700 border-red-200",
};

const PRIORITY_CLASS = {
  P0: "bg-red-600 text-white",
  P1: "bg-blue-600 text-white",
  P2: "bg-slate-600 text-white",
};

function isUrl(source: string) {
  return /^https?:\/\//.test(source);
}

export function ResearchImprovementView() {
  const blocked = RESEARCH_IMPROVEMENTS.filter((item) => item.status === "BLOCKED_ACTIVE_MATTER").length;
  const needsSource = RESEARCH_IMPROVEMENTS.filter((item) => item.status === "NEEDS_SOURCE_CHECK").length;
  const ready = RESEARCH_IMPROVEMENTS.filter((item) => item.status === "READY_FOR_REVIEW").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-primary" />
            Eternal Research Improvement Lab
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Phase 2 turns new ebooks, websites, precedents, and research logs into reviewable product improvements.
            Items stay gated until source checks and counsel review are complete.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          {RESEARCH_IMPROVEMENTS.length} generated items
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold">{ready}</p>
              <p className="text-xs text-muted-foreground">Ready for review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-2xl font-bold">{needsSource}</p>
              <p className="text-xs text-muted-foreground">Need source check</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold">{blocked}</p>
              <p className="text-xs text-muted-foreground">Blocked active-matter risks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <span className="font-semibold">Safety rule:</span> this lab creates improvement proposals, source-check tasks,
        rubrics, and review checklists. It must not turn confidential facts into case-specific negligence strategy.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {RESEARCH_IMPROVEMENTS.map((item) => (
          <Card key={item.id} className="border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{item.targetArea}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={PRIORITY_CLASS[item.priority]}>{item.priority}</Badge>
                  <Badge variant="outline" className={STATUS_CLASS[item.status]}>
                    {item.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Review gate:</span> {item.reviewGate}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  LAB-style pass criteria
                </p>
                <ul className="space-y-1.5">
                  {item.labCriteria.map((criterion) => (
                    <li key={criterion} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                  {item.kind.replace(/_/g, " ")} / {item.sourceType}
                </Badge>
                {isUrl(item.source) ? (
                  <a href={item.source} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                      Source <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                ) : (
                  <span className="max-w-[280px] truncate text-xs text-muted-foreground">{item.source}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
