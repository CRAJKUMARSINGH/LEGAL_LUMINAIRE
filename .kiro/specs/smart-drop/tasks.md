# Smart Drop — Tasks
**Flag**: `smart_drop`
**Owner**: Trae (Week 3)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**Depends on**: `featureFlags.ts` (Week 1), existing upload flow at `/api/v1/cases/upload-document`

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.smart_drop` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm `backend/rag/document_store.py` embedder is importable (reuse for embedding_score)
- [ ] Confirm `backend/api/models.py` compiles cleanly before adding new models
- [ ] Confirm existing `POST /api/v1/cases/upload-document` endpoint is untouched

---

## T3.1 — Backend: Data models
- [ ] Add `ClassifyRequest`, `ClassifyResponse`, `ConfirmRequest`, `ConfirmResponse` to `backend/api/models.py`
  - `ClassifyRequest`: `case_id: str`, `filename: str`, `content_preview: str` (max 2000 chars)
  - `ClassifyResponse`: `type` (Literal 6 values), `type_hi: str`, `confidence: float`, `proposed_entry: dict`
  - `ConfirmRequest`: `case_id: str`, `document_id: str`, `register_entry: dict` + `ConfigDict(extra="forbid")`
  - `ConfirmResponse`: `success: bool`, `register_entry_id: str`
- [ ] Add `smart_drop_exemplars.json` to `backend/data/` with 6 document-type exemplars (keyword patterns + sample text for embedding)

## T3.2 — Backend: Classification endpoint
- [ ] Create `backend/api/routes_smart_drop.py` (flat convention, no sub-packages)
- [ ] `POST /api/v1/smart-drop/classify`
  - Check `FEATURE_SMART_DROP` env flag → 404 if OFF
  - Run keyword scan over `content_preview` → `keyword_score` (0–1)
  - Run embedding similarity against `smart_drop_exemplars.json` → `embedding_score` (0–1)
  - Combine: `confidence = 0.55 × keyword_score + 0.45 × embedding_score`
  - Return `ClassifyResponse`
- [ ] Register router in `backend/main.py` under prefix `/api/v1`

## T3.3 — Backend: Confirm endpoint
- [ ] `POST /api/v1/smart-drop/confirm` in `routes_smart_drop.py`
  - Check `FEATURE_SMART_DROP` env flag → 404 if OFF
  - Validate `ConfirmRequest` schema
  - Tag `register_entry` with `source: "smart_drop"` for audit trail
  - Write to case register via existing `case_manager` write logic (do **not** bypass it)
  - Return `ConfirmResponse`

## T3.4 — Frontend: Types and API client
- [ ] Add `SmartDropTypes` to `src/types/` (or extend `src/types/index.ts`):
  - `ClassifyRequest`, `ClassifyResponse`, `ConfirmRequest`, `ConfirmResponse`
- [ ] Add `classifyDocument()` and `confirmDrop()` functions to `src/lib/api.ts` (or equivalent API client)
  - Both functions must check `integrationFlags.smart_drop` and throw if OFF

## T3.5 — Frontend: DropZone component
- [ ] Create `src/components/smart-drop/DropZone.tsx`
  - Accept drag-and-drop and click-to-browse
  - Read first 2 KB of dropped file as `content_preview` (FileReader API, client-side only)
  - On drop: call `classifyDocument()`, emit `onClassified(response: ClassifyResponse)`
  - Loading state during classify call
  - Bilingual drop prompt: *"Drop a document to classify / दस्तावेज़ छोड़ें वर्गीकरण के लिए"*
  - `aria-label`, `role="region"`, keyboard-accessible (click or Enter/Space)

## T3.6 — Frontend: ConfidenceBadge component
- [ ] Create `src/components/smart-drop/ConfidenceBadge.tsx`
  - Props: `confidence: number`, `type: string`, `type_hi: string`
  - `≥ 0.80` → green badge
  - `0.60–0.79` → amber badge
  - `< 0.60` → red badge + bilingual warning text

## T3.7 — Frontend: ProposalCard component
- [ ] Create `src/components/smart-drop/ProposalCard.tsx`
  - Display: document type (EN + HI), confidence badge, proposed register fields (editable)
  - If `confidence < 0.60`: render `WarningBanner` (bilingual) + acknowledgement checkbox that must be checked before confirm button is enabled
  - `ConfirmButton` → calls `confirmDrop()` → on success: reset `DropZone`, show success toast
  - `CancelButton` → resets to empty `DropZone` state
  - All input fields have `aria-label` attributes

## T3.8 — Frontend: SmartDropPage
- [ ] Create `src/pages/SmartDropPage.tsx`
  - Flag gate: if `!integrationFlags.smart_drop` → render null or `<Navigate to="/" />`
  - Compose `DropZone` + `ProposalCard`
  - Page title bilingual: *"Smart Drop / स्मार्ट ड्रॉप"*
  - `<main aria-label="Smart Drop / स्मार्ट ड्रॉप">`

## T3.9 — Frontend: Route wiring
- [ ] Add to `src/routes.tsx` using existing `Wrap()` + lazy import pattern:
  ```tsx
  const SmartDropPage = lazy(() => import("@/pages/SmartDropPage"));
  // ...
  {integrationFlags.smart_drop && (
    <Route path="/smart-drop" component={() => Wrap(<SmartDropPage />, "SmartDropPage")} />
  )}
  ```
- [ ] Verify SPA redirect still works (Netlify `/* → /index.html 200`) — no `netlify.toml` change needed

## T3.10 — Testing
- [ ] Backend: unit test `classify` endpoint with a known FIR-style content_preview → assert `type === "fir"` and `confidence > 0.7`
- [ ] Backend: unit test `confirm` endpoint → assert register entry written with `source: "smart_drop"`
- [ ] Frontend: render test for `ConfidenceBadge` at three confidence levels
- [ ] Frontend: render test for `ProposalCard` — confirm button disabled when `confidence < 0.6` and checkbox unchecked

## T3.11 — Completion doc
- [ ] Write `docs/integration/WEEK03_TRAE_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Include: files changed, CI result, flag registry table row for `smart_drop`, hand-off notes for Week 4

---

## Acceptance Criteria
- [ ] `POST /classify` returns correct `type` and `confidence` for each of the 6 document categories
- [ ] `POST /confirm` writes a register entry tagged `source: "smart_drop"` via `case_manager`
- [ ] Confirm button blocked until acknowledgement checkbox checked when `confidence < 0.60`
- [ ] Warning banner shown bilingually when `confidence < 0.60`
- [ ] Route `/smart-drop` returns 404 / not rendered when `smart_drop` flag is OFF
- [ ] No change to existing `/api/v1/cases/upload-document` endpoint behaviour
- [ ] All UI elements have `aria-label` / `role` attributes
- [ ] CI green after Week 3 changes
