/**
 * Judge Profile Card
 * React UI component for Phase 5: Analytics Layer
 */

import React, { useState } from "react";
import type { JudgeProfile } from "@/lib/modules/analytics";

//  Metric Gauge 

function MetricBar({ label, value, color = "bg-blue-500" }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <span className="text-gray-700 font-medium w-10 text-right">{value}%</span>
    </div>
  );
}

function IndexBar({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value;
  const color = display >= 70 ? "bg-green-500" : display >= 40 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-gray-700 font-medium w-8 text-right">{value}</span>
    </div>
  );
}

//  Trend Sparkline (CSS-only) 

function Sparkline({ data }: { data: Array<{ year: number; allowRate: number }> }) {
  if (data.length < 2) return <span className="text-xs text-gray-400">Insufficient data</span>;
  const max = Math.max(...data.map(d => d.allowRate), 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map(d => (
        <div key={d.year} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full bg-blue-400 rounded-sm"
            style={{ height: `${Math.max(2, (d.allowRate / max) * 28)}px` }}
            title={`${d.year}: ${d.allowRate}%`}
          />
        </div>
      ))}
    </div>
  );
}

//  Main Card 

type Tab = "overview" | "sections" | "trend";

export function JudgeProfileCard({ profile }: { profile: JudgeProfile }) {
  const [tab, setTab] = useState<Tab>("overview");
  const m = profile.metrics;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-base">{profile.judgeName}</p>
            <p className="text-blue-200 text-xs mt-0.5">{profile.court}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{profile.totalCases}</p>
            <p className="text-blue-200 text-xs">cases</p>
          </div>
        </div>
        {profile.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.specializations.map(s => (
              <span key={s} className="text-xs bg-blue-500 bg-opacity-50 text-white px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["overview", "sections", "trend"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-xs py-2 font-medium transition-colors capitalize ${tab === t ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {tab === "overview" && (
          <>
            <MetricBar label="Allow Rate" value={m.allowRate} color="bg-green-500" />
            <MetricBar label="Dismiss Rate" value={m.dismissRate} color="bg-red-400" />
            <MetricBar label="Bail Grant Rate" value={m.bailGrantRate} color="bg-blue-500" />
            <MetricBar label="Conviction Rate" value={m.convictionRate} color="bg-orange-500" />
            <MetricBar label="Acquittal Rate" value={m.acquittalRate} color="bg-teal-500" />
            <MetricBar label="Appeal Reversal" value={m.appealReversalRate} color="bg-red-500" />
            <div className="pt-1 border-t border-gray-100 space-y-1.5">
              <IndexBar label="Strictness Index" value={m.strictnessIndex} />
              <IndexBar label="Consistency Score" value={m.consistencyScore} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span>Avg Disposal: <span className="font-medium text-gray-800">{m.avgDisposalDays}d</span></span>
              <span>Constitutional: <span className="font-medium text-gray-800">{m.constitutionalCases}</span></span>
            </div>
          </>
        )}

        {tab === "sections" && (
          <div className="space-y-1.5">
            {profile.frequentSections.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">No section data</p>
            ) : (
              profile.frequentSections.map(({ section, count }) => {
                const max = profile.frequentSections[0].count;
                return (
                  <div key={section} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-700 w-24 shrink-0 truncate">{section}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                    <span className="text-gray-500 w-6 text-right">{count}</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "trend" && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Allow rate trend by year</p>
            <Sparkline data={profile.yearlyTrend} />
            <div className="mt-2 space-y-1">
              {profile.yearlyTrend.slice(-4).map(t => (
                <div key={t.year} className="flex justify-between text-xs text-gray-600">
                  <span>{t.year}</span>
                  <span>{t.cases} cases</span>
                  <span className="font-medium">{t.allowRate}% allow</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgeProfileCard;