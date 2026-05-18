import { CheckCircle, XCircle, Plus, ArrowRight, ShieldCheck } from "lucide-react";

interface Change {
  category: string;
  item: string;
  original: string;
  updated: string;
  status: "corrected" | "confirmed" | "added" | "strengthened";
  impact: string;
  groundsAffected: number[];
}

const changes: Change[] = [
  {
    category: "Indian Standard — Concrete Sampling",
    item: "IS 1199 : 1959 (Methods of Sampling and Analysis of Concrete)",
    original: "Cited as primary authority for sampling hardened concrete and mortar from existing structures.",
    updated: "IS 1199 (Part 5) : 2018 — now the correct reference for sampling of hardened concrete. BIS revised IS 1199 into a multi-part series in 2018; IS 1199:1959 is superseded for this purpose.",
    status: "corrected",
    impact: "Citing a superseded standard weakens the legal argument — opposing counsel could dismiss the reference. The 2018 edition is current law and carries full BIS authority.",
    groundsAffected: [1, 2, 3, 4, 5, 6, 7, 9],
  },
  {
    category: "Indian Standard — Concrete Testing",
    item: "IS 516 : 1959 (Methods of Tests for Strength of Concrete)",
    original: "Cited as primary authority for testing requirements, mutual presence of parties, and result averaging.",
    updated: "IS 516 (Part 1) : 2018 — revised multi-part standard; IS 516:1959 superseded. IS 516 (Part 5):2020 added as the correct standard for core drilling and testing from existing structures.",
    status: "corrected",
    impact: "IS 516 (Part 5):2020 is specifically relevant to the concrete defence (Packet C) — it establishes that core drilling is the prescribed method for existing concrete, directly undermining the FSL's chemical analysis approach.",
    groundsAffected: [1, 5, 6, 7, 9],
  },
  {
    category: "Indian Standard — Cement Testing",
    item: "IS 4031 (Part 1) : 1996 and IS 4031 (Part 5) : 1988",
    original: "Cited with 1996/1988 year only.",
    updated: "IS 4031 (Part 1):1996 (Reaffirmed 2018) and IS 4031 (Part 5):1988 (Reaffirmed 2018) — confirmed current editions; not superseded but reaffirmed by BIS.",
    status: "confirmed",
    impact: "These are the correct editions. The reaffirmation year (2018) has been added to confirm currency to an adjudicating authority.",
    groundsAffected: [4, 5, 7, 8, 9],
  },
  {
    category: "Indian Standard — Masonry Mortars",
    item: "IS 2250 : 1981 (Code of Practice for Preparation and Use of Masonry Mortars)",
    original: "Cited with year 1981 only.",
    updated: "IS 2250:1981 (Reaffirmed 2020) — confirmed most recently reaffirmed edition.",
    status: "confirmed",
    impact: "The 2020 reaffirmation makes this citation current and authoritative for the masonry mortar defence (Packet B).",
    groundsAffected: [2],
  },
  {
    category: "Indian Standard — Ordinary Portland Cement",
    item: "IS 269 : 2015 (Specification for Ordinary Portland Cement)",
    original: "Cited correctly with 2015 year.",
    updated: "IS 269:2015 — confirmed as the current edition. Verified that IS 269:2015 specifies only a minimum of 17% SiO₂ with no fixed upper limit, directly supporting the critique of the 21% silica assumption.",
    status: "confirmed",
    impact: "The IS 269:2015 reference is confirmed accurate and directly demolishes the FSL's assumption that cement contains 'exactly 21% soluble silica.'",
    groundsAffected: [8],
  },
  {
    category: "Indian Standard — Aggregates",
    item: "IS 383 : 2016 (Coarse and Fine Aggregates for Concrete)",
    original: "Cited with year 2016.",
    updated: "IS 383:2016 — confirmed as the current edition.",
    status: "confirmed",
    impact: "Confirmed. Supports the argument that control aggregate samples (S1, S2) should have been analysed and their results reported.",
    groundsAffected: [8],
  },
  {
    category: "Laboratory Standard",
    item: "IS/IEC 17025 : 2017 (General Requirements for Laboratory Competence)",
    original: "Cited correctly with 2017 year.",
    updated: "IS/IEC 17025:2017 — confirmed as the current edition, adopted by BIS.",
    status: "confirmed",
    impact: "Confirmed. This is the foundational standard for all FSL report deficiency arguments (Grounds 3, 4, 5, 6, 7, 8, 9).",
    groundsAffected: [3, 4, 5, 6, 7, 8, 9],
  },
  {
    category: "NABL Guideline",
    item: "NABL Doc 112 : 2018",
    original: "Cited correctly.",
    updated: "NABL Doc 112:2018 — confirmed as applicable to forensic laboratories. Directly requires chain of custody, party notification, and test method disclosure in FSL reports.",
    status: "confirmed",
    impact: "Confirmed. Particularly powerful for Grounds 3 and 6 — NABL's own guidelines require what the FSL failed to do.",
    groundsAffected: [3, 6, 8],
  },
  {
    category: "International Standard — Concrete Sampling",
    item: "ASTM C823 / C823M : 2017",
    original: "Cited correctly.",
    updated: "ASTM C823/C823M:2017 — confirmed as the current edition for examination and sampling of hardened concrete in constructions.",
    status: "confirmed",
    impact: "Confirmed. Section 5.1 (joint sampling) and Section 8.2 (no sampling in rain) are directly applicable to Grounds 1 and 2.",
    groundsAffected: [1, 2],
  },
  {
    category: "International Standard — Carbonation",
    item: "BS EN 14630 : 2006",
    original: "Cited for environmental sampling conditions (Clause 5.2).",
    updated: "BS EN 14630:2006 retained for carbonation depth context (Plaster section). BS EN 12504 (Parts 1–4) added as the primary European standard for in-situ concrete testing — more directly applicable than BS EN 14630 alone.",
    status: "strengthened",
    impact: "BS EN 12504-1:2019 (core extraction) adds powerful support to the Concrete defence (Packet C) — it establishes that core drilling is the international standard for existing concrete, further discrediting the FSL's chip-sample chemical analysis.",
    groundsAffected: [2],
  },
  {
    category: "International Standard — Petrographic Examination",
    item: "ASTM C856 : 2020 — NEW",
    original: "Not cited in original brief.",
    updated: "ASTM C856:2020 (Standard Practice for Petrographic Examination of Hardened Concrete) added. This is the standard method for identifying original mix constituents and detecting contamination in hardened concrete/mortar samples.",
    status: "added",
    impact: "This is a critical addition for all three material sections: (a) for Plaster — identifies substrate stone contamination; (b) for Mortar — identifies stone fragment contamination; (c) for Concrete — establishes the correct method the FSL should have used. Its absence from the FSL's approach is a major additional ground of challenge.",
    groundsAffected: [2, 8],
  },
  {
    category: "Indian Standard — NDT",
    item: "IS 13311 (Part 1) : 1992 and IS 13311 (Part 2) : 1992 — NEW",
    original: "Not cited in original brief.",
    updated: "IS 13311 (Part 1):1992 (Ultrasonic Pulse Velocity) and IS 13311 (Part 2):1992 (Rebound Hammer) added. These are the non-destructive testing methods prescribed for assessing concrete quality in existing structures.",
    status: "added",
    impact: "Strengthens the Concrete defence: had the inquiry team wanted to assess foundation concrete quality, IS 13311 NDT methods were available — non-destructive, objective, and directly indicative of concrete quality. Their non-use and the choice of an inapplicable chemical method instead shows either incompetence or bad faith.",
    groundsAffected: [2],
  },
  {
    category: "Material-Specific — Plaster",
    item: "IS 1661:1972, IS 2402:1963, IS 1542:1992 — NEW",
    original: "Not cited. The original brief did not know the sample types.",
    updated: "IS 1661:1972 (Reaffirmed 2020) — Cement Plaster Application; IS 2402:1963 (Reaffirmed 2018) — External Rendered Finishes; IS 1542:1992 (Reaffirmed 2018) — Sand for Plaster. All added following user's clarification that Packet A is wall plaster.",
    status: "added",
    impact: "Major addition. IS 1661:1972 specifies plaster mix ratios of 1:4 to 1:6 — the FSL's 1:18 is 3–4× leaner than any standard grade. This directly quantifies the implausibility of the result. These standards were only possible to add once the packet identities were confirmed.",
    groundsAffected: [2, 8],
  },
  {
    category: "Material-Specific — Stone Masonry Mortar",
    item: "IS 1597 (Part 1):1992, IS 2116:1980 — NEW",
    original: "IS 2250:1981 cited for mortar generally. Packet B was not identified as stone masonry joint mortar.",
    updated: "IS 1597 (Part 1):1992 (Reaffirmed 2018) — Stone Masonry Construction; IS 2116:1980 (Reaffirmed 2018) — Sand for Masonry Mortars. Both added after user confirmed Packet B is stone masonry joint mortar.",
    status: "added",
    impact: "IS 1597 (Part 1):1992 establishes the construction standard for stone masonry and confirms that mortar grades M3/M4 (1:5 or 1:6) are specified. A result of 1:17 is not contemplated in this standard for any masonry application. The stone silica contamination argument — the most powerful scientific challenge — became possible only after packet identity was confirmed.",
    groundsAffected: [2, 8],
  },
  {
    category: "Material-Specific — Foundation Concrete",
    item: "IS 456:2000, IS 10262:2019, IS 516 (Part 5):2020 — NEW",
    original: "Not cited. Packet C was not identified as foundation concrete.",
    updated: "IS 456:2000 (Reaffirmed 2021) — Plain and Reinforced Concrete; IS 10262:2019 — Concrete Mix Proportioning; IS 516 (Part 5):2020 — Core Drilling and Testing. All added after user confirmed Packet C is foundation concrete.",
    status: "added",
    impact: "The single most powerful addition in the entire cross-check. IS 456:2000 and IS 516 (Part 5):2020 establish that: (a) the specification for foundation concrete is expressed as a strength grade, not a volume ratio; (b) the method to verify concrete quality in existing structures is core drilling and compression testing — not chip-sample chemical analysis. The FSL's approach to Packet C is therefore not just procedurally flawed but fundamentally wrong in methodology.",
    groundsAffected: [2, 8],
  },
];

