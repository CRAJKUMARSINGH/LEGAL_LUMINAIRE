/**
 * Citation Intelligence — Integration Module
 * Unified API for Phase 3: Citation Intelligence
 * Wires together extraction, graph engine, and authority ranking
 */

import { featureFlags } from "@/config/featureFlags";
import {
  extractCitations,
  validateCitation,
  formatCitation,
  type CitationExtractionResult,
  type ExtractedCitation,
} from "./citation-extraction";
import {
  buildCitationGraph,
  analyzeGraph,
  serializeGraph,
  type GraphAnalysis,
  type CitationGraph,
} from "./citation-graph-engine";
import {
  rankByAuthority,
  getTopInfluentialCases,
  type RankingResult,
  type AuthorityScore,
} from "./authority-ranking";

//  Public API Types 

export interface CitationIntelligenceResult {
  extraction: CitationExtractionResult;
  graph: ReturnType<typeof serializeGraph>;
  analysis: Omit<GraphAnalysis, "graph">;
  ranking: RankingResult;
  topInfluential: Array<{ citation: ExtractedCitation; influenceScore: number }>;
  validationReport: Array<{ citation: ExtractedCitation; valid: boolean; issues: string[] }>;
  summary: CitationSummary;
}

export interface CitationSummary {
  totalCitations: number;
  primaryAuthorities: number;
  landmarkCases: number;
  pendingVerification: number;
  ipcSections: string[];
  crpcSections: string[];
  topCaseNames: string[];
  readyForDraft: boolean;
  draftBlockers: string[];
}

//  Main Entry Point 

/**
 * Run full citation intelligence pipeline on a text document.
 *
 * @param text          - Raw judgment or draft text to analyse
 * @param documentId    - Optional ID for the citing document (used as graph root)
 * @returns             - Complete citation intelligence result
 */
export function runCitationIntelligence(
  text: string,
  documentId?: string
): CitationIntelligenceResult {
  //  Step 1: Extract citations 
  const extraction = extractCitations(text);

  //  Step 2: Build citation graph 
  let graph: CitationGraph;
  let analysis: GraphAnalysis;

  if (featureFlags.enableCitationGraph) {
    graph = buildCitationGraph(extraction.citations, documentId);
    analysis = analyzeGraph(graph);
  } else {
    graph = buildCitationGraph(extraction.citations, documentId);
    analysis = {
      graph,
      pageRanks: new Map(),
      clusters: new Map(),
      bridgeCases: [],
      landmarkCases: [],
      stats: {
        nodeCount: extraction.citations.length,
        edgeCount: 0,
        avgInDegree: 0,
        avgOutDegree: 0,
        density: 0,
        clusterCount: 0,
        landmarkCount: 0,
        bridgeCount: 0,
      },
    };
  }

  //  Step 3: Rank by authority 
  const ranking = rankByAuthority(extraction.citations, analysis.graph.nodes);

  //  Step 4: Top influential cases 
  const topInfluential = getTopInfluentialCases(
    extraction.citations,
    analysis.graph.nodes,
    5
  );

  //  Step 5: Validation report 
  const validationReport = extraction.citations.map(c => ({
    citation: c,
    ...validateCitation(c),
  }));

  //  Step 6: Build summary 
  const draftBlockers: string[] = [];

  const lowConfidenceCitations = extraction.citations.filter(c => c.confidence < 0.7);
  if (lowConfidenceCitations.length > 0) {
    draftBlockers.push(
      `${lowConfidenceCitations.length} citation(s) have low extraction confidence — verify before filing`
    );
  }

  const missingParas = validationReport.filter(r => r.issues.includes("Missing paragraph number"));
  if (missingParas.length > 0) {
    draftBlockers.push(
      `${missingParas.length} citation(s) missing paragraph numbers — required for court filing`
    );
  }

  const topCaseNames = ranking.ranked
    .slice(0, 5)
    .map(s => s.caseName)
    .filter(Boolean);

  const summary: CitationSummary = {
    totalCitations: extraction.citations.length,
    primaryAuthorities: ranking.primaryAuthorities.length,
    landmarkCases: ranking.landmarks.length,
    pendingVerification: lowConfidenceCitations.length,
    ipcSections: extraction.ipcSections,
    crpcSections: extraction.crpcSections,
    topCaseNames,
    readyForDraft: draftBlockers.length === 0,
    draftBlockers,
  };

  const { graph: _g, ...analysisWithoutGraph } = analysis;

  return {
    extraction,
    graph: serializeGraph(graph),
    analysis: analysisWithoutGraph,
    ranking,
    topInfluential,
    validationReport,
    summary,
  };
}

//  Convenience Exports 

export {
  extractCitations,
  validateCitation,
  formatCitation,
  buildCitationGraph,
  analyzeGraph,
  serializeGraph,
  rankByAuthority,
  getTopInfluentialCases,
};

export type {
  ExtractedCitation,
  CitationExtractionResult,
  GraphAnalysis,
  RankingResult,
  AuthorityScore,
};