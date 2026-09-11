# Redaction Studio — Tasks
**Flag**: `redaction_studio`
**Owner**: Devin (Week 2)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**ADR**: ADR-002 — Local-First Redaction Before AI
**Depends on**: `featureFlags.ts` (Week 1), `jsPDF` (client-side), `docx` (client-side), Vite `?worker` support

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.redaction_studio` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm Vite config supports `?worker` suffix (default Vite behaviour — no additional config needed)
- [ ] Check `package.json` for `jspdf` and `docx` — add with pinned versions if absent
- [ ] Confirm `lucide-react` exports `Upload`, `Check`, `X`, `Download` icons (already in tree)
- [ ] Confirm `src/routes.tsx` uses `Wrap()` + lazy import pattern (it does — match existing convention)

---

## T2.1 — Types
- [ ] Create `src/types/redaction.ts`:
  - Export `PiiType` union (8 values: name, case_number, aadhaar, pan, phone, address, amount, date)
  - Export `PII_LABELS: Record<PiiType, { en: string; hi: string }>` — bilingual display labels
  - Export `RedactionTarget` interface: `{ id, text, type, start, end, confirmed: boolean | null }`
  - Export `RedactionDocument` interface: `{ id, filename, originalText, targets, redactedText, status }`
  - `status` union: `"classifying" | "reviewing" | "ready_to_export" | "exported"`
- [ ] Add `RedactionTarget`, `RedactionDocument` to `src/types/index.ts` barrel if one exists

## T2.2 — Web Worker: PII detector
- [ ] Create `src/workers/piiDetector.worker.ts`
  - Input message: `{ text: string; documentId: string }`
  - Output message: `{ documentId: string; targets: RedactionTarget[] }`
  - Implement regex patterns for all 8 PII types (see design.md pattern table)
  - **No network call** — pure in-browser computation only
  - Deduplicate overlapping spans (prefer longer match)
  - Each detected span gets a `uuid` id, `confirmed: null` (pending review)
  - Use `self.onmessage` / `self.postMessage` — no `importScripts` from external URLs
  - Comment each regex with: `// PiiType: <type> — pattern source: <rule description>`

## T2.3 — Export helper
- [ ] Create `src/lib/redaction/exportDocument.ts`
  - Export `async function exportDocument(format: "pdf" | "docx", originalText: string, targets: RedactionTarget[]): Promise<Blob>`
  - Build redacted string: replace each `confirmed: true` span with `█` (PDF) or `[REDACTED]` (DOCX)
  - PDF: use `jsPDF` — `new jsPDF()`, `.text(redactedText, ...)`, `.output("blob")`
  - DOCX: use `docx` library — wrap redacted text in a `Document` → `Packer.toBlob()`
  - `confirmed: false` spans are kept as original text
  - `confirmed: null` spans MUST NOT reach this function — caller must validate all reviewed

## T2.4 — FileDropZone component
- [ ] Create `src/components/redaction/FileDropZone.tsx`
  - Accept drag-and-drop and click-to-browse
  - Accepted types: `.txt` (FileReader as text), `.pdf` (pdfjs-dist text extraction), `.docx` (mammoth text extraction)
  - If `pdfjs-dist` or `mammoth` not in tree, fallback to `.txt` only for MVP — document in completion report
  - On file selected: extract text, post to Web Worker, emit `onTargetsDetected(doc: RedactionDocument)`
  - Loading state during worker processing: show bilingual "Detecting PII… / PII का पता लगाया जा रहा है…"
  - `role="region"`, `aria-label="Document drop zone / दस्तावेज़ ड्रॉप ज़ोन"`, keyboard-accessible

## T2.5 — RedactionChip component
- [ ] Create `src/components/redaction/RedactionChip.tsx`
  - Props: `target: RedactionTarget`, `onConfirm: (id: string) => void`, `onReject: (id: string) => void`
  - Shows: PII type label (EN + HI from `PII_LABELS`), partially masked matched text (first 3 + last 2 chars visible, middle masked)
  - Confirm button → `onConfirm(target.id)` — green highlight
  - Reject/Keep button → `onReject(target.id)` — neutral highlight, text preserved
  - Pending state (confirmed: null): amber outline
  - `aria-label`: `"Redaction chip: {type} — {partialText} / संशोधन चिप"`