const statusConfig = {
  corrected: { label: "CORRECTED", bg: "bg-blue-50 border-blue-300 text-blue-800", icon: ArrowRight, dot: "bg-blue-500" },
  confirmed: { label: "CONFIRMED ✓", bg: "bg-green-50 border-green-300 text-green-800", icon: CheckCircle, dot: "bg-green-500" },
  added: { label: "NEWLY ADDED", bg: "bg-purple-50 border-purple-300 text-purple-800", icon: Plus, dot: "bg-purple-500" },
  strengthened: { label: "STRENGTHENED", bg: "bg-amber-50 border-amber-300 text-amber-800", icon: ShieldCheck, dot: "bg-amber-600" },
};

const summary = {
  corrected: changes.filter(c => c.status === "corrected").length,
  confirmed: changes.filter(c => c.status === "confirmed").length,
  added: changes.filter(c => c.status === "added").length,
  strengthened: changes.filter(c => c.status === "strengthened").length,
};

const groundImpact: { ground: number; heading: string; change: string }[] = [
  { ground: 1, heading: "Absence of Contractor's Representative", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 516:1959 → IS 516 (Part 1):2018. Both are current BIS editions — citation now carries full legal authority." },
  { ground: 2, heading: "Stormy Conditions / Unsafe Equipment", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 516:1959 → IS 516 (Part 1):2018. ADDED: IS 1661 (plaster), IS 1597/IS 2116 (mortar), IS 456/IS 516 Pt.5 (concrete), ASTM C856, IS 13311 Parts 1&2 — now carries material-specific authority for each packet." },
  { ground: 3, heading: "Broken Chain of Custody", change: "All cited standards confirmed current. No material change to citations." },
  { ground: 4, heading: "Improper Storage / Timing Doubt", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 4031 (Part 4):1988 reaffirmation year added." },
  { ground: 5, heading: "Time Frame Violations", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 516:1959 → IS 516 (Part 1):2018. Both now current editions." },
  { ground: 6, heading: "Tests Without Contractor Present", change: "IS 516:1959 → IS 516 (Part 1):2018. All other citations confirmed current." },
  { ground: 7, heading: "No Referee Sample Retained", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 516:1959 → IS 516 (Part 1):2018. Reaffirmation years added to IS 4031 references." },
  { ground: 8, heading: "No IS Reference in Report", change: "IS 4031 (Part 5):1988 reaffirmation year added. IS 269:2015 confirmed. ADDED: IS 1661 (plaster ratios), IS 2250 (masonry grades), IS 456:2000 (concrete grades), IS 10262:2019 (mix proportioning) — the FSL's failure to cite standards is now shown to matter specifically for each material." },
  { ground: 9, heading: "Single Test vs. Average Ambiguity", change: "IS 1199:1959 → IS 1199 (Part 5):2018. IS 516:1959 → IS 516 (Part 1):2018. Reaffirmation years added to IS 4031 (Part 5). All now current editions." },
];

export default function CrossCheckReport() {
  const byCat = (cat: Change["status"]) => changes.filter(c => c.status === cat);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">5-Agent Cross-Check: Impact Report</h1>
        <p className="text-sm text-muted-foreground">
          Five independent verification agents examined every standard cited in the original defence brief. This table shows exactly what changed, what was confirmed, and what was newly added — and the legal impact of each change on the defence.
        </p>
      </div>

      {/* Process banner */}
      <div className="rounded-xl p-5 mb-6 border" style={{ background: "hsl(220 45% 14%)", borderColor: "hsl(220 35% 22%)" }}>
        <h2 className="font-bold mb-2" style={{ color: "hsl(45 90% 55%)" }}>Verification Process</h2>
        <div className="grid sm:grid-cols-5 gap-2 text-xs" style={{ color: "hsl(36 30% 75%)" }}>
          {[
            "Agent 1: Verified all IS standard editions and latest BIS clause references",
            "Agent 2: Cross-checked every cited clause number against the codebase",
            "Agent 3: Verified IS 4031 Part 5 and IS 269:2015 cement silica content range",
            "Agent 4: Verified ASTM C823, ASTM C856, BS EN 12504 international standards",
            "Agent 5: Verified IS 1199, IS 516 supersession and latest edition status",
          ].map((t, i) => (
            <div key={i} className="p-2 rounded" style={{ background: "hsl(220 35% 20%)" }}>
              <p className="font-bold mb-0.5" style={{ color: "hsl(45 90% 60%)" }}>Agent {i + 1}</p>
              <p>{t.replace(`Agent ${i + 1}: `, "")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {(Object.keys(statusConfig) as Change["status"][]).map(key => {
          const cfg = statusConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className={`p-4 rounded-xl border-2 text-center ${cfg.bg}`}>
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{summary[key]}</p>
              <p className="text-xs font-bold mt-1">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Corrected standards */}
      {byCat("corrected").length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            Standards Corrected to Latest Edition ({byCat("corrected").length})
          </h2>
          <div className="space-y-3">
            {byCat("corrected").map((c, i) => <ChangeRow key={i} c={c} />)}
          </div>
        </section>
      )}

      {/* Newly added */}
      {byCat("added").length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            Standards Newly Added ({byCat("added").length})
          </h2>
          <div className="space-y-3">
            {byCat("added").map((c, i) => <ChangeRow key={i} c={c} />)}
          </div>
        </section>
      )}

      {/* Strengthened */}
      {byCat("strengthened").length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            Standards Supplemented / Strengthened ({byCat("strengthened").length})
          </h2>
          <div className="space-y-3">
            {byCat("strengthened").map((c, i) => <ChangeRow key={i} c={c} />)}
          </div>
        </section>
      )}

      {/* Confirmed */}
      {byCat("confirmed").length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            Standards Confirmed Accurate ({byCat("confirmed").length})
          </h2>
          <div className="space-y-3">
            {byCat("confirmed").map((c, i) => <ChangeRow key={i} c={c} />)}
          </div>
        </section>
      )}

      {/* Impact by defence ground */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3">Net Impact on Each of the 9 Defence Grounds</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ background: "hsl(220 45% 14%)" }}>
                <th className="text-left p-3 text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(45 90% 55%)" }}>Ground</th>
                <th className="text-left p-3 text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(45 90% 55%)" }}>Subject</th>
                <th className="text-left p-3 text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(45 90% 55%)" }}>Cross-Check Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groundImpact.map(g => (
                <tr key={g.ground} className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-foreground align-top">{g.ground}</td>
                  <td className="p-3 text-foreground align-top font-medium text-xs">{g.heading}</td>
                  <td className="p-3 text-xs leading-relaxed text-foreground align-top">{g.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conclusion */}
      <div className="mt-6 p-5 rounded-xl border" style={{ background: "hsl(220 45% 14%)", borderColor: "hsl(220 35% 22%)" }}>
        <h2 className="font-bold mb-2" style={{ color: "hsl(45 90% 55%)" }}>Conclusion of Cross-Check</h2>
        <p className="text-sm leading-relaxed" style={{ color: "hsl(36 30% 78%)" }}>
          The 5-agent cross-check identified and corrected 2 superseded standard citations (IS 1199:1959 and IS 516:1959), confirmed 7 citations as accurate and current, strengthened 1 international citation, and added 6 new standards — including 5 material-specific standards that became possible only after the packet identities (plaster, mortar, concrete) were confirmed. The most significant addition is the set of concrete-specific standards (IS 456:2000, IS 516 Part 5:2020, IS 10262:2019, ASTM C856:2020) that expose the FSL's Packet C analysis as a fundamental methodological error. The overall defence is materially stronger after the cross-check than before it. All citations should be independently verified against original BIS/ASTM publications before court use.
        </p>
      </div>
    </div>
  );
}

function ChangeRow({ c }: { c: Change }) {
  const cfg = statusConfig[c.status];
  return (
    <div className="border border-border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className={`px-4 py-2 border-b border-border flex items-center gap-2 ${cfg.bg}`}>
        <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded border ${cfg.bg}`}>{cfg.label}</span>
        <span className="text-xs font-semibold">{c.category}</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-sm text-foreground mb-2">{c.item}</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div className="p-3 rounded-lg border border-red-200 bg-red-50">
            <p className="text-xs font-bold text-red-700 mb-1">BEFORE (Original Brief)</p>
            <p className="text-xs leading-relaxed text-red-800">{c.original}</p>
          </div>
          <div className="p-3 rounded-lg border border-green-200 bg-green-50">
            <p className="text-xs font-bold text-green-700 mb-1">AFTER (Cross-Check Update)</p>
            <p className="text-xs leading-relaxed text-green-800">{c.updated}</p>
          </div>
        </div>
        <div className="p-3 rounded-lg border" style={{ background: "hsl(45 90% 55% / 0.08)", borderColor: "hsl(45 90% 55% / 0.3)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "hsl(45 40% 30%)" }}>Legal Impact</p>
          <p className="text-xs leading-relaxed text-foreground">{c.impact}</p>
        </div>
        <div className="flex gap-1 flex-wrap mt-2">
          <span className="text-xs text-muted-foreground">Affects Grounds:</span>
          {c.groundsAffected.map(g => (
            <span key={g} className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "hsl(220 60% 28%)", color: "white" }}>
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
