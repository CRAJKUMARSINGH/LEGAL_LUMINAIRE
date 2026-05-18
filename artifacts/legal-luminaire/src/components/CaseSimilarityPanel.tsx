/**
 * Case Similarity Panel
 * React UI for Phase 4: AI Reasoning Layer
 * Query understanding + multi-layer similarity + explanations
 */

import React, { useState, useMemo } from "react";
import { featureFlags } from "@/config/featureFlags";
import {
  runAIReasoning,
  type AIReasoningResult,
  type CaseInput,
  type CaseExplanation,
} from "@/lib/modules/ai-reasoning";
import type { SimilarityScore } from "@/lib/modules/ai-reasoning";

// ─── Demo Corpus ──────────────────────────────────────────────────────────────
// Small built-in corpus for demo/testing when no external corpus is provided

const DEMO_CORPUS: CaseInput[] = [
  {
    caseId: "state_v_hemraj_2025",
    title: "State v. Hemraj Kumar",
    court: "Delhi High Court",
    year: 2025,
    citationCount: 3,
    text: "Discharge application under Section 227 CrPC. Accused charged under IPC 304A for causing death by negligence in building collapse. Evidence of structural failure. Chargesheet filed. Sessions court refused discharge.",
  },
  {
    caseId: "arnesh_kumar_2014",
    title: "Arnesh Kumar v. State of Bihar",
    court: "Supreme Court of India",
    year: 2014,
    citationCount: 847,
    text: "Bail and arrest guidelines under Section 498A IPC and Section 4 Dowry Prohibition Act. Supreme Court issued guidelines for arrest. Section 41 CrPC. Magistrate must apply mind before issuing arrest warrant.",
  },
  {
    caseId: "sushil_kumar_sharma_2005",
    title: "Sushil Kumar Sharma v. Union of India",
    court: "Supreme Court of India",
    year: 2005,
    citationCount: 312,
    text: "Constitutional validity of Section 498A IPC challenged. Cruelty to wife. Dowry harassment. Article 14 and Article 21. Supreme Court upheld validity. Misuse of provision discussed.",
  },
  {
    caseId: "satender_kumar_antil_2022",
    title: "Satender Kumar Antil v. CBI",
    court: "Supreme Court of India",
    year: 2022,
    citationCount: 523,
    text: "Bail application. Default bail under Section 167(2) CrPC. Chargesheet not filed within 60 days. Right to bail. Section 437 CrPC. Section 439 CrPC. Accused entitled to bail as matter of right.",
  },
  {
    caseId: "jacob_mathew_2005",
    title: "Jacob Mathew v. State of Punjab",
    court: "Supreme Court of India",
    year: 2005,
    citationCount: 689,
    text: "Medical negligence. Section 304A IPC. Causing death by negligence. Rash and negligent act. Doctor liability. Standard of care. Bolam test. Criminal negligence distinguished from civil negligence.",
  },
  {
    caseId: "state_v_salman_khan_2015",
    title: "State of Maharashtra v. Salman Khan",
    court: "Bombay High Court",
    year: 2015,
    citationCount: 45,
    text: "Hit and run case. Section 304 IPC culpable homicide. Section 304A IPC negligence. Drunk driving. Evidence of intoxication. Witness testimony. Conviction and sentence.",
  },
  {
    caseId: "union_carbide_1989",
    title: "Union Carbide Corporation v. Union of India",
    court: "Supreme Court of India",
    year: 1989,
    citationCount: 1204,
    text: "Bhopal gas tragedy. Industrial negligence. Mass tort. Absolute liability. Article 21 right to life. Compensation. Settlement. Environmental disaster. Corporate liability.",
  },
];

// ─── Tier Badge ───────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  EXACT:     "bg-green-100 text-green-800 border-green-300",
  ANALOGOUS: "bg-blue-100 text-blue-800 border-blue-300",
  WEAK:      "bg-yellow-100 text-yellow-800 border-yellow-300",
  REJECTED:  "bg-red-100 text-red-800 border-red-300",
};

