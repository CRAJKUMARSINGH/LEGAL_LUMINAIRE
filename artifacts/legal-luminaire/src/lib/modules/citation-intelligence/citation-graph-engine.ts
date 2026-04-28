/**
 * Citation Graph Engine
 * Builds a directed citation graph and computes PageRank-style authority scores
 * Part of Phase 3: Citation Intelligence
 */

import { featureFlags } from "@/config/featureFlags";
import type { ExtractedCitation } from "./citation-extraction";

// --- Types --------------------------------------------------------------------

export interface GraphNode {
  id: string;
  caseName: string;
  year: number;
  court: string;
  reporter: string;
  pageRank: number;
  inDegree: number;
  outDegree: number;
  cluster?: string;
  isBridge: boolean;
  isLandmark: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  year: number;
}

export interface CitationGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  adjacency: Map<string, Set<string>>;
  reverseAdjacency: Map<string, Set<string>>;
}

export interface GraphAnalysis {
  graph: CitationGraph;
  pageRanks: Map<string, number>;
  clusters: Map<string, string[]>;
  bridgeCases: string[];
  landmarkCases: string[];
  stats: GraphStats;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgInDegree: number;
  avgOutDegree: number;
  density: number;
  clusterCount: number;
  landmarkCount: number;
  bridgeCount: number;
}

// --- Court Hierarchy Weights --------------------------------------------------

const COURT_WEIGHTS: Record<string, number> = {
  "Supreme Court of India": 1.0,
  "Delhi High Court": 0.75,
  "Bombay High Court": 0.75,
  "Calcutta High Court": 0.75,
  "Madras High Court": 0.75,
  "Allahabad High Court": 0.70,
  "Karnataka High Court": 0.70,
  "Gujarat High Court": 0.70,
  "Rajasthan High Court": 0.65,
  "Punjab and Haryana High Court": 0.65,
  "Sessions Court": 0.40,
  "Magistrate Court": 0.30,
};

function getCourtWeight(court: string): number {
  for (const [key, weight] of Object.entries(COURT_WEIGHTS)) {
    if (court.toLowerCase().includes(key.toLowerCase())) return weight;
  }
  return 0.5; // default for unknown courts
}

// --- Graph Builder ------------------------------------------------------------

/**
 * Build a citation graph from a list of extracted citations.
 * Each citation is a node; edges represent "cited by" relationships.
 */
export function buildCitationGraph(
  citations: ExtractedCitation[],
  citingDocumentId?: string
): CitationGraph {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const adjacency = new Map<string, Set<string>>();
  const reverseAdjacency = new Map<string, Set<string>>();

  // Create nodes for all citations
  for (const c of citations) {
    if (!nodes.has(c.id)) {
      nodes.set(c.id, {
        id: c.id,
        caseName: c.caseName ?? c.raw,
        year: c.year,
        court: c.court ?? "Unknown",
        reporter: c.reporter,
        pageRank: 1.0,
        inDegree: 0,
        outDegree: 0,
        isBridge: false,
        isLandmark: false,
      });
    }
    if (!adjacency.has(c.id)) adjacency.set(c.id, new Set());
    if (!reverseAdjacency.has(c.id)) reverseAdjacency.set(c.id, new Set());
  }

  // If we have a citing document, create edges from it to all citations
  if (citingDocumentId && citations.length > 0) {
    if (!nodes.has(citingDocumentId)) {
      nodes.set(citingDocumentId, {
        id: citingDocumentId,
        caseName: citingDocumentId,
        year: new Date().getFullYear(),
        court: "Current Document",
        reporter: "UNKNOWN",
        pageRank: 1.0,
        inDegree: 0,
        outDegree: 0,
        isBridge: false,
        isLandmark: false,
      });
      adjacency.set(citingDocumentId, new Set());
      reverseAdjacency.set(citingDocumentId, new Set());
    }

    for (const c of citations) {
      const weight = getCourtWeight(c.court ?? "Unknown") * c.confidence;
      edges.push({ source: citingDocumentId, target: c.id, weight, year: c.year });
      adjacency.get(citingDocumentId)!.add(c.id);
      reverseAdjacency.get(c.id)!.add(citingDocumentId);

      const sourceNode = nodes.get(citingDocumentId)!;
      const targetNode = nodes.get(c.id)!;
      sourceNode.outDegree++;
      targetNode.inDegree++;
    }
  }

  return { nodes, edges, adjacency, reverseAdjacency };
}

