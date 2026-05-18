/**
 * VERIFIED JUDICIAL PRECEDENTS — Legal Luminaire
 *
 * Verification standard applied:
 *  1. Citation cross-checked against Indian Kanoon, SCC Online summaries, AIR Online and published
 *     academic analyses — minimum two independent sources per case.
 *  2. Principle attributed has been verified to match the actual ratio decidendi of the case.
 *  3. Para numbers marked CONFIRMED where found in indexed sources; others carry a law-library
 *     verification note — counsel MUST verify para/page from original SCC/AIR volume before citing
 *     in any formal submission.
 *
 * Cases removed from earlier draft and reason:
 *  - N. Sri Rama Reddy v. V.V. Giri, AIR 1971 SC 1162 — Presidential election case; principle
 *    attributed was not the ratio of that case.
 *  - DDA v. Skipper Construction, (1996) 4 SCC 622 — Contempt/auction deposit case; construction
 *    quality principle attributed was not the ratio.
 *  - NBCC v. S. Raghunathan, (1998) 7 SCC 66 — Service law/pay revision case; technical-evidence
 *    principle attributed was not the ratio.
 *  - State of Punjab v. Bhag Singh, (2004) 1 SCC 163 — No independent source confirmed citation
 *    with attributed principle; removed pending law library verification.
 *  - Ram Chandra Singh v. Savitri Devi, (2003) 8 SCC 319 — Fraud on court/matrimonial case;
 *    technical-report principle attributed was not the ratio.
 *  - Sterlite Industries v. Union of India, (2013) 4 SCC 575 — Environmental/copper plant case;
 *    technical-report principle attributed was not the ratio.
 *  - Gomathinayagam Pillai v. Palaniswami Nadar, AIR 1967 SC 868 — Property case; adverse-inference
 *    principle cited directly from S.114 Illustration (g) IEA instead.
 */

export type VerificationStatus =
  | "VERIFIED"
  | "CITATION_CORRECTED"
  | "PARA_VERIFY_FROM_LAW_REPORT";

export interface VerifiedPrecedent {
  id: string;
  shortName: string;
  fullTitle: string;
  citation_air?: string;
  citation_scc?: string;
  citation_scr?: string;
  bench: string;
  decided: string;
  status: VerificationStatus;
  correctionNote?: string;
  confirmedParas?: string;
  paraVerificationNote?: string;
  ratio_hi: string;
  ratio_en: string;
  groundsApplicable: number[];
  groundsLabel: string;
}

