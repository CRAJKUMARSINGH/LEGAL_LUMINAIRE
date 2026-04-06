import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Scale, BookOpen, CheckSquare, Mic,
  Home as HomeIcon, Menu, FilePlus, X, FileText,
  LayoutDashboard, MessageSquare, Clock, FlaskConical, Upload, Files, ShieldCheck, Globe,
} from "lucide-react";
import { useState } from "react";
import { CaseProvider, useCaseContext } from "@/context/CaseContext";
import { AccuracyProvider } from "@/context/AccuracyContext";

// Lazy load components for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const DischargeApplication = lazy(() => import("@/pages/DischargeApplication"));
const CaseResearch = lazy(() => import("@/pages/CaseResearch"));
const CrossReferenceMatrix = lazy(() => import("@/pages/CrossReferenceMatrix"));
const FilingChecklist = lazy(() => import("@/pages/FilingChecklist"));
const OralArguments = lazy(() => import("@/pages/OralArguments"));
const StandardsValidity = lazy(() => import("@/pages/StandardsValidity"));
const CaseIntakeAssistant = lazy(() => import("@/pages/CaseIntakeAssistant"));
const AIResearchEngine = lazy(() => import("@/pages/AIResearchEngine"));
const AIDraftEngine = lazy(() => import("@/pages/AIDraftEngine"));
const DefenceReply = lazy(() => import("@/pages/DefenceReply"));
const VerificationPanel = lazy(() => import("@/pages/VerificationPanel"));
const SessionWorkspace = lazy(() => import("@/pages/session-workspace"));
const DraftViewer = lazy(() => import("@/pages/draft-viewer"));
const ForensicFAQ = lazy(() => import("@/pages/ForensicFAQ"));
const SafeDraftPage = lazy(() => import("@/pages/SafeDraftPage"));
const NoticeReplyPage = lazy(() => import("@/pages/NoticeReplyPage"));