/**
 * Merge multiple citation graphs into one
 */
export function mergeGraphs(graphs: CitationGraph[]): CitationGraph {
  const merged: CitationGraph = {
    nodes: new Map(),
    edges: [],
    adjacency: new Map(),
    reverseAdjacency: new Map(),
  };

  for (const g of graphs) {
    for (const [id, node] of g.nodes) {
      if (merged.nodes.has(id)) {
        // Merge degree counts
        const existing = merged.nodes.get(id)!;
        existing.inDegree += node.inDegree;
        existing.outDegree += node.outDegree;
      } else {
        merged.nodes.set(id, { ...node });
        merged.adjacency.set(id, new Set());
        merged.reverseAdjacency.set(id, new Set());
      }
    }

    for (const edge of g.edges) {
      // Avoid duplicate edges
      const exists = merged.edges.some(
        e => e.source === edge.source && e.target === edge.target
      );
      if (!exists) {
        merged.edges.push(edge);
        merged.adjacency.get(edge.source)?.add(edge.target);
        merged.reverseAdjacency.get(edge.target)?.add(edge.source);
      }
    }
  }

  return merged;
}

//  PageRank 

const DAMPING_FACTOR = 0.85;
const MAX_ITERATIONS = 50;
const CONVERGENCE_THRESHOLD = 1e-6;

/**
 * Compute PageRank scores for all nodes in the graph.
 * Uses the standard iterative algorithm with damping factor 0.85.
 */
export function computePageRank(graph: CitationGraph): Map<string, number> {
  const N = graph.nodes.size;
  if (N === 0) return new Map();

  const ranks = new Map<string, number>();
  const initial = 1.0 / N;

  // Initialize
  for (const id of graph.nodes.keys()) {
    ranks.set(id, initial);
  }

  // Iterative computation
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const newRanks = new Map<string, number>();
    let delta = 0;

    for (const id of graph.nodes.keys()) {
      const inbound = graph.reverseAdjacency.get(id) ?? new Set();
      let sum = 0;

      for (const sourceId of inbound) {
        const sourceOutDegree = graph.adjacency.get(sourceId)?.size ?? 1;
        const sourceRank = ranks.get(sourceId) ?? 0;
        // Weight by court authority
        const courtWeight = getCourtWeight(graph.nodes.get(sourceId)?.court ?? "Unknown");
        sum += (sourceRank * courtWeight) / sourceOutDegree;
      }

      const newRank = (1 - DAMPING_FACTOR) / N + DAMPING_FACTOR * sum;
      newRanks.set(id, newRank);
      delta += Math.abs(newRank - (ranks.get(id) ?? 0));
    }

    for (const [id, rank] of newRanks) {
      ranks.set(id, rank);
    }

    if (delta < CONVERGENCE_THRESHOLD) break;
  }

  // Normalize to 0-1 range
  const maxRank = Math.max(...ranks.values());
  if (maxRank > 0) {
    for (const [id, rank] of ranks) {
      ranks.set(id, rank / maxRank);
    }
  }

  return ranks;
}

//  Cluster Detection 

/**
 * Detect citation clusters using Union-Find (connected components)
 */
export function detectClusters(graph: CitationGraph): Map<string, string[]> {
  const parent = new Map<string, string>();

  function find(x: string): string {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }

  function union(x: string, y: string): void {
    const px = find(x), py = find(y);
    if (px !== py) parent.set(px, py);
  }

  // Initialize all nodes
  for (const id of graph.nodes.keys()) find(id);

  // Union connected nodes
  for (const edge of graph.edges) {
    union(edge.source, edge.target);
  }

  // Group by cluster root
  const clusters = new Map<string, string[]>();
  for (const id of graph.nodes.keys()) {
    const root = find(id);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root)!.push(id);
  }

  return clusters;
}

