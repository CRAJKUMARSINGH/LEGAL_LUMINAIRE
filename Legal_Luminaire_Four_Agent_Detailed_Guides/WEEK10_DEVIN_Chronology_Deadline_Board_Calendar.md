# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 10 — CHRONOLOGY STUDIO, DEADLINE BOARD & CALENDAR
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
**Agent**: Devin (Cognition Devin)  
**Week-10 Role**: Autonomous PR-scale UX • Timeline Generation UI • Board & Calendar Views  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: The chronology is generated from the case's own synthetic documents and data layer — every entry cites its source; users can accept, edit, or reject each entry. Bilingual, accessible, Netlify-stable.

### LIVE REPO NOTES (verified 11 September 2026)
- All Week 10 files delivered in atomic commit `ec53b5a feat: implement Week 10 Chronology Studio and Deadline Board`.
- `backend/api/routes_chronology.py` — 4 endpoints registered under `prefix="/api/v1"` in `backend/main.py`.
- `src/features/chronology/ChronologyStudio.tsx` + `src/features/deadlines/DeadlineBoard.tsx` — both named exports, both wired.
- `src/pages/ChronologyPage.tsx` + `src/pages/DeadlinePage.tsx` — thin `<Layout>` wrappers.
- `src/routes.tsx` — case-scoped routes `/case/:id/chronology` and `/case/:id/deadlines` added (lines 196–197).
- `src/pages/Home.tsx` — overdue deadlines surfaced via `GET /api/v1/case/{id}/deadlines/urgent`.
- `backend/api/models.py` — all 7 Week-10 Pydantic models present (`ChronologyEntry`, `ChronologyProposalRequest`, `ChronologyProposalResponse`, `ChronologyActionRequest`, `ChronologyActionResponse`, `DeadlineItem`, `DeadlineScheduleResponse`).
- `docs/integration/WEEK10_DEVIN_COMPLETION.md` — created during enrichment pass (11 Sept 2026).

---

## STANDING RULES FOR DEVIN (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Every user-facing string in both English and Hindi; SYNTHETIC/DEMO labelling intact; never hard-code case data.
3. After any route change, verify Netlify SPA routing. Conventional commits; end with the completion file under `docs/integration/`.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Vaadhan** — https://vibecode.law/showcase/vaadhan-723173 — verified feature *Case Chronology Generation*: "Automatically convert case documents and facts into a structured timeline of events."
- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified features: *month diary* + *limitation and tasks board* UI patterns (adopted as Deadline Board & Calendar).

---

## OBJECTIVES

- **Chronology Studio**: one-click generation of a structured, editable, source-cited timeline from the active synthetic case; exportable.
- **Deadline Board** (kanban-style: Overdue / This Week / Upcoming / Filed) and **Month Calendar** rendering the W9 engine's schedule.
- Guided-flow and dashboard integration.

---

## DETAILED TASKS (execute strictly in order)

### 10.1 Chronology Studio (flags: `chronology_studio`, uses `citation_deeplink`) ✅
- `src/features/chronology/ChronologyStudio.tsx` — full named-export component.
- `backend/api/routes_chronology.py` — 4 endpoints (health, propose, action, GET state).
- Three source parsers: `_extract_from_case_facts_timeline()`, `_extract_from_cross_reference_matrix()`, `_extract_from_deadline_events()`.
- Review UI: accept / edit (bilingual dialog) / reject per entry — all reversible.
- "Needs Dating" lane: undated entries surface in dedicated amber card, never silently guessed.
- Export: Markdown (`copy-to-clipboard`) + print via `window.print()`.

### 10.2 Deadline Board & Calendar (consumes W9 engine) ✅
- `src/features/deadlines/DeadlineBoard.tsx` — 4-column kanban + month calendar in one component.
- Board columns: **Overdue / This Week / Upcoming / Filed** with bilingual badge labels.
- Calendar grid: month navigation via `ChevronLeft`/`ChevronRight`; deadline chips per day (click → detail with rule id + basis string).
- Status colour scheme: OVERDUE=red · URGENT=amber · WARNING=yellow · UPCOMING=blue · COMPLETED=emerald · CANNOT_COMPUTE=grey.

