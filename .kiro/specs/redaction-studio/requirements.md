# Redaction Studio — Requirements
**Flag**: `redaction_studio` (default OFF)
**Week**: 2 (Devin primary)
**Source**: Document Redactor showcase (vibecode.law)

## Scope
Client-side PII redaction and document recompilation. The user uploads or pastes a document; the browser detects and masks PII (names, case numbers, addresses, amounts); the user reviews and confirms; a redacted PDF/DOCX is produced — all in-browser. Nothing is sent to an AI.

## Data Model
- `RedactionTarget`: `{ id, text, type: "name"|"case_number"|"address"|"amount"|"date", start, end, confirmed: boolean }`
- `RedactionDocument`: `{ id, originalText, targets: RedactionTarget[], redactedText, status: "pending"|"reviewed"|"exported" }`

## API Contract
No backend API. Fully client-side via Web Workers.

## Accuracy Guardrails
- Redaction happens in-browser — no document content leaves the device unless the user explicitly exports.
- Over-redaction is preferred to under-redaction (false positives acceptable; false negatives are not).
- The user must manually confirm each redaction before export.

## Bilingual Requirement
All UI strings bilingual: English + Hindi. Redaction labels in both languages.

## Flag
`redaction_studio` — OFF by default. Enable via `VITE_FF_REDACTION_STUDIO=true`.

## Rollback
Delete the route and component; disable flag. Zero backend impact.

## Acceptance Criteria
- [ ] PII detection runs entirely in-browser (no network call)
- [ ] User can approve/reject each redaction item
- [ ] Exported document has confirmed redactions replaced with `[REDACTED]`
- [ ] All UI strings bilingual
- [ ] Flag OFF removes the route entirely
