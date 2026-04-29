/**
 * Court Analytics Dashboard
 * React UI for Phase 5: Analytics Layer — court-level metrics + outcome prediction
 */

import React, { useState, useMemo } from "react";
import { featureFlags } from "@/config/featureFlags";
import {
  runAnalytics,
  predictOutcome,
  type JudgmentRecord,
  type CourtProfile,
  type AnalyticsResult,
} from "@/lib/modules/analytics";

//  Demo Data 

const DEMO_RECORDS: JudgmentRecord[] = [
  { caseId: "c1",  judgeName: "Justice A.K. Sharma",   court: "Delhi High Court",          year: 2023, month: 3,  outcome: "ALLOWED",       offences: ["bail"],    sections: ["438 CrPC"],       bailDecision: "GRANTED",  appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 45 },
  { caseId: "c2",  judgeName: "Justice A.K. Sharma",   court: "Delhi High Court",          year: 2023, month: 5,  outcome: "DISMISSED",     offences: ["murder"],  sections: ["302 IPC"],        bailDecision: "REJECTED", appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 120 },
  { caseId: "c3",  judgeName: "Justice A.K. Sharma",   court: "Delhi High Court",          year: 2022, month: 8,  outcome: "ALLOWED",       offences: ["bail"],    sections: ["437 CrPC"],       bailDecision: "GRANTED",  appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 30 },
  { caseId: "c4",  judgeName: "Justice R. Mehta",      court: "Delhi High Court",          year: 2023, month: 1,  outcome: "DISMISSED",     offences: ["fraud"],   sections: ["420 IPC"],        bailDecision: "REJECTED", appealResult: "REVERSED", isConstitutionalMatter: false, disposalDays: 200 },
  { caseId: "c5",  judgeName: "Justice R. Mehta",      court: "Delhi High Court",          year: 2022, month: 11, outcome: "ALLOWED",       offences: [],          sections: ["482 CrPC"],       bailDecision: "NA",       appealResult: "UPHELD",   isConstitutionalMatter: false, disposalDays: 60 },
  { caseId: "c6",  judgeName: "Justice S. Krishnan",   court: "Supreme Court of India",    year: 2023, month: 6,  outcome: "ALLOWED",       offences: [],          sections: ["Article 21"],     bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: true,  disposalDays: 180 },
  { caseId: "c7",  judgeName: "Justice S. Krishnan",   court: "Supreme Court of India",    year: 2023, month: 9,  outcome: "DISMISSED",     offences: ["murder"],  sections: ["302 IPC"],        bailDecision: "REJECTED", appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 90 },
  { caseId: "c8",  judgeName: "Justice P. Nair",       court: "Bombay High Court",         year: 2023, month: 2,  outcome: "BAIL_GRANTED",  offences: ["bail"],    sections: ["438 CrPC"],       bailDecision: "GRANTED",  appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 15 },
  { caseId: "c9",  judgeName: "Justice P. Nair",       court: "Bombay High Court",         year: 2022, month: 7,  outcome: "BAIL_REJECTED", offences: ["rape"],    sections: ["376 IPC"],        bailDecision: "REJECTED", appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 20 },
  { caseId: "c10", judgeName: "Justice A.K. Sharma",   court: "Delhi High Court",          year: 2024, month: 1,  outcome: "ACQUITTED",     offences: ["murder"],  sections: ["302 IPC"],        bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 365 },
  { caseId: "c11", judgeName: "Justice R. Mehta",      court: "Delhi High Court",          year: 2024, month: 3,  outcome: "CONVICTED",     offences: ["fraud"],   sections: ["420 IPC"],        bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: false, disposalDays: 280 },
  { caseId: "c12", judgeName: "Justice S. Krishnan",   court: "Supreme Court of India",    year: 2024, month: 4,  outcome: "ALLOWED",       offences: [],          sections: ["Article 14"],     bailDecision: "NA",       appealResult: "NA",       isConstitutionalMatter: true,  disposalDays: 120 },
];

//  Metric Card 

