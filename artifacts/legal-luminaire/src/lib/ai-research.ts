/**
 * AI Research Engine — Legal Luminaire
 * Orchestrates precedent retrieval from Lexis, Manupatra, SCC Online,
 * Indian Kanoon, and international databases with fact-fit scoring.
 */

export type DatabaseSource =
  | "manupatra"
  | "scc_online"
  | "indian_kanoon"
  | "lexis_nexis"
  | "westlaw"
  | "bailii"
  | "astm"
  | "bis"
  | "cpwd";

export type FitLevel = "exact" | "analogous" | "weak" | "rejected";

export type PrecedentResult = {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  holding: string;
  application: string;
  fitLevel: FitLevel;
  fitScore: number; // 0-100
  fitReason: string;
  source: DatabaseSource;
  sourceUrl?: string;
  tags: string[];
};

export type ResearchQuery = {
  caseTitle: string;
  brief: string;
  incidentType: string;
  evidenceType: string;
  proceduralDefects: string[];
  jurisdiction: string;
};

export type ResearchResult = {
  query: ResearchQuery;
  precedents: PrecedentResult[];
  standards: StandardResult[];
  fatalErrors: string[];
  generatedAt: string;
};

export type StandardResult = {
  code: string;
  title: string;
  applicability: "correct" | "wrong" | "partial";
  reason: string;
  source: DatabaseSource;
};

/**
 * Fact-fit scoring rubric:
 * - Incident type match: 40 pts
 * - Evidence type match: 35 pts
 * - Procedural defect match: 25 pts
 * Score >= 70 → exact/analogous; < 40 → rejected
 */
export function scorePrecedentFit(
  precedentTags: string[],
  query: ResearchQuery
): { score: number; level: FitLevel; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  const incidentKeywords = query.incidentType.toLowerCase().split(/\s+/);
  const evidenceKeywords = query.evidenceType.toLowerCase().split(/\s+/);
  const defectKeywords = query.proceduralDefects.map((d) => d.toLowerCase()).join(" ");

  const tagStr = precedentTags.join(" ").toLowerCase();

  // Incident match (40 pts)
  const incidentHits = incidentKeywords.filter((k) => k.length > 3 && tagStr.includes(k)).length;
  const incidentScore = Math.min(40, (incidentHits / Math.max(incidentKeywords.length, 1)) * 40);
  score += incidentScore;
  if (incidentScore >= 20) reasons.push("incident type matches");
  else reasons.push("incident type mismatch");

  // Evidence match (35 pts)
  const evidenceHits = evidenceKeywords.filter((k) => k.length > 3 && tagStr.includes(k)).length;
  const evidenceScore = Math.min(35, (evidenceHits / Math.max(evidenceKeywords.length, 1)) * 35);
  score += evidenceScore;
  if (evidenceScore >= 17) reasons.push("evidence type matches");
  else reasons.push("evidence type mismatch");

  // Procedural defect match (25 pts)
  const defectHits = defectKeywords.split(/\s+/).filter((k) => k.length > 3 && tagStr.includes(k)).length;
  const defectScore = Math.min(25, defectHits * 5);
  score += defectScore;
  if (defectScore >= 10) reasons.push("procedural defect pattern matches");

  const finalScore = Math.round(score);
  let level: FitLevel;
  if (finalScore >= 75) level = "exact";
  else if (finalScore >= 50) level = "analogous";
  else if (finalScore >= 30) level = "weak";
  else level = "rejected";

  return { score: finalScore, level, reason: reasons.join("; ") };
}

/**
 * Build a structured AI research prompt for external LLM/API use.
 * This prompt enforces fact-fit discipline and citation standards.
 */
