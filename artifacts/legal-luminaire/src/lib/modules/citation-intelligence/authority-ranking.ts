/**
 * Authority Ranking Module
 * Weights citations by court hierarchy, recency, and citation frequency
 * Part of Phase 3: Citation Intelligence
 */

import { featureFlags } from "@/config/featureFlags";
import type { ExtractedCitation } from "./citation-extraction";
import type { GraphNode } from "./citation-graph-engine";

export interface AuthorityScore {
  citationId: string;
  caseName: string;
  totalScore: number;
  breakdown: {
    courtHierarchy: number;
    pageRankScore: number;
    recencyScore: number;
    citationFrequency: number;
  };
  tier: AuthorityTier;
  recommendation: string;
}

export type AuthorityTier = "PRIMARY" | "SECONDARY" | "SUPPORTING" | "WEAK" | "LANDMARK";

export interface RankingResult {
  ranked: AuthorityScore[];
  landmarks: AuthorityScore[];
  primaryAuthorities: AuthorityScore[];
  stats: RankingStats;
}

export interface RankingStats {
  total: number;
  byTier: Record<AuthorityTier, number>;
  avgScore: number;
  topScore: number;
  bottomScore: number;
}

const COURT_HIERARCHY_SCORES: Array<{ pattern: RegExp; score: number }> = [
  { pattern: /supreme court of india|apex court/i, score: 40 },
  { pattern: /high court/i, score: 28 },
  { pattern: /sessions court|sessions judge/i, score: 16 },
  { pattern: /magistrate|judicial magistrate/i, score: 10 },
  { pattern: /tribunal/i, score: 14 },
  { pattern: /district court/i, score: 12 },
];

function getCourtHierarchyScore(court: string): number {
  for (const { pattern, score } of COURT_HIERARCHY_SCORES) {
    if (pattern.test(court)) return score;
  }
  return 8;
}

const CURRENT_YEAR = new Date().getFullYear();

function getRecencyScore(year: number): number {
  const age = Math.max(0, CURRENT_YEAR - year);
  return Math.round(15 * Math.exp(-age / 15) * 10) / 10;
}

function getCitationFrequencyScore(inDegree: number): number {
  if (inDegree === 0) return 0;
  return Math.round(15 * (Math.log(inDegree + 1) / Math.log(101)) * 10) / 10;
}

function getPageRankScore(pageRank: number): number {
  return Math.round(pageRank * 30 * 10) / 10;
}

function assignTier(score: number, isLandmark: boolean): AuthorityTier {
  if (isLandmark) return "LANDMARK";
  if (score >= 70) return "PRIMARY";
  if (score >= 50) return "SECONDARY";
  if (score >= 30) return "SUPPORTING";
  return "WEAK";
}

function buildRecommendation(tier: AuthorityTier, score: number): string {
  switch (tier) {
    case "LANDMARK": return "Landmark authority — cite prominently with full citation and para number";
    case "PRIMARY": return `Strong authority (${score}/100) — suitable as primary citation`;
    case "SECONDARY": return `Moderate authority (${score}/100) — use with qualification or as supporting citation`;
    case "SUPPORTING": return `Weak authority (${score}/100) — use only as background support, not primary`;
    case "WEAK": return `Insufficient authority (${score}/100) — avoid citing; seek stronger precedent`;
  }
}

export function rankByAuthority(
  citations: ExtractedCitation[],
  graphNodes?: Map<string, GraphNode>
): RankingResult {
  if (!featureFlags.enableAuthorityRanking) {
    return { ranked: [], landmarks: [], primaryAuthorities: [], stats: buildRankingStats([]) };
  }

  const scores: AuthorityScore[] = citations.map(citation => {
    const node = graphNodes?.get(citation.id);
    const courtHierarchy = getCourtHierarchyScore(citation.court ?? "Unknown");
    const pageRankScore = getPageRankScore(node?.pageRank ?? 0);
    const recencyScore = getRecencyScore(citation.year);
    const citationFrequency = getCitationFrequencyScore(node?.inDegree ?? 0);
    const totalScore = Math.min(100, courtHierarchy + pageRankScore + recencyScore + citationFrequency);
    const tier = assignTier(totalScore, node?.isLandmark ?? false);
    return {
      citationId: citation.id,
      caseName: citation.caseName ?? citation.raw,
      totalScore: Math.round(totalScore * 10) / 10,
      breakdown: { courtHierarchy, pageRankScore, recencyScore, citationFrequency },
      tier,
      recommendation: buildRecommendation(tier, Math.round(totalScore)),
    };
  });

  scores.sort((a, b) => b.totalScore - a.totalScore);

  return {
    ranked: scores,
    landmarks: scores.filter(s => s.tier === "LANDMARK"),
    primaryAuthorities: scores.filter(s => s.tier === "PRIMARY" || s.tier === "LANDMARK"),
    stats: buildRankingStats(scores),
  };
}

function buildRankingStats(scores: AuthorityScore[]): RankingStats {
  const byTier: Record<AuthorityTier, number> = { PRIMARY: 0, SECONDARY: 0, SUPPORTING: 0, WEAK: 0, LANDMARK: 0 };
  let sum = 0, top = 0, bottom = 100;
  for (const s of scores) {
    byTier[s.tier]++;
    sum += s.totalScore;
    if (s.totalScore > top) top = s.totalScore;
    if (s.totalScore < bottom) bottom = s.totalScore;
  }
  return {
    total: scores.length,
    byTier,
    avgScore: scores.length > 0 ? Math.round((sum / scores.length) * 10) / 10 : 0,
    topScore: scores.length > 0 ? top : 0,
    bottomScore: scores.length > 0 ? bottom : 0,
  };
}

export function calculateInfluenceScore(
  caseId: string,
  allCitations: ExtractedCitation[],
  graphNodes?: Map<string, GraphNode>
): number {
  const node = graphNodes?.get(caseId);
  if (!node) return 0;
  const citation = allCitations.find(c => c.id === caseId);
  if (!citation) return 0;
  const courtWeight = getCourtHierarchyScore(citation.court ?? "Unknown") / 40;
  const inDegreeWeight = Math.min(1, node.inDegree / 20);
  const pageRankWeight = node.pageRank;
  const recencyPenalty = 1 - getRecencyScore(citation.year) / 15;
  return Math.round((courtWeight * 0.35 + inDegreeWeight * 0.35 + pageRankWeight * 0.2 + recencyPenalty * 0.1) * 100);
}

export function getTopInfluentialCases(
  citations: ExtractedCitation[],
  graphNodes: Map<string, GraphNode>,
  topN = 10
): Array<{ citation: ExtractedCitation; influenceScore: number }> {
  return citations
    .map(c => ({ citation: c, influenceScore: calculateInfluenceScore(c.id, citations, graphNodes) }))
    .sort((a, b) => b.influenceScore - a.influenceScore)
    .slice(0, topN);
}