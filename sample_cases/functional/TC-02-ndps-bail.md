---
test_id: TC-02
title: Bail Application — NDPS §52A Procedure Violation
category: functional
priority: P0
status: DEFINED
---

# TC-02 — NDPS Bail — §52A Procedure Violation

> [SYNTHETIC TEST CASE — fictional case data]

## Purpose
Validate bail application generation with NDPS procedural defect grounds.

## Input Files Used
- `test-cases/CASE02_RAMESH_STATE_2025/case-brief.md`
- `test-assets/synthetic-inputs/bail-application-facts.md`

## Fictional Case Facts
- FIR: 234/2024, PS Sanganer, Jaipur
- Accused: [Accused Name], Jaipur
- Charges: NDPS Act §8/21/29 — 2.5 kg heroin
- §52A not followed — no Magistrate at sampling
- No §52A(4) certificate
- FSL delayed 45 days (limit: 30 days)
- No independent witness

## Expected Behaviour
1. App identifies §52A non-compliance as primary ground
2. Bail application u/s 439 CrPC / §483 BNSS generated
3. All 5 grounds present: §52A, no witness, FSL delay, no nexus, Art. 21
4. Precedents cited with DEMO PLACEHOLDER tags
5. Verification report generated
6. Pre-filing checklist generated

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | §52A ground | Present as primary ground |
| 2 | ≥ 2 precedents | Cited with tier labels |
| 3 | Verification report | Generated |
| 4 | Pre-filing checklist | Generated |
| 5 | No crash | App completes workflow |

## Risk Addressed
Procedural defect identification; NDPS Act compliance checking

## Notes
Requires OpenAI API for full generation. Static stub data needed for offline demo.
All citations are DEMO PLACEHOLDERS — verify before filing.
