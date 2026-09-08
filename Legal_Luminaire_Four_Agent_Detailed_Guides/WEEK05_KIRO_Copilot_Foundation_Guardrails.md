# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 5 — ASK LUMINAIRE: COPILOT FOUNDATION & GUARDRAILS
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Kiro (AWS Kiro / Spec-Driven Development)  
**Week-5 Role**: Backend Contract • Guardrails • Type Safety • Observability Hooks  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: The copilot NEVER invents matters, dates, orders or citations. It answers only from the live case book (loaded case + its indexed documents). Read-only by design. This is the verified Vyaas contract: “It never invents matters, dates or orders; it only reads the book as it stands.”

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

**Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified feature *Ask Vyaas*: “A copilot over the live docket. It sees the whole book on every question, so it can answer ‘what is listed this week and which files need a brief’, ‘which diary entries are overdue and whose are they’, or ‘summarise the order sheet of my most urgent file’.” Adapted to Legal Luminaire: copilot over the active synthetic case (facts timeline, standards matrix, indexed documents, deadlines) — not a firm docket.

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
  - **Grounding**: retrieval restricted to the active case’s indexed documents + structured case data (`backend/uploaded_cases/`, root `sample_cases/`, the multi-case data layer). No cross-case leakage. Reuse the confirmed `rag/` modules.
  - **Refusal rules**: if retrieval confidence is low or the answer cannot cite at least one existing item → return refusal with bilingual reason (“Not found in this case book. / इस केस बुक में नहीं मिला。”), never a guessed answer.
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

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 5 of the 12-week integration plan, behind flag `ask_copilot` (OFF). Implement the verified Vyaas “Ask” contract adapted to Legal Luminaire: a read-only copilot that answers ONLY from the active case book. Backend: new router `artifacts/legal-luminaire/backend/api/routes_copilot.py` following the existing flat routes_*.py convention (registered in backend/main.py, schemas in api/models.py) exposing `POST /api/v1/copilot/ask` returning `{answer, citations[], refusal?}`; retrieval restricted to the active case’s indexed documents and structured data (backend/uploaded_cases/, root sample_cases/, timeline, register, standards matrix), reusing the existing backend/rag/ modules (hybrid_search.py, document_store.py, optimized_document_store.py, query_classifier.py); every answer must cite ≥ 1 existing item by id + snippet or return a bilingual refusal; PENDING/FATAL_ERROR-tier items are excluded from context; schema-enforced read-only; per-question logging of retrieval/latency/tokens/cost wired into the existing api/routes_analytics.py layer; rate-limited with 429 + retry guidance. Update the `.kiro/specs/ask-copilot` spec pack first. Write unit + integration tests (TC-01 five canonical questions, refusal on nonexistent references). Do not build the UI yet; do not touch citation blocking or Fact-Fit Gate. `pnpm install --frozen-lockfile`, typecheck, build, verify clean-clone Netlify deploy. Write `docs/integration/WEEK05_KIRO_COMPLETION.md` and commit conventionally.

## WEEK 5 ACCEPTANCE CRITERIA
- [ ] All TC-01 canonical questions answered with valid citations; zero uncited answers possible
- [ ] Refusal path returns bilingual reason on 10/10 adversarial probes
- [ ] PENDING/FATAL_ERROR items provably excluded from context
- [ ] Clean-clone Netlify deploy succeeds; `WEEK05_KIRO_COMPLETION.md` committed

## ACCURACY GUARDRAILS
The endpoint is read-only and citation-or-refuse by construction; it cannot draft, file, or modify anything.

## ROLLBACK
Flag `ask_copilot` OFF removes the stub route; backend endpoint is additive and can be disabled independently.
