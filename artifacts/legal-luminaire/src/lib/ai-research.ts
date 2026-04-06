/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LEGAL LUMINAIRE — ACCURACY ENGINE v3
 * Single source of truth for all research, scoring, and verification logic.
 *
 * Rules (NEVER VIOLATE):
 *  1. Every precedent scored on 3-axis Fact-Fit Gate before use.
 *  2. Score < 30 → REJECTED. Fatal error if used as primary authority.
 *  3. Holdings quoted verbatim — never paraphrased.
 *  4. IS/ASTM standards verified for scope before citing clause numbers.
 *  5. Databases searched in priority order: Manupatra → SCC → IK → LN → BAILII.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type DatabaseSource =
  | "manupatra"
  | "scc_online"
  | "indian_kanoon"
  | "lexis_nexis"
  | "westlaw"
  | "bailii"
  | "astm"
  | "bis"
  | "cpwd";

/** Fact-fit level derived from 3-axis score */
export type FitLevel = "exact" | "analogous" | "weak" | "rejected";

/** Verification tier for a citation */
export type VerificationTier =
  | "COURT_SAFE"   // certified copy + para number confirmed
  | "VERIFIED"     // existence confirmed on official source
  | "SECONDARY"    // credible secondary source, needs primary verification
  | "PENDING"      // unverified — must not appear in filed documents
  | "FATAL_ERROR"; // factually mismatched or fabricated — blocked

export type FitScoreBreakdown = {
  incidentScore: number;   // 0-40
  evidenceScore: number;   // 0-35
  defectScore: number;     // 0-25
  total: number;           // 0-100
  level: FitLevel;
  reasons: string[];
  fatalError: boolean;
};

export type PrecedentResult = {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  /** Verbatim holding from certified source — never paraphrased */
  holding: string;
  /** Para/page reference from the actual judgment */
  paraRef: string | null;
  application: string;
  fitScore: number;
  fitLevel: FitLevel;
  fitReason: string;
  verificationTier: VerificationTier;
  verificationNote: string;
  source: DatabaseSource;
  sourceUrl: string;
  /** Actions required before this can be used in court */
  requiredActions: string[];
  /** Blocked from draft output until verified */
  blockedFromDraft: boolean;
  tags: string[];
};

export type StandardResult = {
  code: string;
  title: string;
  applicability: "correct" | "wrong" | "partial";
  applicabilityReason: string;
  /** Exact clause text from official standard — null if not yet obtained */
  exactClauseText: string | null;
  clauseRef: string | null;
  source: DatabaseSource;
  sourceUrl: string;
  verificationTier: VerificationTier;
  requiredActions: string[];
};

export type ResearchQuery = {
  caseTitle: string;
  brief: string;
  incidentType: string;
  evidenceType: string;
  proceduralDefects: string[];
  jurisdiction: string;
};

export type ResearchResult = {
  query: ResearchQuery;
  precedents: PrecedentResult[];
  standards: StandardResult[];
  fatalErrors: string[];
  blockedCitations: string[];
  overallAccuracyScore: number;
  generatedAt: string;
};

// ── Database Registry (priority order per spec) ───────────────────────────────

export const DATABASES: Array<{
  id: DatabaseSource;
  label: string;
  url: string;
  priority: number;
  type: "legal" | "standard" | "manual";
  description: string;
}> = [
  { id: "manupatra",    label: "Manupatra",         url: "https://www.manupatra.com",   priority: 1, type: "legal",    description: "Indian SC/HC judgments — primary database" },
  { id: "scc_online",   label: "SCC Online",         url: "https://www.scconline.com",   priority: 2, type: "legal",    description: "Supreme Court cases — authoritative reporter" },
  { id: "indian_kanoon",label: "Indian Kanoon",      url: "https://indiankanoon.org",    priority: 3, type: "legal",    description: "Full-text search — free access" },
  { id: "lexis_nexis",  label: "Lexis Nexis India",  url: "https://www.lexisnexis.in",   priority: 4, type: "legal",    description: "Annotated cases — secondary verification" },
  { id: "bailii",       label: "BAILII / Westlaw",   url: "https://www.bailii.org",      priority: 5, type: "legal",    description: "International precedents" },
  { id: "bis",          label: "BIS Portal",         url: "https://www.bis.gov.in",      priority: 6, type: "standard", description: "IS codes — official Bureau of Indian Standards" },
  { id: "astm",         label: "ASTM International", url: "https://www.astm.org",        priority: 7, type: "standard", description: "ASTM technical standards" },
  { id: "cpwd",         label: "CPWD Manual 2023",   url: "https://cpwd.gov.in",         priority: 8, type: "manual",   description: "Construction norms — Central Public Works Department" },
];

