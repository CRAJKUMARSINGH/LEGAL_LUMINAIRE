export type VerificationTier = "VERIFIED" | "SECONDARY" | "PENDING";

export type VerifiedBy = "case-file" | "indiankanoon" | "manual" | "unknown";

export interface CaseLawMatrixEntry {
  case: string;
  court: string;
  useForDefence: string;
  status: VerificationTier;
  action: string;

  // Optional structured citation fields (prefer these over free-text where known)
  year?: string;
  reporter?: string;
  volume?: string;
  page?: string;
  para?: string; // leave empty/undefined if unverified
  verifiedBy?: VerifiedBy;
}

export function formatCitation(entry: CaseLawMatrixEntry): string {
  const { year, volume, reporter, page } = entry;
  if (year && volume && reporter && page) {
    // Keep party names exactly as stored in entry.case (minus any trailing citation already included).
    // If entry.case already includes full citation, we still return the normalized format to enforce consistency.
    const party = entry.case.split(",")[0].trim();
    return `${party} (${year}) ${volume} ${reporter} ${page}`;
  }
  return entry.case;
}

export function findCitationsInText(
  text: string,
  entries: Array<Pick<CaseLawMatrixEntry, "case" | "status">>
): Array<{ case: string; status: VerificationTier }> {
  const hits: Array<{ case: string; status: VerificationTier }> = [];
  const hay = (text || "").toLowerCase();
  for (const e of entries) {
    const needle = (e.case || "").toLowerCase();
    if (!needle) continue;
    if (hay.includes(needle)) hits.push({ case: e.case, status: e.status });
  }
  return hits;
}
