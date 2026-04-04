/**
 * Stub Cases Index — Legal Luminaire
 * [SYNTHETIC DEMO DATA — NOT REAL]
 *
 * Exports all stub case data for offline demo mode.
 * These are used when OpenAI API is not configured.
 * All data is clearly marked as DEMO / SYNTHETIC.
 */

export { CASE02_META, CASE02_GROUNDS, CASE02_PRECEDENTS } from "./case02-ndps";
export { CASE03_META, CASE03_GROUNDS, CASE03_PRECEDENTS } from "./case03-ni-act";
export { CASE04_META, CASE04_GROUNDS, CASE04_PRECEDENTS } from "./case04-peetambara";

/** Registry of all stub cases for the demo case selector */
export const STUB_CASE_REGISTRY = [
  { id: "case02", title: "NDPS Bail — §52A Procedure Violation",    type: "criminal", outputType: "bail" },
  { id: "case03", title: "NI Act §138 Discharge — Security Cheque", type: "criminal", outputType: "discharge" },
  { id: "case04", title: "Peetambara Notice Reply — Case 0104042026", type: "civil", outputType: "reply" },
] as const;