export const DB_URLS: Record<DatabaseSource, string> = Object.fromEntries(
  DATABASES.map((d) => [d.id, d.url])
) as Record<DatabaseSource, string>;

export const DB_LABELS: Record<DatabaseSource, string> = Object.fromEntries(
  DATABASES.map((d) => [d.id, d.label])
) as Record<DatabaseSource, string>;

// ── Fact-Fit Gate ─────────────────────────────────────────────────────────────

export function scorePrecedentFit(
  precedentTags: string[],
  query: ResearchQuery
): FitScoreBreakdown {
  const tagStr = precedentTags.join(" ").toLowerCase();
  const reasons: string[] = [];

  const incidentKw = query.incidentType.toLowerCase().split(/[\s,;]+/).filter((k) => k.length > 3);
  const incidentHits = incidentKw.filter((k) => tagStr.includes(k)).length;
  const incidentScore = Math.min(40, incidentKw.length > 0 ? Math.round((incidentHits / incidentKw.length) * 40) : 0);
  reasons.push(incidentScore >= 20
    ? `[A] Incident match: ${incidentScore}/40 (${incidentHits}/${incidentKw.length} keywords)`
    : `[A] Incident mismatch: ${incidentScore}/40`);

  const evidenceKw = query.evidenceType.toLowerCase().split(/[\s,;]+/).filter((k) => k.length > 3);
  const evidenceHits = evidenceKw.filter((k) => tagStr.includes(k)).length;
  const evidenceScore = Math.min(35, evidenceKw.length > 0 ? Math.round((evidenceHits / evidenceKw.length) * 35) : 0);
  reasons.push(evidenceScore >= 17 ? `[B] Evidence match: ${evidenceScore}/35` : `[B] Evidence mismatch: ${evidenceScore}/35`);

  const defectKw = query.proceduralDefects.join(" ").toLowerCase().split(/[\s,;]+/).filter((k) => k.length > 3);
  const defectHits = defectKw.filter((k) => tagStr.includes(k)).length;
  const defectScore = Math.min(25, Math.round((defectHits / Math.max(defectKw.length, 1)) * 25));
  if (defectScore >= 10) reasons.push(`[C] Procedural match: ${defectScore}/25`);

  const total = incidentScore + evidenceScore + defectScore;
  let level: FitLevel;
  if (total >= 70) level = "exact";
  else if (total >= 50) level = "analogous";
  else if (total >= 30) level = "weak";
  else level = "rejected";

  return { incidentScore, evidenceScore, defectScore, total, level, reasons, fatalError: level === "rejected" };
}

export function fitLevelLabel(level: FitLevel): string {
  return {
    exact:    "Exact Match — Primary Authority (≥70)",
    analogous:"Analogous — Use with Qualification (50-69)",
    weak:     "Weak Fit — Supporting Only (30-49)",
    rejected: "REJECTED — DO NOT USE (<30) — FATAL ERROR if cited as primary",
  }[level];
}

export function fitLevelClass(level: FitLevel): string {
  return {
    exact:    "bg-green-100 text-green-800 border-green-300",
    analogous:"bg-blue-100 text-blue-800 border-blue-300",
    weak:     "bg-amber-100 text-amber-800 border-amber-300",
    rejected: "bg-red-100 text-red-800 border-red-400",
  }[level];
}

// ── Research Prompt Builder ───────────────────────────────────────────────────

export function buildResearchPrompt(query: ResearchQuery, uploadedFiles: string[]): string {
  const defects = query.proceduralDefects.join(", ") || "not specified";
  const files = uploadedFiles.length > 0 ? uploadedFiles.join(", ") : "[none uploaded]";
  return `LEGAL RESEARCH REQUEST — FACT-FIT ENFORCED\nCASE: ${query.caseTitle}\nJURISDICTION: ${query.jurisdiction}\nINCIDENT TYPE: ${query.incidentType}\nEVIDENCE TYPE: ${query.evidenceType}\nPROCEDURAL DEFECTS: ${defects}\nBRIEF: ${query.brief}\nUPLOADED FILES: ${files}`;
}

// ── Accuracy Scoring ──────────────────────────────────────────────────────────

export type AccuracyReport = {
  overallScore: number;
  courtSafe: number;
  verified: number;
  secondary: number;
  pending: number;
  blocked: number;
  fatalErrors: string[];
  readyToFile: boolean;
  blockedCitations: string[];
};

