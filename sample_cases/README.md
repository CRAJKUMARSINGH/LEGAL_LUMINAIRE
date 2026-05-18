# Sample Cases — Legal Luminaire Test Suite

All synthetic test cases for robustness testing, self-assessment, and marketing demonstration.

> All documents are SYNTHETIC / DEMO — no real persons, cases, or proceedings.

---

## Structure

```
sample_cases/
├── functional/          TC-01 to TC-21  — 21 diverse Indian legal scenarios
│   └── expected-outputs/               — expected draft outputs for TC-01, 02, 03, E07
├── edge/                TC-E01 to TC-E07 — adversarial / quality-gate edge cases
├── stress/              TC-E08 to TC-E12 — large bundle / conflicting data stress cases
├── showcase/            showcase-01 to 04 — polished marketing demo walkthroughs
├── test-cases/          lightweight fixture briefs + inputs for automation
├── marketing/           success stories + accuracy benchmarks (ex–MARKETING_TEST_CASES)
└── misc_documents/      generic legal templates (ex–MISC_CASE_DOCUMENTS)
```

---

## Functional Cases (TC-01 to TC-21)

| # | File | Type | Court | Charges |
|---|------|------|-------|---------|
| 01 | TC-01-building-collapse.md | Discharge / Forensic | Sessions, Udaipur | IPC 304A + PCA |
| 02 | TC-02-ndps-bail.md | Bail — NDPS | HC Rajasthan | NDPS §8/21/29 |
| 03 | TC-03-ni-act-discharge.md | Discharge — NI Act | MM Court Delhi | NI Act §138 |
| 04 | TC-04-domestic-violence-bail.md | Bail — DV | Sessions, Jaipur | IPC 498A + DV Act |
| 05 | TC-05-cyber-fraud-bail.md | Bail — Cyber | Sessions, Mumbai | IT Act §66C/66D |
| 06 | TC-06-land-acquisition-writ.md | Writ | HC Rajasthan | Art. 226 |
| 07 | TC-07-medical-negligence-discharge.md | Discharge | Sessions, Delhi | IPC 304A |
| 08 | TC-08-road-accident-bail.md | Bail | Sessions, Jodhpur | IPC 304A/279 |
| 09 | TC-09-forest-offence-bail.md | Bail | Sessions, Udaipur | Forest Act §26 |
| 10 | TC-10-arms-act-discharge.md | Discharge | Sessions, Jaipur | Arms Act §25/27 |
| 11 | TC-11-pc-act-bribery-discharge.md | Discharge | Special Court | PCA §7/13 |
| 12 | TC-12-murder-bail.md | Bail | HC Rajasthan | IPC 302 |
| 13 | TC-13-pocso-discharge.md | Discharge | Sessions, Kota | POCSO §4 + IPC 376 |
| 14 | TC-14-gst-fraud-bail.md | Bail | Sessions, Delhi | CGST Act §132 |
| 15 | TC-15-environment-writ.md | Writ | NGT | EP Act + Water Act |
| 16 | TC-16-landlord-tenant.md | Written Submission | HC Rajasthan | Transfer of Property Act |
| 17 | TC-17-service-matter-writ.md | Writ | HC Rajasthan | Art. 226 |
| 18 | TC-18-marketing-demo-polished.md | Written Submission | Consumer Forum | Consumer Protection Act |
| 19 | TC-19-contract-dispute.md | Written Submission | Commercial Court | Contract Act §73/74 |
| 20 | TC-20-family-maintenance.md | Application | Family Court | CrPC §125 / BNSS §144 |
| 21 | TC-21-election-petition.md | Written Submission | HC Rajasthan | RPA §100 |

---

## Edge Cases (TC-E01 to TC-E07)

| File | Tests |
|------|-------|
| TC-E01-ocr-noisy-text.md | OCR noise / garbled input handling |
| TC-E02-contradictory-dates.md | Date contradiction detection |
| TC-E03-missing-party-names.md | Missing party name handling |
| TC-E04-duplicate-annexures.md | Duplicate document deduplication |
| TC-E05-mixed-hindi-english.md | Bilingual input processing |
| TC-E06-unsupported-format.md | Unsupported file format rejection |
| TC-E07-adversarial-fake-citation.md | Fake citation detection + blocking |

---

## Stress Cases (TC-E08 to TC-E12)

| File | Tests |
|------|-------|
| TC-E08-large-bundle.md | Large document bundle performance |
| TC-E09-near-empty-input.md | Near-empty / minimal input handling |
| TC-E10-conflicting-contract-refs.md | Conflicting contract reference resolution |
| TC-E11-survey-mismatch.md | Survey number mismatch detection |
| TC-E12-conflicting-loss-figures.md | Conflicting financial figures detection |

---

## Showcase Cases

| File | Purpose |
|------|---------|
| showcase-01-building-collapse.md | Primary demo — IS standard error detection |
| showcase-02-ndps-bail.md | NDPS bail demo |
| showcase-03-accuracy-gate-demo.md | Accuracy gate / PENDING block demo |
| showcase-04-breadth-demo.md | Platform breadth across 21 case types |

---

## Self-Assessment Rubric (10/10)

Each functional case is scored on:
1. Citation accuracy — all VERIFIED/COURT_SAFE citations used correctly
2. Fact-Fit Gate — all precedents scored, rejected ones blocked
3. IS/ASTM standards — correct standard applied, wrong standard flagged
4. Hindi language quality — chaste legal Hindi where required
5. Structure completeness — all mandatory sections present
6. Prayer clause — specific, numbered reliefs
7. Verification report — tier shown for every citation
8. Pre-filing checklist — all critical items listed
9. Cross-reference matrix — violation → standard → precedent
10. Output format — court-ready, printable, downloadable
