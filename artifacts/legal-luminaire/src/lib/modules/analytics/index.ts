/**
 * Analytics Layer — Integration Module
 * Unified API for Phase 5: Judge + Court Analytics
 */

import { featureFlags } from "@/config/featureFlags";
import {
  buildJudgeProfile,
  buildAllJudgeProfiles,
  normalizeJudgeName,
  type JudgmentRecord,
  type JudgeProfile,
} from "./judge-analytics";
import {
  buildCourtProfile,
  buildAllCourtProfiles,
  predictOutcome,
  type CourtProfile,
  type OutcomePrediction,
} from "./court-analytics";

export interface AnalyticsResult {
  judgeProfiles: JudgeProfile[];
  courtProfiles: CourtProfile[];
  summary: AnalyticsSummary;
}

export interface AnalyticsSummary {
  totalRecords: number;
  totalJudges: number;
  totalCourts: number;
  mostActiveJudge: string | null;
  mostActiveCourt: string | null;
  overallBailGrantRate: number;
  overallAllowRate: number;
  overallConvictionRate: number;
  avgDisposalDays: number;
}

export function runAnalytics(records: JudgmentRecord[]): AnalyticsResult {
  const judgeProfiles = featureFlags.enableJudgeAnalytics ? buildAllJudgeProfiles(records) : [];
  const courtProfiles = featureFlags.enableCourtAnalytics ? buildAllCourtProfiles(records) : [];

  const bailRecs = records.filter(r => r.bailDecision && r.bailDecision !== "NA");
  const crimTrials = records.filter(r => r.outcome === "CONVICTED" || r.outcome === "ACQUITTED");
  const disposalTimes = records.filter(r => r.disposalDays).map(r => r.disposalDays!);

  const mostActiveJudge = judgeProfiles.sort((a, b) => b.totalCases - a.totalCases)[0]?.judgeName ?? null;
  const mostActiveCourt = courtProfiles.sort((a, b) => b.totalCases - a.totalCases)[0]?.courtName ?? null;

  const pct = (n: number, d: number) => d === 0 ? 0 : Math.round((n / d) * 1000) / 10;

  return {
    judgeProfiles,
    courtProfiles,
    summary: {
      totalRecords: records.length,
      totalJudges: judgeProfiles.length,
      totalCourts: courtProfiles.length,
      mostActiveJudge,
      mostActiveCourt,
      overallBailGrantRate: pct(bailRecs.filter(r => r.bailDecision === "GRANTED").length, bailRecs.length),
      overallAllowRate: pct(records.filter(r => r.outcome === "ALLOWED").length, records.length),
      overallConvictionRate: pct(crimTrials.filter(r => r.outcome === "CONVICTED").length, crimTrials.length),
      avgDisposalDays: disposalTimes.length > 0 ? Math.round(disposalTimes.reduce((a, b) => a + b, 0) / disposalTimes.length) : 0,
    },
  };
}

export {
  buildJudgeProfile, buildAllJudgeProfiles, normalizeJudgeName,
  buildCourtProfile, buildAllCourtProfiles, predictOutcome,
};
export type { JudgmentRecord, JudgeProfile, CourtProfile, OutcomePrediction };