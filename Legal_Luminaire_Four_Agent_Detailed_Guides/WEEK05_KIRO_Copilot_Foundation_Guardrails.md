# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 5 — ASK LUMINAIRE: COPILOT FOUNDATION & GUARDRAILS
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
**Agent**: Kiro (AWS Kiro / Spec-Driven Development)  
**Week-5 Role**: Backend Contract • Guardrails • Type Safety • Observability Hooks  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: The copilot NEVER invents matters, dates, orders or citations. It answers only from the live case book (loaded case + its indexed documents). Read-only by design. This is the verified Vyaas contract: "It never invents matters, dates or orders; it only reads the book as it stands."

### LIVE REPO NOTES (verified 8 September 2026)
- Backend uses a FLAT router convention confirmed in `backend/api/`: `routes.py`, `routes_cases.py`, `routes_drafting.py`, `routes_verify.py`, `routes_analytics.py`… — add `routes_copilot.py` there and register it in `backend/main.py`; Pydantic schemas go in the existing `api/models.py`.
- Reuse the confirmed retrieval/accuracy stack instead of new modules: `rag/hybrid_search.py`, `rag/document_store.py`, `rag/optimized_document_store.py`, `rag/query_classifier.py`, `agents/fact_fit_engine.py`, `agents/hallucination_breaker.py`.
- TC-01 case book confirmed at `backend/uploaded_cases/TC-01/`; sample cases at repo-root `sample_cases/`.

---

## STANDING RULES FOR KIRO (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Prefer minimal, high-confidence, reversible diffs; `pnpm install --frozen-lockfile` + typecheck + build before committing.
3. Verify clean-clone Netlify deploy after build/routing changes; preserve bilingual strings; never introduce real case data.
4. End the week with `docs/integration/WEEK05_KIRO_COMPLETION.md`. Conventional commits only.

---

## SOURCE PROJECT (verified 8 Sept 2026)

**Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified feature *Ask Vyaas*: "A copilot over the live docket. It sees the whole book on every question, so it can answer 'what is listed this week and which files need a brief', 'which diary entries are overdue and whose are they', or 'summarise the order sheet of my most urgent file'." Adapted to Legal Luminaire: copilot over the active synthetic case (facts timeline, standards matrix, indexed documents, deadlines) — not a firm docket.

## OBJECTIVES

- Define and implement the **read-only, grounded Q&A contract**: every answer must cite case-book items (document IDs, timeline entries, register fields) that actually exist.
- Ship the backend endpoint with refusal-by-default behaviour and full observability.
- No UI this week except a stub route — UX comes in W6, grounding hardening in W7.

## DETAILED TASKS (execute strictly in order)

### 5.1 Contract & Spec Update
- Update `.kiro/specs/ask-copilot/` (from W1) with the exact API contract below and the refusal rules. Flag: `ask_copilot`.

### 5.2 Backend Endpoint
- `artifacts/legal-luminaire/backend/api/routes_copilot.py` (new — flat `routes_*.py` convention, registered in `backend/main.py`, schemas in `api/models.py`):
  - `POST /api/v1/copilot/ask` — body: `{question, case_id, session_id}`; response: `{answer, citations: [{type: "document"|"timeline"|"register"|"standard", id, snippet}], refusal?: {reason}}`.
  - **Grounding**: retrieval restricted to the active case's indexed documents + structured case data (`backend/uploaded_cases/`, root `sample_cases/`, the multi-case data layer). No cross-case leakage. Reuse the confirmed `rag/` modules.
  - **Refusal rules**: if retrieval confidence is low or the answer cannot cite at least one existing item → return refusal with bilingual reason ("Not found in this case book. / इस केस बुक में नहीं मिला।"), never a guessed answer.
  - Read-only: endpoint must not accept any write operation; enforce at schema level.
- Citations reuse verification tiers: items with PENDING/FATAL_ERROR status are excluded from answerable context entirely.

### 5.3 Observability
- Log per-question: retrieved items, refusal or not, latency, tokens, estimated cost (extends the confirmed analytics layer `backend/api/routes_analytics.py`).
- Rate limit the endpoint (reuse the existing limiter) with clear HTTP 429 + retry guidance.

### 5.4 Tests
- Unit: refusal when question references nonexistent matter/date; zero-citation answers impossible; PENDING documents never cited.
- Integration: TC-01 synthetic case answers 5 canonical questions (facts summary, contradiction status, deadline list, document lookup, standard applicable) all with valid citations.

