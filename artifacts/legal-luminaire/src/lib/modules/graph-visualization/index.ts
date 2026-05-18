/**
 * Graph Visualization Module — Integration Index
 * Serializes graph data for D3/Cytoscape rendering + Neo4j schema
 * Part of Phase 6: Graph Visualization
 */

import { featureFlags } from "@/config/featureFlags";
import type { CitationGraph, GraphNode, GraphEdge } from "@/lib/modules/citation-intelligence/citation-graph-engine";
import { computeGraphMetrics, detectTopicClusters, findInfluentialPath, type GraphMetrics, type TopicCluster, type InfluentialPath } from "./graph-metrics";

//  Visualization Types 

export interface VisNode {
  id: string;
  label: string;
  court: string;
  year: number;
  pageRank: number;
  inDegree: number;
  outDegree: number;
  cluster?: string;
  isLandmark: boolean;
  isBridge: boolean;
  // Visual properties
  size: number;       // 8-40px based on pageRank
  color: string;      // hex based on court level
  opacity: number;    // 0.4-1.0 based on relevance
}

export interface VisEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  year: number;
  // Visual properties
  width: number;      // 1-5px based on weight
  opacity: number;
}

export interface VisGraph {
  nodes: VisNode[];
  edges: VisEdge[];
  metadata: VisMetadata;
}

export interface VisMetadata {
  nodeCount: number;
  edgeCount: number;
  clusterCount: number;
  landmarkCount: number;
  bridgeCount: number;
  yearRange: [number, number];
  courts: string[];
}

export interface GraphVisualizationResult {
  visGraph: VisGraph;
  metrics: GraphMetrics;
  clusters: TopicCluster[];
  timelineData: TimelineEntry[];
  filterOptions: FilterOptions;
}

export interface TimelineEntry {
  year: number;
  nodes: string[];
  edgesAdded: number;
  cumulativeNodes: number;
}

export interface FilterOptions {
  courts: string[];
  yearMin: number;
  yearMax: number;
  clusters: string[];
}

//  Color Mapping 

const COURT_COLORS: Record<string, string> = {
  SUPREME: "#1d4ed8",   // blue-700
  HIGH:    "#0891b2",   // cyan-600
  SESSIONS:"#059669",   // emerald-600
  MAGISTRATE: "#d97706", // amber-600
  TRIBUNAL: "#7c3aed",  // violet-600
  UNKNOWN: "#6b7280",   // gray-500
};

function getCourtColor(court: string): string {
  if (court.toLowerCase().includes("supreme")) return COURT_COLORS.SUPREME;
  if (court.toLowerCase().includes("high")) return COURT_COLORS.HIGH;
  if (court.toLowerCase().includes("sessions")) return COURT_COLORS.SESSIONS;
  if (court.toLowerCase().includes("magistrate")) return COURT_COLORS.MAGISTRATE;
  if (court.toLowerCase().includes("tribunal")) return COURT_COLORS.TRIBUNAL;
  return COURT_COLORS.UNKNOWN;
}

//  Node Sizing 

function getNodeSize(pageRank: number, isLandmark: boolean): number {
  const base = 8 + pageRank * 32;
  return Math.round(isLandmark ? Math.min(40, base * 1.3) : Math.min(36, base));
}

//  Graph Serializer 

export function serializeForVisualization(graph: CitationGraph): VisGraph {
  const nodes: VisNode[] = [];
  const edges: VisEdge[] = [];

  for (const [id, node] of graph.nodes) {
    nodes.push({
      id,
      label: node.caseName.length > 40 ? node.caseName.slice(0, 37) + "..." : node.caseName,
      court: node.court,
      year: node.year,
      pageRank: node.pageRank,
      inDegree: node.inDegree,
      outDegree: node.outDegree,
      cluster: node.cluster,
      isLandmark: node.isLandmark,
      isBridge: node.isBridge,
      size: getNodeSize(node.pageRank, node.isLandmark),
      color: getCourtColor(node.court),
      opacity: 0.4 + node.pageRank * 0.6,
    });
  }

  for (let i = 0; i < graph.edges.length; i++) {
    const e = graph.edges[i];
    edges.push({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      weight: e.weight,
      year: e.year,
      width: Math.max(1, Math.round(e.weight * 5)),
      opacity: 0.3 + e.weight * 0.5,
    });
  }

  const years = nodes.map(n => n.year).filter(y => y > 0);
  const courts = [...new Set(nodes.map(n => n.court))];
  const clusters = [...new Set(nodes.map(n => n.cluster).filter(Boolean))] as string[];

  return {
    nodes,
    edges,
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      clusterCount: clusters.length,
      landmarkCount: nodes.filter(n => n.isLandmark).length,
      bridgeCount: nodes.filter(n => n.isBridge).length,
      yearRange: years.length > 0 ? [Math.min(...years), Math.max(...years)] : [0, 0],
      courts,
    },
  };
}

//  Timeline Builder 

