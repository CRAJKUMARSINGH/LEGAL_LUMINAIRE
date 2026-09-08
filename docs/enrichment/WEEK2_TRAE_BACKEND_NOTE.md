# WEEK 2 TRAE BACKEND NOTE
**Agent**: Trae (ByteDance Trae)  
**Theme**: Multi-Case Data Layer (Devin Primary)  
**Scope**: Backend API contract compatibility + case-scoped observability  

---

## 1. Case-ID Parameter Coverage (Backward Compatible)

All case-related endpoints now accept a `case_id` parameter via **URL path** (new convention) while preserving legacy body-based calls. Existing frontends are unaffected.

### New Path-Param Endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/cases/{case_id}/generate-draft` | Replaces legacy `/generate-draft` body-param style |
| POST | `/api/v1/cases/{case_id}/detect-collisions` | Replaces legacy `/detect-collisions` body-param style |
| POST | `/api/v1/cases/{case_id}/verify-citations` | New path-param variant for scoped verification |
| POST | `/api/v1/cases/{case_id}/chat` | New path-param variant for scoped chat |
| POST | `/api/v1/cases/{case_id}/switch` | **New:** Explicit case-switch endpoint that emits `case_switched` event |

### Request-Body Fields Extended (Backward Compatible)

- `AutoResearchRequest.case_id` — optional, default `None`
- `VerifyRequest.case_id` — optional, default `None`
- `GET /verify-citation` query param `case_id` — optional

### Endpoints Already Path-Scoped (Verified Unchanged)

- `POST /api/v1/cases/{case_id}/upload` — documents correctly saved to `uploaded_cases/{case_id}/`, chunks tagged with `case_id` metadata
- `GET /api/v1/cases/{case_id}/status`
- `POST /api/v1/cases/{case_id}/research`
- `GET /api/v1/cases/{case_id}/research/{job_id}`
- CRUD routes: `GET /api/v1/cases/{case_id}`, `PUT`, `DELETE`, `/stats`

---

## 2. Document Upload & Indexing — Case Context Isolation Verified

The `rag/document_store.py` pipeline correctly isolates case data:

1. **Filesystem**: Uploads saved to `settings.case_docs_path / case_id` → per-case directory isolation
2. **ChromaDB Collections**: `get_or_create_vectorstore(case_id)` creates a separate collection named `case_{case_id}` with persist dir `chroma_db/{case_id}/`
3. **Chunk Metadata**: Every chunk carries `case_id`, `source_file`, and `file_hash` tags, preventing cross-case leakage in RAG retrieval
4. **Retriever Scoping**: `get_retriever(case_id, k)` returns a collection-bound retriever

**Switch-case impact**: When the active case changes, the next RAG retrieval automatically queries the correct per-case ChromaDB collection. No in-memory state leaks because collection selection is derived from the request's `case_id` on every call.

---

## 3. Structured Logging for Case-Switch & Pipeline Events

All case-scoped pipeline events emit structured `logger.info(..., extra={event, case_id, ...})` records under the log tag `case_event`. These are ready for downstream ingestion into Week 5 observability dashboards.

### Emitted Event Taxonomy

#### Case Lifecycle Events
| Event | Trigger | Fields |
|-------|---------|--------|
| `cases_listed` | GET /api/v1/cases | cases_count |
| `case_switched` | GET /api/v1/cases/{id} OR POST /switch | case_id, case_title, previous_case_id |
| `case_accessed` | Repeat get_case for already-active id | case_id |
| `case_created` | POST /api/v1/cases | case_id, case_title |
| `case_updated` | PUT /api/v1/cases/{id} | case_id, case_title |
| `case_deleted` | DELETE /api/v1/cases/{id} | case_id |
| `case_switch_failed` | POST /switch on non-existent id | case_id, reason |
| `case_save_failed` / `case_delete_failed` | Write failures | case_id |

#### Document Pipeline Events
| Event | Trigger | Fields |
|-------|---------|--------|
| `doc_upload_start` | POST /cases/{id}/upload entry | case_id, files_count |
| `doc_upload_no_valid_files` | Empty valid-set save | case_id, errors_count |
| `doc_upload_complete` | Post-ingest summary | case_id, indexed_count, skipped_count, total_chunks, errors_count |

#### Research / Draft Pipeline Events
| Event | Trigger | Fields |
|-------|---------|--------|
| `research_start` | POST /cases/{id}/research entry | case_id, mode, offline_mock, use_harvey, query_length |
| `research_mock_complete` | Offline mock path done | case_id, job_id, mode, blocked_by_gate |
| `research_rag_retrieved` | Local ChromaDB retrieval | case_id, rag_docs_count |
| `research_rag_failed` | RAG retrieval exception | case_id, error |
| `research_no_documents` | case_has_documents=false | case_id |
| `research_queued` | Background job dispatched | case_id, job_id, mode, use_harvey |
| `draft_start` / `draft_complete` / `draft_failed` | Draft generation lifecycle | case_id, draft_type, draft_length, error |
| `collision_detect_start` / `_complete` / `_failed` | Contradiction detection | case_id, collisions_count, error |
| `citation_verify_start` / `_complete` | POST verify-citations | case_id, citations_count, verified_count, total_count, all_verified |
| `single_citation_verify_start` / `_complete` / `_failed` | GET verify-citation | case_id, case_name, found, error |
| `chat_start` / `_complete` / `_failed` | Chat interactions | case_id, history_length, message_length, reply_length, sources_count |
| `auto_research_start` / `auto_research_complete` | Auto-research endpoint | case_id, incident_type, statutes_count, matches_found |

### How to Filter in Production

```bash
# Week 5-ready grep for case lifecycle
tail -f backend.log | grep case_event | grep case_switched
# Per-case audit
tail -f backend.log | grep '"case_id": "TC-01"'
```

---

## 4. Acceptance Re-Verification

- [x] Legacy body-param routes (`/generate-draft`, `/detect-collisions`, `/chat`, `/verify-citations`) still work and route through shared impls
- [x] New path-param routes do not conflict with existing routers; all mounted at `/api/v1` prefix in `main.py`
- [x] Uploaded documents for `TC-01` never appear in `TC-22` RAG retrieval (separate collections + `case_id` metadata)
- [x] Citation gate (`_evaluate_citation_gate`) is unchanged; PENDING/FATAL_ERROR block still enforced in crew job handlers
- [x] `chroma_db/` and `uploaded_cases/` remain gitignored (verified via project-level `.gitignore`)

---

## 5. Hand-Off Notes for Devin / Kiro (Frontend)

1. **Prefer path-param routes**: Migrate frontend calls to `/api/v1/cases/{case_id}/X` patterns for explicit REST scoping. The old routes remain indefinitely.
2. **Explicit case-switch**: Use `POST /api/v1/cases/{case_id}/switch` to log a dedicated switch event (instead of relying on the first GET as implicit switch).
3. **Structured log fields**: All `case_event` logs use `extra=...` kwargs. If the frontend later requests a case-activity feed, the backend can expose these events via a simple in-memory or SQLite-backed endpoint.
4. **Auto-research + verification**: `case_id` is now accepted (optional) in request bodies; pass it to correlate logs with the active case.

---
*End of Week 2 Trae Backend Note — no Week 3 scope touched.*
