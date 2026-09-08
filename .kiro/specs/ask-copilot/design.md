# Ask Copilot — Design
**Flag**: `ask_copilot`
**Version**: 1.0 (Week 5 backend; Week 6 UX; Week 7 deep-links; Week 8 accuracy audit)

## Architecture
```
POST /api/v1/copilot/ask
  │
  ├─ 1. Flag check (ask_copilot OFF → 404)
  ├─ 2. Schema validation — read-only, extra="forbid"
  ├─ 3. Rate limit (reuse existing _is_expensive_endpoint)
  ├─ 4. query_classifier.classify_query → QueryProfile
  ├─ 5. hybrid_search.hybrid_search(case_id, query, k=profile.k_retrieval)
  │       └─ PENDING/FATAL_ERROR metadata filter applied post-retrieval
  ├─ 6. Confidence check: max(combined_score) < 0.35 → refusal
  ├─ 7. Answer synthesis from top chunks + citations
  ├─ 8. Zero-citation guard → refusal if citations empty
  ├─ 9. Observability log (latency, tokens, cost, refusal flag)
  └─ 10. Return CopilotAskResponse
```

## Files (Week 5)
| File | Action |
|------|--------|
| `backend/api/routes_copilot.py` | NEW |
| `backend/api/models.py` | EXTEND (4 Pydantic models) |
| `backend/main.py` | EXTEND (register router, add /copilot to rate limiter) |
| `backend/tests/test_copilot.py` | NEW |
| `src/config/featureFlags.ts` | EXTEND (ask_copilot flag) |

## Files (Weeks 6–8)
| File | Action |
|------|--------|
| `src/pages/AskCopilotPage.tsx` | NEW (Week 6) |
| `src/components/copilot/CitationCard.tsx` | NEW (Week 6) |
| Citation deep-links (Week 7) | TBD by Trae |
| Accuracy audit (Week 8) | TBD by Antigravity |

## Rate Limiting
`/copilot` added to `_is_expensive_endpoint` markers in `main.py`.
HTTP 429 with `Retry-After` header and bilingual body.

## Observability Log
```json
{
  "event": "copilot_ask",
  "case_id": "...",
  "question_hash": "sha256[:12]",
  "retrieved_items": 8,
  "refusal": false,
  "latency_ms": 245,
  "tokens_estimated": 312,
  "cost_usd_estimated": 0.00062,
  "timestamp": "ISO-8601"
}
```
