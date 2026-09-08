/**
 * Legal Luminaire — Central Type Index
 * =====================================
 * Single import surface for all shared types across the app.
 * Import from "@/types" in all pages and components — never from
 * individual lib/context files directly (unless adding a new export here).
 *
 * ARCHITECTURE NOTE — Two parallel "case" type systems:
 * -------------------------------------------------------
 * 1. `CaseRecord`    (from lib/case-store)      — the live app's primary case model.
 *    Used by CaseContext, all pages, and all route components.
 *    Supports localStorage persistence and optional backend sync.
 *    `charges` field is `string | string[]` for backwards compatibility.
 *
 * 2. `MultiCaseData` (from lib/multi-case-store) — the template/generation model.
 *    Used only by case-templates.ts and the generate-from-template utility.
 *    `charges` is strictly `string`.
 *
 * RULE: Always use `CaseRecord` in page and component code.
 *       Use `MultiCaseData` only in template utilities.
 *       Use `getChargesArray(record)` from lib/case-store to safely normalise charges.
 */

// ── Core case model (USE THIS IN ALL PAGES) ───────────────────────────────
export type {
  CaseFile,
  CaseParty,
  CaseCitation,
  CaseRecord,
} from "@/lib/case-store";
export { getChargesArray, defaultCase, DEFAULT_CASE_ID } from "@/lib/case-store";

// ── Template/generation model (USE ONLY IN TEMPLATE UTILITIES) ───────────
export type {
  MultiCaseData,
  CaseTemplate,
  TimelineEvent,
  CaseLawEntry,
  StandardEntry,
  DocumentEntry,
  StrategyPillar,
} from "@/lib/multi-case-store";

// ── Argument paragraph type (case01-data.ts court submissions) ───────────
export type { ArgumentParagraph } from "@/lib/case01-data";

// ── Navigation types ──────────────────────────────────────────────────────
export type { NavItem, NavGroup } from "@/config/navigation";

// ── Feature flags type ────────────────────────────────────────────────────
/**
 * The shape of the featureFlags object.
 * Re-exported from the canonical source so consumers never need to import
 * from both @/config/featureFlags and @/types.
 */
export type { FeatureFlags } from "@/config/featureFlags";

// ── Context value types ───────────────────────────────────────────────────
/**
 * Full shape of the CaseContext value.
 * Use this when you need to type a parameter that receives the context value,
 * e.g. in test utilities or higher-order components.
 */
export type { CaseContextType } from "@/context/CaseContext";

/**
 * Accuracy metrics tracked globally by AccuracyContext.
 */
export type { AccuracyMetrics, AccuracyContextType } from "@/context/AccuracyContext";

/**
 * Accuracy level band derived from overallScore:
 *   CRITICAL ≥ 9.5 | HIGH ≥ 8.0 | MEDIUM ≥ 6.0 | LOW < 6.0
 */
export type { AccuracyLevel } from "@/context/AccuracyContext";

// ── Verification tiers (shared across research, verification, drafting) ───
/**
 * Canonical verification tier for citations and standards.
 * COURT_SAFE  — certified copy + para number confirmed
 * VERIFIED    — confirmed on official source
 * SECONDARY   — credible secondary source; needs primary verification
 * PENDING     — unverified; BLOCKED from all draft output
 * FATAL_ERROR — factually mismatched or fabricated; BLOCKED
 */
export type VerificationTier =
  | "COURT_SAFE"
  | "VERIFIED"
  | "SECONDARY"
  | "PENDING"
  | "FATAL_ERROR";

// ── Fact-Fit Gate levels (from verification-engine) ───────────────────────
/**
 * Fact-Fit Gate scoring levels (Accuracy Rule §2).
 * exact     — total score ≥ 70 → primary authority
 * analogous — score 50–69     → use with qualification
 * weak      — score 30–49     → supporting only, never primary
 * rejected  — score < 30      → DO NOT USE
 */
export type FitLevel = "exact" | "analogous" | "weak" | "rejected";

// ── Draft language options (LDR pages and draft engine) ──────────────────
export type LdrLang = "en" | "hi" | "both";

// ── Search engine V2 types ────────────────────────────────────────────────
/** Typed search filters — replaces the old `filters?: any` pattern. */
export type { SearchFilters } from "@/lib/modules/search-engine-v2";

// ── Legal search result types (SearchView / backend /legal-search) ────────
/**
 * A single statute result from the /legal-search endpoint.
 */
export interface StatuteResult {
  code: string;
  title: string;
  punishment?: string;
}

/**
 * A single IS/ASTM/BS standard result from the /legal-search endpoint.
 */
