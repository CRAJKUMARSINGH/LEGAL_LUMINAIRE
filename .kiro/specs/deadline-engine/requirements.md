# Deadline Engine — Requirements
**Flag**: `deadline_engine` (default OFF)
**Week**: 9 (Kiro primary)
**Source**: AI Law showcase — limitation periods, synthetic dates only

## Scope
Computes limitation periods and procedural deadlines from case dates (date of incident, FIR date, charge sheet date, last hearing). All dates are synthetic — no live court API. Displays a ranked list of upcoming and overdue deadlines.

## Data Model
- `DeadlineRule`: `{ id, name, nameHi, statute, section, days_from_event, event_type }`
- `ComputedDeadline`: `{ rule_id, case_id, due_date, days_remaining, status: "upcoming"|"overdue"|"completed", source_event_date, source_event_type }`

## API Contract
- `POST /api/v1/deadlines/compute` — body: `{ case_id, events: [{type, date}] }`; response: `{ deadlines: ComputedDeadline[] }`

## Accuracy Guardrails
- Limitation period rules are hard-coded from statute text — no AI inference for the rules themselves.
- All dates are synthetic (no live court lookups — see ADR-004).
- Computed deadlines display statute + section reference so the user can verify independently.
- Overdue deadlines shown with a prominent bilingual warning.

## Bilingual Requirement
All deadline names, statute references, and status labels bilingual.

## Flag
`deadline_engine` — OFF by default. Enable via `VITE_FF_DEADLINE_ENGINE=true`.

## Rollback
Disable flag; no existing data deleted.

## Acceptance Criteria
- [ ] Limitation periods computed correctly for CrPC / BNSS key events
- [ ] Overdue deadlines display bilingual warning
- [ ] No live court API calls
- [ ] All statute references display section number for independent verification
