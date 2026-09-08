# Ask Copilot — Design
**Flag**: `ask_copilot`
**Version**: 1.0 (Week 5 backend; Week 6 UX; Week 7 deep-links; Week 8 accuracy)

---

## Request Pipeline

```
POST /api/v1/copilot/ask
  │
  ├─ 1. Flag check: FEATURE_ASK_COPILOT == "true" — else 404
  ├─ 2. Pydantic parse: CopilotAskRequest (extra="forbid") — else 422
  ├─ 3. Rate limit: _is_expensive_endpoint("/copilot") → 429 if exceeded
  │
  ├─ 4. query_classifier.classify_query(question) → QueryProfile (k_retrieval)
  │
  ├─ 5. hybrid_search.hybrid_search(case_id, question, k=profile.k_retrieval)
  │       └─ results: List[SearchResult]  (document + combined_score)
  │       └─ POST-FILTER: drop chunks where metadata["verification_tier"]
  │              in {"PENDING", "FATAL_ERROR"}
  │
  ├─ 6. Confidence gate
  │       max_score = max(r.combined_score for r in filtered_results) or 0.0
  │       if max_score < MIN_CONFIDENCE (0.35) or len(filtered_results) == 0:
  │           → build_refusal_response(latency_ms, session_id)
  │
  ├─ 7. Answer synthesis
  │       context = top-3 chunks (content + source metadata)
  │       answer  = synthesise from context via LLM (or fallback summary)
  │       citations = [CopilotCitation(type, id, snippet) for each chunk]
  │
  ├─ 8. Zero-citation guard
  │       if len(citations) == 0: → build_refusal_response(...)
  │
  ├─ 9. Observability log (non-blocking, fire-and-forget)
  │       _log_copilot_event(case_id, session_id, question, retrieved, refusal,
  │                          latency_ms, tokens_est, cost_est)
  │
  └─ 10. Return CopilotAskResponse
```

---

## Files (Week 5)
| File | Action |
|------|--------|
| `backend/api/routes_copilot.py` | NEW |
| `backend/api/models.py` | EXTEND — 4 Pydantic models |
| `backend/main.py` | EXTEND — router + rate-limiter marker |
| `backend/tests/test_copilot.py` | NEW |
| `src/lib/featureFlags.ts` | already has `ask_copilot: false` ✓ |
| `.kiro/specs/ask-copilot/` | UPDATED (this file) |
| `docs/integration/WEEK05_KIRO_COMPLETION.md` | NEW |

---

## Files (Weeks 6–8, owned by other agents)
| File | Owner | Week |
|------|-------|------|
| `src/pages/AskCopilotPage.tsx` | Devin | W6 |
| `src/components/copilot/CitationCard.tsx` | Devin | W6 |
| Citation deep-link resolver | Trae | W7 |
| Accuracy audit + bilingual polish | Antigravity | W8 |

---

## Reused Backend Modules
| Module | Usage |
|--------|-------|
| `rag/hybrid_search.py` — `HybridSearchEngine` | Primary retrieval |
| `rag/query_classifier.py` — `classify_query` | Determines `k_retrieval` |
| `rag/document_store.py` / `optimized_document_store.py` | Underlying vector store |
| `agents/hallucination_breaker.py` | Optional post-retrieval hallucination check |
| `agents/fact_fit_engine.py` | Optional fact-fit scoring (future) |

---

## Observability
The `_log_copilot_event` function in `routes_copilot.py` writes a JSON log line
to Python's standard logging infrastructure (`logger.info(...)`). No new DB table.
The existing `routes_analytics.py` layer is not modified — the copilot log is a
separate event stream consumed by the existing application log pipeline.

---

## Rate Limiting
`"/copilot"` appended to `heavy_markers` tuple in `main.py::_is_expensive_endpoint`.
The existing `_check_rate_limit` / `rate_limit_middleware` handle the rest.
HTTP 429 body includes bilingual message + `retry_after_seconds`.

---

## Constants
```python
MIN_CONFIDENCE   = 0.35   # below this → refusal
MAX_QUESTION_LEN = 2000   # Pydantic Field max_length
MAX_SNIPPET_LEN  = 300    # citation snippet truncated to this
TOP_K_SYNTHESIS  = 3      # top chunks used for answer synthesis
BILINGUAL_REFUSAL = "Not found in this case book. / इस केस बुक में नहीं मिला।"
COST_PER_TOKEN   = 0.000002   # USD estimate (gpt-4o-mini tier)
```

---

## Hand-off to Week 6 (Devin — UX)
- Backend contract is frozen. Build the frontend ask panel against `POST /api/v1/copilot/ask`.
- Set `VITE_FF_ASK_COPILOT=true` in `.env.local` to activate the frontend.
- Citations carry `type`, `id`, `snippet` — render each as a collapsible card.
- Refusal `reason` must be displayed verbatim — do not translate or truncate.
- Streaming is a Week 6 enhancement; the Week 5 endpoint returns a complete response.
