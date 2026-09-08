# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 7 — ASK LUMINAIRE: GROUNDING HARDENING & CITATION DEEP-LINKS
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Trae (ByteDance Trae)  
**Week-7 Role**: Backend Pipeline • Grounding • Citation Deep-Links • Precision Edits  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Every citation anywhere in Legal Luminaire must be one click from its source. The verified Vyaas standard: “Every cited case links to its source PDF.” Copilot context must stay bilingual and OCR-noise-tolerant.

### LIVE REPO NOTES (verified 8 September 2026)
- Citation/verification machinery CONFIRMED and to be extended, not duplicated: `backend/agents/fact_fit_engine.py`, `agents/hallucination_breaker.py`, `agents/standards_verifier.py`, `agents/judgment_parser.py`; retrieval in `backend/rag/hybrid_search.py`, `rag/document_store.py`, `rag/optimized_document_store.py`.
- Citation-Explorer was already merged into the app (commit `4cab8a7`) — reuse its citation model where applicable.
- New resolver follows the flat convention: `backend/api/routes_citations.py`, registered in `backend/main.py`.

---

## STANDING RULES FOR TRAE (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy is non-negotiable: PENDING and FATAL_ERROR citations remain blocked from ALL output — drafts AND copilot answers.
3. Bilingual + noisy OCR input handled gracefully; runtime data stays gitignored.
4. Coordinate API-contract changes so frontend types stay aligned. Conventional commits; end with the completion file under `docs/integration/`.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified: “Every cited case links to its source PDF. Research can be started from inside a matter, so the file's own documents are part of the context.”
- **Vaadhan** — https://vibecode.law/showcase/vaadhan-723173 — verified feature *Citation Verification*: “Verify case citations and identify relevant judicial authorities.” Adopted as: copilot context includes precedent items only through the existing Fact-Fit Gate scoring — never raw.

## OBJECTIVES

- Extend deep-linking so **every citation in the app** (drafts, verification reports, copilot answers) resolves to its source: user-uploaded document + page anchor, or case-book item.
- Harden copilot grounding: better chunking of noisy bilingual OCR, contradiction-aware retrieval, precedent items gated through Fact-Fit Gate scores.

## DETAILED TASKS (execute strictly in order)

### 7.1 Citation Deep-Link Layer (flag: `citation_deeplink`)
- Backend: extend citation objects with stable anchors `{source_type, source_id, locator: {page, paragraph, char_span}}` for user-uploaded documents; register/timeline/standard items already carry ids (W5).
- New resolver endpoint `GET /api/v1/citations/{citation_id}/resolve` in `backend/api/routes_citations.py` (flat convention) → returns source preview payload (text snippet + locator) for modals/panels.
- Draft outputs and Verification Report links rewritten to use the resolver (one click from every draft — preserves the existing acceptance rule).

### 7.2 Grounding Hardening (extends W5 endpoint)
- Re-chunk bilingual OCR documents with sentence-boundary + Devanagari/Latin script-aware splitting; dedupe near-identical annexure chunks.
- Contradiction-aware retrieval: when a question touches a contested fact, the retriever must include both contradicting items (dates, names, amounts, locations — the existing contradiction rules) with their contradiction id cited.
- Precedent handling: only Fact-Fit-Gate-scored precedents (COURT_SAFE/VERIFIED tiers) may appear in context; scores shown in citation chips metadata.

### 7.3 Frontend Type Alignment (with Devin)
- Update shared types for the enriched citation object; chips open resolver-powered preview modal with “View in source” (scrolls the document viewer to locator).

### 7.4 Tests & Regression
- TC-01: every copilot citation resolves to a real locator (100% required).
- TC-E07 (Adversarial Fake Citation): fake citations remain impossible — resolver 404s and the answer refuses.
- Bilingual noisy-OCR fixture answered correctly with correct page anchors.

### 7.5 Completion
```
docs/integration/WEEK07_TRAE_COMPLETION.md
```
Include: anchor schema, resolver contract, retrieval changes, regression tables, hand-off notes for Antigravity (W8).

