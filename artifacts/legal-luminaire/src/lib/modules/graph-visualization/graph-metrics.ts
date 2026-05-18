/**
 * Graph Metrics Module
 * Advanced graph algorithms: betweenness centrality, shortest path, topic clustering
 * Part of Phase 6: Graph Visualization
 */

import type { CitationGraph, GraphNode, GraphEdge } from "@/lib/modules/citation-intelligence/citation-graph-engine";

//  Types 

export interface GraphMetrics {
  betweenness: Map<string, number>;
  closeness: Map<string, number>;
  degree: Map<string, number>;
  topByBetweenness: Array<{ id: string; score: number }>;
  topByDegree: Array<{ id: string; score: number }>;
  shortestPaths: Map<string, Map<string, string[]>>;
  diameter: number;
  avgPathLength: number;
}

export interface InfluentialPath {
  path: string[];
  totalWeight: number;
  description: string;
}

export interface TopicCluster {
  id: string;
  label: string;
  members: string[];
  centroid: string;
  cohesion: number;
}

//  BFS Shortest Path 

export function bfsShortestPath(
  graph: CitationGraph,
  source: string,
  target: string
): string[] {
  if (source === target) return [source];
  const visited = new Set<string>([source]);
  const queue: Array<{ node: string; path: string[] }> = [{ node: source, path: [source] }];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    const neighbors = graph.adjacency.get(node) ?? new Set();
    for (const neighbor of neighbors) {
      if (neighbor === target) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }
  return []; // no path found
}

/**
 * Find the most influential citation path between two cases
 */
export function findInfluentialPath(
  graph: CitationGraph,
  source: string,
  target: string
): InfluentialPath {
  const path = bfsShortestPath(graph, source, target);
  if (path.length === 0) {
    return { path: [], totalWeight: 0, description: "No citation path found between these cases" };
  }

  let totalWeight = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = graph.edges.find(e => e.source === path[i] && e.target === path[i + 1]);
    totalWeight += edge?.weight ?? 0;
  }

  const sourceNode = graph.nodes.get(source);
  const targetNode = graph.nodes.get(target);
  const description = `${path.length - 1} citation step${path.length > 2 ? "s" : ""} from "${sourceNode?.caseName ?? source}" to "${targetNode?.caseName ?? target}"`;

  return { path, totalWeight: Math.round(totalWeight * 100) / 100, description };
}

//  Degree Centrality 

export function computeDegreeCentrality(graph: CitationGraph): Map<string, number> {
  const N = graph.nodes.size;
  if (N <= 1) return new Map();
  const degree = new Map<string, number>();
  for (const [id, node] of graph.nodes) {
    degree.set(id, (node.inDegree + node.outDegree) / (2 * (N - 1)));
  }
  return degree;
}

//  Betweenness Centrality (Brandes algorithm, simplified) 

export function computeBetweennessCentrality(graph: CitationGraph): Map<string, number> {
  const nodes = [...graph.nodes.keys()];
  const betweenness = new Map<string, number>(nodes.map(n => [n, 0]));

  for (const source of nodes) {
    const stack: string[] = [];
    const pred = new Map<string, string[]>(nodes.map(n => [n, []]));
    const sigma = new Map<string, number>(nodes.map(n => [n, 0]));
    sigma.set(source, 1);
    const dist = new Map<string, number>(nodes.map(n => [n, -1]));
    dist.set(source, 0);
    const queue: string[] = [source];

    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      for (const w of (graph.adjacency.get(v) ?? new Set())) {
        if (dist.get(w) === -1) {
          queue.push(w);
          dist.set(w, dist.get(v)! + 1);
        }
        if (dist.get(w) === dist.get(v)! + 1) {
          sigma.set(w, sigma.get(w)! + sigma.get(v)!);
          pred.get(w)!.push(v);
        }
      }
    }

    const delta = new Map<string, number>(nodes.map(n => [n, 0]));
    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of pred.get(w)!) {
        const coeff = (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!);
        delta.set(v, delta.get(v)! + coeff);
      }
      if (w !== source) {
        betweenness.set(w, betweenness.get(w)! + delta.get(w)!);
      }
    }
  }

  // Normalize
  const N = nodes.length;
  const norm = N > 2 ? 1 / ((N - 1) * (N - 2)) : 1;
  for (const [id, val] of betweenness) {
    betweenness.set(id, Math.round(val * norm * 1000) / 1000);
  }

  return betweenness;
}

//  Topic Clustering 

/**
 * Simple topic clustering based on shared court + decade
 */
export function detectTopicClusters(graph: CitationGraph): TopicCluster[] {
  const clusterMap = new Map<string, string[]>();

  for (const [id, node] of graph.nodes) {
    const decade = `${Math.floor(node.year / 10) * 10}s`;
    const courtShort = node.court.includes("Supreme") ? "SC" : node.court.includes("High") ? "HC" : "LC";
    const key = `${courtShort}-${decade}`;
    if (!clusterMap.has(key)) clusterMap.set(key, []);
    clusterMap.get(key)!.push(id);
  }

  const clusters: TopicCluster[] = [];
  let idx = 0;
  for (const [key, members] of clusterMap) {
    if (members.length < 2) continue;
    // Centroid = member with highest pageRank
    const centroid = members.reduce((best, id) => {
      const bRank = graph.nodes.get(best)?.pageRank ?? 0;
      const iRank = graph.nodes.get(id)?.pageRank ?? 0;
      return iRank > bRank ? id : best;
    }, members[0]);

    // Cohesion = internal edges / possible internal edges
    const internalEdges = graph.edges.filter(e => members.includes(e.source) && members.includes(e.target)).length;
    const possible = members.length * (members.length - 1);
    const cohesion = possible > 0 ? Math.round((internalEdges / possible) * 100) / 100 : 0;

    clusters.push({ id: `cluster-${++idx}`, label: key, members, centroid, cohesion });
  }

  return clusters.sort((a, b) => b.members.length - a.members.length);
}

//  Full Metrics 

export function computeGraphMetrics(graph: CitationGraph): GraphMetrics {
  const betweenness = computeBetweennessCentrality(graph);
  const degree = computeDegreeCentrality(graph);
  const closeness = new Map<string, number>(); // placeholder — expensive for large graphs

  const topByBetweenness = [...betweenness.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, score]) => ({ id, score }));

  const topByDegree = [...degree.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, score]) => ({ id, score }));

  // Diameter: longest shortest path (sample-based for performance)
  let diameter = 0;
  let totalPathLength = 0;
  let pathCount = 0;
  const nodeIds = [...graph.nodes.keys()].slice(0, 20); // sample
  for (const src of nodeIds) {
    for (const tgt of nodeIds) {
      if (src === tgt) continue;
      const path = bfsShortestPath(graph, src, tgt);
      if (path.length > 0) {
        diameter = Math.max(diameter, path.length - 1);
        totalPathLength += path.length - 1;
        pathCount++;
      }
    }
  }

  return {
    betweenness,
    closeness,
    degree,
    topByBetweenness,
    topByDegree,
    shortestPaths: new Map(),
    diameter,
    avgPathLength: pathCount > 0 ? Math.round((totalPathLength / pathCount) * 10) / 10 : 0,
  };
}