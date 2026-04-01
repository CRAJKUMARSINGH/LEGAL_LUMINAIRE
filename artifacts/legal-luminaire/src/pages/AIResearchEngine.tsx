import { useState, useMemo } from "react";
import { ClipboardCopy, ExternalLink, Search, AlertTriangle, CheckCircle2, Database, Zap } from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import {
  buildResearchPrompt,
  scorePrecedentFit,
  DB_URLS,
  DB_LABELS,
  type DatabaseSource,
  type ResearchQuery,
  type FitLevel,
} from "@/lib/ai-research";
import PrecedentFitGate from "@/components/PrecedentFitGate";

// ─── Hardcoded precedents for Case 01 with fit metadata ───────────────────────
const CASE01_PRECEDENTS = [
  {
    id: "p1",
    name: "कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य",
    citation: "2025 INSC 845 | Cri. Appeal No. 1672/2019",
    court: "सर्वोच्च न्यायालय — त्रि-न्यायाधीशीय खण्डपीठ",
    date: "15 जुलाई 2025",
    holding: `"Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end."`,
    application: "मोर्टार नमूनों की शून्य श्रृंखला-अभिरक्षा → सम्पूर्ण फोरेंसिक रिपोर्ट अग्राह्य",
    fitScore: 88,
    fitLevel: "exact" as FitLevel,
    fitReason: "forensic evidence + chain of custody + procedural defect — direct match",
    source: "scc_online" as DatabaseSource,
    sourceUrl: "https://www.scconline.com",
    tags: ["forensic", "chain of custody", "evidence", "sampling", "collection", "contamination"],
  },
  {
    id: "p2",
    name: "Union of India v. Prafulla Kumar Samal",
    citation: "(1979) 3 SCC 4",
    court: "सर्वोच्च न्यायालय",
    date: "1979",
    holding: `"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."`,
    application: "दोषपूर्ण साक्ष्य = केवल सन्देह → उन्मोचन अनिवार्य",
    fitScore: 82,
    fitLevel: "exact" as FitLevel,
    fitReason: "discharge standard + prima facie test — exact procedural match",
    source: "manupatra" as DatabaseSource,
    sourceUrl: "https://www.manupatra.com",
    tags: ["discharge", "prima facie", "suspicion", "evidence", "section 227", "section 250"],
  },
  {
    id: "p3",
    name: "State of Bihar v. Ramesh Singh",
    citation: "(1977) 4 SCC 39",
    court: "सर्वोच्च न्यायालय",
    date: "1977",
    holding: "उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं।",
    application: "फोरेंसिक साक्ष्य दूषित → प्रथम दृष्टया आरोप असिद्ध → उन्मोचन",
    fitScore: 80,
    fitLevel: "exact" as FitLevel,
    fitReason: "discharge test + prima facie standard — binding precedent",
    source: "manupatra" as DatabaseSource,
    sourceUrl: "https://www.manupatra.com",
    tags: ["discharge", "prima facie", "framing of charge", "evidence", "section 227"],
  },
  {
    id: "p4",
    name: "उत्तराखण्ड उच्च न्यायालय — श्रृंखला-अभिरक्षा",
    citation: "2026 — LiveLaw Report",
    court: "उत्तराखण्ड उच्च न्यायालय",
    date: "मार्च 2026",
    holding: `"In the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."`,
    application: "शून्य श्रृंखला-अभिरक्षा → फोरेंसिक साक्ष्य निष्फल",
    fitScore: 85,
    fitLevel: "exact" as FitLevel,
    fitReason: "chain of custody + forensic evidence + material sampling — direct match",
    source: "indian_kanoon" as DatabaseSource,
    sourceUrl: "https://indiankanoon.org",
    tags: ["chain of custody", "forensic", "evidence", "sampling", "material"],
  },
  {
    id: "p5",
    name: "मद्रास उच्च न्यायालय — फोरेंसिक परीक्षण अधिकार",
    citation: "31 जुलाई 2025 — SCCOnline",
    court: "मद्रास उच्च न्यायालय",
    date: "जुलाई 2025",
    holding: `"The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic examination amounts to curtailment of such a right."`,
    application: "ठेकेदार प्रतिनिधि अनुपस्थित → नैसर्गिक न्याय का हनन",
    fitScore: 76,
    fitLevel: "exact" as FitLevel,
    fitReason: "natural justice + representative absence + forensic sampling — matches",
    source: "scc_online" as DatabaseSource,
    sourceUrl: "https://www.scconline.com",
    tags: ["natural justice", "representative", "forensic", "sampling", "audi alteram partem"],
  },
  {
    id: "p6",
    name: "Jacob Mathew v. State of Punjab",
    citation: "(2005) 6 SCC 1",
    court: "सर्वोच्च न्यायालय",
    date: "2005",
    holding: `"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act."`,
    application: "प्राकृतिक आपदा = Force Majeure → घोर उपेक्षा का आरोप असिद्ध",
    fitScore: 62,
    fitLevel: "analogous" as FitLevel,
    fitReason: "negligence standard matches but incident type is medical — analogous only",
    source: "manupatra" as DatabaseSource,
    sourceUrl: "https://www.manupatra.com",
    tags: ["negligence", "rash", "304A", "force majeure", "criminal negligence"],
  },
  {
    id: "p7",
    name: "पंचनामा अग्राह्यता — सर्वोच्च न्यायालय",
    citation: "2026 — BWLegalWorld Report",
    court: "सर्वोच्च न्यायालय",
    date: "2026",
    holding: `"Panchanamas would be inadmissible in court if they were prepared in a manner violating Section 162 CrPC."`,
    application: "नमूना-संग्रह पंचनामे का अभाव → सम्पूर्ण प्रक्रिया अमान्य",
    fitScore: 78,
    fitLevel: "exact" as FitLevel,
    fitReason: "panchnama absence + evidence collection procedure — direct match",
    source: "indian_kanoon" as DatabaseSource,
    sourceUrl: "https://indiankanoon.org",
    tags: ["panchnama", "evidence collection", "procedure", "section 162", "admissibility"],
  },
  {
    id: "p8",
    name: "मालेगाँव विस्फोट बरी — NIA विशेष न्यायालय",
    citation: "2025 — Indian Express",
    court: "NIA विशेष न्यायालय, मुम्बई",
    date: "2025",
    holding: `"The prosecution failed to provide cogent and reliable evidence, and also failed to establish guilt beyond reasonable doubt."`,
    application: "अविश्वसनीय फोरेंसिक साक्ष्य → संदेह का लाभ अभियुक्त को",
    fitScore: 44,
    fitLevel: "weak" as FitLevel,
    fitReason: "evidence reliability matches but incident type (explosion/terrorism) is factually distant from construction wall collapse",
    source: "indian_kanoon" as DatabaseSource,
    sourceUrl: "https://indiankanoon.org",
    tags: ["evidence", "reasonable doubt", "acquittal", "forensic"],
  },
];

