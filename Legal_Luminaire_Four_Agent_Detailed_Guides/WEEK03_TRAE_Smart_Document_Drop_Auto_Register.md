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
- [ ] Drop → classify → editable proposal → confirm files document to the right case; discard leaves zero changes
- [ ] Register proposal pre-fills ≥ 6 fields on TC-01 synthetic bundle; all editable
- [ ] Noisy OCR + Hindi-English sample classifies without crash
- [ ] PENDING/FATAL_ERROR citations still blocked; Fact-Fit Gate untouched
- [ ] Clean-clone Netlify deploy succeeds; `WEEK03_TRAE_COMPLETION.md` committed

## ACCURACY GUARDRAILS
Classification output is a PROPOSAL only — it can never write drafts, alter verification tiers, or insert citations. Rejected proposals leave no state.

## ROLLBACK
Flag `smart_drop` OFF hides the overlay and routes; backend endpoints are additive and can be disabled without touching existing ingestion.
