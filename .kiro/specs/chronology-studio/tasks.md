# Chronology Studio — Tasks
**Flag**: `chronology_studio`
**Owner**: Kiro (Week 10)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**Depends on**: `featureFlags.ts` (Week 1), `ChronologyPage.tsx` (existing Week 10 stub), `react-big-calendar` (already in tree), `luxon` localizer (already in tree)

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.chronology_studio` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm `src/pages/ChronologyPage.tsx` exists (Week 10 stub) — extend it, do not replace
- [ ] Confirm `react-big-calendar` and `luxon` are in `package.json` and resolve cleanly
- [ ] Confirm `/case/:id/chronology` route is wired in `routes.tsx`
- [ ] Confirm `backend/api/models.py` compiles before adding `ChronologyEntry`

---

## T10.1 — Types
- [ ] Create `src/types/chronology.ts` (new file)
  - Export `ChronologyEntry`, `ChronologyEventType` (14-value union), `ChronologyPhase` (5-value union)
  - See design.md for full interface definition
- [ ] Add `ChronologyEntry` to `src/types/index.ts` barrel export if one exists

## T10.2 — Backend: Data model
- [ ] Add `ChronologyEntry` Pydantic model to `backend/api/models.py`
  - Fields: `id` (uuid default), `case_id`, `date` (ISO-8601 date-only string), `event_type`, `event_type_hi`, `description` (max 500), `description_hi?`, `legal_significance?` (max 300), `event_phase`, `sort_order`, `linked_citation_id?`, `created_at`, `updated_at`
  - `ConfigDict(extra="forbid")`
- [ ] Add `ChronologyEntryUpdate` model for `PUT` endpoint (all fields optional except `id`)

## T10.3 — Backend: CRUD router
- [ ] Create `backend/api/routes_chronology.py` (flat convention)
  - `GET  /api/v1/cases/{case_id}/chronology` → returns list of `ChronologyEntry` sorted by `date`
  - `POST /api/v1/cases/{case_id}/chronology` → creates entry, validates `case_id`, returns created entry
  - `PUT  /api/v1/cases/{case_id}/chronology/{entry_id}` → partial update (PATCH semantics via optional fields)
  - `DELETE /api/v1/cases/{case_id}/chronology/{entry_id}` → soft-delete or hard-delete (document in completion report)
  - All 4 endpoints: check `FEATURE_CHRONOLOGY_STUDIO` env flag → 404 if OFF
  - Validate `date` is a valid ISO-8601 date-only string (reject date-times)
- [ ] Register router in `backend/main.py` under prefix `/api/v1`

## T10.4 — Frontend: API client
- [ ] Add `getChronologyEntries()`, `createChronologyEntry()`, `updateChronologyEntry()`, `deleteChronologyEntry()` to `src/lib/api.ts`
  - All functions check `integrationFlags.chronology_studio` and throw if OFF

## T10.5 — Frontend: EntryEditor modal
- [ ] Create `src/components/chronology/EntryEditor.tsx`
  - Props: `entry?: ChronologyEntry` (undefined = new), `caseId: string`, `onSave`, `onClose`
  - Fields: DatePicker (date-only, no time), EventTypeSelect (bilingual options), Phase select, Description textarea (max 500), Legal Significance textarea (max 300), optional LinkedCitationId input
  - If `linkedCitationId` is set: resolve and show citation status badge inline (COURT_SAFE/VERIFIED/SECONDARY/PENDING/FATAL_ERROR)
  - If linked citation is PENDING or FATAL_ERROR: show bilingual warning *"Linked citation unverified — remove before filing / लिंक किया गया उद्धरण असत्यापित है"*
  - Save button disabled while API call in flight
  - `role="dialog"`, `aria-labelledby`, focus trap on open, close on Escape

## T10.6 — Frontend: ChronologyListView
- [ ] Create `src/components/chronology/ChronologyListView.tsx`
  - Sortable table: Date | Event Type (EN + HI) | Phase | Description | Legal Significance | Actions
  - Default sort: date ascending
  - Edit icon → opens `EntryEditor` modal
  - Delete icon → confirmation dialog (bilingual) → calls `deleteChronologyEntry()`
  - Empty state: bilingual prompt to add first entry

## T10.7 — Frontend: ChronologyBoardView
- [ ] Create `src/components/chronology/ChronologyBoardView.tsx`
  - 5 Kanban columns, one per `ChronologyPhase` (bilingual headers — see design.md table)
  - Cards: date badge + event type label + first 80 chars of description
  - Drag-and-drop using `@dnd-kit/core` (check if already in tree; if not, use `react-beautiful-dnd` if present; document choice in completion report)
  - Drag updates `sortOrder` only — never `date`
  - On drop: optimistic UI update + `updateChronologyEntry({ sort_order: newOrder })`
  - Empty column: bilingual placeholder text

## T10.8 — Frontend: ChronologyCalendarView
- [ ] Create `src/components/chronology/ChronologyCalendarView.tsx`
  - Wraps `react-big-calendar` with `luxon` localizer
  - Default view: month; also support week and agenda
  - Events colour-coded by `eventPhase` (5 colours matching board column scheme)
  - Click event → opens `EntryEditor` modal in read-only mode for past entries
  - `aria-label` on calendar container: *"Chronology calendar / कालक्रम कैलेंडर"*

## T10.9 — Frontend: ViewToggle
- [ ] Create `src/components/chronology/ViewToggle.tsx`
  - 3-way toggle: List / Board / Calendar
  - Bilingual button labels: *List / सूची*, *Board / बोर्ड*, *Calendar / कैलेंडर*
  - Controlled by local `useState` in `ChronologyPage`
  - `aria-pressed` on active button

## T10.10 — Frontend: ChronologyPage extension
- [ ] Extend `src/pages/ChronologyPage.tsx` (do **not** replace)
  - Import and compose `ViewToggle`, `ChronologyListView`, `ChronologyBoardView`, `ChronologyCalendarView`
  - Wrap new views in `integrationFlags.chronology_studio` check:
    - Flag OFF → render existing stub content unchanged
    - Flag ON → render full 3-view studio
  - Add "New Entry" button → opens `EntryEditor` modal with `entry={undefined}`
  - Page `<main aria-label="Chronology Studio / कालक्रम स्टूडियो">`

## T10.11 — Testing
- [ ] Backend: unit test `POST /chronology` — assert entry stored with correct `source` and `case_id`
- [ ] Backend: unit test `PUT /chronology/{id}` — assert only `sort_order` changes on board drag (date unchanged)
- [ ] Backend: test date validation — a date-time string (with `T`) must be rejected
- [ ] Frontend: render test `ChronologyListView` with 3 entries — assert sorted by date
- [ ] Frontend: render test `EntryEditor` with PENDING linked citation — assert warning banner visible
- [ ] Frontend: render test `ChronologyPage` with flag OFF — assert original stub content rendered, no new views

## T10.12 — Completion doc
- [ ] Write `docs/integration/WEEK10_KIRO_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Document drag-and-drop library choice
  - Include files changed, CI result, hand-off notes for Week 11

---

## Acceptance Criteria
- [ ] All 3 views (List, Board, Calendar) render correctly with synthetic test data
- [ ] Board drag updates `sortOrder` only — date field unchanged
- [ ] Calendar uses `luxon` localizer — no moment or date-fns introduced
- [ ] `EntryEditor` shows PENDING/FATAL_ERROR warning for linked citations
- [ ] All views have correct bilingual labels and `aria` attributes
- [ ] `chronology_studio` flag OFF → `ChronologyPage` renders existing stub, no new components loaded
- [ ] CRUD endpoints all return 404 when flag OFF
- [ ] CI green after Week 10 changes