export function buildResearchPrompt(query: ResearchQuery, files: string[]): string {
  return `LEGAL RESEARCH REQUEST — FACT-FIT ENFORCED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CASE: ${query.caseTitle}
JURISDICTION: ${query.jurisdiction}
INCIDENT TYPE: ${query.incidentType}
EVIDENCE TYPE: ${query.evidenceType}
PROCEDURAL DEFECTS: ${query.proceduralDefects.join(", ")}
BRIEF: ${query.brief}
INPUT FILES: ${files.length > 0 ? files.join(", ") : "[none uploaded]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY RESEARCH INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASES TO SEARCH (in order of priority):
1. Manupatra — Indian SC/HC judgments (primary)
2. SCC Online — Supreme Court cases
3. Indian Kanoon — full-text search
4. Lexis Nexis India — annotated cases
5. BAILII / Westlaw — international precedents
6. BIS Portal — IS codes (bis.gov.in)
7. ASTM International — technical standards
8. CPWD Manual 2023 — construction norms

FACT-FIT GATE (MANDATORY — DO NOT SKIP):
For EACH precedent you retrieve, you MUST score it on:
  [A] Incident type match (0-40 pts): Does the case involve same type of incident?
  [B] Evidence type match (0-35 pts): Same type of forensic/material evidence?
  [C] Procedural defect match (0-25 pts): Same procedural violations?
  TOTAL >= 70 → "exact match" (use as primary authority)
  TOTAL 50-69 → "analogous" (use with qualification)
  TOTAL 30-49 → "weak" (use only as supporting, not primary)
  TOTAL < 30 → "rejected" — DO NOT USE. Mark as FATAL ERROR if used.

OUTPUT FORMAT (per precedent):
  Name: [case name]
  Citation: [citation]
  Court: [court name]
  Date: [date]
  Fit Score: [A+B+C]/100
  Fit Level: [exact/analogous/weak/rejected]
  Fit Reason: [why it matches or doesn't]
  Holding: [key holding — max 50 words]
  Application: [how it applies to THIS case — specific, not generic]
  Source: [database name + URL if available]

CITATION DISCIPLINE:
- Provide exact citation (year, volume, page/para)
- Do NOT paraphrase holdings — quote directly with quotation marks
- If citation cannot be verified, mark as [UNVERIFIED — DO NOT USE IN COURT]
- Confidence marker: HIGH / MEDIUM / LOW

FATAL ERROR DETECTION:
If any precedent in the existing research does NOT match the incident/evidence/procedure
pattern of this case, flag it as: ⚠ FATAL ERROR — FACTUAL MISMATCH — DO NOT USE

STANDARDS ANALYSIS:
For each IS/ASTM/BS standard cited by prosecution:
  - State whether it applies to THIS case's material/context
  - If wrong standard: mark as "WRONG STANDARD — FOUNDATIONAL ERROR"
  - Provide the CORRECT standard with clause references

OUTPUT SECTIONS REQUIRED:
1. Precedent List (fact-fit scored)
2. Standards Validity Analysis
3. Issue-wise Argument Blocks
4. Cross-Reference Matrix (violation → standard → precedent)
5. Fatal Errors Detected
6. Risk Assessment (what prosecution might argue back)`;
}

/**
 * Database search URLs for direct linking
 */
export const DB_URLS: Record<DatabaseSource, string> = {
  manupatra: "https://www.manupatra.com",
  scc_online: "https://www.scconline.com",
  indian_kanoon: "https://indiankanoon.org",
  lexis_nexis: "https://www.lexisnexis.in",
  westlaw: "https://legal.thomsonreuters.com/en/westlaw",
  bailii: "https://www.bailii.org",
  astm: "https://www.astm.org",
  bis: "https://www.bis.gov.in",
  cpwd: "https://cpwd.gov.in",
};

export const DB_LABELS: Record<DatabaseSource, string> = {
  manupatra: "Manupatra",
  scc_online: "SCC Online",
  indian_kanoon: "Indian Kanoon",
  lexis_nexis: "Lexis Nexis India",
  westlaw: "Westlaw",
  bailii: "BAILII",
  astm: "ASTM International",
  bis: "BIS Portal",
  cpwd: "CPWD Manual",
};
