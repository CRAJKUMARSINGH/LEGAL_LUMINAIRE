# Smart Drop — Requirements
**Flag**: `smart_drop` (default OFF)
**Week**: 3 (Trae primary)
**Source**: Vaadhan showcase — document drop classification + register proposal

## Scope
A drag-and-drop zone that classifies an uploaded document (FIR, charge sheet, bail order, evidence list, forensic report…) and proposes a case-register entry. The user confirms or edits the proposal; on confirmation the document is added to the case register.

## Data Model
- `DroppedDocument`: `{ id, filename, mimeType, sizeBytes, classifiedType, confidence, proposedRegisterEntry, status: "classifying"|"proposed"|"confirmed"|"rejected" }`
- `RegisterEntry`: `{ documentId, type, title, dateAdded, addedBy, caseId }`

## API Contract
- `POST /api/v1/smart-drop/classify` — body: `{ case_id, filename, content_preview }`; response: `{ type, confidence, proposed_entry }`
- `POST /api/v1/smart-drop/confirm` — body: `{ case_id, document_id, register_entry }`; response: `{ success, register_entry_id }`

## Accuracy Guardrails
- Classification confidence must be displayed to the user.
- Proposals with confidence < 0.6 must show a warning and require explicit user confirmation.
- The system never auto-confirms a register entry.

## Bilingual Requirement
All UI strings and classification labels bilingual: English + Hindi.

## Flag
`smart_drop` — OFF by default. Enable via `VITE_FF_SMART_DROP=true`.

## Rollback
Disable flag; the route and API endpoint disappear. Existing register entries are unaffected.

## Acceptance Criteria
- [ ] Documents classified within 2s of drop
- [ ] Confidence score displayed on every proposal
- [ ] Low-confidence proposals display bilingual warning
- [ ] User must confirm before register entry is created
- [ ] Flag OFF removes route and API endpoint
