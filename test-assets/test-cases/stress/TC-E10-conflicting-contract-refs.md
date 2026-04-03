---
test_id: TC-E10
title: Arbitration — Inconsistent Contract References
category: stress
priority: P2
status: DEFINED
---
# TC-E10 — Conflicting Contract References

> [SYNTHETIC STRESS CASE — fictional data]

## Purpose
Validate conflict detection when contract clause numbers are inconsistent across documents.

## Input
Arbitration brief referencing Clause 12.3 in one document and Clause 14.1 in another
for the same obligation.

## Expected Behaviour
- App flags: "Inconsistent contract references detected"
- Lists conflicting clauses
- Does not silently pick one

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Conflict flagged | Warning shown |
| 2 | Both clauses listed | User can choose |
| 3 | No silent resolution | User confirmation required |

## Current Status
⚠️ No conflict detector found — KNOWN GAP. Expected to FAIL.

## Risk Addressed
Contract reference accuracy; arbitration brief integrity
