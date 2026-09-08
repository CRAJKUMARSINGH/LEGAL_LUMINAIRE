# Accuracy Academy — Design
**Flag**: `accuracy_academy`

## Architecture
```
AccuracyAcademyPage (flag-gated)
  ├── ScenarioList
  └── ScenarioPlayer
        ├── PromptDisplay
        ├── AIOutputDisplay (annotatable — user clicks errors)
        ├── SubmitButton → POST /api/v1/academy/attempts
        ├── FeedbackPanel (branching, bilingual)
        └── TradeOffMeter (accuracy | speed | completeness)

Backend:
  GET  /api/v1/academy/scenarios
  GET  /api/v1/academy/scenarios/:id
  POST /api/v1/academy/attempts
  Data: backend/data/academy_scenarios.json (human-authored)
```

## Key Files
- `src/pages/AccuracyAcademyPage.tsx` — flag-gated
- `src/components/academy/ScenarioPlayer.tsx`
- `src/components/academy/TradeOffMeter.tsx`
- `src/components/academy/FeedbackPanel.tsx`
- `backend/api/routes_academy.py`
- `backend/data/academy_scenarios.json`

## Branching Logic
Client-side: `selectedErrors` compared to `correctErrors`; feedback key chosen from a decision tree in scenario JSON. No LLM involvement in feedback — deterministic.

## Route
`/accuracy-academy` added to `routes.tsx` when flag ON.
