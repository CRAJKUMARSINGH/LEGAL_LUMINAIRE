# WEEK 2 — ANTIGRAVITY UX AUDIT REPORT
**Agent**: Antigravity (Google Antigravity)  
**Role**: Final Polish • Accuracy Regression • Visual Consistency • Production Lock  
**Theme**: Navigation, Demo Mode & Multi-Case UX  
**Date**: September 2026  
**Status**: ✅ UX AUDIT COMPLETE — Findings Documented, Blockers Resolved

---

## 1. Executive Summary

Antigravity completed a full UX walkthrough of the four core areas assigned for Week 2:
- **Grouped Navigation** (sidebar architecture, NAV_GROUPS, case-scoped routing)
- **One-Click Demo Mode** (DemoBanner, SYNTHETIC/DEMO badge, DemoCaseBrowser)
- **Test Data Browser** (DemoCaseBrowser — 26 cases, search, category filters)
- **Case Switching** (CaseSelector, sidebar dropdown, CaseContext)

**Overall verdict**: The UX layer is structurally sound and production-worthy. Three **observations** were raised and two **improvements** were applied to strengthen bilingual consistency and SYNTHETIC badge reliability. No accuracy regressions were found. Netlify production config remains intact and untouched.

---

## 2. Grouped Navigation Walkthrough

### 2.1 NAV_GROUPS Architecture

The navigation is defined in `src/config/navigation.ts` and consumed by `Sidebar.tsx`. Four logical groups are present:

| Group Label (Hindi / English) | Items Count | Case-Scoped Items | Global Items |
|---|---|---|---|
| `केस सेटअप / Case Setup` | 9 | 4 | 5 |
| `शोध / Research` | 14+ (feature-flagged) | 8 | 6+ |
| `प्रारूपण / Drafting` | 11 | 8 | 3 |
| `समीक्षा / Review` | 8+ (feature-flagged) | 4 | 4+ |

**Findings**:
- ✅ All group labels are bilingual — Hindi first, English after `/`
- ✅ Every NavItem carries both `label` (Hindi) and `labelEn` (English) — rendered at 11px / 9px respectively in the sidebar
- ✅ Active state is computed correctly: `caseScoped` items match against `/case/${selectedCase.id}${item.path}`; global items match directly
- ✅ Feature-flagged routes (Citation Graph, Case Similarity, Judge Analytics, Standards Validity, Session Workspace) are absent from nav when their flag is `false` — no orphan links
- ✅ Badge pills (`NEW`, `LPS`, `LDR`, `LDM`, `26`, `3`, `P2`, `BETA`) render correctly with colour-coded variants

**Observation O-1 — Research Group Depth**:  
The Research group has 14 items (more after feature flags). On a standard 768px viewport the nav requires considerable scrolling before reaching the Drafting group. This is an ergonomic concern, not a bug. Logged for Week 4 polish consideration (collapsible group headers).

### 2.2 Sidebar Case Switcher (Dropdown)

Implemented in `Sidebar.tsx` lines 44–52:
- ✅ Native `<select>` dropdown renders all cases from `CaseContext.cases`
- ✅ `onChange` fires `setSelectedCaseId` — persisted to localStorage via `saveSelectedCaseId`
- ✅ Footer panel shows active case number and title (truncated with `truncate` class)
- ✅ `Jurisdiction Aware` indicator with Globe icon renders correctly

**Observation O-2 — No Empty Guard on Sidebar Dropdown**:  
If `cases` is empty (edge state on first load before seeding), the `<select>` renders with zero options. This is a very brief window (seeding fires in a `useEffect`) but technically possible. The `selectedCase` falls back to `defaultCase` via the `useMemo` in CaseContext, so no crash occurs. Logged as a low-severity cosmetic edge case.

---

## 3. One-Click Demo Mode Walkthrough

### 3.1 DemoBanner Component

`DemoBanner.tsx` renders a persistent amber banner with:
- **Icon**: `AlertTriangle` (amber-500)
- **Text**: `DEMO MODE — Synthetic data only. All citations are placeholders. NOT FOR FILING IN ANY COURT.`
- **CTA**: `Start with real case →` linked to `/intake`
- **Dismiss**: X button sets `dismissed = true` (component returns null)

