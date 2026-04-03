import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";

// Placeholder draft viewer — shows the DEFENCE_REPLY_FINAL_v4 document
export default function DraftViewer() {
  const handleDownload = () => {
    const a = document.createElement("a");
    // v4 ships as PDF+LEX; keep frontend download simple by serving the PDF.
    a.href = "/CASE_01_HemrajG/DEFENCE_REPLY_FINAL_v4.pdf";
    a.download = "DEFENCE_REPLY_FINAL_v4.pdf";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20 px-6 flex items-center justify-between print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-background">
            Discharge Application
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:block">02 April 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden md:flex">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 lg:py-12">
        <div className="bg-[#FDFBF7] dark:bg-[#1C1D21] border border-border shadow-lg rounded-sm overflow-hidden">
          <div className="p-8 sm:p-12 devanagari">
            <h1 className="text-2xl font-bold font-serif text-center mb-8 text-foreground underline decoration-1 underline-offset-4">
              उन्मोचन प्रार्थना-पत्र — DEFENCE REPLY FINAL v4
            </h1>
            <div className="text-center text-muted-foreground text-sm mb-8">
              <p>विशेष सत्र वाद संख्या 1/2025 | FIR 496/2011 | उदयपुर, राजस्थान</p>
              <p className="mt-1">हेमराज वर्दार बनाम राज्य (राजस्थान)</p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild variant="outline">
                <Link href="/case/case01/defence-reply">
                  <FileText className="mr-2 h-4 w-4" /> View Interactive Defence Reply
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/case/case01/discharge-application">
                  <FileText className="mr-2 h-4 w-4" /> View Discharge Application
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
