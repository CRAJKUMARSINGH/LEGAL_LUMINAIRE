/**
 * Citation Graph Visualization Panel
 * React UI for Phase 6: Interactive citation graph with filters + timeline
 * CSS-based visualization (no external deps required)
 */

import React, { useState, useMemo, useCallback } from "react";
import { featureFlags } from "@/config/featureFlags";
import {
  buildVisualization,
  applyFilter,
  type VisGraph,
  type VisNode,
  type GraphFilter,
  type GraphVisualizationResult,
} from "@/lib/modules/graph-visualization";
import {
  runCitationIntelligence,
  buildCitationGraph,
  analyzeGraph,
} from "@/lib/modules/citation-intelligence";

//  Legend 

const COURT_LEGEND = [
  { label: "Supreme Court", color: "#1d4ed8" },
  { label: "High Court",    color: "#0891b2" },
  { label: "Sessions",      color: "#059669" },
  { label: "Tribunal",      color: "#7c3aed" },
  { label: "Other",         color: "#6b7280" },
];

function Legend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {COURT_LEGEND.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-gray-600">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-yellow-100" />
        <span className="text-gray-600">Landmark</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-red-50" />
        <span className="text-gray-600">Bridge</span>
      </div>
    </div>
  );
}

//  Node Bubble 

