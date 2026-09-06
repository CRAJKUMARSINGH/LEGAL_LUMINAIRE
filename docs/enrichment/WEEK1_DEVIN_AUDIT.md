# WEEK 1 — DEVIN AUDIT NOTE (Support / Audit Role)

**Guide**: `02_DEVIN_Detailed_5Week_Guide.md` — Week 1 "Foundation & Netlify Lock"
**Agent**: Devin (Cognition) · **Role this week**: independent verification, no feature work
**Audited revision**: `main` @ `5c25f15` (feat: Harvey AI integration, research improvements, Hemraj case filings, audit docs)
**Environment**: clean Ubuntu clone, Node 22.23.2, pnpm 10.34.5 (matches `netlify.toml` `NODE_VERSION=22`, `PNPM_VERSION=10`)

Scope discipline: only Week 1 tasks were executed. No Week 2+ items (navigation regrouping, Demo Mode, data layer, Recent Cases widget) were implemented — they are proposed only where the guide asks for proposals.

---

## 1. Netlify build verification (independent)

Exact command from the repo-root `netlify.toml`:

```
pnpm install --frozen-lockfile && pnpm --filter @workspace/legal-luminaire run build
```

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | PASS — lockfile is in sync, `Done in 5.5s` |
| `vite build` (`@workspace/legal-luminaire`) | PASS — `✓ 2892 modules transformed`, `✓ built in 12.29s`, wall clock 18.5s |
| Publish directory `artifacts/legal-luminaire/dist/public` | PASS — exists, 9.9 MB, contains `index.html`, `_redirects`, `assets/`, `case-assets/`, `favicon.svg`, `opengraph.jpg` |
| SPA fallback | PASS — `_redirects` (`/* /index.html 200`) is emitted into publish dir **and** `[[redirects]]` is declared in `netlify.toml` (redundant but harmless) |
| `pnpm run typecheck` (`tsc --noEmit`) | PASS — 0 errors |
| `pnpm test` (Vitest) | PASS — 9 files, **343/343** tests |
| Runtime smoke (vite preview of the built bundle, 11 routes × desktop + mobile) | PASS — all routes HTTP 200, **zero** page errors / console errors |

