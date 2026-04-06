import { useState } from "react";
import { CheckSquare, Square, Printer, AlertTriangle } from "lucide-react";
import { ANNEXURE_DEMAND_LIST } from "@/lib/case01-data";

// Source: Argument_Bank_And_Annexure_Builder.md + VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §6
const sections_list = [
  {
    title: "प्रार्थना-पत्र दस्तावेज़ीकरण",
    subtitle: "Application Documents",
    items: [
      "प्रार्थना-पत्र की 3 प्रतियाँ — एक न्यायालय, एक SPP, एक स्वयं",
      "शपथ-पत्र (Affidavit) — नोटरी/जे.एम. द्वारा सत्यापित",
      "मुख्य अधिवक्ता द्वारा हस्ताक्षर + बार काउन्सिल पंजीकरण संख्या",
      "वाद-कारण में सभी पक्षकारों के नाम सही अंकित",
      "धारा 250 BNSS 2023 (वैकल्पिक: धारा 227 CrPC) स्पष्ट उल्लेखित",
      "न्यायालय शुल्क (Court Fee Stamp) संलग्न",
    ],
  },
  {
    title: "⚠ PENDING निर्णय — फाइल करने से पहले अनिवार्य",
    subtitle: "Must verify before filing — Source: Case_Law_Matrix_Verified_Pending.md",
    warning: true,
    items: [
      "R.B. Constructions v. State of Maharashtra (2014 SCC OnLine Bom 125) — certified copy obtain करें",
      "C.B.I. v. K.S. Kalra (2011 SCC OnLine Del 3412) — citation authenticity check करें",
      "M/s Builders Association v. State of UP (2018 SCC OnLine All 442) — certified copy obtain करें",
      "State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 — certified copy obtain करें",
      "Uttarakhand HC 2026 — full judgment text + citation + para extract fetch करें",
    ],
  },
  {
    title: "VERIFIED निर्णय — अनुलग्नक",
    subtitle: "Court-safe precedents — Source: VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md",
    items: [
      "अनुलग्नक A: कट्टावेल्लई @ देवकर (2025 INSC 845) — certified copy + exact para numbers",
      "अनुलग्नक B: Sushil Sharma v. State NCT Delhi (2014) 4 SCC 317 — verify exact para language",
      "अनुलग्नक C: Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4",
      "अनुलग्नक D: State of Bihar v. Ramesh Singh (1977) 4 SCC 39",
      "अनुलग्नक E: Jacob Mathew v. State of Punjab (2005) 6 SCC 1",
    ],
  },
  {
    title: "मानक अनुलग्नक — Source: Standards_Matrix_IS_ASTM_NABL.md",
    subtitle: "Standards Annexures — obtain official/certified copies",
    items: [
      "अनुलग्नक F: IS 2250:1981 (Masonry Mortars) — प्रासंगिक धाराओं की प्रमाणित प्रति",
      "अनुलग्नक G: IS 3535:1986 §4.1, 5.1, 6.2 — प्रमाणित प्रति",
      "अनुलग्नक H: IS 4031 Part 6 §5.1 — प्रमाणित प्रति",
      "अनुलग्नक I: ASTM C1324 (Hardened Masonry Mortar) — relevant sections",
      "अनुलग्नक J: ASTM C780 §5.2, 6.1 — weather protection clauses",
      "अनुलग्नक K: BS EN 1015-2 §4.3.1, 5.1.2 — carbonation layer removal",
      "अनुलग्नक L: NBC 2016/2023 §3.4 — Force Majeure clause",
      "अनुलग्नक M: CPWD Manual 2023 §3.7.4 — joint sampling requirement",
    ],
  },
  {
    title: "साक्ष्य माँग सूची — Source: Argument_Bank_And_Annexure_Builder.md",
    subtitle: "Evidence to demand from prosecution/IO/FSL",
    items: ANNEXURE_DEMAND_LIST,
  },
  {
    title: "तथ्यात्मक सत्यापन",
    subtitle: "Fact Verification — Source: Case_Facts_Timeline.md",
    items: [
      "FIR दिनांक 28-12-2011 सही है",
      "विशेष सत्र वाद संख्या 1/2025 सही है",
      "अभियुक्त: हेमराज वर्दार, निदेशक, मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड",
      "न्यायालय: Special Session Judge (PC Act), Udaipur, Rajasthan",
      "घटना: महाराणा प्रताप स्टेडियम, उदयपुर — बाहरी दीवार का आंशिक ध्वंस",
      "IMD/स्थानीय मौसम रिकॉर्ड 28-12-2011 — भारी वर्षा/तूफान की पुष्टि",
    ],
  },
  {
    title: "विधिक तैयारी — Source: Argument_Bank_And_Annexure_Builder.md",
    subtitle: "Legal Preparation",
    items: [
      "5 मौखिक तर्क कण्ठस्थ (Argument_Bank_And_Annexure_Builder.md से)",
      "कट्टावेल्लई निर्णय के प्रमुख उद्धरण याद किए हों",
      "IS 2250, IS 3535, ASTM C1324 के प्रमुख बिंदु तैयार",
      "Sushil Sharma (2014) 4 SCC 317 — Section 45 argument",
      "Prafulla Kumar Samal (1979) + Ramesh Singh (1977) — discharge standard",
      "NBC 2016/2023 Force Majeure + Jacob Mathew (2005) — negligence standard",
      "Cross-examination prompts for IO/FSL तैयार (Argument_Bank §B से)",
    ],
  },
  {
    title: "दाखिलाकरण प्रक्रिया",
    subtitle: "Filing Procedure at Court",
    items: [
      "न्यायालय की लिपिक को प्रार्थना-पत्र की 3 प्रतियाँ सौंपें",
      "SPP (Special Public Prosecutor) को एक प्रति अनिवार्यतः दें",
      "दाखिल रसीद + दिनांक-मुद्रित प्रति अपने पास रखें",
      "अगली सुनवाई की दिनांक नोट करें",
      "यदि मौखिक तर्क उसी दिन हों तो सभी अनुलग्नक उपलब्ध रखें",
      "Legal Luminaire ऐप मोबाइल में खोलकर रखें — त्वरित सन्दर्भ हेतु",
    ],
  },
];

