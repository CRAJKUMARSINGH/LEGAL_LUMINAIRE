# Diff-only report: REFERENCE-APP00 vs OUR_APP

**Mode:** comparison only — no files were merged.  
**Generated:** machine-assisted `git diff --no-index` + path inventory.

## Path pairing (compare apples to apples)

| Layer | REFERENCE-APP00 | OUR_APP (production) |
|--------|-----------------|----------------------|
| React app | `REFERENCE-APP00/artifacts/legal-luminaire/src/` | `artifacts/legal-luminaire/src/` |
| Python API | `REFERENCE-APP00/backend/` | `artifacts/legal-luminaire/backend/` |

REFERENCE uses a **root-level** `backend/`; OUR nests the same service under **`artifacts/legal-luminaire/backend/`**.

## Frontend (`…/legal-luminaire/src/`)

### Aggregate (git)

```text
git diff --no-index --stat \
  REFERENCE-APP00/artifacts/legal-luminaire/src \
  artifacts/legal-luminaire/src
```

**Result:** `41 files changed, 4898 insertions(+), 953 deletions(-)`  
(Exit code 1 only means “there are differences”; stderr was suppressed for CRLF warnings.)

### Files present only in REFERENCE (3)

| File |
|------|
| `components/create-session-dialog.tsx` |
| `components/document-upload.tsx` |
| `components/layout.tsx` |

### Files present only in OUR_APP (17)

| File |
|------|
| `components/CitationGatePanel.tsx` |
| `components/status-badge.tsx` |
| `components/layout/app-layout.tsx` |
| `components/ui/VirtualizedList.tsx` |
| `components/views/SafeDraftEditor.tsx` |
| `config/featureFlags.ts` |
| `data/all-demo-cases.ts` |
| `data/demo-cases/demo01.ts` |
| `data/demo-cases/infra-arb-cases.ts` |
| `hooks/useDebounce.ts` |
| `lib/citation-gate.ts` |
| `lib/format.ts` |
| `pages/DemoCaseBrowser.tsx` |
| `pages/DischargeApplicationPrint.tsx` |
| `pages/InfraArbBrowser.tsx` |
| `pages/NoticeReplyPage.tsx` |
| `pages/SafeDraftPage.tsx` |

### Interpretation (for matrix / approval)

- OUR_APP **replaced** the older `layout.tsx` + small helpers with **`app-layout.tsx`** and a richer shell; REFERENCE still has **`create-session-dialog`**, **`document-upload`**, and the legacy **`layout.tsx`**.
- OUR_APP adds **citation gating**, **virtualized lists**, **safe draft / notice / discharge print / demo + infra browsers**, **feature flags**, and extra **data** modules — none of which exist as separate files in REFERENCE.
- Large shared files (**`App.tsx`**, **`CaseContext`**, **`multi-case-store`**, **`session-workspace`**, stubs, etc.) **differ in both trees**; review with line-level diff when you move from diff-only to merge.

## Backend (`backend/` vs `artifacts/legal-luminaire/backend/`)

### Aggregate (git)

```text
git diff --no-index --stat \
  REFERENCE-APP00/backend \
  artifacts/legal-luminaire/backend
```

**Result:** `43 files changed, 244 insertions(+), 218 deletions(-)` — but this run **includes** `__pycache__/`, `chroma_db/`, and similar **binary / local** noise. Treat the numbers as **upper-bound**; use path-scoped diffs for real reviews.

### Files present only in REFERENCE (code-only inventory)

Excludes `__pycache__/`, `chroma_db/`, `uploaded_cases/`.

| File |
|------|
| `agents/llm_factory.py` |

### Files present only in OUR_APP (code-only inventory)

Same exclusions.

| File |
|------|
| `api/routes_legal_stream.py` |

### Interpretation

- OUR_APP adds **SSE legal stream** routing (`routes_legal_stream.py`); REFERENCE routes through **`llm_factory.py`** instead (present only there).
- **`routes.py`**, **`main.py`**, agents, and RAG modules **all show line deltas** in `--stat`; merge decisions need file-by-file review.

## How to reproduce line-level diffs

**Single file (example):**

```bash
git diff --no-index \
  REFERENCE-APP00/artifacts/legal-luminaire/src/App.tsx \
  artifacts/legal-luminaire/src/App.tsx
```

**Suppress CRLF noise (Windows CMD):**

```cmd
git diff --no-index --stat PATH_A PATH_B 2>nul
```

## Porting decisions (REFERENCE → OUR, applied)

| REFERENCE-only artifact | Decision | What we did |
|-------------------------|----------|-------------|
| `components/layout.tsx` | **Not ported** | Superseded by `App.tsx` full sidebar + case-scoped routing. |
| `components/create-session-dialog.tsx` | **Ported + wired** | `artifacts/legal-luminaire/src/components/create-case-quick-dialog.tsx` — persists via `CaseContext.addCase`, optional `POST /api/v1/cases`, navigates to `/case/:id/dashboard`. Toggle: `VITE_FF_REFERENCE_QUICK_CASE_DIALOG` (default on). |
| `components/document-upload.tsx` | **Not ported as file** | Reference used a fake upload; OUR `UploadView` is the canonical surface. **UX:** drag-active border/highlight merged into `UploadView.tsx`. |
| `backend/agents/llm_factory.py` | **Not ported (this pass)** | OUR uses direct `ChatOpenAI` in agents; factory adds Gemini + `LegalDemoLLM` — valuable later as an optional **zero-key demo** path, not a drop-in. |

## Next step (after you approve the matrix)

Pick **Kept / Improved / New / Merged** per area, then apply **targeted** patches (prefer feature flags for risky UI). For line-level merges beyond the table above, use `git diff --no-index` on specific files.
