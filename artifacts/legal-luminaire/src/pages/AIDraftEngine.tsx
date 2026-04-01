import { useState, useEffect, useRef } from "react";
import {
  Upload, Zap, FileText, CheckCircle2, AlertTriangle,
  Loader2, Download, Copy, Server, Wifi, WifiOff, Printer,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { apiClient, type ResearchResponse, type HealthResponse } from "@/lib/api-client";

type RunStatus = "idle" | "uploading" | "running" | "done" | "error";

type AgentStep = {
  agent: string;
  status: "pending" | "running" | "done" | "error";
  output: string;
};

const AGENT_ORDER = [
  { key: "researcher", label: "Researcher Agent", desc: "Verifying citations on Indian Kanoon, SCC Online, Manupatra" },
  { key: "verifier", label: "Standards Verifier", desc: "Checking IS/ASTM/BS clauses on BIS portal & archive.org" },
  { key: "checker", label: "Fact Checker", desc: "Rejecting hallucinated cases, flagging fatal errors" },
  { key: "drafter", label: "Senior Drafter", desc: "Generating court-ready Hindi discharge application" },
];

export default function AIDraftEngine() {
  const { selectedCase, selectedCaseId } = useCaseContext();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<{ chunks: number; files: string[] } | null>(null);

  const [query, setQuery] = useState(
    "Draft superior Hindi discharge application u/s 250 BNSS 2023 for this case. Include all legal grounds, IS standard violations, chain of custody failure, and prayer clause."
  );
  const [incidentType, setIncidentType] = useState("construction wall collapse forensic mortar sampling");
  const [evidenceType, setEvidenceType] = useState("material sampling forensic lab report chain of custody");
  const [defects, setDefects] = useState("no panchnama, no chain of custody, no representative, wrong IS standard, rain sampling");
  const [mode, setMode] = useState<"research" | "draft">("draft");

  const [status, setStatus] = useState<RunStatus>("idle");
  const [steps, setSteps] = useState<AgentStep[]>(
    AGENT_ORDER.map((a) => ({ agent: a.key, status: "pending", output: "" }))
  );
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  // Check backend health on mount
  useEffect(() => {
    apiClient.health()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setHealthLoading(false));
  }, []);

  const backendOnline = health?.status === "ok";

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles(Array.from(list));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setStatus("uploading");
    setError("");
    try {
      const res = await apiClient.uploadFiles(selectedCaseId, files);
      if (res.success) {
        setUploadResult({
          chunks: res.total_chunks,
          files: res.indexed.map((i) => i.file),
        });
      } else {
        setError(res.errors.join("; ") || "Upload failed");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setStatus("idle");
    }
  };

  const handleRun = async () => {
    if (!backendOnline) {
      setError("Backend is offline. Start it with: cd backend && python main.py");
      return;
    }
    setStatus("running");
    setError("");
    setResult(null);
    // Reset steps
    setSteps(AGENT_ORDER.map((a) => ({ agent: a.key, status: "pending", output: "" })));

    // Simulate step progression (real output comes at end)
    const stepDelay = 8000;
    AGENT_ORDER.forEach((a, i) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "running" } :
            idx < i ? { ...s, status: "done" } : s
          )
        );
      }, i * stepDelay);
    });

    try {
      const res = await apiClient.runResearch(selectedCaseId, {
        query,
        incident_type: incidentType,
        evidence_type: evidenceType,
        procedural_defects: defects.split(",").map((d) => d.trim()).filter(Boolean),
        mode,
      });

      // Map task outputs to steps
      setSteps(
        AGENT_ORDER.map((a) => {
          const taskOut = res.tasks_output.find((t) =>
            t.agent.toLowerCase().includes(a.key)
          );
          return {
            agent: a.key,
            status: res.success ? "done" : "error",
            output: taskOut?.output || "",
          };
        })
      );

      setResult(res);
      setStatus(res.success ? "done" : "error");
      if (!res.success) setError(res.error || "Research failed");

      // Scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Request failed");
      setStatus("error");
      setSteps((prev) => prev.map((s) => ({ ...s, status: s.status === "running" ? "error" : s.status })));
    }
  };

  const copyDraft = () => {
    if (result?.draft) navigator.clipboard.writeText(result.draft);
  };

  const downloadDraft = () => {
    if (!result?.draft) return;
    const blob = new Blob([result.draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `discharge_application_${selectedCaseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            AI Draft Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Multi-agent · RAG · Zero-hallucination · Manupatra + SCC + Indian Kanoon verified
          </p>
        </div>
        {/* Backend status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          healthLoading ? "bg-muted text-muted-foreground border-border" :
          backendOnline ? "bg-green-50 text-green-700 border-green-200" :
          "bg-red-50 text-red-700 border-red-200"
        }`}>
          {healthLoading ? <Loader2 className="w-3 h-3 animate-spin" /> :
           backendOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {healthLoading ? "Checking backend..." :
           backendOnline ? "Backend online" : "Backend offline"}
        </div>
      </div>

      {/* Backend setup instructions if offline */}
      {!healthLoading && !backendOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          <p className="font-semibold mb-2">Backend Setup Required</p>
          <pre className="text-xs bg-amber-100 rounded p-3 overflow-x-auto">{`# 1. Copy env file
cp backend/.env.example backend/.env
# 2. Add your API keys to backend/.env
#    OPENAI_API_KEY=sk-...
#    TAVILY_API_KEY=tvly-...
# 3. Install dependencies
cd backend && pip install -r requirements.txt
# 4. Start backend
python main.py`}</pre>
          <p className="text-xs mt-2 opacity-80">
            Get free Tavily key at <a href="https://tavily.com" target="_blank" rel="noopener noreferrer" className="underline">tavily.com</a> ·
            OpenAI key at <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
          </p>
        </div>
      )}

      {/* Backend health details */}
      {backendOnline && health && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "OpenAI", ok: health.openai_configured },
            { label: "Tavily Search", ok: health.tavily_configured },
            { label: "ChromaDB", ok: health.chroma_ready },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-3 text-center text-xs border ${
              item.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {item.ok ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1" /> : <AlertTriangle className="w-4 h-4 mx-auto mb-1" />}
              {item.label}
            </div>
          ))}
        </div>
      )}

      {/* Active case */}
      <div className="bg-card border border-border rounded-xl p-3 text-sm">
        <span className="font-semibold text-muted-foreground">Active Case: </span>
        <span>{selectedCase.title}</span>
        {uploadResult && (
          <span className="ml-3 text-xs text-green-700 font-medium">
            ✓ {uploadResult.files.length} files indexed · {uploadResult.chunks} chunks in RAG
          </span>
        )}
      </div>

      {/* File upload */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Case Documents (PDF, DOCX, MD, images)
        </h2>
        <p className="text-xs text-muted-foreground">
          FIR, charge-sheet, lab report, prior judgments, IS standard excerpts — all will be indexed into RAG.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.md,.txt,.lex,.jpg,.jpeg,.png"
            onChange={(e) => handleFiles(e.target.files)}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={!files.length || status === "uploading" || !backendOnline}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50"
          >
            {status === "uploading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {status === "uploading" ? "Indexing..." : "Index into RAG"}
          </button>
        </div>
        {files.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {files.map((f) => <li key={f.name}>• {f.name} ({(f.size / 1024).toFixed(0)} KB)</li>)}
          </ul>
        )}
      </div>

      {/* Query + parameters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">Research / Draft Query</h2>
        <textarea
          className="w-full border rounded-lg p-3 text-sm min-h-20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want? e.g. Draft superior Hindi discharge application..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Incident Type</label>
            <input className="border rounded-lg px-3 py-2 text-xs w-full" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Evidence Type</label>
            <input className="border rounded-lg px-3 py-2 text-xs w-full" value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1">Procedural Defects (comma-separated)</label>
            <input className="border rounded-lg px-3 py-2 text-xs w-full" value={defects} onChange={(e) => setDefects(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" value="research" checked={mode === "research"} onChange={() => setMode("research")} />
            Research only (precedents + standards)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" value="draft" checked={mode === "draft"} onChange={() => setMode("draft")} />
            Full draft (discharge application)
          </label>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={status === "running" || status === "uploading" || !backendOnline}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {status === "running" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
        {status === "running" ? "Agents running — verifying citations..." : "Run AI Research + Draft"}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Agent progress */}
      {status !== "idle" && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Server className="w-4 h-4" /> Agent Pipeline
          </h2>
          {AGENT_ORDER.map((a, i) => {
            const step = steps[i];
            return (
              <div key={a.key} className={`flex items-start gap-3 p-3 rounded-lg border ${
                step.status === "done" ? "bg-green-50 border-green-200" :
                step.status === "running" ? "bg-blue-50 border-blue-200" :
                step.status === "error" ? "bg-red-50 border-red-200" :
                "bg-muted/30 border-border"
              }`}>
                <div className="mt-0.5 flex-shrink-0">
                  {step.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                   step.status === "running" ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> :
                   step.status === "error" ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                   <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                  {step.output && (
                    <details className="mt-2">
                      <summary className="text-xs text-primary cursor-pointer">View output</summary>
                      <pre className="text-xs mt-1 bg-white/70 rounded p-2 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {step.output.slice(0, 1500)}{step.output.length > 1500 ? "..." : ""}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Output */}
      {result?.draft && (
        <div ref={outputRef} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div>
              <h2 className="text-sm font-bold">Generated Output</h2>
              <p className="text-xs text-muted-foreground">
                {result.doc_count > 0 ? `RAG: ${result.doc_count} chunks · ` : ""}
                {mode === "draft" ? "Court-ready Hindi discharge application" : "Research report"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyDraft} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-lg">
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button onClick={downloadDraft} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-lg">
                <Download className="w-3 h-3" /> Download
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg no-print">
                <Printer className="w-3 h-3" /> Print
              </button>
            </div>
          </div>
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            <pre className="hindi-text text-sm leading-loose whitespace-pre-wrap font-serif text-foreground">
              {result.draft}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