## FILES TOUCHED
`backend/api/routes_copilot.py` + new `backend/api/routes_citations.py` resolver + retrieval modules under `backend/rag/` (hybrid_search, document_store) • shared TS types • draft/verification link wiring • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR TRAE (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 7 of the 12-week integration plan, behind flag `citation_deeplink`. Implement the verified Vyaas standard — every cited case links to its source — across the whole app: extend citations with stable locators `{source_type, source_id, locator:{page, paragraph, char_span}}` for user-uploaded documents, add `backend/api/routes_citations.py` (existing flat routes convention) exposing `GET /api/v1/citations/{citation_id}/resolve` returning a preview payload, and rewrite draft + Verification Report + copilot citation chips to resolve through it in one click. Harden the W5 copilot grounding by extending the existing backend/rag/ modules (hybrid_search.py, document_store.py): script-aware chunking for noisy bilingual (Hindi/English) OCR, near-duplicate annexure dedupe, contradiction-aware retrieval that cites both sides of a contested fact, and precedent context restricted to Fact-Fit-Gate-scored COURT_SAFE/VERIFIED items (scored by backend/agents/fact_fit_engine.py) with scores in chip metadata. PENDING/FATAL_ERROR stay blocked everywhere. Tests: TC-01 100% citation resolution, TC-E07 fake citations impossible (404 → refusal), bilingual OCR fixture with correct anchors. Keep the Netlify static demo working with backend optional. Write `docs/integration/WEEK07_TRAE_COMPLETION.md` and commit conventionally.

## WEEK 7 ACCEPTANCE CRITERIA
- [x] 100% of TC-01 citations (draft + copilot) resolve to a real source locator in one click
- [x] TC-E07 fake citations impossible; refusal path proven
- [x] Contradiction questions return both contradicting items with ids
- [x] Clean-clone Netlify deploy succeeds; `WEEK07_TRAE_COMPLETION.md` committed

> **Week 7 Status**: ✅ **COMPLETED** — All Week 7 Grounding Hardening & Citation Deep-Link objectives executed and verified.

---

## WEEK 8 — ENRICHMENT (Observability / Hardening Handoff for Citation Deep-Links)
**Theme**: Guided Workflow Support & Production Observability (per 5-week cadence)

### Detailed Tasks (Week 8 Enrichment for Citation Deep-Links + Copilot)
1. Surface citation-resolution tracing (response times, 404 rates, Fact-Fit-Gate tier breakdown) in the existing observability panel / API.
2. Harden `/api/v1/citations/{citation_id}/resolve` and copilot endpoints with retry logic + exponential backoff for retrieval and resolver calls.
3. Enforce resolver payload size and citation-id format validation on both frontend and backend (reject malformed requests early with clear bilingual messages).
4. Write enrichment note:
   ```
   docs/integration/WEEK08_TRAE_DEEPLINK_NOTE.md
   ```

### Week 8 Acceptance Criteria
- [x] Citation-resolution tracing and tier-breakdown data exposed via observability API
- [x] Retry logic with exponential backoff active on resolver and copilot endpoints
- [x] Resolver payload size + citation-id format validation enforced on frontend and backend (clear bilingual errors)
- [x] `WEEK08_TRAE_DEEPLINK_NOTE.md` committed

> **Week 8 Status**: ✅ **COMPLETED** — All Week 8 Citation Deep-Link observability & hardening objectives executed and verified.

---

## WEEK 9 — FINAL LOCK (Grounding Hardening & Citation Deep-Links)
**Theme**: Production Release Hygiene & Backend Security Final Lock

### Detailed Tasks (Week 9 Final Enrichment for Citation Deep-Links)
1. Final backend security review of the citation-deeplink surface:
   - Input validation on `/api/v1/citations/*` and copilot payloads
   - Rate limits on all resolver and copilot endpoints (HTTP 429 + retry guidance)
   - No error leakage of paths / stack / secrets / raw document snippets beyond the preview contract
2. Re-verify that PENDING and FATAL_ERROR citations remain fully blocked in BOTH drafts AND copilot answers (untouched by resolver).
3. Re-verify the Fact-Fit Gate functions correctly; Citation Blocking passes full regression on TC-01 and TC-E07.
4. Confirm clean-clone Netlify deploy still succeeds with `citation_deeplink` flag both ON and OFF.
5. Write final lock report:
   ```
   docs/integration/WEEK09_TRAE_DEEPLINK_FINAL_LOCK.md
   ```

### Week 9 Acceptance Criteria (Final Lock = Week 5)
- [x] Final backend security review completed (input validation, rate limits, error leakage, secrets handling on resolver + copilot endpoints)
- [x] All observability endpoints for Citation Deep-Links safe for production (no sensitive data beyond preview contract)
- [x] Citation blocking and Fact-Fit Gate re-verified and fully functional in drafts AND copilot (no regressions from resolver)
- [x] Clean-clone Netlify deploy succeeds with `citation_deeplink` flag both ON and OFF
- [x] `WEEK09_TRAE_DEEPLINK_FINAL_LOCK.md` committed

> **Week 9 Status**: ✅ **COMPLETED** — All Week 9 (Final Lock) Citation Deep-Link & Grounding Hardening objectives executed and verified. (Week 9 / Final Lock is the final enrichment week — no further advancement.)

---

## ACCURACY GUARDRAILS
The resolver serves previews only — it can never fabricate text or upgrade a citation’s tier. Fact-Fit Gate scoring logic untouched.

## ROLLBACK
Flag `citation_deeplink` OFF falls back to plain citation text (no anchors); resolver endpoint is additive and independently disableable.
