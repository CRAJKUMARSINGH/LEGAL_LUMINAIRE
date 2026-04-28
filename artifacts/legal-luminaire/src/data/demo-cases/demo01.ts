import { caseInfo, timelineEvents, caseLawMatrix, standardsMatrix, caseDocuments } from "../caseData";
export { INFRA_ARB_CASES, INFRA_ARB_SUMMARY } from "./infra-arb-cases";

export const demoCase = {
  ...caseInfo,
  id: "TC-01",
  title: "[DEMO] " + caseInfo.title,
  isDemo: true,
  timelineEvents,
  caseLawMatrix: caseLawMatrix.map(c => ({
    ...c,
    status: c.status === "PENDING" ? "SECONDARY" : c.status,
    case: `[DEMO PLACEHOLDER] ${c.case}`
  })),
  standardsMatrix,
  caseDocuments
};

export const demoCasesList = [
  demoCase,
  { id: "TC-02", title: "[DEMO] NDPS Bail Application", isDemo: true, charges: "NDPS Act", court: "High Court", status: "Demo Available", summary: "Demo synthetic facts addressing chain of custody breaches in narcotics sampling." },
  { id: "TC-03", title: "[DEMO] NI Act Cheque Bounce Defense", isDemo: true, charges: "NI Act Sec 138", court: "Magistrate", status: "Demo Available", summary: "Demo exploring synthetic evidence regarding rebuttal of debt presumption." },
  { id: "TC-18", title: "[DEMO] Insurance Claim Litigation", isDemo: true, charges: "Consumer Protection", court: "Consumer Forum", status: "Demo Available", summary: "Polished marketing showcase demonstrating civil evidence mapping algorithms against repudiated claims." },
  // Infrastructure Arbitration Cases (TC-22 to TC-26)
  { id: "TC-22", title: "[DEMO] Hospital Building Arbitration — RMSCL", isDemo: true, charges: "A&C Act 1996 + CPWD GCC", court: "Rajasthan HC (Sec 11)", status: "Award Passed", summary: "300-bed hospital construction. 45-day site delay + 3 variation orders + payment delays. Award: ₹17.86 Cr." },
  { id: "TC-23", title: "[DEMO] NH-758 Highway Arbitration — NHAI", isDemo: true, charges: "A&C Act 1996 + FIDIC Red Book", court: "Rajasthan HC (Sec 11)", status: "Award Passed", summary: "45 km national highway. 78-day possession delay + blacklisting set aside. Award: ₹41.65 Cr." },
  { id: "TC-24", title: "[DEMO] Banas Dam Arbitration — WRD", isDemo: true, charges: "A&C Act 1996 + FIDIC 4.12", court: "Rajasthan HC (Sec 11)", status: "Award Passed", summary: "Medium irrigation dam. Unforeseeable geological conditions (FIDIC 4.12). Award: ₹42.85 Cr." },
  { id: "TC-25", title: "[DEMO] 220 kV Substation Arbitration — RVPNL", isDemo: true, charges: "A&C Act 1996 + FIDIC + IEEMA", court: "Rajasthan HC (Sec 11)", status: "Award Passed", summary: "GIS substation + transmission line. Employer-supplied equipment delayed 5 months. Award: ₹23.65 Cr." },
  { id: "TC-26", title: "[DEMO] Smart City Landscape Arbitration — USCL", isDemo: true, charges: "A&C Act 1996 + CPWD GCC", court: "Rajasthan HC (Sec 11)", status: "Award Passed", summary: "185-acre township landscaping. 19 variation orders + water supply failure. Award: ₹15.80 Cr." },
];
