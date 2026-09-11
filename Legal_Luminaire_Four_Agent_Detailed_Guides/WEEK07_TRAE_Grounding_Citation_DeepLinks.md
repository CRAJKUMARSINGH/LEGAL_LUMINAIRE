# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 7 — ASK LUMINAIRE: GROUNDING HARDENING & CITATION DEEP-LINKS
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
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

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 7 deliverables must undergo comprehensive verification following Week 5 (Final Lock) production lock standards:

**Testing Methodology**:
1. **Resolver Endpoint Contract Review**: Static review of `backend/api/routes_citations.py` path parameters, Pydantic schema for `{source_type, source_id, locator:{page, paragraph, char_span}}`, HTTP codes (200/404/422), and preview payload contract against spec.
2. **Citation Anchor Audit**: Walk every citation in TC-01 (draft output, Verification Report, copilot answers) and confirm resolver returns a matching source locator for each — 100% hit rate required.
3. **Fake-Citation / TC-E07 Adversarial Audit**: Inject 15 malformed citation ids (short, non-hex, wrong-shape, non-existent) plus 10 plausible-but-fake citation strings into copilot prompts; confirm resolver 404s on invalid ids and the answer path flatly refuses to invent citations.
4. **Grounding Regression Test**: Exercise W5 copilot endpoint on bilingual noisy-OCR fixtures before and after the W7 chunking changes; compare answer quality, citation count, and page-anchor accuracy — no regressions in correctness; anchor precision improved or maintained.
5. **Contradiction-Aware Retrieval Test**: Pose 10 contested-fact questions (dates, names, amounts, locations) and assert both contradicting annexure items appear in context with correct contradiction ids cited in metadata.
6. **Precedent Gate Enforcement Test**: Audit every context-bundle log entry to confirm only Fact-Fit-Gate-scored COURT_SAFE / VERIFIED tier precedents are sent; never SECONDARY, PENDING, or FATAL_ERROR — with scores present in chip metadata.
7. **Frontend Chip + Resolver Modal Integration Test**: Click every citation chip in draft, report, and copilot surfaces; assert resolver modal opens, preview snippet shows, and “View in source” scrolls the viewer to page/paragraph locator without JS errors.
8. **Netlify Clean-Clone + Flag-Matrix Verification**: Fresh clone → build → deploy with `citation_deeplink` both ON and OFF; assert SPA routing, chip rendering, and resolver fallback work when backend is optional.

**Testing Coverage**:
- ✅ `GET /api/v1/citations/{citation_id}/resolve` 200/404/422 behavior, preview payload shape (snippet + locator + metadata), no path/stack/secrets leakage
- ✅ Stable anchor extension on citation objects: `{source_type, source_id, locator:{page, paragraph, char_span}}` for user-uploaded docs
- ✅ Draft + Verification Report + copilot chips rewritten → one-click resolution (Vyaas standard)
- ✅ Script-aware (Devanagari/Latin boundary) sentence chunking on bilingual OCR + near-duplicate annexure dedupe
- ✅ Contradiction-aware retrieval: both sides of contested fact returned with contradiction ids cited
- ✅ Precedent context restricted to Fact-Fit-Gate-scored COURT_SAFE / VERIFIED tiers; scores in chip metadata
- ✅ Resolver modal UI: preview snippet + “View in source” scroll-to-locator on document viewer
- ✅ PENDING / FATAL_ERROR citations fully blocked — resolver never surfaces them either
- ✅ TC-01: 100% citation-to-locator resolution hit rate
- ✅ TC-E07: fake citations impossible (resolver 404 + answer-level refusal)
- ✅ Netlify clean-clone passes with `citation_deeplink` flag ON and OFF
- ✅ Demo Mode: synthetic citations labeled SYNTHETIC/DEMO and resolver surfaces demo-only locators

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings in the Citation Deep-Link surface must include both English and Hindi labels:

**Resolver Modal / Citation Chip Labels**:
- ✅ "Source" / "स्रोत"
- ✅ "Page" / "पृष्ठ"
- ✅ "Paragraph" / "पैरा"
- ✅ "Preview" / "पूर्वावलोकन"
- ✅ "View in source document" / "स्रोत दस्तावेज़ में देखें"
- ✅ "Citation not found" / "उद्धरण नहीं मिला"
- ✅ "Unable to load citation preview" / "उद्धरण पूर्वावलोकन लोड करने में असमर्थ"
- ✅ "Locating in document…" / "दस्तावेज़ में स्थान खोजा जा रहा है…"

