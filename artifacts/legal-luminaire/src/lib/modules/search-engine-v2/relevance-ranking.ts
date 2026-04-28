/**
 * Enhanced Relevance Ranking Module
 * Multi-factor ranking combining semantic, legal, and citation factors
 * Part of Phase 2: Search Engine V2
 */

import { featureFlags } from "@/config/featureFlags";

/**
 * Search result with enhanced scoring
 */
export interface RankedResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  
  // Individual scores
  semanticScore: number;      // Embedding similarity (0-1)
  keywordScore: number;        // BM25/TF-IDF score (0-1)
  legalRelevanceScore: number; // Legal term matching (0-1)
  citationScore: number;       // Citation strength (0-1)
  courtScore: number;          // Court hierarchy relevance (0-1)
  recencyScore: number;        // Time-based relevance (0-1)
  
  // Combined score
  finalScore: number;          // Weighted combination (0-1)
  rank: number;                // Final ranking position
  
  // Explanation
  matchedTerms: string[];
  matchedSections: string[];
  matchedCourts: string[];
  explanation: string[];
}

/**
 * Ranking weights configuration
 */
export interface RankingWeights {
  semantic: number;
  keyword: number;
  legalRelevance: number;
  citation: number;
  court: number;
  recency: number;
}

/**
 * Default ranking weights
 */
export const DEFAULT_WEIGHTS: RankingWeights = {
  semantic: 0.30,      // 30% - Semantic similarity
  keyword: 0.25,       // 25% - Keyword matching
  legalRelevance: 0.20, // 20% - Legal term relevance
  citation: 0.15,      // 15% - Citation strength
  court: 0.07,         // 7% - Court hierarchy
  recency: 0.03,       // 3% - Recency
};

/**
 * Court hierarchy levels (higher = more authoritative)
 */
export const COURT_HIERARCHY: Record<string, number> = {
  "Supreme Court": 1.0,
  "Supreme Court of India": 1.0,
  "High Court": 0.8,
  "District Court": 0.6,
  "Sessions Court": 0.6,
  "Magistrate Court": 0.4,
  "Tribunal": 0.5,
  "Unknown": 0.3,
};

/**
 * Legal term importance weights
 */
export const LEGAL_TERM_WEIGHTS: Record<string, number> = {
  // Statutory sections (highest weight)
  "IPC": 1.0,
  "CrPC": 1.0,
  "BNS": 1.0,
  "Section": 0.9,
  
  // Case law terms
  "precedent": 0.8,
  "ratio decidendi": 0.9,
  "obiter dicta": 0.7,
  "stare decisis": 0.8,
  
  // Procedural terms
  "writ": 0.8,
  "petition": 0.7,
  "appeal": 0.7,
  "revision": 0.7,
  
  // Evidence terms
  "evidence": 0.7,
  "testimony": 0.6,
  "witness": 0.6,
  
  // Criminal law terms
  "bail": 0.8,
  "discharge": 0.8,
  "acquittal": 0.8,
  "conviction": 0.8,
  
  // Default
  "default": 0.5,
};

/**
 * Normalize score to 0-1 range
 */
function normalizeScore(score: number, min: number = 0, max: number = 1): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (score - min) / (max - min)));
}

/**
 * Calculate legal relevance score based on matched legal terms
 */
export function calculateLegalRelevanceScore(
  content: string,
  query: string,
  matchedTerms: string[]
): number {
  if (!featureFlags.enableEnhancedRanking) {
    return 0;
  }
  
  const contentLower = content.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let score = 0;
  let termCount = 0;
  
  // Check for IPC/CrPC sections
  const sectionMatches = content.match(/(?:IPC|CrPC|BNS|Section)\s+\d+[A-Z]?/gi) || [];
  score += sectionMatches.length * 0.15;
  
  // Check for legal terms
  for (const [term, weight] of Object.entries(LEGAL_TERM_WEIGHTS)) {
    if (term === "default") continue;
    
    if (contentLower.includes(term.toLowerCase())) {
      score += weight * 0.1;
      termCount++;
    }
  }
  
  // Boost if query terms are legal terms
  for (const matchedTerm of matchedTerms) {
    const weight = LEGAL_TERM_WEIGHTS[matchedTerm] || LEGAL_TERM_WEIGHTS["default"];
    score += weight * 0.05;
  }
  
  // Normalize to 0-1
  return normalizeScore(score, 0, 2);
}

/**
 * Calculate citation score based on citation count and quality
 */
