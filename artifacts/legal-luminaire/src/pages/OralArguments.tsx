import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";

// Source: Argument_Bank_And_Annexure_Builder.md + forensic_defense_report.md §V
const arguments_list = [
  {
    id: 1,
    title: "प्रथम तर्क — मूलभूत वैज्ञानिक त्रुटि (Foundational Scientific Error)",
    subtitle: "Argument 1 — Wrong IS Standard Applied",
    text: `माननीय न्यायालय,

अभियोजन पक्ष की सम्पूर्ण फोरेंसिक रिपोर्ट का वैज्ञानिक आधार ही मूलतः शून्य है।

अभियोजन ने IS 1199:2018 — जो "Methods of Sampling and Testing of Fresh Concrete" (ताज़ा कंक्रीट) का मानक है — को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार (Hardened Masonry Mortar in Existing Stone Masonry) पर लागू किया है। यह मूलभूत तकनीकी त्रुटि है।

इस सामग्री पर लागू होने वाला सही भारतीय मानक IS 2250:1981 (Code of Practice for Masonry Mortars) है, और सही अंतर्राष्ट्रीय मानक ASTM C1324 (Standard Test Method for Examination and Analysis of Hardened Masonry Mortar) है।

माननीय सर्वोच्च न्यायालय ने Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317 में अभिनिर्धारित किया: "The admissibility and reliability of an expert opinion under Section 45 of the Indian Evidence Act is contingent upon the accuracy of the basic facts on which the opinion is founded. If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated."

जब मानक ही गलत हो तो रिपोर्ट "Garbage in, Garbage out" के सिद्धान्त पर स्वतः निरर्थक है।

[Source: forensic_defense_report.md §II; Standards_Matrix_IS_ASTM_NABL.md]`,
    category: "वैज्ञानिक",
    color: "border-purple-200 bg-purple-50/50",
    status: "VERIFIED",
  },
  {
    id: 2,
    title: "द्वितीय तर्क — श्रृंखला-अभिरक्षा का पूर्ण अभाव (Chain of Custody Failure)",
    subtitle: "Argument 2 — Kattavellai SC 2025 — Binding Precedent",
    text: `माननीय न्यायालय,

माननीय सर्वोच्च न्यायालय की त्रि-न्यायाधीशीय खण्डपीठ ने कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (Criminal Appeal No. 1672/2019, 2025 INSC 845, दिनांक 15 जुलाई 2025) में — जो इस माननीय न्यायालय पर पूर्णतः बाध्यकारी है — स्पष्ट रूप से अभिनिर्धारित किया है:

"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."

प्रस्तुत प्रकरण में अभियोजन पक्ष यह बताने में सर्वथा असमर्थ है कि —
(1) नमूने किस अधिकारी ने किस समय एकत्र किए?
(2) नमूनों को किस प्रकार सील किया गया?
(3) नमूने प्रयोगशाला तक किस माध्यम से पहुँचे?
(4) प्रयोगशाला में नमूनों को किस दशा में रखा गया?

यह शून्य श्रृंखला-अभिरक्षा माननीय सर्वोच्च न्यायालय के उपर्युक्त बाध्यकारी निर्णय के आलोक में फोरेंसिक रिपोर्ट को सर्वथा अनुपयोगी एवं अग्राह्य बनाती है।

[Source: Kattavellai_Supreme_Court_DNA_Guidelines_2025.md — VERIFIED]`,
    category: "विधिक",
    color: "border-green-200 bg-green-50/50",
    status: "VERIFIED",
  },
  {
    id: 3,
    title: "तृतीय तर्क — वर्षा में नमूनाकरण + सतह संदूषण",
    subtitle: "Argument 3 — Rain Sampling + Surface Contamination",
    text: `माननीय न्यायालय,

नमूने दिनांक 28-12-2011 को भारी वर्षा एवं तूफान के दौरान संग्रहीत किए गए। यह IS 4031 Part 6 §5.1 का स्पष्ट उल्लंघन है जो 27±2°C तापमान नियंत्रण अनिवार्य करता है। ASTM C780 §6.1 स्पष्ट करता है: "samples must be protected from rain and moisture; otherwise sample is invalid."

इसके अतिरिक्त, मोर्टार जोड़ों की बाहरी सतह वर्षों की कार्बोनेशन एवं वर्षाजल के निक्षालन से मूल मोर्टार से सर्वथा भिन्न हो जाती है। ASTM C1324 §7-8 एवं BS EN 1015-2 §5.1.2 स्पष्ट करते हैं: "Sampling shall be made from the interior of the joint, after removal of the surface layer which may be affected by weathering or carbonation."

1993 से अधिक वर्ष पुराने मोर्टार जोड़ में कार्बोनेशन की गहराई स्वाभाविक रूप से 10-15mm तक हो जाती है। इस कार्बोनेटेड सतह की संपीड़न क्षमता मूल मोर्टार की तुलना में 30-50% कम होती है। अतः ऐसे नमूनों का "अनुत्तीर्ण" होना अपरिहार्य था — परंतु यह मूल निर्माण-कार्य की गुणवत्ता का संकेत नहीं है।

[Source: Comprehensive_Legal_Defence_Report §I-B; forensic_defense_report.md §II — SECONDARY]`,
    category: "वैज्ञानिक",
    color: "border-blue-200 bg-blue-50/50",
    status: "SECONDARY",
  },
  {
    id: 4,
    title: "चतुर्थ तर्क — नैसर्गिक न्याय का हनन + CPWD उल्लंघन",
    subtitle: "Argument 4 — Natural Justice + IS 3535 + CPWD Manual",
    text: `माननीय न्यायालय,

IS 3535:1986 §4.1 में यह अनिवार्य प्रावधान है: "Sampling in presence of purchaser/contractor representative mandatory." CPWD Manual 2023 §3.7.4 एवं 12.2.1 में भी यह स्पष्ट है कि निर्माण-सामग्री के फोरेंसिक नमूनाकरण के समय ठेकेदार अथवा उसके अधिकृत प्रतिनिधि की उपस्थिति सुनिश्चित की जाए।

नैसर्गिक न्याय का सर्वमान्य सिद्धान्त "Audi Alteram Partem" यह घोषित करता है कि किसी भी व्यक्ति के विरुद्ध उसकी अनुपस्थिति में कोई भी प्रतिकूल निर्णय लेना विधि की दृष्टि से अमान्य है।

[PENDING — R.B. Constructions v. State of Maharashtra 2014 SCC OnLine Bom 125: "ex-parte extraction of samples behind the back of the petitioner violates this fundamental principle" — obtain certified copy before citing]

[PENDING — C.B.I. v. K.S. Kalra 2011 SCC OnLine Del 3412: "failure to follow CPWD/BIS joint sampling → PC Act charge fails" — obtain certified copy before citing]

[Source: forensic_defense_report.md §II; Full_Case_References.md]`,
    category: "संवैधानिक",
    color: "border-amber-200 bg-amber-50/50",
    status: "PENDING",
  },
  {
    id: 5,
    title: "पंचम तर्क — प्रथम दृष्टया आरोप असिद्ध → उन्मोचन अनिवार्य",
    subtitle: "Argument 5 — No Prima Facie Case — Discharge Mandatory",
    text: `माननीय न्यायालय,

माननीय सर्वोच्च न्यायालय ने Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 में अभिनिर्धारित किया: "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."

State of Bihar v. Ramesh Singh (1977) 4 SCC 39 में भी यह स्पष्ट किया गया कि उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं।

प्रस्तुत प्रकरण में —
• सम्पूर्ण फोरेंसिक साक्ष्य प्रक्रियागत एवं वैज्ञानिक त्रुटियों से दूषित है
• भ्रष्टाचार का कोई भी प्रत्यक्ष, स्वतंत्र साक्ष्य नहीं है
• IPC 304A के अंतर्गत "घोर लापरवाही" का कोई भी तथ्य स्थापित नहीं है
• घटना का कारण प्राकृतिक आपदा (भारी वर्षा) थी — NBC 2016/2023 §3.4 के अंतर्गत Force Majeure
• Jacob Mathew v. State of Punjab (2005) 6 SCC 1: "Mere lack of necessary care cannot be considered as rash or negligent act"

अतः माननीय न्यायालय से सादर प्रार्थना है कि आवेदक को धारा 250 BNSS 2023 के अंतर्गत तत्काल उन्मोचित किया जाए।

[Source: VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §3; Argument_Bank_And_Annexure_Builder.md §A — VERIFIED]`,
    category: "विधिक",
    color: "border-red-200 bg-red-50/50",
    status: "VERIFIED",
  },
];

