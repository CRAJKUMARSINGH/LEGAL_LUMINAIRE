/**
 * Phase 3: Citation Intelligence Tests
 * Tests for extraction, graph engine, and authority ranking
 */

vi.mock("@/config/featureFlags", () => ({
  featureFlags: {
    enableCitationExtraction: true,
    enableCitationGraph: true,
    enableAuthorityRanking: true,
  },
}));

import { describe, it, expect, vi } from "vitest";
import {
  extractCitations,
  validateCitation,
  formatCitation,
  deduplicateCitations,
  type ExtractedCitation,
} from "@/lib/modules/citation-intelligence/citation-extraction";
import {
  buildCitationGraph,
  computePageRank,
  detectClusters,
  analyzeGraph,
  serializeGraph,
} from "@/lib/modules/citation-intelligence/citation-graph-engine";
import {
  rankByAuthority,
} from "@/lib/modules/citation-intelligence/authority-ranking";

//  Sample texts 

const SAMPLE_TEXT_SCC = `
  The Supreme Court in State of Maharashtra v. Ramesh Kumar (2019) 5 SCC 123
  held that bail cannot be denied mechanically. The court further relied on
  Arnesh Kumar v. State of Bihar (2014) 8 SCC 273, Para 12.
`;

const SAMPLE_TEXT_AIR = `
  In AIR 2020 SC 456, the apex court reiterated the principles of natural justice.
  The accused was charged under Section 302 of the Indian Penal Code.
  The court also referred to Section 438 of the Code of Criminal Procedure.
`;

const SAMPLE_TEXT_MULTI = `
  Relying on (2021) 3 SCC 100 and (2018) 7 SCC 200 and AIR 2019 SC 300,
  the High Court allowed the discharge application under Section 227 CrPC.
  The accused faced charges under IPC 304A for causing death by negligence.
`;

//  Citation Extraction Tests 

describe("Citation Extraction â€” extractCitations()", () => {
  it("extracts SCC citations", () => {
    const result = extractCitations(SAMPLE_TEXT_SCC);
    expect(result.citations.length).toBeGreaterThanOrEqual(1);
    expect(result.citations.some(c => c.reporter === "SCC")).toBe(true);
  });

  it("extracts AIR citations", () => {
    const result = extractCitations(SAMPLE_TEXT_AIR);
    expect(result.citations.some(c => c.reporter === "AIR")).toBe(true);
  });

  it("extracts multiple citations from one text", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    expect(result.citations.length).toBeGreaterThanOrEqual(2);
  });

  it("extracts IPC sections", () => {
    const result = extractCitations(SAMPLE_TEXT_AIR);
    expect(result.ipcSections).toContain("302");
  });

  it("extracts CrPC sections", () => {
    const result = extractCitations(SAMPLE_TEXT_AIR);
    expect(result.crpcSections.length).toBeGreaterThan(0);
  });

  it("extracts IPC 304A from negligence text", () => {
    const result = extractCitations("The accused was charged under Section 304A of the Indian Penal Code for causing death by negligence.");
    expect(result.ipcSections.some(s => s.includes("304"))).toBe(true);
  });

  it("returns stats with correct total", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    expect(result.stats.total).toBe(result.citations.length);
  });

  it("deduplicates identical citations", () => {
    const dupText = `(2021) 3 SCC 100 and again (2021) 3 SCC 100`;
    const result = extractCitations(dupText);
    const ids = result.citations.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("returns empty result for text with no citations", () => {
    const result = extractCitations("This text has no legal citations at all.");
    expect(result.citations).toHaveLength(0);
    expect(result.ipcSections).toHaveLength(0);
  });

  it("assigns confidence between 0 and 1", () => {
    const result = extractCitations(SAMPLE_TEXT_SCC);
    for (const c of result.citations) {
      expect(c.confidence).toBeGreaterThan(0);
      expect(c.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("assigns correct year to SCC citation", () => {
    const result = extractCitations("(2019) 5 SCC 123");
    expect(result.citations[0]?.year).toBe(2019);
  });

  it("assigns correct page to SCC citation", () => {
    const result = extractCitations("(2019) 5 SCC 123");
    expect(result.citations[0]?.page).toBe(123);
  });

  it("infers Supreme Court for SCC reporter", () => {
    const result = extractCitations("(2020) 3 SCC 50");
    expect(result.citations[0]?.court).toContain("Supreme Court");
  });
});

describe("Citation Extraction â€” validateCitation()", () => {
  it("flags missing case name", () => {
    const c: ExtractedCitation = {
      id: "SCC_2020_50", raw: "(2020) 3 SCC 50", year: 2020,
      reporter: "SCC", page: 50, confidence: 0.95,
      startIndex: 0, endIndex: 15,
    };
    const { issues } = validateCitation(c);
    expect(issues).toContain("Missing case name");
  });

  it("flags missing para number", () => {
    const c: ExtractedCitation = {
      id: "SCC_2020_50", raw: "(2020) 3 SCC 50", caseName: "State v. X",
      year: 2020, reporter: "SCC", page: 50, confidence: 0.95,
      startIndex: 0, endIndex: 15,
    };
    const { issues } = validateCitation(c);
    expect(issues).toContain("Missing paragraph number");
  });

  it("returns valid=true for complete citation", () => {
    const c: ExtractedCitation = {
      id: "SCC_2020_50", raw: "(2020) 3 SCC 50", caseName: "State v. X",
      year: 2020, reporter: "SCC", page: 50, paraNumber: 12,
      court: "Supreme Court of India", confidence: 0.95,
      startIndex: 0, endIndex: 15,
    };
    const { valid } = validateCitation(c);
    expect(valid).toBe(true);
  });
});

describe("Citation Extraction â€” formatCitation()", () => {
  it("formats citation with case name and para", () => {
    const c: ExtractedCitation = {
      id: "SCC_2020_50", raw: "(2020) 3 SCC 50", caseName: "State v. Ramesh",
      year: 2020, volume: 3, reporter: "SCC", page: 50, paraNumber: 12,
      court: "Supreme Court of India", confidence: 0.95,
      startIndex: 0, endIndex: 15,
    };
    const formatted = formatCitation(c);
    expect(formatted).toContain("State v. Ramesh");
    expect(formatted).toContain("2020");
    expect(formatted).toContain("SCC");
    expect(formatted).toContain("Para 12");
  });
});

describe("Citation Extraction â€” deduplicateCitations()", () => {
  it("removes duplicate citations by id", () => {
    const c: ExtractedCitation = {
      id: "SCC_2020_50", raw: "(2020) 3 SCC 50", year: 2020,
      reporter: "SCC", page: 50, confidence: 0.95, startIndex: 0, endIndex: 15,
    };
    const result = deduplicateCitations([c, c, c]);
    expect(result).toHaveLength(1);
  });
});

//  Citation Graph Engine Tests 

describe("Citation Graph Engine â€” buildCitationGraph()", () => {
  it("creates nodes for all citations", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    expect(graph.nodes.size).toBeGreaterThanOrEqual(result.citations.length);
  });

  it("creates edges from citing document to citations", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    expect(graph.edges.length).toBeGreaterThan(0);
  });

  it("creates citing document node", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "my-doc");
    expect(graph.nodes.has("my-doc")).toBe(true);
  });

  it("handles empty citations array", () => {
    const graph = buildCitationGraph([], "doc-1");
    expect(graph.nodes.size).toBe(0);
    expect(graph.edges.length).toBe(0);
  });
});

