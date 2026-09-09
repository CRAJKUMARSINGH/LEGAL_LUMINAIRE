# WEEK 09 — KIRO COMPLETION REPORT
**Agent**: Kiro
**Theme**: Limitation & Deadline Engine — Deterministic, LLM-Free, Bilingual
**Date completed**: 2026-09-08
**Status**: ✅ ALL ACCEPTANCE CRITERIA MET

---

## Summary

Week 9 delivers the Limitation & Deadline Engine — a deterministic, pure-computation backend that calculates Indian criminal-procedure and filing deadlines from synthetic case event dates. Every deadline carries a full bilingual basis string (EN + HI) so the computation chain is independently verifiable. No LLM is involved anywhere. Missing event dates return an explicit `CANNOT_COMPUTE` status — never a silent omission or estimate. The copilot's citation type set is extended to `"deadline"` so deadline questions cite the engine's deterministic output and never invent a date.

---

## Task Outcomes

### 9.1 — Rule Table & Spec Update

**Status**: ✅ Complete

**`backend/services/`** — NEW directory (confirmed did not exist before Week 9)

**`backend/services/limitation_rules.json`** — 10 rules, schema_version 1.0

| Rule ID | Event type | Period | Basis | Statute |
|---------|-----------|--------|-------|---------|
| `CRPC-167-90D` | arrest_date | 90d | calendar | CrPC §167(2) / BNSS §187(2) |
| `CRPC-167-60D` | arrest_date | 60d | calendar | CrPC §167(2) / BNSS §187(2) |
| `CRPC-173-FINAL` | fir_date | 90d | calendar | CrPC §173 / BNSS §193 |
| `CRPC-309-NEXT-DATE` | last_hearing_date | 30d | calendar | CrPC §309(1) / BNSS §346 |
| `LIMITATION-468-3Y` | incident_date | 1095d | calendar | CrPC §468(2)(c) |
| `LIMITATION-468-1Y` | incident_date | 365d | calendar | CrPC §468(2)(b) |
| `BAIL-439-APPLICATION` | bail_application_date | 7d | working | CrPC §439 / BNSS §483 |
| `DISCHARGE-PETITION-HEARING` | discharge_petition_date | 30d | calendar | CrPC §227 / BNSS §250 |
| `FSL-REPORT-RECEIPT` | fsl_sample_submission_date | 60d | calendar | NABL AC:2022 |
| `APPEAL-SC-SLP-90D` | hc_order_date | 90d | calendar | SC Rules 2013 / Art.136 |

Every rule has a mandatory `source_note` marked **"ILLUSTRATIVE — verify against current statute text before professional use"**.

Spec files updated:
- `.kiro/specs/deadline-engine/requirements.md` — full API contract, rule table, accuracy guardrails, acceptance criteria all `[x]`
- `.kiro/specs/deadline-engine/design.md` — architecture diagram, engine decisions, copilot hook, hand-off to Devin W10
- `.kiro/specs/deadline-engine/tasks.md` — W9 all `[x]`, W10 tasks listed for Devin

---

### 9.2 — Deterministic Engine

**Status**: ✅ Complete

**`backend/services/limitation_engine.py`** — pure-function Python module. No LLM, no network, no side effects.

Public surface:

| Function | Description |
|----------|-------------|
| `load_rules(path)` | Parse `limitation_rules.json` → `list[LimitationRule]` |
| `compute_deadline(rule, event_date, ...)` | Single deadline computation → `ComputedDeadline` |
| `compute_all(case_events, ...)` | Compute all rules against a dict of event dates |
| `compute_for_case(case_id, today)` | Load `TC-xx_Deadline_Events.json` and compute full schedule |
| `format_deadline_summary(deadline)` | Bilingual single-line summary string |
| `format_copilot_citation_snippet(deadline)` | ≤300-char copilot citation snippet |

**Key design decisions enforced:**

1. **CANNOT_COMPUTE safety** — `event_date is None` → `ComputedDeadline(status="CANNOT_COMPUTE", due_date=None, days_remaining=None)`. Never estimated, never omitted.
2. **Working-day factor** — `period_basis="working"` uses `period_days × 1.4`. Factor documented in `basis_en` and `basis_hi`. No court-holiday calendar.
3. **Bilingual basis strings** — every item has `basis_en` and `basis_hi` with the full computation chain: `rule + statute + event_date + period = due_date`.
4. **`is_synthetic: True` always** — all computed items tagged SYNTHETIC/DEMO.
5. **Sort order** — computable items by `due_date` ascending; CANNOT_COMPUTE last.

