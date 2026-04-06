import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { 
  UploadCloud, FileText, Image as ImageIcon, Loader2, CheckCircle, 
  Eye, ArrowRight, FileSearch, BookOpen, Hash, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaseContext } from "@/context/CaseContext";
import { CaseRecord } from "@/lib/case-store";
import { ReviewView } from "./ReviewView";
import { useToast } from "@/hooks/use-toast";

type PreviewMetadata = {
  filename: string;
  file_type: string;
  total_pages: number;
  total_chars: number;
  total_chunks: number;
  preview_text: string;
};

type PageChunk = {
  page_number: number;
  chunk_index: number;
  text: string;
  char_count: number;
};

type UploadStage = "idle" | "previewing" | "preview_ready" | "ingesting" | "reviewing" | "done";

export const OmniDropzone = () => {
  const [, navigate] = useLocation();
  const { addCase } = useCaseContext();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [statusText, setStatusText] = useState("");
  const [newCaseId, setNewCaseId] = useState("");
  const [previewMeta, setPreviewMeta] = useState<PreviewMetadata | null>(null);
  const [previewChunks, setPreviewChunks] = useState<PageChunk[]>([]);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [extractionData, setExtractionData] = useState<any>(null);
  const [selectedChunk, setSelectedChunk] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles([e.dataTransfer.files[0]]);
      setStage("idle");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles([e.target.files[0]]);
      setStage("idle");
    }
  };

  // ── STEP 1: Preview extraction ────────────────────────────────────
  const previewFile = async () => {
    if (files.length === 0) return;
    setStage("previewing");
    setStatusText("Extracting text from document...");
    setPreviewErrors([]);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("http://localhost:8000/api/v1/omni-preview", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setPreviewMeta(data.metadata);
        setPreviewChunks(data.chunks || []);
        setPreviewErrors(data.errors || []);
        setSelectedChunk(0);
        setStage("preview_ready");
      } else {
        setPreviewErrors(data.errors || ["Preview extraction failed."]);
        setStage("idle");
      }
    } catch {
      setPreviewErrors(["Network error — is the backend running on port 8000?"]);
      setStage("idle");
    }
  };

  // ── STEP 2: Full ingest after preview approval ────────────────────
  const confirmIngest = async () => {
    if (files.length === 0) return;
    setStage("ingesting");
    setStatusText("Classifying document into Legal Data Matrix...");

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setTimeout(() => setStatusText("Building Chronological Timeline..."), 1000);
      setTimeout(() => setStatusText("Running AI Structured Extraction..."), 2000);

      const res = await fetch("http://localhost:8000/api/v1/omni-ingest", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setNewCaseId(data.case_id || "case-new");
        setExtractionData(data.extraction);
        setStage("reviewing");
      } else {
        setStatusText("Ingestion failed. Check backend logs.");
        setStage("preview_ready");
      }
    } catch {
      setStatusText("Network error occurred.");
      setStage("preview_ready");
    }
  };

  const handleFinalSave = async (refinedData: any) => {
    setStage("ingesting");
    setStatusText("Finalizing Case Dashboard & Auto-Research...");

    try {
      const caseId = newCaseId;
      
      const newRecord: CaseRecord = {
        id: caseId,
        title: `Case: ${refinedData.accused_names?.[0] || files[0].name.split('.')[0]}`,
        court: refinedData.jurisdiction || "Pending Verification",
        caseNo: "Auto-Generated",
        brief: refinedData.incident_type || "Analysis complete.",
        charges: refinedData.statutes_involved?.join(", ") || "Unknown",
        createdAt: new Date().toISOString(),
        files: [{ name: files[0].name, size: files[0].size, type: files[0].type }],
        status: "Under Analysis",
        caseLaw: [], 
        forensic_grounding: refinedData.forensic_grounding || [],
        timeline: refinedData.timeline_events?.map((ev: any, idx: number) => ({
          id: idx,
          title: ev.event || ev.title,
          description: ev.event || ev.description,
          date: ev.date,
          status: "PENDING",
          grounding: ev.grounding || ""
        })) || [],
        metadata: {
          category: "Omni-Ingested",
          complexity: "BASIC",
          estimatedDuration: "TBD",
          requiredResources: ["AI Research"]
        }
      };

      // STEP 10: Trigger Auto-Research
      try {
        const researchRes = await fetch("http://localhost:8000/api/v1/auto-research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            case_summary: newRecord.brief,
            incident_type: refinedData.incident_type,
            statutes: refinedData.statutes_involved || []
          })
        });
        const researchData = await researchRes.json();
        if (researchData.success) {
           newRecord.caseLaw = researchData.matches.map((m: any) => ({
              case: m.case,
              citation: m.citation,
              court: m.court,
              useForDefence: m.holding,
              status: "VERIFIED",
              action: `Auto-Matched via Week 10 Research Engine. Fit Score: ${m.fit_score}%`
           }));
           toast({ title: "Auto-Research Complete", description: `Matched ${researchData.matches.length} high-impact precedents.` });
        }
      } catch (err) {
        console.error("Auto-research failed", err);
      }

      await addCase(newRecord);
      setStage("done");
      setStatusText("Case Profile Instantiated with Auto-Research!");
    } catch (err) {
      toast({ title: "Save Failed", description: "Could not create case.", variant: "destructive" });
      setStage("reviewing");
    }
  };

  const resetAll = () => {
    setFiles([]);
    setStage("idle");
    setPreviewMeta(null);
    setPreviewChunks([]);
    setPreviewErrors([]);
    setNewCaseId("");
    setStatusText("");
  };

  // ── File size display ─────────────────────────────────────────────
  const fileSizeStr = files.length > 0 
    ? `${(files[0].size / 1024).toFixed(1)} KB` 
    : "";

  if (stage === "reviewing") {
    return (
      <ReviewView 
        extraction={extractionData} 
        onSave={handleFinalSave} 
        onBack={() => setStage("preview_ready")} 
      />
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">New Case Ingestion</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload FIR images, scanned PDFs, or typed documents. The AI will extract text, 
          let you preview it, then structure a new Case Dashboard.
        </p>
      </div>

      {/* ── STAGE: IDLE — Dropzone ──────────────────────────────────── */}
      {(stage === "idle") && (
        <div
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef} type="file" className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" 
            onChange={handleChange} 
          />
          <div className="flex flex-col items-center text-center">
            <div className="flex gap-4 mb-4 text-slate-400">
              <FileText className="w-10 h-10" />
              <ImageIcon className="w-10 h-10" />
              <UploadCloud className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Drag & Drop case files here
            </h3>
            <p className="text-sm text-slate-500 mb-4 px-8">
              Supports .PDF, .PNG, .JPG, .DOCX up to 50MB. <br/> Handwritten margin notes and low-light scans are supported.
            </p>
            
            {files.length > 0 ? (
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm w-full max-w-md">
                <FileSearch className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{files[0].name}</p>
                  <p className="text-xs text-muted-foreground">{fileSizeStr}</p>
                </div>
                <Button size="sm" onClick={previewFile} className="gap-1.5">
                  <Eye className="w-4 h-4" /> Preview
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                Browse Computer
              </Button>
            )}

            {previewErrors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 w-full max-w-md">
                {previewErrors.map((e, i) => <p key={i}>⚠ {e}</p>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STAGE: PREVIEWING — Spinner ─────────────────────────────── */}
      {stage === "previewing" && (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-blue-700 font-medium animate-pulse">{statusText}</p>
        </div>
      )}

      {/* ── STAGE: PREVIEW READY — Text Preview Panel ──────────────── */}
      {stage === "preview_ready" && previewMeta && (
        <div className="space-y-4">
          {/* Metadata summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border rounded-lg p-3 text-center">
              <FileText className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-xs text-muted-foreground">File</p>
              <p className="text-sm font-semibold truncate">{previewMeta.filename}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <BookOpen className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
              <p className="text-xs text-muted-foreground">Pages</p>
              <p className="text-sm font-semibold">{previewMeta.total_pages}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <Hash className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-xs text-muted-foreground">Characters</p>
              <p className="text-sm font-semibold">{previewMeta.total_chars.toLocaleString()}</p>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <FileSearch className="w-5 h-5 mx-auto text-violet-500 mb-1" />
              <p className="text-xs text-muted-foreground">Chunks</p>
              <p className="text-sm font-semibold">{previewMeta.total_chunks}</p>
            </div>
          </div>

          {/* Errors / warnings */}
          {previewErrors.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <p className="font-semibold flex items-center gap-1 mb-1"><AlertTriangle className="w-4 h-4" /> Extraction Warnings</p>
              {previewErrors.map((e, i) => <p key={i} className="ml-5">• {e}</p>)}
            </div>
          )}

          {/* Chunk navigator */}
          {previewChunks.length > 0 && (
            <div className="border rounded-xl overflow-hidden bg-card">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b overflow-x-auto">
                {previewChunks.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedChunk(i)}
                    className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedChunk === i 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-slate-600 hover:bg-slate-100 border"
                    }`}
                  >
                    P{c.page_number} #{c.chunk_index + 1}
                  </button>
                ))}
              </div>
              <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto bg-slate-50">
                {previewChunks[selectedChunk]?.text || "No text"}
              </pre>
              <div className="px-4 py-1.5 border-t bg-muted/30 text-xs text-muted-foreground">
                Page {previewChunks[selectedChunk]?.page_number} · Chunk {previewChunks[selectedChunk]?.chunk_index + 1} · {previewChunks[selectedChunk]?.char_count.toLocaleString()} chars
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={resetAll}>
              Upload Different File
            </Button>
            <Button onClick={confirmIngest} className="gap-1.5">
              <ArrowRight className="w-4 h-4" /> Confirm & Create Case
            </Button>
          </div>
        </div>
      )}

      {/* ── STAGE: INGESTING — Progress ────────────────────────────── */}
      {stage === "ingesting" && (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-xl">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-emerald-700 font-medium animate-pulse">{statusText}</p>
        </div>
      )}

      {/* ── STAGE: DONE ────────────────────────────────────────────── */}
      {stage === "done" && (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-xl">
          <CheckCircle className="w-14 h-14 text-emerald-600 mb-4" />
          <p className="text-emerald-800 font-semibold text-lg mb-1">{statusText}</p>
          <p className="text-emerald-600 text-sm mb-6">
            {previewMeta && `${previewMeta.total_pages} pages · ${previewMeta.total_chars.toLocaleString()} characters extracted`}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetAll}>Upload Another</Button>
            <Button onClick={() => navigate(`/case/${newCaseId}/dashboard`)} className="gap-1.5">
              <ArrowRight className="w-4 h-4" /> Launch Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