//  Bridge Case Detection 

/**
 * Find bridge cases — nodes whose removal would disconnect the graph.
 * Uses a simplified betweenness-based heuristic.
 */
export function findBridgeCases(graph: CitationGraph): string[] {
  const bridges: string[] = [];

  for (const [id, node] of graph.nodes) {
    // A node is a bridge candidate if it has both in and out edges
    // and connects otherwise disconnected clusters
    if (node.inDegree > 0 && node.outDegree > 0) {
      const inbound = graph.reverseAdjacency.get(id) ?? new Set();
      const outbound = graph.adjacency.get(id) ?? new Set();

      // Check if inbound and outbound sets are disjoint (no direct connection)
      let hasDirectConnection = false;
      for (const src of inbound) {
        if (outbound.has(src)) { hasDirectConnection = true; break; }
      }

      if (!hasDirectConnection && inbound.size >= 2 && outbound.size >= 2) {
        bridges.push(id);
      }
    }
  }

  return bridges;
}

//  Full Analysis 

/**
 * Run complete graph analysis: PageRank + clusters + bridges + landmarks
 */
export function analyzeGraph(graph: CitationGraph): GraphAnalysis {
  if (!featureFlags.enableCitationGraph) {
    return {
      graph,
      pageRanks: new Map(),
      clusters: new Map(),
      bridgeCases: [],
      landmarkCases: [],
      stats: buildGraphStats(graph, new Map(), new Map(), [], []),
    };
  }

  const pageRanks = computePageRank(graph);
  const clusters = detectClusters(graph);
  const bridgeCases = findBridgeCases(graph);

  // Landmark = top 10% by PageRank with high in-degree
  const sortedByRank = [...pageRanks.entries()].sort((a, b) => b[1] - a[1]);
  const top10pct = Math.max(1, Math.floor(sortedByRank.length * 0.1));
  const landmarkCases = sortedByRank
    .slice(0, top10pct)
    .filter(([id]) => (graph.nodes.get(id)?.inDegree ?? 0) >= 2)
    .map(([id]) => id);

  // Update node metadata
  for (const [id, rank] of pageRanks) {
    const node = graph.nodes.get(id);
    if (node) {
      node.pageRank = rank;
      node.isBridge = bridgeCases.includes(id);
      node.isLandmark = landmarkCases.includes(id);
    }
  }

  // Assign cluster labels to nodes
  let clusterIndex = 0;
  for (const [root, members] of clusters) {
    const label = `Cluster-${++clusterIndex}`;
    for (const memberId of members) {
      const node = graph.nodes.get(memberId);
      if (node) node.cluster = label;
    }
  }

  return {
    graph,
    pageRanks,
    clusters,
    bridgeCases,
    landmarkCases,
    stats: buildGraphStats(graph, pageRanks, clusters, bridgeCases, landmarkCases),
  };
}

function buildGraphStats(
  graph: CitationGraph,
  _pageRanks: Map<string, number>,
  clusters: Map<string, string[]>,
  bridgeCases: string[],
  landmarkCases: string[]
): GraphStats {
  const N = graph.nodes.size;
  const E = graph.edges.length;
  let totalIn = 0, totalOut = 0;

  for (const node of graph.nodes.values()) {
    totalIn += node.inDegree;
    totalOut += node.outDegree;
  }

  return {
    nodeCount: N,
    edgeCount: E,
    avgInDegree: N > 0 ? totalIn / N : 0,
    avgOutDegree: N > 0 ? totalOut / N : 0,
    density: N > 1 ? E / (N * (N - 1)) : 0,
    clusterCount: clusters.size,
    landmarkCount: landmarkCases.length,
    bridgeCount: bridgeCases.length,
  };
}

//  Serialization 

/** Convert graph to a plain object for JSON serialization / UI rendering */
export function serializeGraph(graph: CitationGraph): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  return {
    nodes: Array.from(graph.nodes.values()),
    edges: graph.edges,
  };
}
