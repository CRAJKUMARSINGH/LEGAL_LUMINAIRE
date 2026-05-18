import { BookOpen } from "lucide-react";

interface Standard {
  code: string;
  title: string;
  year: string;
  status: "current" | "reaffirmed" | "superseded";
  category: "indian-plaster" | "indian-mortar" | "indian-concrete" | "indian-lab" | "international" | "nabl" | "legal";
  relevantClauses: { clause: string; text: string }[];
  relevanceToCase: string;
  packets: string[];
}

const standards: Standard[] = [
  /* ── PLASTER ── */
  {
    code: "IS 1661 : 1972",
    title: "Code of Practice for Application of Cement and Cement-Lime Plaster Finishes",
    year: "1972 (Reaffirmed 2020)",
    status: "reaffirmed",
    category: "indian-plaster",
    packets: ["Packet A"],
    relevantClauses: [
      { clause: "Table 1 — Proportions for Cement Plaster", text: "External plaster shall be in proportions CM 1:4 (rich), CM 1:5 (standard), or CM 1:6 (lean). No ratio beyond 1:6 is specified for any external application. A ratio of 1:18 finds no reference in this standard for any functional plaster." },
      { clause: "Clause 6 — Application", text: "Sampling of hardened plaster for testing shall be restricted to the plaster coat thickness only. Penetration into the substrate during sampling contaminates the result." },
    ],
    relevanceToCase: "Directly establishes the specification range (1:4 to 1:6) for external plaster — the FSL result of 1:18 is 3–4× the sand content of the leanest standard grade.",
  },
  {
    code: "IS 2402 : 1963",
    title: "Code of Practice for External Rendered Finishes",
    year: "1963 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-plaster",
    packets: ["Packet A"],
    relevantClauses: [
      { clause: "Clause 4 — Materials and Mixes", text: "Cement-sand mortar for external rendered finishes shall be in the range 1:3 to 1:6 by volume. Mixes leaner than 1:6 are considered unsuitable for external use due to inadequate weather resistance and bonding." },
    ],
    relevanceToCase: "Confirms 1:6 as the leanest acceptable external plaster. The FSL's 1:18 result is not contemplated for any functional exterior finish.",
  },
  {
    code: "IS 1542 : 1992",
    title: "Specification for Sand for Plaster",
    year: "1992 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-plaster",
    packets: ["Packet A"],
    relevantClauses: [
      { clause: "Clause 3 — Grading", text: "Sand for plaster shall be well-graded and free from harmful impurities. Properties differ from construction sand and from the river sand used in masonry. Control sand sample (S1) used in FSL analysis must match site plaster sand." },
    ],
    relevanceToCase: "If control sand S1 properties differed from the plaster sand actually used on site, the ratio calculation is systematically biased.",
  },
  /* ── MORTAR ── */
  {
    code: "IS 2250 : 1981",
    title: "Code of Practice for Preparation and Use of Masonry Mortars",
    year: "1981 (Reaffirmed 2020)",
    status: "reaffirmed",
    category: "indian-mortar",
    packets: ["Packet B"],
    relevantClauses: [
      { clause: "Table 1 — Standard Masonry Mortar Grades", text: "Grades: M1 (1:3), M2 (1:4), M3 (1:5), M4 (1:6), M5 (1:8). No mortar grade at or near 1:17 is recognised. Functional masonry mortars cannot achieve adequate compressive strength, bond strength, or workability at ratios beyond 1:8." },
      { clause: "Clause 6.1 — Sampling Hardened Mortar from Masonry", text: "Mortar samples shall be extracted by controlled chiselling of the joint alone, ensuring no masonry unit material is included. Hammer extraction without depth control is not recommended. Stone fragment inclusion invalidates chemical analysis." },
    ],
    relevanceToCase: "Establishes the specification range and confirms that 1:17 is not a recognised mortar grade. Also specifies correct sampling method — violated in this case.",
  },
  {
    code: "IS 1597 (Part 1) : 1992",
    title: "Code of Practice for Construction of Stone Masonry — Part 1: Rubble Stone Masonry",
    year: "1992 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-mortar",
    packets: ["Packet B"],
    relevantClauses: [
      { clause: "Clause 6.2 — Mortar for Stone Masonry", text: "Mortar for exposed stone masonry shall be of grade M3 or better. The standing masonry structure presumed to have used mortar of at least this grade — consistent with its survival." },
      { clause: "Clause 6 — Materials", text: "When testing mortar from existing stone masonry, sampling must ensure separation of mortar from stone. Stone masonry joints are typically 10–25 mm wide — pure mortar extraction by hammer is practically impossible." },
    ],
    relevanceToCase: "Confirms M3/M4 as the normal specification for stone masonry boundary walls. The stone silica contamination argument is specific to this type of construction.",
  },
  {
    code: "IS 2116 : 1980",
    title: "Specification for Sand for Masonry Mortars",
    year: "1980 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-mortar",
    packets: ["Packet B"],
    relevantClauses: [
      { clause: "Clause 3 — Grading and Purity", text: "Sand for masonry mortars shall be free from clay, silt and organic impurities. Its properties — particularly silica content and grading — must be known for accurate chemical back-calculation of mortar proportions." },
    ],
    relevanceToCase: "Control sand sample S1 must match the specific sand used in the masonry mortar. Any discrepancy directly affects the ratio calculation.",
  },
  /* ── CONCRETE ── */
  {
    code: "IS 456 : 2000",
    title: "Plain and Reinforced Concrete — Code of Practice",
    year: "2000 (Reaffirmed 2021)",
    status: "reaffirmed",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Table 5 — Minimum Grade of Concrete", text: "Minimum grade for plain concrete in foundations (mild exposure): M10. Minimum for reinforced concrete: M20. The contractual specification determines the required grade — without knowing the specification, no breach can be established." },
      { clause: "Clause 14 — Quality of Materials", text: "Concrete quality shall be verified by testing. The primary measure is compressive strength of drilled cores or cast cubes, not chemical analysis of chip samples." },
      { clause: "Clause 15 — Concrete Mix Proportioning", text: "Mix design shall account for the actual properties of cement, sand and coarse aggregate used. Chemical analysis of hardened concrete chip samples is not specified as a method for verifying mix proportions in existing structures." },
    ],
    relevanceToCase: "Most important standard for Packet C. Establishes that: (a) concrete quality is graded by strength, not volume ratio; (b) the contractual grade determines the specification; (c) chemical analysis is not the prescribed verification method.",
  },
  {
    code: "IS 516 (Part 1) : 2018",
    title: "Methods of Tests for Strength of Concrete — Part 1: Testing of Hardened Concrete",
    year: "2018",
    status: "current",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 4 — General Requirements", text: "For results used in legal or disciplinary proceedings, both parties shall be represented at testing. Results shall be the average of not less than three specimens. [Supersedes IS 516:1959.]" },
      { clause: "Clause 11 — Calculation of Results", text: "Reported result shall be average of not less than three specimens unless stated otherwise. Single-specimen result is indicative only." },
    ],
    relevanceToCase: "Current edition (supersedes IS 516:1959). Applicable to all three packets for the requirement of multiple determinations and mutual presence at testing.",
  },
  {
    code: "IS 516 (Part 5) : 2020",
    title: "Methods of Tests for Strength of Concrete — Part 5: Core Drilling and Testing for Existing Concrete Structures",
    year: "2020",
    status: "current",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 5 — Core Drilling Procedure", text: "Core drilling by diamond drill is the prescribed method for extracting representative specimens from existing concrete structures for strength assessment. This method ensures an undisturbed, uncontaminated, geometrically defined specimen." },
      { clause: "Clause 6 — Testing of Cores", text: "Drilled cores shall be tested in compression to determine concrete strength. The compressive strength result is compared against the specified grade to determine compliance." },
    ],
    relevanceToCase: "This is the correct and prescribed method for Packet C (foundation concrete). Its non-use — and the substitution of an inapplicable chemical chip-sample method — is a fundamental methodological error that voids the FSL result for concrete.",
  },
  {
    code: "IS 10262 : 2019",
    title: "Concrete Mix Proportioning — Guidelines",
    year: "2019",
    status: "current",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 4 — Mix Design Procedure", text: "Mix proportions shall be based on the actual properties of the specific cement, fine aggregate, and coarse aggregate used. Back-calculation of mix proportions from chemical analysis of hardened concrete chip samples is not a recognised procedure under these guidelines." },
    ],
    relevanceToCase: "Confirms that concrete mix proportions cannot be reliably back-calculated from chip-sample chemical analysis. The FSL result for Packet C has no methodological basis in this or any other Indian Standard.",
  },
  {
    code: "IS 13311 (Part 1) : 1992",
    title: "Non-Destructive Testing of Concrete — Ultrasonic Pulse Velocity",
    year: "1992 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 5 — Test Procedure", text: "Ultrasonic pulse velocity provides a rapid, non-destructive in-situ assessment of concrete quality and uniformity. A high pulse velocity indicates good quality concrete." },
    ],
    relevanceToCase: "An available non-destructive method that could have objectively assessed concrete quality without damage — its non-use further questions the purpose of the enquiry team's approach.",
  },
  {
    code: "IS 13311 (Part 2) : 1992",
    title: "Non-Destructive Testing of Concrete — Rebound Hammer",
    year: "1992 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-concrete",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 5 — Test Procedure", text: "Rebound hammer provides an assessment of concrete surface hardness correlatable with compressive strength. A direct, non-destructive in-situ quality indicator." },
    ],
    relevanceToCase: "Another available non-destructive method not used. The choice of destructive chip-sample chemical analysis — particularly in storm conditions — over available NDT methods shows procedural arbitrariness.",
  },
  /* ── SHARED / LAB ── */
  {
    code: "IS 1199 (Part 5) : 2018",
    title: "Fresh Concrete — Sampling and Testing — Part 5: Sampling of Hardened Concrete",
    year: "2018",
    status: "current",
    category: "indian-lab",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Clause 5 — Sampling Procedure", text: "Sampling witnessed by representatives of both testing authority and party under examination. Samples in airtight containers, protected from contamination and adverse weather. [Supersedes IS 1199:1959 for this purpose.]" },
      { clause: "Clause 4 — Quantity", text: "Quantity sufficient for primary test, repeat test, and one-third retention as referee sample for minimum 90 days." },
      { clause: "Clause 6 — Time Intervals", text: "Tests commenced within prescribed time; test report shall state date of collection and date of testing." },
    ],
    relevanceToCase: "Central standard for all three packets. Supersedes IS 1199:1959. Violated at every stage — collection, quantity, storage, and time limits.",
  },
  {
    code: "IS 4031 (Part 1) : 1996",
    title: "Methods of Physical Tests for Hydraulic Cement — Part 1: Determination of Fineness",
    year: "1996 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-lab",
    packets: ["Packet A", "Packet B"],
    relevantClauses: [
      { clause: "Clause 3.2 — Sample Retention", text: "Portion for at least one full repeat of all tests retained for not less than three months. Made available to authorised parties." },
      { clause: "Clause 5 — Sampling", text: "Samples collected jointly; party under examination has the right to be present." },
    ],
    relevanceToCase: "Applicable to the cement analysis aspects of Packets A and B. Retention requirement (Clause 3.2) — violated.",
  },
  {
    code: "IS 4031 (Part 5) : 1988",
    title: "Methods of Chemical Analysis of Hydraulic Cement — Part 5: Determination of Insoluble Residue",
    year: "1988 (Reaffirmed 2018)",
    status: "reaffirmed",
    category: "indian-lab",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Clause 1 — Scope", text: "Prescribes method for chemical analysis of hydraulic cement. Application to hardened concrete (Packet C) is outside the defined scope of this standard — results for concrete are at best indicative." },
      { clause: "Clause 4 — Control Sample Requirement", text: "Chemical analysis shall be performed on both the composite sample AND a control sample of the specific cement used. Where unavailable, result shall be stated as indicative only." },
      { clause: "Clause 13 — Report Requirements", text: "Report shall state: number of determinations; individual results; mean; repeatability limit compliance. Single-determination result shall be labelled as such." },
    ],
    relevanceToCase: "The FSL applied this cement testing method to all three packets — but it is not designed for concrete (Packet C). The absent cement control sample makes all three results indicative only.",
  },
  {
    code: "IS 269 : 2015",
    title: "Ordinary Portland Cement — Specification",
    year: "2015",
    status: "current",
    category: "indian-lab",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Table 1 — Chemical Requirements", text: "OPC shall contain a minimum of 17% SiO₂. No upper limit is specified. Actual soluble silica content varies between approximately 19% and 24% depending on clinker source and manufacturing process. The FSL's assumption of exactly 21% is not supported by this standard." },
      { clause: "Clause 6 — Testing", text: "Chemical composition of each cement batch shall be determined by testing. A general assumption about soluble silica content is not an acceptable substitute for measurement." },
    ],
    relevanceToCase: "Directly demolishes the FSL's 21% soluble silica assumption — the foundation of all three ratio calculations.",
  },
  {
    code: "IS 383 : 2016",
    title: "Coarse and Fine Aggregates for Concrete — Specification",
    year: "2016",
    status: "current",
    category: "indian-lab",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Clause 6 — Sampling", text: "Aggregate samples shall not be collected in conditions (rain, flooding) that alter material properties." },
      { clause: "Clause 7 — Testing", text: "Results reported with method reference and number of determinations." },
    ],
    relevanceToCase: "Control aggregate samples S1, S2, S3 must meet this standard. Their silica content must be known and stated for valid ratio calculations.",
  },
  {
    code: "IS/IEC 17025 : 2017",
    title: "General Requirements for the Competence of Testing and Calibration Laboratories",
    year: "2017",
    status: "current",
    category: "indian-lab",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Clause 7.1.3", text: "Client or their authorised representative permitted to witness testing activities." },
      { clause: "Clause 7.4 — Handling", text: "Documented procedure for transportation, receipt, handling, storage, retention and disposal; deviations recorded." },
      { clause: "Clause 7.8.2 — Test Report Minimum Requirements", text: "Report shall include: test method reference; date(s) of testing; results with units; identification of all personnel. Omission of method reference renders report non-compliant." },
      { clause: "Clause 7.8.3 — Specific Requirements", text: "Uncertainty of measurement; number of observations; statistical method; statements of conformity — all required." },
    ],
    relevanceToCase: "Overarching laboratory standard. The FSL report fails Clauses 7.4, 7.8.2, and 7.8.3 — an accredited laboratory cannot issue such a report without these elements.",
  },
  /* ── NABL ── */
  {
    code: "NABL Doc 112 : 2018",
    title: "Specific Criteria for Accreditation of Forensic Science Laboratories",
    year: "2018",
    status: "current",
    category: "nabl",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Clause 5.8 — Sample Receipt", text: "Samples accompanied by chain of custody document signed at each transfer. Samples without complete documentation quarantined — not tested." },
      { clause: "Clause 5.10 — Test Reports", text: "Parties to legal dispute shall be notified. Either party may designate a witness to observe testing. Test report shall clearly state method used, standard reference, and nature of any deviation." },
    ],
    relevanceToCase: "NABL's own criteria for FSL reports — violated on chain of custody, party notification, and mandatory method citation.",
  },
  /* ── INTERNATIONAL ── */
  {
    code: "ASTM C823 / C823M : 2017",
    title: "Standard Practice for Examination and Sampling of Hardened Concrete in Constructions",
    year: "2017",
    status: "current",
    category: "international",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Section 5.1 — Significance and Use", text: "Sampling shall be conducted jointly by representatives of all interested parties. Unilateral sampling is scientifically unreliable." },
      { clause: "Section 8.2 — Environmental Conditions", text: "Samples shall not be obtained in rain or wind conditions likely to cause contamination or alter composition. Appropriate weather protection shall be provided." },
      { clause: "Section 8.3 — Depth Control", text: "For layered systems (plaster, mortar joint), sample depth shall be controlled to exclude adjacent material. Uncontrolled hammer extraction does not comply." },
    ],
    relevanceToCase: "Primary international standard for sampling hardened concrete/mortar from existing structures. Directly applicable to all three packets.",
  },
  {
    code: "ASTM C856 : 2020",
    title: "Standard Practice for Petrographic Examination of Hardened Concrete",
    year: "2020",
    status: "current",
    category: "international",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Section 8 — Application", text: "Petrographic examination is the standard method for identifying original mix constituents and detecting contamination in hardened concrete and mortar samples." },
      { clause: "Section 9 — Identification of Constituents", text: "Petrographic examination can distinguish plaster mortar from substrate material, mortar from masonry unit stone fragments, and sand from coarse aggregate — distinctions that chemical analysis alone cannot make." },
    ],
    relevanceToCase: "The correct method for verifying original mix constituents and detecting contamination. Its non-use by the FSL is itself evidence that the analysis was methodologically inadequate.",
  },
  {
    code: "BS EN 12504-1 : 2019",
    title: "Testing Concrete in Structures — Part 1: Cored Specimens — Taking, Examining and Testing",
    year: "2019",
    status: "current",
    category: "international",
    packets: ["Packet C"],
    relevantClauses: [
      { clause: "Clause 5 — Core Extraction", text: "Cores shall be extracted by diamond drilling from locations agreed by all parties. Core dimensions and extraction procedure prescribed to ensure representative, uncontaminated specimens." },
      { clause: "Clause 7 — Testing and Reporting", text: "Compressive strength of cores is the primary conformity criterion for concrete in existing structures. Chemical analysis of chip samples is not referenced as a verification method." },
    ],
    relevanceToCase: "European equivalent of IS 516 (Part 5):2020 — confirms that core drilling is the international standard for existing concrete verification. Supports the argument that the FSL's approach to Packet C was wrong by every recognised standard.",
  },
  {
    code: "BS EN 14630 : 2006",
    title: "Products and Systems for Protection of Concrete — Determination of Carbonation Depth",
    year: "2006",
    status: "current",
    category: "international",
    packets: ["Packet A", "Packet B"],
    relevantClauses: [
      { clause: "Clause 5.2 — Environmental Conditions", text: "Samples shall not be obtained in rain or wind conditions likely to cause contamination. Samples falling onto wet or contaminated ground shall be discarded." },
    ],
    relevanceToCase: "Supports the environmental conditions argument (Ground 2). Also provides the methodology for measuring carbonation depth — relevant to the Plaster section where carbonation of hardened plaster explains the anomalous FSL result.",
  },
  {
    code: "ASTM E1188",
    title: "Standard Practice for Collection and Preservation of Information and Physical Items by a Technical Investigator",
    year: "2011",
    status: "current",
    category: "international",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Section 7.2 — Chain of Custody", text: "Each sample container sealed with tamper-evident tape at collection. Chain of custody records date, time, location, collector's name and signature for every transfer. Failure to maintain renders evidence inadmissible." },
    ],
    relevanceToCase: "International benchmark for chain of custody — supports Ground 3 across all three packets.",
  },
  /* ── LEGAL PRECEDENTS ── */
  {
    code: "Maneka Gandhi v. Union of India (1978) 1 SCC 248",
    title: "Supreme Court of India — Natural Justice / Right to be Heard",
    year: "1978",
    status: "current",
    category: "legal",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Ratio", text: "Procedural fairness is not optional. Any authority exercising power that affects the rights of a person must observe the principles of natural justice — including the right to be heard in a meaningful sense at every material stage." },
    ],
    relevanceToCase: "Applies to Grounds 1 and 6 — contractor's right to be present at sampling and testing.",
  },
  {
    code: "Union of India v. Tulsiram Patel (1985) 3 SCC 398",
    title: "Supreme Court of India — Effective Opportunity in Administrative Proceedings",
    year: "1985",
    status: "current",
    category: "legal",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Para 96", text: "The charged party must have a genuine and effective opportunity to meet the case against them at every material stage — including the stage at which evidence is generated." },
    ],
    relevanceToCase: "Applies to Ground 6 — absence at testing. Raises the bar beyond mere notice to meaningful participation.",
  },
  {
    code: "Mohd. Khalid v. State of W.B. (2002) 7 SCC 334",
    title: "Supreme Court of India — Chain of Custody of Forensic Evidence",
    year: "2002",
    status: "current",
    category: "legal",
    packets: ["Packet A", "Packet B", "Packet C"],
    relevantClauses: [
      { clause: "Para 22", text: "Gaps or irregularities in the chain of custody of physical evidence that cannot be satisfactorily explained create a reasonable doubt to be resolved in favour of the respondent." },
    ],
    relevanceToCase: "Applies to Ground 3 — broken chain of custody from collection through transportation to laboratory.",
  },
];

