import React, { Suspense, lazy, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { featureFlags } from "@/config/featureFlags";
import { Layout } from "@/components/layout/Layout";
import type { LpsRoute } from "@/types";

// Lazy load components for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const DischargeApplication = lazy(() => import("@/pages/DischargeApplication"));
const CaseResearch = lazy(() => import("@/pages/CaseResearch"));
const CrossReferenceMatrix = lazy(() => import("@/pages/CrossReferenceMatrix"));
const FilingChecklist = lazy(() => import("@/pages/FilingChecklist"));
const OralArguments = lazy(() => import("@/pages/OralArguments"));
const CaseIntakeAssistant = lazy(() => import("@/pages/CaseIntakeAssistant"));
const AIResearchEngine = lazy(() => import("@/pages/AIResearchEngine"));
const AIDraftEngine = lazy(() => import("@/pages/AIDraftEngine"));
const DefenceReply = lazy(() => import("@/pages/DefenceReply"));
const VerificationPanel = lazy(() => import("@/pages/VerificationPanel"));
const ForensicFAQ = lazy(() => import("@/pages/ForensicFAQ"));
const SafeDraftPage = lazy(() => import("@/pages/SafeDraftPage"));
const NoticeReplyPage = lazy(() => import("@/pages/NoticeReplyPage"));
const DischargeApplicationPrint = lazy(() => import("@/pages/DischargeApplicationPrint"));
const InfraArbBrowser = lazy(() => import("@/pages/InfraArbBrowser"));
const DemoCaseBrowser = lazy(() => import("@/pages/DemoCaseBrowser"));
const StandardsValidity = lazy(() => import("@/pages/StandardsValidity"));
const SessionWorkspace = lazy(() => import("@/pages/session-workspace"));
const DraftViewer = lazy(() => import("@/pages/draft-viewer"));

// Phase 3-6 Intelligence Pages
const CitationGraphPage = lazy(() => import("@/pages/CitationGraphPage"));
const CaseSimilarityPage = lazy(() => import("@/pages/CaseSimilarityPage"));
const JudgeAnalyticsPage = lazy(() => import("@/pages/JudgeAnalyticsPage"));

// Citation-Explorer merge
const CitationSearchPage = lazy(() => import("@/pages/CitationSearchPage"));
const CitationAuthorityPage = lazy(() => import("@/pages/CitationAuthorityPage"));

// Defense Master Pages
const CrossCheckReport = lazy(() => import("@/pages/CrossCheckReport"));
const DefenseBrief = lazy(() => import("@/pages/DefenseBrief"));
const FslAnalysis = lazy(() => import("@/pages/FslAnalysis"));
const StandardsIndex = lazy(() => import("@/pages/StandardsIndex"));

// Document Review Pages
const LDR_ComparisonPage = lazy(() => import("@/pages/LDR_ComparisonPage"));
const LDR_HomePage = lazy(() => import("@/pages/LDR_HomePage"));
const LDR_MotionPage = lazy(() => import("@/pages/LDR_MotionPage"));
const LDR_PacketPage = lazy(() => import("@/pages/LDR_PacketPage"));
const LDR_PrecedentsPage = lazy(() => import("@/pages/LDR_PrecedentsPage"));
const LDR_PrintPage = lazy(() => import("@/pages/LDR_PrintPage"));
const LDR_ReplyPage = lazy(() => import("@/pages/LDR_ReplyPage"));
const LDR_StandardsPage = lazy(() => import("@/pages/LDR_StandardsPage"));
const LDR_TimelinePage = lazy(() => import("@/pages/LDR_TimelinePage"));
const LDR_VerificationPage = lazy(() => import("@/pages/LDR_VerificationPage"));

// Precedent Search Pages
const LPS_DefencePage = lazy(() => import("@/pages/LPS_DefencePage"));
const LPS_HomePage = lazy(() => import("@/pages/LPS_HomePage"));
const LPS_PrecedentsPage = lazy(() => import("@/pages/LPS_PrecedentsPage"));
const LPS_PrintLetterPage = lazy(() => import("@/pages/LPS_PrintLetterPage"));
const LPS_SampleAnalysisPage = lazy(() => import("@/pages/LPS_SampleAnalysisPage"));
const LPS_StandardsPage = lazy(() => import("@/pages/LPS_StandardsPage"));

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
const ResearchImprovementView = lazy(() => import("@/components/views/ResearchImprovementView").then(module => ({ default: module.ResearchImprovementView })));

// Loading fallback component
const LoadingFallback = (): React.JSX.Element => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function Router() {
  const { selectedCase } = useCaseContext();
  const [, setLocation] = useLocation();
  const [ldrLang, setLdrLang] = useState<"en" | "hi" | "both">("both");

  const handleLpsNavigate = (route: string) => {
    // Narrow to the known LPS routes — unknown values are silently ignored
    const lpsRoute = route as LpsRoute;
    if (lpsRoute === "defence")    setLocation("/lps-defence");
    else if (lpsRoute === "analysis")   setLocation("/lps-sample-analysis");
    else if (lpsRoute === "precedents") setLocation("/lps-precedents");
    else if (lpsRoute === "standards")  setLocation("/lps-standards");
    else if (lpsRoute === "print")      setLocation("/lps-print");
  };

  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Suspense fallback={<LoadingFallback />}><Home /></Suspense>} />
        <Route path="/cases" component={() => <div className="p-6"><Suspense fallback={<LoadingFallback />}><CaseSelector /></Suspense></div>} />
        <Route path="/intake" component={() => <Suspense fallback={<LoadingFallback />}><CaseIntakeAssistant /></Suspense>} />
        <Route path="/new-case-ingest" component={() => <Suspense fallback={<LoadingFallback />}><OmniDropzone /></Suspense>} />
        <Route path="/review-queue" component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><ReviewQueueView /></Suspense></div>} />
        <Route path="/improvement-lab" component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><ResearchImprovementView /></Suspense></div>} />
        <Route path="/forensic-faq" component={() => <Suspense fallback={<LoadingFallback />}><ForensicFAQ /></Suspense>} />
        <Route path="/infra-arb" component={() => <Suspense fallback={<LoadingFallback />}><InfraArbBrowser /></Suspense>} />
        <Route path="/demo-browser" component={() => <Suspense fallback={<LoadingFallback />}><DemoCaseBrowser /></Suspense>} />
        <Route path="/citation-search" component={() => <Suspense fallback={<LoadingFallback />}><CitationSearchPage /></Suspense>} />
        <Route path="/authority/:id" component={() => <Suspense fallback={<LoadingFallback />}><CitationAuthorityPage /></Suspense>} />

        {/* Defense Master Routes */}
        <Route path="/cross-check-report" component={() => <Suspense fallback={<LoadingFallback />}><CrossCheckReport /></Suspense>} />
        <Route path="/defense-brief" component={() => <Suspense fallback={<LoadingFallback />}><DefenseBrief /></Suspense>} />
        <Route path="/fsl-analysis" component={() => <Suspense fallback={<LoadingFallback />}><FslAnalysis /></Suspense>} />
        <Route path="/standards-index" component={() => <Suspense fallback={<LoadingFallback />}><StandardsIndex /></Suspense>} />

        {/* Document Review Routes */}
        <Route path="/ldr-home" component={() => <Suspense fallback={<LoadingFallback />}><LDR_HomePage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-comparison" component={() => <Suspense fallback={<LoadingFallback />}><LDR_ComparisonPage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-motion" component={() => <Suspense fallback={<LoadingFallback />}><LDR_MotionPage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-packet" component={() => <Suspense fallback={<LoadingFallback />}><LDR_PacketPage packetId="A" lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-precedents" component={() => <Suspense fallback={<LoadingFallback />}><LDR_PrecedentsPage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-print" component={() => <Suspense fallback={<LoadingFallback />}><LDR_PrintPage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-reply" component={() => <Suspense fallback={<LoadingFallback />}><LDR_ReplyPage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-standards" component={() => <Suspense fallback={<LoadingFallback />}><LDR_StandardsPage /></Suspense>} />
        <Route path="/ldr-timeline" component={() => <Suspense fallback={<LoadingFallback />}><LDR_TimelinePage lang={ldrLang} /></Suspense>} />
        <Route path="/ldr-verification" component={() => <Suspense fallback={<LoadingFallback />}><LDR_VerificationPage /></Suspense>} />

        {/* Precedent Search Routes */}
        <Route path="/lps-home" component={() => <Suspense fallback={<LoadingFallback />}><LPS_HomePage onNavigate={handleLpsNavigate} /></Suspense>} />
        <Route path="/lps-defence" component={() => <Suspense fallback={<LoadingFallback />}><LPS_DefencePage /></Suspense>} />
        <Route path="/lps-precedents" component={() => <Suspense fallback={<LoadingFallback />}><LPS_PrecedentsPage /></Suspense>} />
        <Route path="/lps-print" component={() => <Suspense fallback={<LoadingFallback />}><LPS_PrintLetterPage /></Suspense>} />
        <Route path="/lps-sample-analysis" component={() => <Suspense fallback={<LoadingFallback />}><LPS_SampleAnalysisPage /></Suspense>} />
        <Route path="/lps-standards" component={() => <Suspense fallback={<LoadingFallback />}><LPS_StandardsPage /></Suspense>} />

        {/* Case-scoped routes */}
        <Route path="/case/:id/dashboard"             component={() => <div className="p-6"><Suspense fallback={<LoadingFallback />}><DynamicDashboardView /></Suspense></div>} />
        <Route path="/case/:id/chat"                  component={() => <div className="flex flex-col h-full"><Suspense fallback={<LoadingFallback />}><ChatView /></Suspense></div>} />
        <Route path="/case/:id/case-law"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><CaseLawView /></Suspense></div>} />
        <Route path="/case/:id/case-research"         component={() => <Suspense fallback={<LoadingFallback />}><CaseResearch /></Suspense>} />
        <Route path="/case/:id/cross-reference"       component={() => <Suspense fallback={<LoadingFallback />}><CrossReferenceMatrix /></Suspense>} />
        <Route path="/case/:id/ai-research"           component={() => <Suspense fallback={<LoadingFallback />}><AIResearchEngine /></Suspense>} />
        <Route path="/case/:id/ai-draft-engine"       component={() => <Suspense fallback={<LoadingFallback />}><AIDraftEngine /></Suspense>} />
        <Route path="/case/:id/standards"             component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><StandardsView /></Suspense></div>} />
        <Route path="/case/:id/timeline"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><TimelineView /></Suspense></div>} />
        <Route path="/case/:id/documents"             component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><DocumentsView /></Suspense></div>} />
        <Route path="/case/:id/upload"                component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><UploadView /></Suspense></div>} />
        <Route path="/case/:id/drafting"              component={() => <div className="p-0"><Suspense fallback={<LoadingFallback />}><DraftingView /></Suspense></div>} />
        <Route path="/case/:id/safe-draft"            component={() => <Suspense fallback={<LoadingFallback />}><SafeDraftPage /></Suspense>} />
        <Route path="/case/:id/notice-reply"          component={() => <Suspense fallback={<LoadingFallback />}><NoticeReplyPage /></Suspense>} />
        <Route path="/case/:id/discharge-print"       component={() => <Suspense fallback={<LoadingFallback />}><DischargeApplicationPrint /></Suspense>} />
        <Route path="/case/:id/verification"          component={() => <Suspense fallback={<LoadingFallback />}><VerificationPanel /></Suspense>} />
        <Route path="/case/:id/filing-checklist"      component={() => <Suspense fallback={<LoadingFallback />}><FilingChecklist /></Suspense>} />
        <Route path="/case/:id/discharge-application" component={() => <Suspense fallback={<LoadingFallback />}><DischargeApplication /></Suspense>} />
        <Route path="/case/:id/defence-reply"         component={() => <Suspense fallback={<LoadingFallback />}><DefenceReply /></Suspense>} />
        <Route path="/case/:id/oral-arguments"        component={() => <Suspense fallback={<LoadingFallback />}><OralArguments /></Suspense>} />
        {featureFlags.hybridStandardsValidity && (
          <Route path="/case/:id/standards-validity"  component={() => <Suspense fallback={<LoadingFallback />}><StandardsValidity /></Suspense>} />
        )}
        {featureFlags.hybridSessionWorkspace && (
          <Route path="/case/:id/session-workspace"   component={() => <Suspense fallback={<LoadingFallback />}><SessionWorkspace /></Suspense>} />
        )}
        {featureFlags.hybridDraftViewer && (
          <Route path="/draft/:id"                    component={() => <Suspense fallback={<LoadingFallback />}><DraftViewer /></Suspense>} />
        )}
        {(featureFlags.enableCitationGraph || featureFlags.enableCitationExtraction) && (
          <Route path="/case/:id/citation-graph"    component={() => <Suspense fallback={<LoadingFallback />}><CitationGraphPage /></Suspense>} />
        )}
        {(featureFlags.enableCaseSimilarity || featureFlags.enableQueryUnderstanding) && (
          <Route path="/case/:id/case-similarity"   component={() => <Suspense fallback={<LoadingFallback />}><CaseSimilarityPage /></Suspense>} />
        )}
        {(featureFlags.enableJudgeAnalytics || featureFlags.enableCourtAnalytics) && (
          <Route path="/case/:id/judge-analytics"   component={() => <Suspense fallback={<LoadingFallback />}><JudgeAnalyticsPage /></Suspense>} />
        )}
        <Route component={() => <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
      </Switch>
    </Layout>
  );
}
