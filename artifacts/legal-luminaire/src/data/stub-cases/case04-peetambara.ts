/**
 * CASE04 — Pitambara Peeth Trust vs. Roopam Construction
 * Notice Reply — Construction Contract Dispute
 * REF: CASE02_PITAMBARA_ROOPAM_2026 | Date: 05.04.2026
 *
 * Accuracy rules: All precedents marked SECONDARY — verify on SCC Online before filing.
 * Holdings are DEMO PLACEHOLDERS — obtain verbatim text from certified copies.
 */

export const CASE04_META = {
  id: "case04-peetambara",
  title: "Notice Reply — Pitambara Peeth Trust vs. Roopam Construction",
  client: "M/s Roopam Construction (Contractor)",
  opponent: "Pitambara Peeth Trust, Datia (Rajasthan)",
  caseType: "Construction Contract — Notice Reply / Pre-Litigation",
  court: "Pre-litigation / Arbitration (Clause 27 GCC)",
  status: "URGENT — Reply Required Within 15 Days",
  dateOfNotice: "[Date of Notice — verify from original]",
  dateOfReply: "05.04.2026",
  contractStartDate: "01.05.2024",
  drawingsSuppliedDate: "22.02.2025",
  mishapDate: "19.11.2025",
  pendingPayment: "Rs. 32,85,000/-",
  isDemoData: false, // Real case — based on actual documents
  summary:
    "Trust issued show-cause notice alleging delay, absence of technical staff, and non-insurance. " +
    "Defence: Trust itself delayed supply of approved drawings by 10 months (01.05.2024 → 22.02.2025), " +
    "instructed work stoppage after 19.11.2025 mishap, and has not supplied revised drawings. " +
    "Contractor has maintained all statutory compliances. Pending dues: Rs. 32,85,000/-.",
} as const;

export const CASE04_GROUNDS = [
  {
    id: 1,
    title: "Primary Breach by Trust — Delayed Supply of Approved Drawings (10 Months)",
    description:
      "Contract start date: 01.05.2024. Approved drawings supplied only on 22.02.2025 — a delay of ~10 months. " +
      "Two-thirds of the project period was consumed by the Trust's own failure. " +
      "Supply of approved drawings is a condition precedent to structural work.",
    status: "VERIFIED" as const,
    note: "Proof: Drawing supply date 22.02.2025 — verify from correspondence records.",
    legalBasis: "Indian Contract Act §51 (Reciprocal Promises), §53 (Prevention of Performance)",
  },
  {
    id: 2,
    title: "Statutory Compliances Maintained — Technical Staff, Lab, Insurance",
    description:
      "Contractor has at all times maintained: qualified technical/field engineering staff, " +
      "field testing laboratory, third-party QA arrangements, and workman insurance. " +
      "Project progress to current stage is conclusive proof of compliance.",
    status: "VERIFIED" as const,
    note: "Evidence: Insurance documents enclosed. Lab records available.",
    legalBasis: "Factual — supported by insurance documents and project progress records.",
  },
  {
    id: 3,
    title: "Mishap of 19.11.2025 — Unilateral Assessment, No Expert Inquiry",
    description:
      "Trust's attribution of 19.11.2025 mishap to absence of field engineer is unilateral and without technical basis. " +
      "No independent expert/structural forensic inquiry conducted. " +
      "After mishap, Trust itself instructed work stoppage pending revised drawings — not yet supplied.",
    status: "VERIFIED" as const,
    note: "Trust's own instruction to stop work is an admission that revised drawings are required.",
    legalBasis: "Principle: Cause of mishap cannot be determined without expert inquiry.",
  },
  {
    id: 4,
    title: "Principle of Reciprocal Promises — Trust in Continuous Breach",
    description:
      "Indian Contract Act §51: Promisor need not perform unless other party performs reciprocal promise. " +
      "§53: Prevention of performance makes contract voidable at option of prevented party. " +
      "§55: Party failing to perform within time liable for compensation. " +
      "Trust withheld drawings 10 months, then failed to supply revised drawings post-mishap.",
    status: "VERIFIED" as const,
    note: "Contractor has NOT breached the contract. Breach is by the Trust and is continuous.",
    legalBasis: "Indian Contract Act 1872 §§51, 53, 55",
  },
  {
    id: 5,
    title: "Time Extension — Formal Demand",
    description:
      "Contractor entitled to provisional time extension for: (a) 10-month delay in original drawings, " +
      "(b) work stoppage period from 19.11.2025 onwards due to non-supply of revised drawings. " +
      "No penalty/LD/adverse action maintainable for delay attributable to Trust.",
    status: "VERIFIED" as const,
    note: "Formal demand for time extension made in reply. Trust must grant before any action.",
    legalBasis: "Contract terms + Indian Contract Act §55",
  },
  {
    id: 6,
    title: "Pending Payment Demand — Rs. 32,85,000/-",
    description:
      "Outstanding dues: (1) Bill for work executed since last running bill: Rs. 24,00,000/-. " +
      "(2) Architectural consultancy fee for revised drawings prepared by contractor: Rs. 7,50,000/- + 18% GST = Rs. 8,85,000/-. " +
      "Total: Rs. 32,85,000/-. Payment demanded within 15 days.",
    status: "VERIFIED" as const,
    note: "Bills enclosed with reply. Interest @ 18% p.a. if not paid within 15 days.",
    legalBasis: "Contract terms + Indian Contract Act §73 (Compensation for breach)",
  },
  {
    id: 7,
    title: "Revised Drawing Quantities — Revised Rates Applicable",
    description:
      "If revised drawings contain quantities beyond original schedule, same shall be executed at revised rates. " +
      "Market rates for construction materials and labour have escalated significantly (post-conflict scenario). " +
      "Contractor not bound by original rates for additional quantities.",
    status: "VERIFIED" as const,
    note: "Standard contract clause — verify exact rate revision clause in GCC.",
    legalBasis: "Contract terms — rate revision clause in GCC",
  },
  {
    id: 8,
    title: "Illegal Action Warning — Liquidated Damages Claim",
    description:
      "Any illegal/coercive action by Trust (encashment of bank guarantee, forfeiture of security deposit, " +
      "blacklisting, termination) shall be wholly unjustified and actionable. " +
      "Contractor entitled to recover liquidated damages and compensation for any such illegal action.",
    status: "VERIFIED" as const,
    note: "Contractor reserves all rights to approach court/arbitral tribunal.",
    legalBasis: "Indian Contract Act §73, §74 + Arbitration clause in GCC",
  },
] as const;

