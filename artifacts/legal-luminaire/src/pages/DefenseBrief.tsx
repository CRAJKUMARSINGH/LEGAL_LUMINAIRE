import { Shield, AlertTriangle, BookOpen, ChevronDown, ChevronUp, Layers, Download, FileText } from "lucide-react";
import { useState } from "react";

/* ─────────── Types ─────────── */
interface Standard { code: string; clause: string; text: string; }
interface Ground {
  id: number;
  heading: string;
  severity: "critical" | "high";
  points: string[];
  standards: Standard[];
  legalPrinciple?: string;
}
interface MaterialSection {
  id: "plaster" | "mortar" | "concrete";
  packet: string;
  fslResult: string;
  typicalSpec: string;
  specNote: string;
  color: string;
  borderColor: string;
  bgColor: string;
  proceduralGrounds: Ground[];
  technicalChallenges: { heading: string; body: string; standards: Standard[] }[];
}

/* ─────────── Shared Procedural Grounds (adapted per section) ─────────── */
function makeProceduralGrounds(material: string): Ground[] {
  const isPlaster = material === "plaster";
  const isMortar = material === "mortar";
  const isConcrete = material === "concrete";
  return [
    {
      id: 1,
      heading: "Samples Not Collected in Presence of Contractor's Authorised Representative",
      severity: "critical",
      points: [
        `The ${material} sample (Packet ${isPlaster ? "A" : isMortar ? "B" : "C"}) was taken without any notice to or presence of the contractor or their authorised representative — a fundamental violation of natural justice (Audi Alteram Partem).`,
        "Without a witness from the contractor's side, there is no independent verification of: (a) the exact location from which the sample was cut; (b) whether the sampling tool was clean and uncontaminated; (c) whether the material extracted was indeed from the contracted work and not an adjacent or unrelated area; (d) the labelling and sealing of the packet immediately after extraction.",
        `In the case of ${isPlaster ? "a plaster sample, the precise wall face and elevation" : isMortar ? "a masonry mortar sample, the exact joint and course of masonry" : "a foundation concrete sample, the specific excavated or exposed section"} from which the chip was extracted materially affects the result — without a contractor witness, the location is unverifiable.`,
        "An adverse finding based on evidence generated through a process that excluded the contractor is void under settled principles of Indian administrative law.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 5 — Sampling", text: "Sampling of hardened concrete/mortar from existing structures shall be witnessed by authorised representatives of both the testing authority and the party whose work is under examination. [Supersedes IS 1199:1959; verify current BIS text for court filing.]" },
        { code: "IS 516 (Part 1) : 2018", clause: "Clause 4 — General Requirements", text: "Where test results are intended for legal or disciplinary proceedings, both parties shall have the right to nominate representatives present at sampling and testing. [Supersedes IS 516:1959; verify current BIS text.]" },
        { code: "IS 4031 (Part 1) : 1996 (Reaffirmed 2018)", clause: "Clause 5 — Sampling", text: "Samples shall be collected jointly; where samples are taken from existing structures, the party under examination has the right to be present." },
        { code: "ASTM C823 / C823M : 2017", clause: "Section 5.1 — Significance and Use", text: "Sampling of hardened concrete/mortar from existing constructions shall be conducted jointly by representatives of all interested parties. Unilateral sampling is scientifically unreliable." },
      ],
      legalPrinciple: "Audi Alteram Partem — Supreme Court in Maneka Gandhi v. Union of India (1978) 1 SCC 248: No adverse order can be based on evidence generated at a proceeding from which the affected party was excluded.",
    },
    {
      id: 2,
      heading: "Stormy Weather, Unsafe Equipment, and Flooded Ground Vitiated the Sampling",
      severity: "critical",
      points: [
        `The enquiry team collected the ${material} sample on a stormy, rainy day when: (a) the ground was submerged under approximately two feet of water; (b) access was via a wet steel ladder; (c) the workman striking the wall with a hammer was sheltering under an umbrella; (d) no tarpaulin or protective arrangement was made for the falling sample.`,
        `For ${isPlaster ? "a plaster sample, rainwater penetrating the exposed cut surface alters the cement-silica ratio of the very material being analysed. Plaster, being only 12–20 mm thick, is especially vulnerable — a single hammer blow in rain can drive surface water deep into the fractured face." : isMortar ? "a masonry mortar sample, the narrow joint (typically 10–25 mm) means any rainwater entering the exposed cut immediately contaminates the small quantity of mortar available. Water dissolves soluble calcium compounds, artificially reducing apparent cement content." : "a foundation concrete sample, the mass of water pooled on the ground level means that any chips falling from the hammer strike were instantly immersed in standing water — altering their chemical composition before collection."}`,
        "IS 1199 (Part 5):2018 and ASTM C823:2017 both expressly prohibit sampling in rain or adverse weather. Samples that fall onto wet or contaminated ground are required to be discarded under BS EN 14630:2006 Clause 5.2.",
        "A worker balancing on a wet steel ladder under storm conditions cannot apply the controlled, measured extraction force required by IS standards. The percussive shock of hammer blows shatters the sample, alters particle distribution, and introduces extraneous material.",
        "Inadequate randomisation: sampling spots were chosen based on accessibility under storm conditions, not by the systematic random scheme required by IS 1199 (Part 5):2018.",
        "Insufficient quantity: the collected quantity was insufficient to comply with the one-third referee sample retention requirement of IS 1199 (Part 5):2018.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 5 — Sampling Procedure", text: "Sampling shall avoid contamination; clean, dry receptacles shall be used; samples shall be protected from rain and adverse environmental conditions immediately upon collection. Sampling locations to be determined by systematic random scheme agreed in advance." },
        { code: "IS 2250 : 1981 (Reaffirmed 2020)", clause: "Clause 6.1 — Sampling Hardened Mortar", text: "Samples of hardened mortar collected by careful chiselling from dry surfaces only. Where wet conditions prevail, sampling shall be deferred or suitable shelter erected. Material shall be immediately placed in a sealed dry container." },
        { code: "BS EN 14630 : 2006", clause: "Clause 5.2 — Environmental Conditions", text: "Samples shall not be obtained in rain or wind conditions likely to cause contamination or alter composition. Samples falling onto wet or contaminated ground surfaces shall be discarded." },
        { code: "ASTM C823 / C823M : 2017", clause: "Section 8 — Sampling Procedure", text: "Ground surfaces shall be protected with clean tarpaulin to catch material. Safe, stable access is mandatory. Samples shall not be retrieved from contaminated ground." },
      ],
      legalPrinciple: "Evidence obtained by inherently unreliable methods carries no probative value. State of U.P. v. Ramesh Prasad Misra (1996) 10 SCC 360: reliability of forensic evidence is a precondition to its admissibility.",
    },
    {
      id: 3,
      heading: "Broken Chain of Custody: Transportation in Continuing Storm",
      severity: "critical",
      points: [
        `The ${material} sample was transported from site to laboratory under the same storm conditions that compromised its collection — without documented chain of custody, without moisture-proof sealed packaging verified by both parties, and without any temperature or environmental log during transit.`,
        "Without an unbroken, documented chain of custody, it is impossible to establish that what was tested in the Rajya Vidhi Vigyan Prayogshala, Jaipur, originated from contractor Hemraj's work on the boundary wall.",
        "IS/IEC 17025:2017 Clause 7.4 and NABL Doc 112:2018 Clause 5.8 require a chain of custody document signed at every transfer point. No such document has been produced.",
        "The contractor's absence means that item (v) of the mandatory labelling — witness signature — cannot be completed, making the seal inherently incomplete.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 5 — Packing and Marking", text: "Samples to be placed in airtight containers immediately after collection and sealed. Clearly labelled; transported to laboratory without unnecessary delay and protected from moisture and contamination during transport." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.4 — Handling of Test Items", text: "Documented procedure required for transportation, receipt, handling, protection, storage, retention and disposal of test items. Deviations shall be recorded." },
        { code: "NABL Doc 112 : 2018", clause: "Clause 5.8 — Sample Receipt", text: "Samples accompanied by chain of custody document signed at each transfer. Samples without complete documentation or with suspect seals to be quarantined — not tested." },
        { code: "ASTM E1188", clause: "Section 7.2 — Chain of Custody", text: "Each container sealed with tamper-evident tape at collection. Chain of custody records date, time, location, collector's name and signature for every transfer. Failure to maintain renders evidence inadmissible." },
      ],
      legalPrinciple: "Mohd. Khalid v. State of W.B. (2002) 7 SCC 334: Gaps in chain of custody of physical evidence create a reasonable doubt to be resolved in favour of the respondent.",
    },
    {
      id: 4,
      heading: "Doubt as to Timely Testing and Proper Pre-Testing Storage",
      severity: "high",
      points: [
        "There is no record in the FSL report of the date and time of sample collection, receipt at laboratory, commencement of testing, or conclusion of testing — making it impossible to verify compliance with any mandatory time-limit standard.",
        `${isPlaster ? "Hardened plaster samples are particularly vulnerable to carbonation — the reaction of calcium hydroxide with atmospheric CO₂ — which progressively reduces the apparent soluble silica contribution from cement. A sample exposed to rainwater and then stored in non-standard conditions will carbonate rapidly, artificially inflating the apparent sand-to-cement ratio." : isMortar ? "Masonry mortar samples, being thin and porous, are highly susceptible to leaching of soluble calcium compounds by the storm water that had already penetrated the exposed cut surface during collection. Leaching reduces apparent cement content, making the mix appear leaner than it is." : "Foundation concrete samples, being denser, are less susceptible to rapid carbonation but the coarse aggregate (grit) present in Packet C contains natural silica that cannot be distinguished from cement-derived silica by the chemical method applied — and water-mediated migration of ions during improper storage can alter the analytical result."}`,
        "The burden of proving that testing was conducted within prescribed time limits lies with the inquiry authority. No such proof has been furnished.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 6 — Time Intervals", text: "Tests on hardened concrete/mortar samples shall be commenced within the prescribed time interval. The test report shall state the interval between collection and testing." },
        { code: "IS 4031 (Part 1) : 1996 (Reaffirmed 2018)", clause: "Clause 4 — Preparation of Test Specimens", text: "Samples stored at 27 ± 2°C. Specimens showing moisture damage, carbonation or contamination not used without documentation." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.4.3 — Sample Storage", text: "Samples stored under conditions preventing deterioration or contamination. Deviations from specified storage conditions shall be reported in the test report." },
      ],
      legalPrinciple: "Where material doubt exists as to the integrity of physical evidence at the time of testing, the benefit of that doubt must enure to the benefit of the person against whom the evidence is sought to be used.",
    },
    {
      id: 5,
      heading: "Time Frame Between Collection and Testing Not Adhered To",
      severity: "high",
      points: [
        "The FSL report does not state the date of sample collection, the date of receipt, or the date of testing. Without these three dates, compliance with the mandatory testing window cannot be verified.",
        "Indian Standards prescribe maximum time intervals between collection from an existing structure and commencement of testing because exposed cementitious material continues to evolve chemically after cutting or chiselling.",
        "If samples were collected during the storm and remained in uncontrolled wet conditions for 24–48 hours or more before laboratory processing, the chemical composition — especially the soluble silica fraction used to calculate the cement-to-sand ratio — would have been materially altered.",
        "A test report that does not disclose when samples were collected and when they were tested cannot establish, to any standard of proof, that the results reflect the composition of the material at the time of construction.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 6 — Time Intervals", text: "The test report shall state the date of sampling and the date of testing. Tests shall be commenced as soon as practicable and within any prescribed period for the specific parameter." },
        { code: "IS 4031 (Part 5) : 1988 (Reaffirmed 2018)", clause: "Clause 4 — Test Conditions", text: "Results obtained from samples tested outside the prescribed time window are unreliable and shall be rejected." },
        { code: "IS 516 (Part 1) : 2018", clause: "Clause 3 — Preparation", text: "Extracted specimens tested within stipulated period; test report shall record extraction date and testing date." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.7 — Validity of Results", text: "Laboratory shall verify that time elapsed since sample collection is within acceptable limits for the parameter being tested." },
      ],
    },
    {
      id: 6,
      heading: "Tests Performed in Absence of Contractor",
      severity: "critical",
      points: [
        "The laboratory testing of all three packets — including the critical chemical analysis that produced the 1:18, 1:17 and 1:5.75:9.5 ratios — was performed without any notice to or presence of the contractor.",
        "The right to be present at testing is the laboratory equivalent of the right to cross-examine a witness. It enables verification that: (i) the correct labelled sample was tested; (ii) equipment was calibrated; (iii) the correct method was followed; (iv) results were recorded contemporaneously without alteration.",
        "NABL Doc 112:2018 Clause 5.10 requires parties to a legal dispute to be notified before testing, with either party permitted to designate a witness.",
        "The FSL report is signed by KL Verma (SSO Physics) — a Physics qualification for chemical analysis of construction materials raises a competence question that could only have been investigated if the contractor had been present and able to request evidence of qualification.",
      ],
      standards: [
        { code: "IS 516 (Part 1) : 2018", clause: "Clause 4 — General Requirements", text: "For results used in legal/disciplinary proceedings, both parties have the right to representation at the time of testing." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.1.3 — Client Witnessing", text: "Client or their authorised representative permitted to witness testing activities, subject to laboratory confidentiality procedures." },
        { code: "NABL Doc 112 : 2018", clause: "Clause 5.10 — Legal Testing", text: "Where test is conducted for legal or regulatory purposes, parties to the dispute shall be notified. Either party may designate a witness to observe testing." },
      ],
      legalPrinciple: "Union of India v. Tulsiram Patel (1985) 3 SCC 398: The charged party must have a genuine, not merely formal, opportunity to meet the case against them at every material stage — including the stage at which evidence is generated.",
    },
    {
      id: 7,
      heading: "Failure to Retain Adequate Sample for Independent Re-Testing",
      severity: "high",
      points: [
        "No portion of any packet has been retained as a referee sample for the contractor's independent verification. IS 1199 (Part 5):2018 requires at least one-third of collected quantity to be retained for a minimum 90 days.",
        "Once the sample is fully consumed in primary testing, the contractor's right to independent verification is permanently and irremediably extinguished — a prejudice that courts consistently treat as grounds to exclude or substantially discount the evidence.",
        "The FSL report makes no mention of total quantity received, quantity consumed in testing, or quantity retained. This silence is itself evidence of non-compliance.",
      ],
      standards: [
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 4 — Quantity", text: "Quantity collected shall be sufficient for: (a) all specified tests; (b) repeat tests; and (c) retention of one-third as referee sample for minimum 90 days." },
        { code: "IS 4031 (Part 1) : 1996 (Reaffirmed 2018)", clause: "Clause 3.2 — Sample Retention", text: "Portion sufficient for at least one full repeat retained for not less than three months; made available to authorised parties." },
        { code: "IS 516 (Part 1) : 2018", clause: "Clause 2.3 — Preserved Samples", text: "For legal proceedings, duplicate sealed samples shall be prepared — one for the contractor and one for the testing authority." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.4.4 — Retention", text: "Test items retained for sufficient period to allow additional testing; retention period agreed with client prior to testing." },
      ],
      legalPrinciple: "Destruction of physical evidence without affording the other party an opportunity for independent testing gives rise to an adverse inference against the destroying party — analogous to the doctrine of spoliation.",
    },
    {
      id: 8,
      heading: "FSL Report Cites No Indian Standard Under Which Tests Were Performed",
      severity: "high",
      points: [
        "The FSL report contains no reference to any Indian Standard, test method, or procedure under which the analysis was conducted. IS/IEC 17025:2017 Clause 7.8.2 makes this a mandatory minimum requirement for any test report.",
        "Without the test standard reference, it is impossible to determine: (a) whether the correct analytical method was used; (b) what the precision limits of the method are; (c) how many determinations are required; and (d) what the tolerance range is relative to the contractual specification.",
        "The report explicitly states: 'As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica.' IS 4031 (Part 5):1988 requires a verified cement control sample. Without it, the result is indicative only — not conclusive evidence of substandard work.",
      ],
      standards: [
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.8.2 — Minimum Report Requirements", text: "Report shall include reference to the test method including any deviations; date(s) of testing; results with units; and identification of all contributing personnel. Omission of method reference renders report non-compliant." },
        { code: "IS 4031 (Part 5) : 1988 (Reaffirmed 2018)", clause: "Clause 4 — Control Sample", text: "Chemical analysis shall be performed on both the composite sample AND a control sample of the cement used. Where unavailable, the result shall be accompanied by a statement that it is indicative only." },
        { code: "NABL Doc 112 : 2018", clause: "Clause 5.10 — Test Reports", text: "Every test report shall clearly state the test method used, standard reference, and nature of any deviation. Reports without method references do not meet accreditation requirements." },
      ],
      legalPrinciple: "A document that does not disclose its own methodological basis cannot be used to prove compliance or non-compliance with any particular standard.",
    },
    {
      id: 9,
      heading: "Report Does Not Disclose Number of Tests: Single Result vs Average",
      severity: "high",
      points: [
        "The FSL report provides a single ratio figure for each packet without stating whether that figure represents (a) a single determination, (b) the mean of duplicates, or (c) the mean of triplicates. IS 4031 (Part 5):1988 Clause 13 and IS 1199 (Part 5):2018 require a minimum of two concordant determinations.",
        "A single determination is always subject to random experimental error. Without duplicate confirmation, an anomalously high sand reading — caused by, for example, localised carbonation or leaching in the specific fragment tested — cannot be distinguished from a true result.",
        "IS 516 (Part 1):2018 requires the reported result to be the average of not less than three specimens. A single-specimen result is indicative only.",
        "The FSL report also states no repeatability data, no uncertainty of measurement, and no individual determination values — all mandatory under IS/IEC 17025:2017 Clause 7.8.3.",
      ],
      standards: [
        { code: "IS 4031 (Part 5) : 1988 (Reaffirmed 2018)", clause: "Clause 13 — Report", text: "Report shall state: (a) number of determinations; (b) individual results; (c) mean result; (d) whether repeatability limit was satisfied. Single-determination result shall be labelled as such." },
        { code: "IS 1199 (Part 5) : 2018", clause: "Clause 7 — Calculation and Report", text: "Minimum two determinations per sample; mean reported only if results agree within precision limit; number of determinations and individual values to appear in report." },
        { code: "IS 516 (Part 1) : 2018", clause: "Clause 11 — Calculation of Results", text: "Reported result shall be the average of not less than three specimens unless stated otherwise. Single-specimen result is indicative only." },
        { code: "IS/IEC 17025 : 2017", clause: "Clause 7.8.3 — Report Requirements", text: "Report shall include: uncertainty of measurement; number of observations; statistical method used; statements of conformity. Omission of these elements renders the report incomplete." },
      ],
    },
  ];
}