export const verifiedPrecedents: VerifiedPrecedent[] = [
  {
    id: "kraipak",
    shortName: "A.K. Kraipak v. Union of India",
    fullTitle: "A.K. Kraipak & Ors. v. Union of India & Ors.",
    citation_air: "AIR 1970 SC 150",
    citation_scc: "(1969) 2 SCC 262",
    bench: "K.S. Hegde, V. Bhargava, A.N. Grover JJ.",
    decided: "29 April 1969",
    status: "VERIFIED",
    confirmedParas: "Para 20 — scope and evolution of natural justice; administrative proceedings not immune",
    paraVerificationNote: "Para 20 confirmed from indexed sources. Verify page from AIR 1970 Vol. 1 SC 150.",
    ratio_hi:
      "प्रशासनिक और अर्ध-न्यायिक कार्यवाहियों में नैसर्गिक न्याय के नियम — 'nemo judex in causa sua' और 'audi alteram partem' — समान बल से लागू होते हैं। न्याय का उद्देश्य न्याय के दुर्विनियोग को रोकना है, चाहे कार्यवाही किसी भी प्रकार की हो। (पैरा 20)",
    ratio_en:
      "Rules of natural justice — nemo judex in causa sua and audi alteram partem — apply with equal force to administrative proceedings. The aim is to prevent miscarriage of justice regardless of the nature of the proceedings. (Para 20)",
    groundsApplicable: [1, 2, 6],
    groundsLabel: "Absence of representative; Defective collection; Tests without presence",
  },
  {
    id: "maneka",
    shortName: "Maneka Gandhi v. Union of India",
    fullTitle: "Maneka Gandhi v. Union of India",
    citation_air: "AIR 1978 SC 597",
    citation_scc: "(1978) 1 SCC 248",
    citation_scr: "(1978) 2 SCR 621",
    bench: "7-Judge Bench — CJI M.H. Beg, Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer, N.L. Untwalia, S. Murtaza Fazal Ali, P.S. Kailasam JJ.",
    decided: "25 January 1978",
    status: "VERIFIED",
    paraVerificationNote:
      "Multiple concurring judgments. Bhagwati J. authored the leading judgment. Para numbers to be verified from (1978) 1 SCC 248 or AIR 1978 SC 597 original volume.",
    ratio_hi:
      "कानून द्वारा स्थापित प्रक्रिया उचित, न्यायसंगत और युक्तियुक्त होनी चाहिए। नैसर्गिक न्याय के सिद्धांत प्रशासनिक तथा अर्ध-न्यायिक दोनों कार्यों पर समान रूप से लागू होते हैं। कोई भी प्रतिकूल आदेश प्रभावित पक्ष को सुने बिना पारित नहीं किया जा सकता।",
    ratio_en:
      "Procedure established by law must be fair, just and reasonable. Principles of natural justice apply to both administrative and quasi-judicial functions. No adverse order can be passed without hearing the affected party.",
    groundsApplicable: [1, 6],
    groundsLabel: "Absence of representative; Tests without presence",
  },
  {
    id: "binapani",
    shortName: "State of Orissa v. Dr. Binapani Dei",
    fullTitle: "State of Orissa v. Dr. (Miss) Binapani Dei & Ors.",
    citation_air: "AIR 1967 SC 1269",
    citation_scr: "(1967) 2 SCR 625",
    bench: "Shah J.C. & Mitter G.K., JJ.",
    decided: "7 February 1967",
    status: "VERIFIED",
    paraVerificationNote:
      "Para numbers to be verified from AIR 1967 SC 1269 or (1967) 2 SCR 625 original volume.",
    ratio_hi:
      "किसी व्यक्ति के विरुद्ध कोई भी प्रतिकूल आदेश — चाहे प्रशासनिक हो — बिना उसे सूचित किए और सुने बिना पारित नहीं किया जा सकता। 'audi alteram partem' अनिवार्य है।",
    ratio_en:
      "No adverse order — whether administrative or quasi-judicial — may be passed against a person without notice and an opportunity of being heard. Audi alteram partem is mandatory.",
    groundsApplicable: [1, 6],
    groundsLabel: "Absence of representative; Tests without presence",
  },
  {
    id: "hcgoel",
    shortName: "Union of India v. H.C. Goel",
    fullTitle: "Union of India v. H.C. Goel",
    citation_air: "AIR 1964 SC 364",
    citation_scr: "(1964) 4 SCR 718",
    bench: "Constitution Bench — P.B. Gajendragadkar CJI, K. Subba Rao, K.N. Wanchoo, N. Rajagopala Ayyangar, J.R. Mudholkar JJ.",
    decided: "1963 (reported 1964)",
    status: "VERIFIED",
    paraVerificationNote:
      "Constitution Bench judgment. Para numbers to be verified from AIR 1964 SC 364 or (1964) 4 SCR 718 original volume.",
    ratio_hi:
      "विभागीय जांच में दोष-सिद्धि साक्ष्य पर आधारित होनी चाहिए; बिना साक्ष्य के निष्कर्ष अधिकार-क्षेत्र से बाहर है। जहां अभिलेख उत्पन्न किए जा सकते थे किंतु नहीं किए गए, वहां प्रतिकूल अनुमान लगाया जाना चाहिए।",
    ratio_en:
      "In departmental enquiries, findings must be based on evidence on record; a finding without evidence is without jurisdiction. Where records could have been produced but were not, adverse inference must be drawn against the authority.",
    groundsApplicable: [2, 4],
    groundsLabel: "Defective collection — no reliable evidence; Storage — no records produced",
  },
  {
    id: "portbombay",
    shortName: "Port of Bombay v. Dilipkumar Nadkarni",
    fullTitle:
      "Board of Trustees of the Port of Bombay v. Dilipkumar Raghavendranath Nadkarni & Ors.",
    citation_air: "AIR 1983 SC 109",
    citation_scc: "(1983) 1 SCC 124",
    citation_scr: "(1983) 1 SCR 828",
    bench: "D.A. Desai & R.B. Misra JJ.",
    decided: "17 November 1982",
    status: "VERIFIED",
    paraVerificationNote:
      "Para numbers to be verified from (1983) 1 SCC 124 or AIR 1983 SC 109 original volume.",
    ratio_hi:
      "घरेलू/विभागीय जांच में नैसर्गिक न्याय के सिद्धांत की अपेक्षा है कि प्रभावित पक्ष को उसके विरुद्ध प्रस्तुत साक्ष्य का सामना करने का पूर्ण और प्रभावी अवसर दिया जाए।",
    ratio_en:
      "In domestic or departmental enquiries the principles of natural justice require that the affected party be given a full and effective opportunity to meet the evidence led against him.",
    groundsApplicable: [6],
    groundsLabel: "Tests conducted without contractor's presence",
  },
  {
    id: "tomasobruno",
    shortName: "Tomaso Bruno v. State of U.P.",
    fullTitle: "Tomaso Bruno & Anr. v. State of Uttar Pradesh",
    citation_scc: "(2015) 7 SCC 178",
    bench: "Anil R. Dave, Kurian Joseph & R. Banumathi JJ.",
    decided: "20 January 2015",
    status: "VERIFIED",
    paraVerificationNote:
      "Three-judge bench. Judgment authored by Banumathi J. Para numbers to be verified from (2015) 7 SCC 178 original volume.",
    ratio_hi:
      "भौतिक और फॉरेंसिक साक्ष्य के लिए साक्ष्य-श्रृंखला (chain of custody) का निर्बाध होना अनिवार्य है। श्रृंखला में कोई भी खण्ड — संग्रह, परिवहन, प्रयोगशाला प्राप्ति, भंडारण तक — साक्ष्य की विश्वसनीयता को घातक रूप से प्रभावित करता है। अभियोजन को यह सिद्ध करना है कि साक्ष्य से छेड़छाड़ नहीं की गई।",
    ratio_en:
      "For physical and forensic evidence, an unbroken chain of custody from collection through transport, laboratory receipt, and storage is mandatory. Any gap in the chain is fatal to the evidentiary value. The prosecution must affirmatively prove that evidence was not tampered with.",
    groundsApplicable: [3],
    groundsLabel: "Transportation under stormy conditions — chain of custody broken",
  },
  {
    id: "jailal",
    shortName: "State of H.P. v. Jai Lal & Ors.",
    fullTitle: "State of Himachal Pradesh v. Jai Lal & Ors.",
    citation_scc: "(1999) 7 SCC 280",
    citation_air: "AIR 1999 SC 3318",
    bench: "K.T. Thomas & D.P. Mohapatra JJ.",
    decided: "13 September 1999",
    status: "VERIFIED",
    paraVerificationNote:
      "Para numbers to be verified from (1999) 7 SCC 280 or AIR 1999 SC 3318 original volume. Case concerns expert testimony standards under Section 45, Indian Evidence Act.",
    ratio_hi:
      "विशेषज्ञ साक्ष्य की विश्वसनीयता के लिए आवश्यक है कि (i) विशेषज्ञ की अर्हता सिद्ध हो; (ii) विशेषज्ञ ने जिन तथ्यों पर राय दी वे सिद्ध तथ्य हों; (iii) राय और तथ्यों के बीच तार्किक संबंध हो; और (iv) उपयोग की गई पद्धति मान्यता-प्राप्त मानकों के अनुरूप हो। इनमें से किसी भी शर्त का अभाव विशेषज्ञ साक्ष्य को अविश्वसनीय बनाता है।",
    ratio_en:
      "For expert evidence to be reliable, the court must be satisfied that: (i) the expert is qualified; (ii) the facts upon which the opinion is based are proved facts; (iii) there is a logical connection between the facts and the opinion; and (iv) the methodology used conforms to recognised standards. Absence of any of these conditions renders expert evidence unreliable.",
    groundsApplicable: [8, 9],
    groundsLabel: "IS standard not cited in report; Single test vs. IS-mandatory average",
  },
  {
    id: "siemens",
    shortName: "Siemens Engineering v. Union of India",
    fullTitle: "Siemens Engineering & Mfg. Co. of India Ltd. v. Union of India & Anr.",
    citation_scc: "(1976) 2 SCC 981",
    citation_air: "AIR 1976 SC 1785",
    citation_scr: "1976 SCR 489",
    bench: "P.N. Bhagwati, A.C. Gupta & S. Murtaza Fazal Ali JJ.",
    decided: "30 April 1976",
    status: "VERIFIED",
    paraVerificationNote:
      "Para numbers to be verified from (1976) 2 SCC 981 or AIR 1976 SC 1785 original volume.",
    ratio_hi:
      "अर्ध-न्यायिक प्राधिकरण को अपने प्रत्येक आदेश के लिए कारण देने होंगे। बिना कारण बताए पारित आदेश प्राकृतिक न्याय के विरुद्ध है और न्यायिक समीक्षा में टिक नहीं सकता। जहां रिपोर्ट या आदेश अपनी पद्धति प्रकट नहीं करता, वह अर्ध-न्यायिक मानदंड को पूरा नहीं करता।",
    ratio_en:
      "A quasi-judicial authority must give reasons for its orders; an unreasoned order is contrary to natural justice and cannot survive judicial review. Where a report or order does not disclose its methodology, it does not meet quasi-judicial standards.",
    groundsApplicable: [8],
    groundsLabel: "Test report does not cite the IS standard applied",
  },
  {
    id: "ramzankhan",
    shortName: "Union of India v. Mohd. Ramzan Khan",
    fullTitle: "Union of India & Ors. v. Mohd. Ramzan Khan",
    citation_scc: "(1991) 1 SCC 588",
    citation_air: "AIR 1991 SC 471",
    bench: "Ranganath Misra CJI, P.B. Sawant & K. Ramaswamy JJ.",
    decided: "20 November 1990",
    status: "CITATION_CORRECTED",
    correctionNote:
      "Earlier drafts cited (1991) 1 SCC 590 and incorrectly named 'Mohd. Ramzan Khan v. State of J&K'. Correct citation: (1991) 1 SCC 588; AIR 1991 SC 471. Correct title: Union of India v. Mohd. Ramzan Khan. Constitutional provision: Article 311(2).",
    paraVerificationNote:
      "Para numbers to be verified from (1991) 1 SCC 588 or AIR 1991 SC 471 original volume.",
    ratio_hi:
      "अनुच्छेद 311(2) के अंतर्गत विभागीय कार्यवाही में सरकारी कर्मचारी को अपना बचाव प्रस्तुत करने का पूर्ण अधिकार है। नैसर्गिक न्याय की अपेक्षा है कि अभियोग साक्ष्य से जिरह का अवसर दिया जाए।",
    ratio_en:
      "In departmental proceedings under Article 311(2) a government servant has a full right to defend himself. Natural justice requires an opportunity to cross-examine and challenge the evidence led in support of the charges.",
    groundsApplicable: [6],
    groundsLabel: "Tests conducted without contractor's presence",
  },
];

/** Statutory authority — not a precedent but cited in Ground 7 */
export const iea114Note = {
  provision: "Section 114, Illustration (g) — Indian Evidence Act, 1872",
  text_hi:
    "न्यायालय यह अनुमान लगा सकता है कि 'जो साक्ष्य उत्पादित किया जा सकता था लेकिन नहीं किया गया, वह उसे रोकने वाले पक्ष के प्रतिकूल होता।' (धारा 114, दृष्टांत ग, भारतीय साक्ष्य अधिनियम 1872)",
  text_en:
    "The court may presume that 'evidence which could be and is not produced would, if produced, be unfavourable to the person who withholds it.' (Section 114, Illustration (g), Indian Evidence Act, 1872)",
};
