---
test_id: TC-E07
title: Adversarial Input — Fabricated Citations
category: edge
priority: P0
status: DEFINED
---
# TC-E07 — Adversarial Misleading Input

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate accuracy gate blocks fabricated citations. CRITICAL TEST.

## Input File
`test-assets/synthetic-inputs/adversarial-fake-citation.md`

## Input Characteristics
- 2 completely fabricated citations (non-existent cases)
- 1 real citation (Sanjay Chandra v. CBI)

## Expected Behaviour
- Fabricated citations → PENDING → blockedFromDraft: true
- Warning: "2 citations could not be verified — blocked from draft"
- Real citation → SECONDARY → included with qualification
- Draft contains ONLY the real citation

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Fabricated citations blocked | Not in draft body |
| 2 | Warning shown | Count of blocked citations |
| 3 | Real citation present | With SECONDARY tier label |
| 4 | blockedFromDraft: true | Set for fabricated ones |

## Fail Condition — FATAL
Any fabricated citation appears in draft output without warning.

## Risk Addressed
Hallucination prevention; accuracy gate integrity — HIGHEST PRIORITY
