# Legal Luminaire — Test Case Matrix (26 Cases)

**Last Updated:** April 2026
**Total Cases:** 26 (21 original + 5 Infrastructure Arbitration)

---

## Category-wise Distribution

| Category | Count | Case IDs |
|----------|-------|----------|
| Criminal & Forensic | 8 | TC-01 to TC-08 |
| Civil & Family | 6 | TC-09 to TC-14 |
| Writ & Constitutional | 4 | TC-15 to TC-18 |
| Commercial & Consumer | 3 | TC-19 to TC-21 |
| **Infrastructure & Arbitration (New)** | **5** | **TC-22 to TC-26** |

---

## Infrastructure Arbitration Cases (Full Lifecycle)

| TC ID | Project | Contract Value | Total Claim | Verified Claims | Award | Demo Priority |
|-------|---------|----------------|-------------|-----------------|-------|---------------|
| TC-22 | 300-Bed Hospital Building (RMSCL) | ₹48.75 Cr | ₹19.84 Cr | 4/6 | ₹17.86 Cr | High |
| TC-23 | 45 km National Highway NH-758 (NHAI) | ₹112.65 Cr | ₹55.30 Cr | 4/6 | ₹41.65 Cr | **Highest** |
| TC-24 | Medium Irrigation Dam, Banas (WRD) | ₹87.40 Cr | ₹54.85 Cr | 4/5 | ₹42.85 Cr | High |
| TC-25 | 220 kV GIS Substation + TL (RVPNL) | ₹68.25 Cr | ₹30.45 Cr | 4/5 | ₹23.65 Cr | High |
| TC-26 | 185 Acres Township Landscape (USCL) | ₹34.80 Cr | ₹20.75 Cr | 5/6 | ₹15.80 Cr | Medium |

**Combined:** ₹351.85 Cr contract value | ₹181.19 Cr total claims | ₹141.81 Cr total awards

---

## Documents in Each Infrastructure Case (15 files per case)

1. `Case_Facts_Timeline.md` — Chronological timeline with contradiction flags
2. `Claim_Matrix_Verified_Pending.md` — Fact-Fit Gate on all claims
3. `Standards_Matrix_CPWD_FIDIC_IS.md` — Applicable standards
4. `WORK_ORDER_2024.lex` — Contract with arbitration clause
5. `LEGAL_NOTICE_DEMAND_01.lex` — Formal demand notice
6. `STANDING_COMMITTEE_MINUTES_01.md` — Employer's internal proceedings
7. `NO_SATISFACTION_LETTER_01.lex` — Arbitration invocation
8. `ARB_APPOINTMENT_APPLICATION_SEC11.lex` — Sec 11(6) application
9. `CLAIM_STATEMENT_FULL.lex` — Full English claim (12-15 pages)
10. `CLAIM_STATEMENT_HINDI.lex` — Full Hindi claim
11. `COUNTER_CLAIM_REPLY.lex` — Counter claim + reply
12. `WITNESS_AFFIDAVIT_01.lex` — Witness affidavit
13. `CROSS_EXAMINATION_TRANSCRIPT_EXCERPT.lex` — Key admissions
14. `FINAL_ARBITRAL_AWARD.lex` — Reasoned award (70-75% in contractor's favour)
15. `EXECUTION_STAY_APPLICATION.lex` — Sec 36 execution petition

---

## Testing Checklist for Infrastructure Cases

- [ ] Demo Mode loads full case without API key
- [ ] Claim Matrix shows Fact-Fit Gate (Verified/Secondary/Pending)
- [ ] Timeline + Contradiction Radar works
- [ ] Hindi + English document generation
- [ ] PDF output with watermark in Demo Mode
- [ ] Standards Matrix (CPWD/FIDIC/IS codes) displays correctly
- [ ] Collision/Contradiction detection works
- [ ] Case selector shows TC-22 to TC-26 in sidebar

---

## Accuracy Rules Compliance (per accuracy-rules.md)

- All PENDING claims have `blockedFromDraft: true` ✓
- All claims carry Fact-Fit Gate scores ✓
- VERIFIED / SECONDARY / PENDING tiers applied ✓
- No hallucinated citations — all precedents marked with verification status ✓
- IS/ASTM/CPWD/FIDIC standards cited with clause numbers ✓
