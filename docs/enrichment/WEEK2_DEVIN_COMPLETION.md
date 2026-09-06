# Week 2 — Devin Completion Report

**Theme:** UX Navigation, Demo Mode & Multi-Case Data Layer
**Scope:** Week 2 of `02_DEVIN_Detailed_5Week_Guide.md` only. Week 3+ was **not** implemented.
**Branch:** `devin/1788709797-week2-enrichment` (frontend `artifacts/legal-luminaire` only; API server untouched)

---

## 1. Data-layer architecture decisions

| Decision | Rationale |
|---|---|
| `CaseContext` / `CaseRecord` stays the single runtime source of truth | Already persisted to localStorage, already consumed by every `/case/:id/*` page. The unused `multi-case-store.ts` was **not** promoted to a second store. |
| New `src/cases/registry.ts` is an *adapter*, not a rewrite | Existing accuracy-sensitive data modules (`caseData.ts`, `case02-ndps.ts`, `case03-ni-act.ts`, `case04-peetambara.ts`, `infrastructure-cases.ts`, `all-demo-cases.ts`) are consumed as-is. Adding a new case = add a data module + one map entry; no component edits. |
| `src/cases/hemraj-case-01.ts` builds the **full CASE_01** `CaseRecord` | Fixes the Week 1 finding that `case-01` was an empty shell (0 docs / 0 citations / "LOW ACCURACY 0.0/10"). Timeline, case-law matrix, standards matrix, documents, strategy pillars, parties, prayer clauses and verification blocks all come from the existing hand-verified modules. |
| `CaseRecord` gained `isDemo`, `sourceDemoId`, `prayerClauses`, `verificationBlocks` | Required fields from the guide; `verificationBlocks[].blockedFromDraft` keeps PENDING items out of drafting. |
| Cards without a rich pack (TC-05…TC-21) load as *complete-but-minimal* records with **one PENDING, draft-blocked** verification block | Honest: they are labelled synthetic, they never claim verified authority. |
| `TC-01` → `case-01` ID mapping (`recordIdForDemo`) | Preserves every existing `/case/case-01/...` link and the hand-drafted Discharge PDF v6 page. Other demo cases use their catalogue ID (`/case/TC-02/...`). |
| Built-in `case-01` slot auto-hydrates from the registry on first load if it is still empty | Users who never press "Load Demo" still get a correct, labelled Hemraj dashboard. |
| Recent Cases stored under `legal_luminaire_recent_cases_v1` (max 5, newest-first, de-duplicated) | Widget proposal B from the Week 1 audit; wired into `setSelectedCaseId` so every case switch is recorded. |
| `CaseRouteSync` makes `/case/:id/*` authoritative | Deep-linking `/case/TC-22/dashboard` now loads TC-22 (Week 1 finding: `:id` was ignored). Unknown IDs are left alone (no silent case replacement). |

### Required `CaseRecord` fields — status
`court`, `caseNo`, `parties`, `timeline` (facts), `standards` (matrix), `caseLaw`/`citations` (links), `prayerClauses`, `verificationBlocks` — all present on TC-01; all present (possibly empty arrays + PENDING block) on every other catalogue case. Covered by `week2-data-layer.test.ts`.

---

## 2. Files changed

**New**
- `src/cases/registry.ts` — catalogue (26 entries, scenario type functional/edge/stress/showcase), `buildCaseRecord(demoId)`, `recordIdForDemo`
- `src/cases/hemraj-case-01.ts` — full CASE_01 adapter
- `src/lib/recent-cases.ts` — localStorage recent-history primitives
- `src/lib/intake-schema.ts` — Zod schema with bilingual (`हिन्दी / English`) messages
- `src/components/layout/Breadcrumbs.tsx` — persistent breadcrumbs (Home › Case › Group › Page)
- `src/components/layout/CaseRouteSync.tsx` — URL ↔ context sync
- `src/components/home/DemoModeCard.tsx` — **Load Demo Case (Hemraj – Synthetic)**
- `src/components/home/RecentCasesWidget.tsx`
- `src/__tests__/week2-data-layer.test.ts` — 8 tests

**Modified**
- `src/config/navigation.ts` — 4 groups (Case Setup / Research / Drafting / Review) with `secondary` progressive-disclosure lists; `ALL_NAV_ITEMS`, `LEGACY_FLAT_PATHS`, `findNavGroup`
- `src/components/layout/Sidebar.tsx` — collapsible groups, "More tools (n)" disclosure, `aria-expanded/controls/current`, focus rings, drawer closes on navigation, demo label on active case
- `src/components/layout/Layout.tsx` — persistent `SYNTHETIC / DEMO` header badge, `DemoBanner`, `Breadcrumbs`, `CaseRouteSync`
- `src/components/DemoBanner.tsx` — now non-dismissible, `role="status"`, "NOT FOR FILING IN ANY COURT"
- `src/context/CaseContext.tsx` — `loadDemoCase`, `recentCases`, `isDemoMode`, case-01 hydration
- `src/lib/case-store.ts` — new `CaseRecord` fields
- `src/routes.tsx` — legacy flat routes (`/dashboard`, `/case-law`, …) redirect to `/case/<active>/…`
- `src/pages/Home.tsx` — reads `selectedCase` (no more `caseData` imports); Demo card, Recent Cases widget, verification-block card for non-Hemraj cases; hand-scored radar shown for CASE_01 only
- `src/pages/DemoCaseBrowser.tsx` — cards show ID, title (EN+HI), court, charges, scenario type, SYNTHETIC/DEMO, Fact-Fit; **Load Case** calls `loadDemoCase`
- `src/pages/CaseIntakeAssistant.tsx` — Zod-driven field errors beside inputs, `aria-invalid`/`aria-describedby`, submit blocked
- `src/components/views/StandardsView.tsx`, `DocumentsView.tsx` — read `selectedCase` with bilingual empty states

