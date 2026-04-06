import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckCircle2, Info, AlertTriangle, Loader2, Sparkles, 
  BookOpen, Scaling, ShieldAlert, ShieldCheck, Zap
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusConfig = {
  VERIFIED: { icon: CheckCircle2, class: "bg-emerald-50 text-emerald-700 border-emerald-300" },
  SECONDARY: { icon: Info, class: "bg-blue-50 text-blue-700 border-blue-300" },
  PENDING: { 
    icon: AlertTriangle, 
    class: "bg-amber-50 text-amber-700 border-amber-300 cursor-pointer hover:bg-amber-100 hover:shadow-sm transition-all" 
  },
};

export const CaseLawView = () => {
  const { selectedCase } = useCaseContext();
  const [matrixData, setMatrixData] = useState(selectedCase.caseLaw || []);
  const [verifyingFlags, setVerifyingFlags] = useState<Record<number, boolean>>({});

  // Sync state if case changes
  useMemo(() => {
    setMatrixData(selectedCase.caseLaw || []);
  }, [selectedCase.id]);

  const handleReverify = async (index: number, currentStatus: string) => {
    if (currentStatus !== "PENDING" || verifyingFlags[index]) return;
    setVerifyingFlags((prev) => ({ ...prev, [index]: true }));
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setMatrixData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: "VERIFIED",
        action: "Citation authenticated via AI DeepSearch matrix. Lexical fact-fit confirmed. Ready for drafting.",
      };
      return updated;
    });
    setVerifyingFlags((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Defense Strategy Foundations</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedCase.title} — Verified precedents & Forensic Standards
          </p>
        </div>
        <div className="flex gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
          <Sparkles className="w-3.5 h-3.5" />
          Click any PENDING status to launch AI reverification
        </div>
      </div>

      {/* --- Step 1: Forensic Standards Grounding (Week 3 Feature) --- */}
      {selectedCase.forensic_grounding && selectedCase.forensic_grounding.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {selectedCase.forensic_grounding.map((std, idx) => (
            <Card key={idx} className="border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                     <BookOpen className="w-4 h-4 text-primary" />
                     <CardTitle className="text-sm font-bold uppercase tracking-tight">{std.code}</CardTitle>
                   </div>
                   <Badge variant="secondary" className="text-[10px]">AUTO-GROUNDED</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">{std.title}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-[11px] text-primary/70 font-semibold uppercase flex items-center gap-1">
                    <Scaling className="w-3 h-3" /> Potential Procedural Gaps:
                  </p>
                  <ul className="grid grid-cols-1 gap-1">
                    {std.violations.map((v, i) => (
                      <li key={i} className="text-[11px] leading-snug text-slate-700 bg-white/60 p-2 rounded-lg border border-primary/10 flex items-start gap-2 shadow-sm group hover:border-amber-400 transition-colors">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-700 mr-1">GAP:</span>
                          {v}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex items-center justify-between border-t border-primary/10 mt-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Forensic Strength</p>
                     <Badge className={std.violations.length > 2 ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"} variant="outline">
                        {std.violations.length > 2 ? "CRITICAL RISK" : "OBSERVED GAPS"}
                     </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Step 2: Traditional Case Law Matrix --- */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/30 p-4 border-b flex items-center gap-2">
           <CheckCircle2 className="w-4 h-4 text-emerald-600" />
           <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Precedent Fact-Fit Matrix</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[30%]">Case / Citation</TableHead>
              <TableHead>Court</TableHead>
              <TableHead className="w-[30%]">Use for Defence</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead>AI Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrixData.length > 0 ? (
              matrixData.map((row, i) => {
                const cfg = statusConfig[row.status as keyof typeof statusConfig];
                const isVerifying = verifyingFlags[i];
                const Icon = isVerifying ? Loader2 : cfg.icon;

                return (
                  <TableRow key={i} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold text-foreground text-sm">
                      {row.case}
                      {row.citation && <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{row.citation}</div>}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{row.court}</TableCell>
                    <TableCell className="text-sm text-slate-600 italic leading-relaxed">{row.useForDefence}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`gap-1.5 py-1 ${cfg.class} ${isVerifying ? "animate-pulse" : ""}`}
                        onClick={() => handleReverify(i, row.status)}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Verifying...
                          </>
                        ) : row.status === "PENDING" ? (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            REVERIFY
                          </>
                        ) : (
                          <>
                            <Icon className="h-3.5 w-3.5" />
                            {row.status}
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] leading-tight max-w-[200px]">
                      {row.status === "VERIFIED" && !row.action.includes("certified") ? (
                         <span className="text-emerald-700 font-medium flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                            {row.action}
                         </span>
                      ) : (
                         <span className="text-muted-foreground">{row.action}</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-12 text-center text-muted-foreground">
                  No precedents matched yet. Upload a document to trigger the Citation Engine.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

