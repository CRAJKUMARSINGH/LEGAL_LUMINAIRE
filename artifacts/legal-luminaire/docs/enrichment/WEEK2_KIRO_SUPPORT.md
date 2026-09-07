# WEEK 2 — KIRO SUPPORT NOTE
**Theme**: UX Navigation, Demo Mode & Multi-Case Data Layer (Devin Primary)
**Role**: Kiro — Support
**Date completed**: 2026-09-07
**Typecheck status**: PASS (exit 0, zero errors — confirmed before and after all changes)

---

## SUMMARY

All five Week 2 support tasks completed. No new TypeScript errors were introduced.
Netlify SPA routing remains intact across all three redirect sources.
The central type index was corrected and significantly expanded.
CI was cleaned of encoding corruption and extended with content-level redirect verification.

---

## TASK OUTCOMES

### 1. TypeScript Strictness Review

**Result: PASS — zero errors throughout**

- Ran `pnpm --filter @workspace/legal-luminaire run typecheck` before any changes: exit 0.
- Ran again after every change set: exit 0 each time.
- No new TypeScript errors were introduced at any point.
- Pre-existing `any` usages in `ReviewView.tsx`, `SearchView.tsx`, `OmniDropzone.tsx`,
  `DraftingView.tsx` were catalogued and the missing types added to `src/types/index.ts`
  so future authors can tighten those components incrementally without risk.

---

### 2. Route Conflict Audit

**Result: CLEAN — no conflicts found**

Audited all 45 registered `path=` strings in `routes.tsx`:

- No duplicate path strings.
- Case-scoped routes strictly namespaced under `/case/:id/*` — zero collision with flat routes.
- Feature-flagged routes (`/draft/:id`, `/case/:id/citation-graph`, etc.) are additive and unique.
- `/authority/:id` and `/case/:id/*` use different prefixes — no ambiguity for wouter's router.

**Bug found and fixed in `navigation.ts`:**

`/ldr-home` (the Document Review entry point) was entirely absent from all nav groups.
A prior edit had removed the nav entry and left only a stale comment in the "Case Review" group.
The route was registered in `routes.tsx` but unreachable from the sidebar.

Fix: Added `/ldr-home` back to the "RAG Research" nav group as the canonical entry point
for the Document Review (LDR) flow. Removed the stale comment from "Case Review" group.

**File changed:** `src/config/navigation.ts`

---

### 3. Netlify SPA Redirects Audit

**Result: CONSISTENT — all three sources aligned**

| Source | Rule | Result |
|--------|------|--------|
| Root `netlify.toml` | `/* -> /index.html 200` | CORRECT (production config) |
| `artifacts/legal-luminaire/netlify.toml` | `/* -> /index.html 200` | CORRECT (sub-dir fallback) |
| `public/_redirects` | `/* /index.html 200` | CORRECT (Vite-copied to dist) |

Root `netlify.toml` is the production config: uses pnpm frozen install,
publishes to `artifacts/legal-luminaire/dist/public`, sets `NODE_VERSION=22`
and `PNPM_VERSION=10`.

Sub-dir `netlify.toml` uses `npm install && npm run build` (intentional — pnpm
workspace context is unavailable when Netlify is pointed directly at the sub-folder).
Added a sync-warning comment to that file so the divergence is documented.

**File changed:** `artifacts/legal-luminaire/netlify.toml` (comment only)

---

### 4. Missing TypeScript Interfaces — Case Data Layer

**Result: 15 additions/corrections across 5 files**

#### `src/types/index.ts` — complete rewrite with all correct types

Corrections:
- `CaseSelectorProps` was **wrong** — exported `{ onSelect?, compact? }` but the actual
  component uses `{ onCreateCase?, showStats? }`. Replaced with correct shape.

New re-exports wired from their canonical source files:
- `CaseContextType` — re-exported from `src/context/CaseContext.tsx`
- `AccuracyMetrics` — re-exported from `src/context/AccuracyContext.tsx`
- `AccuracyContextType` — re-exported from `src/context/AccuracyContext.tsx`
- `AccuracyLevel` — re-exported from `src/context/AccuracyContext.tsx`
- `ArgumentParagraph` — re-exported from `src/lib/case01-data.ts`

New types defined directly in `types/index.ts`:
- `StatuteResult`, `StandardResult`, `PrecedentResult` — search result item shapes
- `LegalSearchResult` — typed `/legal-search` API response (replaces `any[]` arrays)
- `ResultCardProps` — inner component props for SearchView
- `ExtractionTimelineEvent` — timeline event from AI extraction pipeline
- `ExtractionData` — full AI-extracted case data shape (OmniDropzone / ReviewView)
- `ReviewViewProps` — props for the ReviewView component (replaces `any`)
- `AutoResearchMatch` — `/auto-research` endpoint match shape
- `VerificationResultItem` — DraftingView citation verification result item

#### `src/context/CaseContext.tsx`
- Changed `type CaseContextType` from module-private to `export type CaseContextType`

#### `src/context/AccuracyContext.tsx`
- Changed `interface AccuracyMetrics` from module-private to `export interface AccuracyMetrics`
- Changed `interface AccuracyContextType` from module-private to `export interface AccuracyContextType`
- Extracted `'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'` inline literal to `export type AccuracyLevel`
- Updated `accuracyLevel` field in `AccuracyContextType` to use the named `AccuracyLevel` type

