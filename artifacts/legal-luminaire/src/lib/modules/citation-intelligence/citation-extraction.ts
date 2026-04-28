/**
 * Citation Extraction Module
 * Extracts and parses legal citations from judgments and documents
 * Part of Phase 3: Citation Intelligence
 */

import { featureFlags } from "@/config/featureFlags";

/**
 * Extracted citation data
 */
export interface ExtractedCitation {
  id: string;
  caseTitle: string;
  citation: string;
  court: string;
  year: number;
  volume?: string;
  reporter?: string;
  page?: number;
  paragraphNumber?: number;
  sourceUrl?: string;
  confidence: number; // 0-1
  rawText: string;
  position: {
    start: number;
    end: number;
  };
}

/**
 * Citation patterns for Indian legal system
 */
const CITATION_PATTERNS = {
  // SCC (Supreme Court Cases)
  scc: /\((\d{4})\)\s+(\d+)\s+SCC\s+(\d+)/gi,
  
  // AIR (All India Reporter)
  air: /\((\d{4})\)\s+(\d+)\s+AIR\s+(\d+)/gi,
  
  // SCR (Supreme Court Reports)
  scr: /\((\d{4})\)\s+(\d+)\s+SCR\s+(\d+)/gi,
  
  // High Court Reports
  hcr: /\((\d{4})\)\s+(\d+)\s+(?:HC|High Court)\s+(\d+)/gi,
  
  // Case name with citation
  caseWithCitation: /([A-Z][A-Za-z\s&,\.]+?)\s+(?:v\.?|vs\.?|versus)\s+([A-Z][A-Za-z\s&,\.]+?)\s*,?\s*\((\d{4})\)\s+(\d+)\s+([A-Z]+)\s+(\d+)/gi,
  
  // Section references
  section: /(?:Section|Sec\.?|S\.)\s+(\d+[A-Z]?)\s+(?:of\s+)?(?:the\s+)?([A-Z][A-Za-z\s]+?)(?:\s+Act)?/gi,
  
  // IPC sections
  ipc: /(?:IPC|Indian Penal Code)\s+(?:Section|Sec\.?|S\.)\s+(\d+[A-Z]?)/gi,
  
  // CrPC sections
  crpc: /(?:CrPC|Cr\.?P\.?C\.?)\s+(?:Section|Sec\.?|S\.)\s+(\d+[A-Z]?)/gi,
};

/**
 * Court name mappings
 */
const COURT_MAPPINGS: Record<string, string> = {
  "SC": "Supreme Court",
  "SCC": "Supreme Court",
  "AIR": "All India Reporter",
  "SCR": "Supreme Court Reports",
  "HC": "High Court",
  "DHC": "Delhi High Court",
  "BHC": "Bombay High Court",
  "MHC": "Madras High Court",
  "CHC": "Calcutta High Court",
  "PHC": "Punjab High Court",
};

/**
 * Extract all citations from text
 */
