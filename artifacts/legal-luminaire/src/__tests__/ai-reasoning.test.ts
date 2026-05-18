/**
 * Phase 4: AI Reasoning Layer Tests
 * Tests for query understanding, feature extraction, similarity engine, explanations
 */

vi.mock("@/config/featureFlags", () => ({
  featureFlags: {
    enableQueryUnderstanding: true,
    enableCaseSimilarity: true,
    enableMultiLayerScoring: true,
    enableExplanationGenerator: true,
  },
}));

import { describe, it, expect, vi } from "vitest";
import {
  understandQuery,
  getIssueSummary,
} from "@/lib/modules/ai-reasoning/query-understanding";
import {
  extractCaseFeatures,
  jaccardSimilarity,
  termOverlap,
} from "@/lib/modules/ai-reasoning/legal-feature-extractor";
import {
  scoreSimilarity,
  findSimilarCases,
  getTierLabel,
} from "@/lib/modules/ai-reasoning/case-similarity-engine";
import {
  generateExplanation,
} from "@/lib/modules/ai-reasoning/explanation-generator";

//  Sample data 

const BAIL_QUERY = "Anticipatory bail application under Section 438 CrPC. Accused charged under IPC 302 murder. Supreme Court guidelines.";
const DISCHARGE_QUERY = "Discharge application under Section 227 CrPC. Accused charged under IPC 304A negligence. Building collapse case.";
const QUASHING_QUERY = "Quashing petition under Section 482 CrPC. FIR registered under IPC 420 cheating. High Court inherent powers.";

//  Query Understanding Tests 

describe("Query Understanding â€” understandQuery()", () => {
  it("detects BAIL issue from bail query", () => {
    const result = understandQuery(BAIL_QUERY);
    expect(result.issues.some(i => i.category === "BAIL")).toBe(true);
  });

  it("detects DISCHARGE issue from discharge query", () => {
    const result = understandQuery(DISCHARGE_QUERY);
    expect(result.issues.some(i => i.category === "DISCHARGE")).toBe(true);
  });

  it("detects QUASHING issue from quashing query", () => {
    const result = understandQuery(QUASHING_QUERY);
    expect(result.issues.some(i => i.category === "QUASHING")).toBe(true);
  });

  it("extracts IPC sections", () => {
    const result = understandQuery(BAIL_QUERY);
    expect(result.sections.ipc).toContain("302");
  });

  it("extracts CrPC sections", () => {
    const result = understandQuery(BAIL_QUERY);
    expect(result.sections.crpc.length).toBeGreaterThan(0);
  });

  it("detects Supreme Court entity", () => {
    const result = understandQuery("Bail application before the Supreme Court of India under Section 438 CrPC.");
    expect(result.courts).toContain("Supreme Court of India");
  });

  it("returns complexity score between 0 and 100", () => {
    const result = understandQuery(BAIL_QUERY);
    expect(result.complexity).toBeGreaterThanOrEqual(0);
    expect(result.complexity).toBeLessThanOrEqual(100);
  });

  it("detects DRAFT_DOCUMENT intent", () => {
    const result = understandQuery("Draft a bail application for accused charged under IPC 302");
    expect(result.intent).toBe("DRAFT_DOCUMENT");
  });

  it("detects FIND_PRECEDENT intent", () => {
    const result = understandQuery("Find similar precedent cases for bail under IPC 302");
    expect(result.intent).toBe("FIND_PRECEDENT");
  });

  it("returns originalQuery unchanged", () => {
    const result = understandQuery(BAIL_QUERY);
    expect(result.originalQuery).toBe(BAIL_QUERY);
  });

  it("handles empty query gracefully", () => {
    const result = understandQuery("");
    expect(result.entities).toHaveLength(0);
    expect(result.issues).toHaveLength(0);
  });
});

describe("Query Understanding â€” getIssueSummary()", () => {
  it("returns general for empty issues", () => {
    expect(getIssueSummary([])).toBe("General legal query");
  });

  it("returns single issue label", () => {
    const result = understandQuery(BAIL_QUERY);
    const summary = getIssueSummary(result.issues);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(0);
  });
});

//  Legal Feature Extractor Tests 

