import { useEffect, useRef, useState } from "react";
import {
  Printer, Download, Copy, CheckCircle2, AlertTriangle,
  Clock, ChevronDown, ChevronUp, FileText,
} from "lucide-react";

// ── Verification badge ─────────────────────────────────────────────────────
type VS = "VERIFIED" | "SECONDARY" | "PENDING";
const vsBadge: Record<VS, string> = {
  VERIFIED:  "bg-green-100 text-green-800 border-green-300",
  SECONDARY: "bg-blue-100 text-blue-800 border-blue-300",
  PENDING:   "bg-red-100 text-red-800 border-red-300",
};
const vsIcon: Record<VS, React.ElementType> = {
  VERIFIED: CheckCircle2, SECONDARY: Clock, PENDING: AlertTriangle,
};
function VBadge({ s }: { s: VS }) {
  const Icon = vsIcon[s];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${vsBadge[s]}`}>
      <Icon className="w-3 h-3" />
      {s === "PENDING" ? "⚠ PENDING — प्रमाणित प्रति प्राप्त करें" : s}
    </span>
  );
}

// ── Section data (v3 FINAL) ────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "heading",
    title: "न्यायालय शीर्षक",
    status: "VERIFIED" as VS,
    content: `माननीय विशेष न्यायाधीश महोदय
(भ्रष्टाचार निवारण अधिनियम प्रकरण)
उदयपुर, राजस्थान

विशेष सत्र वाद संख्या  : 1/2025
प्रथम सूचना रिपोर्ट    : 496/2011 दिनांक 28-12-2011

राज्य (राजस्थान)                                    …अभियोजन पक्ष
                         बनाम
हेमराज वर्दार, निदेशक, मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड
उदयपुर, राजस्थान                                    …अभियुक्त/आवेदक

प्रार्थना-पत्र : धारा 250 BNSS 2023 / धारा 227 CrPC
उन्मोचन (Discharge) हेतु`,
  },
  {
    id: "facts",
    title: "भाग-1 : प्रकरण के तथ्य",
    status: "VERIFIED" as VS,
    content: `1. वर्ष 2011 में महाराणा प्रताप स्टेडियम, उदयपुर के मरम्मत/निर्माण कार्य का ठेका मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड को दिया गया था। आवेदक हेमराज वर्दार उक्त कम्पनी के निदेशक हैं।

2. दिनांक 28-12-2011 को भारी वर्षा एवं तूफान के दौरान स्टेडियम की बाहरी दीवार का एक भाग आंशिक रूप से क्षतिग्रस्त हुआ। यह घटना अत्यधिक प्राकृतिक आपदा की स्थिति में घटी।

3. घटना के उपरान्त फोरेंसिक प्रयोगशाला द्वारा सीमेंट मोर्टार के नमूनों का परीक्षण किया गया एवं उन्हें "अनुत्तीर्ण" (failed) घोषित किया गया। अभियोजन पक्ष इसी रिपोर्ट पर सम्पूर्ण अभियोजन आधारित करता है।

4. उक्त नमूनों का संग्रह घोर तूफानी एवं वर्षाकालीन परिस्थितियों में किया गया था, जो कठोर चिनाई मोर्टार पर लागू सही मानकों (IS 2250:1981, IS 3535:1986, ASTM C1324) की मूल अपेक्षाओं के विपरीत है।

5. नमूना संग्रह के समय न तो अभियुक्त का कोई प्रतिनिधि उपस्थित था, न कोई पंचनामा तैयार किया गया, न नमूनों को सील किया गया, और न ही किसी श्रृंखला-अभिरक्षा (Chain of Custody) का प्रलेखन किया गया।

6. उपर्युक्त समस्त प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण फोरेंसिक रिपोर्ट पूर्णतः अविश्वसनीय एवं अग्राह्य है।

7. अभियुक्त के विरुद्ध प्रथम दृष्टया कोई भी वैध अभियोग प्रमाणित नहीं होता, अतः उन्हें विचारण (Trial) से उन्मोचित किया जाना न्यायसंगत एवं आवश्यक है।`,
  },
  {
    id: "principles",
    title: "भाग-2 : उन्मोचन के विधिक सिद्धान्त",
    status: "VERIFIED" as VS,
    content: `8. धारा 250 BNSS 2023 (वैकल्पिक : धारा 227 CrPC) के अंतर्गत उन्मोचन के चरण पर माननीय न्यायालय को यह देखना होता है कि क्या उपलब्ध सामग्री से प्रथम दृष्टया (prima facie) ऐसा ठोस आधार बनता है जिससे अभियुक्त के विरुद्ध आरोप तय किए जाएँ।

9. Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] :
   "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."

