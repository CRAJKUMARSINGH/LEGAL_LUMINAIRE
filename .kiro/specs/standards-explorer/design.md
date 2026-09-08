# Standards Explorer — Design
**Flag**: `standards_explorer`

## Architecture
```
StandardsExplorerPage (flag-gated)
  ├── SearchBar (query + body filter)
  ├── ResultsList
  │     └── StandardCard × N (code, title, score)
  └── StandardDetailPanel
        ├── PlainLanguageSummary (EN + HI)
        ├── LegalContext (EN + HI)
        └── DisclaimerBanner (bilingual, always visible)

Backend:
  GET /api/v1/standards — full-text search over standards index
  GET /api/v1/standards/:id — detail

Data:
  backend/rag/standards_index.py (already exists)
  backend/rag/law_db.json (already exists — extend with standards)
```

## Key Files
- `src/pages/StandardsExplorerPage.tsx` — flag-gated
- `src/components/standards/StandardCard.tsx`
- `src/components/standards/StandardDetailPanel.tsx`
- `src/components/standards/DisclaimerBanner.tsx`
- `backend/api/routes_standards_explorer.py`

## Route
`/standards-explorer` added to `routes.tsx` when flag ON.
Reuses existing `rag/standards_index.py` for search — no new data pipeline.
