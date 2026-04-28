---
test_id: TC-07
title: Discharge Application — Medical Negligence IPC §304A
category: functional
priority: P1
status: DEFINED
---
# TC-07 — Medical Negligence Discharge
> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate discharge application for medical negligence — requires expert opinion standard.

## Input Files Used
- `test-cases/CASE_07_MedicalNegligence/case-brief.md`

## Fictional Case Facts
- Sessions Court, Delhi
- Accused: [Doctor Name], MBBS MS, private hospital
- Charges: IPC §304A — patient died post-surgery
- No expert committee opinion obtained before charge sheet
- Prosecution relies on family complaint only
- Hospital records show standard protocol followed

## Expected Behaviour
1. Discharge application generated
2. Grounds: no expert opinion, Jacob Mathew compliance, standard of care met
3. Jacob Mathew v. State of Punjab (2005) 6 SCC 1 cited [DEMO PLACEHOLDER]
4. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Jacob Mathew ground | Present |
| 2 | Expert opinion requirement | Argued |
| 3 | Verification report | Generated |

## Risk Addressed
Medical negligence standard; Jacob Mathew compliance

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