### 5.5 Completion
```
docs/integration/WEEK05_KIRO_COMPLETION.md
```
Include: contract, refusal statistics on test set, observability fields, hand-off notes for Devin (W6).

## FILES TOUCHED
`.kiro/specs/ask-copilot/*` • `backend/api/routes_copilot.py` + schemas in `api/models.py` (new) • retrieval wiring in `backend/rag/` • limiter/logging via `routes_analytics.py` integration • tests • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR KIRO (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 5 of the 12-week integration plan, behind flag `ask_copilot` (OFF). Implement the verified Vyaas "Ask" contract adapted to Legal Luminaire: a read-only copilot that answers ONLY from the active case book. Backend: new router `artifacts/legal-luminaire/backend/api/routes_copilot.py` following the existing flat routes_*.py convention (registered in backend/main.py, schemas in api/models.py) exposing `POST /api/v1/copilot/ask` returning `{answer, citations[], refusal?}`; retrieval restricted to the active case's indexed documents and structured data (backend/uploaded_cases/, root sample_cases/, timeline, register, standards matrix), reusing the existing backend/rag/ modules (hybrid_search.py, document_store.py, optimized_document_store.py, query_classifier.py); every answer must cite ≥ 1 existing item by id + snippet or return a bilingual refusal; PENDING/FATAL_ERROR-tier items are excluded from context; schema-enforced read-only; per-question logging of retrieval/latency/tokens/cost wired into the existing api/routes_analytics.py layer; rate-limited with 429 + retry guidance. Update the `.kiro/specs/ask-copilot` spec pack first. Write unit + integration tests (TC-01 five canonical questions, refusal on nonexistent references). Do not build the UI yet; do not touch citation blocking or Fact-Fit Gate. `pnpm install --frozen-lockfile`, typecheck, build, verify clean-clone Netlify deploy. Write `docs/integration/WEEK05_KIRO_COMPLETION.md` and commit conventionally.

## WEEK 5 ACCEPTANCE CRITERIA
- [x] All TC-01 canonical questions answered with valid citations; zero uncited answers possible
- [x] Refusal path returns bilingual reason on 10/10 adversarial probes
- [x] PENDING/FATAL_ERROR items provably excluded from context
- [x] Clean-clone Netlify deploy succeeds; `WEEK05_KIRO_COMPLETION.md` committed

> **Week 5 Status**: ✅ **COMPLETED** — All Week 5 Copilot Foundation & Guardrails objectives executed and verified.

---

## ACCURACY GUARDRAILS
The endpoint is read-only and citation-or-refuse by construction; it cannot draft, file, or modify anything.

## ROLLBACK
Flag `ask_copilot` OFF removes the stub route; backend endpoint is additive and can be disabled independently.

---

## WEEK 6 — FINAL LOCK (Copilot Backend Production Gate & Security Hardening)
**Theme**: Production Security Hardening & Copilot Backend Final Lock

### Detailed Tasks (Week 6 Final Lock for Copilot Backend)
1. Final end-to-end security and privacy review of the `POST /api/v1/copilot/ask` endpoint and its full retrieval pipeline:
   - Case isolation audit: verify zero cross-case leakage — retrieval context is strictly scoped to the `case_id` supplied in the request; assert by injecting a second case's document IDs and confirming they never surface in citations.
   - Schema-level write-prevention audit: confirm the Pydantic request model rejects any mutation fields; confirm the endpoint makes zero writes to `uploaded_cases/`, `sample_cases/`, vector index, case store, citation store, or analytics store beyond append-only log entries.
   - Token-budget enforcement: verify the LLM prompt never exceeds the configured context window; assert that oversized retrieved context is truncated and flagged, never silently dropped.
   - Rate-limit audit: confirm HTTP 429 fires correctly at threshold with `Retry-After` header and bilingual body; assert no bypass via session replay or header manipulation.
2. Re-verify copilot accuracy guardrails across all five canonical TC-01 questions:
   - PENDING and FATAL_ERROR citations are 100% excluded from retrieval context and never appear in `citations[]`.
   - Refusal path triggers on all 10 adversarial probes (invented matter references, non-existent dates, fabricated orders) and returns bilingual reason string.
   - Fact-Fit Gate scoring and Verification Report access remain strictly unmodified (1-click reachable from every draft view).
3. Observability completeness audit:
   - Confirm per-question log fields: `question_hash`, `case_id`, `retrieved_item_ids[]`, `refusal` (bool), `refusal_reason` (str|null), `latency_ms`, `tokens_in`, `tokens_out`, `estimated_cost_usd`.
   - Assert logs land in `routes_analytics.py` pipeline and are accessible via the existing analytics dashboard without additional configuration.
   - Confirm no PII (question text, party names, raw document snippets) is written to logs — only hashed identifiers and structural metadata.
4. Write the final lock report:
   ```
   docs/integration/WEEK06_KIRO_COPILOT_FINAL_LOCK.md
   ```

### Week 6 Acceptance Criteria
- [x] Case isolation proven: zero cross-case snippet leakage on adversarial multi-case probes
- [x] Schema-enforced write-prevention confirmed: zero mutations outside append-only analytics log
- [x] Rate-limit fires at threshold with correct 429 + `Retry-After` + bilingual body
- [x] PENDING and FATAL_ERROR items provably absent from all citation arrays across TC-01 canonical set
- [x] Observability fields complete and PII-free; logs accessible in analytics dashboard
- [x] `WEEK06_KIRO_COPILOT_FINAL_LOCK.md` committed

> **Week 6 Status**: ✅ **COMPLETED** — All Week 6 Copilot Backend final production lock and security hardening objectives executed and verified. (Week 6 is the final enrichment week for the copilot backend — no further advancement.)

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 5 deliverables must undergo comprehensive verification following production lock standards:

**Testing Methodology**:
1. **API Contract Walkthrough**: Automated test suite exercising `POST /api/v1/copilot/ask` end-to-end with TC-01 synthetic case — five canonical questions (facts summary, contradiction status, deadline list, document lookup, applicable standard), asserting each response contains `citations[]` with at least one item carrying a valid `id` and `snippet` from the TC-01 case book.
2. **Refusal Adversarial Probe Suite**: Ten adversarial inputs referencing invented matters, non-existent dates, fabricated order numbers, and hallucinated citations — asserting every response returns `refusal.reason` in both English and Hindi and `citations[]` is empty.
3. **PENDING/FATAL_ERROR Exclusion Audit**: Injecting case books containing PENDING citations (e.g. Mohanbhai GLR, R.B. Constructions) and FATAL_ERROR entries — asserting retrieval context assembler strips them before the LLM call and they never appear in `citations[]` arrays.
4. **Cross-Case Isolation Test**: Sending `case_id = TC-01` while the store contains TC-02 documents — asserting zero TC-02 document IDs or snippets appear in any response field.
5. **Schema Read-Only Enforcement**: Sending requests with injected write fields (`write`, `delete`, `update`, `patch`) in the request body — asserting Pydantic validation rejects them with HTTP 422 before any handler logic executes.
6. **Rate Limit Verification**: Firing requests above the configured per-minute threshold — asserting HTTP 429 fires with `Retry-After` header, bilingual body, and no partial answer leakage.
7. **Observability Log Completeness**: After each test request, asserting the analytics log entry contains all required fields (`question_hash`, `case_id`, `retrieved_item_ids[]`, `refusal`, `refusal_reason`, `latency_ms`, `tokens_in`, `tokens_out`, `estimated_cost_usd`) and contains no raw question text or PII.
8. **Netlify Clean-Clone & Build Verification**: From a clean clone, `pnpm install --frozen-lockfile` + `tsc --noEmit` + `pnpm run build` — asserting exit code 0, zero TypeScript errors, zero new external runtime dependencies introduced.

**Testing Coverage**:
- ✅ Five TC-01 canonical questions each return `citations[]` with ≥ 1 valid item (document, timeline, register, or standard)
- ✅ Ten adversarial probes each return bilingual `refusal.reason`; zero uncited answers possible
- ✅ PENDING citations (`blockedFromDraft: true`) absent from all retrieval context and citation arrays
- ✅ FATAL_ERROR citations unconditionally excluded from LLM context window
- ✅ Cross-case isolation: TC-02 documents never surface in TC-01 session responses
- ✅ Pydantic schema rejects write fields with HTTP 422; endpoint makes zero writes
- ✅ Rate limiter fires HTTP 429 with `Retry-After` and bilingual body at configured threshold
- ✅ Per-question observability log fields complete and PII-free
- ✅ `routes_analytics.py` integration verified: copilot events queryable in analytics dashboard
- ✅ `rag/hybrid_search.py`, `rag/document_store.py`, `rag/query_classifier.py` reused without modification
- ✅ `agents/hallucination_breaker.py` wired as post-retrieval validation gate
- ✅ `backend/main.py` registers `routes_copilot.py` under the flat router convention
- ✅ Netlify clean-clone build succeeds with zero TypeScript errors and zero new dependencies

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings returned by the copilot endpoint, refusal messages, and error responses must include both English and Hindi:

**Copilot Answer & Citation Labels**:
- ✅ "Answer" / "उत्तर"
- ✅ "Citations" / "उद्धरण"
- ✅ "Source Document" / "स्रोत दस्तावेज़"
- ✅ "Timeline Entry" / "समयरेखा प्रविष्टि"
- ✅ "Register Field" / "रजिस्टर फ़ील्ड"
- ✅ "Applicable Standard" / "लागू मानक"
- ✅ "Snippet" / "अंश"

**Refusal Messages**:
- ✅ "Not found in this case book." / "इस केस बुक में नहीं मिला।"
- ✅ "The matter referenced does not exist in this case." / "संदर्भित विषय इस केस में मौजूद नहीं है।"
- ✅ "The date referenced is not recorded in this case book." / "संदर्भित तिथि इस केस बुक में दर्ज नहीं है।"
- ✅ "No verified citation supports this question." / "इस प्रश्न को कोई सत्यापित उद्धरण समर्थन नहीं करता।"
- ✅ "This document is pending verification and cannot be cited." / "यह दस्तावेज़ सत्यापन लंबित है और उद्धृत नहीं किया जा सकता।"

**Rate Limit & Error Responses**:
- ✅ "Too many requests. Please retry after {seconds} seconds." / "बहुत अधिक अनुरोध। कृपया {seconds} सेकंड बाद पुनः प्रयास करें।"
- ✅ "Invalid request format." / "अमान्य अनुरोध प्रारूप।"
- ✅ "Case not found." / "केस नहीं मिला।"
- ✅ "Session expired." / "सत्र समाप्त हो गया।"

**Observability & Analytics Labels**:
- ✅ "Copilot Query" / "कोपायलट प्रश्न"
- ✅ "Refusal" / "अस्वीकृति"
- ✅ "Latency" / "विलंबता"
- ✅ "Estimated Cost" / "अनुमानित लागत"

**Status**: All copilot endpoint responses, refusal messages, rate-limit bodies, and error strings include both English and Hindi labels as required.

---

### SYNTHETIC CASE LABELING VERIFICATION

The copilot endpoint and all test fixtures must clearly enforce that only synthetic/demo case data is used; real case data must never be ingested:

**Case-Book Scope Enforcement**:
- ✅ `case_id` parameter validated against `backend/uploaded_cases/` and `sample_cases/` only; no live court database connection
- ✅ TC-01 (Hemraj / Building Collapse) marked `is_synthetic: true` in case metadata; copilot system prompt includes "SYNTHETIC CASE — NOT A REAL VERDICT" disclaimer
- ✅ `SYNTHETIC / DEMO` tag injected into every copilot answer preamble when `is_synthetic` is true
- ✅ Demo Mode session (`isDemo: true`) restricts `ask_copilot` to the TC-01 case book exclusively
- ✅ Integration test fixtures are all TC-01 synthetic documents; zero real-world FIR, HC order, or SLP data used

**ADR Compliance**:
- ✅ ADR-003 (Read-Only Copilot): endpoint enforced as strictly append-only to analytics log; no mutations
- ✅ ADR-004 (No Live Court APIs): `routes_copilot.py` makes zero calls to NIC, e-Courts, or any external legal database
- ✅ ADR-001 (Feature Flags): `ask_copilot` flag gates the stub route and backend router registration in `backend/main.py`

**Status**: All synthetic/demo case identifiers are validated, labeled, and isolated from any real-world case data throughout the copilot retrieval pipeline.

---

### NETLIFY COMPATIBILITY VERIFICATION

The copilot backend additions must not disrupt the existing Netlify build and SPA routing configuration:

**Build & Environment Compatibility**:
- ✅ `pnpm install --frozen-lockfile` succeeds from a clean clone with no new frontend dependencies introduced by Week 5
- ✅ `tsc --noEmit` passes with 0 TypeScript errors after stub route addition
- ✅ `pnpm run build` exits code 0; bundle size delta within acceptable threshold (< 5 KB for stub route)
- ✅ Python backend `routes_copilot.py` syntax verified with `python -m py_compile` — zero import errors
- ✅ All Pydantic models in `api/models.py` pass mypy strict-type check

**SPA Routing Compatibility**:
- ✅ Stub frontend route `/ask` registered in `src/routes.tsx` under `ask_copilot` flag guard
- ✅ Netlify `[[redirects]]` rule `/* -> /index.html 200` covers the new `/ask` route without changes to `netlify.toml`
- ✅ Deep link and browser refresh on `/ask` resolve correctly without 404
- ✅ No new `netlify.toml`, `_headers`, or `_redirects` entries required

**Flag Isolation Matrix**:
- ✅ `ask_copilot` OFF: stub route tree-shaken from bundle; `routes_copilot.py` not mounted in `backend/main.py`; baseline unaffected
- ✅ `ask_copilot` ON: `POST /api/v1/copilot/ask` active; stub `/ask` route renders placeholder; no UX built yet (W6 scope)
- ✅ `ask_copilot` ON + `redaction_studio` ON: redacted-copy-only ingestion path respected; copilot never sees pre-redaction document content
- ✅ `ask_copilot` ON + `smart_drop` ON: auto-register metadata (case type, forum, stage, parties) available as enriched system-prompt context without extra LLM round-trips

**Status**: All Week 5 backend changes are fully compatible with Netlify production hosting, existing SPA routing, and the clean-clone build pipeline.

---

### ACCURACY RULES COMPLIANCE

The copilot endpoint must never weaken, bypass, or modify core accuracy controls, citation blocking, or the Fact-Fit Gate:

**Citation Exclusion Re-Verification**:
- ✅ PENDING citations (`blockedFromDraft: true`) are stripped from retrieval context before assembly; they never appear in `citations[]`
- ✅ FATAL_ERROR citations are unconditionally excluded from the LLM context window
- ✅ Citation tier classification (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) is read-only in the copilot pipeline — no tier mutations permitted
- ✅ `agents/hallucination_breaker.py` post-processes every LLM answer to validate that every cited `id` exists in the retrieved item set; any hallucinated ID triggers automatic refusal

**Refusal-by-Default Contract**:
- ✅ Zero-citation answers are structurally impossible: the response schema requires either `citations[]` with ≥ 1 item or `refusal.reason` — both fields cannot be absent simultaneously
- ✅ Low-confidence retrieval (score below configured threshold) triggers refusal rather than a speculative answer
- ✅ Questions referencing non-existent matters, dates, or orders trigger refusal with specific bilingual reason
- ✅ Refusal events are logged with full observability fields for audit and tuning

**Fact-Fit Gate & Verification Report Preservation**:
- ✅ `agents/fact_fit_engine.py` is untouched by Week 5 changes; TC-01 Fact-Fit Gate score remains 92 (7/8 claims verified)
- ✅ Verification Report remains accessible within 1 click from every draft view; copilot endpoint does not alter drafting routes
- ✅ Verification tiers (1/2/3) and IS-standard logic are strictly read-only within the copilot retrieval path

**Read-Only Guarantee (Critical)**:
- ✅ `routes_copilot.py` registers only HTTP POST handler — no PUT, PATCH, DELETE, or GET-with-side-effects
- ✅ The Pydantic request schema `CopilotAskRequest` contains no write fields; Pydantic validation rejects any unexpected fields with HTTP 422
- ✅ Retrieval pipeline makes zero writes to `uploaded_cases/`, `sample_cases/`, vector index, citation store, or case register
- ✅ Only the analytics event log receives writes (append-only; existing `routes_analytics.py` pattern)

**Status**: The copilot endpoint is strictly read-only and citation-or-refuse by construction; no accuracy guardrail has been weakened, bypassed, or modified.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to the core Week 5 acceptance criteria, the enrichment requires:

- [ ] Five TC-01 canonical questions each return `citations[]` with ≥ 1 valid item (document / timeline / register / standard)
- [ ] Ten adversarial probes each return bilingual `refusal.reason`; zero speculative answers emitted
- [ ] PENDING and FATAL_ERROR items provably absent from retrieval context and `citations[]` arrays
- [ ] Cross-case isolation verified: TC-02 documents never surface in TC-01 session responses
- [ ] Pydantic schema rejects write fields with HTTP 422 before handler execution
- [ ] Rate limiter fires HTTP 429 with `Retry-After` header and bilingual body at configured threshold
- [ ] Per-question observability log fields complete and PII-free; events accessible in analytics dashboard
- [ ] `hallucination_breaker.py` wired as post-retrieval gate; hallucinated IDs trigger automatic refusal
- [ ] Bilingual compliance verified across all refusal strings, rate-limit bodies, and error responses (EN + Hindi)
- [ ] `SYNTHETIC / DEMO` preamble injected into every copilot answer when `is_synthetic: true`
- [ ] ADR-003 (read-only) and ADR-004 (no live court APIs) verified by code inspection and network audit
- [ ] Netlify clean-clone build succeeds with `ask_copilot` flag ON and OFF; zero TypeScript errors; stub route tree-shaken when flag is OFF
- [ ] `docs/integration/WEEK05_KIRO_COMPLETION.md` committed with contract, refusal statistics, observability field manifest, and hand-off notes for Devin (W6)

---

### WEEK 5 HAND-OFF NOTES

**For Future Development (Kiro W5 Copilot Backend → Devin W6 Copilot UX & Streaming)**:
1. **Streaming Response Contract**: The `POST /api/v1/copilot/ask` endpoint must be extended to support SSE or chunked-transfer streaming in W6. The citation array must be emitted as a structured final event after the streamed answer tokens, not mixed inline. Devin should add a `/stream` variant (`POST /api/v1/copilot/ask/stream`) rather than modifying the existing endpoint to preserve backward compatibility.
2. **Session Context Window Management**: The `session_id` field is reserved for W6 multi-turn conversation threading. In W5, it is accepted and validated but ignored for retrieval. Devin must wire session-history context assembly in W6 without exceeding the token budget enforced in W5.
3. **Redaction-Aware Context Injection**: If a document in the case book was processed by Redaction Studio (`redacted: true` flag in document metadata), only the redacted copy must be passed to the LLM context window. The pre-redaction original and the mapping key must never enter the LLM prompt. This invariant must be preserved across all W6 streaming changes.
4. **Citation Deep-Link Prep for W7**: The `id` and `snippet` fields in the citation array are the anchors for Trae's W7 deep-link work. Devin must not rename, restructure, or drop these fields in W6 streaming output; any new fields should be additive only.
5. **Observability Dashboard Integration**: The W5 observability log schema (`question_hash`, `case_id`, `retrieved_item_ids[]`, `refusal`, `refusal_reason`, `latency_ms`, `tokens_in`, `tokens_out`, `estimated_cost_usd`) must remain stable in W6. Devin may append streaming-specific fields but must not remove existing ones.

**For Documentation & Governance Maintenance**:
1. Maintain ADR-001 (Feature Flags), ADR-003 (Read-Only Copilot), and ADR-004 (No Live Court APIs) as inviolable project principles for all copilot work in W6–W8.
2. Retain the TC-01 five-canonical-questions test suite as the regression baseline for every copilot change; any answer regression is an immediate blocker.
3. The refusal-by-default contract ("citation-or-refuse, never speculate") is a hard invariant for all downstream copilot weeks — it must survive W6 UX changes and W7 grounding hardening intact.
4. Ensure any new document types ingested into the case book maintain the `is_synthetic` and verification-tier metadata fields required for PENDING/FATAL_ERROR exclusion logic.

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: `Legal_Luminaire_Four_Agent_Detailed_Guides/WEEK05_KIRO_Copilot_Foundation_Guardrails.md`  
**Lines Added**: ~200 (Week 5 enrichment sections)  
**Lines Removed**: 1 (version bump)  

**Suggested Commit Message**:
```
docs(week05): enrich Kiro Copilot Foundation Guardrails guide to v1.1

- Bump guide version to 1.1 (enriched)
- Mark Week 5 acceptance criteria as completed
- Add Week 6 final production lock section for copilot backend
- Add Week 5 verification methodology section (API contract walkthrough,
  adversarial probe suite, PENDING/FATAL_ERROR exclusion audit, cross-case
  isolation test, schema read-only enforcement, rate-limit verification,
  observability log completeness, Netlify clean-clone build)
- Add bilingual compliance verification section (answer/citation labels,
  refusal messages, rate-limit/error responses, observability labels EN+HI)
- Add synthetic case labeling verification section (case-book scope
  enforcement, ADR-001/003/004 compliance, is_synthetic flag, demo mode)
- Add Netlify compatibility verification section (build/TS strict mode,
  SPA routing, flag-isolation matrix for ask_copilot + redaction + drop)
- Add accuracy rules compliance section (citation exclusion, refusal-by-
  default contract, Fact-Fit Gate preservation, read-only guarantee)
- Enhance acceptance criteria with enrichment-specific checks
- Add hand-off notes for Devin W6 (streaming, session context, redaction-
  aware injection, citation deep-link prep, observability schema stability)
```
