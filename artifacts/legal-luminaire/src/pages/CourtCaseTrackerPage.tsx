/**
 * Court & Case Tracking — eCourts status, hearings, orders, next dates.
 * Statutory feature: "Court & Case Tracking"
 * All data is synthetic/demo — no live eCourts API calls.
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gavel, Calendar, Clock, Search, RefreshCw,
  CheckCircle2, AlertTriangle, Info, ExternalLink,
  FileText, MapPin, User, Scale,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";

// ── Types ────────────────────────────────────────────────────────────────
type HearingStatus = "LISTED" | "ADJOURNED" | "DISPOSED" | "RESERVED" | "PART_HEARD";
type OrderType = "INTERIM" | "FINAL" | "PROCEDURAL" | "BAIL";

interface Hearing {
  id: string;
  date: string;
  court: string;
  judge: string;
  purpose: string;
  status: HearingStatus;
  orderSummary?: string;
  nextDate?: string;
}

interface CourtOrder {
  id: string;
  date: string;
  type: OrderType;
  summary: string;
  judge: string;
  verified: boolean;
}

// ── Synthetic Demo Data ───────────────────────────────────────────────────
const DEMO_HEARINGS: Hearing[] = [
  { id: "H1", date: "2026-10-15", court: "Sessions Court, Jaipur", judge: "Sh. R.K. Sharma", purpose: "Arguments on Discharge Application", status: "LISTED", nextDate: "2026-10-15" },
  { id: "H2", date: "2026-09-01", court: "Sessions Court, Jaipur", judge: "Sh. R.K. Sharma", purpose: "Filing of Written Submissions", status: "ADJOURNED", orderSummary: "Matter adjourned at the request of defence. Next date fixed.", nextDate: "2026-10-15" },
  { id: "H3", date: "2026-08-10", court: "Sessions Court, Jaipur", judge: "Sh. R.K. Sharma", purpose: "Examination of Prosecution Witness", status: "PART_HEARD", orderSummary: "PW-3 (FSL Expert) partly examined. Cross-examination on IS standard pending." },
  { id: "H4", date: "2026-07-22", court: "Sessions Court, Jaipur", judge: "Sh. R.K. Sharma", purpose: "Charge Framing", status: "DISPOSED", orderSummary: "Charges framed u/s 304A, 337, 338 IPC. Accused pleaded not guilty." },
  { id: "H5", date: "2026-06-05", court: "Sessions Court, Jaipur", judge: "Sh. P.L. Verma", purpose: "Bail Application", status: "DISPOSED", orderSummary: "Bail granted with sureties. Passport deposited." },
];

const DEMO_ORDERS: CourtOrder[] = [
  { id: "O1", date: "2026-09-01", type: "PROCEDURAL", summary: "Matter adjourned to 15.10.2026. Defence to file written arguments on IS standard applicability.", judge: "Sh. R.K. Sharma", verified: true },
  { id: "O2", date: "2026-07-22", type: "PROCEDURAL", summary: "Charges framed u/s 304A, 337, 338 IPC read with Section 14 of Factories Act.", judge: "Sh. R.K. Sharma", verified: true },
  { id: "O3", date: "2026-06-05", type: "BAIL", summary: "Bail granted. Surety of ₹50,000 each from two sureties. Passport deposited with Registry.", judge: "Sh. P.L. Verma", verified: true },
  { id: "O4", date: "2026-05-12", type: "INTERIM", summary: "Interim stay on FSL report pending re-examination by court-appointed expert.", judge: "Sh. P.L. Verma", verified: false },
];

// ── Status Badge Config ───────────────────────────────────────────────────
const HEARING_STATUS_CONFIG: Record<HearingStatus, { label: string; labelHi: string; color: string }> = {
  LISTED:     { label: "Listed",      labelHi: "सूचीबद्ध",   color: "bg-blue-100 text-blue-700 border-blue-300" },
  ADJOURNED:  { label: "Adjourned",   labelHi: "स्थगित",      color: "bg-amber-100 text-amber-700 border-amber-300" },
  DISPOSED:   { label: "Disposed",    labelHi: "निपटाया गया", color: "bg-green-100 text-green-700 border-green-300" },
  RESERVED:   { label: "Reserved",    labelHi: "सुरक्षित",    color: "bg-violet-100 text-violet-700 border-violet-300" },
  PART_HEARD: { label: "Part Heard",  labelHi: "आंशिक सुनवाई",color: "bg-orange-100 text-orange-700 border-orange-300" },
};

const ORDER_TYPE_CONFIG: Record<OrderType, { label: string; color: string }> = {
  INTERIM:    { label: "Interim",     color: "bg-amber-100 text-amber-700" },
  FINAL:      { label: "Final",       color: "bg-green-100 text-green-700" },
  PROCEDURAL: { label: "Procedural",  color: "bg-blue-100 text-blue-700" },
  BAIL:       { label: "Bail",        color: "bg-violet-100 text-violet-700" },
};

export default function CourtCaseTrackerPage() {
  const { selectedCase, isDemoMode } = useCaseContext();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "info">("hearings");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const filteredHearings = useMemo(() =>
    DEMO_HEARINGS.filter(h =>
      h.purpose.toLowerCase().includes(search.toLowerCase()) ||
      h.court.toLowerCase().includes(search.toLowerCase()) ||
      h.judge.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const nextHearing = DEMO_HEARINGS.find(h => h.status === "LISTED");

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            Court & Case Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            न्यायालय और वाद अनुसरण — eCourts status, hearings, orders, next dates
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>}
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Case Info Bar */}
      {selectedCase && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-medium"><Scale className="h-4 w-4 text-primary" />{selectedCase.title.replace(/^\[DEMO\]\s*/, "")}</span>
          {selectedCase.caseNo && <span className="flex items-center gap-1.5 text-muted-foreground"><FileText className="h-3.5 w-3.5" />{selectedCase.caseNo}</span>}
          {selectedCase.court && <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{selectedCase.court}</span>}
        </div>
      )}

      {/* Next Hearing Alert */}
      {nextHearing && (
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4 flex items-start gap-3">
          <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">Next Hearing — {new Date(nextHearing.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p className="text-sm text-blue-700 mt-0.5">{nextHearing.purpose} · {nextHearing.court}</p>
            <p className="text-xs text-blue-600 mt-1">Before: {nextHearing.judge}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
        {(["hearings", "orders", "info"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "hearings" ? "Hearing History" : tab === "orders" ? "Court Orders" : "Case Info"}
          </button>
        ))}
      </div>

      {/* Search */}
      {activeTab !== "info" && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search hearings, judges, courts…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* Hearings Tab */}
      {activeTab === "hearings" && (
        <div className="space-y-3">
          {filteredHearings.map(h => {
            const cfg = HEARING_STATUS_CONFIG[h.status];
            return (
              <Card key={h.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{h.purpose}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                          {cfg.label} · {cfg.labelHi}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(h.date).toLocaleDateString("en-IN")}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.court}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{h.judge}</span>
                      </div>
                      {h.orderSummary && (
                        <p className="mt-2 text-xs text-foreground/80 bg-muted/50 rounded p-2 border-l-2 border-primary/40">{h.orderSummary}</p>
                      )}
                    </div>
                    {h.nextDate && h.status !== "DISPOSED" && (
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">Next Date</p>
                        <p className="text-sm font-semibold text-primary">{new Date(h.nextDate).toLocaleDateString("en-IN")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {DEMO_ORDERS.map(o => {
            const cfg = ORDER_TYPE_CONFIG[o.type];
            return (
              <Card key={o.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                        {o.verified
                          ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" />Verified</span>
                          : <span className="flex items-center gap-1 text-xs text-amber-600"><AlertTriangle className="h-3 w-3" />Needs Verification</span>
                        }
                      </div>
                      <p className="mt-2 text-sm leading-relaxed">{o.summary}</p>
                      <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" />Before: {o.judge}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 shrink-0 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" /> View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Case Info Tab */}
      {activeTab === "info" && selectedCase && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Case Title", labelHi: "वाद का नाम", value: selectedCase.title.replace(/^\[DEMO\]\s*/, "") },
            { label: "Case Number", labelHi: "वाद संख्या", value: selectedCase.caseNo ?? "—" },
            { label: "Court", labelHi: "न्यायालय", value: selectedCase.court ?? "—" },
            { label: "Status", labelHi: "स्थिति", value: selectedCase.status ?? "Pending" },
            { label: "Total Hearings", labelHi: "कुल सुनवाई", value: String(DEMO_HEARINGS.length) },
            { label: "Orders Passed", labelHi: "आदेश पारित", value: String(DEMO_ORDERS.length) },
          ].map(item => (
            <div key={item.label} className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">{item.label} · {item.labelHi}</p>
              <p className="mt-1 font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>All hearing and order data shown is <strong>SYNTHETIC / DEMO</strong>. No live eCourts API connection is made. Real deployment requires integration with eCourts India Case Status API.</span>
      </div>
    </div>
  );
}
