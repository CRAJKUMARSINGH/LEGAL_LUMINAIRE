/**
 * Judge Analytics Module
 * Decision pattern analysis, bail rates, conviction trends, specialization
 * Part of Phase 5: Analytics Layer
 */

import { featureFlags } from "@/config/featureFlags";

//  Types 

export interface JudgmentRecord {
  caseId: string;
  judgeName: string;
  court: string;
  year: number;
  month: number;
  outcome: JudgmentOutcome;
  offences: string[];
  sections: string[];
  bailDecision?: "GRANTED" | "REJECTED" | "NA";
  sentenceYears?: number;
  appealResult?: "UPHELD" | "REVERSED" | "MODIFIED" | "PENDING" | "NA";
  isConstitutionalMatter: boolean;
  disposalDays?: number;
}

export type JudgmentOutcome =
  | "ALLOWED" | "DISMISSED" | "BAIL_GRANTED" | "BAIL_REJECTED"
  | "ACQUITTED" | "CONVICTED" | "REMANDED" | "SETTLED" | "UNKNOWN";

export interface JudgeProfile {
  judgeName: string;
  court: string;
  totalCases: number;
  metrics: JudgeMetrics;
  specializations: string[];
  frequentSections: Array<{ section: string; count: number }>;
  yearlyTrend: Array<{ year: number; cases: number; allowRate: number }>;
  recentCases: JudgmentRecord[];
}

export interface JudgeMetrics {
  allowRate: number;           // % petitions allowed
  dismissRate: number;         // % petitions dismissed
  bailGrantRate: number;       // % bail applications granted
  bailRejectRate: number;      // % bail applications rejected
  convictionRate: number;      // % criminal trials resulting in conviction
  acquittalRate: number;       // % criminal trials resulting in acquittal
  appealReversalRate: number;  // % decisions reversed on appeal
  avgDisposalDays: number;     // average days to dispose case
  strictnessIndex: number;     // 0-100 (100 = very strict)
  consistencyScore: number;    // 0-100 (100 = very consistent)
  constitutionalCases: number; // count of constitutional matters
}

//  Name Normalizer 

