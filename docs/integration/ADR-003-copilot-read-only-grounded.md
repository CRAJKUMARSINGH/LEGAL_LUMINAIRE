# ADR-003 — Copilot Read-Only and Grounded
**Status**: Accepted  
**Date**: 2026-09-08  
**Author**: Kiro (Week 1)  
**Source principle**: Vyaas Docket showcase — "Ask Vyaas" contract (vibecode.law/showcase/vyaas-docket-508140)

---

## Context

The "Ask Luminaire" copilot (Weeks 5–8) answers natural-language questions about the active case. Legal practitioners rely on its answers to understand timelines, deadlines, filed documents, and applicable standards. An answer that invents a hearing date, a nonexistent order, or a fabricated citation could directly harm a client's legal position.

The adopted showcase (Vyaas Docket) demonstrates a pattern called the **Vyaas contract**: *"It never invents matters, dates or orders; it only reads the book as it stands."* This was validated as the correct approach for Legal Luminaire's synthetic-case environment.

---

## Decision

The Ask Luminaire copilot (`ask_copilot` flag, Weeks 5–8) is **read-only and grounded by construction**:

1. **Citation-or-refuse** — Every answer must cite at least one item (document chunk, timeline entry, register field, or standards entry) that actually exists in the active case book. Zero-citation answers are structurally impossible: the endpoint converts any zero-citation answer to a refusal.

2. **Bilingual refusal on low confidence** — If retrieval confidence is below threshold, or no existing item can be cited, the endpoint returns a structured refusal with bilingual reason: `"Not found in this case book. / इस केस बुक में नहीं मिला।"` — never a guessed answer.

3. **Case-scoped retrieval** — Retrieval is strictly scoped to the `case_id` in the request. Cross-case data leakage is prevented at the retrieval layer.

4. **PENDING/FATAL_ERROR exclusion** — Items whose verification tier is `PENDING` or `FATAL_ERROR` are excluded from the answerable context and can never appear as citations.

5. **Schema-enforced read-only** — The `POST /api/v1/copilot/ask` endpoint accepts only `{ question, case_id, session_id }`. The Pydantic schema uses `ConfigDict(extra="forbid")` — any attempt to include write fields is rejected at parse time.

6. **No drafting, filing, or modification** — The endpoint answers questions only. It cannot initiate drafts, submit filings, or alter any case data.

---

## Consequences

**Positive**
- Structural hallucination prevention: the model cannot invent references because the answer is assembled from retrieved chunks, not generated freehand.
- Transparent citation trail: every answer shows the user exactly which document/entry it came from.
- Bilingual refusals clearly communicate the system's limitations in both languages users are expected to speak.
- Additive and reversible: the endpoint does not touch any existing route or schema.

**Negative / Trade-offs**
- The copilot can only answer questions whose answers are present in indexed documents. Users asking about matters not in the case book always receive a refusal — this may feel frustrating but is preferable to fabrication.
- Retrieval quality depends on the document indexing pipeline. A poorly indexed case book produces more refusals. Mitigated by the hybrid search (semantic + BM25) layer.
- Week 5 answers are English-only. Bilingual answer polish is deferred to Week 8 (Antigravity).

---

## Rollback

Set `ask_copilot` flag to OFF. The backend endpoint is additive — existing routes are unaffected. No data is deleted.
