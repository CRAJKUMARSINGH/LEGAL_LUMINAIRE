/**
 * Case Similarity Engine
 * Multi-layer scoring: Keyword (35%) + Legal Issue (30%) + Citation (20%) + Court (15%)
 * Part of Phase 4: AI Reasoning Layer
 */

import { featureFlags } from "@/config/featureFlags";
import type { CaseFeatures } from "./legal-feature-extractor";
import { jaccardSimilarity, termOverlap } from "./legal-feature-extractor";

//  Types 

export interface SimilarityScore {
  caseId: string;
  title: string;
  court: string;
  year: number;
  totalScore: number;
  breakdown: SimilarityBreakdown;
  matchedIssues: string[];
  matchedSections: string[];
  matchedTerms: string[];
  explanation: string;
  tier: SimilarityTier;
}

export interface SimilarityBreakdown {
  keywordScore: number;      // 0-35 pts
  legalIssueScore: number;   // 0-30 pts
  citationScore: number;     // 0-20 pts
  courtScore: number;        // 0-15 pts
}

export type SimilarityTier =
  | "EXACT"       // >= 70 — primary authority
  | "ANALOGOUS"   // 50-69 — use with qualification
  | "WEAK"        // 30-49 — supporting only
  | "REJECTED";   // < 30 — do not use as primary

export interface SimilarityResult {
  query: CaseFeatures;
  results: SimilarityScore[];
  topMatch: SimilarityScore | null;
  stats: SimilarityStats;
}

export interface SimilarityStats {
  total: number;
  exact: number;
  analogous: number;
  weak: number;
  rejected: number;
  avgScore: number;
}

//  Court Hierarchy Weights 

const COURT_LEVEL_WEIGHTS: Record<string, number> = {
  SUPREME: 1.0,
  HIGH: 0.75,
  SESSIONS: 0.45,
  MAGISTRATE: 0.30,
  TRIBUNAL: 0.50,
  UNKNOWN: 0.40,
};

//  Scoring Functions 

/**
 * Layer 1: Keyword / Term Similarity (35 pts max)
 * Combines key term overlap + section overlap
 */
function scoreKeywords(query: CaseFeatures, candidate: CaseFeatures): {
  score: number;
  matchedTerms: string[];
  matchedSections: string[];
} {
  const termSim = termOverlap(query.keyTerms, candidate.keyTerms);
  const ipcSim = jaccardSimilarity(query.ipcSections, candidate.ipcSections);
  const crpcSim = jaccardSimilarity(query.crpcSections, candidate.crpcSections);
  const otherSim = jaccardSimilarity(query.otherSections, candidate.otherSections);

  const sectionSim = (ipcSim * 0.5 + crpcSim * 0.3 + otherSim * 0.2);
  const combined = termSim * 0.6 + sectionSim * 0.4;
  const score = Math.round(combined * 35 * 10) / 10;

  const matchedTerms = query.keyTerms.filter(t =>
    candidate.keyTerms.map(s => s.toLowerCase()).includes(t.toLowerCase())
  );
  const matchedSections = [
    ...query.ipcSections.filter(s => candidate.ipcSections.includes(s)).map(s => `IPC ${s}`),
    ...query.crpcSections.filter(s => candidate.crpcSections.includes(s)).map(s => `CrPC ${s}`),
  ];

  return { score, matchedTerms, matchedSections };
}

/**
 * Layer 2: Legal Issue Match (30 pts max)
 * Exact issue category overlap
 */
function scoreLegalIssues(query: CaseFeatures, candidate: CaseFeatures): {
  score: number;
  matchedIssues: string[];
} {
  const sim = jaccardSimilarity(query.issues, candidate.issues);
  const score = Math.round(sim * 30 * 10) / 10;
  const matchedIssues = query.issues.filter(i => candidate.issues.includes(i));
  return { score, matchedIssues };
}

/**
 * Layer 3: Citation Strength (20 pts max)
 * Based on citation count (log-scaled) and court level
 */
function scoreCitationStrength(candidate: CaseFeatures): number {
  const citationScore = Math.min(1, Math.log(candidate.citationCount + 1) / Math.log(51));
  const courtBonus = COURT_LEVEL_WEIGHTS[candidate.courtLevel] ?? 0.4;
  return Math.round(citationScore * courtBonus * 20 * 10) / 10;
}

/**
 * Layer 4: Court Relevance (15 pts max)
 * Prefer same court level or higher
 */
function scoreCourtRelevance(query: CaseFeatures, candidate: CaseFeatures): number {
  const queryWeight = COURT_LEVEL_WEIGHTS[query.courtLevel] ?? 0.4;
  const candidateWeight = COURT_LEVEL_WEIGHTS[candidate.courtLevel] ?? 0.4;

  // Higher court = more relevant; same court = bonus
  let score = candidateWeight * 15;
  if (query.courtLevel === candidate.courtLevel) score = Math.min(15, score * 1.2);
  if (candidateWeight > queryWeight) score = Math.min(15, score * 1.1); // higher court bonus

  return Math.round(score * 10) / 10;
}