function NodeBubble({ node, selected, onClick }: { node: VisNode; selected: boolean; onClick: () => void }) {
  const borderStyle = node.isLandmark
    ? "border-2 border-yellow-500"
    : node.isBridge
    ? "border-2 border-red-400"
    : "border border-gray-300";

  return (
    <button
      onClick={onClick}
      className={`rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 ${borderStyle} ${selected ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
      style={{
        width: `${node.size}px`,
        height: `${node.size}px`,
        backgroundColor: node.color,
        opacity: node.opacity,
        fontSize: `${Math.max(8, node.size / 4)}px`,
        minWidth: `${node.size}px`,
      }}
      title={`${node.label} (${node.year})\nPageRank: ${node.pageRank.toFixed(2)}\nIn: ${node.inDegree} Out: ${node.outDegree}`}
    >
      {node.inDegree}
    </button>
  );
}

//  Node Detail Panel 

function NodeDetail({ node, onClose }: { node: VisNode; onClose: () => void }) {
  return (
    <div className="absolute bottom-3 left-3 right-3 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{node.label}</p>
          <p className="text-xs text-gray-500">{node.court}  {node.year}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none"></button>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-gray-50 rounded p-1.5"><p className="font-bold text-blue-700">{node.pageRank.toFixed(2)}</p><p className="text-gray-500">PageRank</p></div>
        <div className="bg-gray-50 rounded p-1.5"><p className="font-bold text-green-700">{node.inDegree}</p><p className="text-gray-500">Cited by</p></div>
        <div className="bg-gray-50 rounded p-1.5"><p className="font-bold text-orange-600">{node.outDegree}</p><p className="text-gray-500">Cites</p></div>
      </div>
      <div className="mt-2 flex gap-2 text-xs">
        {node.isLandmark && <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full"> Landmark</span>}
        {node.isBridge && <span className="bg-red-100 text-red-700 border border-red-300 px-2 py-0.5 rounded-full"> Bridge</span>}
        {node.cluster && <span className="bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded-full">{node.cluster}</span>}
      </div>
    </div>
  );
}

//  Filter Panel 

function FilterPanel({
  options,
  filter,
  onChange,
}: {
  options: GraphVisualizationResult["filterOptions"];
  filter: GraphFilter;
  onChange: (f: GraphFilter) => void;
}) {
  return (
    <div className="p-3 border-b border-gray-200 space-y-2">
      <p className="text-xs font-semibold text-gray-700">Filters</p>
      <div className="flex flex-wrap gap-2">
        {/* Year range */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-500">Year:</span>
          <input
            type="number"
            className="w-16 border border-gray-300 rounded px-1 py-0.5 text-xs"
            placeholder={String(options.yearMin)}
            value={filter.yearMin ?? ""}
            onChange={e => onChange({ ...filter, yearMin: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            className="w-16 border border-gray-300 rounded px-1 py-0.5 text-xs"
            placeholder={String(options.yearMax)}
            value={filter.yearMax ?? ""}
            onChange={e => onChange({ ...filter, yearMax: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        {/* Landmarks only */}
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={filter.landmarksOnly ?? false}
            onChange={e => onChange({ ...filter, landmarksOnly: e.target.checked || undefined })}
          />
          <span className="text-gray-600">Landmarks only</span>
        </label>
        {/* Reset */}
        <button
          onClick={() => onChange({})}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

//  Graph Canvas (CSS bubble layout) 

function GraphCanvas({ visGraph, onNodeClick, selectedId }: {
  visGraph: VisGraph;
  onNodeClick: (node: VisNode) => void;
  selectedId: string | null;
}) {
  if (visGraph.nodes.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">No nodes to display</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-wrap gap-3 items-end justify-center min-h-32">
        {visGraph.nodes.map(node => (
          <div key={node.id} className="flex flex-col items-center gap-1">
            <NodeBubble
              node={node}
              selected={selectedId === node.id}
              onClick={() => onNodeClick(node)}
            />
            {node.size >= 20 && (
              <p className="text-xs text-gray-500 text-center max-w-16 truncate" style={{ fontSize: "9px" }}>
                {node.year}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

//  Stats Bar 

function StatsBar({ meta }: { meta: VisGraph["metadata"] }) {
  return (
    <div className="flex gap-3 text-xs text-gray-500 px-3 py-2 bg-gray-50 border-b border-gray-200">
      <span><span className="font-medium text-gray-800">{meta.nodeCount}</span> nodes</span>
      <span><span className="font-medium text-gray-800">{meta.edgeCount}</span> edges</span>
      <span><span className="font-medium text-gray-800">{meta.landmarkCount}</span> landmarks</span>
      <span><span className="font-medium text-gray-800">{meta.bridgeCount}</span> bridges</span>
      <span><span className="font-medium text-gray-800">{meta.clusterCount}</span> clusters</span>
    </div>
  );
}

//  Timeline View 

function TimelineView({ data }: { data: GraphVisualizationResult["timelineData"] }) {
  if (data.length === 0) return <p className="text-xs text-gray-400 text-center py-4">No timeline data</p>;
  const maxCumulative = Math.max(...data.map(d => d.cumulativeNodes), 1);
  return (
    <div className="p-3 space-y-1.5">
      <p className="text-xs font-semibold text-gray-700 mb-2">Citation Timeline</p>
      {data.map(entry => (
        <div key={entry.year} className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 w-10 shrink-0">{entry.year}</span>
          <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded"
              style={{ width: `${(entry.cumulativeNodes / maxCumulative) * 100}%` }}
            />
          </div>
          <span className="text-gray-500 w-16 text-right">+{entry.nodes.length} cases</span>
        </div>
      ))}
    </div>
  );
}

//  Main Panel 

type ViewMode = "graph" | "timeline" | "metrics";

interface CitationGraphVisualizationProps {
  initialText?: string;
}

export function CitationGraphVisualization({ initialText = "" }: CitationGraphVisualizationProps) {
  const [text, setText] = useState(initialText);
  const [analysed, setAnalysed] = useState(false);
  const [filter, setFilter] = useState<GraphFilter>({});
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("graph");

  const vizResult = useMemo<GraphVisualizationResult | null>(() => {
    if (!analysed || !text.trim()) return null;
    const intel = runCitationIntelligence(text);
    const graph = buildCitationGraph(intel.extraction.citations, "current-doc");
    const analysisResult = analyzeGraph(graph);
    return buildVisualization(analysisResult.graph);
  }, [analysed, text]);

  const filteredGraph = useMemo(() => {
    if (!vizResult) return null;
    return applyFilter(vizResult.visGraph, filter);
  }, [vizResult, filter]);

  const handleNodeClick = useCallback((node: VisNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  if (!featureFlags.enableGraphVisualization) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        Graph Visualization is disabled. Enable <code>VITE_FF_ENABLE_GRAPH_VISUALIZATION=true</code> to activate.
      </div>
    );
  }

  const tabs: Array<{ id: ViewMode; label: string }> = [
    { id: "graph", label: "Graph" },
    { id: "timeline", label: "Timeline" },
    { id: "metrics", label: "Metrics" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Input */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Paste judgment text to visualize citation graph</p>
        <textarea
          className="w-full h-20 text-xs border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Paste text with legal citations..."
          value={text}
          onChange={e => { setText(e.target.value); setAnalysed(false); setSelectedNode(null); }}
        />
        <button
          onClick={() => { setAnalysed(true); setSelectedNode(null); }}
          disabled={!text.trim()}
          className="mt-2 w-full py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Build Citation Graph
        </button>
      </div>

      {vizResult && filteredGraph && (
        <>
          {/* Filters */}
          <FilterPanel options={vizResult.filterOptions} filter={filter} onChange={setFilter} />

          {/* Stats */}
          <StatsBar meta={filteredGraph.metadata} />

          {/* Legend */}
          <div className="px-3 py-2 border-b border-gray-200">
            <Legend />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setViewMode(t.id)}
                className={`flex-1 text-xs py-2 font-medium transition-colors ${viewMode === t.id ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden">
            {viewMode === "graph" && (
              <>
                <GraphCanvas visGraph={filteredGraph} onNodeClick={handleNodeClick} selectedId={selectedNode?.id ?? null} />
                {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />}
              </>
            )}
            {viewMode === "timeline" && (
              <div className="overflow-y-auto h-full">
                <TimelineView data={vizResult.timelineData} />
              </div>
            )}
            {viewMode === "metrics" && (
              <div className="overflow-y-auto h-full p-3 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Graph Metrics</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded p-2 text-center"><p className="font-bold text-gray-900">{vizResult.metrics.diameter}</p><p className="text-gray-500">Diameter</p></div>
                    <div className="bg-gray-50 rounded p-2 text-center"><p className="font-bold text-gray-900">{vizResult.metrics.avgPathLength}</p><p className="text-gray-500">Avg Path</p></div>
                  </div>
                </div>
                {vizResult.metrics.topByBetweenness.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Top by Betweenness</p>
                    {vizResult.metrics.topByBetweenness.slice(0, 5).map(({ id, score }) => {
                      const node = vizResult.visGraph.nodes.find(n => n.id === id);
                      return (
                        <div key={id} className="flex justify-between text-xs text-gray-600 py-0.5">
                          <span className="truncate flex-1">{node?.label ?? id}</span>
                          <span className="font-medium ml-2">{score.toFixed(3)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {vizResult.clusters.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Topic Clusters ({vizResult.clusters.length})</p>
                    {vizResult.clusters.slice(0, 5).map(c => (
                      <div key={c.id} className="flex justify-between text-xs text-gray-600 py-0.5">
                        <span>{c.label}</span>
                        <span className="font-medium">{c.members.length} cases</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!vizResult && (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
          Paste text above and click Build Citation Graph
        </div>
      )}
    </div>
  );
}

export default CitationGraphVisualization;