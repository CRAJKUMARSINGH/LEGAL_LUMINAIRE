/**
 * Query Understanding Module
 * Legal NER, section extraction, issue classification, entity normalization
 * Part of Phase 4: AI Reasoning Layer
 */

import { featureFlags } from "@/config/featureFlags";

//  Types 

export interface LegalEntity {
  text: string;
  type: EntityType;
  normalizedText: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export type EntityType =
  | "PERSON"        // Judge, accused, complainant
  | "COURT"         // Court name
  | "STATUTE"       // Act/Code name
  | "SECTION"       // Section number
  | "CASE_REF"      // Case citation
  | "DATE"          // Date reference
  | "OFFENCE"       // Criminal offence
  | "LEGAL_TERM";   // Legal terminology

export interface LegalIssue {
  id: string;
  label: string;
  category: IssueCategory;
  confidence: number;
  relatedSections: string[];
}

export type IssueCategory =
  | "BAIL"
  | "DISCHARGE"
  | "QUASHING"
  | "EVIDENCE"
  | "JURISDICTION"
  | "SENTENCING"
  | "APPEAL"
  | "CONSTITUTIONAL"
  | "CIVIL_RIGHTS"
  | "PROPERTY"
  | "CONTRACT"
  | "NEGLIGENCE"
  | "OTHER";

export interface QueryUnderstandingResult {
  originalQuery: string;
  entities: LegalEntity[];
  issues: LegalIssue[];
  sections: { ipc: string[]; crpc: string[]; other: string[] };
  courts: string[];
  judges: string[];
  intent: QueryIntent;
  complexity: number;
  normalizedQuery: string;
}

export type QueryIntent =
  | "FIND_PRECEDENT"
  | "VERIFY_CITATION"
  | "RESEARCH_ISSUE"
  | "DRAFT_DOCUMENT"
  | "ANALYSE_CASE"
  | "UNKNOWN";

//  Legal Term Dictionaries 

const OFFENCE_TERMS: Record<string, string> = {
  murder: "Culpable Homicide / Murder",
  homicide: "Culpable Homicide / Murder",
  rape: "Sexual Assault",
  "sexual assault": "Sexual Assault",
  theft: "Theft",
  robbery: "Robbery",
  dacoity: "Dacoity",
  fraud: "Cheating / Fraud",
  cheating: "Cheating / Fraud",
  forgery: "Forgery",
  extortion: "Extortion",
  kidnapping: "Kidnapping / Abduction",
  abduction: "Kidnapping / Abduction",
  "dowry harassment": "Matrimonial Cruelty",
  cruelty: "Matrimonial Cruelty",
  negligence: "Criminal Negligence",
  "causing death": "Causing Death by Negligence",
  corruption: "Corruption / Bribery",
  bribery: "Corruption / Bribery",
  defamation: "Defamation",
  sedition: "Sedition",
  rioting: "Rioting",
  assault: "Assault",
  "grievous hurt": "Grievous Hurt",
};

const COURT_NAMES: string[] = [
  "Supreme Court of India",
  "Delhi High Court",
  "Bombay High Court",
  "Calcutta High Court",
  "Madras High Court",
  "Allahabad High Court",
  "Karnataka High Court",
  "Gujarat High Court",
  "Rajasthan High Court",
  "Punjab and Haryana High Court",
  "Patna High Court",
  "Gauhati High Court",
  "Orissa High Court",
  "Andhra Pradesh High Court",
  "Telangana High Court",
  "Himachal Pradesh High Court",
  "Uttarakhand High Court",
  "Jharkhand High Court",
  "Chhattisgarh High Court",
  "Tripura High Court",
  "Manipur High Court",
  "Meghalaya High Court",
  "Sikkim High Court",
];

const COURT_ALIASES: Record<string, string> = {
  "sc": "Supreme Court of India",
  "apex court": "Supreme Court of India",
  "dhc": "Delhi High Court",
  "bhc": "Bombay High Court",
  "chc": "Calcutta High Court",
  "mhc": "Madras High Court",
};

const ISSUE_PATTERNS: Array<{
  pattern: RegExp;
  category: IssueCategory;
  label: string;
  sections: string[];
}> = [
  { pattern: /\b(?:bail|anticipatory bail|regular bail|interim bail)\b/i, category: "BAIL", label: "Bail Application", sections: ["437 CrPC", "438 CrPC", "439 CrPC"] },
  { pattern: /\b(?:discharge|discharge petition|discharge application)\b/i, category: "DISCHARGE", label: "Discharge Application", sections: ["227 CrPC", "239 CrPC"] },
  { pattern: /\b(?:quash|quashing|section 482|inherent powers)\b/i, category: "QUASHING", label: "Quashing Petition", sections: ["482 CrPC"] },
  { pattern: /\b(?:evidence|admissibility|witness|testimony|deposition)\b/i, category: "EVIDENCE", label: "Evidence / Admissibility", sections: ["Indian Evidence Act"] },
  { pattern: /\b(?:jurisdiction|territorial jurisdiction|pecuniary jurisdiction)\b/i, category: "JURISDICTION", label: "Jurisdiction Challenge", sections: [] },
  { pattern: /\b(?:sentence|sentencing|punishment|imprisonment|fine)\b/i, category: "SENTENCING", label: "Sentencing / Punishment", sections: ["235 CrPC", "248 CrPC"] },
  { pattern: /\b(?:appeal|revision|review|appellate)\b/i, category: "APPEAL", label: "Appeal / Revision", sections: ["374 CrPC", "397 CrPC", "401 CrPC"] },
  { pattern: /\b(?:fundamental rights|article 21|article 14|article 19|constitution)\b/i, category: "CONSTITUTIONAL", label: "Constitutional Rights", sections: ["Article 21", "Article 14", "Article 19"] },
  { pattern: /\b(?:civil rights|habeas corpus|writ|mandamus|certiorari)\b/i, category: "CIVIL_RIGHTS", label: "Writ / Civil Rights", sections: ["Article 32", "Article 226"] },
  { pattern: /\b(?:property|possession|title|ownership|land)\b/i, category: "PROPERTY", label: "Property Dispute", sections: [] },
  { pattern: /\b(?:contract|agreement|breach|specific performance)\b/i, category: "CONTRACT", label: "Contract / Agreement", sections: [] },
  { pattern: /\b(?:negligence|negligent|rash|careless|duty of care)\b/i, category: "NEGLIGENCE", label: "Negligence / Tort", sections: ["304A IPC"] },
];

const IPC_PATTERN = /(?:(?:IPC|Indian\s+Penal\s+Code)\s+(\d+[A-Z]?)|(?:(?:section|sec\.?|s\.)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC))/gi;
const CRPC_PATTERN = /(?:(?:CrPC|Cr\.?P\.?C\.?|Code\s+of\s+Criminal\s+Procedure)\s+(\d+[A-Z]?)|(?:(?:section|sec\.?|s\.)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC))/gi;
const OTHER_SECTION_PATTERN = /(?:section|sec\.?|article|art\.?)\s*(\d+[A-Z]?(?:\s*\(\d+\))?)\s*(?:of\s+)?(?:the\s+)?([A-Z][A-Za-z\s]+?(?:Act|Code|Constitution))/gi;
const DATE_PATTERN = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;

//  Entity Extraction 

function extractCourts(text: string): LegalEntity[] {
  const entities: LegalEntity[] = [];
  const lower = text.toLowerCase();

  for (const court of COURT_NAMES) {
    const idx = lower.indexOf(court.toLowerCase());
    if (idx !== -1) {
      entities.push({
        text: text.slice(idx, idx + court.length),
        type: "COURT",
        normalizedText: court,
        confidence: 0.95,
        startIndex: idx,
        endIndex: idx + court.length,
      });
    }
  }

  for (const [alias, normalized] of Object.entries(COURT_ALIASES)) {
    const idx = lower.indexOf(alias);
    if (idx !== -1) {
      entities.push({
        text: text.slice(idx, idx + alias.length),
        type: "COURT",
        normalizedText: normalized,
        confidence: 0.80,
        startIndex: idx,
        endIndex: idx + alias.length,
      });
    }
  }

  return entities;
}

function extractOffences(text: string): LegalEntity[] {
  const entities: LegalEntity[] = [];
  const lower = text.toLowerCase();

  for (const [term, normalized] of Object.entries(OFFENCE_TERMS)) {
    const idx = lower.indexOf(term);
    if (idx !== -1) {
      entities.push({
        text: text.slice(idx, idx + term.length),
        type: "OFFENCE",
        normalizedText: normalized,
        confidence: 0.85,
        startIndex: idx,
        endIndex: idx + term.length,
      });
    }
  }

  return entities;
}

function extractSections(text: string): {
  ipc: string[];
  crpc: string[];
  other: string[];
  entities: LegalEntity[];
} {
  const ipc: string[] = [];
  const crpc: string[] = [];
  const other: string[] = [];
  const entities: LegalEntity[] = [];

  IPC_PATTERN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = IPC_PATTERN.exec(text)) !== null) {
    const s = (m[1] ?? m[2] ?? "").toUpperCase();
    if (s && !ipc.includes(s)) {
      ipc.push(s);
      entities.push({ text: m[0], type: "SECTION", normalizedText: `Section ${s} IPC`, confidence: 0.92, startIndex: m.index, endIndex: m.index + m[0].length });
    }
  }

  CRPC_PATTERN.lastIndex = 0;
  while ((m = CRPC_PATTERN.exec(text)) !== null) {
    const s = (m[1] ?? m[2] ?? "").toUpperCase();
    if (s && !crpc.includes(s)) {
      crpc.push(s);
      entities.push({ text: m[0], type: "SECTION", normalizedText: `Section ${s} CrPC`, confidence: 0.92, startIndex: m.index, endIndex: m.index + m[0].length });
    }
  }

  OTHER_SECTION_PATTERN.lastIndex = 0;
  while ((m = OTHER_SECTION_PATTERN.exec(text)) !== null) {
    const entry = `${m[1]} of ${m[2].trim()}`;
    if (!other.includes(entry)) {
      other.push(entry);
      entities.push({ text: m[0], type: "SECTION", normalizedText: entry, confidence: 0.85, startIndex: m.index, endIndex: m.index + m[0].length });
    }
  }

  return { ipc, crpc, other, entities };
}

