// CASE_01_HemrajG - Stadium Wall Collapse Defence Case Data

export const caseInfo = {
  id: "CASE_01_HemrajG",
  title: "Special Session Case No. 1/2025 (Udaipur)",
  accused: "Hemraj Vardar (Contractor/Director)",
  charges: "IPC 304A / 337 / 338 + PCA",
  court: "Sessions Court, Udaipur",
  status: "Active — Defence Preparation",
  summary:
    "Outer stadium wall collapse post-construction/repair phase. Prosecution relies on FSL mortar quality report. Defence challenges sampling methodology, chain of custody, weather contamination, and absence of contractor representation.",
};

export const timelineEvents = [
  {
    id: 1,
    title: "Project and Role Context",
    description:
      "Accused identified as contractor/director linked to repair/construction work.",
    status: "PENDING" as const,
    note: "Requires case file annexure proof",
  },
  {
    id: 2,
    title: "Incident — Wall Collapse",
    description:
      "Outer stadium wall collapse occurred post-construction/repair phase (not active pour stage).",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 3,
    title: "Weather Conditions at Sampling",
    description:
      "Defence version: sampling conducted during storm/rain, creating contamination risk.",
    status: "PENDING" as const,
    note: "To be corroborated via weather records + witnesses",
  },
  {
    id: 4,
    title: "Sampling Method Allegation",
    description:
      "Samples allegedly collected in haphazard/non-representative manner.",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 5,
    title: "Representation / Procedural Fairness",
    description:
      "No contractor representative present at collection/testing stage.",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 6,
    title: "Chain of Custody Issue",
    description:
      "Incomplete or absent chain-of-custody narrative (collection → sealing → dispatch → lab receipt → testing).",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 7,
    title: "Prosecution Dependence on FSL",
    description:
      "Case theory relies heavily on FSL conclusion of weak/failed mortar quality.",
    status: "PENDING" as const,
    note: "",
  },
];

export const caseLawMatrix = [
  {
    case: "Kattavellai @ Devakar v. State of Tamil Nadu, Cr. A. 1672/2019",
    court: "Supreme Court",
    useForDefence: "Chain-of-custody rigor and forensic-procedure scrutiny",
    status: "VERIFIED" as const,
    action: "Add certified/order copy and exact para numbers",
    reporter: "unknown",
    verifiedBy: "case-file",
  },
  {
    case: "Uttarakhand HC (March 2026 — chain-of-custody defects)",
    court: "High Court",
    useForDefence:
      "Forensic evidence loses force when custody chain is not proved",
    status: "SECONDARY" as const,
    action: "Fetch full judgment text/citation and para extract",
    reporter: "unknown",
    verifiedBy: "manual",
  },
  {
    case: "Surendra Koli v. CBI (2023 refs on evidentiary scrutiny)",
    court: "Supreme Court",
    useForDefence:
      "Reinforces strict proof requirements in forensic-heavy cases",
    status: "SECONDARY" as const,
    action: "Confirm exact proposition from judgment text",
    reporter: "unknown",
    verifiedBy: "manual",
  },
  {
    case: "Sushil Sharma v. State (NCT of Delhi), (2014) 4 SCC 317",
    court: "Supreme Court",
    useForDefence:
      "General caution that expert opinion depends on factual foundation",
    status: "SECONDARY" as const,
    action: "Verify exact para language; avoid invented quote blocks",
    year: "2014",
    volume: "4",
    reporter: "SCC",
    page: "317",
    para: "",
    verifiedBy: "manual",
  },
  {
    case: "State of Gujarat v. Mohanbhai (2003) 4 GLR 3121",
    court: "Gujarat HC",
    useForDefence:
      "Potential support on sample integrity and proof chain",
    status: "PENDING" as const,
    action: "Obtain authentic judgment copy before reliance",
    year: "2003",
    volume: "4",
    reporter: "GLR",
    page: "3121",
    para: "",
    verifiedBy: "unknown",
  },
  {
    case: "R.B. Constructions v. State of Maharashtra (2014 SCC OnLine Bom 125)",
    court: "Bombay HC",
    useForDefence: "Cited for ex-parte sampling / natural justice",
    status: "PENDING" as const,
    action: "Citation authenticity check required",
    year: "2014",
    reporter: "SCC OnLine Bom",
    page: "125",
    para: "",
    verifiedBy: "unknown",
  },
  {
    case: "CBI v. K.S. Kalra (2011 SCC OnLine Del 3412)",
    court: "Delhi HC",
    useForDefence: "Cited for CPWD/BIS procedural compliance",
    status: "PENDING" as const,
    action: "Citation authenticity check required",
    year: "2011",
    reporter: "SCC OnLine Del",
    page: "3412",
    para: "",
    verifiedBy: "unknown",
  },
  {
    case: "C.J. Christopher Signi v. State of Tamil Nadu, 2025 SCC OnLine Mad 3214",
    court: "Madras HC",
    useForDefence:
      "Persuasive precedent that mere apprehension of tampering is no ground to deny forensic examination; supports right to independent expert comparison of defence material.",
    status: "SECONDARY" as const,
    action:
      "Upload/verify full SCC judgment; use only as persuasive authority after confirming authentic text.",
    year: "2025",
    reporter: "SCC OnLine Mad",
    page: "3214",
    para: "",
    verifiedBy: "manual",
  },
];

