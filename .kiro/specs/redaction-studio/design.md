# Redaction Studio — Design
**Flag**: `redaction_studio`

## Architecture
```
Browser only — no backend calls
  ┌─────────────────────────────────────┐
  │  RedactionStudioPage                │
  │    ├── FileDropZone (upload/paste)  │
  │    ├── RedactionReviewPanel         │
  │    │     └── RedactionChip × N      │
  │    └── ExportButton (PDF/DOCX)      │
  └─────────────────────────────────────┘
         │ Web Worker
         └── piiDetector.worker.ts
               └── regex + NLP patterns
```

## Key Components
- `src/pages/RedactionStudioPage.tsx` — gated by `redaction_studio` flag
- `src/components/redaction/RedactionReviewPanel.tsx`
- `src/workers/piiDetector.worker.ts`
- `src/lib/redaction/exportDocument.ts`

## PII Pattern Coverage
Names, case/FIR numbers, phone numbers, Aadhaar, PAN, addresses, monetary amounts, dates.

## Export
Uses `jsPDF` or `docx` library (client-side). Redacted spans replaced with `█` in PDF, `[REDACTED]` in DOCX.

## Route
`/redaction-studio` — added to `routes.tsx` only when flag is ON.
