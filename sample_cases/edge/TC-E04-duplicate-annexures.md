---
test_id: TC-E04
title: Duplicate Annexures in Document Bundle
category: edge
priority: P2
status: DEFINED
---
# TC-E04 — Duplicate Annexures

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate deduplication when same document uploaded multiple times.

## Input
Bundle with FIR uploaded twice, charge sheet uploaded three times.

## Expected Behaviour
- App detects duplicates (hash-based or name-based)
- Warning: "Duplicate documents detected — [list]"
- Annexure index shows deduplicated list

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Duplicates detected | Warning shown |
| 2 | Index deduplicated | No duplicate entries |
| 3 | No crash | App completes |

## Current Status
⚠️ No deduplication logic found in codebase — KNOWN GAP.
This test is expected to FAIL until dedup is implemented.

## Risk Addressed
Document management; index accuracy
