export type CaseFile = {
  name: string;
  size: number;
  type: string;
};

export type CaseRecord = {
  id: string;
  title: string;
  court: string;
  caseNo: string;
  brief: string;
  createdAt: string;
  files: CaseFile[];
};

const CASES_KEY = "legal_luminaire_cases_v1";
const SELECTED_KEY = "legal_luminaire_selected_case_v1";

export const DEFAULT_CASE_ID = "case-01";

export const defaultCase: CaseRecord = {
  id: DEFAULT_CASE_ID,
  title: "Special Session Case 1/2025 - Hemraj Vardar",
  court: "Special Session Judge (PC Act), Udaipur, Rajasthan",
  caseNo: "1/2025",
  brief:
    "Stadium outer wall partial collapse; prosecution relies on mortar forensic failure; defence alleges rain-time sampling, no representative, no chain-of-custody.",
  createdAt: new Date().toISOString(),
  files: [],
};

export function loadCases(): CaseRecord[] {
  try {
    const raw = localStorage.getItem(CASES_KEY);
    if (!raw) return [defaultCase];
    const parsed = JSON.parse(raw) as CaseRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [defaultCase];
    return parsed;
  } catch {
    return [defaultCase];
  }
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

