# Accuracy Academy — Tasks
**Flag**: `accuracy_academy`
**Owner**: Antigravity (Week 12)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**Depends on**: `featureFlags.ts` (Week 1), `AccuracyAcademyPage.tsx` (already imported in `routes.tsx`), `backend/data/` directory

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.accuracy_academy` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm `src/pages/AccuracyAcademyPage.tsx` exists (already imported in `routes.tsx` — extend it, do not replace)
- [ ] Confirm routes `/academy`, `/accuracy-academy`, `/case/:id/academy` all point to `AccuracyAcademyPage` in `routes.tsx`
- [ ] Confirm `backend/data/` directory exists (create if absent: `backend/data/__init__.py` if needed)
- [ ] Confirm `backend/api/models.py` compiles cleanly before adding Academy models

---

## T12.1 — Types
- [ ] Create `src/types/academy.ts`:
  - Export `ScenarioDifficulty` union: `"beginner" | "intermediate" | "advanced"`
  - Export `ErrorCategory` union (5 values — see design.md)
  - Export `TradeOffMetrics` interface: `{ accuracy, speed, completeness }` (each 0–100)
  - Export `FeedbackBranch` interface: `{ key, titleEn, titleHi, messageEn, messageHi }`
  - Export `AcademyScenario` interface (see design.md for full shape)
  - Export `UserAttempt` and `AttemptResult` interfaces
- [ ] Add exports to `src/types/index.ts` barrel if one exists

## T12.2 — Scenario data
- [ ] Create `backend/data/academy_scenarios.json` — 5 human-authored bilingual scenarios:
  - One scenario per `ErrorCategory`: `hallucinated_citation`, `wrong_date`, `missing_section`, `invented_order`, `overconfident_summary`
  - Each scenario must have: `id`, `title`, `title_hi`, `difficulty`, `prompt`, `prompt_hi`, `ai_output`, `ai_output_hi`, `correct_errors`, `explanation`, `explanation_hi`, `trade_off_metrics`, `feedback_branches` (3 branches: excellent/partial/missed), `is_synthetic: true`
  - All text content is bilingual — no English-only fields
  - No real case names, court numbers, FIR numbers, or real-world data anywhere
  - `trade_off_metrics` values are illustrative — document the rationale in a JSON comment or the completion report

## T12.3 — Backend: Data models
- [ ] Add `TradeOffMetrics`, `FeedbackBranch`, `AcademyScenario`, `AttemptRequest`, `AttemptResult` to `backend/api/models.py`
  - See design.md for field definitions and types
  - `AttemptRequest.model_config = ConfigDict(extra="forbid")`
  - `AcademyScenario.is_synthetic` defaults to `True` — cannot be set to `False`

## T12.4 — Backend: Scoring function
- [ ] Implement `compute_score(selected: list[str], correct: list[str]) -> int` as a pure function in `routes_academy.py` or a helper module
  - Precision-recall F1 × 100 (see design.md algorithm)
  - Returns integer 0–100
  - Unit-testable — no side effects

## T12.5 — Backend: Router
- [ ] Create `backend/api/routes_academy.py` (flat convention)
  - `GET /api/v1/academy/scenarios`
    - Check `FEATURE_ACCURACY_ACADEMY` env flag → 404 if OFF
    - Load and return all scenarios from `academy_scenarios.json`
    - Returns: `list[AcademyScenario]` (all fields — client renders them)
  - `GET /api/v1/academy/scenarios/{scenario_id}`
    - Check flag → 404 if OFF
    - Returns single `AcademyScenario` or 404 if not found
  - `POST /api/v1/academy/attempts`
    - Check flag → 404 if OFF
    - Parse `AttemptRequest` (`ConfigDict(extra="forbid")`)
    - Load scenario by `scenario_id` → 404 if not found
    - Call `compute_score(selected_errors, correct_errors)`
    - Select feedback branch based on score
    - Return `AttemptResult`
    - **No LLM call** — deterministic scoring only
- [ ] Register router in `backend/main.py` under prefix `/api/v1`

## T12.6 — Frontend: API client
- [ ] Add `getScenarios()`, `getScenario(id: string)`, `submitAttempt(req: AttemptRequest)` to `src/lib/api.ts`
  - All three check `integrationFlags.accuracy_academy` and throw if OFF

## T12.7 — Frontend: TradeOffMeter component
- [ ] Create `src/components/academy/TradeOffMeter.tsx`
  - Props: `metrics: TradeOffMetrics`, `modeLabel: string`, `modeLabelHi: string`
  - 3 horizontal bars: Accuracy (blue) | Speed (green) | Completeness (amber)
  - Each bar: `role="meter"`, `aria-valuenow={value}`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="{label}: {value}%"`
  - Bilingual bar labels: *Accuracy / सटीकता*, *Speed / गति*, *Completeness / पूर्णता*
  - Disclaimer caption below: *"These are illustrative trade-offs, not performance benchmarks / ये दृष्टांत संबंधी समझौते हैं, प्रदर्शन बेंचमार्क नहीं।"*