**Resolver Errors / Validation (bilingual)**:
- ✅ 404 refusal body: "Citation not found — the citation id may be invalid or the source document is no longer available." / "उद्धरण नहीं मिला — उद्धरण id अमान्य हो सकता है या स्रोत दस्तावेज़ अब उपलब्ध नहीं है।"
- ✅ 422 (malformed id): "Invalid citation id format." / "अमान्य उद्धरण id प्रारूप।"
- ✅ 429 (rate-limited): "Too many requests — please retry after a moment." / "बहुत अधिक अनुरोध — कृपया थोड़ी देर बाद पुनः प्रयास करें।"
- ✅ Backend-down fallback: "Citation preview unavailable (backend offline)." / "उद्धरण पूर्वावलोकन अनुपलब्ध (बैकएंड ऑफलाइन)।"

**Status**: All user-facing strings must include both English and Hindi labels as required, including resolver errors and validation messages surfaced through modals, chips, and notifications.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode citations and sample citation fixtures must be clearly labeled as SYNTHETIC/DEMO:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" badge on citation chips when rendered inside Demo Mode answers/drafts
- ✅ "SYNTHETIC / DEMO" header ribbon inside resolver modal for demo citations
- ✅ Resolver preview snippet footer: "This preview is generated from a synthetic/demo fixture." / "यह पूर्वावलोकन एक सिंथेटिक/डेमो फिक्स्चर से उत्पन्न किया गया है।"
- ✅ Locator values for demo fixtures include a `-demo` suffix marker in source_id so devs can distinguish at a glance

**Demo Integrity**:
- ✅ `isDemo` flag preserved on enriched citation objects when generated from Demo Mode or synthetic fixtures
- ✅ Demo citations cannot resolve against real case-book items; resolver returns a demo preview or 404 (no data bleed)
- ✅ Warning banner if user pastes a real-case citation link into a Demo Mode chat
- ✅ Synthetic citations never appear in non-Demo output, even if backend fixtures leak (filter at render tier)

**Status**: All synthetic/demo citations, modals, and fixtures must be clearly labeled and visually distinguished from real-case deep-links.

---

### NETLIFY COMPATIBILITY VERIFICATION

Citation Deep-Link routes, resolver types, and frontend modules must be compatible with existing Netlify SPA routing and the clean-clone build:

**SPA Routing Check**:
- ✅ Resolver modal is a client-side component overlay (no dedicated route needed); no 404 under Netlify `/* → /index.html` 200 redirect
- ✅ `citation_deeplink` OFF: chip clicks fall back to plain citation text; resolver tree-shaken; no console errors
- ✅ Document viewer scroll-to-locator works on Netlify-hosted PDF.js / viewer; no hardcoded `localhost` URLs
- ✅ Breadcrumbs and URL state preserved after resolver modal open/close

**Build Compatibility**:
- ✅ Shared TS types for `EnrichedCitation`, `SourceLocator`, `ResolveResponse`, `CitationResolveError` are strict and compile
- ✅ Frontend chip + modal components use existing UI library (CVA badges, modals, scroll helpers)
- ✅ Backend `routes_citations.py` is additive; `py_compile` passes; no import break when `citation_deeplink` off
- ✅ TypeScript strict mode: no `any` on resolver or anchor types
- ✅ No build errors or warnings introduced by resolver/deeplink modules

**Flag Isolation (matrix)**:
- ✅ `citation_deeplink` OFF + `copilot_streaming` OFF → static draft chips as plain text, no resolver calls
- ✅ `citation_deeplink` ON + `copilot_streaming` OFF → chip resolution works on all surfaces
- ✅ `citation_deeplink` OFF + `copilot_streaming` ON → streaming chips without resolver (fallback)
- ✅ `citation_deeplink` ON + `copilot_streaming` ON → streaming chips resolve after first delta containing citation_id

**Status**: All changes must be compatible with existing Netlify configuration, SPA routing, and the clean-clone build across the full flag-isolation matrix.

---

### ACCURACY RULES COMPLIANCE

Citation Deep-Links must never alter accuracy controls, verification tiers, Fact-Fit Gate, or citation blocking:

**Citation Blocking Re-Verification (Critical)**:
- ✅ PENDING citations remain fully blocked from draft output, Verification Report, AND copilot answers; resolver never returns a locator for PENDING id
- ✅ FATAL_ERROR citations remain fully blocked; resolver 404s; no chip rendered; not sent in context
- ✅ Citation tiers (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) untouched by enrichment
- ✅ `citation_tier` badges on chips unchanged; existing tier-filtering logic preserved

**Fact-Fit Gate & Verification Tiers**:
- ✅ Fact-Fit Gate scoring unchanged; resolver never re-runs Fact-Fit and never overrides
- ✅ Precedent context restriction to COURT_SAFE / VERIFIED enforced at retrieval tier (before enrichment); scores are read-only metadata on chips
- ✅ Verification tiers (1/2/3) unchanged; anchor extension happens post-verification
- ✅ Verification Report remains accessible and layout-identical after resolver link rewiring

