# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 3 — SMART DOCUMENT DROP & AUTO-REGISTER
**Version**: 1.0 | Professional Grade | Accuracy-First  
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