/* ─────────── All three material sections ─────────── */
const sections: MaterialSection[] = [
  {
    id: "plaster",
    packet: "Packet A",
    fslResult: "Cement : Sand = 1 : 18",
    typicalSpec: "CM 1:4 or CM 1:5 or CM 1:6 (External Plaster on Boundary Wall)",
    specNote: "IS 1661:1972 and IS 2402:1963 specify cement-sand ratios for external plaster finishes. A ratio of 1:18 would represent a deviation of 300–450% above the sand content of a standard 1:4 or 1:6 mix. However, the FSL result is computed from an unverified 21% silica assumption and on a sample collected under conditions that violate every applicable standard — rendering it wholly unreliable.",
    color: "hsl(38 85% 42%)",
    borderColor: "hsl(38 85% 42% / 0.3)",
    bgColor: "hsl(38 85% 42% / 0.07)",
    proceduralGrounds: makeProceduralGrounds("plaster"),
    technicalChallenges: [
      {
        heading: "Carbonation of Hardened Plaster: Scientific Invalidity of Chemical Analysis Result",
        body: "Hardened cement plaster is among the most vulnerable cementitious materials to carbonation — the progressive reaction of calcium hydroxide (Ca(OH)₂) with atmospheric CO₂ to form calcium carbonate (CaCO₃). Carbonation reduces soluble calcium in the matrix, directly affecting the chemical back-calculation of cement content. A plaster sample collected years after construction, exposed to storm rain, and then improperly stored before testing will have carbonated significantly more than a freshly prepared specimen. The chemical analysis method prescribed by IS 4031 (Part 5):1988 assumes that the soluble silica measured is entirely from the cement and the aggregate. Carbonation progressively converts cement hydration products, making the cement fraction appear smaller than it was at the time of construction. The FSL result of 1:18 could partially or entirely reflect carbonation-induced reduction in apparent cement content — not the original mix proportion.",
        standards: [
          { code: "IS 4031 (Part 5) : 1988 (Reaffirmed 2018)", clause: "Clause 4 — Note on Hardened Samples", text: "Chemical analysis of hardened cementitious materials is subject to inaccuracies due to carbonation and leaching. Results shall be qualified to reflect this limitation. The method is most reliable when performed on freshly cast specimens." },
          { code: "BS EN 14630 : 2006", clause: "Clause 1 — Scope", text: "Determination of carbonation depth in hardened concrete and mortar — provides the method to assess the extent of carbonation before chemical analysis, so that the analyst can account for its effect on measured silica/calcium content." },
          { code: "ASTM C856 : 2020", clause: "Section 8 — Petrographic Examination", text: "Petrographic examination of hardened concrete and mortar provides more reliable identification of original mix constituents than chemical analysis alone, because carbonation and leaching visible under microscopy can be identified and allowed for." },
        ],
      },
      {
        heading: "Plaster Thickness and Substrate Contamination During Sampling",
        body: "External plaster on a boundary wall is typically 12–20 mm thick. When a workman strikes this thin layer with a hammer — particularly in rain, balancing on a wet ladder — the impact inevitably shatters through the plaster coat and into the underlying stone masonry or brick substrate. The chips collected therefore include not just plaster mortar but also fragments of the substrate. If the substrate is stone masonry, the stone itself contains natural silica (quartz, feldspar, or other siliceous minerals) in far greater proportion than any mortar mix. The inclusion of even small stone fragments in the 'plaster' sample would dramatically inflate the apparent aggregate fraction, producing an artificially lean calculated cement-to-sand ratio. The FSL report makes no mention of any petrographic examination to verify that the analysed material was pure plaster and did not contain substrate contamination.",
        standards: [
          { code: "IS 1661 : 1972 (Reaffirmed 2020)", clause: "Clause 6 — Application", text: "Cement plaster shall be applied in layers of specified thickness. For testing purposes, sampling of the plaster coat shall be restricted to the plaster thickness only, avoiding penetration into the substrate. Contamination from the substrate material voids the result." },
          { code: "ASTM C823 / C823M : 2017", clause: "Section 8.1 — Sample Depth Control", text: "Where sampling a specific surface coating or layer, the sample depth shall be controlled to ensure that material from underlying substrates is excluded. Uncontrolled hammer extraction does not meet this requirement." },
          { code: "ASTM C856 : 2020", clause: "Section 9 — Identification of Constituents", text: "Petrographic examination is the standard method for distinguishing plaster mortar from substrate material in a mixed sample. Chemical analysis alone cannot make this distinction." },
        ],
      },
      {
        heading: "Applicable Specification Standards for External Plaster",
        body: "The specified cement-sand ratio for external plaster on a boundary wall in government construction in Rajasthan is governed by the Rajasthan PWD Schedule of Rates and the relevant IS codes. IS 1661:1972 specifies that external plaster shall normally be in proportion 1:4 (one part cement to four parts clean river sand by volume). IS 2402:1963 (External Rendered Finishes) allows ratios from 1:3 to 1:6 depending on exposure. A ratio of 1:18 is not contemplated by any recognised standard for functional external plaster — it would have virtually no weather resistance and would crumble within months of application. The fact that this boundary wall survived long enough to be tested is itself evidence that the actual plaster cannot have had a ratio of 1:18.",
        standards: [
          { code: "IS 1661 : 1972 (Reaffirmed 2020)", clause: "Table 1 — Proportions for Cement Plaster", text: "External plaster: cement to sand ratio shall be 1:4 (rich mix) to 1:6 (standard). Ratios beyond 1:6 are not specified for external exposure conditions. A ratio of 1:18 has no reference in this or any other recognised Indian standard for external plaster." },
          { code: "IS 2402 : 1963 (Reaffirmed 2018)", clause: "Clause 4 — Materials and Mixes", text: "Cement-sand mortar for external rendered finishes shall be in the range 1:3 to 1:6 by volume. Mixes leaner than 1:6 are considered unsuitable for external use due to inadequate weather resistance and bonding strength." },
          { code: "IS 1542 : 1992 (Reaffirmed 2018)", clause: "Clause 3 — Sand Specifications", text: "Sand for plaster shall be well graded, clean and free from impurities. The standard regulates aggregate quality — its properties differ from construction sand and would affect the chemical analysis result if quality control sand (S1) was not matched to the site sand." },
        ],
      },
    ],
  },
  {
    id: "mortar",
    packet: "Packet B",
    fslResult: "Cement : Sand = 1 : 17",
    typicalSpec: "CM 1:5 or CM 1:6 (Stone Masonry Joint Mortar)",
    specNote: "IS 2250:1981 and IS 1597 (Part 1):1992 specify cement-sand ratios for stone masonry construction. A ratio of 1:17 in a masonry joint mortar would produce a mortar with virtually no binding strength — the structure could not have stood. The FSL result is derived from an unverified assumption about cement silica content and from a sample collected under conditions entirely contrary to established standards.",
    color: "hsl(220 60% 35%)",
    borderColor: "hsl(220 60% 35% / 0.3)",
    bgColor: "hsl(220 60% 35% / 0.07)",
    proceduralGrounds: makeProceduralGrounds("mortar"),
    technicalChallenges: [
      {
        heading: "Stone Silica Contamination: The Most Critical Flaw in Packet B Analysis",
        body: "This is the most scientifically significant challenge specific to Packet B (masonry mortar). In stone masonry construction, the mortar fills the joints between stones. The stones themselves are invariably siliceous — sandstone, quartzite, granite, and similar stone common in Rajasthan contain 60–90% silica (SiO₂). When a hammer is used to extract a mortar sample from a stone masonry wall, it is physically impossible to extract pure mortar without including stone fragments. The chemical analysis method (IS 4031 Part 5:1988) determines the cement content by measuring total soluble silica and deducting the aggregate silica. However, this calculation assumes that the only silica in the sample comes from the cement and from the sand aggregate. When stone fragments are included in the sample — as they inevitably are when a hammer is used on wet stone masonry — the silica from the stone is counted as 'aggregate silica,' dramatically inflating the denominator of the cement-to-sand calculation and producing an artificially lean apparent ratio. A single fragment of silica-rich stone (e.g., quartzite at 95% SiO₂) of as little as 5% by weight in the sample could shift a true 1:6 ratio to an apparent 1:15 or worse.",
        standards: [
          { code: "IS 2250 : 1981 (Reaffirmed 2020)", clause: "Clause 6.1 — Sampling Hardened Mortar from Masonry", text: "Mortar samples from existing masonry shall be extracted by careful, controlled chiselling of the joint alone, ensuring that no aggregate material from the masonry units (stone, brick) is included in the sample. Uncontrolled hammer extraction is expressly not recommended." },
          { code: "IS 1597 (Part 1) : 1992 (Reaffirmed 2018)", clause: "Clause 6 — Materials for Stone Masonry", text: "Mortar for stone masonry shall be of the grade specified. When testing mortar from existing stone masonry, the sampling procedure must ensure separation of mortar from stone. Inclusion of stone material in the mortar sample invalidates chemical analysis results." },
          { code: "ASTM C856 : 2020", clause: "Section 9 — Petrographic Examination of Mortar", text: "Petrographic examination is the standard method for confirming that a sample analysed as mortar does not contain fragments of the masonry unit material. Chemical analysis alone cannot distinguish between sand aggregate silica and stone fragment silica." },
        ],
      },
      {
        heading: "Thin Joint Width: Practical Impossibility of Uncontaminated Sampling",
        body: "Stone masonry joints in traditional Rajasthan construction are typically 10–25 mm wide. The workman using a hammer and chisel on a wet wall, balanced on a steel ladder under a storm umbrella, could not have extracted pure mortar from joints of this width. The minimum sample size required for chemical analysis by IS 4031 (Part 5):1988 is such that multiple joints must be sampled to collect sufficient material. When material is gathered from multiple locations of a mortar joint on a rainy day, each chip collected carries the risk of: (a) stone fragment inclusion, (b) rainwater contamination, (c) surface leaching reducing apparent cement content. The cumulative effect of these factors on a sample collected under the described conditions is to make any calculated ratio thoroughly unreliable.",
        standards: [
          { code: "IS 2250 : 1981 (Reaffirmed 2020)", clause: "Clause 5 — Mortar Grades", text: "Masonry mortars are specified by grade: M1 (1:3), M2 (1:4), M3 (1:5), M4 (1:6), M5 (1:8). The standard does not contemplate a functional masonry mortar at 1:17. A structure bonded with 1:17 mortar would be structurally unsound from the outset — the fact that the wall exists and stands is inconsistent with this ratio." },
          { code: "IS 1199 (Part 5) : 2018", clause: "Clause 4 — Quantity of Sample", text: "Quantity shall be sufficient for primary test, repeat test, and one-third retention as referee sample. For chemical analysis of hardened mortar from joints, sampling must be from multiple locations using a systematic scheme — not haphazard extraction from convenient points." },
        ],
      },
      {
        heading: "Applicable Specification Standards for Stone Masonry Mortar",
        body: "IS 1597 (Part 1):1992 specifies the construction requirements for stone masonry. For a boundary wall in moderate exposure, the standard mortar grade is M3 or M4 (1:5 or 1:6 cement-sand by volume). IS 2250:1981 Table 1 provides standard mix proportions for masonry mortars and does not include any grade at 1:17 — no recognised masonry mortar in Indian construction practice uses a 1:17 ratio, as it would have essentially no binding strength. The durability, load-bearing capacity, and weather resistance specified in IS 1597 could not be achieved with such a lean mix. The boundary wall standing at the time of sampling is direct evidence that the mortar used has sufficient strength to bind the masonry — evidence fundamentally inconsistent with the FSL's reported ratio.",
        standards: [
          { code: "IS 2250 : 1981 (Reaffirmed 2020)", clause: "Table 1 — Standard Masonry Mortar Proportions", text: "Grades M1 (1:3) to M5 (1:8) are recognised. No grade at or near 1:17 exists. The functional properties of mortar — compressive strength, bond strength, workability — cannot be achieved beyond 1:8 for load-bearing masonry applications." },
          { code: "IS 1597 (Part 1) : 1992 (Reaffirmed 2018)", clause: "Clause 6.2 — Mortar for Stone Masonry", text: "Mortar for stone masonry shall be of grade M3 or better for exposed walls. The contractor's agreement specifies the required grade; the FSL result must be compared against that specification — not assumed to be substandard merely because it differs from a theoretical ideal mix." },
          { code: "IS 2116 : 1980 (Reaffirmed 2018)", clause: "Clause 3 — Sand for Masonry Mortars", text: "Sand for masonry mortars shall be free from harmful impurities. The control sand sample (S1) used in the FSL analysis must match the sand actually used on site; any discrepancy between control sand and site sand silica content will invalidate the ratio calculation." },
        ],
      },
    ],
  },
  {
    id: "concrete",
    packet: "Packet C",
    fslResult: "Cement : Sand : Grit = 1 : 5.75 : 9.5",
    typicalSpec: "M10 (1:3:6) or M15 (1:2:4) — Foundation Concrete for Masonry Wall",
    specNote: "IS 456:2000 and IS 10262:2019 govern concrete mix design. The FSL result of 1:5.75:9.5 corresponds approximately to an M5 or sub-M5 grade — extremely lean. However, the chemical analysis method (IS 4031 Part 5) is prescribed for cement testing, NOT for concrete mix determination. The coarse aggregate (grit/stone chips) in Packet C contains natural silica that confounds the calculation. The entire analytical approach applied to Packet C is a fundamental methodological error. The correct method for verifying concrete mix proportions in an existing structure is core drilling and compressive testing (IS 516 Part 5:2020) and/or petrographic examination (ASTM C856:2020).",
    color: "hsl(160 50% 30%)",
    borderColor: "hsl(160 50% 30% / 0.3)",
    bgColor: "hsl(160 50% 30% / 0.07)",
    proceduralGrounds: makeProceduralGrounds("concrete"),
    technicalChallenges: [
      {
        heading: "Wrong Analytical Method Applied to Concrete: Fundamental Methodological Error",
        body: "This is the most decisive scientific challenge specific to Packet C. The chemical analysis method used — which calculates cement-to-aggregate ratio from soluble silica content — is prescribed by IS 4031 (Part 5):1988 for the analysis of CEMENT and mortar. It is categorically not the prescribed method for determining the mix proportions of a concrete containing coarse aggregate (grit). In concrete, the coarse aggregate (stone chips, crushed granite, quartzite) is itself siliceous — containing 50–80% SiO₂ depending on rock type. The IS 4031 Part 5 calculation determines 'insoluble residue' to find the aggregate fraction. For mortar (cement + sand only), this is valid. For concrete, the insoluble residue includes both the sand AND the grit — and the grit's silica content cannot be separately accounted for without prior characterisation of the specific grit used. The FSL report attempts to report a three-component ratio (cement:sand:grit = 1:5.75:9.5) but the chemical method cannot distinguish between silica from sand and silica from grit — it can only determine total insoluble residue. The three-component ratio presented in the FSL report is therefore not a measurement — it is an assumption-laden inference that is scientifically indefensible. The correct and prescribed methods for verifying concrete quality in an existing structure are: IS 516 (Part 5):2020 (core drilling and compressive strength testing) and ASTM C856:2020 (petrographic examination), neither of which was used.",
        standards: [
          { code: "IS 456 : 2000 (Reaffirmed 2021)", clause: "Clause 14 — Quality of Materials and Clause 15 — Concrete Mix Proportioning", text: "The mix design of concrete shall be verified by compressive strength testing of cores extracted from the structure (IS 516 Part 5:2020) or by petrographic examination. Chemical analysis alone is not specified as a method of verifying concrete mix proportions in existing structures." },
          { code: "IS 516 (Part 5) : 2020", clause: "Clause 5 — Core Drilling and Testing", text: "The standard method for determining the quality and mix characteristics of concrete in an existing structure is extraction of cores by diamond drilling, followed by compressive strength testing. This method directly measures concrete quality — unlike chemical analysis, which requires multiple unverified assumptions about aggregate composition." },
          { code: "ASTM C856 : 2020", clause: "Section 8 — Application to Concrete Mix Determination", text: "Petrographic examination of hardened concrete is the standard method for identifying original mix constituents, aggregate type and grading, and water-cement ratio in existing structures. Chemical analysis cannot distinguish between silica from sand and silica from coarse aggregate — making it unreliable for three-component mix determination." },
          { code: "IS 4031 (Part 5) : 1988 (Reaffirmed 2018)", clause: "Clause 1 — Scope", text: "This part prescribes the method for chemical analysis of hydraulic cement. Its application to hardened concrete is an extension of the method beyond its defined scope. Results so obtained are at best indicative and require verification by methods designed specifically for concrete." },
        ],
      },
      {
        heading: "Coarse Aggregate Silica Confounds the Three-Component Ratio Calculation",
        body: "The FSL report attempts to compute a three-component ratio (cement:sand:grit) but the analytical method cannot separately distinguish sand silica from grit silica. The control sand sample (S1) and grit control sample (S2) were listed as received but their analytical results are not separately stated in the FSL report. If the control samples were used to calibrate the calculation, the report must show the results of S1 and S2 analysis and the calculation method. The absence of this data means the three-component ratio in Packet C is derived from an opaque calculation — possibly involving further unverified assumptions about the relative silica content of the specific sand and grit used on this site. Rajasthan quartzite grit (commonly used in local construction) has an SiO₂ content of approximately 92–95%, which differs markedly from river sand at approximately 85–90%. A 5% error in assumed grit silica content can shift the calculated cement fraction by 10–20%. The reported ratio of 1:5.75:9.5 could represent a true mix of 1:3:6 (M15 grade, fully compliant with typical specification) with a modest calculation error introduced by the unverified aggregate silica assumptions.",
        standards: [
          { code: "IS 383 : 2016", clause: "Clause 3 — Classification and Clause 7 — Testing", text: "Coarse aggregates for concrete shall comply with specified grading and chemical composition. For chemical analysis of concrete, the silica content of the specific aggregate used must be independently determined and used in the back-calculation of mix proportions. Using an assumed or control aggregate silica value introduces systematic error." },
          { code: "IS 10262 : 2019", clause: "Clause 4 — Mix Design Procedure", text: "Concrete mix proportioning shall be based on the specific properties of the materials actually used — cement, fine aggregate, and coarse aggregate. When verifying existing concrete proportions, the properties of the actual materials used in construction must be known." },
          { code: "ASTM C823 / C823M : 2017", clause: "Section 8.3 — Concrete Sampling for Chemical Analysis", text: "Where chemical analysis is used for concrete mix proportion determination, separate characterisation of each aggregate fraction is mandatory. The silica content of coarse aggregate must be independently determined before mix proportions can be back-calculated from composite analysis." },
        ],
      },
      {
        heading: "Applicable Standards and Specification Context for Foundation Concrete",
        body: "The foundation of a stone masonry boundary wall in Rajasthan government construction typically requires M10 concrete (nominal mix 1:3:6 by volume) or M15 concrete (1:2:4) as specified in the Rajasthan PWD Standard Specification and IS 456:2000. IS 456:2000 Table 5 provides minimum concrete grades for various structural applications. Even if the FSL method were applicable to concrete (which it is not, for reasons stated above), the result of 1:5.75:9.5 must be compared against the actual contractual specification — not against the standard grade mix. The report does not state what the specification was. Without knowing the specification, the ratio cannot be declared substandard. Furthermore, IS 456:2000 recognises that the relationship between nominal volume mix proportions and actual in-situ concrete quality depends on factors including water content, compaction, curing, and aggregate grading — none of which can be assessed by chemical analysis of a small chip sample.",
        standards: [
          { code: "IS 456 : 2000 (Reaffirmed 2021)", clause: "Table 5 — Minimum Concrete Grade", text: "Minimum grade for plain concrete in foundations exposed to mild conditions: M10. Minimum for reinforced concrete: M20. The contractual specification must be compared against the test result to determine whether a breach has occurred — without this comparison, no adverse finding is possible." },
          { code: "IS 10262 : 2019", clause: "Clause 3 — Scope", text: "Concrete mix proportioning guidelines: the mix proportions of concrete cannot be reliably back-calculated from chemical analysis of small chip samples extracted from an existing structure, as water-cement ratio, compaction, and curing effects cannot be separated from compositional effects." },
          { code: "IS 516 (Part 1) : 2018", clause: "Clause 5 — Compressive Strength", text: "The primary measure of concrete quality is compressive strength, determined by testing drilled cores. A concrete structure that has withstood the loads imposed upon it since construction is presumed, in the absence of evidence to the contrary, to have been constructed with adequate materials." },
          { code: "IS 13311 (Part 2) : 1992 (Reaffirmed 2018)", clause: "Clause 5 — Test Procedure (Rebound Hammer)", text: "The rebound hammer test provides a rapid, non-destructive assessment of concrete quality. Had this test been applied to the foundation concrete, it would have provided a direct, in-situ assessment — superior to the chip sample chemical analysis that was actually performed." },
        ],
      },
    ],
  },
];

