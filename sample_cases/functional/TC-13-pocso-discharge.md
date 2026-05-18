---
test_id: TC-13
title: Discharge Application — POCSO §4 + IPC §376
category: functional
priority: P0
status: DEFINED
---
# TC-13 — POCSO Discharge
> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate discharge application for POCSO — sensitive, high-stakes case type.

## Input Files Used
- `test-cases/CASE_13_RapeDischarge/case-brief.md`

## Fictional Case Facts
- Sessions Court, Kota
- Accused: [Name], Age 22, neighbour
- Charges: POCSO §4 + IPC §376
- Complainant's age disputed — school records show she was 18 at time of incident
- Delay of 8 months in FIR — no explanation
- Medical examination: no corroborative injuries
- Relationship was consensual per defence

## Expected Behaviour
1. Discharge application generated
2. Grounds: age dispute, delayed FIR, no medical corroboration
3. Age verification documents demanded in checklist
4. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Age dispute ground | Present |
| 2 | Delayed FIR argued | Present |
| 3 | Age docs in checklist | Present |
| 4 | Verification report | Generated |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
