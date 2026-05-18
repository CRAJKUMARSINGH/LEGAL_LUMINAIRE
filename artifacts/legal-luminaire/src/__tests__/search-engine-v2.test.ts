/**
 * Phase 2: Search Engine V2 Tests
 * Tests for query expansion, relevance ranking, and search analytics
 */

// Mock feature flags — enable all for testing
vi.mock("@/config/featureFlags", () => ({
  featureFlags: {
    enableQueryExpansion: true,
    enableEnhancedRanking: true,
    enableSearchAnalytics: true,
    enableAdvancedSearchV2: true,
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  tokenize,
  expandQuery,
  extractIPCSections,
  extractCrPCSections,
  calculateQueryComplexity,
  suggestQueryImprovements,
} from "@/lib/modules/search-engine-v2/query-expansion";

//  Query Expansion Tests 

describe("Query Expansion — tokenize()", () => {
  it("splits text into lowercase tokens", () => {
    const tokens = tokenize("Bail application under Section 438");
    expect(tokens).toContain("bail");
    expect(tokens).toContain("application");
    expect(tokens).toContain("438");
  });

  it("removes stopwords", () => {
    const tokens = tokenize("the accused is in custody");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("is");
    expect(tokens).not.toContain("in");
    expect(tokens).toContain("accused");
    expect(tokens).toContain("custody");
  });

  it("returns empty array for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("handles special characters gracefully", () => {
    const tokens = tokenize("IPC §302 — murder case!");
    expect(tokens).toContain("ipc");
    expect(tokens).toContain("302");
    expect(tokens).toContain("murder");
  });
});

describe("Query Expansion — extractIPCSections()", () => {
  it("extracts IPC section numbers", () => {
    const sections = extractIPCSections("charged under Section 302 IPC for murder");
    expect(sections).toContain("302");
  });

  it("extracts multiple IPC sections", () => {
    const sections = extractIPCSections("IPC 302 and IPC 307 and Section 420 IPC");
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });

  it("returns empty array when no IPC sections", () => {
    expect(extractIPCSections("bail application under CrPC")).toEqual([]);
  });

  it("handles section with letter suffix", () => {
    const sections = extractIPCSections("Section 304A IPC negligence");
    expect(sections.some(s => s.includes("304"))).toBe(true);
  });
});

describe("Query Expansion — extractCrPCSections()", () => {
  it("extracts CrPC section numbers", () => {
    const sections = extractCrPCSections("Section 438 CrPC anticipatory bail");
    expect(sections.length).toBeGreaterThan(0);
  });

  it("handles Cr.P.C. abbreviation", () => {
    const sections = extractCrPCSections("482 Cr.P.C. quashing petition");
    expect(sections.length).toBeGreaterThan(0);
  });
});

describe("Query Expansion — expandQuery()", () => {
  it("returns original query when no synonyms match", () => {
    const result = expandQuery("xyz abc def");
    expect(result.originalQuery).toBe("xyz abc def");
  });

  it("expands bail to related terms", () => {
    const result = expandQuery("bail application");
    expect(result.synonymsUsed).toHaveProperty("bail");
    expect(result.expandedTokens.length).toBeGreaterThan(result.tokens.length);
  });

  it("includes IPC sections in expansion", () => {
    const result = expandQuery("Section 302 IPC murder case");
    expect(result.ipcSections).toContain("302");
  });

  it("includes CrPC sections in expansion", () => {
    const result = expandQuery("Section 438 CrPC bail");
    expect(result.crpcSections.length).toBeGreaterThan(0);
  });

  it("deduplicates expanded tokens", () => {
    const result = expandQuery("bail bail bail");
    const unique = new Set(result.expandedTokens);
    expect(unique.size).toBe(result.expandedTokens.length);
  });
});

describe("Query Expansion — calculateQueryComplexity()", () => {
  it("returns higher score for complex queries", () => {
    const simple = calculateQueryComplexity("bail");
    const complex = calculateQueryComplexity("anticipatory bail Section 438 CrPC Supreme Court murder IPC 302");
    expect(complex.score).toBeGreaterThan(simple.score);
  });

  it("score is between 0 and 100", () => {
    const result = calculateQueryComplexity("any query text here");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("detects IPC sections in factors", () => {
    const result = calculateQueryComplexity("Section 302 IPC murder");
    expect(result.factors.sections).toBeGreaterThan(0);
  });
});

describe("Query Expansion — suggestQueryImprovements()", () => {
  it("suggests adding more terms for short queries", () => {
    const suggestions = suggestQueryImprovements("bail");
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it("returns array (may be empty for good queries)", () => {
    const suggestions = suggestQueryImprovements("anticipatory bail Section 438 CrPC Supreme Court");
    expect(Array.isArray(suggestions)).toBe(true);
  });
});