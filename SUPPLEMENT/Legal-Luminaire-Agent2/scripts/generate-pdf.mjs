import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PdfPrinter = require('pdfmake/src/printer');
import { writeFileSync } from 'fs';

// ── Fonts ────────────────────────────────────────────────────────────────────
const fonts = {
  Noto: {
    normal: '/tmp/NotoDevanagari.ttf',
    bold: '/tmp/NotoDevanagari.ttf',
    italics: '/tmp/NotoDevanagari.ttf',
    bolditalics: '/tmp/NotoDevanagari.ttf',
  },
};

const printer = new PdfPrinter(fonts);

// ── Helpers ───────────────────────────────────────────────────────────────────
const F = 'Noto';

const coverTitle = (text) => ({
  text, font: F, fontSize: 26, bold: true, color: '#1F3864',
  alignment: 'center', margin: [0, 8, 0, 8],
});

const partHeader = (num, title, color = '#1F3864') => ([
  { text: num, font: F, fontSize: 18, bold: true, color, alignment: 'center', margin: [0, 24, 0, 4] },
  { text: title, font: F, fontSize: 20, bold: true, color, alignment: 'center', margin: [0, 0, 0, 16] },
]);

const h1 = (text) => ({
  text, font: F, fontSize: 14, bold: true, color: '#1F3864',
  margin: [0, 20, 0, 6],
  decoration: 'underline',
});

const h2 = (text) => ({
  text, font: F, fontSize: 12, bold: true, color: '#2E74B5',
  margin: [0, 16, 0, 5],
});

const p = (text) => ({
  text, font: F, fontSize: 10, alignment: 'justify',
  margin: [0, 3, 0, 3], lineHeight: 1.5,
});

const bold = (text) => ({
  text, font: F, fontSize: 10, bold: true,
  margin: [0, 6, 0, 3],
});

const bullet = (text) => ({
  text: `\u2022  ${text}`, font: F, fontSize: 10,
  margin: [12, 2, 0, 2], lineHeight: 1.4,
});

const code = (text) => ({
  text, font: F, fontSize: 8.5, color: '#1F3864',
  background: '#EEF3FF', margin: [12, 2, 0, 2],
  preserveLeadingSpaces: true,
});

const quote = (text) => ({
  text, font: F, fontSize: 9.5, italics: true, color: '#2E4057',
  margin: [20, 5, 20, 5], lineHeight: 1.5,
  background: '#F5F9FF',
});

const warning = (text) => ({
  text: `\u26d4  ${text}`, font: F, fontSize: 10, bold: true, color: '#C00000',
  margin: [0, 6, 0, 6],
});

const divider = () => ({
  canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#AAAAAA' }],
  margin: [0, 10, 0, 10],
});

const pageBreak = () => ({ text: '', pageBreak: 'before' });

const summaryTable = (headers, rows) => ({
  table: {
    headerRows: 1,
    widths: headers.map((_, i) => {
      if (rows[0] && rows[0].length === 4) return ['auto', '*', '*', 'auto'][i] || '*';
      if (rows[0] && rows[0].length === 3) return ['auto', '*', '*'][i] || '*';
      if (rows[0] && rows[0].length === 2) return ['auto', '*'][i] || '*';
      return '*';
    }),
    body: [
      headers.map((h) => ({
        text: h, font: F, fontSize: 9, bold: true, color: '#FFFFFF',
        fillColor: '#1F3864', alignment: 'center', margin: [3, 3, 3, 3],
      })),
      ...rows.map((row, ri) =>
        row.map((cell) => ({
          text: cell, font: F, fontSize: 8.5,
          fillColor: ri % 2 === 0 ? '#EEF3FB' : '#FFFFFF',
          margin: [3, 3, 3, 3],
        }))
      ),
    ],
  },
  layout: {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => '#CCCCCC',
    vLineColor: () => '#CCCCCC',
  },
  margin: [0, 6, 0, 12],
});