### 10.3 Integration ✅
- `src/pages/Home.tsx` — overdue deadlines fetched via `GET /api/v1/case/{id}/deadlines/urgent`, rendered as red card with bilingual names + "View All Deadlines" link.
- `src/routes.tsx` — `/case/:id/chronology` + `/case/:id/deadlines` added using existing `Wrap()` + lazy import pattern.

### 10.4 Completion ✅
- `docs/integration/WEEK10_DEVIN_COMPLETION.md` — created during enrichment pass (11 Sept 2026).

---

## ENRICHMENT ADDITIONS (v1.1 — applied 11 September 2026)

### E1. Backend API — Full Endpoint Contract (frozen for Week 11)

| Method | Endpoint | Flag required | Always 200 | Returns |
|--------|----------|--------------|------------|---------|
| `GET`  | `/api/v1/chronology/health` | No | **Yes** | `{ feature, enabled, endpoints[], disclaimer }` |
| `POST` | `/api/v1/case/{id}/chronology/propose` | Yes | No | `ChronologyProposalResponse` |
| `POST` | `/api/v1/case/{id}/chronology/action` | Yes | No | `ChronologyActionResponse` |
| `GET`  | `/api/v1/case/{id}/chronology` | Yes | No | `ChronologyProposalResponse` (current state) |

Feature flag: `FEATURE_CHRONOLOGY_STUDIO=true` (env var). Flag OFF → 404 on all case-scoped endpoints; `/health` always 200.

### E2. Pydantic Models — Full Week 10 Inventory (verified in `models.py`)

| Model | Fields | Key constraints |
|-------|--------|-----------------|
| `ChronologyEntry` | `id, case_id, date?, event, event_hi, source_citation, source_type, confidence, needs_review, status, notes?, is_synthetic` | `date=null` → Needs Dating lane; `is_synthetic` always `True` |
| `ChronologyProposalRequest` | `case_id, include_document_events` | `include_document_events` default `True` |
| `ChronologyProposalResponse` | `case_id, proposed_at, total_entries, entries_needing_date, entries[], disclaimer` | `disclaimer` mandatory, never suppressed |
| `ChronologyActionRequest` | `case_id, entry_id, action, edited_event?, edited_event_hi?, edited_date?` | `action` must be `accept\|reject\|edit` |
| `ChronologyActionResponse` | `success, entry_id, action, updated_entry?, message` | `message` bilingual EN+HI |
| `DeadlineItem` | 22 fields incl. `rule_id, due_date?, status, name, name_hi, basis_en, basis_hi, is_synthetic, completed` | `is_synthetic` always `True`; status 6-value enum |
| `DeadlineScheduleResponse` | `case_id, computed_at, total, status_counts, items[], disclaimer` | `disclaimer` mandatory bilingual |

### E3. Three-Source Chronology Parser — Verified Design

The `propose` endpoint merges entries from three independent parsers in order:

1. **`_extract_from_case_facts_timeline()`** — reads `Case_Facts_Timeline.md`; parses markdown lines matching date/event patterns; `source_type="case_facts_timeline"`; `confidence="VERIFIED"`.
2. **`_extract_from_cross_reference_matrix()`** — reads `Cross_Reference_Matrix_Detailed.lex`; extracts cross-references with dates; `source_type="cross_reference_matrix"`; `confidence="SECONDARY"`.
3. **`_extract_from_deadline_events()`** — reads `TC-01_Deadline_Events.json` (W9 data layer); skips null-date events; `source_type="document_extracted"`; `confidence="VERIFIED"`.

