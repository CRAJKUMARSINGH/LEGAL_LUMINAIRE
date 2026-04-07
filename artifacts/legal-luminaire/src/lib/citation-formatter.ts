/**
 * Citation Formatter — Legal Luminaire
 * Formatting utilities for case law citations.
 * VerificationTier re-exported from verification-engine (single source of truth).
 */

// Re-export from the single source of truth — do not redefine
export type { AccuracyTier as VerificationTier } from "./verification-engine";

export type VerifiedBy = "case-file" | "indiankanoon" | "manual" | "unknown";

export interface CaseLawMatrixEntry {
  case: string;
  court: string;
  useForDefence: string;
  status: "COURT_SAFE" | "VERIFIED" | "SECONDARY" | "PENDING" | "FATAL_ERROR";
  action: string;
  year?: string;
  reporter?: string;
  volume?: string;
  page?: string;
  para?: string;
  verifiedBy?: VerifiedBy;
}

export function formatCitation(entry: CaseLawMatrixEntry): string {
  const { year, volume, reporter, page } = entry;
  if (year && volume && reporter && page) {
    const party = entry.case.split(",")[0].trim();
    return `${party} (${year}) ${volume} ${reporter} ${page}`;
  }
  return entry.case;
}

export function findCitationsInText(
  text: string,
  entries: Array<Pick<CaseLawMatrixEntry, "case" | "status">>
): Array<{ case: string; status: CaseLawMatrixEntry["status"] }> {
  const hits: Array<{ case: string; status: CaseLawMatrixEntry["status"] }> = [];
  const hay = (text || "").toLowerCase();
  for (const e of entries) {
    const needle = (e.case || "").toLowerCase();
    if (!needle) continue;
    if (hay.includes(needle)) hits.push({ case: e.case, status: e.status });
  }
  return hits;
}
