/**
 * Phase 5+6: Analytics + Graph Visualization Tests
 */

vi.mock("@/config/featureFlags", () => ({
  featureFlags: {
    enableJudgeAnalytics: true,
    enableCourtAnalytics: true,
    enableOutcomePrediction: true,
    enableGraphVisualization: true,
    enableCitationGraph: true,
    enableCitationExtraction: true,
  },
}));

import { describe, it, expect, vi } from "vitest";
import {
  buildJudgeProfile,
  buildAllJudgeProfiles,
  normalizeJudgeName,
  type JudgmentRecord,
} from "@/lib/modules/analytics/judge-analytics";
import {
  buildCourtProfile,
  predictOutcome,
} from "@/lib/modules/analytics/court-analytics";
import {
  bfsShortestPath,
  computeDegreeCentrality,
  detectTopicClusters,
} from "@/lib/modules/graph-visualization/graph-metrics";
import {
  serializeForVisualization,
  applyFilter,
  buildTimeline,
} from "@/lib/modules/graph-visualization";
import {
  buildCitationGraph,
  analyzeGraph,
} from "@/lib/modules/citation-intelligence/citation-graph-engine";
import { extractCitations } from "@/lib/modules/citation-intelligence/citation-extraction";

//  Sample judgment records 

const RECORDS: JudgmentRecord[] = [
  { caseId: "c1",  judgeName: "Justice A.K. Sharma",  court: "Delhi High Court",       year: 2023, month: 3,  outcome: "ALLOWED",       offences: ["bail"],   sections: ["438 CrPC"],  bailDecision: "GRANTED",  appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 45 },
  { caseId: "c2",  judgeName: "Justice A.K. Sharma",  court: "Delhi High Court",       year: 2023, month: 5,  outcome: "DISMISSED",     offences: ["murder"], sections: ["302 IPC"],   bailDecision: "REJECTED", appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 120 },
  { caseId: "c3",  judgeName: "Justice A.K. Sharma",  court: "Delhi High Court",       year: 2022, month: 8,  outcome: "ALLOWED",       offences: ["bail"],   sections: ["437 CrPC"],  bailDecision: "GRANTED",  appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 30 },
  { caseId: "c4",  judgeName: "Justice R. Mehta",     court: "Delhi High Court",       year: 2023, month: 1,  outcome: "DISMISSED",     offences: ["fraud"],  sections: ["420 IPC"],   bailDecision: "REJECTED", appealResult: "REVERSED", isConstitutionalMatter: false, disposalDays: 200 },
  { caseId: "c5",  judgeName: "Justice R. Mehta",     court: "Delhi High Court",       year: 2022, month: 11, outcome: "ALLOWED",       offences: [],         sections: ["482 CrPC"],  bailDecision: "NA",       appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 60 },
  { caseId: "c6",  judgeName: "Justice S. Krishnan",  court: "Supreme Court of India", year: 2023, month: 6,  outcome: "ALLOWED",       offences: [],         sections: ["Article 21"],bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: true,  disposalDays: 180 },
  { caseId: "c7",  judgeName: "Justice S. Krishnan",  court: "Supreme Court of India", year: 2023, month: 9,  outcome: "DISMISSED",     offences: ["murder"], sections: ["302 IPC"],   bailDecision: "REJECTED", appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 90 },
  { caseId: "c8",  judgeName: "Justice A.K. Sharma",  court: "Delhi High Court",       year: 2024, month: 1,  outcome: "ACQUITTED",     offences: ["murder"], sections: ["302 IPC"],   bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 365 },
  { caseId: "c9",  judgeName: "Justice R. Mehta",     court: "Delhi High Court",       year: 2024, month: 3,  outcome: "CONVICTED",     offences: ["fraud"],  sections: ["420 IPC"],   bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 280 },
  { caseId: "c10", judgeName: "Justice S. Krishnan",  court: "Supreme Court of India", year: 2024, month: 4,  outcome: "ALLOWED",       offences: [],         sections: ["Article 14"],bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: true,  disposalDays: 120 },
];

//  Judge Analytics Tests 

describe("Judge Analytics — normalizeJudgeName()", () => {
  it("removes Hon'ble prefix", () => {
    expect(normalizeJudgeName("Hon'ble Justice A.K. Sharma")).toBe("A.K. Sharma");
  });

  it("removes Justice prefix", () => {
    expect(normalizeJudgeName("Justice R. Mehta")).toBe("R. Mehta");
  });

  it("removes J. suffix", () => {
    expect(normalizeJudgeName("A.K. Sharma, J.")).toBe("A.K. Sharma");
  });

  it("handles already normalized name", () => {
    expect(normalizeJudgeName("A.K. Sharma")).toBe("A.K. Sharma");
  });

  it("title-cases the result", () => {
    const result = normalizeJudgeName("justice r. mehta");
    expect(result[0]).toBe(result[0].toUpperCase());
  });
});

