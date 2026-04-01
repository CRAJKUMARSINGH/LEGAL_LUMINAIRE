/**
 * Case 01 — Hemraj Vardar, Special Session Case No. 1/2025, Udaipur
 * All data sourced from CASE_01_HemrajG/ documents.
 * Verification status per Case_Law_Matrix_Verified_Pending.md
 */

export type VerificationStatus = "VERIFIED" | "SECONDARY" | "PENDING";

export type Precedent = {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  holding: string;
  application: string;
  fitScore: number;
  fitLevel: "exact" | "analogous" | "weak" | "rejected";
  fitReason: string;
  status: VerificationStatus;
  statusNote: string;
  sourceUrl: string;
  tags: string[];
};

export type Standard = {
  code: string;
  title: string;
  applicability: "correct" | "wrong" | "partial";
  keyClause: string;
  violation: string;
  sourceUrl: string;
  confidence: VerificationStatus;
};

// ─── PRECEDENTS ───────────────────────────────────────────────────────────────
// Source: Case_Law_Matrix_Verified_Pending.md + Full_Case_References.md + forensic_defense_report.md

export const CASE01_PRECEDENTS: Precedent[] = [
  {
    id: "p1",
    name: "कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य",
    citation: "Criminal Appeal No. 1672/2019 | 2025 INSC 845",
    court: "सर्वोच्च न्यायालय — त्रि-न्यायाधीशीय खण्डपीठ (न्यायमूर्ति विक्रम नाथ, संजय करोल, संदीप मेहता)",
    date: "15 जुलाई 2025",
    holding: `"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."`,
    application: "मोर्टार नमूनों की शून्य श्रृंखला-अभिरक्षा → सम्पूर्ण फोरेंसिक रिपोर्ट अग्राह्य। यह निर्णय सम्पूर्ण भारत में बाध्यकारी है।",
    fitScore: 88,
    fitLevel: "exact",
    fitReason: "forensic evidence + chain of custody + procedural lapses — direct binding match",
    status: "VERIFIED",
    statusNote: "Existence verified. Add certified copy + exact para numbers before filing.",
    sourceUrl: "https://bhattandjoshiassociates.com/transforming-criminal-justice-supreme-courts-landmark-dna-evidence-guidelines-in-kattavellai-vs-state-of-tamil-nadu/",
    tags: ["forensic", "chain of custody", "evidence", "sampling", "collection", "contamination", "binding"],
  },
  {
    id: "p2",
    name: "उत्तराखण्ड उच्च न्यायालय — श्रृंखला-अभिरक्षा",
    citation: "LiveLaw Report — March 2026",
    court: "उत्तराखण्ड उच्च न्यायालय",
    date: "मार्च 2026",
    holding: `"A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."`,
    application: "शून्य श्रृंखला-अभिरक्षा → फोरेंसिक साक्ष्य निष्फल। मौखिक तर्क में सहायक।",
    fitScore: 82,
    fitLevel: "exact",
    fitReason: "chain of custody + forensic evidence inadmissibility — direct match",
    status: "SECONDARY",
    statusNote: "Fetch full judgment text + citation + para extract before filing.",
    sourceUrl: "https://www.livelaw.in/high-court/uttarakhand-high-court/uttarakhand-high-court-rape-conviction-chain-of-custody-forensic-evidence-528106",
    tags: ["chain of custody", "forensic", "evidence", "sampling", "material", "conviction"],
  },
  {
    id: "p3",
    name: "Sushil Sharma v. State (NCT of Delhi)",
    citation: "(2014) 4 SCC 317",
    court: "सर्वोच्च न्यायालय",
    date: "2014",
    holding: `"The admissibility and reliability of an expert opinion under Section 45 of the Indian Evidence Act is contingent upon the accuracy of the basic facts on which the opinion is founded. If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated and cannot form the sole basis for a conviction."`,
    application: "दोषपूर्ण नमूनाकरण → विशेषज्ञ मत स्वतः निरर्थक → धारा 45 के अंतर्गत अग्राह्य।",
    fitScore: 78,
    fitLevel: "exact",
    fitReason: "Section 45 expert opinion + flawed sampling foundation — direct SC precedent",
    status: "SECONDARY",
    statusNote: "Verify exact para language. Avoid invented quote blocks. Confirm from SCC.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Sushil+Sharma+vs+State+NCT+of+Delhi+2014+4+SCC+317",
    tags: ["expert opinion", "section 45", "evidence act", "sampling", "forensic", "admissibility"],
  },
  {
    id: "p4",
    name: "Union of India v. Prafulla Kumar Samal",
    citation: "(1979) 3 SCC 4",
    court: "सर्वोच्च न्यायालय",
    date: "1979",
    holding: `"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."`,
    application: "दोषपूर्ण साक्ष्य = केवल सन्देह → उन्मोचन अनिवार्य। उन्मोचन का मानदण्ड।",
    fitScore: 85,
    fitLevel: "exact",
    fitReason: "discharge standard + prima facie test — binding SC precedent on discharge",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with full citation.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Union+of+India+vs+Prafulla+Kumar+Samal+1979+3+SCC+4",
    tags: ["discharge", "prima facie", "suspicion", "evidence", "section 227", "section 250"],
  },
  {
    id: "p5",
    name: "State of Bihar v. Ramesh Singh",
    citation: "(1977) 4 SCC 39",
    court: "सर्वोच्च न्यायालय",
    date: "1977",
    holding: "उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं। यदि नहीं, तो उन्मोचन अनिवार्य है।",
    application: "फोरेंसिक साक्ष्य दूषित → प्रथम दृष्टया आरोप असिद्ध → उन्मोचन।",
    fitScore: 80,
    fitLevel: "exact",
    fitReason: "discharge test + prima facie standard — binding SC precedent",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with full citation.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Bihar+vs+Ramesh+Singh+1977+4+SCC+39",
    tags: ["discharge", "prima facie", "framing of charge", "evidence", "section 227"],
  },
  {
    id: "p6",
    name: "State of Gujarat v. Mohanbhai",
    citation: "(2003) 4 GLR 3121",
    court: "गुजरात उच्च न्यायालय",
    date: "2003",
    holding: `"When the prosecution relies heavily on the report of the forensic science laboratory, the foundational burden lies on the prosecution to prove beyond reasonable doubt that the samples sent to the laboratory were exactly the same as those seized from the spot. The failure to prepare a proper Panchnama at the site, seal the samples in the presence of independent panchas and the accused, and maintain the chain of custody creates an incurable defect in the prosecution's case."`,
    application: "पंचनामा अभाव + श्रृंखला-अभिरक्षा विफलता → फोरेंसिक रिपोर्ट अविश्वसनीय।",
    fitScore: 72,
    fitLevel: "exact",
    fitReason: "panchnama + chain of custody + forensic report — direct fact match",
    status: "PENDING",
    statusNote: "⚠ Obtain authentic judgment copy before reliance. Citation authenticity check required.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Gujarat+vs+Mohanbhai+2003+4+GLR+3121",
    tags: ["panchnama", "chain of custody", "forensic", "sampling", "sealing", "building collapse"],
  },
  {
    id: "p7",
    name: "R.B. Constructions v. State of Maharashtra",
    citation: "2014 SCC OnLine Bom 125",
    court: "बम्बई उच्च न्यायालय",
    date: "2014",
    holding: `"The principles of natural justice mandate that any sampling or testing of materials which may result in adverse civil or criminal consequences against a contractor must be conducted in their presence or with prior notice. An ex-parte extraction of samples behind the back of the petitioner violates this fundamental principle."`,
    application: "ठेकेदार प्रतिनिधि अनुपस्थित → नैसर्गिक न्याय का हनन → साक्ष्य अमान्य।",
    fitScore: 76,
    fitLevel: "exact",
    fitReason: "contractor representative + natural justice + ex-parte sampling — direct fact match",
    status: "PENDING",
    statusNote: "⚠ Citation authenticity check required. Obtain certified copy before filing.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=R.B.+Constructions+vs+State+of+Maharashtra+2014",
    tags: ["natural justice", "representative", "contractor", "sampling", "ex-parte", "building"],
  },
  {
    id: "p8",
    name: "C.B.I. v. K.S. Kalra & Ors.",
    citation: "2011 SCC OnLine Del 3412",
    court: "दिल्ली उच्च न्यायालय",
    date: "2011",
    holding: `"Where the CPWD Manual and Bureau of Indian Standards prescribe a specific protocol for the joint collection and sealing of samples, investigating agencies are bound to follow them. In the absence of joint sampling, the allegation under the Prevention of Corruption Act regarding the use of substandard building materials fails to stand judicial scrutiny."`,
    application: "CPWD + BIS प्रोटोकॉल उल्लंघन → भ्रष्टाचार निवारण अधिनियम के आरोप असिद्ध।",
    fitScore: 74,
    fitLevel: "exact",
    fitReason: "CPWD + BIS protocol + PC Act + joint sampling — direct fact match",
    status: "PENDING",
    statusNote: "⚠ Citation authenticity check required. Obtain certified copy before filing.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=C.B.I.+vs+K.S.+Kalra+2011+SCC",
    tags: ["CPWD", "BIS", "joint sampling", "PC Act", "corruption", "contractor", "building"],
  },
  {
    id: "p9",
    name: "M/s. Builders Association v. State of UP",
    citation: "2018 SCC OnLine All 442",
    court: "इलाहाबाद उच्च न्यायालय",
    date: "2018",
    holding: `"The structural integrity and chemical composition of construction materials like cement mortar are highly susceptible to environmental exposure. When samples are retrieved post-incident after being exposed to anomalous environmental factors such as heavy rain, their subsequent laboratory failure to meet strength requirements cannot automatically be attributed to the contractor's initial mix design."`,
    application: "वर्षा/तूफान में नमूनाकरण → पर्यावरणीय संदूषण → ठेकेदार की देयता शून्य।",
    fitScore: 70,
    fitLevel: "exact",
    fitReason: "rain contamination + mortar samples + contractor defence — direct fact match",
    status: "PENDING",
    statusNote: "⚠ Citation authenticity check required. Obtain certified copy before filing.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Builders+Association+vs+State+of+UP+2018",
    tags: ["rain", "contamination", "mortar", "contractor", "building collapse", "environmental"],
  },
  {
    id: "p10",
    name: "Jacob Mathew v. State of Punjab",
    citation: "(2005) 6 SCC 1",
    court: "सर्वोच्च न्यायालय",
    date: "2005",
    holding: `"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do."`,
    application: "प्राकृतिक आपदा (भारी वर्षा) = Force Majeure → IPC 304A के अंतर्गत घोर उपेक्षा असिद्ध।",
    fitScore: 62,
    fitLevel: "analogous",
    fitReason: "negligence standard matches but incident type is medical — analogous only, not primary",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Use for negligence standard argument only.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Jacob+Mathew+vs+State+of+Punjab+2005+6+SCC+1",
    tags: ["negligence", "rash", "304A", "force majeure", "criminal negligence", "duty of care"],
  },
];

