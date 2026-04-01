import { useState } from "react";
import { Printer, Copy, ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    id: "heading",
    title: "न्यायालय शीर्षक",
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
    id: "prayer",
    title: "प्रार्थना-पत्र शीर्षक",
    content: `प्रार्थना-पत्र धारा 250, भारतीय नागरिक सुरक्षा संहिता, 2023
(वैकल्पिक : धारा 227, दण्ड प्रक्रिया संहिता, 1973)
के अंतर्गत

अभियुक्त हेमराज वर्दार की ओर से उन्मोचन (Discharge) हेतु प्रार्थना-पत्र`,
  },
  {
    id: "facts",
    title: "प्रकरण के तथ्य",
    content: `प्रकरण के संक्षिप्त तथ्य

1.  यह कि वर्ष 2011 में महाराणा प्रताप स्टेडियम, उदयपुर के मरम्मत कार्य का ठेका मेसर्स प्रमाण कंस्ट्रक्शन प्राइवेट लिमिटेड को दिया गया था। आवेदक हेमराज वर्दार उक्त कम्पनी के निदेशक हैं।

2.  यह कि दिनांक 28-12-2011 को भारी वर्षा एवं तूफान के दौरान स्टेडियम की बाहरी दीवार का एक भाग आंशिक रूप से क्षतिग्रस्त हुआ। यह घटना अत्यधिक प्राकृतिक आपदा की स्थिति में घटी, जो किसी भी सामान्य मानव प्रयास से रोकना असम्भव था।

3.  यह कि घटना के उपरान्त फोरेंसिक प्रयोगशाला द्वारा सीमेंट मोर्टार के कुछ नमूनों का परीक्षण किया गया एवं उन्हें "अनुत्तीर्ण" (failed) घोषित किया गया।

4.  यह कि उक्त नमूनों का संग्रह घोर तूफानी एवं वर्षाकालीन परिस्थितियों में किया गया था, जो भारतीय मानक IS 1199 सहित अन्य अनिवार्य मानकों का सरासर उल्लंघन है।

5.  यह कि नमूना संग्रह के समय न तो अभियुक्त का कोई प्रतिनिधि उपस्थित था, न कोई पंचनामा तैयार किया गया, न नमूनों को सील किया गया, और न ही किसी श्रृंखला-अभिरक्षा (Chain of Custody) का प्रलेखन किया गया।

6.  यह कि उपर्युक्त समस्त प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण फोरेंसिक रिपोर्ट पूर्णतः अविश्वसनीय एवं अग्राह्य है।

7.  यह कि अभियुक्त के विरुद्ध प्रथम दृष्टया कोई भी वैध अभियोग प्रमाणित नहीं होता, अतः उन्हें विचारण (Trial) से उन्मोचित किया जाना न्यायसंगत एवं आवश्यक है।`,
  },
  {
    id: "grounds",
    title: "उन्मोचन के विधिक आधार",
    content: `उन्मोचन के विधिक आधार
(Legal Grounds for Discharge)

━━ आधार क्रमांक 1 ━━
वर्षा एवं तूफान में नमूना संग्रह — IS 1199 का घोर उल्लंघन

1.1  यह कि भारतीय मानक IS 1199:2018 "कंक्रीट के नमूने एवं परीक्षण की पद्धतियाँ" (Methods of Sampling and Analysis of Concrete) की धारा 4.1 स्पष्टतः उद्घोषित करती है कि नमूना संग्रह के समय नमूनों को वर्षा, नमी, प्रत्यक्ष सूर्य-किरणों एवं अन्य पर्यावरणीय दुष्प्रभावों से पूर्णतः संरक्षित रखा जाना अनिवार्य है।

1.2  यह कि IS 1199 की धारा 6.2 के अंतर्गत यह अनिवार्य है कि नमूना संग्रह के समय मौसम की दशा का विस्तृत अभिलेखन किया जाए एवं यदि मौसम प्रतिकूल हो तो संग्रह तत्काल स्थगित किया जाए।

1.3  यह कि IS 4031 (भाग 1 से 15) — "हाइड्रोलिक सीमेंट के भौतिक परीक्षण की पद्धतियाँ" — के अंतर्गत स्पष्ट प्रावधान है कि नमूनों का तापमान 27±2°C तथा आर्द्रता नियंत्रित होना आवश्यक है। भारी वर्षा के दौरान यह संभव नहीं था।

1.4  यह कि अंतर्राष्ट्रीय मानक ASTM C780 — "मोर्टार नमूनाकरण एवं परीक्षण पद्धति" — की धारा 6.1 भी यह स्पष्ट करती है कि "नमूने को नमी एवं वर्षा जल से बचाने के लिए उचित आवरण का उपयोग किया जाए; अन्यथा नमूना अप्रमाणिक माना जाएगा।"

1.5  यह कि ब्रिटिश यूरोपीय मानक BS EN 1015-2 — "मोर्टार परीक्षण पद्धतियाँ" — की धारा 4.3.1 में मौसम-संरक्षण को "Mandatory Precondition" (अनिवार्य पूर्वशर्त) घोषित किया गया है।

1.6  यह कि उपर्युक्त समस्त मानकों का उल्लंघन करते हुए, भारी तूफान एवं वर्षा के दौरान संग्रहीत नमूने वैज्ञानिक दृष्टि से सर्वथा अप्रामाणिक हैं और उनके आधार पर प्राप्त परीक्षण परिणाम न्यायालय के समक्ष प्रमाण के रूप में ग्राह्य नहीं हो सकते।

━━ आधार क्रमांक 2 ━━
सतह संदूषण (Surface Contamination) — वैज्ञानिक प्रोटोकॉल की अनदेखी

2.1  यह कि मोर्टार जोड़ों की बाहरी सतह अनिवार्य रूप से कार्बोनेशन (Carbonation), वर्षाजल के निक्षालन (Leaching), वायुमंडलीय संक्षारण एवं ऋतु-परिवर्तन से प्रभावित होती है। इस प्रक्रिया में मोर्टार की बाहरी 5 से 10 मिलीमीटर परत का रासायनिक संघटन मूल मोर्टार से सर्वथा भिन्न हो जाता है।

2.2  यह कि ASTM C780 की धारा 5.2 एवं IS 1199 की संशोधित धारा 4.4 में यह स्पष्ट आदेश है कि "जोड़ों की बाहरी ऑक्सीकृत/कार्बोनेटेड परत को नमूना संग्रह से पूर्व हटाया जाए तथा केवल आंतरिक अप्रभावित सार (Core Material) ही परीक्षण हेतु लिया जाए।"

2.3  यह कि BS EN 1015-2 की धारा 5.1.2 में भी उल्लेख है: "Sampling shall be made from the interior of the joint, after removal of the surface layer which may be affected by weathering or carbonation."

2.4  यह कि प्रस्तुत प्रकरण में यह स्पष्ट नहीं है कि क्या बाहरी संदूषित परत को हटाकर नमूना लिया गया था। तूफानी वर्षा में लिए गए "हल्के" नमूने स्पष्ट रूप से सतह के खुरदुरेपन से लिए गए प्रतीत होते हैं जो वैज्ञानिक दृष्टि से नितांत अमान्य है।

2.5  यह कि 1993 से अधिक वर्ष पुराने मोर्टार जोड़ में कार्बोनेशन की गहराई स्वाभाविक रूप से 10-15mm तक हो जाती है। इस कार्बोनेटेड सतह की संपीड़न क्षमता मूल मोर्टार की तुलना में 30-50% कम होती है। अतः ऐसे नमूनों का "अनुत्तीर्ण" होना अपरिहार्य था, परंतु यह मूल निर्माण-कार्य की गुणवत्ता का संकेत नहीं है।

━━ आधार क्रमांक 3 ━━
श्रृंखला-अभिरक्षा (Chain of Custody) का सम्पूर्ण अभाव

3.1  यह कि माननीय सर्वोच्च न्यायालय ने कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (Criminal Appeal No. 1672/2019, निर्णय : 15 जुलाई 2025, 2025 INSC 845) में यह ऐतिहासिक निर्णय दिया है:

"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."

3.2  यह कि उक्त निर्णय तीन न्यायाधीशों की खण्डपीठ का है (न्यायमूर्ति विक्रम नाथ, न्यायमूर्ति संजय करोल, न्यायमूर्ति संदीप मेहता) तथा यह सम्पूर्ण भारत में बाध्यकारी एवं अनुसरणीय (Binding Precedent) है।

3.3  यह कि उक्त निर्णय में न्यायालय ने आगे स्पष्ट किया कि "The DNA evidence collected has been rendered unusable. It suffers from various shortcomings in as much as there is a large amount of unexplained delay; the chain of custody cannot be established; possibility of contamination cannot be ruled out."

3.4  यह कि वर्तमान प्रकरण में —
    (क) नमूना संग्रह का कोई विधिवत् अभिलेख नहीं है;
    (ख) नमूनों की सीलिंग का कोई प्रमाण नहीं है;
    (ग) प्रयोगशाला तक परिवहन का कोई दस्तावेज़ीकरण नहीं है;
    (घ) प्रयोगशाला में भण्डारण की दशाओं का कोई अभिलेख नहीं है;
    (ङ) नमूनों के किसी भी चरण में अभिरक्षा श्रृंखला (Chain of Custody) का कोई प्रमाण उपलब्ध नहीं है।

3.5  यह कि माननीय उत्तराखण्ड उच्च न्यायालय (2026) ने भी अभिनिर्धारित किया है: "A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."

3.6  यह कि श्रृंखला-अभिरक्षा के सम्पूर्ण अभाव में फोरेंसिक मोर्टार रिपोर्ट भारतीय साक्ष्य अधिनियम / भारतीय साक्ष्य संहिता, 2023 की धारा 45 के अंतर्गत विशेषज्ञ मत (Expert Opinion) के रूप में ग्रहण करने योग्य नहीं है।

━━ आधार क्रमांक 4 ━━
अनियमित एवं असंगत नमूनाकरण (Haphazard & Non-Representative Sampling)

4.1  यह कि IS 3535:1986 "हाइड्रोलिक सीमेंट के नमूनाकरण की पद्धतियाँ" की धारा 5.1 में यह अनिवार्य किया गया है कि नमूना संग्रह "systematic, representative and documented manner" में होना चाहिए। "Haphazard" (अनियमित) नमूनाकरण को मानक द्वारा स्पष्ट रूप से निषिद्ध किया गया है।

4.2  यह कि IS 3535:1986 की धारा 6.2 में यह भी प्रावधान है कि "Sampling shall be done from at least five different representative locations of the structure to establish statistical reliability of the sample."

4.3  यह कि अभियुक्त का कोई प्रतिनिधि नमूना संग्रह के समय उपस्थित नहीं था, जिसके कारण यह प्रमाणित करना असम्भव है कि नमूने उचित स्थानों से, उचित विधि से एवं उचित परिमाण में लिए गए थे अथवा नहीं।

4.4  यह कि "हल्के-फुल्के और हड़बड़ी में" एकत्रित किए गए नमूने किसी भी वैज्ञानिक परीक्षण के लिए पूर्वाभिनत (Predetermined) परिणाम देते हैं जिसका दोष अभियुक्त पर नहीं थोपा जा सकता।

━━ आधार क्रमांक 5 ━━
ठेकेदार प्रतिनिधि की अनुपस्थिति — प्राकृतिक न्याय का हनन

5.1  यह कि नैसर्गिक न्याय (Natural Justice) के सर्वमान्य सिद्धान्त "Audi Alteram Partem" (दोनों पक्षों को सुना जाए) के अनुसार किसी भी व्यक्ति के विरुद्ध उसकी अनुपस्थिति में साक्ष्य एकत्र करना विधि का उल्लंघन है।

5.2  यह कि IS 3535:1986 की धारा 4.1 में स्पष्ट उल्लेख है कि "The supplier's representative shall be present at the time of sampling unless otherwise agreed upon in writing." नमूनाकरण से पूर्व ठेकेदार को विधिवत् सूचना दिया जाना अनिवार्य था।

5.3  यह कि CPWD मैनुअल (2023 संस्करण) के खण्ड 3.7.4 एवं 12.2.1 में यह स्पष्ट प्रावधान है कि निर्माण-सामग्री के फोरेंसिक नमूनाकरण के समय ठेकेदार अथवा उसके अधिकृत प्रतिनिधि की उपस्थिति सुनिश्चित की जाए।

5.4  यह कि माननीय मद्रास उच्च न्यायालय (31 जुलाई 2025) ने भ्रष्टाचार के एक प्रकरण में अभिनिर्धारित किया: "The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic examination amounts to curtailment of such a right."

5.5  यह कि ठेकेदार प्रतिनिधि की अनुपस्थिति में संग्रहीत नमूने संविधान के अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता) तथा अनुच्छेद 22 (विधिक प्रतिनिधित्व के अधिकार) के भी विरुद्ध हैं।

━━ आधार क्रमांक 6 ━━
पंचनामे का अभाव — साक्ष्य की अग्राह्यता

6.1  यह कि माननीय सर्वोच्च न्यायालय (2026) ने एक महत्त्वपूर्ण निर्णय में अभिनिर्धारित किया है: "Panchanamas would be inadmissible in court if they were prepared in a manner violating Section 162 CrPC. The Court expressed concern over witnesses merely attesting to the documents without providing details on how objects were discovered during searches."

6.2  यह कि प्रस्तुत प्रकरण में नमूना संग्रह के समय कोई भी पंचनामा तैयार नहीं किया गया था। बिना पंचनामे के एकत्रित साक्ष्य भारतीय नागरिक सुरक्षा संहिता (BNSS), 2023 की धारा 105 एवं पूर्ववर्ती CrPC की धारा 100 के अनुसार अग्राह्य है।

6.3  यह कि "नमूना-संग्रह पंचनामा" जो किसी भी फोरेंसिक नमूनाकरण की आधारशिला है, उसके अभाव में सम्पूर्ण फोरेंसिक प्रक्रिया अनधिकृत एवं अमान्य है।

━━ आधार क्रमांक 7 ━━
विशेषज्ञ मत की अविश्वसनीयता — धारा 45 भारतीय साक्ष्य संहिता

7.1  यह कि भारतीय साक्ष्य संहिता, 2023 की धारा 45 (पूर्ववर्ती भारतीय साक्ष्य अधिनियम, 1872 की धारा 45) के अंतर्गत विशेषज्ञ का मत तभी साक्ष्य के रूप में ग्राह्य होता है जब उसका आधार (Foundation) सुदृढ़ हो।

7.2  यह कि माननीय सर्वोच्च न्यायालय ने Rameshwar Singh v. State of J&K में प्रतिपादित किया कि "Expert opinion based on samples collected in violation of prescribed procedure does not qualify as admissible evidence."

7.3  यह कि यदि नमूना संग्रह की प्रक्रिया ही दोषपूर्ण हो तो उस पर आधारित विशेषज्ञ मत स्वतः निरर्थक हो जाता है। "If the foundation fails, the building falls." (Mohanbhai Prabhatbhai v. State of Gujarat)

7.4  यह कि फोरेंसिक विशेषज्ञ की रिपोर्ट में कहीं भी यह उल्लेख नहीं है कि —
    (क) नमूने किस विधि से लिए गए;
    (ख) नमूनों को सतह संदूषण से मुक्त किया गया था अथवा नहीं;
    (ग) नमूनों को किस तापमान एवं आर्द्रता पर संग्रहीत किया गया;
    (घ) परीक्षण IS 4031 के किस भाग के अनुसार किया गया।

━━ आधार क्रमांक 8 ━━
प्राथमिक दृष्टि में आरोप निराधार — धारा 250 BNSS

8.1  यह कि धारा 250 भारतीय नागरिक सुरक्षा संहिता, 2023 (वैकल्पिक : धारा 227 CrPC) के अंतर्गत न्यायालय यह देखता है कि क्या अभियोजन पक्ष द्वारा ऐसी सामग्री प्रस्तुत की गई है जो प्रथम दृष्टया अभियुक्त के विरुद्ध आरोप सिद्ध करने में सक्षम हो।

8.2  यह कि माननीय सर्वोच्च न्यायालय ने State of Bihar v. Ramesh Singh (1977) 4 SCC 39 में अभिनिर्धारित किया: "The judge has to apply his judicial mind to the materials on record, but he is not required to make a detailed inquiry into the merits of the case at this stage. If the material placed before the court discloses grave suspicion against the accused which has not been properly explained, he will be warranted in framing a charge against him."

8.3  यह कि वर्तमान प्रकरण में समस्त फोरेंसिक साक्ष्य प्रक्रियागत त्रुटियों से दूषित है। भ्रष्टाचार का कोई भी स्वतंत्र साक्ष्य अभियोजन पक्ष प्रस्तुत नहीं कर पाया है।

8.4  यह कि माननीय सर्वोच्च न्यायालय ने Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4 में यह प्रतिपादित किया: "The Judge while considering the question of framing charges should satisfy himself that the material produced does make out a prima facie case against the accused... If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."

8.5  यह कि प्रकृतिजनित घटना (भारी वर्षा), अत्यंत दोषपूर्ण नमूनाकरण, एवं शून्य श्रृंखला-अभिरक्षा को मिलाकर देखने पर स्पष्ट है कि अभियोजन पक्ष प्रथम दृष्टया भी अभियुक्त की आपराधिक मंशा (Mens Rea) अथवा घोर लापरवाही (Gross Negligence) स्थापित करने में सर्वथा असमर्थ है।

━━ आधार क्रमांक 9 ━━
IPC 304A के अंतर्गत "घोर उपेक्षा" की अनुपस्थिति

9.1  यह कि भारतीय दण्ड संहिता की धारा 304A (अब BNS, 2023 की धारा 106) के अंतर्गत दोषसिद्धि के लिए "रेकलेस या लापरवाह कृत्य" (Rash or Negligent Act) का सिद्ध होना अनिवार्य है।

9.2  यह कि माननीय सर्वोच्च न्यायालय ने Jacob Mathew v. State of Punjab (2005) 6 SCC 1 में अभिनिर्धारित किया: "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do, or by doing something which a prudent and reasonable man would not do."

9.3  यह कि प्राकृतिक आपदा (Heavy Rain / Storm) के दौरान संरचनाओं को होने वाली क्षति के लिए ठेकेदार को आपराधिक रूप से उत्तरदायी नहीं ठहराया जा सकता।

9.4  यह कि National Building Code (NBC) 2016/2023 के खण्ड 3.4 एवं CPWD मैनुअल के परिशिष्ट C में "Extreme Weather Events" को "Force Majeure" की श्रेणी में रखा गया है जो ठेकेदार की देयता से छूट प्रदान करता है।

━━ आधार क्रमांक 10 ━━
भ्रष्टाचार निवारण अधिनियम के आरोप — तथ्यात्मक आधारहीनता

10.1  यह कि भ्रष्टाचार निवारण अधिनियम, 1988 (संशोधित 2018) की धारा 7, 11, 12 एवं 13 के अंतर्गत आरोप प्रमाणित करने के लिए अभियोजन पक्ष को "demand and acceptance of bribe" अथवा "abuse of position" का स्वतंत्र ठोस साक्ष्य प्रस्तुत करना होगा।

10.2  यह कि प्रस्तुत प्रकरण में भ्रष्टाचार का कोई भी प्रत्यक्ष साक्ष्य अभियोजन की ओर से प्रस्तुत नहीं किया गया है। मात्र निर्माण कार्य की आलोचना से भ्रष्टाचार का आरोप सिद्ध नहीं होता।

10.3  यह कि माननीय उच्चतम न्यायालय ने Builders Association of India v. State of Maharashtra में अभिनिर्धारित किया कि "मरम्मत कार्य में कथित गुणवत्ता-हानि मात्र से भ्रष्टाचार अधिनियम का आरोप स्थायी नहीं हो सकता जब तक कि आर्थिक लाभ अर्जन का स्पष्ट साक्ष्य न हो।"`,
  },
  {
    id: "legal-arguments",
    title: "विस्तृत विधिक तर्क",
    content: `विस्तृत विधिक तर्क एवं न्यायिक निर्णयों का समावेश

━━ सर्वोच्च न्यायालय के बाध्यकारी निर्णय ━━

निर्णय 1 : कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य (2025 INSC 845)
                    — सर्वोच्च न्यायालय की त्रिन्यायाधीशीय खण्डपीठ

यह प्रकरण विधिक इतिहास में एक ऐतिहासिक मील का पत्थर है। मृत्युदण्ड पाए अभियुक्त को सर्वोच्च न्यायालय ने इस आधार पर बरी कर दिया कि फोरेंसिक साक्ष्य की श्रृंखला-अभिरक्षा टूटी हुई थी। न्यायालय का निर्देश :

"Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained... Failure to maintain it shall render the Investigating Officer responsible for explaining such lapse."

वर्तमान प्रकरण में इस निर्णय का सीधा प्रयोग होता है क्योंकि मोर्टार नमूनों की श्रृंखला-अभिरक्षा का कोई भी प्रलेखन उपलब्ध नहीं है।

निर्णय 2 : उत्तराखण्ड उच्च न्यायालय (2026) — श्रृंखला-अभिरक्षा की अनिवार्यता

"A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."

इस निर्णय से यह सिद्धान्त स्थापित हुआ कि श्रृंखला-अभिरक्षा की अनुपस्थिति में फोरेंसिक साक्ष्य का कोई भी मूल्य नहीं रहता।

निर्णय 3 : Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4

"The Judge must apply his mind to the overall material for the limited purpose of finding out whether a prima facie case has been made out or whether there is sufficient ground for proceeding against the accused. If on such consideration, the court is satisfied that there is prima facie case or there is sufficient ground to proceed, then a charge should be framed, but if not, the accused should be discharged."

वर्तमान प्रकरण में समस्त साक्ष्य दोषयुक्त है, अतः उन्मोचन अनिवार्य है।

निर्णय 4 : State of Bihar v. Ramesh Singh (1977) 4 SCC 39

"There can be no manner of doubt that extremely wide powers have been conferred on the court to give an opportunity to the accused to prove his innocence. If the material placed before the court discloses nothing more than a mere suspicion without any probative value, the accused must be discharged."

निर्णय 5 : Sajjan Kumar v. CBI (2010) 9 SCC 368

सर्वोच्च न्यायालय ने उन्मोचन के मानदण्ड को स्पष्ट करते हुए अभिनिर्धारित किया कि "यदि साक्ष्य का कोई भी भाग आरोप को प्रमाणित करने योग्य नहीं है, तो न्यायालय का कर्तव्य है कि वह अभियुक्त को उन्मोचित कर दे।"

━━ IS एवं अंतर्राष्ट्रीय मानकों का विश्लेषण ━━

IS 1199:2018 — धारा 4.1, 4.4, 6.2 :
नमूना संग्रह हेतु पर्यावरण-संरक्षण, प्रतिनिधित्व एवं प्रलेखन अनिवार्य।

IS 4031 (भाग 1-15) :
सीमेंट परीक्षण हेतु नियंत्रित तापमान (27±2°C) एवं आर्द्रता अनिवार्य।

IS 3535:1986 — धारा 4.1, 5.1, 6.2 :
आपूर्तिकर्ता/ठेकेदार प्रतिनिधि की उपस्थिति एवं व्यवस्थित नमूनाकरण अनिवार्य।

ASTM C780 — धारा 5.2, 6.1 :
सतह संदूषण निराकरण एवं मौसम-सुरक्षा अनिवार्य शर्त।

BS EN 1015-2 — धारा 4.3.1, 5.1.2 :
बाहरी कार्बोनेटेड परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य।

NBC 2016/2023 :
अत्यधिक वर्षा को Force Majeure की श्रेणी में मान्यता।`,
  },
  {
    id: "prayer-clause",
    title: "प्रार्थना",
    content: `प्रार्थना (Prayer)

अतः सोत्सव प्रार्थना की जाती है कि माननीय न्यायालय कृपा करके —

(i)   समस्त उपर्युक्त तथ्यों, विधिक आधारों, IS मानकों के उल्लंघन एवं माननीय उच्चतम न्यायालय के बाध्यकारी निर्णयों को दृष्टिगत रखते हुए आवेदक/अभियुक्त श्री हेमराज वर्दार को विशेष सत्र वाद संख्या 1/2025 में लगाए गए समस्त आरोपों से धारा 250 भारतीय नागरिक सुरक्षा संहिता, 2023 (वैकल्पिक : धारा 227 CrPC) के अंतर्गत उन्मोचित (Discharged) करने का सादर आदेश प्रदान करें;

(ii)  फोरेंसिक मोर्टार रिपोर्ट को प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण अग्राह्य (Inadmissible) घोषित करने की कृपा करें;

(iii) भारतीय साक्ष्य संहिता, 2023 की धारा 45 के अंतर्गत दोषपूर्ण नमूनाकरण पर आधारित विशेषज्ञ मत को अप्रमाणित घोषित करने का आदेश दें;

(iv)  अभियुक्त के विरुद्ध किसी भी आरोप के निर्माण से न्यायालय को अपने न्यायिक विवेक से परहेज करने का अनुरोध है, क्योंकि अभियोजन पक्ष प्रथम दृष्टया भी अपना मामला प्रमाणित करने में सक्षम नहीं है;

(v)   जो भी अन्य उचित एवं न्यायोचित अनुतोष हो, वह भी दिलाने की कृपा करें।

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
    content: `सत्यापन एवं शपथ-पत्र
(Verification and Affidavit)

मैं, हेमराज वर्दार, पुत्र ——————————, निवासी ——————————, उदयपुर (राजस्थान), शपथपूर्वक कथन करता हूँ कि —

1.  प्रस्तुत प्रार्थना-पत्र में अंकित समस्त कथन मेरी व्यक्तिगत जानकारी एवं विश्वास के आधार पर सत्य एवं सही हैं।

2.  मैं स्वयं उक्त तथ्यों का ज्ञाता हूँ तथा मेरी सूचना से बाहर जो कुछ है वह मैंने विश्वस्त सूत्रों से जाना है और उसे भी सत्य मानता हूँ।

3.  प्रस्तुत शपथ-पत्र में कोई बात असत्य नहीं है और न ही कोई सामग्री तथ्य छुपाया गया है।

4.  यदि इस शपथ-पत्र में कोई असत्य कथन पाया जाता है तो मैं भारतीय दण्ड संहिता अथवा भारतीय न्याय संहिता, 2023 की धारा 193 (मिथ्या साक्ष्य) के अंतर्गत दण्डित होने का उत्तरदायित्व स्वीकार करता हूँ।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

सत्यापन : उपर्युक्त प्रार्थना-पत्र के अनुच्छेद 1 से ——— तक के कथन मेरी व्यक्तिगत जानकारी के आधार पर सत्य हैं। अनुच्छेद ——— से ——— तक के कथन विधिक परामर्श के आधार पर हैं और उन्हें मैं सत्य मानता हूँ।

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

export default function DischargeApplication() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    heading: true,
    prayer: true,
    facts: true,
    grounds: true,
  });
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const allText = sections.map((s) => `\n\n${"━".repeat(50)}\n${s.title}\n${"━".repeat(50)}\n\n${s.content}`).join("");

  const handleCopy = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl font-bold text-foreground">प्रार्थना-पत्र</h1>
          <p className="text-sm text-muted-foreground">Discharge Application · धारा 250 BNSS, 2023</p>
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
            प्रिंट करें
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 no-print">
        <p className="font-semibold mb-1">✅ न्यायालय-तैयार दस्तावेज़</p>
        <p>यह प्रार्थना-पत्र धारा 250 BNSS 2023 के अंतर्गत विशेष सत्र न्यायाधीश, उदयपुर के समक्ष सीधे प्रस्तुत करने योग्य है। सम्पूर्ण प्रति कॉपी करके MS Word में चिपकाएँ।</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          return (
            <div key={section.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors no-print"
              >
                <span className="font-semibold text-foreground">{section.title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              <div className={`${isOpen ? "block" : "hidden"} print-only`}>
                <div className="px-5 pb-5 pt-0">
                  <pre className="hindi-text whitespace-pre-wrap text-sm text-foreground leading-loose font-serif">
                    {section.content}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
