import { useState } from "react";
import { Copy, AlertTriangle, ExternalLink } from "lucide-react";

// Source: Cross_Reference_Matrix_Detailed.lex + forensic_defense_report.md
const matrix = [
  {
    violation: "IS 1199:2018 (ताज़ा कंक्रीट) को hardened masonry mortar पर लागू किया — मूलभूत तकनीकी त्रुटि",
    isClause: "IS 2250:1981 (सही मानक — masonry mortars); IS 1905:1987 §3.2; IS 13311 (NDT)",
    intlStandard: "ASTM C1324 (hardened masonry mortar forensic examination — सही अंतर्राष्ट्रीय मानक)",
    judgment: "Sushil Sharma SC 2014 — flawed data → expert opinion vitiated; Prafulla Kumar Samal 1979 — suspicion only → discharge",
    judgmentStatus: "VERIFIED",
    impact: "मूलभूत",
    category: "वैज्ञानिक",
    isNew: true,
    sourceNote: "forensic_defense_report.md §II",
  },
  {
    violation: "वर्षा/तूफान में नमूना संग्रह — moisture contamination, water-cement ratio altered",
    isClause: "IS 4031 Part 6 §5.1: 27±2°C temperature mandatory; IS 1199 §4.1: weather protection",
    intlStandard: "ASTM C780 §6.1: 'samples must be protected from rain and moisture; otherwise sample is invalid'; BS EN 1015-2 §4.3.1",
    judgment: "M/s Builders Association v. State of UP 2018 — rain contamination → test results invalid",
    judgmentStatus: "PENDING",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
    isNew: false,
    sourceNote: "forensic_defense_report.md §II; Standards_Matrix_IS_ASTM_NABL.md",
  },
  {
    violation: "सतह संदूषण — बाहरी 5-10mm कार्बोनेटेड परत परीक्षित, आंतरिक सार नहीं",
    isClause: "IS 13311 Part 2: carbonation depth assessment; ASTM C1324 §7-8: core extraction mandatory",
    intlStandard: "ASTM C780 §5.2: remove weathered surface; BS EN 1015-2 §5.1.2: 'sampling from interior of joint after removal of surface layer'",
    judgment: "Sushil Sharma SC 2014 — flawed data collection → expert opinion vitiated",
    judgmentStatus: "VERIFIED",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
    isNew: false,
    sourceNote: "Comprehensive_Legal_Defence_Report §I-B; forensic_defense_report.md §II",
  },
  {
    violation: "ठेकेदार प्रतिनिधि की अनुपस्थिति — ex-parte sampling",
    isClause: "IS 3535:1986 §4.1: 'Sampling in presence of purchaser/contractor representative mandatory'",
    intlStandard: "CPWD Manual 2023 §3.7.4 & 12.2.1: joint sampling mandatory; joint sealing with both signatures",
    judgment: "R.B. Constructions v. State of Maharashtra 2014 — ex-parte sampling → natural justice violated → report discarded",
    judgmentStatus: "PENDING",
    impact: "अत्यधिक",
    category: "प्रक्रियागत",
    isNew: false,
    sourceNote: "forensic_defense_report.md §II; Full_Case_References.md",
  },
  {
    violation: "श्रृंखला-अभिरक्षा का सम्पूर्ण अभाव — collection to lab, zero documentation",
    isClause: "IS 3535:1986 §6.2: documentation mandatory; CFSL Guidelines: seizure memo + chain of custody",
    intlStandard: "ISO/IEC 17025 + NABL: traceability and documented handling required; ASTM C780 §7.1",
    judgment: "Kattavellai SC 2025 (BINDING): 'Chain of Custody Register shall be maintained... each movement recorded'; Uttarakhand HC 2026: 'forensic evidence loses evidentiary value'",
    judgmentStatus: "VERIFIED",
    impact: "अत्यधिक",
    category: "विधिक",
    isNew: false,
    sourceNote: "Kattavellai_Supreme_Court_DNA_Guidelines_2025.md; VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md",
  },
  {
    violation: "पंचनामे का अभाव — नमूना संग्रह स्थल पर कोई पंचनामा नहीं",
    isClause: "BNSS 2023 §105 / CrPC 1973 §100: panchnama mandatory for seizure",
    intlStandard: "CFSL Guidelines: seizure memo with panchas + accused signatures mandatory",
    judgment: "State of Gujarat v. Mohanbhai 2003 — 'failure to prepare proper Panchnama creates incurable defect in prosecution's case'",
    judgmentStatus: "PENDING",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
    sourceNote: "Full_Case_References.md; Argument_Bank_And_Annexure_Builder.md",
  },
  {
    violation: "तापमान-नियंत्रण का अभाव — IS 4031 की अनिवार्य शर्त",
    isClause: "IS 4031 Part 6 §5.1: 27±2°C and controlled humidity mandatory for compressive strength",
    intlStandard: "ASTM C780 §8.2: controlled curing conditions; BS EN 1015-2: temperature control",
    judgment: "Sushil Sharma SC 2014 — flawed data → expert opinion vitiated",
    judgmentStatus: "VERIFIED",
    impact: "उच्च",
    category: "वैज्ञानिक",
    isNew: false,
    sourceNote: "forensic_defense_report.md §II",
  },
  {
    violation: "असंगत एवं अनियमित नमूनाकरण — IS 3535 §5.1 का उल्लंघन",
    isClause: "IS 3535:1986 §5.1: systematic sampling; §6.2: minimum 5 representative locations",
    intlStandard: "BS EN 1015-2 §4.1: systematic sampling required; ASTM C780: representative sampling",
    judgment: "Union of India v. Prafulla Kumar Samal 1979 — suspicion only → discharge",
    judgmentStatus: "VERIFIED",
    impact: "उच्च",
    category: "वैज्ञानिक",
    isNew: false,
    sourceNote: "forensic_defense_report.md §II; Standards_Matrix_IS_ASTM_NABL.md",
  },
  {
    violation: "CPWD + BIS joint sampling protocol का उल्लंघन — PC Act के आरोप असिद्ध",
    isClause: "CPWD Manual 2023 §3.7.4: joint sampling mandatory; BIS IS 3535 §4.1",
    intlStandard: "CPWD Works Manual: Engineer-in-Charge + Contractor joint sealing",
    judgment: "C.B.I. v. K.S. Kalra 2011 — 'failure to follow CPWD/BIS joint sampling → PC Act charge fails'",
    judgmentStatus: "PENDING",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
    sourceNote: "Full_Case_References.md; forensic_defense_report.md §II",
  },
  {
    violation: "Force Majeure — अत्यधिक वर्षा/तूफान, NBC 2016/2023 के अंतर्गत",
    isClause: "NBC 2016/2023 §3.4: extreme weather = Force Majeure; Appendix C: natural disaster clause",
    intlStandard: "CPWD Manual Appendix C: natural disaster exemption for contractor",
    judgment: "Jacob Mathew v. State of Punjab 2005 — 'mere lack of care ≠ rash/negligent act'; Force Majeure → IPC 304A असिद्ध",
    judgmentStatus: "VERIFIED",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
    sourceNote: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §3-E",
  },
  {
    violation: "भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं — PC Act के आरोप निराधार",
    isClause: "PC Act 1988 (amended 2018) §7, 11, 12, 13: demand + acceptance of bribe mandatory",
    intlStandard: "BNSS 2023 §250: prima facie case absent",
    judgment: "Sajjan Kumar v. CBI (2010) 9 SCC 368 — evidence absence → discharge",
    judgmentStatus: "SECONDARY",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
    sourceNote: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §3",
  },
];