export function extractCitations(text: string): ExtractedCitation[] {
  if (!featureFlags.enableCitationExtraction) {
    return [];
  }
  
  const citations: ExtractedCitation[] = [];
  const processedRanges = new Set<string>();
  
  // Extract case citations with full details
  const caseMatches = text.matchAll(CITATION_PATTERNS.caseWithCitation);
  for (const match of caseMatches) {
    const [fullMatch, petitioner, respondent, year, volume, reporter, page] = match;
    const position = match.index || 0;
    const rangeKey = `${position}-${position + fullMatch.length}`;
    
    if (processedRanges.has(rangeKey)) continue;
    processedRanges.add(rangeKey);
    
    citations.push({
      id: generateCitationId(),
      caseTitle: `${petitioner} v. ${respondent}`,
      citation: `(${year}) ${volume} ${reporter} ${page}`,
      court: COURT_MAPPINGS[reporter] || reporter,
      year: parseInt(year),
      volume,
      reporter,
      page: parseInt(page),
      confidence: 0.95,
      rawText: fullMatch,
      position: { start: position, end: position + fullMatch.length },
    });
  }
  
  // Extract SCC citations
  const sccMatches = text.matchAll(CITATION_PATTERNS.scc);
  for (const match of sccMatches) {
    const [fullMatch, year, volume, page] = match;
    const position = match.index || 0;
    const rangeKey = `${position}-${position + fullMatch.length}`;
    
    if (processedRanges.has(rangeKey)) continue;
    processedRanges.add(rangeKey);
    
    citations.push({
      id: generateCitationId(),
      caseTitle: extractCaseTitleNearPosition(text, position),
      citation: `(${year}) ${volume} SCC ${page}`,
      court: "Supreme Court",
      year: parseInt(year),
      volume,
      reporter: "SCC",
      page: parseInt(page),
      confidence: 0.90,
      rawText: fullMatch,
      position: { start: position, end: position + fullMatch.length },
    });
  }
  
  // Extract AIR citations
  const airMatches = text.matchAll(CITATION_PATTERNS.air);
  for (const match of airMatches) {
    const [fullMatch, year, volume, page] = match;
    const position = match.index || 0;
    const rangeKey = `${position}-${position + fullMatch.length}`;
    
    if (processedRanges.has(rangeKey)) continue;
    processedRanges.add(rangeKey);
    
    citations.push({
      id: generateCitationId(),
      caseTitle: extractCaseTitleNearPosition(text, position),
      citation: `(${year}) ${volume} AIR ${page}`,
      court: "All India Reporter",
      year: parseInt(year),
      volume,
      reporter: "AIR",
      page: parseInt(page),
      confidence: 0.90,
      rawText: fullMatch,
      position: { start: position, end: position + fullMatch.length },
    });
  }
  
  return citations.sort((a, b) => a.position.start - b.position.start);
}

/**
 * Extract section references from text
 */
export function extractSections(text: string): Array<{
  section: string;
  act: string;
  confidence: number;
  rawText: string;
}> {
  if (!featureFlags.enableCitationExtraction) {
    return [];
  }
  
  const sections: Array<{
    section: string;
    act: string;
    confidence: number;
    rawText: string;
  }> = [];
  
  // Extract IPC sections
  const ipcMatches = text.matchAll(CITATION_PATTERNS.ipc);
  for (const match of ipcMatches) {
    const [fullMatch, section] = match;
    sections.push({
      section: `IPC ${section}`,
      act: "Indian Penal Code",
      confidence: 0.95,
      rawText: fullMatch,
    });
  }
  
  // Extract CrPC sections
  const crpcMatches = text.matchAll(CITATION_PATTERNS.crpc);
  for (const match of crpcMatches) {
    const [fullMatch, section] = match;
    sections.push({
      section: `CrPC ${section}`,
      act: "Code of Criminal Procedure",
      confidence: 0.95,
      rawText: fullMatch,
    });
  }
  
  // Extract general sections
  const sectionMatches = text.matchAll(CITATION_PATTERNS.section);
  for (const match of sectionMatches) {
    const [fullMatch, section, act] = match;
    
    // Skip if already captured as IPC/CrPC
    if (sections.some(s => s.rawText === fullMatch)) continue;
    
    sections.push({
      section: `${section}`,
      act: act.trim(),
      confidence: 0.80,
      rawText: fullMatch,
    });
  }
  
  return sections;
}

/**
 * Validate citation format
 */