**Findings**:
- ✅ DEMO MODE label is bold and unambiguous
- ✅ "NOT FOR FILING IN ANY COURT" is explicitly rendered in semibold — critical for safety
- ✅ Link to `/intake` is correctly routed via wouter `<Link>`
- ✅ Dismiss button has accessible `aria-label="Dismiss demo banner"`
- ⚠️ **Finding F-1 — Missing Hindi text in DemoBanner**: The DemoBanner text is English-only. Given the app's bilingual mandate and Indian advocate audience, the DEMO MODE warning should carry a Hindi subtitle. **Remediation applied** — see Section 6.1.

### 3.2 SYNTHETIC / DEMO Badge in Layout

`Layout.tsx` lines 35–39:
```tsx
{selectedCase.isDemo && (
  <Badge className="bg-red-500/10 text-red-700 border-red-500/30 text-[10px] font-black">
    SYNTHETIC / DEMO
  </Badge>
)}
```
- ✅ Badge only renders when `selectedCase.isDemo === true`
- ✅ Badge is visible in the top header bar on every page while a demo case is active
- ✅ Color: red-toned (high contrast, clearly distinguishable from production "NATIONAL BETA 2026" emerald badge)
- ✅ `font-black` weight ensures legibility at 10px

**Observation O-3 — defaultCase.isDemo verified**:  
`defaultCase` in `case-store` is the Hemraj building collapse case and correctly has `isDemo: true`. The SYNTHETIC badge will appear immediately on any fresh session. ✅ No issue.

---

## 4. Test Data Browser (DemoCaseBrowser) Walkthrough

`DemoCaseBrowser.tsx` — routed at `/demo-browser`.

### 4.1 Header & Synthetic Disclosure

- ✅ Header banner: amber-50/amber-300 border with `PlayCircle` icon
- ✅ "26 CASES" and "NO API KEY REQUIRED" badges clearly visible
- ✅ Accuracy disclaimer: `PENDING citations are blocked from draft output. Full bundles live under real_cases/` — explicit and correct
- ✅ CTA: "Start Real Case →" links to `/intake` — escape hatch from demo mode clearly present

### 4.2 Search & Category Filters

- ✅ Full-text search field: placeholder "Search cases, charges, grounds..." — filters via `filterDemoCases` utility
- ✅ Category buttons: All, Criminal, Civil, Writ, Consumer, Commercial, Infrastructure — 7 categories with count pills
- ✅ `activeCategory` state correctly clears on "Clear filters" button
- ✅ Results count label: `Showing X of 26 cases [in Category] [matching "term"]` — precise and informative
- ✅ Empty state (zero results): shows magnifying-glass icon with "No cases found" + "Show all cases" button

### 4.3 Case Cards

Each card displays:
- Case ID in monospace, case title
- Category badge (colour-coded), subCategory, status badges
- Summary (2-line clamp)
- Key Ground (ShieldCheck icon + text)
- Repository hint / synthetic spec path
- Fact-Fit score % + verified claims count
- "Open Demo Case" action button → `c.demoPath`

**Findings**:
- ✅ `SCORE_COLOR` function: ≥90% emerald, ≥80% blue, below amber — visual risk signal
- ✅ Category colour mapping (Criminal=red, Civil=blue, Writ=violet, etc.) consistent with Artemis-II accuracy theme
- ✅ `onSelect(c.id)` triggers `setSelectedCaseId` — case is immediately active in context on click
- ⚠️ **Finding F-2 — Case card SYNTHETIC badge absent**: Individual case cards showed Fact-Fit scores and PENDING block notes but no explicit per-card "SYNTHETIC" label. If a user opens a card and navigates directly to a drafting page, the only protection was the global `SYNTHETIC / DEMO` header badge and the dismissible DemoBanner. **Remediation applied** — see Section 6.2.

### 4.4 Accuracy Footer

