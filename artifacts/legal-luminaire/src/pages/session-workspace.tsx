import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { DraftGenerator } from "@/components/draft-generator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, AlertCircle } from "lucide-react";

// Static session data for Case 01
const SESSIONS: Record<string, {
  id: string; title: string; caseNumber: string; court: string;
  accusedName: string; sections: string; description: string;
}> = {
  case01: {
    id: "case01",
    title: "Hemraj Vardar — Stadium Wall Collapse Defence",
    caseNumber: "1/2025-Udaipur",
    court: "Special Session Court, Udaipur (Rajasthan)",
    accusedName: "Hemraj Vardar (Contractor / Director)",
    sections: "IPC 304A, 337, 338 + PC Act | BNSS §250 Discharge",
    description: "Stadium outer wall partially collapsed post-construction/repair. Forensic samples collected during stormy rain without contractor representative. Defence: chain-of-custody failure, surface contamination, sampling protocol violations, Kattavellai precedent.",
  },
};

export default function SessionWorkspace() {
  const { id } = useParams<{ id: string }>();
  const session = SESSIONS[id || ""] || null;

  if (!session) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Session not found</h2>
          <Button variant="link" asChild className="mt-4">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full flex-col lg:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 border-r border-border bg-background flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
            <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 text-muted-foreground">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
            </Button>
            <h2 className="text-xl font-serif font-bold text-foreground line-clamp-2">{session.title}</h2>
            <Badge variant="outline" className="mt-2 font-mono text-xs">{session.caseNumber}</Badge>
          </div>

          <div className="p-4 space-y-4 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Scale className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
              <div>
                <span className="font-medium text-foreground block">Court</span>
                {session.court}
              </div>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <div className="h-4 w-4 mt-0.5 flex items-center justify-center shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary/70" />
              </div>
              <div>
                <span className="font-medium text-foreground block">Client/Accused</span>
                {session.accusedName}
              </div>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
              <div>
                <span className="font-medium text-foreground block">Sections/Offences</span>
                {session.sections}
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="font-medium text-foreground block mb-1">Notes</span>
              <p className="text-muted-foreground italic text-xs leading-relaxed">{session.description}</p>
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">Backend Integration</p>
                <p>Document upload and RAG indexing require the Python backend. Use the AI Draft Engine page for full multi-agent drafting.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel: Draft Generator */}
        <div className="flex-1 p-6 overflow-y-auto">
          <DraftGenerator sessionId={parseInt(session.id.replace("case", ""), 10) || 1} />
        </div>
      </div>
    </Layout>
  );
}