function extractDates(text: string): LegalEntity[] {
  const entities: LegalEntity[] = [];
  DATE_PATTERN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = DATE_PATTERN.exec(text)) !== null) {
    entities.push({ text: m[0], type: "DATE", normalizedText: m[0], confidence: 0.75, startIndex: m.index, endIndex: m.index + m[0].length });
  }
  return entities;
}

//  Issue Classification 

function classifyIssues(text: string): LegalIssue[] {
  const issues: LegalIssue[] = [];
  for (const { pattern, category, label, sections } of ISSUE_PATTERNS) {
    if (pattern.test(text)) {
      issues.push({
        id: category,
        label,
        category,
        confidence: 0.80,
        relatedSections: sections,
      });
    }
  }
  return issues;
}

//  Intent Detection 

function detectIntent(text: string, issues: LegalIssue[]): QueryIntent {
  const lower = text.toLowerCase();
  if (/\b(?:draft|write|prepare|file|petition|application)\b/.test(lower)) return "DRAFT_DOCUMENT";
  if (/\b(?:verify|check|confirm|validate|citation)\b/.test(lower)) return "VERIFY_CITATION";
  if (/\b(?:similar|like|analogous|precedent|authority)\b/.test(lower)) return "FIND_PRECEDENT";
  if (/\b(?:analyse|analyze|review|examine|assess)\b/.test(lower)) return "ANALYSE_CASE";
  if (issues.length > 0) return "RESEARCH_ISSUE";
  return "UNKNOWN";
}