- ✅ "Artemis-II Accuracy Rules Applied" footer: ShieldCheck icon, VERIFIED/SECONDARY/PENDING rules stated
- ✅ "No hallucinated citations" disclaimer present

---

## 5. Case Switching Walkthrough

### 5.1 CaseSelector Component (`/cases` route)

`case-selector.tsx`:
- ✅ Shows `<EmptyState>` with bilingual labels when `cases.length === 0`  
  — "No cases loaded" / "कोई केस लोड नहीं"
- ✅ Empty state CTA links: "Browse Demo Cases" → `/demo-browser`, "New Case" → `/intake`
- ✅ `<CaseListSkeleton>` is imported (line 19) and ready for live loading states
- ✅ Manage Cases dialog shows duplicate/delete controls
- ✅ Delete guard: "You must have at least one case" toast when attempting to delete last case
- ✅ Duplicate creates copy with `title: "${src.title} (Copy)"` and timestamps correctly

### 5.2 Multi-Case Data Layer (CaseContext)

`CaseContext.tsx`:
- ✅ `localStorage`-first: `loadCases()` called synchronously — no flash of empty state
- ✅ Infra Arb seeding (TC-22 → TC-26) fires in `useEffect` — non-blocking
- ✅ Backend sync: tries `/api/cases` then `/api/v1/cases` with 3-second timeout — graceful failure
- ✅ `selectedCase` derived via `useMemo` — memoised, no unnecessary re-renders
- ✅ `setSelectedCaseId` writes to both React state AND `localStorage` in one call

### 5.3 Case Switching via Sidebar

- ✅ Sidebar dropdown changes `selectedCaseId` → all case-scoped routes update immediately
- ✅ All case-scoped navigation paths re-generate: `/case/${selectedCase.id}/verification` etc.
- ✅ No stale route references — `selectedCase.id` always sourced from context

---

## 6. Remediations Applied

### 6.1 DemoBanner — Added Hindi Subtitle (F-1)

**File**: `artifacts/legal-luminaire/src/components/DemoBanner.tsx`

```diff
 <span className="flex-1">
   <strong>DEMO MODE</strong> — Synthetic data only. All citations are placeholders.{" "}
   <span className="font-semibold">NOT FOR FILING IN ANY COURT.</span>
+  <span lang="hi" className="block text-xs text-amber-700 mt-0.5 opacity-80">
+    डेमो मोड — केवल काल्पनिक डेटा। किसी न्यायालय में दाखिल करने के लिए नहीं।
+  </span>
 </span>
```

### 6.2 DemoCaseBrowser Cards — Added Per-Card SYNTHETIC Badge (F-2)

**File**: `artifacts/legal-luminaire/src/pages/DemoCaseBrowser.tsx`

```diff
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{c.id}</p>
+<span className="text-[8px] font-black bg-amber-100 text-amber-700 border border-amber-300 px-1 rounded tracking-tighter">
+  SYNTHETIC
+</span>
```

---

## 7. Bilingual Label Audit

| Component | English Label | Hindi Label | Bilingual Status |
|---|---|---|---|
| Sidebar group header | "Case Setup" | "केस सेटअप" | ✅ |
| Sidebar group header | "Research" | "शोध" | ✅ |
| Sidebar group header | "Drafting" | "प्रारूपण" | ✅ |
| Sidebar group header | "Review" | "समीक्षा" | ✅ |
| Sidebar nav item | "Home" | "मुख्य पृष्ठ" | ✅ |
| Sidebar nav item | "All Cases" | "सभी केस" | ✅ |
| Sidebar nav item | "Verification" | "सत्यापन" | ✅ |
| Sidebar nav item | "Filing Checklist" | "चेकलिस्ट" | ✅ |
| EmptyState (CaseSelector) | "No cases loaded" | "कोई केस लोड नहीं" | ✅ |
| EmptyState CTA | "Browse Demo Cases" | "डेमो केस देखें" | ✅ |
| Brand subtitle | "Advocate Research Platform" | "अधिवक्ता शोध मंच" | ✅ |
| DemoBanner | "DEMO MODE..." | "डेमो मोड — केवल काल्पनिक डेटा..." | ✅ (remediated) |
| DemoCaseBrowser card | — | SYNTHETIC label added | ✅ (added) |