export function calculateCitationScore(
  citationCount: number = 0,
  citedBySC: number = 0,
  citedByHC: number = 0
): number {
  if (!featureFlags.enableEnhancedRanking) {
    return 0;
  }
  
  // Weight citations by court hierarchy
  const weightedCitations = 
    (citedBySC * 1.0) +
    (citedByHC * 0.7) +
    ((citationCount - citedBySC - citedByHC) * 0.4);
  
  // Logarithmic scaling to prevent dominance by highly cited cases
  const score = Math.log10(weightedCitations + 1) / Math.log10(101); // Max ~100 citations
  
  return normalizeScore(score, 0, 1);
}

/**
 * Calculate court hierarchy score
 */
export function calculateCourtScore(court: string): number {
  if (!featureFlags.enableEnhancedRanking) {
    return 0;
  }
  
  const courtLower = court.toLowerCase();
  
  for (const [courtName, score] of Object.entries(COURT_HIERARCHY)) {
    if (courtLower.includes(courtName.toLowerCase())) {
      return score;
    }
  }
  
  return COURT_HIERARCHY["Unknown"];
}

/**
 * Calculate recency score based on date
 */
export function calculateRecencyScore(date: string | Date | null): number {
  if (!featureFlags.enableEnhancedRanking || !date) {
    return 0.5; // Neutral score if no date
  }
  
  try {
    const caseDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const ageInYears = (now.getTime() - caseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    // Exponential decay: newer cases get higher scores
    // Half-life of 5 years
    const score = Math.exp(-ageInYears / 5);
    
    return normalizeScore(score, 0, 1);
  } catch (error) {
    return 0.5; // Neutral score on error
  }
}

/**
 * Extract matched sections from content
 */
export function extractMatchedSections(content: string, query: string): string[] {
  const sections = new Set<string>();
  
  // Extract from content
  const contentMatches = content.matchAll(/(?:IPC|CrPC|BNS|Section)\s+(\d+[A-Z]?)/gi);
  for (const match of contentMatches) {
    sections.add(match[0]);
  }
  
  // Extract from query
  const queryMatches = query.matchAll(/(?:IPC|CrPC|BNS|Section)\s+(\d+[A-Z]?)/gi);
  const querySections = new Set<string>();
  for (const match of queryMatches) {
    querySections.add(match[1].toUpperCase());
  }
  
  // Return only sections that appear in both
  return Array.from(sections).filter(section => {
    const sectionNum = section.match(/\d+[A-Z]?/)?.[0];
    return sectionNum && querySections.has(sectionNum);
  });
}

/**
 * Extract matched courts from content
 */
export function extractMatchedCourts(content: string): string[] {
  const courts = new Set<string>();
  const contentLower = content.toLowerCase();
  
  for (const courtName of Object.keys(COURT_HIERARCHY)) {
    if (contentLower.includes(courtName.toLowerCase())) {
      courts.add(courtName);
    }
  }
  
  return Array.from(courts);
}

/**
 * Generate explanation for ranking
 */
export function generateRankingExplanation(result: RankedResult): string[] {
  const explanations: string[] = [];
  
  if (result.semanticScore > 0.7) {
    explanations.push(`High semantic similarity (${(result.semanticScore * 100).toFixed(0)}%)`);
  }
  
  if (result.keywordScore > 0.7) {
    explanations.push(`Strong keyword match (${(result.keywordScore * 100).toFixed(0)}%)`);
  }
  
  if (result.matchedSections.length > 0) {
    explanations.push(`Matches sections: ${result.matchedSections.join(", ")}`);
  }
  
  if (result.matchedCourts.length > 0) {
    explanations.push(`From ${result.matchedCourts.join(", ")}`);
  }
  
  if (result.citationScore > 0.5) {
    explanations.push(`Frequently cited precedent`);
  }
  
  if (result.courtScore >= 0.8) {
    explanations.push(`High court authority`);
  }
  
  if (result.matchedTerms.length > 0) {
    explanations.push(`Matched terms: ${result.matchedTerms.slice(0, 5).join(", ")}`);
  }
  
  return explanations;
}

/**
 * Calculate final combined score
 */
export function calculateFinalScore(
  scores: {
    semantic: number;
    keyword: number;
    legalRelevance: number;
    citation: number;
    court: number;
    recency: number;
  },
  weights: RankingWeights = DEFAULT_WEIGHTS
): number {
  if (!featureFlags.enableEnhancedRanking) {
    // Fallback to simple semantic + keyword
    return (scores.semantic * 0.6) + (scores.keyword * 0.4);
  }
  
  // Normalize weights
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const normalizedWeights = Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / totalWeight])
  ) as RankingWeights;
  
  // Calculate weighted sum
  const finalScore = 
    (scores.semantic * normalizedWeights.semantic) +
    (scores.keyword * normalizedWeights.keyword) +
    (scores.legalRelevance * normalizedWeights.legalRelevance) +
    (scores.citation * normalizedWeights.citation) +
    (scores.court * normalizedWeights.court) +
    (scores.recency * normalizedWeights.recency);
  
  return normalizeScore(finalScore, 0, 1);
}

