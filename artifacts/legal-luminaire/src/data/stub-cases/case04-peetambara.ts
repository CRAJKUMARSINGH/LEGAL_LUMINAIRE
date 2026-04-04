/**
 * PEETAMBARA_NOTICE_REPLY - Case Data (Peetambara Peeth vs. Roopam Construction)
 * [DEMO DATA - REF: 0104042026]
 */

export const CASE04_META = {
  id: "case04-peetambara",
  title: "Show Cause Notice — Shree Peetambara Peeth (Datia)",
  accused: "Roopam Construction Pvt. Ltd. (Contractor)",
  charges: "Clause 27 Termination Notice (GCC)",
  court: "Internal / Pre-litigation (Arbitration Potential)",
  status: "URGENT — Notice Reply Required (15 Days)",
  summary:
    "Show cause notice issued alleging delay in progress, lack of technical staff, and failure to provide insurance. Defence centers on employer's failure to provide site access until Feb 2025 and faulty working drawings provided by the architect.",
};

export const CASE04_GROUNDS = [
  {
    id: 1,
    title: "Delayed Site Handover",
    description: "Agreement dated 01.05.2024, but site was not handed over until February 2025 despite repeated requests.",
    status: "VERIFIED" as const,
    note: "Commencement date effectively shifted to March 2025.",
  },
  {
    id: 2,
    title: "Faulty Working Drawings",
    description: "Slow progress attributed to errors in drawings provided by Employer's architect and delays in approval of corrected drawings.",
    status: "VERIFIED" as const,
    note: "Contractor repeatedly raised these issues in meetings.",
  },
  {
    id: 3,
    title: "Technical Staff Compliance",
    description: "Engineers were hired at project start; temporary absence on 19.11.2025 was due to authorized personal leave (sister's wedding).",
    status: "VERIFIED" as const,
    note: "Not a fundamental breach of contract.",
  },
  {
    id: 4,
    title: "Insurance Proof",
    description: "Insurance policy for staff and labor already exists (Copy No: PEET-INS-2025-01).",
    status: "VERIFIED" as const,
    note: "Allegation of non-insurance is factually incorrect.",
  }
];

export const CASE04_PRECEDENTS = [
  {
    case: "M/s. Hind Construction Contractors v. State of Maharashtra, (1979) 2 SCC 701",
    court: "Supreme Court",
    useForDefence: "Time is not essence unless specifically proved; delay by employer in site handover excuses contractor's delay.",
    status: "VERIFIED" as const,
    action: "Extract relevant paras on 'time as essence' and 'reciprocal promises'.",
  },
  {
    case: "General Manager, Northern Railway v. Sarvesh Chopra, (2002) 4 SCC 45",
    court: "Supreme Court",
    useForDefence: "Contractor entitled to damages/extension if work hindered by employer's failure to provide drawings/site.",
    status: "VERIFIED" as const,
    action: "Verify application to 'Fundamental Breach' claims.",
  }
];
