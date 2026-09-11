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

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 6 deliverables must undergo comprehensive verification following Week 5 production lock standards:

**Testing Methodology**:
1. **Static Code Review**: Analyze component structure and logic for security and citation integrity
2. **Streaming Performance Verification**: Verify token-by-token streaming rendering and SSE fallback behavior
3. **Unit Test Coverage**: Ensure citation chip logic, refusal states, and session persistence are tested
4. **Integration Testing**: Verify multi-session tab persistence across reloads and suggested question generation
5. **Accessibility Audit**: Verify ARIA live regions, focus trap behavior, and keyboard navigation
6. **Bilingual Compliance Check**: Ensure all user-facing strings exist in both English and Hindi

**Testing Coverage**:
- ✅ Copilot panel dockable/resizable behavior
- ✅ Streaming answer rendering with SSE fallback
- ✅ Citation chip linking to case-book items (documents, timeline, register, standards)
- ✅ PENDING/FATAL_ERROR chip exclusion assertion in UI tests
- ✅ Refusal state bilingual messages and retry hints
- ✅ Multi-session tab persistence across reloads
- ✅ Per-case suggested question generation
- ✅ Home dashboard copilot card integration
- ✅ Bilingual empty state handling
- ✅ ARIA live region for streaming text
- ✅ Focus trap in panel

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings in the Ask Luminaire Copilot must include both English and Hindi labels:

**Copilot Panel Labels**:
- ✅ "Ask Luminaire" / "लुमिनेर से पूछें"
- ✅ "New conversation" / "नई बातचीत"
- ✅ "Ask differently" / "अलग तरीके से पूछें"
- ✅ "Streaming answer" / "स्ट्रीमिंग उत्तर"
- ✅ "Refusal state" / "अस्वीकृति स्थिति"

**Suggested Questions Labels**:
- ✅ "Suggested questions" / "सुझाए गए प्रश्न"
- ✅ "Summarise contradictions" / "विरोधाभास का सारांश"
- ✅ "Document support for alibi" / "एलिबी के लिए दस्तावेज़ समर्थन"
- ✅ "Pending deadlines" / "लंबित समयसीमा"

**Home Integration Labels**:
- ✅ "Copilot" / "कोपायलट"
- ✅ "No case loaded" / "कोई केस लोड नहीं है"
- ✅ "Load a case to get started" / "शुरू करने के लिए एक केस लोड करें"

**Status**: All user-facing strings must include both English and Hindi labels as required.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode and sample cases must be clearly labeled as SYNTHETIC/DEMO:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" badge in Copilot panel header
- ✅ "SYNTHETIC / DEMO" badge in Home copilot card
- ✅ Red styling for demo badges to distinguish from real cases
- ✅ Suggested questions clearly labeled as synthetic-case generated

**Demo Case Flagging**:
- ✅ `isDemo` property in CaseRecord type for synthetic cases
- ✅ Demo cases properly flagged in suggested question generation
- ✅ Demo badge display logic integrated throughout Copilot UI
- ✅ Warning messages about synthetic data in Demo Mode

**Status**: All synthetic/demo cases must be clearly labeled and visually distinguished from real cases.

---

### NETLIFY COMPATIBILITY VERIFICATION

Ask Luminaire Copilot must be compatible with existing Netlify SPA routing:

**SPA Routing Check**:
- ✅ No breaking changes to route structure
- ✅ New copilot routes use existing wouter routing system
- ✅ Panel mount independent of route changes
- ✅ Breadcrumb trail compatible with SPA routing
- ✅ No new dependencies that could affect build process

**Build Compatibility**:
- ✅ All new components use existing UI library
- ✅ TypeScript strict mode compatible
- ✅ No build errors or warnings introduced
- ✅ Follows existing code patterns and conventions
- ✅ Streaming fallback won't affect Netlify build process

**Status**: All changes must be compatible with existing Netlify configuration and SPA routing.

---

### ACCURACY RULES COMPLIANCE

Ask Luminaire Copilot must not alter accuracy controls or verification logic:

**Verification Tiers**:
- ✅ Citation tiers (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) remain unchanged
- ✅ PENDING/FATAL_ERROR chips excluded from UI (backend ensures this)
- ✅ UI test asserts no PENDING/FATAL_ERROR chip can appear
- ✅ Verification Report remains accessible and unchanged

**Accuracy Signals**:
- ✅ No "show anyway" control for refusals
- ✅ No way to render citation-less answers
- ✅ Verification tiers never hidden
- ✅ Refusal state clearly indicates accuracy concerns
- ✅ Citation chips always link to verified case-book items

**Streaming Integrity**:
- ✅ Streaming does not compromise citation accuracy
- ✅ Each token stream maintains citation context
- ✅ SSE fallback does not lose citation information
- ✅ Answer completeness verified before rendering

**Status**: Copilot must maintain strict accuracy guardrails while providing streaming functionality.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 6 acceptance criteria, Week 5 enrichment requires:

- [ ] Documentation is complete, accurate, and professional
- [ ] All bilingual labels verified and consistent
- [ ] Synthetic-only labeling maintained throughout
- [ ] Streaming performance verified with SSE fallback testing
- [ ] PENDING/FATAL_ERROR chip exclusion asserted in UI tests
- [ ] Netlify SPA routing verified after new copilot routes
- [ ] Accessibility compliance verified (ARIA live regions, focus trap, keyboard navigation)
- [ ] Multi-session persistence verified across reloads
- [ ] Clean-clone Netlify deploy succeeds
- [ ] WEEK06_DEVIN_COMPLETION.md committed with Week 5 verification sections

---

### WEEK 5 HAND-OFF NOTES

**For Future Development**:
1. **Streaming Enhancement**: Consider adding more granular streaming controls (pause/resume, speed control)
2. **Citation Expansion**: Add more sophisticated citation linking (cross-references, related documents)
3. **Session Analytics**: Consider adding session analytics for improving suggested questions
4. **Voice Input**: Consider adding voice input capabilities for natural language queries

**For Documentation Maintenance**:
1. Keep bilingual labels updated when new copilot features are added
2. Update streaming fallback documentation when SSE behavior changes
3. Maintain citation chip exclusion documentation for accuracy compliance
4. Ensure accessibility compliance is maintained with UI changes

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: WEEK06_DEVIN_Copilot_UX_Streaming.md  
**Lines Added**: ~100 (Week 5 enrichment sections)  
**Lines Removed**: 0

**Suggested Commit Message**:
```
docs: Apply Week 5 enrichment standards to Week 6 Copilot UX Streaming guide

- Add Week 5 verification methodology section
- Add bilingual compliance verification section
- Add synthetic case labeling verification section
- Add Netlify compatibility verification section
- Add accuracy rules compliance section
- Enhance acceptance criteria with Week 5 standards
- Add hand-off notes for future development

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```
