# WEEK 3 — KIRO SUPPORT NOTE
**Theme**: Document Pipeline & Accuracy Controls (Trae Primary)
**Role**: Kiro — Support
**Date completed**: 2026-09-07
**Typecheck status**: PASS (exit 0, zero errors — confirmed before and after all changes)

---

## SUMMARY

All four Week 3 support tasks completed. No new TypeScript errors introduced.
The document ingestion pipeline (OmniDropzone → ReviewView → UploadView) is now
fully typed end-to-end — no remaining `any` on props, state, or API response shapes.
Three previously silent error paths now surface dismissible toast notifications to the
user. CI extended with four document-ingestion smoke tests and a final typecheck step.

---

## TASK OUTCOMES

### 1. Audit — Upload/Ingestion Components

**Files audited:**
- `src/components/views/OmniDropzone.tsx`
- `src/components/views/ReviewView.tsx`
- `src/components/views/UploadView.tsx`

**Gaps found:**

| Location | Gap | Severity |
|----------|-----|----------|
| `OmniDropzone` — `extractionData` state | `useState<any>(null)` | High |
| `OmniDropzone` — `handleFinalSave` param | `refinedData: any` | High |
| `OmniDropzone` — timeline map | `ev: any` | Medium |
| `OmniDropzone` — auto-research map | `m: any` | Medium |
| `OmniDropzone` — `confirmIngest` failure branch | Silent — only `setStatusText`, no toast | High |
| `OmniDropzone` — `confirmIngest` catch | Silent — only `setStatusText`, no toast | High |
| `OmniDropzone` — auto-research catch | `console.error` only — completely invisible | High |
| `ReviewView` — component props | `({ extraction, onSave, onBack }: any)` | High |
| `ReviewView` — timeline items | `evt: any` in map | Medium |
| `ReviewView` — Input values | `value={editedData.incident_type}` — undefined warning risk | Low |
| `UploadView` — upload button | Permanently `disabled` — no progress, no error, no feedback | High |
| `types/index.ts` | Missing: `UploadStage`, `PreviewResponse`, `IngestResponse`, `AutoResearchResponse`, `UploadProgressState` | High |

---

### 2. Type Safety — Upload Progress States

**`src/types/index.ts` — 5 new types added:**

```typescript
// Upload stage machine — 7 states including new "error" state
export type UploadStage =
  "idle" | "previewing" | "preview_ready" | "ingesting" |
  "reviewing" | "done" | "error";

// Backend response shapes — replaces implicit any on res.json()
export interface PreviewResponse { success, metadata?, chunks?, errors?, message? }
export interface IngestResponse   { success, case_id?, extraction?, message?, errors? }
export interface AutoResearchResponse { success, matches: AutoResearchMatch[], message? }

// Progress state shape for multi-step ingestion display
export interface UploadProgressState { stage, statusText, percent?, errors[] }
```

`PreviewMetadata` and `PageChunk` local types in `OmniDropzone` are now derived from
`PreviewResponse` using `NonNullable<PreviewResponse["metadata"]>` and
`NonNullable<PreviewResponse["chunks"]>[number]` — single source of truth.

**`src/components/views/OmniDropzone.tsx`:**
- `extractionData` state: `any` → `ExtractionData | null`
- `handleFinalSave` param: `any` → `ExtractionData`
- Timeline map `ev`: `any` → `ExtractionTimelineEvent`
- Auto-research map `m`: `any` → `AutoResearchMatch`
- API responses explicitly typed as `PreviewResponse`, `IngestResponse`, `AutoResearchResponse`
- Added `"error"` stage with a dedicated error panel in the JSX (was missing entirely)
- Added `res.ok` checks before `res.json()` on all three fetch calls — catches 4xx/5xx
  without attempting to parse error HTML as JSON
- Cleared progress timeouts (`clearTimeout`) on both success and failure paths

**`src/components/views/ReviewView.tsx`:**
- Props: `any` → `ReviewViewProps` (imported from `@/types`)
- `editedData` state: inferred from `any` → explicit `ExtractionData`
- Timeline map `evt`: `any` → `ExtractionTimelineEvent`
- `timeline_events` spread: `[...editedData.timeline_events]` → `[...(editedData.timeline_events ?? [])]`
  (fixes TS2488 — `undefined` is not iterable)
- Input `value` props: `editedData.incident_type` / `editedData.jurisdiction` →
  `editedData.incident_type ?? ""` / `editedData.jurisdiction ?? ""` (prevents
  React uncontrolled-to-controlled warning when backend returns undefined fields)
- `accused_names` map: added `?? []` guard
- Removed unused imports: `Card`, `CardContent`, `CardHeader`, `CardTitle`, `ChevronRight`

---

### 3. Error Handling — User-Facing Feedback

**Three previously silent error paths now surface toast notifications:**

| Path | Before | After |
|------|--------|-------|
| `previewFile` — non-2xx HTTP | Set statusText only | Toast: "Preview Failed" + server error code |
| `confirmIngest` — non-2xx HTTP | Set statusText only | Toast: "Ingestion Failed" + server error code |
| `confirmIngest` — network catch | Set statusText only | Toast: "Connection Failed" + port hint |
| `confirmIngest` — `success: false` | Set statusText only | Toast: "Ingestion Failed" + backend message |
| Auto-research — non-2xx HTTP | `console.error` (invisible) | Toast: "Auto-Research Skipped" (non-fatal, default variant) |
| Auto-research — network catch | `console.error` (invisible) | Toast: "Auto-Research Unavailable" (non-fatal, default variant) |

Auto-research failures use `variant: "default"` (not `"destructive"`) because they are
non-fatal — the case is still created successfully, just without auto-matched precedents.
This distinction is intentional so users are informed but not alarmed.