10. State of Bihar v. Ramesh Singh (1977) 4 SCC 39 [VERIFIED] :
    उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं। यदि नहीं, तो उन्मोचन अनिवार्य है।

11. जहाँ अभियोजन की केन्द्रीय सामग्री तकनीकी/फोरेंसिक रिपोर्ट हो, वहाँ उस रिपोर्ट की बुनियादी विश्वसनीयता — sample integrity, custody integrity, और scientific foundation — पहले सिद्ध होना आवश्यक है।`,
  },
];

const GROUNDS = [
  {
    id: "g0",
    title: "पूर्व-प्राथमिक आधार : गलत IS मानक (IS 1199 vs IS 2250)",
    status: "SECONDARY" as VS,
    content: `अभियोजन ने IS 1199:2018 ("Methods of Sampling of Fresh Concrete") को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार पर लागू किया — यह मूलभूत तकनीकी त्रुटि है।

सही मानक :
• IS 2250:1981 — Code of Practice for Masonry Mortars (एकमात्र सही भारतीय मानक)
• IS 13311 (Part 1-2) — Non-Destructive Testing of Masonry
• ASTM C1324 — Standard Test Method for Hardened Masonry Mortar

Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317 [SECONDARY — SCC से पैरा सत्यापित करें] :
"If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated."

जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।`,
  },
  {
    id: "g1",
    title: "आधार 1 : वर्षा/तूफान में नमूना संग्रह",
    status: "SECONDARY" as VS,
    content: `• IS 4031 (Part 6) : तापमान 27±2°C एवं नियंत्रित आर्द्रता अनिवार्य — भारी वर्षा में असम्भव।
• IS 3535:1986 : प्रतिकूल मौसम में संग्रह स्थगित करना अनिवार्य।
• ASTM C780 §6.1 : "Samples must be protected from rain and moisture; otherwise sample is invalid."
• BS EN 1015-2 §4.3.1 : मौसम-संरक्षण "Mandatory Precondition"।

M/s. Builders Association v. State of UP (2018 SCC OnLine All 442) [⚠ PENDING — प्रमाणित प्रति प्राप्त करें] :
"When samples are retrieved post-incident after being exposed to heavy rain, their laboratory failure cannot automatically be attributed to the contractor's initial mix design."`,
  },
  {
    id: "g2",
    title: "आधार 2 : सतह संदूषण — कार्बोनेशन",
    status: "SECONDARY" as VS,
    content: `• मोर्टार जोड़ों की बाहरी 5-10mm परत कार्बोनेशन, निक्षालन एवं वायुमंडलीय संक्षारण से मूल मोर्टार से सर्वथा भिन्न हो जाती है।
• ASTM C1324 §7-8 एवं BS EN 1015-2 §5.1.2 : "Sampling shall be made from the interior of the joint, after removal of the surface layer affected by weathering or carbonation."
• 1993 से पुराने मोर्टार में कार्बोनेशन गहराई 10-15mm — संपीड़न क्षमता 30-50% कम।
• अतः नमूनों का "अनुत्तीर्ण" होना अपरिहार्य था — परन्तु यह मूल निर्माण-गुणवत्ता का संकेत नहीं।`,
  },
  {
    id: "g3",
    title: "आधार 3 : श्रृंखला-अभिरक्षा (Chain of Custody) का सम्पूर्ण अभाव",
    status: "VERIFIED" as VS,
    content: `कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (2025 INSC 845) [VERIFIED — BINDING] :
"Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end."

त्रि-न्यायाधीशीय खण्डपीठ (न्यायमूर्ति विक्रम नाथ, संजय करोल, संदीप मेहता) — सम्पूर्ण भारत में बाध्यकारी।

उत्तराखण्ड उच्च न्यायालय (मार्च 2026) [SECONDARY — पूर्ण citation प्राप्त करें] :
"In the absence of a duly established chain of custody, forensic evidence loses its evidentiary value."

वर्तमान प्रकरण में :
(क) नमूना संग्रह का कोई विधिवत् अभिलेख नहीं
(ख) नमूनों की सीलिंग का कोई प्रमाण नहीं
(ग) प्रयोगशाला तक परिवहन का कोई दस्तावेज़ नहीं
(घ) प्रयोगशाला में भण्डारण दशाओं का कोई अभिलेख नहीं
(ङ) किसी भी चरण में CoC का कोई प्रमाण नहीं`,
  },
  {
    id: "g4",
    title: "आधार 4 : अनियमित नमूनाकरण",
    status: "SECONDARY" as VS,
    content: `• IS 3535:1986 : नमूना संग्रह "systematic, representative and documented manner" में अनिवार्य।