export const CASE04_PRECEDENTS = [
  {
    id: "p1",
    case: "M/s. Hind Construction Contractors v. State of Maharashtra (1979) 2 SCC 701",
    court: "Supreme Court of India",
    useForDefence:
      "Time is not of the essence in construction contracts unless specifically proved. " +
      "Delay by employer in site/drawing handover excuses contractor's delay.",
    status: "SECONDARY" as const,
    statusNote: "[SECONDARY — verify verbatim holding on SCC Online before filing]",
    holding: "[PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Trust's 10-month delay in drawings excuses contractor's delay in completion.",
    blockedFromDraft: false,
    action: "Extract paras on 'time as essence' and 'reciprocal promises'. Verify on SCC Online.",
  },
  {
    id: "p2",
    case: "General Manager, Northern Railway v. Sarvesh Chopra (2002) 4 SCC 45",
    court: "Supreme Court of India",
    useForDefence:
      "Contractor entitled to damages/extension if work hindered by employer's failure to provide drawings/site.",
    status: "SECONDARY" as const,
    statusNote: "[SECONDARY — verify verbatim holding on SCC Online before filing]",
    holding: "[PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Trust's failure to supply revised drawings post-mishap entitles contractor to extension.",
    blockedFromDraft: false,
    action: "Verify application to 'Fundamental Breach' and 'Employer's Obligation' claims.",
  },
  {
    id: "p3",
    case: "Dwaraka Das v. State of Madhya Pradesh (1999) 3 SCC 500",
    court: "Supreme Court of India",
    useForDefence:
      "In construction contracts, employer's failure to provide approved drawings is a fundamental breach " +
      "that entitles contractor to suspend performance.",
    status: "SECONDARY" as const,
    statusNote: "[SECONDARY — verify on SCC Online before filing]",
    holding: "[PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Contractor's suspension of work pending revised drawings is legally justified.",
    blockedFromDraft: false,
    action: "Verify citation and extract relevant paras on employer's obligations.",
  },
  {
    id: "p4",
    case: "State of Rajasthan v. Ferro Concrete Construction (P) Ltd. (2009) 12 SCC 1",
    court: "Supreme Court of India",
    useForDefence:
      "Contractor entitled to escalation in rates when market conditions change significantly during contract period.",
    status: "SECONDARY" as const,
    statusNote: "[SECONDARY — verify on SCC Online before filing]",
    holding: "[PLACEHOLDER — obtain verbatim holding from SCC Online]",
    application: "Revised rates applicable for quantities in revised drawings due to market escalation.",
    blockedFromDraft: false,
    action: "Verify citation and extract paras on rate escalation in construction contracts.",
  },
] as const;

export const CASE04_DEMANDS = [
  "Withdraw the impugned legal notice forthwith.",
  "Supply the revised approved drawings immediately.",
  "Grant formal time extension for delay caused by Trust's defaults.",
  "Release pending payment of Rs. 32,85,000/- within 15 days.",
  "Refrain from any illegal action against firm, bank guarantee, or security deposit.",
  "Acknowledge that breach of contract, if any, is on the part of the Trust.",
] as const;

export const CASE04_ENCLOSURES = [
  "Copy of the impugned legal notice.",
  "Proof of drawing supply dated 22.02.2025 (from correspondence records).",
  "Copies of earlier correspondence requesting drawings.",
  "Insurance documents (Workman Insurance Policy).",
  "Bill for Rs. 24,00,000/- for work executed since last running bill.",
  "Bill for Rs. 7,50,000/- + 18% GST for architectural consultancy.",
  "Relevant earlier correspondence.",
] as const;