const catColor: Record<string, string> = {
  "वैज्ञानिक": "bg-purple-100 text-purple-800",
  "विधिक": "bg-green-100 text-green-800",
  "संवैधानिक": "bg-blue-100 text-blue-800",
  "साक्ष्य": "bg-red-100 text-red-800",
};
const statusColor: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-800",
  SECONDARY: "bg-blue-100 text-blue-800",
  PENDING: "bg-red-100 text-red-800",
};

export default function OralArguments() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (arg: typeof arguments_list[0]) => {
    navigator.clipboard.writeText(`${arg.title}\n${arg.subtitle}\n\n${arg.text}`).then(() => {
      setCopiedId(arg.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">मौखिक तर्क</h1>
        <p className="text-sm text-muted-foreground">
          Source: Argument_Bank_And_Annexure_Builder.md + forensic_defense_report.md §V
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold">उपयोग निर्देश</p>
        <p className="text-xs mt-1">
          प्रत्येक तर्क न्यायालय में मौखिक बहस हेतु तैयार है।
          <span className="font-semibold text-green-700"> VERIFIED</span> = court-safe।
          <span className="font-semibold text-blue-700"> SECONDARY</span> = credible, verify para before citing।
          <span className="font-semibold text-red-700"> ⚠ PENDING</span> = certified copy obtain करें पहले।
          Source: Case_Law_Matrix_Verified_Pending.md
        </p>
      </div>

      <div className="space-y-5">
        {arguments_list.map((arg) => (
          <div key={arg.id} className={`border-2 rounded-xl overflow-hidden ${arg.color}`}>
            <div className="flex items-start justify-between p-4 gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                    {arg.id}
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{arg.title}</h3>
                </div>
                <div className="flex items-center gap-2 ml-9">
                  <p className="text-xs text-muted-foreground">{arg.subtitle}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[arg.category] ?? ""}`}>
                    {arg.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[arg.status]}`}>
                    {arg.status === "PENDING" ? "⚠ PENDING" : arg.status}
                  </span>
                </div>
              </div>
              <button onClick={() => handleCopy(arg)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                {copiedId === arg.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copiedId === arg.id ? "कॉपी!" : "कॉपी"}
              </button>
            </div>
            {arg.status === "PENDING" && (
              <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">PENDING citations — obtain certified copies before using in court.</p>
              </div>
            )}
            <div className="px-4 pb-4">
              <div className="bg-white/70 rounded-lg p-4">
                <pre className="hindi-text text-xs leading-loose text-foreground whitespace-pre-wrap font-serif">
                  {arg.text}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-examination prompts */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-bold mb-3">जिरह प्रश्न — IO/FSL के लिए</h2>
        <p className="text-xs text-muted-foreground mb-3">Source: Argument_Bank_And_Annexure_Builder.md §B</p>
        <ul className="space-y-2 text-xs text-foreground">
          {[
            "प्रत्येक नमूना ID के लिए — निष्कर्षण का सटीक स्थान और विधि बताएँ",
            "सीलिंग का साक्षी कौन था और सील नमूना रिकॉर्ड कहाँ है?",
            "संग्रह और परिवहन के दौरान मौसम-सुरक्षा के क्या कदम उठाए गए?",
            "टाइमस्टैम्प और हस्ताक्षर के साथ अभिरक्षा हस्तांतरण रजिस्टर प्रस्तुत करें",
            "क्या ठेकेदार/बचाव पक्ष को सूचित किया गया था या उपस्थित था?",
            "सील की स्थिति और पैकेट की अखंडता पर प्रयोगशाला रसीद नोट दिखाएँ",
            "परीक्षण विधि संस्करण और पर्यावरण नियंत्रण स्पष्ट करें",
            "IS 2250:1981 (masonry mortar) के बजाय IS 1199:2018 (fresh concrete) क्यों प्रयोग किया?",
          ].map((q, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary font-bold flex-shrink-0">Q{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
