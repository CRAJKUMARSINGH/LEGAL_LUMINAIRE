# Legal Luminaire — Test Cases Library

21 diverse Indian criminal/civil defence cases for robustness testing,
self-assessment, and marketing demonstration.

Each case folder contains:
- `case-brief.md` — FIR details, charges, facts, defence strategy
- `input-documents/` — simulated FIR, charge-sheet, FSL report, etc.
- `expected-outputs/` — what the app should generate
- `self-assessment.md` — 10/10 scoring rubric

## Case Index

| # | Case ID | Type | Court | Charges |
|---|---------|------|-------|---------|
| 01 | CASE_01_HemrajG | Building collapse / forensic | Sessions, Udaipur | IPC 304A + PCA |
| 02 | CASE_02_BailNDPS | Bail — NDPS | HC Rajasthan | NDPS §8/21/29 |
| 03 | CASE_03_ChequeDischarge | Discharge — NI Act | MM Court Delhi | NI Act §138 |
| 04 | CASE_04_DomesticViolence | Bail — DV | Sessions, Jaipur | IPC 498A + DV Act |
| 05 | CASE_05_CyberFraud | Bail — Cyber | Sessions, Mumbai | IT Act §66C/66D + IPC 420 |
| 06 | CASE_06_LandAcquisition | Writ — Land | HC Rajasthan | Art. 226 — LA Act |
| 07 | CASE_07_MedicalNegligence | Discharge — Medical | Sessions, Delhi | IPC 304A |
| 08 | CASE_08_RoadAccident | Bail — Motor | Sessions, Jodhpur | IPC 304A/279 |
| 09 | CASE_09_ForestOffence | Bail — Forest | Sessions, Udaipur | Forest Act §26 |
| 10 | CASE_10_ArmsAct | Discharge — Arms | Sessions, Jaipur | Arms Act §25/27 |
| 11 | CASE_11_PCActBribe | Discharge — Corruption | Special Court | PCA §7/13 |
| 12 | CASE_12_MurderBail | Bail — Murder | HC Rajasthan | IPC 302 |
| 13 | CASE_13_RapeDischarge | Discharge — POCSO | Sessions, Kota | POCSO §4 + IPC 376 |
| 14 | CASE_14_GST_Fraud | Bail — GST | Sessions, Delhi | CGST Act §132 |
| 15 | CASE_15_EnvironmentViolation | Writ — Environment | NGT | EP Act + Water Act |
| 16 | CASE_16_LandlordTenant | Written Submission | HC Rajasthan | Transfer of Property Act |
| 17 | CASE_17_ServiceMatter | Writ — Service | HC Rajasthan | Art. 226 — Service Rules |
| 18 | CASE_18_InsuranceClaim | Written Submission | Consumer Forum | Consumer Protection Act |
| 19 | CASE_19_ContractDispute | Written Submission | Commercial Court | Contract Act §73/74 |
| 20 | CASE_20_FamilyMaintenance | Application | Family Court | CrPC §125 / BNSS §144 |
| 21 | CASE_21_ElectionPetition | Written Submission | HC Rajasthan | RPA §100 |

## Self-Assessment Rubric (10/10)

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
