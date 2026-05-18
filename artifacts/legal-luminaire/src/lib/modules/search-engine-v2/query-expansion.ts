/**
 * Legal Query Expansion Module
 * Expands legal queries with synonyms, related terms, and legal terminology
 * Part of Phase 2: Search Engine V2
 */

import { featureFlags } from "@/config/featureFlags";

/**
 * Legal terminology mappings for Indian law
 */
export const LEGAL_SYNONYMS: Record<string, string[]> = {
  // Criminal Law
  bail: ["anticipatory bail", "regular bail", "interim bail", "bail bond", "surety"],
  discharge: ["discharge petition", "discharge application", "section 482", "quashing"],
  acquittal: ["acquitted", "exonerated", "discharged", "not guilty"],
  conviction: ["convicted", "guilty", "sentenced"],
  murder: ["IPC 302", "section 302", "homicide", "culpable homicide", "killing"],
  
  // Procedural Terms
  writ: ["writ petition", "habeas corpus", "mandamus", "certiorari", "prohibition", "quo warranto"],
  fir: ["first information report", "police complaint", "cognizance", "FIR"],
  chargesheet: ["charge sheet", "final report", "police report", "challan"],
  
  // Evidence
  evidence: ["testimony", "documentary evidence", "material evidence", "oral evidence", "witness"],
  witness: ["testimony", "deposition", "statement", "evidence"],
  
  // Jurisdiction
  jurisdiction: ["territorial jurisdiction", "pecuniary jurisdiction", "subject matter jurisdiction"],
  
  // Legal Authority
  precedent: ["case law", "judgment", "ruling", "decision", "authority", "ratio decidendi"],
  statute: ["act", "law", "legislation", "section", "provision", "enactment"],
  
  // Courts
  court: ["high court", "sessions court", "magistrate", "tribunal", "supreme court"],
  "supreme court": ["SC", "apex court", "highest court"],
  "high court": ["HC", "state high court"],
  
  // Construction/Infrastructure (for specific cases)
  collapse: ["collapsed", "fell", "failure", "failed", "crash", "structural failure"],
  negligence: ["negligent", "negligently", "rash", "careless", "breach of duty"],
  contractor: ["contractors", "builder", "executing agency", "construction company"],
  
  // Common Legal Terms
  appeal: ["appellate", "revision", "review", "challenge"],
  petition: ["application", "plea", "prayer", "suit"],
  defendant: ["accused", "respondent", "opposite party"],
  plaintiff: ["petitioner", "complainant", "applicant"],
};

/**
 * IPC Section mappings
 */
export const IPC_SECTION_MAPPINGS: Record<string, string[]> = {
  "302": ["murder", "homicide", "killing", "death penalty"],
  "304": ["culpable homicide", "not amounting to murder"],
  "304A": ["causing death by negligence", "rash act", "negligent act"],
  "307": ["attempt to murder", "attempted murder"],
  "376": ["rape", "sexual assault"],
  "420": ["cheating", "fraud", "dishonesty"],
  "498A": ["cruelty", "dowry harassment", "matrimonial cruelty"],
};

/**
 * CrPC Section mappings
 */
export const CRPC_SECTION_MAPPINGS: Record<string, string[]> = {
  "154": ["FIR", "first information report", "police complaint"],
  "156": ["police investigation", "cognizance"],
  "161": ["police statement", "examination by police"],
  "173": ["police report", "investigation report"],
  "482": ["quashing", "inherent powers", "high court powers"],
  "437": ["bail", "bailable offence"],
  "438": ["anticipatory bail", "pre-arrest bail"],
};

/**
 * Court name normalization
 */
export const COURT_ALIASES: Record<string, string[]> = {
  "Supreme Court": ["SC", "Supreme Court of India", "Apex Court", "SCI"],
  "Delhi High Court": ["DHC", "Delhi HC", "High Court of Delhi"],
  "Bombay High Court": ["BHC", "Bombay HC", "Mumbai High Court"],
  "Calcutta High Court": ["CHC", "Calcutta HC", "Kolkata High Court"],
  "Madras High Court": ["MHC", "Madras HC", "Chennai High Court"],
};

/**
 * Stopwords to exclude from expansion
 */
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
  "he", "in", "is", "it", "its", "of", "on", "or", "that", "the", "to", "was",
  "were", "will", "with", "this", "these", "those", "there", "their", "them",
  "they", "i", "we", "you", "but", "not", "no", "do", "did", "does",
]);

/**
 * Tokenize text for query expansion
 */
