# LEGAL LUMINAIRE — MODERNIZATION PLAN
## Version 1.0 | April 3, 2026

---

## BASELINE ASSESSMENT

### Current Architecture
- React 19 + TypeScript + Vite frontend (SPA)
- FastAPI Python backend (multi-agent: CrewAI + LangChain + ChromaDB)
- Express Node.js API server (template, minimal routes)
- pnpm monorepo with shared lib packages
- 40+ routes (case-scoped + legacy flat routes)
- Bilingual UI (Hindi + English)

### Key Pain Points Identified
1. **Navigation overload** — 40+ nav items visible simultaneously; no grouping or progressive disclosure
2. **Empty states** — several pages show blank content when no case is loaded
3. **No onboarding flow** — new users land on Home with no clear next step
4. **Loading states** — AI research/draft pages lack skeleton loaders
5. **Validation feedback** — form errors not surfaced clearly in intake flow
6. **Legacy flat routes** — duplicate routes (flat + case-scoped) cause confusion
7. **No recent cases** — no history/recents panel on Home
8. **Test data browser** — no UI to browse the 21 test cases
9. **Marketing demo mode** — no dedicated demo/showcase path
10. **Audit trail** — verification panel exists but not linked from draft output

### Modernization Targets

#### UX / Navigation
- [ ] Collapse nav into grouped sections (Case Setup / Research / Drafting / Review)
- [ ] Add breadcrumb trail for case-scoped pages
- [ ] Add "Recent Cases" widget on Home
- [ ] Add empty-state illustrations with clear CTAs
- [ ] Add skeleton loaders for AI-heavy pages

#### Workflow
- [ ] Guided intake → research → draft → review flow
- [ ] Task-oriented dashboard cards (not just links)
- [ ] Document type selector before drafting
- [ ] One-click demo mode (loads CASE_01 with all data pre-filled)

#### Reliability
- [ ] Input validation on all forms (Zod schemas already present — wire to UI)
- [ ] Error boundaries on all page components
- [ ] Retry logic on API calls (React Query already configured)
- [ ] File upload size/type validation

#### Visual Polish
- [ ] Consistent card elevation and spacing
- [ ] Status badges (VERIFIED / SECONDARY / PENDING) with colour coding
- [ ] Progress indicators on multi-step flows
- [ ] Print-ready CSS for draft output pages

#### Maintainability
- [ ] Remove legacy flat routes (keep for backward compat via redirect)
- [ ] Extract shared form components
- [ ] Add JSDoc to all lib functions
- [ ] Consolidate case data loading into single hook

---

## IMPLEMENTATION PRIORITY

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | Empty states + CTAs | Low | High |
| P0 | Skeleton loaders | Low | High |
| P1 | Nav grouping | Medium | High |
| P1 | Demo mode | Medium | Very High |
| P1 | Test data browser | Medium | High |
| P2 | Guided flow | High | Very High |
| P2 | Print CSS | Low | Medium |
| P3 | Legacy route cleanup | Low | Medium |

---

## CACHE / ARTIFACT HYGIENE TARGETS

- `.pytest_cache/` — clear before each test run
- `artifacts/legal-luminaire/dist/` — gitignored, rebuild on deploy
- `node_modules/` — gitignored, managed by pnpm
- `__pycache__/` — gitignored, Python bytecode
- `artifacts/legal-luminaire/backend/chroma_db/` — gitignored, vector DB data
- Stale `.lex` files in TEST_CASES — audit and remove duplicates

---

## BACKWARD COMPATIBILITY

All existing routes preserved. Legacy flat routes redirect to case-scoped equivalents.
No breaking changes to `case01-data.ts` schema.
All existing test cases preserved and extended.
