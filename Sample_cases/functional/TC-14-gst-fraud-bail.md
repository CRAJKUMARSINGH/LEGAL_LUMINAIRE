---
test_id: TC-14
title: Bail Application — GST Fraud CGST Act §132
category: functional
priority: P1
status: DEFINED
---
# TC-14 — GST Fraud Bail
> [SYNTHETIC TEST CASE — fictional case data]

## Input Files Used
- `test-cases/CASE_14_GST_Fraud/case-brief.md`

## Fictional Case Facts
- Sessions Court, Delhi
- Accused: [Director Name], GST registered firm
- Charges: CGST Act §132 — fake invoices, Rs. 1.2 crore ITC fraud
- Accused cooperating with investigation — all documents surrendered
- No flight risk — passport deposited
- Amount disputed — actual ITC claimed: Rs. 45 lakh

## Expected Behaviour
1. Bail application generated
2. Grounds: cooperation, no flight risk, disputed amount, CGST §132 bail threshold
3. CGST Act §132 provisions cited correctly
4. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | CGST §132 threshold | Correctly applied |
| 2 | Cooperation ground | Present |
| 3 | Verification report | Generated |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
