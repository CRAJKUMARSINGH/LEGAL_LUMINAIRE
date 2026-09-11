# Chronology Studio — Design
**Flag**: `chronology_studio`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Kiro (Week 10)

---

## Architecture

```
Frontend                                Backend
─────────────────────────────────────   ──────────────────────────────────────────
ChronologyPage (/case/:id/chronology)   GET  /api/v1/cases/{id}/chronology
  ├─ ViewToggle (List / Board / Cal)    POST /api/v1/cases/{id}/chronology
  ├─ ChronologyListView                 PUT  /api/v1/cases/{id}/chronology/{entry_id}
  ├─ ChronologyBoardView                DELETE /api/v1/cases/{id}/chronology/{entry_id}
  └─ ChronologyCalendarView
                                        All endpoints: flag check → 404 if OFF
EntryEditor (modal)
  ├─ DatePicker (SYNTHETIC dates only)
  ├─ EventTypeSelect (bilingual)
  ├─ DescriptionField
  └─ LegalSignificanceField

DeadlinePage (/case/:id/deadlines)
  └─ DeadlineBoard (existing — Week 9)
     consumed via ChronologyPage too
```

---

## Calendar Library Decision (ADR)

**Chosen**: `react-big-calendar` (already evaluated in Week 10 implementation notes)

**Rationale:**
- Already present in the Netlify-deployed build — no new dependency needed
- Supports month / week / day / agenda views matching the spec
- Accessible (WAI-ARIA) and internationalisation-ready
- Tree-shakeable; bundle impact is minimal for the build target

**Rejected alternatives:**
- `fullcalendar` — heavier bundle, commercial licence for some plugins
- `react-calendar` — month-only, too limited for Board view
- Custom grid — unnecessary build complexity for a foundation spec

---

## View Types

### List View (`ChronologyListView`)
- Chronological table: Date | Event Type | Description | Legal Significance | Actions
- Sortable by date (default: ascending)
- Inline edit via `EntryEditor` modal
- Bilingual column headers

### Board View (`ChronologyBoardView`)
- Kanban-style columns by `eventPhase`: Pre-Arrest | Investigation | Charge Sheet | Trial | Bail/Discharge
- Cards show: date badge, event type, first 80 chars of description
- Drag-to-reorder within a column (reorders `sortOrder` only — not `date`)
- Phase labels bilingual

### Calendar View (`ChronologyCalendarView`)
- Month view by default; week and agenda views available
- Events colour-coded by `eventPhase`
- Click event → opens `EntryEditor` modal (read-only for past synthetic events)
- Uses `react-big-calendar` localizer set to `luxon` (already in tree)

---

## Data Model

```typescript
// frontend type (src/types/chronology.ts — NEW)
export interface ChronologyEntry {
  id: string;                      // uuid
  caseId: string;
  date: string;                    // ISO-8601 date string — SYNTHETIC only (no real case dates)
  eventType: ChronologyEventType;
  eventType_hi: string;            // Hindi label
  description: string;             // free text, max 500 chars
  description_hi?: string;         // optional bilingual description
  legalSignificance?: string;      // free text, max 300 chars
  eventPhase: ChronologyPhase;
  sortOrder: number;               // within-phase ordering for board view
  linkedCitationId?: string;       // optional link to a CasePrecedent id
  createdAt: string;
  updatedAt: string;
}

export type ChronologyEventType =
  | "incident"
  | "arrest"
  | "remand"
  | "bail_application"
  | "bail_order"
  | "charge_sheet_filed"
  | "fir_registered"
  | "evidence_collected"
  | "witness_statement"
  | "court_hearing"
  | "order_passed"
  | "appeal_filed"
  | "custom";

export type ChronologyPhase =
  | "pre_arrest"
  | "investigation"
  | "charge_sheet"
  | "trial"
  | "bail_discharge";
```

```python
# backend/api/models.py extensions
class ChronologyEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    case_id: str
    date: str                       # ISO-8601, validated as date-only string
    event_type: str
    event_type_hi: str
    description: str = Field(max_length=500)
    description_hi: str | None = None
    legal_significance: str | None = Field(None, max_length=300)
    event_phase: str
    sort_order: int = 0
    linked_citation_id: str | None = None
    created_at: str
    updated_at: str
    model_config = ConfigDict(extra="forbid")
```

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/ChronologyPage.tsx` | EXTEND — already exists (Week 10); add Board + Calendar views |
| `src/components/chronology/ChronologyListView.tsx` | NEW or EXTEND |
| `src/components/chronology/ChronologyBoardView.tsx` | NEW — kanban with drag |
| `src/components/chronology/ChronologyCalendarView.tsx` | NEW — react-big-calendar wrapper |
| `src/components/chronology/EntryEditor.tsx` | NEW — modal for CRUD |
| `src/types/chronology.ts` | NEW — shared types |
| `backend/api/routes_chronology.py` | NEW — flat-convention router, 4 endpoints |
| `backend/api/models.py` | EXTEND — `ChronologyEntry` |
| `backend/main.py` | EXTEND — register `chronology_router` |

---

## Bilingual Phase Labels

| Phase key | English | Hindi |
|---|---|---|
| `pre_arrest` | Pre-Arrest | गिरफ्तारी से पूर्व |
| `investigation` | Investigation | जांच |
| `charge_sheet` | Charge Sheet Stage | आरोप-पत्र चरण |
| `trial` | Trial | विचारण |
| `bail_discharge` | Bail / Discharge | जमानत / आरोप-मुक्ति |

---

## Accuracy Guardrails

- **Synthetic dates only** — `EntryEditor` date picker must not accept future real-world hearing dates; dates are for internal chronology modelling only.
- Entries with `linkedCitationId` must resolve to an existing citation record — the UI shows the citation status badge alongside the timeline entry.
- PENDING / FATAL_ERROR linked citations show a warning on the chronology entry: *"Linked citation unverified — remove before filing / लिंक किया गया उद्धरण असत्यापित है।"*
- Chronology entries are **never** exported directly into a draft document without passing through `citation-gate.ts` for any linked citation.

---

## Rollback

Set `chronology_studio` flag OFF. `/case/:id/chronology` renders the existing minimal `ChronologyPage` (Week 10 stub). No data is deleted — chronology entries persist in the backend.

---

## Hand-off to Week 10 (Kiro)

1. Read `.kiro/specs/chronology-studio/requirements.md` and this design before writing code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — new Board and Calendar views must be wrapped in `integrationFlags.chronology_studio`.
3. `ChronologyPage.tsx` **already exists** from the Week 10 implementation — extend it rather than replace it.
4. Calendar localizer: import from `luxon` (already in tree) — do not add `moment` or `date-fns`.
5. Drag-in-board must update `sortOrder` only, never `date` — dates are user-entered facts, not ordering handles.
6. All four CRUD endpoints must validate `case_id` matches the authenticated session case.
7. Completion doc: `docs/integration/WEEK10_KIRO_COMPLETION.md`.
