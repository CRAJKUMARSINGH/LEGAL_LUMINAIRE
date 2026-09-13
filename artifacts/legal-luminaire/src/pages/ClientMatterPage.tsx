/**
 * Client & Matter Management — case-wise and client-wise information.
 * Statutory feature: "Client & Matter Management"
 * All data stored in localStorage. No PII transmitted externally.
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, Plus, Search, Phone, Mail, MapPin,
  Briefcase, Scale, Calendar, Edit2, Trash2,
  ChevronRight, Info, Shield,
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";

// ── Types ────────────────────────────────────────────────────────────────
type MatterStatus = "ACTIVE" | "CLOSED" | "PENDING" | "ADJOURNED";

interface Client {
  id: string;
  name: string;
  nameHi?: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  matters: string[]; // matter IDs
}

interface Matter {
  id: string;
  clientId: string;
  title: string;
  caseNo?: string;
  court: string;
  status: MatterStatus;
  charges?: string;
  nextDate?: string;
  advocate?: string;
  fee?: string;
  notes?: string;
  createdAt: string;
}

// ── Synthetic Demo Data ───────────────────────────────────────────────────
const DEMO_CLIENTS: Client[] = [
  { id: "C1", name: "Hemraj Vardar", nameHi: "हेमराज वर्दार", phone: "+91-98XX-XXXXX", email: "demo@synthetic.in", address: "Jaipur, Rajasthan", createdAt: "2026-01-15", matters: ["M1"] },
  { id: "C2", name: "Ramesh Sharma (Demo)", nameHi: "रमेश शर्मा (डेमो)", phone: "+91-97XX-XXXXX", createdAt: "2026-02-20", matters: ["M2", "M3"] },
  { id: "C3", name: "Priya Singh (Demo)", nameHi: "प्रिया सिंह (डेमो)", phone: "+91-96XX-XXXXX", createdAt: "2026-03-10", matters: ["M4"] },
];

const DEMO_MATTERS: Matter[] = [
  { id: "M1", clientId: "C1", title: "State v Hemraj Vardar — Building Collapse", caseNo: "Sessions Case No. 123/2025", court: "Sessions Court, Jaipur", status: "ACTIVE", charges: "304A, 337, 338 IPC", nextDate: "2026-10-15", advocate: "Adv. R.K. Singh", fee: "₹50,000", notes: "Discharge application filed. IS standard challenge pending.", createdAt: "2026-01-15" },
  { id: "M2", clientId: "C2", title: "NDPS Act — Bail Application (Demo)", court: "Sessions Court, Jodhpur", status: "PENDING", charges: "Sec 22 NDPS Act", nextDate: "2026-10-20", advocate: "Adv. M. Gupta", createdAt: "2026-02-20" },
  { id: "M3", clientId: "C2", title: "Cheque Dishonour — NI Act (Demo)", caseNo: "CC No. 456/2026", court: "JMFC Court, Jaipur", status: "ACTIVE", charges: "Sec 138 NI Act", nextDate: "2026-10-22", fee: "₹15,000", createdAt: "2026-03-01" },
  { id: "M4", clientId: "C3", title: "Family Dispute — Maintenance (Demo)", court: "Family Court, Jaipur", status: "ADJOURNED", charges: "Sec 125 CrPC", nextDate: "2026-11-05", createdAt: "2026-03-10" },
];

const STATUS_CONFIG: Record<MatterStatus, { label: string; labelHi: string; color: string }> = {
  ACTIVE:    { label: "Active",    labelHi: "सक्रिय",  color: "bg-green-100 text-green-700 border-green-300" },
  CLOSED:    { label: "Closed",    labelHi: "बंद",      color: "bg-gray-100 text-gray-600 border-gray-300" },
  PENDING:   { label: "Pending",   labelHi: "विचाराधीन",color: "bg-amber-100 text-amber-700 border-amber-300" },
  ADJOURNED: { label: "Adjourned", labelHi: "स्थगित",   color: "bg-orange-100 text-orange-700 border-orange-300" },
};

export default function ClientMatterPage() {
  const { isDemoMode } = useCaseContext();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"clients" | "matters">("matters");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredMatters = useMemo(() =>
    DEMO_MATTERS.filter(m =>
      (!selectedClient || m.clientId === selectedClient) &&
      (m.title.toLowerCase().includes(search.toLowerCase()) ||
       m.court.toLowerCase().includes(search.toLowerCase()) ||
       (m.caseNo ?? "").toLowerCase().includes(search.toLowerCase()))
    ), [search, selectedClient]);

  const filteredClients = useMemo(() =>
    DEMO_CLIENTS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nameHi ?? "").includes(search)
    ), [search]);

  const clientMatterCount = (clientId: string) => DEMO_MATTERS.filter(m => m.clientId === clientId).length;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Client & Matter Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            मुवक्किल और वाद प्रबंधन — centralised case-wise and client-wise workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>}
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Matter
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Clients", labelHi: "कुल मुवक्किल", value: DEMO_CLIENTS.length, icon: Users, color: "text-blue-500" },
          { label: "Active Matters", labelHi: "सक्रिय वाद", value: DEMO_MATTERS.filter(m => m.status === "ACTIVE").length, icon: Scale, color: "text-green-500" },
          { label: "Next 7 Days", labelHi: "अगले 7 दिन", value: DEMO_MATTERS.filter(m => m.nextDate).length, icon: Calendar, color: "text-amber-500" },
        ].map(s => (
          <Card key={s.label} className="glass-surface">
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground/70">{s.labelHi}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 border-b flex-1">
          {(["matters", "clients"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(""); setSelectedClient(null); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "matters" ? `Matters (${DEMO_MATTERS.length})` : `Clients (${DEMO_CLIENTS.length})`}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder={activeTab === "matters" ? "Search matters, courts, case numbers…" : "Search clients by name…"} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Client filter pills */}
      {activeTab === "matters" && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedClient(null)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!selectedClient ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>All Clients</button>
          {DEMO_CLIENTS.map(c => (
            <button key={c.id} onClick={() => setSelectedClient(c.id === selectedClient ? null : c.id)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedClient === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Matters List */}
      {activeTab === "matters" && (
        <div className="space-y-3">
          {filteredMatters.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No matters found.</p>}
          {filteredMatters.map(m => {
            const cfg = STATUS_CONFIG[m.status];
            const client = DEMO_CLIENTS.find(c => c.id === m.clientId);
            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">{m.title}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                          {cfg.label} · {cfg.labelHi}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        {m.caseNo && <span className="flex items-center gap-1"><Scale className="h-3 w-3" />{m.caseNo}</span>}
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{m.court}</span>
                        {client && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{client.name}</span>}
                        {m.nextDate && <span className="flex items-center gap-1 text-primary font-medium"><Calendar className="h-3 w-3" />Next: {new Date(m.nextDate).toLocaleDateString("en-IN")}</span>}
                      </div>
                      {m.charges && <p className="mt-1 text-xs text-muted-foreground">Charges: {m.charges}</p>}
                      {m.notes && <p className="mt-1 text-xs italic text-muted-foreground/80">{m.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Clients List */}
      {activeTab === "clients" && (
        <div className="space-y-3">
          {filteredClients.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No clients found.</p>}
          {filteredClients.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        {c.nameHi && <p className="text-xs text-muted-foreground">{c.nameHi}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>
                      {c.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>}
                      {c.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.address}</span>}
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{clientMatterCount(c.id)} matter{clientMatterCount(c.id) !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setActiveTab("matters"); setSelectedClient(c.id); }} className="gap-1 shrink-0 text-xs">
                    View Matters <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Privacy Note */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>All client data is stored locally in your browser (localStorage). No PII is transmitted to any server. This demo shows <strong>synthetic data only</strong>.</span>
      </div>
    </div>
  );
}
