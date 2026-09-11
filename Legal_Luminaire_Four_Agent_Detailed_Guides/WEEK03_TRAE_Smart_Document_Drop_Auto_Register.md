# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 3 — SMART DOCUMENT DROP & AUTO-REGISTER
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
**Agent**: Trae (ByteDance Trae)  
**Week-3 Role**: Backend Pipeline • Classification • Register Pre-fill • Precision Edits  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Nothing is filed until the user approves it. Every AI-proposed field is editable before save. PENDING/FATAL_ERROR citations stay blocked. Bilingual + noisy-OCR input handled gracefully.

---

## STANDING RULES FOR TRAE (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy is non-negotiable: PENDING and FATAL_ERROR citations remain blocked from all draft generation.
3. All document processing must handle bilingual (Hindi + English) and noisy OCR input gracefully.
4. Keep `chroma_db/`, `__pycache__/` and similar runtime data gitignored.
5. After any API contract change, coordinate so frontend types stay aligned.
6. End every week by writing the required completion file under `docs/integration/`. Conventional commits only.

---

## SOURCE PROJECT (verified 8 Sept 2026)

**Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140  
Verified features adopted:
- *Document Drop*: “Drag any PDF, Word or Excel file anywhere onto the screen. Vyaas reads it, works out which matter it belongs to, which folder it should sit in and what it should be called, and shows the proposal for a one-click confirm… Nothing is filed until the user approves it.”
- *New matter from documents*: “Vyaas classifies the case type, fills the register form with the particulars that case type needs (parties, forum, case number, coram, stage, client side), drafts the first diary entry and files each PDF into the right folder… Every field is editable before anything is saved.”

NEGLECTED from Vyaas (recorded in ADR-004): live Delhi High Court case-status lookup (breaks local-first + synthetic-only rule), team chat, user management, cause list (multi-user firm infrastructure out of scope).

## OBJECTIVES

- Whole-window **Document Drop** surface → backend classifies → proposes {case, folder/name, case type} → **one-click confirm**.
- **Auto-Register**: from a dropped bundle, classify case type and pre-fill the case register per the repo naming standard `CASENO_PARTY1_PARTY2_YEAR`; propose the first diary entry; every field editable.
- Wire W2’s redaction gate so dropped files pass through Redaction Studio first when that flag is ON.

## DETAILED TASKS (execute strictly in order)

### 3.1 Backend Classification Endpoint (flag: `smart_drop`)
- `artifacts/legal-luminaire/backend/api/routes_smart_drop.py` (NEW — follow the existing FLAT `routes_*.py` convention confirmed in `backend/api/`: `routes.py`, `routes_cases.py`, `routes_drafting.py`, `routes_verify.py`…; register the router in `backend/main.py`; Pydantic schemas in the existing `api/models.py`):
  - `POST /api/v1/smart-drop/classify` — accepts extracted text + metadata; returns proposal `{suggested_case_id?, suggested_folder, suggested_filename, case_type, confidence, reasons[]}`.
  - Rule-based first (keyword/cue patterns for FIR, charge-sheet, FSL report, bail stage, etc.), LLM assist optional and clearly logged; never auto-saves.
  - `POST /api/v1/smart-drop/register-proposal` — classifies case type and returns pre-filled register fields: parties, forum, case number, stage, side, plus first diary entry draft.
- Pydantic models fully typed; noisy OCR and mixed Hindi-English text normalized before classification; duplicate annexure detection.

### 3.2 Frontend Drop Surface (with Devin-types aligned)
- Full-window drag-and-drop overlay on Home and Case pages (flag-gated route `/drop`); build as new module `src/features/smartDrop/` (current `src/` is pages-based with single `src/routes.tsx` — wire there).
- Proposal card UI: shows every suggested field as an **editable input**, confidence badge, and reasons list; single “Confirm & File” button + “Discard”.
- Follows the existing empty-state/card/badge design system; SYNTHETIC/DEMO badge persists in Demo Mode.

### 3.3 Pipeline Integration
- Order when both flags ON: Drop → (Redaction Studio gate from W2) → Classify → Proposal → Confirm → existing Upload → Index pipeline.
- Loading a proposal must switch the active case context cleanly (uses the existing multi-case data layer — `MULTI_CASE_IMPLEMENTATION.md` and `DEPLOY_AND_MULTI_CASE_GUIDE.md` confirmed in the artifact).
- Update frontend upload progress/error feedback to cover the new classify step (typed, bilingual).

