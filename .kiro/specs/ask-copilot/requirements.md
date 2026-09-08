# Ask Copilot — Requirements
**Flag**: `ask_copilot` (default OFF)
**Weeks**: 5–8 (Kiro W5, Devin W6, Trae W7, Antigravity W8)
**Source**: Vyaas Docket showcase — "Ask Vyaas" adapted to Legal Luminaire

## Scope
A read-only copilot that answers questions exclusively from the active case book (uploaded documents, facts timeline, standards matrix, register entries). It never invents matters, dates, orders or citations. Adapted Vyaas contract: "It never invents matters, dates or orders; it only reads the book as it stands."

## Data Model
- `CopilotAskRequest`: `{ question: string, case_id: string, session_id?: string }`
- `CopilotCitation`: `{ type: "document"|"timeline"|"register"|"standard", id: string, snippet: string }`
- `CopilotRefusal`: `{ reason: string }` — bilingual
- `CopilotAskResponse`: `{ answer: string, citations: CopilotCitation[], refusal?: CopilotRefusal, latency_ms: number, session_id?: string }`

## API Contract
- `POST /api/v1/copilot/ask` — body: `CopilotAskRequest`; response: `CopilotAskResponse`
- Read-only: schema enforces no write fields (`model_config = ConfigDict(extra="forbid")`)
- Retrieval scoped to `case_id` only — no cross-case leakage
- Items with `PENDING` or `FATAL_ERROR` verification tier excluded from context

## Accuracy Guardrails
- Every answer MUST cite ≥ 1 existing item by id + snippet
- If confidence is low or no item can be cited → return structured bilingual refusal
- Bilingual refusal: `"Not found in this case book. / इस केस बुक में नहीं मिला।"`
- Endpoint is strictly read-only — it cannot draft, file, or modify anything
- PENDING/FATAL_ERROR items are never surfaced as citations

## Bilingual Requirement
- Refusal messages bilingual (English + Hindi) from Week 5
- Answer text bilingual polish in Week 8 (Antigravity)

## Flag
`ask_copilot` — OFF by default. Enable via `VITE_FF_ASK_COPILOT=true`.

## Rollback
Flag OFF removes the stub route and disables the backend endpoint.

## Acceptance Criteria
- [ ] TC-01 canonical questions answered with valid citations
- [ ] Zero uncited answers possible (citation-or-refuse enforced)
- [ ] Refusal returns bilingual reason on nonexistent references
- [ ] PENDING/FATAL_ERROR items excluded from context
- [ ] Schema-enforced read-only
- [ ] Rate limited with 429 + Retry-After