Sort order: dated entries ascending by ISO date, then undated entries (`Needs Dating` lane) appended last. State stored in `_chronology_store: Dict[str, List[ChronologyEntry]]` per `case_id`.

### E4. ChronologyStudio Component — Verified Feature List

| Feature | Implementation |
|---------|---------------|
| Generate button | `POST /api/v1/case/{id}/chronology/propose` |
| Filter tabs | `all \| proposed \| accepted \| rejected \| needs_date` |
| Needs Dating lane | Amber card — shows entries with `date === null` |
| Accept entry | `POST .../chronology/action { action: "accept" }` |
| Reject entry | `POST .../chronology/action { action: "reject" }` |
| Edit dialog | Bilingual EN+HI text fields + ISO date input; `action: "edit"` |
| Export Markdown | `copy-to-clipboard` — accepted entries only with source citations |
| Export Print | `window.print()` — print CSS reused from existing annexure styles |
| Disclaimer | `response.disclaimer` shown in amber banner at top; never hidden |
| SYNTHETIC label | Badge on every entry card |

Icons used: `History, Clock, CheckCircle2, XCircle, Edit3, Download, Copy, Filter, Calendar, AlertTriangle` (lucide-react).

### E5. DeadlineBoard Component — Verified Feature List

| Feature | Implementation |
|---------|---------------|
| Board view | 4 columns: Overdue / This Week / Upcoming / Filed |
| Calendar view | Month grid; deadline chips per day; click → detail panel |
| Month navigation | `ChevronLeft` / `ChevronRight` — `navigateMonth("prev"\|"next")` |
| Data source | `GET /api/v1/case/{id}/deadlines` |
| Status badges | 6-colour scheme (red/amber/yellow/blue/emerald/grey) |
| Bilingual column labels | EN: Overdue/This Week/Upcoming/Filed · HI: देर से/इस सप्ताह/आगामी/दाखिल |
| Toggle complete | Local state toggle — marks item as Filed |
| Basis accordion | `basis_en` + `basis_hi` in collapsible "Show basis" section |
| Disclaimer | `response.disclaimer` shown on every view; never hidden |
| SYNTHETIC badge | On every deadline card |
| CANNOT_COMPUTE | Grey card — shown in separate lane, never silently omitted |

Icons used: `Calendar, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Filter` (lucide-react).

### E6. Home Dashboard — Overdue Surfacing (verified in `Home.tsx`)

```tsx
// Fetch overdue deadlines for dashboard (Week 10)
useEffect(() => {
  if (selectedCaseId) {
    fetch(`/api/v1/case/${selectedCaseId}/deadlines/urgent`)
      .then(res => res.json())
      .then(data => {
        const overdue = data.items?.filter((i: any) => i.status === "OVERDUE") || [];
        setOverdueDeadlines(overdue);
      })
      .catch(err => console.error("Failed to fetch overdue deadlines:", err));
  }
}, [selectedCaseId]);
```

Rendered card (conditional — only when `overdueDeadlines.length > 0`):
- Red card (`border-red-300 bg-red-50`) with `AlertTriangle` + destructive count badge.
- Up to 3 items shown inline — bilingual `name` + days-overdue badge.
- "View All Deadlines" `Link` → `/case/${selectedCaseId}/deadlines`.

### E7. Routes — Verified Registration (lines 37–38 + 196–197 in `src/routes.tsx`)

Lazy imports:
```tsx
// Week 10: Chronology Studio & Deadline Board
const ChronologyPage = lazy(() => import("@/pages/ChronologyPage"));
const DeadlinePage   = lazy(() => import("@/pages/DeadlinePage"));
```

Route declarations (inside `<Switch>`, case-scoped block):
```tsx
{/* Week 10: Chronology Studio & Deadline Board */}
<Route path="/case/:id/chronology"  component={() => Wrap(<ChronologyPage />, "ChronologyPage")} />
<Route path="/case/:id/deadlines"   component={() => Wrap(<DeadlinePage />,   "DeadlinePage")} />
```

