import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Upload, Wand2, ClipboardCopy, FileText, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CaseFile, CaseRecord, slugifyCase } from "@/lib/case-store";
import { useCaseContext } from "@/context/CaseContext";
import { buildResearchPrompt, type ResearchQuery } from "@/lib/ai-research";
import { checkInputQuality, inputQualityWarning } from "@/lib/input-quality";
import { validateCaseDates, formatDateConflicts } from "@/lib/date-validator";
import { detectDuplicates, hashContent, type DocumentEntry } from "@/lib/document-dedup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ParsedFile = CaseFile & { category: "fir" | "chargesheet" | "lab" | "draft" | "other" };

const formSchema = z.object({
  title: z.string().min(1, "Case title is required").max(200, "Title too long"),
  court: z.string().min(1, "Court name is required"),
  caseNo: z.string().min(1, "Case number is required"),
  brief: z.string().min(10, "Brief must be at least 10 characters").max(2000, "Brief too long"),
  caseType: z.enum(["discharge", "bail", "writ", "notice-reply", "appeal", "revision", "other"]),
  accusedName: z.string().optional(),
  incidentDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format").optional().or(z.literal("")),
  firDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format").optional().or(z.literal("")),
  arrestDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format").optional().or(z.literal("")),
  remandDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format").optional().or(z.literal("")),
  chargeSheetDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format").optional().or(z.literal("")),
  incidentType: z.string().optional(),
  evidenceType: z.string().optional(),
  defects: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function detectCategory(name: string): ParsedFile["category"] {
  const n = name.toLowerCase();
  if (n.includes("fir") || n.includes("first information")) return "fir";
  if (n.includes("charge") || n.includes("challan")) return "chargesheet";
  if (n.includes("lab") || n.includes("forensic") || n.includes("report") || n.includes("test")) return "lab";
  if (n.includes("draft") || n.includes("application") || n.includes("petition")) return "draft";
  return "other";
}

const catLabel: Record<ParsedFile["category"], string> = {
  fir: "FIR",
  chargesheet: "Charge-sheet",
  lab: "Lab/Forensic Report",
  draft: "Draft/Application",
  other: "Other",
};
const catColor: Record<ParsedFile["category"], string> = {
  fir: "bg-red-100 text-red-700",
  chargesheet: "bg-orange-100 text-orange-700",
  lab: "bg-purple-100 text-purple-700",
  draft: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-700",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[11px] text-rose-700 mt-1 flex items-start gap-1">
      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" /> {message}
    </p>
  );
}

const inputCls = (err?: string) =>
  `border rounded-lg px-3 py-2 text-sm w-full ${err ? "border-rose-500 focus:ring-rose-500" : ""}`;

export default function CaseIntakeAssistant() {
  const { addCase } = useCaseContext();
  const [, setLocation] = useLocation();

  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [docIndex, setDocIndex] = useState<DocumentEntry[]>([]);
  const [dedupSummary, setDedupSummary] = useState<string>("");
  const [ackQualityOverride, setAckQualityOverride] = useState(false);
  const [ackDateOverride, setAckDateOverride] = useState(false);
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      court: "",
      caseNo: "",
      brief: "",
      caseType: "discharge",
      accusedName: "",
      incidentDate: "",
      firDate: "",
      arrestDate: "",
      remandDate: "",
      chargeSheetDate: "",
      incidentType: "",
      evidenceType: "",
      defects: "",
    },
  });

  const { watch } = form;
  const title = watch("title");
  const court = watch("court");
  const caseNo = watch("caseNo");
  const brief = watch("brief");
  const caseType = watch("caseType");
  const accusedName = watch("accusedName");
  const incidentDate = watch("incidentDate");
  const firDate = watch("firDate");
  const arrestDate = watch("arrestDate");
  const remandDate = watch("remandDate");
  const chargeSheetDate = watch("chargeSheetDate");
  const incidentType = watch("incidentType");
  const evidenceType = watch("evidenceType");
  const defects = watch("defects");

  const query: ResearchQuery = useMemo(
    () => ({
      caseTitle: title || "[add title]",
      brief: brief || "[add brief]",
      incidentType: incidentType || "[add incident type]",
      evidenceType: evidenceType || "[add evidence type]",
      proceduralDefects: (defects || "").split(",").map((d) => d.trim()).filter(Boolean),
      jurisdiction: court || "India",
    }),
    [title, brief, incidentType, evidenceType, defects, court]
  );

  const prompt = buildResearchPrompt(query, files.map((f) => f.name));

  const onFiles = async (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list);

    const nextMeta = picked.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      category: detectCategory(f.name),
    }));

    // Compute hashes for deduplication (client-side) and keep a clean index.
    const newEntries: DocumentEntry[] = [];
    for (const f of picked) {
      const buf = await f.arrayBuffer();
      const contentHash = await hashContent(buf);
      newEntries.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        filename: f.name,
        size: f.size,
        contentHash,
        uploadedAt: Date.now(),
      });
    }

    setFiles((prev) => [...prev, ...nextMeta]);
    setDocIndex((prev) => {
      const merged = [...prev, ...newEntries];
      const dedup = detectDuplicates(merged);
      setDedupSummary(dedup.summary);
      return dedup.unique;
    });
  };

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const quality = useMemo(() => checkInputQuality(brief || ""), [brief]);
  const qualityMsg = useMemo(() => inputQualityWarning(quality), [quality]);

  const dateResult = useMemo(
    () =>
      validateCaseDates({
        incidentDate: incidentDate || undefined,
        firDate: firDate || undefined,
        arrestDate: arrestDate || undefined,
        remandDate: remandDate || undefined,
        chargeSheetDate: chargeSheetDate || undefined,
      }),
    [incidentDate, firDate, arrestDate, remandDate, chargeSheetDate]
  );
  const dateMsg = useMemo(() => formatDateConflicts(dateResult), [dateResult]);

  const formState = form.formState;
  const isValid =
    !formState.errors.title &&
    !formState.errors.court &&
    !formState.errors.caseNo &&
    !formState.errors.brief &&
    (!quality.blockDraft || ackQualityOverride) &&
    (dateResult.valid || ackDateOverride);

  const createCase = () => {
    setSubmitAttempted(true);
    if (!isValid) return;
    const id = slugifyCase(`${title}-${caseNo || Date.now()}`);
    const record: CaseRecord = {
      id,
      title: title.trim(),
      court: court.trim(),
      caseNo: caseNo.trim(),
      brief: brief.trim(),
      createdAt: new Date().toISOString(),
      files: files.map(({ name, size, type }) => ({ name, size, type })),
      case_type: caseType,
      parties: (accusedName || "").trim()
        ? [{ name: (accusedName || "").trim(), role: "accused" as const }]
        : [],
    };
    addCase(record);
    setCreated(true);
    setTimeout(() => setLocation(`/case/${id}/ai-research`), 800);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labFiles = files.filter((f) => f.category === "lab");
  const firFiles = files.filter((f) => f.category === "fir");

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">नया केस इंटेक</h1>
        <p className="text-sm text-muted-foreground">
          Input files + brief → AI-assisted research workflow with fact-fit gate
        </p>
      </div>

      {/* Basic info */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">केस विवरण (Case Details)</h2>
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Case title *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caseNo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Case number *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Court name *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caseType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <select
                      className="border rounded-lg px-3 py-2 text-sm bg-background w-full"
                      {...field}
                    >
                      <option value="discharge">Discharge Application</option>
                      <option value="bail">Bail Application</option>
                      <option value="writ">Writ Petition</option>
                      <option value="notice-reply">Notice Reply</option>
                      <option value="appeal">Appeal</option>
                      <option value="revision">Revision</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accusedName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Accused / Petitioner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="incidentDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Incident date (DD-MM-YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="FIR date (DD-MM-YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrestDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Arrest date (DD-MM-YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remandDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Remand date (DD-MM-YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chargeSheetDate"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm" placeholder="Charge sheet date (DD-MM-YYYY)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="brief"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="w-full border rounded-lg p-3 text-sm min-h-24"
                    placeholder="Brief user statement — facts, allegations, current stage * (mandatory)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      {/* Input Quality Gate */}
      {qualityMsg && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <pre className="whitespace-pre-wrap leading-relaxed">{qualityMsg}</pre>
          {quality.blockDraft && (
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={ackQualityOverride}
                onChange={(e) => setAckQualityOverride(e.target.checked)}
              />
              <span className="text-[11px]">
                I understand the input quality is poor and may cause inaccurate output. Proceed anyway.
              </span>
            </label>
          )}
        </div>
      )}

      {/* Date Consistency Gate */}
      {dateMsg && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <pre className="whitespace-pre-wrap leading-relaxed">{dateMsg}</pre>
          {!dateResult.valid && (
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={ackDateOverride}
                onChange={(e) => setAckDateOverride(e.target.checked)}
              />
              <span className="text-[11px]">
                I confirm I reviewed the conflicts and still want to proceed.
              </span>
            </label>
          )}
        </div>
      )}

      {/* Fact parameters for AI scoring */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">Fact Parameters (for AI precedent scoring)</h2>
        <p className="text-xs text-muted-foreground">
          These fields control how precedents are scored for fact-fit. More specific = better results.
        </p>
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">Incident Type</FormLabel>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g. construction wall collapse, road accident, medical negligence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evidenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">Evidence Type</FormLabel>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g. forensic material sampling, DNA, CCTV, financial records" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defects"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-medium text-muted-foreground">Procedural Defects (comma-separated)</FormLabel>
                  <FormControl>
                    <Input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="e.g. no panchnama, no chain of custody, no representative, wrong standard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      {/* File upload */}
      <div className="bg-card border border-border rounded-xl p-4">
        <label className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Upload className="w-4 h-4" /> Input Files
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          onChange={(e) => void onFiles(e.target.files)}
          className="text-sm"
        />
        {dedupSummary && (
          <p className="mt-2 text-xs text-muted-foreground">{dedupSummary}</p>
        )}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f) => (
              <li key={f.name} className="flex items-center gap-2 text-xs">
                <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColor[f.category]}`}>
                  {catLabel[f.category]}
                </span>
                <button onClick={() => removeFile(f.name)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Warnings */}
      {labFiles.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>No lab/forensic report uploaded. Add it for better AI research targeting.</span>
        </div>
      )}
      {firFiles.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>No FIR uploaded. Add it to anchor the fact-fit scoring.</span>
        </div>
      )}

      {/* Fact-fit guardrail */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-900">
        <p className="font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Precedent Fact-Fit Gate (Mandatory)
        </p>
        <p className="text-xs mt-1 leading-relaxed">
          Every precedent will be scored: incident match (40 pts) + evidence match (35 pts) + procedural defect match (25 pts).
          Score &lt; 30 → REJECTED as fatal error. Score 30-49 → weak (supporting only). Score ≥ 70 → primary authority.
          This prevents the fatal error of using factually mismatched precedents.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={form.handleSubmit(createCase)}
          disabled={!isValid || created}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {created ? <CheckCircle2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
          {created ? "Created! Redirecting..." : "Create case workspace"}
        </button>
        <button
          onClick={copyPrompt}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
        >
          <ClipboardCopy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy AI research prompt"}
        </button>
      </div>

      {!isValid && (
        <p className="text-xs text-muted-foreground">* Case title, court, case number, and brief statement are required to create workspace.</p>
      )}
    </div>
  );
}
