# Chronology Studio — Requirements
**Flag**: `chronology_studio` (default OFF)
**Week**: 10 (Devin primary)
**Source**: AI Law showcase — chronology board + calendar view

## Scope
An interactive chronology editor that lets the user build, edit and reorder a case timeline. Events can be viewed as a vertical chronology list, a Kanban-style board, or a calendar. All dates are synthetic — no live court API.

## Data Model
- `ChronologyEvent`: `{ id, date: string (ISO), title, titleHi, description, descriptionHi, category: "incident"|"fir"|"charge_sheet"|"hearing"|"order"|"bail"|"other", caseId, source?: string }`
- `ChronologyView`: `"list" | "board" | "calendar"`

## API Contract
- `GET  /api/v1/chronology/:case_id` — response: `{ events: ChronologyEvent[] }`
- `POST /api/v1/chronology/:case_id/events` — add event; body: `ChronologyEvent` (minus id)
- `PUT  /api/v1/chronology/:case_id/events/:id` — update event
- `DELETE /api/v1/chronology/:case_id/events/:id` — remove event

## Accuracy Guardrails
- Dates entered must be validated as real calendar dates.
- Auto-population from uploaded documents must mark source for user verification.
- No AI-invented dates — only dates present in documents or entered by the user.

## Bilingual Requirement
All event titles, category labels, and UI strings bilingual (English + Hindi).

## Flag
`chronology_studio` — OFF by default. Enable via `VITE_FF_CHRONOLOGY_STUDIO=true`.

## Rollback
Disable flag. Stored chronology data is preserved in the case data layer.

## Acceptance Criteria
- [ ] Events display in list, board, and calendar views
- [ ] Add / edit / delete operations work and persist
- [ ] All dates are validated
- [ ] Auto-populated events flagged as "needs verification"
- [ ] All UI strings bilingual