### 3.4 Completion
```
docs/integration/WEEK03_TRAE_COMPLETION.md
```
Include: classification rules, API contract, proposal-confirmation flow, OCR/noisy-input handling, accuracy regression results (TC-01 + one edge case), Netlify static-demo status, hand-off notes for Antigravity (W4).

## FILES TOUCHED
`artifacts/legal-luminaire/backend/api/routes_smart_drop.py` + schemas in existing `api/models.py` (new) • `src/features/smartDrop/*` (new, wired via `src/routes.tsx`) • Home/Case drop overlays • `src/lib/featureFlags.ts` (consume only) • completion doc in repo-root `docs/integration/`

## TOOL PROMPT FOR TRAE (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 3 of the 12-week integration plan, behind flag `smart_drop` (defined in `src/lib/featureFlags.ts`, OFF). Implement the verified Vyaas Docket pattern: user drops PDF/DOCX/Excel anywhere; system classifies and PROPOSES case/folder/filename + case type and pre-filled register fields (parties, forum, case number, stage, side) plus a first diary entry; NOTHING is filed until the user confirms, and every proposed field is editable before save. Backend: new FastAPI router `artifacts/legal-luminaire/backend/api/routes_smart_drop.py` (follow the existing flat routes_*.py convention — routes_cases.py, routes_drafting.py etc. — registered in backend/main.py, schemas in api/models.py) exposing `POST /api/v1/smart-drop/classify` and `POST /api/v1/smart-drop/register-proposal` with fully typed Pydantic models; rule-based classification first (FIR, charge-sheet, FSL report, bail-stage cues), optional LLM assist logged, defensive errors, graceful handling of noisy OCR and mixed Hindi-English text, duplicate-annexure detection. Frontend: full-window drop overlay, editable proposal card with confidence badge, Confirm & File / Discard; integrate upstream of the W2 redaction gate when flag `redaction_studio` is ON; switch active case context cleanly on confirm; reuse the existing Upload→Index pipeline. Do not touch citation blocking, Fact-Fit Gate, or verification tiers. Verify TC-01 + one edge case end-to-end and that the Netlify static demo still works with backend optional. Write `docs/integration/WEEK03_TRAE_COMPLETION.md` and commit conventionally.

## WEEK 3 ACCEPTANCE CRITERIA
- [x] Drop → classify → editable proposal → confirm files document to the right case; discard leaves zero changes
- [x] Register proposal pre-fills ≥ 6 fields on TC-01 synthetic bundle; all editable
- [x] Noisy OCR + Hindi-English sample classifies without crash
- [x] PENDING/FATAL_ERROR citations still blocked; Fact-Fit Gate untouched
- [x] Clean-clone Netlify deploy succeeds; `WEEK03_TRAE_COMPLETION.md` committed

> **Week 3 Status**: ✅ **COMPLETED** — All Week 3 Smart Document Drop & Auto-Register objectives executed and verified.

---

## WEEK 4 — ENRICHMENT (Support / Observability Handoff)
**Theme**: Guided Workflow Support & Production Observability (per 5-week cadence)

### Detailed Tasks (Week 4 Enrichment for Smart Drop)
1. Surface smart-drop tracing and per-classification confidence data in the existing observability panel / API.
2. Harden classify/register-proposal endpoints with retry logic + exponential backoff for OCR/classify calls.
3. Enforce dropped-file size and type validation on both frontend and backend (reject oversized or unsupported files early with clear bilingual messages).
4. Write enrichment note:
   ```
   docs/integration/WEEK04_TRAE_SMARTDROP_NOTE.md
   ```

### Week 4 Acceptance Criteria
- [x] Smart-drop classification tracing and confidence data exposed via observability API
- [x] Retry logic with exponential backoff active on classify/register-proposal endpoints
- [x] Drop-file size + type validation enforced on frontend and backend (clear bilingual errors)
- [x] `WEEK04_TRAE_SMARTDROP_NOTE.md` committed

> **Week 4 Status**: ✅ **COMPLETED** — All Week 4 Smart Drop observability & hardening objectives executed and verified.

---

## WEEK 5 — FINAL LOCK (Smart Document Drop)
**Theme**: Production Release Hygiene & Backend Security Final Lock

### Detailed Tasks (Week 5 Final Enrichment for Smart Drop)
1. Final backend security review of the smart-drop surface:
   - Input validation on classify / register-proposal payloads
   - Rate limits on all `/api/v1/smart-drop/*` endpoints (HTTP 429 + retry guidance)
   - No error leakage of paths / stack / secrets
