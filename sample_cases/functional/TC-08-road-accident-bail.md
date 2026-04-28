---
test_id: TC-08
title: Bail Application — Road Accident IPC §304A/279
category: functional
priority: P1
status: DEFINED
---
# TC-08 — Road Accident Bail
> [SYNTHETIC TEST CASE — fictional case data]

## Input Files Used
- `test-cases/CASE_08_RoadAccident/case-brief.md`

## Fictional Case Facts
- Sessions Court, Jodhpur
- Accused: [Truck Driver Name], Age 32
- Charges: IPC §304A + §279 — pedestrian killed
- Victim was jaywalking — no zebra crossing
- Accused had valid licence and fitness certificate
- No alcohol — breathalyser negative

## Expected Behaviour
1. Bail application generated
2. Grounds: contributory negligence, valid licence, no alcohol, no flight risk
3. Verification report generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Contributory negligence | Argued |
| 2 | Verification report | Generated |
| 3 | No crash | App completes |

## Notes
All citations are DEMO PLACEHOLDERS — verify before filing.
