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
export {
  TC27_META, TC27_GROUNDS, TC27_PRECEDENTS, TC27_PRAYER,
  TC28_META, TC28_GROUNDS, TC28_PRECEDENTS, TC28_PRAYER,
  TC29_META, TC29_GROUNDS, TC29_PRECEDENTS, TC29_PRAYER,
  TC30_META, TC30_GROUNDS, TC30_PRECEDENTS, TC30_PRAYER,
  TC31_META, TC31_GROUNDS, TC31_PRECEDENTS, TC31_PRAYER,
  TC32_META, TC32_GROUNDS, TC32_PRECEDENTS, TC32_PRAYER,
  TC33_META, TC33_GROUNDS, TC33_PRECEDENTS, TC33_PRAYER,
  TC34_META, TC34_GROUNDS, TC34_PRECEDENTS, TC34_PRAYER,
  TC35_META, TC35_GROUNDS, TC35_PRECEDENTS, TC35_PRAYER,
  TC36_META, TC36_GROUNDS, TC36_PRECEDENTS, TC36_PRAYER,
  WEEK03_STUB_REGISTRY,
} from "./week03-cases-tc27-to-tc36";

/** Registry of all stub cases for the demo case selector */
export const STUB_CASE_REGISTRY = [
  { id: "case02", title: "NDPS Bail — §52A Procedure Violation",    type: "criminal", outputType: "bail" },
  { id: "case03", title: "NI Act §138 Discharge — Security Cheque", type: "criminal", outputType: "discharge" },
  { id: "case04", title: "Peetambara Notice Reply — Case 0104042026", type: "civil", outputType: "reply" },
  { id: "tc27", title: "OC Refusal — Unpublished Checklist Mandamus", type: "writ", outputType: "writ" },
  { id: "tc28", title: "PIL — Unsafe Footbridge Near School", type: "writ", outputType: "writ" },
  { id: "tc29", title: "Contempt — Settlement Decree Wilful Breach", type: "civil", outputType: "appeal" },
  { id: "tc30", title: "§11 Arbitration Appointment — Logistics", type: "commercial", outputType: "arbitration" },
  { id: "tc31", title: "Award Challenge §34 — Partial Grounds", type: "commercial", outputType: "arbitration" },
  { id: "tc32", title: "Execution — Money Decree + Dissipation", type: "civil", outputType: "reply" },
  { id: "tc33", title: "Caveat — Property Sale Injunction Notice", type: "civil", outputType: "reply" },
  { id: "tc34", title: "IP Injunction — Confidential Design Misuse", type: "commercial", outputType: "appeal" },
  { id: "tc35", title: "Amendment — Wrong Survey No. Correction", type: "civil", outputType: "reply" },
  { id: "tc36", title: "WS — Set-Off + Qualified Admission Trap", type: "commercial", outputType: "reply" },
] as const;