**Resolver Accuracy Guardrails**:
- ✅ Resolver serves previews only — never fabricates text, never upgrades tier, never writes to index
- ✅ Preview snippet is a substring of the actual source doc at the locator; no LLM rewrite inside resolver
- ✅ `source_id` uniqueness enforced; two citations cannot resolve to swapped locators (non-repudiation)
- ✅ Locator (page/paragraph/char_span) is immutable once written; enrichments are additive only

**Status**: Citation Deep-Links must be completely isolated from accuracy logic — resolver is read-only, preview-only, additive-only.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 7 base acceptance criteria, Week 5 (Final Lock) enrichment requires:

- [ ] Resolver endpoint contract reviewed: schemas, HTTP codes, preview payload shape, zero error leakage verified
- [ ] TC-01 anchor audit passed: 100% of draft + Verification Report + copilot citations resolve to a real locator with correct page/paragraph
- [ ] TC-E07 adversarial audit passed: 15 malformed ids → 404; 10 fake citations → answer-level refusal; zero fabrication
- [ ] Bilingual labels verified end-to-end across all chip/modal/error surfaces (EN + HI present)
- [ ] Demo Mode / SYNTHETIC labeling preserved across chips, modals, and resolver output; `isDemo` flag retained
- [ ] Netlify clean-clone deploy succeeds for both `citation_deeplink` ON and OFF (full 4-way flag matrix tested)
- [ ] Contradiction-aware retrieval test passed: 10 contested-fact questions → both sides returned with contradiction ids
- [ ] Precedent gate enforcement audit passed: 100% of context precedent items are COURT_SAFE/VERIFIED with scores in metadata
- [ ] PENDING / FATAL_ERROR citation blocking re-verified after resolver rewiring (drafts, report, copilot, resolver 404)
- [ ] Accessibility compliance verified (keyboard chip focus, modal ARIA, announce-on-resolve, ESC-to-close)
- [ ] WEEK07_TRAE_COMPLETION.md includes anchor schema, resolver contract, retrieval changes, regression tables, and W8 hand-off notes

---

### WEEK 5 HAND-OFF NOTES

**For Future Development (Antigravity W8 Observability / Hardening → Kiro W9 Final Lock)**:
1. **Resolver Caching**: Add LRU cache on hot `citation_id → preview` pairs with 60-second TTL to reduce document-store reads; invalidate on re-upload of source_id.
2. **Anchor Stability Guarantee**: Introduce a `locator_hash` field on citations so downstream consumers can detect if a document OCR re-run shifted anchors; log a stability metric.
3. **Precision Deep-Links for Non-Annexure Sources**: Extend anchors to register/timeline/standard source types (Week 5 ids exist; needs locator mapping).
4. **Grounding Quality Signal**: Pipe contradiction-id citation count + precedent Fact-Fit score distribution into the observability panel as leading indicators of answer quality regressions.

**For Documentation & Governance Maintenance**:
1. Keep the TC-01 and TC-E07 anchor auditors up to date as new answer paths or output surfaces are introduced; add an automated golden anchor-regression job on CI.
2. Maintain the EN+HI label registry for all chip/modal/error strings — whenever a new error code or UI surface is added, both languages must ship in the same PR.
3. Re-run the precedent-gate enforcement audit after any retrieval or Fact-Fit refactor; the audit script should live under `scripts/audit_precedent_gate.py`.
4. Keep the flag-matrix test plan (`citation_deeplink` × `copilot_streaming`) version-controlled and re-validated on every release candidate.

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: WEEK07_TRAE_Grounding_Citation_DeepLinks.md
**Lines Added**: ~170 (Week 5 enrichment sections)
**Lines Removed**: 0

**Suggested Commit Message**:
```
docs: Apply Week 5 enrichment standards to Week 7 Grounding/Citation DeepLinks guide

- Bump guide version to 1.1 (enriched)
- Add Week 5 verification methodology (endpoint contract, anchor audit, TC-01/TC-E07 adversarial, grounding regression, contradiction retrieval, precedent gate audit, chip+modal integration, Netlify flag matrix)
- Add bilingual compliance verification (resolver modal/chip labels, 404/422/429/offline error bodies EN+HI)
- Add synthetic case labeling verification (SYNTHETIC/DEMO badges on chips & modal, isDemo flag, no data bleed)
- Add Netlify compatibility verification (SPA overlay, build/TS strict, 4-way flag matrix citation_deeplink × copilot_streaming)
- Add accuracy rules compliance (PENDING/FATAL_ERROR blocking, Fact-Fit gate, resolver preview-only guarantee, immutable locator)
- Enhance acceptance criteria with Week 5 enrichment-specific checks and a11y
- Add hand-off notes for caching, anchor stability hash, precedent audit CI, and flag-matrix governance
```