function TierBadge({ tier }: { tier: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TIER_COLORS[tier] ?? "bg-gray-100 text-gray-700 border-gray-300"}`}>
      {tier}
    </span>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, max = 100, label }: { score: number; max?: number; label?: string }) {
  const pct = Math.min(100, (score / max) * 100);
  const color = pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>}
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-8 text-right">{score}</span>
    </div>
  );
}

// ─── Case Result Card ─────────────────────────────────────────────────────────

function CaseResultCard({
  score,
  explanation,
}: {
  score: SimilarityScore;
  explanation?: CaseExplanation;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{score.title}</p>
          <p className="text-xs text-gray-500">{score.court} · {score.year}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TierBadge tier={score.tier} />
          <button onClick={() => setExpanded(e => !e)} className="text-xs text-blue-600 hover:underline">
            {expanded ? "Less" : "More"}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <ScoreBar score={score.totalScore} />
      </div>

      {explanation && (
        <p className="mt-1.5 text-xs text-gray-600 italic">{explanation.relevanceSummary}</p>
      )}

      {expanded && (
        <div className="mt-3 space-y-2">
          {/* Score breakdown */}
          <div className="bg-gray-50 rounded p-2 space-y-1">
            <p className="text-xs font-semibold text-gray-700 mb-1">Score Breakdown</p>
            <ScoreBar score={score.breakdown.keywordScore} max={35} label="Keywords" />
            <ScoreBar score={score.breakdown.legalIssueScore} max={30} label="Legal Issues" />
            <ScoreBar score={score.breakdown.citationScore} max={20} label="Citations" />
            <ScoreBar score={score.breakdown.courtScore} max={15} label="Court" />
          </div>

          {/* Match points */}
          {explanation && explanation.matchPoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Why it matches</p>
              <ul className="space-y-1">
                {explanation.matchPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${pt.strength === "STRONG" ? "bg-green-500" : pt.strength === "MODERATE" ? "bg-blue-400" : "bg-yellow-400"}`} />
                    <span><span className="font-medium">{pt.label}:</span> {pt.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Caution notes */}
          {explanation && explanation.cautionNotes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs font-semibold text-yellow-800 mb-1">⚠ Cautions</p>
              {explanation.cautionNotes.map((n, i) => (
                <p key={i} className="text-xs text-yellow-700">• {n}</p>
              ))}
            </div>
          )}

          {/* Citation advice */}
          {explanation && explanation.citationAdvice && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Citation Advice</p>
              <p className="text-xs text-blue-700">{explanation.citationAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Query Understanding Panel ────────────────────────────────────────────────

function QueryUnderstandingCard({ result }: { result: AIReasoningResult }) {
  const { queryUnderstanding: qu } = result;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Query Understanding</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-gray-500">Intent:</span> <span className="font-medium text-gray-800">{qu.intent.replace("_", " ")}</span></div>
        <div><span className="text-gray-500">Complexity:</span> <span className="font-medium text-gray-800">{qu.complexity}/100</span></div>
        <div><span className="text-gray-500">Issues:</span> <span className="font-medium text-gray-800">{result.summary.issueSummary}</span></div>
        <div><span className="text-gray-500">Entities:</span> <span className="font-medium text-gray-800">{qu.entities.length}</span></div>
      </div>
      {(qu.sections.ipc.length > 0 || qu.sections.crpc.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {qu.sections.ipc.map(s => <span key={s} className="text-xs bg-orange-100 text-orange-800 border border-orange-200 px-1.5 py-0.5 rounded-full">IPC {s}</span>)}
          {qu.sections.crpc.map(s => <span key={s} className="text-xs bg-teal-100 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded-full">CrPC {s}</span>)}
        </div>
      )}
    </div>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ result }: { result: AIReasoningResult }) {
  const { stats } = result.similarCases;
  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {[
        { label: "Total", value: stats.total, color: "text-gray-900" },
        { label: "Exact", value: stats.exact, color: "text-green-700" },
        { label: "Analogous", value: stats.analogous, color: "text-blue-700" },
        { label: "Weak", value: stats.weak, color: "text-yellow-700" },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white border border-gray-200 rounded-lg p-2 text-center">
          <p className={`text-xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface CaseSimilarityPanelProps {
  corpus?: CaseInput[];
  initialQuery?: string;
}

export function CaseSimilarityPanel({ corpus, initialQuery = "" }: CaseSimilarityPanelProps) {
  const [query, setQuery] = useState(initialQuery);
  const [analysed, setAnalysed] = useState(false);
  const activeCorpus = corpus ?? DEMO_CORPUS;

  const result = useMemo<AIReasoningResult | null>(() => {
    if (!analysed || !query.trim()) return null;
    return runAIReasoning(query, activeCorpus, { minScore: 20, maxResults: 10 });
  }, [analysed, query, activeCorpus]);

  if (!featureFlags.enableCaseSimilarity && !featureFlags.enableQueryUnderstanding) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        AI Reasoning is disabled. Enable <code>VITE_FF_ENABLE_CASE_SIMILARITY=true</code> to activate.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Input */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Describe your case or legal issue</p>
        <textarea
          className="w-full h-24 text-xs border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="e.g. Discharge application under Section 227 CrPC for accused charged under IPC 304A for building collapse..."
          value={query}
          onChange={e => { setQuery(e.target.value); setAnalysed(false); }}
        />
        <button
          onClick={() => setAnalysed(true)}
          disabled={!query.trim()}
          className="mt-2 w-full py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Find Similar Cases
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="flex-1 overflow-y-auto p-3">
          <QueryUnderstandingCard result={result} />
          <SummaryBar result={result} />

          {/* Draft readiness */}
          {result.summary.draftBlockers.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-yellow-800"> Research Gaps</p>
              {result.summary.draftBlockers.map((b, i) => (
                <p key={i} className="text-xs text-yellow-700 mt-0.5"> {b}</p>
              ))}
            </div>
          )}

          {/* Case results */}
          <div className="space-y-2">
            {result.similarCases.results.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No similar cases found. Try broadening your query.</p>
            ) : (
              result.similarCases.results.map(score => (
                <CaseResultCard
                  key={score.caseId}
                  score={score}
                  explanation={result.explanations.find(e => e.caseId === score.caseId)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
          Describe your case above and click Find Similar Cases
        </div>
      )}
    </div>
  );
}

export default CaseSimilarityPanel;