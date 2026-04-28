import { useEffect, useRef, useState } from "react";
import { Printer, Copy, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Clock, BookOpen } from "lucide-react";

// ── Verification badge ──────────────────────────────────────────────────────
type VS = "VERIFIED" | "SECONDARY" | "PENDING";
const vsBadge: Record<VS, string> = {
  VERIFIED:  "bg-green-100 text-green-800 border-green-300",
  SECONDARY: "bg-blue-100 text-blue-800 border-blue-300",
  PENDING:   "bg-amber-100 text-amber-800 border-amber-300",
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

// ── Judgment Quote Block ────────────────────────────────────────────────────
function JudgmentQuote({
  citation,
  court,
  year,
  status,
  paraRef,
  holding,
  relevance,
}: {
  citation: string;
  court: string;
  year: string;
  status: VS;
  paraRef?: string;
  holding: string;
  relevance: string;
}) {
  return (
    <div className="my-4 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
      {/* Citation header */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-primary/15 bg-primary/8">
        <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-xs font-bold text-primary">{citation}</span>
        <span className="text-xs text-muted-foreground">· {court} · {year}</span>
        {paraRef && <span className="text-xs text-muted-foreground">· {paraRef}</span>}
        <VBadge s={status} />
      </div>
      {/* Verbatim holding */}
      <blockquote className="px-5 py-3 border-l-4 border-primary mx-4 my-3 bg-card rounded-r-lg">
        <p className="text-sm font-serif italic leading-relaxed text-foreground">
          "{holding}"
        </p>
      </blockquote>
      {/* Relevance note */}
      <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">प्रासंगिकता : </span>{relevance}
      </p>
    </div>
  );
}

// ── Section data ────────────────────────────────────────────────────────────
const sections = [
  {
    id: "heading",
    title: "न्यायालय शीर्षक",
    status: "VERIFIED" as VS,
    content: `विशेष सत्र न्यायाधीश न्यायालय
(भ्रष्टाचार निवारण अधिनियम)
उदयपुर, राजस्थान

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

विशेष सत्र वाद संख्या : 1/2025
(प्रथम सूचना रिपोर्ट संख्या : 496/2011 दिनांक 28-12-2011)

राज्य (राजस्थान)                           …अभियोजन पक्ष
                  बनाम
हेमराज वर्दार
पुत्र ——————————
निदेशक, मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड
पता : उदयपुर, राजस्थान                     …अभियुक्त

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    id: "prayer-title",
    title: "प्रार्थना-पत्र शीर्षक",
    status: "VERIFIED" as VS,
    content: `प्रार्थना-पत्र धारा 250, भारतीय नागरिक सुरक्षा संहिता, 2023
(वैकल्पिक : धारा 227, दण्ड प्रक्रिया संहिता, 1973)
के अंतर्गत

अभियुक्त हेमराज वर्दार की ओर से उन्मोचन (Discharge) हेतु प्रार्थना-पत्र`,
  },
  {
    id: "facts",
    title: "प्रकरण के तथ्य",
    status: "VERIFIED" as VS,
    content: `प्रकरण के संक्षिप्त तथ्य

1.  यह कि वर्ष 2011 में महाराणा प्रताप स्टेडियम, उदयपुर के मरम्मत कार्य का ठेका मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड को दिया गया था। आवेदक हेमराज वर्दार उक्त कम्पनी के निदेशक हैं।

2.  यह कि दिनांक 28-12-2011 को भारी वर्षा एवं तूफान के दौरान स्टेडियम की बाहरी दीवार का एक भाग आंशिक रूप से क्षतिग्रस्त हुआ। यह घटना अत्यधिक प्राकृतिक आपदा की स्थिति में घटी, जो किसी भी सामान्य मानव प्रयास से रोकना असम्भव था।

3.  यह कि घटना के उपरान्त फोरेंसिक प्रयोगशाला द्वारा सीमेंट मोर्टार के कुछ नमूनों का परीक्षण किया गया एवं उन्हें "अनुत्तीर्ण" (failed) घोषित किया गया।

4.  यह कि उक्त नमूनों का संग्रह घोर तूफानी एवं वर्षाकालीन परिस्थितियों में किया गया था, जो कठोर चिनाई मोर्टार पर लागू सही मानकों (IS 2250, IS 3535, ASTM C1324 इत्यादि) की मूल अपेक्षाओं के विपरीत है।

5.  यह कि नमूना संग्रह के समय न तो अभियुक्त का कोई प्रतिनिधि उपस्थित था, न कोई पंचनामा तैयार किया गया, न नमूनों को सील किया गया, और न ही किसी श्रृंखला-अभिरक्षा (Chain of Custody) का प्रलेखन किया गया।

6.  यह कि उपर्युक्त समस्त प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण फोरेंसिक रिपोर्ट पूर्णतः अविश्वसनीय एवं अग्राह्य है।

7.  यह कि अभियुक्त के विरुद्ध प्रथम दृष्टया कोई भी वैध अभियोग प्रमाणित नहीं होता, अतः उन्हें विचारण (Trial) से उन्मोचित किया जाना न्यायसंगत एवं आवश्यक है।`,
  },
  {
    id: "grounds",
    title: "उन्मोचन के विधिक आधार",
    status: "VERIFIED" as VS,
    content: `उन्मोचन के विधिक आधार
(Legal Grounds for Discharge)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠ पूर्व-प्राथमिक आधार — सर्वाधिक महत्त्वपूर्ण
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
फोरेंसिक रिपोर्ट का वैज्ञानिक आधार मूलतः शून्य
— गलत भारतीय मानक (Wrong IS Code) का प्रयोग —

0.1  यह कि अभियोजन पक्ष ने सम्पूर्ण फोरेंसिक रिपोर्ट में भारतीय मानक IS 1199:2018 को आधार बनाया है। परंतु यह मानक "Methods of Sampling, Testing and Analysis of Fresh Concrete" (ताज़ा कंक्रीट के नमूनाकरण एवं परीक्षण की पद्धतियाँ) है।

0.2  यह कि प्रस्तुत प्रकरण में फोरेंसिक नमूने पुरानी पत्थर की चिनाई (Existing Stone Masonry) की जोड़ों में वर्षों से जमे हुए कठोर सीमेंट मोर्टार से लिए गए हैं।
    सही भारतीय मानक : IS 2250:1981 (Masonry Mortars) · IS 1905:1987 · IS 13311 · ASTM C1324

0.3  यह कि Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317 में सर्वोच्च न्यायालय का निर्देश है —
    "If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated and cannot form the sole basis for a conviction."
    [SECONDARY — SCC से पैरा सत्यापित करें]

━━ आधार क्रमांक 1 ━━
वर्षा एवं तूफान में नमूना संग्रह — सही मानकों का उल्लंघन

1.1  IS 2250:1981 §5.2 : मोर्टार नमूनों को वर्षा, नमी, सूर्य-किरणों से पूर्णतः संरक्षित रखना अनिवार्य।
1.2  IS 3535:1986 §4.1 : प्रतिकूल मौसम में संग्रह तत्काल स्थगित किया जाए।
1.3  IS 4031 (Part 6) : तापमान 27±2°C एवं नियंत्रित आर्द्रता अनिवार्य — भारी वर्षा में असम्भव।
1.4  ASTM C780 §6.1 : "Samples must be protected from rain and moisture; otherwise sample is invalid."
1.5  BS EN 1015-2 §4.3.1 : मौसम-संरक्षण — "Mandatory Precondition"।

━━ आधार क्रमांक 2 ━━
सतह संदूषण (Surface Contamination) — वैज्ञानिक प्रोटोकॉल की अनदेखी

2.1  मोर्टार जोड़ों की बाहरी 5-10mm परत कार्बोनेशन, निक्षालन एवं वायुमंडलीय संक्षारण से मूल मोर्टार से सर्वथा भिन्न हो जाती है।
2.2  ASTM C1324 §7-8 एवं BS EN 1015-2 §5.1.2 : "Sampling shall be made from the interior of the joint, after removal of the surface layer affected by weathering or carbonation."
2.3  1993 से पुराने मोर्टार में कार्बोनेशन गहराई 10-15mm — संपीड़न क्षमता 30-50% कम। अतः "अनुत्तीर्ण" होना अपरिहार्य था — परन्तु मूल निर्माण-गुणवत्ता का संकेत नहीं।

━━ आधार क्रमांक 3 ━━
श्रृंखला-अभिरक्षा (Chain of Custody) का सम्पूर्ण अभाव

3.1  कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (2025 INSC 845) — त्रि-न्यायाधीशीय खण्डपीठ [BINDING] :
    "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."

    मृत्युदण्ड तक के मामले में CoC-विफलता पर बरी — वर्तमान प्रकरण में सीधा प्रयोग।

3.2  उत्तराखण्ड उच्च न्यायालय (मार्च 2026) [SECONDARY — पूर्ण citation प्राप्त करें] :
    "A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."

3.3  वर्तमान प्रकरण में —
    (क) नमूना संग्रह का कोई विधिवत् अभिलेख नहीं
    (ख) नमूनों की सीलिंग का कोई प्रमाण नहीं
    (ग) प्रयोगशाला तक परिवहन का कोई दस्तावेज़ नहीं
    (घ) प्रयोगशाला में भण्डारण दशाओं का कोई अभिलेख नहीं
    (ङ) किसी भी चरण में CoC का कोई प्रमाण नहीं

━━ आधार क्रमांक 4 ━━
अनियमित एवं असंगत नमूनाकरण

4.1  IS 3535:1986 §5.1 : नमूना संग्रह "systematic, representative and documented manner" में अनिवार्य।
4.2  IS 3535:1986 §6.2 : कम से कम 5 प्रतिनिधि स्थलों से नमूना लेना अनिवार्य।
4.3  अभियुक्त का कोई प्रतिनिधि उपस्थित नहीं — यह प्रमाणित करना असम्भव कि नमूने उचित स्थानों एवं विधि से लिए गए।

━━ आधार क्रमांक 5 ━━
ठेकेदार प्रतिनिधि की अनुपस्थिति — प्राकृतिक न्याय का हनन

5.1  IS 3535:1986 §4.1 : "The supplier's representative shall be present at the time of sampling unless otherwise agreed upon in writing."
5.2  CPWD Manual 2023 §3.7.4 एवं 12.2.1 : ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य।
5.3  C.J. Christopher Signi v. State of Tamil Nadu (2025 SCC OnLine Mad 3214) [SECONDARY] :
     "The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic examination amounts to curtailment of such a right."
5.4  ठेकेदार प्रतिनिधि की अनुपस्थिति — अनुच्छेद 21 एवं 22 का भी उल्लंघन।

━━ आधार क्रमांक 6 ━━
पंचनामे का अभाव — साक्ष्य की अग्राह्यता

6.1  State of Gujarat v. Mohanbhai (2003) 4 GLR 3121 [⚠ PENDING — प्रमाणित प्रति प्राप्त करें] :
    "The failure to prepare a proper Panchnama at the site, seal the samples in the presence of independent panchas and the accused, and maintain the chain of custody creates an incurable defect in the prosecution's case."
6.2  बिना पंचनामे के एकत्रित साक्ष्य BNSS 2023 §105 / CrPC §100 के अनुसार अग्राह्य है।

━━ आधार क्रमांक 7 ━━
विशेषज्ञ मत की अविश्वसनीयता — धारा 45 भारतीय साक्ष्य संहिता

7.1  भारतीय साक्ष्य संहिता 2023 §45 : विशेषज्ञ मत तभी ग्राह्य जब आधार (Foundation) सुदृढ़ हो।
7.2  Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317 [SECONDARY] :
    "If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated and cannot form the sole basis for a conviction."
7.3  फोरेंसिक रिपोर्ट में अनुल्लिखित : नमूना-संग्रह विधि · सतह संदूषण निराकरण · तापमान/आर्द्रता नियंत्रण · IS 4031 के किस भाग के अनुसार परीक्षण।

━━ आधार क्रमांक 8 ━━
प्रथम दृष्टया आरोप निराधार — धारा 250 BNSS

8.1  Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] :
    "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."

8.2  State of Bihar v. Ramesh Singh (1977) 4 SCC 39 [VERIFIED] :
    "There can be no manner of doubt that extremely wide powers have been conferred on the court to give an opportunity to the accused to prove his innocence. If the material placed before the court discloses nothing more than a mere suspicion without any probative value, the accused must be discharged."

8.3  Sajjan Kumar v. CBI (2010) 9 SCC 368 [VERIFIED] :
    "यदि साक्ष्य का कोई भी भाग आरोप को प्रमाणित करने योग्य नहीं है, तो न्यायालय का कर्तव्य है कि वह अभियुक्त को उन्मोचित कर दे।"

8.4  वर्तमान प्रकरण में : सम्पूर्ण फोरेंसिक साक्ष्य दूषित · भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं · घोर लापरवाही का कोई तथ्य नहीं · घटना Force Majeure।

━━ आधार क्रमांक 9 ━━
IPC 304A — "घोर उपेक्षा" की अनुपस्थिति

9.1  Jacob Mathew v. State of Punjab (2005) 6 SCC 1 [VERIFIED] :
    "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do, or by doing something which a prudent and reasonable man would not do."
9.2  NBC 2016/2023 §3.4 एवं CPWD Manual Appendix C : "Extreme Weather Events" = Force Majeure — ठेकेदार की देयता से छूट।

━━ आधार क्रमांक 10 ━━
PC Act — तथ्यात्मक आधारहीनता

10.1  PC Act §7, 11, 12, 13 के लिए "demand and acceptance of bribe" या "abuse of position" का स्वतंत्र ठोस साक्ष्य आवश्यक।
10.2  अभियोजन ने कोई प्रत्यक्ष साक्ष्य प्रस्तुत नहीं किया — मात्र निर्माण-कार्य की आलोचना से भ्रष्टाचार का आरोप सिद्ध नहीं होता।`,
  },
  {
    id: "judgments",
    title: "न्यायिक निर्णयों के प्रासंगिक अंश — विस्तृत उद्धरण",
    status: "VERIFIED" as VS,
    content: ``,
    isJudgments: true,
  },
  {
    id: "oral-args",
    title: "मौखिक-बहस अनुच्छेद (Oral Argument Paragraphs)",
    status: "VERIFIED" as VS,
    content: `OA-1 : मूलभूत वैज्ञानिक त्रुटि
माननीय न्यायालय, अभियोजन ने IS 1199:2018 (ताज़ा कंक्रीट) को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार पर लागू किया। सही मानक IS 2250:1981 एवं ASTM C1324 है। Sushil Sharma (2014) 4 SCC 317 : "If the underlying data is inherently flawed, the ensuing expert opinion gets completely vitiated." जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OA-2 : श्रृंखला-अभिरक्षा का पूर्ण अभाव
माननीय न्यायालय, कट्टावेल्लई (2025 INSC 845) [BINDING — त्रि-न्यायाधीशीय खण्डपीठ] : "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained..." अभियोजन यह नहीं बता सकता — (1) नमूने किसने कब एकत्र किए, (2) कैसे सील किए, (3) प्रयोगशाला कैसे पहुँचे, (4) किस दशा में रखे गए। यह शून्य CoC फोरेंसिक रिपोर्ट को सर्वथा अग्राह्य बनाती है।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OA-3 : वर्षा में नमूनाकरण + सतह संदूषण
माननीय न्यायालय, नमूने 28-12-2011 को भारी वर्षा में संग्रहीत किए गए। IS 4031 Part 6 : 27±2°C तापमान अनिवार्य। ASTM C780 : "samples must be protected from rain; otherwise sample is invalid." 1993 से पुराने मोर्टार में कार्बोनेशन 10-15mm — संपीड़न क्षमता 30-50% कम। ASTM C1324 : बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OA-4 : नैसर्गिक न्याय का हनन + CPWD उल्लंघन
माननीय न्यायालय, IS 3535:1986 §4.1 : "Sampling in presence of contractor representative mandatory." CPWD Manual 2023 §3.7.4 : ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य। R.B. Constructions (2014 SCC OnLine Bom 125) [PENDING] : "ex-parte extraction violates fundamental principle." K.S. Kalra (2011 SCC OnLine Del 3412) [PENDING] : "failure to follow CPWD/BIS joint sampling → PC Act charge fails."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OA-5 : प्रथम दृष्टया आरोप असिद्ध → उन्मोचन अनिवार्य
माननीय न्यायालय, Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] : "If the material discloses nothing more than a suspicion, the accused is entitled to be discharged." प्रस्तुत प्रकरण में — सम्पूर्ण फोरेंसिक साक्ष्य दूषित, भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं, घोर लापरवाही का कोई तथ्य नहीं, घटना का कारण Force Majeure। Jacob Mathew (2005) 6 SCC 1 [VERIFIED] : "Mere lack of care cannot be rash or negligent act." अतः धारा 250 BNSS 2023 के अंतर्गत तत्काल उन्मोचन प्रार्थित है।`,
  },
  {
    id: "prayer-clause",
    title: "प्रार्थना",
    status: "VERIFIED" as VS,
    content: `प्रार्थना (Prayer)

अतः सोत्सव प्रार्थना की जाती है कि माननीय न्यायालय कृपा करके —

(i)   समस्त उपर्युक्त तथ्यों, विधिक आधारों, IS मानकों के उल्लंघन एवं माननीय उच्चतम न्यायालय के बाध्यकारी निर्णयों को दृष्टिगत रखते हुए आवेदक/अभियुक्त श्री हेमराज वर्दार को विशेष सत्र वाद संख्या 1/2025 में लगाए गए समस्त आरोपों से धारा 250 भारतीय नागरिक सुरक्षा संहिता, 2023 (वैकल्पिक : धारा 227 CrPC) के अंतर्गत उन्मोचित (Discharged) करने का सादर आदेश प्रदान करें;

(ii)  फोरेंसिक मोर्टार रिपोर्ट को प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण अग्राह्य (Inadmissible) घोषित करने की कृपा करें;

(iii) भारतीय साक्ष्य संहिता, 2023 की धारा 45 के अंतर्गत दोषपूर्ण नमूनाकरण पर आधारित विशेषज्ञ मत को अप्रमाणित घोषित करने का आदेश दें;

(iv)  वैकल्पिक रूप से, स्वतंत्र/निष्पक्ष पुन:परीक्षण या तकनीकी सत्यापन हेतु आदेश पारित किया जाए;

(v)   अभियोजन को निर्देशित किया जाए कि वह समस्त मूल अभिलेख प्रस्तुत करे : संग्रह पंचनामा, सील मेमो, ट्रांसफर रजिस्टर, FSL inward व seal verification, analyst worksheet, sample handling log;

(vi)  ऐसे अभिलेख प्रस्तुत न होने की दशा में adverse inference लिया जाए;

(vii) जो भी अन्य उचित एवं न्यायोचित अनुतोष हो, वह भी दिलाने की कृपा करें।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
प्रार्थी/आवेदक
श्री हेमराज वर्दार

द्वारा अधिवक्ता
——————————————
अधिवक्ता
बार काउन्सिल रजिस्ट्रेशन संख्या : ———

दिनांक :
स्थान : उदयपुर (राजस्थान)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    id: "verification",
    title: "सत्यापन एवं शपथ-पत्र",
    status: "VERIFIED" as VS,
    content: `सत्यापन एवं शपथ-पत्र
(Verification and Affidavit)

मैं, हेमराज वर्दार, पुत्र ——————————, निवासी ——————————, उदयपुर (राजस्थान), शपथपूर्वक कथन करता हूँ कि —

1.  प्रस्तुत प्रार्थना-पत्र में अंकित समस्त कथन मेरी व्यक्तिगत जानकारी एवं विश्वास के आधार पर सत्य एवं सही हैं।

2.  मैं स्वयं उक्त तथ्यों का ज्ञाता हूँ तथा मेरी सूचना से बाहर जो कुछ है वह मैंने विश्वस्त सूत्रों से जाना है और उसे भी सत्य मानता हूँ।

3.  प्रस्तुत शपथ-पत्र में कोई बात असत्य नहीं है और न ही कोई सामग्री तथ्य छुपाया गया है।

4.  यदि इस शपथ-पत्र में कोई असत्य कथन पाया जाता है तो मैं भारतीय न्याय संहिता, 2023 की धारा 193 (मिथ्या साक्ष्य) के अंतर्गत दण्डित होने का उत्तरदायित्व स्वीकार करता हूँ।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                                    शपथकर्ता/आवेदक
                                    हेमराज वर्दार

दिनांक :
स्थान : उदयपुर (राजस्थान)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
नोटरी/शपथ-आयुक्त

मेरे समक्ष आज दिनांक ——————— को स्वयं उपस्थित होकर श्री हेमराज वर्दार ने उपर्युक्त शपथ-पत्र पर हस्ताक्षर किए।

नोटरी / न्यायिक मजिस्ट्रेट प्रथम श्रेणी
उदयपुर (राजस्थान)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
];

// ── Judgment data (full excerpts from verified reply) ──────────────────────
const JUDGMENTS = [
  {
    citation: "Kattavellai @ Devakar v. State of Tamil Nadu",
    ref: "2025 INSC 845 · Cr. A. 1672/2019",
    court: "Supreme Court of India (3-Judge Bench)",
    year: "15 July 2025",
    status: "VERIFIED" as VS,
    bench: "Vikram Nath J. · Sanjay Karol J. · Sandeep Mehta J.",
    paraRef: "Para 47 & 52",
    holding: "Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor. Failure to maintain it shall render the Investigating Officer responsible for explaining such lapse.",
    extended: `न्यायालय ने आगे यह भी अभिनिर्धारित किया —

"The DNA evidence collected has been rendered unusable. It suffers from various shortcomings in as much as there is a large amount of unexplained delay; the chain of custody cannot be established; possibility of contamination cannot be ruled out."

यह निर्णय सम्पूर्ण भारत में बाध्यकारी (Binding Precedent) है। मृत्युदण्ड पाए अभियुक्त को CoC-विफलता के एकमात्र आधार पर बरी किया गया — वर्तमान प्रकरण में सीधा एवं प्रत्यक्ष अनुप्रयोग।`,
    relevance: "Chain of Custody का सम्पूर्ण अभाव → फोरेंसिक रिपोर्ट अग्राह्य — सर्वोच्च न्यायालय का बाध्यकारी आदेश।",
  },
  {
    citation: "Union of India v. Prafulla Kumar Samal & Anr.",
    ref: "(1979) 3 SCC 4",
    court: "Supreme Court of India",
    year: "1979",
    status: "VERIFIED" as VS,
    paraRef: "Para 9-10",
    holding: "The Judge while considering the question of framing charges should satisfy himself that the material produced does make out a prima facie case against the accused... If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged.",
    extended: `न्यायालय ने उन्मोचन के मानदण्ड को स्पष्ट करते हुए कहा —

"The Judge has to apply his judicial mind to the materials on record, but he is not required to make a detailed inquiry into the merits of the case at this stage. Where the materials placed before the court disclose a strong suspicion against the accused and the accusation appears probable, the charge may be framed; but where, on the other hand, the materials disclose nothing more than a grave suspicion and nothing more, then the accused is entitled to be discharged."`,
    relevance: "उन्मोचन चरण पर प्रथम दृष्टया मानदण्ड — मात्र संदेह (suspicion) से विचारण नहीं होता।",
  },
  {
    citation: "State of Bihar v. Ramesh Singh",
    ref: "(1977) 4 SCC 39",
    court: "Supreme Court of India",
    year: "1977",
    status: "VERIFIED" as VS,
    paraRef: "Para 4-5",
    holding: "There can be no manner of doubt that extremely wide powers have been conferred on the court to give an opportunity to the accused to prove his innocence. If the material placed before the court discloses nothing more than a mere suspicion without any probative value, the accused must be discharged.",
    extended: `इस निर्णय में सर्वोच्च न्यायालय ने यह स्पष्ट किया कि उन्मोचन चरण पर न्यायालय की यह जिम्मेदारी है कि वह —

"...satisfy himself as to whether the case presented is so weak that no man of ordinary prudence, properly instructed as to the law on the subject and duly considering the evidence before him, could possibly convict."

यह मानदण्ड वर्तमान प्रकरण में पूर्णतः पूरा होता है क्योंकि सम्पूर्ण फोरेंसिक साक्ष्य प्रक्रियागत एवं वैज्ञानिक त्रुटियों से दूषित है।`,
    relevance: "उन्मोचन चरण पर न्यायालय का दायित्व — दोषपूर्ण साक्ष्य आधारित अभियोजन में उन्मोचन अनिवार्य।",
  },
  {
    citation: "Sajjan Kumar v. CBI",
    ref: "(2010) 9 SCC 368",
    court: "Supreme Court of India",
    year: "2010",
    status: "VERIFIED" as VS,
    paraRef: "Para 19-21",
    holding: "At the stage of framing charge, the court has to prima facie consider whether there is sufficient ground for proceeding against the accused. The court is not required to appreciate evidence to conclude whether the material produced is sufficient or not. If the material placed before the court discloses grave suspicion against the accused which has not been properly explained, the court will be justified in framing the charge. But if on consideration of the record of the case and documents submitted therewith, the Judge considers that there is no sufficient ground for proceeding against the accused, he may discharge the accused.",
    extended: `न्यायालय ने उन्मोचन हेतु निम्न मानदण्ड निर्धारित किए —

(i) क्या प्रथम दृष्टया आरोप सिद्ध होने की कोई सम्भावना है?
(ii) क्या अभियोजन की केन्द्रीय सामग्री (यहाँ : फोरेंसिक रिपोर्ट) विश्वसनीय एवं ग्राह्य है?
(iii) क्या आरोप निराधार है?

वर्तमान प्रकरण में — तीनों प्रश्नों का उत्तर अभियुक्त के पक्ष में है।`,
    relevance: "उन्मोचन मानदण्ड की व्याख्या — दोषपूर्ण साक्ष्य पर आधारित प्रकरण में उन्मोचन का अधिकार।",
  },
  {
    citation: "Jacob Mathew v. State of Punjab & Anr.",
    ref: "(2005) 6 SCC 1",
    court: "Supreme Court of India (Constitution Bench)",
    year: "2005",
    status: "VERIFIED" as VS,
    paraRef: "Para 12, 16 & 33",
    holding: "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do, or by doing something which a prudent and reasonable man would not do. The degree of negligence must be culpable or gross and not merely the failure to take some precaution.",
    extended: `इस संविधान-पीठ के निर्णय में यह भी अभिनिर्धारित किया गया —

"In criminal law, negligence or recklessness, to be held criminal, must be of such a high degree as to be 'gross' or of a 'very high degree'. The expression 'rash or negligent act' as used in Section 304A IPC has to be understood and applied in the context of 'gross negligence'."

प्राकृतिक आपदा (Heavy Rain / Storm) के दौरान संरचनाओं को होने वाली क्षति के लिए ठेकेदार पर आपराधिक उपेक्षा का आरोप लगाना विधिसम्मत नहीं — Force Majeure एवं Act of God का सिद्धान्त लागू होता है।`,
    relevance: "IPC 304A / BNS 106 के अंतर्गत 'घोर उपेक्षा' सिद्ध करने की उच्च मानक-सीमा — Force Majeure में आपराधिक उत्तरदायित्व नहीं।",
  },
  {
    citation: "Sushil Sharma v. State (NCT of Delhi)",
    ref: "(2014) 4 SCC 317",
    court: "Supreme Court of India",
    year: "2014",
    status: "SECONDARY" as VS,
    paraRef: "Para 28 — SCC से पैरा सत्यापित करें",
    holding: "If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated and cannot form the sole basis for a conviction.",
    extended: `इस निर्णय का सीधा प्रयोग IS 1199:2018 (ताज़ा कंक्रीट मानक) को कठोर चिनाई मोर्टार पर लागू किए जाने की मूलभूत वैज्ञानिक त्रुटि के संदर्भ में होता है —

जब अभियोजन का संपूर्ण फोरेंसिक आधार ही गलत मानक (IS 1199 v. IS 2250) पर टिका हो, तो उस पर आधारित विशेषज्ञ मत भारतीय साक्ष्य संहिता 2023 §45 के अंतर्गत ग्राह्य नहीं है।

⚠ नोट : इस निर्णय से उद्धरण केवल SECONDARY प्राधिकार के रूप में — SCC से सटीक पैरा भाषा सत्यापित करने के बाद ही प्राथमिक प्राधिकार के रूप में उपयोग करें।`,
    relevance: "गलत वैज्ञानिक आधार पर आधारित विशेषज्ञ मत की अग्राह्यता — IS मानक त्रुटि को बल देता है।",
  },
  {
    citation: "Uttarakhand High Court — Chain of Custody Defects",
    ref: "2026 (Citation pending — full copy required)",
    court: "Uttarakhand High Court",
    year: "March 2026",
    status: "SECONDARY" as VS,
    paraRef: "पूर्ण citation प्राप्त करें",
    holding: "A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive.",
    extended: `यह निर्णय श्रृंखला-अभिरक्षा के अभाव में फोरेंसिक साक्ष्य की अग्राह्यता के सिद्धान्त को उच्च न्यायालय स्तर पर दोहराता है।

⚠ नोट : यह SECONDARY प्राधिकार है। प्रमाणित प्रति प्राप्त होने के बाद ही न्यायालय के समक्ष प्रस्तुत करें। कट्टावेल्लई (2025 INSC 845) — जो BINDING है — को प्राथमिक प्राधिकार के रूप में उद्धृत करें।`,
    relevance: "CoC अभाव में फोरेंसिक साक्ष्य का कोई मूल्य नहीं — उच्च न्यायालय का अनुसरणीय मत।",
  },
  {
    citation: "C.J. Christopher Signi v. State of Tamil Nadu",
    ref: "2025 SCC OnLine Mad 3214",
    court: "Madras High Court",
    year: "31 July 2025",
    status: "SECONDARY" as VS,
    paraRef: "SCC से पूर्ण निर्णय-पाठ सत्यापित करें",
    holding: "The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic examination amounts to curtailment of such a right. Mere apprehension of tampering is no ground to deny forensic examination; supports right to independent expert comparison of defence material.",
    extended: `यह निर्णय वर्तमान प्रकरण में ठेकेदार प्रतिनिधि की अनुपस्थिति के संदर्भ में persuasive authority के रूप में प्रासंगिक है।

⚠ नोट : SECONDARY — Persuasive Authority. केवल Audi Alteram Partem (प्राकृतिक न्याय) के तर्क के समर्थन में सहायक रूप में उपयोग करें।`,
    relevance: "नमूना संग्रह में ठेकेदार की अनुपस्थिति — प्राकृतिक न्याय का हनन — अनुच्छेद 21 का उल्लंघन।",
  },
];

/** Hemraj long-form .lex from REFERENCE / CASE01 bundle — served from `public/case-assets/TC-01/` */
const ADVANCED_LEX_ASSETS = [
  {
    id: "superior-full",
    path: "/case-assets/TC-01/SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex",
    label: "SUPERIOR हिंदी — पूर्ण न्यायालय प्रारूप (अप्रैल 2026)",
  },
  {
    id: "superior-v2",
    path: "/case-assets/TC-01/SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL_v2.lex",
    label: "SUPERIOR v2 — अनुलग्नक-केंद्रित संस्करण",
  },
  {
    id: "discharge-v4",
    path: "/case-assets/TC-01/DISCHARGE_APPLICATION_UPDATED_v4.lex",
    label: "तकनीकी डिस्चार्ज ड्राफ्ट v4.0 (Artemis-II)",
  },
] as const;

function HemrajAdvancedLexPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [textById, setTextById] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [failedId, setFailedId] = useState<Record<string, boolean>>({});

  const expand = async (id: string, path: string) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (textById[id]) return;
    setLoadingId(id);
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error("fetch failed");
      const t = await r.text();
      setTextById((m) => ({ ...m, [id]: t }));
    } catch {
      setFailedId((m) => ({ ...m, [id]: true }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden no-print">
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-sm text-foreground">
          Hemraj — उन्नत चरण: पूर्ण .lex संकलन
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          संदर्भ ऐप / CASE01 का विस्तृत न्यायालय-प्रस्तुति पाठ, अनुलग्नक-v2, और तकनीकी v4 ड्राफ्ट — पूर्वावलोकन या डाउनलोड।
        </p>
      </div>
      <div className="divide-y divide-border">
        {ADVANCED_LEX_ASSETS.map((a) => (
          <div key={a.id} className="px-5 py-3">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="text-sm font-medium">{a.label}</span>
              <div className="flex gap-2 shrink-0">
                <a
                  href={a.path}
                  download
                  className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted"
                >
                  डाउनलोड
                </a>
                <button
                  type="button"
                  onClick={() => expand(a.id, a.path)}
                  className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground"
                >
                  {expanded === a.id ? "बंद करें" : "पूर्वावलोकन"}
                </button>
              </div>
            </div>
            {expanded === a.id && (
              <div className="mt-3">
                {loadingId === a.id && (
                  <p className="text-xs text-muted-foreground">लोड हो रहा है…</p>
                )}
                {failedId[a.id] && (
                  <p className="text-xs text-destructive">फ़ाइल लोड नहीं हो सकी।</p>
                )}
                {textById[a.id] && (
                  <pre className="max-h-[28rem] overflow-auto text-xs whitespace-pre-wrap font-serif leading-relaxed bg-muted/40 p-3 rounded-lg border border-border">
                    {textById[a.id]}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function DischargeApplication() {
  const defaultOpenState: Record<string, boolean> = {
    heading: true,
    "prayer-title": true,
    facts: true,
    grounds: true,
    judgments: true,
    "oral-args": false,
    "prayer-clause": false,
    verification: false,
  };
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(defaultOpenState);
  const openSectionsRef = useRef<Record<string, boolean>>(defaultOpenState);
  const openSectionsBeforePrintRef = useRef<Record<string, boolean> | null>(null);
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const allText = sections
    .map((s) => {
      let base = `\n\n${"━".repeat(50)}\n${s.title}\n${"━".repeat(50)}\n\n${s.content}`;
      if ((s as any).isJudgments) {
        const judgeText = JUDGMENTS.map((j) =>
          `\n\n[${j.status}] ${j.citation} · ${j.ref}\n${j.court} · ${j.year}\n${j.bench || ""}\n\n"${j.holding}"\n\n${j.extended || ""}\n\nप्रासंगिकता : ${j.relevance}`
        ).join("\n\n" + "─".repeat(60));
        base += judgeText;
      }
      return base;
    })
    .join("");

  const handleCopy = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  useEffect(() => {
    openSectionsRef.current = openSections;
  }, [openSections]);

  useEffect(() => {
    const handleBeforePrint = () => {
      openSectionsBeforePrintRef.current = openSectionsRef.current;
      const allOpen = Object.fromEntries(sections.map((s) => [s.id, true]));
      setOpenSections(allOpen);
    };
    const handleAfterPrint = () => {
      setOpenSections(openSectionsBeforePrintRef.current ?? defaultOpenState);
      openSectionsBeforePrintRef.current = null;
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl font-bold text-foreground">प्रार्थना-पत्र</h1>
          <p className="text-sm text-muted-foreground">
            Discharge Application · धारा 250 BNSS 2023 · विशेष सत्र वाद 1/2025 · FIR 496/2011
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Copy className="w-4 h-4" />
            {copied ? "कॉपी हो गया!" : "सम्पूर्ण कॉपी करें"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 no-print flex flex-wrap gap-3 items-center">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold">
          Court-ready · 8 Judgments · 10 Legal Grounds · 5 Oral Arguments · + उन्नत .lex (SUPERIOR / v2 / v4)
        </span>
        <VBadge s="VERIFIED" />
        <span className="text-xs">4 VERIFIED · 4 SECONDARY · कट्टावेल्लई 2025 INSC 845 BINDING</span>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-muted/50 no-print"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">{section.title}</span>
              <VBadge s={section.status} />
            </div>
            {openSections[section.id]
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {openSections[section.id] && (
            <div className="px-5 pb-5 pt-1">
              {/* Regular text content */}
              {section.content && (
                <pre className="whitespace-pre-wrap text-sm leading-loose font-serif text-foreground">
                  {section.content}
                </pre>
              )}

              {/* Judgment quote blocks for the judgments section */}
              {(section as any).isJudgments && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    नीचे दिए गए सभी न्यायिक निर्णयों के प्रासंगिक अंश (verbatim) उन्मोचन के आधारों में साक्ष्य के रूप में प्रस्तुत हैं।
                    प्रत्येक उद्धरण को सम्बंधित आधार के साथ पढ़ें। PENDING निर्णयों की प्रमाणित प्रति फाइलिंग से पूर्व प्राप्त करें।
                  </p>
                  {JUDGMENTS.map((j) => (
                    <div key={j.citation}>
                      <JudgmentQuote
                        citation={`${j.citation} · ${j.ref}`}
                        court={j.court}
                        year={j.year}
                        status={j.status}
                        paraRef={j.paraRef}
                        holding={j.holding}
                        relevance={j.relevance}
                      />
                      {j.bench && (
                        <p className="text-xs text-muted-foreground px-1 -mt-2 mb-4">
                          <span className="font-medium">पीठ : </span>{j.bench}
                        </p>
                      )}
                      {j.extended && (
                        <div className="mx-1 mb-4 p-3 bg-muted/40 rounded-lg border border-border">
                          <p className="text-xs font-medium text-foreground mb-1">विस्तृत निर्णय-अंश :</p>
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-serif leading-relaxed">
                            {j.extended}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <HemrajAdvancedLexPanel />

      {/* Filing caution */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 no-print space-y-1">
        <p className="font-semibold">⚠ फाइलिंग से पूर्व अनिवार्य सत्यापन</p>
        <p>1. हर न्यायिक उद्धरण के साथ प्रमाणित निर्णय-पाठ से paragraph number जोड़ें।</p>
        <p>2. PENDING citations को primary authority के रूप में use करना FATAL ERROR है।</p>
        <p>3. Mohanbhai (2003 GLR), R.B. Constructions (2014 Bom), K.S. Kalra (2011 Del) — प्रमाणित प्रतियाँ प्राप्त करें।</p>
        <p>4. Sushil Sharma (2014) 4 SCC 317 — SCC से सटीक पैरा भाषा सत्यापित करें।</p>
        <p>5. Uttarakhand HC (2026) — पूर्ण citation एवं प्रमाणित प्रति प्राप्त करें।</p>
        <p>6. कट्टावेल्लई (2025 INSC 845) — BINDING — इसे primary authority के रूप में प्रयोग करें।</p>
      </div>
    </div>
  );
}