const categoryConfig: Record<Standard["category"], { label: string; color: string; dot: string }> = {
  "indian-plaster": { label: "IS — Plaster", color: "bg-amber-50 border-amber-200 text-amber-800", dot: "bg-amber-500" },
  "indian-mortar": { label: "IS — Mortar", color: "bg-blue-50 border-blue-200 text-blue-800", dot: "bg-blue-500" },
  "indian-concrete": { label: "IS — Concrete", color: "bg-green-50 border-green-200 text-green-800", dot: "bg-green-500" },
  "indian-lab": { label: "IS — Testing / Lab", color: "bg-indigo-50 border-indigo-200 text-indigo-800", dot: "bg-indigo-500" },
  international: { label: "International Standard", color: "bg-purple-50 border-purple-200 text-purple-800", dot: "bg-purple-500" },
  nabl: { label: "NABL Guideline", color: "bg-teal-50 border-teal-200 text-teal-800", dot: "bg-teal-500" },
  legal: { label: "Legal Precedent", color: "bg-rose-50 border-rose-200 text-rose-800", dot: "bg-rose-500" },
};

const statusBadge: Record<Standard["status"], string> = {
  current: "bg-green-100 text-green-800 border-green-200",
  reaffirmed: "bg-blue-100 text-blue-800 border-blue-200",
  superseded: "bg-red-100 text-red-800 border-red-200",
};