/**
 * Rank search results with enhanced multi-factor scoring
 */
export function rankResults(
  results: Array<{
    id: string;
    content: string;
    metadata: Record<string, any>;
    semanticScore: number;
    keywordScore: number;
    matchedTerms: string[];
  }>,
  query: string,
  weights: RankingWeights = DEFAULT_WEIGHTS
): RankedResult[] {
  const rankedResults: RankedResult[] = results.map(result => {
    // Calculate individual scores
    const legalRelevanceScore = calculateLegalRelevanceScore(
      result.content,
      query,
      result.matchedTerms
    );
    
    const citationScore = calculateCitationScore(
      result.metadata.citationCount,
      result.metadata.citedBySC,
      result.metadata.citedByHC
    );
    
    const courtScore = calculateCourtScore(
      result.metadata.court || "Unknown"
    );
    
    const recencyScore = calculateRecencyScore(
      result.metadata.date
    );
    
    // Calculate final score
    const finalScore = calculateFinalScore(
      {
        semantic: result.semanticScore,
        keyword: result.keywordScore,
        legalRelevance: legalRelevanceScore,
        citation: citationScore,
        court: courtScore,
        recency: recencyScore,
      },
      weights
    );
    
    // Extract matched sections and courts
    const matchedSections = extractMatchedSections(result.content, query);
    const matchedCourts = extractMatchedCourts(result.content);
    
    const rankedResult: RankedResult = {
      ...result,
      legalRelevanceScore,
      citationScore,
      courtScore,
      recencyScore,
      finalScore,
      rank: 0, // Will be set after sorting
      matchedSections,
      matchedCourts,
      explanation: [],
    };
    
    // Generate explanation
    rankedResult.explanation = generateRankingExplanation(rankedResult);
    
    return rankedResult;
  });
  
  // Sort by final score
  rankedResults.sort((a, b) => b.finalScore - a.finalScore);
  
  // Assign ranks
  rankedResults.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  return rankedResults;
}

/**
 * Get ranking statistics
 */
export function getRankingStatistics(results: RankedResult[]): {
  avgSemanticScore: number;
  avgKeywordScore: number;
  avgLegalRelevanceScore: number;
  avgCitationScore: number;
  avgCourtScore: number;
  avgRecencyScore: number;
  avgFinalScore: number;
  topCourts: Array<{ court: string; count: number }>;
  topSections: Array<{ section: string; count: number }>;
} {
  if (results.length === 0) {
    return {
      avgSemanticScore: 0,
      avgKeywordScore: 0,
      avgLegalRelevanceScore: 0,
      avgCitationScore: 0,
      avgCourtScore: 0,
      avgRecencyScore: 0,
      avgFinalScore: 0,
      topCourts: [],
      topSections: [],
    };
  }
  
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avg = (arr: number[]) => sum(arr) / arr.length;
  
  // Calculate averages
  const stats = {
    avgSemanticScore: avg(results.map(r => r.semanticScore)),
    avgKeywordScore: avg(results.map(r => r.keywordScore)),
    avgLegalRelevanceScore: avg(results.map(r => r.legalRelevanceScore)),
    avgCitationScore: avg(results.map(r => r.citationScore)),
    avgCourtScore: avg(results.map(r => r.courtScore)),
    avgRecencyScore: avg(results.map(r => r.recencyScore)),
    avgFinalScore: avg(results.map(r => r.finalScore)),
    topCourts: [] as Array<{ court: string; count: number }>,
    topSections: [] as Array<{ section: string; count: number }>,
  };
  
  // Count courts
  const courtCounts = new Map<string, number>();
  results.forEach(r => {
    r.matchedCourts.forEach(court => {
      courtCounts.set(court, (courtCounts.get(court) || 0) + 1);
    });
  });
  stats.topCourts = Array.from(courtCounts.entries())
    .map(([court, count]) => ({ court, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Count sections
  const sectionCounts = new Map<string, number>();
  results.forEach(r => {
    r.matchedSections.forEach(section => {
      sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1);
    });
  });
  stats.topSections = Array.from(sectionCounts.entries())
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return stats;
}