export function computeAccuracyReport(precedents: PrecedentResult[]): AccuracyReport {
  const total = precedents.length || 1;
  const courtSafe  = precedents.filter((p) => p.verificationTier === "COURT_SAFE").length;
  const verified   = precedents.filter((p) => p.verificationTier === "VERIFIED").length;
  const secondary  = precedents.filter((p) => p.verificationTier === "SECONDARY").length;
  const pending    = precedents.filter((p) => p.verificationTier === "PENDING").length;
  const blocked    = precedents.filter((p) => p.blockedFromDraft).length;
  const fatalErrors = precedents
    .filter((p) => p.fitLevel === "rejected" && !p.blockedFromDraft)
    .map((p) => `⚠ FATAL ERROR: ${p.name} [${p.citation}] — rejected precedent used as authority`);
  const blockedCitations = precedents.filter((p) => p.blockedFromDraft).map((p) => `${p.name} [${p.citation}]`);
  const score = Math.round(((courtSafe * 100 + verified * 70 + secondary * 40) / (total * 100)) * 100);
  return { overallScore: score, courtSafe, verified, secondary, pending, blocked, fatalErrors, readyToFile: pending === 0 && blocked === 0 && fatalErrors.length === 0, blockedCitations };
}

export const TIER_LABELS: Record<VerificationTier, string> = {
  COURT_SAFE:  "Court-Safe",
  VERIFIED:    "Verified",
  SECONDARY:   "Secondary",
  PENDING:     "⚠ Pending",
  FATAL_ERROR: "⛔ Fatal Error",
};

export const TIER_CLASSES: Record<VerificationTier, string> = {
  COURT_SAFE:  "bg-emerald-100 text-emerald-800 border-emerald-300",
  VERIFIED:    "bg-blue-100 text-blue-800 border-blue-300",
  SECONDARY:   "bg-amber-100 text-amber-800 border-amber-300",
  PENDING:     "bg-orange-100 text-orange-800 border-orange-300",
  FATAL_ERROR: "bg-red-100 text-red-800 border-red-400",
};

// ── Pre-filing Validation ─────────────────────────────────────────────────────

export type FilingValidationResult = {
  canFile: boolean;
  errors: string[];
  warnings: string[];
  checklist: Array<{ item: string; done: boolean; critical: boolean }>;
};

export function validateForFiling(precedents: PrecedentResult[], standards: StandardResult[]): FilingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  precedents.filter((p) => p.blockedFromDraft).forEach((p) => errors.push(`BLOCKED: ${p.name} — ${p.verificationNote}`));
  precedents.filter((p) => p.fitLevel === "rejected").forEach((p) => errors.push(`FATAL ERROR: ${p.name} — fit score ${p.fitScore}/100 (rejected)`));
  precedents.filter((p) => p.court.toLowerCase().includes("supreme") && !p.paraRef && p.verificationTier !== "PENDING")
    .forEach((p) => warnings.push(`Missing para ref: ${p.name} [${p.citation}]`));
  standards.filter((s) => s.applicability === "wrong").forEach((s) => warnings.push(`Wrong standard cited: ${s.code} — ${s.applicabilityReason}`));
  standards.filter((s) => !s.exactClauseText && s.applicability !== "wrong").forEach((s) => warnings.push(`Clause text not obtained: ${s.code} ${s.clauseRef}`));

  const checklist = [
    { item: "Certified copy of Kattavellai 2025 INSC 845 with para numbers", done: false, critical: true },
    { item: "Certified copy of Prafulla Kumar Samal (1979) 3 SCC 4, Para 10", done: false, critical: true },
    { item: "Certified copy of Ramesh Singh (1977) 4 SCC 39, Para 5", done: false, critical: true },
    { item: "Certified copy of Jacob Mathew (2005) 6 SCC 1, Para 48", done: false, critical: true },
    { item: "Certified copy of Damu (2000) 6 SCC 269", done: false, critical: true },
    { item: "Certified copy of Baldev Singh (1999) 6 SCC 172", done: false, critical: true },
    { item: "Official BIS copy IS 1199:2018 (Scope clause) — Annexure A", done: false, critical: true },
    { item: "Official BIS copy IS 2250:1981 (Clause 5.2) — Annexure B", done: false, critical: true },
    { item: "Official BIS copy IS 3535:1986 (Clauses 4.1, 6.2) — Annexure C", done: false, critical: true },
    { item: "ASTM C1324 (Sections 7-8) — Annexure D", done: false, critical: true },
    { item: "CPWD Works Manual 2023 (Sections 3.7.4, 12.2.1) — Annexure E", done: false, critical: true },
    { item: "IMD weather records for Udaipur, 28-12-2011 — Annexure F", done: false, critical: true },
    { item: "Affidavit notarised", done: false, critical: true },
  ];

  return { canFile: errors.length === 0, errors, warnings, checklist };
}