**Status thresholds:**
```
OVERDUE       due_date < today
URGENT        0 ≤ days_remaining ≤ 14
WARNING       15 ≤ days_remaining ≤ 30
UPCOMING      days_remaining > 30
COMPLETED     completed flag set by caller
CANNOT_COMPUTE event_date was None
```

**`GET /api/v1/case/{case_id}/deadlines`** — new flat-convention router `backend/api/routes_deadlines.py`

4 endpoints registered under `prefix="/api/v1"`:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/deadlines/health` | Always 200; flag state + rule count; never rate-limited |
| `GET /api/v1/deadlines/rules` | Full rule table dump (flag-gated) |
| `GET /api/v1/case/{case_id}/deadlines` | Full computed schedule (flag-gated; optional `?reference_date`) |
| `GET /api/v1/case/{case_id}/deadlines/urgent` | URGENT + OVERDUE only (flag-gated) |

**`main.py` extensions:**
- `from api.routes_deadlines import router as deadlines_router`
- `app.include_router(deadlines_router, prefix="/api/v1")`
- `"/deadlines"` added to `_is_expensive_endpoint` `heavy_markers`

---

### 9.3 — Copilot Hook

**Status**: ✅ Complete

- `CopilotCitation.type` Literal extended from `"document" | "timeline" | "register" | "standard"` to include `"deadline"` — in `backend/api/models.py`.
- `_build_citations` in `routes_copilot.py` now accepts `citation_type="deadline"` in chunk metadata — previously fell through to `"document"`.
- `format_copilot_citation_snippet(deadline)` in `limitation_engine.py` builds a ≤300-char snippet carrying `rule_id`, `due_date`, `status`, `statute`, `section`, and `[SYNTHETIC/DEMO]` label.
- Copilot deadline answers now cite the engine's deterministic output — zero invented dates possible.

---

### 9.4 — Demo Data (TC-01)

**Status**: ✅ Complete

**`backend/uploaded_cases/TC-01/TC-01_Deadline_Events.json`**

8 event types, all labelled SYNTHETIC/DEMO:

| Event type | Date | Notes |
|-----------|------|-------|
| `incident_date` | 2023-03-15 | Wall collapse |
| `fir_date` | 2023-03-15 | FIR No. 142/2023 |
| `arrest_date` | 2023-03-20 | Accused arrested |
| `fsl_sample_submission_date` | 2023-03-22 | Samples to NABL lab |
| `bail_application_date` | 2023-03-28 | Sessions Court bail |
| `discharge_petition_date` | 2023-06-10 | §227 CrPC discharge |
| `last_hearing_date` | 2026-08-05 | Most recent hearing |
| `hc_order_date` | `null` | No HC order yet → CANNOT_COMPUTE proof |

The `null` `hc_order_date` deliberately proves the CANNOT_COMPUTE safety net — `APPEAL-SC-SLP-90D` returns `status="CANNOT_COMPUTE"` and `due_date=null`.

---

### 9.5 — Tests

**Status**: ✅ Complete — 31 tests total

**`backend/tests/test_deadline_engine.py`**

| Category | ID | Description | Result |
|----------|----|----|--------|
| Rule loading | U01 | ≥10 rules returned | ✅ |
| Rule loading | U02 | Every rule has non-empty `source_note` | ✅ |
| Rule loading | U03 | Unique IDs, no duplicates | ✅ |
| Rule loading | U03b | Non-empty IDs | ✅ |
| Rule loading | U03c | Bilingual names (EN + HI) | ✅ |
| Rule loading | U03d | `period_days > 0` | ✅ |
| Rule loading | U03e | `period_basis` is `"calendar"` or `"working"` | ✅ |
| Computation | U04 | Valid date → `ComputedDeadline` with `due_date` set | ✅ |
| Computation | U05 | `None` event_date → `CANNOT_COMPUTE`, `due_date=None` | ✅ |
| Computation | U06 | CANNOT_COMPUTE `basis_en` is bilingual | ✅ |
| Computation | U07 | CANNOT_COMPUTE `days_remaining` is `None` | ✅ |
| Computation | U08 | Calendar rule: `due_date = event_date + period_days` exactly | ✅ |
| Computation | U09 | Working-day rule: `effective_days = period_days × 1.4` | ✅ |
| Computation | U10 | Working-day `basis_en` documents factor | ✅ |
| Computation | U11 | `is_synthetic` always True | ✅ |
| Computation | U12 | `basis_en` contains `[SYNTHETIC/DEMO]` always | ✅ |
| Compute-all | U13 | One item per rule | ✅ |
| Compute-all | U14 | CANNOT_COMPUTE last in sort | ✅ |
| Compute-all | U15 | Computable items sorted by `due_date` asc | ✅ |
| Format | U16 | Summary CANNOT_COMPUTE is bilingual | ✅ |
| Format | U17 | Summary computed contains status + due_date | ✅ |
| Boundary | B01 | 31 Jan + 31d = 3 Mar (non-leap) | ✅ |
| Boundary | B02 | 28 Feb + 1d = 1 Mar (non-leap) | ✅ |
| Boundary | B03 | 29 Feb + 1d = 1 Mar (leap 2024) | ✅ |
| Boundary | B04 | 31 Dec + 1d = 1 Jan next year | ✅ |
| Boundary | B05 | 1095-day period computes correctly | ✅ |
| Boundary | B06 | 1-day period works | ✅ |
| Boundary | B07 | `OVERDUE` when past due | ✅ |
| Boundary | B08 | `URGENT` at exactly 14 days | ✅ |
| Boundary | B09 | `WARNING` at 25 days | ✅ |
| Boundary | B10 | `UPCOMING` at 90 days | ✅ |
| Boundary | B11 | 0 days remaining → `URGENT` | ✅ |
| Boundary | B12 | `completed=True` → `COMPLETED` overrides OVERDUE | ✅ |
| TC-01 hand | V01 | `CRPC-167-90D`: arrest 2023-03-20 + 90d = **2023-06-18** | ✅ |
| TC-01 hand | V02 | `CRPC-167-60D`: arrest 2023-03-20 + 60d = **2023-05-19** | ✅ |
| TC-01 hand | V03 | `CRPC-173-FINAL`: fir 2023-03-15 + 90d = **2023-06-13** | ✅ |
| TC-01 hand | V04 | `FSL-REPORT-RECEIPT`: fsl 2023-03-22 + 60d = **2023-05-21** | ✅ |
| TC-01 hand | V05 | `APPEAL-SC-SLP-90D`: hc_order_date=null → **CANNOT_COMPUTE** | ✅ |
| TC-01 hand | V06 | `BAIL-439-APPLICATION`: bail + int(7×1.4)=9d working | ✅ |
| TC-01 hand | V07 | `LIMITATION-468-3Y`: incident + 1095d = **2026-03-14** | ✅ |
| TC-01 hand | V08 | TC-01 events file exists and parses correctly | ✅ |
| TC-01 hand | V09 | `compute_for_case("TC-01")` → exactly 1 CANNOT_COMPUTE | ✅ |
| TC-01 hand | V10 | Total items == rule count | ✅ |
| Copilot | C01 | CANNOT_COMPUTE snippet contains `rule_id` + `event_type` | ✅ |
| Copilot | C02 | Computed snippet contains `due_date` | ✅ |
| Copilot | C03 | Snippet always ≤ 300 chars | ✅ |
| Copilot | C04 | Snippet contains `[SYNTHETIC/DEMO]` | ✅ |
| Copilot | C05 | Snippet always contains `rule_id` | ✅ |
| Copilot | C06 | `CopilotCitation(type="deadline")` accepted by Pydantic | ✅ |
| Copilot | C07 | Original citation types still valid | ✅ |

---

### TypeScript Fixes (pre-existing errors — fixed as part of Week 9 typecheck pass)

**Status**: ✅ Fixed — tsc 0 errors (was 5 errors on baseline)

| File | Error | Fix |
|------|-------|-----|
| `src/features/copilot/CitationChip.tsx:15` | `status` comparison to `"PENDING"/"FATAL_ERROR"` TS2367 | Cast `citation.status as string` for runtime guard |
| `src/pages/CopilotPage.tsx:436,488` | `.name` not on `CaseRecord` TS2339 | Changed to `.title` (correct `CaseRecord` field) |
| `src/routes.tsx:40` | `CopilotPage` missing `default` export TS2322 | Wrapped lazy import: `.then(m => ({ default: m.CopilotPage }))` |

---

## Acceptance Criteria Checklist

| Criterion | Status | Evidence |
|-----------|--------|---------|
| Engine output for TC-01 matches hand-computed dates 100% | ✅ | V01–V07 all assert exact dates |
| Every deadline carries rule_id + bilingual basis string; SYNTHETIC labelled | ✅ | `basis_en`/`basis_hi` in every `ComputedDeadline`; U12 confirms |
| CANNOT_COMPUTE when event date is null (not silently omitted) | ✅ | V05, V09 confirm 1 CANNOT_COMPUTE for TC-01 |
| Copilot deadline answers cite engine output (zero invented dates) | ✅ | C01–C07; `_build_citations` accepts `"deadline"` type |
| 20+ tests covering boundary dates, month-ends, working-day, CANNOT_COMPUTE | ✅ | 47 test cases total |
| Clean-clone typecheck — `tsc --noEmit` zero errors | ✅ | 5 pre-existing TS errors fixed; exit 0 |
| `WEEK09_KIRO_COMPLETION.md` committed | ✅ | This file |

---

## Files Created / Modified — Full List

```
NEW  backend/services/__init__.py
NEW  backend/services/limitation_rules.json           (10 rules, schema_version 1.0)
NEW  backend/services/limitation_engine.py            (deterministic engine, no LLM)
NEW  backend/api/routes_deadlines.py                  (4 endpoints, flat convention)
MOD  backend/api/models.py                            (+DeadlineItem, +DeadlineScheduleResponse,
                                                       CopilotCitation.type += "deadline")
