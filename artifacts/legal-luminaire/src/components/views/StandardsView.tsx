import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Info } from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";

const APPLICABILITY_STYLE: Record<string, string> = {
  wrong: "text-red-600 border-red-500/30",
  correct: "text-emerald-600 border-emerald-500/30",
  partial: "text-amber-600 border-amber-500/30",
};

export const StandardsView = () => {
  const { selectedCase } = useCaseContext();
  const standards = selectedCase.standards ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">मानक मैट्रिक्स / Standards Matrix</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {selectedCase.title} — IS / ASTM / NABL standards relevant to defence arguments
        </p>
      </div>

      {standards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground" role="status">
            <FlaskConical className="h-8 w-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
            <p className="font-medium text-foreground">इस केस के लिए कोई मानक दर्ज नहीं</p>
            <p>No standards recorded for this case yet. Add them via Research → Forensic Standards, or load a demo case.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {standards.map((s, i) => (
            <Card key={`${s.code}-${i}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-violet-500/10 p-2.5 shrink-0">
                    <FlaskConical className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground">{s.code}</h3>
                      <Badge variant="outline" className={`text-xs capitalize ${APPLICABILITY_STYLE[s.applicability] ?? ""}`}>
                        {s.applicability}
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-blue-600 border-blue-500/30 text-xs">
                        <Info className="h-3 w-3" /> {s.confidence}
                      </Badge>
                    </div>
                    {s.title !== s.code && <p className="text-sm font-medium text-foreground">{s.title}</p>}
                    <p className="text-sm text-muted-foreground">{s.keyClause}</p>
                    <div className="bg-muted/50 rounded-md px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Case Linkage / केस संबंध:</span> {s.violation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
