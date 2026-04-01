import { useState } from "react";
import { Copy, AlertTriangle } from "lucide-react";

const matrix = [
  {
    violation: "मूलतः गलत मानक का प्रयोग — IS 1199 = ताज़ा कंक्रीट, यहाँ चूना-सीमेंट मोर्टार इन स्टोन मेसनरी",
    isClause: "IS 2250:1981 — Code of Practice for Masonry Mortars (सही मानक); IS 1905:1987, धारा 3.2 — Masonry Structure Standard",
    intlStandard: "ASTM C1324 — Examination of Hardened Masonry Mortar (सही अंतर्राष्ट्रीय मानक); ASTM C1196/C1197 — In-situ Flatjack Testing",
    judgment: "Kattavellai SC 2025 — गलत मानक = वैज्ञानिक आधारहीनता; Prafulla Kumar Samal 1979 — संदेह मात्र → उन्मोचन",
    impact: "मूलभूत",
    category: "वैज्ञानिक",
    isNew: true,
  },
  {
    violation: "वर्षा/तूफान में नमूना संग्रह",
    isClause: "IS 2250:1981, धारा 5.2 — मौसम-सुरक्षा अनिवार्य; IS 3535:1986, धारा 4.1 — नमूनाकरण नियम",
    intlStandard: "ASTM C780, धारा 6.1 — Weather protection mandatory; BS EN 1015-2, धारा 4.3.1",
    judgment: "कट्टावेल्लई (SC 2025) — प्रक्रियागत त्रुटि → अग्राह्य",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
    isNew: false,
  },
  {
    violation: "सतह संदूषण — बाहरी 5-10mm परत परीक्षित",
    isClause: "IS 2250:1981, धारा 4.3 — आंतरिक जोड़ से नमूना; ASTM C1324, धारा 7.1 — Core sampling required",
    intlStandard: "ASTM C780, धारा 5.2; BS EN 1015-2, धारा 5.1.2 — Core material only",
    judgment: "Mohanbhai v. State of Gujarat — दूषित आधार → निरर्थक रिपोर्ट",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
    isNew: false,
  },
  {
    violation: "ठेकेदार प्रतिनिधि की अनुपस्थिति",
    isClause: "IS 3535:1986, धारा 4.1 — आपूर्तिकर्ता प्रतिनिधि अनिवार्य",
    intlStandard: "CPWD मैनुअल 2023, खण्ड 3.7.4",
    judgment: "मद्रास HC 2025 — फोरेंसिक परीक्षण में भागीदारी का अधिकार",
    impact: "अत्यधिक",
    category: "प्रक्रियागत",
    isNew: false,
  },
  {
    violation: "श्रृंखला-अभिरक्षा का सम्पूर्ण अभाव",
    isClause: "IS 3535:1986, धारा 6.2 — प्रलेखन अनिवार्य; ASTM C1324, धारा 6.3 — Chain of Custody mandatory",
    intlStandard: "ASTM C780, धारा 7.1 — Chain of Custody mandatory",
    judgment: "कट्टावेल्लई (SC 2025) — CoC अभाव → साक्ष्य अनुपयोगी; उत्तराखण्ड HC 2026",
    impact: "अत्यधिक",
    category: "विधिक",
    isNew: false,
  },
  {
    violation: "पंचनामे का अभाव",
    isClause: "BNSS 2023, धारा 105 / CrPC 1973, धारा 100",
    intlStandard: "CFSL दिशानिर्देश — नमूना-संग्रह पंचनामा अनिवार्य",
    judgment: "SC 2026 पंचनामा निर्णय — पंचनामाविहीन संग्रह = अग्राह्य",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
  },
  {
    violation: "तापमान-नियंत्रण का अभाव",
    isClause: "IS 4031, भाग 6 — 27±2°C एवं नियंत्रित आर्द्रता अनिवार्य (सीमेंट कच्चे माल हेतु)",
    intlStandard: "ASTM C780, धारा 8.2 — Controlled curing conditions",
    judgment: "कट्टावेल्लई — संदूषण की संभावना = साक्ष्य अविश्वसनीय",
    impact: "उच्च",
    category: "वैज्ञानिक",
    isNew: false,
  },
  {
    violation: "असंगत एवं अनियमित नमूनाकरण",
    isClause: "IS 3535:1986, धारा 5.1 — 5 प्रतिनिधि स्थलों से नमूना अनिवार्य",
    intlStandard: "BS EN 1015-2, धारा 4.1 — Systematic sampling required",
    judgment: "Union of India v. Prafulla Kumar Samal — संदेह मात्र → उन्मोचन",
    impact: "उच्च",
    category: "वैज्ञानिक",
    isNew: false,
  },
  {
    violation: "कार्बोनेशन का उल्लेख नहीं",
    isClause: "IS 2250:1981, धारा 4.3 — Carbonation depth assessment; ASTM C1324, धारा 8.2 — Phenolphthalein test mandatory",
    intlStandard: "BS EN 14630:2006 — Carbonation depth measurement",
    judgment: "Builders Association v. State — सतही परीक्षण = निर्माण गुणवत्ता का प्रमाण नहीं",
    impact: "उच्च",
    category: "वैज्ञानिक",
    isNew: false,
  },
  {
    violation: "Force Majeure — अत्यधिक वर्षा",
    isClause: "NBC 2016/2023, खण्ड 3.4 — Extreme weather = Force Majeure",
    intlStandard: "CPWD मैनुअल, परिशिष्ट C — Natural disaster clause",
    judgment: "Jacob Mathew (SC 2005) — Force Majeure में घोर उपेक्षा असम्भव",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
  },
  {
    violation: "भ्रष्टाचार का कोई ठोस साक्ष्य नहीं",
    isClause: "भ्रष्टाचार निवारण अधिनियम 1988 (संशोधित 2018) — प्रत्यक्ष साक्ष्य अनिवार्य",
    intlStandard: "BNSS 2023, धारा 250 — Prima facie case absent",
    judgment: "Sajjan Kumar v. CBI (SC 2010) — साक्ष्याभाव → उन्मोचन",
    impact: "उच्च",
    category: "विधिक",
    isNew: false,
  },
];

