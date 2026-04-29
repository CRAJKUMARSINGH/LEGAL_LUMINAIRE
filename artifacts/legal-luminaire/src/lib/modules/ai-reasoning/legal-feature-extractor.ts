/**
 * Legal Feature Extractor
 * Extracts structured legal features from case text for similarity scoring
 * Part of Phase 4: AI Reasoning Layer
 */

import { featureFlags } from "@/config/featureFlags";
import type { IssueCategory } from "./query-understanding";

//  Types 

export interface CaseFeatures {
  caseId: string;
  title: string;
  court: string;
  courtLevel: CourtLevel;
  year: number;
  judges: string[];
  ipcSections: string[];
  crpcSections: string[];
  otherSections: string[];
  offences: string[];
  issues: IssueCategory[];
  outcome: CaseOutcome;
  keyTerms: string[];
  citationCount: number;
  hasConstitutionalIssue: boolean;
  hasBailIssue: boolean;
  hasEvidenceIssue: boolean;
  procedureType: ProcedureType;
}

export type CourtLevel = "SUPREME" | "HIGH" | "SESSIONS" | "MAGISTRATE" | "TRIBUNAL" | "UNKNOWN";
export type CaseOutcome = "ALLOWED" | "DISMISSED" | "BAIL_GRANTED" | "BAIL_REJECTED" | "ACQUITTED" | "CONVICTED" | "REMANDED" | "UNKNOWN";
export type ProcedureType = "CRIMINAL" | "CIVIL" | "CONSTITUTIONAL" | "REVENUE" | "UNKNOWN";

//  Court Level Mapping 

function inferCourtLevel(court: string): CourtLevel {
  const c = court.toLowerCase();
  if (c.includes("supreme")) return "SUPREME";
  if (c.includes("high court")) return "HIGH";
  if (c.includes("sessions")) return "SESSIONS";
  if (c.includes("magistrate")) return "MAGISTRATE";
  if (c.includes("tribunal") || c.includes("commission")) return "TRIBUNAL";
  return "UNKNOWN";
}

//  Outcome Detection 

const OUTCOME_PATTERNS: Array<{ pattern: RegExp; outcome: CaseOutcome }> = [
  { pattern: /\b(?:appeal\s+(?:is\s+)?allowed|petition\s+(?:is\s+)?allowed|allowed\s+accordingly)\b/i, outcome: "ALLOWED" },
  { pattern: /\b(?:appeal\s+(?:is\s+)?dismissed|petition\s+(?:is\s+)?dismissed|dismissed\s+accordingly)\b/i, outcome: "DISMISSED" },
  { pattern: /\b(?:bail\s+(?:is\s+)?granted|granted\s+bail|released\s+on\s+bail)\b/i, outcome: "BAIL_GRANTED" },
  { pattern: /\b(?:bail\s+(?:is\s+)?rejected|bail\s+(?:is\s+)?refused|bail\s+denied)\b/i, outcome: "BAIL_REJECTED" },
  { pattern: /\b(?:acquitted|acquittal|not\s+guilty|set\s+aside\s+conviction)\b/i, outcome: "ACQUITTED" },
  { pattern: /\b(?:convicted|conviction\s+upheld|found\s+guilty|sentenced)\b/i, outcome: "CONVICTED" },
  { pattern: /\b(?:remanded|matter\s+remanded|sent\s+back|remand)\b/i, outcome: "REMANDED" },
];

function detectOutcome(text: string): CaseOutcome {
  for (const { pattern, outcome } of OUTCOME_PATTERNS) {
    if (pattern.test(text)) return outcome;
  }
  return "UNKNOWN";
}

//  Procedure Type 

function detectProcedureType(
  ipcSections: string[],
  crpcSections: string[],
  text: string
): ProcedureType {
  if (ipcSections.length > 0 || crpcSections.length > 0) return "CRIMINAL";
  if (/\b(?:article\s+(?:32|226)|writ|fundamental\s+rights|constitution)\b/i.test(text)) return "CONSTITUTIONAL";
  if (/\b(?:civil\s+suit|plaint|decree|injunction|specific\s+performance)\b/i.test(text)) return "CIVIL";
  if (/\b(?:revenue|land\s+acquisition|mutation|khasra)\b/i.test(text)) return "REVENUE";
  return "UNKNOWN";
}

//  Key Term Extraction 

const LEGAL_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "has", "have", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "this", "that", "these", "those",
  "it", "its", "he", "she", "they", "we", "i", "you", "not", "no",
  "court", "case", "matter", "order", "judgment", "petition", "application",
]);

const LEGAL_BOOST_TERMS = new Set([
  "bail", "discharge", "quash", "evidence", "witness", "accused", "conviction",
  "acquittal", "sentence", "appeal", "revision", "writ", "habeas", "corpus",
  "negligence", "murder", "rape", "theft", "fraud", "corruption", "contempt",
  "jurisdiction", "cognizance", "chargesheet", "fir", "investigation",
  "confession", "dying declaration", "circumstantial", "direct evidence",
]);

