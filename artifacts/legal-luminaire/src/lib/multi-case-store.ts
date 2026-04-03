/**
 * Multi-Case Store - Legal Luminaire
 * Supports unlimited cases with template-based generation
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

// Storage keys
const MULTI_CASES_KEY = "legal_luminaire_multi_cases_v2";
const SELECTED_CASE_KEY = "legal_luminaire_selected_case_v2";
const CASE_TEMPLATES_KEY = "legal_luminaire_templates_v1";

// Default case data for new installations
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
  timeline: [
    {
      id: 1,
      title: "Case Initiation",
      description: "Case has been created and is ready for configuration",
      status: "COMPLETED",
      date: new Date().toISOString(),
    },
  ],
  caseLaw: [],
  standards: [],
  documents: [],
  strategy: [],
  metadata: {
    category: "General",
    complexity: "BASIC",
    estimatedDuration: "30-60 days",
    requiredResources: ["Legal Research", "Document Preparation"],
  },
};

// Case management functions
export function loadMultiCases(): MultiCaseData[] {
  try {
    const raw = localStorage.getItem(MULTI_CASES_KEY);
    if (!raw) return [DEFAULT_CASE_DATA];
    const parsed = JSON.parse(raw) as MultiCaseData[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [DEFAULT_CASE_DATA];
    return parsed;
  } catch {
    return [DEFAULT_CASE_DATA];
  }
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
  const caseId = `case-${Date.now()}`;
  const now = new Date().toISOString();
  
  const baseData: MultiCaseData = {
    ...DEFAULT_CASE_DATA,
    ...template.defaultData,
    ...customData,
    id: caseId,
    createdAt: now,
    updatedAt: now,
    metadata: {
      ...DEFAULT_CASE_DATA.metadata,
      ...template.defaultData.metadata,
      ...customData.metadata,
    },
  };
  
  return baseData;
}

export function updateCase(caseId: string, updates: Partial<MultiCaseData>): MultiCaseData | null {
  const cases = loadMultiCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) return null;
  
  const updatedCase = {
    ...cases[caseIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  cases[caseIndex] = updatedCase;
  saveMultiCases(cases);
  
  return updatedCase;
}

export function deleteCase(caseId: string): boolean {
  const cases = loadMultiCases();
  const filteredCases = cases.filter(c => c.id !== caseId);
  
  if (filteredCases.length === cases.length) return false;
  
  saveMultiCases(filteredCases);
  
  // If deleted case was selected, select first available case
  const selectedId = loadSelectedCaseId();
  if (selectedId === caseId && filteredCases.length > 0) {
    saveSelectedCaseId(filteredCases[0].id);
  }
  
  return true;
}

export function duplicateCase(caseId: string, newTitle?: string): MultiCaseData | null {
  const cases = loadMultiCases();
  const originalCase = cases.find(c => c.id === caseId);
  
  if (!originalCase) return null;
  
  const duplicatedCase: MultiCaseData = {
    ...originalCase,
    id: `case-${Date.now()}`,
    title: newTitle || `${originalCase.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedCases = [duplicatedCase, ...cases];
  saveMultiCases(updatedCases);
  
  return duplicatedCase;
}

export function exportCase(caseId: string): string | null {
  const cases = loadMultiCases();
  const caseData = cases.find(c => c.id === caseId);
  
  if (!caseData) return null;
  
  return JSON.stringify(caseData, null, 2);
}

export function importCase(caseJson: string): MultiCaseData | null {
  try {
    const caseData = JSON.parse(caseJson) as MultiCaseData;
    
    // Validate required fields
    if (!caseData.title || !caseData.court || !caseData.caseNo) {
      throw new Error("Missing required fields");
    }
    
    // Generate new ID and timestamps
    const importedCase: MultiCaseData = {
      ...caseData,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const cases = loadMultiCases();
    const updatedCases = [importedCase, ...cases];
    saveMultiCases(updatedCases);
    
    return importedCase;
  } catch {
    return null;
  }
}

// Template management functions
export function loadCaseTemplates(): CaseTemplate[] {
  try {
    const raw = localStorage.getItem(CASE_TEMPLATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CaseTemplate[];
  } catch {
    return [];
  }
}

export function saveCaseTemplates(templates: CaseTemplate[]) {
  localStorage.setItem(CASE_TEMPLATES_KEY, JSON.stringify(templates));
}

export function addCaseTemplate(template: CaseTemplate): boolean {
  const templates = loadCaseTemplates();
  
  // Check for duplicate ID
  if (templates.some(t => t.id === template.id)) {
    return false;
  }
  
  const updatedTemplates = [...templates, template];
  saveCaseTemplates(updatedTemplates);
  
  return true;
}

// Utility functions
export function slugifyCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || `case-${Date.now()}`;
}

export function validateCaseData(caseData: Partial<MultiCaseData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!caseData.title || caseData.title.trim().length === 0) {
    errors.push("Case title is required");
  }
  
  if (!caseData.court || caseData.court.trim().length === 0) {
    errors.push("Court name is required");
  }
  
  if (!caseData.caseNo || caseData.caseNo.trim().length === 0) {
    errors.push("Case number is required");
  }
  
  if (!caseData.brief || caseData.brief.trim().length === 0) {
    errors.push("Case brief is required");
  }
  
  if (!caseData.charges || caseData.charges.trim().length === 0) {
    errors.push("Charges are required");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Search and filter functions
export function searchCases(query: string): MultiCaseData[] {
  const cases = loadMultiCases();
  const lowercaseQuery = query.toLowerCase();
  
  return cases.filter(case_ => 
    case_.title.toLowerCase().includes(lowercaseQuery) ||
    case_.brief.toLowerCase().includes(lowercaseQuery) ||
    case_.court.toLowerCase().includes(lowercaseQuery) ||
    case_.caseNo.toLowerCase().includes(lowercaseQuery) ||
    case_.charges.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterCasesByCategory(category: string): MultiCaseData[] {
  const cases = loadMultiCases();
  
  if (category === "all") return cases;
  
  return cases.filter(case_ => case_.metadata.category === category);
}

export function getCaseStatistics(): {
  totalCases: number;
  byCategory: Record<string, number>;
  byComplexity: Record<string, number>;
  byStatus: Record<string, number>;
} {
  const cases = loadMultiCases();
  
  const stats = {
    totalCases: cases.length,
    byCategory: {} as Record<string, number>,
    byComplexity: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
  };
  
  cases.forEach(case_ => {
    // Category stats
    const category = case_.metadata.category;
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    
    // Complexity stats
    const complexity = case_.metadata.complexity;
    stats.byComplexity[complexity] = (stats.byComplexity[complexity] || 0) + 1;
    
    // Status stats
    const status = case_.status;
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
  });
  
  return stats;
}