const impactColor: Record<string, string> = {
  "मूलभूत": "text-rose-800 bg-rose-100 font-bold",
  "अत्यधिक": "text-red-700 bg-red-50",
  "उच्च": "text-amber-700 bg-amber-50",
  "माध्यम": "text-blue-700 bg-blue-50",
};
const catColor: Record<string, string> = {
  "वैज्ञानिक": "text-purple-700 bg-purple-50",
  "प्रक्रियागत": "text-blue-700 bg-blue-50",
  "विधिक": "text-green-700 bg-green-50",
};

export default function CrossReferenceMatrix() {
  const [copied, setCopied] = useState(false);

  const csvText = [
    "उल्लंघन,IS धारा (सही मानक),अंतर्राष्ट्रीय मानक,न्यायिक निर्णय,प्रभाव,श्रेणी",
    ...matrix.map((r) =>
      `"${r.violation}","${r.isClause}","${r.intlStandard}","${r.judgment}","${r.impact}","${r.category}"`
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
          <p className="text-sm text-muted-foreground">Cross-Reference Matrix — तथ्य → सही IS मानक → निर्णय</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity w-fit"
        >
          <Copy className="w-4 h-4" />
          {copied ? "कॉपी हो गया!" : "CSV कॉपी करें"}
        </button>
      </div>

      <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-rose-800 text-sm">⚠ मूलभूत तकनीकी त्रुटि — Foundational Scientific Error</p>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              <strong>IS 1199:2018</strong> "Methods of Sampling and Testing of <u>Fresh Concrete</u>" का मानक है — यह <u>ताज़ा कंक्रीट</u> पर लागू होता है।
              प्रस्तुत प्रकरण में नमूने <strong>पुरानी पत्थर की चिनाई में जमे हुए कठोर सीमेंट मोर्टार</strong> (Hardened Cement Mortar in Existing Stone Masonry) से लिए गए हैं।
              इस पर सही भारतीय मानक है — <strong>IS 2250:1981</strong> (Code of Practice for Masonry Mortars) एवं अंतर्राष्ट्रीय मानक <strong>ASTM C1324</strong> (Examination of Hardened Masonry Mortar)।
              गलत मानक के प्रयोग से सम्पूर्ण फोरेंसिक रिपोर्ट का वैज्ञानिक आधार ही शून्य है।
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold">मैट्रिक्स का उपयोग</p>
        <p className="text-xs mt-1">प्रत्येक पंक्ति एक उल्लंघन को सही IS मानक, अंतर्राष्ट्रीय मानक एवं न्यायिक निर्णय से जोड़ती है। लाल पृष्ठभूमि वाली पंक्ति = मूलभूत त्रुटि। इसे प्रार्थना-पत्र के साथ अनुलग्नक के रूप में संलग्न करें।</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-6">#</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">उल्लंघन / Violation</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">सही IS मानक</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">अंतर्राष्ट्रीय मानक</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">न्यायिक निर्णय</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">प्रभाव</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">श्रेणी</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-border last:border-0 ${
                  row.isNew
                    ? "bg-rose-50 border-l-4 border-l-rose-500"
                    : i % 2 === 0
                    ? "bg-card"
                    : "bg-muted/20"
                }`}
              >
                <td className="px-4 py-3 text-muted-foreground font-medium">
                  {row.isNew ? <span className="text-rose-700 font-bold">0</span> : i}
                </td>
                <td className="px-4 py-3 text-foreground font-medium leading-snug">
                  {row.isNew && <span className="inline-block mb-1 text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold">मूलभूत त्रुटि</span>}
                  <div>{row.violation}</div>
                </td>
                <td className="px-4 py-3 text-foreground leading-snug">{row.isClause}</td>
                <td className="px-4 py-3 text-foreground leading-snug hidden md:table-cell">{row.intlStandard}</td>
                <td className="px-4 py-3 text-foreground leading-snug hidden lg:table-cell">{row.judgment}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${impactColor[row.impact] ?? ""}`}>
                    {row.impact}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColor[row.category] ?? ""}`}>
                    {row.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "कुल उल्लंघन", value: matrix.length, color: "text-foreground" },
          { label: "मूलभूत / अत्यधिक", value: matrix.filter((r) => r.impact === "अत्यधिक" || r.impact === "मूलभूत").length, color: "text-red-600" },
          { label: "वैज्ञानिक", value: matrix.filter((r) => r.category === "वैज्ञानिक").length, color: "text-purple-600" },
          { label: "विधिक", value: matrix.filter((r) => r.category === "विधिक").length, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-800 mb-2">मानक-भेद सारणी (Standard Distinction Table)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="text-left px-3 py-2 border border-amber-200">मानक</th>
                <th className="text-left px-3 py-2 border border-amber-200">यह किस पर लागू होता है</th>
                <th className="text-left px-3 py-2 border border-amber-200">यहाँ लागू?</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-red-700">IS 1199:2018</td>
                <td className="px-3 py-2 border border-amber-200">ताज़ा कंक्रीट (Fresh Concrete) — Sampling & Testing</td>
                <td className="px-3 py-2 border border-amber-200 text-red-700 font-bold">❌ नहीं — गलत मानक</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-green-700">IS 2250:1981</td>
                <td className="px-3 py-2 border border-amber-200">चिनाई मोर्टार — Masonry Mortars (तैयारी एवं उपयोग)</td>
                <td className="px-3 py-2 border border-amber-200 text-green-700 font-bold">✅ हाँ — सही मानक</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-green-700">IS 1905:1987</td>
                <td className="px-3 py-2 border border-amber-200">Unreinforced Masonry Structure (पत्थर की चिनाई)</td>
                <td className="px-3 py-2 border border-amber-200 text-green-700 font-bold">✅ हाँ — सही मानक</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-green-700">ASTM C1324</td>
                <td className="px-3 py-2 border border-amber-200">कठोर चिनाई मोर्टार का फोरेंसिक परीक्षण — Hardened Masonry Mortar</td>
                <td className="px-3 py-2 border border-amber-200 text-green-700 font-bold">✅ हाँ — सही अंतर्राष्ट्रीय मानक</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-amber-700">IS 13311 (भाग 1-2)</td>
                <td className="px-3 py-2 border border-amber-200">NDT — मौजूदा संरचना का गैर-विनाशकारी परीक्षण</td>
                <td className="px-3 py-2 border border-amber-200 text-amber-700 font-bold">✅ हाँ — सही NDT मानक</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-3 py-2 border border-amber-200 font-bold text-red-700">IS 4031 (भाग 1-15)</td>
                <td className="px-3 py-2 border border-amber-200">कच्चे हाइड्रोलिक सीमेंट का भौतिक परीक्षण (Raw Cement)</td>
                <td className="px-3 py-2 border border-amber-200 text-orange-700 font-bold">⚠ आंशिक — सीमेंट पर, मोर्टार पर नहीं</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
