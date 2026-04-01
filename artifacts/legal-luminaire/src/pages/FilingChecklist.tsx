import { useState } from "react";
import { CheckSquare, Square, Printer } from "lucide-react";

const sections_list = [
  {
    title: "प्रार्थना-पत्र दस्तावेज़ीकरण",
    subtitle: "Application Documents",
    items: [
      "प्रार्थना-पत्र की 3 प्रतियाँ — एक न्यायालय हेतु, एक अभियोजन पक्ष हेतु, एक स्वयं हेतु",
      "शपथ-पत्र (Affidavit) — नोटरी/जे.एम. द्वारा सत्यापित",
      "मुख्य अधिवक्ता द्वारा हस्ताक्षर एवं अधिवक्ता पंजीकरण संख्या अंकित",
      "वाद-कारण (Cause Title) में सभी पक्षकारों के नाम सही अंकित हों",
      "धारा 250 BNSS 2023 (अथवा 227 CrPC) स्पष्ट उल्लेखित हो",
      "न्यायालय शुल्क (Court Fee Stamp) संलग्न",
    ],
  },
  {
    title: "अनुलग्नक (Annexures)",
    subtitle: "Documents to Attach",
    items: [
      "अनुलग्नक A : IS 1199:2018 की प्रासंगिक धाराओं की फोटोकॉपी (सत्यापित)",
      "अनुलग्नक B : IS 4031 भाग 1 एवं 6 की प्रासंगिक धाराएँ",
      "अनुलग्नक C : IS 3535:1986 की धारा 4.1, 5.1, 6.2",
      "अनुलग्नक D : ASTM C780 की धारा 5.2 एवं 6.1",
      "अनुलग्नक E : कट्टावेल्लई निर्णय (2025 INSC 845) की प्रति",
      "अनुलग्नक F : उत्तराखण्ड HC 2026 निर्णय की प्रति",
      "अनुलग्नक G : क्रॉस-रेफरेंस मैट्रिक्स (इस एप से प्रिंट करें)",
      "अनुलग्नक H : FIR 496/2011 की प्रति",
      "अनुलग्नक I : फोरेंसिक रिपोर्ट की प्रति (अभियोजन की)",
      "अनुलग्नक J : मौसम/वर्षा रिपोर्ट दिनांक 28-12-2011 (IMD/पुलिस रिकॉर्ड)",
    ],
  },
  {
    title: "तथ्यात्मक सत्यापन",
    subtitle: "Fact Verification Before Filing",
    items: [
      "FIR की दिनांक 28-12-2011 सही है",
      "विशेष सत्र वाद संख्या 1/2025 सही है",
      "अभियुक्त का नाम एवं पद सही अंकित है",
      "मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड का नाम सही है",
      "न्यायालय का नाम एवं पता सही है",
      "अगली सुनवाई की दिनांक का उल्लेख प्रार्थना-पत्र में आवश्यकतानुसार",
    ],
  },
  {
    title: "विधिक तैयारी",
    subtitle: "Legal Preparation",
    items: [
      "सभी 5 मौखिक तर्क कण्ठस्थ (अथवा अंगुलीनिर्देश हेतु तैयार)",
      "कट्टावेल्लई निर्णय के प्रमुख उद्धरण याद किए हों",
      "IS 1199, IS 3535 की प्रमुख धाराएँ तैयार रखें",
      "उत्तराखण्ड HC 2026 एवं SC 2026 पंचनामा निर्णय के उद्धरण तैयार",
      "Union of India v. Prafulla Kumar Samal (1979) एवं State of Bihar v. Ramesh Singh (1977) के उद्धरण",
      "NBC 2016/2023 Force Majeure प्रावधान",
      "Jacob Mathew v. State of Punjab (2005) — घोर उपेक्षा की परिभाषा",
    ],
  },
  {
    title: "दाखिलाकरण प्रक्रिया",
    subtitle: "Filing Procedure at Court",
    items: [
      "न्यायालय की लिपिक को प्रार्थना-पत्र की 3 प्रतियाँ सौंपें",
      "अभियोजन पक्ष (SPP) को एक प्रति अनिवार्यतः दें",
      "दाखिल रसीद एवं दिनांक-मुद्रित प्रति अपने पास रखें",
      "अगली सुनवाई की दिनांक नोट करें",
      "यदि मौखिक तर्क उसी दिन हों तो सभी अनुलग्नक उपलब्ध रखें",
      "न्यायालय में मोबाइल में यह Legal Luminaire ऐप खोलकर रखें — त्वरित सन्दर्भ हेतु",
    ],
  },
  {
    title: "बचाव के मुख्य बिंदु — स्मरण सूची",
    subtitle: "Defence Summary — Quick Reference",
    items: [
      "बिंदु 1 : वर्षा में नमूना → IS 1199 उल्लंघन → वैज्ञानिक रूप से शून्य",
      "बिंदु 2 : सतह संदूषण → ASTM C780 उल्लंघन → परिणाम अर्थहीन",
      "बिंदु 3 : शून्य Chain of Custody → कट्टावेल्लई (SC 2025) → साक्ष्य अग्राह्य",
      "बिंदु 4 : ठेकेदार प्रतिनिधि अनुपस्थित → IS 3535, Natural Justice → अमान्य",
      "बिंदु 5 : पंचनामा शून्य → BNSS 2023 → सम्पूर्ण प्रक्रिया अमान्य",
      "बिंदु 6 : Force Majeure (भारी वर्षा) → NBC 2023 → दायित्व शून्य",
      "बिंदु 7 : भ्रष्टाचार का कोई साक्ष्य नहीं → PC Act के आरोप निराधार",
      "बिंदु 8 : प्रथम दृष्टया कोई मामला नहीं → Prafulla Kumar Samal → उन्मोचन अनिवार्य",
    ],
  },
];

export default function FilingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggleItem = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const totalItems = sections_list.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">फाइलिंग चेकलिस्ट</h1>
          <p className="text-sm text-muted-foreground">Filing Checklist · दाखिलाकरण से पूर्व जाँच</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity w-fit no-print"
        >
          <Printer className="w-4 h-4" />
          प्रिंट करें
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">प्रगति / Progress</span>
          <span className="text-sm font-bold text-primary">{checkedCount}/{totalItems} ({progress}%)</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-green-700 font-semibold mt-2 text-center">
            ✅ सब तैयार! — प्रार्थना-पत्र दाखिल करने हेतु सम्पूर्ण तैयारी सम्पन्न
          </p>
        )}
      </div>

      <div className="space-y-5">
        {sections_list.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-sm text-foreground">{section.title}</h2>
              <p className="text-xs text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="p-4 space-y-2">
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`;
                const isChecked = checked[key] ?? false;
                return (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="mt-0.5 flex-shrink-0 text-primary no-print"
                    >
                      {isChecked
                        ? <CheckSquare className="w-4 h-4 text-green-600" />
                        : <Square className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      }
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
          यह Legal Luminaire मंच आपके प्रथम सुनवाई में ही उन्मोचन के लिए पूर्ण विधिक तैयारी प्रदान करता है।
          माननीय न्यायालय के समक्ष आत्मविश्वास के साथ प्रस्तुत हों।
        </p>
        <p className="text-xs text-amber-700 mt-2">
          Special Session Case No. 1/2025 · Udaipur, Rajasthan
        </p>
      </div>
    </div>
  );
}