describe("Legal Feature Extractor â€” extractCaseFeatures()", () => {
  it("extracts IPC sections from text", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, BAIL_QUERY);
    expect(features.ipcSections).toContain("302");
  });

  it("extracts CrPC sections from text", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, BAIL_QUERY);
    expect(features.crpcSections.length).toBeGreaterThan(0);
  });

  it("detects BAIL issue", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, BAIL_QUERY);
    expect(features.hasBailIssue).toBe(true);
  });

  it("infers SUPREME court level", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, "text");
    expect(features.courtLevel).toBe("SUPREME");
  });

  it("infers HIGH court level", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Delhi High Court", 2020, "text");
    expect(features.courtLevel).toBe("HIGH");
  });

  it("detects CRIMINAL procedure type", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, BAIL_QUERY);
    expect(features.procedureType).toBe("CRIMINAL");
  });

  it("extracts key terms", () => {
    const features = extractCaseFeatures("c1", "Test Case", "Supreme Court of India", 2020, BAIL_QUERY);
    expect(features.keyTerms.length).toBeGreaterThan(0);
  });

  it("detects BAIL_GRANTED outcome", () => {
    const features = extractCaseFeatures("c1", "Test", "SC", 2020, "The accused is released on bail. Bail is granted.");
    expect(features.outcome).toBe("BAIL_GRANTED");
  });

  it("detects CONVICTED outcome", () => {
    const features = extractCaseFeatures("c1", "Test", "SC", 2020, "The accused is convicted and sentenced to 7 years.");
    expect(features.outcome).toBe("CONVICTED");
  });
});

describe("Legal Feature Extractor â€” jaccardSimilarity()", () => {
  it("returns 1 for identical arrays", () => {
    expect(jaccardSimilarity(["a", "b", "c"], ["a", "b", "c"])).toBe(1);
  });

  it("returns 0 for completely disjoint arrays", () => {
    expect(jaccardSimilarity(["a", "b"], ["c", "d"])).toBe(0);
  });

  it("returns 1 for two empty arrays", () => {
    expect(jaccardSimilarity([], [])).toBe(1);
  });

  it("returns value between 0 and 1 for partial overlap", () => {
    const sim = jaccardSimilarity(["a", "b", "c"], ["b", "c", "d"]);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
  });

  it("is case-insensitive", () => {
    expect(jaccardSimilarity(["IPC"], ["ipc"])).toBe(1);
  });
});

describe("Legal Feature Extractor â€” termOverlap()", () => {
  it("returns 0 for empty arrays", () => {
    expect(termOverlap([], ["a", "b"])).toBe(0);
    expect(termOverlap(["a", "b"], [])).toBe(0);
  });

  it("returns 1 for identical arrays", () => {
    expect(termOverlap(["bail", "murder"], ["bail", "murder"])).toBe(1);
  });

  it("returns partial overlap correctly", () => {
    const overlap = termOverlap(["bail", "murder", "court"], ["bail", "court", "other"]);
    expect(overlap).toBeGreaterThan(0);
    expect(overlap).toBeLessThanOrEqual(1);
  });
});

//  Case Similarity Engine Tests 

const QUERY_FEATURES = extractCaseFeatures("q1", "Query Case", "Delhi High Court", 2024, DISCHARGE_QUERY);

const CORPUS_FEATURES = [
  extractCaseFeatures("c1", "State v. Hemraj", "Delhi High Court", 2025,
    "Discharge application Section 227 CrPC. IPC 304A negligence. Building collapse. Evidence insufficient."),
  extractCaseFeatures("c2", "Arnesh Kumar v. Bihar", "Supreme Court of India", 2014,
    "Bail guidelines Section 438 CrPC. IPC 498A. Arrest guidelines. Magistrate powers."),
  extractCaseFeatures("c3", "Jacob Mathew v. Punjab", "Supreme Court of India", 2005,
    "Medical negligence Section 304A IPC. Rash act. Standard of care. Criminal negligence."),
  extractCaseFeatures("c4", "Unrelated Contract Case", "Bombay High Court", 2020,
    "Contract dispute. Specific performance. Civil suit. Injunction granted."),
];

describe("Case Similarity Engine â€” scoreSimilarity()", () => {
  it("returns score between 0 and 100", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    expect(score.totalScore).toBeGreaterThanOrEqual(0);
    expect(score.totalScore).toBeLessThanOrEqual(100);
  });

  it("scores similar case higher than unrelated case", () => {
    const similar = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]); // discharge + 304A
    const unrelated = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[3]); // contract
    expect(similar.totalScore).toBeGreaterThan(unrelated.totalScore);
  });

  it("assigns valid tier", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    expect(["EXACT", "ANALOGOUS", "WEAK", "REJECTED"]).toContain(score.tier);
  });

  it("breakdown scores sum to approximately totalScore", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    const sum = score.breakdown.keywordScore + score.breakdown.legalIssueScore +
                score.breakdown.citationScore + score.breakdown.courtScore;
    expect(Math.abs(sum - score.totalScore)).toBeLessThan(1);
  });

  it("includes explanation string", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    expect(typeof score.explanation).toBe("string");
    expect(score.explanation.length).toBeGreaterThan(0);
  });
});

