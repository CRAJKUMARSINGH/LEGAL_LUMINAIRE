/**
 * Case 02 — NDPS Bail — Stub Data
 * [SYNTHETIC DEMO DATA — NOT REAL]
 * All citations are DEMO PLACEHOLDERS — verify before filing.
 */

export const CASE02_META = {
  id: "case02",
  title: "NDPS Bail — §52A Procedure Violation",
  caseNo: "S.B. Criminal Misc. Bail Application No. 4521/2024",
  court: "Rajasthan High Court, Jaipur Bench",
  charges: "NDPS Act §8/21/29",
  accused: "[Accused Name]",
  isDemoData: true,
} as const;

export const CASE02_GROUNDS = [
  { id: "g1", title: "§52A NDPS — Mandatory Procedure Violated", body: "No Magistrate was present at the time of sampling. Certificate under §52A(4) was not obtained. This is a mandatory requirement and its non-compliance vitiates the entire forensic evidence.", priority: "primary" },
  { id: "g2", title: "No Independent Witness", body: "The seizure was witnessed only by police personnel. No independent civilian witness was present, making the recovery evidence unreliable.", priority: "primary" },
  { id: "g3", title: "FSL Report Delayed — 45 Days", body: "The FSL report was received 45 days after seizure. The prescribed period is 30 days. This delay raises serious doubts about the integrity of the samples.", priority: "secondary" },
  { id: "g4", title: "No Nexus — Vehicle Not Owned by Accused", body: "The vehicle in which the contraband was allegedly found does not belong to the accused. No nexus between the accused and the contraband has been established.", priority: "secondary" },
  { id: "g5", title: "Art. 21 — Prolonged Custody Without Trial", body: "The accused has been in custody for an extended period without trial commencing. This violates the right to speedy trial under Article 21 of the Constitution.", priority: "secondary" },
] as const;

export const CASE02_PRECEDENTS = [
  { id: "p1", name: "State of Punjab v. Baldev Singh", citation: "(1999) 6 SCC 172", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "§50 NDPS compliance is mandatory — non-compliance entitles accused to bail.", blockedFromDraft: false },
  { id: "p2", name: "Tofan Singh v. State of Tamil Nadu", citation: "(2021) 4 SCC 1", court: "Supreme Court of India (Constitution Bench)", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "NDPS Act officers are police officers — confessions inadmissible.", blockedFromDraft: false },
] as const;
