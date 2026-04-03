# TC-01 — Expected Output Specification
## Building Collapse — Discharge Application

> This file defines what a PASSING output looks like for TC-01.
> Used for manual review and future automated assertion.

---

## DOCUMENT TYPE
Discharge Application (प्रार्थना-पत्र) under §250 BNSS 2023

## LANGUAGE
Hindi (Devanagari script)

## MANDATORY SECTIONS (all must be present)
- [ ] Court heading (न्यायालय शीर्षक)
- [ ] Party names (अभियुक्त / राज्य)
- [ ] Case number and charges
- [ ] Facts section (तथ्य) — minimum 5 paragraphs
- [ ] Legal grounds (आधार) — minimum 10 numbered grounds
- [ ] Standards section — IS 1199:2018 flagged WRONG, IS 2250:1981 shown CORRECT
- [ ] Precedents section — minimum 4 citations with tier labels
- [ ] Prayer clause (प्रार्थना) — minimum 3 numbered reliefs
- [ ] Verification report — all citations with VERIFIED/SECONDARY/PENDING
- [ ] Pre-filing checklist — minimum 10 items

## MANDATORY CONTENT CHECKS
- IS 1199:2018 must appear with warning: "यह मानक ताज़ा कंक्रीट पर लागू होता है — कठोर मसाले पर नहीं"
- IS 2250:1981 must appear as correct standard
- ASTM C1324 must appear as correct forensic standard
- Kattavellai (2025 INSC 845) must appear — fitScore ≥ 88
- Prafulla Kumar Samal (1979) must appear — discharge standard
- Zero PENDING citations in draft body

## BLOCKED CONTENT (must NOT appear)
- IS 1199:2018 cited as correct standard
- Any citation with status PENDING in draft body
- Any fabricated holding not from case01-data.ts

## VERIFICATION REPORT REQUIREMENTS
- At least 2 VERIFIED citations
- All SECONDARY citations carry qualification note
- Zero PENDING in draft

## PRE-FILING CHECKLIST REQUIREMENTS
- Certified copy of FIR
- Charge sheet with all annexures
- FSL report (original)
- Chain of custody register
- Sampling procedure documentation
- IS standard source documents
- Expert opinion (if obtained)
- Minimum 10 items total

## SELF-ASSESSMENT TARGET: 9/10
