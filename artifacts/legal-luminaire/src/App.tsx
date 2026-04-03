import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DischargeApplication from "@/pages/DischargeApplication";
import CaseResearch from "@/pages/CaseResearch";
import CrossReferenceMatrix from "@/pages/CrossReferenceMatrix";
import FilingChecklist from "@/pages/FilingChecklist";
import OralArguments from "@/pages/OralArguments";
import StandardsValidity from "@/pages/StandardsValidity";
import CaseIntakeAssistant from "@/pages/CaseIntakeAssistant";
import AIResearchEngine from "@/pages/AIResearchEngine";
import AIDraftEngine from "@/pages/AIDraftEngine";
import DefenceReply from "@/pages/DefenceReply";
import VerificationPanel from "@/pages/VerificationPanel";
import SessionWorkspace from "@/pages/session-workspace";
import DraftViewer from "@/pages/draft-viewer";
// New views from update
import { DynamicDashboardView } from "@/components/views/DynamicDashboardView";
import { CaseSelector } from "@/components/case-selector";
import { CaseLawView } from "@/components/views/CaseLawView";
import { StandardsView } from "@/components/views/StandardsView";
import { TimelineView } from "@/components/views/TimelineView";
import { DocumentsView } from "@/components/views/DocumentsView";
import { UploadView } from "@/components/views/UploadView";
import { ChatView } from "@/components/views/ChatView";
import {
  Scale, BookOpen, Table2, CheckSquare, Mic,
  Home as HomeIcon, Menu, FilePlus, Zap, X, Bot, FileText,
  LayoutDashboard, MessageSquare, Clock, FlaskConical, Upload, Files, ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { AccuracyProvider } from "@/context/AccuracyContext";

const queryClient = new QueryClient();

// ── Grouped nav — replaces flat 19-item list ─────────────────────────────
type NavItem = {
  path: string; label: string; labelEn: string;
  icon: React.ComponentType<{ className?: string }>; caseScoped: boolean;
};
type NavGroup = { groupLabel: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "शुरुआत / Setup",
    items: [
      { path: "/",        label: "मुख्य पृष्ठ",    labelEn: "Home",            icon: HomeIcon,        caseScoped: false },
      { path: "/cases",   label: "सभी केस",         labelEn: "All Cases",       icon: Files,           caseScoped: false },
      { path: "/intake",  label: "नया केस इंटेक",   labelEn: "New Case Intake", icon: FilePlus,        caseScoped: false },
      { path: "/dashboard", label: "डैशबोर्ड",      labelEn: "Case Dashboard",  icon: LayoutDashboard, caseScoped: true },
    ],
  },
  {
    groupLabel: "AI शोध / Research",
    items: [
      { path: "/ai-research", label: "AI रिसर्च",     labelEn: "AI Research",    icon: Zap,           caseScoped: true },
      { path: "/case-research", label: "विधिक शोध",   labelEn: "Legal Research", icon: BookOpen,      caseScoped: true },
      { path: "/case-law",    label: "केस लॉ",        labelEn: "Case Law Matrix", icon: BookOpen,     caseScoped: true },
      { path: "/standards",   label: "मानक मैट्रिक्स", labelEn: "Standards",    icon: FlaskConical,  caseScoped: true },
      { path: "/cross-reference", label: "क्रॉस-रेफरेंस", labelEn: "Cross Ref", icon: Table2,        caseScoped: true },
    ],
  },
  {
    groupLabel: "AI ड्राफ्टिंग / Drafting",
    items: [
      { path: "/ai-draft",    label: "AI ड्राफ्ट",    labelEn: "AI Draft Engine", icon: Bot,          caseScoped: true },
      { path: "/chat",        label: "AI चैट",         labelEn: "AI Chat",         icon: MessageSquare, caseScoped: true },
      { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App", icon: Scale, caseScoped: true },
      { path: "/defence-reply", label: "डिफेंस रिप्लाई", labelEn: "Defence Reply", icon: FileText,   caseScoped: true },
      { path: "/oral-arguments", label: "मौखिक तर्क", labelEn: "Oral Arguments",  icon: Mic,          caseScoped: true },
    ],
  },
  {
    groupLabel: "समीक्षा / Review",
    items: [
      { path: "/verification",    label: "सत्यापन",       labelEn: "Verification",    icon: ShieldCheck, caseScoped: true },
      { path: "/filing-checklist", label: "चेकलिस्ट",    labelEn: "Filing Checklist", icon: CheckSquare, caseScoped: true },
      { path: "/timeline",        label: "टाइमलाइन",     labelEn: "Timeline",         icon: Clock,       caseScoped: true },
      { path: "/documents",       label: "दस्तावेज़",     labelEn: "Documents",        icon: Files,       caseScoped: true },
      { path: "/upload",          label: "अपलोड",         labelEn: "Upload",           icon: Upload,      caseScoped: true },
    ],
  },
];

// Flat list kept for route matching only
const navItems: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { cases, selectedCase, selectedCaseId, setSelectedCaseId } = useCaseContext();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-sidebar text-sidebar-foreground transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
          w-72 flex flex-col shadow-xl`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-sidebar-foreground">Legal Luminaire</h1>
                <p className="text-xs text-sidebar-accent-foreground opacity-80">अधिवक्ता शोध मंच</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Case selector */}
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-60 mb-2">
              Active Case
            </p>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground text-xs rounded-md px-2 py-2 border border-sidebar-border"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.groupLabel} className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-50 mb-1 px-2">
                {group.groupLabel}
              </p>
              {group.items.map((item) => {
                const href = item.caseScoped
                  ? `/case/${selectedCaseId}${item.path}`
                  : item.path;
                const isActive =
                  location === item.path ||
                  location === href ||
                  (item.path !== "/" && location.endsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="leading-tight">{item.label}</div>
                      <div className="text-[10px] opacity-60">{item.labelEn}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <p className="text-xs text-sidebar-accent-foreground opacity-80 leading-relaxed">
              {selectedCase.caseNo || "Case"}
            </p>
            <p className="text-xs font-semibold text-sidebar-primary mt-1 truncate">
              {selectedCase.title}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const currentNav = navItems.find(
    (n) => n.path !== "/" && location.endsWith(n.path)
  ) || navItems.find((n) => n.path === location);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {currentNav?.label || "Legal Luminaire"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {currentNav?.labelEn || "Advocate Research Platform"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium">
              AI-Assisted · Fact-Fit Enforced
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Global routes */}
        <Route path="/" component={Home} />
        <Route path="/cases" component={() => <div className="p-6"><CaseSelector /></div>} />
        <Route path="/intake" component={CaseIntakeAssistant} />

        {/* Legacy flat routes (Case 01 default) */}
        <Route path="/discharge-application" component={DischargeApplication} />
        <Route path="/case-research" component={CaseResearch} />
        <Route path="/cross-reference" component={CrossReferenceMatrix} />
        <Route path="/oral-arguments" component={OralArguments} />
        <Route path="/standards-validity" component={StandardsValidity} />
        <Route path="/filing-checklist" component={FilingChecklist} />
        <Route path="/ai-research" component={AIResearchEngine} />
        <Route path="/ai-draft" component={AIDraftEngine} />
        <Route path="/defence-reply" component={DefenceReply} />
        <Route path="/verification" component={VerificationPanel} />

        {/* New view routes */}
        <Route path="/dashboard" component={() => <div className="p-6"><DynamicDashboardView /></div>} />
        <Route path="/chat" component={() => <div className="flex flex-col h-full"><ChatView /></div>} />
        <Route path="/case-law" component={() => <div className="p-0"><CaseLawView /></div>} />
        <Route path="/standards" component={() => <div className="p-0"><StandardsView /></div>} />
        <Route path="/timeline" component={() => <div className="p-0"><TimelineView /></div>} />
        <Route path="/documents" component={() => <div className="p-0"><DocumentsView /></div>} />
        <Route path="/upload" component={() => <div className="p-0"><UploadView /></div>} />

        {/* Session-based routes from Legal-Luminaire-Update */}
        <Route path="/sessions/:id" component={SessionWorkspace} />
        <Route path="/drafts/:id" component={DraftViewer} />

        {/* Dynamic case-scoped routes */}
        <Route path="/case/:caseId/intake" component={CaseIntakeAssistant} />
        <Route path="/case/:caseId/ai-draft" component={AIDraftEngine} />
        <Route path="/case/:caseId/ai-research" component={AIResearchEngine} />
        <Route path="/case/:caseId/discharge-application" component={DischargeApplication} />
        <Route path="/case/:caseId/case-research" component={CaseResearch} />
        <Route path="/case/:caseId/cross-reference" component={CrossReferenceMatrix} />
        <Route path="/case/:caseId/oral-arguments" component={OralArguments} />
        <Route path="/case/:caseId/standards-validity" component={StandardsValidity} />
        <Route path="/case/:caseId/filing-checklist" component={FilingChecklist} />
        <Route path="/case/:caseId/defence-reply" component={DefenceReply} />
        <Route path="/case/:caseId/verification" component={VerificationPanel} />
        <Route path="/case/:caseId/dashboard" component={() => <div className="p-6"><DynamicDashboardView /></div>} />
        <Route path="/case/:caseId/chat" component={() => <div className="flex flex-col h-full"><ChatView /></div>} />
        <Route path="/case/:caseId/case-law" component={() => <div className="p-0"><CaseLawView /></div>} />
        <Route path="/case/:caseId/standards" component={() => <div className="p-0"><StandardsView /></div>} />
        <Route path="/case/:caseId/timeline" component={() => <div className="p-0"><TimelineView /></div>} />
        <Route path="/case/:caseId/documents" component={() => <div className="p-0"><DocumentsView /></div>} />
        <Route path="/case/:caseId/upload" component={() => <div className="p-0"><UploadView /></div>} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccuracyProvider>
          <CaseProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </CaseProvider>
        </AccuracyProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
