import { standardsMatrix } from "@/data/caseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Info } from "lucide-react";

export const StandardsView = () => (
  <div className="p-6 max-w-5xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Standards Matrix</h2>
      <p className="text-muted-foreground text-sm mt-1">
        IS / ASTM / NABL standards relevant to defence arguments
      </p>
    </div>

    <div className="grid gap-4">
      {standardsMatrix.map((s, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-violet-500/10 p-2.5 shrink-0">
                <FlaskConical className="h-5 w-5 text-violet-500" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{s.standard}</h3>
                  <Badge variant="outline" className="gap-1 text-blue-600 border-blue-500/30 text-xs">
                    <Info className="h-3 w-3" /> {s.confidence}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{s.proposition}</p>
                <div className="bg-muted/50 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Case Linkage:</span> {s.caseFact}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
