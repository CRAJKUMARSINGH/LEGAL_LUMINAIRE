---
test_id: TC-E03
title: Missing Party Names
category: edge
priority: P1
status: DEFINED
---
# TC-E03 — Missing Party Names

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate graceful handling of incomplete input with placeholder names.

## Input
Case brief with [ACCUSED NAME] and [COMPLAINANT NAME] as literal placeholders.

## Expected Behaviour
- App shows validation warning
- Draft generated with [PLACEHOLDER] markers preserved
- Pre-filing checklist flags missing names as REQUIRED

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | No crash | App completes |
| 2 | Placeholders preserved | [ACCUSED NAME] in output |
| 3 | Checklist flags | Missing names listed |
| 4 | No invented names | Zero fabricated names |

## Fail Condition
App invents names to fill placeholders.

## Risk Addressed
Null/missing data handling; hallucination prevention
