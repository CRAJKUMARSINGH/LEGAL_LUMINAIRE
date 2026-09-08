# Ask Copilot — Requirements
**Flag**: `ask_copilot` (default OFF)
**Weeks**: 5–8 | W5 Kiro · W6 Devin · W7 Trae · W8 Antigravity
**Source**: Vyaas Docket showcase — "Ask Vyaas" contract
**Primary Principle**: "It never invents matters, dates or orders; it only reads the book as it stands."

---

## Scope
A read-only copilot that answers natural-language questions exclusively from the
active case book (uploaded documents, facts timeline, standards matrix, register
entries). It never drafts, files, or modifies anything.

---

## API Contract (Week 5 — fixed, all later weeks build on this)

### Request — `POST /api/v1/copilot/ask`
```json
{
  "question":   "string  (required, 1–2000 chars)",
  "case_id":    "string  (required)",
  "session_id": "string? (optional, for log correlation)"
}
```
Schema enforces `extra = "forbid"` — no additional fields accepted.

### Response — answer
```json
{
  "answer":      "string",
  "citations":   [
    { "type": "document|timeline|register|standard", "id": "string", "snippet": "string (≤300 chars)" }
  ],
  "refusal":     null,
  "latency_ms":  123,
  "session_id":  "string|null"
}
```

### Response — refusal
```json
{
  "answer":    "",
  "citations": [],
  "refusal":   { "reason": "Not found in this case book. / इस केस बुक में नहीं मिला।" },
  "latency_ms": 45,
  "session_id": "string|null"
}
```

### Error codes
| Code | Condition |
|------|-----------|
| 404  | Feature flag `ask_copilot` is OFF |
| 422  | Schema validation failure |
| 429  | Rate limit exceeded — `Retry-After` header included |
| 500  | Unexpected retrieval error |

---

## Refusal Rules (all must be enforced)
1. Retrieval confidence `max(combined_score) < MIN_CONFIDENCE (0.35)` → refusal.
2. Answer synthesis produces 0 citations → converted to refusal regardless of text.
3. Refusal reason is **always bilingual**: `"Not found in this case book. / इस केस बुक में नहीं मिला।"`
4. A guessed or hallucinated answer is **never** returned. Citation-or-refuse is the only contract.

---

## Data Model
- `CopilotAskRequest`  — question, case_id, session_id
- `CopilotCitation`    — type: `"document"|"timeline"|"register"|"standard"`, id, snippet
- `CopilotRefusal`     — reason (bilingual string)
- `CopilotAskResponse` — answer, citations, refusal, latency_ms, session_id

---

## Accuracy Guardrails
- Retrieval scoped strictly to `case_id` — no cross-case leakage.
- Items with verification tier `PENDING` or `FATAL_ERROR` excluded from context before retrieval.
- Endpoint is read-only — cannot draft, file, or modify anything.
- PENDING citations MUST NOT appear as citations (Accuracy Rules §6).

---

## Rate Limiting
`/copilot` added to the existing `_is_expensive_endpoint` marker list in `main.py`.
HTTP 429 with `Retry-After` header on excess requests.

---

## Observability (per-question log)
```json
{
  "event":               "copilot_ask",
  "case_id":             "TC-01",
  "session_id":          "...",
  "question_hash":       "sha256[:12]",
  "retrieved_items":     8,
  "refusal":             false,
  "latency_ms":          245,
  "tokens_estimated":    312,
  "cost_usd_estimated":  0.00062,
  "timestamp":           "ISO-8601"
}
```

---

## Bilingual Requirement
- Refusal messages bilingual (EN + HI) from Week 5.
- Answer text bilingual polish deferred to Week 8 (Antigravity).

---

## Flag
`ask_copilot` — OFF by default.
Frontend: `VITE_FF_ASK_COPILOT=true` in `.env.local`.
Backend: `os.getenv("FEATURE_ASK_COPILOT", "false")`.

---

## Rollback
Flag OFF → backend returns 404 for all `/api/v1/copilot/*`. Frontend stub route
disappears. No data deleted.

---

## Acceptance Criteria
- [x] All TC-01 canonical questions answered with valid citations
- [x] Zero uncited answers structurally possible (citation-or-refuse enforced)
- [x] Refusal returns bilingual reason on adversarial probes (nonexistent matter/date)
- [x] PENDING/FATAL_ERROR items excluded from context (proven in tests)
- [x] Schema-enforced read-only (`extra="forbid"`, no write fields)
- [x] Rate limited — HTTP 429 + `Retry-After` on excess
- [x] Per-question observability log written
- [x] `WEEK05_KIRO_COMPLETION.md` committed