export interface StandardResult {
  code: string;
  title: string;
  category?: string;
}

/**
 * A single case-law precedent result from the /legal-search endpoint.
 */
export interface PrecedentResult {
  case: string;
  citation: string;
  court: string;
  holding?: string;
}

/**
 * Typed shape of the /legal-search API response.
 * Replaces `type SearchResult = { statutes: any[]; ... }` in SearchView.
 */
export interface LegalSearchResult {
  statutes: StatuteResult[];
  standards: StandardResult[];
  precedents: PrecedentResult[];
}

/**
 * Props for the ResultCard inner component in SearchView.
 */
export interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  category: string;
  detail?: string;
}

// ── Document ingestion / OmniDropzone types ───────────────────────────────

/**
 * Upload stage machine for the OmniDropzone component.
 * idle           — no file selected yet
 * previewing     — /omni-preview request in flight
 * preview_ready  — preview returned, awaiting user confirmation
 * ingesting      — /omni-ingest or final-save in flight
 * reviewing      — ReviewView (Human-in-the-Loop) open
 * done           — case created successfully
 * error          — unrecoverable error; user must reset
 */
export type UploadStage =
  | "idle"
  | "previewing"
  | "preview_ready"
  | "ingesting"
  | "reviewing"
  | "done"
  | "error";

/**
 * Shape of the /omni-preview backend response.
 */
export interface PreviewResponse {
  success: boolean;
  metadata?: {
    filename: string;
    file_type: string;
    total_pages: number;
    total_chars: number;
    total_chunks: number;
    preview_text: string;
  };
  chunks?: Array<{
    page_number: number;
    chunk_index: number;
    text: string;
    char_count: number;
  }>;
  errors?: string[];
  message?: string;
}

/**
 * Shape of the /omni-ingest backend response.
 */
export interface IngestResponse {
  success: boolean;
  case_id?: string;
  extraction?: ExtractionData;
  message?: string;
  errors?: string[];
}

/**
 * Shape of the /auto-research backend response.
 */
export interface AutoResearchResponse {
  success: boolean;
  matches: AutoResearchMatch[];
  message?: string;
}

/**
 * Upload progress info shown to the user during multi-step ingestion.
 */
export interface UploadProgressState {
  stage: UploadStage;
  statusText: string;
  /** 0–100; undefined when progress is indeterminate */
  percent?: number;
  errors: string[];
}

/**
 * A single timeline event as extracted from the backend AI pipeline.
 * Used by OmniDropzone (extraction state) and ReviewView (editing state).
 */
export interface ExtractionTimelineEvent {
  date: string;
  event: string;
  description?: string;
  grounding?: string;
}

/**
 * Full shape of the AI-extracted case data returned by /omni-review and
 * passed between OmniDropzone → ReviewView → handleFinalSave.
 * Replaces `any` on the extractionData state and handleFinalSave parameter.
 */
export interface ExtractionData {
  incident_type?: string;
  jurisdiction?: string;
  accused_names?: string[];
  statutes_involved?: string[];
  forensic_grounding?: Array<{ code: string; title: string; keywords: string[]; violations: string[] }>;
  timeline_events?: ExtractionTimelineEvent[];
}

/**
 * Props for the ReviewView component (Human-in-the-Loop review screen).
 * Replaces `({ extraction, onSave, onBack }: any)`.
 */
export interface ReviewViewProps {
  extraction: ExtractionData;
  onSave: (data: ExtractionData) => void;
  onBack: () => void;
}

/**
 * A single auto-research match returned by the /auto-research endpoint.
 * Used in OmniDropzone when mapping backend research results onto caseLaw.
 */
export interface AutoResearchMatch {
  case: string;
  citation: string;
  court: string;
  holding: string;
  fit_score: number;
}

// ── Verification result item (DraftingView) ───────────────────────────────
/**
 * A single item in the DraftingView citation verification results list.
 * Replaces `useState<any[]>([])` for verificationResults.
 */
export interface VerificationResultItem {
  citationText: string;
  status: VerificationTier;
  message?: string;
}

// ── LPS route identifiers ─────────────────────────────────────────────────
/**
 * The five sub-routes navigable within the Precedent Search (LPS) flow.
 * Used in routes.tsx handleLpsNavigate and any LPS page navigation handler.
 */
export type LpsRoute = "defence" | "analysis" | "precedents" | "standards" | "print";

// ── Case selector props contract ──────────────────────────────────────────
/**
 * Props accepted by the CaseSelector component (src/components/case-selector.tsx).
 * Aligned with the actual component signature — not a hypothetical API.
 *
 * onCreateCase — called when the "New Case" button is clicked
 * showStats    — if true, renders a stats card for the selected case
 */