function extractKeyTerms(text: string, maxTerms = 20): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !LEGAL_STOPWORDS.has(w));

  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + (LEGAL_BOOST_TERMS.has(w) ? 3 : 1));
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTerms)
    .map(([term]) => term);
}

//  Section Extraction 

const IPC_RE = /(?:(?:section|sec\.?)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC)/gi;
const CRPC_RE = /(?:(?:section|sec\.?)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC)/gi;
const OTHER_RE = /(?:section|sec\.?|article|art\.?)\s*(\d+[A-Z]?(?:\s*\(\d+\))?)\s*(?:of\s+)?(?:the\s+)?([A-Z][A-Za-z\s]+?(?:Act|Code|Constitution))/gi;

function extractSections(text: string) {
  const ipc: string[] = [], crpc: string[] = [], other: string[] = [];
  let m: RegExpExecArray | null;
  IPC_RE.lastIndex = 0;
  while ((m = IPC_RE.exec(text)) !== null) { const s = m[1].toUpperCase(); if (!ipc.includes(s)) ipc.push(s); }
  CRPC_RE.lastIndex = 0;
  while ((m = CRPC_RE.exec(text)) !== null) { const s = m[1].toUpperCase(); if (!crpc.includes(s)) crpc.push(s); }
  OTHER_RE.lastIndex = 0;
  while ((m = OTHER_RE.exec(text)) !== null) { const e = `${m[1]} of ${m[2].trim()}`; if (!other.includes(e)) other.push(e); }
  return { ipc, crpc, other };
}

//  Issue Detection 

const ISSUE_DETECTORS: Array<{ pattern: RegExp; issue: IssueCategory }> = [
  { pattern: /\b(?:bail|anticipatory bail)\b/i, issue: "BAIL" },
  { pattern: /\b(?:discharge|discharge petition)\b/i, issue: "DISCHARGE" },
  { pattern: /\b(?:quash|quashing|section 482)\b/i, issue: "QUASHING" },
  { pattern: /\b(?:evidence|admissibility|witness)\b/i, issue: "EVIDENCE" },
  { pattern: /\b(?:jurisdiction)\b/i, issue: "JURISDICTION" },
  { pattern: /\b(?:sentence|sentencing|punishment)\b/i, issue: "SENTENCING" },
  { pattern: /\b(?:appeal|revision|review)\b/i, issue: "APPEAL" },
  { pattern: /\b(?:fundamental rights|article 21|constitution)\b/i, issue: "CONSTITUTIONAL" },
  { pattern: /\b(?:writ|habeas corpus|mandamus)\b/i, issue: "CIVIL_RIGHTS" },
  { pattern: /\b(?:negligence|negligent|rash)\b/i, issue: "NEGLIGENCE" },
];

function detectIssues(text: string): IssueCategory[] {
  return ISSUE_DETECTORS.filter(({ pattern }) => pattern.test(text)).map(({ issue }) => issue);
}

//  Offence Extraction 

const OFFENCE_TERMS = [
  "murder", "homicide", "rape", "sexual assault", "theft", "robbery",
  "dacoity", "fraud", "cheating", "forgery", "extortion", "kidnapping",
  "abduction", "dowry harassment", "cruelty", "negligence", "corruption",
  "bribery", "defamation", "sedition", "rioting", "assault", "grievous hurt",
];

function extractOffences(text: string): string[] {
  const lower = text.toLowerCase();
  return OFFENCE_TERMS.filter(t => lower.includes(t));
}

//  Main Extractor 

export function extractCaseFeatures(
  caseId: string,
  title: string,
  court: string,
  year: number,
  text: string,
  citationCount = 0
): CaseFeatures {
  const sections = extractSections(text);
  const issues = detectIssues(text);
  const offences = extractOffences(text);
  const keyTerms = extractKeyTerms(text);
  const outcome = detectOutcome(text);
  const courtLevel = inferCourtLevel(court);
  const procedureType = detectProcedureType(sections.ipc, sections.crpc, text);

  return {
    caseId,
    title,
    court,
    courtLevel,
    year,
    judges: [],
    ipcSections: sections.ipc,
    crpcSections: sections.crpc,
    otherSections: sections.other,
    offences,
    issues,
    outcome,
    keyTerms,
    citationCount,
    hasConstitutionalIssue: issues.includes("CONSTITUTIONAL") || issues.includes("CIVIL_RIGHTS"),
    hasBailIssue: issues.includes("BAIL"),
    hasEvidenceIssue: issues.includes("EVIDENCE"),
    procedureType,
  };
}

/**
 * Compute Jaccard similarity between two string arrays
 */
export function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a.map(s => s.toLowerCase()));
  const setB = new Set(b.map(s => s.toLowerCase()));
  let intersection = 0;
  for (const item of setA) { if (setB.has(item)) intersection++; }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compute term frequency overlap between two key term lists
 */
export function termOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b.map(s => s.toLowerCase()));
  const matches = a.filter(t => setB.has(t.toLowerCase())).length;
  return matches / Math.max(a.length, b.length);
}