//  Complexity Score 

function scoreComplexity(
  entities: LegalEntity[],
  issues: LegalIssue[],
  sections: { ipc: string[]; crpc: string[]; other: string[] }
): number {
  const entityScore = Math.min(30, entities.length * 3);
  const issueScore = Math.min(30, issues.length * 10);
  const sectionScore = Math.min(25, (sections.ipc.length + sections.crpc.length + sections.other.length) * 5);
  const wordScore = Math.min(15, Math.floor(entities.length / 2));
  return entityScore + issueScore + sectionScore + wordScore;
}

//  Normalize Query 

function normalizeQuery(text: string, entities: LegalEntity[]): string {
  let normalized = text;
  // Replace court aliases with full names
  for (const entity of entities.filter(e => e.type === "COURT")) {
    normalized = normalized.replace(entity.text, entity.normalizedText);
  }
  return normalized.trim();
}

//  Main Function 

export function understandQuery(text: string): QueryUnderstandingResult {
  if (!featureFlags.enableQueryUnderstanding) {
    return {
      originalQuery: text,
      entities: [],
      issues: [],
      sections: { ipc: [], crpc: [], other: [] },
      courts: [],
      judges: [],
      intent: "UNKNOWN",
      complexity: 0,
      normalizedQuery: text,
    };
  }

  const courtEntities = extractCourts(text);
  const offenceEntities = extractOffences(text);
  const sectionData = extractSections(text);
  const dateEntities = extractDates(text);

  const allEntities = [
    ...courtEntities,
    ...offenceEntities,
    ...sectionData.entities,
    ...dateEntities,
  ].sort((a, b) => a.startIndex - b.startIndex);

  const issues = classifyIssues(text);
  const intent = detectIntent(text, issues);
  const complexity = scoreComplexity(allEntities, issues, sectionData);
  const normalizedQuery = normalizeQuery(text, courtEntities);

  const courts = [...new Set(courtEntities.map(e => e.normalizedText))];

  return {
    originalQuery: text,
    entities: allEntities,
    issues,
    sections: { ipc: sectionData.ipc, crpc: sectionData.crpc, other: sectionData.other },
    courts,
    judges: [],
    intent,
    complexity,
    normalizedQuery,
  };
}

export function getIssueSummary(issues: LegalIssue[]): string {
  if (issues.length === 0) return "General legal query";
  if (issues.length === 1) return issues[0].label;
  return `${issues[0].label} + ${issues.length - 1} more issue${issues.length > 2 ? "s" : ""}`;
}