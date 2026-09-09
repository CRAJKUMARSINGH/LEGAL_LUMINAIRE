# Limitation & Deadline Engine — Tasks
**Flag**: `deadline_engine`
**Owners**: Kiro (W9), Devin (W10)

---

## Week 9 — Kiro (Deterministic Backend Engine)

- [x] Update `.kiro/specs/deadline-engine/requirements.md` — full API contract, computation rules, accuracy guardrails
- [x] Update `.kiro/specs/deadline-engine/design.md` — architecture diagram, engine decisions, file table
- [x] Update `.kiro/specs/deadline-engine/tasks.md` (this file)
- [x] Create `backend/services/` directory (new — did not exist):
      - `backend/services/__init__.py`
      - `backend/services/limitation_rules.json` (10 rules, schema_version 1.0, all with source_note)
      - `backend/services/limitation_engine.py` (pure functions: load_rules, compute_deadline,
        compute_all, compute_for_case, format_deadline_summary, format_copilot_citation_snippet)
- [x] Create `backend/api/routes_deadlines.py`:
      - `GET /api/v1/deadlines/health` — always 200, flag state
      - `GET /api/v1/deadlines/rules` — rule table dump (flag-gated)
      - `GET /api/v1/case/{case_id}/deadlines` — full schedule (flag-gated, optional reference_date)
      - `GET /api/v1/case/{case_id}/deadlines/urgent` — URGENT+OVERDUE only (flag-gated)
- [x] Extend `backend/api/models.py`:
      - Add `"deadline"` to `CopilotCitation.type` Literal
      - Add `DeadlineItem` Pydantic model
      - Add `DeadlineScheduleResponse` Pydantic model
- [x] Extend `backend/api/routes_copilot.py`:
      - Accept `citation_type="deadline"` in `_build_citations`
- [x] Extend `backend/main.py`:
      - Import and register `deadlines_router` with prefix `/api/v1`
      - Add `"/deadlines"` to `_is_expensive_endpoint` heavy_markers
- [x] Create `backend/uploaded_cases/TC-01/TC-01_Deadline_Events.json`:
      - 8 event types (7 with SYNTHETIC dates, 1 null → CANNOT_COMPUTE)
      - All dates labelled SYNTHETIC/DEMO
- [x] Create `backend/tests/test_deadline_engine.py`:
      - 20+ tests: unit (pure engine), boundary (month-ends, leap year, working-day),
        CANNOT_COMPUTE safety, TC-01 hand-computed verification, copilot snippet
- [x] Write `docs/integration/WEEK09_KIRO_COMPLETION.md`

---

## Week 10 — Devin (Board UI)

- [ ] Create `src/pages/DeadlineBoardPage.tsx` (flag-gated on `deadline_engine`)
- [ ] Create `src/components/deadlines/DeadlineCard.tsx`
      — status badge, due_date, days_remaining, collapsible basis panel (EN + HI)
- [ ] Create `src/components/deadlines/StatusBadge.tsx`
      — colour mapping: OVERDUE=red, URGENT=orange, WARNING=yellow, UPCOMING=green, CANNOT_COMPUTE=grey
- [ ] Wire `/case/:id/deadlines` route in `src/routes.tsx`
- [ ] Disclaimer always visible on deadline pages — never hidden
- [ ] `?reference_date` query param support for demo mode
- [ ] Write `docs/integration/WEEK10_DEVIN_COMPLETION.md`