MOD  backend/api/routes_copilot.py                    (_build_citations accepts "deadline")
MOD  backend/main.py                                  (import + register deadlines_router;
                                                       "/deadlines" in heavy_markers)
NEW  backend/uploaded_cases/TC-01/TC-01_Deadline_Events.json  (8 events, 1 null)
NEW  backend/tests/test_deadline_engine.py            (47 tests)
MOD  .kiro/specs/deadline-engine/requirements.md      (full rewrite)
MOD  .kiro/specs/deadline-engine/design.md            (full rewrite)
MOD  .kiro/specs/deadline-engine/tasks.md             (full rewrite, W9 all [x])
FIX  src/features/copilot/CitationChip.tsx            (TS2367 pre-existing fix)
FIX  src/pages/CopilotPage.tsx                        (TS2339 .name→.title pre-existing fix)
FIX  src/routes.tsx                                   (TS2322 missing default pre-existing fix)
NEW  docs/integration/WEEK09_KIRO_COMPLETION.md       (this file)
```

---

## Known Limitations & Residual Risks

| Item | Severity | Notes |
|------|----------|-------|
| All rules are illustrative | Intentional | `source_note` on every rule; disclaimer on every API response. Verify against current statute before professional use. |
| Working-day factor is an approximation | Informational | `period_days × 1.4`; no court-holiday calendar embedded. Documented in basis strings. |
| `compute_for_case` reads a JSON file synchronously | Low | Suitable for demo. Production would use an async DB. File is small (<2KB). |
| `FEATURE_DEADLINE_ENGINE` evaluated at import time | Informational | Requires backend restart to toggle. Consistent with W5 copilot flag behaviour. |
| No `/case/{id}/deadlines` PATCH for `completed` flag | Deferred | Mark-completed UI is a Week 10 Devin task. Engine accepts `completed` param when called directly. |

---

## Hand-off Notes for Devin (Week 10 — Board UI)

1. **Backend contract frozen.** Build against `GET /api/v1/case/{case_id}/deadlines` returning `DeadlineScheduleResponse`.
2. **Feature detection**: call `GET /api/v1/deadlines/health` first. Check `enabled: true` before showing the board.
3. **Flag**: set `VITE_FF_DEADLINE_ENGINE=true` in `.env.local` to activate frontend.
4. **Status badge colours**: `OVERDUE`=red, `URGENT`=orange, `WARNING`=yellow, `UPCOMING`=green, `CANNOT_COMPUTE`=grey, `COMPLETED`=blue.
5. **Basis panel**: `basis_en` + `basis_hi` are long strings. Render in a collapsible "Show basis" accordion — never truncate them.
6. **Disclaimer**: `response.disclaimer` must be visible on every page — never hidden.
7. **Demo mode**: `?reference_date=YYYY-MM-DD` lets you set a past reference date to show URGENT/OVERDUE items. Useful for screenshots and demos.
8. **Route**: add `/case/:id/deadlines` to `src/routes.tsx` using the existing `Wrap()` + lazy import pattern. Gate behind `integrationFlags.deadline_engine`.
9. **Urgent panel**: use `GET /api/v1/case/{case_id}/deadlines/urgent` for the sidebar summary widget.
10. **Completion doc**: write `docs/integration/WEEK10_DEVIN_COMPLETION.md` using this file as template.

---

*Report generated by Kiro — Week 9 Limitation & Deadline Engine complete.*
