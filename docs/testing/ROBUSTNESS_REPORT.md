# LEGAL LUMINAIRE — ROBUSTNESS REPORT
## Version 1.0 | April 3, 2026

> This report is based on static code analysis and simulated workflow review.
> Actual runtime execution requires OpenAI API key + ChromaDB setup.
> All pass/fail assessments are based on code inspection, not live execution.
> ASSUMPTION: Backend agents behave as designed in crew.py and routes.py.

---

## METHODOLOGY

Since the backend requires OpenAI API key and ChromaDB (not available in this
environment), robustness assessment is based on:
1. Static code analysis of frontend components
2. Review of data structures in `case01-data.ts`
3. Review of accuracy enforcement in `verification-engine.ts`
4. Review of agent design in `crew.py`, `researcher.py`, `drafter.py`
5. Simulated workflow tracing through the 21 test cases

---

## ROBUSTNESS MATRIX

### Functional Test Cases (TC-01 to TC-21)

| TC | Title | Frontend | Data Layer | Accuracy Gate | Expected Result | Confidence |
|----|-------|----------|------------|---------------|-----------------|------------|
| TC-01 | Building Collapse | ✅ Full UI | ✅ case01-data.ts | ✅ Fact-Fit Gate | PASS | HIGH |
| TC-02 | NDPS Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-03 | NI Act Discharge | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-04 | DV Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-05 | Cyber Fraud Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-06 | Land Acquisition Writ | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-07 | Medical Negligence | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-08 | Road Accident Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-09 | Forest Offence | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-10 | Arms Act | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-11 | PC Act Bribery | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-12 | Murder Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-13 | POCSO Discharge | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-14 | GST Fraud Bail | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-15 | Environment Writ | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-16 | Landlord-Tenant | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-17 | Service Matter | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-18 | Insurance Claim | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-19 | Contract Dispute | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-20 | Family Maintenance | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |
| TC-21 | Election Petition | ✅ UI exists | ⚠️ No dedicated data file | ✅ Gate present | PARTIAL | MEDIUM |

### Edge / Stress Cases

| TC | Title | Expected Behaviour | Code Support | Confidence |
|----|-------|-------------------|--------------|------------|
| TC-E01 | OCR Noisy Text | Warning + partial extraction | ⚠️ No explicit OCR handler | LOW |
| TC-E02 | Contradictory Dates | Conflict flag | ⚠️ No date validator | LOW |
| TC-E03 | Missing Party Names | Placeholder preservation | ✅ Zod validation present | MEDIUM |
| TC-E04 | Duplicate Annexures | Deduplication warning | ⚠️ No dedup logic found | LOW |
| TC-E05 | Mixed Hindi-English | Bilingual processing | ✅ Bilingual UI present | MEDIUM |
| TC-E06 | Unsupported Format | Format validation | ✅ File type check in upload | MEDIUM |
| TC-E07 | Adversarial Citation | PENDING block | ✅ verification-engine.ts | HIGH |
| TC-E08 | Large Bundle | Performance | ⚠️ No explicit size limit | LOW |
| TC-E09 | Near-Empty Input | Graceful degradation | ✅ Zod validation | MEDIUM |
| TC-E10 | Conflicting Contract Refs | Conflict detection | ⚠️ No conflict detector | LOW |
| TC-E11 | Survey Mismatch | Discrepancy flag | ⚠️ No mismatch detector | LOW |
| TC-E12 | Conflicting Loss Figures | Conflict detection | ⚠️ No conflict detector | LOW |

---

## KNOWN STRENGTHS

1. **Accuracy Gate (TC-01, TC-E07)** — `verification-engine.ts` + `PrecedentFitGate.tsx`
   enforce VERIFIED/SECONDARY/PENDING tiers. PENDING citations are blocked.
   Confidence: HIGH.

