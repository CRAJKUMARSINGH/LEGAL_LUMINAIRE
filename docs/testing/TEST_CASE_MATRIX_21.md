# LEGAL LUMINAIRE — 21 TEST CASE MATRIX
## Version 1.0 | April 3, 2026

> All test cases are SYNTHETIC / FICTIONAL unless marked as real case data.
> Test IDs map to folders in `test-cases/` and `Sample_cases/`.

---

## MATRIX OVERVIEW

| ID | Title | Category | Court | Charges/Law | Scenario Type | Priority |
|----|-------|----------|-------|-------------|---------------|----------|
| TC-01 | Building Collapse — Hemraj Vardar | Functional | Sessions, Udaipur | IPC 304A + PCA | Clean, real-data | P0 |
| TC-02 | NDPS Bail — Procedure Violation | Functional | HC Rajasthan | NDPS §8/21/29 | Clean simple | P0 |
| TC-03 | NI Act Discharge — Security Cheque | Functional | MM Court Delhi | NI Act §138 | Clean simple | P0 |
| TC-04 | Domestic Violence Bail | Functional | Sessions, Jaipur | IPC 498A + DV Act | Clean simple | P1 |
| TC-05 | Cyber Fraud Bail | Functional | Sessions, Mumbai | IT Act §66C/66D | Clean simple | P1 |
| TC-06 | Land Acquisition Writ | Functional | HC Rajasthan | Art. 226 — LA Act | Clean simple | P1 |
| TC-07 | Medical Negligence Discharge | Functional | Sessions, Delhi | IPC 304A | Clean simple | P1 |
| TC-08 | Road Accident Bail | Functional | Sessions, Jodhpur | IPC 304A/279 | Clean simple | P1 |
| TC-09 | Forest Offence Bail | Functional | Sessions, Udaipur | Forest Act §26 | Clean simple | P2 |
| TC-10 | Arms Act Discharge | Functional | Sessions, Jaipur | Arms Act §25/27 | Clean simple | P2 |
| TC-11 | PC Act Bribery Discharge | Functional | Special Court | PCA §7/13 | Clean simple | P2 |
| TC-12 | Murder Bail | Functional | HC Rajasthan | IPC 302 | Long narrative | P0 |
| TC-13 | POCSO Discharge | Functional | Sessions, Kota | POCSO §4 + IPC 376 | Sensitive/complex | P0 |
| TC-14 | GST Fraud Bail | Functional | Sessions, Delhi | CGST Act §132 | Financial/complex | P1 |
| TC-15 | Environment Violation Writ | Functional | NGT | EP Act + Water Act | Technical | P1 |
| TC-16 | Landlord-Tenant Written Submission | Functional | HC Rajasthan | TPA | Civil/complex | P2 |
| TC-17 | Service Matter Writ | Functional | HC Rajasthan | Art. 226 — Service | Administrative | P2 |
| TC-18 | Insurance Claim Written Submission | Functional | Consumer Forum | CPA | Consumer | P2 |
| TC-19 | Contract Dispute Written Submission | Functional | Commercial Court | Contract Act | Commercial | P2 |
| TC-20 | Family Maintenance Application | Functional | Family Court | CrPC §125 / BNSS §144 | Family | P2 |
| TC-21 | Election Petition Written Submission | Functional | HC Rajasthan | RPA §100 | Constitutional | P2 |

---

## EDGE / STRESS / ADVERSARIAL CASES

| ID | Title | Category | Scenario Type | Risk Addressed |
|----|-------|----------|---------------|----------------|
| TC-E01 | OCR-Noisy FIR Text | Edge | Formatting noise | OCR input handling |
| TC-E02 | Contradictory Dates in Charge Sheet | Edge | Conflicting data | Date validation |
| TC-E03 | Missing Party Names | Edge | Missing data | Null handling |
| TC-E04 | Duplicate Annexures | Edge | Duplicate data | Deduplication |
| TC-E05 | Mixed Hindi-English Text | Edge | Language mixing | Bilingual processing |
| TC-E06 | Unsupported Document Style | Edge | Invalid input | Format validation |
| TC-E07 | Adversarial Misleading Input | Stress | Misleading input | Accuracy gate |
| TC-E08 | Huge Multi-Document Bundle | Stress | Large input | Performance |
| TC-E09 | Near-Empty Minimum Input | Edge | Minimal data | Graceful degradation |
| TC-E10 | Conflicting Contract References | Edge | Inconsistent data | Conflict detection |
| TC-E11 | Survey Mismatch in Property Case | Edge | Data mismatch | Discrepancy flagging |
| TC-E12 | Conflicting Loss Figures (Insurance) | Edge | Conflicting data | Conflict detection |

