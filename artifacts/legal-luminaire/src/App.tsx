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
import { DashboardView } from "@/components/views/DashboardView";
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

const queryClient = new QueryClient();

const navItems = [
  { path: "/", label: "मुख्य पृष्ठ", labelEn: "Home", icon: HomeIcon, caseScoped: false },
  { path: "/intake", label: "नया केस इंटेक", labelEn: "New Case Intake", icon: FilePlus, caseScoped: false },
  { path: "/dashboard", label: "डैशबोर्ड", labelEn: "Case Dashboard", icon: LayoutDashboard, caseScoped: true },
  { path: "/ai-draft", label: "AI ड्राफ्ट इंजन", labelEn: "AI Draft Engine", icon: Bot, caseScoped: true },
  { path: "/ai-research", label: "AI रिसर्च इंजन", labelEn: "AI Research Engine", icon: Zap, caseScoped: true },
  { path: "/chat", label: "AI ड्राफ्टर चैट", labelEn: "AI Drafter Chat", icon: MessageSquare, caseScoped: true },
  { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App", icon: Scale, caseScoped: true },
  { path: "/defence-reply", label: "डिफेंस रिप्लाई v3", labelEn: "Defence Reply Final", icon: FileText, caseScoped: true },
  { path: "/case-research", label: "विधिक शोध", labelEn: "Legal Research", icon: BookOpen, caseScoped: true },
  { path: "/case-law", label: "केस लॉ मैट्रिक्स", labelEn: "Case Law Matrix", icon: BookOpen, caseScoped: true },
  { path: "/standards", label: "मानक मैट्रिक्स", labelEn: "Standards Matrix", icon: FlaskConical, caseScoped: true },
  { path: "/timeline", label: "केस टाइमलाइन", labelEn: "Case Timeline", icon: Clock, caseScoped: true },
  { path: "/cross-reference", label: "क्रॉस-रेफरेंस", labelEn: "Cross Reference", icon: Table2, caseScoped: true },
  { path: "/oral-arguments", label: "मौखिक तर्क", labelEn: "Oral Arguments", icon: Mic, caseScoped: true },
  { path: "/standards-validity", label: "मानक वैधता नोट", labelEn: "Standards Note", icon: Scale, caseScoped: true },
  { path: "/documents", label: "दस्तावेज़", labelEn: "Documents", icon: Files, caseScoped: true },
  { path: "/upload", label: "फाइल अपलोड", labelEn: "Upload Files", icon: Upload, caseScoped: true },
  { path: "/filing-checklist", label: "फाइलिंग चेकलिस्ट", labelEn: "Filing Checklist", icon: CheckSquare, caseScoped: true },
  { path: "/verification", label: "सत्यापन पैनल", labelEn: "Verification Panel", icon: ShieldCheck, caseScoped: true },
];

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

          <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-60 mb-3 px-2">
            मेनू
          </p>

          {navItems.map((item) => {
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70">{item.labelEn}</div>
                </div>
              </Link>
            );
          })}
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
        <Route path="/dashboard" component={() => <div className="p-6"><DashboardView /></div>} />
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
        <Route path="/case/:caseId/dashboard" component={() => <div className="p-6"><DashboardView /></div>} />
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
        <CaseProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </CaseProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