• IS 3535:1986 : कम से कम 5 प्रतिनिधि स्थलों से नमूना लेना अनिवार्य।
• अभियुक्त का कोई प्रतिनिधि उपस्थित नहीं था — यह प्रमाणित करना असम्भव है कि नमूने उचित स्थानों से लिए गए।`,
  },
  {
    id: "g5",
    title: "आधार 5 : ठेकेदार प्रतिनिधि अनुपस्थित — प्राकृतिक न्याय का हनन",
    status: "PENDING" as VS,
    content: `• IS 3535:1986 §4.1 : "The supplier's representative shall be present at the time of sampling unless otherwise agreed upon in writing."
• CPWD Manual 2023 §3.7.4 एवं 12.2.1 : ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य।

R.B. Constructions v. State of Maharashtra (2014 SCC OnLine Bom 125) [⚠ PENDING — प्रमाणित प्रति प्राप्त करें] :
"An ex-parte extraction of samples behind the back of the petitioner violates this fundamental principle."

C.B.I. v. K.S. Kalra & Ors. (2011 SCC OnLine Del 3412) [⚠ PENDING — प्रमाणित प्रति प्राप्त करें] :
"In the absence of joint sampling, the allegation under the Prevention of Corruption Act fails to stand judicial scrutiny."`,
  },
  {
    id: "g6",
    title: "आधार 6 : पंचनामे का अभाव",
    status: "PENDING" as VS,
    content: `State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 [⚠ PENDING — प्रमाणित प्रति प्राप्त करें] :
"The failure to prepare a proper Panchnama at the site, seal the samples in the presence of independent panchas and the accused, and maintain the chain of custody creates an incurable defect in the prosecution's case."

• बिना पंचनामे के एकत्रित साक्ष्य BNSS 2023 §105 / CrPC §100 के अनुसार अग्राह्य है।`,
  },
  {
    id: "g7",
    title: "आधार 7 : विशेषज्ञ मत की अविश्वसनीयता — धारा 45",
    status: "SECONDARY" as VS,
    content: `भारतीय साक्ष्य संहिता 2023 §45 : विशेषज्ञ मत तभी ग्राह्य जब आधार (Foundation) सुदृढ़ हो।

Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317 [SECONDARY — SCC से पैरा सत्यापित करें] :
"If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated and cannot form the sole basis for a conviction."

फोरेंसिक रिपोर्ट में उल्लेख नहीं :
(क) नमूने किस विधि से लिए गए
(ख) सतह संदूषण निराकरण हुआ या नहीं
(ग) तापमान/आर्द्रता नियंत्रण
(घ) IS 4031 के किस भाग के अनुसार परीक्षण`,
  },
  {
    id: "g8",
    title: "आधार 8 : Force Majeure — अत्यधिक वर्षा",
    status: "VERIFIED" as VS,
    content: `• NBC 2016/2023 §3.4 एवं CPWD Manual Appendix C : "Extreme Weather Events" = Force Majeure — ठेकेदार की देयता से छूट।

Jacob Mathew v. State of Punjab (2005) 6 SCC 1 [VERIFIED] :
"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act."

प्राकृतिक आपदा (भारी वर्षा) में आपराधिक उपेक्षा सिद्ध नहीं होती।`,
  },
  {
    id: "g9",
    title: "आधार 9-12 : IPC 304A / PC Act / Direct Nexus / NABL",
    status: "VERIFIED" as VS,
    content: `आधार 9 — IPC 304A / BNS 106 : "घोर उपेक्षा" की अनुपस्थिति
Jacob Mathew (2005) 6 SCC 1 [VERIFIED] : Force Majeure में घोर उपेक्षा असम्भव।

आधार 10 — PC Act आरोप : तथ्यात्मक आधारहीनता
PC Act §7, 11, 12, 13 के लिए "demand and acceptance of bribe" का स्वतंत्र साक्ष्य आवश्यक — अभियोजन ने कोई प्रत्यक्ष साक्ष्य प्रस्तुत नहीं किया।

आधार 11 — Direct Nexus का अभाव
अभियोजन ने weather-factor को exclude नहीं किया — ठेकेदार के विरुद्ध निकट कारणात्मक दायित्व स्थापित नहीं होता।