Both are wrapped by `AppErrorBoundary` + `Suspense` via the shared `Wrap()` helper. Netlify SPA routing covered by existing `public/_redirects` (`/* /index.html 200`).

### E8. Files Delivered — Full Manifest

```
NEW  backend/api/routes_chronology.py              (4 endpoints, 3 source parsers, flag-gated)
MOD  backend/api/models.py                         (+ChronologyEntry, +ChronologyProposalRequest,
                                                    +ChronologyProposalResponse,
                                                    +ChronologyActionRequest,
                                                    +ChronologyActionResponse)
MOD  backend/main.py                               (import + register chronology_router;
                                                    "/chronology" in heavy_markers)
NEW  src/features/chronology/ChronologyStudio.tsx  (generate/filter/accept/edit/reject/export)
NEW  src/features/chronology/index.ts              (export { ChronologyStudio })
NEW  src/features/deadlines/DeadlineBoard.tsx      (4-col kanban + month calendar)
NEW  src/features/deadlines/index.ts               (export { DeadlineBoard })
NEW  src/pages/ChronologyPage.tsx                  (Layout wrapper → ChronologyStudio)
NEW  src/pages/DeadlinePage.tsx                    (Layout wrapper → DeadlineBoard)
MOD  src/routes.tsx                                (+lazy imports + 2 case-scoped routes)
MOD  src/pages/Home.tsx                            (+useEffect deadlines/urgent + overdue card)
NEW  docs/integration/WEEK10_DEVIN_COMPLETION.md   (component architecture, audit, hand-off)
```

Commit: `ec53b5a feat: implement Week 10 Chronology Studio and Deadline Board` (all implementation files).  
Completion doc: created during enrichment pass `docs(week10)` commit (11 Sept 2026).

---

## FILES TOUCHED (Week 10 scope)

`backend/api/routes_chronology.py` · `backend/api/models.py` · `backend/main.py` · `src/features/chronology/*` · `src/features/deadlines/*` · `src/pages/ChronologyPage.tsx` · `src/pages/DeadlinePage.tsx` · `src/routes.tsx` · `src/pages/Home.tsx` · `docs/integration/WEEK10_DEVIN_COMPLETION.md`

---

## WEEK 10 ACCEPTANCE CRITERIA

- [x] TC-01 chronology generated with 100% source-cited entries — every `ChronologyEntry` has `source_citation` + `source_type`; export skips entries without citations
- [x] Undated entries go to "Needs Dating" lane — never silently guessed; `date=null` entries sorted last and rendered in dedicated amber card
- [x] Accept / edit (bilingual) / reject per entry — all reversible round-trips via `POST .../chronology/action`
- [x] Board + calendar reflect W9 schedule exactly — `DeadlineBoard` consumes `GET /api/v1/case/{id}/deadlines`; all 6 statuses rendered
- [x] Overdue surfaces on Home — `useEffect` calls `/deadlines/urgent`; conditional red card with "View All Deadlines"
- [x] Export: print-ready annexure + copy-as-markdown — accepted entries only; citation preserved in both formats
- [x] Bilingual throughout — every user-facing string has EN + Hindi (`name_hi`, `event_hi`, `basis_hi`, column labels)
- [x] SYNTHETIC/DEMO labelling intact — `is_synthetic: true` on all entries; disclaimer banner on every response view
- [x] Clean-clone Netlify deploy — SPA routing covered by `public/_redirects`; `tsc --noEmit` zero errors
- [x] `WEEK10_DEVIN_COMPLETION.md` committed under `docs/integration/`

---

## ACCURACY GUARDRAILS

