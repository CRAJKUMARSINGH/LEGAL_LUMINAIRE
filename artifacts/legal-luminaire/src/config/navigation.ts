import React from "react";
import {
  Scale, BookOpen, CheckSquare,
  Home as HomeIcon, FilePlus, FileText,
  LayoutDashboard, MessageSquare, Clock, FlaskConical, Upload, Files, ShieldCheck, Globe, AlertCircle,
  FileSearch, Table2, Brain, Sparkles, Network, BarChart3, GitCompare,
} from "lucide-react";
import { featureFlags } from "@/config/featureFlags";

export type NavItem = {
  path: string;
  label: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  caseScoped: boolean;
  badge?: string;
};

export type NavGroup = { groupLabel: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "शुरुआत / Setup & Intake",
    items: [
      { path: "/",        label: "मुख्य पृष्ठ",    labelEn: "Home",            icon: HomeIcon,        caseScoped: false },
      { path: "/cases",   label: "सभी केस",         labelEn: "All Cases",       icon: Files,           caseScoped: false },
      { path: "/demo-browser", label: "26 डेमो केस", labelEn: "26 Demo Cases",  icon: Globe,           caseScoped: false, badge: "26" },
      { path: "/intake",  label: "नया केस इनटेक",   labelEn: "New Case Intake", icon: FilePlus,        caseScoped: false },
      { path: "/new-case-ingest", label: "AI केस इंजेस्ट", labelEn: "AI Case Ingest", icon: Upload,   caseScoped: false },
      { path: "/review-queue", label: "चेंबर समीक्षा", labelEn: "Review Queue", icon: FilePlus, caseScoped: false, badge: "3" },
      { path: "/improvement-lab", label: "Research Lab", labelEn: "Improvement Lab", icon: FileSearch, caseScoped: false, badge: "P2" },
    ],
  },
  {
    groupLabel: "विधिक अनुसंधान / RAG Research",
    items: [
      { path: "/case-law",    label: "कानून खोज",      labelEn: "Case Law Research",  icon: BookOpen,        caseScoped: true },
      { path: "/case-research", label: "विधिक शोध", labelEn: "Case Research", icon: FileSearch, caseScoped: true },
      { path: "/cross-reference", label: "क्रॉस-रेफ मैट्रिक्स", labelEn: "Cross-Ref Matrix", icon: Table2, caseScoped: true },
      { path: "/ai-research", label: "AI शोध इंजन", labelEn: "AI Research Engine", icon: Brain, caseScoped: true },
      { path: "/standards",   label: "मानक / Lab",     labelEn: "Forensic Standards", icon: FlaskConical,    caseScoped: true },
      { path: "/chat",        label: "AI चैट",         labelEn: "AI Chat",            icon: MessageSquare,   caseScoped: true },
      { path: "/citation-search", label: "Citation Explorer", labelEn: "25+ Authorities", icon: BookOpen, caseScoped: false, badge: "NEW" },
      { path: "/lps-home", label: "Precedent Search", labelEn: "Precedent Search", icon: FileSearch, caseScoped: false, badge: "LPS" },
      { path: "/lps-defence", label: "LPS Defence", labelEn: "LPS Defence", icon: ShieldCheck, caseScoped: false, badge: "LPS" },
      { path: "/lps-sample-analysis", label: "नमूना विश्लेषण", labelEn: "Sample Analysis", icon: FlaskConical, caseScoped: false, badge: "LPS" },
      ...(featureFlags.enableCitationGraph || featureFlags.enableCitationExtraction ? [
        { path: "/citation-graph", label: "Citation Graph", labelEn: "Citation Graph", icon: Network, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.enableCaseSimilarity || featureFlags.enableQueryUnderstanding ? [
        { path: "/case-similarity", label: "Case Similarity", labelEn: "Case Similarity", icon: GitCompare, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.enableJudgeAnalytics || featureFlags.enableCourtAnalytics ? [
        { path: "/judge-analytics", label: "Judge Analytics", labelEn: "Judge Analytics", icon: BarChart3, caseScoped: true, badge: "NEW" as const },
      ] : []),
    ],
  },
  {
    groupLabel: "विधिक प्रारूपण / Drafting Suite",
    items: [
      { path: "/ai-draft-engine", label: "AI ड्राफ्ट इंजन", labelEn: "AI Draft Engine", icon: Sparkles, caseScoped: true },
      { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App", icon: Scale,    caseScoped: true },
      { path: "/defence-reply", label: "डिफेंस रिप्लाई", labelEn: "Defence Reply",   icon: FileText,        caseScoped: true },
      { path: "/safe-draft",  label: "सेफ ड्राफ्ट",   labelEn: "Safe Draft Editor",  icon: ShieldCheck,     caseScoped: true, badge: "NEW" },
      { path: "/notice-reply", label: "नोटिस रिप्लाई", labelEn: "Notice Reply",       icon: FileText,        caseScoped: true, badge: "NEW" },
      { path: "/discharge-print", label: "डिस्चार्ज PDF", labelEn: "Discharge PDF v5",  icon: Scale,           caseScoped: true, badge: "NEW" },
      { path: "/ldr-motion", label: "Draft Motion", labelEn: "Draft Motion", icon: FilePlus, caseScoped: false, badge: "LDR" },
      { path: "/defense-brief", label: "Defense Brief", labelEn: "Defense Brief", icon: ShieldCheck, caseScoped: false, badge: "LDM" },
    ],
  },
  {
    groupLabel: "मामला समीक्षा / Case Review",
    items: [
      { path: "/dashboard",   label: "डैशबोर्ड",       labelEn: "Dashboard",          icon: LayoutDashboard, caseScoped: true },
      { path: "/verification",     label: "सत्यापन",    labelEn: "Verification",     icon: ShieldCheck, caseScoped: true },
      { path: "/filing-checklist", label: "चेकलिस्ट",  labelEn: "Filing Checklist", icon: CheckSquare, caseScoped: true },
      { path: "/timeline",         label: "टाइमलाइन",  labelEn: "Timeline",         icon: Clock,       caseScoped: true },
      { path: "/documents",        label: "दस्तावेज़",  labelEn: "Documents",        icon: Files,       caseScoped: true },
      { path: "/upload",           label: "अपलोड",      labelEn: "Upload",           icon: Upload,      caseScoped: true },
      { path: "/cross-check-report", label: "Cross Check", labelEn: "Cross Check", icon: CheckSquare, caseScoped: false, badge: "LDM" },
      { path: "/fsl-analysis", label: "FSL Analysis", labelEn: "FSL Analysis", icon: FlaskConical, caseScoped: false, badge: "LDM" },
      { path: "/ldr-home", label: "Doc Review", labelEn: "Doc Review", icon: Files, caseScoped: false, badge: "LDR" },
      { path: "/ldr-comparison", label: "Doc Compare", labelEn: "Doc Compare", icon: GitCompare, caseScoped: false, badge: "LDR" },
      ...(featureFlags.hybridStandardsValidity ? [
        { path: "/standards-validity", label: "मानक वैधता", labelEn: "Standards Validity", icon: AlertCircle, caseScoped: true, badge: "NEW" as const },
      ] : []),
      ...(featureFlags.hybridSessionWorkspace ? [
        { path: "/session-workspace", label: "कार्यस्थान", labelEn: "Hybrid Workspace", icon: LayoutDashboard, caseScoped: true, badge: "BETA" as const },
      ] : []),
    ],
  },
  {
    groupLabel: "संदर्भ / Reference & Help",
    items: [
      { path: "/forensic-faq", label: "फॉरेन्सिक FAQ", labelEn: "Forensic FAQ", icon: FlaskConical, caseScoped: false },
      { path: "/infra-arb", label: "इन्फ्रा आर्बिट्रेशन", labelEn: "Infra Arbitration", icon: Scale, caseScoped: false, badge: "NEW" },
      { path: "/standards-index", label: "Standards Index", labelEn: "Standards Index", icon: BookOpen, caseScoped: false, badge: "LDM" },
    ],
  },
];
