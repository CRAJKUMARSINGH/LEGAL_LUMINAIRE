# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 6 — ASK LUMINAIRE: COPILOT UX & STREAMING
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Devin (Cognition Devin)  
**Week-6 Role**: Autonomous PR-scale UX • Streaming Panel • Session Management  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: The UI may never hide a refusal or strip citations. Answers stream while the user keeps working; several sessions can run; every visible answer carries its case-book citations. All strings bilingual.

### LIVE REPO NOTES (verified 8 September 2026)
- `src/` is pages-based (confirmed): `src/pages`, `src/components`, `src/context`, `src/hooks`, `src/lib`, and a single `src/routes.tsx` — create `src/features/copilot/` as a NEW module dir and wire panel mount + routes in `src/routes.tsx`.
- Home dashboard is `src/pages/Home.tsx` (confirmed; recently modified on the enrichment branch) — add the copilot card there.
- Completion file at repo-root `docs/integration/`.

---

## STANDING RULES FOR DEVIN (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Every user-facing string in both English and Hindi; SYNTHETIC/DEMO labelling intact.
3. Never hard-code case data into components; read from the case data layer.
4. After any route change, verify Netlify SPA routing. End the week with the completion file under `docs/integration/`. Conventional commits only.

---

## SOURCE PROJECT (verified 8 Sept 2026)

**Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified UX behaviours adopted: “Answers keep streaming while the user works in other tabs, and several conversations can run at once.” Plus the copilot framing: it answers questions about hearings/limitation/order sheets from the live book — here, about the active synthetic case’s facts, contradictions, deadlines and documents.

## OBJECTIVES

- A dockable **Ask Luminaire** panel: streaming answers, inline citation chips linking to case-book items, visible refusal states, multi-session tabs.
- Home dashboard integration: copilot card with 3 suggested bilingual questions per loaded case.

## DETAILED TASKS (execute strictly in order)

### 6.1 Copilot Panel (flag: `ask_copilot`)
- `src/features/copilot/`:
  - `CopilotPanel.tsx` — right-dockable panel, resizable, keyboard accessible; route-independent (available on Research/Draft/Review pages).
  - Streaming via SSE/fetch-stream from `POST /api/v1/copilot/ask` (chunked rendering); graceful fallback to non-streamed rendering if SSE fails.
  - `CitationChip.tsx` — each citation chip opens the referenced item: document preview, timeline entry highlight, register field, or standard row. PENDING/FATAL_ERROR chips can never exist (backend excludes them) — assert in a UI test.
  - Refusal state: bilingual message card, retry hint, “Ask differently” suggestions. Never render an answer without citations.
- Multi-session: named conversation tabs persisted locally (localStorage), switchable; “New conversation” clears context. Adopted Vyaas reliability detail: “a tab switch or reload never loses an answer” — persist sessions so a reload recovers the conversation (server-side session store or recoverable local state).

### 6.2 Suggested Questions
- Per-case suggested questions generated from the case data layer (e.g., “Summarise the contradictions found so far”, “Which documents support the alibi?”, “What are the pending deadlines?”), rendered as one-click chips. Synthetic cases only.

### 6.3 Home Integration & Empty States
- Home copilot card in `src/pages/Home.tsx` with flag-aware visibility; bilingual empty state when no case loaded (reuse the Week-1 empty-state system).

### 6.4 Accessibility & Bilingual Pass
- ARIA live region for streaming text (polite), focus trap in panel, full EN/HI string coverage.

### 6.5 Completion
```
docs/integration/WEEK06_DEVIN_COMPLETION.md
```
Include: component architecture, streaming fallback logic, accessibility findings, bilingual check, Netlify status, hand-off notes for Trae (W7).

## FILES TOUCHED
`src/features/copilot/*` (new, wired via `src/routes.tsx`) • `src/pages/Home.tsx` card • `src/lib/featureFlags.ts` (consume only) • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR DEVIN (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 6 of the 12-week integration plan, behind flag `ask_copilot` (backend from Week 5: `POST /api/v1/copilot/ask`, streaming-capable). Build the Ask Luminaire panel: right-dockable, resizable, keyboard-accessible `src/features/copilot/` with streamed answer rendering (SSE with graceful non-stream fallback), inline citation chips that open the exact case-book item (document preview, timeline highlight, register field, standard row), and a visible bilingual refusal state — the UI must never render an answer without citations, and a test must assert no PENDING/FATAL_ERROR chip can appear. Support multiple named conversation tabs persisted so a tab switch or reload never loses an answer (adopted Vyaas reliability detail), switchable, with New Conversation. Add per-case suggested-question chips from the case data layer and a Home copilot card in src/pages/Home.tsx with bilingual empty states; wire routes in the single src/routes.tsx. Everything English + Hindi, ARIA-live for streaming, focus-trapped panel. Verify Netlify SPA routing and the static demo (backend optional). Do not touch accuracy logic. Write `docs/integration/WEEK06_DEVIN_COMPLETION.md` and commit conventionally.

## WEEK 6 ACCEPTANCE CRITERIA
- [ ] Streaming renders token-by-token; fallback works when SSE unavailable
- [ ] Every rendered answer shows ≥ 1 working citation chip; refusal state bilingual and visible
- [ ] Multi-session tabs persist across reload; suggested questions load per case
- [ ] Clean-clone Netlify deploy succeeds; `WEEK06_DEVIN_COMPLETION.md` committed

## ACCURACY GUARDRAILS
No “show anyway” control for refusals; no way to render citation-less answers; verification tiers never hidden.

## ROLLBACK
Flag OFF removes panel, card, and routes; localStorage sessions are inert data, safe to leave.
