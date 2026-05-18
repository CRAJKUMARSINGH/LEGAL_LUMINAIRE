import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import fslReportImg from "@/assets/FSL_TEST_REPORT_HEMRAJ_CASE_1778738761265.jpeg";

interface Finding {
  field: string;
  reported: string;
  issue: "critical" | "missing" | "assumption" | "ok";
  comment: string;
}

const findings: Finding[] = [
  {
    field: "Laboratory Name",
    reported: "Rajya Vidhi Vigyan Prayogshala, Jaipur, Rajasthan",
    issue: "ok",
    comment: "State Forensic Science Laboratory — identified. However, NABL accreditation status for chemical analysis of construction materials is not stated in the report.",
  },
  {
    field: "Signing Officers",
    reported: "KL Verma (SSO Physics) and Dr Shailendra Jha (Sahayak Nideshak Bhautiki)",
    issue: "ok",
    comment: "Officers identified and have signed. Note: KL Verma's designation is SSO Physics — chemical analysis of cementitious materials is a chemistry function, not physics. Qualification for this specific analysis is not established by the report.",
  },
  {
    field: "Date of Sample Collection",
    reported: "NOT STATED",
    issue: "missing",
    comment: "Critical omission. Without the collection date, compliance with mandatory testing time limits (IS 1199 (Part 5):2018 Cl.6, IS 4031 Part 5) cannot be verified. This alone makes the report procedurally deficient.",
  },
  {
    field: "Date of Sample Receipt at Laboratory",
    reported: "NOT STATED",
    issue: "missing",
    comment: "No record of when samples arrived at the laboratory. Chain of custody gap — IS/IEC 17025:2017 Cl.7.4 requires documentation of receipt with signed chain of custody.",
  },
  {
    field: "Date of Testing",
    reported: "NOT STATED",
    issue: "missing",
    comment: "No testing date recorded. Without the testing date, the time elapsed between collection and testing cannot be verified against IS-prescribed limits.",
  },
  {
    field: "Test Method / Indian Standard Applied",
    reported: "NOT STATED",
    issue: "critical",
    comment: "The most fundamental omission. IS/IEC 17025:2017 Cl.7.8.2 mandates inclusion of the test method reference in every report. Without it, the result cannot be evaluated for method compliance, precision limits, or comparison against contractual specification.",
  },
  {
    field: "Packet A — Cement Plaster (External — Boundary Wall)",
    reported: "Cement : Sand = 1 : 18",
    issue: "assumption",
    comment: "Applicable standard: IS 1661:1972 specifies external plaster at CM 1:4 to 1:6. A result of 1:18 represents 3–4 times the normal sand content. HOWEVER: this ratio is calculated on an unverified 21% soluble silica assumption (no cement control sample). Additionally, hammer extraction of a thin plaster coat (12–20 mm) in rain inevitably includes siliceous stone substrate material — artificially inflating apparent aggregate content. Carbonation of hardened plaster further reduces apparent cement fraction. Result is scientifically unreliable.",
  },
  {
    field: "Packet B — Cement Mortar (Stone Masonry Joint)",
    reported: "Cement : Sand = 1 : 17",
    issue: "assumption",
    comment: "Applicable standard: IS 2250:1981 specifies masonry mortars at grades 1:3 to 1:6 (M1–M4). No recognised grade at 1:17 exists — a wall bonded with 1:17 mortar could not stand. CRITICAL FLAW: Stone masonry joints (10–25 mm wide) cannot be sampled in pure form by hammer on a wet wall. Stone fragments (60–95% SiO₂) inevitably contaminate the sample — their silica is counted as aggregate silica, dramatically inflating apparent sand content. The chemical method cannot distinguish sand silica from stone fragment silica. Result is fundamentally unreliable for stone masonry mortar.",
  },
  {
    field: "Packet C — Foundation Concrete (Stone Masonry Wall)",
    reported: "Cement : Sand : Grit = 1 : 5.75 : 9.5",
    issue: "critical",
    comment: "Applicable standard: IS 456:2000 (M10/M15 for foundations). MOST SERIOUS DEFECT: IS 4031 (Part 5) chemical analysis is prescribed for cement and mortar — NOT for concrete. Coarse aggregate (grit/stone chips) contains natural silica (50–95% SiO₂ depending on rock type) that the method cannot separate from sand silica. The three-component ratio presented (cement:sand:grit) cannot be derived from chemical analysis alone — it requires independent characterisation of each aggregate fraction. The correct methods are IS 516 (Part 5):2020 core drilling and ASTM C856:2020 petrographic examination. Applying a mortar analysis method to concrete is a fundamental methodological error that makes Packet C result entirely invalid.",
  },
  {
    field: "Control Sample of Cement",
    reported: "NOT SUPPLIED",
    issue: "critical",
    comment: "The report explicitly states: 'As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica.' IS 4031 (Part 5):1988 requires a verified cement control sample. The 21% assumption ignores natural cement silica variation of ~19–24% (IS 269:2015 specifies only a minimum of 17% SiO₂). A ±3% variation in actual cement silica shifts the calculated ratio by ±15% — potentially converting a compliant 1:6 mix to an apparent 1:8 or 1:9, and with stacking errors (substrate contamination + carbonation + silica assumption), to 1:17 or 1:18.",
  },
  {
    field: "S1 — Sand Control Sample",
    reported: "Listed as received",
    issue: "assumption",
    comment: "Listed but no result stated for S1. The control sand sample is essential for isolating the sand silica contribution in the composite analysis. If S1 was not used or its result is not shown, the ratio calculations are even less reliable.",
  },
  {
    field: "S2 — Grit Control Sample",
    reported: "Listed as received",
    issue: "assumption",
    comment: "Listed but no result stated for S2. For Packet C (concrete), the grit control analysis is critical — the grit's silica content must be known to attempt any back-calculation of concrete mix proportions. Its absence makes the Packet C ratio essentially meaningless.",
  },
  {
    field: "S3 — Sample of Grit",
    reported: "Listed as received",
    issue: "assumption",
    comment: "Listed. The distinction between S2 (control grit) and S3 (sample grit) is not explained. Whether these represent different grit sources or the same material from different locations is unclear — yet their silica content determines the entire Packet C calculation.",
  },
  {
    field: "Number of Determinations per Sample",
    reported: "NOT STATED",
    issue: "critical",
    comment: "IS 4031 (Part 5):1988 Clause 13 and IS 1199 (Part 5):2018 require minimum two concordant determinations. The report does not state whether the results represent single determinations or averages. A single result cannot be treated as conclusive.",
  },
  {
    field: "Repeatability Data",
    reported: "NOT STATED",
    issue: "missing",
    comment: "No individual determination values stated. Repeatability limit compliance cannot be verified. IS/IEC 17025:2017 Cl.7.8.3 requires this information in conformity assessment reports.",
  },
  {
    field: "Uncertainty of Measurement",
    reported: "NOT STATED",
    issue: "missing",
    comment: "IS/IEC 17025:2017 requires statement of measurement uncertainty. Without it, the ratios 1:18, 1:17, and 1:5.75:9.5 cannot be compared against any specification — the true value could be within the allowed tolerance.",
  },
  {
    field: "Sample Quantity Received",
    reported: "NOT STATED",
    issue: "missing",
    comment: "No statement of total quantity received for each packet. Compliance with IS 1199 (Part 5):2018 (one-third retention as referee sample for 90 days) cannot be assessed.",
  },
  {
    field: "Referee Sample Retained",
    reported: "NOT STATED",
    issue: "critical",
    comment: "No mention of referee sample retention. IS 1199 (Part 5):2018 requires one-third of collected quantity to be retained for minimum 90 days for independent re-testing. Its absence permanently extinguishes the contractor's right to independent verification.",
  },
];

