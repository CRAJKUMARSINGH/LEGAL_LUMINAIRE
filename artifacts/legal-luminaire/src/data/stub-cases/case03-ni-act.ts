/**
 * Case 03 — NI Act §138 Discharge — Stub Data
 * [SYNTHETIC DEMO DATA — NOT REAL]
 * All citations are DEMO PLACEHOLDERS — verify before filing.
 */

export const CASE03_META = {
  id: "case03",
  title: "NI Act §138 Discharge — Security Cheque",
  caseNo: "CC No. 1892/2023",
  court: "MM Court, Saket, Delhi",
  charges: "NI Act §138",
  accused: "[Director Name], M/s Sunrise Traders Pvt. Ltd.",
  isDemoData: true,
} as const;

export const CASE03_GROUNDS = [
  {
    id: "g1",
    title: "Cheque Given as Security — Not for Legally Enforceable Debt",
    body: "The cheque was given as security for a disputed loan transaction. It was not issued for discharge of any legally enforceable debt. A security cheque cannot form the basis of prosecution under §138 NI Act.",
    priority: "primary",
  },
  {
    id: "g2",
    title: "Presumption under §139 Rebutted",
    body: "The accused has produced evidence showing the cheque was given as security. The presumption under §139 NI Act is rebuttable and has been rebutted by the defence evidence.",
    priority: "primary",
  },
  {
    id: "g3",
    title: "Disputed Loan Terms — No Legally Enforceable Debt",
    body: "The underlying transaction is a disputed loan with contested terms. No legally enforceable debt exists as the terms were never finalised.",
    priority: "secondary",
  },
  {
    id: "g4",
    title: "Notice Reply Sent Within Time — Dispute Raised",
    body: "The accused sent a reply to the statutory notice within the prescribed period, clearly disputing the liability. This further supports the defence.",
    priority: "secondary",
  },
] as const;

export const CASE03_PRECEDENTS = [
  {
    id: "p1",
    name: "Rangappa v. Sri Mohan",
    citation: "(2010) 11 SCC 441",
    court: "Supreme Court of India",
    status: "SECONDARY" as const,
    statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]",
    holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Presumption under §139 NI Act is rebuttable — accused can lead evidence.",
    blockedFromDraft: false,
  },
  {
    id: "p2",
    name: "Krishna Janardhan Bhat v. Dattatraya G. Hegde",
    citation: "(2008) 4 SCC 54",
    court: "Supreme Court of India",
    status: "SECONDARY" as const,
    statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]",
    holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Security cheque — no legally enforceable debt — discharge warranted.",
    blockedFromDraft: false,
  },
] as const;