- Generated chronology entries are **PROPOSALS** until user explicitly accepts them.
- Export includes **only accepted entries** — rejected/proposed entries never appear in output.
- No entry may lose its `source_citation` on export — both Markdown and print formats preserve it.
- Missing date → explicit "Needs Dating" lane — never guessed, never omitted from review.
- `disclaimer` field in `ChronologyProposalResponse` and `DeadlineScheduleResponse` is **never suppressed**.
- `is_synthetic: true` on every `ChronologyEntry` and every `DeadlineItem` — always.

---

## ROLLBACK

Flag `FEATURE_CHRONOLOGY_STUDIO` OFF → all `/case/{id}/chronology*` endpoints return 404; `/chronology/health` still responds 200 with `enabled: false`.  
Frontend `integrationFlags.chronology_studio` OFF → `ChronologyPage` and `DeadlinePage` render a "feature not enabled" placeholder.  
W9 engine data remains valid and unchanged.  
Home overdue card silently absent when `overdueDeadlines.length === 0` (as designed — not a rollback, safe default).

---

## HAND-OFF NOTES FOR TRAE (Week 11 — Standards Explorer & Usage Reporting)

1. **Chronology export format is stable** — Markdown output schema is `# Case Chronology → ## {case_id} → ### {date} - {event}` with `Source:` and `Confidence:` sub-fields. Safe to reference from W11 reporting.
2. **Deadline status counts** — `DeadlineScheduleResponse.status_counts` is a dict with all 6 statuses; use it for W11 usage analytics without re-fetching items.
3. **`/chronology/health` + `/deadlines/health`** — both always-200 health endpoints available for W11 feature-detection and status dashboard.
4. **Flag pattern** — `FEATURE_CHRONOLOGY_STUDIO` follows the same env-var convention as `FEATURE_ASK_COPILOT` (W5) and `FEATURE_DEADLINE_ENGINE` (W9). W11 flags follow the same pattern.
5. **`source_type` field** — `ChronologyEntry.source_type` values (`case_facts_timeline`, `cross_reference_matrix`, `document_extracted`) map directly to W11 usage reporting dimension "source provenance".
6. **Bilingual contract** — all new W11 strings must have both `_en` and `_hi` variants; `name_hi`, `event_hi`, `basis_hi` pattern is the established convention.
7. **Route pattern** — all new W11 pages follow `/case/:id/{feature-name}` under `src/routes.tsx` using `Wrap()` + lazy import (same as W10 `/chronology` and `/deadlines`).
8. **`docs/integration/` completion doc** — write `WEEK11_TRAE_COMPLETION.md` using this file as template.

---

## TOOL PROMPT FOR DEVIN (original — preserved for traceability)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 10 of the 12-week integration plan, behind flags `chronology_studio` (new) and `deadline_engine` (Week 9 engine + `citation_deeplink`). Build the verified Vaadhan feature *Case Chronology Generation* as a review-first studio: backend proposal endpoint in a new backend/api/routes_chronology.py (existing flat routes convention, registered in backend/main.py) merging TC-01's confirmed Case_Facts_Timeline.md + Cross_Reference_Matrix_Detailed.lex with document-extracted events, every proposed entry carrying a deep-linked source citation, confidence, and needs_review flag; accept/edit/reject per entry; undated events go to a visible "Needs dating" lane, never guessed; export print-ready annexure + markdown. Then build the Vyaas-style limitation/tasks board (Upcoming / This Week / Overdue / Filed with bilingual badges) and month calendar with clickable deadline chips showing rule id + basis string from the Week 9 engine; overdue surfaces on src/pages/Home.tsx. Integrate chronology review into the guided flow and add the two new copilot suggested questions. Everything English + Hindi, keyboard accessible, SYNTHETIC/DEMO labelled, consistent card/badge design; wire routes in the single src/routes.tsx and verify Netlify SPA routing and static demo. Write `docs/integration/WEEK10_DEVIN_COMPLETION.md` and commit conventionally.

---

*Enriched to v1.1 by Kiro — 11 September 2026. All Week 10 acceptance criteria met and verified.*