const packetCards = [
  {
    packet: "Packet A",
    material: "Cement Plaster",
    location: "External surface — boundary wall",
    fsl: "1 : 18 (cement : sand)",
    spec: "IS 1661:1972 — CM 1:4 to 1:6",
    color: "hsl(38 85% 42%)",
    bg: "hsl(38 85% 42% / 0.08)",
    border: "hsl(38 85% 42% / 0.3)",
    flaw: "Thin plaster coat (12–20 mm) shattered in rain → substrate stone contamination + carbonation → artificially lean result",
    std: "IS 1661:1972, IS 2402:1963, IS 1542:1992",
  },
  {
    packet: "Packet B",
    material: "Stone Masonry Mortar",
    location: "Masonry joint mortar — boundary wall",
    fsl: "1 : 17 (cement : sand)",
    spec: "IS 2250:1981 — Grade M3/M4 (1:5 or 1:6)",
    color: "hsl(220 60% 35%)",
    bg: "hsl(220 60% 35% / 0.08)",
    border: "hsl(220 60% 35% / 0.3)",
    flaw: "Hammer extraction from wet stone masonry → stone fragments (60–95% SiO₂) in sample → stone silica counted as aggregate → artificially lean result",
    std: "IS 2250:1981, IS 1597 (Part 1):1992, IS 2116:1980",
  },
  {
    packet: "Packet C",
    material: "Foundation Concrete",
    location: "Wall foundation — stone masonry",
    fsl: "1 : 5.75 : 9.5 (cement : sand : grit)",
    spec: "IS 456:2000 — M10 or M15 for foundations",
    color: "hsl(160 50% 30%)",
    bg: "hsl(160 50% 30% / 0.08)",
    border: "hsl(160 50% 30% / 0.3)",
    flaw: "WRONG METHOD: IS 4031 Part 5 chemical analysis is for cement/mortar — NOT concrete. Coarse aggregate silica cannot be separated from sand silica. Three-component ratio is scientifically invalid. Correct methods: IS 516 (Part 5):2020 cores + ASTM C856 petrography.",
    std: "IS 456:2000, IS 516 (Part 5):2020, IS 10262:2019, ASTM C856:2020",
  },
];

