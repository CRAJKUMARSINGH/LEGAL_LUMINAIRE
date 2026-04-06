/**
 * Multi-Case Store — Legal Luminaire
 * localStorage-backed store for unlimited cases with template support.
 */

export interface CaseFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  status: "VERIFIED" | "SECONDARY" | "PENDING" | "COMPLETED";
  note?: string;
  date?: string;
}

export interface CaseLawEntry {
  case: string;
  court: string;
  useForDefence: string;
  status: "VERIFIED" | "SECONDARY" | "PENDING";
  action: string;
  citation?: string;
  holding?: string;
  fitScore?: number;
}

export interface StandardEntry {
  code: string;
  title: string;
  applicability: "correct" | "wrong" | "partial";
  keyClause: string;
  violation: string;
  sourceUrl?: string;
  confidence: "VERIFIED" | "SECONDARY" | "PENDING";
}

export interface DocumentEntry {
  id: string;
  name: string;
  type: string;
  status: "VERIFIED" | "SECONDARY" | "PENDING";
  size: number;
  uploadedAt: string;
  description?: string;
}

export interface StrategyPillar {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface MultiCaseData {
  id: string;
  title: string;
  court: string;
  caseNo: string;
  brief: string;
  charges: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  files: CaseFile[];
  timeline: TimelineEvent[];
  caseLaw: CaseLawEntry[];
  standards: StandardEntry[];
  documents: DocumentEntry[];
  strategy: StrategyPillar[];
  metadata: {
    category: string;
    complexity: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    estimatedDuration: string;
    requiredResources: string[];
  };
}

export interface CaseTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  defaultData: Partial<MultiCaseData>;
  requiredFields: string[];
  optionalFields: string[];
}

const MULTI_CASES_KEY = "legal_luminaire_multi_cases_v2";
const SELECTED_CASE_KEY = "legal_luminaire_selected_case_v2";
const CASE_TEMPLATES_KEY = "legal_luminaire_templates_v1";

export const DEFAULT_CASE_DATA: MultiCaseData = {
  id: "default-case",
  title: "New Legal Case",
  court: "Sessions Court",
  caseNo: "TBD",
  brief: "Case description to be added",
  charges: "To be determined",
  status: "Draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  files: [],
  timeline: [{ id: 1, title: "Case Initiation", description: "Case created and ready for configuration", status: "COMPLETED", date: new Date().toISOString() }],
  caseLaw: [],
  standards: [],
  documents: [],
  strategy: [],
  metadata: { category: "General", complexity: "BASIC", estimatedDuration: "30-60 days", requiredResources: ["Legal Research", "Document Preparation"] },
};

export function loadMultiCases(): MultiCaseData[] {
  try {
    const raw = localStorage.getItem(MULTI_CASES_KEY);
    if (!raw) return [DEFAULT_CASE_DATA];
    const parsed = JSON.parse(raw) as MultiCaseData[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_CASE_DATA];
  } catch { return [DEFAULT_CASE_DATA]; }
}

export function saveMultiCases(cases: MultiCaseData[]) {
  localStorage.setItem(MULTI_CASES_KEY, JSON.stringify(cases));
}

export function loadSelectedCaseId(): string {
  return localStorage.getItem(SELECTED_CASE_KEY) || DEFAULT_CASE_DATA.id;
}

export function saveSelectedCaseId(caseId: string) {
  localStorage.setItem(SELECTED_CASE_KEY, caseId);
}

export function createCaseFromTemplate(template: CaseTemplate, customData: Partial<MultiCaseData>): MultiCaseData {
  const now = new Date().toISOString();
  return {
    ...DEFAULT_CASE_DATA,
    ...template.defaultData,
    ...customData,
    id: `case-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    metadata: { ...DEFAULT_CASE_DATA.metadata, ...template.defaultData.metadata, ...customData.metadata },
  };
}

export function updateCase(caseId: string, updates: Partial<MultiCaseData>): MultiCaseData | null {
  const cases = loadMultiCases();
  const idx = cases.findIndex((c) => c.id === caseId);
  if (idx === -1) return null;
  const updated = { ...cases[idx], ...updates, updatedAt: new Date().toISOString() };
  cases[idx] = updated;
  saveMultiCases(cases);
  return updated;
}

export function deleteCase(caseId: string): boolean {
  const cases = loadMultiCases();
  const filtered = cases.filter((c) => c.id !== caseId);
  if (filtered.length === cases.length) return false;
  saveMultiCases(filtered);
  if (loadSelectedCaseId() === caseId && filtered.length > 0) saveSelectedCaseId(filtered[0].id);
  return true;
}

export function duplicateCase(caseId: string, newTitle?: string): MultiCaseData | null {
  const cases = loadMultiCases();
  const orig = cases.find((c) => c.id === caseId);
  if (!orig) return null;
  const dup: MultiCaseData = { ...orig, id: `case-${Date.now()}`, title: newTitle || `${orig.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  saveMultiCases([dup, ...cases]);
  return dup;
}

export function exportCase(caseId: string): string | null {
  const c = loadMultiCases().find((c) => c.id === caseId);
  return c ? JSON.stringify(c, null, 2) : null;
}

export function importCase(caseJson: string): MultiCaseData | null {
  try {
    const data = JSON.parse(caseJson) as MultiCaseData;
    if (!data.title || !data.court || !data.caseNo) throw new Error("Missing required fields");
    const imported: MultiCaseData = { ...data, id: `case-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    saveMultiCases([imported, ...loadMultiCases()]);
    return imported;
  } catch { return null; }
}

export function searchCases(query: string): MultiCaseData[] {
  const q = query.toLowerCase();
  return loadMultiCases().filter((c) =>
    c.title.toLowerCase().includes(q) || c.brief.toLowerCase().includes(q) ||
    c.court.toLowerCase().includes(q) || c.caseNo.toLowerCase().includes(q) ||
    c.charges.toLowerCase().includes(q)
  );
}

export function getCaseStatistics() {
  const cases = loadMultiCases();
  const stats = { totalCases: cases.length, byCategory: {} as Record<string, number>, byComplexity: {} as Record<string, number>, byStatus: {} as Record<string, number> };
  cases.forEach((c) => {
    stats.byCategory[c.metadata.category] = (stats.byCategory[c.metadata.category] || 0) + 1;
    stats.byComplexity[c.metadata.complexity] = (stats.byComplexity[c.metadata.complexity] || 0) + 1;
    stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
  });
  return stats;
}

export function validateCaseData(data: Partial<MultiCaseData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push("Case title is required");
  if (!data.court?.trim()) errors.push("Court name is required");
  if (!data.caseNo?.trim()) errors.push("Case number is required");
  if (!data.brief?.trim()) errors.push("Case brief is required");
  if (!data.charges?.trim()) errors.push("Charges are required");
  return { isValid: errors.length === 0, errors };
}