//  Tier Assignment 

function assignTier(score: number): SimilarityTier {
  if (score >= 70) return "EXACT";
  if (score >= 50) return "ANALOGOUS";
  if (score >= 30) return "WEAK";
  return "REJECTED";
}

//  Explanation Generator 

function generateExplanation(
  score: SimilarityScore,
  candidate: CaseFeatures
): string {
  const parts: string[] = [];

  if (score.matchedIssues.length > 0) {
    parts.push(`Matches on legal issues: ${score.matchedIssues.join(", ")}`);
  }
  if (score.matchedSections.length > 0) {
    parts.push(`Common sections: ${score.matchedSections.join(", ")}`);
  }
  if (score.matchedTerms.length > 0) {
    parts.push(`Shared key terms: ${score.matchedTerms.slice(0, 5).join(", ")}`);
  }
  if (candidate.courtLevel === "SUPREME") {
    parts.push("Supreme Court authority — highest precedential value");
  }
  if (candidate.citationCount > 10) {
    parts.push(`Frequently cited (${candidate.citationCount} citations)`);
  }

  if (parts.length === 0) {
    return score.tier === "REJECTED"
      ? "Insufficient overlap — not recommended as authority"
      : "Partial factual overlap — verify before citing";
  }

  return parts.join(". ") + ".";
}

//  Main Similarity Engine 

/**
 * Score a single candidate case against a query case
 */
export function scoreSimilarity(
  query: CaseFeatures,
  candidate: CaseFeatures
): SimilarityScore {
  const { score: keywordScore, matchedTerms, matchedSections } = scoreKeywords(query, candidate);
  const { score: legalIssueScore, matchedIssues } = scoreLegalIssues(query, candidate);
  const citationScore = scoreCitationStrength(candidate);
  const courtScore = scoreCourtRelevance(query, candidate);

  const totalScore = Math.min(100, keywordScore + legalIssueScore + citationScore + courtScore);
  const tier = assignTier(totalScore);

  const partial: SimilarityScore = {
    caseId: candidate.caseId,
    title: candidate.title,
    court: candidate.court,
    year: candidate.year,
    totalScore: Math.round(totalScore * 10) / 10,
    breakdown: { keywordScore, legalIssueScore, citationScore, courtScore },
    matchedIssues,
    matchedSections,
    matchedTerms,
    explanation: "",
    tier,
  };

  partial.explanation = generateExplanation(partial, candidate);
  return partial;
}

/**
 * Find similar cases from a corpus
 */
export function findSimilarCases(
  query: CaseFeatures,
  corpus: CaseFeatures[],
  options: { minScore?: number; maxResults?: number; excludeIds?: string[] } = {}
): SimilarityResult {
  if (!featureFlags.enableCaseSimilarity) {
    return {
      query,
      results: [],
      topMatch: null,
      stats: { total: 0, exact: 0, analogous: 0, weak: 0, rejected: 0, avgScore: 0 },
    };
  }

  const { minScore = 0, maxResults = 20, excludeIds = [] } = options;

  const results = corpus
    .filter(c => c.caseId !== query.caseId && !excludeIds.includes(c.caseId))
    .map(c => scoreSimilarity(query, c))
    .filter(s => s.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, maxResults);

  const stats = buildStats(results);

  return {
    query,
    results,
    topMatch: results[0] ?? null,
    stats,
  };
}

function buildStats(results: SimilarityScore[]): SimilarityStats {
  let exact = 0, analogous = 0, weak = 0, rejected = 0, sum = 0;
  for (const r of results) {
    sum += r.totalScore;
    if (r.tier === "EXACT") exact++;
    else if (r.tier === "ANALOGOUS") analogous++;
    else if (r.tier === "WEAK") weak++;
    else rejected++;
  }
  return {
    total: results.length,
    exact,
    analogous,
    weak,
    rejected,
    avgScore: results.length > 0 ? Math.round((sum / results.length) * 10) / 10 : 0,
  };
}

/**
 * Get tier label with fact-fit gate compliance note
 */
export function getTierLabel(tier: SimilarityTier): string {
  switch (tier) {
    case "EXACT": return "Exact Match — primary authority (Fact-Fit  70)";
    case "ANALOGOUS": return "Analogous — use with qualification (Fact-Fit 50-69)";
    case "WEAK": return "Weak — supporting only, never primary (Fact-Fit 30-49)";
    case "REJECTED": return "Rejected — DO NOT USE as primary (Fact-Fit < 30)";
  }
}