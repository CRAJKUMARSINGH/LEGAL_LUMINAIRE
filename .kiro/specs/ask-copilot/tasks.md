# Ask Copilot — Tasks
**Flag**: `ask_copilot`
**Owners**: Kiro (W5), Devin (W6), Trae (W7), Antigravity (W8)

---

## Week 5 — Kiro (Backend Contract & Guardrails)
- [x] Update `.kiro/specs/ask-copilot/requirements.md` — exact API contract + refusal rules
- [x] Update `.kiro/specs/ask-copilot/design.md` — pipeline diagram + file table
- [x] Update `.kiro/specs/ask-copilot/tasks.md` (this file)
- [x] Extend `backend/api/models.py` — 4 Pydantic models:
      `CopilotAskRequest`, `CopilotCitation`, `CopilotRefusal`, `CopilotAskResponse`
- [x] Create `backend/api/routes_copilot.py`:
      `POST /api/v1/copilot/ask` — flag check, schema, rate-limit, hybrid retrieval,
      PENDING/FATAL_ERROR filter, confidence gate, answer synthesis,
      zero-citation guard, observability log
- [x] Extend `backend/main.py`:
      register `copilot_router` with prefix `/api/v1`
      add `"/copilot"` to `_is_expensive_endpoint` heavy_markers
- [x] Create `backend/tests/test_copilot.py`:
      unit: refusal on nonexistent matter/date
      unit: zero-citation answers impossible
      unit: PENDING/FATAL_ERROR items excluded
      integration: TC-01 five canonical questions with valid citations
- [x] Write `docs/integration/WEEK05_KIRO_COMPLETION.md`

---

## Week 6 — Devin (UX Streaming)
- [ ] Create `src/pages/AskCopilotPage.tsx` (flag-gated on `ask_copilot`)
- [ ] Create `src/components/copilot/CitationCard.tsx`
- [ ] Streaming token display for long answers
- [ ] Bilingual refusal banner (verbatim reason string)
- [ ] Wire `/case/:id/ask` route in `src/routes.tsx`
- [ ] Write `docs/integration/WEEK06_DEVIN_COMPLETION.md`

---

## Week 7 — Trae (Citation Deep-Links)
- [ ] Every citation `id` resolves to a source document URL + page number
- [ ] `CitationDeepLinkProvider` — id → document URL + page
- [ ] Update `CitationCard` to render a clickable link when flag `citation_deeplink` ON
- [ ] Write `docs/integration/WEEK07_TRAE_COMPLETION.md`

---

## Week 8 — Antigravity (Accuracy Audit)
- [ ] Run 50-question adversarial probe on TC-01 synthetic case
- [ ] Produce refusal-rate and citation-accuracy report
- [ ] Bilingual answer polish (Hindi + English body text)
- [ ] Write `docs/integration/WEEK08_ANTIGRAVITY_COMPLETION.md`