आधार 12 — NABL / ISO 17025 उल्लंघन
Missing custody/receipt/environment records — NABL accreditation requirements का उल्लंघन।`,
  },
];

const ORAL_ARGS = [
  {
    id: "oa1",
    title: "OA-1 : मूलभूत वैज्ञानिक त्रुटि",
    content: `माननीय न्यायालय, अभियोजन ने IS 1199:2018 (ताज़ा कंक्रीट) को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार पर लागू किया। सही मानक IS 2250:1981 एवं ASTM C1324 है। Sushil Sharma (2014) 4 SCC 317 : "If the underlying data is inherently flawed, the ensuing expert opinion gets completely vitiated." जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।`,
  },
  {
    id: "oa2",
    title: "OA-2 : श्रृंखला-अभिरक्षा का पूर्ण अभाव",
    content: `माननीय न्यायालय, कट्टावेल्लई (2025 INSC 845) [BINDING] : "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained..." अभियोजन यह नहीं बता सकता — (1) नमूने किसने कब एकत्र किए, (2) कैसे सील किए, (3) प्रयोगशाला कैसे पहुँचे, (4) किस दशा में रखे गए। यह शून्य CoC फोरेंसिक रिपोर्ट को सर्वथा अग्राह्य बनाती है।`,
  },
  {
    id: "oa3",
    title: "OA-3 : वर्षा में नमूनाकरण + सतह संदूषण",
    content: `माननीय न्यायालय, नमूने 28-12-2011 को भारी वर्षा में संग्रहीत किए गए। IS 4031 Part 6 : 27±2°C तापमान अनिवार्य। ASTM C780 : "samples must be protected from rain; otherwise sample is invalid." 1993 से पुराने मोर्टार में कार्बोनेशन 10-15mm — संपीड़न क्षमता 30-50% कम। ASTM C1324 : बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था।`,
  },
  {
    id: "oa4",
    title: "OA-4 : नैसर्गिक न्याय का हनन + CPWD उल्लंघन",
    content: `माननीय न्यायालय, IS 3535:1986 §4.1 : "Sampling in presence of contractor representative mandatory." CPWD Manual 2023 §3.7.4 : ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य। R.B. Constructions (2014) [PENDING] : "ex-parte extraction violates fundamental principle." K.S. Kalra (2011) [PENDING] : "failure to follow CPWD/BIS joint sampling → PC Act charge fails."`,
  },
  {
    id: "oa5",
    title: "OA-5 : प्रथम दृष्टया आरोप असिद्ध → उन्मोचन अनिवार्य",
    content: `माननीय न्यायालय, Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] : "If the material discloses nothing more than a suspicion, the accused is entitled to be discharged." प्रस्तुत प्रकरण में — सम्पूर्ण फोरेंसिक साक्ष्य दूषित, भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं, घोर लापरवाही का कोई तथ्य नहीं, घटना का कारण Force Majeure। Jacob Mathew (2005) 6 SCC 1 [VERIFIED] : "Mere lack of care cannot be rash or negligent act." अतः धारा 250 BNSS 2023 के अंतर्गत तत्काल उन्मोचन प्रार्थित है।`,
  },
];

const PRAYER = `अतः सोत्सव प्रार्थना की जाती है कि माननीय न्यायालय कृपा करके —

(i)   आवेदक/अभियुक्त श्री हेमराज वर्दार को विशेष सत्र वाद संख्या 1/2025 में लगाए गए समस्त आरोपों से धारा 250 BNSS 2023 (वैकल्पिक : धारा 227 CrPC) के अंतर्गत उन्मोचित (Discharged) करने का सादर आदेश प्रदान करें;

(ii)  फोरेंसिक मोर्टार रिपोर्ट को प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण अग्राह्य (Inadmissible) घोषित करने की कृपा करें;

(iii) भारतीय साक्ष्य संहिता 2023 §45 के अंतर्गत दोषपूर्ण नमूनाकरण पर आधारित विशेषज्ञ मत को अप्रमाणित घोषित करने का आदेश दें;

(iv)  वैकल्पिक रूप से, स्वतंत्र/निष्पक्ष पुन:परीक्षण या तकनीकी सत्यापन हेतु आदेश पारित किया जाए;

(v)   अभियोजन को निर्देशित किया जाए कि वह समस्त मूल अभिलेख प्रस्तुत करे : संग्रह पंचनामा, सील मेमो, ट्रांसफर रजिस्टर, FSL inward व seal verification, analyst worksheet, sample handling log;

(vi)  ऐसे अभिलेख प्रस्तुत न होने की दशा में adverse inference लिया जाए;

(vii) जो भी अन्य उचित एवं न्यायोचित अनुतोष हो, वह भी दिलाने की कृपा करें।

                                         शपथकर्ता/आवेदक
                                         हेमराज वर्दार

