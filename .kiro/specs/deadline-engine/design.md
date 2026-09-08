# Deadline Engine — Design
**Flag**: `deadline_engine`

## Architecture
```
DeadlinePage (flag-gated)
  └── POST /api/v1/deadlines/compute
        └── deadline_rules.json (static, statute-sourced)
              └── compute due_date = event_date + days_from_event
                    └── return sorted ComputedDeadline[]
```

## Key Files
- `src/pages/DeadlinePage.tsx` — flag-gated
- `src/components/deadline/DeadlineBoard.tsx`
- `backend/api/routes_deadline.py`
- `backend/data/deadline_rules.json` — static rules from CrPC/BNSS

## Rule Engine
Pure date arithmetic — no LLM. Rules stored as JSON with statute reference.
