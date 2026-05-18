/**
 * Citation Graph Page
 * Route wrapper for Phase 3+6: Citation Intelligence + Graph Visualization
 * Path: /case/:id/citation-graph
 */

import { useState } from "react";
import { CitationGraphPanel } from "@/components/CitationGraphPanel";
import { CitationGraphVisualization } from "@/components/CitationGraphVisualization";
import { featureFlags } from "@/config/featureFlags";

export default function CitationGraphPage() {
  const [activeTab, setActiveTab] = useState<"analysis" | "visualization">("analysis");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">Citation Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Extract citations, build authority graph, visualize citation networks
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-6">
        {([
          { id: "analysis", label: "Citation Analysis" },
          { id: "visualization", label: "Graph Visualization" },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "analysis" ? (
          <CitationGraphPanel />
        ) : (
          <CitationGraphVisualization />
        )}
      </div>
    </div>
  );
}