function MetricCard({ label, value, unit = "%", color = "text-blue-700" }: { label: string; value: number; unit?: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}{unit}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

//  Outcome Trend Chart (CSS bars) 

function TrendChart({ data }: { data: CourtProfile["outcomeTrend"] }) {
  if (data.length === 0) return <p className="text-xs text-gray-400 text-center py-3">No trend data</p>;
  const maxCases = Math.max(...data.map(d => d.cases), 1);
  return (
    <div className="space-y-1.5">
      {data.map(d => (
        <div key={d.year} className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 w-10 shrink-0">{d.year}</span>
          <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden relative">
            <div className="h-full bg-blue-400 rounded" style={{ width: `${(d.cases / maxCases) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-gray-700 font-medium">{d.allowRate}% allow</span>
          </div>
          <span className="text-gray-500 w-12 text-right">{d.cases} cases</span>
        </div>
      ))}
    </div>
  );
}

//  Prediction Badge 

function PredictionBadge({ prediction }: { prediction: ReturnType<typeof predictOutcome> }) {
  const confColor = prediction.confidence === "HIGH" ? "text-green-700" : prediction.confidence === "MEDIUM" ? "text-yellow-700" : "text-red-600";
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-blue-800">Outcome Prediction</p>
        <span className={`text-xs font-medium ${confColor}`}>{prediction.confidence} confidence</span>
      </div>
      <p className="text-sm font-bold text-blue-900">{prediction.outcome.replace("_", " ")} — {prediction.probability}%</p>
      <p className="text-xs text-blue-700 mt-1">{prediction.basedOn}</p>
      <p className="text-xs text-gray-500 mt-1 italic">{prediction.caveat}</p>
    </div>
  );
}

//  Court Card 

function CourtCard({ profile }: { profile: CourtProfile }) {
  const [expanded, setExpanded] = useState(false);
  const m = profile.metrics;
  const bailPrediction = predictOutcome(profile, "BAIL");

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-gray-900">{profile.courtName}</p>
          <p className="text-xs text-gray-500">{profile.courtLevel}  {profile.totalCases} cases</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="text-xs text-blue-600 hover:underline">{expanded ? "Less" : "Details"}</button>
      </div>

      <div className="p-3 grid grid-cols-3 gap-2">
        <MetricCard label="Allow Rate" value={m.allowRate} color="text-green-700" />
        <MetricCard label="Bail Grant" value={m.bailGrantRate} color="text-blue-700" />
        <MetricCard label="Conviction" value={m.convictionRate} color="text-orange-600" />
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard label="Dismiss Rate" value={m.dismissRate} color="text-red-600" />
            <MetricCard label="Acquittal" value={m.acquittalRate} color="text-teal-600" />
            <MetricCard label="Appeal Success" value={m.appealSuccessRate} color="text-purple-600" />
            <MetricCard label="Disposal Eff." value={m.disposalEfficiency} color="text-indigo-600" />
          </div>
          <div className="text-xs text-gray-500">Avg disposal: <span className="font-medium text-gray-800">{m.avgDisposalDays} days</span></div>

          {featureFlags.enableOutcomePrediction && <PredictionBadge prediction={bailPrediction} />}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Outcome Trend</p>
            <TrendChart data={profile.outcomeTrend} />
          </div>

          {profile.topJudges.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Top Judges</p>
              <div className="space-y-1">
                {profile.topJudges.map(j => (
                  <div key={j.name} className="flex justify-between text-xs text-gray-600">
                    <span>{j.name}</span><span className="font-medium">{j.caseCount} cases</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//  Main Dashboard 

interface CourtAnalyticsDashboardProps {
  records?: JudgmentRecord[];
}

export function CourtAnalyticsDashboard({ records }: CourtAnalyticsDashboardProps) {
  const activeRecords = records ?? DEMO_RECORDS;

  const result = useMemo<AnalyticsResult>(() => runAnalytics(activeRecords), [activeRecords]);

  if (!featureFlags.enableCourtAnalytics && !featureFlags.enableJudgeAnalytics) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        Analytics is disabled. Enable <code>VITE_FF_ENABLE_COURT_ANALYTICS=true</code> to activate.
      </div>
    );
  }

  const s = result.summary;

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Summary */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Analytics Overview</p>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard label="Total Records" value={s.totalRecords} unit="" color="text-gray-900" />
          <MetricCard label="Overall Allow" value={s.overallAllowRate} color="text-green-700" />
          <MetricCard label="Bail Grant Rate" value={s.overallBailGrantRate} color="text-blue-700" />
          <MetricCard label="Conviction Rate" value={s.overallConvictionRate} color="text-orange-600" />
        </div>
        {s.mostActiveCourt && (
          <p className="text-xs text-gray-500 mt-2">Most active court: <span className="font-medium text-gray-800">{s.mostActiveCourt}</span></p>
        )}
        {s.avgDisposalDays > 0 && (
          <p className="text-xs text-gray-500">Avg disposal: <span className="font-medium text-gray-800">{s.avgDisposalDays} days</span></p>
        )}
      </div>

      {/* Court profiles */}
      <div className="p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Court Profiles ({result.courtProfiles.length})</p>
        {result.courtProfiles.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No court data available</p>
        ) : (
          result.courtProfiles.map(p => <CourtCard key={p.courtName} profile={p} />)
        )}
      </div>
    </div>
  );
}

export default CourtAnalyticsDashboard;