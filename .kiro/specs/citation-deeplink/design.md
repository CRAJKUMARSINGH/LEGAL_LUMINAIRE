# Citation Deep-Link — Design
**Flag**: `citation_deeplink`

## Architecture
```
CitationCard (renders citation)
  └── if citation_deeplink flag ON:
        └── GET /api/v1/citations/:id/deeplink
              └── resolves document_id → signed URL or local path
                    └── opens PDF viewer at page N
```

## Key Files
- `src/components/copilot/CitationCard.tsx` — renders link or plain text
- `src/lib/citationResolver.ts` — fetches deep-link data
- `backend/api/routes_citation_deeplink.py` — GET endpoint
- Index: `backend/rag/document_store.py` already stores `source_file` in metadata

## PDF Viewer
Reuse existing document viewer or open in new tab with `#page=N` fragment.
