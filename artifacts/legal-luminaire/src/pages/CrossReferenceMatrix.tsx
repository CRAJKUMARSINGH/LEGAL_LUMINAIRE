import { useState } from "react";
import { Copy } from "lucide-react";

const matrix = [
  {
    violation: "वर्षा/तूफान में नमूना संग्रह",
    isClause: "IS 1199:2018, धारा 4.1 — मौसम-सुरक्षा अनिवार्य",
    intlStandard: "ASTM C780, धारा 6.1; BS EN 1015-2, धारा 4.3.1",
    judgment: "कट्टावेल्लई (SC 2025) — प्रक्रियागत त्रुटि → अग्राह्य",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
  },
  {
    violation: "सतह संदूषण — बाहरी 5-10mm परत परीक्षित",
    isClause: "IS 1199:2018, धारा 4.4 — आंतरिक सार से नमूना अनिवार्य",
    intlStandard: "ASTM C780, धारा 5.2; BS EN 1015-2, धारा 5.1.2",
    judgment: "Mohanbhai v. State of Gujarat — दूषित आधार → निरर्थक रिपोर्ट",
    impact: "अत्यधिक",
    category: "वैज्ञानिक",
  },
  {
    violation: "ठेकेदार प्रतिनिधि की अनुपस्थिति",
    isClause: "IS 3535:1986, धारा 4.1 — आपूर्तिकर्ता प्रतिनिधि अनिवार्य",
    intlStandard: "CPWD मैनुअल 2023, खण्ड 3.7.4",
    judgment: "मद्रास HC 2025 — फोरेंसिक परीक्षण में भागीदारी का अधिकार",
    impact: "अत्यधिक",
    category: "प्रक्रियागत",
  },
  {
    violation: "श्रृंखला-अभिरक्षा का सम्पूर्ण अभाव",
    isClause: "IS 3535:1986, धारा 6.2 — प्रलेखन अनिवार्य; IS 4031 — भण्डारण दशा",
    intlStandard: "ASTM C780, धारा 7.1 — Chain of Custody mandatory",
    judgment: "कट्टावेल्लई (SC 2025) — CoC अभाव → साक्ष्य अनुपयोगी; उत्तराखण्ड HC 2026",
    impact: "अत्यधिक",
    category: "विधिक",
  },
  {
    violation: "पंचनामे का अभाव",
    isClause: "BNSS 2023, धारा 105 / CrPC 1973, धारा 100",
    intlStandard: "CFSL दिशानिर्देश — नमूना-संग्रह पंचनामा अनिवार्य",
    judgment: "SC 2026 पंचनामा निर्णय — पंचनामाविहीन संग्रह = अग्राह्य",
    impact: "उच्च",
    category: "विधिक",
  },
  {
    violation: "तापमान-नियंत्रण का अभाव",
    isClause: "IS 4031, भाग 6 — 27±2°C एवं नियंत्रित आर्द्रता अनिवार्य",
    intlStandard: "ASTM C780, धारा 8.2 — Controlled curing conditions",
    judgment: "कट्टावेल्लई — संदूषण की संभावना = साक्ष्य अविश्वसनीय",
    impact: "उच्च",
    category: "वैज्ञानिक",
  },
  {
    violation: "असंगत एवं अनियमित नमूनाकरण",
    isClause: "IS 3535:1986, धारा 5.1 — 5 प्रतिनिधि स्थलों से नमूना अनिवार्य",
    intlStandard: "BS EN 1015-2, धारा 4.1 — Systematic sampling required",
    judgment: "Union of India v. Prafulla Kumar Samal — संदेह मात्र → उन्मोचन",
    impact: "उच्च",
    category: "वैज्ञानिक",
  },
  {
    violation: "कार्बोनेशन का उल्लेख नहीं",
    isClause: "IS 1199:2018, धारा 4.4 — Carbonation depth assessment अनिवार्य",
    intlStandard: "BS EN 14630:2006 — Carbonation depth measurement",
    judgment: "Builders Association v. State — सतही परीक्षण = निर्माण गुणवत्ता का प्रमाण नहीं",
    impact: "उच्च",
    category: "वैज्ञानिक",
  },
  {
    violation: "Force Majeure — अत्यधिक वर्षा",
    isClause: "NBC 2016/2023, खण्ड 3.4 — Extreme weather = Force Majeure",
    intlStandard: "CPWD मैनुअल, परिशिष्ट C — Natural disaster clause",
    judgment: "Jacob Mathew (SC 2005) — Force Majeure में घोर उपेक्षा असम्भव",
    impact: "उच्च",
    category: "विधिक",
  },
  {
    violation: "भ्रष्टाचार का कोई ठोस साक्ष्य नहीं",
    isClause: "भ्रष्टाचार निवारण अधिनियम 1988 (संशोधित 2018) — प्रत्यक्ष साक्ष्य अनिवार्य",
    intlStandard: "BNSS 2023, धारा 250 — Prima facie case absent",
    judgment: "Sajjan Kumar v. CBI (SC 2010) — साक्ष्याभाव → उन्मोचन",
    impact: "उच्च",
    category: "विधिक",
  },
];

const impactColor: Record<string, string> = {
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
    "उल्लंघन,IS धारा,अंतर्राष्ट्रीय मानक,न्यायिक निर्णय,प्रभाव,श्रेणी",
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
          <p className="text-sm text-muted-foreground">Cross-Reference Matrix — तथ्य → IS धारा → निर्णय</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity w-fit"
        >
          <Copy className="w-4 h-4" />
          {copied ? "कॉपी हो गया!" : "CSV कॉपी करें"}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold">मैट्रिक्स का उपयोग</p>
        <p className="text-xs mt-1">प्रत्येक पंक्ति एक उल्लंघन को IS धारा, अंतर्राष्ट्रीय मानक एवं न्यायिक निर्णय से जोड़ती है। इसे प्रार्थना-पत्र के साथ अनुलग्नक के रूप में संलग्न करें।</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-6">#</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">उल्लंघन / Violation</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">IS धारा</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">अंतर्राष्ट्रीय मानक</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">न्यायिक निर्णय</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">प्रभाव</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">श्रेणी</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                <td className="px-4 py-3 text-muted-foreground font-medium">{i + 1}</td>
                <td className="px-4 py-3 text-foreground font-medium leading-snug">{row.violation}</td>
                <td className="px-4 py-3 text-foreground leading-snug">{row.isClause}</td>
                <td className="px-4 py-3 text-foreground leading-snug hidden md:table-cell">{row.intlStandard}</td>
                <td className="px-4 py-3 text-foreground leading-snug hidden lg:table-cell">{row.judgment}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${impactColor[row.impact] ?? ""}`}>
                    {row.impact}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${catColor[row.category] ?? ""}`}>
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
          { label: "अत्यधिक प्रभाव", value: matrix.filter((r) => r.impact === "अत्यधिक").length, color: "text-red-600" },
          { label: "वैज्ञानिक", value: matrix.filter((r) => r.category === "वैज्ञानिक").length, color: "text-purple-600" },
          { label: "विधिक", value: matrix.filter((r) => r.category === "विधिक").length, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