const issueConfig = {
  critical: { label: "Critical Defect", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  missing: { label: "Not Stated", icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  assumption: { label: "Based on Assumption", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  ok: { label: "Present", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
};

export default function FslAnalysis() {
  const counts = {
    critical: findings.filter(f => f.issue === "critical").length,
    missing: findings.filter(f => f.issue === "missing").length,
    assumption: findings.filter(f => f.issue === "assumption").length,
    ok: findings.filter(f => f.issue === "ok").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">FSL Report — Field-by-Field Analysis</h1>
        <p className="text-sm text-muted-foreground">Rajya Vidhi Vigyan Prayogshala, Jaipur — Systematic examination of every field, including material-specific analysis of each packet.</p>
      </div>

      {/* Three packet identification cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {packetCards.map(p => (
          <div key={p.packet} className="rounded-xl border-2 p-4" style={{ borderColor: p.border, background: p.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: p.color }}>{p.packet}</span>
            </div>
            <p className="font-bold text-sm text-foreground mb-0.5">{p.material}</p>
            <p className="text-xs text-muted-foreground mb-2">{p.location}</p>
            <div className="bg-white border border-border rounded p-2 mb-2">
              <p className="text-xs text-muted-foreground">FSL Result</p>
              <p className="font-bold text-sm" style={{ color: p.color }}>{p.fsl}</p>
            </div>
            <div className="bg-white border border-border rounded p-2 mb-2">
              <p className="text-xs text-muted-foreground">Applicable Specification</p>
              <p className="text-xs font-semibold text-foreground">{p.spec}</p>
            </div>
            <div className="p-2 rounded border" style={{ background: "hsl(0 72% 42% / 0.06)", borderColor: "hsl(0 72% 42% / 0.2)" }}>
              <p className="text-xs text-muted-foreground mb-0.5">Critical Scientific Flaw</p>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(0 72% 30%)" }}>{p.flaw}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Standards: {p.std}</p>
          </div>
        ))}
      </div>

      {/* Report image */}
      <div className="mb-6 border border-border rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="p-4 border-b border-border" style={{ background: "hsl(220 45% 14%)" }}>
          <p className="text-sm font-bold" style={{ color: "hsl(45 90% 55%)" }}>FSL Report — Original Document</p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(36 30% 65%)" }}>Rajya Vidhi Vigyan Prayogshala, Jaipur — KL Verma (SSO Physics) and Dr Shailendra Jha (Sahayak Nideshak Bhautiki)</p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-center">
          <img src={fslReportImg} alt="FSL Report" className="max-w-full rounded border border-border shadow-sm" style={{ maxHeight: "500px", objectFit: "contain" }} />
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(Object.keys(issueConfig) as (keyof typeof issueConfig)[]).map(key => {
          const cfg = issueConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className={`p-4 rounded-xl border text-center ${cfg.bg}`}>
              <Icon className={`h-6 w-6 mx-auto mb-2 ${cfg.color}`} />
              <p className="text-2xl font-bold">{counts[key]}</p>
              <p className={`text-xs font-semibold mt-1 ${cfg.color}`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Overall verdict */}
      <div className="mb-6 p-5 rounded-xl border-2 border-red-300 bg-red-50">
        <div className="flex gap-3">
          <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-red-800 mb-2">Overall Assessment: FSL Report Fails All Standards of Forensic Reliability</h2>
            <p className="text-sm text-red-700 leading-relaxed">
              The FSL report contains <strong>{counts.critical} critical defects</strong>, <strong>{counts.missing} mandatory fields not stated</strong>, and <strong>{counts.assumption} results based on unverified assumptions</strong>. Most fundamentally: (1) the chemical analysis method used for Packets A and B is invalidated by carbonation, leaching, and substrate contamination effects from rainy-day hammer sampling; (2) the method used for Packet C (concrete) is not prescribed for concrete and is scientifically inapplicable; (3) the entire calculation for all three packets rests on an unverified assumption that cement contains exactly 21% soluble silica — a figure unsupported by IS 269:2015. This report cannot serve as evidence of substandard construction to any recognised standard of proof.
            </p>
          </div>
        </div>
      </div>

      {/* Field-by-field findings */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border" style={{ background: "hsl(220 45% 14%)" }}>
          <h2 className="font-bold" style={{ color: "hsl(36 30% 92%)" }}>Field-by-Field Analysis</h2>
        </div>
        <div className="divide-y divide-border">
          {findings.map((f, i) => {
            const cfg = issueConfig[f.issue];
            const Icon = cfg.icon;
            return (
              <div key={i} className={`p-4 ${f.issue === "critical" ? "bg-red-50/30" : f.issue === "assumption" ? "bg-orange-50/20" : ""}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm text-foreground">{f.field}</p>
                      <span className={`inline-block border rounded-full px-2 py-px text-xs font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    {(f.reported === "NOT STATED" || f.reported === "NOT SUPPLIED") ? (
                      <p className="text-xs font-bold text-red-600 mb-1">{f.reported}</p>
                    ) : (
                      <p className="text-xs italic text-muted-foreground mb-1">Reported: <span className="font-semibold text-foreground">{f.reported}</span></p>
                    )}
                    <p className="text-sm leading-relaxed text-foreground">{f.comment}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 21% assumption box */}
      <div className="mt-6 p-6 rounded-xl border-2" style={{ borderColor: "hsl(220 60% 28% / 0.4)", background: "hsl(220 60% 28% / 0.04)" }}>
        <h2 className="font-bold text-lg mb-3" style={{ color: "hsl(220 60% 20%)" }}>The 21% Soluble Silica Assumption — Why It Is Untenable</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>The entire quantitative output rests on the assumption that the cement used by contractor Hemraj contained exactly 21% soluble silica. IS 269:2015 specifies only a minimum of 17% SiO₂ — no upper limit — and actual OPC silica content varies between approximately 19% and 24% across different manufacturers and clinker sources.</p>
          <p>The compounding error is particularly severe for stone masonry work (Packet B): if the sample contained even a small proportion of stone fragment, the inflated silica denominator already produces a lean ratio — then the 21% silica assumption understates the cement contribution further — the two errors stack in the same direction, both making the mix appear leaner than it was.</p>
          <div className="bg-white border border-border rounded-lg p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sensitivity Analysis: Impact of Cement Silica Assumption on Calculated Ratio</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1 font-bold">Assumed Cement Silica %</th>
                  <th className="text-left py-1 font-bold">Calculated Ratio (if true mix is 1:6)</th>
                  <th className="text-left py-1 font-bold">Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-1">19% (lower bound)</td><td className="py-1 font-semibold text-red-600">~1:7.5 (appears lean)</td><td className="py-1">25% overstatement of sand</td></tr>
                <tr><td className="py-1">21% (FSL assumption)</td><td className="py-1">~1:6 (accurate if true)</td><td className="py-1">Reference</td></tr>
                <tr><td className="py-1">24% (upper bound)</td><td className="py-1 font-semibold text-green-700">~1:5.2 (appears richer)</td><td className="py-1">13% understatement of sand</td></tr>
                <tr className="bg-red-50"><td className="py-1 font-bold">21% + stone contamination</td><td className="py-1 font-bold text-red-700">~1:14 to 1:18</td><td className="py-1 font-bold text-red-700">Errors compound — explains FSL result</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