// Lazy load heavy view components
const DynamicDashboardView = lazy(() => import("@/components/views/DynamicDashboardView").then(module => ({ default: module.DynamicDashboardView })));
const CaseSelector = lazy(() => import("@/components/case-selector").then(module => ({ default: module.CaseSelector })));
const CaseLawView = lazy(() => import("@/components/views/CaseLawView").then(module => ({ default: module.CaseLawView })));
const StandardsView = lazy(() => import("@/components/views/StandardsView").then(module => ({ default: module.StandardsView })));
const TimelineView = lazy(() => import("@/components/views/TimelineView").then(module => ({ default: module.TimelineView })));
const DocumentsView = lazy(() => import("@/components/views/DocumentsView").then(module => ({ default: module.DocumentsView })));
const UploadView = lazy(() => import("@/components/views/UploadView").then(module => ({ default: module.UploadView })));
const ChatView = lazy(() => import("@/components/views/ChatView").then(module => ({ default: module.ChatView })));
const OmniDropzone = lazy(() => import("@/components/views/OmniDropzone").then(module => ({ default: module.OmniDropzone })));
const DraftingView = lazy(() => import("@/components/views/DraftingView").then(module => ({ default: module.DraftingView })));
const ReviewQueueView = lazy(() => import("@/components/views/ReviewQueueView").then(module => ({ default: module.ReviewQueueView })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

type NavItem = {
  path: string;
  label: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  caseScoped: boolean;
  badge?: string;
};
type NavGroup = { groupLabel: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "शुरुआत / Setup",
    items: [
      { path: "/",        label: "मुख्य पृष्ठ",    labelEn: "Home",            icon: HomeIcon,        caseScoped: false },
      { path: "/cases",   label: "सभी केस",         labelEn: "All Cases",       icon: Files,           caseScoped: false },
      { path: "/intake",  label: "नया केस इंटेक",   labelEn: "New Case Intake", icon: FilePlus,        caseScoped: false },
      { path: "/new-case-ingest", label: "AI केस इंजेस्ट", labelEn: "AI Case Ingest", icon: Upload,   caseScoped: false },
    ],
  },
  {
    groupLabel: "कार्यस्थान / Case Workspace",
    items: [
      { path: "/dashboard",   label: "डैशबोर्ड",       labelEn: "Dashboard",          icon: LayoutDashboard, caseScoped: true },
      { path: "/case-law",    label: "कानून खोज",      labelEn: "Case Law Research",  icon: BookOpen,        caseScoped: true },
      { path: "/standards",   label: "मानक / Lab",     labelEn: "Forensic Standards", icon: FlaskConical,    caseScoped: true },
      { path: "/chat",        label: "AI चैट",         labelEn: "AI Chat",            icon: MessageSquare,   caseScoped: true },
      { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App", icon: Scale,    caseScoped: true },
      { path: "/defence-reply", label: "डिफेंस रिप्लाई", labelEn: "Defence Reply",   icon: FileText,        caseScoped: true },
      { path: "/safe-draft",  label: "सेफ ड्राफ्ट",   labelEn: "Safe Draft Editor",  icon: ShieldCheck,     caseScoped: true, badge: "NEW" },
      { path: "/notice-reply", label: "नोटिस रिप्लाई", labelEn: "Notice Reply",       icon: FileText,        caseScoped: true, badge: "NEW" },
      { path: "/oral-arguments", label: "मौखिक तर्क", labelEn: "Oral Arguments",     icon: Mic,             caseScoped: true },
    ],
  },
  {
    groupLabel: "समीक्षा / Review",
    items: [
      { path: "/verification",     label: "सत्यापन",    labelEn: "Verification",     icon: ShieldCheck, caseScoped: true },
      { path: "/filing-checklist", label: "चेकलिस्ट",  labelEn: "Filing Checklist", icon: CheckSquare, caseScoped: true },
      { path: "/timeline",         label: "टाइमलाइन",  labelEn: "Timeline",         icon: Clock,       caseScoped: true },
      { path: "/documents",        label: "दस्तावेज़",  labelEn: "Documents",        icon: Files,       caseScoped: true },
      { path: "/upload",           label: "अपलोड",      labelEn: "Upload",           icon: Upload,      caseScoped: true },
    ],
  },
  {
    groupLabel: "सीनियर रिव्यू / Senior Review",
    items: [
      { path: "/review-queue", label: "चेंबर रिव्यू", labelEn: "Review Queue", icon: FilePlus, caseScoped: false, badge: "3" },
    ],
  },
  {
    groupLabel: "संदर्भ / Reference",
    items: [
      { path: "/forensic-faq", label: "फोरेंसिक FAQ", labelEn: "Forensic FAQ", icon: FlaskConical, caseScoped: false },
    ],
  },
];

const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [location] = useLocation();
  const { selectedCase, selectedCaseId, setSelectedCaseId, cases } = useCaseContext();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 h-full z-40 bg-sidebar text-sidebar-foreground transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto w-72 flex flex-col shadow-xl`}>
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg leading-tight text-sidebar-foreground">Legal Luminaire</h1>
                  <span className="bg-primary/20 text-primary text-[8px] font-black px-1 rounded border border-primary/30 uppercase tracking-tighter">Pro</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-sidebar-accent-foreground opacity-80">अधिवक्ता शोध मंच</p>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1 rounded border border-emerald-500/30 font-bold tracking-tighter animate-pulse">BETA</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-60 mb-2">Active Case</p>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground text-xs rounded-md px-2 py-2 border border-sidebar-border"
            >
              {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.groupLabel} className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-accent-foreground opacity-40 mb-2 px-2">
                {group.groupLabel}
              </p>
              {group.items.map((item) => {
                const active = item.caseScoped
                  ? location === `/case/${selectedCase.id}${item.path}`
                  : location === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.caseScoped ? `/case/${selectedCase.id}${item.path}` : item.path}>
                    <button className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                      <div className="flex items-center gap-2 text-left">
                        <Icon className={`w-4 h-4 ${active ? "" : "opacity-70"}`} />
                        <div className="flex flex-col leading-tight">
                          <span className="text-[11px]">{item.label}</span>
                          <span className="text-[9px] opacity-70">{item.labelEn}</span>
                        </div>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm ${item.badge === "NEW" ? "bg-emerald-500 text-white" : "bg-red-500 text-white animate-pulse"}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <p className="text-xs text-sidebar-accent-foreground opacity-80 leading-relaxed truncate">{selectedCase.caseNo || "Case"}</p>
            <p className="text-xs font-semibold text-sidebar-primary mt-1 truncate">{selectedCase.title}</p>
            <div className="mt-2 flex items-center gap-1.5 opacity-60">
              <Globe className="w-3 h-3 text-sidebar-accent-foreground" />
              <span className="text-[9px] font-bold tracking-widest text-sidebar-accent-foreground uppercase">Jurisdiction Aware</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { selectedCase } = useCaseContext();

  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const currentNav = allItems.find(n => n.path !== "/" && (location.endsWith(n.path) || location === `/case/${selectedCase.id}${n.path}`)) || allItems.find(n => n.path === "/");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{currentNav?.label || "Legal Luminaire"}</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">{currentNav?.labelEn || "Advocate Research Platform"}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:inline text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg">
              NATIONAL BETA 2026
            </span>
            <span className="hidden md:inline text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-bold">
              Professional Edition
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  const { selectedCase } = useCaseContext();
  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Suspense fallback={<LoadingFallback />}><Home /></Suspense>} />
        <Route path="/cases" component={() => <div className="p-6"><Suspense fallback={<LoadingFallback />}><CaseSelector /></Suspense></div>} />
        <Route path="/intake" component={() => <Suspense fallback={<LoadingFallback />}><CaseIntakeAssistant /></Suspense>} />
        <Route path="/new-case-ingest" component={() => <Suspense fallback={<LoadingFallback />}><OmniDropzone /></Suspense>} />
        <Route path="/review-queue" component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><ReviewQueueView /></Suspense></div>} />
        <Route path="/forensic-faq" component={() => <Suspense fallback={<LoadingFallback />}><ForensicFAQ /></Suspense>} />

        {/* Case-scoped routes */}
        <Route path="/case/:id/dashboard"             component={() => <div className="p-6"><Suspense fallback={<LoadingFallback />}><DynamicDashboardView /></Suspense></div>} />
        <Route path="/case/:id/chat"                  component={() => <div className="flex flex-col h-full"><Suspense fallback={<LoadingFallback />}><ChatView /></Suspense></div>} />
        <Route path="/case/:id/case-law"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><CaseLawView /></Suspense></div>} />
        <Route path="/case/:id/standards"             component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><StandardsView /></Suspense></div>} />
        <Route path="/case/:id/timeline"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><TimelineView /></Suspense></div>} />
        <Route path="/case/:id/documents"             component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><DocumentsView /></Suspense></div>} />
        <Route path="/case/:id/upload"                component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><UploadView /></Suspense></div>} />
        <Route path="/case/:id/drafting"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><DraftingView /></Suspense></div>} />
        <Route path="/case/:id/safe-draft"            component={() => <Suspense fallback={<LoadingFallback />}><SafeDraftPage /></Suspense>} />
        <Route path="/case/:id/notice-reply"          component={() => <Suspense fallback={<LoadingFallback />}><NoticeReplyPage /></Suspense>} />
        <Route path="/case/:id/verification"          component={() => <Suspense fallback={<LoadingFallback />}><VerificationPanel /></Suspense>} />
        <Route path="/case/:id/filing-checklist"      component={() => <Suspense fallback={<LoadingFallback />}><FilingChecklist /></Suspense>} />
        <Route path="/case/:id/discharge-application" component={() => <Suspense fallback={<LoadingFallback />}><DischargeApplication /></Suspense>} />
        <Route path="/case/:id/defence-reply"         component={() => <Suspense fallback={<LoadingFallback />}><DefenceReply /></Suspense>} />
        <Route path="/case/:id/oral-arguments"        component={() => <Suspense fallback={<LoadingFallback />}><OralArguments /></Suspense>} />

        <Route component={() => <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccuracyProvider>
        <CaseProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </CaseProvider>
      </AccuracyProvider>
    </QueryClientProvider>
  );
}