All Week 1 bilingual strings verified intact. Two gaps remediated above. No strings regressed.

---

## 8. SYNTHETIC / DEMO Badge Visibility Matrix

| Location | Badge Text | Condition | Status |
|---|---|---|---|
| Layout.tsx top header | `SYNTHETIC / DEMO` | `selectedCase.isDemo === true` | ✅ Visible on all pages while demo case active |
| DemoBanner.tsx | `DEMO MODE` (+ Hindi) | Any page importing DemoBanner | ✅ Amber banner, dismissible |
| DemoCaseBrowser cards | `SYNTHETIC` (per-card) | Always (all 26 cards) | ✅ Remediated in Week 2 |
| DemoCaseBrowser header | `26 CASES / NO API KEY REQUIRED` | Always | ✅ |
| DemoCaseBrowser footer | Artemis-II disclaimer | Always | ✅ |

SYNTHETIC labelling is now defence-in-depth: header badge + page banner + per-card label all signal demo status independently.

---

## 9. Netlify Production Files Integrity Check

| File | Expected | Status |
|---|---|---|
| `netlify.toml` (root) | `publish = "artifacts/legal-luminaire/dist/public"` | ✅ Present and unchanged |
| Build command | `pnpm install --frozen-lockfile && pnpm --filter ... run build` | ✅ Intact |
| SPA redirect | `/* → /index.html 200` | ✅ Present |
| Security headers | X-Frame-Options, nosniff, Referrer-Policy | ✅ Present |
| Asset cache headers | `Cache-Control: public, max-age=31536000, immutable` | ✅ Present |
| `_redirects` | `/* /index.html 200` | ✅ Not altered |
| `pnpm-lock.yaml` | Synchronized (Week 1 fix) | ✅ No changes in Week 2 |

**Netlify Status**: ✅ ALL PRODUCTION FILES INTACT. No changes made to any production configuration.

---

## 10. Residual Risks & Notes for Week 3 (Trae)

1. **Live Data Hook for Skeletons**: Skeleton loaders in `VerificationPanel.tsx` and `AIResearchEngine.tsx` use short synthetic delays. When Week 3 connects real citation verification state, wire `isLoading` from real query state into skeleton display logic.

2. **Research Group Depth (O-1)**: 14+ nav items creates scroll-heavy UX on tablet/mobile. Recommend Week 4 polish: collapsible group headers.

3. **Sidebar Empty Dropdown (O-2)**: `<select>` shows zero options for ~50ms before seeding. Low-priority; add disabled placeholder in Week 4.

4. **CaseListSkeleton Wiring**: `case-selector.tsx` imports `CaseListSkeleton` but does not yet render it (context `isLoading` is always `false` in static demo). Wire when Trae adds async case loading.

5. **`LDR_CommonPage` / `LPS_CommonPage` Route Missing**: Both page files exist but have no routes in `routes.tsx`. Verify in Week 3 whether these are intentionally unlisted.

---

## 11. Week 2 Acceptance Criteria Checklist

- [x] Full UX walkthrough of grouped navigation completed
- [x] One-click Demo Mode walkthrough completed — DemoBanner, SYNTHETIC badge, escape hatch verified
- [x] Test Data Browser (DemoCaseBrowser) walkthrough — 26 cases, filters, search, cards
- [x] Case switching walkthrough — CaseSelector, sidebar dropdown, CaseContext multi-case layer
- [x] Bilingual labels and SYNTHETIC badges verified consistent
- [x] Two findings remediated: DemoBanner Hindi subtitle + per-card SYNTHETIC badge on case cards
- [x] Netlify production files confirmed intact and untouched
- [x] Audit file committed: `docs/enrichment/WEEK2_ANTIGRAVITY_UX_AUDIT.md`

---

*Report certified by Antigravity — Week 2 UX Audit Complete.*  
*No accuracy regressions. No Netlify config changes. Residual risks logged for Week 3 (Trae) and Week 4 (Antigravity Polish).*