export function tokenize(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  if (!cleaned) return [];
  
  return cleaned
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

/**
 * Extract IPC sections from query
 */
export function extractIPCSections(query: string): string[] {
  const sections: string[] = [];
  
  // Match patterns like "IPC 302", "Section 302", "302 IPC", "Sec 302"
  const patterns = [
    /(?:ipc|section|sec\.?)\s*(\d+[a-z]?)/gi,
    /(\d+[a-z]?)\s*(?:ipc|of\s+ipc)/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = query.matchAll(pattern);
    for (const match of matches) {
      sections.push(match[1].toUpperCase());
    }
  }
  
  return [...new Set(sections)];
}

/**
 * Extract CrPC sections from query
 */
export function extractCrPCSections(query: string): string[] {
  const sections: string[] = [];
  
  // Match patterns like "CrPC 482", "Section 482 CrPC"
  const patterns = [
    /(?:crpc|cr\.?p\.?c\.?|section)\s*(\d+[a-z]?)/gi,
    /(\d+[a-z]?)\s*(?:crpc|cr\.?p\.?c\.?)/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = query.matchAll(pattern);
    for (const match of matches) {
      sections.push(match[1]);
    }
  }
  
  return [...new Set(sections)];
}

/**
 * Expand query with legal synonyms and related terms
 */
export function expandQuery(query: string): {
  originalQuery: string;
  expandedQuery: string;
  tokens: string[];
  expandedTokens: string[];
  ipcSections: string[];
  crpcSections: string[];
  synonymsUsed: Record<string, string[]>;
} {
  if (!featureFlags.enableQueryExpansion) {
    return {
      originalQuery: query,
      expandedQuery: query,
      tokens: tokenize(query),
      expandedTokens: tokenize(query),
      ipcSections: [],
      crpcSections: [],
      synonymsUsed: {},
    };
  }
  
  const tokens = tokenize(query);
  const expandedTerms = new Set<string>(tokens);
  const synonymsUsed: Record<string, string[]> = {};
  
  // Extract sections
  const ipcSections = extractIPCSections(query);
  const crpcSections = extractCrPCSections(query);
  
  // Add section-based expansions
  for (const section of ipcSections) {
    const mappings = IPC_SECTION_MAPPINGS[section];
    if (mappings) {
      mappings.forEach(term => expandedTerms.add(term));
      synonymsUsed[`IPC ${section}`] = mappings;
    }
  }
  
  for (const section of crpcSections) {
    const mappings = CRPC_SECTION_MAPPINGS[section];
    if (mappings) {
      mappings.forEach(term => expandedTerms.add(term));
      synonymsUsed[`CrPC ${section}`] = mappings;
    }
  }
  
  // Add synonym-based expansions
  for (const token of tokens) {
    const synonyms = LEGAL_SYNONYMS[token];
    if (synonyms) {
      synonyms.forEach(syn => expandedTerms.add(syn));
      synonymsUsed[token] = synonyms;
    }
  }
  
  // Check for court names and add aliases
  const queryLower = query.toLowerCase();
  for (const [court, aliases] of Object.entries(COURT_ALIASES)) {
    if (queryLower.includes(court.toLowerCase())) {
      aliases.forEach(alias => expandedTerms.add(alias.toLowerCase()));
      synonymsUsed[court] = aliases;
    }
  }
  
  const expandedTokens = Array.from(expandedTerms);
  const expandedQuery = expandedTokens.join(" ");
  
  return {
    originalQuery: query,
    expandedQuery,
    tokens,
    expandedTokens,
    ipcSections,
    crpcSections,
    synonymsUsed,
  };
}

/**
 * Calculate query complexity score
 * Higher score = more complex query requiring more sophisticated search
 */
export function calculateQueryComplexity(query: string): {
  score: number;
  factors: {
    length: number;
    legalTerms: number;
    sections: number;
    courts: number;
    operators: number;
  };
} {
  const tokens = tokenize(query);
  const ipcSections = extractIPCSections(query);
  const crpcSections = extractCrPCSections(query);
  
  let legalTermCount = 0;
  for (const token of tokens) {
    if (LEGAL_SYNONYMS[token]) {
      legalTermCount++;
    }
  }
  
  let courtCount = 0;
  const queryLower = query.toLowerCase();
  for (const court of Object.keys(COURT_ALIASES)) {
    if (queryLower.includes(court.toLowerCase())) {
      courtCount++;
    }
  }
  
  // Check for boolean operators
  const operators = (query.match(/\b(AND|OR|NOT)\b/gi) || []).length;
  
  const factors = {
    length: tokens.length,
    legalTerms: legalTermCount,
    sections: ipcSections.length + crpcSections.length,
    courts: courtCount,
    operators,
  };
  
  // Calculate complexity score (0-100)
  const score = Math.min(100, 
    (factors.length * 2) +
    (factors.legalTerms * 10) +
    (factors.sections * 15) +
    (factors.courts * 10) +
    (factors.operators * 5)
  );
  
  return { score, factors };
}

/**
 * Suggest query improvements
 */
export function suggestQueryImprovements(query: string): string[] {
  const suggestions: string[] = [];
  const complexity = calculateQueryComplexity(query);
  
  if (complexity.factors.length < 3) {
    suggestions.push("Try adding more specific terms to narrow your search");
  }
  
  if (complexity.factors.sections === 0 && query.toLowerCase().includes("section")) {
    suggestions.push("Specify the section number (e.g., 'Section 302 IPC')");
  }
  
  if (complexity.factors.courts === 0 && query.toLowerCase().includes("court")) {
    suggestions.push("Specify which court (e.g., 'Supreme Court', 'Delhi High Court')");
  }
  
  const tokens = tokenize(query);
  const hasLegalTerms = tokens.some(token => LEGAL_SYNONYMS[token]);
  if (!hasLegalTerms && tokens.length > 0) {
    suggestions.push("Consider using legal terminology for better results");
  }
  
  return suggestions;
}

/**
 * Format expanded query for display
 */
export function formatExpandedQuery(expansion: ReturnType<typeof expandQuery>): string {
  const parts: string[] = [expansion.originalQuery];
  
  if (expansion.ipcSections.length > 0) {
    parts.push(`IPC Sections: ${expansion.ipcSections.join(", ")}`);
  }
  
  if (expansion.crpcSections.length > 0) {
    parts.push(`CrPC Sections: ${expansion.crpcSections.join(", ")}`);
  }
  
  const synonymCount = Object.keys(expansion.synonymsUsed).length;
  if (synonymCount > 0) {
    parts.push(`+${synonymCount} related terms`);
  }
  
  return parts.join(" | ");
}
