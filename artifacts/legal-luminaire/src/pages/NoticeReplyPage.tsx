/**
 * NoticeReplyPage — Versatile construction contract notice reply viewer.
 * Works for any case type: show-cause, termination, payment dispute, etc.
 * Pre-loaded with Pitambara Peeth / Roopam Construction case data.
 * Designed to be reusable for future notice-reply cases.
 */
import { useState, useRef } from "react";
import {
  Printer, Download, Copy, CheckCircle2, AlertTriangle,
  Clock, ChevronDown, ChevronUp, FileText, Scale, IndianRupee,
  ShieldAlert, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CASE04_META,
  CASE04_GROUNDS,
  CASE04_PRECEDENTS,
  CASE04_DEMANDS,
  CASE04_ENCLOSURES,
} from "@/data/stub-cases/case04-peetambara";

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

const REPLY_TEXT = `REPLY TO LEGAL NOTICE
M/s Roopam Construction → Pitambara Peeth Trust
Date: ${CASE04_META.dateOfReply}

To,
The Secretary / Authorized Signatory,
${CASE04_META.opponent},
Rajasthan.

Through Registered Post / Speed Post with Acknowledgement Due

Subject: Reply to your Legal Notice — Construction Contract

Sir/Madam,

We, ${CASE04_META.client}, hereby tender this formal reply to your legal notice.
We strongly deny and refute each and every allegation as false, frivolous, and contrary to facts.

${CASE04_GROUNDS.map((g, i) => `${i + 1}. ${g.title}\n${g.description}\nLegal Basis: ${g.legalBasis}`).join("\n\n")}

DEMANDS:
${CASE04_DEMANDS.map((d, i) => `${i + 1}. ${d}`).join("\n")}

ENCLOSURES:
${CASE04_ENCLOSURES.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Without prejudice to all rights and remedies.

For ${CASE04_META.client}
Date: ${CASE04_META.dateOfReply}`;

export default function NoticeReplyPage() {
  const [openGrounds, setOpenGrounds] = useState<Record<number, boolean>>({ 1: true, 4: true });
  const [openPrec, setOpenPrec] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggle = <T extends string | number>(
    set: React.Dispatch<React.SetStateAction<Record<T, boolean>>>,
    id: T
  ) => set((p) => ({ ...p, [id]: !p[id] }));

  const handleCopy = () => {
    navigator.clipboard.writeText(REPLY_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([REPLY_TEXT], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "NOTICE_REPLY_ROOPAM_PITAMBARA.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5" ref={printRef}>

      {/* Header */}
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
            <Download className="w-3.5 h-3.5" />Download
          </Button>
          <Button size="sm" onClick={() => window.print()} className="gap-1.5">
            <Printer className="w-3.5 h-3.5" />Print / PDF
          </Button>
        </div>
      </div>

      {/* Case summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Contractor</p>
            <p className="text-sm font-semibold">{CASE04_META.client}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Client / Trust</p>
            <p className="text-sm font-semibold">{CASE04_META.opponent}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Payment</p>
              <p className="text-sm font-bold text-red-700">{CASE04_META.pendingPayment}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key dates timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Key Dates — Employer's Default Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 items-center text-xs">
            {[
              { label: "Contract Start", date: CASE04_META.contractStartDate, color: "bg-green-100 text-green-800" },
              { label: "→ 10 months delay →", date: "", color: "bg-red-100 text-red-700 font-bold" },
              { label: "Drawings Supplied", date: CASE04_META.drawingsSuppliedDate, color: "bg-amber-100 text-amber-800" },
              { label: "Mishap", date: CASE04_META.mishapDate, color: "bg-red-100 text-red-800" },
              { label: "Work Stopped by Trust", date: "19.11.2025+", color: "bg-red-100 text-red-800" },
              { label: "Revised Drawings", date: "NOT YET SUPPLIED", color: "bg-red-200 text-red-900 font-bold" },
            ].map((item, i) => (
              <span key={i} className={`px-2 py-1 rounded-md ${item.color}`}>
                {item.label}{item.date ? `: ${item.date}` : ""}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grounds of reply */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Grounds of Reply ({CASE04_GROUNDS.length} Grounds)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 divide-y divide-border">
          {CASE04_GROUNDS.map((g) => (
            <div key={g.id}>
              <button
                onClick={() => toggle(setOpenGrounds, g.id)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-muted/30 px-1 rounded no-print"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                    {g.id}
                  </span>
                  <span className="text-sm font-medium truncate">{g.title}</span>
                  <VBadge s={g.status} />
                </div>
                {openGrounds[g.id]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openGrounds[g.id] && (
                <div className="pb-4 px-1 space-y-2">
                  <p className="text-sm text-foreground/80 leading-relaxed">{g.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      ⚖ {g.legalBasis}
                    </span>
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded border">
                      📌 {g.note}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Precedents */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-600" />
            Supporting Precedents
            <Badge variant="secondary" className="text-xs ml-auto">All SECONDARY — verify before filing</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 divide-y divide-border">
          {CASE04_PRECEDENTS.map((p) => (
            <div key={p.id}>
              <button
                onClick={() => toggle(setOpenPrec, p.id)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-muted/30 px-1 rounded no-print"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <VBadge s={p.status} />
                  <span className="text-sm font-medium truncate">{p.case}</span>
                </div>
                {openPrec[p.id]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openPrec[p.id] && (
                <div className="pb-4 px-1 space-y-2">
                  <p className="text-xs text-muted-foreground">{p.court}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{p.useForDefence}</p>
                  <p className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200">
                    ⚠ {p.statusNote}
                  </p>
                  <p className="text-xs text-muted-foreground">Action: {p.action}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Demands */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            Demands & Prayers ({CASE04_DEMANDS.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {CASE04_DEMANDS.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-foreground/80">{d}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enclosures */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Enclosures ({CASE04_ENCLOSURES.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ol className="space-y-1">
            {CASE04_ENCLOSURES.map((e, i) => (
              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                {e}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 no-print space-y-1">
        <p className="font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          Pre-Dispatch Checklist
        </p>
        <p>1. Insert actual notice date, project name, and Trust address before dispatch.</p>
        <p>2. Verify all precedent citations on SCC Online — obtain verbatim holdings.</p>
        <p>3. Attach all enclosures listed above.</p>
        <p>4. Send via Registered Post / Speed Post with Acknowledgement Due.</p>
        <p>5. Keep proof of dispatch for potential arbitration/court proceedings.</p>
        <p>6. Consult advocate before dispatch — this is a pre-litigation document.</p>
      </div>
    </div>
  );
}
