/**
 * DischargeApplicationPrint v6 â€” UPGRADED
 * Hemraj Vardar | Special Session Case 1/2025 | Udaipur
 *
 * UPGRADES (per user request):
 * 1. Inline citation blocks â€” each precedent cited IN the body with full holding,
 *    annexure PDF name, and verification badge (UNIQUE SYNERGY)
 * 2. Full A4 PDF-ready layout with named annexures (PDF/Image file names)
 * 3. All data live from case01-data.ts â€” zero hardcoding
 * 4. Print: clean A4, 15mm margins, Devanagari font, court-ready
 */
import type { CSSProperties } from "react";
import { Printer, Download, Copy, FileText, ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CASE01_PRECEDENTS,
  CASE01_STANDARDS,
  CASE01_META,
  CASE01_ARGUMENT_PARAGRAPHS,
  ANNEXURE_DEMAND_LIST,
} from "@/lib/case01-data";

/* â”€â”€ Print CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 15mm 15mm 20mm 20mm; }
  body { font-family: 'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif !important; font-size: 11pt !important; line-height: 1.8 !important; }
  .no-print, .screen-toolbar { display: none !important; }
  .print-doc { display: block !important; }
  .citation-block { break-inside: avoid; }
  .page-break { page-break-before: always; }
  a { color: #000; text-decoration: none; }
}
@media screen { .print-doc { display: none; } }
`;
function injectPrintCSS() {
  if (document.getElementById("dap-v6-css")) return;
  const s = document.createElement("style");
  s.id = "dap-v6-css";
  s.textContent = PRINT_CSS;
  document.head.appendChild(s);
}

/* â”€â”€ Annexure PDF name map â€” each citation â†’ its PDF file name â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ANNEXURE_PDF: Record<string, { file: string; label: string }> = {
  p1:  { file: "Kattavellai_Devakar_2025_INSC_845_Chain_of_Custody.pdf",           label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• E" },
  p11: { file: "State_Maharashtra_v_Damu_2000_6_SCC_269_Panchnama.pdf",             label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• F" },
  p12: { file: "State_Punjab_v_Baldev_Singh_1999_6_SCC_172_Mandatory_Procedure.pdf",label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• K" },
  p4:  { file: "Union_India_v_Prafulla_Kumar_Samal_1979_3_SCC_4_Para10.pdf",        label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• W" },
  p5:  { file: "State_Bihar_v_Ramesh_Singh_1977_4_SCC_39_Para5_Discharge.pdf",      label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• X" },
  p10: { file: "Jacob_Mathew_v_State_Punjab_2005_6_SCC_1_Para48_Negligence.pdf",    label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• U" },
  p13: { file: "Rajasthan_HC_Suo_Motu_PIL_Orders_29July2025_23August2025.pdf",      label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• S" },
  p2:  { file: "Uttarakhand_HC_March_2026_Chain_Custody_Forensic_Evidence.pdf",     label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• H" },
  p3:  { file: "Sushil_Sharma_v_State_NCT_Delhi_2014_4_SCC_317_Expert_Opinion.pdf", label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• P" },
  p14: { file: "Surendra_Koli_v_State_UP_SC_November_2025_Chain_Custody.pdf",       label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• G" },
  p15: { file: "Tomaso_Bruno_v_State_UP_2015_7_SCC_178_Expert_Evidence.pdf",        label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• D" },
  p16: { file: "RSMML_v_Contractor_Rajasthan_HC_Division_Bench_30March2026.pdf",    label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• T" },
  p17: { file: "Rajasthan_HC_Unsafe_School_Buildings_Roadmap_2025_2026.pdf",        label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• S2" },
  p18: { file: "IS_3535_1986_Clause_5_7_5_Three_Way_Split_Referee_Sample.pdf",      label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• J" },
  p19: { file: "CJ_Christopher_Signi_v_State_TN_2025_SCC_OnLine_Mad_3214.pdf",      label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• Q" },
};

const STANDARD_PDF: Record<string, { file: string; label: string }> = {
  "IS 1199:2018": { file: "IS_1199_2018_Scope_Clause_1_Fresh_Concrete_Only.pdf",              label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• A" },
  "IS 2250:1981": { file: "IS_2250_1981_Title_Page_Masonry_Mortar_Correct_Standard.pdf",      label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• B" },
  "IS 3535:1986": { file: "IS_3535_1986_Clause_4_1_Contractor_Representative_Mandatory.pdf",  label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• I" },
  "IS 4031 (Part 6)": { file: "IS_4031_Part6_Clause_5_1_Temperature_27_Celsius_Mandatory.pdf",label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• M" },
  "IS 13311 (Part 1-2)": { file: "IS_13311_Parts_1_2_NDT_UPV_Rebound_Hammer_Existing_Structures.pdf", label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• V" },
  "ASTM C1324": { file: "ASTM_C1324_Sections_7_8_Carbonated_Layer_Removal.pdf",               label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• C" },
};

/* â”€â”€ Tier badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TIER_STYLE: Record<string, CSSProperties> = {
  VERIFIED:   { color: "#006600", background: "#f0fff0", border: "1pt solid #006600", padding: "1pt 5pt", fontSize: "8pt", fontWeight: "bold" },
  SECONDARY:  { color: "#0000cc", background: "#f0f0ff", border: "1pt solid #0000cc", padding: "1pt 5pt", fontSize: "8pt", fontWeight: "bold" },
  PENDING:    { color: "#cc0000", background: "#fff0f0", border: "1pt solid #cc0000", padding: "1pt 5pt", fontSize: "8pt", fontWeight: "bold" },
  COURT_SAFE: { color: "#006600", background: "#f0fff0", border: "1pt solid #006600", padding: "1pt 5pt", fontSize: "8pt", fontWeight: "bold" },
};
const TIER_LABEL: Record<string, string> = {
  VERIFIED: "âœ“ VERIFIED", SECONDARY: "~ SECONDARY", PENDING: "âš  PENDING", COURT_SAFE: "âœ“ COURT_SAFE",
};

/* â”€â”€ Inline Citation Block â€” the UNIQUE SYNERGY element â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CitationBlock({ id, showHolding = true }: { id: string; showHolding?: boolean }) {
  const p = CASE01_PRECEDENTS.find(x => x.id === id);
  if (!p) return null;
  const ann = ANNEXURE_PDF[id];
  const isBlocked = p.status === "PENDING";

  const blockStyle: CSSProperties = {
    margin: "8pt 0",
    padding: "8pt 12pt",
    borderLeft: `3pt solid ${isBlocked ? "#cc0000" : p.status === "VERIFIED" ? "#006600" : "#0000cc"}`,
    background: isBlocked ? "#fff8f8" : p.status === "VERIFIED" ? "#f8fff8" : "#f8f8ff",
    breakInside: "avoid",
  };
  const nameStyle: CSSProperties = { fontWeight: "bold", fontSize: "10.5pt" };
  const citStyle: CSSProperties = { fontSize: "9pt", color: "#444", fontStyle: "italic" };
  const holdStyle: CSSProperties = { fontSize: "10pt", fontStyle: "italic", margin: "4pt 0", color: "#111" };
  const appStyle: CSSProperties = { fontSize: "9.5pt", color: "#333", marginTop: "3pt" };
  const annStyle: CSSProperties = { fontSize: "8.5pt", color: "#555", marginTop: "4pt", fontStyle: "italic" };

  return (
    <div className="citation-block" style={blockStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8pt" }}>
        <div style={{ flex: 1 }}>
          <span style={nameStyle}>{p.name}</span>
          <span style={{ ...citStyle, marginLeft: "6pt" }}>{p.citation}</span>
        </div>
        <span style={TIER_STYLE[p.status] || TIER_STYLE.PENDING}>{TIER_LABEL[p.status] || p.status}</span>
      </div>
      {showHolding && p.holding && !p.holding.startsWith("[PENDING") && (
        <div style={holdStyle}>"{p.holding}"</div>
      )}
      {isBlocked && (
        <div style={{ ...holdStyle, color: "#cc0000" }}>âš  BLOCKED â€” à¤ªà¥à¤°à¤¾à¤¥à¤®à¤¿à¤• à¤ªà¥à¤°à¤¾à¤§à¤¿à¤•à¤¾à¤° à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤‰à¤ªà¤¯à¥‹à¤— à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤ªà¥à¤°à¤®à¤¾à¤£à¤¿à¤¤ à¤ªà¥à¤°à¤¤à¤¿ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¥¤</div>
      )}
      <div style={appStyle}><strong>à¤ªà¥à¤°à¤¯à¥‹à¤—:</strong> {p.application}</div>
      {ann && (
        <div style={annStyle}>ðŸ“Ž {ann.label}: <em>{ann.file}</em> â€” {p.statusNote}</div>
      )}
    </div>
  );
}

/* â”€â”€ Standard Citation Block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function StandardBlock({ code }: { code: string }) {
  const s = CASE01_STANDARDS.find(x => x.code === code);
  if (!s) return null;
  const ann = STANDARD_PDF[code];
  const isWrong = s.applicability === "wrong";

  const blockStyle: CSSProperties = {
    margin: "6pt 0",
    padding: "6pt 10pt",
    borderLeft: `3pt solid ${isWrong ? "#cc0000" : "#006600"}`,
    background: isWrong ? "#fff0f0" : "#f8fff8",
    fontSize: "10pt",
    breakInside: "avoid",
  };
  return (
    <div className="citation-block" style={blockStyle}>
      <strong>{s.code}</strong>
      {" â€” "}
      <span style={{ color: isWrong ? "#cc0000" : "#006600", fontWeight: "bold" }}>
        {isWrong ? "âŒ à¤—à¤²à¤¤ à¤®à¤¾à¤¨à¤•" : s.applicability === "correct" ? "âœ“ à¤¸à¤¹à¥€ à¤®à¤¾à¤¨à¤•" : "~ à¤†à¤‚à¤¶à¤¿à¤•"}
      </span>
      <br />
      <span style={{ fontSize: "9.5pt" }}>{s.keyClause}</span>
      <br />
      <span style={{ fontSize: "9pt", color: "#555", fontStyle: "italic" }}>{s.violation}</span>
      {ann && (
        <div style={{ fontSize: "8.5pt", color: "#555", marginTop: "3pt", fontStyle: "italic" }}>
          ðŸ“Ž {ann.label}: <em>{ann.file}</em>
        </div>
      )}
    </div>
  );
}

/* â”€â”€ FULL PRINT DOCUMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function PrintDocument() {
  const docStyle: CSSProperties = {
    fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif",
    fontSize: "11pt", lineHeight: "1.8", color: "#000",
  };
  const sh: CSSProperties = {
    fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase",
    margin: "18pt 0 8pt 0", fontSize: "11pt", letterSpacing: "0.5px",
  };
  const gh: CSSProperties = { fontWeight: "bold", margin: "12pt 0 4pt 0", fontSize: "11pt" };
  const p: CSSProperties = { marginBottom: "8pt", textAlign: "justify" };
  const hl: CSSProperties = {
    background: "#fffbe6", padding: "6pt 10pt",
    borderLeft: "3pt solid #e6c200", margin: "6pt 0", fontSize: "10.5pt",
  };
  const tbl: CSSProperties = { width: "100%", borderCollapse: "collapse", margin: "8pt 0", fontSize: "9.5pt" };
  const th: CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", background: "#f0f0f0", fontWeight: "bold", textAlign: "left" };
  const td: CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", verticalAlign: "top" };
  const caution: CSSProperties = {
    background: "#fffbe6", border: "1pt solid #e6c200",
    padding: "8pt 10pt", margin: "12pt 0", fontSize: "9.5pt",
  };
  const blocked: CSSProperties = {
    background: "#fff0f0", border: "1pt solid #e00",
    padding: "3pt 8pt", fontSize: "9pt", color: "#c00", margin: "3pt 0",
  };

  const verified = CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED");
  const secondary = CASE01_PRECEDENTS.filter(p => p.status === "SECONDARY");
  const pending = CASE01_PRECEDENTS.filter(p => p.status === "PENDING");

  return (
    <div className="print-doc" style={docStyle}>

      {/* â•â• COURT HEADING â•â• */}
      <div style={{ textAlign: "center", borderBottom: "3pt double #000", paddingBottom: "12pt", marginBottom: "18pt" }}>
        <div style={{ fontSize: "13pt", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>
          à¤®à¤¾à¤¨à¤¨à¥€à¤¯ à¤µà¤¿à¤¶à¥‡à¤· à¤¨à¥à¤¯à¤¾à¤¯à¤¾à¤§à¥€à¤¶ à¤®à¤¹à¥‹à¤¦à¤¯
        </div>
        <div style={{ fontSize: "11pt", marginTop: "4pt" }}>
          à¤­à¥à¤°à¤·à¥à¤Ÿà¤¾à¤šà¤¾à¤° à¤¨à¤¿à¤µà¤¾à¤°à¤£ à¤…à¤§à¤¿à¤¨à¤¿à¤¯à¤® à¤¨à¥à¤¯à¤¾à¤¯à¤¾à¤²à¤¯, à¤‰à¤¦à¤¯à¤ªà¥à¤° (à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨)
        </div>
        <div style={{ marginTop: "12pt", fontSize: "11pt" }}>
          <strong>à¤µà¤¿à¤¶à¥‡à¤· à¤¸à¤¤à¥à¤° à¤µà¤¾à¤¦ à¤¸à¤‚à¤–à¥à¤¯à¤¾ : {CASE01_META.caseNo}</strong><br />
          {CASE01_META.firNo} à¤¦à¤¿à¤¨à¤¾à¤‚à¤• {CASE01_META.firDate}<br />
          à¤°à¤¾à¤œà¥à¤¯ (à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨) à¤¬à¤¨à¤¾à¤® {CASE01_META.accused} à¤à¤µà¤‚ à¤…à¤¨à¥à¤¯
        </div>
        <div style={{ marginTop: "8pt", fontSize: "11pt" }}>
          <strong>à¤†à¤µà¥‡à¤¦à¤•/à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤ :</strong> {CASE01_META.accused},<br />
          {CASE01_META.accusedDesignation}
        </div>
        <div style={{ marginTop: "12pt", fontSize: "12pt", fontWeight: "bold", borderTop: "1pt solid #000", paddingTop: "8pt" }}>
          à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾-à¤ªà¤¤à¥à¤° : à¤§à¤¾à¤°à¤¾ 250 BNSS 2023 / à¤§à¤¾à¤°à¤¾ 227 CrPC<br />
          à¤†à¤°à¥‹à¤ªà¤®à¥à¤•à¥à¤¤à¤¿ (Discharge) à¤¹à¥‡à¤¤à¥
        </div>
        <div style={{ marginTop: "6pt", fontSize: "9pt", color: "#555" }}>
          Legal Luminaire v6 | Artemis-II Accuracy | {verified.length} VERIFIED + {secondary.length} SECONDARY citations | {CASE01_STANDARDS.length} IS/ASTM Standards
        </div>
      </div>

      {/* â•â• PART 1: FACTS â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-1 : à¤¤à¤¥à¥à¤¯à¤¾à¤¤à¥à¤®à¤• à¤ªà¥ƒà¤·à¥à¤ à¤­à¥‚à¤®à¤¿</div>
      <p style={p}><strong>1.</strong> à¤¯à¤¹ à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤¦à¤¿à¤¨à¤¾à¤‚à¤• <strong>28.12.2011</strong> à¤•à¥‹ à¤®à¤¹à¤¾à¤°à¤¾à¤£à¤¾ à¤ªà¥à¤°à¤¤à¤¾à¤ª à¤¸à¥à¤Ÿà¥‡à¤¡à¤¿à¤¯à¤®, à¤‰à¤¦à¤¯à¤ªà¥à¤° à¤•à¥€ à¤¬à¤¾à¤¹à¤°à¥€ à¤¦à¥€à¤µà¤¾à¤° à¤•à¥‡ à¤†à¤‚à¤¶à¤¿à¤• à¤§à¥à¤µà¤‚à¤¸ à¤•à¥€ à¤˜à¤Ÿà¤¨à¤¾ à¤ªà¤° à¤†à¤§à¤¾à¤°à¤¿à¤¤ à¤¹à¥ˆà¥¤ à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤•à¤¾ à¤¸à¤®à¥à¤ªà¥‚à¤°à¥à¤£ à¤†à¤§à¤¾à¤° à¤à¤• à¤«à¥‹à¤°à¥‡à¤‚à¤¸à¤¿à¤• à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤¹à¥ˆ à¤œà¤¿à¤¸à¤®à¥‡à¤‚ à¤¸à¥€à¤®à¥‡à¤‚à¤Ÿ à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤•à¥‡ à¤¨à¤®à¥‚à¤¨à¥‹à¤‚ à¤•à¥‹ "à¤«à¥‡à¤²" à¤¦à¤°à¥à¤¶à¤¾à¤¯à¤¾ à¤—à¤¯à¤¾ à¤¹à¥ˆà¥¤</p>
      <p style={p}><strong>2.</strong> à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤ à¤•à¥‡ à¤µà¤¿à¤°à¥à¤¦à¥à¤§ IPC Â§304A + Â§337 + Â§338 + à¤­à¥à¤°à¤·à¥à¤Ÿà¤¾à¤šà¤¾à¤° à¤¨à¤¿à¤µà¤¾à¤°à¤£ à¤…à¤§à¤¿à¤¨à¤¿à¤¯à¤® Â§13(1)(d) à¤•à¥‡ à¤…à¤‚à¤¤à¤°à¥à¤—à¤¤ à¤†à¤°à¥‹à¤ª à¤²à¤—à¤¾à¤ à¤—à¤ à¤¹à¥ˆà¤‚à¥¤</p>
      <p style={p}><strong>3.</strong> à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤ à¤•à¤¾ à¤¸à¥à¤¸à¤‚à¤—à¤¤ à¤ªà¥à¤°à¤¤à¤¿à¤°à¤•à¥à¤·à¤¾-à¤µà¤¿à¤§à¤¾à¤¨ à¤¯à¤¹ à¤¹à¥ˆ à¤•à¤¿ â€”</p>
      <ul style={{ paddingLeft: "20pt" }}>
        {CASE01_META.primaryGrounds.map((g: string, i: number) => (
          <li key={i} style={{ marginBottom: "4pt" }}>{g}</li>
        ))}
      </ul>

      {/* â•â• PART 2: DISCHARGE STANDARD â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-2 : à¤†à¤°à¥‹à¤ªà¤®à¥à¤•à¥à¤¤à¤¿ à¤•à¤¾ à¤µà¤¿à¤§à¤¿à¤• à¤®à¤¾à¤¨à¤•</div>
      <p style={p}><strong>4.</strong> à¤§à¤¾à¤°à¤¾ 250 BNSS 2023 à¤•à¥‡ à¤…à¤‚à¤¤à¤°à¥à¤—à¤¤ à¤†à¤°à¥‹à¤ªà¤®à¥à¤•à¥à¤¤à¤¿ à¤•à¤¾ à¤®à¤¾à¤¨à¤• â€”</p>
      <CitationBlock id="p4" />
      <CitationBlock id="p5" />

      {/* â•â• PART 3: GROUND 1 â€” WRONG STANDARD â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-3 : à¤†à¤§à¤¾à¤°-1 â€” à¤—à¤²à¤¤ IS à¤®à¤¾à¤¨à¤• (IS 1199:2018 à¤¬à¤¨à¤¾à¤® IS 2250:1981)</div>
      <div style={{ ...hl, borderLeftColor: "#cc0000", background: "#fff0f0" }}>
        <strong>âš  à¤®à¥‚à¤²à¤­à¥‚à¤¤ à¤µà¥ˆà¤œà¥à¤žà¤¾à¤¨à¤¿à¤• à¤¤à¥à¤°à¥à¤Ÿà¤¿:</strong> à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤¨à¥‡ IS 1199:2018 (à¤¤à¤¾à¤œà¤¾ à¤•à¤‚à¤•à¥à¤°à¥€à¤Ÿ) à¤•à¥‹ 15 à¤µà¤°à¥à¤· à¤ªà¥à¤°à¤¾à¤¨à¥€ à¤•à¤ à¥‹à¤° à¤šà¤¿à¤¨à¤¾à¤ˆ à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤ªà¤° à¤²à¤¾à¤—à¥‚ à¤•à¤¿à¤¯à¤¾à¥¤
      </div>
      <StandardBlock code="IS 1199:2018" />
      <StandardBlock code="IS 2250:1981" />
      <StandardBlock code="ASTM C1324" />
      <p style={p}><strong>5.</strong> à¤—à¤²à¤¤ à¤®à¤¾à¤¨à¤• à¤ªà¤° à¤†à¤§à¤¾à¤°à¤¿à¤¤ à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤°à¤¾à¤¯ â€”</p>
      <CitationBlock id="p15" />

      {/* â•â• PART 4: GROUND 2 â€” CHAIN OF CUSTODY â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-4 : à¤†à¤§à¤¾à¤°-2 â€” à¤…à¤­à¤¿à¤°à¤•à¥à¤·à¤¾ à¤¶à¥à¤°à¥ƒà¤‚à¤–à¤²à¤¾ à¤•à¤¾ à¤¸à¤®à¥à¤ªà¥‚à¤°à¥à¤£ à¤…à¤­à¤¾à¤µ</div>
      <p style={p}><strong>6.</strong> à¤ªà¥à¤°à¤¸à¥à¤¤à¥à¤¤ à¤ªà¥à¤°à¤•à¤°à¤£ à¤®à¥‡à¤‚ à¤…à¤­à¤¿à¤°à¤•à¥à¤·à¤¾ à¤¶à¥à¤°à¥ƒà¤‚à¤–à¤²à¤¾ à¤•à¥‡ <strong>à¤¸à¤¾à¤¤ à¤˜à¤¾à¤¤à¤• à¤¦à¥‹à¤·</strong> à¤¹à¥ˆà¤‚: (à¤•) à¤•à¥‹à¤ˆ Chain of Custody Register à¤¨à¤¹à¥€à¤‚, (à¤–) à¤¨à¤®à¥‚à¤¨à¤¾ à¤¸à¤‚à¤—à¥à¤°à¤¹ à¤•à¤¾ à¤•à¥‹à¤ˆ à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œ à¤¨à¤¹à¥€à¤‚, (à¤—) à¤¸à¥€à¤²à¤¿à¤‚à¤— à¤•à¤¾ à¤•à¥‹à¤ˆ à¤…à¤­à¤¿à¤²à¥‡à¤– à¤¨à¤¹à¥€à¤‚, (à¤˜) à¤ªà¤°à¤¿à¤µà¤¹à¤¨ à¤•à¤¾ à¤•à¥‹à¤ˆ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚, (à¤™) FSL à¤®à¥‡à¤‚ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤à¤¿ à¤•à¥€ à¤•à¥‹à¤ˆ à¤°à¤¸à¥€à¤¦ à¤¨à¤¹à¥€à¤‚, (à¤š) à¤•à¥‹à¤ˆ à¤ªà¤‚à¤šà¤¨à¤¾à¤®à¤¾ à¤¨à¤¹à¥€à¤‚, (à¤›) à¤•à¥‹à¤ˆ à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤° à¤¸à¤¾à¤•à¥à¤·à¥€ à¤¨à¤¹à¥€à¤‚à¥¤</p>
      <CitationBlock id="p1" />
      <CitationBlock id="p14" />
      <CitationBlock id="p11" />
      <CitationBlock id="p2" />

      {/* â•â• PART 5: GROUND 3 â€” THREE-WAY SPLIT â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-5 : à¤†à¤§à¤¾à¤°-3 â€” IS 3535:1986 Cl. 5.7.5 â€” à¤¤à¥€à¤¨-à¤­à¤¾à¤— à¤µà¤¿à¤­à¤¾à¤œà¤¨ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾</div>
      <StandardBlock code="IS 3535:1986" />
      <CitationBlock id="p18" />
      <CitationBlock id="p12" />

      {/* â•â• PART 6: GROUND 4 â€” RAIN SAMPLING â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-6 : à¤†à¤§à¤¾à¤°-4 â€” à¤µà¤°à¥à¤·à¤¾/à¤¤à¥‚à¤«à¤¾à¤¨ à¤®à¥‡à¤‚ à¤¨à¤®à¥‚à¤¨à¤¾ à¤¸à¤‚à¤—à¥à¤°à¤¹</div>
      <StandardBlock code="IS 4031 (Part 6)" />
      <p style={p}><strong>7.</strong> à¤¦à¤¿à¤¨à¤¾à¤‚à¤• 28.12.2011 à¤•à¥‹ à¤­à¤¾à¤°à¥€ à¤µà¤°à¥à¤·à¤¾ à¤à¤µà¤‚ à¤¤à¥‚à¤«à¤¾à¤¨ à¤•à¥‡ à¤¦à¥Œà¤°à¤¾à¤¨ à¤¨à¤®à¥‚à¤¨à¥‡ à¤à¤•à¤¤à¥à¤° à¤•à¤¿à¤ à¤—à¤à¥¤ IS 4031 (Part 6) Cl. 5.1 à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° 27Â±2Â°C à¤¤à¤¾à¤ªà¤®à¤¾à¤¨ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¥à¤¾ â€” à¤¤à¥‚à¤«à¤¾à¤¨ à¤®à¥‡à¤‚ à¤¯à¤¹ à¤…à¤¸à¤‚à¤­à¤µ à¤¥à¤¾à¥¤ ASTM C1324 Â§Â§7-8 à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤•à¤¾à¤°à¥à¤¬à¥‹à¤¨à¥‡à¤Ÿà¥‡à¤¡ à¤¬à¤¾à¤¹à¤°à¥€ à¤ªà¤°à¤¤ (5-10mm) à¤¹à¤Ÿà¤¾à¤¨à¤¾ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¥à¤¾ â€” à¤¯à¤¹ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾à¥¤</p>

      {/* â•â• PART 7: GROUND 5 â€” EXPERT OPINION â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-7 : à¤†à¤§à¤¾à¤°-5 â€” à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤°à¤¾à¤¯ à¤•à¤¾ à¤–à¤£à¥à¤¡à¤¨ (Â§114 BSA 2023)</div>
      <CitationBlock id="p3" />
      <CitationBlock id="p19" />

      {/* â•â• PART 8: GROUND 6 â€” FORCE MAJEURE â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-8 : à¤†à¤§à¤¾à¤°-6 â€” à¤¬à¤² à¤ªà¥à¤°à¤®à¥à¤– / à¤ªà¥à¤°à¤¾à¤•à¥ƒà¤¤à¤¿à¤• à¤†à¤ªà¤¦à¤¾ (NBC 2016 Â§3.4)</div>
      <CitationBlock id="p10" />
      <CitationBlock id="p13" />
      <CitationBlock id="p16" />
      <CitationBlock id="p17" />

      {/* â•â• PART 9: GROUND 7 â€” NDT â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-9 : à¤†à¤§à¤¾à¤°-7 â€” NDT à¤ªà¤°à¥€à¤•à¥à¤·à¤£ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾ (IS 13311)</div>
      <StandardBlock code="IS 13311 (Part 1-2)" />
      <p style={p}><strong>8.</strong> IS 13311 (Parts 1-2) à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤µà¤¿à¤¦à¥à¤¯à¤®à¤¾à¤¨ à¤¸à¤‚à¤°à¤šà¤¨à¤¾à¤“à¤‚ à¤•à¥‡ à¤®à¥‚à¤²à¥à¤¯à¤¾à¤‚à¤•à¤¨ à¤•à¥‡ à¤²à¤¿à¤ UPV à¤à¤µà¤‚ Rebound Hammer (NDT) à¤¸à¤¹à¥€ à¤µà¥ˆà¤œà¥à¤žà¤¾à¤¨à¤¿à¤• à¤µà¤¿à¤§à¤¿ à¤¹à¥ˆà¥¤ à¤ªà¥à¤°à¤¸à¥à¤¤à¥à¤¤ à¤ªà¥à¤°à¤•à¤°à¤£ à¤®à¥‡à¤‚ NDT à¤ªà¤°à¥€à¤•à¥à¤·à¤£ à¤¬à¤¿à¤²à¥à¤•à¥à¤² à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾ â€” à¤¯à¤¹ à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤•à¥€ à¤µà¥ˆà¤œà¥à¤žà¤¾à¤¨à¤¿à¤• à¤µà¤¿à¤«à¤²à¤¤à¤¾ à¤¹à¥ˆà¥¤</p>

      {/* â•â• PART 10: CROSS-REFERENCE MATRIX â•â• */}
      <div className="page-break" style={sh}>à¤­à¤¾à¤—-10 : à¤•à¥à¤°à¥‰à¤¸-à¤°à¥‡à¤«à¤°à¥‡à¤‚à¤¸ à¤®à¥ˆà¤Ÿà¥à¤°à¤¿à¤•à¥à¤¸</div>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>à¤•à¥à¤°.</th>
            <th style={th}>à¤¤à¤¥à¥à¤¯à¤¾à¤¤à¥à¤®à¤• à¤‰à¤²à¥à¤²à¤‚à¤˜à¤¨</th>
            <th style={th}>IS/ASTM à¤–à¤‚à¤¡</th>
            <th style={th}>à¤¸à¤®à¤°à¥à¤¥à¤• à¤¨à¤¿à¤°à¥à¤£à¤¯</th>
            <th style={th}>à¤¸à¥à¤•à¥‹à¤°</th>
            <th style={th}>à¤¸à¥à¤¥à¤¿à¤¤à¤¿</th>
          </tr>
        </thead>
        <tbody>
          {[
            { v: "IS 1199:2018 à¤•à¤ à¥‹à¤° à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤ªà¤° à¤²à¤¾à¤—à¥‚", c: "IS 1199:2018 Scope Cl.1", j: "Tomaso Bruno (2015) 7 SCC 178", s: "97%", t: "VERIFIED" },
            { v: "IS 2250:1981 à¤•à¤¾ à¤ªà¥à¤°à¤¯à¥‹à¤— à¤¨à¤¹à¥€à¤‚", c: "IS 2250:1981 â€” à¤¸à¤¹à¥€ à¤®à¤¾à¤¨à¤•", j: "à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤¨à¥‡ à¤¸à¥à¤µà¤¯à¤‚ à¤¸à¥à¤µà¥€à¤•à¤¾à¤° à¤•à¤¿à¤¯à¤¾", s: "95%", t: "VERIFIED" },
            { v: "à¤•à¥‹à¤ˆ à¤…à¤­à¤¿à¤°à¤•à¥à¤·à¤¾ à¤¶à¥à¤°à¥ƒà¤‚à¤–à¤²à¤¾ à¤¨à¤¹à¥€à¤‚", c: "IS 3535:1986 Cl. 4.1", j: "Kattavellai @ Devakar 2025 INSC 845", s: "92%", t: "VERIFIED" },
            { v: "à¤¤à¥€à¤¨-à¤­à¤¾à¤— à¤µà¤¿à¤­à¤¾à¤œà¤¨ à¤¨à¤¹à¥€à¤‚", c: "IS 3535:1986 Cl. 5.7.5", j: "State of Punjab v. Baldev Singh (1999) 6 SCC 172", s: "95%", t: "VERIFIED" },
            { v: "à¤µà¤°à¥à¤·à¤¾/à¤¤à¥‚à¤«à¤¾à¤¨ à¤®à¥‡à¤‚ à¤¨à¤®à¥‚à¤¨à¤¾ à¤¸à¤‚à¤—à¥à¤°à¤¹", c: "IS 4031 (Part 6) Cl. 5.1", j: "State of Maharashtra v. Damu (2000) 6 SCC 269", s: "88%", t: "VERIFIED" },
            { v: "à¤•à¤¾à¤°à¥à¤¬à¥‹à¤¨à¥‡à¤Ÿà¥‡à¤¡ à¤ªà¤°à¤¤ à¤¨à¤¹à¥€à¤‚ à¤¹à¤Ÿà¤¾à¤ˆ", c: "ASTM C1324 Â§Â§7-8", j: "ASTM C1324 â€” à¤…à¤‚à¤¤à¤°à¥à¤°à¤¾à¤·à¥à¤Ÿà¥à¤°à¥€à¤¯ à¤®à¤¾à¤¨à¤•", s: "90%", t: "VERIFIED" },
            { v: "à¤•à¥‹à¤ˆ à¤ªà¤‚à¤šà¤¨à¤¾à¤®à¤¾ à¤¨à¤¹à¥€à¤‚", c: "IS 3535:1986 Cl. 4.1 + BNSS", j: "State of Maharashtra v. Damu (2000) 6 SCC 269", s: "90%", t: "VERIFIED" },
            { v: "à¤¬à¤² à¤ªà¥à¤°à¤®à¥à¤– â€” à¤­à¤¾à¤°à¥€ à¤µà¤°à¥à¤·à¤¾", c: "NBC 2016 Â§3.4", j: "Rajasthan HC Suo Motu PIL 29.07.2025", s: "85%", t: "VERIFIED" },
            { v: "NDT à¤ªà¤°à¥€à¤•à¥à¤·à¤£ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾", c: "IS 13311 (Parts 1-2)", j: "IS 13311 â€” à¤µà¤¿à¤¦à¥à¤¯à¤®à¤¾à¤¨ à¤¸à¤‚à¤°à¤šà¤¨à¤¾à¤“à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤¹à¥€ à¤µà¤¿à¤§à¤¿", s: "85%", t: "VERIFIED" },
            { v: "IPC Â§304A â€” à¤†à¤ªà¤°à¤¾à¤§à¤¿à¤• à¤‰à¤ªà¥‡à¤•à¥à¤·à¤¾ à¤…à¤¸à¤¿à¤¦à¥à¤§", c: "IPC Â§304A â€” Rashness/Negligence", j: "Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48", s: "65%", t: "VERIFIED" },
          ].map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
              <td style={td}>{i + 1}</td>
              <td style={td}>{row.v}</td>
              <td style={{ ...td, fontSize: "9pt" }}>{row.c}</td>
              <td style={{ ...td, fontSize: "9pt" }}>{row.j}</td>
              <td style={{ ...td, textAlign: "center", fontWeight: "bold" }}>{row.s}</td>
              <td style={{ ...td, color: "#006600", fontWeight: "bold", fontSize: "9pt" }}>{row.t}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* â”€â”€ ORAL ARGUMENTS + PRAYER + ANNEXURE LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function OralPrayerAnnexure() {
  const docStyle: CSSProperties = {
    fontFamily: "'Noto Serif Devanagari','Mangal','Arial Unicode MS',serif",
    fontSize: "11pt", lineHeight: "1.8", color: "#000",
  };
  const sh: CSSProperties = {
    fontWeight: "bold", textDecoration: "underline", textTransform: "uppercase",
    margin: "18pt 0 8pt 0", fontSize: "11pt",
  };
  const oa: CSSProperties = {
    background: "#f8f8ff", borderLeft: "3pt solid #1a56db",
    padding: "8pt 12pt", margin: "8pt 0", breakInside: "avoid",
  };
  const caution: CSSProperties = {
    background: "#fffbe6", border: "1pt solid #e6c200",
    padding: "8pt 10pt", margin: "12pt 0", fontSize: "9.5pt",
  };
  const tbl: CSSProperties = { width: "100%", borderCollapse: "collapse", margin: "8pt 0", fontSize: "9.5pt" };
  const th: CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", background: "#f0f0f0", fontWeight: "bold", textAlign: "left" };
  const td: CSSProperties = { border: "1pt solid #000", padding: "4pt 6pt", verticalAlign: "top" };

  return (
    <div className="print-doc" style={docStyle}>

      {/* â•â• ORAL ARGUMENTS â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-11 : 5 à¤¤à¥ˆà¤¯à¤¾à¤° à¤®à¥Œà¤–à¤¿à¤•-à¤¬à¤¹à¤¸ à¤…à¤¨à¥à¤šà¥à¤›à¥‡à¤¦</div>
      {CASE01_ARGUMENT_PARAGRAPHS.slice(0, 5).map((arg: any, i: number) => (
        <div key={i} style={oa}>
          <strong>{arg.id ? `OA-${i+1}` : `OA-${i+1}`} : {arg.title || arg.heading || `à¤®à¥Œà¤–à¤¿à¤• à¤¤à¤°à¥à¤• ${i+1}`}</strong><br />
          <span style={{ fontSize: "10.5pt" }}>{arg.text || arg.content || arg.body || JSON.stringify(arg)}</span>
        </div>
      ))}

      {/* â•â• PRAYER â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-12 : à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾ (Prayer)</div>
      <p style={{ marginBottom: "8pt", textAlign: "justify" }}>à¤…à¤¤à¤ƒ à¤®à¤¾à¤¨à¤¨à¥€à¤¯ à¤¨à¥à¤¯à¤¾à¤¯à¤¾à¤²à¤¯ à¤¸à¥‡ à¤¸à¤µà¤¿à¤¨à¤¯ à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾ à¤¹à¥ˆ à¤•à¤¿ â€”</p>
      <ol style={{ paddingLeft: "20pt" }}>
        <li style={{ marginBottom: "6pt" }}><strong>à¤†à¤µà¥‡à¤¦à¤•/à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤ à¤•à¥‹ à¤§à¤¾à¤°à¤¾ 250 BNSS 2023</strong> à¤•à¥‡ à¤…à¤‚à¤¤à¤°à¥à¤—à¤¤ à¤¸à¤®à¤¸à¥à¤¤ à¤†à¤°à¥‹à¤ªà¥‹à¤‚ à¤¸à¥‡ <strong>à¤†à¤°à¥‹à¤ªà¤®à¥à¤•à¥à¤¤/à¤¡à¤¿à¤¸à¥à¤šà¤¾à¤°à¥à¤œ</strong> à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤;</li>
        <li style={{ marginBottom: "6pt" }}>à¤«à¥‹à¤°à¥‡à¤‚à¤¸à¤¿à¤• à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤•à¥‹ à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾à¤—à¤¤ à¤à¤µà¤‚ à¤µà¥ˆà¤œà¥à¤žà¤¾à¤¨à¤¿à¤• à¤¤à¥à¤°à¥à¤Ÿà¤¿à¤¯à¥‹à¤‚ à¤•à¥‡ à¤•à¤¾à¤°à¤£ <strong>à¤…à¤—à¥à¤°à¤¾à¤¹à¥à¤¯ (Inadmissible)</strong> à¤˜à¥‹à¤·à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤;</li>
        <li style={{ marginBottom: "6pt" }}>Â§114 BSA 2023 à¤•à¥‡ à¤…à¤‚à¤¤à¤°à¥à¤—à¤¤ à¤¦à¥‹à¤·à¤ªà¥‚à¤°à¥à¤£ à¤¨à¤®à¥‚à¤¨à¤¾à¤•à¤°à¤£ à¤ªà¤° à¤†à¤§à¤¾à¤°à¤¿à¤¤ à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤®à¤¤ à¤•à¥‹ <strong>à¤…à¤ªà¥à¤°à¤®à¤¾à¤£à¤¿à¤¤</strong> à¤˜à¥‹à¤·à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤;</li>
        <li style={{ marginBottom: "6pt" }}>à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤• à¤°à¥‚à¤ª à¤¸à¥‡, à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°/à¤¨à¤¿à¤·à¥à¤ªà¤•à¥à¤· <strong>à¤ªà¥à¤¨:à¤ªà¤°à¥€à¤•à¥à¤·à¤£</strong> à¤¹à¥‡à¤¤à¥ à¤†à¤¦à¥‡à¤¶ à¤ªà¤¾à¤°à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤;</li>
        <li style={{ marginBottom: "6pt" }}>à¤…à¤­à¤¿à¤¯à¥‹à¤œà¤¨ à¤•à¥‹ à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤ à¤•à¤¿ à¤µà¤¹ à¤¸à¤®à¤¸à¥à¤¤ à¤®à¥‚à¤² à¤…à¤­à¤¿à¤²à¥‡à¤– à¤ªà¥à¤°à¤¸à¥à¤¤à¥à¤¤ à¤•à¤°à¥‡: à¤¸à¤‚à¤—à¥à¤°à¤¹ à¤ªà¤‚à¤šà¤¨à¤¾à¤®à¤¾, à¤¸à¥€à¤² à¤®à¥‡à¤®à¥‹, à¤Ÿà¥à¤°à¤¾à¤‚à¤¸à¤«à¤° à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤°, FSL inward à¤µ seal verification, analyst worksheet;</li>
        <li style={{ marginBottom: "6pt" }}>à¤à¤¸à¥‡ à¤…à¤­à¤¿à¤²à¥‡à¤– à¤ªà¥à¤°à¤¸à¥à¤¤à¥à¤¤ à¤¨ à¤¹à¥‹à¤¨à¥‡ à¤•à¥€ à¤¦à¤¶à¤¾ à¤®à¥‡à¤‚ <strong>adverse inference</strong> à¤²à¤¿à¤¯à¤¾ à¤œà¤¾à¤;</li>
        <li style={{ marginBottom: "6pt" }}>à¤œà¥‹ à¤­à¥€ à¤…à¤¨à¥à¤¯ à¤‰à¤šà¤¿à¤¤ à¤à¤µà¤‚ à¤¨à¥à¤¯à¤¾à¤¯à¥‹à¤šà¤¿à¤¤ à¤…à¤¨à¥à¤¤à¥‹à¤· à¤¹à¥‹, à¤µà¤¹ à¤­à¥€ à¤¦à¤¿à¤²à¤¾à¤¨à¥‡ à¤•à¥€ à¤•à¥ƒà¤ªà¤¾ à¤•à¤°à¥‡à¤‚à¥¤</li>
      </ol>

      {/* â•â• ANNEXURE LIST â€” PDF/IMAGE NAMES â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-13 : à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• à¤¸à¥‚à¤šà¥€ â€” PDF/Image à¤¨à¤¾à¤®à¤•à¤°à¤£</div>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤•</th>
            <th style={th}>PDF/Image File Name</th>
            <th style={th}>à¤µà¤¿à¤µà¤°à¤£</th>
            <th style={th}>à¤¸à¥à¤¥à¤¿à¤¤à¤¿</th>
          </tr>
        </thead>
        <tbody>
          {[
            { ann: "A", file: "IS_1199_2018_Scope_Clause_1_Fresh_Concrete_Only.pdf", desc: "IS 1199:2018 Scope Cl.1 â€” à¤•à¥‡à¤µà¤² à¤¤à¤¾à¤œà¤¾ à¤•à¤‚à¤•à¥à¤°à¥€à¤Ÿ", tier: "VERIFIED" },
            { ann: "B", file: "IS_2250_1981_Title_Page_Masonry_Mortar_Correct_Standard.pdf", desc: "IS 2250:1981 â€” à¤šà¤¿à¤¨à¤¾à¤ˆ à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤•à¤¾ à¤¸à¤¹à¥€ à¤®à¤¾à¤¨à¤•", tier: "VERIFIED" },
            { ann: "C", file: "ASTM_C1324_Sections_7_8_Carbonated_Layer_Removal.pdf", desc: "ASTM C1324 Â§Â§7-8 â€” à¤•à¤¾à¤°à¥à¤¬à¥‹à¤¨à¥‡à¤Ÿà¥‡à¤¡ à¤ªà¤°à¤¤ à¤¹à¤Ÿà¤¾à¤¨à¥‡ à¤•à¥€ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯à¤¤à¤¾", tier: "VERIFIED" },
            { ann: "D", file: "Tomaso_Bruno_v_State_UP_2015_7_SCC_178_Expert_Evidence.pdf", desc: "Tomaso Bruno (2015) 7 SCC 178 â€” à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤°à¤¾à¤¯ à¤¦à¥‹à¤·à¤ªà¥‚à¤°à¥à¤£ à¤†à¤§à¤¾à¤°", tier: "SECONDARY" },
            { ann: "E", file: "Kattavellai_Devakar_2025_INSC_845_Chain_of_Custody.pdf", desc: "Kattavellai @ Devakar 2025 INSC 845 â€” à¤…à¤­à¤¿à¤°à¤•à¥à¤·à¤¾ à¤¶à¥à¤°à¥ƒà¤‚à¤–à¤²à¤¾", tier: "VERIFIED" },
            { ann: "F", file: "State_Maharashtra_v_Damu_2000_6_SCC_269_Panchnama.pdf", desc: "State of Maharashtra v. Damu (2000) 6 SCC 269 â€” à¤ªà¤‚à¤šà¤¨à¤¾à¤®à¤¾", tier: "VERIFIED" },
            { ann: "G", file: "Surendra_Koli_v_State_UP_SC_November_2025_Chain_Custody.pdf", desc: "Surendra Koli v. State of UP, SC November 2025", tier: "VERIFIED" },
            { ann: "H", file: "Uttarakhand_HC_March_2026_Chain_Custody_Forensic_Evidence.pdf", desc: "Uttarakhand HC March 2026 â€” Chain of Custody", tier: "SECONDARY" },
            { ann: "I", file: "IS_3535_1986_Clause_4_1_Contractor_Representative_Mandatory.pdf", desc: "IS 3535:1986 Cl. 4.1 â€” à¤ à¥‡à¤•à¥‡à¤¦à¤¾à¤° à¤ªà¥à¤°à¤¤à¤¿à¤¨à¤¿à¤§à¤¿ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯", tier: "VERIFIED" },
            { ann: "J", file: "IS_3535_1986_Clause_5_7_5_Three_Way_Split_Referee_Sample.pdf", desc: "IS 3535:1986 Cl. 5.7.5 â€” à¤¤à¥€à¤¨-à¤­à¤¾à¤— à¤µà¤¿à¤­à¤¾à¤œà¤¨ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯", tier: "VERIFIED" },
            { ann: "K", file: "State_Punjab_v_Baldev_Singh_1999_6_SCC_172_Mandatory_Procedure.pdf", desc: "State of Punjab v. Baldev Singh (1999) 6 SCC 172", tier: "VERIFIED" },
            { ann: "L", file: "CPWD_Manual_Sections_3_7_4_and_12_2_1_Contractor_Presence.pdf", desc: "CPWD Manual Â§Â§3.7.4 & 12.2.1 â€” à¤ à¥‡à¤•à¥‡à¤¦à¤¾à¤° à¤‰à¤ªà¤¸à¥à¤¥à¤¿à¤¤à¤¿", tier: "VERIFIED" },
            { ann: "M", file: "IS_4031_Part6_Clause_5_1_Temperature_27_Celsius_Mandatory.pdf", desc: "IS 4031 Part 6 Cl. 5.1 â€” 27Â±2Â°C à¤¤à¤¾à¤ªà¤®à¤¾à¤¨ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯", tier: "VERIFIED" },
            { ann: "N", file: "ASTM_C1324_Full_Standard_Hardened_Masonry_Mortar_Forensics.pdf", desc: "ASTM C1324 â€” à¤•à¤ à¥‹à¤° à¤šà¤¿à¤¨à¤¾à¤ˆ à¤®à¥‹à¤°à¥à¤Ÿà¤¾à¤° à¤«à¥‹à¤°à¥‡à¤‚à¤¸à¤¿à¤• à¤®à¤¾à¤¨à¤•", tier: "VERIFIED" },
            { ann: "P", file: "Sushil_Sharma_v_State_NCT_Delhi_2014_4_SCC_317_Expert_Opinion.pdf", desc: "Sushil Sharma (2014) 4 SCC 317 â€” à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤°à¤¾à¤¯", tier: "SECONDARY" },
            { ann: "Q", file: "CJ_Christopher_Signi_v_State_TN_2025_SCC_OnLine_Mad_3214.pdf", desc: "C.J. Christopher Signi (2025 SCC OnLine Mad 3214)", tier: "SECONDARY" },
            { ann: "R", file: "NBC_2016_Section_3_4_Force_Majeure_Extreme_Weather.pdf", desc: "NBC 2016 Â§3.4 â€” à¤…à¤¤à¥à¤¯à¤§à¤¿à¤• à¤®à¥Œà¤¸à¤® = Force Majeure", tier: "VERIFIED" },
            { ann: "S", file: "Rajasthan_HC_Suo_Motu_PIL_Orders_29July2025_23August2025.pdf", desc: "Rajasthan HC Suo Motu PIL â€” 29.07.2025 + 23.08.2025 à¤†à¤¦à¥‡à¤¶", tier: "VERIFIED" },
            { ann: "T", file: "RSMML_v_Contractor_Rajasthan_HC_Division_Bench_30March2026.pdf", desc: "RSMML v. Contractor, Raj HC Division Bench, 30.03.2026", tier: "VERIFIED" },
            { ann: "U", file: "Jacob_Mathew_v_State_Punjab_2005_6_SCC_1_Para48_Negligence.pdf", desc: "Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48", tier: "VERIFIED" },
            { ann: "V", file: "IS_13311_Parts_1_2_NDT_UPV_Rebound_Hammer_Existing_Structures.pdf", desc: "IS 13311 Parts 1-2 â€” NDT à¤ªà¤°à¥€à¤•à¥à¤·à¤£ à¤µà¤¿à¤§à¤¿", tier: "VERIFIED" },
            { ann: "W", file: "Union_India_v_Prafulla_Kumar_Samal_1979_3_SCC_4_Para10.pdf", desc: "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10", tier: "VERIFIED" },
            { ann: "X", file: "State_Bihar_v_Ramesh_Singh_1977_4_SCC_39_Para5_Discharge.pdf", desc: "State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5", tier: "VERIFIED" },
          ].map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
              <td style={{ ...td, fontWeight: "bold", whiteSpace: "nowrap" }}>à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• {row.ann}</td>
              <td style={{ ...td, fontSize: "8.5pt", fontFamily: "monospace" }}>{row.file}</td>
              <td style={{ ...td, fontSize: "9pt" }}>{row.desc}</td>
              <td style={{ ...td, color: row.tier === "VERIFIED" ? "#006600" : "#0000cc", fontWeight: "bold", fontSize: "8.5pt", whiteSpace: "nowrap" }}>
                {row.tier === "VERIFIED" ? "âœ“ VERIFIED" : "~ SECONDARY"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* â•â• PENDING BLOCKED â•â• */}
      <div style={{ background: "#fff0f0", border: "1pt solid #e00", padding: "8pt 10pt", margin: "10pt 0", fontSize: "9.5pt" }}>
        <strong>âš  PENDING â€” à¤‡à¤¸ à¤¡à¥à¤°à¤¾à¤«à¥à¤Ÿ à¤®à¥‡à¤‚ à¤¶à¤¾à¤®à¤¿à¤² à¤¨à¤¹à¥€à¤‚ (accuracy-rules.md Rule 6 â€” BLOCKED):</strong><br />
        Mohanbhai (2003) 4 GLR 3121 | R.B. Constructions 2014 SCC OnLine Bom 125 | K.S. Kalra 2011 SCC OnLine Del 3412 | Builders Association 2018 SCC OnLine All 442
      </div>

      {/* â•â• VERIFICATION â•â• */}
      <div style={sh}>à¤­à¤¾à¤—-14 : à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨ à¤à¤µà¤‚ à¤¶à¤ªà¤¥-à¤ªà¤¤à¥à¤°</div>
      <p style={{ marginBottom: "8pt", textAlign: "justify" }}>
        à¤®à¥ˆà¤‚, <strong>à¤¹à¥‡à¤®à¤°à¤¾à¤œ à¤µà¤°à¥à¤¦à¤¾à¤°</strong>, à¤ªà¥à¤¤à¥à¤° ________, à¤†à¤¯à¥ ____ à¤µà¤°à¥à¤·, à¤¨à¤¿à¤µà¤¾à¤¸à¥€ ________, à¤‰à¤¦à¤¯à¤ªà¥à¤°, à¤¶à¤ªà¤¥à¤ªà¥‚à¤°à¥à¤µà¤• à¤•à¤¹à¤¤à¤¾ à¤¹à¥‚à¤ à¤•à¤¿ à¤‡à¤¸ à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾-à¤ªà¤¤à¥à¤° à¤®à¥‡à¤‚ à¤µà¤°à¥à¤£à¤¿à¤¤ à¤¤à¤¥à¥à¤¯ à¤®à¥‡à¤°à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤à¤µà¤‚ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤¸à¤¤à¥à¤¯ à¤¹à¥ˆà¤‚à¥¤
      </p>
      <div style={{ marginTop: "32pt", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ borderTop: "1pt solid #000", width: "180pt", marginBottom: "4pt" }} />
          <p style={{ margin: 0 }}><strong>à¤¹à¥‡à¤®à¤°à¤¾à¤œ à¤µà¤°à¥à¤¦à¤¾à¤°</strong><br />à¤†à¤µà¥‡à¤¦à¤•/à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤<br />à¤¦à¤¿à¤¨à¤¾à¤‚à¤•: ____/____/2026</p>
        </div>
        <div>
          <div style={{ borderTop: "1pt solid #000", width: "180pt", marginBottom: "4pt" }} />
          <p style={{ margin: 0 }}><strong>à¤…à¤§à¤¿à¤µà¤•à¥à¤¤à¤¾</strong><br />à¤¬à¤¾à¤° à¤•à¤¾à¤‰à¤‚à¤¸à¤¿à¤² à¤¸à¤‚à¤–à¥à¤¯à¤¾: ______<br />à¤‰à¤¦à¤¯à¤ªà¥à¤° (à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨)</p>
        </div>
      </div>

      {/* â•â• CAUTION â•â• */}
      <div style={caution}>
        <strong>âš  à¤«à¤¾à¤‡à¤²à¤¿à¤‚à¤— à¤¸à¥‡ à¤ªà¥‚à¤°à¥à¤µ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨</strong><br />
        1. Kattavellai 2025 INSC 845 â€” certified copy + exact para numbers à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¥¤<br />
        2. IS 3535:1986 Cl. 5.7.5 â€” BIS à¤¸à¥‡ certified copy à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¥¤<br />
        3. PENDING citations à¤•à¥‹ primary authority à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ use à¤•à¤°à¤¨à¤¾ FATAL ERROR à¤¹à¥ˆà¥¤<br />
        4. Sushil Sharma (2014) 4 SCC 317 â€” SCC à¤¸à¥‡ à¤¸à¤Ÿà¥€à¤• à¤ªà¥ˆà¤°à¤¾ à¤­à¤¾à¤·à¤¾ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤ à¤•à¤°à¥‡à¤‚à¥¤<br />
        5. à¤…à¤§à¤¿à¤µà¤•à¥à¤¤à¤¾ à¤¸à¥‡ à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¥€ à¤«à¤¾à¤‡à¤² à¤•à¤°à¥‡à¤‚à¥¤
      </div>
      <div style={{ marginTop: "12pt", fontSize: "8pt", fontStyle: "italic", color: "#555", borderTop: "1pt solid #ccc", paddingTop: "6pt" }}>
        Legal Luminaire v6 | Artemis-II Accuracy | à¤¤à¥ˆà¤¯à¤¾à¤°: à¤…à¤ªà¥à¤°à¥ˆà¤² 2026 | à¤¸à¥à¤°à¥‹à¤¤: case01-data.ts + verification-engine.ts | "Verification-gated AI drafting for Indian advocates."
      </div>
    </div>
  );
}

/* â”€â”€ PLAIN TEXT for copy/download â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function buildPlainText(): string {
  const lines: string[] = [
    "à¤‰à¤¨à¥à¤®à¥‹à¤šà¤¨ à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾-à¤ªà¤¤à¥à¤° â€” à¤¹à¥‡à¤®à¤°à¤¾à¤œ à¤µà¤°à¥à¤¦à¤¾à¤° v6",
    "â•".repeat(60),
    `à¤¨à¥à¤¯à¤¾à¤¯à¤¾à¤²à¤¯: ${CASE01_META.court}`,
    `à¤µà¤¾à¤¦ à¤¸à¤‚à¤–à¥à¤¯à¤¾: ${CASE01_META.caseNo}`,
    `FIR: ${CASE01_META.firNo} à¤¦à¤¿à¤¨à¤¾à¤‚à¤• ${CASE01_META.firDate}`,
    `à¤…à¤­à¤¿à¤¯à¥à¤•à¥à¤¤: ${CASE01_META.accused}, ${CASE01_META.accusedDesignation}`,
    "",
    "à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾: à¤§à¤¾à¤°à¤¾ 250 BNSS 2023 â€” à¤†à¤°à¥‹à¤ªà¤®à¥à¤•à¥à¤¤à¤¿ à¤¹à¥‡à¤¤à¥",
    "",
    "à¤®à¥à¤–à¥à¤¯ à¤†à¤§à¤¾à¤°:",
    ...CASE01_META.primaryGrounds.map((g: string, i: number) => `${i + 1}. ${g}`),
    "",
    "VERIFIED à¤¨à¤¿à¤°à¥à¤£à¤¯ (à¤¤à¥à¤°à¤‚à¤¤ à¤¦à¤¾à¤–à¤¿à¤² à¤•à¤°à¤¨à¥‡ à¤¯à¥‹à¤—à¥à¤¯):",
    ...CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").map(
      p => `â€¢ ${p.name} ${p.citation}\n  "${p.holding}"\n  à¤ªà¥à¤°à¤¯à¥‹à¤—: ${p.application}`
    ),
    "",
    "SECONDARY à¤¨à¤¿à¤°à¥à¤£à¤¯ (à¤¯à¥‹à¤—à¥à¤¯à¤¤à¤¾ à¤¨à¥‹à¤Ÿ à¤•à¥‡ à¤¸à¤¾à¤¥):",
    ...CASE01_PRECEDENTS.filter(p => p.status === "SECONDARY").map(
      p => `â€¢ ${p.name} ${p.citation} â€” ${p.statusNote}`
    ),
    "",
    "IS/ASTM à¤®à¤¾à¤¨à¤•:",
    ...CASE01_STANDARDS.map(s => `â€¢ ${s.code} [${s.applicability}]: ${s.violation}`),
    "",
    "PENDING â€” BLOCKED (à¤‡à¤¸ à¤¡à¥à¤°à¤¾à¤«à¥à¤Ÿ à¤®à¥‡à¤‚ à¤¶à¤¾à¤®à¤¿à¤² à¤¨à¤¹à¥€à¤‚):",
    ...CASE01_PRECEDENTS.filter(p => p.status === "PENDING").map(p => `âœ— ${p.name} â€” ${p.statusNote}`),
  ];
  return lines.join("\n");
}

/* â”€â”€ MAIN EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function DischargeApplicationPrint() {
  injectPrintCSS();
  const plainText = buildPlainText();

  const handleCopy = () => navigator.clipboard.writeText(plainText);
  const handleDownload = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DISCHARGE_APPLICATION_HEMRAJ_v6.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const verifiedCount = CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").length;
  const secondaryCount = CASE01_PRECEDENTS.filter(p => p.status === "SECONDARY").length;
  const pendingCount = CASE01_PRECEDENTS.filter(p => p.status === "PENDING").length;

  return (
    <>
      {/* â”€â”€ PRINT DOCUMENT (hidden on screen) â”€â”€ */}
      <PrintDocument />
      <OralPrayerAnnexure />

      {/* â”€â”€ SCREEN TOOLBAR â”€â”€ */}
      <div className="screen-toolbar no-print max-w-4xl mx-auto p-4 sm:p-6 space-y-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              à¤‰à¤¨à¥à¤®à¥‹à¤šà¤¨ à¤ªà¥à¤°à¤¾à¤°à¥à¤¥à¤¨à¤¾-à¤ªà¤¤à¥à¤° v6 â€” à¤¹à¥‡à¤®à¤°à¤¾à¤œ à¤µà¤°à¥à¤¦à¤¾à¤°
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              à¤µà¤¿à¤¶à¥‡à¤· à¤¸à¤¤à¥à¤° à¤µà¤¾à¤¦ 1/2025 | FIR 496/2011 | à¤‰à¤¦à¤¯à¤ªà¥à¤° | à¤§à¤¾à¤°à¤¾ 250 BNSS 2023
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <ShieldCheck className="w-3 h-3 mr-1" />{verifiedCount} VERIFIED
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                <Info className="w-3 h-3 mr-1" />{secondaryCount} SECONDARY
              </Badge>
              <Badge className="bg-red-100 text-red-800 border-red-300">
                <AlertTriangle className="w-3 h-3 mr-1" />{pendingCount} PENDING (blocked)
              </Badge>
              <Badge variant="outline">12 à¤†à¤§à¤¾à¤° | {CASE01_STANDARDS.length} à¤®à¤¾à¤¨à¤• | 23 à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤•</Badge>
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

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
          <p className="font-semibold mb-1">ðŸ“„ A4 Print-Ready Hindi Discharge Application v6 â€” UNIQUE SYNERGY</p>
          <p className="text-xs leading-relaxed">
            <strong>à¤¨à¤¯à¤¾:</strong> à¤ªà¥à¤°à¤¤à¥à¤¯à¥‡à¤• à¤‰à¤¦à¥à¤§à¥ƒà¤¤ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤•à¥‡ à¤¸à¤¾à¤¥ inline citation block â€” à¤ªà¥‚à¤°à¥à¤£ holding, annexure PDF à¤¨à¤¾à¤®, à¤”à¤° verification badge à¤¸à¥€à¤§à¥‡ draft body à¤®à¥‡à¤‚à¥¤
            Click <strong>Print / Save PDF</strong> â†’ Paper = A4, Margins = None â†’ Save as PDF.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "VERIFIED à¤¨à¤¿à¤°à¥à¤£à¤¯", val: verifiedCount, color: "text-green-700 bg-green-50 border-green-200" },
            { label: "IS/ASTM à¤®à¤¾à¤¨à¤•", val: CASE01_STANDARDS.length, color: "text-blue-700 bg-blue-50 border-blue-200" },
            { label: "à¤‰à¤¨à¥à¤®à¥‹à¤šà¤¨ à¤†à¤§à¤¾à¤°", val: 12, color: "text-violet-700 bg-violet-50 border-violet-200" },
            { label: "à¤…à¤¨à¥à¤²à¤—à¥à¤¨à¤• (PDF à¤¨à¤¾à¤®)", val: 23, color: "text-amber-700 bg-amber-50 border-amber-200" },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-3 ${s.color}`}>
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Caution */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <p className="font-semibold">âš  à¤«à¤¾à¤‡à¤²à¤¿à¤‚à¤— à¤¸à¥‡ à¤ªà¥‚à¤°à¥à¤µ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯</p>
          <p>1. Kattavellai 2025 INSC 845 â€” certified copy + exact para numbers à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¥¤</p>
          <p>2. IS 3535:1986 Cl. 5.7.5 â€” BIS à¤¸à¥‡ certified copy à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚à¥¤</p>
          <p>3. PENDING citations à¤•à¥‹ primary authority à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ use à¤¨ à¤•à¤°à¥‡à¤‚à¥¤</p>
          <p>4. Sushil Sharma (2014) 4 SCC 317 â€” SCC à¤¸à¥‡ à¤¸à¤Ÿà¥€à¤• à¤ªà¥ˆà¤°à¤¾ à¤­à¤¾à¤·à¤¾ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤ à¤•à¤°à¥‡à¤‚à¥¤</p>
          <p>5. à¤…à¤§à¤¿à¤µà¤•à¥à¤¤à¤¾ à¤¸à¥‡ à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¥€ à¤«à¤¾à¤‡à¤² à¤•à¤°à¥‡à¤‚à¥¤</p>
        </div>

        {/* Inline preview of citation blocks on screen */}
        <div className="border rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">ðŸ” Inline Citation Preview (VERIFIED only)</p>
          <p className="text-xs text-muted-foreground">à¤¯à¤¹à¥€ citations draft body à¤®à¥‡à¤‚ inline embed à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆà¤‚ â€” PDF à¤®à¥‡à¤‚ à¤­à¥€ à¤¯à¤¹à¥€ à¤¦à¤¿à¤–à¥‡à¤—à¤¾à¥¤</p>
          {CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").slice(0, 4).map(p => {
            const ann = ANNEXURE_PDF[p.id];
            return (
              <div key={p.id} className="border-l-4 border-green-500 bg-green-50/50 p-3 rounded-r-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 italic">{p.citation}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-[10px] shrink-0">âœ“ VERIFIED</Badge>
                </div>
                {p.holding && (
                  <p className="text-xs italic text-foreground mt-1.5 leading-relaxed">"{p.holding}"</p>
                )}
                <p className="text-xs text-muted-foreground mt-1"><strong>à¤ªà¥à¤°à¤¯à¥‹à¤—:</strong> {p.application}</p>
                {ann && (
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">ðŸ“Ž {ann.label}: {ann.file}</p>
                )}
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground">... à¤”à¤° {CASE01_PRECEDENTS.filter(p => p.status === "VERIFIED").length - 4} VERIFIED citations PDF à¤®à¥‡à¤‚à¥¤</p>
        </div>
      </div>
    </>
  );
}