const DATABASES: { id: DatabaseSource; label: string; flag: string }[] = [
  { id: "manupatra", label: "Manupatra", flag: "🇮🇳" },
  { id: "scc_online", label: "SCC Online", flag: "🇮🇳" },
  { id: "indian_kanoon", label: "Indian Kanoon", flag: "🇮🇳" },
  { id: "lexis_nexis", label: "Lexis Nexis India", flag: "🇮🇳" },
  { id: "westlaw", label: "Westlaw", flag: "🌐" },
  { id: "bailii", label: "BAILII", flag: "🇬🇧" },
  { id: "astm", label: "ASTM International", flag: "🇺🇸" },
  { id: "bis", label: "BIS Portal", flag: "🇮🇳" },
  { id: "cpwd", label: "CPWD Manual", flag: "🇮🇳" },
];

const fitBadge: Record<FitLevel, string> = {
  exact: "bg-green-100 text-green-800",
  analogous: "bg-blue-100 text-blue-800",
  weak: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AIResearchEngine() {
  const { selectedCase } = useCaseContext();
  const [copied, setCopied] = useState(false);
  const [filterFit, setFilterFit] = useState<FitLevel | "all">("all");
  const [incidentType, setIncidentType] = useState(
    selectedCase.brief ? "construction wall collapse forensic mortar sampling" : ""
  );
  const [evidenceType, setEvidenceType] = useState(
    selectedCase.brief ? "material sampling forensic lab report chain of custody" : ""
  );
  const [defects, setDefects] = useState(
    selectedCase.brief
      ? "no panchnama, no representative, no chain of custody, wrong IS standard, rain sampling"
      : ""
  );

  const query: ResearchQuery = useMemo(
    () => ({
      caseTitle: selectedCase.title,
      brief: selectedCase.brief,
      incidentType,
      evidenceType,
      proceduralDefects: defects.split(",").map((d) => d.trim()).filter(Boolean),
      jurisdiction: selectedCase.court || "Rajasthan, India",
    }),
    [selectedCase, incidentType, evidenceType, defects]
  );

  // Re-score precedents dynamically based on current query inputs
  const scoredPrecedents = useMemo(() => {
    if (selectedCase.id === "case-01") {
      // Use pre-scored data for Case 01 (already researched)
      return CASE01_PRECEDENTS;
    }
    // For new cases: score dynamically
    return CASE01_PRECEDENTS.map((p) => {
      const { score, level, reason } = scorePrecedentFit(p.tags, query);
      return { ...p, fitScore: score, fitLevel: level, fitReason: reason };
    });
  }, [selectedCase.id, query]);

  const filtered = useMemo(
    () => (filterFit === "all" ? scoredPrecedents : scoredPrecedents.filter((p) => p.fitLevel === filterFit)),
    [scoredPrecedents, filterFit]
  );

  const fatalErrors = scoredPrecedents.filter((p) => p.fitLevel === "rejected");
  const exactCount = scoredPrecedents.filter((p) => p.fitLevel === "exact").length;
  const analogousCount = scoredPrecedents.filter((p) => p.fitLevel === "analogous").length;
  const weakCount = scoredPrecedents.filter((p) => p.fitLevel === "weak").length;

  const prompt = buildResearchPrompt(
    query,
    selectedCase.files.map((f) => f.name)
  );

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            AI Research Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Lexis · Manupatra · SCC Online · Indian Kanoon · ASTM · BIS — Fact-Fit Enforced
          </p>
        </div>
        <button
          onClick={copyPrompt}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity w-fit"
        >
          <ClipboardCopy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy AI Prompt"}
        </button>
      </div>

      {/* Active case banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
        <span className="font-semibold">Active Case:</span> {selectedCase.title}
        {selectedCase.caseNo && <span className="ml-2 opacity-70">· {selectedCase.caseNo}</span>}
      </div>

      {/* Fact parameters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Search className="w-4 h-4" /> Fact Parameters (controls precedent scoring)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Incident Type</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-xs"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              placeholder="e.g. construction wall collapse forensic"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Evidence Type</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-xs"
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              placeholder="e.g. material sampling forensic lab"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Procedural Defects (comma-separated)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-xs"
              value={defects}
              onChange={(e) => setDefects(e.target.value)}
              placeholder="e.g. no panchnama, no chain of custody"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Exact Match", value: exactCount, color: "text-green-700", bg: "bg-green-50 border-green-200" },
          { label: "Analogous", value: analogousCount, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
          { label: "Weak Fit", value: weakCount, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "Fatal Errors", value: fatalErrors.length, color: "text-red-700", bg: "bg-red-50 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-3 text-center ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fatal error alert */}
      {fatalErrors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800 text-sm">
                ⚠ FATAL ERROR DETECTED — {fatalErrors.length} precedent(s) factually mismatched
              </p>
              <p className="text-xs text-red-700 mt-1">
                These precedents do NOT match the incident/evidence/procedure pattern of this case.
                Using them as primary authority is a fatal error that will weaken your argument.
              </p>
              <ul className="mt-2 space-y-1">
                {fatalErrors.map((p) => (
                  <li key={p.id} className="text-xs text-red-700">
                    • {p.name} — {p.fitReason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Database links */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
          <Database className="w-4 h-4" /> Research Databases — Direct Access
        </h2>
        <div className="flex flex-wrap gap-2">
          {DATABASES.map((db) => (
            <a
              key={db.id}
              href={DB_URLS[db.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-accent rounded-lg border border-border transition-colors"
            >
              <span>{db.flag}</span>
              <span>{db.label}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted-foreground">Filter by fit:</span>
        {(["all", "exact", "analogous", "weak", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterFit(f)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              filterFit === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-muted"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Precedents */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">
          Precedents ({filtered.length} shown)
        </h2>
        {filtered.map((p) => (
          <PrecedentFitGate
            key={p.id}
            precedentName={p.name}
            citation={p.citation}
            fitScore={p.fitScore}
            fitLevel={p.fitLevel}
            fitReason={p.fitReason}
            holding={p.holding}
            application={p.application}
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
              <span>{p.court}</span>
              <span>·</span>
              <span>{p.date}</span>
              <span>·</span>
              <a
                href={DB_URLS[p.source]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {DB_LABELS[p.source]} <ExternalLink className="w-3 h-3" />
              </a>
              <span className={`px-2 py-0.5 rounded-full font-medium ${fitBadge[p.fitLevel]}`}>
                {p.fitLevel}
              </span>
            </div>
          </PrecedentFitGate>
        ))}
      </div>

      {/* AI Prompt preview */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold">Generated AI Research Prompt</h2>
          <button
            onClick={copyPrompt}
            className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Paste this into Manupatra AI, SCC Online AI, or any LLM to get fact-fit enforced research.
        </p>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
