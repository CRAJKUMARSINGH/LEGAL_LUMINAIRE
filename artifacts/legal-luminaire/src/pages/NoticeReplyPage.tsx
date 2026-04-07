/**
 * NoticeReplyPage — A4 print-ready professional notice reply letter.
 * Screen: interactive collapsible view. Print: clean A4 letter, 15mm margins.
 */
import { useState } from "react";
import {
  Printer, Download, Copy, CheckCircle2, AlertTriangle,
  Clock, ChevronDown, ChevronUp, FileText, Scale, IndianRupee, ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CASE04_META, CASE04_GROUNDS, CASE04_PRECEDENTS,
  CASE04_DEMANDS, CASE04_ENCLOSURES,
} from "@/data/stub-cases/case04-peetambara";

/* ── Print CSS injected into <head> on mount ─────────────────────────────── */
const PRINT_STYLE = `
@media print {
  @page { size: A4; margin: 15mm; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; background: #fff; }
  .no-print { display: none !important; }
  .print-letter { display: block !important; }
  .screen-only { display: none !important; }
  .page-break { page-break-before: always; }
  a { color: #000; text-decoration: none; }
}
@media screen {
  .print-letter { display: none; }
}
`;

function injectPrintStyle() {
  if (document.getElementById("notice-reply-print-style")) return;
  const s = document.createElement("style");
  s.id = "notice-reply-print-style";
  s.textContent = PRINT_STYLE;
  document.head.appendChild(s);
}

/* ── Plain-text version for copy/download ───────────────────────────────── */
const PLAIN_TEXT = [
  "REPLY TO LEGAL NOTICE",
  "─".repeat(60),
  `Date: ${CASE04_META.dateOfReply}`,
  "",
  "To,",
  "The Secretary / Authorized Signatory,",
  `${CASE04_META.opponent},`,
  "Rajasthan.",
  "",
  "Through: Registered Post / Speed Post with Acknowledgement Due",
  "",
  "Subject: Reply to Legal Notice — Construction Contract",
  "─".repeat(60),
  "",
  `Sir/Madam,`,
  "",
  `We, ${CASE04_META.client}, hereby tender this formal reply to your legal notice.`,
  `We strongly deny and refute each and every allegation as false, frivolous, and contrary to facts.`,
  "",
  ...CASE04_GROUNDS.flatMap((g, i) => [
    `${i + 1}. ${g.title.toUpperCase()}`,
    g.description,
    `   Legal Basis: ${g.legalBasis}`,
    "",
  ]),
  "DEMANDS:",
  ...CASE04_DEMANDS.map((d, i) => `${i + 1}. ${d}`),
  "",
  "ENCLOSURES:",
  ...CASE04_ENCLOSURES.map((e, i) => `${i + 1}. ${e}`),
  "",
  "Without prejudice to all rights and remedies available in law and equity.",
  "",
  `For ${CASE04_META.client}`,
  "",
  "Authorized Signatory / Partner",
  `Date: ${CASE04_META.dateOfReply}`,
].join("\n");

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
      <Icon className="w-3 h-3" />{s}
    </span>
  );
}

