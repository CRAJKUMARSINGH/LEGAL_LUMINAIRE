/**
 * Court Analytics Module
 * Court-level outcome trends, bail rates, disposal speed, precedent preferences
 * Part of Phase 5: Analytics Layer
 */

import { featureFlags } from "@/config/featureFlags";
import type { JudgmentRecord, JudgmentOutcome } from "./judge-analytics";

//  Types 

export interface CourtProfile {
  courtName: string;
  courtLevel: string;
  totalCases: number;
  metrics: CourtMetrics;
  topJudges: Array<{ name: string; caseCount: number }>;
  topSections: Array<{ section: string; count: number }>;
  outcomeTrend: Array<{ year: number; cases: number; allowRate: number; bailGrantRate: number }>;
  caseLoadByMonth: Array<{ month: number; count: number }>;
  heatmapData: HeatmapCell[];
}

export interface CourtMetrics {
  allowRate: number;
  dismissRate: number;
  bailGrantRate: number;
  bailRejectRate: number;
  convictionRate: number;
  acquittalRate: number;
  avgDisposalDays: number;
  appealSuccessRate: number;    // % of decisions upheld on appeal
  pendingCasesEstimate: number;
  disposalEfficiency: number;   // 0-100 score
}

export interface HeatmapCell {
  year: number;
  month: number;
  caseCount: number;
  allowRate: number;
  intensity: number; // 0-1 for color mapping
}

export interface OutcomePrediction {
  outcome: JudgmentOutcome;
  probability: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  basedOn: string;
  caveat: string;
}

//  Helpers 

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10;
}

function topN<T extends { count: number }>(arr: T[], n: number): T[] {
  return [...arr].sort((a, b) => b.count - a.count).slice(0, n);
}

//  Court Profile Builder 

export function buildCourtProfile(courtName: string, records: JudgmentRecord[]): CourtProfile {
  if (!featureFlags.enableCourtAnalytics) {
    return { courtName, courtLevel: "UNKNOWN", totalCases: 0, metrics: emptyMetrics(), topJudges: [], topSections: [], outcomeTrend: [], caseLoadByMonth: [], heatmapData: [] };
  }

  const courtRecords = records.filter(r => r.court.toLowerCase().includes(courtName.toLowerCase()));
  const total = courtRecords.length;

  // Outcome counts
  const allowed = courtRecords.filter(r => r.outcome === "ALLOWED").length;
  const dismissed = courtRecords.filter(r => r.outcome === "DISMISSED").length;
  const bailRecs = courtRecords.filter(r => r.bailDecision && r.bailDecision !== "NA");
  const bailGranted = bailRecs.filter(r => r.bailDecision === "GRANTED").length;
  const bailRejected = bailRecs.filter(r => r.bailDecision === "REJECTED").length;
  const crimTrials = courtRecords.filter(r => r.outcome === "CONVICTED" || r.outcome === "ACQUITTED");
  const convicted = crimTrials.filter(r => r.outcome === "CONVICTED").length;
  const acquitted = crimTrials.filter(r => r.outcome === "ACQUITTED").length;
  const appealRecs = courtRecords.filter(r => r.appealResult && r.appealResult !== "NA" && r.appealResult !== "PENDING");
  const upheld = appealRecs.filter(r => r.appealResult === "UPHELD").length;
  const disposalTimes = courtRecords.filter(r => r.disposalDays).map(r => r.disposalDays!);
  const avgDisposal = disposalTimes.length > 0 ? Math.round(disposalTimes.reduce((a, b) => a + b, 0) / disposalTimes.length) : 0;

  // Disposal efficiency: 100 = avg < 30 days, 0 = avg > 365 days
  const disposalEfficiency = Math.max(0, Math.round(100 - (avgDisposal / 365) * 100));

  const metrics: CourtMetrics = {
    allowRate: pct(allowed, total),
    dismissRate: pct(dismissed, total),
    bailGrantRate: pct(bailGranted, bailRecs.length),
    bailRejectRate: pct(bailRejected, bailRecs.length),
    convictionRate: pct(convicted, crimTrials.length),
    acquittalRate: pct(acquitted, crimTrials.length),
    avgDisposalDays: avgDisposal,
    appealSuccessRate: pct(upheld, appealRecs.length),
    pendingCasesEstimate: Math.round(total * 0.15), // rough estimate
    disposalEfficiency,
  };

  // Top judges
  const judgeFreq = new Map<string, number>();
  for (const r of courtRecords) judgeFreq.set(r.judgeName, (judgeFreq.get(r.judgeName) ?? 0) + 1);
  const topJudges = [...judgeFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, caseCount]) => ({ name, caseCount }));

  // Top sections
  const sectionFreq = new Map<string, number>();
  for (const r of courtRecords) for (const s of r.sections) sectionFreq.set(s, (sectionFreq.get(s) ?? 0) + 1);
  const topSections = topN([...sectionFreq.entries()].map(([section, count]) => ({ section, count })), 10);

  // Outcome trend by year
  const byYear = new Map<number, JudgmentRecord[]>();
  for (const r of courtRecords) { if (!byYear.has(r.year)) byYear.set(r.year, []); byYear.get(r.year)!.push(r); }
  const outcomeTrend = [...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, recs]) => ({
    year,
    cases: recs.length,
    allowRate: pct(recs.filter(r => r.outcome === "ALLOWED" || r.outcome === "ACQUITTED").length, recs.length),
    bailGrantRate: pct(recs.filter(r => r.bailDecision === "GRANTED").length, recs.filter(r => r.bailDecision && r.bailDecision !== "NA").length),
  }));

  // Case load by month
  const byMonth = new Map<number, number>();
  for (let m = 1; m <= 12; m++) byMonth.set(m, 0);
  for (const r of courtRecords) byMonth.set(r.month, (byMonth.get(r.month) ?? 0) + 1);
  const caseLoadByMonth = [...byMonth.entries()].map(([month, count]) => ({ month, count }));

  // Heatmap data (year x month)
  const heatmapMap = new Map<string, JudgmentRecord[]>();
  for (const r of courtRecords) {
    const key = `${r.year}-${r.month}`;
    if (!heatmapMap.has(key)) heatmapMap.set(key, []);
    heatmapMap.get(key)!.push(r);
  }
  const maxCount = Math.max(...[...heatmapMap.values()].map(v => v.length), 1);
  const heatmapData: HeatmapCell[] = [...heatmapMap.entries()].map(([key, recs]) => {
    const [year, month] = key.split("-").map(Number);
    const allowCount = recs.filter(r => r.outcome === "ALLOWED" || r.outcome === "ACQUITTED").length;
    return { year, month, caseCount: recs.length, allowRate: pct(allowCount, recs.length), intensity: recs.length / maxCount };
  });

  const courtLevel = courtName.toLowerCase().includes("supreme") ? "Supreme Court" : courtName.toLowerCase().includes("high") ? "High Court" : "Lower Court";

  return { courtName, courtLevel, totalCases: total, metrics, topJudges, topSections, outcomeTrend, caseLoadByMonth, heatmapData };
}

