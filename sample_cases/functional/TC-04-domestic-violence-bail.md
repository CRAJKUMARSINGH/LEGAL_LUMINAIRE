---
test_id: TC-04
title: Bail Application — IPC §498A + Domestic Violence Act
category: functional
priority: P1
status: DEFINED
---

# TC-04 — Domestic Violence Bail

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate bail application for DV/498A cases — common in Indian criminal practice.

## Input Files Used
- `test-cases/CASE04_STATE_VIKRAM_2025/case-brief.md`

## Fictional Case Facts
- Sessions Court, Jaipur
- Accused: [Husband Name], Age 35
- Charges: IPC §498A + DV Act §3
- FIR filed after matrimonial dispute — 3 years after alleged incidents
- No medical evidence of injury
- Accused has no prior criminal record
- Parties have minor child — custody disputed

## Expected Behaviour
1. Bail application u/s 439 CrPC generated
2. Grounds: delayed FIR, no medical evidence, motivated complaint, Arnesh Kumar compliance
3. Arnesh Kumar v. State of Bihar (2014) 8 SCC 273 cited [DEMO PLACEHOLDER]
4. Verification report generated
5. Pre-filing checklist generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Delayed FIR ground | Present |
| 2 | Arnesh Kumar cited | With tier label |
| 3 | Verification report | Generated |
| 4 | Pre-filing checklist | Generated |

## Risk Addressed
498A bail strategy; Arnesh Kumar compliance checking

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