2. Re-verify that PENDING and FATAL_ERROR citations remain fully blocked (untouched by Smart Drop).
3. Re-verify the Fact-Fit Gate functions correctly and that Citation Blocking passes regression.
4. Confirm clean-clone Netlify deploy still succeeds with smart-drop flag ON and OFF.
5. Write final lock report:
   ```
   docs/integration/WEEK05_TRAE_SMARTDROP_FINAL_LOCK.md
   ```

### Week 5 Acceptance Criteria
- [x] Final backend security review completed (input validation, rate limits, error leakage, secrets handling on smart-drop endpoints)
- [x] All observability endpoints for Smart Drop safe for production (no sensitive data leakage)
- [x] Citation blocking and Fact-Fit Gate re-verified and fully functional (no regressions from Smart Drop)
- [x] Clean-clone Netlify deploy succeeds with `smart_drop` flag both ON and OFF
- [x] `WEEK05_TRAE_SMARTDROP_FINAL_LOCK.md` committed

> **Week 5 Status**: ✅ **COMPLETED** — All Week 5 Smart Document Drop final production lock objectives executed and verified. (Week 5 is the final enrichment week — no further advancement.)

---

## ACCURACY GUARDRAILS
Classification output is a PROPOSAL only — it can never write drafts, alter verification tiers, or insert citations. Rejected proposals leave no state.

## ROLLBACK
Flag `smart_drop` OFF hides the overlay and routes; backend endpoints are additive and can be disabled without touching existing ingestion.

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 3 deliverables must undergo comprehensive verification following Week 5 production lock standards:

**Testing Methodology**:
1. **Endpoint Contract Review**: Static review of `routes_smart_drop.py` schemas, Pydantic models, and error paths against the documented API contract.
2. **Classification Rule Audit**: Walk every rule-based classifier cue (FIR, charge-sheet, FSL, bail stage) against TC-01 synthetic bundle text + a noisy-OCR sample.
3. **Proposal-Only Guarantee Audit**: Inspect every call site of `/classify` and `/register-proposal` to confirm no code path writes to case store, draft store, citation store, or verification tiers without an explicit Confirm click.
4. **Pipeline Integration Test**: Exercise Drop → Redaction Gate (W2 flag ON) → Classify → Proposal → Confirm → Upload → Index end-to-end with TC-01 and one edge-case bundle.
5. **Noisy / Bilingual Input Test**: Pass Hindi-heavy mixed-language and garbled-OCR extracts through classify; verify no 500, no empty reasons[], and confidence drops honestly rather than hallucinating.
6. **Duplicate Annexure Detection**: Drop a bundle containing the same annexure twice (byte-identical and text-identical variants); confirm proposal surfaces a warning reason.
7. **Frontend Accessibility Audit**: Keyboard-only navigation through drop overlay, proposal card, editable fields, Confirm/Discard; ARIA live regions for classify progress and errors.
8. **Netlify Clean-Clone Verification**: Fresh clone → install → build → deploy with flags ON and OFF; confirm SPA routing, drop route, and case-context switch all work with backend optional.

**Testing Coverage**:
- ✅ `POST /api/v1/smart-drop/classify` payload validation, Pydantic typing, and proposal shape
- ✅ `POST /api/v1/smart-drop/register-proposal` pre-fill of parties/forum/case-no/stage/side + first diary draft
- ✅ Rule-based classifier cues: FIR, charge-sheet, FSL report, bail stage
- ✅ LLM-assist path (optional) clearly logged and never auto-saving
- ✅ Noisy OCR normalization + mixed Hindi-English graceful handling
- ✅ Duplicate annexure detection with warning reason surfaced in UI
- ✅ Full-window drop overlay on Home and Case pages, flag-gated `/drop` route
- ✅ Proposal card: every field editable, confidence badge, reasons list, Confirm & File / Discard
- ✅ Redaction Studio (W2) gate ordering when both flags ON
- ✅ Active case context clean switch on proposal confirm (multi-case data layer)
- ✅ Upload progress/error feedback extended to classify step, typed and bilingual
- ✅ PENDING / FATAL_ERROR citations remain fully blocked; Fact-Fit Gate untouched
- ✅ Demo Mode SYNTHETIC/DEMO badge persists on proposal card and drop overlay

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings in the Smart Document Drop surface must include both English and Hindi labels:

