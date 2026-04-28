---
test_id: TC-E11
title: Property Case — Survey Number Mismatch
category: stress
priority: P2
status: DEFINED
---
# TC-E11 — Survey Mismatch

> [SYNTHETIC STRESS CASE — fictional data]

## Purpose
Validate discrepancy flagging when survey numbers differ between sale deed and revenue records.

## Input
Property case brief where sale deed says Khasra No. 1234 but revenue record says Khasra No. 1243.

## Expected Behaviour
- App flags: "Survey number mismatch — sale deed vs revenue record"
- Does not silently use one number
- Checklist demands survey verification

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Mismatch flagged | Warning shown |
| 2 | Checklist item | Survey verification demanded |

## Current Status
⚠️ No mismatch detector found — KNOWN GAP. Expected to FAIL.

## Risk Addressed
Property case accuracy; survey number integrity
