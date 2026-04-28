---
test_id: TC-09
title: Bail Application — Forest Act §26
category: functional
priority: P2
status: DEFINED
---

# TC-09 — Forest Offence Bail

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate bail application for forest offence cases — common in tribal/rural areas.

## Input Files Used
- `test-cases/CASE_09_ForestOffence/case-brief.md`

## Fictional Case Facts
- Sessions Court, Udaipur
- Accused: [Tribal Name], Age 45, Udaipur district
- Charges: Forest Act §26 — alleged illegal felling of trees
- Accused is a tribal — customary rights under Forest Rights Act 2006
- No prior criminal record
- Accused dependent on forest produce for livelihood

## Expected Behaviour
1. Bail application generated
2. Grounds: Forest Rights Act 2006 customary rights, no prior record, livelihood
3. Forest Rights Act 2006 provisions cited
4. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | FRA 2006 ground | Present |
| 2 | Customary rights argued | Present |
| 3 | Verification report | Generated |

## Risk Addressed
Forest law + tribal rights intersection

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