export function buildTimeline(graph: CitationGraph): TimelineEntry[] {
  const byYear = new Map<number, string[]>();
  for (const [id, node] of graph.nodes) {
    if (!byYear.has(node.year)) byYear.set(node.year, []);
    byYear.get(node.year)!.push(id);
  }

  const sortedYears = [...byYear.keys()].sort();
  let cumulative = 0;
  return sortedYears.map(year => {
    const nodes = byYear.get(year)!;
    cumulative += nodes.length;
    const edgesAdded = graph.edges.filter(e => e.year === year).length;
    return { year, nodes, edgesAdded, cumulativeNodes: cumulative };
  });
}

//  Filter Application 

export interface GraphFilter {
  courts?: string[];
  yearMin?: number;
  yearMax?: number;
  minPageRank?: number;
  landmarksOnly?: boolean;
  clusterId?: string;
}

export function applyFilter(visGraph: VisGraph, filter: GraphFilter): VisGraph {
  let nodes = visGraph.nodes;

  if (filter.courts && filter.courts.length > 0) {
    nodes = nodes.filter(n => filter.courts!.some(c => n.court.toLowerCase().includes(c.toLowerCase())));
  }
  if (filter.yearMin) nodes = nodes.filter(n => n.year >= filter.yearMin!);
  if (filter.yearMax) nodes = nodes.filter(n => n.year <= filter.yearMax!);
  if (filter.minPageRank) nodes = nodes.filter(n => n.pageRank >= filter.minPageRank!);
  if (filter.landmarksOnly) nodes = nodes.filter(n => n.isLandmark);
  if (filter.clusterId) nodes = nodes.filter(n => n.cluster === filter.clusterId);

  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = visGraph.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

  return { ...visGraph, nodes, edges, metadata: { ...visGraph.metadata, nodeCount: nodes.length, edgeCount: edges.length } };
}

//  Neo4j Schema 

export const NEO4J_SCHEMA = {
  nodeTypes: {
    Case: { properties: ["case_id", "title", "court", "year", "date", "summary", "citation_count", "influence_score", "pagerank"] },
    Judge: { properties: ["judge_id", "name", "normalized_name"] },
    Court: { properties: ["court_id", "name", "level"] },
    Statute: { properties: ["name", "act", "section"] },
    Topic: { properties: ["name", "category"] },
  },
  relationships: [
    { type: "CITES", from: "Case", to: "Case", properties: ["weight", "year"] },
    { type: "HEARD_BY", from: "Case", to: "Judge", properties: [] },
    { type: "IN_COURT", from: "Case", to: "Court", properties: [] },
    { type: "REFERS_TO", from: "Case", to: "Statute", properties: ["section"] },
    { type: "HAS_TOPIC", from: "Case", to: "Topic", properties: ["confidence"] },
    { type: "OVERRULES", from: "Case", to: "Case", properties: ["year"] },
    { type: "DISTINGUISHES", from: "Case", to: "Case", properties: ["year"] },
  ],
  cypherExamples: {
    topCitedCases: "MATCH (c:Case)<-[:CITES]-(other:Case) RETURN c.title, count(other) AS citations ORDER BY citations DESC LIMIT 10",
    citationPath: "MATCH path = shortestPath((a:Case {case_id: $id1})-[:CITES*]->(b:Case {case_id: $id2})) RETURN path",
    judgeDecisions: "MATCH (c:Case)-[:HEARD_BY]->(j:Judge {name: $name}) RETURN c.title, c.year ORDER BY c.year DESC",
    clusterCases: "MATCH (c:Case)-[:HAS_TOPIC]->(t:Topic {name: $topic}) RETURN c.title, c.year ORDER BY c.year",
  },
} as const;

//  Main Entry Point 

export function buildVisualization(graph: CitationGraph): GraphVisualizationResult {
  if (!featureFlags.enableGraphVisualization) {
    return {
      visGraph: { nodes: [], edges: [], metadata: { nodeCount: 0, edgeCount: 0, clusterCount: 0, landmarkCount: 0, bridgeCount: 0, yearRange: [0, 0], courts: [] } },
      metrics: { betweenness: new Map(), closeness: new Map(), degree: new Map(), topByBetweenness: [], topByDegree: [], shortestPaths: new Map(), diameter: 0, avgPathLength: 0 },
      clusters: [],
      timelineData: [],
      filterOptions: { courts: [], yearMin: 0, yearMax: 0, clusters: [] },
    };
  }

  const visGraph = serializeForVisualization(graph);
  const metrics = computeGraphMetrics(graph);
  const clusters = detectTopicClusters(graph);
  const timelineData = buildTimeline(graph);

  const filterOptions: FilterOptions = {
    courts: visGraph.metadata.courts,
    yearMin: visGraph.metadata.yearRange[0],
    yearMax: visGraph.metadata.yearRange[1],
    clusters: clusters.map(c => c.id),
  };

  return { visGraph, metrics, clusters, timelineData, filterOptions };
}

export { findInfluentialPath };
export type { GraphMetrics, TopicCluster, InfluentialPath };