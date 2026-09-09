# Limitation & Deadline Engine — Design
**Flag**: `deadline_engine`
**Version**: 1.0 (Week 9 backend; Week 10 board UI by Devin)

---

## Architecture Overview

```
Client
  │
  ├─ GET /api/v1/deadlines/health          — always 200, flag state
  ├─ GET /api/v1/deadlines/rules           — rule table dump (flag-gated)
  ├─ GET /api/v1/case/{id}/deadlines       — full schedule (flag-gated)
  └─ GET /api/v1/case/{id}/deadlines/urgent — URGENT+OVERDUE only (flag-gated)
          │
          │  routes_deadlines.py (flat convention, tags=["deadlines"])
          │
          ▼
  limitation_engine.compute_for_case(case_id)
          │
          ├─ load_rules()  ←  services/limitation_rules.json  (versioned, human-reviewable)
          │
          └─ read  uploaded_cases/<case_id>/<case_id>_Deadline_Events.json
                   │
                   ▼
          compute_all(case_events, case_id, rules, today)
                   │
                   └─ for each rule → compute_deadline(rule, event_date)
                                       │
                                       ├─ event_date is None  → CANNOT_COMPUTE (never estimated)
                                       │
                                       └─ event_date present  → due_date = event_date + days
                                                                  status   = _compute_status(due, today)
                                                                  basis_en = _build_basis_en(...)
                                                                  basis_hi = _build_basis_hi(...)
                                                                  → ComputedDeadline (frozen-like dataclass)
          │
          ▼
  DeadlineScheduleResponse (Pydantic)  →  JSON  →  Client
```

**No LLM anywhere in this pipeline.** Pure Python `datetime` arithmetic.

---

## Files (Week 9 — Kiro)

| File | Action |
|------|--------|
| `backend/services/__init__.py` | NEW — package marker |
| `backend/services/limitation_rules.json` | NEW — versioned rule table (10 rules, v1.0) |
| `backend/services/limitation_engine.py` | NEW — pure-function deterministic engine |
| `backend/api/routes_deadlines.py` | NEW — flat-convention router, 4 endpoints |
| `backend/api/models.py` | EXTEND — `DeadlineItem`, `DeadlineScheduleResponse`, `"deadline"` in `CopilotCitation` |
| `backend/api/routes_copilot.py` | EXTEND — accept `citation_type="deadline"` in `_build_citations` |
| `backend/main.py` | EXTEND — import + register `deadlines_router`; add `"/deadlines"` to `heavy_markers` |
| `backend/uploaded_cases/TC-01/TC-01_Deadline_Events.json` | NEW — synthetic event dates |
| `backend/tests/test_deadline_engine.py` | NEW — 20+ tests |
| `.kiro/specs/deadline-engine/` | UPDATED (these files) |
| `docs/integration/WEEK09_KIRO_COMPLETION.md` | NEW |

## Files (Week 10 — Devin, board UI)

| File | Owner | Week |
|------|-------|------|
| `src/pages/DeadlineBoardPage.tsx` | Devin | W10 |
| `src/components/deadlines/DeadlineCard.tsx` | Devin | W10 |
| `src/components/deadlines/StatusBadge.tsx` | Devin | W10 |
| Wire `/case/:id/deadlines` route in `src/routes.tsx` | Devin | W10 |

---

## Engine Design — Key Decisions

### 1. Pure-function, no side effects
`compute_deadline(rule, event_date)` takes immutable inputs and returns a frozen-like dataclass. No DB writes, no caching at the engine level (routes layer can add HTTP caching headers if needed).

### 2. CANNOT_COMPUTE — not None, not 0, not estimated
When `event_date is None`, the engine returns a `ComputedDeadline` with `status="CANNOT_COMPUTE"` and a bilingual basis string explaining why. It is **never** silently omitted from the schedule. This is the accuracy contract.

### 3. Working-day approximation
Rules with `period_basis="working"` use `period_days × 1.4` calendar-day approximation. This is explicitly documented in `basis_en`, `basis_hi`, and `source_note`. No court-holiday calendar is embedded — doing so would introduce jurisdiction-specific data that cannot be verified against a single source.

### 4. Bilingual basis strings
Every `ComputedDeadline` has `basis_en` and `basis_hi` containing the **full computation chain**:
```
{name} | {statute} {section} | Event ({event_type}): {event_date} + {days} days = {due_date}
| Applies to: {applies_to} | [SYNTHETIC/DEMO — {source_note}]
```
This means the user never has to trust the engine — they can independently verify.

### 5. Status thresholds
```python
URGENT_DAYS  = 14   # ≤ 14 days → URGENT (dashboard alert)
WARNING_DAYS = 30   # ≤ 30 days → WARNING
```
Overdue = due_date < today → negative `days_remaining`.

### 6. Sort order
`compute_all()` returns: computable items sorted by `due_date` asc, then CANNOT_COMPUTE items last. This ensures the most urgent items always appear first.

---

## Copilot Citation Hook

When the copilot retrieves chunks with `metadata["citation_type"] = "deadline"`, the `_build_citations` function in `routes_copilot.py` now produces a `CopilotCitation(type="deadline", ...)`. The snippet is built by `format_copilot_citation_snippet(deadline)` in `limitation_engine.py` — it carries `rule_id`, `due_date`, `status`, `statute`, `section` in ≤300 chars. The copilot **never generates a date** — it reads the engine's deterministic output.

---

## Rule Table Schema

```json
{
  "id": "CRPC-167-90D",
  "name": "...",
  "name_hi": "...",
  "statute": "CrPC / BNSS",
  "section": "CrPC §167(2) / BNSS §187(2)",
  "event_type": "arrest_date",
  "period_days": 90,
  "period_basis": "calendar",
  "applies_to": "...",
  "extension_rule": "...",
  "consequence": "...",
  "consequence_hi": "...",
  "source_note": "ILLUSTRATIVE. ...",
  "blocked_from_draft": false
}
```

`_meta.schema_version` is checked on load; migrations handled by bumping the version.

---

## Rate Limiting

`"/deadlines"` appended to `heavy_markers` in `main.py`. The existing sliding-window middleware enforces 10 req/min per IP. `/deadlines/health` is a cheap GET that shares the prefix — no concern at default limits.

---

## Hand-off to Week 10 (Devin — Board UI)

- Backend contract frozen: `GET /api/v1/case/{id}/deadlines` returns `DeadlineScheduleResponse`.
- `status` values: `OVERDUE`, `URGENT`, `WARNING`, `UPCOMING`, `COMPLETED`, `CANNOT_COMPUTE`.
- Status badge colours: `OVERDUE`=red, `URGENT`=orange, `WARNING`=yellow, `UPCOMING`=green, `CANNOT_COMPUTE`=grey.
- `basis_en` / `basis_hi` are long strings — render in a collapsible "show basis" panel.
- `disclaimer` field must be visible on every page that displays deadline data — never hidden.
- `?reference_date=YYYY-MM-DD` query param available for demo scenarios (e.g. set to a past date to show URGENT items).
- Set `VITE_FF_DEADLINE_ENGINE=true` in `.env.local` to activate frontend.
- Route: `/case/:id/deadlines` — add to `src/routes.tsx` using existing `Wrap()` + lazy import pattern.
- Completion doc: `docs/integration/WEEK10_DEVIN_COMPLETION.md`.