function emptyMetrics(): CourtMetrics {
  return { allowRate: 0, dismissRate: 0, bailGrantRate: 0, bailRejectRate: 0, convictionRate: 0, acquittalRate: 0, avgDisposalDays: 0, appealSuccessRate: 0, pendingCasesEstimate: 0, disposalEfficiency: 0 };
}

//  Outcome Prediction 

export function predictOutcome(
  courtProfile: CourtProfile,
  caseType: "BAIL" | "APPEAL" | "CRIMINAL_TRIAL" | "GENERAL"
): OutcomePrediction {
  if (!featureFlags.enableOutcomePrediction) {
    return { outcome: "UNKNOWN", probability: 0, confidence: "LOW", basedOn: "Feature disabled", caveat: "Enable VITE_FF_ENABLE_OUTCOME_PREDICTION" };
  }

  const m = courtProfile.metrics;
  const sampleSize = courtProfile.totalCases;
  const confidence: "HIGH" | "MEDIUM" | "LOW" = sampleSize >= 50 ? "HIGH" : sampleSize >= 20 ? "MEDIUM" : "LOW";

  switch (caseType) {
    case "BAIL": {
      const prob = m.bailGrantRate / 100;
      return {
        outcome: prob >= 0.5 ? "BAIL_GRANTED" : "BAIL_REJECTED",
        probability: Math.round(Math.max(prob, 1 - prob) * 100),
        confidence,
        basedOn: `Based on ${sampleSize} cases — bail grant rate: ${m.bailGrantRate}%`,
        caveat: "Prediction is statistical only. Individual case facts may differ significantly.",
      };
    }
    case "APPEAL": {
      const prob = m.allowRate / 100;
      return {
        outcome: prob >= 0.5 ? "ALLOWED" : "DISMISSED",
        probability: Math.round(Math.max(prob, 1 - prob) * 100),
        confidence,
        basedOn: `Based on ${sampleSize} cases — allow rate: ${m.allowRate}%`,
        caveat: "Prediction is statistical only. Merits of individual appeal are determinative.",
      };
    }
    case "CRIMINAL_TRIAL": {
      const prob = m.convictionRate / 100;
      return {
        outcome: prob >= 0.5 ? "CONVICTED" : "ACQUITTED",
        probability: Math.round(Math.max(prob, 1 - prob) * 100),
        confidence,
        basedOn: `Based on ${sampleSize} cases — conviction rate: ${m.convictionRate}%`,
        caveat: "Statistical prediction only. Evidence quality is the primary determinant.",
      };
    }
    default: {
      const prob = m.allowRate / 100;
      return {
        outcome: prob >= 0.5 ? "ALLOWED" : "DISMISSED",
        probability: Math.round(Math.max(prob, 1 - prob) * 100),
        confidence,
        basedOn: `Based on ${sampleSize} cases — general allow rate: ${m.allowRate}%`,
        caveat: "General prediction only. Consult case-specific analysis.",
      };
    }
  }
}

/**
 * Build profiles for all courts in a dataset
 */
export function buildAllCourtProfiles(records: JudgmentRecord[]): CourtProfile[] {
  const courts = [...new Set(records.map(r => r.court))];
  return courts.map(court => buildCourtProfile(court, records));
}