---

## DETAILED TEST CASE SPECIFICATIONS

---

### TC-01 — Building Collapse (Hemraj Vardar)
**Test ID:** TC-01
**Title:** Building Collapse — Forensic Defence
**Purpose:** Validate full discharge application workflow with IS/ASTM standards and chain-of-custody precedents
**Input Files:** `test-cases/CASE01_HEMRAJ_STATE_2025/input-documents/`
**Expected Behaviour:**
- App loads case data from `case01-data.ts`
- Fact-Fit Gate scores all 10 precedents correctly
- IS 1199:2018 flagged as WRONG standard; IS 2250:1981 shown as CORRECT
- ASTM C1324 shown as correct for hardened mortar forensics
- Discharge application generated in Hindi with all 10 grounds
- Verification report shows VERIFIED/SECONDARY tiers
- Pre-filing checklist generated with 12 annexure demands
**Pass Criteria:**
- All VERIFIED precedents appear in draft
- IS 1199:2018 flagged with warning
- No PENDING citations in draft output
- Checklist has ≥ 10 items
**Risk Addressed:** Standards misapplication; citation accuracy
**Notes:** This is the primary showcase case. Must score 9/10 minimum.

---

### TC-02 — NDPS Bail
**Test ID:** TC-02
**Title:** Bail Application — NDPS §52A Violation
**Purpose:** Validate bail application generation with procedural defect grounds
**Input Files:** `test-cases/CASE02_RAMESH_STATE_2025/input-documents/`
**Expected Behaviour:**
- Bail application u/s 439 CrPC / §483 BNSS generated
- §52A non-compliance highlighted as primary ground
- Baldev Singh (1999) 6 SCC 172 cited with DEMO PLACEHOLDER tag
- Tofan Singh (2021) cited with DEMO PLACEHOLDER tag
- Verification report shows tier for each citation
**Pass Criteria:**
- §52A ground present
- At least 2 precedents cited
- Verification report generated
- Pre-filing checklist generated
**Risk Addressed:** Procedural defect identification

---

### TC-03 — NI Act Discharge
**Test ID:** TC-03
**Title:** Discharge Application — Security Cheque
**Purpose:** Validate discharge application for NI Act §138 with security cheque defence
**Input Files:** `test-cases/CASE03_APEX_SUNIL_2025/input-documents/`
**Expected Behaviour:**
- Discharge application u/s 245 CrPC / §250 BNSS generated
- Security cheque ground as primary defence
- Rangappa v. Sri Mohan (2010) 11 SCC 441 cited
- Krishna Janardhan Bhat (2008) cited
- Cross-reference matrix generated
**Pass Criteria:**
- Security cheque ground present
- At least 2 precedents cited
- Cross-reference matrix generated
**Risk Addressed:** NI Act defence strategy accuracy

---

### TC-12 — Murder Bail (Long Narrative)
**Test ID:** TC-12
**Title:** Bail Application — IPC §302 (Long Narrative Case)
**Purpose:** Validate handling of complex, long-narrative murder bail with multiple grounds
**Input Files:** `test-cases/CASE_12_MurderBail/input-documents/`
**Expected Behaviour:**
- Bail application u/s 439 CrPC generated
- Multiple grounds: single witness, no weapon, FSL pending, Art. 21
- Sanjay Chandra v. CBI (2012) cited
- Lengthy facts section handled without truncation
- All sections complete despite long input
**Pass Criteria:**
- All grounds present
- No truncation of facts
- Verification report complete
**Risk Addressed:** Long input handling; completeness

---

### TC-E01 — OCR-Noisy FIR Text
**Test ID:** TC-E01
**Title:** OCR-Like Noisy Text Input
**Purpose:** Validate app handles garbled/OCR-scanned text gracefully
**Input:** Synthetic FIR with OCR noise (missing spaces, garbled words, wrong characters)
**Expected Behaviour:**
- App does not crash
- Partial extraction of usable data
- Warning shown: "Input quality low — manual review recommended"
- No fabricated facts inserted to fill gaps
**Pass Criteria:**
- No crash
- Warning displayed
- No invented facts
**Risk Addressed:** OCR input robustness; hallucination prevention

---