2. **Standards Enforcement (TC-01)** — IS 1199:2018 vs IS 2250:1981 distinction
   is hardcoded in `case01-data.ts` with `applicability: "wrong"` flag.
   Confidence: HIGH for Case 01. MEDIUM for other cases.

3. **Bilingual UI (TC-E05)** — Hindi + English nav, labels, and draft output
   are present throughout the app. Devanagari rendering tested in .lex files.
   Confidence: MEDIUM (no automated script test).

4. **Form Validation (TC-E03, TC-E09)** — Zod schemas present in `api-zod` lib.
   React Hook Form wired in intake pages.
   Confidence: MEDIUM.

5. **Case-Scoped Routing (TC-01 to TC-21)** — Dynamic `/case/:caseId` routes
   support multi-case workflows without data bleed between cases.
   Confidence: HIGH.

---

## KNOWN WEAKNESSES

1. **TC-02 to TC-21 — No Dedicated Data Files**
   Only Case 01 has a full `case01-data.ts` with verified precedents and standards.
   Cases 02-21 rely on AI-generated content at runtime (requires OpenAI API).
   Risk: Without API key, these cases produce no output.
   Mitigation: Add stub data files for each case (future work).

2. **TC-E01 — No OCR Handler**
   No explicit OCR noise handling. Garbled text passed directly to AI.
   Risk: AI may hallucinate facts from noisy input.
   Mitigation: Add input quality warning before AI processing.

3. **TC-E02 — No Date Validator**
   No explicit date consistency check across FIR, arrest, charge sheet.
   Risk: Contradictory dates silently passed to draft.
   Mitigation: Add date validation in intake form.

4. **TC-E04 — No Deduplication**
   No document deduplication in upload flow.
   Risk: Duplicate annexures inflate index and confuse AI.
   Mitigation: Hash-based dedup on upload.

5. **TC-E08 — No Size Limit**
   No explicit file size or page count limit in upload.
   Risk: Very large bundles may timeout or exhaust API tokens.
   Mitigation: Add 50MB / 100-page limit with warning.

---

## IMPROVEMENTS MADE IN THIS UPDATE

1. Created `docs/testing/TEST_CASE_MATRIX_21.md` — formal test specifications
2. Created `docs/testing/SYNTHETIC_TEST_DATA_GUIDE.md` — 21 synthetic input docs
3. Created `docs/case-docs/MISC_CASE_DOCUMENT_LIBRARY.md` — 20 reusable templates
4. Created `docs/accuracy-governance/ACCURACY_RULES.md` — v2 accuracy rules
5. Created `docs/CACHE_HYGIENE.md` — clean run procedure
6. Created `docs/MODERNIZATION_PLAN.md` — UX improvement roadmap
7. Created `test-assets/` folder structure with synthetic inputs
8. Created `docs/marketing/` folder with showcase assets

---

## CONFIDENCE SUMMARY

| Area | Confidence | Evidence |
|------|------------|---------|
| Accuracy gate (PENDING block) | HIGH | Code in verification-engine.ts |
| Standards enforcement (Case 01) | HIGH | case01-data.ts applicability flags |
| Bilingual UI | MEDIUM | UI code + .lex demo files |
| Form validation | MEDIUM | Zod schemas present |
| Cases 02-21 data | LOW | No dedicated data files |
| OCR handling | LOW | No explicit handler |
| Date validation | LOW | No explicit validator |
| Large input handling | LOW | No size limits found |

---

## OVERALL ROBUSTNESS SCORE

**6.5 / 10** (honest assessment)

Rationale:
- Core accuracy gate: strong (9/10)
- Case 01 workflow: strong (9/10)
- Cases 02-21 without API: weak (3/10)
- Edge case handling: weak (4/10)
- Performance under load: unknown (untested)
- Bilingual quality: good (7/10)

The app is production-ready for Case 01 demonstration with API key.
For Cases 02-21, stub data files are needed for offline/demo use.
Edge case handling needs explicit validators for OCR, dates, and duplicates.
