export type Lang = "en" | "hi" | "both";

export interface PacketInfo {
  id: string;
  labelEn: string;
  labelHi: string;
  material: { en: string; hi: string };
  fslResult: { en: string; hi: string };
  applicableStd: { en: string; hi: string };
  keyObs: { en: string; hi: string };
}

export interface Ground {
  number: number;
  titleEn: string;
  titleHi: string;
  critical: boolean;
  defenceEn: string;
  defenceHi: string;
  standardsEn: string;
  standardsHi: string;
}

export interface Challenge {
  id: string;
  titleEn: string;
  titleHi: string;
  critical: boolean;
  bodyEn: string;
  bodyHi: string;
  standardsEn?: string;
  standardsHi?: string;
}

export interface Packet {
  info: PacketInfo;
  grounds: Ground[];
  challenges: Challenge[];
}

export const packetA: Packet = {
  info: {
    id: "A",
    labelEn: "Packet A — Cement Plaster on Boundary Wall",
    labelHi: "पैकेट A — सीमा दीवार पर सीमेंट प्लास्टर",
    material: { en: "Cement plaster, external face, boundary wall", hi: "सीमा दीवार की बाहरी सतह पर सीमेंट प्लास्टर" },
    fslResult: { en: "Cement : Sand = 1 : 18", hi: "सीमेंट : रेत = 1 : 18" },
    applicableStd: { en: "IS 1661:1972 — CM 1:4 to CM 1:6 for external plaster", hi: "IS 1661:1972 — बाहरी प्लास्टर हेतु CM 1:4 से CM 1:6" },
    keyObs: {
      en: "1:18 is 300–450% above the sand content of the leanest standard grade. The standing wall disproves this ratio.",
      hi: "1:18 मानक श्रेणी से 300–450% अधिक रेत दर्शाता है। खड़ी दीवार इस अनुपात को असंभव सिद्ध करती है।"
    }
  },
  grounds: [
    {
      number: 1,
      titleEn: "Ground 1 — Sample Not Collected in Presence of Contractor's Authorised Representative [CRITICAL]",
      titleHi: "आधार 1 — ठेकेदार के प्रतिनिधि की अनुपस्थिति में नमूना संग्रह [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "The plaster sample was taken without any notice to or presence of the contractor or their authorised representative. Without a witness from the contractor's side, there is no independent verification of: (a) the exact wall face and elevation from which the plaster chip was struck; (b) whether the sampling tool was clean; (c) that the material collected was indeed from the contracted work; (d) labelling and sealing immediately after extraction. For a plaster coat of only 12–20 mm, the risk of substrate contamination during unwitnessed sampling is acute — no one can rule out that the chip included underlying stone masonry material. This fundamental procedural omission violates the principle of Audi Alteram Partem.",
      defenceHi: "प्लास्टर का नमूना ठेकेदार या उनके अधिकृत प्रतिनिधि को बिना किसी सूचना के और उनकी अनुपस्थिति में लिया गया। यह प्राकृतिक न्याय के सिद्धांत — Audi Alteram Partem — का मूलभूत उल्लंघन है। ठेकेदार के गवाह के बिना इसकी कोई स्वतंत्र पुष्टि नहीं हो सकती: (क) किस दीवार की सतह से नमूना लिया गया; (ख) उपकरण स्वच्छ था या नहीं; (ग) एकत्रित सामग्री ठेकेदार के कार्य की थी या नहीं; (घ) नमूने को तुरंत लेबल किया और सील किया गया या नहीं।",
      standardsEn: "IS 1199 (Part 5):2018, Clause 5: Sampling witnessed by representatives of both testing authority and party under examination. [Supersedes IS 1199:1959.] | IS 516 (Part 1):2018, Clause 4: Where test results are for legal proceedings, both parties have the right to representation. | Legal Principle: Audi Alteram Partem — Maneka Gandhi v. Union of India (1978) 1 SCC 248: No adverse order based on evidence generated in a proceeding from which the affected party was excluded.",
      standardsHi: "IS 1199 (Part 5):2018, धारा 5: नमूना संग्रह दोनों पक्षों के प्रतिनिधियों की उपस्थिति में हो। [IS 1199:1959 का स्थान लेता है।] | IS 516 (Part 1):2018, धारा 4: विधिक कार्यवाही हेतु परिणामों में दोनों पक्षों को प्रतिनिधित्व का अधिकार है। | विधिक सिद्धांत: मेनका गांधी बनाम भारत संघ (1978) 1 SCC 248: किसी पक्ष को बाहर रखकर उत्पन्न साक्ष्य के आधार पर कोई प्रतिकूल आदेश नहीं दिया जा सकता।"
    },
    {
      number: 2,
      titleEn: "Ground 2 — Stormy Weather, Wet Ladder, Inadequate Equipment [CRITICAL]",
      titleHi: "आधार 2 — तूफानी मौसम, भीगी सीढ़ी और असुरक्षित उपकरण [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "The plaster sample was collected on a stormy, rainy day while the workman stood on a wet steel ladder under an umbrella, striking the wall with a hammer. Rainwater penetrates the freshly fractured plaster face within seconds. A plaster coat of 12–20 mm is exceptionally vulnerable: rainwater entering the exposed cut surface immediately alters the soluble calcium and silica content that the chemical analysis later measures. The sample that fell from the wall landed in waterlogged ground and was collected afterwards — each of these events independently contaminates the chemical composition that the FSL subsequently measured. IS 1199 (Part 5):2018 and ASTM C823:2017 explicitly prohibit sampling in rain conditions.",
      defenceHi: "तूफान और बारिश के दिन, जब जमीन पर लगभग दो फुट पानी भरा था, एक मजदूर भीगी स्टील की सीढ़ी पर छाता लगाकर खड़े होकर हथौड़े से दीवार पर प्रहार कर नमूना ले रहा था। 12–20 मिमी मोटे प्लास्टर पर वर्षाजल तुरंत प्रवेश करता है और उस सामग्री में उपस्थित कैल्शियम व सिलिका की मात्रा को बदल देता है जिसका बाद में रासायनिक विश्लेषण होता है। IS 1199 (Part 5):2018 और ASTM C823:2017 वर्षा में नमूना संग्रह स्पष्ट रूप से प्रतिबंधित करते हैं।",
      standardsEn: "IS 1199 (Part 5):2018, Clause 5: Samples protected from rain and adverse environmental conditions immediately upon collection. | IS 2250:1981 (Reaffirmed 2020), Clause 6.1: Sampling of hardened mortar from dry surfaces only. | BS EN 12504-1:2019, Clause 5.3: Specimens shall not be drilled or sampled in rain conditions; cores or samples contaminated by rainwater shall be discarded. | ASTM C823/C823M:2017, Section 8: Ground surfaces protected with clean tarpaulin; safe, stable access mandatory.",
      standardsHi: "IS 1199 (Part 5):2018, धारा 5: नमूनों को वर्षा एवं प्रतिकूल पर्यावरणीय परिस्थितियों से तुरंत संरक्षित किया जाए। | BS EN 12504-1:2019, धारा 5.3: वर्षा में नमूना नहीं लिया जाएगा; वर्षाजल से दूषित नमूने त्यागे जाएँगे। | ASTM C823/C823M:2017, धारा 8: स्वच्छ तिरपाल, सुरक्षित एवं स्थिर पहुँच अनिवार्य।"
    },
    {
      number: 3,
      titleEn: "Ground 3 — Broken Chain of Custody [CRITICAL]",
      titleHi: "आधार 3 — अभिरक्षा श्रृंखला का टूटना [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "The plaster sample was transported under the same storm conditions without a documented chain of custody signed at every transfer point. IS/IEC 17025:2017 Clause 7.4 and NABL 160 (NABL's ISO/IEC 17025 implementation document, Clause 5.8) mandate this documentation as a minimum requirement. Without an unbroken chain of custody, it cannot be established that what was tested in Jaipur originated from contractor Hemraj's boundary wall.",
      defenceHi: "प्लास्टर का नमूना उसी तूफान में बिना किसी प्रत्येक हस्तांतरण बिंदु पर हस्ताक्षरित अभिरक्षा-श्रृंखला दस्तावेज के परिवहन किया गया। IS/IEC 17025:2017 धारा 7.4 और NABL 160 (धारा 5.8) यह दस्तावेजीकरण न्यूनतम आवश्यकता के रूप में अनिवार्य करते हैं। बिना अटूट अभिरक्षा श्रृंखला के यह स्थापित नहीं किया जा सकता कि जयपुर में जो परीक्षण हुआ वह ठेकेदार हेमराज की सीमा दीवार से आया था।",
      standardsEn: "IS/IEC 17025:2017, Clause 7.4: Documented procedure for transportation, receipt, handling, protection, storage and disposal of test items. | NABL 160 (NABL's ISO/IEC 17025 accreditation requirements), Clause 5.8: Samples shall be accompanied by a chain of custody document signed at each transfer point. | Legal Principle: Mohd. Khalid v. State of W.B. (2002) 7 SCC 334: Gaps in chain of custody create reasonable doubt in favour of respondent.",
      standardsHi: "IS/IEC 17025:2017, धारा 7.4: नमूनों के परिवहन, प्राप्ति, संभालने, भंडारण और निपटान की प्रलेखित प्रक्रिया आवश्यक। | NABL 160, धारा 5.8: प्रत्येक हस्तांतरण पर हस्ताक्षरित अभिरक्षा-श्रृंखला दस्तावेज। | विधिक सिद्धांत: मो. खालिद बनाम पश्चिम बंगाल राज्य (2002) 7 SCC 334: अभिरक्षा-श्रृंखला में अंतराल प्रतिवादी के पक्ष में उचित संदेह उत्पन्न करता है।"
    },
    {
      number: 4,
      titleEn: "Ground 4 — Doubt as to Timely Testing and Proper Storage",
      titleHi: "आधार 4 — समय पर परीक्षण एवं भंडारण पर संदेह",
      critical: false,
      defenceEn: "Hardened plaster is among the most vulnerable cementitious materials to carbonation — the conversion of calcium hydroxide (Ca(OH)₂) to calcium carbonate (CaCO₃) by atmospheric CO₂. Carbonation reduces soluble calcium, directly affecting the chemical back-calculation of cement content. A plaster sample exposed to storm rain and then improperly stored will carbonate significantly before testing, making the cement fraction appear smaller than it was at the time of construction. The FSL report states no collection date, receipt date, or testing date.",
      defenceHi: "कठोर प्लास्टर कार्बोनेशन के प्रति अत्यंत संवेदनशील है — Ca(OH)₂ + CO₂ → CaCO₃ + H₂O की प्रतिक्रिया से घुलनशील कैल्शियम घटता है और सीमेंट अंश कम दिखता है। वर्षा में एकत्रित और अनुचित ढंग से संग्रहीत प्लास्टर नमूने में परीक्षण से पूर्व तेज कार्बोनेशन होगी। FSL रिपोर्ट में न संग्रह की तारीख है, न प्राप्ति की, न परीक्षण की।",
      standardsEn: "IS 1199 (Part 5):2018, Clause 6: Tests shall be commenced within the prescribed time interval; test report shall state date of collection and date of testing. | IS 4031 (Part 5):1988 (Reaffirmed 2018), Clause 4: Chemical analysis requires a verified cement control sample; result without control sample is indicative only — this principle equally implies that samples showing visible carbonation or moisture damage should be documented before analysis. | IS/IEC 17025:2017, Clause 7.4.3: Samples stored under conditions preventing deterioration.",
      standardsHi: "IS 1199 (Part 5):2018, धारा 6: परीक्षण निर्धारित समयावधि में प्रारंभ हों; रिपोर्ट में संग्रह एवं परीक्षण की तिथि अनिवार्य। | IS/IEC 17025:2017, धारा 7.4.3: नमूने ऐसी परिस्थितियों में संग्रहीत जो क्षरण रोके।"
    },
    {
      number: 5,
      titleEn: "Ground 5 — Time Frame Between Collection and Testing Not Verified",
      titleHi: "आधार 5 — संग्रह और परीक्षण के बीच समय सीमा का पालन नहीं",
      critical: false,
      defenceEn: "The FSL report provides no collection date, no receipt date, and no testing date. Compliance with the mandatory testing window cannot be verified. If samples remained in wet, uncontrolled conditions for 24–48 hours or more before laboratory processing, the chemical composition — particularly the soluble silica fraction used to calculate the cement:sand ratio — would have been materially altered.",
      defenceHi: "FSL रिपोर्ट में न संग्रह तिथि, न प्राप्ति तिथि, न परीक्षण तिथि उल्लिखित है। IS 1199 (Part 5):2018 की धारा 6 के अनुसार यह रिपोर्ट का अनिवार्य भाग है। अनिवार्य परीक्षण समयसीमा का अनुपालन सत्यापित करने का भार जाँच प्राधिकारी पर है — जो वे पूरा नहीं कर पाये हैं।",
      standardsEn: "IS 1199 (Part 5):2018, Clause 6: Test report must state date of collection and date of testing as mandatory minimum content.",
      standardsHi: "IS 1199 (Part 5):2018, धारा 6: परीक्षण रिपोर्ट में संग्रह तिथि और परीक्षण तिथि का उल्लेख न्यूनतम अनिवार्य सामग्री है।"
    },
    {
      number: 6,
      titleEn: "Ground 6 — Tests Performed in Absence of Contractor [CRITICAL]",
      titleHi: "आधार 6 — ठेकेदार की अनुपस्थिति में परीक्षण [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "The chemical analysis that produced the 1:18 ratio was performed without notice to or presence of the contractor. This extinguishes the right to verify that the correct labelled sample was tested, that equipment was calibrated, and that the correct method was followed. NABL 160 (NABL's ISO/IEC 17025 accreditation requirements, Clause 5.10) requires parties to be notified before testing in legal proceedings. Additionally, the signing officer, KL Verma (SSO Physics), holds a Physics designation for what is a chemical analysis — the qualification for this specific test is not established by the report.",
      defenceHi: "1:18 का अनुपात देने वाला रासायनिक विश्लेषण ठेकेदार को बिना सूचना के और उनकी अनुपस्थिति में किया गया। NABL 160 (धारा 5.10) के अनुसार विधिक विवाद में पक्षों को परीक्षण से पूर्व सूचना देना और गवाह नियुक्त करने का अधिकार देना अनिवार्य है। हस्ताक्षरकर्ता KL वर्मा का पदनाम SSO भौतिकी है — सीमेंटयुक्त सामग्री का रासायनिक विश्लेषण रसायन विज्ञान का कार्य है, भौतिकी का नहीं।",
      standardsEn: "IS 516 (Part 1):2018, Clause 4: Both parties have the right to representation at testing for legal proceedings. | NABL 160 (NABL's ISO/IEC 17025 accreditation requirements), Clause 5.10: Parties shall be notified before testing; either party may designate a witness. | Legal Principle: Union of India v. Tulsiram Patel (1985) 3 SCC 398: The charged party must have a genuine opportunity to meet the case against them at every material stage.",
      standardsHi: "IS 516 (Part 1):2018, धारा 4: विधिक कार्यवाही हेतु दोनों पक्षों को परीक्षण में उपस्थित रहने का अधिकार। | NABL 160, धारा 5.10: पक्षों को सूचना दी जाए; गवाह नियुक्त करने का अधिकार। | विधिक सिद्धांत: भारत संघ बनाम तुलसीराम पटेल (1985) 3 SCC 398: आरोपित व्यक्ति को प्रत्येक महत्वपूर्ण चरण में वास्तविक अवसर मिलना चाहिए।"
    },
    {
      number: 7,
      titleEn: "Ground 7 — No Referee Sample Retained",
      titleHi: "आधार 7 — स्वतंत्र पुन:परीक्षण हेतु नमूना संरक्षित नहीं",
      critical: false,
      defenceEn: "No portion of Packet A has been retained as a referee sample for independent verification. IS 1199 (Part 5):2018 requires at least one-third of the collected quantity to be retained for a minimum of 90 days. Once the sample is fully consumed in primary testing, the contractor's right to independent verification is permanently extinguished — a prejudice courts treat as grounds to exclude or discount the evidence.",
      defenceHi: "पैकेट A का कोई भाग जज (रेफरी) नमूने के रूप में संरक्षित नहीं किया गया। IS 1199 (Part 5):2018 के अनुसार संग्रहीत मात्रा का कम से कम एक-तिहाई न्यूनतम 90 दिनों तक संरक्षित रखना अनिवार्य है। एक बार नमूना प्राथमिक परीक्षण में पूरी तरह उपयोग होने पर ठेकेदार का स्वतंत्र सत्यापन का अधिकार हमेशा के लिए समाप्त हो जाता है।",
      standardsEn: "IS 1199 (Part 5):2018: At least one-third of collected quantity retained as referee sample for minimum 90 days.",
      standardsHi: "IS 1199 (Part 5):2018: संग्रहीत मात्रा का कम से कम एक-तिहाई न्यूनतम 90 दिनों तक रेफरी नमूने के रूप में संरक्षित।"
    },
    {
      number: 8,
      titleEn: "Ground 8 — FSL Report Cites No Indian Standard [CRITICAL]",
      titleHi: "आधार 8 — FSL रिपोर्ट में कोई भारतीय मानक उद्धृत नहीं [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "The FSL report contains no reference to any Indian Standard under which the chemical analysis was conducted. IS/IEC 17025:2017 Clause 7.8.2 makes this a mandatory minimum requirement. Furthermore, the report states: \"As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica.\" IS 4031 (Part 5):1988 requires a verified cement control sample — without it, the result is indicative only, not conclusive evidence.",
      defenceHi: "FSL रिपोर्ट में किसी भी भारतीय मानक का उल्लेख नहीं है जिसके अन्तर्गत रासायनिक विश्लेषण किया गया। IS/IEC 17025:2017 धारा 7.8.2 इसे प्रत्येक परीक्षण रिपोर्ट में अनिवार्य न्यूनतम आवश्यकता घोषित करती है। रिपोर्ट में स्वयं लिखा है: \"नियंत्रण नमूना नहीं मिला, इसलिए यह मानकर कि उत्तम गुणवत्ता के सीमेंट में 21% घुलनशील सिलिका होती है, अनुपात की गणना की गई।\" IS 4031 (Part 5):1988 धारा 4 के अनुसार सत्यापित सीमेंट नियंत्रण नमूना अनिवार्य है। इसके बिना परिणाम केवल संकेतात्मक है, निर्णायक नहीं।",
      standardsEn: "IS 1661:1972 (Reaffirmed 2020), Table 1: External plaster proportions: 1:4 (rich) to 1:6 (lean). No ratio beyond 1:6 is specified for any functional external plaster. A ratio of 1:18 has no reference in this or any recognised Indian standard. | IS 4031 (Part 5):1988 (Reaffirmed 2018), Clause 4: Control sample of cement mandatory for chemical analysis. | IS/IEC 17025:2017, Clause 7.8.2: Test method reference mandatory in every test report.",
      standardsHi: "IS 1661:1972 (Reaffirmed 2020), तालिका 1: बाहरी प्लास्टर: CM 1:4 (सम्पन्न) से CM 1:6 (सामान्य)। 1:6 से अधिक कोई अनुपात किसी भी मान्यता प्राप्त भारतीय मानक में नहीं है। | IS 4031 (Part 5):1988 (Reaffirmed 2018), धारा 4: रासायनिक विश्लेषण हेतु सीमेंट का नियंत्रण नमूना अनिवार्य। | IS/IEC 17025:2017, धारा 7.8.2: प्रत्येक परीक्षण रिपोर्ट में परीक्षण विधि संदर्भ अनिवार्य।"
    },
    {
      number: 9,
      titleEn: "Ground 9 — Report Does Not Disclose Number of Tests",
      titleHi: "आधार 9 — रिपोर्ट में परीक्षणों की संख्या का उल्लेख नहीं",
      critical: false,
      defenceEn: "The FSL report provides a single ratio without stating whether it represents a single determination or an average. IS 4031 (Part 5):1988 Clause 13 requires a minimum of two concordant determinations. A single determination cannot be distinguished from an anomalous result caused by localised carbonation or substrate contamination in the specific fragment tested. No repeatability data, uncertainty of measurement, or individual determination values are stated — all mandatory under IS/IEC 17025:2017 Clause 7.8.3.",
      defenceHi: "FSL रिपोर्ट एक एकल अनुपात प्रदान करती है बिना यह बताये कि यह एकल निर्धारण है या औसत। IS 4031 (Part 5):1988 धारा 13 और IS 1199 (Part 5):2018 न्यूनतम दो सुसंगत निर्धारणों की माँग करते हैं। कोई दोहरान डेटा, माप अनिश्चितता या व्यक्तिगत निर्धारण मूल्य नहीं दिया — यह सब IS/IEC 17025:2017 धारा 7.8.3 के अन्तर्गत अनिवार्य हैं।",
      standardsEn: "IS 4031 (Part 5):1988 (Reaffirmed 2018), Clause 13: Minimum two concordant determinations required. | IS/IEC 17025:2017, Clause 7.8.3: Repeatability data and measurement uncertainty mandatory in test reports.",
      standardsHi: "IS 4031 (Part 5):1988 (Reaffirmed 2018), धारा 13: न्यूनतम दो सुसंगत निर्धारण अनिवार्य। | IS/IEC 17025:2017, धारा 7.8.3: दोहरान डेटा और माप अनिश्चितता अनिवार्य।"
    }
  ],
  challenges: [
    {
      id: "A1",
      titleEn: "Challenge A1 — Carbonation of Hardened Plaster",
      titleHi: "चुनौती A1 — कठोर प्लास्टर का कार्बोनेशन",
      critical: false,
      bodyEn: "Hardened cement plaster is among the most vulnerable cementitious materials to carbonation. The reaction Ca(OH)₂ + CO₂ → CaCO₃ + H₂O progressively reduces the soluble calcium hydroxide fraction, directly affecting the chemical back-calculation of cement content using IS 4031 (Part 5):1988. A plaster sample collected years after construction, exposed to storm rain, and improperly stored will show significantly higher apparent aggregate content than was the case at the time of construction. The FSL result of 1:18 could partially or entirely reflect carbonation-induced reduction in apparent cement content, not the original mix.",
      bodyHi: "Ca(OH)₂ + CO₂ → CaCO₃ + H₂O की रासायनिक प्रतिक्रिया से सीमेंट का घुलनशील कैल्शियम अंश घटता है। IS 4031 (Part 5):1988 की रासायनिक गणना में यही अंश सीमेंट की मात्रा का आधार है। निर्माण के वर्षों बाद, वर्षाजल में भीगे और अनुचित ढंग से भंडारित नमूने में कार्बोनेशन से सीमेंट का अनुपात वास्तविकता से बहुत कम प्रतीत होगा। FSL का 1:18 का परिणाम आंशिक या पूर्ण रूप से कार्बोनेशन का परिणाम हो सकता है, मूल मिश्रण अनुपात का नहीं।",
      standardsEn: "IS 4031 (Part 5):1988 (Reaffirmed 2018), Clause 4: Chemical analysis of hardened cementitious materials subject to inaccuracies due to carbonation and leaching. | BS EN 14630:2006: Method for determination of carbonation depth in hardened mortar — must be assessed before chemical analysis. | ASTM C856:2020: Petrographic examination identifies carbonation visible under microscopy, providing a more reliable assessment of original mix constituents than chemical analysis alone.",
      standardsHi: "IS 4031 (Part 5):1988 (Reaffirmed 2018), धारा 4: कठोर सीमेंटयुक्त सामग्री का रासायनिक विश्लेषण कार्बोनेशन और निक्षालन के कारण अशुद्धि के अधीन। | BS EN 14630:2006: कठोर मसाले में कार्बोनेशन गहराई के निर्धारण की विधि।"
    },
    {
      id: "A2",
      titleEn: "Challenge A2 — Substrate Contamination During Sampling",
      titleHi: "चुनौती A2 — आधारभूत सामग्री का संदूषण",
      critical: false,
      bodyEn: "External plaster on a boundary wall is typically 12–20 mm thick. A hammer blow by a workman on a wet steel ladder under storm conditions will inevitably shatter through the thin plaster coat into the underlying stone masonry or brick substrate. Stone fragments contain silica in far greater proportion than any mortar mix (quartzite: 92–95% SiO₂; sandstone: 60–80% SiO₂). Their inclusion in the sample dramatically inflates the apparent aggregate fraction, producing an artificially lean calculated cement:sand ratio. The FSL report makes no mention of any petrographic examination (ASTM C856:2020) to verify that the analysed material was pure plaster and did not contain substrate contamination.",
      bodyHi: "बाहरी प्लास्टर केवल 12–20 मिमी मोटा होता है। तूफान में भीगी सीढ़ी पर खड़े होकर हथौड़े से मारने पर अनिवार्यतः प्लास्टर की पतली परत के नीचे की पत्थर चिनाई के टुकड़े भी नमूने में आ जाते हैं। पत्थर के टुकड़ों में सिलिका की मात्रा बहुत अधिक होती है (क्वार्टज़ाइट: 92–95% SiO₂)। इनकी सिलिका गणना में 'समुच्चय सिलिका' के रूप में जुड़ जाती है, जो सीमेंट:रेत का अनुपात अत्यधिक रेत-युक्त दर्शाती है।"
    },
    {
      id: "A3",
      titleEn: "Challenge A3 — Implausibility of 1:18 for Functional External Plaster",
      titleHi: "चुनौती A3 — कार्यात्मक बाहरी प्लास्टर के लिए 1:18 की असंभाव्यता",
      critical: false,
      bodyEn: "IS 1661:1972 and IS 2402:1963 specify plaster ratios of 1:3 to 1:6 for external use. A plaster at 1:18 would have virtually no weather resistance and would crumble within months of application. The continued existence and function of the boundary wall is direct evidence that the plaster cannot have had a ratio of 1:18.",
      bodyHi: "IS 1661:1972 एवं IS 2402:1963 बाहरी उपयोग हेतु 1:3 से 1:6 अनुपात निर्धारित करते हैं। 1:18 का प्लास्टर निर्माण के कुछ महीनों में ही झड़ जाता। खड़ी सीमा दीवार इस अनुपात की असंभाव्यता का प्रत्यक्ष प्रमाण है।"
    }
  ]
};

export const packetB: Packet = {
  info: {
    id: "B",
    labelEn: "Packet B — Stone Masonry Joint Mortar",
    labelHi: "पैकेट B — पत्थर चिनाई के जोड़ का मसाला",
    material: { en: "Cement mortar in stone masonry joints, boundary wall", hi: "पत्थर चिनाई के जोड़ों में सीमेंट मसाला, सीमा दीवार" },
    fslResult: { en: "Cement : Sand = 1 : 17", hi: "सीमेंट : रेत = 1 : 17" },
    applicableStd: { en: "IS 2250:1981 — Grade M3/M4 (1:5 or 1:6)", hi: "IS 2250:1981 — ग्रेड M3/M4 (1:5 अथवा 1:6)" },
    keyObs: {
      en: "No recognised masonry mortar grade at or near 1:17 exists. A wall bonded with 1:17 mortar could not stand.",
      hi: "1:17 के आसपास कोई मान्यता प्राप्त चिनाई मसाला ग्रेड नहीं। 1:17 मसाले से बनी दीवार खड़ी नहीं रह सकती।"
    }
  },
  grounds: [
    {
      number: 1,
      titleEn: "Ground 1 (Adapted) — No Contractor Witness at Sampling [CRITICAL]",
      titleHi: "आधार 1 (अनुकूलित) — नमूना संग्रह में ठेकेदार गवाह नहीं [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "Without a contractor witness, the exact masonry joint and course from which the mortar was extracted cannot be verified. In stone masonry, the joint mortar constitutes only a fraction of the wall face — any slight deviation in the extraction point could include stone or pointing material, affecting the result. All the same Audi Alteram Partem arguments applicable to Packet A apply here with equal force.",
      defenceHi: "ठेकेदार के गवाह के बिना यह सत्यापित नहीं हो सकता कि मसाला किस जोड़ और किस कोर्स से निकाला गया। पत्थर चिनाई में जोड़ का मसाला दीवार की सतह का एक अंश मात्र है — निष्कर्षण बिंदु में थोड़ा भी विचलन पत्थर या पोइंटिंग सामग्री को शामिल कर सकता है।",
      standardsEn: "IS 1199 (Part 5):2018, Clause 5: Sampling witnessed by both parties. | Maneka Gandhi v. Union of India (1978) 1 SCC 248: No adverse order on evidence generated excluding the affected party.",
      standardsHi: "IS 1199 (Part 5):2018, धारा 5: नमूना संग्रह दोनों पक्षों की उपस्थिति में। | मेनका गांधी बनाम भारत संघ (1978) 1 SCC 248।"
    },
    {
      number: 2,
      titleEn: "Ground 2 (Adapted) — Wet Stone Masonry, Hammer Extraction [CRITICAL]",
      titleHi: "आधार 2 (अनुकूलित) — भीगी पत्थर चिनाई और हथौड़े से निष्कर्षण [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "Masonry mortar joints are typically 10–25 mm wide. On a wet stone masonry wall in rain, it is physically impossible to extract pure joint mortar by hammer without including stone fragments. The water pooled in the joints further contaminates the sample before it falls from the wall. All nine procedural grounds stated for Packet A apply with equal force to Packet B, with Grounds 3–9 applying identically.",
      defenceHi: "पत्थर चिनाई के जोड़ मात्र 10–25 मिमी चौड़े होते हैं। वर्षा में भीगी पत्थर चिनाई से हथौड़े द्वारा बिना पत्थर के टुकड़े शामिल किये शुद्ध मसाला निकालना शारीरिक रूप से असंभव है। जोड़ों में भरा वर्षाजल नमूने के गिरने से पहले ही उसे दूषित कर देता है। पैकेट A के नौ प्रक्रियागत आधार (आधार 3–9 सहित) पैकेट B पर समान रूप से लागू हैं।",
      standardsEn: "IS 2250:1981 (Reaffirmed 2020), Clause 6.1: Sampling of hardened mortar from dry surfaces only. | BS EN 12504-1:2019, Clause 5.3: Specimens shall not be sampled in rain conditions. | ASTM C823/C823M:2017, Section 8: Ground surfaces protected; safe, stable access mandatory.",
      standardsHi: "IS 2250:1981 (Reaffirmed 2020), धारा 6.1: केवल सूखी सतह से मसाले के नमूने। | BS EN 12504-1:2019, धारा 5.3: वर्षा में नमूना प्रतिबंधित।"
    },
    {
      number: 3,
      titleEn: "Grounds 3–9: Apply Identically as Stated for Packet A",
      titleHi: "आधार 3–9: पैकेट A के समान ही लागू",
      critical: false,
      defenceEn: "All procedural grounds 3 through 9 — broken chain of custody, doubt as to timely testing and proper storage, time frame not verified, tests in absence of contractor, no referee sample retained, no IS cited in report, number of tests not disclosed — apply with identical force to Packet B. The FSL report shows the same omissions for this sample as for Packet A.",
      defenceHi: "आधार 3 से 9 तक — अभिरक्षा श्रृंखला का टूटना, समय पर परीक्षण पर संदेह, संग्रह-परीक्षण समयावधि का पालन न होना, ठेकेदार की अनुपस्थिति में परीक्षण, रेफरी नमूना संरक्षित न होना, रिपोर्ट में IS का उल्लेख न होना, परीक्षणों की संख्या का उल्लेख न होना — ये सभी पैकेट B पर पैकेट A के समान ही लागू होते हैं।",
      standardsEn: "See Grounds 3–9 as documented for Packet A above — all cited standards and legal principles apply equally.",
      standardsHi: "पैकेट A के आधार 3–9 में उद्धृत सभी मानक और विधिक सिद्धांत यहाँ भी समान रूप से लागू हैं।"
    }
  ],
  challenges: [
    {
      id: "B1",
      titleEn: "Challenge B1 — Stone Silica Contamination: The Decisive Scientific Flaw [CRITICAL]",
      titleHi: "चुनौती B1 — पत्थर की सिलिका से संदूषण: निर्णायक वैज्ञानिक दोष [सर्वाधिक महत्वपूर्ण]",
      critical: true,
      bodyEn: "This is the most scientifically significant challenge in the entire brief. The chemical analysis method (IS 4031 Part 5:1988) calculates the cement:sand ratio by measuring total soluble silica. This method assumes that all silica in the sample comes from cement and from sand. For pure mortar extracted from a joint, this is approximately valid. However, stone masonry joint mortar cannot be extracted in pure form by hammer from a wet stone masonry wall — stone fragments inevitably enter the sample. Rajasthan stone types contain: Quartzite: 92–95% SiO₂; Sandstone: 60–80% SiO₂; Granite: 60–75% SiO₂. The silica from these stone fragments is counted as aggregate silica in the IS 4031 Part 5 calculation. As little as 5% stone fragment by weight in the sample — an amount invisible to the naked eye — can shift a true 1:6 mortar to an apparent ratio of 1:14 or worse. The cumulative effect of: (a) stone fragment contamination + (b) carbonation of the mortar surface + (c) the unverified 21% cement silica assumption — all acting in the same direction to make the mix appear leaner — fully explains a calculated ratio of 1:17 without any actual construction defect.",
      bodyHi: "यह संपूर्ण संक्षेप में सर्वाधिक महत्वपूर्ण वैज्ञानिक तर्क है। IS 4031 भाग 5:1988 की रासायनिक विश्लेषण विधि मानती है कि नमूने में सम्पूर्ण सिलिका केवल सीमेंट और रेत से आती है। पत्थर चिनाई के जोड़ों से शुद्ध मसाला हथौड़े से नहीं निकाला जा सकता — पत्थर के टुकड़े अनिवार्यतः नमूने में आते हैं। राजस्थान के पत्थर: क्वार्टज़ाइट: 92–95% SiO₂; बलुआ पत्थर: 60–80% SiO₂; ग्रेनाइट: 60–75% SiO₂। इन पत्थर के टुकड़ों की सिलिका गणना में 'समुच्चय सिलिका' बन जाती है। नमूने में मात्र 5% पत्थर टुकड़ा (जो आँखों को दिखे भी न) 1:6 के वास्तविक मसाले को 1:14 या इससे भी दुर्बल दर्शा सकता है। पत्थर संदूषण + कार्बोनेशन + 21% सिलिका की अप्रमाणित मान्यता — ये तीनों एक ही दिशा में कार्य करते हुए 1:17 के परिणाम की पूरी तरह व्याख्या बिना किसी वास्तविक दोष के हो जाती है।",
      standardsEn: "IS 2250:1981 (Reaffirmed 2020), Clause 6.1: Mortar samples shall be extracted by controlled chiselling of the joint alone, ensuring no masonry unit material is included. Hammer extraction is not recommended. | IS 1597 (Part 1):1992 (Reaffirmed 2018), Clause 6: When testing mortar from existing stone masonry, sampling must ensure separation of mortar from stone; inclusion of stone material invalidates chemical analysis. | ASTM C856:2020, Section 9: Petrographic examination is the standard method for distinguishing mortar from stone fragment material in a mixed sample; chemical analysis alone cannot make this distinction.",
      standardsHi: "IS 2250:1981 (Reaffirmed 2020), धारा 6.1: मसाले के नमूने केवल जोड़ की छेनी से निकाले जाएँ, चिनाई इकाई की सामग्री शामिल न हो। | IS 1597 (Part 1):1992 (Reaffirmed 2018), धारा 6: पत्थर चिनाई से मसाला परीक्षण में मसाले को पत्थर से अलग करना अनिवार्य। | ASTM C856:2020, धारा 9: पेट्रोग्राफिक परीक्षण ही मसाले को पत्थर टुकड़ों से पृथक पहचानने की मानक विधि है।"
    },
    {
      id: "B2",
      titleEn: "Challenge B2 — Implausibility of 1:17 for Any Functional Masonry Mortar",
      titleHi: "चुनौती B2 — 1:17 की किसी कार्यात्मक चिनाई मसाले के लिए असंभाव्यता",
      critical: false,
      bodyEn: "IS 2250:1981 Table 1 lists masonry mortar grades from M1 (1:3) to M5 (1:8). No masonry grade at or near 1:17 is recognised. A mortar at 1:17 would have negligible compressive strength and no cohesion — a wall built with such mortar could not support its own weight. The standing stone masonry boundary wall is direct, physical evidence that the mortar used has sufficient strength to bind the masonry — evidence fundamentally inconsistent with the FSL's reported ratio.",
      bodyHi: "IS 2250:1981 तालिका 1 में M1 (1:3) से M5 (1:8) तक ग्रेड हैं — 1:17 के आसपास कोई ग्रेड नहीं। 1:17 के मसाले में कोई संपीड़न सामर्थ्य नहीं होगी और दीवार अपने भार से ही ढह जाती। खड़ी पत्थर चिनाई सीमा दीवार स्वयं सिद्ध करती है कि प्रयुक्त मसाला पर्याप्त मजबूत था।"
    },
    {
      id: "B3",
      titleEn: "Challenge B3 — The 21% Silica Assumption and Its Compounding Effect",
      titleHi: "चुनौती B3 — 21% सिलिका मान्यता और उसका संचयी प्रभाव",
      critical: false,
      bodyEn: "IS 269:2015 (OPC specification) specifies only a minimum of 17% SiO₂ in cement with no upper limit; actual values range approximately 19–24%. The FSL's assumption of exactly 21% is not prescribed by IS 269:2015 or any Indian Standard. For Packet B, the silica underestimation error from this assumption compounds directly with the stone fragment contamination error — both push the calculated ratio in the same direction, towards an apparently leaner mix. This stacking of compounding errors fully explains the anomalous 1:17 result without any actual construction defect.",
      bodyHi: "IS 269:2015 (OPC विनिर्देश) सीमेंट में केवल न्यूनतम 17% SiO₂ की आवश्यकता है — कोई ऊपरी सीमा नहीं; वास्तविक भिन्नता लगभग 19–24% है। FSL की 21% मान्यता किसी भारतीय मानक द्वारा अनुमोदित नहीं है। पैकेट B में यह त्रुटि पत्थर संदूषण त्रुटि के साथ संचित होती है — दोनों मिलकर मिश्रण को दुर्बल दर्शाती हैं।"
    }
  ]
};

export const packetC: Packet = {
  info: {
    id: "C",
    labelEn: "Packet C — Foundation Concrete (Stone Masonry Wall)",
    labelHi: "पैकेट C — नींव का कंक्रीट (पत्थर चिनाई दीवार)",
    material: { en: "Foundation concrete, stone masonry wall", hi: "पत्थर चिनाई दीवार की नींव का कंक्रीट" },
    fslResult: { en: "Cement : Sand : Grit = 1 : 5.75 : 9.5", hi: "सीमेंट : रेत : गिट्टी = 1 : 5.75 : 9.5" },
    applicableStd: { en: "IS 456:2000 (Reaffirmed 2021) — M10 or M15 for foundations", hi: "IS 456:2000 (Reaffirmed 2021) — नींव हेतु M10 या M15" },
    keyObs: {
      en: "IS 4031 (Part 5) is a cement testing standard, NOT a concrete analysis standard. The FSL applied the fundamentally wrong method.",
      hi: "IS 4031 (भाग 5) सीमेंट परीक्षण मानक है, कंक्रीट विश्लेषण मानक नहीं। FSL ने गलत विधि लागू की।"
    }
  },
  grounds: [
    {
      number: 1,
      titleEn: "Grounds 1–7: Apply Identically as Stated for Packet A",
      titleHi: "आधार 1–7: पैकेट A के समान ही लागू",
      critical: false,
      defenceEn: "All nine procedural grounds stated for Packet A apply with equal force to Packet C. In particular, for Ground 2: Foundation concrete samples are exposed at depth. If the foundation area was submerged under approximately two feet of water (as reported for the site conditions), any chip sample collected would have been immediately immersed in floodwater — altering the chemical composition of the sample before it could be collected.",
      defenceHi: "पैकेट A के नौ प्रक्रियागत आधार पैकेट C पर समान बल के साथ लागू हैं। विशेषतः आधार 2 के लिए: नींव के कंक्रीट नमूने गहराई पर उजागर होते हैं। यदि नींव का क्षेत्र लगभग दो फुट पानी में डूबा हुआ था (जैसा स्थल परिस्थितियों में बताया गया है), तो एकत्रित किया गया कोई भी चिप नमूना बाढ़ के पानी में तुरंत डूब जाता — संग्रह से पहले ही नमूने की रासायनिक संरचना बदल देता।",
      standardsEn: "See Grounds 1–7 as documented for Packet A — all standards apply equally. Ground 2 adapted: foundation in ~2 ft floodwater; sample immersed before collection.",
      standardsHi: "पैकेट A के आधार 1–7 में उद्धृत सभी मानक यहाँ भी लागू हैं। आधार 2 अनुकूलित: नींव ~2 फुट बाढ़ के पानी में; संग्रह से पहले नमूना डूबा।"
    },
    {
      number: 8,
      titleEn: "Ground 8 (Adapted — additionally) — Wrong Method AND No IS Cited [CRITICAL]",
      titleHi: "आधार 8 (अतिरिक्त अनुकूलन) — गलत विधि और IS का उल्लेख नहीं [अत्यंत महत्वपूर्ण]",
      critical: true,
      defenceEn: "For Packet C, not only does the report cite no Indian Standard for the test method, but the method actually used (IS 4031 Part 5 chemical chip analysis) is outside the scope of IS 4031 (Part 5):1988 for concrete. The correct and prescribed methods for verifying concrete in existing structures are IS 516 (Part 5):2020 (core drilling) and ASTM C856:2020 (petrographic examination). None of these was used.",
      defenceHi: "पैकेट C के लिए, न केवल रिपोर्ट में परीक्षण विधि के लिए कोई भारतीय मानक उद्धृत नहीं है, बल्कि वास्तव में प्रयुक्त विधि (IS 4031 भाग 5 रासायनिक चिप विश्लेषण) कंक्रीट के लिए IS 4031 (Part 5):1988 के दायरे से बाहर है। मौजूदा संरचनाओं में कंक्रीट के सत्यापन के लिए सही और निर्धारित विधियाँ IS 516 (Part 5):2020 (कोर ड्रिलिंग) और ASTM C856:2020 (पेट्रोग्राफिक परीक्षण) हैं। इनमें से किसी का भी उपयोग नहीं किया गया।",
      standardsEn: "IS 456:2000 (Reaffirmed 2021), Clause 14–15: Concrete quality verified by compressive strength of drilled cores. | IS 516 (Part 5):2020: Core drilling is the prescribed method for determining concrete quality in existing structures. | IS 4031 (Part 5):1988, Clause 1 — Scope: Method prescribed for hydraulic cement. Application to hardened concrete extends this method beyond its defined scope. | IS/IEC 17025:2017, Clause 7.8.2: Test method reference mandatory in every test report.",
      standardsHi: "IS 456:2000 (Reaffirmed 2021), धारा 14–15: कंक्रीट गुणवत्ता ड्रिल किए गए कोर की संपीड़न शक्ति से सत्यापित। | IS 516 (Part 5):2020: मौजूदा संरचनाओं में कंक्रीट गुणवत्ता निर्धारण की निर्धारित विधि। | IS 4031 (Part 5):1988, धारा 1 — दायरा: विधि हाइड्रोलिक सीमेंट के लिए निर्धारित; कंक्रीट पर इसे इसके परिभाषित दायरे से परे लागू करना।"
    },
    {
      number: 9,
      titleEn: "Ground 9: Applies Identically as Stated for Packet A",
      titleHi: "आधार 9: पैकेट A के समान ही लागू",
      critical: false,
      defenceEn: "No repeatability data, number of determinations, measurement uncertainty, or individual determination values are stated in the report — all mandatory under IS/IEC 17025:2017 Clause 7.8.3.",
      defenceHi: "रिपोर्ट में कोई दोहरान डेटा, निर्धारणों की संख्या, माप अनिश्चितता, या व्यक्तिगत निर्धारण मूल्य नहीं दिया — IS/IEC 17025:2017 धारा 7.8.3 के अन्तर्गत सभी अनिवार्य।",
      standardsEn: "IS 4031 (Part 5):1988 (Reaffirmed 2018), Clause 13: Minimum two concordant determinations required. | IS/IEC 17025:2017, Clause 7.8.3: Repeatability data and measurement uncertainty mandatory.",
      standardsHi: "IS 4031 (Part 5):1988 (Reaffirmed 2018), धारा 13: न्यूनतम दो सुसंगत निर्धारण अनिवार्य।"
    }
  ],
  challenges: [
    {
      id: "C1",
      titleEn: "Challenge C1 — Fundamentally Wrong Analytical Method [DECISIVE]",
      titleHi: "चुनौती C1 — मूलतः गलत विश्लेषणात्मक विधि [निर्णायक]",
      critical: true,
      bodyEn: "This is the single most important technical argument in the entire brief. The chemical analysis method (IS 4031 Part 5:1988) calculates cement content from soluble silica. This method is prescribed by its scope clause (Clause 1) for the analysis of hydraulic cement and, by extension, cementitious mortar (cement + fine aggregate only). It is categorically NOT prescribed for concrete, which additionally contains coarse aggregate (grit/stone chips). In concrete, the coarse aggregate itself is siliceous: Quartzite grit: 92–95% SiO₂; Crushed granite: 60–75% SiO₂; River gravel: 70–85% SiO₂. The IS 4031 Part 5 method determines 'insoluble residue' to find the total aggregate fraction. For mortar (cement + sand only), this is the sand. For concrete, the insoluble residue includes BOTH sand and grit combined — the method cannot separate these. The attempt to report a three-component ratio (cement:sand:grit = 1:5.75:9.5) from this method is scientifically indefensible — it requires independent characterisation of the silica content of each aggregate fraction, which is not stated in the FSL report. The correct and internationally recognised methods for verifying concrete quality in an existing structure are: IS 516 (Part 5):2020 (core drilling and compressive strength testing), ASTM C856:2020 (petrographic examination), IS 13311 (Part 1)&(2):1992 (non-destructive testing — UPV and rebound hammer), BS EN 12504-1:2019 (core extraction from existing structures). None of these was used.",
      bodyHi: "यह संपूर्ण संक्षेप में सर्वाधिक महत्वपूर्ण तकनीकी तर्क है। IS 4031 भाग 5:1988 की रासायनिक विश्लेषण विधि घुलनशील सिलिका से सीमेंट सामग्री की गणना करती है। यह विधि अपने दायरा खंड (धारा 1) द्वारा हाइड्रोलिक सीमेंट और सीमेंटयुक्त मसाले (सीमेंट + बारीक समुच्चय मात्र) के विश्लेषण के लिए निर्धारित है। यह कंक्रीट के लिए स्पष्टतः निर्धारित नहीं है, जिसमें मोटे समुच्चय (गिट्टी/पत्थर के चिप्स) भी होते हैं। कंक्रीट में, मोटे समुच्चय में स्वयं सिलिका होती है: क्वार्टज़ाइट गिट्टी: 92–95% SiO₂; कुचला ग्रेनाइट: 60–75% SiO₂; नदी बजरी: 70–85% SiO₂। IS 4031 Part 5 विधि 'अघुलनशील अवशेष' निर्धारित करती है — मसाले के लिए यह रेत है, कंक्रीट के लिए यह रेत और गिट्टी दोनों हैं और विधि इन्हें अलग नहीं कर सकती। तीन-घटक अनुपात (1:5.75:9.5) की रिपोर्ट वैज्ञानिक रूप से अस्वीकार्य है।",
      standardsEn: "IS 456:2000 (Reaffirmed 2021), Clause 14–15: Concrete quality verified by compressive strength of drilled cores. Chemical analysis of chip samples is not specified as a method. | IS 516 (Part 5):2020: Core drilling is the prescribed method for existing structures. | IS 4031 (Part 5):1988, Clause 1 — Scope: Method prescribed for hydraulic cement only. | ASTM C856:2020: Petrographic examination — standard method for identifying original mix constituents in hardened concrete. Chemical analysis cannot distinguish sand silica from coarse aggregate silica.",
      standardsHi: "IS 456:2000 (Reaffirmed 2021): कंक्रीट गुणवत्ता ड्रिल किए गए कोर की संपीड़न शक्ति से सत्यापित। | IS 516 (Part 5):2020: मौजूदा संरचनाओं में निर्धारित विधि। | IS 4031 (Part 5):1988, धारा 1: विधि केवल हाइड्रोलिक सीमेंट के लिए। | ASTM C856:2020: पेट्रोग्राफिक परीक्षण — कठोर कंक्रीट में मूल मिश्रण घटकों की पहचान की मानक विधि।"
    },
    {
      id: "C2",
      titleEn: "Challenge C2 — Coarse Aggregate Silica Confounds the Ratio Calculation",
      titleHi: "चुनौती C2 — मोटे समुच्चय की सिलिका अनुपात गणना को भ्रमित करती है",
      critical: false,
      bodyEn: "The FSL report lists control samples S1 (sand), S2 (grit), and S3 (grit sample) as received but provides no result for any of them. For the three-component ratio calculation, the silica content of the grit used in the actual construction must be independently determined. Rajasthan quartzite grit contains approximately 92–95% SiO₂ — a 5% variation in assumed grit silica can shift the calculated cement fraction by 10–20%. Without the S2/S3 analysis results stated in the report, the three-component ratio of 1:5.75:9.5 is derived from an opaque, unverifiable calculation.",
      bodyHi: "FSL रिपोर्ट में नियंत्रण नमूने S1 (रेत), S2 (गिट्टी) और S3 (गिट्टी नमूना) प्राप्त बताए गए हैं लेकिन किसी का भी परिणाम नहीं दिया गया है। तीन-घटक अनुपात गणना के लिए, वास्तविक निर्माण में प्रयुक्त गिट्टी की सिलिका सामग्री स्वतंत्र रूप से निर्धारित होनी चाहिए। राजस्थान क्वार्टज़ाइट गिट्टी में लगभग 92–95% SiO₂ है — मानी गई गिट्टी सिलिका में 5% भिन्नता से गणना किए गए सीमेंट अंश में 10–20% का बदलाव हो सकता है।"
    },
    {
      id: "C3",
      titleEn: "Challenge C3 — Specification Context and Physical Evidence",
      titleHi: "चुनौती C3 — विनिर्देश संदर्भ और भौतिक साक्ष्य",
      critical: false,
      bodyEn: "IS 456:2000 Table 5 specifies a minimum of M10 concrete for plain foundation work in mild exposure conditions. The specification for foundation concrete is expressed as a strength grade, not as a volume mix ratio. A comparison of a volume ratio against a strength-based specification requires an assumption about the water-cement ratio, compaction, and curing — none of which can be assessed from chip sample analysis. Furthermore, the foundation concrete has carried the load of the stone masonry wall since construction — its continued structural integrity is direct evidence that the concrete quality is adequate.",
      bodyHi: "IS 456:2000 तालिका 5 हल्के एक्सपोजर स्थितियों में सादे नींव कार्य के लिए न्यूनतम M10 कंक्रीट निर्दिष्ट करती है। नींव कंक्रीट के लिए विनिर्देश शक्ति ग्रेड के रूप में व्यक्त किया गया है, आयतन मिश्रण अनुपात के रूप में नहीं। एक आयतन अनुपात की शक्ति-आधारित विनिर्देश से तुलना के लिए जल-सीमेंट अनुपात, संघनन और इलाज के बारे में धारणाओं की आवश्यकता है — जिनमें से कोई भी चिप नमूना विश्लेषण से नहीं जाना जा सकता। इसके अलावा, नींव कंक्रीट निर्माण के बाद से पत्थर चिनाई दीवार का भार वहन कर रहा है — इसकी निरंतर संरचनात्मक अखंडता पर्याप्त कंक्रीट गुणवत्ता का प्रत्यक्ष प्रमाण है।"
    }
  ]
};

export const commonSection = {
  silicaAssumptionEn: `The FSL report explicitly states: "As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica."

This single sentence undermines the quantitative basis of all three results simultaneously:

1. IS 269:2015 (Ordinary Portland Cement) specifies only a minimum of 17% SiO₂ with no fixed upper limit. Actual variation: approximately 19–24%.

2. A 2% underestimation of true cement silica (21% assumed vs. 23% actual) shifts the calculated cement:sand ratio by approximately 10%, potentially converting a compliant 1:6 to an apparent 1:6.6.

3. With compounding effects (carbonation for Packet A, stone contamination for Packet B, wrong method for Packet C), small errors in the silica assumption produce large errors in the calculated ratio.

4. IS 4031 (Part 5):1988 Clause 4 mandates a verified cement control sample for chemical analysis. Where unavailable, the result "shall be accompanied by a statement that it is indicative only." The FSL report does not include this mandatory qualification.`,

  silicaAssumptionHi: `FSL रिपोर्ट में स्पष्ट रूप से कहा गया है: "नियंत्रण नमूना नहीं मिला, इसलिए यह मानकर कि उत्तम गुणवत्ता के सीमेंट में 21% घुलनशील सिलिका होती है, अनुपात की गणना की गई।"

यह एक वाक्य तीनों परिणामों की मात्रात्मक आधार को एक साथ कमजोर करता है:

1. IS 269:2015 (साधारण पोर्टलैंड सीमेंट) केवल न्यूनतम 17% SiO₂ निर्दिष्ट करता है, कोई निश्चित ऊपरी सीमा नहीं। वास्तविक भिन्नता: लगभग 19–24%।

2. वास्तविक सीमेंट सिलिका का 2% कम अनुमान (21% माना बनाम 23% वास्तविक) गणना किए गए सीमेंट:रेत अनुपात को लगभग 10% बदलता है, संभावित रूप से एक अनुपालक 1:6 को 1:6.6 में परिवर्तित करता है।

3. संयुक्त प्रभावों के साथ (पैकेट A के लिए कार्बोनेशन, पैकेट B के लिए पत्थर संदूषण, पैकेट C के लिए गलत विधि), सिलिका धारणा में छोटी त्रुटियां गणना किए गए अनुपात में बड़ी त्रुटियां उत्पन्न करती हैं।

4. IS 4031 (Part 5):1988 धारा 4 रासायनिक विश्लेषण के लिए सत्यापित सीमेंट नियंत्रण नमूना अनिवार्य करती है। जहाँ अनुपलब्ध हो, परिणाम के साथ यह कथन अनिवार्य: "यह केवल संकेतात्मक है।" FSL रिपोर्ट में यह अनिवार्य अर्हता नहीं है।`,

  conclusionEn: `The FSL report is vitiated on multiple independent grounds, any one of which would be sufficient to exclude or substantially discount the evidence:

• Nine procedural violations applicable to all three packets: absence of contractor representative at sampling and testing; sampling in storm conditions with unsafe equipment; broken chain of custody; unverified storage and testing timelines; absence of referee sample; no Indian Standard cited; no number of determinations stated.

• Material-specific scientific defects: carbonation and substrate contamination for Packet A; stone silica contamination for Packet B; fundamentally inapplicable analytical method for Packet C.

• The unverified 21% silica assumption undermining the quantitative basis of all three results.

• No cement control sample supplied or obtained — making all results indicative only under IS 4031 (Part 5):1988 Clause 4.`,

  conclusionHi: `FSL रिपोर्ट अनेक स्वतंत्र आधारों पर दूषित है, जिनमें से कोई भी एक साक्ष्य को बाहर करने या पर्याप्त रूप से कम करने के लिए पर्याप्त होगा:

• नौ प्रक्रियागत उल्लंघन — तीनों पैकेटों पर लागू: नमूना संग्रह और परीक्षण में ठेकेदार प्रतिनिधि की अनुपस्थिति; तूफान परिस्थितियों में असुरक्षित उपकरण से नमूना संग्रह; टूटी हुई अभिरक्षा श्रृंखला; असत्यापित भंडारण और परीक्षण समयसीमाएँ; रेफरी नमूने की अनुपस्थिति; कोई भारतीय मानक उद्धृत नहीं; निर्धारणों की संख्या नहीं बताई।

• सामग्री-विशिष्ट वैज्ञानिक दोष: पैकेट A के लिए कार्बोनेशन और सब्सट्रेट संदूषण; पैकेट B के लिए पत्थर सिलिका संदूषण; पैकेट C के लिए मूलतः अनुपयुक्त विश्लेषणात्मक विधि।

• अप्रमाणित 21% सिलिका धारणा तीनों परिणामों की मात्रात्मक आधार को कमजोर करती है।

• कोई सीमेंट नियंत्रण नमूना नहीं — IS 4031 (Part 5):1988 धारा 4 के अनुसार सभी परिणाम केवल संकेतात्मक।`,

  prayerEn: `It is most respectfully prayed that:

1. The FSL results for Packets A, B, and C be excluded from consideration, or be accorded no probative weight, on the ground that they were generated in violation of every applicable Indian Standard for sampling, chain of custody, testing, and reporting.

2. In the alternative, a fresh test be directed: (a) with at least 48 hours' advance notice to the contractor; (b) with the contractor's representative present at sampling and testing; (c) by the correct method for each material (IS 1661/IS 516 for plaster, IS 2250 for mortar, IS 516 Part 5:2020 core drilling for concrete); (d) with a verified cement control sample and the actual aggregate samples used in the original construction.

3. The contractor be held entitled to provide the cement batch records, aggregate quality certificates, and any mix design documentation in further evidence.

4. No adverse order be passed on the basis of the existing FSL report.`,

  prayerHi: `अत्यंत सादर निवेदन है कि:

1. पैकेट A, B और C के FSL परिणामों को विचार से बाहर किया जाए, या कोई प्रमाणिक भार न दिया जाए, इस आधार पर कि वे नमूना, अभिरक्षा श्रृंखला, परीक्षण और रिपोर्टिंग के लिए प्रत्येक लागू भारतीय मानक के उल्लंघन में उत्पन्न किए गए।

2. वैकल्पिक रूप से, एक नया परीक्षण निर्देशित किया जाए: (क) ठेकेदार को कम से कम 48 घंटे की अग्रिम सूचना के साथ; (ख) नमूना संग्रह और परीक्षण में ठेकेदार के प्रतिनिधि की उपस्थिति के साथ; (ग) प्रत्येक सामग्री के लिए सही विधि द्वारा (प्लास्टर के लिए IS 1661/IS 516, मसाले के लिए IS 2250, कंक्रीट के लिए IS 516 Part 5:2020 कोर ड्रिलिंग); (घ) सत्यापित सीमेंट नियंत्रण नमूने और मूल निर्माण में प्रयुक्त वास्तविक समुच्चय नमूनों के साथ।

3. ठेकेदार को सीमेंट बैच रिकॉर्ड, समुच्चय गुणवत्ता प्रमाणपत्र और कोई भी मिश्रण डिजाइन दस्तावेज आगे के साक्ष्य में प्रदान करने का अधिकार दिया जाए।

4. मौजूदा FSL रिपोर्ट के आधार पर कोई प्रतिकूल आदेश पारित न किया जाए।`
};

export const standardsCited = [
  { std: "IS 1199 (Part 5):2018", title: "Sampling of Hardened Concrete [Supersedes IS 1199:1959]", status: "Current" },
  { std: "IS 516 (Part 1):2018", title: "Methods of Tests for Strength of Concrete [Supersedes IS 516:1959]", status: "Current" },
  { std: "IS 516 (Part 5):2020", title: "Core Drilling from Existing Concrete Structures", status: "Current" },
  { std: "IS 4031 (Part 1):1996", title: "Physical Tests for Hydraulic Cement", status: "Reaffirmed 2018" },
  { std: "IS 4031 (Part 5):1988", title: "Chemical Analysis of Hydraulic Cement", status: "Reaffirmed 2018" },
  { std: "IS 269:2015", title: "Ordinary Portland Cement", status: "Current" },
  { std: "IS 383:2016", title: "Coarse and Fine Aggregates for Concrete", status: "Current" },
  { std: "IS 1661:1972", title: "Application of Cement and Cement-Lime Plaster Finishes", status: "Reaffirmed 2020" },
  { std: "IS 2402:1963", title: "External Rendered Finishes", status: "Reaffirmed 2018" },
  { std: "IS 1542:1992", title: "Sand for Plaster", status: "Reaffirmed 2018" },
  { std: "IS 2250:1981", title: "Preparation and Use of Masonry Mortars", status: "Reaffirmed 2020" },
  { std: "IS 1597 (Part 1):1992", title: "Construction of Stone Masonry", status: "Reaffirmed 2018" },
  { std: "IS 2116:1980", title: "Sand for Masonry Mortars", status: "Reaffirmed 2018" },
  { std: "IS 456:2000", title: "Plain and Reinforced Concrete", status: "Reaffirmed 2021" },
  { std: "IS 10262:2019", title: "Concrete Mix Proportioning Guidelines", status: "Current" },
  { std: "IS 13311 (Part 1):1992", title: "NDT of Concrete — Ultrasonic Pulse Velocity", status: "Reaffirmed 2018" },
  { std: "IS 13311 (Part 2):1992", title: "NDT of Concrete — Rebound Hammer", status: "Reaffirmed 2018" },
  { std: "IS/IEC 17025:2017", title: "General Requirements for Laboratory Competence", status: "Current" },
  { std: "NABL 160", title: "NABL Accreditation Requirements (ISO/IEC 17025 Implementation) — Chain of Custody & Witness Notification", status: "Current" },
  { std: "ASTM C823/C823M:2017", title: "Examination and Sampling of Hardened Concrete in Constructions", status: "Current" },
  { std: "ASTM C856:2020", title: "Petrographic Examination of Hardened Concrete", status: "Current" },
  { std: "BS EN 14630:2006", title: "Determination of Carbonation Depth", status: "Current" },
  { std: "BS EN 12504-1:2019", title: "Core Drilling from Existing Concrete Structures", status: "Current" }
];

// ============================================================
// HEMRAJ'S ACTUAL WRITTEN REPLY — facts, statements, data
// Source: pages 01–06 of the reply document submitted in proceedings
// ============================================================
export const replyFacts = {
  projectContext: {
    titleEn: "Project: Cricket Stadium (Maharana Pratap Khelagaon, Chitrakoot Nagar, Bhiwana)",
    titleHi: "परियोजना: क्रिकेट स्टेडियम, महाराणा प्रताप खेलागांव, चित्रकूट नगर, भीवाना",
    agencyEn: "Investigating Agency: ACB (Anti-Corruption Bureau / भ्रष्टाचार निरोधक ब्यूरो)",
    agencyHi: "जाँच एजेंसी: भ्रष्टाचार निरोधक ब्यूरो (ACB)",
    technicalCommitteeEn: "Technical committee's inspection confirmed: east spectator gallery walls broke, stairs sank, cracks appeared throughout — stadium declared unsafe without reconstruction.",
    technicalCommitteeHi: "तकनीकी समिति की जाँच: स्टेडियम की पूर्वी दर्शक दीर्घों की दीवार टूट गई, सिढ़या धंस गई, जगह-जगह दरारें आ गईं — स्टेडियम बिना पुनः निर्माण उपयोग के आशियत नहीं।"
  },

  constructionTimeline: {
    titleEn: "Critical Timeline — Construction to Sampling to Report",
    titleHi: "महत्वपूर्ण समयरेखा — निर्माण से नमूने तक और रिपोर्ट तक",
    events: [
      {
        en: "Construction work carried out: 2007–2008 (rainy season — heavy rainfall every year)",
        hi: "निर्माण कार्य: 2007–2008 (वर्षा ऋतु — प्रतिवर्ष भारी वर्षा)"
      },
      {
        en: "Sample collected by ACB: 2011 — i.e., 2.5 years (approximately 2 years 6 months) after construction",
        hi: "ACB द्वारा नमूना संग्रह: वर्ष 2011 — निर्माण के लगभग 2 वर्ष 6 माह पश्चात"
      },
      {
        en: "FSL report issued: 15.4.2012 — i.e., approximately 6 months after sampling",
        hi: "FSL रिपोर्ट: 15.4.2012 — नमूना संग्रह के लगभग 6 माह बाद"
      },
      {
        en: "Total gap: construction (2007-08) → sample (2011) → report (15.4.2012) = minimum 3+ years of rain, sun, wind, soil exposure acting adversely on the already-damaged wall from which the sample was taken",
        hi: "कुल अंतराल: निर्माण (2007-08) → नमूना (2011) → रिपोर्ट (15.4.2012) = न्यूनतम 3 वर्षों की बारिश, हवा, धूप, मिट्टी का निरंतर प्रतिकूल प्रभाव"
      }
    ],
    legalSignificanceEn: "IS 1199 (Part 5):2018 and IS 4031 (Part 5):1988 require timely testing. A sample taken 2.5 years after construction from a wall that had already sustained weather damage, stored in uncontrolled conditions for 6 months before testing, cannot produce a reliable chemical ratio. This single fact independently vitiates the entire FSL report.",
    legalSignificanceHi: "IS 1199 (Part 5):2018 और IS 4031 (Part 5):1988 समय पर परीक्षण की माँग करते हैं। निर्माण के 2.5 वर्ष बाद क्षतिग्रस्त दीवार से लिया गया, 6 माह अनियंत्रित परिस्थितियों में संग्रहीत नमूना विश्वसनीय रासायनिक अनुपात नहीं दे सकता।"
  },

  sampleStorageConditions: {
    titleEn: "Sample Storage: Cement Bags for 6 Months [CRITICAL]",
    titleHi: "नमूना भंडारण: 6 माह सीमेंट के कट्टों में [अत्यंत महत्वपूर्ण]",
    enText: "The sample was stored in cement bags (सीमेंट के कट्टों में भरकर रखा गया). The condition in which the sample remained for 6 months is highly doubtful, as atmospheric temperature and pressure directly affect sample quality. Cement bags are porous, permeable to moisture, and do not provide the controlled storage environment mandated by IS/IEC 17025:2017 Clause 7.4.3. Moisture ingress during storage accelerates carbonation — the precise reaction that reduces apparent cement content in chemical analysis.",
    hiText: "नमूना सीमेंट के कट्टों में भरकर रखा गया। 6 माह तक उक्त नमूना किस कंडीशन में पड़ा रहा यह भी संदेहास्पद है, क्योंकि इस तरह के नमूने की गुणवत्ता पर वातावरण के टेम्परेचर एवं प्रेशर का प्रभाव पड़ता ही है। सीमेंट के बोरे नमी-पारगम्य होते हैं और IS/IEC 17025:2017 धारा 7.4.3 द्वारा अनिवार्य नियंत्रित भंडारण वातावरण प्रदान नहीं करते।"
  },

  marbLeSlurryConditions: {
    titleEn: "Site Conditions at Sampling: Marble Slurry White Quicksand [CRITICAL]",
    titleHi: "नमूना संग्रह के समय स्थल की स्थिति: मार्बल स्लरी — सफेद दलदल [अत्यंत महत्वपूर्ण]",
    enText: "On the day of sampling, the entire stadium was filled with rainwater. Marble slurry mixed with rainwater had turned into white quicksand (मार्बल स्लरी वर्षा जल में घुलकर सफेद दलदल बन चुकी थी). The mortar sample for masonry and plaster was taken from this marble slurry-soaked rainwater area. Marble slurry (CaCO₃ + MgCO₃) introduced external calcium carbonate into the sample — directly inflating the apparent carbonate fraction and suppressing the calculated cement content in the IS 4031 Part 5 analysis.",
    hiText: "नमूना लेने के दिन पूरा स्टेडियम वर्षा जल से भरा हुआ था। मार्बल स्लरी वर्षा जल में घुलकर सफेद दलदल बन चुकी थी। चुनाई व प्लास्टर हेतु लिया गया मसाले का नमूना मार्बल स्लरी युक्त वर्षा के जल में घुले हुए थे। मार्बल स्लरी (CaCO₃ + MgCO₃) नमूने में बाह्य कार्बोनेट अंश मिलाती है — IS 4031 भाग 5 विश्लेषण में कैल्शियम कार्बोनेट अंश को बढ़ाकर सीमेंट सामग्री की गणना को कम दर्शाती है।"
  },

  gScheduleComparison: {
    titleEn: "G-Schedule vs FSL Report — Comparison Table (Date of Random Inspection: 21.08.2010)",
    titleHi: "जी-शिड्यूल बनाम FSL रिपोर्ट — तुलनात्मक तालिका (आकस्मिक निरीक्षण: 21.08.2010)",
    rows: [
      {
        sno: "1",
        item: "Plaster Sample Mark-A",
        itemHi: "प्लास्टर का सेम्पल मार्क-A",
        specRequired: "1:6",
        fslResult: "1:6",
        verdict: "MATCH",
        verdictHi: "मेल"
      },
      {
        sno: "2",
        item: "Masonry/Cement Mortar Mark-B",
        itemHi: "चुनाई (सीमेंट मोटार) सेम्पल मार्क-B",
        specRequired: "1:4",
        fslResult: "1:17",
        verdict: "MISMATCH — Challenged",
        verdictHi: "अंतर — चुनौती दी गई"
      },
      {
        sno: "3",
        item: "P.C.C. Sample Mark-C",
        itemHi: "पी.सी.सी. का सेम्पल मार्क-C",
        specRequired: "1:4:8",
        fslResult: "1:5¾:9½",
        verdict: "MISMATCH — Challenged",
        verdictHi: "अंतर — चुनौती दी गई"
      }
    ],
    noteEn: "The plaster (Mark-A) matches its G-Schedule specification exactly (1:6 = 1:6). The prosecution's case rests entirely on Mark-B and Mark-C, both challenged above. The fact that even the FSL correctly identifies the plaster as 1:6 (matching specification) shows the FSL's chemical method can corroborate compliant work — the errors in Mark-B and Mark-C arise from the specific material-contamination issues identified in the defence.",
    noteHi: "प्लास्टर (मार्क-A) अपने जी-शिड्यूल विनिर्देश से पूर्णतः मेल खाता है (1:6 = 1:6)। अभियोजन का मामला पूर्णतः मार्क-B और मार्क-C पर निर्भर है, जिन्हें ऊपर चुनौती दी गई है।"
  },

  insufficientSamplingQuantity: {
    titleEn: "Insufficient Sampling: 1 Sample Taken vs Hundreds Required (IS 456:2000 Cl.15.2.2 Pg.29) [CRITICAL]",
    titleHi: "अपर्याप्त नमूना संख्या: 1 नमूना लिया बनाम सैकड़ों आवश्यक [अत्यंत महत्वपूर्ण]",
    isStandard: "IS 456:2000 Clause 15.2.2 Page 29 — Frequency of Sampling for Construction Works:",
    frequencies: [
      { item: "RCC / Cement Concrete", freq: "4 test sets per 50 Cum + 1 extra per 50 Cum (1 test set = 6 cubes)" },
      { item: "Plaster", freq: "2 tests per 1000 Sqm" },
      { item: "Masonry", freq: "1 test per 10 Cum" }
    ],
    workQuantities: [
      { sno: 1, item: "Plaster", itemHi: "प्लास्टर", qty: "8423.52 Sqm", required: "102 Nos.", acbTook: "1 (One)" },
      { sno: 2, item: "Masonry", itemHi: "चुनाई", qty: "16081.38 Cum", required: "2219 Nos.", acbTook: "1 (One)" },
      { sno: 3, item: "Cement Concrete", itemHi: "सीमेंट कंक्रीट", qty: "3721.46 Cum", required: "462 Nos.", acbTook: "1 (One)" }
    ],
    enText: "The ACB took only ONE sample each for all three items and prepared a report condemning the entire work — this is completely impermissible in law. As per IS 456:2000 Clause 15.2.2, the quantities in this case required 102 plaster samples, 2219 masonry samples and 462 concrete samples. Taking 1 sample from one location and condemning the entirety of 8423 sqm of plaster, 16081 Cum of masonry and 3721 Cum of concrete is neither scientifically nor legally valid.",
    hiText: "ACB ने केवल एक-एक नमूना लेकर संपूर्ण कार्य को घटिया बताया — यह विधिसंगत नहीं है। IS 456:2000 धारा 15.2.2 के अनुसार इस प्रकरण में 102 प्लास्टर, 2219 चुनाई और 462 कंक्रीट नमूने आवश्यक थे। एक स्थान से लिए गए एक नमूने के आधार पर 8423 वर्गमीटर प्लास्टर, 16081 क्यूम चुनाई और 3721 क्यूम कंक्रीट को घटिया घोषित करना न वैज्ञानिक है न विधिसंगत।"
  },

  rahulEngineeringNABL: {
    titleEn: "Contractor's Independent Tests — Messrs Rahul Engineering (NABL Approved) [EXCULPATORY]",
    titleHi: "ठेकेदार के स्वतंत्र परीक्षण — मैसर्स राहुल इंजीनियरिंग (NABL स्वीकृत) [निर्दोष साक्ष्य]",
    enText: "The contractor's work was tested from time to time by officials through Messrs Rahul Engineers — a NABL-accredited, department-authorized laboratory. All tests conducted at Rahul Engineering Laboratory are legally valid and passed. The tests conducted by the ACB/FSL are, by contrast, not legally valid (विधि मान्य नहीं) because: (a) FSL is a forensic science laboratory, not an IS-accredited construction material testing laboratory; (b) neither the B.Tech/M.Tech civil engineering curriculum nor any IS Code, National Building Code, Morth Specification or NDT textbook prescribes FSL chemical testing for quality assessment of construction works. The charges against the accused on this basis are therefore false.",
    hiText: "ठेकेदार के कार्य की समय-समय पर अधिकारियों द्वारा मैसर्स राहुल इंजीनियर्स से टेस्ट करवाए गए हैं जो NABL से approved होकर विभाग द्वारा अनुमोदित लेबोरेट्री है। मैसर्स राहुल इंजीनियरिंग लेबोरेट्री में कराये गये टेस्ट विधि मान्य हैं, जबकि ACB/FSL द्वारा कराये गये टेस्ट विधि मान्य नहीं हैं। सिविल इंजीनियरिंग के B.Tech & M.Tech पाठ्यक्रम में किसी भी Text book तथा BIS के किसी भी IS Code में किये गये कार्य की गुणवत्ता का परीक्षण FSL के माध्यम से कराने का उल्लेख नहीं है।"
  },

  photographsInFile: {
    titleEn: "FSL's Own Photographs Prove Unscientific Sampling [IN THE COURT FILE]",
    titleHi: "FSL के स्वयं के फोटोग्राफ अवैज्ञानिक नमूना संग्रह सिद्ध करते हैं [पत्रावली पर उपलब्ध]",
    enText: "During the sampling process, the FSL department itself had photographs taken which are available on the file (पत्रावली पर उपलब्ध है). In one of these photographs, a worker is breaking plaster with a chisel and hammer (छैनी हथोड़ी लेकर प्लास्टर को तोड़ा जा रहा है). This photographic evidence, produced by the prosecution itself, demonstrates: (a) that sampling was done by hammer/chisel impact, not by controlled extraction; (b) that the worker was performing uncontrolled demolition rather than scientific sampling; (c) that substrate contamination from stone masonry was inevitable. These photographs are available on the prosecution's own file and constitute self-defeating evidence.",
    hiText: "सेम्पलिंग लेने की प्रक्रिया में एफ.एस.एल. विभाग द्वारा फोटोग्राफस खिंचवाये गये हैं जो पत्रावली पर उपलब्ध हैं। इन फोटोग्राफस में से एक फोटोग्राफ में एक कार्यकर्ता द्वारा छैनी हथोड़ी लेकर प्लास्टर को तोड़ा जा रहा है। यह अभियोजन का स्वयं का साक्ष्य है — जो अवैज्ञानिक नमूना संग्रह को सिद्ध करता है।"
  },

  investigationMalice: {
    titleEn: "Malice of Investigating Agency — Deliberately Chose Damaged Wall Location",
    titleHi: "जाँच एजेंसी की दुर्भावना — जानबूझकर क्षतिग्रस्त दीवार का स्थान चुना",
    enText: "The investigation agency deliberately chose the specific location where: (a) slurry had accumulated (स्लरी जमा थी); (b) there was no water drainage arrangement (पानी की निकासी की कोई व्यवस्था नहीं थी); (c) due to weather and ground conditions, a small crack had appeared in the wall (मौसम एवं जमीनी परिस्थितियों के कारण दीवार में छोटा सा क्रेक आ गया था); (d) the contractor himself had demolished approximately 100 feet of wall for repair (अभियुक्त स्वयं द्वारा लगभग 100 फीट की दीवार को गिराया गया था, जिसे रिपेयर करने हेतु). The ACB took the sample from this already-damaged, slurry-contaminated, pre-demolition section. In light of these specific site conditions, such samples can never meet the prescribed standards.",
    hiText: "अनुसंधान एजेंसी द्वारा जानबूझकर उस स्थान पर जहाँ स्लरी जमा थी और पानी की निकासी की कोई व्यवस्था नहीं थी, जहाँ मौसम एवं जमीनी परिस्थितियों के कारण दीवार में छोटा सा क्रेक आ गया था — इसे रिपेयर करने हेतु अभियुक्त स्वयं द्वारा लगभग 100 फीट की दीवार को गिराया गया था — उस क्षतिग्रस्त दीवार से नमूना लिया गया। मौके की परिस्थिति विशेष के परिप्रेक्ष्य में इस तरह का लिया गया सेम्पल कभी भी मानक नहीं पाया जा सकता।"
  },

  physicalImpossibilityArgument: {
    titleEn: "Physical Impossibility — Wall Stands; It Could Not at 1:18 / 1:17",
    titleHi: "भौतिक असंभाव्यता — दीवार खड़ी है; 1:18 / 1:17 पर यह संभव नहीं",
    enText: "Point 6 of the reply states: The prosecution alleges that ratios in the wall made by the accused are 1:18, 1:17 and 1:5¾:9½. If these facts were true, then: (a) the wall should crumble just by touching it (दीवार हाथ लगाते ही भर-भरा कर गिर जानी चाहिये); (b) the plaster should have fallen off on its own (प्लास्टर स्वयं ही उखड़ जाना चाहिये); (c) work done at the alleged ratio could not stand for even 24 hours under any circumstances (किसी भी परिस्थितियों में 24 घण्टे भी खड़ा नहीं रह सकता).\n\nThe wall did stand. The sampling process itself involved workers using chisel and hammer to break it. A wall that requires chisel-and-hammer force to break is manifestly not a 1:18 or 1:17 mix. The allegations against the contractor are completely unjustified and contrary to facts — merely false (विधिसंगत नहीं होकर तथ्यों के परे होकर मिथ्या मात्र है).",
    hiText: "बिंदु 6: अभियोजन पक्ष द्वारा अभियुक्त पर यह आक्षेप लगाया गया है कि अभियुक्त द्वारा बनाई गई दीवार में अवयवों का आनुपातिक संघटन ratio 1:18, 1:17 एवं 1:5¾:9½ पाया गया है। यदि यह तथ्य सही है तो ऐसी स्थिति में दीवार हाथ लगाते ही भर-भरा कर गिर जानी चाहिये, प्लास्टर स्वयं ही उखड़ जाना चाहिये। यदि जिस रेसियों में अभियुक्त द्वारा कार्य करना बताया गया है, उस रेसियों में किया गया कार्य किन्हीं भी परिस्थितियों में 24 घण्टे भी खड़ा नहीं रह सकता है। जो आक्षेप ठेकेदार पर लगाये गये हैं, वे आक्षेप कतई विधिसंगत नहीं होकर तथ्यों के परे होकर मिथ्या मात्र है।"
  },

  fslNotPrescribedByISCodes: {
    titleEn: "FSL Chemical Testing NOT Prescribed in Any IS Code, NBC, Morth Specification or NDT Textbook",
    titleHi: "FSL रासायनिक परीक्षण किसी भी IS Code, NBC, Morth Specification या NDT पाठ्यपुस्तक में अनुमोदित नहीं",
    enText: "The reply states (Point जवाब, page 02): FSL is a chemical test in which the cement quantity cannot be directly extracted but only estimated from silica content. Therefore FSL-conducted chemical tests for physical testing of civil construction materials are NOT valid (वैध नहीं हैं). The complete B.Tech & M.Tech civil engineering curriculum (6 years total) — no textbook and no BIS IS Code mentions quality testing of construction work through the FSL. Quality testing is prescribed in: IS Code, National Building Code (NBC), Morth Specification, Civil Engineering Quality Control, and NDT (Non-Destructive Test) textbooks — none of which include FSL chemical chip analysis for in-situ construction materials.",
    hiText: "यह एक केमिकल परीक्षण है जिसमें सीधे तौर पर सीमेंट की मात्रा न निकालकर सिलीका कन्टेन्ट के आधार पर सीमेंट की मात्रा का अनुमान ही लगाया जा सकता है। अतः सिविल निर्माण कार्य में प्रयुक्त सामग्री के भौतिक परीक्षण हेतु FSL द्वारा किये गये रासायनिक परीक्षण वैध नहीं हैं। सिविल इंजीनियरिंग के B.Tech & M.Tech पाठ्यक्रम (6 वर्ष) में किसी भी Text book तथा Bureau of Indian Standard के किसी भी IS Code में किये गये कार्य की गुणवत्ता का परीक्षण FSL के माध्यम से कराने का उल्लेख नहीं है। इस हेतु IS Code, National Building Code, Morth Specification & Civil Engineering की Quality Control एवं NDT (Non-destructive test) Text book में निर्धारित टेस्ट का उल्लेख है।"
  },

  singleSampleNotRepresentative: {
    titleEn: "Single Sample from One Location Cannot Represent Entire Wall — Civil Engineering Principle",
    titleHi: "एक स्थान से लिया गया एक नमूना संपूर्ण दीवार का प्रतिनिधि नहीं — सिविल इंजीनियरिंग सिद्धांत",
    enText: "Point 5 of the reply states: The sampling technique mandates that a sample must be a representative sample (representative sample) capable of revealing the quality of the entire work. Condemning the entire work on the basis of a sample taken from only one location is not legally permissible. In this case, only one sample from one location was taken to show the entire work as substandard — this fact exposes the malice of the investigation agency. Also, per civil engineering principles, a sample taken from a single location cannot be a representative sample of the entire wall (एक ही स्थान से लिया गया सेम्पल सम्पूर्ण दीवार का रिप्रजेन्टेटिव सेम्पल नहीं माना जा सकता है).",
    hiText: "बिंदु 5: सेम्पलिंग तकनीक में सबसे मुख्य बात यह है कि सेम्पल एक representative sample होना चाहिये जो सम्पूर्ण कार्य की गुणवत्ता को उजागर कर सके। केवल मात्र एक जगह से लिये गये सेम्पल के आधार पर सम्पूर्ण कार्य को गुणवताहीन ठहराया जाना विधिसंगत नहीं है। हरतगत प्रकरण में केवल मात्र एक जगह से ही सेम्पल लिया जाकर सम्पूर्ण कार्य को गुणताहीन दर्शाया गया जो तथ्य अनुसंधान एजेंसी की दुर्भावना को सुस्पष्ट करता है। सिविल इंजीनियरिंग के सिद्धान्तों के अनुसार एक ही स्थान से लिया गया सेम्पल सम्पूर्ण दीवार का रिप्रजेन्टेटिव सेम्पल नहीं माना जा सकता है।"
  }
};

export const verifiedPrecedents = [
  {
    citation: "A.K. Kraipak v. Union of India, AIR 1970 SC 150, Para 20",
    principle: "Nemo judex in causa sua — a person cannot be a judge in their own cause; natural justice requires impartiality in quasi-judicial proceedings.",
    grounds: "Grounds 1 & 6 (sampling and testing without contractor)",
    status: "VERIFIED"
  },
  {
    citation: "Maneka Gandhi v. Union of India, (1978) 1 SCC 248",
    principle: "Audi Alteram Partem — the right to be heard is an essential component of natural justice; no adverse order can be passed without affording opportunity.",
    grounds: "Grounds 1 & 6 (all three packets)",
    status: "VERIFIED"
  },
  {
    citation: "State of W.B. v. Binapani Dei, AIR 1967 SC 1269",
    principle: "Quasi-judicial authority must act judicially and afford fair hearing before passing adverse orders.",
    grounds: "Ground 1 — absence at sampling",
    status: "VERIFIED"
  },
  {
    citation: "Siemens Engineering and Manufacturing Co. v. Union of India, (1976) 2 SCC 981",
    principle: "Duty to give reasons in quasi-judicial proceedings; an order without reasons cannot be sustained.",
    grounds: "Ground 8 — report cites no IS standard or reasoning",
    status: "VERIFIED"
  },
  {
    citation: "Union of India v. Mohd. Ramzan Khan, (1991) 1 SCC 588",
    principle: "Right of the delinquent to participate in proceedings that affect his livelihood is a fundamental aspect of natural justice.",
    grounds: "Grounds 1 & 6 — absence at all critical stages",
    status: "VERIFIED"
  },
  {
    citation: "Union of India v. Tulsiram Patel, (1985) 3 SCC 398",
    principle: "The charged party must have a genuine opportunity to meet the case against them at every material stage of the inquiry.",
    grounds: "Ground 6 — testing without contractor presence",
    status: "VERIFIED"
  },
  {
    citation: "Mohd. Khalid v. State of W.B., (2002) 7 SCC 334",
    principle: "Gaps in chain of custody and procedural irregularities in sample handling create reasonable doubt in favour of the respondent.",
    grounds: "Ground 3 — broken chain of custody",
    status: "VERIFIED"
  },
  {
    citation: "State of H.P. v. Jai Lal, (1999) 7 SCC 280",
    principle: "Expert evidence must state the methodology, tests conducted, and the standard used; an expert report silent on methodology cannot be relied upon as conclusive proof.",
    grounds: "Grounds 8 & 9 — no IS cited, no test count",
    status: "VERIFIED"
  },
  {
    citation: "Tomaso Bruno v. State of U.P., (2015) 7 SCC 178",
    principle: "Adverse inference under Section 114 Illustration (g), Evidence Act, flows from failure to preserve or produce best available evidence.",
    grounds: "Ground 7 — no referee sample retained",
    status: "VERIFIED"
  },
  {
    citation: "Section 114 Illustration (g), Indian Evidence Act 1872",
    principle: "The court may presume that evidence which could be produced but is not produced would, if produced, be unfavourable to the person who withholds it.",
    grounds: "Ground 7 — referee sample not retained; destruction of right to independent testing",
    status: "STATUTORY"
  }
];
