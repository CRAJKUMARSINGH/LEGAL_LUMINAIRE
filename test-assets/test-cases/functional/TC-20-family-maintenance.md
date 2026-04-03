---
test_id: TC-20
title: Application — Family Maintenance CrPC §125 / BNSS §144
category: functional
priority: P2
status: DEFINED
---
# TC-20 — Family Maintenance Application
> [SYNTHETIC TEST CASE — fictional case data]

## Input Files Used
- `test-cases/CASE_20_FamilyMaintenance/case-brief.md`

## Fictional Case Facts
- Family Court, Jaipur
- Applicant: Wife + 2 minor children
- Respondent: Husband, monthly income Rs. 1.2 lakh (estimated)
- Husband claims income Rs. 25,000 — disputed
- Wife has no independent income; children in school

## Expected Behaviour
1. Maintenance application generated (Hindi)
2. Income estimation grounds argued
3. CrPC §125 / BNSS §144 cited correctly
4. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | BNSS §144 cited | Correct section |
| 2 | Income estimation | Argued |
| 3 | Verification report | Generated |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