export function validateCitation(citation: ExtractedCitation): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check year
  if (citation.year < 1950 || citation.year > new Date().getFullYear()) {
    errors.push(`Invalid year: ${citation.year}`);
  }
  
  // Check volume
  if (citation.volume && isNaN(parseInt(citation.volume))) {
    errors.push(`Invalid volume: ${citation.volume}`);
  }
  
  // Check page
  if (citation.page && citation.page < 1) {
    errors.push(`Invalid page: ${citation.page}`);
  }
  
  // Check case title
  if (!citation.caseTitle || citation.caseTitle.length < 3) {
    errors.push("Case title too short or missing");
  }
  
  // Check court
  if (!citation.court || citation.court.length < 3) {
    errors.push("Court name too short or missing");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format citation for display
 */
export function formatCitation(citation: ExtractedCitation): string {
  const parts: string[] = [];
  
  if (citation.caseTitle) {
    parts.push(citation.caseTitle);
  }
  
  if (citation.citation) {
    parts.push(citation.citation);
  }
  
  if (citation.paragraphNumber) {
    parts.push(`Para ${citation.paragraphNumber}`);
  }
  
  return parts.join(", ");
}

/**
 * Parse citation string to extract components
 */
export function parseCitationString(citationStr: string): {
  year?: number;
  volume?: string;
  reporter?: string;
  page?: number;
} {
  const result: {
    year?: number;
    volume?: string;
    reporter?: string;
    page?: number;
  } = {};
  
  // Match pattern: (YYYY) VV REPORTER PP
  const match = citationStr.match(/\((\d{4})\)\s+(\d+)\s+([A-Z]+)\s+(\d+)/);
  if (match) {
    result.year = parseInt(match[1]);
    result.volume = match[2];
    result.reporter = match[3];
    result.page = parseInt(match[4]);
  }
  
  return result;
}

/**
 * Extract case title near a position in text
 */
function extractCaseTitleNearPosition(text: string, position: number): string {
  const startPos = Math.max(0, position - 200);
  const endPos = Math.min(text.length, position + 200);
  const context = text.substring(startPos, endPos);
  
  // Look for "v." or "vs." pattern
  const match = context.match(/([A-Z][A-Za-z\s&,\.]+?)\s+(?:v\.?|vs\.?)\s+([A-Z][A-Za-z\s&,\.]+?)/);
  if (match) {
    return `${match[1].trim()} v. ${match[2].trim()}`;
  }
  
  return "Unknown Case";
}

/**
 * Generate unique citation ID
 */
function generateCitationId(): string {
  return `cit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deduplicate citations
 */
export function deduplicateCitations(citations: ExtractedCitation[]): ExtractedCitation[] {
  const seen = new Map<string, ExtractedCitation>();
  
  for (const citation of citations) {
    const key = `${citation.caseTitle}|${citation.citation}`;
    
    if (!seen.has(key)) {
      seen.set(key, citation);
    } else {
      // Keep the one with higher confidence
      const existing = seen.get(key)!;
      if (citation.confidence > existing.confidence) {
        seen.set(key, citation);
      }
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Get citation statistics
 */
export function getCitationStatistics(citations: ExtractedCitation[]): {
  totalCitations: number;
  byReporter: Record<string, number>;
  byYear: Record<number, number>;
  byCourt: Record<string, number>;
  avgConfidence: number;
  highConfidenceCitations: number;
} {
  const byReporter = new Map<string, number>();
  const byYear = new Map<number, number>();
  const byCourt = new Map<string, number>();
  let totalConfidence = 0;
  let highConfidenceCount = 0;
  
  for (const citation of citations) {
    // By reporter
    if (citation.reporter) {
      byReporter.set(citation.reporter, (byReporter.get(citation.reporter) || 0) + 1);
    }
    
    // By year
    byYear.set(citation.year, (byYear.get(citation.year) || 0) + 1);
    
    // By court
    byCourt.set(citation.court, (byCourt.get(citation.court) || 0) + 1);
    
    // Confidence
    totalConfidence += citation.confidence;
    if (citation.confidence >= 0.90) {
      highConfidenceCount++;
    }
  }
  
  return {
    totalCitations: citations.length,
    byReporter: Object.fromEntries(byReporter),
    byYear: Object.fromEntries(byYear),
    byCourt: Object.fromEntries(byCourt),
    avgConfidence: citations.length > 0 ? totalConfidence / citations.length : 0,
    highConfidenceCitations: highConfidenceCount,
  };
}
