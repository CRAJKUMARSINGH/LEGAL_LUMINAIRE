import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, BookOpen, ShieldCheck, AlertCircle, Scaling, FileWarning, Info, GraduationCap } from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EXPLANATIONS: Record<string, { title: string; precedent: string; advice: string }> = {
  "IS 1199": {
    title: "Wrong Sampling Protocol Applied",
    precedent: "Sushil Sharma v. State (NCT of Delhi) (2014)",
    advice: "If the underlying sampling standard is inherently flawed for the material tested (e.g., using fresh concrete standards for hardened mortar), the entire expert opinion under Section 45 evidence act stands vitiated.",
  },
  "Chain of Custody": {
    title: "Break in Evidence Trail",
    precedent: "Kattavellai @ Devar v. State (2025)",
    advice: "A missing register or counter-signature during evidence transit creates 'reasonable doubt'. Every movement must be recorded, otherwise, the forensic report is inadmissible in a fair trial.",
  },
  "Joint Sampling": {
    title: "Violation of Natural Justice",
    precedent: "C.B.I. v. K.S. Kalra (2011)",
    advice: "Failure to involve the contractor/accused during sample extraction violates 'Audi Alteram Partem'. Samples taken 'behind the back' of the accused often lead to a failure of PC Act charges.",
  }
};

export const TimelineView = () => {
  const { selectedCase } = useCaseContext();
  const timeline = selectedCase.timeline || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Case Facts Timeline</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {selectedCase.title} — {selectedCase.court}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {timeline.length > 0 ? (
            timeline.map((evt) => {
              const collision = selectedCase.collisions?.find(c => c.target_event_id === evt.id);
              
              return (
                <div key={evt.id} className="relative pl-14 transition-all hover:translate-x-1">
                  <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 bg-background z-10 ${collision ? "border-red-500" : "border-primary"}`} />
                  <Card className={`${evt.grounding ? "border-amber-200 bg-amber-50/30" : ""} ${collision ? "border-red-200 bg-red-50/10" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{evt.date || "Date Pending"}</span>
                            {evt.status === "VERIFIED" && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                            {collision && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="destructive" className="h-5 px-1.5 gap-1 animate-pulse">
                                      <AlertCircle className="w-3 h-3" />
                                      CONFLICT
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs p-4 space-y-2">
                                    <p className="font-bold text-xs flex items-center gap-1 text-red-600">
                                      <FileWarning className="w-3 h-3" /> {collision.type}
                                    </p>
                                    <p className="text-[10px] leading-relaxed">{collision.description}</p>
                                    <div className="pt-2 border-t border-red-100 flex flex-col gap-1 text-[9px] italic text-slate-500">
                                      <span>A: {collision.evidence_a}</span>
                                      <span>B: {collision.evidence_b}</span>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground">{evt.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{evt.description}</p>
                          
                          {evt.grounding && (() => {
                            const key = Object.keys(EXPLANATIONS).find(k => evt.grounding?.includes(k));
                            const exp = key ? EXPLANATIONS[key] : null;
                            
                            return (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100/50 border border-amber-200 text-xs font-medium text-amber-800 animate-in fade-in cursor-help hover:bg-amber-100 transition-colors">
                                      <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                                      {evt.grounding}
                                      <Info className="w-3 h-3 opacity-50" />
                                    </div>
                                  </TooltipTrigger>
                                  {exp && (
                                    <TooltipContent side="right" className="max-w-sm p-4 space-y-3 bg-slate-900 text-slate-100 border-none shadow-2xl">
                                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                                        <GraduationCap className="w-4 h-4" /> Why does this matter?
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-bold leading-tight">{exp.title}</p>
                                        <p className="text-[11px] text-slate-400 italic">Precedent: {exp.precedent}</p>
                                      </div>
                                      <p className="text-xs leading-relaxed text-slate-300 border-t border-white/10 pt-2">
                                        {exp.advice}
                                      </p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })()}

                          {evt.note && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> {evt.note}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={evt.status === "VERIFIED" ? "default" : "outline"}
                          className={`shrink-0 ${evt.status === "PENDING" ? "text-amber-600 border-amber-500/30" : ""}`}
                        >
                          {evt.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              No timeline events recorded yet. Use AI Case Ingest to populate.
            </div>
          )}
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5">
          <h4 className="font-semibold text-primary text-sm mb-2 uppercase tracking-wider">Grounding Evidence Requirements</h4>
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
};
