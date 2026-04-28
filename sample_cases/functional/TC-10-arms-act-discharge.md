---
test_id: TC-10
title: Discharge Application — Arms Act §25/27
category: functional
priority: P2
status: DEFINED
---

# TC-10 — Arms Act Discharge

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate discharge application for Arms Act cases.

## Input Files Used
- `test-cases/CASE_10_ArmsAct/case-brief.md`

## Fictional Case Facts
- Sessions Court, Jaipur
- Accused: [Name], Age 40
- Charges: Arms Act §25 (possession) + §27 (use)
- Weapon allegedly recovered from accused's vehicle
- No independent witness at recovery
- Seizure memo signed only by police witnesses
- Accused has valid arms licence for a different weapon

## Expected Behaviour
1. Discharge application generated
2. Grounds: no independent witness, seizure procedure defect, valid licence
3. Relevant Arms Act provisions cited
4. Verification report generated
5. Pre-filing checklist generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | No independent witness ground | Present |
| 2 | Seizure defect argued | Present |
| 3 | Verification report | Generated |
| 4 | Pre-filing checklist | Generated |

## Risk Addressed
Arms Act procedure; seizure memo validity

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
