# Ask Copilot — Tasks
**Flag**: `ask_copilot`
**Owners**: Kiro (W5), Devin (W6), Trae (W7), Antigravity (W8)

## Week 5 — Kiro (Backend Contract & Guardrails)
- [ ] Create `backend/api/routes_copilot.py` — POST /api/v1/copilot/ask
- [ ] Extend `backend/api/models.py` — 4 copilot Pydantic models
- [ ] Extend `backend/main.py` — register router + rate limiter
- [ ] Add `ask_copilot: false` to `src/config/featureFlags.ts`
- [ ] Create `backend/tests/test_copilot.py` — unit + integration tests
- [ ] Write `docs/integration/WEEK05_KIRO_COMPLETION.md`

## Week 6 — Devin (UX Streaming)
- [ ] Create `src/pages/AskCopilotPage.tsx` (flag-gated)
- [ ] Create `src/components/copilot/CitationCard.tsx`
- [ ] Streaming token display for answers
- [ ] Bilingual refusal banner
- [ ] Wire `/case/:id/ask` route in `routes.tsx`
- [ ] Write `docs/integration/WEEK06_DEVIN_COMPLETION.md`

## Week 7 — Trae (Citation Deep-Links)
- [ ] Every citation `id` links to source PDF page
- [ ] `CitationDeepLinkProvider` resolves id → document URL + page
- [ ] Write `docs/integration/WEEK07_TRAE_COMPLETION.md`

## Week 8 — Antigravity (Accuracy Audit)
- [ ] Run 50-question adversarial probe on TC-01
- [ ] Produce refusal-rate and citation-accuracy report
- [ ] Bilingual answer polish (Hindi + English)
- [ ] Write `docs/integration/WEEK08_ANTIGRAVITY_COMPLETION.md`