**Drop Overlay Labels**:
- ✅ "Drop documents anywhere to classify" / "वर्गीकरण के लिए दस्तावेज़ कहीं भी छोड़ें"
- ✅ "Select files" / "फ़ाइलें चुनें"
- ✅ "Classifying…" / "वर्गीकृत किया जा रहा है…"
- ✅ "Classification failed — try again or upload manually" / "वर्गीकरण विफल — पुनः प्रयास करें या मैन्युअली अपलोड करें"

**Proposal Card Labels**:
- ✅ "Proposed case" / "प्रस्तावित केस"
- ✅ "Proposed folder / filename" / "प्रस्तावित फ़ोल्डर / फ़ाइलनाम"
- ✅ "Case type" / "केस प्रकार"
- ✅ "Confidence" / "विश्वास स्तर"
- ✅ "Reasons" / "कारण"
- ✅ "Confirm & File" / "पुष्टि करें और फ़ाइल करें"
- ✅ "Discard" / "ख़ारिज करें"

**Register Proposal Fields**:
- ✅ "Parties" / "पक्ष"
- ✅ "Forum" / "फोरम"
- ✅ "Case number" / "केस संख्या"
- ✅ "Stage" / "स्टेज"
- ✅ "Client side" / "ग्राहक पक्ष"
- ✅ "First diary entry (draft)" / "प्रथम डायरी प्रविष्टि (ड्राफ्ट)"

**Status**: All user-facing strings must include both English and Hindi labels as required, including validation and error messages surfaced through the drop surface.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode and sample drop bundles must be clearly labeled as SYNTHETIC/DEMO:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" badge in drop overlay header when Demo Mode is active
- ✅ "SYNTHETIC / DEMO" badge anchored on proposal card in Demo Mode
- ✅ Sample drop bundle button clearly labelled "Load SYNTHETIC / DEMO bundle"
- ✅ Red-accent styling for demo badges matching the existing design system

**Demo Case Flagging**:
- ✅ `isDemo` property preserved on proposals generated from Demo Mode drops
- ✅ Proposals generated from synthetic bundles carry a synthetic-only reason entry
- ✅ Warning message when user drops real-case-looking files in Demo Mode
- ✅ No demo-bundle content is ever cited or surfaced outside Demo Mode

**Status**: All synthetic/demo drop proposals and bundles must be clearly labeled and visually distinguished from real-case input.

---

### NETLIFY COMPATIBILITY VERIFICATION

Smart Document Drop routes and frontend modules must be compatible with existing Netlify SPA routing and the clean-clone build:

**SPA Routing Check**:
- ✅ `/drop` route registered in `src/routes.tsx` and functional under Netlify `/* → /index.html` 200 redirect
- ✅ Drop overlay on Home and Case pages works without route navigation (overlay mount/unmount)
- ✅ Case-context switch on proposal confirm preserves SPA state (no full reload)
- ✅ Breadcrumb trail and multi-case tabs remain consistent after confirm & file

**Build Compatibility**:
- ✅ `src/features/smartDrop/` uses existing UI library (CVA cards, badges, empty states)
- ✅ TypeScript strict mode: all proposal, classify response, and error types are fully typed
- ✅ No build errors or warnings introduced by the smart-drop module
- ✅ Backend endpoints (`routes_smart_drop.py`) are additive; disabling `smart_drop` flag leaves no broken imports on frontend
- ✅ `python -m py_compile` passes on `routes_smart_drop.py` and schemas in `api/models.py`

**Flag Isolation**:
- ✅ `smart_drop` OFF: overlay hidden, `/drop` route guarded, proposal card tree-shaken
- ✅ With `redaction_studio` OFF: drop bypasses redaction gate and goes straight to classify (documented order preserved)
- ✅ With `redaction_studio` ON: Drop → Redaction → Classify → Proposal order enforced

**Status**: All changes must be compatible with existing Netlify configuration, SPA routing, and the clean-clone build with flags ON and OFF.

---

### ACCURACY RULES COMPLIANCE

Smart Document Drop must never alter accuracy controls, verification tiers, Fact-Fit Gate, or citation blocking:

**Citation Blocking Re-Verification**:
- ✅ PENDING citations remain fully blocked from all draft generation, unaffected by smart-drop confirm
- ✅ FATAL_ERROR citations remain fully blocked; no proposal, register-prefill, or diary-draft output ever references them
- ✅ Citation tiers (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) unchanged
- ✅ `citation_tier` badges and filtering logic untouched by `routes_smart_drop.py` or smart-drop frontend

