# Standards Explorer — Requirements
**Flag**: `standards_explorer` (default OFF)
**Week**: 11 (Trae primary)
**Source**: Local Law Explorer showcase — standards browse, plain-language, honest framing

## Scope
A searchable browser of IS (Bureau of Indian Standards), ASTM, and NABL standards referenced in legal cases. Each standard entry shows: code, title, plain-language summary (English + Hindi), typical legal context, and an honest disclaimer that the tool summarises the standard — it does not replace reading the full text.

## Data Model
- `Standard`: `{ id, code, title, titleHi, body: "IS"|"ASTM"|"NABL", summary, summaryHi, legalContext, legalContextHi, sourceUrl?: string, lastVerified: string }`
- `StandardsSearchResult`: `{ standard: Standard, relevanceScore: number, matchedTerms: string[] }`

## API Contract
- `GET /api/v1/standards?q=<query>&body=<IS|ASTM|NABL>` — paginated search
- `GET /api/v1/standards/:id` — single standard detail

## Accuracy Guardrails
- Standards summaries are human-reviewed, not AI-generated freehand.
- Every entry includes a disclaimer: "This is a summary only. Refer to the full standard text for authoritative content. / यह केवल सारांश है। प्रामाणिक सामग्री के लिए पूर्ण मानक पाठ देखें।"
- `sourceUrl` must point to the official body's page, not a third-party mirror.
- No standard is marked "applicable" or "not applicable" without the user confirming.

## Bilingual Requirement
All standard titles, summaries, legal context, and disclaimers bilingual.

## Flag
`standards_explorer` — OFF by default. Enable via `VITE_FF_STANDARDS_EXPLORER=true`.

## Rollback
Disable flag. Standards data is read-only — nothing is deleted.

## Acceptance Criteria
- [ ] Search returns ranked results for IS/ASTM/NABL codes and keywords
- [ ] Every entry shows plain-language summary in both languages
- [ ] Disclaimer visible on every standards detail page
- [ ] No standard marked applicable/inapplicable without user action
