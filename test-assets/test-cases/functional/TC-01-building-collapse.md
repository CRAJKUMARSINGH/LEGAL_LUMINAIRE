---
test_id: TC-01
title: Building Collapse — Forensic Defence (Hemraj Vardar)
category: functional
priority: P0
status: DEFINED
---

# TC-01 — Building Collapse — Forensic Defence

> [SYNTHETIC TEST CASE — references real case structure from CASE_01_HemrajG]

## Purpose
Validate the complete discharge application workflow including IS/ASTM standards
enforcement, Fact-Fit Gate scoring, chain-of-custody precedents, and Hindi draft output.

## Input Files Used
- `test-cases/CASE_01_HemrajG/input-documents/` (real case data)
- `artifacts/legal-luminaire/src/lib/case01-data.ts` (pre-loaded data)

## Expected Behaviour
1. App loads case data from `case01-data.ts` without API call
2. Standards matrix flags IS 1199:2018 as WRONG (fresh concrete only)
3. Standards matrix shows IS 2250:1981 as CORRECT (masonry mortar)
4. Standards matrix shows ASTM C1324 as CORRECT (hardened mortar forensics)
5. Fact-Fit Gate scores all 10 precedents; none with score < 30 used as primary
6. Discharge application generated in Hindi under §250 BNSS 2023
7. All 10 legal grounds present in draft
8. Verification report shows VERIFIED/SECONDARY tiers for each citation
9. No PENDING citation appears in draft body
10. Pre-filing checklist generated with ≥ 10 annexure demands

## Expected Output Characteristics
- Document type: Discharge Application (प्रार्थना-पत्र)
- Language: Hindi (Devanagari)
- Length: 20+ paragraphs
- Sections: Facts → Grounds → Standards → Precedents → Prayer → Verification Report → Checklist
- Citation format: `Case Name (Year) Volume Reporter Page`

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | IS 1199:2018 flagged | `applicability: "wrong"` shown with warning |
| 2 | IS 2250:1981 shown | `applicability: "correct"` shown |
| 3 | All 10 precedents scored | fitScore present for each |
| 4 | No PENDING in draft | Zero PENDING citations in output body |
| 5 | Verification report | All citations have tier label |
| 6 | Pre-filing checklist | ≥ 10 items |
| 7 | Hindi output | Devanagari script, no garbling |
| 8 | Prayer clause | Numbered reliefs present |

## Fail Conditions
- IS 1199:2018 used without warning
- Any PENDING citation in draft body
- Draft empty or truncated
- App crash

## Risk Addressed
Standards misapplication; citation accuracy; chain-of-custody argument completeness

## Notes
This is the primary showcase case. Must score 9/10 minimum on self-assessment rubric.
Data is pre-loaded — does not require OpenAI API key.