export default function NoticeReplyPage() {
  injectPrintStyle();
  const [openGrounds, setOpenGrounds] = useState<Record<number, boolean>>({ 1: true, 4: true });
  const [openPrec, setOpenPrec] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggle = <T extends string | number>(
    set: React.Dispatch<React.SetStateAction<Record<T, boolean>>>, id: T
  ) => set((p) => ({ ...p, [id]: !p[id] }));

  const handleCopy = () => {
    navigator.clipboard.writeText(PLAIN_TEXT).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([PLAIN_TEXT], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "NOTICE_REPLY_ROOPAM_PITAMBARA.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          PRINT LETTER — A4, 15mm margins, Times New Roman, professional
          Hidden on screen, shown only when printing
      ══════════════════════════════════════════════════════════════════ */}
      <div className="print-letter" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "11pt", lineHeight: "1.6", color: "#000" }}>

        {/* Letterhead */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "8pt", marginBottom: "16pt" }}>
          <div style={{ fontSize: "14pt", fontWeight: "bold", letterSpacing: "1px" }}>M/S ROOPAM CONSTRUCTION</div>
          <div style={{ fontSize: "9pt", marginTop: "2pt" }}>[Address] | [City, State, PIN] | [Phone] | [Email]</div>
        </div>

        {/* Date & Dispatch */}
        <div style={{ marginBottom: "12pt" }}>
          <div style={{ float: "right" }}>Date: <strong>{CASE04_META.dateOfReply}</strong></div>
          <div style={{ clear: "both" }} />
          <div style={{ marginTop: "4pt", fontSize: "9pt", fontStyle: "italic" }}>
            Through: Registered Post / Speed Post with Acknowledgement Due
          </div>
        </div>

        {/* Addressee */}
        <div style={{ marginBottom: "16pt" }}>
          <div>To,</div>
          <div>The Secretary / Authorized Signatory,</div>
          <div><strong>{CASE04_META.opponent},</strong></div>
          <div>[Full Address of Trust],</div>
          <div>Rajasthan.</div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: "16pt" }}>
          <strong>Subject: Reply to your Legal Notice dated [Date of Notice] — Construction Contract — Project: [Project Name/Site]</strong>
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: "12pt" }}>Sir/Madam,</div>

        {/* Opening */}
        <div style={{ marginBottom: "12pt", textAlign: "justify" }}>
          We, <strong>{CASE04_META.client}</strong> (hereinafter "the Contractor"), through our undersigned authorized representative, hereby tender this formal reply to the legal notice issued by your Trust (hereinafter "the Trust") dated [Date of Notice], received by us on [Date of Receipt].
        </div>
        <div style={{ marginBottom: "16pt", textAlign: "justify" }}>
          At the outset, we <strong>strongly deny and refute</strong> each and every allegation, claim, and insinuation made in the said notice as being false, frivolous, misconceived, and contrary to the actual facts and the terms of the contract. The notice appears to be a deliberate attempt to shift the Trust's own contractual failures onto our firm.
        </div>

        {/* Preliminary Objection */}
        <div style={{ marginBottom: "8pt" }}>
          <strong style={{ textDecoration: "underline" }}>PRELIMINARY OBJECTION</strong>
        </div>
        <div style={{ marginBottom: "16pt", textAlign: "justify" }}>
          <strong>1. Notice is Premature, Misconceived, and Mala Fide.</strong> The Trust itself is in continuous breach of its primary contractual obligations and cannot take shelter behind a legal notice to cover its own defaults. The notice is therefore liable to be withdrawn forthwith.
        </div>

        {/* Point-wise Reply heading */}
        <div style={{ marginBottom: "8pt" }}>
          <strong style={{ textDecoration: "underline" }}>POINT-WISE REPLY</strong>
        </div>

        {/* Ground 1 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>2. Regarding Delay in Supply of Approved Drawings — Primary Breach by the Trust.</strong>
          <br />It is a matter of undisputed record that:
          <ul style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li>The scheduled date of commencement of work was <strong>01.05.2024</strong>.</li>
            <li>The approved architectural/structural drawings were supplied by the Trust only on <strong>22.02.2025</strong> — a delay of approximately <strong>10 (ten) months</strong>.</li>
            <li>Two-thirds of the originally scheduled project period was consumed by the Trust's own failure to provide mandatory approved drawings.</li>
          </ul>
          <br />Supply of approved drawings is a <em>condition precedent</em> to structural work. The Trust's failure constitutes a <strong>primary breach</strong> of its contractual obligations.
        </div>

        {/* Ground 2 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>3. Regarding Compliance with Technical and Statutory Requirements.</strong>
          <br />We categorically deny the allegation of non-compliance. Our firm has at all times maintained:
          <ul style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li>Qualified technical/field engineering staff at the project site;</li>
            <li>An operational field testing laboratory;</li>
            <li>Third-party quality assurance arrangements; and</li>
            <li>Workman insurance — <em>as evidenced by the insurance documents enclosed herewith.</em></li>
          </ul>
          <br />The progress of the project to its current stage is itself conclusive proof that all statutory and contractual compliances were in place.
        </div>

        {/* Ground 3 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>4. Regarding the Incident of 19.11.2025 — Biased and Unilateral Assessment.</strong>
          <br />We strongly object to the Trust's characterization of the incident of <strong>19.11.2025</strong> as attributable to the absence of a field engineer:
          <ul style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li>The cause of the mishap has <strong>not been independently or expertly investigated</strong>. No formal inquiry by a qualified structural/forensic expert has been conducted.</li>
            <li>The Trust's assessment is <strong>unilateral, biased, and without any technical basis</strong>.</li>
            <li>After the mishap, the Trust itself <strong>instructed our firm to stop all work</strong> pending supply of revised drawings — which have <strong>not been provided to date</strong>.</li>
          </ul>
          <br />The Trust cannot, on one hand, instruct stoppage of work pending revised drawings and, on the other hand, allege breach of contract for non-completion.
        </div>

        {/* Ground 4 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>5. Regarding Breach of Contract — Principle of Reciprocal Promises.</strong>
          <br />We draw the Trust's attention to the settled legal position under the <strong>Indian Contract Act, 1872</strong>:
          <ul style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li><strong>Section 51</strong> — The promisor need not perform unless the other party is ready and willing to perform its reciprocal promise.</li>
            <li><strong>Section 53</strong> — When a party prevents the other from performing, the contract becomes voidable at the option of the party so prevented.</li>
            <li><strong>Section 55</strong> — A party failing to perform within the agreed time is liable for compensation for the resulting delay.</li>
          </ul>
          <br />By withholding drawings for 10 months and failing to supply revised drawings post-mishap, the Trust has: (a) prevented our firm from performing; (b) committed a continuous breach; and (c) rendered the original completion schedule impossible.
          <br /><br /><strong>We have not breached the contract. It is the Trust that has breached the contract, and the breach is ongoing.</strong>
        </div>

        {/* Ground 5 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>6. Regarding Time Extension — Formal Demand.</strong>
          <br />Our firm is entitled to and hereby formally demands a <strong>provisional time extension</strong> commensurate with:
          <ul style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li>The 10-month delay in supply of original approved drawings; and</li>
            <li>The period of work stoppage from 19.11.2025 onwards due to non-supply of revised drawings.</li>
          </ul>
          <br />Unless and until the revised drawings are supplied and a formal time extension is granted, no penalty, liquidated damages, or adverse action shall be maintainable against our firm for the period of delay attributable to the Trust.
        </div>

        {/* Ground 6 — Payment */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>7. Regarding Pending Bills and Payments.</strong>
          <br />The Trust has failed to release legitimate dues. The following amounts are outstanding and hereby formally demanded:
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8pt", fontSize: "10pt" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #000" }}>
                <th style={{ textAlign: "left", padding: "4pt 6pt" }}>S.No.</th>
                <th style={{ textAlign: "left", padding: "4pt 6pt" }}>Description</th>
                <th style={{ textAlign: "right", padding: "4pt 6pt" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "4pt 6pt" }}>1.</td>
                <td style={{ padding: "4pt 6pt" }}>Bill for work executed since last running bill</td>
                <td style={{ padding: "4pt 6pt", textAlign: "right" }}>Rs. 24,00,000/-</td>
              </tr>
              <tr>
                <td style={{ padding: "4pt 6pt" }}>2.</td>
                <td style={{ padding: "4pt 6pt" }}>Architectural consultancy fee for revised drawings (Rs. 7,50,000/- + 18% GST)</td>
                <td style={{ padding: "4pt 6pt", textAlign: "right" }}>Rs. 8,85,000/-</td>
              </tr>
              <tr style={{ borderTop: "1px solid #000", fontWeight: "bold" }}>
                <td colSpan={2} style={{ padding: "4pt 6pt", textAlign: "right" }}>Total</td>
                <td style={{ padding: "4pt 6pt", textAlign: "right" }}>Rs. 32,85,000/-</td>
              </tr>
            </tbody>
          </table>
          <br />The Trust is hereby called upon to release the above payments within <strong>15 (fifteen) days</strong> of receipt of this reply, failing which our firm shall initiate appropriate legal proceedings for recovery with interest @ 18% p.a.
        </div>

        {/* Ground 7 */}
        <div style={{ marginBottom: "14pt", textAlign: "justify" }}>
          <strong>8. Regarding Quantities Beyond Schedule in Revised Drawings.</strong>
          <br />If the revised drawings (when eventually supplied) contain quantities beyond the original schedule of quantities, the same shall be executed by our firm at <strong>revised rates</strong> as per the terms of the contract. Market rates for construction materials and labour have escalated significantly, and our firm shall not be bound by the original rates for any additional quantities.
        </div>

        {/* Ground 8 */}
        <div style={{ marginBottom: "16pt", textAlign: "justify" }}>
          <strong>9. Regarding Threatened Illegal Action — Claim for Liquidated Damages.</strong>
          <br />Any illegal, coercive, or unilateral action by the Trust — including but not limited to encashment of bank guarantee, forfeiture of security deposit, blacklisting, or termination of contract — shall be <strong>wholly unjustified and actionable</strong>. Our firm shall be entitled to recover liquidated damages and compensation for any loss caused by such illegal action. Our firm reserves all rights to approach the appropriate court/arbitral tribunal for relief.
        </div>

        {/* Demands */}
        <div style={{ marginBottom: "8pt" }}>
          <strong style={{ textDecoration: "underline" }}>DEMANDS AND PRAYERS</strong>
        </div>
        <div style={{ marginBottom: "16pt", textAlign: "justify" }}>
          In view of the foregoing, we call upon the Trust to:
          <ol style={{ marginTop: "6pt", paddingLeft: "20pt" }}>
            <li><strong>Withdraw</strong> the impugned legal notice forthwith.</li>
            <li><strong>Supply the revised approved drawings</strong> immediately to enable resumption of work.</li>
            <li><strong>Grant a formal time extension</strong> for the period of delay caused by the Trust's own defaults.</li>
            <li><strong>Release the pending payment</strong> of <strong>Rs. 32,85,000/-</strong> (Rupees Thirty-Two Lakhs Eighty-Five Thousand only) within 15 days.</li>
            <li><strong>Refrain from any illegal action</strong> against our firm, its bank guarantee, security deposit, or reputation.</li>
            <li><strong>Acknowledge</strong> that the breach of contract, if any, is on the part of the Trust and not our firm.</li>
          </ol>
          <br />Failure to comply within <strong>15 (fifteen) days</strong> shall leave our firm with no option but to initiate appropriate legal proceedings before the competent court/arbitral forum, including claims for recovery of dues with interest, compensation for loss of business and reputation, and liquidated damages for the Trust's breach.
        </div>

        {/* Enclosures */}
        <div style={{ marginBottom: "8pt" }}>
          <strong>Enclosures:</strong>
        </div>
        <ol style={{ marginBottom: "20pt", paddingLeft: "20pt", fontSize: "10pt" }}>
          {CASE04_ENCLOSURES.map((e, i) => <li key={i} style={{ marginBottom: "3pt" }}>{e}</li>)}
        </ol>

        {/* Without prejudice */}
        <div style={{ marginBottom: "24pt", fontStyle: "italic", fontSize: "9pt" }}>
          Without prejudice to all rights and remedies available to our firm in law and equity.
        </div>

        {/* Signature block */}
        <div style={{ marginTop: "32pt" }}>
          <div>Yours faithfully,</div>
          <div style={{ marginTop: "48pt" }}>
            <div style={{ borderTop: "1px solid #000", width: "200pt", marginBottom: "4pt" }} />
            <div><strong>For M/s Roopam Construction</strong></div>
            <div>Authorized Signatory / Partner</div>
            <div style={{ marginTop: "8pt" }}>Date: {CASE04_META.dateOfReply}</div>
            <div>Place: _________________, Rajasthan</div>
          </div>
        </div>

        {/* Counsel note */}
        <div style={{ marginTop: "24pt", fontSize: "8pt", fontStyle: "italic", borderTop: "1px solid #ccc", paddingTop: "6pt", color: "#555" }}>
          Note: Insert actual notice date, project name, Trust address, and firm address before dispatch. Verify all precedent citations before filing in any court. Consult advocate before dispatch.
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SCREEN VIEW — Interactive collapsible UI (hidden when printing)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="screen-only max-w-4xl mx-auto p-4 sm:p-6 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 no-print">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notice Reply — Construction Contract
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{CASE04_META.title}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">{CASE04_META.status}</Badge>
              <Badge variant="outline" className="text-xs">{CASE04_META.caseType}</Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
              <Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />Download .txt
            </Button>
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary">
              <Printer className="w-3.5 h-3.5" />Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Contractor</p>
            <p className="text-sm font-semibold">{CASE04_META.client}</p>
          </div>
          <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Client / Trust</p>
            <p className="text-sm font-semibold">{CASE04_META.opponent}</p>
          </div>
          <div className="border border-red-200 bg-red-50/50 rounded-xl p-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Payment</p>
              <p className="text-sm font-bold text-red-700">{CASE04_META.pendingPayment}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />Key Dates — Employer's Default Timeline
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: "Contract Start", date: CASE04_META.contractStartDate, color: "bg-green-100 text-green-800" },
              { label: "→ 10 months delay →", date: "", color: "bg-red-100 text-red-700 font-bold" },
              { label: "Drawings Supplied", date: CASE04_META.drawingsSuppliedDate, color: "bg-amber-100 text-amber-800" },
              { label: "Mishap", date: CASE04_META.mishapDate, color: "bg-red-100 text-red-800" },
              { label: "Work Stopped", date: "19.11.2025+", color: "bg-red-100 text-red-800" },
              { label: "Revised Drawings", date: "NOT YET SUPPLIED", color: "bg-red-200 text-red-900 font-bold" },
            ].map((item, i) => (
              <span key={i} className={`px-2 py-1 rounded-md ${item.color}`}>
                {item.label}{item.date ? `: ${item.date}` : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Grounds */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b border-border">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              Grounds of Reply ({CASE04_GROUNDS.length} Grounds)
            </p>
          </div>
          <div className="divide-y divide-border">
            {CASE04_GROUNDS.map((g) => (
              <div key={g.id}>
                <button
                  onClick={() => toggle(setOpenGrounds, g.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">{g.id}</span>
                    <span className="text-sm font-medium truncate">{g.title}</span>
                    <VBadge s={g.status} />
                  </div>
                  {openGrounds[g.id] ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {openGrounds[g.id] && (
                  <div className="px-4 pb-4 space-y-2">
                    <p className="text-sm text-foreground/80 leading-relaxed">{g.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">⚖ {g.legalBasis}</span>
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded border">📌 {g.note}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Precedents */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />Supporting Precedents
            </p>
            <Badge variant="secondary" className="text-xs">SECONDARY — verify before filing</Badge>
          </div>
          <div className="divide-y divide-border">
            {CASE04_PRECEDENTS.map((p) => (
              <div key={p.id}>
                <button
                  onClick={() => toggle(setOpenPrec, p.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <VBadge s={p.status} />
                    <span className="text-sm font-medium truncate">{p.case}</span>
                  </div>
                  {openPrec[p.id] ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {openPrec[p.id] && (
                  <div className="px-4 pb-4 space-y-2">
                    <p className="text-xs text-muted-foreground">{p.court}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{p.useForDefence}</p>
                    <p className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200">⚠ {p.statusNote}</p>
                    <p className="text-xs text-muted-foreground">Action: {p.action}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demands */}
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm font-semibold mb-3">Demands & Prayers</p>
          <ol className="space-y-2">
            {CASE04_DEMANDS.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-foreground/80">{d}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Enclosures */}
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm font-semibold mb-3">Enclosures ({CASE04_ENCLOSURES.length})</p>
          <ol className="space-y-1">
            {CASE04_ENCLOSURES.map((e, i) => (
              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-muted-foreground shrink-0">{i + 1}.</span>{e}
              </li>
            ))}
          </ol>
        </div>

        {/* Pre-dispatch checklist */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <p className="font-semibold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" />Pre-Dispatch Checklist</p>
          <p>1. Insert actual notice date, project name, and Trust address before dispatch.</p>
          <p>2. Verify all precedent citations on SCC Online — obtain verbatim holdings.</p>
          <p>3. Attach all enclosures listed above.</p>
          <p>4. Send via Registered Post / Speed Post with Acknowledgement Due.</p>
          <p>5. Keep proof of dispatch for potential arbitration/court proceedings.</p>
          <p>6. Consult advocate before dispatch — this is a pre-litigation document.</p>
        </div>
      </div>
    </>
  );
}
