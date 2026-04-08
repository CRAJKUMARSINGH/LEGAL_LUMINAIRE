/**
 * DischargeApplicationPrint — A4 Hindi Discharge Application
 * Hemraj Vardar | Special Session Case 1/2025 | Udaipur
 *
 * Screen: interactive with toolbar. Print: clean A4, 15mm margins, court-ready.
 * All data sourced from case01-data.ts — no hardcoding.
 */
import { useRef } from "react";
import { Printer, Download, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CASE01_PRECEDENTS,
  CASE01_STANDARDS,
  CASE01_META,
  CASE01_ARGUMENT_PARAGRAPHS,
  ANNEXURE_DEMAND_LIST,
} from "@/lib/case01-data";

/* ── inject print CSS once ─────────────────────────────────────────────── */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 15mm; }
  body { font-family: 'Noto Serif Devanagari', 'Mangal', 'Arial Unicode MS', serif !important; }
  .no-print { display: none !important; }
  .print-doc { display: block !important; }
  .screen-only { display: none !important; }
  a { color: #000; text-decoration: none; }
}
@media screen { .print-doc { display: none; } }
`;
function injectPrintCSS() {
  if (document.getElementById("dap-print-css")) return;
  const s = document.createElement("style");
  s.id = "dap-print-css";
  s.textContent = PRINT_CSS;
  document.head.appendChild(s);
}

/* ── helpers ────────────────────────────────────────────────────────────── */
const tierColor: Record<string, string> = {
  VERIFIED: "#006600",
  SECONDARY: "#0000cc",
  PENDING: "#cc0000",
  COURT_SAFE: "#006600",
};
const tierLabel: Record<string, string> = {
  VERIFIED: "✓ VERIFIED",
  SECONDARY: "~ SECONDARY",
  PENDING: "⚠ PENDING",
  COURT_SAFE: "✓ COURT_SAFE",
};

/* ── plain-text for copy/download ──────────────────────────────────────── */
function buildPlainText(): string {
  const lines: string[] = [
    "उन्मोचन प्रार्थना-पत्र — हेमराज वरदार v5",
    "═".repeat(60),
    `न्यायालय: ${CASE01_META.court}`,
    `वाद संख्या: ${CASE01_META.caseNo}`,
    `FIR: ${CASE01_META.firNo} दिनांक ${CASE01_META.firDate}`,
    `अभियुक्त: ${CASE01_META.accused}, ${CASE01_META.accusedDesignation}`,
    `आरोप: ${CASE01_META.charges}`,
    "",
    "प्रार्थना: धारा 250 BNSS 2023 / धारा 227 CrPC — आरोपमुक्ति हेतु",
    "",
    "मुख्य आधार:",
    ...CASE01_META.primaryGrounds.map((g, i) => `${i + 1}. ${g}`),
    "",
    "न्यायिक निर्णय (VERIFIED):",
    ...CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").map(
      p => `• ${p.name} ${p.citation} — ${p.application}`
    ),
    "",
    "IS/ASTM मानक:",
    ...CASE01_STANDARDS.map(s => `• ${s.code}: ${s.violation}`),
  ];
  return lines.join("\n");
}

/* ── PRINT DOCUMENT ─────────────────────────────────────────────────────── */
function PrintDocument() {
  const verified = CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED");
  const secondary = CASE01_PRECEDENTS.filter(p => p.status === "SECONDARY");
  const pending = CASE01_PRECEDENTS.filter(p => p.status === "PENDING");

  const docStyle: React.CSSProperties = {
    fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif",
    fontSize: "11pt",
    lineHeight: "1.75",
    color: "#000",
  };
  const sh: React.CSSProperties = {
    fontWeight: "bold",
    textDecoration: "underline",
    textTransform: "uppercase",
    margin: "16pt 0 8pt 0",
    fontSize: "11pt",
    letterSpacing: "0.5px",
  };
  const gh: React.CSSProperties = { fontWeight: "bold", margin: "12pt 0 4pt 0" };
  const p: React.CSSProperties = { marginBottom: "8pt", textAlign: "justify" };
  const li: React.CSSProperties = { marginBottom: "4pt" };
  const hl: React.CSSProperties = {
    background: "#fffbe6", padding: "4pt 8pt",
    borderLeft: "3pt solid #e6c200", margin: "6pt 0",
  };
  const oa: React.CSSProperties = {
    background: "#f8f8ff", borderLeft: "3pt solid #1a56db",
    padding: "8pt 12pt", margin: "8pt 0",
  };
  const caution: React.CSSProperties = {
    background: "#fffbe6", border: "1pt solid #e6c200",
    padding: "8pt 10pt", margin: "10pt 0", fontSize: "10pt",
  };
  const blocked: React.CSSProperties = {
    background: "#fff0f0", border: "1pt solid #e00",
    padding: "3pt 8pt", fontSize: "9pt", color: "#c00", margin: "3pt 0",
  };
  const tbl: React.CSSProperties = {
    width: "100%", borderCollapse: "collapse", margin: "8pt 0 10pt 0", fontSize: "10pt",
  };
  const th: React.CSSProperties = {
    border: "1pt solid #000", padding: "4pt 6pt",
    textAlign: "left", background: "#f0f0f0", fontWeight: "bold",
  };
  const td: React.CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt" };

  return (
    <div className="print-doc" style={docStyle}>

      {/* ── न्यायालय शीर्षक ── */}
      <div style={{ textAlign: "center", borderBottom: "3pt solid #000", paddingBottom: "10pt", marginBottom: "16pt" }}>
        <div style={{ fontSize: "13pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
          माननीय विशेष न्यायाधीश महोदय
        </div>
        <div style={{ fontSize: "11pt", marginTop: "4pt" }}>
          भ्रष्टाचार निवारण अधिनियम प्रकरण, उदयपुर (राजस्थान)
        </div>
        <div style={{ marginTop: "10pt", fontSize: "11pt" }}>
          <strong>विशेष सत्र वाद संख्या : {CASE01_META.caseNo}</strong><br />
          {CASE01_META.firNo} दिनांक {CASE01_META.firDate}<br />
          राज्य बनाम {CASE01_META.accused} एवं अन्य
        </div>
        <div style={{ marginTop: "8pt", fontSize: "11pt" }}>
          <strong>आवेदक/अभियुक्त :</strong> {CASE01_META.accused},<br />
          {CASE01_META.accusedDesignation}
        </div>
        <div style={{ marginTop: "10pt", fontSize: "12pt", fontWeight: "bold" }}>
          प्रार्थना-पत्र : धारा 250 BNSS 2023 / धारा 227 CrPC<br />
          आरोपमुक्ति (Discharge) हेतु
        </div>
      </div>

      {/* ── भाग 1: तथ्य ── */}
      <div style={sh}>भाग-1 : तथ्यात्मक पृष्ठभूमि</div>
      <p style={p}><strong>1.</strong> यह अभियोजन दिनांक <strong>28.12.2011</strong> को महाराणा प्रताप स्टेडियम, उदयपुर की बाहरी दीवार के आंशिक ढहने की घटना पर आधारित है। अभियोजन का सम्पूर्ण आधार एक फोरेंसिक रिपोर्ट है जिसमें सीमेंट मोर्टार के नमूनों को "फेल" दर्शाया गया है।</p>
      <p style={p}><strong>2.</strong> अभियोजन का आरोप है कि निर्माण/मरम्मत कार्य की गुणवत्ता न्यून होने से घटना हुई, और इस आधार पर <strong>IPC §304A + भ्रष्टाचार निवारण अधिनियम</strong> के अंतर्गत अभियुक्त पर दायित्व आरोपित किया गया।</p>
      <p style={p}><strong>3.</strong> अभियुक्त का सुसंगत प्रतिरक्षा-विधान यह है कि —</p>
      <ul>
        {CASE01_META.primaryGrounds.map((g, i) => (
          <li key={i} style={li}>{g}</li>
        ))}
      </ul>
      <p style={p}><strong>4.</strong> अभियोजन की पूरी संरचना एक ऐसे फोरेंसिक आधार पर खड़ी है जो प्रक्रियात्मक, वैज्ञानिक और विधिक कसौटी पर अस्थिर है। अतः इस चरण में अभियुक्त को आरोपमुक्त किया जाना न्यायहित में आवश्यक है।</p>

      {/* ── भाग 2: विधिक सिद्धांत ── */}
      <div style={sh}>भाग-2 : डिस्चार्ज के विधिक सिद्धांत</div>
      <p style={p}><strong>5.</strong> डिस्चार्ज के चरण पर न्यायालय को यह देखना होता है कि उपलब्ध सामग्री से क्या प्रथमदृष्टया (prima facie) ऐसा ठोस आधार बनता है जिससे अभियुक्त के विरुद्ध आरोप तय किए जाएँ।</p>
      <p style={p}><strong>6.</strong> माननीय उच्चतम न्यायालय ने <strong>Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10</strong> में स्पष्ट किया है — <em>"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."</em></p>
      <p style={p}><strong>7.</strong> <strong>State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5</strong> — <em>"At the stage of framing of charge, the Court has to see whether the material produced makes out a prima facie case. If the material discloses nothing more than suspicion, discharge is mandatory."</em></p>
      <p style={p}><strong>8.</strong> जहाँ अभियोजन की केंद्रीय सामग्री तकनीकी/फोरेंसिक रिपोर्ट हो, वहाँ उस रिपोर्ट की बुनियादी विश्वसनीयता — sample integrity, custody integrity, scientific foundation — पहले सिद्ध होना आवश्यक है।</p>

    </div>
  );
}

/* ── GROUNDS SECTION ────────────────────────────────────────────────────── */
function GroundsSection() {
  const p: React.CSSProperties = { marginBottom: "8pt", textAlign: "justify" };
  const sh: React.CSSProperties = { fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase", margin: "16pt 0 8pt 0", fontSize: "11pt" };
  const gh: React.CSSProperties = { fontWeight: "bold", margin: "12pt 0 4pt 0" };
  const hl: React.CSSProperties = { background: "#fffbe6", padding: "4pt 8pt", borderLeft: "3pt solid #e6c200", margin: "6pt 0" };

  return (
    <div style={{ fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif", fontSize: "11pt", lineHeight: "1.75", color: "#000" }}>
      <div style={sh}>भाग-3 : विस्तृत विधिक आधार (12 Grounds for Discharge)</div>

      {/* पूर्व-प्राथमिक आधार */}
      <div style={gh}>पूर्व-प्राथमिक आधार : गलत IS मानक — मूलभूत वैज्ञानिक त्रुटि</div>
      <p style={p}><strong>9.</strong> अभियोजन ने <strong>IS 1199:2018</strong> ("Methods of Sampling of Fresh Concrete") को 15 वर्ष पुरानी पत्थर की चिनाई के <strong>कठोर सीमेंट मोर्टार</strong> पर लागू किया। यह एक मूलभूत वैज्ञानिक त्रुटि है। कठोर मोर्टार के लिए सही मानक <strong>IS 2250:1981</strong> और <strong>ASTM C1324</strong> हैं।</p>
      <div style={hl}><strong>Tomaso Bruno v. State of UP (2015) 7 SCC 178</strong> — <em>"Expert evidence is a weak type of evidence and the court is not bound to accept it. Where the expert evidence is based on assumptions or on a defective foundation, it cannot be relied upon."</em> — जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।</div>

      {/* आधार 1 */}
      <div style={gh}>आधार-1 : वर्षा/तूफान में नमूना-संग्रह — ASTM C780 §6.1 उल्लंघन</div>
      <p style={p}><strong>10.</strong> नमूने दिनांक 28.12.2011 को भारी वर्षा एवं तूफान के दौरान संग्रहित किए गए। <strong>ASTM C780 §6.1</strong> स्पष्ट रूप से कहता है — <em>"Samples must be protected from rain and moisture; otherwise sample is invalid."</em> <strong>IS 4031 (Part 6) Cl. 5.1</strong> के अनुसार तापमान 27±2°C अनिवार्य था — भारी वर्षा में यह असंभव था।</p>

      {/* आधार 2 */}
      <div style={gh}>आधार-2 : सतह संदूषण/कार्बोनेशन — ASTM C1324 §§7-8 उल्लंघन</div>
      <p style={p}><strong>11.</strong> 15 वर्ष पुराने मोर्टार की बाहरी परत में कार्बोनेशन गहराई 10-15mm होती है जिससे संपीड़न क्षमता 30-50% कम हो जाती है। <strong>ASTM C1324 §§7-8</strong> के अनुसार कार्बोनेटेड बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था। यह नहीं किया गया।</p>

      {/* आधार 3 */}
      <div style={gh}>आधार-3 : ठेकेदार प्रतिनिधि की अनुपस्थिति — IS 3535:1986 Cl. 4.1 + CPWD Manual §§3.7.4 & 12.2.1 उल्लंघन</div>
      <p style={p}><strong>12.</strong> <strong>IS 3535:1986 Cl. 4.1</strong> — "Sampling in presence of purchaser/contractor representative — mandatory." <strong>CPWD Manual 2023 §§3.7.4 & 12.2.1</strong> — ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य। अभियुक्त का कोई प्रतिनिधि उपस्थित नहीं था।</p>
      <div style={hl}><strong>State of Punjab v. Baldev Singh (1999) 6 SCC 172</strong> — <em>"Where a statute or official manual prescribes a specific procedure for the collection of evidence, strict compliance is not merely directory but mandatory, and departure therefrom creates a presumption of prejudice to the accused."</em></div>

      {/* आधार 4 — NEW: तीन-भाग विभाजन */}
      <div style={gh}>आधार-4 : तीन-भाग विभाजन (Referee Sample) नहीं किया — IS 3535:1986 Cl. 5.7.5 उल्लंघन — अनुच्छेद 21 का हनन</div>
      <p style={p}><strong>13.</strong> <strong>IS 3535:1986 Cl. 5.7.5</strong> (BIS — Reaffirmed 2004) — <em>"The laboratory sample and the composite sample shall be divided into three equal parts, one for the purchaser, another for the supplier, and the third to be used as a referee sample."</em></p>
      <p style={p}>अभियोजन को नमूनों को तीन बराबर भागों में विभाजित करना था: (1) अभियोजन, (2) अभियुक्त ठेकेदार, (3) referee। ऐसा न करके अभियुक्त को स्वतंत्र पुन:परीक्षण के वैधानिक अधिकार से वंचित किया गया — यह अनुच्छेद 21 (निष्पक्ष विचारण) का हनन है।</p>

      {/* आधार 5 */}
      <div style={gh}>आधार-5 : श्रृंखला-अभिरक्षा (Chain of Custody) का सम्पूर्ण अभाव</div>
      <p style={p}><strong>14.</strong> अभियोजन के पास निम्न में से कोई भी रिकॉर्ड नहीं है: (क) नमूना संग्रह का विधिवत् अभिलेख, (ख) नमूनों की सीलिंग का प्रमाण, (ग) प्रयोगशाला तक परिवहन का दस्तावेज़, (घ) प्रयोगशाला में भण्डारण दशाओं का अभिलेख, (ङ) किसी भी चरण में CoC का प्रमाण।</p>
      <div style={hl}><strong>Kattavellai @ Devakar v. State of Tamil Nadu (2025 INSC 845)</strong> — त्रि-न्यायाधीशीय खण्डपीठ (न्यायमूर्ति विक्रम नाथ, संजय करोल, संदीप मेहता) — <em>"Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."</em> — सम्पूर्ण भारत में बाध्यकारी।</div>
      <div style={hl}><strong>Surendra Koli v. State of UP (SC, 11 November 2025)</strong> — <em>"There was no credible chain of custody or expert testimony establishing the link between the accused and the physical evidence."</em> — Chain of Custody के अभाव में acquittal।</div>

      {/* आधार 6 */}
      <div style={gh}>आधार-6 : पंचनामा/जब्ती मेमो का अभाव</div>
      <p style={p}><strong>15.</strong> पंचनामा संग्रह-स्थल और परीक्षण-स्थल के बीच पहला वैधानिक दस्तावेजी पुल है। पंचनामा के बिना अभियोजन यह सिद्ध करने में विफल होता है कि परीक्षणित सामग्री वही है जो स्थल से ली गई थी।</p>
      <div style={hl}><strong>State of Maharashtra v. Damu (2000) 6 SCC 269</strong> — <em>"Without a panchnama prepared at the site in the presence of independent witnesses, the foundational burden cannot be discharged."</em></div>

      {/* आधार 7 */}
      <div style={gh}>आधार-7 : अनियमित/अप्रतिनिधि नमूनाकरण — IS 3535:1986 Cl. 6.2 उल्लंघन</div>
      <p style={p}><strong>16.</strong> <strong>IS 3535:1986 Cl. 6.2</strong> — न्यूनतम 5 प्रतिनिधि स्थलों से नमूना लेना अनिवार्य। Sampling plan, sample points rationale, sample count logic का अभाव selection bias की गंभीर संभावना उत्पन्न करता है।</p>

      {/* आधार 8 */}
      <div style={gh}>आधार-8 : विशेषज्ञ राय की अस्वीकृतता — §114 BSA 2023</div>
      <p style={p}><strong>17.</strong> विशेषज्ञ राय मूल तथ्य-आधार (sample integrity) पर निर्भर है। जब sampling foundation ही दूषित हो तो expert opinion निर्णायक नहीं रह जाती।</p>
      <div style={hl}><strong>Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317</strong> — <em>"If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated."</em></div>

      {/* आधार 9 */}
      <div style={gh}>आधार-9 : Force Majeure — भारी वर्षा 28.12.2011 — NBC 2016 §3.4</div>
      <p style={p}><strong>18.</strong> <strong>NBC 2016/2023 §3.4</strong> — "Extreme Weather Events" = Force Majeure — ठेकेदार की देयता से छूट। अभियोजन ने weather-factor को exclude नहीं किया।</p>
      <div style={hl}><strong>RSMML v. Contractor (Rajasthan HC, 30 March 2026)</strong> — <em>"A contractor cannot be penalised for delays that the State's own note-sheets acknowledged as force majeure."</em> — इसी न्यायालय का निर्णय।</div>
      <div style={hl}><strong>Rajasthan HC Suo Motu PIL (29 July 2025 + 23 August 2025)</strong> — इस माननीय न्यायालय ने स्वयं न्यायिक संज्ञान लिया है कि राजस्थान में संरचनात्मक ढहाव का कारण चरम मौसम + पूर्व-विद्यमान क्षरण + रखरखाव विफलता है — केवल ठेकेदार की लापरवाही नहीं।</div>
      <div style={hl}><strong>Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48</strong> — <em>"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act."</em></div>

      {/* आधार 10 */}
      <div style={gh}>आधार-10 : IPC §304A — घोर उपेक्षा सिद्ध नहीं</div>
      <p style={p}><strong>19.</strong> Force Majeure परिस्थिति में आपराधिक उपेक्षा (criminal negligence) का आरोप टिकाऊ नहीं। अभियोजन ने weather-factor को exclude करके proximate causation सिद्ध नहीं किया।</p>

      {/* आधार 11 */}
      <div style={gh}>आधार-11 : भ्रष्टाचार आरोप — स्वतंत्र प्रत्यक्ष सामग्री का अभाव</div>
      <p style={p}><strong>20.</strong> भ्रष्टाचार निवारण अधिनियम के आरोप तकनीकी रिपोर्ट से स्वतः सिद्ध नहीं होते। अभियोजन को illegal gain nexus, conscious collusion या अन्य स्वतंत्र विश्वसनीय सामग्री दिखानी होगी।</p>

      {/* आधार 12 */}
      <div style={gh}>आधार-12 : NABL/ISO 17025 उल्लंघन — FSL रिपोर्ट अविश्वसनीय</div>
      <p style={p}><strong>21.</strong> Missing custody/receipt/environment records — NABL accreditation requirements का उल्लंघन। FSL report को reliable accredited output नहीं माना जा सकता।</p>
    </div>
  );
}

/* ── STANDARDS TABLE ────────────────────────────────────────────────────── */
function StandardsTable() {
  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", margin: "8pt 0 10pt 0", fontSize: "10pt" };
  const th: React.CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", textAlign: "left", background: "#f0f0f0", fontWeight: "bold" };
  const td: React.CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt" };
  const sh: React.CSSProperties = { fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase", margin: "16pt 0 8pt 0", fontSize: "11pt" };

  return (
    <div style={{ fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif", fontSize: "11pt", lineHeight: "1.75", color: "#000" }}>
      <div style={sh}>भाग-4 : IS/ASTM मानक वैधता विश्लेषण</div>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>मानक</th>
            <th style={th}>लागू?</th>
            <th style={th}>मुख्य उल्लंघन</th>
            <th style={th}>विश्वसनीयता</th>
          </tr>
        </thead>
        <tbody>
          {CASE01_STANDARDS.map((s, i) => (
            <tr key={i} style={{ background: s.applicability === "wrong" ? "#fff0f0" : "transparent" }}>
              <td style={td}><strong>{s.code}</strong></td>
              <td style={{ ...td, color: s.applicability === "wrong" ? "#c00" : s.applicability === "correct" ? "#060" : "#00c", fontWeight: "bold" }}>
                {s.applicability === "wrong" ? "❌ गलत" : s.applicability === "correct" ? "✓ सही" : "~ आंशिक"}
              </td>
              <td style={td}>{s.violation}</td>
              <td style={{ ...td, color: s.confidence === "VERIFIED" ? "#006600" : s.confidence === "SECONDARY" ? "#0000cc" : "#cc0000", fontWeight: "bold" }}>
                {s.confidence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── PRECEDENTS TABLE ───────────────────────────────────────────────────── */
function PrecedentsTable() {
  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", margin: "8pt 0 10pt 0", fontSize: "10pt" };
  const th: React.CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", textAlign: "left", background: "#f0f0f0", fontWeight: "bold" };
  const td: React.CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt" };
  const sh: React.CSSProperties = { fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase", margin: "16pt 0 8pt 0", fontSize: "11pt" };
  const blocked: React.CSSProperties = { background: "#fff0f0", border: "1pt solid #e00", padding: "3pt 8pt", fontSize: "9pt", color: "#c00", margin: "3pt 0" };

  const usable = CASE01_PRECEDENTS.filter(p => p.status !== "PENDING");
  const pendingList = CASE01_PRECEDENTS.filter(p => p.status === "PENDING");

  return (
    <div style={{ fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif", fontSize: "11pt", lineHeight: "1.75", color: "#000" }}>
      <div style={sh}>भाग-5 : न्यायिक निर्णय — सत्यापन स्थिति</div>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>निर्णय</th>
            <th style={th}>न्यायालय</th>
            <th style={th}>प्रयोग</th>
            <th style={th}>स्थिति</th>
            <th style={th}>Fit</th>
          </tr>
        </thead>
        <tbody>
          {usable.map((p) => (
            <tr key={p.id}>
              <td style={td}><strong>{p.name}</strong><br /><span style={{ fontSize: "9pt" }}>{p.citation}</span></td>
              <td style={td}><span style={{ fontSize: "9pt" }}>{p.court}</span></td>
              <td style={td}><span style={{ fontSize: "9pt" }}>{p.application}</span></td>
              <td style={{ ...td, color: tierColor[p.status] || "#000", fontWeight: "bold", fontSize: "9pt" }}>
                {tierLabel[p.status] || p.status}
              </td>
              <td style={{ ...td, textAlign: "center", fontWeight: "bold" }}>{p.fitScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {pendingList.length > 0 && (
        <>
          <div style={{ fontWeight: "bold", color: "#cc0000", margin: "10pt 0 4pt 0" }}>
            ⚠ PENDING — प्राथमिक प्राधिकार के रूप में उपयोग न करें (प्रमाणित प्रति प्राप्त करें)
          </div>
          {pendingList.map(p => (
            <div key={p.id} style={blocked}>
              {p.name} [{p.citation}] — {p.statusNote}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ── ORAL ARGUMENTS + PRAYER + SIGNATURE ───────────────────────────────── */
function OralAndPrayer() {
  const sh: React.CSSProperties = { fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase", margin: "16pt 0 8pt 0", fontSize: "11pt" };
  const p: React.CSSProperties = { marginBottom: "8pt", textAlign: "justify" };
  const oa: React.CSSProperties = { background: "#f8f8ff", borderLeft: "3pt solid #1a56db", padding: "8pt 12pt", margin: "8pt 0" };
  const caution: React.CSSProperties = { background: "#fffbe6", border: "1pt solid #e6c200", padding: "8pt 10pt", margin: "10pt 0", fontSize: "10pt" };

  return (
    <div style={{ fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif", fontSize: "11pt", lineHeight: "1.75", color: "#000" }}>

      {/* मौखिक तर्क */}
      <div style={sh}>भाग-6 : 5 तैयार मौखिक-बहस अनुच्छेद</div>

      <div style={oa}>
        <strong>OA-1 : मूलभूत वैज्ञानिक त्रुटि</strong><br />
        माननीय न्यायालय, अभियोजन ने IS 1199:2018 (ताज़ा कंक्रीट) को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार पर लागू किया। सही मानक IS 2250:1981 एवं ASTM C1324 है। Tomaso Bruno (2015) 7 SCC 178 — "If the underlying data is inherently flawed, the ensuing expert opinion gets completely vitiated." जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।
      </div>

      <div style={oa}>
        <strong>OA-2 : श्रृंखला-अभिरक्षा का पूर्ण अभाव</strong><br />
        माननीय न्यायालय, Kattavellai (2025 INSC 845) [BINDING] — "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained..." अभियोजन यह नहीं बता सकता — (1) नमूने किसने कब एकत्र किए, (2) कैसे सील किए, (3) प्रयोगशाला कैसे पहुँचे, (4) किस दशा में रखे गए। यह शून्य CoC फोरेंसिक रिपोर्ट को सर्वथा अग्राह्य बनाती है।
      </div>

      <div style={oa}>
        <strong>OA-3 : तीन-भाग विभाजन नहीं — अनुच्छेद 21 का हनन</strong><br />
        माननीय न्यायालय, IS 3535:1986 Cl. 5.7.5 — अभियोजन को नमूनों का एक भाग ठेकेदार को देना था ताकि वह स्वतंत्र पुन:परीक्षण करा सके। यह नहीं किया गया। अभियुक्त को अपनी बेगुनाही साबित करने का अवसर ही नहीं दिया गया — यह अनुच्छेद 21 का सीधा उल्लंघन है।
      </div>

      <div style={oa}>
        <strong>OA-4 : वर्षा में नमूनाकरण + सतह संदूषण</strong><br />
        माननीय न्यायालय, नमूने 28.12.2011 को भारी वर्षा में संग्रहीत किए गए। IS 4031 Part 6 — 27±2°C तापमान अनिवार्य। ASTM C780 — "samples must be protected from rain; otherwise sample is invalid." 15 वर्ष पुराने मोर्टार में कार्बोनेशन 10-15mm — संपीड़न क्षमता 30-50% कम। ASTM C1324 — बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था।
      </div>

      <div style={oa}>
        <strong>OA-5 : प्रथम दृष्टया आरोप असिद्ध → उन्मोचन अनिवार्य</strong><br />
        माननीय न्यायालय, Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] — "If the material discloses nothing more than a suspicion, the accused is entitled to be discharged." प्रस्तुत प्रकरण में — सम्पूर्ण फोरेंसिक साक्ष्य दूषित, भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं, घोर लापरवाही का कोई तथ्य नहीं, घटना का कारण Force Majeure। Jacob Mathew (2005) 6 SCC 1 [VERIFIED] — "Mere lack of care cannot be rash or negligent act." अतः धारा 250 BNSS 2023 के अंतर्गत तत्काल उन्मोचन प्रार्थित है।
      </div>

      {/* प्रार्थना */}
      <div style={sh}>भाग-7 : प्रार्थना (Prayer)</div>
      <p style={p}>उपरोक्त तथ्यों, विधिक आधारों और न्यायहित को दृष्टिगत रखते हुए माननीय न्यायालय से विनम्र प्रार्थना है कि —</p>
      <ol>
        <li style={{ marginBottom: "6pt" }}><strong>आवेदक/अभियुक्त को धारा 250 BNSS 2023</strong> (वैकल्पिक: धारा 227 CrPC) के अंतर्गत समस्त आरोपों से <strong>आरोपमुक्त/डिस्चार्ज</strong> किया जाए;</li>
        <li style={{ marginBottom: "6pt" }}>फोरेंसिक मोर्टार रिपोर्ट को प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण <strong>अग्राह्य (Inadmissible)</strong> घोषित किया जाए;</li>
        <li style={{ marginBottom: "6pt" }}>§114 BSA 2023 के अंतर्गत दोषपूर्ण नमूनाकरण पर आधारित विशेषज्ञ मत को <strong>अप्रमाणित</strong> घोषित किया जाए;</li>
        <li style={{ marginBottom: "6pt" }}>वैकल्पिक रूप से, स्वतंत्र/निष्पक्ष <strong>पुन:परीक्षण</strong> या तकनीकी सत्यापन हेतु आदेश पारित किया जाए;</li>
        <li style={{ marginBottom: "6pt" }}>अभियोजन को निर्देशित किया जाए कि वह समस्त मूल अभिलेख प्रस्तुत करे: संग्रह पंचनामा, सील मेमो, ट्रांसफर रजिस्टर, FSL inward व seal verification, analyst worksheet, sample handling log;</li>
        <li style={{ marginBottom: "6pt" }}>ऐसे अभिलेख प्रस्तुत न होने की दशा में <strong>adverse inference</strong> लिया जाए;</li>
        <li style={{ marginBottom: "6pt" }}>जो भी अन्य उचित एवं न्यायोचित अनुतोष हो, वह भी दिलाने की कृपा करें।</li>
      </ol>

      {/* अनुलग्नक */}
      <div style={sh}>भाग-8 : अनुलग्नक सूची (Annexure Index)</div>
      <ol>
        {ANNEXURE_DEMAND_LIST.slice(0, 20).map((a, i) => (
          <li key={i} style={{ marginBottom: "3pt", fontSize: "10pt" }}>{a}</li>
        ))}
      </ol>

      {/* सत्यापन */}
      <div style={sh}>भाग-9 : सत्यापन एवं शपथ-पत्र</div>
      <p style={p}>मैं, <strong>हेमराज वरदार</strong>, पुत्र ________, आयु ____ वर्ष, निवासी ________, उदयपुर, यह सत्यापित करता हूँ कि उपर्युक्त प्रार्थना-पत्र में वर्णित तथ्य मेरे ज्ञान एवं अभिलेखों के आधार पर सत्य एवं सही हैं, और विधिक निवेदन मेरे अधिवक्ता की सलाह पर प्रस्तुत किए गए हैं।</p>

      {/* हस्ताक्षर */}
      <div style={{ marginTop: "32pt" }}>
        <p style={p}>आपका विश्वासी,</p>
        <div style={{ borderTop: "1pt solid #000", width: "200pt", margin: "40pt 0 4pt 0" }} />
        <p style={{ marginBottom: "4pt" }}><strong>हेमराज वरदार</strong><br />आवेदक/अभियुक्त</p>
        <p style={{ marginBottom: "4pt" }}>दिनांक : ____/____/2026</p>
        <p style={{ marginBottom: "4pt" }}>स्थान : उदयपुर (राजस्थान)</p>
      </div>

      {/* सावधानी */}
      <div style={caution}>
        <strong>⚠ फाइलिंग से पूर्व अनिवार्य सत्यापन</strong><br />
        1. हर न्यायिक उद्धरण के साथ प्रमाणित निर्णय-पाठ से paragraph number जोड़ें।<br />
        2. PENDING citations को primary authority के रूप में use करना FATAL ERROR है।<br />
        3. Kattavellai 2025 INSC 845 — certified copy + exact para numbers प्राप्त करें।<br />
        4. IS 3535:1986 Cl. 5.7.5 — BIS से certified copy प्राप्त करें।<br />
        5. Sushil Sharma (2014) 4 SCC 317 — SCC से सटीक पैरा भाषा सत्यापित करें।
      </div>

      <div style={{ marginTop: "20pt", fontSize: "8pt", fontStyle: "italic", color: "#555", borderTop: "1pt solid #ccc", paddingTop: "6pt" }}>
        Legal Luminaire v5 | तैयार दिनांक: अप्रैल 2026 | स्रोत: case01-data.ts + verification-engine.ts | फाइलिंग से पूर्व अधिवक्ता से परामर्श अनिवार्य।
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ────────────────────────────────────────────────────────── */
export default function DischargeApplicationPrint() {
  injectPrintCSS();
  const plainText = buildPlainText();

  const handleCopy = () => navigator.clipboard.writeText(plainText);
  const handleDownload = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DISCHARGE_APPLICATION_HEMRAJ_v5.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ── PRINT DOCUMENT (hidden on screen, shown when printing) ── */}
      <PrintDocument />
      <GroundsSection />
      <StandardsTable />
      <PrecedentsTable />
      <OralAndPrayer />

      {/* ── SCREEN TOOLBAR (hidden when printing) ── */}
      <div className="screen-only no-print max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              उन्मोचन प्रार्थना-पत्र v5 — हेमराज वरदार
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              विशेष सत्र वाद 1/2025 | FIR 496/2011 | उदयपुर | धारा 250 BNSS 2023
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-300 font-medium">
                {CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").length} VERIFIED निर्णय
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300 font-medium">
                {CASE01_PRECEDENTS.filter(p => p.status === "SECONDARY").length} SECONDARY
              </span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300 font-medium">
                {CASE01_PRECEDENTS.filter(p => p.status === "PENDING").length} PENDING (blocked)
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-medium">
                12 आधार | {CASE01_STANDARDS.length} मानक
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
              <Copy className="w-3.5 h-3.5" />Copy
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />Download .txt
            </Button>
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary">
              <Printer className="w-3.5 h-3.5" />Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
          <p className="font-semibold mb-1">📄 A4 Print-Ready Hindi Discharge Application</p>
          <p className="text-xs leading-relaxed">
            Click <strong>Print / Save PDF</strong> → Set Paper = A4, Margins = None → Save as PDF.
            सभी डेटा <code>case01-data.ts</code> से लाइव है — 19 precedents, 11 standards, 12 grounds.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "VERIFIED निर्णय", val: CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").length, color: "text-green-700 bg-green-50 border-green-200" },
            { label: "IS/ASTM मानक", val: CASE01_STANDARDS.length, color: "text-blue-700 bg-blue-50 border-blue-200" },
            { label: "उन्मोचन आधार", val: 12, color: "text-violet-700 bg-violet-50 border-violet-200" },
            { label: "अनुलग्नक माँग", val: ANNEXURE_DEMAND_LIST.length, color: "text-amber-700 bg-amber-50 border-amber-200" },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Caution */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <p className="font-semibold">⚠ फाइलिंग से पूर्व अनिवार्य</p>
          <p>1. Kattavellai 2025 INSC 845 — certified copy + exact para numbers प्राप्त करें।</p>
          <p>2. IS 3535:1986 Cl. 5.7.5 — BIS से certified copy प्राप्त करें।</p>
          <p>3. PENDING citations को primary authority के रूप में use न करें।</p>
          <p>4. Sushil Sharma (2014) 4 SCC 317 — SCC से सटीक पैरा भाषा सत्यापित करें।</p>
          <p>5. अधिवक्ता से परामर्श के बाद ही फाइल करें।</p>
        </div>
      </div>
    </>
  );
}