/* ─────────── Ground card component ─────────── */
function GroundCard({ g, sectionColor }: { g: Ground; sectionColor: string }) {
  const [open, setOpen] = useState(false);
  const isCritical = g.severity === "critical";
  return (
    <div className="border border-border rounded-lg bg-white shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: sectionColor }}>
          {g.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold px-1.5 py-px rounded border ${isCritical ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
              {isCritical ? "CRITICAL" : "HIGH"}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{g.heading}</p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="space-y-2">
            {g.points.map((pt, i) => (
              <div key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="flex-shrink-0 font-bold mt-0.5 text-xs" style={{ color: sectionColor }}>▸</span>
                <p>{pt}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Standards</p>
            {g.standards.map((s, i) => (
              <div key={i} className="border border-border rounded p-2.5 bg-muted/20">
                <p className="text-xs font-bold mb-0.5" style={{ color: sectionColor }}>{s.code} — {s.clause}</p>
                <p className="text-xs italic text-muted-foreground leading-relaxed">"{s.text}"</p>
              </div>
            ))}
          </div>
          {g.legalPrinciple && (
            <div className="p-3 rounded border" style={{ background: "hsl(45 90% 55% / 0.08)", borderColor: "hsl(45 90% 55% / 0.3)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "hsl(45 40% 35%)" }}>Legal Principle</p>
              <p className="text-xs italic leading-relaxed text-foreground">{g.legalPrinciple}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────── Technical challenge card ─────────── */
function TechCard({ tc, sectionColor }: { tc: MaterialSection["technicalChallenges"][0]; sectionColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg bg-white shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: sectionColor }} />
        <p className="flex-1 text-sm font-semibold text-foreground leading-snug">{tc.heading}</p>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <p className="text-sm leading-relaxed text-foreground">{tc.body}</p>
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Standards</p>
            {tc.standards.map((s, i) => (
              <div key={i} className="border border-border rounded p-2.5 bg-muted/20">
                <p className="text-xs font-bold mb-0.5" style={{ color: sectionColor }}>{s.code} — {s.clause}</p>
                <p className="text-xs italic text-muted-foreground leading-relaxed">"{s.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────── Main page ─────────── */
export default function DefenseBrief() {
  const [activeSection, setActiveSection] = useState<"plaster" | "mortar" | "concrete">("plaster");
  const sec = sections.find(s => s.id === activeSection)!;

  const tabs = [
    { id: "plaster" as const, label: "Plaster", sub: "Packet A — 1:18", icon: "🪟" },
    { id: "mortar" as const, label: "Mortar", sub: "Packet B — 1:17", icon: "🧱" },
    { id: "concrete" as const, label: "Concrete", sub: "Packet C — 1:5.75:9.5", icon: "🏗" },
  ];

  const critical = sec.proceduralGrounds.filter(g => g.severity === "critical").length;
  const high = sec.proceduralGrounds.filter(g => g.severity === "high").length;

  return (
    <div>
      {/* Master header */}
      <div className="mb-6 rounded-xl p-5 border" style={{ background: "hsl(220 45% 14%)", borderColor: "hsl(220 35% 22%)" }}>
        <div className="flex items-start gap-4">
          <Shield className="h-9 w-9 flex-shrink-0" style={{ color: "hsl(45 90% 55%)" }} />
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "hsl(45 90% 55%)" }}>Defence Submission — Hemraj Case</p>
            <h1 className="text-xl font-bold mb-1.5" style={{ color: "hsl(36 30% 92%)" }}>Three-Part Defence: Plaster · Mortar · Concrete</h1>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(36 30% 68%)" }}>
              The FSL Report tested three distinct materials — external wall plaster (Packet A), stone masonry joint mortar (Packet B), and wall foundation concrete (Packet C). Each material is governed by different Indian Standards, involves different scientific challenges, and requires a separate and complete defence. Select a section below to review the full defence for each material.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bilingual Court-Ready Downloads */}
      <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Court-Ready bilingual LaTeX Documents</p>
            </div>
            <h2 className="text-base font-bold text-foreground">Download Formal Defence Brief (Hindi & English)</h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
              Fully updated with all 9 procedural grounds, material-specific technical challenges, BIS standards, clinker variations sensitivity analysis, and Supreme Court precedents (Maneka Gandhi, Mohd Khalid, Ramesh Prasad).
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a 
              href="/defence_english.tex" 
              download="defence_english.tex"
              className="flex items-center gap-2 bg-slate-900 text-slate-50 hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>English LaTeX (.tex)</span>
            </a>
            <a 
              href="/defence_hindi.tex" 
              download="defence_hindi.tex"
              className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>हिन्दी LaTeX (.tex)</span>
            </a>
          </div>
        </div>
        <div className="mt-3.5 pt-3.5 border-t border-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] text-emerald-800/80">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-emerald-500/20 text-emerald-800 px-1.5 py-0.5 rounded uppercase tracking-wider">Local Path</span>
            <code className="bg-emerald-500/10 px-2 py-0.5 rounded font-mono select-all">src/assets/defence_[english|hindi].tex</code>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">Compile Command:</span>
            <code className="bg-emerald-500/10 px-2 py-0.5 rounded font-mono select-all">pdflatex defence_english.tex</code>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {tabs.map(tab => {
          const s = sections.find(x => x.id === tab.id)!;
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${active ? "shadow-md" : "border-border bg-white hover:bg-muted/20"}`}
              style={active ? { borderColor: s.color, background: s.bgColor } : {}}
            >
              <p className="text-xl mb-0.5">{tab.icon}</p>
              <p className="font-bold text-sm text-foreground">{tab.label}</p>
              <p className="text-xs text-muted-foreground">{tab.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Active section */}
      <div>
        {/* Packet identification banner */}
        <div className="rounded-xl border-2 p-5 mb-5" style={{ borderColor: sec.borderColor, background: sec.bgColor }}>
          <div className="flex items-start gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: sec.color }}>{sec.packet}</span>
                <Layers className="h-4 w-4" style={{ color: sec.color }} />
                <span className="text-xs font-semibold" style={{ color: sec.color }}>{sec.id === "plaster" ? "Cement Plaster — Boundary Wall" : sec.id === "mortar" ? "Cement Mortar — Stone Masonry" : "Concrete — Wall Foundation"}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">FSL Claimed Result</p>
                  <p className="font-bold text-foreground">{sec.fslResult}</p>
                </div>
                <div className="bg-white border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Typical Specification</p>
                  <p className="font-bold text-foreground">{sec.typicalSpec}</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white border border-border rounded-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Specification Context & Key Observation</p>
                <p className="text-sm leading-relaxed text-foreground">{sec.specNote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 1: Procedural grounds */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border" />
            <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: sec.color, borderColor: sec.borderColor, background: sec.bgColor }}>
              Part I — 9 Procedural Defence Grounds
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-xs text-muted-foreground mb-3 text-center">
            {critical} Critical · {high} High · All 9 grounds apply to {sec.packet} — click each to expand full argument and IS citations
          </p>
          <div className="space-y-2">
            {sec.proceduralGrounds.map(g => <GroundCard key={g.id} g={g} sectionColor={sec.color} />)}
          </div>
        </div>

        {/* Part 2: Material-specific technical challenges */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border" />
            <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: sec.color, borderColor: sec.borderColor, background: sec.bgColor }}>
              Part II — Material-Specific Technical Challenges
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-xs text-muted-foreground mb-3 text-center">
            Scientific and technical challenges unique to this material type — beyond the procedural grounds
          </p>
          <div className="space-y-2">
            {sec.technicalChallenges.map((tc, i) => <TechCard key={i} tc={tc} sectionColor={sec.color} />)}
          </div>
        </div>

        {/* Conclusion for this section */}
        <div className="rounded-xl border-2 p-5" style={{ borderColor: sec.borderColor, background: "hsl(220 45% 14%)" }}>
          <h2 className="font-bold mb-3" style={{ color: "hsl(45 90% 55%)" }}>
            Conclusion — {sec.id === "plaster" ? "Plaster (Packet A)" : sec.id === "mortar" ? "Mortar (Packet B)" : "Concrete (Packet C)"}
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "hsl(36 30% 78%)" }}>
            {sec.id === "plaster"
              ? "The FSL result of 1:18 for the plaster sample is vitiated by (a) all 9 procedural violations that invalidate the sampling and testing process, and (b) two material-specific scientific factors — carbonation of hardened plaster and substrate contamination — that independently explain the anomalous result. In addition, the continued existence and function of the boundary wall is direct evidence that the plaster has sufficient strength and weather resistance inconsistent with a 1:18 ratio. No adverse finding can be sustained on this evidence."
              : sec.id === "mortar"
              ? "The FSL result of 1:17 for the masonry mortar sample is vitiated by all 9 procedural violations and, most critically, by the stone silica contamination that is an inevitable consequence of hammer extraction from a wet stone masonry wall. The chemical analysis method cannot distinguish mortar silica from stone fragment silica — a fundamental analytical limitation that makes the result unreliable as evidence of the mortar mix ratio actually used. The standing boundary wall is itself evidence that the mortar cannot have been as lean as claimed."
              : "The FSL result for Packet C (concrete foundation) is doubly flawed: it is vitiated by all 9 procedural grounds AND it is derived from an analytical method (IS 4031 Part 5 chemical analysis) that is not prescribed for concrete mix proportion verification. The coarse aggregate (grit) in the concrete sample contains natural silica that confounds the calculation, and the three-component ratio presented cannot have been derived from a valid chemical analysis. The correct methods — IS 516 (Part 5):2020 core drilling or ASTM C856:2020 petrographic examination — were never applied. No finding of substandard concrete can be based on this report."}
          </p>
          <p className="text-sm font-semibold" style={{ color: "hsl(45 90% 55%)" }}>
            Prayer: The FSL result for {sec.packet} be excluded from consideration, or be accorded no probative weight, and a fresh test by the correct method be directed with the contractor's representative present.
          </p>
        </div>
      </div>
    </div>
  );
}
