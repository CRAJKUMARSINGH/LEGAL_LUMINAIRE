/**
 * Citation Extraction Module
 * Extracts and validates legal citations from judgment text
 * Part of Phase 3: Citation Intelligence
 */

import { featureFlags } from "@/config/featureFlags";

//  Types 

export type CitationReporter =
  | "SCC"
  | "AIR"
  | "SCR"
  | "Cri LJ"
  | "SLT"
  | "SCALE"
  | "HC"
  | "UNKNOWN";

export interface ExtractedCitation {
  id: string;
  raw: string;
  caseName?: string;
  year: number;
  volume?: number;
  reporter: CitationReporter;
  page: number;
  paraNumber?: number;
  court?: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface CitationExtractionResult {
  citations: ExtractedCitation[];
  ipcSections: string[];
  crpcSections: string[];
  otherSections: string[];
  stats: CitationStats;
  errors: string[];
}

export interface CitationStats {
  total: number;
  byCourt: Record<string, number>;
  byReporter: Record<string, number>;
  byDecade: Record<string, number>;
  highConfidence: number;
  lowConfidence: number;
  duplicates: number;
}

//  Regex Patterns 

const CITATION_PATTERNS: Array<{
  pattern: RegExp;
  reporter: CitationReporter;
  confidence: number;
}> = [
  { pattern: /\((\d{4})\)\s*(\d+)\s*SCC\s*(\d+)/gi,   reporter: "SCC",    confidence: 0.95 },
  { pattern: /AIR\s*(\d{4})\s*SC\s*(\d+)/gi,           reporter: "AIR",    confidence: 0.92 },
  { pattern: /AIR\s*(\d{4})\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*(\d+)/gi, reporter: "AIR", confidence: 0.85 },
  { pattern: /\((\d{4})\)\s*(\d+)\s*SCR\s*(\d+)/gi,   reporter: "SCR",    confidence: 0.90 },
  { pattern: /(\d{4})\s*Cri(?:minal)?\s*LJ\s*(\d+)/gi, reporter: "Cri LJ", confidence: 0.88 },
  { pattern: /\((\d{4})\)\s*(\d+)\s*SCALE\s*(\d+)/gi, reporter: "SCALE",  confidence: 0.87 },
  { pattern: /\((\d{4})\)\s*(?:\d+\s*)?SLT\s*(\d+)/gi, reporter: "SLT",   confidence: 0.82 },
];

const CASE_NAME_PATTERN =
  /([A-Z][A-Za-z\s&.,'()-]{5,80}?)\s+(?:v\.?s?\.?|versus)\s+([A-Z][A-Za-z\s&.,'()-]{3,60}?)(?=\s*[\[(]?\d{4})/g;

const PARA_PATTERN = /(?:para(?:graph)?\.?\s*|\s*)(\d+)/gi;

const IPC_PATTERN =
  /(?:(?:section|sec\.?|s\.)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC)/gi;

const CRPC_PATTERN =
  /(?:(?:section|sec\.?|s\.)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC)/gi;

const OTHER_SECTION_PATTERN =
  /(?:section|sec\.?|article|art\.?)\s*(\d+[A-Z]?(?:\s*\(\d+\))?)\s*(?:of\s+)?(?:the\s+)?([A-Z][A-Za-z\s]+?(?:Act|Code|Constitution))/gi;

//  Helpers 

function generateCitationId(year: number, reporter: string, page: number): string {
  return `${reporter.replace(/\s+/g, "_")}_${year}_${page}`;
}

function extractCaseName(text: string, matchStart: number): string | undefined {
  const lookback = text.slice(Math.max(0, matchStart - 120), matchStart);
  const matches = [...lookback.matchAll(CASE_NAME_PATTERN)];
  if (matches.length === 0) return undefined;
  const last = matches[matches.length - 1];
  return `${last[1].trim()} v. ${last[2].trim()}`;
}

function extractParaNumber(text: string, matchStart: number, matchEnd: number): number | undefined {
  const window = text.slice(Math.max(0, matchStart - 60), Math.min(text.length, matchEnd + 60));
  const match = PARA_PATTERN.exec(window);
  PARA_PATTERN.lastIndex = 0;
  return match ? parseInt(match[1], 10) : undefined;
}

function inferCourt(reporter: CitationReporter, raw: string): string | undefined {
  if (["SCC", "SCR", "SCALE", "SLT"].includes(reporter)) return "Supreme Court of India";
  if (reporter === "AIR") {
    if (/AIR\s*\d{4}\s*SC\b/i.test(raw)) return "Supreme Court of India";
    const hcMatch = /AIR\s*\d{4}\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*\d/i.exec(raw);
    if (hcMatch) return `${hcMatch[1]} High Court`;
  }
  return undefined;
}

//  Main Extraction 

export function extractCitations(text: string): CitationExtractionResult {
  if (!featureFlags.enableCitationExtraction) {
    return {
      citations: [],
      ipcSections: [],
      crpcSections: [],
      otherSections: [],
      stats: buildStats([]),
      errors: ["Citation extraction feature flag is disabled"],
    };
  }

  const citations: ExtractedCitation[] = [];
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const { pattern, reporter, confidence } of CITATION_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      try {
        let year: number, volume: number | undefined, page: number;
        if (reporter === "AIR") {
          year = parseInt(match[1], 10);
          page = parseInt(match[match.length - 1], 10);
        } else if (reporter === "Cri LJ") {
          year = parseInt(match[1], 10);
          page = parseInt(match[2], 10);
        } else {
          year = parseInt(match[1], 10);
          if (match[3]) { volume = parseInt(match[2], 10); page = parseInt(match[3], 10); }
          else { page = parseInt(match[2], 10); }
        }
        if (isNaN(year) || isNaN(page)) continue;
        if (year < 1947 || year > new Date().getFullYear() + 1) continue;

        const id = generateCitationId(year, reporter, page);
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        citations.push({
          id,
          raw: match[0],
          caseName: extractCaseName(text, match.index),
          year,
          volume,
          reporter,
          page,
          paraNumber: extractParaNumber(text, match.index, match.index + match[0].length),
          court: inferCourt(reporter, match[0]),
          confidence,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      } catch {
        errors.push(`Failed to parse citation: ${match[0]}`);
      }
    }
  }

  // IPC sections
  const ipcSections: string[] = [];
  IPC_PATTERN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = IPC_PATTERN.exec(text)) !== null) {
    const s = m[1].toUpperCase();
    if (!ipcSections.includes(s)) ipcSections.push(s);
  }

  // CrPC sections
  const crpcSections: string[] = [];
  CRPC_PATTERN.lastIndex = 0;
  while ((m = CRPC_PATTERN.exec(text)) !== null) {
    const s = m[1].toUpperCase();
    if (!crpcSections.includes(s)) crpcSections.push(s);
  }

  // Other sections
  const otherSections: string[] = [];
  OTHER_SECTION_PATTERN.lastIndex = 0;
  while ((m = OTHER_SECTION_PATTERN.exec(text)) !== null) {
    const entry = `${m[1]} of ${m[2].trim()}`;
    if (!otherSections.includes(entry)) otherSections.push(entry);
  }

  citations.sort((a, b) => a.startIndex - b.startIndex);

  return { citations, ipcSections, crpcSections, otherSections, stats: buildStats(citations), errors };
}

//  Stats 

function buildStats(citations: ExtractedCitation[]): CitationStats {
  const byCourt: Record<string, number> = {};
  const byReporter: Record<string, number> = {};
  const byDecade: Record<string, number> = {};
  let highConfidence = 0, lowConfidence = 0;

  for (const c of citations) {
    const court = c.court ?? "Unknown";
    byCourt[court] = (byCourt[court] ?? 0) + 1;
    byReporter[c.reporter] = (byReporter[c.reporter] ?? 0) + 1;
    const decade = `${Math.floor(c.year / 10) * 10}s`;
    byDecade[decade] = (byDecade[decade] ?? 0) + 1;
    if (c.confidence >= 0.8) highConfidence++;
    if (c.confidence < 0.5) lowConfidence++;
  }

  return { total: citations.length, byCourt, byReporter, byDecade, highConfidence, lowConfidence, duplicates: 0 };
}

//  Utilities 

export function validateCitation(citation: ExtractedCitation): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!citation.caseName) issues.push("Missing case name");
  if (!citation.paraNumber) issues.push("Missing paragraph number");
  if (!citation.court) issues.push("Court could not be inferred");
  if (citation.confidence < 0.7) issues.push("Low extraction confidence");
  if (citation.year < 1950) issues.push("Unusually old citation — verify manually");
  return { valid: issues.length === 0, issues };
}

export function formatCitation(citation: ExtractedCitation): string {
  const parts: string[] = [];
  if (citation.caseName) parts.push(citation.caseName);
  parts.push(`(${citation.year})`);
  if (citation.volume) parts.push(`${citation.volume}`);
  parts.push(citation.reporter);
  parts.push(`${citation.page}`);
  if (citation.paraNumber) parts.push(`, Para ${citation.paraNumber}`);
  return parts.join(" ");
}

export function deduplicateCitations(citations: ExtractedCitation[]): ExtractedCitation[] {
  const seen = new Set<string>();
  return citations.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
}
