export type CaseFile = {
  name: string;
  size: number;
  type: string;
};

/** Party to a case — from live app schema */
export type CaseParty = {
  id?: string;
  name: string;
  role: "accused" | "complainant" | "petitioner" | "respondent" | "witness" | "other";
  address?: string;
  lawyer?: string;
};

/** Verified citation entry — from live app schema */
export type CaseCitation = {
  id?: string;
  caseName: string;
  citation: string;
  court: string;
  year?: string;
  holding?: string;
  status: "COURT_SAFE" | "VERIFIED" | "SECONDARY" | "PENDING" | "FATAL_ERROR";
  sourceUrl?: string;
  blockedFromDraft?: boolean;
};

export type CaseRecord = {
  id: string;
  title: string;
  court: string;
  caseNo: string;
  brief: string;
  createdAt: string;
  files: CaseFile[];

  // From live app schema
  case_type?: "bail" | "discharge" | "writ" | "notice-reply" | "appeal" | "revision" | "other";
  status?: string;                     // case status (active, archived, draft)
  filing_date?: string;                // ISO date string
  charges?: string | string[];         // supports both old string and new array format
  parties?: CaseParty[];               // structured party list
  citations?: CaseCitation[];          // verified citations attached to case

  // Existing extended fields
  forensic_grounding?: Array<{ code: string; title: string; keywords: string[]; violations: string[] }>;
  documents?: Array<{ id: string; name: string; type: string; status: string; size: number; uploadedAt: string; description?: string }>;
  caseLaw?: Array<{ case: string; court: string; useForDefence: string; status: string; action: string; citation?: string; holding?: string; fitScore?: number }>;
  timeline?: Array<{ id: number; title: string; description: string; status: string; note?: string; date?: string; grounding?: string }>;
  strategy?: Array<{ id: string; title: string; description: string; status: string; priority: string }>;
  standards?: Array<{ code: string; title: string; applicability: string; keyClause: string; violation: string; sourceUrl?: string; confidence: string }>;
  review_status?: "DRAFT" | "SUBMITTED" | "APPROVED";
  assigned_to?: string;
  accused_names?: string[];
  metadata?: {
    category: string;
    complexity: string;
    estimatedDuration: string;
    requiredResources: string[];
  };
  collisions?: Array<{
    id: string;
    type: string;
    description: string;
    evidence_a: string;
    evidence_b: string;
    target_event_id?: number;
    severity: string;
  }>;
};

const CASES_KEY = "legal_luminaire_cases_v1";
const SELECTED_KEY = "legal_luminaire_selected_case_v1";

export const DEFAULT_CASE_ID = "case-01";

export const defaultCase: CaseRecord = {
  id: DEFAULT_CASE_ID,
  title: "Special Session Case 1/2025 - Hemraj Vardar",
  court: "Special Session Judge (PC Act), Udaipur, Rajasthan",
  caseNo: "1/2025",
  brief: "Stadium outer wall partial collapse; prosecution relies on mortar forensic failure; defence alleges rain-time sampling, no representative, no chain-of-custody.",
  createdAt: new Date().toISOString(),
  files: [],
  case_type: "discharge",
  filing_date: "2025-01-01",
  charges: ["IPC 304A", "PC Act §13(1)(d)", "IPC 120B"],
  parties: [
    { name: "Hemraj Vardar", role: "accused", lawyer: "Defence Counsel" },
    { name: "State of Rajasthan", role: "complainant" },
  ],
  citations: [],
};

/** Normalise charges to always return a string array */
export function getChargesArray(record: CaseRecord): string[] {
  if (!record.charges) return [];
  if (Array.isArray(record.charges)) return record.charges;
  return [record.charges];
}

/** Seed key — bump version to force re-seed when new cases are added */
const SEED_KEY = "legal_luminaire_seeded_v3";

export function loadCases(): CaseRecord[] {
  try {
    const raw = localStorage.getItem(CASES_KEY);
    const seeded = localStorage.getItem(SEED_KEY);

    // Lazy import to avoid circular deps — infra cases seeded on first load
    if (!seeded) {
      // Will be seeded by CaseContext on mount via seedInfraCases()
      if (!raw) return [defaultCase];
    }

    if (!raw) return [defaultCase];
    const parsed = JSON.parse(raw) as CaseRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [defaultCase];
    return parsed;
  } catch {
    return [defaultCase];
  }
}

export function markSeeded() {
  localStorage.setItem(SEED_KEY, "1");
}

export function isSeeded(): boolean {
  return !!localStorage.getItem(SEED_KEY);
}

export function saveCases(cases: CaseRecord[]) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

export function loadSelectedCaseId(): string {
  return localStorage.getItem(SELECTED_KEY) || DEFAULT_CASE_ID;
}

export function saveSelectedCaseId(caseId: string) {
  localStorage.setItem(SELECTED_KEY, caseId);
}

export function slugifyCase(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || `case-${Date.now()}`
  );
}