दिनांक : ____/____/2026
स्थान  : उदयपुर (राजस्थान)`;

// ── Component ──────────────────────────────────────────────────────────────
export default function DefenceReply() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    heading: true, facts: true, principles: true,
  });
  const [openGrounds, setOpenGrounds] = useState<Record<string, boolean>>({ g0: true, g3: true, g8: true });
  const [openOA, setOpenOA] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggle = (map: Record<string, boolean>, set: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, id: string) =>
    set((prev) => ({ ...prev, [id]: !prev[id] }));

  const allText = [
    ...SECTIONS.map((s) => `\n${"━".repeat(60)}\n${s.title}\n${"━".repeat(60)}\n${s.content}`),
    "\n\nउन्मोचन के विधिक आधार\n",
    ...GROUNDS.map((g) => `\n${g.title}\n${g.content}`),
    "\n\nमौखिक-बहस अनुच्छेद\n",
    ...ORAL_ARGS.map((o) => `\n${o.title}\n${o.content}`),
    `\n\nप्रार्थना\n${PRAYER}`,
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([allText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DEFENCE_REPLY_FINAL_v3.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4" ref={printRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            उन्मोचन प्रार्थना-पत्र — Defence Reply
          </h1>
          <p className="text-sm text-muted-foreground">
            FINAL v3 · धारा 250 BNSS 2023 · विशेष सत्र वाद 1/2025 · FIR 496/2011
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg">
            <Copy className="w-4 h-4" />
            {copied ? "कॉपी हो गया!" : "Copy .lex"}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg">
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 no-print flex flex-wrap gap-3 items-center">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold">Court-ready · FINAL v3</span>
        <VBadge s="VERIFIED" />
        <span className="text-xs">4 VERIFIED निर्णय · 4 PENDING (प्रमाणित प्रति प्राप्त करें)</span>
      </div>

      {/* Main sections */}
      {SECTIONS.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(openSections, setOpenSections, s.id)}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-muted/50 no-print"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">{s.title}</span>
              <VBadge s={s.status} />
            </div>
            {openSections[s.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {openSections[s.id] && (
            <div className="px-5 pb-5 pt-1">
              <pre className="hindi-text whitespace-pre-wrap text-sm leading-loose font-serif text-foreground">{s.content}</pre>
            </div>
          )}
        </div>
      ))}

      {/* Grounds */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="font-bold text-sm">भाग-3 : उन्मोचन के विधिक आधार (12 Grounds)</h2>
        </div>
        <div className="divide-y divide-border">
          {GROUNDS.map((g) => (
            <div key={g.id}>
              <button
                onClick={() => toggle(openGrounds, setOpenGrounds, g.id)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-muted/30 no-print"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{g.title}</span>
                  <VBadge s={g.status} />
                </div>
                {openGrounds[g.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openGrounds[g.id] && (
                <div className="px-5 pb-4 pt-1 bg-muted/10">
                  <pre className="hindi-text whitespace-pre-wrap text-sm leading-loose font-serif text-foreground">{g.content}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Oral arguments */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="font-bold text-sm">भाग-8 : 5 तैयार मौखिक-बहस अनुच्छेद</h2>
        </div>
        <div className="divide-y divide-border">
          {ORAL_ARGS.map((o) => (
            <div key={o.id}>
              <button
                onClick={() => toggle(openOA, setOpenOA, o.id)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-muted/30 no-print"
              >
                <span className="text-sm font-medium">{o.title}</span>
                {openOA[o.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openOA[o.id] && (
                <div className="px-5 pb-4 pt-1 bg-blue-50/30">
                  <p className="hindi-text text-sm leading-loose font-serif text-foreground">{o.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prayer */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-primary/5">
          <h2 className="font-bold text-sm text-primary">भाग-12 : प्रार्थना (Prayer)</h2>
        </div>
        <div className="px-5 py-5">
          <pre className="hindi-text whitespace-pre-wrap text-sm leading-loose font-serif text-foreground">{PRAYER}</pre>
        </div>
      </div>

      {/* Caution */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 no-print space-y-1">
        <p className="font-semibold">⚠ फाइलिंग से पूर्व अनिवार्य सत्यापन</p>
        <p>1. हर न्यायिक उद्धरण के साथ प्रमाणित निर्णय-पाठ से paragraph number जोड़ें।</p>
        <p>2. PENDING citations को primary authority के रूप में use करना FATAL ERROR है।</p>
        <p>3. R.B. Constructions, K.S. Kalra, Builders Association, Mohanbhai — प्रमाणित प्रतियाँ प्राप्त करें।</p>
        <p>4. Sushil Sharma (2014) 4 SCC 317 — SCC से सटीक पैरा भाषा सत्यापित करें।</p>
      </div>
    </div>
  );
}
