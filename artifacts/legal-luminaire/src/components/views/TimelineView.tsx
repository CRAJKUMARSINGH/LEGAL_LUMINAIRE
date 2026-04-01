import { timelineEvents } from "@/data/caseData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const TimelineView = () => (
  <div className="p-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Case Facts Timeline</h2>
      <p className="text-muted-foreground text-sm mt-1">
        Special Session Case No. 1/2025 (Udaipur) — Chronological litigation events
      </p>
    </div>

    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {timelineEvents.map((evt) => (
          <div key={evt.id} className="relative pl-14">
            <div className="absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-primary bg-background" />
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{evt.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{evt.description}</p>
                    {evt.note && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {evt.note}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-amber-600 border-amber-500/30"
                  >
                    {evt.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>

    <Card className="bg-amber-500/5 border-amber-500/20">
      <CardContent className="p-5">
        <h4 className="font-semibold text-amber-700 text-sm mb-2">Evidence Pull-List to Convert PENDING → VERIFIED</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>FIR + charge-sheet + supplementary reports</li>
          <li>Spot memo / panchnama for sample collection</li>
          <li>Seal memo, sample IDs, dispatch register, malkhana entry</li>
          <li>FSL receipt and test records with lab environment logs</li>
          <li>Weather data for sampling date (IMD / private station)</li>
          <li>Contractor's representation / notice records</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);
