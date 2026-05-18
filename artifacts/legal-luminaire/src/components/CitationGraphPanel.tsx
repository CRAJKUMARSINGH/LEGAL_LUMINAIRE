/**
 * Citation Graph Panel
 * React UI component for Phase 3: Citation Intelligence
 * Displays extracted citations, authority rankings, and graph analysis
 */

import React, { useState, useMemo } from "react";
import { featureFlags } from "@/config/featureFlags";
import { runCitationIntelligence } from "@/lib/modules/citation-intelligence";
import type { CitationIntelligenceResult, AuthorityScore } from "@/lib/modules/citation-intelligence";

// ─── Tier Badge ───────────────────────────────────────────────────────────────

const TIER_STYLES: Record<string, string> = {
  LANDMARK:   "bg-purple-100 text-purple-800 border border-purple-300",
  PRIMARY:    "bg-green-100 text-green-800 border border-green-300",
  SECONDARY:  "bg-blue-100 text-blue-800 border border-blue-300",
  SUPPORTING: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  WEAK:       "bg-red-100 text-red-800 border border-red-300",
};

function TierBadge({ tier }: { tier: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_STYLES[tier] ?? "bg-gray-100 text-gray-700"}`}>
      {tier}
    </span>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const color = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-10 text-right">{score}</span>
    </div>
  );
}

// ─── Citation Row ─────────────────────────────────────────────────────────────

function CitationRow({ score }: { score: AuthorityScore }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{score.caseName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{score.recommendation}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TierBadge tier={score.tier} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-blue-600 hover:underline"
          >
            {expanded ? "Less" : "Details"}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <ScoreBar score={score.totalScore} />
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
          <div>
            <span className="font-medium">Court Hierarchy:</span>
            <ScoreBar score={score.breakdown.courtHierarchy} max={40} />
          </div>
          <div>
            <span className="font-medium">PageRank:</span>
            <ScoreBar score={score.breakdown.pageRankScore} max={30} />
          </div>
          <div>
            <span className="font-medium">Recency:</span>
            <ScoreBar score={score.breakdown.recencyScore} max={15} />
          </div>
          <div>
            <span className="font-medium">Citation Freq:</span>
            <ScoreBar score={score.breakdown.citationFrequency} max={15} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ result }: { result: CitationIntelligenceResult }) {
  const { summary } = result;
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[
        { label: "Total Citations", value: summary.totalCitations, color: "text-gray-900" },
        { label: "Primary Authorities", value: summary.primaryAuthorities, color: "text-green-700" },
        { label: "Landmark Cases", value: summary.landmarkCases, color: "text-purple-700" },
        { label: "Pending Verification", value: summary.pendingVerification, color: "text-orange-600" },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Draft Readiness ──────────────────────────────────────────────────────────

function DraftReadiness({ result }: { result: CitationIntelligenceResult }) {
  const { summary } = result;
  return (
    <div className={`rounded-lg p-3 mb-4 ${summary.readyForDraft ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{summary.readyForDraft ? "✅" : "⚠️"}</span>
        <span className={`text-sm font-semibold ${summary.readyForDraft ? "text-green-800" : "text-red-800"}`}>
          {summary.readyForDraft ? "Citations ready for draft" : "Draft blockers detected"}
        </span>
      </div>
      {summary.draftBlockers.length > 0 && (
        <ul className="mt-2 space-y-1">
          {summary.draftBlockers.map((b, i) => (
            <li key={i} className="text-xs text-red-700 flex items-start gap-1">
              <span>•</span><span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Graph Stats ──────────────────────────────────────────────────────────────

function GraphStats({ result }: { result: CitationIntelligenceResult }) {
  const { stats } = result.analysis;
  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-4">
      <p className="text-xs font-semibold text-gray-700 mb-2">Citation Graph</p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div><p className="font-bold text-gray-900">{stats.nodeCount}</p><p className="text-gray-500">Nodes</p></div>
        <div><p className="font-bold text-gray-900">{stats.edgeCount}</p><p className="text-gray-500">Edges</p></div>
        <div><p className="font-bold text-gray-900">{stats.clusterCount}</p><p className="text-gray-500">Clusters</p></div>
        <div><p className="font-bold text-gray-900">{stats.landmarkCount}</p><p className="text-gray-500">Landmarks</p></div>
        <div><p className="font-bold text-gray-900">{stats.bridgeCount}</p><p className="text-gray-500">Bridges</p></div>
        <div><p className="font-bold text-gray-900">{(stats.density * 100).toFixed(1)}%</p><p className="text-gray-500">Density</p></div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

type Tab = "rankings" | "graph" | "sections" | "validation";

interface CitationGraphPanelProps {
  initialText?: string;
  documentId?: string;
}

export function CitationGraphPanel({ initialText = "", documentId }: CitationGraphPanelProps) {
  const [text, setText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<Tab>("rankings");
  const [analysed, setAnalysed] = useState(false);

  const result = useMemo<CitationIntelligenceResult | null>(() => {
    if (!analysed || !text.trim()) return null;
    return runCitationIntelligence(text, documentId);
  }, [analysed, text, documentId]);

  if (!featureFlags.enableCitationExtraction && !featureFlags.enableCitationGraph) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        Citation Intelligence is disabled. Enable <code>VITE_FF_ENABLE_CITATION_EXTRACTION=true</code> to activate.
      </div>
    );
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "rankings", label: "Authority Rankings" },
    { id: "graph", label: "Graph Stats" },
    { id: "sections", label: "Sections" },
    { id: "validation", label: "Validation" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Input area */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Paste judgment or draft text</p>
        <textarea
          className="w-full h-24 text-xs border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Paste text containing legal citations..."
          value={text}
          onChange={e => { setText(e.target.value); setAnalysed(false); }}
        />
        <button
          onClick={() => setAnalysed(true)}
          disabled={!text.trim()}
          className="mt-2 w-full py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Analyse Citations
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="flex-1 overflow-y-auto p-3">
          <SummaryCard result={result} />
          <DraftReadiness result={result} />

          {/* Tabs */}
          <div className="flex gap-1 mb-3 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-3 py-1.5 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "rankings" && (
            <div className="space-y-2">
              {result.ranking.ranked.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No citations found in text</p>
              ) : (
                result.ranking.ranked.map(score => (
                  <CitationRow key={score.citationId} score={score} />
                ))
              )}
            </div>
          )}

          {activeTab === "graph" && (
            <div>
              <GraphStats result={result} />
              {result.topInfluential.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Top Influential Cases</p>
                  <div className="space-y-2">
                    {result.topInfluential.map(({ citation, influenceScore }) => (
                      <div key={citation.id} className="flex items-center justify-between text-xs border border-gray-200 rounded p-2">
                        <span className="text-gray-800 truncate flex-1">{citation.caseName ?? citation.raw}</span>
                        <span className="ml-2 font-bold text-blue-700 shrink-0">Score: {influenceScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "sections" && (
            <div className="space-y-3">
              {result.extraction.ipcSections.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">IPC Sections</p>
                  <div className="flex flex-wrap gap-1">
                    {result.extraction.ipcSections.map(s => (
                      <span key={s} className="text-xs bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full">
                        IPC {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {result.extraction.crpcSections.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">CrPC Sections</p>
                  <div className="flex flex-wrap gap-1">
                    {result.extraction.crpcSections.map(s => (
                      <span key={s} className="text-xs bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                        CrPC {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {result.extraction.otherSections.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Other Statutes</p>
                  <div className="space-y-1">
                    {result.extraction.otherSections.map(s => (
                      <p key={s} className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{s}</p>
                    ))}
                  </div>
                </div>
              )}
              {result.extraction.ipcSections.length === 0 &&
               result.extraction.crpcSections.length === 0 &&
               result.extraction.otherSections.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No statutory sections detected</p>
              )}
            </div>
          )}

          {activeTab === "validation" && (
            <div className="space-y-2">
              {result.validationReport.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No citations to validate</p>
              ) : (
                result.validationReport.map(({ citation, valid, issues }) => (
                  <div key={citation.id} className={`rounded-lg p-2 border text-xs ${valid ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 truncate">{citation.caseName ?? citation.raw}</span>
                      <span className={`ml-2 shrink-0 font-semibold ${valid ? "text-green-700" : "text-yellow-700"}`}>
                        {valid ? " Valid" : ` ${issues.length} issue${issues.length > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    {issues.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {issues.map((issue, i) => (
                          <li key={i} className="text-yellow-700"> {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
          Paste text above and click Analyse Citations
        </div>
      )}
    </div>
  );
}

export default CitationGraphPanel;