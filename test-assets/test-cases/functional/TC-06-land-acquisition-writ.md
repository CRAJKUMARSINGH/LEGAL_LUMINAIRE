---
test_id: TC-06
title: Writ Petition — Land Acquisition Act (Art. 226)
category: functional
priority: P1
status: DEFINED
---

# TC-06 — Land Acquisition Writ

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate writ petition generation for land acquisition matters.

## Input Files Used
- `test-cases/CASE_06_LandAcquisition/case-brief.md`
- `test-assets/synthetic-inputs/writ-petition-note.md`

## Fictional Case Facts
- Rajasthan High Court, Jodhpur Bench
- Petitioner: [Farmer Name], Village Mandore, Jodhpur
- Land acquired for highway project — compensation inadequate
- Market value: Rs. 50 lakh/bigha; compensation offered: Rs. 8 lakh/bigha
- No proper notice under RFCTLARR Act 2013 §11
- Social Impact Assessment not conducted

## Expected Behaviour
1. Writ petition u/Art. 226 generated
2. Grounds: inadequate compensation, no SIA, procedural violation
3. RFCTLARR Act 2013 provisions cited
4. Verification report generated
5. Stay application generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Compensation ground | Present |
| 2 | RFCTLARR Act cited | Correct sections |
| 3 | Verification report | Generated |
| 4 | Stay application | Generated |

## Risk Addressed
Constitutional law accuracy; RFCTLARR Act provisions

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
