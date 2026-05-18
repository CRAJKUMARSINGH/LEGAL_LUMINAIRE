---
test_id: TC-12
title: Bail Application — IPC §302 Murder (Long Narrative)
category: functional
priority: P0
status: DEFINED
---

# TC-12 — Murder Bail — Long Narrative Case

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate handling of complex, long-narrative murder bail with multiple grounds.
Tests that long input does not cause truncation or hallucination.

## Input Files Used
- `test-cases/CASE_12_MurderBail/case-brief.md`
- `test-assets/synthetic-inputs/bail-application-facts.md`

## Fictional Case Facts
- Sessions Case No. 78/2025, Sessions Judge, Bikaner
- Accused: [Name], Age 28, sole breadwinner, wife + 2 minor children
- Charges: IPC §302 — alleged killing in land dispute
- Single eyewitness — interested party (brother of deceased)
- No weapon recovered
- FSL report pending 3 months
- No prior criminal record
- Custody since 15-01-2025

## Expected Behaviour
1. Bail application u/s 439 CrPC generated
2. All 5 grounds present: single witness, no weapon, FSL pending, Art. 21, personal circumstances
3. Long facts section handled without truncation
4. Sanjay Chandra v. CBI (2012) 1 SCC 40 cited [DEMO PLACEHOLDER]
5. All sections complete despite long input
6. Verification report complete

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | All 5 grounds | Present |
| 2 | No truncation | Facts section complete |
| 3 | Verification report | Complete |
| 4 | Personal circumstances | Mentioned in bail grounds |
| 5 | No crash | App completes |

## Risk Addressed
Long input handling; completeness under complex facts

## Notes
This case tests that the app handles narrative-heavy input without cutting off.
All citations are DEMO PLACEHOLDERS — verify before filing.
