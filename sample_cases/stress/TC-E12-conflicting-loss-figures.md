---
test_id: TC-E12
title: Insurance — Conflicting Loss Figures
category: stress
priority: P2
status: DEFINED
---
# TC-E12 — Conflicting Loss Figures

> [SYNTHETIC STRESS CASE — fictional data]

## Purpose
Validate conflict detection when insurance claim amounts differ across documents.

## Input
Insurance case where hospital bill says Rs. 8.5 lakh but claim form says Rs. 6.2 lakh.

## Expected Behaviour
- App flags: "Conflicting loss figures — hospital bill vs claim form"
- Lists both figures
- Does not silently use lower figure

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Conflict flagged | Warning with both figures |
| 2 | User prompted | To confirm correct amount |

## Current Status
⚠️ No conflict detector found — KNOWN GAP. Expected to FAIL.

## Risk Addressed
Insurance claim accuracy; financial figure integrity
