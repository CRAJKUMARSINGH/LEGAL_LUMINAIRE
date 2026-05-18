---
test_id: TC-11
title: Discharge Application — Prevention of Corruption Act §7/13
category: functional
priority: P2
status: DEFINED
---

# TC-11 — PC Act Bribery Discharge

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate discharge application for corruption cases before Special Court.

## Input Files Used
- `test-cases/CASE_11_PCActBribe/case-brief.md`

## Fictional Case Facts
- Special Court (PC Act), Jaipur
- Accused: [Government Officer Name], PWD Department
- Charges: PCA §7 (bribe demand) + §13 (criminal misconduct)
- Trap case — complainant is a contractor with pending dues dispute
- Tainted money allegedly recovered — but no independent witness
- Accused denies demand — claims money was planted

## Expected Behaviour
1. Discharge application generated
2. Grounds: interested complainant, no independent witness, planted money
3. PCA provisions cited correctly
4. Verification report generated
5. Pre-filing checklist generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Interested complainant ground | Present |
| 2 | PCA sections correct | §7, §13 cited |
| 3 | Verification report | Generated |
| 4 | Pre-filing checklist | Generated |

## Risk Addressed
PC Act accuracy; trap case defence strategy

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
