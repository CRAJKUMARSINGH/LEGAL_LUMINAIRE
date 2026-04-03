import { useCaseContext } from "@/context/CaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileSearch, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export const ReviewQueueView = () => {
  const { cases } = useCaseContext();
  
  // Filter for cases that are in "SUBMITTED" state for review
  const pendingReviews = cases.filter(c => c.review_status === "SUBMITTED");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-blue-600" />
            Chamber Review Queue
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Cases submitted by junior advocates for senior partner approval.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
           {pendingReviews.length} Pending Approvals
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingReviews.length > 0 ? (
          pendingReviews.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-all border-slate-200 group">
              <CardHeader className="pb-3 border-b border-slate-50">
                <div className="flex items-start justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.caseNo}</p>
                      <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">{c.title}</CardTitle>
                   </div>
                   <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">SUBMITTED</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                   <Clock className="w-3.5 h-3.5" />
                   Submitted by: <span className="font-semibold text-slate-700">{c.assigned_to || "Junior Advocate"}</span>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Forensic Summary</p>
                   <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      {c.collisions?.length || 0} Critical Discrepancies
                   </div>
                </div>

                <Link href={`/case/${c.id}/drafting`}>
                  <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm mt-2">
                    <ArrowRight className="w-4 h-4" /> Start Final Review
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
             </div>
             <div>
                <p className="font-bold text-slate-800">Clear Skies!</p>
                <p className="text-sm text-slate-500">No cases currently waiting for your senior approval.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
