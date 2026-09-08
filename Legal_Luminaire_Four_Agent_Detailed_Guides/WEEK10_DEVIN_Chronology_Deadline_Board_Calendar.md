# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 10 — CHRONOLOGY STUDIO, DEADLINE BOARD & CALENDAR
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Devin (Cognition Devin)  
**Week-10 Role**: Autonomous PR-scale UX • Timeline Generation UI • Board & Calendar Views  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: The chronology is generated from the case’s own synthetic documents and data layer — every entry cites its source; users can accept, edit, or reject each entry. Bilingual, accessible, Netlify-stable.

### LIVE REPO NOTES (verified 8 September 2026)
- Timeline source material CONFIRMED in the tree: `backend/uploaded_cases/TC-01/Case_Facts_Timeline.md` and `TC-01/Cross_Reference_Matrix_Detailed.lex` — the proposal endpoint merges these, not an assumed timeline module.
- Backend proposal router follows the flat convention: new `backend/api/routes_chronology.py`, registered in `backend/main.py`.
- `src/` is pages-based with single `src/routes.tsx`; Home is `src/pages/Home.tsx` (confirmed). Completion file at repo-root `docs/integration/`.

---

## STANDING RULES FOR DEVIN (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Every user-facing string in both English and Hindi; SYNTHETIC/DEMO labelling intact; never hard-code case data.
3. After any route change, verify Netlify SPA routing. Conventional commits; end with the completion file under `docs/integration/`.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Vaadhan** — https://vibecode.law/showcase/vaadhan-723173 — verified feature *Case Chronology Generation*: “Automatically convert case documents and facts into a structured timeline of events.”
- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified features: *month diary* + *limitation and tasks board* UI patterns (adopted as Deadline Board & Calendar).

## OBJECTIVES

- **Chronology Studio**: one-click generation of a structured, editable, source-cited timeline from the active synthetic case; exportable.
- **Deadline Board** (kanban-style: Upcoming / This Week / Overdue / Filed) and **Month Calendar** rendering the W9 engine’s schedule.
- Guided-flow and dashboard integration.

## DETAILED TASKS (execute strictly in order)

### 10.1 Chronology Studio (flags: `chronology_studio`, uses `citation_deeplink`)
- `src/features/chronology/`:
  - Generation: backend proposal endpoint `POST /api/v1/case/{case_id}/chronology/propose` (new flat router `backend/api/routes_chronology.py`) merges the confirmed TC-01 timeline assets (`Case_Facts_Timeline.md`, `Cross_Reference_Matrix_Detailed.lex`) with Week-3-extracted document events; every proposed entry carries `{date?, event, source_citation (deep-link), confidence, needs_review}`.
  - Review UI: accept / edit / reject per entry (reversible); accepted entries form the official chronology; rejected entries logged.
  - Export: print-ready chronological annexure (reuses existing print CSS), plus copy-as-markdown.
- Entries with missing dates appear in a “Needs dating” lane — never silently guessed.

### 10.2 Deadline Board & Calendar (consumes W9 engine)
- Board view grouping the deadline schedule into Upcoming / This Week / Overdue / Filed with bilingual status badges; consistent with the CVA card/badge system.
- Month calendar grid with deadline chips (click → deadline detail with rule id + basis string); keyboard navigable; month navigation.
- Overdue items surface in the Home dashboard task cards (`src/pages/Home.tsx`).

### 10.3 Integration
- Guided flow: chronology review becomes a step between Research and Draft (flag-aware).
- Copilot: suggested questions now include “What happened after the arrest?” (cites chronology entries) and “What is due this week?” (cites deadline engine).

### 10.4 Completion
```
docs/integration/WEEK10_DEVIN_COMPLETION.md
```
Include: component architecture, review-workflow decisions, export quality checks, accessibility + bilingual audit, Netlify status, hand-off notes for Trae (W11).

## FILES TOUCHED
`src/features/chronology/*`, `src/features/deadlines/*` (new, wired via `src/routes.tsx`) • `backend/api/routes_chronology.py` (flat convention) • guided-flow step • `src/pages/Home.tsx` cards • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR DEVIN (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 10 of the 12-week integration plan, behind flags `chronology_studio` (new) and `deadline_engine` (Week 9 engine + `citation_deeplink`). Build the verified Vaadhan feature *Case Chronology Generation* as a review-first studio: backend proposal endpoint in a new backend/api/routes_chronology.py (existing flat routes convention, registered in backend/main.py) merging TC-01’s confirmed Case_Facts_Timeline.md + Cross_Reference_Matrix_Detailed.lex with document-extracted events, every proposed entry carrying a deep-linked source citation, confidence, and needs_review flag; accept/edit/reject per entry; undated events go to a visible “Needs dating” lane, never guessed; export print-ready annexure + markdown. Then build the Vyaas-style limitation/tasks board (Upcoming / This Week / Overdue / Filed with bilingual badges) and month calendar with clickable deadline chips showing rule id + basis string from the Week 9 engine; overdue surfaces on src/pages/Home.tsx. Integrate chronology review into the guided flow and add the two new copilot suggested questions. Everything English + Hindi, keyboard accessible, SYNTHETIC/DEMO labelled, consistent card/badge design; wire routes in the single src/routes.tsx and verify Netlify SPA routing and static demo. Write `docs/integration/WEEK10_DEVIN_COMPLETION.md` and commit conventionally.

## WEEK 10 ACCEPTANCE CRITERIA
- [ ] TC-01 chronology generated with 100% source-cited entries; accept/edit/reject round-trips
- [ ] Board + calendar reflect the W9 schedule exactly; overdue surfaces on Home
- [ ] Guided flow includes chronology review; new copilot questions cite correctly
- [ ] Clean-clone Netlify deploy succeeds; `WEEK10_DEVIN_COMPLETION.md` committed

## ACCURACY GUARDRAILS
Generated chronology entries are PROPOSALS until accepted; export includes only accepted entries; no entry may lose its citation on export.

## ROLLBACK
Flag OFF removes the studio, board, calendar, and guided-flow step; engine data (W9) remains valid and unused.