### Build-log observations (non-blocking)
1. `Ignored build scripts: puppeteer@24.40.0` — pnpm 10 blocks postinstall for `puppeteer` (declared in `scripts/package.json`). Harmless for the SPA build; the Chromium download is skipped. If any Netlify build step ever needs puppeteer, add it to `onlyBuiltDependencies` in `pnpm-workspace.yaml`.
2. Three sourcemap warnings: `src/components/ui/{tooltip,select,label}.tsx (2:0): Error when using sourcemap for reporting an error` — cosmetic Rollup/Vite sourcemap noise, build still succeeds.
3. `Generated an empty chunk: "vendor"` — `manualChunks` in `vite.config.ts` names a `vendor` chunk that receives no modules. Cosmetic; could be cleaned up by Kiro.
4. Largest chunk `RadarChart-*.js` = 385 kB (105 kB gzip) — recharts. Acceptable for now; lazy-loaded.
5. **GitHub Actions `ci.yml` was failing on `main` before this PR** (last 3 `main` runs red): `corepack enable` without a pinned version resolves to pnpm 12.x, which turns "Ignored build scripts: esbuild, puppeteer" into a hard `ERR_PNPM_IGNORED_BUILDS` error. Netlify is unaffected because it pins `PNPM_VERSION=10`. Fixed in this PR by pinning CI to Node 22 + `corepack prepare pnpm@10 --activate` so CI and Netlify use the same toolchain. With install fixed, the second pre-existing failure surfaced: root `pnpm run typecheck` also typechecks `artifacts/api-server`, which has **55 TS errors** (drizzle insert overloads, TS7030 missing returns in `src/routes/*.ts`). The api-server is not part of the Netlify SPA deploy, so the CI step is now scoped to `typecheck:libs` + `@workspace/legal-luminaire` (matching the job's name). The api-server type errors are logged here as a residual risk for its owner; not fixed in Week 1.
6. `artifacts/legal-luminaire/netlify.toml` is a *second* config (`pnpm run build`, publish `dist/public`). It is only correct if the Netlify base directory were set to `artifacts/legal-luminaire`. The root config explicitly says not to override base in the UI, so this nested file is dormant. **Risk**: if someone sets the base dir, `pnpm run build` there does not run `pnpm install` and catalog deps may be missing. Recommend Kiro either delete it or add a header comment stating it is intentionally unused.

**Verdict: Netlify build reproduces cleanly from a fresh clone. No path, lockfile or publish-directory failures.**

---

## 2. Empty states & skeleton loaders — audit

### Inventory (what exists today)
| Component / location | Used? | Notes |
|---|---|---|
| `components/EmptyState.tsx` (icon + title + description + CTA) | **Not imported anywhere** | Well-structured but dead code; English-only props, no `role`/`aria-live` |
| `components/ui/empty.tsx` (shadcn `Empty*` primitives) | Not imported anywhere | Dead code |
| `components/ui/skeleton.tsx` | Not imported anywhere | `animate-pulse` div, no `aria-hidden` / `aria-busy` |
| `components/ui/spinner.tsx` | Not imported anywhere | The only loader with `role="status"` + `aria-label="Loading"` — and it is unused |
| `routes.tsx` → `LoadingFallback` (Suspense fallback for every lazy route) | Yes, all routes | Bare `div.animate-spin` — **no `role="status"`, no `aria-label`, no visible text** |
| `DynamicDashboardView.tsx` radar loading | Yes | Same bare spinner pattern |
| `DraftingView.tsx` generating state | Yes | `Loader2` + English text "Generating Court-Specific Draft..." |
| `OmniDropzone.tsx` previewing / ingesting | Yes | `Loader2` + `statusText`, English only |
| `CaseLawView.tsx` empty table row | Yes | "No precedents matched yet. Upload a document…" (English only) |
| `TimelineView.tsx` empty | Yes | "No timeline events recorded yet. Use AI Case Ingest to populate." (English only) |
| `DemoCaseBrowser.tsx` no-results | Yes | "No cases found" + "Show all cases" reset button (English only) |
| `CitationGraphPanel`, `CaseSimilarityPanel`, `TimelineHeatmap` | Yes | Inline English "No … found" paragraphs |

Conclusion: there is **no single shared empty/skeleton pattern in use** — the reusable components exist but every page hand-rolls its own inline state. This is the primary thing for Kiro to consolidate.

### 2a. Accessibility findings
| # | Severity | Finding | Recommendation |
|---|---|---|---|
| A1 | High | `LoadingFallback` (every lazy route) and dashboard spinner have **no `role="status"` / `aria-live` / text alternative**. Screen readers get silence during route transitions. | Reuse `components/ui/spinner.tsx` (already has `role="status"`) and add visually-hidden bilingual text ("Loading… / लोड हो रहा है…"). |
| A2 | High | Mobile sidebar toggle in `Layout.tsx` (`<button>` with `<Menu/>` icon) has **no `aria-label`**; the close `X` in `Sidebar.tsx` also has none. | Add `aria-label="Open navigation" / "Close navigation"` (bilingual). |
| A3 | Medium | `Skeleton` blocks are not `aria-hidden`; if adopted they will be announced as empty groups. | Add `aria-hidden="true"` on skeletons and `aria-busy="true"` on the container being loaded. |
| A4 | Medium | Empty-state text in `CaseLawView` (`TableCell colSpan=5`) and `TimelineView` uses `text-muted-foreground` on `bg-card`. Contrast is approx. 4.5:1 at 14px — borderline AA for body text; `text-[10px]` italic captions in dashboard footers fall below AA. | Use `text-foreground/80` or larger size for guidance text; keep ≥ 12px. |
| A5 | Medium | Several attention badges use `animate-pulse` permanently (`BETA` in sidebar, red count badges, `SUBMITTED`, `CONFLICT`, unverified-citation barrier in `DraftingView`). No `prefers-reduced-motion` handling anywhere in the codebase. | Add `motion-reduce:animate-none` (Tailwind) to all `animate-pulse` / `animate-spin` usages. |
| A6 | Low | `EmptyState` CTA wraps `<Button>` inside wouter `<Link>` → renders `<a><button>` (interactive inside interactive). | Use `<Button asChild><Link/></Button>`. |
| A7 | Low | Focus: no empty state moves focus or announces itself after an async load completes (e.g. DemoCaseBrowser filter → 0 results). | Wrap empty-state containers in `aria-live="polite"`. |
| A8 | Info | `index.html` has `lang="en"` while the UI is mixed Hindi/English. Hindi strings are not wrapped in `lang="hi"`. | Wrap Hindi spans with `lang="hi"` (helps screen-reader pronunciation and hyphenation). |

### 2b. Bilingual consistency
| # | Finding |
|---|---|
| B1 | Sidebar navigation labels are consistently bilingual (Hindi primary / English secondary) — **good baseline**. Page header breadcrumb also shows "डैशबोर्ड / Dashboard". |
| B2 | **Every empty state and loader string is English-only**: "No precedents matched yet…", "No timeline events recorded yet…", "No cases found", "Generating Court-Specific Draft…", "Verifying…", "Indexing…", "Backend online/offline". Violates standing rule 2. |
| B3 | `EmptyState` props (`title`, `description`, `actionLabel`) are plain strings — the component has no way to accept `{en, hi}` pairs. If Kiro adopts it, extend the props to a `BiText` type or a `hi*` variant of each prop. |
| B4 | `DemoBanner.tsx` ("DEMO MODE — Synthetic data only… NOT FOR FILING") is **English-only and is not mounted anywhere** in the app (`grep DemoBanner` returns only the definition). Demo pages therefore rely on the `[DEMO]` title prefix alone. This is a standing-rule-3 gap and should be closed before Week 2 Demo Mode work builds on it. |
| B5 | Dashboard accuracy badge strings ("LOW ACCURACY", "Below 6.0/10 - Requires review") are English-only. Given these are accuracy signals, any bilingual pass must not hide or soften them. |

### 2c. Mobile responsiveness (375 × 812 viewport, built bundle)
| # | Finding |
|---|---|
| M1 | No page produced horizontal document scroll (`scrollWidth ≤ innerWidth` on all 11 routes). Sidebar collapses to a hamburger drawer correctly. |
| M2 | **Dashboard hero card clips at 375px**: the title "Special Session Case 1/2025 - Hemraj Vardar" and the charges/court badges overflow the card's right edge (content is cut, not wrapped). Root cause: badge row is `flex` without `flex-wrap`, and the card has fixed horizontal padding with an icon column. Screenshot evidence is in the Week 1 audit PR description. |
| M3 | Charges badge renders as a single concatenated string `IPC 304APC Act §13(1)(d)IPC 120B` — `DynamicDashboardView.tsx:92` does `<Badge>{selectedCase.charges}</Badge>` on an array. Should map to one badge per charge (use `getChargesArray()` from `lib/case-store.ts`). Visible on desktop too. |
| M4 | Accuracy badge grid ("Overall / Legal / Technical…") stacks acceptably but is `text-sm` in a narrow two-column layout; consider single column below `sm`. |
| M5 | Empty-state paddings (`py-20`, `p-12`) are fine on mobile; the `DemoCaseBrowser` grid correctly drops to one column. |

---

## 3. CASE_01 (Hemraj) and TC-01 load verification

Method: `vite preview` of the production bundle; puppeteer navigated each route on desktop and mobile with a fresh (empty) `localStorage`; page text, console errors and page errors captured.

| Route | Loads | Hemraj content present | Notes |
|---|---|---|---|
| `/` (Home) | Yes | Yes | Shows demo/synthetic wording, Hindi tagline |
| `/cases` (CaseSelector) | Yes | Yes | Default case `case-01` pre-selected |
| `/demo-browser` | Yes | Yes | TC-01 card present; links to `real_cases/CASE01_HEMRAJ_STATE_2025` |
| `/case/case-01/dashboard` | Yes | Yes | See data-layer finding D1 below |
| `/case/case-01/timeline` | Yes | Yes | Shows "No timeline events recorded yet" (D1) |
| `/case/case-01/case-law` | Yes | Yes | Shows "No precedents matched yet" (D1) |
| `/case/case-01/discharge-application` | Yes | Yes | Full bilingual Hindi/English draft (~20 kB text) from `data/caseData.ts` |
| `/case/case-01/verification` | Yes | Yes | Verification tiers render |
| `/case/TC-01/dashboard` | Yes | Yes | Identical output to `case-01` — see D2 |
| `/review-queue`, unknown route (NotFound) | Yes | — | NotFound page renders inside SPA shell |

Zero JavaScript errors on any route, both viewports. **Dependency pinning has not broken CASE_01 or TC-01 loading.**

### Data-layer observations surfaced while verifying (documented, not fixed — Week 2 scope)
| # | Finding |
|---|---|
| D1 | `defaultCase` in `lib/case-store.ts` (id `case-01`) has `files: []`, `citations: []` and **no `timeline`, `caseLaw`, `standards`, `documents`**. So the *dynamic* dashboard for Hemraj shows **0 Documents / 0 Citations / 0 Standards / 0 Timeline Events and a red "LOW ACCURACY 0.0/10"** on a fresh browser, while the *static* pages (`DischargeApplication`, `CrossReferenceMatrix`, `CaseResearch`, LDR_* pages) render the full Hemraj dossier from hard-coded `data/caseData.ts`. The rich record lives only in `data/demo-cases/demo01.ts` (`TC-01`) and is not what `case-01` points to. This is exactly the "Case 01 hard-coded into components" problem standing rule 4 warns about; it is the top input for Week 2's multi-case data layer. |
| D2 | `/case/:id/*` routes ignore `:id`. `DynamicDashboardView` (and siblings) read `selectedCase` from `CaseContext`, so `/case/TC-01/dashboard` renders whatever case is selected in the sidebar. Deep links and the future Test Data Browser "Load" action will need the route param to drive context (Week 2.3 / 2.4). |
| D3 | Accuracy signal is *shown*, not hidden (rule 9 respected), but a 0.0/10 for the flagship case on first load is misleading to a demo audience. Do not suppress the badge — fix the data source. |

---

## 4. Proposals for a future "Recent Cases" widget (Week 2.6 — proposal only, NOT implemented)

1. **Persist recency in the existing store, not a new one.** Add `lastOpenedAt: string` to `CaseRecord` and update it inside `CaseContext.setSelectedCaseId`. The widget then becomes `cases.sort(by lastOpenedAt).slice(0, 5)` — no second localStorage key, no drift between "cases" and "recent cases", and it survives the planned backend sync because it is just another field on the record.
2. **Make every row carry its trust signals.** Each entry should show: bilingual title, court, `[DEMO]`/SYNTHETIC badge when `isDemo`, verification summary (`n VERIFIED · n SECONDARY · n PENDING` using the existing `status-badge`/`accuracy-badge`), and relative time ("2 दिन पहले / 2 days ago"). Never show a recent case without its synthetic marker or its verification counts — this keeps rule 3 and rule 9 intact on the Home page.
3. **Design the empty and loading states first, bilingually, using one shared component.** The widget's empty state ("No recent cases — load the Hemraj demo or start an intake / कोई हाल का केस नहीं…") should be the first real consumer of a fixed `EmptyState` (bilingual props, `role="status"`, `aria-live="polite"`, `Button asChild`), with a primary CTA "Load Demo Case (Hemraj – Synthetic)" and a secondary "New Case Intake". Its skeleton should reuse `ui/skeleton.tsx` with `aria-hidden` and `motion-reduce:animate-none`. This gives Kiro's empty-state consolidation a concrete anchor and gives Week 2 Demo Mode its ≤3-click entry point from Home.

---

## 5. Residual risks

| Risk | Impact | Owner / when |
|---|---|---|
| Dormant nested `artifacts/legal-luminaire/netlify.toml` could be picked up if base dir is changed in the Netlify UI | Broken deploy (no install step) | Kiro, Week 1 close-out |
| `DemoBanner` not mounted; demo labelling depends on `[DEMO]` title prefix only | Rule 3 (SYNTHETIC/DEMO labelling) weakly enforced | Devin, Week 2.2 |
| Hemraj `case-01` record is empty in the dynamic store (D1) → dashboard shows zeros / LOW ACCURACY | Poor first impression; misleading accuracy signal | Devin, Week 2.4 |
| `/case/:id/*` ignores `:id` (D2) | Deep links / Test Data Browser cannot switch case | Devin, Week 2.3–2.4 |
| All loaders/empty states English-only and without ARIA status | Rule 2 + accessibility | Kiro (implementation), Devin (audit) |
| Charges array rendered as concatenated string (M3) | Cosmetic but visible on flagship dashboard | Kiro, quick fix |
| No `prefers-reduced-motion` handling | Accessibility (vestibular) | Kiro, quick fix |
| `puppeteer` postinstall ignored by pnpm 10 | None for SPA; would surface only if scripts run on Netlify | Monitor |

---

## Acceptance (Week 1)
- [x] Independent Netlify verification completed (build, publish dir, redirects, typecheck, 343 tests, runtime smoke)
- [x] Audit file committed with findings (this document)
- [x] No Week 2+ work performed