**Fact-Fit Gate & Verification Tiers**:
- ✅ Fact-Fit Gate scoring unchanged; proposal confirm does not trigger any Fact-Fit re-run or override
- ✅ Verification tiers (1/2/3) unchanged; dropped documents follow existing Upload→Index→Verify pipeline
- ✅ Verification Report remains accessible and unchanged after confirm & file

**Proposal-Only Guarantee (Critical)**:
- ✅ Classify endpoint never writes to case store, draft store, citation store, or index
- ✅ Register-proposal endpoint never writes — it returns a proposal object only
- ✅ The ONLY write path is the existing Upload → Index pipeline, triggered after explicit "Confirm & File"
- ✅ Discard leaves zero state: no temp files, no partial case records, no orphaned index entries
- ✅ No auto-save of proposals; page refresh before confirm loses the proposal (documented behavior)

**Status**: Smart Document Drop must be completely isolated from accuracy logic, with write authority strictly after explicit user confirmation only.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 3 acceptance criteria, Week 5 enrichment requires:

- [ ] Classification rule-set audited against every cue category (FIR, charge-sheet, FSL, bail) with documented pass/fail per cue
- [ ] Proposal-only guarantee proven by code walk-through and an integration test that asserts zero writes when Discard is clicked
- [ ] All bilingual labels verified end-to-end through drop → classify → proposal → confirm flow
- [ ] SYNTHETIC/DEMO badge and sample-bundle labeling maintained across Demo Mode drop surface
- [ ] Netlify clean-clone deploy succeeds with `smart_drop` ON and OFF, and with `redaction_studio` ON/OFF in combination
- [ ] Noisy-OCR and Hindi-English mixed sample classifies with non-empty reasons[] and honest confidence; no crash, no 500
- [ ] Duplicate annexure detection surfaces a warning reason for both byte-identical and text-identical variants
- [ ] Accessibility compliance verified (keyboard navigation, ARIA live regions, screen-reader announcement of classify result)
- [ ] PENDING / FATAL_ERROR citation blocking re-verified after smart-drop confirm & file
- [ ] WEEK03_TRAE_COMPLETION.md committed with Week 5 verification sections appended

---

### WEEK 5 HAND-OFF NOTES

**For Future Development (Antigravity W4 UX polish → Kiro W5 copilot integration)**:
1. **Classifier Expansion**: Add rule-based cues for more case types (civil plaint, caveat, vakalatnama, order sheet) and a pattern-registry file so new cues do not require refactoring.
2. **Proposal Diff View**: When a proposal suggests an existing case, show a diff of the existing register fields vs. proposed pre-fill before Confirm.
3. **Bulk Drop**: Extend the drop surface to accept a zip of annexures and propose case-splitting when the bundle clearly contains multiple matters.
4. **Saved Draft Proposals**: Optionally persist proposals to browser storage so refresh-before-confirm does not lose work (keep strictly local, no backend write).

**For Documentation & Governance Maintenance**:
1. Keep classifier cue registry and reasons[] output bilingual when new case types are added.
2. Re-verify the Proposal-Only Guarantee after any refactor of the drop→classify→confirm pipeline; add a regression test that blocks any accidental write before Confirm.
3. Maintain the flag-combination matrix (`smart_drop` × `redaction_studio`) and re-test every combination on Netlify before release.
4. Keep Demo Mode synthetic bundles in sync with TC-01 content so classifier accuracy benchmarks remain stable.

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: WEEK03_TRAE_Smart_Document_Drop_Auto_Register.md
**Lines Added**: ~140 (Week 5 enrichment sections)
**Lines Removed**: 0

**Suggested Commit Message**:
```
docs: Apply Week 5 enrichment standards to Week 3 Smart Document Drop guide

- Bump guide version to 1.1 (enriched)
- Add Week 5 verification methodology section (endpoint contract, rule audit, proposal-only audit, pipeline + noisy + duplicate annexure tests, a11y, Netlify)
- Add bilingual compliance verification section (drop overlay, proposal card, register fields EN+HI)
- Add synthetic case labeling verification section (Demo Mode badges, sample bundle labeling, isDemo flag)
- Add Netlify compatibility verification section (SPA routing, build/TS strict, flag-isolation matrix)
- Add accuracy rules compliance section (citation blocking, Fact-Fit Gate, critical proposal-only guarantee)
- Enhance acceptance criteria with Week 5 enrichment-specific checks
- Add hand-off notes for future classifier expansion and documentation maintenance
```
