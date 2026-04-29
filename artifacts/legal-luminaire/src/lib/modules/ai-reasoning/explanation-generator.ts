/**
 * Explanation Generator
 * Produces human-readable "why this case is relevant" reasoning
 * Part of Phase 4: AI Reasoning Layer
 */

import { featureFlags } from "@/config/featureFlags";
import type { SimilarityScore, SimilarityTier } from "./case-similarity-engine";
import type { CaseFeatures } from "./legal-feature-extractor";
import type { QueryUnderstandingResult } from "./query-understanding";

//  Types 

export interface CaseExplanation {
  caseId: string;
  headline: string;
  relevanceSummary: string;
  matchPoints: MatchPoint[];
  cautionNotes: string[];
  citationAdvice: string;
  factFitScore: number;
  factFitLabel: string;
  usageRecommendation: UsageRecommendation;
}

export interface MatchPoint {
  type: "ISSUE" | "SECTION" | "TERM" | "COURT" | "OUTCOME" | "OFFENCE";
  label: string;
  detail: string;
  strength: "STRONG" | "MODERATE" | "WEAK";
}

export type UsageRecommendation =
  | "CITE_AS_PRIMARY"
  | "CITE_WITH_QUALIFICATION"
  | "CITE_AS_SUPPORT"
  | "DO_NOT_CITE"
  | "VERIFY_BEFORE_CITING";

//  Headline Templates 

function buildHeadline(score: SimilarityScore, candidate: CaseFeatures): string {
  const tierPhrases: Record<SimilarityTier, string> = {
    EXACT: "Strong precedent",
    ANALOGOUS: "Analogous authority",
    WEAK: "Weak supporting case",
    REJECTED: "Not recommended",
  };
  const base = tierPhrases[score.tier];
  const courtShort = candidate.courtLevel === "SUPREME" ? "SC" : candidate.court.replace(" High Court", " HC");
  return `${base} — ${courtShort} (${candidate.year})`;
}

//  Match Points Builder 

function buildMatchPoints(
  score: SimilarityScore,
  query: CaseFeatures,
  candidate: CaseFeatures
): MatchPoint[] {
  const points: MatchPoint[] = [];

  // Issue matches
  for (const issue of score.matchedIssues) {
    points.push({
      type: "ISSUE",
      label: `Legal Issue: ${issue}`,
      detail: `Both cases involve ${issue.toLowerCase().replace("_", " ")} proceedings`,
      strength: "STRONG",
    });
  }

  // Section matches
  for (const section of score.matchedSections) {
    points.push({
      type: "SECTION",
      label: `Shared Section: ${section}`,
      detail: `Both cases cite ${section}`,
      strength: "STRONG",
    });
  }

  // Key term matches (top 5)
  for (const term of score.matchedTerms.slice(0, 5)) {
    points.push({
      type: "TERM",
      label: `Key Term: "${term}"`,
      detail: `Term appears in both case texts`,
      strength: "MODERATE",
    });
  }

  // Court relevance
  if (candidate.courtLevel === "SUPREME") {
    points.push({
      type: "COURT",
      label: "Supreme Court Authority",
      detail: "Binding precedent on all courts in India",
      strength: "STRONG",
    });
  } else if (candidate.courtLevel === "HIGH") {
    points.push({
      type: "COURT",
      label: "High Court Authority",
      detail: "Persuasive authority; binding within jurisdiction",
      strength: "MODERATE",
    });
  }

  // Outcome match
  if (query.outcome !== "UNKNOWN" && candidate.outcome !== "UNKNOWN" && query.outcome === candidate.outcome) {
    points.push({
      type: "OUTCOME",
      label: `Matching Outcome: ${candidate.outcome.replace("_", " ")}`,
      detail: "Case resulted in same outcome as your matter",
      strength: "MODERATE",
    });
  }

  // Offence match
  const sharedOffences = query.offences.filter(o => candidate.offences.includes(o));
  for (const offence of sharedOffences.slice(0, 2)) {
    points.push({
      type: "OFFENCE",
      label: `Offence: ${offence}`,
      detail: `Both cases involve ${offence}`,
      strength: "STRONG",
    });
  }

  return points;
}

//  Caution Notes 

function buildCautionNotes(score: SimilarityScore, candidate: CaseFeatures): string[] {
  const notes: string[] = [];

  if (candidate.year < 2000) {
    notes.push(`Old precedent (${candidate.year}) — verify it has not been overruled`);
  }
  if (score.breakdown.keywordScore < 10) {
    notes.push("Low keyword overlap — factual similarity may be limited");
  }
  if (candidate.courtLevel === "SESSIONS" || candidate.courtLevel === "MAGISTRATE") {
    notes.push("Lower court decision — persuasive only, not binding");
  }
  if (score.tier === "WEAK") {
    notes.push("Fact-Fit score 30-49 — use as supporting citation only, never as primary authority");
  }
  if (score.tier === "REJECTED") {
    notes.push("FATAL: Fact-Fit score < 30 — DO NOT cite as primary authority per accuracy-rules.md Rule 2");
  }
  if (candidate.citationCount === 0) {
    notes.push("No citation count data — authority weight unknown");
  }

  return notes;
}

