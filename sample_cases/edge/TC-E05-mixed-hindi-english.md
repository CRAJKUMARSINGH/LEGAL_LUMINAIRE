---
test_id: TC-E05
title: Mixed Hindi-English Input
category: edge
priority: P1
status: DEFINED
---
# TC-E05 — Mixed Hindi-English Text

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate bilingual processing with alternating Hindi and English paragraphs.

## Input File
`test-assets/synthetic-inputs/mixed-hindi-english.md`

## Input Characteristics
- Alternating Hindi (Devanagari) and English paragraphs
- Legal terms in both languages
- Party names in Hindi

## Expected Behaviour
- App processes both languages without crash
- Output in consistent language (Hindi for court document)
- No Devanagari script corruption
- No garbling of Unicode characters

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | No crash | App completes |
| 2 | No script corruption | Devanagari intact |
| 3 | Consistent output language | Hindi output |

## Risk Addressed
Bilingual robustness; Unicode handling
