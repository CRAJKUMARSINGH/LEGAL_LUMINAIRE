import { useLocation } from "wouter";
import { Clock, ArrowRight, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCaseContext } from "@/context/CaseContext";
import { getChargesArray } from "@/lib/case-store";

/** "Recent Cases" — last few opened cases (localStorage-backed via CaseContext). */
export function RecentCasesWidget() {
  const { recentCases, selectedCaseId, setSelectedCaseId, cases } = useCaseContext();
  const [, setLocation] = useLocation();

  const open = (id: string) => {
    setSelectedCaseId(id);
    setLocation(`/case/${id}/dashboard`);
  };

  return (
    <Card data-testid="recent-cases-widget">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>हाल के केस <span className="text-muted-foreground font-normal text-sm">/ Recent Cases</span></span>
          <Badge variant="outline" className="ml-auto text-[10px]">{recentCases.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentCases.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center" role="status">
            अभी तक कोई केस नहीं खोला गया। · No cases opened yet — pick one from the selector or load the demo.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {recentCases.map((c) => {
              const active = c.id === selectedCaseId;
              const isDemo = c.isDemo || c.title.startsWith("[DEMO]");
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => open(c.id)}
                    aria-current={active ? "true" : undefined}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted/50"}`}
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.title.replace(/^\[DEMO\]\s*/, "")}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {c.court || "—"} · {getChargesArray(c).slice(0, 2).join(", ") || c.caseNo || c.id}
                      </p>
                    </div>
                    {isDemo && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-wider shrink-0">DEMO</Badge>}
                    {active && <Badge variant="outline" className="text-[9px] shrink-0">सक्रिय / Active</Badge>}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="pt-2 border-t border-border flex items-center gap-2">
          <label htmlFor="home-case-selector" className="text-[11px] text-muted-foreground whitespace-nowrap">
            केस बदलें / Switch case
          </label>
          <select
            id="home-case-selector"
            value={selectedCaseId}
            onChange={(e) => open(e.target.value)}
            className="flex-1 min-w-0 bg-background text-xs rounded-md px-2 py-1.5 border border-border"
          >
            {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setLocation("/cases")}>
            सभी / All
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">इतिहास केवल इस ब्राउज़र में संग्रहीत · History is kept locally in this browser.</p>
      </CardContent>
    </Card>
  );
}
