---
inclusion: always
---

# LEGAL LUMINAIRE — PROTECTED FILES (NEVER CHANGE ADVERSELY)

These files are the stable, working foundation of the Legal Luminaire app.
They MUST NOT be overwritten, deleted, or broken by any future update.

## PROTECTED SOURCE FILES

### Core App Shell (working UI — fixed April 2026)
- `artifacts/legal-luminaire/src/App.tsx` — main router + sidebar + nav groups
- `artifacts/legal-luminaire/src/main.tsx` — React root mount
- `artifacts/legal-luminaire/src/index.css` — global styles
- `artifacts/legal-luminaire/src/context/CaseContext.tsx` — case state (localStorage + optional backend)
- `artifacts/legal-luminaire/src/context/AccuracyContext.tsx` — accuracy metrics

### Citation Gate (Citation Safety System — never remove)
- `artifacts/legal-luminaire/src/lib/citation-gate.ts` — scans draft text, returns SAFE/WARN/BLOCKED
- `artifacts/legal-luminaire/src/components/CitationGatePanel.tsx` — live sidebar panel
- `artifacts/legal-luminaire/src/components/views/SafeDraftEditor.tsx` — WYSIWYG editor with gate wired in
- `artifacts/legal-luminaire/src/pages/SafeDraftPage.tsx` — route wrapper for Safe Draft Editor

### Verification Engine (accuracy rules enforcement)
- `artifacts/legal-luminaire/src/lib/verification-engine.ts` — COURT_SAFE/VERIFIED/SECONDARY/PENDING tiers
- `artifacts/legal-luminaire/src/lib/case01-data.ts` — Hemraj case precedents with verification status

### Build Config
- `artifacts/legal-luminaire/vite.config.ts` — local dev config (port 5173, no Replit env vars required)

## RULES FOR ANY FUTURE MODIFICATION

1. NEVER replace `App.tsx` with the engineer's update version (it imports `@workspace/api-client-react` pages that crash without a backend).
2. NEVER replace `vite.config.ts` with the Replit version (it requires PORT and BASE_PATH env vars).
3. NEVER replace `CaseContext.tsx` with a version that only fetches from `localhost:8000` — it must always fall back to localStorage.
4. The Citation Gate (`citation-gate.ts`, `CitationGatePanel.tsx`, `SafeDraftEditor.tsx`) must remain wired — removing it violates accuracy-rules.md Rule 6.
5. Any new page added to the router MUST be added to `App.tsx` only — never replace the whole file.
6. `blockedFromDraft: true` must remain the default for all PENDING citations in `case01-data.ts`.

## HOW TO RUN

```
pnpm install   (from workspace root)
pnpm --filter @workspace/legal-luminaire run dev
```

App runs at: http://localhost:5173/