### TC-E02 — Contradictory Dates
**Test ID:** TC-E02
**Title:** Contradictory Dates in Charge Sheet
**Purpose:** Validate conflict detection when FIR date is after arrest date
**Input:** Synthetic charge sheet with FIR date 20-03-2025, arrest date 15-03-2025
**Expected Behaviour:**
- App flags date contradiction
- Warning: "Date conflict detected — FIR date after arrest date"
- Does not silently use wrong date in draft
**Pass Criteria:**
- Conflict flagged
- Warning shown
- Draft not generated without user acknowledgement
**Risk Addressed:** Data integrity; date validation

---

### TC-E03 — Missing Party Names
**Test ID:** TC-E03
**Title:** Missing Party Names in Input
**Purpose:** Validate graceful handling of incomplete input
**Input:** Case brief with [ACCUSED NAME] and [COMPLAINANT NAME] as placeholders
**Expected Behaviour:**
- App shows validation warning
- Draft generated with [PLACEHOLDER] markers
- Pre-filing checklist flags missing names
**Pass Criteria:**
- No crash
- Placeholders preserved in output
- Checklist flags missing data
**Risk Addressed:** Null/missing data handling

---

### TC-E04 — Duplicate Annexures
**Test ID:** TC-E04
**Title:** Duplicate Annexures in Document Bundle
**Purpose:** Validate deduplication of repeated documents
**Input:** Bundle with FIR uploaded twice, charge sheet uploaded three times
**Expected Behaviour:**
- App detects duplicates
- Warning: "Duplicate documents detected — [list]"
- Annexure index shows deduplicated list
**Pass Criteria:**
- Duplicates detected
- Warning shown
- Index deduplicated
**Risk Addressed:** Document management; index accuracy

---

### TC-E05 — Mixed Hindi-English Text
**Test ID:** TC-E05
**Title:** Mixed Hindi-English Input
**Purpose:** Validate bilingual processing
**Input:** Case brief with alternating Hindi and English paragraphs
**Expected Behaviour:**
- App processes both languages
- Output maintains language consistency
- No garbling of Devanagari script
**Pass Criteria:**
- No script corruption
- Output in correct language
- No crash
**Risk Addressed:** Bilingual robustness

---

### TC-E07 — Adversarial Misleading Input
**Test ID:** TC-E07
**Title:** Adversarial / Misleading Input
**Purpose:** Validate accuracy gate blocks fabricated citations
**Input:** Case brief containing invented case citation "XYZ v. ABC (2025) 99 SCC 999"
**Expected Behaviour:**
- App marks citation as PENDING (unverified)
- Citation blocked from draft output
- Warning: "Citation could not be verified — blocked from draft"
- `blockedFromDraft: true` set
**Pass Criteria:**
- Invented citation blocked
- Warning shown
- Draft does not contain unverified citation
**Risk Addressed:** Hallucination prevention; accuracy gate

---

### TC-E08 — Huge Multi-Document Bundle
**Test ID:** TC-E08
**Title:** Large Multi-Document Bundle
**Purpose:** Validate performance with large input
**Input:** 20+ documents totalling 200+ pages (synthetic PDFs)
**Expected Behaviour:**
- App processes without timeout (< 60 seconds for analysis)
- Progress indicator shown
- No memory crash
- Summary generated correctly
**Pass Criteria:**
- No crash
- Progress shown
- Output generated within reasonable time
**Risk Addressed:** Performance; scalability

---

### TC-E09 — Near-Empty Minimum Input
**Test ID:** TC-E09
**Title:** Near-Empty Minimum Input
**Purpose:** Validate graceful degradation with minimal data
**Input:** Only FIR number and accused name — no other details
**Expected Behaviour:**
- App shows what can be generated vs. what requires more data
- Partial template generated with clear [REQUIRED] markers
- No fabricated facts
**Pass Criteria:**
- No crash
- No invented facts
- Clear indication of missing data
**Risk Addressed:** Minimum viable input; graceful degradation

---

## TEST EXECUTION SUMMARY

| Category | Total Cases | Status |
|----------|-------------|--------|
| Functional (TC-01 to TC-21) | 21 | Defined — ready for execution |
| Edge Cases (TC-E01 to TC-E12) | 12 | Defined — ready for execution |
| **Total** | **33** | **Defined** |

---

## PASS/FAIL CRITERIA SUMMARY

A test case PASSES if:
1. App does not crash
2. No fabricated facts or citations in output
3. PENDING citations are blocked from draft
4. Verification report is generated
5. Pre-filing checklist is generated
6. Expected output type matches actual output type

A test case FAILS if:
1. App crashes or throws unhandled error
2. Fabricated citation appears in draft
3. PENDING citation appears in draft without warning
4. Output is empty without explanation
5. Wrong standard applied without warning (e.g., IS 1199 for mortar)
