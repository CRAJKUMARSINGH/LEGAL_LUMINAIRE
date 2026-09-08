# Chronology Studio — Design
**Flag**: `chronology_studio`

## Architecture
```
ChronologyStudioPage (flag-gated)
  ├── ViewToggle (list | board | calendar)
  ├── ChronologyListView
  ├── ChronologyBoardView  (Kanban by category)
  └── ChronologyCalendarView

Backend: backend/api/routes_chronology.py
Data:    per-case event store (JSON file or SQLite via existing case_manager)
```

## Key Files
- `src/pages/ChronologyStudioPage.tsx` — flag-gated
- `src/components/chronology/ChronologyListView.tsx`
- `src/components/chronology/ChronologyBoardView.tsx`
- `src/components/chronology/ChronologyCalendarView.tsx`
- `src/components/chronology/EventForm.tsx` — add/edit modal
- `backend/api/routes_chronology.py`

## Calendar Library
Use `react-big-calendar` or `@fullcalendar/react` (already-used or lightest available).

## Route
`/case/:id/chronology` added to `routes.tsx` when flag ON.
