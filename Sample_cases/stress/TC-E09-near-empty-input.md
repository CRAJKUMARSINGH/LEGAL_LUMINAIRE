---
test_id: TC-E09
title: Near-Empty Minimum Input
category: stress
priority: P1
status: DEFINED
---
# TC-E09 — Near-Empty Minimum Input

> [SYNTHETIC STRESS CASE — fictional data]

## Purpose
Validate graceful degradation when only minimal data is provided.

## Input File
`test-assets/synthetic-inputs/near-empty-input.md`

## Input Characteristics
- Only FIR number and accused name provided
- No court, charges, facts, dates, witnesses

## Expected Behaviour
- No crash
- No fabricated facts
- Partial template with [REQUIRED] markers
- Clear list of missing required fields

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | No crash | App completes |
| 2 | No invented facts | Zero fabricated content |
| 3 | [REQUIRED] markers | Present in output |
| 4 | Missing fields listed | Shown to user |

## Fail Condition
App invents charges, facts, or court name from minimal input.

## Risk Addressed
Minimum viable input; graceful degradation; hallucination prevention
