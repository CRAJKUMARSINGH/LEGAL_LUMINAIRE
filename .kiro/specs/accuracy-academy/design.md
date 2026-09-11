# Accuracy Academy — Design
**Flag**: `accuracy_academy`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Antigravity (Week 12)
**Source**: vibecode-submit skill — branching walkthrough + trade-off meters

---

## Architecture

```
Frontend                                  Backend
───────────────────────────────────────   ──────────────────────────────────────────
AccuracyAcademyPage (/accuracy-academy)   GET /api/v1/academy/scenarios
  │  [flag-gated: accuracy_academy]         ├─ Flag check → 404 if OFF
  │                                         └─ returns: AcademyScenario[]
  ├── ScenarioList
  │     └── ScenarioCard × N             GET /api/v1/academy/scenarios/{id}
  │           ├─ title (EN + HI)           ├─ Flag check → 404 if OFF
  │           ├─ difficulty badge          └─ returns: AcademyScenario (full)
  │           └─ onClick → ScenarioPlayer
  │                                       POST /api/v1/academy/attempts
  └── ScenarioPlayer (mounted per scenario)  ├─ Flag check → 404 if OFF
        ├── PromptDisplay                    ├─ validates AttemptRequest
        ├── AIOutputDisplay                  ├─ computes score (deterministic)
        │     └── annotatable spans          └─ returns: AttemptResult
        │         (user clicks errors)
        ├── SubmitButton → POST /attempts  (read-only — no LLM in feedback path)
        ├── FeedbackPanel (branching, bilingual)
        └── TradeOffMeter
              ├─ accuracy bar
              ├─ speed bar
              └─ completeness bar
```

---

## Data Model

```typescript
// src/types/academy.ts — NEW

export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced";

export type ErrorCategory =
  | "hallucinated_citation"   // citation that doesn't exist
  | "wrong_date"              // fabricated or incorrect date
  | "missing_section"         // applicable law section omitted
  | "invented_order"          // court order that was never passed
  | "overconfident_summary";  // summary that overstates certainty

export interface TradeOffMetrics {
  accuracy: number;       // 0–100
  speed: number;          // 0–100
  completeness: number;   // 0–100
}

export interface FeedbackBranch {
  key: string;              // matched when user's selectedErrors overlaps correctErrors
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
}

export interface AcademyScenario {
  id: string;
  title: string;
  titleHi: string;
  difficulty: ScenarioDifficulty;
  prompt: string;               // the "question" posed to the AI in the scenario
  promptHi: string;
  aiOutput: string;             // the AI's (deliberately flawed) response
  aiOutputHi: string;
  correctErrors: ErrorCategory[];  // human-authored ground truth
  explanation: string;          // why those errors matter (EN)
  explanationHi: string;
  tradeOffMetrics: TradeOffMetrics;  // for the specific AI mode modelled
  feedbackBranches: FeedbackBranch[];  // branching feedback keyed by attempt quality
  isSynthetic: true;            // always true — no real case data
}

export interface UserAttempt {
  scenarioId: string;
  selectedErrors: ErrorCategory[];
  score: number;           // 0–100 deterministic
  completedAt: string;     // ISO-8601
}

export interface AttemptResult {
  score: number;
  feedback: FeedbackBranch;
  correctErrors: ErrorCategory[];
  explanation: string;
  explanationHi: string;
}
```

```python
# backend/api/models.py extensions

class TradeOffMetrics(BaseModel):
    accuracy: int       # 0–100
    speed: int          # 0–100
    completeness: int   # 0–100

class FeedbackBranch(BaseModel):
    key: str
    title_en: str
    title_hi: str
    message_en: str
    message_hi: str

class AcademyScenario(BaseModel):
    id: str
    title: str
    title_hi: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    prompt: str
    prompt_hi: str
    ai_output: str
    ai_output_hi: str
    correct_errors: list[str]
    explanation: str
    explanation_hi: str
    trade_off_metrics: TradeOffMetrics
    feedback_branches: list[FeedbackBranch]
    is_synthetic: bool = True

class AttemptRequest(BaseModel):
    scenario_id: str
    selected_errors: list[str]
    model_config = ConfigDict(extra="forbid")

class AttemptResult(BaseModel):
    score: int
    feedback: FeedbackBranch
    correct_errors: list[str]
    explanation: str
    explanation_hi: str
```

---

## Scoring Algorithm (deterministic — no LLM)

```python
def compute_score(selected: list[str], correct: list[str]) -> int:
    """
    Precision-recall F1 on error identification.
    Returns integer 0–100.
    """
    if not correct:
        return 100  # no errors → a perfect score if user selected nothing
    selected_set = set(selected)
    correct_set = set(correct)
    true_positives  = len(selected_set & correct_set)
    false_positives = len(selected_set - correct_set)
    false_negatives = len(correct_set - selected_set)
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall    = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    return round(f1 * 100)
```

Score → feedback branch selection:
- `score ≥ 80` → branch `key: "excellent"`
- `score ≥ 50` → branch `key: "partial"`
- `score < 50` → branch `key: "missed"`

---

## Branching Logic (client-side)

