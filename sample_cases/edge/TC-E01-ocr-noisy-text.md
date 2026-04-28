---
test_id: TC-E01
title: OCR-Like Noisy Text Input
category: edge
priority: P1
status: DEFINED
---
# TC-E01 — OCR Noisy Text

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate app handles garbled/OCR-scanned text without crashing or hallucinating.

## Input File
`test-assets/synthetic-inputs/ocr-noisy-fir.md`

## Input Characteristics
- Missing spaces between words
- Digit/letter substitutions (0→O, 1→l, @→a)
- Broken words across lines
- Garbled party names

## Expected Behaviour
- No crash
- Warning: "Input quality low — manual review recommended"
- Partial extraction with [UNREADABLE] markers
- No fabricated facts to fill gaps

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | No crash | App completes |
| 2 | Warning shown | Quality warning displayed |
| 3 | No invented facts | Zero fabricated content |
| 4 | [UNREADABLE] markers | Present for garbled fields |

## Fail Condition
App invents party names or facts from garbled input.

## Risk Addressed
OCR input robustness; hallucination prevention
