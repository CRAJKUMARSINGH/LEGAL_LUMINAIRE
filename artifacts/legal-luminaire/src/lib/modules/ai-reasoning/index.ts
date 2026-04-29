/**
 * AI Reasoning Layer — Integration Module
 * Unified pipeline: Query Understanding  Feature Extraction  Similarity  Explanation
 * Part of Phase 4: AI Reasoning Layer
 */

import { featureFlags } from "@/config/featureFlags";
import { understandQuery, getIssueSummary, type QueryUnderstandingResult } from "./query-understanding";
import { extractCaseFeatures, type CaseFeatures } from "./legal-feature-extractor";
import { findSimilarCases, scoreSimilarity, getTierLabel, type SimilarityResult, type SimilarityScore } from "./case-similarity-engine";
import { generateExplanation, generateBulkExplanations, type CaseExplanation } from "./explanation-generator";

//  Public API Types 

export interface AIReasoningResult {
  queryUnderstanding: QueryUnderstandingResult;
  queryFeatures: CaseFeatures;
  similarCases: SimilarityResult;
  explanations: CaseExplanation[];
  summary: AIReasoningSummary;
}

export interface AIReasoningSummary {
  intent: string;
  issueSummary: string;
  topMatchTitle: string | null;
  topMatchScore: number;
  topMatchTier: string;
  primaryAuthorities: number;
  totalCandidates: number;
  readyForDraft: boolean;
  draftBlockers: string[];
}

export interface CaseInput {
  caseId: string;
  title: string;
  court: string;
  year: number;
  text: string;
  citationCount?: number;
}

//  Main Pipeline 

/**
 * Run the full AI reasoning pipeline.
 *
 * @param queryText   - The user's query or case description
 * @param corpus      - Array of candidate cases to compare against
 * @param options     - Optional filters
 */
export function runAIReasoning(
  queryText: string,
  corpus: CaseInput[],
  options: {
    minScore?: number;
    maxResults?: number;
    queryCaseId?: string;
    queryTitle?: string;
    queryCourt?: string;
    queryYear?: number;
  } = {}
): AIReasoningResult {
  const {
    minScore = 30,
    maxResults = 15,
    queryCaseId = "query",
    queryTitle = "Current Query",
    queryCourt = "Unknown",
    queryYear = new Date().getFullYear(),
  } = options;

  // Step 1: Understand the query
  const queryUnderstanding = understandQuery(queryText);

  // Step 2: Extract features from query
  const queryFeatures = extractCaseFeatures(
    queryCaseId,
    queryTitle,
    queryCourt,
    queryYear,
    queryText,
    0
  );

  // Step 3: Extract features from corpus
  const corpusFeatures: CaseFeatures[] = corpus.map(c =>
    extractCaseFeatures(c.caseId, c.title, c.court, c.year, c.text, c.citationCount ?? 0)
  );

  // Step 4: Find similar cases
  const similarCases = findSimilarCases(queryFeatures, corpusFeatures, { minScore, maxResults });

  // Step 5: Build candidate map for explanations
  const candidateMap = new Map<string, CaseFeatures>(
    corpusFeatures.map(f => [f.caseId, f])
  );

  // Step 6: Generate explanations
  const explanations = generateBulkExplanations(
    similarCases.results,
    queryFeatures,
    candidateMap,
    queryUnderstanding
  );

  // Step 7: Build summary
  const draftBlockers: string[] = [];
  const primaryAuthorities = similarCases.results.filter(
    r => r.tier === "EXACT" || r.tier === "ANALOGOUS"
  ).length;

  if (primaryAuthorities === 0) {
    draftBlockers.push("No primary or analogous authorities found — research more cases before drafting");
  }
  if (similarCases.stats.exact === 0 && similarCases.stats.analogous === 0) {
    draftBlockers.push("All matches are weak or rejected — verify factual similarity manually");
  }

  const topMatch = similarCases.topMatch;
  const summary: AIReasoningSummary = {
    intent: queryUnderstanding.intent,
    issueSummary: getIssueSummary(queryUnderstanding.issues),
    topMatchTitle: topMatch?.title ?? null,
    topMatchScore: topMatch?.totalScore ?? 0,
    topMatchTier: topMatch ? getTierLabel(topMatch.tier) : "No matches found",
    primaryAuthorities,
    totalCandidates: corpus.length,
    readyForDraft: draftBlockers.length === 0,
    draftBlockers,
  };

  return { queryUnderstanding, queryFeatures, similarCases, explanations, summary };
}

//  Convenience Exports 

export {
  understandQuery,
  extractCaseFeatures,
  findSimilarCases,
  scoreSimilarity,
  generateExplanation,
  generateBulkExplanations,
  getTierLabel,
  getIssueSummary,
};

export type {
  QueryUnderstandingResult,
  CaseFeatures,
  SimilarityResult,
  SimilarityScore,
  CaseExplanation,
};