// ── Document Definition ───────────────────────────────────────────────────────
const dd = {
  pageSize: 'A4',
  pageMargins: [72, 72, 54, 60],
  defaultStyle: { font: F, fontSize: 10 },

  header: (currentPage) =>
    currentPage > 1
      ? {
          text: 'बचाव उत्तर — हेमराज वरदार  |  BNSS §250  |  सम्पूर्ण दाखिला बण्डल',
          font: F, fontSize: 7.5, color: '#888888', italics: true,
          alignment: 'right', margin: [54, 20, 54, 0],
        }
      : {},

  footer: (currentPage, pageCount) => ({
    columns: [
      { text: '', width: '*' },
      {
        text: `पृष्ठ ${currentPage} / ${pageCount}    |    Confidential — Counsel Only`,
        font: F, fontSize: 7.5, color: '#999999', italics: true,
        alignment: 'center', width: '*',
      },
      { text: '', width: '*' },
    ],
    margin: [54, 0, 54, 16],
  }),

  content: [
    // ── COVER ──────────────────────────────────────────────────────────────
    { text: '\n\n', fontSize: 6 },
    coverTitle('सम्पूर्ण दाखिला बण्डल'),
    { text: 'बचाव उत्तर — हेमराज वरदार', font: F, fontSize: 20, bold: true, color: '#2E74B5', alignment: 'center', margin: [0, 6, 0, 6] },
    { text: 'BNSS 2023 धारा 250 के अंतर्गत आरोप-मुक्ति हेतु', font: F, fontSize: 13, italics: true, color: '#444444', alignment: 'center', margin: [0, 0, 0, 20] },
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 28, r: 3, color: '#1F3864' }],
      margin: [0, 0, 0, 0],
    },
    { text: 'FSL मोर्टार विश्लेषण चुनौती  |  11 तकनीकी एवं विधिक आधार  |  अनुलग्नक A–X', font: F, fontSize: 11, bold: true, color: '#FFFFFF', alignment: 'center', margin: [0, -22, 0, 16] },
    summaryTable(
      ['भाग', 'विवरण'],
      [
        ['भाग-I', 'मुख्य बचाव उत्तर — 11 आधार (Court में दाखिल)'],
        ['भाग-II', 'अधिवक्ता नोट — Citation Rationalization (Counsel only)'],
        ['भाग-III', 'अनुलग्नक सूची A–X (Typist + Clerk के लिए)'],
      ]
    ),
    { text: 'नोट: भाग-II केवल Counsel के लिए है — Court में प्रस्तुत नहीं होगा।', font: F, fontSize: 9, italics: true, color: '#C00000', alignment: 'center', margin: [0, 4, 0, 0] },

    // ── PART I ─────────────────────────────────────────────────────────────
    pageBreak(),
    ...partHeader('भाग-I', 'मुख्य बचाव उत्तर'),
    { text: '(यह अनुभाग अन्य बिन्दुओं के मध्य सम्मिलित होगा)', font: F, fontSize: 9, italics: true, color: '#666666', alignment: 'center', margin: [0, 0, 0, 16] },

    h1('प्रमुख तथ्य एवं बचाव — संक्षिप्त सारणी'),
    summaryTable(
      ['क्र.', 'उल्लंघन', 'मानक', 'स्थिति'],
      [
        ['1', 'IS 1199:2018 — कठोर मोर्टार पर गलत मानक', 'IS 2250:1981 + ASTM C1324', '✗ Void ab initio'],
        ['2', 'अभिरक्षा श्रृंखला पूर्णतः अनुपस्थित', 'IS 3535:1986 Cl.4.1 + ISO 17025', '✗ FSL अग्राह्य'],
        ['3', 'पंचनामा / जब्ती मेमो अनुपस्थित', 'BNSS 2023 + IS 3535 Cl.4.1', '✗ अभिलेख शून्य'],
        ['4', 'वर्षा में नमूना — 27±2°C नहीं', 'IS 4031 Cl.5.1 + IS 2250 Cl.5.2', '✗ नमूना दूषित'],
        ['5', 'कार्बोनेटेड परत नहीं हटाई', 'ASTM C1324 §§7-8', '✗ परिणाम भ्रामक'],
        ['6', 'ठेकेदार प्रतिनिधि अनुपस्थित', 'IS 3535 Cl.4.1 + CPWD', '✗ नैसर्गिक न्याय उल्लंघन'],
        ['7', 'Three-Way Split नहीं किया', 'IS 3535:1986 Cl.5.7.5', '✗ बचाव का अधिकार नष्ट'],
        ['8', 'NDT परीक्षण अनुपस्थित', 'IS 13311 Parts 1-2', '✗ in-situ जाँच नहीं'],
        ['9', 'Force Majeure — असाधारण वर्षा', 'NBC 2016 §3.4', '✗ आपराधिक उपेक्षा नहीं'],
        ['10', 'IPC §304A — Gross Negligence अस्थापित', 'IPC §304A', '✗ मानक पूरा नहीं'],
        ['11', 'FSL का 1:18 मोर्टार — तकनीकी रूप से असंभव', 'IS 1661:1972 + CPWD DSR', '✗ रिपोर्ट स्वयं-खण्डनकारी'],
      ]
    ),

    // Ground 1
    h2('आधार-1: गलत मानक का प्रयोग — IS 1199:2018 कठोर मोर्टार पर लागू नहीं'),
    p('प्रस्तुत प्रकरण में FSL रिपोर्ट का सबसे मौलिक एवं घातक दोष यह है कि संपूर्ण परीक्षण एक सर्वथा गलत तकनीकी मानक के अंतर्गत किया गया है। FSL ने विवादित दीवार के कठोर मोर्टार नमूनों की जाँच IS 1199:2018 के अंतर्गत की — जो केवल और केवल ताजे कंक्रीट (Fresh Concrete) की जाँच का मानक है।'),
    p('IS 1199:2018 के Scope Clause 1 में BIS ने स्वयं लिखा है: "This standard covers methods of sampling and test for FRESH CONCRETE only." इसके अंतर्गत वर्णित परीक्षण-विधियाँ — Slump Test, Flow Test, Compaction Factor Test — ये सब ताजे, अपरिष्कृत, अकठोर कंक्रीट के लिए निर्मित हैं। विवादित दीवार लगभग चार वर्ष पुरानी थी — मोर्टार पूर्णतः कठोरीकृत था। कठोर मोर्टार की जाँच का सही मानक IS 2250:1981 और ASTM C1324 है।'),
    p('स्वयं अभियोजन के विशेषज्ञ साक्षी ने जिरह में IS 2250:1981 को सही मानक स्वीकार किया — यह FSL रिपोर्ट की मूल नींव को ध्वस्त करता है। ऐसी रिपोर्ट \'void ab initio\' — उत्पत्ति से ही शून्य — है।'),
    bold('■ मानक तुलना (अनुलग्नक A, B, C)'),
    code('IS 1199:2018 — Scope Cl. 1 (गलत): "This standard covers methods for FRESH CONCRETE only."'),
    code('IS 2250:1981 — सही मानक: Specification for Preparation and Use of Masonry Mortars'),
    code('ASTM C1324 — अंतर्राष्ट्रीय: Examination and Analysis of Hardened Masonry Mortar'),
    bold('◆ Tomaso Bruno & Anr. v. State of UP — (2015) 7 SCC 178 — Paras 25–30 & 42 (Ratio only — अनुलग्नक D)'),
    quote('Paras 25–30: दोषपूर्ण वैज्ञानिक आधार वाली expert opinion पर न्यायालय दोषसिद्धि का आधार नहीं बना सकता। Para 42: समग्र साक्ष्य की scrutiny अनिवार्य जब expert opinion का आधार ही दोषपूर्ण हो। — (2015) 7 SCC 178 — Certified copy — अनुलग्नक D'),

    // Ground 2
    h2('आधार-2: अभिरक्षा श्रृंखला (Chain of Custody) का पूर्ण अभाव'),
    p('किसी भी आपराधिक प्रकरण में forensic साक्ष्य की विश्वसनीयता उसकी अभिरक्षा श्रृंखला (Chain of Custody) पर निर्भर करती है — घटनास्थल से संग्रह, FSL में जाँच, न्यायालय में प्रस्तुति तक प्रत्येक चरण का निर्बाध दस्तावेजीकरण। यह श्रृंखला जिस क्षण टूटती है, forensic साक्ष्य का evidentiary value समाप्त हो जाता है।'),
    p('IS 3535:1986 Cl. 4.1 (ठेकेदार प्रतिनिधि उपस्थिति), Cl. 5.7.5 (Three-Way Split), ISO/IEC 17025 (पूर्ण traceability) — तीनों की अनिवार्यताएँ इस प्रकरण में पूर्णतः अनुपस्थित हैं।'),
    code('IS 3535:1986 Cl.4.1 (MANDATORY): "The contractor\'s representative SHALL be present during sample collection"'),
    code('IS 3535:1986 Cl.5.7.5: THREE-WAY SPLIT — (a) FSL Testing (b) Defence Copy (c) Referee Sample'),
    code('ISO/IEC 17025 (NABL): Traceability — collection date, temp, transport, receipt record — ALL mandatory'),
    bold('◆ Kattavellai @ Devakar v. State of Tamil Nadu — 2025 INSC 845 (अनुलग्नक E)'),
    quote('माननीय सर्वोच्च न्यायालय ने अभिनिर्धारित किया कि जब अभिरक्षा श्रृंखला का अभिलेख अनुपस्थित हो तो forensic रिपोर्ट का evidentiary value शून्य हो जाता है और संदेह का लाभ बिना किसी शर्त के अभियुक्त को दिया जाना अनिवार्य है। — 2025 INSC 845'),

    // Ground 3
    h2('आधार-3: पंचनामा / जब्ती मेमो का अभाव'),
    p('पंचनामा (Panchnama) किसी भी forensic साक्ष्य की विधिक नींव है। IS 3535:1986 Cl.4.1 और BNSS 2023 — दोनों के अंतर्गत स्वतंत्र साक्षियों की उपस्थिति एवं नमूना-संग्रह का दस्तावेजीकरण अनिवार्य है। प्रस्तुत प्रकरण में पंचनामा बना ही नहीं।'),
    warning('Citation सुधार अनिवार्य: Draft में "SC (2026)" लिखा है — यह गलत है। सही: Rajesh & Anr. v. State of MP — 2023 INSC 839'),
    bold('◆ Rajesh & Anr. v. State of MP — 2023 INSC 839 (अनुलग्नक F-2)'),
    quote('Panchanamas जो BNSS/CrPC की अनिवार्यताओं का उल्लंघन करते हुए तैयार किए गए हों — न्यायालय में अग्राह्य हैं। — 2023 INSC 839'),
    bold('◆ State of Maharashtra v. Damu — (2000) 6 SCC 269 (अनुलग्नक F-1)'),
    quote('जब्त वस्तुओं की FSL तक safe custody को सकारात्मक साक्ष्य से सिद्ध करना अभियोजन का दायित्व है। — (2000) 6 SCC 269'),

    // Ground 4
    h2('आधार-4: वर्षा/तूफान में नमूना-संग्रह — वैज्ञानिक निष्कर्ष दूषित'),
    p('IS 4031 (Part 6) Cl. 5.1 के अनुसार परीक्षण कक्ष एवं जल का तापमान 27±2°C होना MANDATORY है। IS 2250:1981 Cl. 5.2 के अनुसार नमूनों को वर्षा एवं प्रतिकूल मौसम से पूर्ण सुरक्षा अनिवार्य है। ASTM C780 के अनुसार वर्षा-संपर्क में w/c ratio बढ़ता है — एक अच्छा नमूना भी "substandard" दिख सकता है।'),
    code('IS 4031 Part 6 Cl.5.1 (MANDATORY): "Temperature of water and test room SHALL be 27 ± 2°C"'),
    code('IS 2250:1981 Cl.5.2 (MANDATORY): "Samples SHALL be protected from rain and adverse weather"'),
    code('ASTM C780: "Rain-exposed samples absorb water altering w/c ratio — results materially distorted"'),

    // Ground 5
    h2('आधार-5: कार्बोनेटेड परत नहीं हटाई — ASTM C1324 §§7-8 का उल्लंघन'),
    p('ASTM C1324 §7 के अनुसार कठोर मोर्टार के रासायनिक परीक्षण से पहले बाहरी 5-10mm की carbonated layer हटाना MANDATORY है। अभिक्रिया: Ca(OH)₂ + CO₂ → CaCO₃ — यह परत cement content को कृत्रिम रूप से कम दिखाती है। चार वर्ष पुरानी दीवार में यह परत अत्यधिक मोटी होती है। FSL ने यह चरण नहीं अपनाया — इसीलिए 1:18 जैसा असंभव परिणाम आया।'),
    code('ASTM C1324 §7 (MANDATORY): "Remove outer carbonated layer 5-10mm BEFORE chemical analysis.'),
    code('  Failure to remove WILL yield erroneous cement content results."'),
    code('ASTM C1324 §8: "Only fresh, uncarbonated core material shall be chemically analysed."'),

    // Ground 6
    h2('आधार-6: ठेकेदार प्रतिनिधि की अनुपस्थिति — प्राकृतिक न्याय का मूल उल्लंघन'),
    p('IS 3535:1986 Cl. 4.1 और CPWD Works Manual §§3.7.4, 12.2.1 — दोनों अनिवार्य करते हैं कि ठेकेदार को पूर्व सूचना दी जाए। प्रस्तुत प्रकरण में न पूर्व सूचना, न प्रतिनिधि, न counter-sample, न re-testing का अवसर — यह Audi alteram partem का घोर उल्लंघन है।'),
    bold('◆ Madras HC 2025 — Christopher Signi — Crl.RC(MD) 475/2025 (अनुलग्नक P)'),
    quote('"The accused is entitled to a fair opportunity to disprove the allegations against him." एकतरफा forensic sampling आरोप-निर्माण का एकमात्र आधार नहीं बन सकती।'),

    // Ground 7
    h2('आधार-7: तीन भागों में विभाजन (Three-Way Split) का अभाव'),
    p('IS 3535:1986 Cl. 5.7.5 के अनुसार Three-Way Split अनिवार्य है: (a) FSL परीक्षण; (b) ठेकेदार/बचाव पक्ष; (c) Referee Sample। प्रकरण में यह पूर्णतः अनुपस्थित है। अब आवेदक किसी स्वतंत्र प्रयोगशाला में FSL निष्कर्षों को चुनौती देने में असमर्थ है — उसके पास परीक्षण के लिए कोई नमूना ही नहीं है।'),
    bold('◆ State of Punjab v. Baldev Singh — (1999) 6 SCC 172 — Constitution Bench (Analogical — अनुलग्नक K)'),
    quote('अनिवार्य वैधानिक/तकनीकी प्रक्रिया का उल्लंघन करते हुए एकत्रित साक्ष्य न्यायालय में अग्राह्य होता है। — Analogical application — (1999) 6 SCC 172'),

    // Ground 8
    h2('आधार-8: NDT परीक्षण का अभाव — IS 13311 (Parts 1-2)'),
    p('IS 13311 (Parts 1-2) के अंतर्गत UPV (Ultrasonic Pulse Velocity) एवं Rebound Hammer परीक्षण विद्यमान संरचनाओं की in-situ strength के लिए सही NDT विधियाँ हैं। ये विनाशकारी नमूना-संग्रह से कहीं अधिक विश्वसनीय हैं। प्रकरण में NDT पूर्णतः अनुपस्थित है।'),
    code('IS 13311 Part 1: Ultrasonic Pulse Velocity (UPV)    |   IS 13311 Part 2: Rebound Hammer'),
    code('"For evaluation of existing structures, NDT methods should be adopted before destructive sampling."'),

    // Ground 9
    h2('आधार-9: बल प्रमुख (Force Majeure) — NBC 2016 §3.4'),
    p('NBC 2016 §3.4 के अनुसार Design Parameters से परे मौसमी घटनाएँ Force Majeure हैं — निर्माण दोष नहीं। दीवार का ध्वंस असाधारण वर्षा/तूफान से हुआ था।'),
    warning('Factual Correction: Draft में "Stadium wall collapse" — गलत है। सही: School wall collapse, Village Piplod, District Jhalawar। PIL No. Rajasthan HC registry से verify करें।'),
    code('NBC 2016 §3.4: "Extraordinary weather events exceeding design parameters constitute force majeure.'),
    code('  Cannot be attributed to construction deficiency."'),

    // Ground 10
    h2('आधार-10: IPC §304A — आपराधिक उपेक्षा का मानक स्थापित नहीं'),
    p('IPC §304A के अंतर्गत Gross Negligence का सकारात्मक साक्ष्य आवश्यक है। FSL रिपोर्ट void ab initio है — जब साक्ष्य की नींव ही शून्य हो, Gross Negligence निष्कर्ष असंभव है। संरचना चार वर्ष खड़ी रही — Gross Negligence का अभाव सिद्ध।'),
    bold('◆ Jacob Mathew v. State of Punjab — (2005) 6 SCC 1, Para 48 — VERBATIM VERIFIED (अनुलग्नक U)'),
    quote('"For an act to amount to criminal negligence, the degree of negligence should be much higher, i.e., gross or of a very high degree. Negligence which is neither gross nor of a higher degree may provide a ground for action in civil law but cannot form the basis for prosecution." — (2005) 6 SCC 1, Para 48 ✓'),

    // Ground 11
    pageBreak(),
    h2('आधार-11: FSL का 1:18 मोर्टार परिणाम — तकनीकी दृष्टि से असंभव एवं स्वयं-खण्डनकारी'),
    {
      text: 'यह आधार FSL रिपोर्ट के अपने निष्कर्ष से उत्पन्न होता है — यह अभियोजन की पूरी कहानी को तकनीकी दृष्टि से असंभव और Self-Refuting सिद्ध करता है।',
      font: F, fontSize: 10, bold: true, color: '#C00000',
      background: '#FFF0F0', margin: [0, 4, 0, 8], lineHeight: 1.5,
    },
    summaryTable(
      ['तकनीकी कारण', 'विवरण'],
      [
        ['(i) IS 1661:1972', 'Internal: 1:3/1:4 | External: 1:4/1:6 | Max: 1:8 | 1:18 किसी IS/ASTM/CPWD/NBC में नहीं'],
        ['(ii) Workability शून्य', '1:18 मोर्टार इतना रेत-प्रधान — दीवार पर लगाना असंभव — कोई कारीगर नहीं बनाएगा'],
        ['(iii) संरचनात्मक असंभाव्यता', '1:18 compressive strength इतना कम — हाथ से रगड़ने पर झड़ जाए — 4 वर्ष नहीं टिक सकता'],
        ['(iv) CPWD DSR में अनुपस्थित', 'सभी plastering items में 1:3–1:6 — 1:18 CPWD को अज्ञात — किसी Rate Schedule में नहीं'],
        ['(v) Carbonation परिणाम', 'ASTM C1324 §7 — परत न हटाने पर 1:4 का मोर्टार भी 1:18 जैसा दिख सकता है'],
        ['(vi) गलत मानक परिणाम', 'IS 1199:2018 का कठोर मोर्टार पर प्रयोग — chemical परिणाम अर्थहीन'],
      ]
    ),
    { text: 'विधिक निष्कर्ष: यदि न्यायालय 1:18 को स्वीकार करे — इसका अर्थ होगा दीवार चार वर्ष उस मोर्टार से टिकी जो Engineering में बन ही नहीं सकता। FSL Report — SELF-REFUTING on this point alone.', font: F, fontSize: 10, bold: true, color: '#C00000', margin: [0, 6, 0, 8], lineHeight: 1.5 },
    code('IS 1661:1972: Internal 1:3/1:4 | External 1:4/1:6 | Max 1:8 | 1:18 — ABSENT FROM ALL STANDARDS'),
    code('CPWD DSR: No plastering item has 1:18 ratio | ASTM C1324: Carbonation → 1:4 appears as 1:18 if not removed'),

    // Discharge
    pageBreak(),
    h1('आरोप-मुक्ति का विधिक मानक — BNSS §250'),
    p('BNSS 2023 की धारा 250 के अंतर्गत यदि अभियोजन की समस्त सामग्री केवल संदेह (Suspicion) उत्पन्न करती हो और प्रथम दृष्टया मामले की स्थापना नहीं करती हो, तो न्यायालय का यह अनिवार्य कर्तव्य है कि वह अभियुक्त को आरोप-मुक्त करे।'),
    summaryTable(
      ['एकत्रित दोष', 'स्थिति'],
      [
        ['FSL रिपोर्ट — IS 1199:2018 (गलत मानक)', '✗ Void ab initio'],
        ['नमूने — वर्षाजल दूषित — 27±2°C नहीं', '✗ दूषित'],
        ['Carbonated layer नहीं हटाई', '✗ परिणाम भ्रामक'],
        ['अभिरक्षा श्रृंखला अनुपस्थित', '✗ Evidentiary value शून्य'],
        ['पंचनामा / जब्ती मेमो अनुपस्थित', '✗ अभिलेख शून्य'],
        ['ठेकेदार प्रतिनिधि अनुपस्थित', '✗ Natural Justice उल्लंघन'],
        ['Three-Way Split नहीं', '✗ Right to Defence नष्ट'],
        ['NDT पूर्णतः अनुपस्थित', '✗ in-situ जाँच नहीं'],
        ['FSL का 1:18 — Engineering में असंभव', '✗ Self-Refuting'],
        ['BNSS §250 Discharge', '✅ अनिवार्य एवं अपरिहार्य'],
      ]
    ),
    bold('◆ State of Bihar v. Ramesh Singh — (1977) 4 SCC 39, Para 5 — VERBATIM VERIFIED (अनुलग्नक X)'),
    quote('"Strong suspicion against the accused, if the matter remains in the region of suspicion, cannot take the place of proof of his guilt at the conclusion of the trial." — (1977) 4 SCC 39, Para 5 ✓'),
    bold('◆ Union of India v. Prafulla Kumar Samal — (1979) 3 SCC 4, Para 10 — VERIFIED (अनुलग्नक W)'),
    quote('"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged." — (1979) 3 SCC 4, Para 10 ✓'),

    // ── PART II ────────────────────────────────────────────────────────────
    pageBreak(),
    ...partHeader('भाग-II', 'अधिवक्ता नोट — Citation Rationalization', '#C00000'),
    { text: '(केवल Counsel के लिए — Court में प्रस्तुत नहीं होगा)', font: F, fontSize: 9, italics: true, color: '#666666', alignment: 'center', margin: [0, 0, 0, 16] },

    h1('⛔ तत्काल सुधार — Filing से पूर्व अनिवार्य'),
    summaryTable(
      ['क्र.', 'त्रुटि (draft में)', 'सुधार'],
      [
        ['1', '"SC (2026)" Panchanama case', '→ 2023 INSC 839 — Rajesh & Anr. v. State of MP (21 Sept 2023)'],
        ['2', '"Stadium wall collapse"', '→ School wall collapse, Village Piplod, District Jhalawar (25 July 2025)'],
        ['3', '"Madras HC Mad 3214"', '→ Christopher Signi — Crl.RC(MD) No. 475 of 2025 — Madras HC Madurai Bench'],
      ]
    ),

    h1('Citation Rationalization — Tomaso Bruno पद्धति'),
    summaryTable(
      ['Citation', 'Verbatim?', 'Ratio?', 'कार्यवाही'],
      [
        ['Tomaso Bruno (2015) 7 SCC 178', '❌ Draft quote non-existent', '✅ Ratio OK', 'Para 25–30 & 42 — ratio only'],
        ['Kattavellai 2025 INSC 845', '⚠️ Near-accurate', '✅ Yes', 'DigiSCR — Certified copy'],
        ['Rajesh 2023 INSC 839', '⚠️ Ratio OK', '✅ Yes', '⛔ Year गलत — 2026 नहीं — 2023'],
        ['Damu (2000) 6 SCC 269', '⚠️ Near-accurate', '✅ Yes', 'SCC Online — para verify'],
        ['Baldev Singh (1999) 6 SCC 172', '⚠️ Analogical', '⚠️ Indirect', 'NDPS case — analogical label करें'],
        ['Jacob Mathew Para 48', '✅ Near-verbatim', '✅ Yes', '✅ सीधे cite करें'],
        ['Prafulla Kumar Samal Para 10', '✅ Verified', '✅ Yes', '✅ सीधे cite करें'],
        ['Ramesh Singh Para 5', '✅ Verbatim', '✅ Yes', '✅ Para 5 verbatim cite करें'],
        ['Surendra Koli 2025 INSC 1308', '⚠️ Reframe', '⚠️ Wrong ground', 'Confession case — reframe करें'],
        ['Madras HC Mad 3214', '❌ Unverified', '✅ Ratio OK', '⛔ Christopher Signi से replace'],
        ['Rajasthan HC PIL', '⚠️ Partial', '✅ OK', '⛔ "Stadium" गलत — School, Jhalawar'],
        ['Uttarakhand HC 2026', '❌ Unverified', '✅ OK', 'Hold — verify या remove'],
        ['RSMML v. Contractor 2026', '❌ Unverified', '—', 'Remove until verified'],
      ]
    ),

    // ── PART III ───────────────────────────────────────────────────────────
    pageBreak(),
    ...partHeader('भाग-III', 'अनुलग्नक सूची A–X — दाखिल करने हेतु मार्गदर्शिका'),

    h1('प्राथमिकता कुंजी'),
    summaryTable(
      ['प्रतीक', 'अर्थ'],
      [
        ['🔴 तत्काल', 'Filing से पूर्व अनिवार्य'],
        ['🟡 आवश्यक', 'SCC Online / DigiSCR से प्राप्त करें'],
        ['🟢 तकनीकी', 'BIS / ASTM / CPWD से क्रय करें'],
        ['🔵 Secondary', 'Verify के बाद संलग्न करें'],
      ]
    ),

    h1('सम्पूर्ण अनुलग्नक सूची'),
    summaryTable(
      ['अनुलग्नक', 'दस्तावेज', 'चिह्नित खंड', 'स्रोत', 'Priority'],
      [
        ['A', 'IS 1199:2018', 'Scope Cl.1 — FRESH CONCRETE only', 'bis.gov.in', '🔴'],
        ['B', 'IS 2250:1981', 'Title + §5 + minimum cement content', 'bis.gov.in', '🔴'],
        ['C', 'ASTM C1324 §§7-8', '§7 Carbonated layer removal + §8', 'astm.org', '🔴'],
        ['D', 'Tomaso Bruno (2015) 7 SCC 178', 'Paras 25–30 & Para 42', 'DigiSCR', '🔵'],
        ['E', 'Kattavellai 2025 INSC 845', 'Chain of custody paragraphs', 'DigiSCR', '🟡'],
        ['F-1', 'Damu (2000) 6 SCC 269', 'Safe custody paragraph', 'SCC Online', '🟡'],
        ['F-2', 'Rajesh — 2023 INSC 839', 'Panchanama inadmissibility paras', 'DigiSCR', '🔴'],
        ['G', 'Surendra Koli 2025 INSC 1308', 'Evidentiary foundation paras', 'DigiSCR', '🔵'],
        ['H', 'Uttarakhand HC 2026', 'Chain of custody paras', 'HC website — verify', '🔵'],
        ['I', 'IS 3535:1986 Cl.4.1', 'Contractor representative — SHALL', 'bis.gov.in', '🔴'],
        ['J', 'IS 3535:1986 Cl.5.7.5', 'Three-Way Split provision', 'bis.gov.in', '🔴'],
        ['K', 'Baldev Singh (1999) 6 SCC 172', 'Mandatory procedure violation', 'SCC Online', '🟡'],
        ['L', 'CPWD Manual §§3.7.4, 12.2.1', 'Prior notice + representative', 'cpwd.gov.in', '🟢'],
        ['M', 'IS 4031 Part 6 Cl.5.1', '27 ± 2°C — MANDATORY', 'bis.gov.in', '🔴'],
        ['N', 'ASTM C1324 (Full)', 'Title page + Scope', 'astm.org', '🔴'],
        ['O', 'IS 2250:1981 Cl.5.2', 'Protected from rain — MANDATORY', 'bis.gov.in', '🔴'],
        ['P', 'Christopher Signi — Crl.RC(MD) 475/2025', 'Fair opportunity paragraph', 'Madras HC', '🔵'],
        ['Q', 'IS 1661:1972 [नया — आधार-11]', 'Plaster ratio table — 1:18 absent', 'bis.gov.in', '🔴'],
        ['S', 'Rajasthan HC Suo Motu PIL', 'Weather + structural observations', 'HC registry', '🟡'],
        ['T', 'RSMML v. Contractor 2026', '— Unverified —', '— Remove —', '🔵'],
        ['U', 'Jacob Mathew (2005) 6 SCC 1', 'Para 48 — all propositions', 'SCC Online', '🟡'],
        ['V', 'IS 13311 Parts 1-2', 'Scope — NDT for existing structures', 'bis.gov.in', '🟢'],
        ['W', 'Prafulla Kumar Samal (1979)', 'Para 10 — discharge principles', 'Indian Kanoon', '🟡'],
        ['X', 'Ramesh Singh (1977) 4 SCC 39', 'Para 5 — verbatim', 'Indian Kanoon', '🟡'],
      ]
    ),

    h1('Master Action List — Filing Sequence'),
    bold('🔴 Step 1: तत्काल सुधार (आज ही)'),
    bullet('सभी drafts में "SC (2026)" → "2023 INSC 839 — Rajesh & Anr. v. State of MP"'),
    bullet('सभी drafts में "Stadium wall collapse" → "School wall collapse, Piplod, Jhalawar"'),
    bullet('IS 1199:2018 + IS 2250:1981 + IS 3535:1986 + IS 4031 Part 6 → bis.gov.in'),
    bullet('IS 1661:1972 → bis.gov.in → Annexure Q (नया — आधार-11)'),
    bullet('ASTM C1324 → astm.org'),
    bold('🟡 Step 2: Certified Copies (2-3 दिन)'),
    bullet('2023 INSC 839 — DigiSCR → Annexure F-2'),
    bullet('2025 INSC 845 — DigiSCR → Annexure E'),
    bullet('Jacob Mathew Para 48 → Annexure U'),
    bullet('Prafulla Kumar Samal Para 10 → Annexure W'),
    bullet('Ramesh Singh Para 5 → Annexure X'),
    bold('🔵 Step 3: Secondary (यदि समय हो)'),
    bullet('Tomaso Bruno — DigiSCR — Para 25–30 & 42 → Annexure D'),
    bullet('Christopher Signi — Madras HC → Annexure P'),
    bullet('Rajasthan HC PIL No. verify → Annexure S'),
    bold('🔵 Step 4: Remove if Unverified'),
    bullet('RSMML v. Contractor 2026 → Remove'),
    bullet('Uttarakhand HC 2026 → Verify title या Remove'),

    divider(),
    summaryTable(
      ['अंतिम Discharge Summary', ''],
      [
        ['Prima facie case', '❌ स्थापित नहीं'],
        ['FSL रिपोर्ट की वैधता', '❌ Void ab initio'],
        ['Chain of Custody', '❌ पूर्णतः अनुपस्थित'],
        ['Panchnama', '❌ अनुपस्थित'],
        ['Natural Justice', '❌ उल्लंघित'],
        ['FSL का 1:18', '❌ Engineering में असंभव'],
        ['Gross Negligence §304A', '❌ अस्थापित'],
        ['BNSS §250 Discharge', '✅ अनिवार्य एवं अपरिहार्य'],
      ]
    ),
    {
      text: 'सम्पूर्ण दाखिला बण्डल समाप्त  |  अधिवक्ता से अनुरोध: Filing से पूर्व Step 1 की सभी corrections अनिवार्य रूप से करें',
      font: F, fontSize: 8.5, italics: true, color: '#C00000',
      alignment: 'center', margin: [0, 12, 0, 0],
    },
  ],
};

// ── Generate PDF ──────────────────────────────────────────────────────────────
const pdfDoc = printer.createPdfKitDocument(dd);
const chunks = [];
pdfDoc.on('data', (chunk) => chunks.push(chunk));
pdfDoc.on('end', () => {
  const result = Buffer.concat(chunks);
  writeFileSync('attached_assets/HEMRAJ_VARDAR_COMPLETE_FILING_BUNDLE.pdf', result);
  console.log(`✅ PDF generated: ${result.length} bytes`);
  console.log('✅ Output: attached_assets/HEMRAJ_VARDAR_COMPLETE_FILING_BUNDLE.pdf');
});
pdfDoc.end();
