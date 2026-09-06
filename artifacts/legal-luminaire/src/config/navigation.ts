import React from "react";
import {
  Scale, BookOpen, CheckSquare,
  Home as HomeIcon, FilePlus, FileText,
  LayoutDashboard, MessageSquare, Clock, FlaskConical, Upload, Files, ShieldCheck, Globe,
  FileSearch, Table2, Brain, Sparkles,
} from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  caseScoped: boolean;
  badge?: string;
};

export type NavGroupId = "setup" | "research" | "drafting" | "review";

export type NavGroup = {
  id: NavGroupId;
  groupLabel: string;
  groupLabelEn: string;
  /** Always visible. Keep to ≤ 5 per group. */
  items: NavItem[];
  /** Behind a "More tools" disclosure — progressive disclosure, not removal. */
  secondary: NavItem[];
};

/**
 * Four-section navigation (Week 2). Every route that used to be a flat sidebar
 * entry still exists — less-used ones live under each group's `secondary` list.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "setup",
    groupLabel: "केस सेटअप",
    groupLabelEn: "Case Setup",
    items: [
      { path: "/",             label: "मुख्य पृष्ठ",      labelEn: "Home",            icon: HomeIcon, caseScoped: false },
      { path: "/cases",        label: "सभी केस",           labelEn: "All Cases",       icon: Files,    caseScoped: false },
      { path: "/intake",       label: "नया केस इनटेक",     labelEn: "New Case Intake", icon: FilePlus, caseScoped: false },
      { path: "/demo-browser", label: "टेस्ट डेटा ब्राउज़र", labelEn: "Test Data Browser", icon: Globe, caseScoped: false, badge: "DEMO" },
    ],
    secondary: [
      { path: "/new-case-ingest", label: "AI केस इंजेस्ट",  labelEn: "AI Case Ingest",  icon: Upload, caseScoped: false },
      { path: "/upload",          label: "अपलोड",           labelEn: "Upload",          icon: Upload, caseScoped: true },
      { path: "/documents",       label: "दस्तावेज़",        labelEn: "Documents",       icon: Files,  caseScoped: true },
      { path: "/infra-arb",       label: "इन्फ्रा आर्बिट्रेशन", labelEn: "Infra Arbitration", icon: Scale, caseScoped: false },
    ],
  },
  {
    id: "research",
    groupLabel: "विधिक अनुसंधान",
    groupLabelEn: "Research",
    items: [
      { path: "/case-law",    label: "कानून खोज",        labelEn: "Case Law Research", icon: BookOpen,     caseScoped: true },
      { path: "/standards",   label: "मानक / Lab",        labelEn: "Forensic Standards", icon: FlaskConical, caseScoped: true },
      { path: "/ai-research", label: "AI शोध इंजन",       labelEn: "AI Research Engine", icon: Brain,       caseScoped: true },
      { path: "/chat",        label: "AI चैट",            labelEn: "AI Chat",            icon: MessageSquare, caseScoped: true },
    ],
    secondary: [
      { path: "/case-research",   label: "विधिक शोध",         labelEn: "Case Research",    icon: FileSearch,   caseScoped: true },
      { path: "/cross-reference", label: "क्रॉस-रेफ मैट्रिक्स", labelEn: "Cross-Ref Matrix", icon: Table2,       caseScoped: true },
      { path: "/forensic-faq",    label: "फॉरेन्सिक FAQ",     labelEn: "Forensic FAQ",     icon: FlaskConical, caseScoped: false },
      { path: "/standards-index", label: "मानक सूचकांक",       labelEn: "Standards Index",  icon: BookOpen,     caseScoped: false, badge: "LDM" },
      { path: "/improvement-lab", label: "रिसर्च लैब",         labelEn: "Improvement Lab",  icon: FileSearch,   caseScoped: false, badge: "P2" },
    ],
  },
  {
    id: "drafting",
    groupLabel: "विधिक प्रारूपण",
    groupLabelEn: "Drafting",
    items: [
      { path: "/ai-draft-engine",       label: "AI ड्राफ्ट इंजन", labelEn: "AI Draft Engine",   icon: Sparkles,    caseScoped: true },
      { path: "/discharge-application", label: "प्रार्थना-पत्र",   labelEn: "Discharge App",     icon: Scale,       caseScoped: true },
      { path: "/safe-draft",            label: "सेफ ड्राफ्ट",     labelEn: "Safe Draft Editor", icon: ShieldCheck, caseScoped: true, badge: "NEW" },
    ],
    secondary: [
      { path: "/defence-reply", label: "डिफेंस रिप्लाई", labelEn: "Defence Reply", icon: FileText, caseScoped: true },
      { path: "/notice-reply",  label: "नोटिस रिप्लाई",  labelEn: "Notice Reply",  icon: FileText, caseScoped: true, badge: "NEW" },
      { path: "/drafting",      label: "ड्राफ्टिंग व्यू", labelEn: "Drafting View", icon: FileText, caseScoped: true },
    ],
  },
  {
    id: "review",
    groupLabel: "मामला समीक्षा",
    groupLabelEn: "Review",
    items: [
      { path: "/dashboard",        label: "डैशबोर्ड",  labelEn: "Dashboard",        icon: LayoutDashboard, caseScoped: true },
      { path: "/verification",     label: "सत्यापन",   labelEn: "Verification",     icon: ShieldCheck,     caseScoped: true },
      { path: "/filing-checklist", label: "चेकलिस्ट",  labelEn: "Filing Checklist", icon: CheckSquare,     caseScoped: true },
      { path: "/timeline",         label: "टाइमलाइन",  labelEn: "Timeline",         icon: Clock,           caseScoped: true },
    ],
    secondary: [
      { path: "/review-queue", label: "चेंबर समीक्षा", labelEn: "Review Queue", icon: FilePlus, caseScoped: false, badge: "3" },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => [...g.items, ...g.secondary]);

/** Case-scoped paths that historically existed as flat routes — kept alive as redirects. */
export const LEGACY_FLAT_PATHS: string[] = ALL_NAV_ITEMS.filter((i) => i.caseScoped).map((i) => i.path);

export function findNavGroup(item: NavItem): NavGroup | undefined {
  return NAV_GROUPS.find((g) => g.items.includes(item) || g.secondary.includes(item));
}
