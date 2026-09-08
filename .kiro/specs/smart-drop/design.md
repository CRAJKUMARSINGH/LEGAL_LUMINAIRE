# Smart Drop — Design
**Flag**: `smart_drop`

## Architecture
```
Frontend                          Backend
SmartDropPage                     POST /api/v1/smart-drop/classify
  └── DropZone                       └── classifier (keyword + embedding)
        │ drop event                       └── returns type + confidence
        └── calls /classify           POST /api/v1/smart-drop/confirm
              │ proposal                    └── writes to case register
              └── ProposalCard
                    └── ConfirmButton
```

## Key Files
- `src/pages/SmartDropPage.tsx` — flag-gated
- `src/components/smart-drop/DropZone.tsx`
- `src/components/smart-drop/ProposalCard.tsx`
- `backend/api/routes_smart_drop.py`

## Classification Strategy
1. Keyword matching on document type markers (FIR number, "charge sheet", bail order headers).
2. Short embedding similarity against type exemplars.
3. Confidence = weighted average of keyword + embedding scores.

## Route
`/smart-drop` added to `routes.tsx` when flag ON.