const impactColor: Record<string, string> = {
  "मूलभूत": "text-rose-800 bg-rose-100 font-bold",
  "अत्यधिक": "text-red-700 bg-red-50",
  "उच्च": "text-amber-700 bg-amber-50",
};
const catColor: Record<string, string> = {
  "वैज्ञानिक": "text-purple-700 bg-purple-50",
  "प्रक्रियागत": "text-blue-700 bg-blue-50",
  "विधिक": "text-green-700 bg-green-50",
};
const statusDot: Record<string, string> = {
  VERIFIED: "bg-green-500",
  SECONDARY: "bg-blue-400",
  PENDING: "bg-red-500",
};

export default function CrossReferenceMatrix() {
  const [copied, setCopied] = useState(false);

  const csvText = [
    "उल्लंघन,IS धारा,अंतर्राष्ट्रीय मानक,न्यायिक निर्णय,निर्णय स्थिति,प्रभाव,श्रेणी",
    ...matrix.map((r) =>
      `"${r.violation}","${r.isClause}","${r.intlStandard}","${r.judgment}","${r.judgmentStatus}","${r.impact}","${r.category}"`
    ),
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(csvText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">क्रॉस-रेफरेंस मैट्रिक्स</h1>
          <p className="text-sm text-muted-foreground">
            Source: Cross_Reference_Matrix_Detailed.lex + forensic_defense_report.md
          </p>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 w-fit">
          <Copy className="w-4 h-4" />
          {copied ? "कॉपी हो गया!" : "CSV कॉपी करें"}
        </button>
      </div>

      {/* Foundational error */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-rose-800 text-sm">⚠ मूलभूत तकनीकी त्रुटि — Foundational Scientific Error</p>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              <strong>IS 1199:2018</strong> "Methods of Sampling and Testing of <u>Fresh Concrete</u>" — ताज़ा कंक्रीट पर लागू।
              प्रस्तुत प्रकरण में नमूने <strong>पुरानी पत्थर की चिनाई में जमे हुए कठोर सीमेंट मोर्टार</strong> से लिए गए।
              सही मानक: <strong>IS 2250:1981</strong> (Masonry Mortars) + <strong>ASTM C1324</strong> (Hardened Masonry Mortar Forensic Examination)।
            </p>
          </div>
        </div>
      </div>

      {/* Verification legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[["VERIFIED", "bg-green-500", "Court-safe — cite with para numbers"],
          ["SECONDARY", "bg-blue-400", "Credible — fetch full judgment before filing"],
          ["PENDING", "bg-red-500", "⚠ Obtain certified copy — do NOT file without verification"]
        ].map(([label, dot, note]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground">— {note}</span>
          </div>
        ))}
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-3 py-3 font-semibold w-5">#</th>
              <th className="text-left px-3 py-3 font-semibold">उल्लंघन</th>
              <th className="text-left px-3 py-3 font-semibold">IS मानक</th>
              <th className="text-left px-3 py-3 font-semibold hidden md:table-cell">अंतर्राष्ट्रीय मानक</th>
              <th className="text-left px-3 py-3 font-semibold hidden lg:table-cell">न्यायिक निर्णय</th>
              <th className="text-left px-3 py-3 font-semibold">प्रभाव</th>
              <th className="text-left px-3 py-3 font-semibold hidden sm:table-cell">श्रेणी</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className={`border-b border-border last:border-0 ${
                row.isNew ? "bg-rose-50 border-l-4 border-l-rose-500" : i % 2 === 0 ? "bg-card" : "bg-muted/20"
              }`}>
                <td className="px-3 py-3 text-muted-foreground font-medium">
                  {row.isNew ? <span className="text-rose-700 font-bold">0</span> : i}
                </td>
                <td className="px-3 py-3 text-foreground font-medium leading-snug">
                  {row.isNew && <span className="inline-block mb-1 text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold">मूलभूत त्रुटि</span>}
                  <div>{row.violation}</div>
                  <div className="text-muted-foreground text-xs mt-0.5 opacity-70">{row.sourceNote}</div>
                </td>
                <td className="px-3 py-3 text-foreground leading-snug">{row.isClause}</td>
                <td className="px-3 py-3 text-foreground leading-snug hidden md:table-cell">{row.intlStandard}</td>
                <td className="px-3 py-3 leading-snug hidden lg:table-cell">
                  <div className="flex items-start gap-1.5">
                    <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${statusDot[row.judgmentStatus]}`} />
                    <span className="text-foreground">{row.judgment}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${impactColor[row.impact] ?? ""}`}>
                    {row.impact}
                  </span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColor[row.category] ?? ""}`}>
                    {row.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "कुल उल्लंघन", value: matrix.length, color: "text-foreground" },
          { label: "मूलभूत / अत्यधिक", value: matrix.filter(r => r.impact === "अत्यधिक" || r.impact === "मूलभूत").length, color: "text-red-600" },
          { label: "VERIFIED निर्णय", value: matrix.filter(r => r.judgmentStatus === "VERIFIED").length, color: "text-green-600" },
          { label: "⚠ PENDING निर्णय", value: matrix.filter(r => r.judgmentStatus === "PENDING").length, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Standard distinction table */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-800 mb-2">मानक-भेद सारणी — Source: Standards_Matrix_IS_ASTM_NABL.md</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="text-left px-3 py-2 border border-amber-200">मानक</th>
                <th className="text-left px-3 py-2 border border-amber-200">यह किस पर लागू होता है</th>
                <th className="text-left px-3 py-2 border border-amber-200">यहाँ लागू?</th>
                <th className="text-left px-3 py-2 border border-amber-200">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["IS 1199:2018", "ताज़ा कंक्रीट (Fresh Concrete) — Sampling & Testing", "❌ नहीं — गलत मानक", "SECONDARY", "bg-red-50 text-red-700"],
                ["IS 2250:1981", "चिनाई मोर्टार — Masonry Mortars (तैयारी एवं उपयोग)", "✅ हाँ — सही मानक", "SECONDARY", "bg-green-50 text-green-700"],
                ["IS 3535:1986", "हाइड्रोलिक सीमेंट नमूनाकरण — Sampling discipline", "✅ हाँ — सही मानक", "SECONDARY", "bg-green-50 text-green-700"],
                ["ASTM C1324", "कठोर चिनाई मोर्टार का फोरेंसिक परीक्षण", "✅ हाँ — सही अंतर्राष्ट्रीय मानक", "SECONDARY", "bg-green-50 text-green-700"],
                ["IS 13311 (1-2)", "NDT — मौजूदा संरचना का गैर-विनाशकारी परीक्षण", "✅ हाँ — सही NDT मानक", "SECONDARY", "bg-green-50 text-green-700"],
                ["IS 4031 (1-15)", "कच्चे हाइड्रोलिक सीमेंट का भौतिक परीक्षण", "⚠ आंशिक — सीमेंट पर, hardened mortar पर नहीं", "SECONDARY", "bg-amber-50 text-amber-700"],
              ].map(([code, scope, applies, conf, rowColor]) => (
                <tr key={code} className={rowColor}>
                  <td className="px-3 py-2 border border-amber-200 font-bold">{code}</td>
                  <td className="px-3 py-2 border border-amber-200">{scope}</td>
                  <td className="px-3 py-2 border border-amber-200 font-bold">{applies}</td>
                  <td className="px-3 py-2 border border-amber-200">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${statusDot[conf] ? "" : ""}`}>{conf}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-700 mt-2">
          ⚠ Do not claim exact clause numbers in pleadings unless you have the official text + page-paragraph proof in annexure.
          Source: Standards_Matrix_IS_ASTM_NABL.md — "Use standards first as reliability principles, then narrow to exact clauses after verification."
        </p>
      </div>

      {/* Annexure demand list */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          अनुलग्नक माँग सूची — Source: Argument_Bank_And_Annexure_Builder.md
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "FIR 496/2011 + सम्पूर्ण आरोप-पत्र",
            "नमूना संग्रह स्थल का निरीक्षण ज्ञापन + पंचनामा",
            "सील ज्ञापन और नमूना लेबल के फोटोग्राफ",
            "प्रेषण रजिस्टर + मालखाना रजिस्टर + हस्तांतरण पावती",
            "FSL आवक रजिस्टर और सील सत्यापन पत्र",
            "कच्ची प्रयोगशाला कार्यपत्रक, मशीन लॉग, विश्लेषक नोट्स",
            "IMD/स्थानीय मौसम रिपोर्ट दिनांक 28-12-2011",
            "ठेकेदार को नमूना संग्रह हेतु जारी कोई नोटिस",
            "IS 2250:1981, IS 3535:1986, ASTM C1324 के प्रमाणित अंश",
            "कट्टावेल्लई निर्णय (2025 INSC 845) की प्रमाणित प्रति",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-primary font-bold flex-shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