**`src/components/views/UploadView.tsx` — complete rewrite:**

Before: upload button permanently `disabled`, no state, no feedback beyond static text.

After: full per-file upload state machine:
- `UploadPhase`: `"idle" | "uploading" | "success" | "error"`
- `UploadFileState`: `{ file, phase, progressLabel, errorMessage? }`
- Per-file progress badges (spinner / checkmark / error icon)
- Per-file inline error message display
- Deduplication: same file (name+size) cannot be added twice
- "Upload All" button: fires concurrent uploads, disabled during upload / when all done
- Individual file removal via `X` button (disabled during upload)
- Toast on success: "File Indexed — ready for RAG search"
- Toast on failure: "Upload Failed" or "Connection Failed" with descriptive message
- Backend unavailability surfaced immediately on first upload attempt (not as static text)
- `res.ok` check before `res.json()` — handles 4xx/5xx without JSON parse error

---

### 4. CI — Document Ingestion Smoke Tests

**4 new steps added to `.github/workflows/ci.yml` (after Week 2 steps):**

```yaml
- name: Smoke-test ingestion types imported in OmniDropzone
  # grep for ExtractionData, IngestResponse, PreviewResponse imports

- name: Smoke-test ReviewView uses typed props not any
  # grep for ReviewViewProps + ExtractionTimelineEvent; fail if }: any found

- name: Smoke-test UploadView has state machine not disabled stub
  # grep for UploadPhase, UploadFileState, uploadFile

- name: Smoke-test central types index has all ingestion types
  # grep for all 6 ingestion types in src/types/index.ts

- name: Final typecheck after all Week 3 changes
  # pnpm --filter @workspace/legal-luminaire run typecheck
```

These checks are static source-grep checks — they do NOT start a backend server.
They run after the Vite build so any import that slips past `tsc --noEmit` is also
caught by the bundler. The `ReviewView any` check actively fails CI if `}: any` is
re-introduced, making regression detectable without human review.

Total `ci.yml`: 120 lines (was 71 after Week 2).

---

## FILES CHANGED THIS WEEK

| File | Change type | Description |
|------|-------------|-------------|
| `src/types/index.ts` | Addition | 5 new ingestion types: UploadStage, PreviewResponse, IngestResponse, AutoResearchResponse, UploadProgressState |
| `src/components/views/OmniDropzone.tsx` | Rewrite | All `any` eliminated; 6 error paths now surface toasts; `res.ok` guards; `error` stage added |
| `src/components/views/ReviewView.tsx` | Fix | Typed props via ReviewViewProps; ExtractionData state; undefined guards; unused imports removed |
| `src/components/views/UploadView.tsx` | Rewrite | Full UploadPhase/UploadFileState state machine; per-file progress/error; toast feedback |
| `.github/workflows/ci.yml` | Extension | 4 smoke-test steps + 1 final typecheck (Week 3 block) |

---

## VERIFICATION COMMANDS RUN

```bash
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 — before changes
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 1 — after ReviewView fix (spread on undefined)
# Fix applied: [...(editedData.timeline_events ?? [])]
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 — after fix
pnpm --filter @workspace/legal-luminaire run typecheck   # exit 0 — final confirmation
```

One TypeScript error was caught and fixed during the work:
- `TS2488` in `ReviewView.tsx` line 16: `Type 'ExtractionTimelineEvent[] | undefined'`
  `must have a '[Symbol.iterator]()' method` — fixed by adding `?? []` fallback.

---

## RESIDUAL RISKS & HAND-OFF NOTES FOR TRAE

1. **Backend endpoint `/upload-document` not yet implemented** — `UploadView` now calls
   `POST http://localhost:8000/api/v1/upload-document`. This endpoint needs to be
   implemented in the Python backend (`artifacts/legal-luminaire/backend/api/routes.py`).
   Until then, uploads will fail gracefully with a "Connection Failed" toast rather
   than a silent hang. The frontend contract is: `{ success: boolean, message?: string }`.

2. **`/omni-ingest` extraction shape** — `IngestResponse.extraction` is typed as
   `ExtractionData` which has all fields optional (`incident_type?`, `jurisdiction?`, etc.)
   to match the current backend behaviour. If Trae's pipeline guarantees certain fields
   are always present, tighten those to required in `ExtractionData` accordingly.

3. **`ReviewView` — source document preview pane** — The left panel still shows a
   placeholder ("PDF Render Pipeline Active..."). This is pre-existing — not a Week 3
   regression. Trae's pipeline work may want to wire `previewChunks` through to this
   panel so users can cross-reference the original text while editing the extraction.

4. **`UploadView` vs `OmniDropzone`** — Two separate upload flows exist:
   - `UploadView` (`/case/:id/upload`): multi-file, indexes to vector DB
   - `OmniDropzone` (`/new-case-ingest`): single-file, creates a new case via AI extraction
   Both are now typed and have proper error handling. They call different backend
   endpoints and should remain separate flows.

5. **Vitest tests** — CI still runs `pnpm --filter @workspace/legal-luminaire run test`.
   No test files cover the ingestion pipeline yet. Recommend adding at minimum:
   - A unit test for `handleFinalSave` covering the happy path and the auto-research
     failure path (should not throw, case should still be created).
   - A test for `UploadView` confirming the state machine transitions correctly.

---

## ACCURACY RULES COMPLIANCE

- No citation data was added or modified.
- No IS/ASTM standard references were added or modified.
- No `blockedFromDraft` flags were changed.
- All changes are UI/type layer only — no accuracy-sensitive data paths touched.
- Protected files (App.tsx, CaseContext.tsx, citation-gate.ts, etc.) unchanged.

---

*End of Week 3 Kiro Support Note*
