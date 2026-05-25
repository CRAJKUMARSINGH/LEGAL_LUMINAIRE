import { ExternalLink, FileSearch, ListChecks, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HARVEY_EVALUATION_BOUNDARY,
  HARVEY_LAB_FACTS,
  HARVEY_LAB_SOURCE_URL,
  LAB_STYLE_READINESS_CHECKS,
  LEGAL_TEAM_WORKFLOWS,
} from "@/data/harveyEvaluation";

export function HarveyEvaluationPanel() {
  return (
    <Card className="glass-surface hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Harvey-Style Legal Agent Evaluation
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Source-backed guardrails for evaluating legal AI without turning the app into case-specific advice.
            </p>
          </div>
          <a
            href={HARVEY_LAB_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Harvey LAB <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <span className="font-semibold">Legal-advice boundary:</span> {HARVEY_EVALUATION_BOUNDARY}
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Legal team workflows
              </p>
            </div>
            <ul className="space-y-2">
              {LEGAL_TEAM_WORKFLOWS.map((workflow) => (
                <li key={workflow} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{workflow}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                LAB-style readiness checks
              </p>
            </div>
            <ul className="space-y-2">
              {LAB_STYLE_READINESS_CHECKS.map((check) => (
                <li key={check} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 text-primary">OK</span>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          {HARVEY_LAB_FACTS.map((fact) => (
            <div key={fact.label} className="rounded-lg bg-muted/40 p-3">
              <Badge variant="outline" className="mb-2 text-[10px]">
                {fact.label}
              </Badge>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{fact.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
