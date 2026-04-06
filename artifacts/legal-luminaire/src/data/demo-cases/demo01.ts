import { caseInfo, timelineEvents, caseLawMatrix, standardsMatrix, caseDocuments } from "../caseData";

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
  { id: "TC-18", title: "[DEMO] Insurance Claim Litigation", isDemo: true, charges: "Consumer Protection", court: "Consumer Forum", status: "Demo Available", summary: "Polished marketing showcase demonstrating civil evidence mapping algorithms against repudiated claims." }
];