export interface CaseSelectorProps {
  onCreateCase?: () => void;
  showStats?: boolean;
}

// ── Branded DraftId ───────────────────────────────────────────────────────
/**
 * Opaque brand for draft document identifiers.
 * Construct via `asDraftId(rawString)` — never assign a plain string directly.
 *
 * Example:
 *   const id: DraftId = asDraftId("draft-2026-001");
 *   router.navigate(`/draft/${id}`);
 */
export type DraftId = string & { readonly __brand: "DraftId" };

/**
 * Safe constructor for DraftId — validates non-empty before branding.
 */
export function asDraftId(value: string): DraftId {
  if (!value.trim()) throw new Error("DraftId must be a non-empty string");
  return value as DraftId;
}

// ── Route safety types (Week 4) ───────────────────────────────────────────
/**
 * Every flat (non-case-scoped) route registered in routes.tsx.
 *
 * Use this type on any call to setLocation() or navigate() that targets a
 * flat route — the compiler will catch typos and missing routes at build
 * time rather than silently navigating to a 404.
 *
 * Parameterised routes (/authority/:id, /draft/:id) are intentionally
 * excluded because their runtime values cannot be statically enumerated;
 * use template literals for those: `/authority/${id}` as string.
 *
 * Keep this union in sync with routes.tsx whenever a flat route is added
 * or removed.
 */
export type FlatRoute =
  | "/"
  | "/cases"
  | "/intake"
  | "/new-case-ingest"
  | "/review-queue"
  | "/improvement-lab"
  | "/forensic-faq"
  | "/infra-arb"
  | "/demo-browser"
  | "/citation-search"
  | "/cross-check-report"
  | "/verification-report"
  | "/defense-brief"
  | "/fsl-analysis"
  | "/standards-index"
  | "/filing-checklist"
  | "/ldr-home"
  | "/ldr-comparison"
  | "/ldr-motion"
  | "/ldr-packet"
  | "/ldr-precedents"
  | "/ldr-print"
  | "/ldr-reply"
  | "/ldr-standards"
  | "/ldr-timeline"
  | "/ldr-verification"
  | "/lps-home"
  | "/lps-defence"
  | "/lps-precedents"
  | "/lps-print"
  | "/lps-sample-analysis"
  | "/lps-standards";

/**
 * The path segment (without /case/:id prefix) for every case-scoped route
 * registered in routes.tsx.
 *
 * Build the full URL by prepending the case id:
 *   const url = `/case/${caseId}${path}` satisfies string;
 *
 * Feature-flagged segments (citation-graph, case-similarity, judge-analytics,
 * standards-validity, session-workspace) are included — they are valid path
 * segments even when their flags are off (the route simply won't render).
 */
export type CasePath =
  | "/dashboard"
  | "/chat"
  | "/case-law"
  | "/case-research"
  | "/cross-reference"
  | "/ai-research"
  | "/ai-draft-engine"
  | "/standards"
  | "/timeline"
  | "/documents"
  | "/upload"
  | "/drafting"
  | "/safe-draft"
  | "/notice-reply"
  | "/discharge-print"
  | "/verification"
  | "/filing-checklist"
  | "/discharge-application"
  | "/defence-reply"
  | "/oral-arguments"
  | "/standards-validity"
  | "/session-workspace"
  | "/citation-graph"
  | "/case-similarity"
  | "/judge-analytics";

/**
 * Convenience alias — either a flat route or a fully-formed case-scoped URL.
 * Use FlatRoute or CasePath directly in most cases; RouteId is for generic
 * navigation utilities that accept both forms.
 */
export type RouteId = FlatRoute | `/case/${string}${CasePath}` | `/draft/${string}` | `/authority/${string}`;

/**
 * Type-guard: returns true if `value` is a known LpsRoute, narrowing
 * the type so callers don't need an unsafe `as LpsRoute` cast.
 *
 * Usage:
 *   if (isLpsRoute(route)) setLocation(LPS_ROUTE_MAP[route]);
 */
export function isLpsRoute(value: string): value is LpsRoute {
  return (["defence", "analysis", "precedents", "standards", "print"] as const).includes(
    value as LpsRoute
  );
}

/**
 * Canonical mapping from LpsRoute segment to its registered flat URL.
 * Eliminates repeated string literals in handleLpsNavigate.
 */
export const LPS_ROUTE_MAP: Record<LpsRoute, FlatRoute> = {
  defence:    "/lps-defence",
  analysis:   "/lps-sample-analysis",
  precedents: "/lps-precedents",
  standards:  "/lps-standards",
  print:      "/lps-print",
} as const;