## T2.6 — RedactionReviewPanel component
- [ ] Create `src/components/redaction/RedactionReviewPanel.tsx`
  - Props: `document: RedactionDocument`, `onUpdate: (updated: RedactionDocument) => void`
  - Renders one `RedactionChip` per target
  - Shows progress: "X of Y reviewed / Y में से X समीक्षित"
  - "Confirm All Remaining" button: sets all `confirmed: null` chips to `confirmed: true`
  - Bilingual section heading: "Review detected PII / पहचाने गए PII की समीक्षा करें"
  - Updates `redactedText` on every confirm/reject via a pure re-derive function

## T2.7 — ExportControls component
- [ ] Create `src/components/redaction/ExportControls.tsx`
  - Props: `document: RedactionDocument`
  - Only enabled when `document.status === "ready_to_export"` (all targets reviewed)
  - "Export redacted PDF / संशोधित PDF निर्यात करें" → calls `exportDocument("pdf", ...)` → `URL.createObjectURL(blob)` → trigger download
  - "Export redacted DOCX / संशोधित DOCX निर्यात करें" → same pattern for DOCX
  - Disabled state: bilingual tooltip "Review all items before exporting / निर्यात से पहले सभी आइटम की समीक्षा करें"
  - Loading spinner while export in progress

## T2.8 — RedactionStudioPage
- [ ] Create `src/pages/RedactionStudioPage.tsx`
  - Flag gate: if `!integrationFlags.redaction_studio` → render `<Navigate to="/" />`
  - Compose: `FileDropZone` → `RedactionReviewPanel` (once targets detected) → `ExportControls`
  - Page title bilingual: "Redaction Studio / संशोधन स्टूडियो"
  - `<main aria-label="Redaction Studio / संशोधन स्टूडियो">`
  - State machine: `idle → classifying → reviewing → ready_to_export → exported`
  - "Start over" button resets to `idle` state

## T2.9 — Route wiring
- [ ] Add to `src/routes.tsx` using existing `Wrap()` + lazy import pattern:
  ```tsx
  const RedactionStudioPage = lazy(() => import("@/pages/RedactionStudioPage"));
  // inside <Switch>:
  {integrationFlags.redaction_studio && (
    <Route path="/redaction-studio" component={() => Wrap(<RedactionStudioPage />, "RedactionStudioPage")} />
  )}
  ```
- [ ] Verify no change needed to `netlify.toml` — SPA `/* → /index.html 200` already handles this route

## T2.10 — Testing
- [ ] Worker unit test: pass known FIR document text → assert at least one `case_number` target detected
- [ ] Worker unit test: pass text with Aadhaar number → assert `aadhaar` target with correct `start`/`end`
- [ ] Worker unit test: pass clean text (no PII) → assert empty `targets` array
- [ ] `exportDocument` unit test: `confirmed: true` spans appear as `[REDACTED]` in DOCX output
- [ ] `exportDocument` unit test: `confirmed: false` spans remain as original text
- [ ] Render test: `RedactionChip` with `confirmed: null` → assert both Confirm and Reject buttons visible
- [ ] Render test: `ExportControls` with all targets `confirmed: null` → assert buttons disabled
- [ ] Render test: `RedactionStudioPage` with flag OFF → assert redirect, no page content

## T2.11 — Completion doc
- [ ] Write `docs/integration/WEEK02_DEVIN_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Sections: files changed, CI result, PII pattern coverage summary, export library choices, hand-off notes for Trae (W3 Smart Drop)
  - Note whether `pdfjs-dist` / `mammoth` were added (or MVP is .txt only)

---

## Acceptance Criteria
- [ ] PII detection runs entirely in-browser via Web Worker — confirmed by network tab (no requests during detection)
- [ ] All 8 PII types detected for a synthetic test document
- [ ] User can approve or reject each detection individually
- [ ] "Confirm All" shortcut works; export blocked until all targets reviewed
- [ ] Exported PDF has confirmed spans replaced with `█`; DOCX has `[REDACTED]`
- [ ] All UI strings rendered bilingually (EN + HI)
- [ ] Route `/redaction-studio` not registered when `redaction_studio` flag is OFF
- [ ] No network call made during the redaction workflow (ADR-002 compliance)
- [ ] All interactive elements have `aria-label` or `role` attributes
- [ ] CI green after Week 2 changes