export default function FilingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggleItem = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const totalItems = sections_list.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  // Count pending items
  const pendingSection = sections_list.find(s => s.warning);
  const pendingChecked = pendingSection?.items.filter((_, i) => checked[`${pendingSection.title}-${i}`]).length ?? 0;
  const pendingTotal = pendingSection?.items.length ?? 0;
  const pendingAllDone = pendingChecked === pendingTotal;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">फाइलिंग चेकलिस्ट</h1>
          <p className="text-sm text-muted-foreground">
            Source: Argument_Bank_And_Annexure_Builder.md + VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §6
          </p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 w-fit no-print">
          <Printer className="w-4 h-4" /> प्रिंट करें
        </button>
      </div>

      {/* PENDING warning */}
      {!pendingAllDone && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-800 text-sm">⚠ PENDING निर्णय — फाइल करने से पहले अनिवार्य</p>
            <p className="text-xs text-red-700 mt-1">
              {pendingTotal - pendingChecked} PENDING precedents अभी verified नहीं हैं।
              इन्हें primary authority के रूप में use करना FATAL ERROR है।
              Source: Case_Law_Matrix_Verified_Pending.md
            </p>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">प्रगति / Progress</span>
          <span className="text-sm font-bold text-primary">{checkedCount}/{totalItems} ({progress}%)</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && (
          <p className="text-xs text-green-700 font-semibold mt-2 text-center">
            ✅ सब तैयार! — प्रार्थना-पत्र दाखिल करने हेतु सम्पूर्ण तैयारी सम्पन्न
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections_list.map((section) => (
          <div key={section.title} className={`bg-card border rounded-xl overflow-hidden ${section.warning ? "border-red-300" : "border-border"}`}>
            <div className={`px-5 py-4 border-b ${section.warning ? "bg-red-50 border-red-200" : "bg-muted/30 border-border"}`}>
              <h2 className={`font-bold text-sm ${section.warning ? "text-red-800" : "text-foreground"}`}>{section.title}</h2>
              <p className="text-xs text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="p-4 space-y-2">
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const isChecked = checked[key] ?? false;
                return (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <button onClick={() => toggleItem(key)} className="mt-0.5 flex-shrink-0 no-print">
                      {isChecked
                        ? <CheckSquare className="w-4 h-4 text-green-600" />
                        : <Square className="w-4 h-4 text-muted-foreground group-hover:text-primary" />}
                    </button>
                    <span className={`text-sm leading-relaxed ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-center">
        <p className="font-bold text-amber-900 text-base">⚖️ शुभकामनाएँ!</p>
        <p className="text-sm text-amber-800 mt-2 leading-relaxed">
          Special Session Case No. 1/2025 · Udaipur, Rajasthan
        </p>
        <p className="text-xs text-amber-700 mt-1">
          Source: VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md — "Use VERIFIED tag only for final written submissions."
        </p>
      </div>
    </div>
  );
}