**Not migrated (deliberately, Week 2 scope):** `DischargeApplicationPrint`, `FilingChecklist`, `CaseResearch`, `AIResearchEngine`, `AIDraftEngine` still import the hand-verified CASE_01 modules directly. They are court-document generators whose text was verified against the real bundle; re-plumbing them is a Week 3 (document pipeline) concern and was left for Trae/Kiro handoff rather than risking accuracy.

---

## 3. Demo Mode verification

Netlify-equivalent build served via `vite preview`; Puppeteer script `week2_check.mjs` (desktop 1280×800, mobile 375×812):

| Check | Result |
|---|---|
| Home shows **Load Demo Case (Hemraj – Synthetic)** | ✅ |
| 1 click → `/case/case-01/dashboard` | ✅ (1 click from Home; ≤3 required) |
| Header `SYNTHETIC / DEMO` badge + banner "NOT FOR FILING" | ✅ on dashboard, standards, documents, case-law, timeline |
| Badge persists after hard reload | ✅ |
| Breadcrumbs present on case-scoped pages | ✅ |
| Standards / Documents / Case-law / Timeline populated from CASE_01 data | ✅ |
| Runtime console/page errors | 0 |

## 4. Multi-case switching results

| Check | Result |
|---|---|
| Test Data Browser renders 26 cards with ID · title · court · charges · scenario type · Load | ✅ 26/26 |
| Load TC-02 → `/case/TC-02/dashboard`, header/breadcrumb show NDPS title, demo badge on | ✅ |
| Deep link `/case/TC-22/dashboard` (showcase, dynamic import) loads RMSCL record | ✅ |
| Recent Cases localStorage after the run | `TC-22, TC-02, case-01` (newest-first) |
| Legacy `/dashboard` → `/case/case-01/dashboard` | ✅ redirect |
| Sidebar: 4 groups, "More tools" disclosure, keyboard focus rings | ✅ |
| Mobile drawer closes after tapping a nav link | ✅ |
| Intake: empty submit blocked, bilingual errors beside title/court/brief; bad date shows "DD-MM-YYYY" hint | ✅ |
| Vitest | 10 files / **351 passed** (343 + 8 new) |
| `tsc --noEmit` (frontend) | ✅ clean |

## 5. Netlify status

`pnpm install --frozen-lockfile && pnpm --filter @workspace/legal-luminaire run build` → ✅ built in ~21 s, output `artifacts/legal-luminaire/dist/public`. SPA fallback (`/* → /index.html 200`) unchanged; new routes are client-side only, so `/case/TC-22/dashboard` and legacy `/dashboard` both resolve under the existing `netlify.toml`. CI (Node 22 / pnpm 10) unchanged from Week 1.

## 6. Trae handoff notes

- **Adding a case:** create `src/data/<case>.ts`, add a `case "TC-xx":` branch in `buildCaseRecord()` in `src/cases/registry.ts` (use `fromStub(...)` for the META/GROUNDS/PRECEDENTS shape) (or rely on the minimal builder — it is automatic for any card in `all-demo-cases.ts`). No component changes needed.
- `CaseRecord.verificationBlocks[].blockedFromDraft` is the flag the drafting engine should honour; minimal-pack cases ship with one PENDING/blocked block.
- `isDemoMode` (context) drives badge/banner; anything Trae adds to the shell should read it rather than checking titles.
- Breadcrumb labels come from `NAV_GROUPS`/`ALL_NAV_ITEMS`; add new pages there (with `caseScoped: true` when under `/case/:id`).
- Case-01-only UI (hand-scored radar, Discharge PDF v6 hero) is gated on `selectedCase.id === DEFAULT_CASE_ID`.
- Remaining hard-coded CASE_01 consumers listed in §2 are the natural Week 3 entry point.

## 7. Week 2 acceptance checklist

- [x] Navigation collapsed into 4 groups; secondary routes behind progressive disclosure
- [x] Legacy flat routes remain operational (redirects)
- [x] Keyboard navigation + mobile drawer preserved and improved
- [x] Persistent breadcrumbs on case-scoped pages
- [x] One-click **Load Demo Case (Hemraj – Synthetic)** on Home
- [x] Persistent `SYNTHETIC / DEMO` label on every page in demo mode
- [x] 26-case browser preserved; each card has ID, title, court, charges, scenario type, Load
- [x] Loading a case switches context cleanly (URL, header, sidebar, breadcrumbs, recent list)
- [x] Data layer: new cases are data, not component edits
- [x] Required `CaseRecord` fields present
- [x] Zod validation on intake, bilingual field-level errors, invalid submit blocked
- [x] Home Recent Cases widget (localStorage)
- [x] Typecheck, tests, Netlify-equivalent build, runtime smoke — all green
- [x] **Week 3 not started**
