# Redaction Studio — Design
**Flag**: `redaction_studio`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Devin (Week 2)
**Source**: Document Redactor showcase (vibecode.law/showcase/document-redactor-and-recompiler-357726)
**ADR**: ADR-002 — Local-First Redaction Before AI

---

## Architecture

```
Browser only — zero backend calls during redaction
────────────────────────────────────────────────────────────────────────
RedactionStudioPage (/redaction-studio)   [flag-gated: redaction_studio]
  │
  ├── FileDropZone
  │     ├── drag-and-drop + click-to-browse
  │     ├── accepts: .txt, .pdf, .docx (text extraction client-side)
  │     └── on file selected → dispatch to Web Worker
  │
  ├── PiiDetectorWorker  (src/workers/piiDetector.worker.ts)
  │     ├── receives: { text: string, documentId: string }
  │     ├── runs: regex + rule-based NLP pattern bank
  │     ├── returns: RedactionTarget[]
  │     └── no network call — pure in-browser computation
  │
  ├── RedactionReviewPanel
  │     ├── RedactionChip × N  (one per detected PII span)
  │     │     ├── shows: type label (EN + HI), matched text (partially masked)
  │     │     ├── confirm button  → confirmed: true
  │     │     └── reject button   → confirmed: false (span kept as-is)
  │     ├── progress indicator: "X of Y reviewed"
  │     └── "Confirm All" shortcut (requires at least 1 confirmed)
  │
  └── ExportControls
        ├── ExportButton (PDF)  → exportDocument("pdf",  redactedText)
        ├── ExportButton (DOCX) → exportDocument("docx", redactedText)
        └── only enabled when all targets reviewed (none in pending state)

────────────────────────────────────────────────────────────────────────
No document text leaves the browser during the redaction workflow.
Only the exported redacted document is shared — by user's explicit action.
```

---

## Data Flow

1. User drops or selects a file onto `FileDropZone`.
2. `FileDropZone` reads the file as text using the `FileReader` API (or `pdfjs-dist` for PDF, `mammoth` for DOCX).
3. Extracted plain-text is posted to `piiDetector.worker.ts` — no server call.
4. Worker returns `RedactionTarget[]` (detected PII spans with `start`, `end`, `type`).
5. `RedactionReviewPanel` renders one `RedactionChip` per target. User approves or rejects each.
6. `ExportControls` becomes active once all chips are reviewed.
7. On export: confirmed spans replaced with `█` (PDF) or `[REDACTED]` (DOCX) and file downloaded locally.

---

## PII Pattern Bank (`piiDetector.worker.ts`)

| Pattern type | Examples detected | Regex / rule |
|---|---|---|
| `name` | Full names (Indian naming patterns) | Capitalised 2–4 word sequences near legal keywords |
| `case_number` | FIR No. 123/2023, WP/1234/2024 | `(FIR|WP|CrPC|Crl\.?\s?App\.?|CC|SC)\s*[Nn]o\.?\s*[\d/\-]+` |
| `aadhaar` | 1234 5678 9012 | `\b\d{4}\s?\d{4}\s?\d{4}\b` |
| `pan` | ABCDE1234F | `\b[A-Z]{5}\d{4}[A-Z]\b` |
| `phone` | +91 98765 43210 | `(\+91[\s\-]?)?\b[6-9]\d{9}\b` |
| `address` | Street/plot/pin combinations | Postcode patterns + landmark keywords |
| `amount` | ₹1,23,456 / Rs. 50,000 | `(₹|Rs\.?)\s*[\d,]+` |
| `date` | 15/03/2023, 15-03-2023, 15 March 2023 | Multiple date format regexes |

**False-positive policy**: Over-redaction preferred to under-redaction. The user can reject any false positive during review. All proposed spans are presented — none are silently applied.

---

## Export Implementation (`src/lib/redaction/exportDocument.ts`)

```typescript
type ExportFormat = "pdf" | "docx";

export async function exportDocument(
  format: ExportFormat,
  originalText: string,
  targets: RedactionTarget[]
): Promise<Blob>

// PDF: uses jsPDF (client-side) — confirmed spans replaced with filled black rectangle █
// DOCX: uses docx (client-side) — confirmed spans replaced with literal "[REDACTED]"
// Neither library requires a network call.
```

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/RedactionStudioPage.tsx` | NEW — top-level page, flag-gated on `redaction_studio` |
| `src/components/redaction/FileDropZone.tsx` | NEW — drag-and-drop + file reading |
| `src/components/redaction/RedactionReviewPanel.tsx` | NEW — chip-by-chip review UI |
| `src/components/redaction/RedactionChip.tsx` | NEW — individual PII span chip |
| `src/components/redaction/ExportControls.tsx` | NEW — PDF/DOCX export buttons |
| `src/workers/piiDetector.worker.ts` | NEW — Web Worker, regex + rule-based PII detection |
| `src/lib/redaction/exportDocument.ts` | NEW — jsPDF + docx export helpers |
| `src/types/redaction.ts` | NEW — `RedactionTarget`, `RedactionDocument` types |
| `src/routes.tsx` | EXTEND — add `/redaction-studio` route (flag-gated) |
| `.kiro/specs/redaction-studio/` | UPDATED (these files) |
| `docs/integration/WEEK02_DEVIN_COMPLETION.md` | NEW |

---

## Pydantic / Type Definitions

```typescript
// src/types/redaction.ts