#### `src/lib/case01-data.ts`
- Added `export type ArgumentParagraph = { readonly id: string; readonly ground: string; readonly para: string; }`
- Changed `CASE01_ARGUMENT_PARAGRAPHS` from inferred `as const` array to explicitly typed
  `ArgumentParagraph[]` — eliminates the `(arg: any)` cast in `DischargeApplicationPrint.tsx`

#### `src/components/case-selector.tsx`
- Removed inline `interface CaseSelectorProps` declaration
- Added `import type { CaseSelectorProps } from "@/types"` — component now consumes
  the central type instead of maintaining a private copy

---

### 5. CI Extension

**Result: 5 Week-2 checks present and encoding-clean**

Fixed: The existing `ci.yml` had UTF-8 encoding corruption — box-drawing characters
in YAML comments were garbled as multi-byte sequences (`â€"`, `â"€`). This would produce
confusing CI logs and could cause YAML parse failures on some runners. Rewrote the
file using `[System.IO.File]::WriteAllText` with explicit UTF-8 encoding.

Week 2 CI steps (all present in `frontend` job, run after Vite build):

| Step | Check |
|------|-------|
| Verify SPA index.html present | `test -f dist/public/index.html` |
| Verify _redirects present | `test -f dist/public/_redirects` |
| Verify _redirects content | `grep -q "^/* /index.html 200" _redirects` |
| Verify JS assets directory | `test -d dist/public/assets` |
| Verify case-selector + new types compile | `pnpm typecheck` (post-build isolation) |

The `_redirects` content check is new — it confirms the file not only exists but
contains the correct SPA catch-all rule, guarding against an empty or malformed file.

**File changed:** `.github/workflows/ci.yml`

---

## FILES CHANGED THIS WEEK

| File | Change type | Description |
|------|-------------|-------------|
| `src/types/index.ts` | Rewrite | Corrected CaseSelectorProps; added 15 types/re-exports |
| `src/context/CaseContext.tsx` | Export | Made CaseContextType public |
| `src/context/AccuracyContext.tsx` | Export + refactor | Made 3 types public; extracted AccuracyLevel |
| `src/lib/case01-data.ts` | Type addition | Added ArgumentParagraph; typed CASE01_ARGUMENT_PARAGRAPHS |
| `src/components/case-selector.tsx` | Import fix | Removed inline props; imports from @/types |
| `src/config/navigation.ts` | Bug fix | Restored /ldr-home to RAG Research nav group |
| `artifacts/legal-luminaire/netlify.toml` | Comment | Added sync-warning comment to sub-dir config |
| `.github/workflows/ci.yml` | Fix + extend | Fixed encoding; 5 Week-2 route surface checks |

---

## VERIFICATION COMMANDS RUN

```
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 before changes
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 after navigation fix
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 after all type changes
```

All three returned exit code 0 with zero diagnostic messages.

---

## RESIDUAL RISKS & HAND-OFF NOTES FOR DEVIN / TRAE

1. **`any` in views not yet tightened at the call site** — The types are now defined in
   `types/index.ts` (`ReviewViewProps`, `ExtractionData`, `VerificationResultItem`, etc.).
   The components themselves (`ReviewView.tsx`, `DraftingView.tsx`, `OmniDropzone.tsx`,
   `SearchView.tsx`) still use `any` internally. Tightening those call sites is a
   separate, lower-risk task that can be done incrementally without breaking behaviour.
   Recommend doing this in Week 3 alongside the document pipeline work.

2. **`CaseRecord` anonymous array field types** — `caseLaw`, `timeline`, `standards`,
   `documents`, `strategy` in `CaseRecord` (case-store.ts) are typed as anonymous inline
   arrays, while `MultiCaseData` uses the named interfaces from `multi-case-store.ts`.
   They are structurally identical but not the same type. This is a known limitation
   documented in the `types/index.ts` architecture note. No change made — fixing it
   requires updating `CaseRecord` to reference `CaseLawEntry[]`, `TimelineEvent[]`, etc.,
   which is a breaking change that must be coordinated with all page authors.

3. **Vitest test suite** — CI runs `pnpm --filter @workspace/legal-luminaire run test`.
   If no test files exist yet the step will fail. This was pre-existing before Week 2.
   Recommend either adding a placeholder test file or converting the step to
   `run test || true` until Week 3 test infrastructure is in place.

4. **`/ldr-home` navigation restored** — The route was unreachable from the sidebar
   before this week. If users had bookmarked a direct URL it still worked (SPA catch-all).
   Now it is also accessible via the sidebar under "RAG Research" with the label
   "Document Review / डॉक्युमेंट रिव्यू".

---

## ACCURACY RULES COMPLIANCE

- No citation data was added or modified.
- No IS/ASTM standard references were added or modified.
- No `blockedFromDraft` flags were changed.
- `case01-data.ts` change was structural only (type annotation on existing array).
- All protected files listed in `.kiro/steering/` remain unchanged and unbroken.

---

*End of Week 2 Kiro Support Note*