//  Citation Advice 

function buildCitationAdvice(score: SimilarityScore, candidate: CaseFeatures): string {
  if (score.tier === "REJECTED") {
    return "Do not cite this case as authority. Fact-Fit score is below threshold.";
  }
  if (score.tier === "WEAK") {
    return `May be cited as background support only: "${candidate.title} (${candidate.year})" — note factual distinctions.`;
  }
  if (score.tier === "ANALOGOUS") {
    return `Cite with qualification: "In an analogous situation, the ${candidate.court} in ${candidate.title} (${candidate.year}) held..."`;
  }
  return `Cite as primary authority: "${candidate.title} (${candidate.year}) — [Reporter] [Page], Para [N]"`;
}

//  Usage Recommendation 

function getUsageRecommendation(score: SimilarityScore): UsageRecommendation {
  if (score.tier === "REJECTED") return "DO_NOT_CITE";
  if (score.tier === "WEAK") return "CITE_AS_SUPPORT";
  if (score.tier === "ANALOGOUS") return "CITE_WITH_QUALIFICATION";
  if (score.breakdown.citationScore < 5) return "VERIFY_BEFORE_CITING";
  return "CITE_AS_PRIMARY";
}

//  Fact-Fit Label 

function getFactFitLabel(score: number): string {
  if (score >= 70) return "Exact (Fact-Fit  70) — primary authority";
  if (score >= 50) return "Analogous (Fact-Fit 50-69) — use with qualification";
  if (score >= 30) return "Weak (Fact-Fit 30-49) — supporting only";
  return "Rejected (Fact-Fit < 30) — FATAL if cited as primary";
}

//  Relevance Summary 

function buildRelevanceSummary(
  score: SimilarityScore,
  candidate: CaseFeatures,
  query: QueryUnderstandingResult | null
): string {
  const issueText = score.matchedIssues.length > 0
    ? `on the issue of ${score.matchedIssues[0].toLowerCase().replace("_", " ")}`
    : "on related legal grounds";

  const sectionText = score.matchedSections.length > 0
    ? ` under ${score.matchedSections.slice(0, 2).join(" and ")}`
    : "";

  const courtText = candidate.courtLevel === "SUPREME"
    ? "The Supreme Court"
    : `The ${candidate.court}`;

  return `${courtText} decided ${issueText}${sectionText} in ${candidate.year}. ` +
    `Similarity score: ${score.totalScore}/100 (${score.tier}).`;
}

//  Main Generator 

export function generateExplanation(
  score: SimilarityScore,
  queryFeatures: CaseFeatures,
  candidateFeatures: CaseFeatures,
  queryUnderstanding: QueryUnderstandingResult | null = null
): CaseExplanation {
  if (!featureFlags.enableExplanationGenerator) {
    return {
      caseId: score.caseId,
      headline: score.title,
      relevanceSummary: score.explanation,
      matchPoints: [],
      cautionNotes: [],
      citationAdvice: "",
      factFitScore: score.totalScore,
      factFitLabel: getFactFitLabel(score.totalScore),
      usageRecommendation: getUsageRecommendation(score),
    };
  }

  return {
    caseId: score.caseId,
    headline: buildHeadline(score, candidateFeatures),
    relevanceSummary: buildRelevanceSummary(score, candidateFeatures, queryUnderstanding),
    matchPoints: buildMatchPoints(score, queryFeatures, candidateFeatures),
    cautionNotes: buildCautionNotes(score, candidateFeatures),
    citationAdvice: buildCitationAdvice(score, candidateFeatures),
    factFitScore: score.totalScore,
    factFitLabel: getFactFitLabel(score.totalScore),
    usageRecommendation: getUsageRecommendation(score),
  };
}

/**
 * Generate explanations for a ranked list of similarity results
 */
export function generateBulkExplanations(
  scores: SimilarityScore[],
  queryFeatures: CaseFeatures,
  candidateMap: Map<string, CaseFeatures>,
  queryUnderstanding: QueryUnderstandingResult | null = null
): CaseExplanation[] {
  return scores.map(score => {
    const candidate = candidateMap.get(score.caseId);
    if (!candidate) return null;
    return generateExplanation(score, queryFeatures, candidate, queryUnderstanding);
  }).filter((e): e is CaseExplanation => e !== null);
}