// ─── STANDARDS ────────────────────────────────────────────────────────────────
// Source: Standards_Matrix_IS_ASTM_NABL.md + forensic_defense_report.md

export const CASE01_STANDARDS: Standard[] = [
  {
    code: "IS 1199:2018",
    title: "Methods of Sampling and Analysis of Fresh Concrete (ताज़ा कंक्रीट — WRONG STANDARD)",
    applicability: "wrong",
    keyClause: "Scope: Fresh concrete only. Clause 4.1 & 4.2: Composite sampling from multiple points. Weather protection mandatory.",
    violation: "अभियोजन ने इसे hardened masonry mortar पर लागू किया — यह मूलभूत तकनीकी त्रुटि है। यह मानक ताज़ा कंक्रीट के लिए है।",
    sourceUrl: "https://archive.org/details/gov.in.is.1199.2.2018",
    confidence: "SECONDARY",
  },
  {
    code: "IS 2250:1981",
    title: "Code of Practice for Preparation and Use of Masonry Mortars (सही मानक)",
    applicability: "correct",
    keyClause: "Clause 5.2: Weather protection mandatory. Masonry mortar preparation and use — correct standard for this case.",
    violation: "अभियोजन ने इस सही मानक का उल्लेख ही नहीं किया।",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "IS 3535:1986",
    title: "Methods of Sampling Hydraulic Cements",
    applicability: "correct",
    keyClause: "Clause 4.1: Sampling in presence of purchaser/contractor representative mandatory. Clause 5.1: Systematic sampling. Clause 6.2: 5 representative locations minimum.",
    violation: "ठेकेदार प्रतिनिधि अनुपस्थित। व्यवस्थित नमूनाकरण नहीं। 5 प्रतिनिधि स्थलों से नमूना नहीं।",
    sourceUrl: "https://archive.org/details/gov.in.is.3535.1986",
    confidence: "SECONDARY",
  },
  {
    code: "IS 4031 (Part 1-15)",
    title: "Methods of Physical Tests for Hydraulic Cement",
    applicability: "partial",
    keyClause: "Part 6, Clause 5.1: Temperature 27±2°C and controlled humidity mandatory for compressive strength testing.",
    violation: "भारी वर्षा में 27±2°C तापमान नियंत्रण असम्भव था। नमूनों की आर्द्रता अनियंत्रित।",
    sourceUrl: "https://www.scribd.com/document/481271038/Testing-of-CEMENT-2",
    confidence: "SECONDARY",
  },
  {
    code: "IS 13311 (Part 1-2)",
    title: "Non-Destructive Testing of Concrete/Masonry",
    applicability: "correct",
    keyClause: "NDT methods (UPV/Rebound Hammer) for existing structures — correct method for post-construction assessment.",
    violation: "NDT परीक्षण किया ही नहीं गया। Destructive sampling की बजाय NDT होना चाहिए था।",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "ASTM C1324",
    title: "Standard Test Method for Examination and Analysis of Hardened Masonry Mortar (सही अंतर्राष्ट्रीय मानक)",
    applicability: "correct",
    keyClause: "Section 7-8: Remove carbonated outer layer before sampling. Core extraction from mortar joints. Forensic examination of hardened masonry mortar.",
    violation: "बाहरी कार्बोनेटेड परत नहीं हटाई। Core extraction नहीं किया। सही forensic framework का उपयोग नहीं।",
    sourceUrl: "https://www.astm.org",
    confidence: "SECONDARY",
  },
  {
    code: "ASTM C780",
    title: "Standard Practice for Preconstruction and Construction Evaluation of Mortars",
    applicability: "partial",
    keyClause: "Section 5.2: Remove weathered surface before sampling. Section 6.1: Weather protection mandatory — 'samples must be protected from rain and moisture; otherwise sample is invalid.'",
    violation: "सतह संदूषण निराकरण नहीं। वर्षा में नमूनाकरण — मौसम-सुरक्षा नहीं।",
    sourceUrl: "https://www.scribd.com/document/378983563/ASTM-C-780-mortar-pdf",
    confidence: "SECONDARY",
  },
  {
    code: "BS EN 1015-2",
    title: "Methods of Test for Mortar for Masonry — Bulk Sampling",
    applicability: "correct",
    keyClause: "Section 4.3.1: Weather protection mandatory precondition. Section 5.1.2: 'Sampling shall be made from the interior of the joint, after removal of the surface layer which may be affected by weathering or carbonation.'",
    violation: "बाहरी कार्बोनेटेड परत नहीं हटाई। आंतरिक सार से नमूना नहीं लिया।",
    sourceUrl: "https://www.bsigroup.com",
    confidence: "SECONDARY",
  },
  {
    code: "ISO/IEC 17025 + NABL",
    title: "General Requirements for Competence of Testing Laboratories",
    applicability: "correct",
    keyClause: "Traceability, documented handling, method control, and record integrity required for accredited lab reports.",
    violation: "Missing custody/receipt/environment records — NABL accreditation requirements not met.",
    sourceUrl: "https://www.nabl-india.org",
    confidence: "SECONDARY",
  },
  {
    code: "CPWD Manual 2023",
    title: "Central Public Works Department Works Manual",
    applicability: "correct",
    keyClause: "Section 3.7.4 & 12.2.1: Joint sampling by Engineer-in-Charge and Contractor mandatory. Samples sealed with signatures of both parties.",
    violation: "ठेकेदार प्रतिनिधि सर्वथा अनुपस्थित। Joint sealing नहीं हुई।",
    sourceUrl: "https://cpwd.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "NBC 2016/2023",
    title: "National Building Code of India",
    applicability: "correct",
    keyClause: "Section 3.4: Extreme weather events classified as Force Majeure. Appendix C: Natural disaster clause — contractor liability exemption.",
    violation: "अत्यधिक वर्षा = Force Majeure — ठेकेदार की देयता से छूट। अभियोजन ने इसे नजरअंदाज किया।",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
];

// ─── FORENSIC CHECKLIST ───────────────────────────────────────────────────────
// Source: Forensic_Protocol_Checklist.md

export const FORENSIC_CHECKLIST = {
  collection: [
    "Date/time/place of collection recorded",
    "Sample points mapped (not single random scrape)",
    "Photographs/video of extraction process preserved",
    "Weather condition documented during collection",
    "Outer weathered layer removal method documented",
    "Clean tools and contamination controls recorded",
    "Independent witnesses identified",
    "Contractor/defence representative notice or presence recorded",
  ],
  packaging: [
    "Unique sample IDs generated on site",
    "Sealed packets with seal impression record",
    "Sample labels include case ID + location + collector details",
    "Seal integrity note prepared before dispatch",
    "Co-signature matrix (IO/witness/recipient) present",
  ],
  custody: [
    "Chain-of-custody log from site to lab available",
    "Every custody transfer has date/time/signature",
    "Storage conditions before dispatch documented",
    "Transport mode and delay log preserved",
    "Tamper checks at receipt stage documented",
  ],
  laboratory: [
    "Lab inward register entry with matching sample IDs",
    "Seal verification at lab intake recorded",
    "Test method references and revisions identified",
    "Environmental controls for testing documented (27±2°C)",
    "Analyst qualifications/authorization recorded",
    "Raw data sheet and calculations preserved",
  ],
};

// ─── ANNEXURE DEMAND LIST ─────────────────────────────────────────────────────
// Source: Argument_Bank_And_Annexure_Builder.md

export const ANNEXURE_DEMAND_LIST = [
  "FIR 496/2011 और सम्पूर्ण आरोप-पत्र",
  "नमूना संग्रह स्थल का निरीक्षण ज्ञापन + पंचनामा",
  "सील ज्ञापन और नमूना लेबल के फोटोग्राफ",
  "प्रेषण रजिस्टर + मालखाना रजिस्टर + हस्तांतरण पावती",
  "FSL आवक रजिस्टर और सील सत्यापन पत्र",
  "कच्ची प्रयोगशाला कार्यपत्रक, मशीन लॉग, विश्लेषक नोट्स",
  "संग्रह दिनांक 28-12-2011 की IMD/स्थानीय मौसम रिपोर्ट",
  "ठेकेदार को नमूना संग्रह/परीक्षण उपस्थिति हेतु जारी कोई नोटिस",
  "IS 2250:1981, IS 3535:1986, ASTM C1324 के प्रमाणित अंश",
  "कट्टावेल्लई निर्णय (2025 INSC 845) की प्रमाणित प्रति",
  "Sushil Sharma (2014) 4 SCC 317 की प्रमाणित प्रति",
  "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 की प्रमाणित प्रति",
];