export type PiiType =
  | "name"
  | "case_number"
  | "aadhaar"
  | "pan"
  | "phone"
  | "address"
  | "amount"
  | "date";

export const PII_LABELS: Record<PiiType, { en: string; hi: string }> = {
  name:        { en: "Name",         hi: "नाम" },
  case_number: { en: "Case Number",  hi: "केस नंबर" },
  aadhaar:     { en: "Aadhaar",      hi: "आधार" },
  pan:         { en: "PAN",          hi: "पैन" },
  phone:       { en: "Phone",        hi: "फोन नंबर" },
  address:     { en: "Address",      hi: "पता" },
  amount:      { en: "Amount",       hi: "राशि" },
  date:        { en: "Date",         hi: "तिथि" },
};

export interface RedactionTarget {
  id: string;            // uuid
  text: string;          // matched original text
  type: PiiType;
  start: number;         // char offset in originalText
  end: number;           // char offset in originalText
  confirmed: boolean | null;  // null = not yet reviewed
}

export interface RedactionDocument {
  id: string;
  filename: string;
  originalText: string;
  targets: RedactionTarget[];
  redactedText: string;     // re-derived on every confirm/reject toggle
  status: "classifying" | "reviewing" | "ready_to_export" | "exported";
}
```

---

## Bilingual UI Strings

| UI element | English | Hindi |
|---|---|---|
| Drop zone prompt | "Drop a document to start redaction" | "संशोधन शुरू करने के लिए दस्तावेज़ छोड़ें" |
| Review heading | "Review detected PII" | "पहचाने गए PII की समीक्षा करें" |
| Confirm chip | "Confirm" | "पुष्टि करें" |
| Reject chip | "Keep" | "रखें" |
| Export PDF | "Export redacted PDF" | "संशोधित PDF निर्यात करें" |
| Export DOCX | "Export redacted DOCX" | "संशोधित DOCX निर्यात करें" |
| Confirm all | "Confirm all remaining" | "सभी शेष की पुष्टि करें" |
| Processing | "Detecting PII…" | "PII का पता लगाया जा रहा है…" |

---

## Route

```tsx
// src/routes.tsx — add inside the <Switch> block using existing Wrap() pattern:
const RedactionStudioPage = lazy(() => import("@/pages/RedactionStudioPage"));
...
{integrationFlags.redaction_studio && (
  <Route path="/redaction-studio" component={() => Wrap(<RedactionStudioPage />, "RedactionStudioPage")} />
)}
```

The route is only registered when `integrationFlags.redaction_studio` is `true`.
Under Netlify SPA redirects (`/* → /index.html 200`), no `netlify.toml` change is needed.

---

## Vite Worker Config

Vite supports `?worker` suffix for Web Workers out of the box. No additional config needed:
```typescript
import PiiDetectorWorker from "@/workers/piiDetector.worker.ts?worker";
const worker = new PiiDetectorWorker();
```
This produces a hashed chunk in `dist/assets/` at build time — no Netlify config impact.

---

## Accuracy Guardrails

- **No AI in the redaction path** (ADR-002): `piiDetector.worker.ts` uses only regex and rule-based patterns. No LLM call is made at any point during detection or export.
- **Every proposed span is shown to the user** — none are silently applied. `confirmed: null` means "not yet reviewed"; export is blocked until all spans have a decision.
- **Over-redaction preferred**: ambiguous matches are included as proposals. The user rejects false positives.
- **Full document text never leaves the browser** during the redaction workflow. Only the final exported file — which the user explicitly downloads — leaves the device.
- Redaction Studio has no backend dependency. It works with `FEATURE_REDACTION_STUDIO` env unset.

---

## Rollback

Set `redaction_studio` flag to OFF.
- `/redaction-studio` route disappears from the router (route is conditionally registered).
- Worker chunk is still built but never instantiated.
- Zero impact on any other route, backend endpoint, or case data.

---

## Hand-off to Week 2 (Devin)

1. Read `.kiro/specs/redaction-studio/requirements.md` and this design before writing any code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — gate the route behind `integrationFlags.redaction_studio`.
3. ADR-002 is the binding rule: **redaction in-browser first, AI second**. The Web Worker is non-negotiable.
4. Use `jsPDF` for PDF export and `docx` for DOCX export — both are client-side libraries. Check `package.json` before adding; if absent, add with pinned versions.
5. All PII type labels must use `PII_LABELS` map — bilingual from day one.
6. Completion doc: `docs/integration/WEEK02_DEVIN_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template.
