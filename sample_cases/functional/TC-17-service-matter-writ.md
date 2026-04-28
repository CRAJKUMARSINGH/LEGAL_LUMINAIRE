---
test_id: TC-17
title: Writ — Service Matter (Art. 226)
category: functional
priority: P2
status: DEFINED
---
# TC-17 — Service Matter Writ
> [SYNTHETIC TEST CASE — fictional case data]

## Input Files Used
- `test-cases/CASE_17_ServiceMatter/case-brief.md`
- `test-assets/synthetic-inputs/service-matter-brief.md`

## Fictional Case Facts
- HC Rajasthan
- Petitioner: Class II officer, 15 years service, "Outstanding" ACRs
- Superseded in promotion — junior promoted
- No adverse entry; promotion committee did not consider file

## Expected Behaviour
1. Writ petition generated
2. Grounds: seniority-cum-merit, ACRs not considered, Art. 16
3. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Art. 16 ground | Present |
| 2 | ACR non-consideration | Argued |
| 3 | Verification report | Generated |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