```typescript
function selectFeedbackBranch(
  score: number,
  branches: FeedbackBranch[]
): FeedbackBranch {
  if (score >= 80) return branches.find(b => b.key === "excellent") ?? branches[0];
  if (score >= 50) return branches.find(b => b.key === "partial")   ?? branches[0];
  return branches.find(b => b.key === "missed") ?? branches[0];
}
```

No LLM involvement in feedback — purely deterministic JSON lookup.

---

## Scenario Data (`backend/data/academy_scenarios.json`)

**5 required scenarios** covering each `ErrorCategory`:

| # | Title (EN) | Error type | AI Mode modelled | Difficulty |
|---|-----------|-----------|-----------------|------------|
| 1 | "The Missing Citation" | `hallucinated_citation` | Fast/cheap mode | beginner |
| 2 | "The Wrong Date" | `wrong_date` | Retrieval-only mode | beginner |
| 3 | "The Omitted Section" | `missing_section` | Summary mode | intermediate |
| 4 | "The Invented Order" | `invented_order` | Creative mode | intermediate |
| 5 | "The Overconfident Summary" | `overconfident_summary` | Production mode | advanced |

Each scenario has:
- A bilingual prompt and AI output (EN + HI)
- 3 `feedbackBranches` (excellent / partial / missed) — all bilingual
- `tradeOffMetrics` that honestly represent the modelled AI mode's trade-offs
- `isSynthetic: true` — no real case names, court numbers, or real-world data

---

## TradeOffMeter Component

```typescript
// src/components/academy/TradeOffMeter.tsx
interface TradeOffMeterProps {
  metrics: TradeOffMetrics;
  modeLabel: string;       // e.g. "Fast / सस्ता मोड"
  modeLabelHi: string;
}
```

- Three horizontal bars: Accuracy, Speed, Completeness
- Each bar labelled bilingually and shows a numeric value (0–100)
- Bars use accessible colour-coding: accuracy = blue, speed = green, completeness = amber
- `role="meter"` on each bar, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Caption: *"These are illustrative trade-offs, not performance benchmarks / ये दृष्टांत संबंधी समझौते हैं, प्रदर्शन बेंचमार्क नहीं।"*

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/AccuracyAcademyPage.tsx` | EXTEND — already imported in `routes.tsx`; enrich it |
| `src/components/academy/ScenarioCard.tsx` | NEW — card in scenario list |
| `src/components/academy/ScenarioPlayer.tsx` | NEW — main interactive player |
| `src/components/academy/TradeOffMeter.tsx` | NEW — three-bar meter with accessible markup |
| `src/components/academy/FeedbackPanel.tsx` | NEW — branching bilingual feedback display |
| `src/types/academy.ts` | NEW — all Academy types |
| `backend/api/routes_academy.py` | NEW — flat-convention router, 3 endpoints |
| `backend/data/academy_scenarios.json` | NEW — 5+ human-authored bilingual scenarios |
| `backend/api/models.py` | EXTEND — Academy Pydantic models |
| `backend/main.py` | EXTEND — register `academy_router` with prefix `/api/v1` |
| `docs/integration/WEEK12_ANTIGRAVITY_COMPLETION.md` | NEW |

---

## AIOutputDisplay — Annotation UX

The `AIOutputDisplay` renders the `aiOutput` text as annotatable HTML.
Clickable error regions are NOT pre-highlighted — the user must identify them.
On submit, the user's `selectedErrors` (a set of `ErrorCategory` values they chose from a checklist) are compared to `correctErrors`.

**Why a checklist, not free-text annotation?**
Annotating exact spans in free-text is high friction and inconsistent. A structured checklist of error categories is more pedagogically consistent and easier to score deterministically.

---

## Accuracy Guardrails

- **Scenario AI outputs contain deliberate, documented errors** — never accidentally accurate fabrications. Each error is referenced in `correctErrors` and explained in `explanation` / `explanationHi`.
- **Correct-answer sets are human-authored** — no AI generates the answer keys.
- **No real case names, court numbers, or real-world data** in any scenario — `isSynthetic: true` enforced at the model level.
- **TradeOffMeter shows honest ranges** — metrics are illustrative, not marketing claims. The caption states this explicitly.
- **No LLM in the scoring or feedback path** — deterministic F1 score + JSON branch lookup.

---

## Rollback

Set `accuracy_academy` flag to OFF.
- Routes `/academy`, `/accuracy-academy`, `/case/:id/academy` render 404 / fall through to NotFound.
- Backend endpoints return 404.
- User attempt history is preserved — nothing is deleted.

---

## Hand-off to Week 12 (Antigravity)

1. Read `.kiro/specs/accuracy-academy/requirements.md` and this design before writing code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — gate all new UI behind `integrationFlags.accuracy_academy`.
3. `AccuracyAcademyPage.tsx` **already exists and is imported** in `routes.tsx` — extend it rather than create a new file.
4. All scenario content must be bilingual (EN + HI) before merging — no English-only scenario texts.
5. `TradeOffMeter` must use `role="meter"` and `aria-valuenow` — accessibility is non-negotiable.
6. The disclaimer *"These are illustrative trade-offs, not performance benchmarks"* must appear below every `TradeOffMeter`.
7. Completion doc: `docs/integration/WEEK12_ANTIGRAVITY_COMPLETION.md`.
