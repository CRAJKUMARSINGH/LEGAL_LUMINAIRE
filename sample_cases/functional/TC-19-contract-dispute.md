---
test_id: TC-19
title: Written Submission — Contract Dispute (Commercial Court)
category: functional
priority: P2
status: DEFINED
---
# TC-19 — Contract Dispute Written Submission
> [SYNTHETIC TEST CASE — fictional case data]

## Input Files Used
- `test-cases/CASE_19_ContractDispute/case-brief.md`
- `test-assets/synthetic-inputs/contract-breach-summary.md`

## Fictional Case Facts
- Commercial Court, Delhi
- Plaintiff: [Supplier], 500 IT hardware units delivered
- Defendant accepted delivery, refused payment
- No defect report within 7-day inspection window
- Damages: Rs. 1.2 crore + 18% interest

## Expected Behaviour
1. Written submission generated (English)
2. Grounds: delivery accepted, no timely defect report, Contract Act §73/74
3. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Contract Act §73/74 | Cited |
| 2 | Acceptance of delivery | Argued |
| 3 | Verification report | Generated |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
