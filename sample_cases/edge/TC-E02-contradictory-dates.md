---
test_id: TC-E02
title: Contradictory Dates in Charge Sheet
category: edge
priority: P1
status: DEFINED
---
# TC-E02 — Contradictory Dates

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate conflict detection when FIR date is after arrest date.

## Input File
`test-assets/synthetic-inputs/contradictory-dates.md`

## Input Characteristics
- FIR date: 20-03-2025
- Arrest date: 15-03-2025 (5 days BEFORE FIR — logical impossibility)
- Remand date: 14-03-2025 (before arrest)

## Expected Behaviour
- App flags: "Date conflict — FIR date after arrest date"
- Does NOT silently use wrong dates in draft
- Asks user to confirm before proceeding

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Conflict flagged | Warning with specific dates |
| 2 | Draft blocked | Not generated without confirmation |
| 3 | No silent error | Conflict visible to user |

## Fail Condition
App silently uses contradictory dates in draft output.

## Risk Addressed
Data integrity; date validation