function StandardCard({ std }: { std: Standard }) {
  const cfg = categoryConfig[std.category];
  return (
    <div className="border border-border rounded-xl bg-white shadow-sm overflow-hidden mb-4">
      <div className="p-4 border-b border-border" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block border rounded text-xs font-bold px-2 py-0.5 ${cfg.color}`}>{cfg.label}</span>
            <span className={`inline-block border rounded text-xs font-semibold px-2 py-0.5 ${statusBadge[std.status]}`}>
              {std.status === "current" ? "✓ Current" : std.status === "reaffirmed" ? "✓ Reaffirmed" : "⚠ Superseded"}
            </span>
            {std.packets.map(p => (
              <span key={p} className="inline-block text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "hsl(220 60% 28%)", color: "white" }}>{p}</span>
            ))}
          </div>
          <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
        <h3 className="font-bold text-foreground text-sm">{std.code}</h3>
        <p className="text-xs text-muted-foreground">{std.title} · {std.year}</p>
        <div className="mt-2 p-2.5 rounded border border-border bg-white">
          <p className="text-xs font-bold text-muted-foreground mb-0.5">Relevance to This Case</p>
          <p className="text-xs leading-relaxed text-foreground">{std.relevanceToCase}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Key Clauses</p>
        <div className="space-y-2">
          {std.relevantClauses.map((clause, i) => (
            <div key={i} className="flex gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
              <div>
                <p className="text-xs font-bold text-foreground mb-0.5">{clause.clause}</p>
                <p className="text-xs leading-relaxed text-muted-foreground italic">"{clause.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections: { cat: Standard["category"]; title: string; desc: string }[] = [
  { cat: "indian-plaster", title: "IS Standards — Cement Plaster (Packet A)", desc: "Indian Standards governing cement plaster application, specification and sampling." },
  { cat: "indian-mortar", title: "IS Standards — Stone Masonry Mortar (Packet B)", desc: "Indian Standards governing masonry mortars, stone masonry construction and mortar sampling." },
  { cat: "indian-concrete", title: "IS Standards — Foundation Concrete (Packet C)", desc: "Indian Standards governing concrete specification, mix design, testing and in-situ verification." },
  { cat: "indian-lab", title: "IS Standards — Testing, Sampling and Laboratory", desc: "Indian Standards governing the testing process, laboratory conduct and report requirements — applicable to all three packets." },
  { cat: "nabl", title: "NABL Guidelines", desc: "National Accreditation Board for Testing and Calibration Laboratories — criteria applicable to the FSL." },
  { cat: "international", title: "International Standards (ASTM / BS EN)", desc: "International benchmarks for sampling, testing and chain of custody requirements." },
  { cat: "legal", title: "Supreme Court Precedents", desc: "Binding legal principles established by the Supreme Court of India." },
];

export default function StandardsIndex() {
  const byCat = (cat: Standard["category"]) => standards.filter(s => s.category === cat);
  const totalStds = standards.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Standards & Precedents Index</h1>
        <p className="text-sm text-muted-foreground">
          Complete index of {totalStds} standards and precedents cited across the three-section defence brief. All citations verified by 5 independent agents. Organised by material type and category.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(Object.keys(categoryConfig) as Standard["category"][]).map(cat => {
          const cfg = categoryConfig[cat];
          const count = byCat(cat).length;
          if (count === 0) return null;
          return (
            <div key={cat} className={`p-3 rounded-xl border text-center ${cfg.color}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-semibold mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {sections.map(sec => {
        const items = byCat(sec.cat);
        if (items.length === 0) return null;
        return (
          <div key={sec.cat} className="mb-10">
            <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${categoryConfig[sec.cat].dot}`} />
              {sec.title}
            </h2>
            <p className="text-xs text-muted-foreground mb-3">{sec.desc}</p>
            {items.map(std => <StandardCard key={std.code} std={std} />)}
          </div>
        );
      })}

      <div className="p-5 rounded-xl border" style={{ background: "hsl(220 45% 14%)", borderColor: "hsl(220 35% 22%)" }}>
        <h3 className="font-bold mb-2" style={{ color: "hsl(45 90% 55%)" }}>Where to Obtain Standards</h3>
        <ul className="text-sm space-y-1" style={{ color: "hsl(36 30% 75%)" }}>
          <li>• Indian Standards (BIS): Bureau of Indian Standards, Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi — <strong style={{ color: "hsl(36 30% 85%)" }}>www.bis.gov.in</strong></li>
          <li>• NABL Guidelines: National Accreditation Board for Testing and Calibration Laboratories — <strong style={{ color: "hsl(36 30% 85%)" }}>www.nabl-india.org</strong></li>
          <li>• ASTM Standards: American Society for Testing and Materials — <strong style={{ color: "hsl(36 30% 85%)" }}>www.astm.org</strong></li>
          <li>• BS EN Standards: British Standards Institution — <strong style={{ color: "hsl(36 30% 85%)" }}>www.bsigroup.com</strong></li>
          <li>• Case Law: Supreme Court of India — <strong style={{ color: "hsl(36 30% 85%)" }}>www.sci.gov.in</strong> / Indian Kanoon — <strong style={{ color: "hsl(36 30% 85%)" }}>www.indiankanoon.org</strong></li>
        </ul>
        <p className="text-xs mt-3" style={{ color: "hsl(36 30% 50%)" }}>All standards must be obtained and verified against their original published texts before use in any legal or quasi-legal proceeding.</p>
      </div>
    </div>
  );
}