const JUDGE_TITLE_PATTERN = /^(?:hon'?ble\s+)?(?:justice|j\.|cj|acj|jj\.?)\s*/i;
const SUFFIX_PATTERN = /\s*,?\s*(?:j\.|cj|acj|jj\.?)$/i;

export function normalizeJudgeName(raw: string): string {
  return raw
    .replace(JUDGE_TITLE_PATTERN, "")
    .replace(SUFFIX_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

//  Metrics Calculator 

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function calcStrictnessIndex(metrics: Omit<JudgeMetrics, "strictnessIndex" | "consistencyScore">): number {
  // Higher bail reject rate + higher conviction rate + lower allow rate = stricter
  const bailStrictness = metrics.bailRejectRate;
  const convictionStrictness = metrics.convictionRate;
  const dismissStrictness = metrics.dismissRate;
  return Math.round((bailStrictness * 0.4 + convictionStrictness * 0.35 + dismissStrictness * 0.25));
}

function calcConsistencyScore(records: JudgmentRecord[]): number {
  if (records.length < 5) return 50; // insufficient data
  // Measure variance in outcomes for similar case types
  const outcomesByType = new Map<string, JudgmentOutcome[]>();
  for (const r of records) {
    const key = r.offences.sort().join("|") || "general";
    if (!outcomesByType.has(key)) outcomesByType.set(key, []);
    outcomesByType.get(key)!.push(r.outcome);
  }
  let totalConsistency = 0, groups = 0;
  for (const outcomes of outcomesByType.values()) {
    if (outcomes.length < 2) continue;
    const freq = new Map<string, number>();
    for (const o of outcomes) freq.set(o, (freq.get(o) ?? 0) + 1);
    const maxFreq = Math.max(...freq.values());
    totalConsistency += maxFreq / outcomes.length;
    groups++;
  }
  return groups > 0 ? Math.round((totalConsistency / groups) * 100) : 50;
}

//  Section Frequency 

function topSections(records: JudgmentRecord[], topN = 10): Array<{ section: string; count: number }> {
  const freq = new Map<string, number>();
  for (const r of records) {
    for (const s of r.sections) freq.set(s, (freq.get(s) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([section, count]) => ({ section, count }));
}

//  Specialization Detection 

const SPECIALIZATION_RULES: Array<{ label: string; test: (m: JudgeMetrics, r: JudgmentRecord[]) => boolean }> = [
  { label: "Bail Matters", test: (m) => m.bailGrantRate + m.bailRejectRate > 40 },
  { label: "Criminal Law", test: (_, r) => r.filter(x => x.sections.some(s => s.includes("IPC"))).length / Math.max(r.length, 1) > 0.5 },
  { label: "Constitutional Law", test: (m) => m.constitutionalCases > 5 },
  { label: "Strict Sentencing", test: (m) => m.strictnessIndex > 65 },
  { label: "Lenient Bail", test: (m) => m.bailGrantRate > 60 },
  { label: "High Disposal Rate", test: (m) => m.avgDisposalDays < 90 },
];

function detectSpecializations(metrics: JudgeMetrics, records: JudgmentRecord[]): string[] {
  return SPECIALIZATION_RULES.filter(r => r.test(metrics, records)).map(r => r.label);
}

//  Yearly Trend 

function buildYearlyTrend(records: JudgmentRecord[]): Array<{ year: number; cases: number; allowRate: number }> {
  const byYear = new Map<number, JudgmentRecord[]>();
  for (const r of records) {
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year)!.push(r);
  }
  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, recs]) => ({
      year,
      cases: recs.length,
      allowRate: pct(recs.filter(r => r.outcome === "ALLOWED" || r.outcome === "BAIL_GRANTED" || r.outcome === "ACQUITTED").length, recs.length),
    }));
}

//  Main Builder 

export function buildJudgeProfile(
  judgeName: string,
  court: string,
  records: JudgmentRecord[]
): JudgeProfile {
  if (!featureFlags.enableJudgeAnalytics) {
    return { judgeName, court, totalCases: 0, metrics: emptyMetrics(), specializations: [], frequentSections: [], yearlyTrend: [], recentCases: [] };
  }

  const judgeRecords = records.filter(r => normalizeJudgeName(r.judgeName) === normalizeJudgeName(judgeName));
  const total = judgeRecords.length;

  const allowed = judgeRecords.filter(r => r.outcome === "ALLOWED").length;
  const dismissed = judgeRecords.filter(r => r.outcome === "DISMISSED").length;
  const bailRecords = judgeRecords.filter(r => r.bailDecision && r.bailDecision !== "NA");
  const bailGranted = bailRecords.filter(r => r.bailDecision === "GRANTED").length;
  const bailRejected = bailRecords.filter(r => r.bailDecision === "REJECTED").length;
  const criminalTrials = judgeRecords.filter(r => r.outcome === "CONVICTED" || r.outcome === "ACQUITTED");
  const convicted = criminalTrials.filter(r => r.outcome === "CONVICTED").length;
  const acquitted = criminalTrials.filter(r => r.outcome === "ACQUITTED").length;
  const appealRecords = judgeRecords.filter(r => r.appealResult && r.appealResult !== "NA" && r.appealResult !== "PENDING");
  const reversed = appealRecords.filter(r => r.appealResult === "REVERSED").length;
  const disposalTimes = judgeRecords.filter(r => r.disposalDays).map(r => r.disposalDays!);
  const avgDisposal = disposalTimes.length > 0 ? Math.round(disposalTimes.reduce((a, b) => a + b, 0) / disposalTimes.length) : 0;
  const constitutional = judgeRecords.filter(r => r.isConstitutionalMatter).length;

  const baseMetrics = {
    allowRate: pct(allowed, total),
    dismissRate: pct(dismissed, total),
    bailGrantRate: pct(bailGranted, bailRecords.length),
    bailRejectRate: pct(bailRejected, bailRecords.length),
    convictionRate: pct(convicted, criminalTrials.length),
    acquittalRate: pct(acquitted, criminalTrials.length),
    appealReversalRate: pct(reversed, appealRecords.length),
    avgDisposalDays: avgDisposal,
    constitutionalCases: constitutional,
  };

  const metrics: JudgeMetrics = {
    ...baseMetrics,
    strictnessIndex: calcStrictnessIndex(baseMetrics),
    consistencyScore: calcConsistencyScore(judgeRecords),
  };

  const specializations = detectSpecializations(metrics, judgeRecords);
  const frequentSections = topSections(judgeRecords);
  const yearlyTrend = buildYearlyTrend(judgeRecords);
  const recentCases = [...judgeRecords].sort((a, b) => b.year - a.year || b.month - a.month).slice(0, 5);

  return { judgeName: normalizeJudgeName(judgeName), court, totalCases: total, metrics, specializations, frequentSections, yearlyTrend, recentCases };
}

function emptyMetrics(): JudgeMetrics {
  return { allowRate: 0, dismissRate: 0, bailGrantRate: 0, bailRejectRate: 0, convictionRate: 0, acquittalRate: 0, appealReversalRate: 0, avgDisposalDays: 0, strictnessIndex: 0, consistencyScore: 0, constitutionalCases: 0 };
}

/**
 * Build profiles for all judges in a dataset
 */
export function buildAllJudgeProfiles(records: JudgmentRecord[]): JudgeProfile[] {
  const judgeMap = new Map<string, string>(); // normalizedName -> court
  for (const r of records) {
    const name = normalizeJudgeName(r.judgeName);
    if (!judgeMap.has(name)) judgeMap.set(name, r.court);
  }
  return [...judgeMap.entries()].map(([name, court]) => buildJudgeProfile(name, court, records));
}