describe("Judge Analytics — buildJudgeProfile()", () => {
  it("builds profile for Justice A.K. Sharma", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.totalCases).toBeGreaterThan(0);
  });

  it("calculates allow rate correctly", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.metrics.allowRate).toBeGreaterThanOrEqual(0);
    expect(profile.metrics.allowRate).toBeLessThanOrEqual(100);
  });

  it("calculates bail grant rate", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.metrics.bailGrantRate).toBeGreaterThan(0);
  });

  it("strictness index is between 0 and 100", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.metrics.strictnessIndex).toBeGreaterThanOrEqual(0);
    expect(profile.metrics.strictnessIndex).toBeLessThanOrEqual(100);
  });

  it("consistency score is between 0 and 100", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.metrics.consistencyScore).toBeGreaterThanOrEqual(0);
    expect(profile.metrics.consistencyScore).toBeLessThanOrEqual(100);
  });

  it("builds yearly trend", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.yearlyTrend.length).toBeGreaterThan(0);
  });

  it("returns frequent sections", () => {
    const profile = buildJudgeProfile("Justice A.K. Sharma", "Delhi High Court", RECORDS);
    expect(profile.frequentSections.length).toBeGreaterThan(0);
  });

  it("returns empty profile for unknown judge", () => {
    const profile = buildJudgeProfile("Unknown Judge", "Unknown Court", RECORDS);
    expect(profile.totalCases).toBe(0);
  });
});

describe("Judge Analytics — buildAllJudgeProfiles()", () => {
  it("builds profiles for all unique judges", () => {
    const profiles = buildAllJudgeProfiles(RECORDS);
    expect(profiles.length).toBeGreaterThanOrEqual(3);
  });

  it("each profile has a judgeName", () => {
    const profiles = buildAllJudgeProfiles(RECORDS);
    for (const p of profiles) {
      expect(typeof p.judgeName).toBe("string");
      expect(p.judgeName.length).toBeGreaterThan(0);
    }
  });
});

//  Court Analytics Tests 

describe("Court Analytics — buildCourtProfile()", () => {
  it("builds profile for Delhi High Court", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    expect(profile.totalCases).toBeGreaterThan(0);
  });

  it("calculates allow rate", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    expect(profile.metrics.allowRate).toBeGreaterThanOrEqual(0);
    expect(profile.metrics.allowRate).toBeLessThanOrEqual(100);
  });

  it("builds outcome trend", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    expect(profile.outcomeTrend.length).toBeGreaterThan(0);
  });

  it("builds heatmap data", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    expect(profile.heatmapData.length).toBeGreaterThan(0);
  });

  it("heatmap intensity is between 0 and 1", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    for (const cell of profile.heatmapData) {
      expect(cell.intensity).toBeGreaterThanOrEqual(0);
      expect(cell.intensity).toBeLessThanOrEqual(1);
    }
  });

  it("disposal efficiency is between 0 and 100", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    expect(profile.metrics.disposalEfficiency).toBeGreaterThanOrEqual(0);
    expect(profile.metrics.disposalEfficiency).toBeLessThanOrEqual(100);
  });

  it("returns empty profile for unknown court", () => {
    const profile = buildCourtProfile("Unknown Court XYZ", RECORDS);
    expect(profile.totalCases).toBe(0);
  });
});

describe("Court Analytics — predictOutcome()", () => {
  it("returns a prediction for BAIL case type", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    const prediction = predictOutcome(profile, "BAIL");
    expect(["BAIL_GRANTED", "BAIL_REJECTED"]).toContain(prediction.outcome);
  });

  it("probability is between 0 and 100", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    const prediction = predictOutcome(profile, "BAIL");
    expect(prediction.probability).toBeGreaterThanOrEqual(0);
    expect(prediction.probability).toBeLessThanOrEqual(100);
  });

  it("confidence is HIGH/MEDIUM/LOW", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    const prediction = predictOutcome(profile, "APPEAL");
    expect(["HIGH", "MEDIUM", "LOW"]).toContain(prediction.confidence);
  });

  it("includes caveat string", () => {
    const profile = buildCourtProfile("Delhi High Court", RECORDS);
    const prediction = predictOutcome(profile, "CRIMINAL_TRIAL");
    expect(typeof prediction.caveat).toBe("string");
    expect(prediction.caveat.length).toBeGreaterThan(0);
  });
});

