import { useState } from "react";
import { Copy, Check } from "lucide-react";

const arguments_list = [
  {
    id: 1,
    title: "प्रथम तर्क — वैज्ञानिक अप्रामाणिकता",
    subtitle: "Argument 1 — Scientific Invalidity of Samples",
    text: `माननीय न्यायालय,

विनयपूर्वक निवेदन है कि अभियोजन पक्ष की समस्त फोरेंसिक रिपोर्ट का आधार ही वैज्ञानिक दृष्टि से दोषपूर्ण है।

भारतीय मानक IS 1199:2018 की धारा 4.1 तथा अंतर्राष्ट्रीय मानक ASTM C780 की धारा 6.1 — दोनों स्पष्टतः यह उद्घोषित करते हैं कि सीमेंट मोर्टार के नमूने वर्षा या तूफान की परिस्थितियों में कदापि संग्रहीत नहीं किए जाने चाहिए। मोर्टार की बाहरी सतह वर्षों की कार्बोनेशन एवं वर्षाजल के निक्षालन से मूल मोर्टार से सर्वथा भिन्न हो जाती है। IS 1199 की धारा 4.4 के अनुसार बाहरी 5-10mm की संदूषित परत को हटाकर ही आंतरिक सार (Core Material) का परीक्षण किया जाना चाहिए।

माननीय न्यायालय, जब नमूना ही वैज्ञानिक दृष्टि से शून्य हो तो उस पर आधारित विशेषज्ञ रिपोर्ट "Garbage in, Garbage out" के सिद्धान्त पर स्वतः निरर्थक हो जाती है। अतः यह रिपोर्ट भारतीय साक्ष्य संहिता 2023 की धारा 45 के अंतर्गत विशेषज्ञ मत के रूप में ग्राह्य नहीं है।`,
    category: "वैज्ञानिक",
    color: "border-purple-200 bg-purple-50/50",
  },
  {
    id: 2,
    title: "द्वितीय तर्क — श्रृंखला-अभिरक्षा का पूर्ण अभाव",
    subtitle: "Argument 2 — Complete Chain of Custody Failure",
    text: `माननीय न्यायालय,

माननीय सर्वोच्च न्यायालय ने कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (2025 INSC 845) में — जो इस माननीय न्यायालय पर पूर्णतः बाध्यकारी है — स्पष्ट रूप से अभिनिर्धारित किया है:

"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end."

प्रस्तुत प्रकरण में अभियोजन पक्ष यह बताने में सर्वथा असमर्थ है कि —
(1) नमूने किस अधिकारी ने किस समय एकत्र किए?
(2) नमूनों को किस प्रकार सील किया गया?
(3) नमूने प्रयोगशाला तक किस माध्यम से पहुँचे?
(4) प्रयोगशाला में नमूनों को किस दशा में रखा गया?

यह शून्य श्रृंखला-अभिरक्षा माननीय सर्वोच्च न्यायालय के उपर्युक्त निर्णय के आलोक में फोरेंसिक रिपोर्ट को सर्वथा अनुपयोगी एवं अग्राह्य बनाती है।`,
    category: "विधिक",
    color: "border-green-200 bg-green-50/50",
  },
  {
    id: 3,
    title: "तृतीय तर्क — नैसर्गिक न्याय का हनन",
    subtitle: "Argument 3 — Violation of Natural Justice",
    text: `माननीय न्यायालय,

नैसर्गिक न्याय का सर्वमान्य सिद्धान्त "Audi Alteram Partem" यह घोषित करता है कि किसी भी व्यक्ति के विरुद्ध उसकी अनुपस्थिति में कोई भी प्रतिकूल निर्णय लेना विधि की दृष्टि से अमान्य है।

IS 3535:1986 की धारा 4.1 में यह अनिवार्य प्रावधान है कि नमूना संग्रह के समय आपूर्तिकर्ता/ठेकेदार के प्रतिनिधि को उपस्थित रखा जाए। CPWD मैनुअल 2023 का खण्ड 3.7.4 भी इसी बात का समर्थन करता है।

माननीय मद्रास उच्च न्यायालय (31 जुलाई 2025) ने स्पष्ट रूप से कहा कि "The accused is entitled to a fair opportunity to disprove the allegations against him."

जब आवेदक का कोई प्रतिनिधि उपस्थित ही नहीं था तो यह कैसे प्रमाणित किया जाए कि नमूने सही स्थान से, सही विधि से, सही परिमाण में लिए गए थे? इस अभाव में फोरेंसिक रिपोर्ट आवेदक के मौलिक अधिकारों (अनुच्छेद 21 एवं 22) का भी उल्लंघन करती है।`,
    category: "संवैधानिक",
    color: "border-blue-200 bg-blue-50/50",
  },
  {
    id: 4,
    title: "चतुर्थ तर्क — प्रथम दृष्टया आरोप असिद्ध",
    subtitle: "Argument 4 — No Prima Facie Case",
    text: `माननीय न्यायालय,

माननीय सर्वोच्च न्यायालय ने Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 में यह स्पष्ट किया कि उन्मोचन चरण में न्यायालय का कर्तव्य है कि वह यह जाँचे कि क्या प्रथम दृष्टया (Prima Facie) कोई आरोप स्थापित होता है।

प्रस्तुत प्रकरण में —
• समस्त फोरेंसिक साक्ष्य प्रक्रियागत एवं वैज्ञानिक त्रुटियों से दूषित है
• भ्रष्टाचार का कोई भी प्रत्यक्ष, स्वतंत्र साक्ष्य नहीं है
• IPC 304A के अंतर्गत "घोर लापरवाही" का कोई भी तथ्य स्थापित नहीं है
• घटना का कारण प्राकृतिक आपदा (भारी वर्षा) थी — Force Majeure

NBC 2016/2023 के खण्ड 3.4 के अनुसार अत्यधिक वर्षा Force Majeure की श्रेणी में आती है। Jacob Mathew v. State of Punjab (2005) 6 SCC 1 में सर्वोच्च न्यायालय ने स्पष्ट किया कि Force Majeure में आपराधिक उपेक्षा सिद्ध नहीं होती।

माननीय न्यायालय, जब प्रथम दृष्टया कोई भी मामला नहीं बनता, तो State of Bihar v. Ramesh Singh (1977) 4 SCC 39 के अनुसार आवेदक को उन्मोचित किया जाना न्यायोचित एवं अनिवार्य है।`,
    category: "विधिक",
    color: "border-amber-200 bg-amber-50/50",
  },
  {
    id: 5,
    title: "पंचम तर्क — विशेषज्ञ मत की अग्राह्यता",
    subtitle: "Argument 5 — Expert Opinion Inadmissible",
    text: `माननीय न्यायालय,

भारतीय साक्ष्य संहिता 2023 की धारा 45 (पूर्ववर्ती धारा 45, भारतीय साक्ष्य अधिनियम 1872) के अंतर्गत विशेषज्ञ का मत तभी साक्ष्य के रूप में ग्राह्य होता है जब उसका वैज्ञानिक आधार (Scientific Foundation) सुदृढ़ एवं अखण्डित हो।

प्रस्तुत फोरेंसिक रिपोर्ट में —
(1) नमूना संग्रह की प्रक्रिया का कोई विवरण नहीं
(2) IS 4031 के किस भाग के अंतर्गत परीक्षण हुआ — कोई उल्लेख नहीं
(3) कार्बोनेशन गहराई का मापन नहीं
(4) परीक्षण के समय तापमान/आर्द्रता का अभिलेख नहीं
(5) नमूनों की उम्र (Age of Samples) का उल्लेख नहीं

IS 4031, भाग 6 के अनुसार संपीड़न शक्ति परीक्षण के परिणाम नमूने की आयु, तापमान एवं आर्द्रता पर प्रत्यक्षतः निर्भर होते हैं। इन चरों का कोई उल्लेख न होने से रिपोर्ट वैज्ञानिक दृष्टि से अर्थहीन है।

"If the foundation fails, the building falls." — इस मूल सिद्धान्त के आधार पर यह फोरेंसिक रिपोर्ट न्यायालय के समक्ष किसी भी प्रयोजन के लिए ग्राह्य नहीं की जा सकती।

अतः माननीय न्यायालय से सादर प्रार्थना है कि इस रिपोर्ट को अग्राह्य घोषित करते हुए आवेदक को तत्काल उन्मोचित किया जाए।`,
    category: "साक्ष्य",
    color: "border-red-200 bg-red-50/50",
  },
];

const catColor: Record<string, string> = {
  "वैज्ञानिक": "bg-purple-100 text-purple-800",
  "विधिक": "bg-green-100 text-green-800",
  "संवैधानिक": "bg-blue-100 text-blue-800",
  "साक्ष्य": "bg-red-100 text-red-800",
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
        <p className="text-sm text-muted-foreground">Oral Arguments — 5 तैयार-उपयोगी अनुच्छेद</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold">उपयोग निर्देश</p>
        <p className="text-xs mt-1">प्रत्येक तर्क न्यायालय में मौखिक बहस हेतु तैयार है। प्रतिलिपि करें एवं सुनवाई से पूर्व स्मरण करें। प्रत्येक तर्क का क्रम महत्त्वपूर्ण है — प्रथम से पंचम तक।</p>
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
                </div>
              </div>
              <button
                onClick={() => handleCopy(arg)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {copiedId === arg.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copiedId === arg.id ? "कॉपी!" : "कॉपी"}
              </button>
            </div>
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
    </div>
  );
}