export const standardsMatrix = [
  {
    standard: "IS 1199:2018",
    proposition:
      "Sampling must be systematic and representative; process discipline matters before testing inference",
    caseFact: "Haphazard collection claim weakens representativeness",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "IS 3535:1986",
    proposition:
      "Supports structured cement sampling protocol and documentation discipline",
    caseFact: "Random collection / no documented protocol challenge",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "IS 4031",
    proposition:
      "Test outcomes depend on proper specimen handling and controlled test conditions",
    caseFact:
      "Field-contaminated or poorly tracked sample undermines lab output",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "ASTM C780",
    proposition:
      "Field weather can influence outcomes; field-lab comparability needs caution",
    caseFact:
      "Rain/storm collection can materially distort interpretive reliability",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "ISO/IEC 17025 (NABL)",
    proposition:
      "Traceability, documented handling, method control, and record integrity are expected",
    caseFact:
      "Missing custody/receipt/environment records impacts confidence in report",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "CPWD Works Manual",
    proposition:
      "Public works QA requires process compliance and documented controls",
    caseFact:
      "Ex-parte or undocumented sampling can be framed as QA breach",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "NBC 2016",
    proposition:
      "Structural safety regime ties execution quality to codified standards and compliance",
    caseFact:
      "Supports argument for strict scrutiny of testing foundation",
    confidence: "SECONDARY" as const,
  },
];

export const caseDocuments = [
  { name: "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md", type: "report", size: "45 KB" },
  { name: "DEFENCE_REPLY_FINAL_v4.pdf", type: "draft", size: "32 KB" },
  { name: "DEFENCE_REPLY_FINAL_v4.lex", type: "application", size: "36 KB" },
  { name: "DEFENCE_REPLY_UPDATED_v2.lex", type: "draft", size: "78 KB" },
  { name: "DISCHARGE_APPLICATION_UPDATED_v2.lex", type: "application", size: "65 KB" },
  { name: "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex", type: "application", size: "110 KB" },
  { name: "Stadium_Collapse_Defence_Hindi.lex", type: "draft", size: "85 KB" },
  { name: "Case_Facts_Timeline.md", type: "timeline", size: "12 KB" },
  { name: "Case_Law_Matrix_Verified_Pending.md", type: "matrix", size: "8 KB" },
  { name: "Standards_Matrix_IS_ASTM_NABL.md", type: "matrix", size: "6 KB" },
  { name: "Argument_Bank_And_Annexure_Builder.md", type: "arguments", size: "34 KB" },
  { name: "Cross_Reference_Matrix_Detailed.lex", type: "matrix", size: "22 KB" },
  { name: "DEEPsEARCH.md", type: "research", size: "15 KB" },
  { name: "Forensic_Protocol_Checklist.md", type: "checklist", size: "10 KB" },
  { name: "Legal_Case_References_Brief_Notes.md", type: "references", size: "18 KB" },
  { name: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md", type: "research", size: "42 KB" },
];
