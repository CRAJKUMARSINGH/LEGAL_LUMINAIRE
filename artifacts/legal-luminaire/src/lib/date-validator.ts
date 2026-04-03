/**
 * Date Validator — Legal Luminaire
 * Detects logical contradictions in case dates (FIR, arrest, remand, charge sheet).
 * Part of the accuracy gate — prevents silent date errors in draft output.
 */

export interface CaseDates {
  firDate?: string;       // DD-MM-YYYY
  arrestDate?: string;
  remandDate?: string;
  chargeSheetDate?: string;
  incidentDate?: string;
}

export interface DateConflict {
  field1: string;
  field2: string;
  date1: string;
  date2: string;
  message: string;
  severity: "error" | "warning";
}

export interface DateValidationResult {
  valid: boolean;
  conflicts: DateConflict[];
  summary: string;
}

/** Parse DD-MM-YYYY → Date. Returns null if unparseable. */
function parseDate(s: string): Date | null {
  if (!s) return null;
  const parts = s.trim().split(/[-/]/);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}

/** Check a ≤ b, return conflict if violated. */
function checkOrder(
  aLabel: string, aStr: string | undefined,
  bLabel: string, bStr: string | undefined,
  severity: "error" | "warning" = "error"
): DateConflict | null {
  if (!aStr || !bStr) return null;
  const a = parseDate(aStr);
  const b = parseDate(bStr);
  if (!a || !b) return null;
  if (a > b) {
    return {
      field1: aLabel,
      field2: bLabel,
      date1: aStr,
      date2: bStr,
      message: `${aLabel} (${aStr}) is after ${bLabel} (${bStr}) — logical impossibility`,
      severity,
    };
  }
  return null;
}

/**
 * Validate case dates for logical consistency.
 * Rules:
 *   incidentDate ≤ firDate
 *   firDate ≤ arrestDate
 *   arrestDate ≤ remandDate
 *   arrestDate ≤ chargeSheetDate
 */
export function validateCaseDates(dates: CaseDates): DateValidationResult {
  const conflicts: DateConflict[] = [];

  const c1 = checkOrder("Incident Date", dates.incidentDate, "FIR Date", dates.firDate);
  if (c1) conflicts.push(c1);

  const c2 = checkOrder("FIR Date", dates.firDate, "Arrest Date", dates.arrestDate);
  if (c2) conflicts.push(c2);

  const c3 = checkOrder("Arrest Date", dates.arrestDate, "Remand Date", dates.remandDate);
  if (c3) conflicts.push(c3);

  const c4 = checkOrder("Arrest Date", dates.arrestDate, "Charge Sheet Date", dates.chargeSheetDate, "warning");
  if (c4) conflicts.push(c4);

  const valid = conflicts.filter((c) => c.severity === "error").length === 0;

  const summary = conflicts.length === 0
    ? "All dates are consistent."
    : `${conflicts.length} date conflict(s) detected — review before generating draft.`;

  return { valid, conflicts, summary };
}

/** Format conflicts for display in UI warning banner. */
export function formatDateConflicts(result: DateValidationResult): string {
  if (result.valid && result.conflicts.length === 0) return "";
  return result.conflicts.map((c) => `⚠ ${c.message}`).join("\n");
}