describe("Citation Graph Engine â€” computePageRank()", () => {
  it("returns ranks for all nodes", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const ranks = computePageRank(graph);
    expect(ranks.size).toBe(graph.nodes.size);
  });

  it("all ranks are between 0 and 1", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const ranks = computePageRank(graph);
    for (const rank of ranks.values()) {
      expect(rank).toBeGreaterThanOrEqual(0);
      expect(rank).toBeLessThanOrEqual(1);
    }
  });

  it("returns empty map for empty graph", () => {
    const graph = buildCitationGraph([], "doc-1");
    const ranks = computePageRank(graph);
    expect(ranks.size).toBe(0);
  });
});

describe("Citation Graph Engine â€” detectClusters()", () => {
  it("returns at least one cluster for connected graph", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const clusters = detectClusters(graph);
    expect(clusters.size).toBeGreaterThan(0);
  });
});

describe("Citation Graph Engine â€” analyzeGraph()", () => {
  it("returns analysis with pageRanks", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const analysis = analyzeGraph(graph);
    expect(analysis.pageRanks).toBeDefined();
  });

  it("stats nodeCount matches graph nodes", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const analysis = analyzeGraph(graph);
    expect(analysis.stats.nodeCount).toBe(graph.nodes.size);
  });
});

describe("Citation Graph Engine â€” serializeGraph()", () => {
  it("returns nodes and edges arrays", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const graph = buildCitationGraph(result.citations, "doc-1");
    const serialized = serializeGraph(graph);
    expect(Array.isArray(serialized.nodes)).toBe(true);
    expect(Array.isArray(serialized.edges)).toBe(true);
  });
});

//  Authority Ranking Tests 

describe("Authority Ranking â€” rankByAuthority()", () => {
  it("returns ranked array sorted descending", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const ranking = rankByAuthority(result.citations);
    for (let i = 1; i < ranking.ranked.length; i++) {
      expect(ranking.ranked[i - 1].totalScore).toBeGreaterThanOrEqual(ranking.ranked[i].totalScore);
    }
  });

  it("all scores are between 0 and 100", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const ranking = rankByAuthority(result.citations);
    for (const s of ranking.ranked) {
      expect(s.totalScore).toBeGreaterThanOrEqual(0);
      expect(s.totalScore).toBeLessThanOrEqual(100);
    }
  });

  it("assigns valid tier to each citation", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const ranking = rankByAuthority(result.citations);
    const validTiers = ["PRIMARY", "SECONDARY", "SUPPORTING", "WEAK", "LANDMARK"];
    for (const s of ranking.ranked) {
      expect(validTiers).toContain(s.tier);
    }
  });

  it("returns empty result for empty citations", () => {
    const ranking = rankByAuthority([]);
    expect(ranking.ranked).toHaveLength(0);
    expect(ranking.stats.total).toBe(0);
  });

  it("stats total matches ranked length", () => {
    const result = extractCitations(SAMPLE_TEXT_MULTI);
    const ranking = rankByAuthority(result.citations);
    expect(ranking.stats.total).toBe(ranking.ranked.length);
  });
});