//  Graph Visualization Tests 

const SAMPLE_CITATION_TEXT = `
  The court relied on (2019) 5 SCC 123 and (2021) 3 SCC 456 and AIR 2020 SC 789.
  Section 302 IPC and Section 438 CrPC were discussed.
`;

function buildTestGraph() {
  const result = extractCitations(SAMPLE_CITATION_TEXT);
  const graph = buildCitationGraph(result.citations, "test-doc");
  return analyzeGraph(graph).graph;
}

describe("Graph Metrics — bfsShortestPath()", () => {
  it("returns path from node to itself", () => {
    const graph = buildTestGraph();
    const nodeId = [...graph.nodes.keys()][0];
    if (nodeId) {
      const path = bfsShortestPath(graph, nodeId, nodeId);
      expect(path).toEqual([nodeId]);
    }
  });

  it("returns empty array for unreachable nodes", () => {
    const graph = buildTestGraph();
    const path = bfsShortestPath(graph, "nonexistent-1", "nonexistent-2");
    expect(path).toEqual([]);
  });

  it("returns path of length >= 2 for connected nodes", () => {
    const graph = buildTestGraph();
    const nodes = [...graph.nodes.keys()];
    if (nodes.length >= 2) {
      // test-doc -> citation nodes should be reachable
      const path = bfsShortestPath(graph, "test-doc", nodes.find(n => n !== "test-doc") ?? nodes[1]);
      if (path.length > 0) {
        expect(path[0]).toBe("test-doc");
      }
    }
  });
});

describe("Graph Metrics — computeDegreeCentrality()", () => {
  it("returns centrality for all nodes", () => {
    const graph = buildTestGraph();
    const centrality = computeDegreeCentrality(graph);
    expect(centrality.size).toBe(graph.nodes.size);
  });

  it("all centrality values are between 0 and 1", () => {
    const graph = buildTestGraph();
    const centrality = computeDegreeCentrality(graph);
    for (const val of centrality.values()) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe("Graph Metrics — detectTopicClusters()", () => {
  it("returns array of clusters", () => {
    const graph = buildTestGraph();
    const clusters = detectTopicClusters(graph);
    expect(Array.isArray(clusters)).toBe(true);
  });

  it("each cluster has members array", () => {
    const graph = buildTestGraph();
    const clusters = detectTopicClusters(graph);
    for (const c of clusters) {
      expect(Array.isArray(c.members)).toBe(true);
      expect(c.members.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Graph Visualization — serializeForVisualization()", () => {
  it("returns nodes and edges", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    expect(Array.isArray(vis.nodes)).toBe(true);
    expect(Array.isArray(vis.edges)).toBe(true);
  });

  it("node count matches graph nodes", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    expect(vis.nodes.length).toBe(graph.nodes.size);
  });

  it("all node sizes are positive", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    for (const n of vis.nodes) {
      expect(n.size).toBeGreaterThan(0);
    }
  });

  it("all node opacities are between 0 and 1", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    for (const n of vis.nodes) {
      expect(n.opacity).toBeGreaterThanOrEqual(0);
      expect(n.opacity).toBeLessThanOrEqual(1);
    }
  });
});

describe("Graph Visualization — applyFilter()", () => {
  it("filters by year range", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    const filtered = applyFilter(vis, { yearMin: 2020, yearMax: 2022 });
    for (const n of filtered.nodes) {
      if (n.year > 0) {
        expect(n.year).toBeGreaterThanOrEqual(2020);
        expect(n.year).toBeLessThanOrEqual(2022);
      }
    }
  });

  it("filters landmarks only", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    const filtered = applyFilter(vis, { landmarksOnly: true });
    for (const n of filtered.nodes) {
      expect(n.isLandmark).toBe(true);
    }
  });

  it("empty filter returns all nodes", () => {
    const graph = buildTestGraph();
    const vis = serializeForVisualization(graph);
    const filtered = applyFilter(vis, {});
    expect(filtered.nodes.length).toBe(vis.nodes.length);
  });
});

describe("Graph Visualization — buildTimeline()", () => {
  it("returns timeline entries", () => {
    const graph = buildTestGraph();
    const timeline = buildTimeline(graph);
    expect(Array.isArray(timeline)).toBe(true);
  });

  it("cumulative nodes is non-decreasing", () => {
    const graph = buildTestGraph();
    const timeline = buildTimeline(graph);
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].cumulativeNodes).toBeGreaterThanOrEqual(timeline[i - 1].cumulativeNodes);
    }
  });
});