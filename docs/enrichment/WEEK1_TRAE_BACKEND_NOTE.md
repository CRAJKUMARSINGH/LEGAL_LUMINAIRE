# WEEK 1 — TRAE BACKEND NOTE
**Agent**: Trae
**Week**: 1 (Support Role — Foundation & Netlify Lock)
**Date**: 2026-09-06

---

## 1. CRASHES FIXED

### 1.1 routes_harvey Import Crash (CRITICAL — BLOCKER)
**File**: [main.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/main.py#L17-L43)
**Problem**: Top-level unconditional import of `api.routes_harvey` (line 32 original), which is gitignored (per root [.gitignore](file:///E:/Rajkumar/LEGAL_LUMINAIRE/.gitignore#L74-L75)) and absent from the working tree. Importing a missing module causes immediate `ModuleNotFoundError` on backend startup before any route is registered.
**Impact**: FastAPI app cannot instantiate; backend is completely non-functional.
**Fix Applied**:
- Wrapped the import in a `try/except ImportError` block with a flag `_harvey_router_available`.
- Made the `app.include_router(harvey_router, ...)` registration conditional on the flag (line 142–143).
- Non-fatal info-level log when the optional module is skipped.

### 1.2 Unstructured*DocumentLoader Top-Level Import Crash (STARTUP DEFENSE)
**Files**:
  - [document_store.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/rag/document_store.py#L12-L63)
  - [optimized_document_store.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/rag/optimized_document_store.py#L15-L81)
**Problem**: `UnstructuredWordDocumentLoader` and `UnstructuredImageLoader` (from `langchain_community.document_loaders`) require the optional `unstructured` (and `unstructured[inference]`) packages, which are not listed as strict transitive deps in [requirements.txt](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/requirements.txt). Importing them at module load time causes startup crash when those extras are missing.
**Impact**: Backend cannot finish module import of `rag.document_store` → `api.routes` fails to import → `main.py` fails.
**Fix Applied**:
- Removed `UnstructuredWordDocumentLoader` and `UnstructuredImageLoader` from the top-level import block.
- Moved them to **lazy, function-local imports** inside `_load_file()` / `_load_file_sync()`, each guarded by its own `try/except ImportError` with a warning log and graceful skip (returns empty doc list so processing can continue for supported file types).
- Matching pattern applied to both `document_store.py` and `optimized_document_store.py` for consistency.

---

## 2. GITIGNORE STATUS

**Checked against**: Root [.gitignore](file:///E:/Rajkumar/LEGAL_LUMINAIRE/.gitignore) (no backend-local `.gitignore` exists — not required).

| Path / Pattern | Status | Notes |
|---|---|---|
| `**/chroma_db/` + `chroma_db/` | ✅ PROTECTED | Covers `artifacts/legal-luminaire/backend/chroma_db/<case_id>` and any other ChromaDB vector store at any nesting level. Matches `settings.chroma_persist_dir = "./chroma_db"` in [config.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/config.py#L16). |
| `__pycache__/` | ✅ PROTECTED | Catches all `__pycache__/` directories in `backend/`, `backend/api/`, `backend/agents/`, `backend/rag/`, etc. |
| `*.py[cod]` | ✅ PROTECTED | Catches byte-code files. |
| `.cache/` | ✅ PROTECTED | Covers local cache dirs (used by Replit and local tooling; sentence-transformers/HF caches live in `~/.cache` which is outside the repo). |
| Embedding cache directories | ✅ NOT REQUIRED IN REPO | OpenAI embeddings are computed on the fly (no local cache dir). Sentence-Transformers cache to user home (`~/.cache/torch`, `~/.cache/huggingface`) which is outside repo scope. |

**Verdict**: All ChromaDB / vector-store paths and local Python runtime artifacts are correctly gitignored. No additional patterns required for Week 1.

---

## 3. HEALTH ENDPOINT STATUS

**Endpoint**: `GET /api/v1/health`
**Registered by**: [routes.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/api/routes.py#L185-L203) (router prefix `/api/v1` set in [main.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/main.py#L128)).
**Also linked at**: Root endpoint `GET /` returns `{"health": "/api/v1/health"}` as a navigational hint.

**Response model** ([models.py → HealthResponse](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/api/models.py#L55-L59)):
```
status              : str   (always "ok" when endpoint serves)
openai_configured   : bool  (settings.openai_api_key is non-empty)
tavily_configured   : bool  (settings.tavily_api_key is non-empty)
chroma_ready        : bool  (chroma_path directory createable / writable)
```

**Week 1 Documentation Improvement Added**:
- Added triple-quoted docstring to the `health()` coroutine explaining its purpose, response semantics, and mounted path. This docstring is automatically surfaced in FastAPI's auto-generated `/docs` (Swagger UI) and `/redoc` pages.

**Verdict**: Health endpoint is present, correctly typed with Pydantic response model, reachable via the API prefix, referenced from the root route, and now carries an endpoint docstring for API discoverability.

---

## 4. CITATION BLOCKING VERIFICATION (PENDING + FATAL_ERROR must NOT reach draft output)

### 4.1 Backend Enforcement (Server-Side Gate)
Verified in **two independent backend pipelines**:

#### Pipeline A — `POST /api/v1/cases/{case_id}/research` ([routes.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/api/routes.py#L45-L105))
- `_evaluate_citation_gate()` regex-scans for `\bPENDING\b` and `\bFATAL_ERROR\b` (case-insensitive).
- Sets `must_block = (PENDING > 0) or (FATAL_ERROR > 0)`.
- When `must_block` is True:
  - `crew_result["success"] = False`
  - `crew_result["draft"] = ""` (output text blanked, cannot leak)
  - `crew_result["error"]` is prepended with a human-readable block message quoting exact counts.
- Same enforcement applied in both `_run_crew_job` (sync background) and `_run_crew_job_async` (Harvey async path).

#### Pipeline B — `POST /api/legal/draft` (SSE stream) ([routes_legal_stream.py](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/backend/api/routes_legal_stream.py#L27-L113))
- Duplicate gate function `_evaluate_citation_gate()` with identical regex and block semantics runs inside `_run_crew_blocking()`.
- Same consequence: `success=False`, `draft=""`, error message appended.
- The SSE stream emits a `stage=error` event and closes early — blocked content never reaches any client chunk.

#### Offline Mock Proves the Gate
The offline mock path in `routes.py` (lines 274–317) intentionally emits a draft containing `[PENDING]` in Ground 1. The citation gate runs, then `result.success=False` and `result.draft=""`, confirming the block path is exercised end-to-end.

### 4.2 Frontend Enforcement (Client-Side Gate)
Verified in [citation-gate.ts](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/src/lib/citation-gate.ts):
- `tierToStatus()` function (lines 108–123) maps:
  ```
  PENDING     → BLOCKED
  FATAL_ERROR → BLOCKED
  SECONDARY   → WARN
  VERIFIED    → SAFE
  COURT_SAFE  → SAFE
  ```
- `scanDraftForCitations()` computes `hardBlock = any(m.status === "BLOCKED")`.
- `overallStatus` bubbles up to BLOCKED whenever any match is BLOCKED, regardless of safe citations.

### 4.3 Automated Test Coverage of the Block
[`citation-gate.test.ts`](file:///E:/Rajkumar/LEGAL_LUMINAIRE/artifacts/legal-luminaire/src/__tests__/citation-gate.test.ts) guarantees no regression:
- **Suite 4** (BLOCKED_DRAFT): PENDING-tier Mohanbhai + R.B. Constructions → `overallStatus = BLOCKED`, `hardBlock = true`, summary contains "BLOCKED" and "finalization prevented".
- **Suite 5** (MIXED_DRAFT): Even when SAFE precedents exist alongside a single PENDING entry → status still BLOCKED, hardBlock still true.
- **Suite 9, Rule 6 compliance**: Explicitly asserts every PENDING-tier match has status BLOCKED, COURT_SAFE never blocked, SECONDARY always WARN never BLOCKED.

### 4.4 Defense-in-Depth Summary
| Layer | Location | Blocks PENDING/FATAL_ERROR |
|---|---|---|
| 1 — Server (crew job) | `api/routes.py::_run_crew_job`, `_run_crew_job_async` | ✅ Blanks draft, sets `success=False` |
| 2 — Server (SSE stream) | `api/routes_legal_stream.py::_run_crew_blocking` | ✅ Blanks draft, emits error SSE event |
| 3 — Client (draft scan) | `src/lib/citation-gate.ts::scanDraftForCitations` | ✅ `hardBlock=true` disables finalize |
| 4 — Client (tests) | `src/__tests__/citation-gate.test.ts` Suites 4/5/9 | ✅ Test-enforced contract |

**Verdict**: PENDING and FATAL_ERROR citations cannot escape into draft output at any layer. The server-side gate prevents even API-level leakage; the client gate reinforces UX safety; and the automated test suite locks the behavior against regressions.

---

## 5. ADDITIONAL WEEK-1 SANITY CHECKS PERFORMED

- **Pydantic / BaseModel imports**: All `api/models.py`, `api/routes*.py`, `api/case_manager.py`, and `config.py` correctly import `BaseModel` from `pydantic` (v2) or `pydantic_settings` (Settings). No missing or stale Pydantic v1 patterns found.
- **Import order in `main.py`**: stdlib → 3rd-party → local package (config first, then routers); circular import risk is low. Routes are imported after `config` instantiates `settings` so all defaults are bound.
- **Route registration in `main.py`**: All 13 routers are wired (standard, omni, cases, drafting, search, oral, lab, collision, auto_research, verify, legal_stream, similarity, analytics, graph + conditional harvey).
- **Bilingual noisy OCR support**: `routes_omni.py::_extract_image_text` uses `pytesseract` with `lang='hin+guj+eng'` (Hindi + Gujarati + English); `document_store.py` splitter includes Hindi sentence terminator `"।"` as a primary separator — bilingual input is handled.

---

## 6. WEEK 1 ACCEPTANCE CHECKLIST

- [x] **Backend starts cleanly** — top-level ImportError crashers (routes_harvey, Unstructured* loaders) are now either conditional or lazy-loaded.
- [x] **Citation blocking still works** — Server-side gates + frontend gate + test suite all confirm PENDING/FATAL_ERROR cannot leak.
- [x] **Support note committed** → this file: `docs/enrichment/WEEK1_TRAE_BACKEND_NOTE.md`.

End of Week 1 Trae Backend Note.
