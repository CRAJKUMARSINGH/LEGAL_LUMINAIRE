/**
 * Input Quality Checker — Legal Luminaire
 * Detects OCR noise and low-quality text input.
 * Prevents hallucination by warning before AI processing.
 */

export type QualityLevel = "good" | "degraded" | "poor";

export interface InputQualityResult {
  level: QualityLevel;
  score: number;          // 0–100, higher = better
  noiseIndicators: string[];
  recommendation: string;
  blockDraft: boolean;    // true if quality too low to safely draft
}

/** Common OCR substitution patterns */
const OCR_PATTERNS: Array<{ pattern: RegExp; label: string; weight: number }> = [
  { pattern: /[0O][a-z]|[a-z][0O]/g,       label: "digit/letter confusion (0/O)",  weight: 5 },
  { pattern: /[1lI]{2,}/g,                  label: "digit/letter confusion (1/l/I)", weight: 5 },
  { pattern: /\b\w{1,2}\s\w{1,2}\s\w{1,2}\b/g, label: "broken words",             weight: 8 },
  { pattern: /[@#$%^&*]{2,}/g,              label: "garbled special characters",    weight: 10 },
  { pattern: /\b[A-Z]{1}[0-9]{1}[A-Z]{1}\b/g, label: "mixed case/digit tokens",   weight: 6 },
  { pattern: /\s{3,}/g,                     label: "excessive whitespace",          weight: 3 },
  { pattern: /[^\x00-\x7F\u0900-\u097F]/g, label: "unexpected encoding",           weight: 7 },
];

/** Minimum word count for a usable document */
const MIN_WORD_COUNT = 20;

/**
 * Analyse text for OCR noise and quality issues.
 * Returns a quality result with score and recommendations.
 */
export function checkInputQuality(text: string): InputQualityResult {
  const noiseIndicators: string[] = [];
  let penaltyTotal = 0;

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount < MIN_WORD_COUNT) {
    noiseIndicators.push(`Very short input (${wordCount} words) — may be incomplete`);
    penaltyTotal += 30;
  }

  for (const { pattern, label, weight } of OCR_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 2) {
      noiseIndicators.push(`${label} (${matches.length} occurrences)`);
      penaltyTotal += Math.min(weight * Math.ceil(matches.length / 3), 25);
    }
  }

  // Check for placeholder markers left unfilled
  const placeholders = text.match(/\[(?:NAME|ACCUSED|COMPLAINANT|DATE|ADDRESS|COURT)[^\]]*\]/gi);
  if (placeholders && placeholders.length > 0) {
    noiseIndicators.push(`${placeholders.length} unfilled placeholder(s) detected`);
    penaltyTotal += placeholders.length * 5;
  }

  const score = Math.max(0, 100 - penaltyTotal);

  let level: QualityLevel;
  let recommendation: string;
  let blockDraft: boolean;

  if (score >= 75) {
    level = "good";
    recommendation = "Input quality is acceptable. Proceeding with analysis.";
    blockDraft = false;
  } else if (score >= 45) {
    level = "degraded";
    recommendation = "Input quality is degraded — possible OCR errors. Review extracted data before generating draft.";
    blockDraft = false;
  } else {
    level = "poor";
    recommendation = "Input quality is too low for reliable analysis. Please provide a cleaner document or type the key facts manually.";
    blockDraft = true;
  }

  return { level, score, noiseIndicators, recommendation, blockDraft };
}

/** Returns a user-facing warning string, or empty string if quality is good. */
export function inputQualityWarning(result: InputQualityResult): string {
  if (result.level === "good") return "";
  const icon = result.level === "poor" ? "🔴" : "🟡";
  const lines = [
    `${icon} Input quality: ${result.level.toUpperCase()} (score: ${result.score}/100)`,
    result.recommendation,
    ...result.noiseIndicators.map((i) => `  • ${i}`),
  ];
  return lines.join("\n");
}