describe("Case Similarity Engine â€” findSimilarCases()", () => {
  it("returns results sorted by score descending", () => {
    const result = findSimilarCases(QUERY_FEATURES, CORPUS_FEATURES);
    for (let i = 1; i < result.results.length; i++) {
      expect(result.results[i - 1].totalScore).toBeGreaterThanOrEqual(result.results[i].totalScore);
    }
  });

  it("respects minScore filter", () => {
    const result = findSimilarCases(QUERY_FEATURES, CORPUS_FEATURES, { minScore: 50 });
    for (const r of result.results) {
      expect(r.totalScore).toBeGreaterThanOrEqual(50);
    }
  });

  it("respects maxResults limit", () => {
    const result = findSimilarCases(QUERY_FEATURES, CORPUS_FEATURES, { maxResults: 2 });
    expect(result.results.length).toBeLessThanOrEqual(2);
  });

  it("excludes query case from results", () => {
    const result = findSimilarCases(QUERY_FEATURES, [...CORPUS_FEATURES, QUERY_FEATURES]);
    expect(result.results.every(r => r.caseId !== QUERY_FEATURES.caseId)).toBe(true);
  });

  it("stats total matches results length", () => {
    const result = findSimilarCases(QUERY_FEATURES, CORPUS_FEATURES);
    expect(result.stats.total).toBe(result.results.length);
  });

  it("topMatch is the highest scoring result", () => {
    const result = findSimilarCases(QUERY_FEATURES, CORPUS_FEATURES);
    if (result.results.length > 0) {
      expect(result.topMatch?.caseId).toBe(result.results[0].caseId);
    }
  });
});

describe("Case Similarity Engine â€” getTierLabel()", () => {
  it("returns string for all tiers", () => {
    expect(typeof getTierLabel("EXACT")).toBe("string");
    expect(typeof getTierLabel("ANALOGOUS")).toBe("string");
    expect(typeof getTierLabel("WEAK")).toBe("string");
    expect(typeof getTierLabel("REJECTED")).toBe("string");
  });

  it("REJECTED label mentions DO NOT USE", () => {
    expect(getTierLabel("REJECTED")).toContain("DO NOT USE");
  });
});

//  Explanation Generator Tests 

describe("Explanation Generator â€” generateExplanation()", () => {
  it("returns explanation with headline", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    const explanation = generateExplanation(score, QUERY_FEATURES, CORPUS_FEATURES[0]);
    expect(typeof explanation.headline).toBe("string");
    expect(explanation.headline.length).toBeGreaterThan(0);
  });

  it("returns factFitScore matching totalScore", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    const explanation = generateExplanation(score, QUERY_FEATURES, CORPUS_FEATURES[0]);
    expect(explanation.factFitScore).toBe(score.totalScore);
  });

  it("returns valid usageRecommendation", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[0]);
    const explanation = generateExplanation(score, QUERY_FEATURES, CORPUS_FEATURES[0]);
    const valid = ["CITE_AS_PRIMARY", "CITE_WITH_QUALIFICATION", "CITE_AS_SUPPORT", "DO_NOT_CITE", "VERIFY_BEFORE_CITING"];
    expect(valid).toContain(explanation.usageRecommendation);
  });

  it("REJECTED score gives DO_NOT_CITE recommendation", () => {
    const score = scoreSimilarity(QUERY_FEATURES, CORPUS_FEATURES[3]); // unrelated contract case
    const explanation = generateExplanation(score, QUERY_FEATURES, CORPUS_FEATURES[3]);
    if (score.tier === "REJECTED") {
      expect(explanation.usageRecommendation).toBe("DO_NOT_CITE");
    }
  });

  it("includes caution for old cases", () => {
    const oldCase = extractCaseFeatures("old", "Old Case", "Supreme Court of India", 1985, "bail murder IPC 302");
    const score = scoreSimilarity(QUERY_FEATURES, oldCase);
    const explanation = generateExplanation(score, QUERY_FEATURES, oldCase);
    expect(explanation.cautionNotes.some(n => n.includes("1985"))).toBe(true);
  });
});