## T12.8 — Frontend: FeedbackPanel component
- [ ] Create `src/components/academy/FeedbackPanel.tsx`
  - Props: `result: AttemptResult | null`
  - When `result` is null: renders nothing (pre-attempt state)
  - When `result` is present:
    - Score badge: large number with colour (≥80 = green, ≥50 = amber, <50 = red)
    - Feedback branch title + message (bilingual — EN + HI)
    - "Correct errors were:" list with bilingual `ErrorCategory` labels
    - Explanation text (bilingual tabs: EN | HI)
  - `role="status"` on the score badge (announced to screen readers on appearance)
  - "Try again" button → emits `onRetry` prop callback

## T12.9 — Frontend: ScenarioCard component
- [ ] Create `src/components/academy/ScenarioCard.tsx`
  - Props: `scenario: AcademyScenario`, `onClick: (id: string) => void`
  - Shows: title (EN + HI), difficulty badge (beginner=green, intermediate=amber, advanced=red), error type hint
  - `role="button"`, `tabIndex={0}`, keyboard-accessible (Enter/Space triggers onClick)
  - Brief prompt preview (first 100 chars)

## T12.10 — Frontend: ScenarioPlayer component
- [ ] Create `src/components/academy/ScenarioPlayer.tsx`
  - Props: `scenario: AcademyScenario`, `onComplete: (result: AttemptResult) => void`
  - Layout:
    1. Prompt display (bilingual tabs: EN | HI)
    2. AI output display (bilingual tabs) — text NOT pre-annotated; user identifies errors below
    3. Error checklist: checkboxes for each of the 5 `ErrorCategory` values (bilingual labels)
    4. `TradeOffMeter` with `scenario.tradeOffMetrics`
    5. Submit button → calls `submitAttempt()` → renders `FeedbackPanel`
  - Submit disabled until at least one checkbox selected
  - After submit: checklist disabled, "Try again" shown in `FeedbackPanel`
  - `aria-label` on checklist container: `"Select the errors you found / आपको मिली त्रुटियों का चयन करें"`

## T12.11 — Frontend: AccuracyAcademyPage extension
- [ ] Extend `src/pages/AccuracyAcademyPage.tsx` (do **not** replace)
  - Flag gate: if `!integrationFlags.accuracy_academy` → render existing stub content or `<Navigate to="/" />`
  - Flag ON → render full academy:
    - Fetch `getScenarios()` on mount
    - Render `ScenarioList` (grid of `ScenarioCard × N`) when no scenario selected
    - When a card is clicked → render `ScenarioPlayer` for that scenario
    - "← Back to scenarios" button → returns to `ScenarioList`
  - Page `<main aria-label="Accuracy Academy / सटीकता अकादमी">`
  - `<h1>` bilingual: "Accuracy Academy / सटीकता अकादमी"
  - Sub-heading: *"Learn to evaluate AI-generated legal content critically. / AI-जनित कानूनी सामग्री का आलोचनात्मक मूल्यांकन करना सीखें।"*

## T12.12 — Testing
- [ ] Backend: unit test `compute_score` — full overlap → 100, no overlap → 0, partial → expected F1 value
- [ ] Backend: unit test `POST /academy/attempts` with known scenario → assert correct `score` and `feedback.key`
- [ ] Backend: unit test `GET /api/v1/academy/scenarios` with flag OFF → assert 404
- [ ] Backend: confirm all 5 scenarios load from JSON without validation error
- [ ] Frontend: render test `TradeOffMeter` — assert 3 bars present, each has `role="meter"`, disclaimer caption visible
- [ ] Frontend: render test `FeedbackPanel` with score 90 → assert green badge and "excellent" feedback
- [ ] Frontend: render test `FeedbackPanel` with score 30 → assert red badge and "missed" feedback
- [ ] Frontend: render test `ScenarioPlayer` — submit button disabled before any checkbox checked
- [ ] Frontend: render test `AccuracyAcademyPage` with flag OFF → assert no academy content rendered

## T12.13 — Completion doc
- [ ] Write `docs/integration/WEEK12_ANTIGRAVITY_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Include: files changed, CI result, scenario coverage table (5 scenarios × error type), TradeOffMeter accessibility note, hand-off notes (end of 12-week cycle)
  - Note: this is the final week — include a summary of all 8 flags and their Week 12 status

---

## Acceptance Criteria
- [ ] At least 5 scenarios covering all 5 `ErrorCategory` values
- [ ] All scenario content bilingual (EN + HI) — no English-only fields
- [ ] No real case names, court numbers, or real-world data in any scenario (`isSynthetic: true`)
- [ ] Scoring is deterministic — same inputs always produce same score
- [ ] Branching feedback shown based on score threshold (≥80 / ≥50 / <50)
- [ ] `TradeOffMeter` renders with `role="meter"` and disclaimer caption on every scenario
- [ ] All interactive elements keyboard-accessible with correct `aria-*` attributes
- [ ] `accuracy_academy` flag OFF → no academy content rendered, backend returns 404
- [ ] CI green after Week 12 changes
