---
inclusion: always
---

# LEGAL LUMINAIRE — ACCURACY RULES (PERMANENT — NEVER OVERRIDE)

These rules apply to EVERY future update, modernisation, refactor, or feature addition.
Any code that violates these rules MUST be rejected and rewritten.

## 1. CITATION ACCURACY (MANDATORY)

- Every legal precedent MUST carry: full case name + citation + court + date + verified URL + para number.
- Holdings MUST be quoted VERBATIM from the source. Paraphrasing is FORBIDDEN.
- If a citation cannot be verified on Manupatra / SCC Online / Indian Kanoon → mark PENDING, set `blockedFromDraft: true`.
- Citation format: `Case Name (Year) Volume Reporter Page, Para N`
- PENDING citations MUST NOT appear in any generated court document.

## 2. FACT-FIT GATE (MANDATORY FOR EVERY PRECEDENT)

Score every precedent on 3 axes before use:
- [A] Incident type match: 0-40 pts
- [B] Evidence type match: 0-35 pts
- [C] Procedural defect match: 0-25 pts

Rules:
- Total ≥ 70 → "exact" — primary authority
- Total 50-69 → "analogous" — use with qualification
- Total 30-49 → "weak" — supporting only, never primary
- Total < 30 → "rejected" — DO NOT USE. FATAL ERROR if cited as primary.

## 3. IS/ASTM STANDARDS (MANDATORY)

- Every IS/ASTM/BS standard cited MUST have: code + title + scope + clause number + source URL.
- Clause text MUST be from official source (bis.gov.in, archive.org, astm.org).
- IS 1199:2018 applies to FRESH CONCRETE ONLY — never to hardened masonry mortar.
- IS 2250:1981 is the CORRECT standard for masonry mortar.
- ASTM C1324 is the CORRECT standard for hardened masonry mortar forensics.
- If exact clause text is not obtained → mark as SECONDARY, warn before filing.

## 4. DATABASE SEARCH ORDER (MANDATORY)

Search in this exact priority order:
1. Manupatra (primary — Indian SC/HC)
2. SCC Online (primary — SC reporter)
3. Indian Kanoon (full-text)
4. Lexis Nexis India (annotated)
5. BAILII / Westlaw (international)
6. BIS Portal (IS standards)
7. ASTM International (ASTM standards)
8. CPWD Manual 2023 (construction norms)

## 5. VERIFICATION TIERS (MANDATORY)

Every citation must carry one of:
- `COURT_SAFE` — certified copy + para number confirmed
- `VERIFIED` — existence confirmed on official source
- `SECONDARY` — credible secondary source, needs primary verification
- `PENDING` — unverified — BLOCKED from all draft output
- `FATAL_ERROR` — factually mismatched or fabricated — BLOCKED

## 6. DRAFT OUTPUT RULES

- Drafts MUST only use COURT_SAFE or VERIFIED citations.
- SECONDARY citations may appear with explicit qualification note.
- PENDING/FATAL_ERROR citations MUST be blocked from all output.
- Every draft MUST include a Verification Report showing tier of each citation.
- Pre-filing checklist MUST be generated with every draft.

## 7. CODE QUALITY RULES

- No hardcoded citation text that hasn't been verified.
- No paraphrased holdings — always use verbatim quotes.
- No IS clause numbers without official source confirmation.
- All new precedents added to `case01-data.ts` MUST have `status`, `statusNote`, `sourceUrl`, `tags`.
- All new standards added MUST have `applicability`, `keyClause`, `confidence`, `sourceUrl`.
- `blockedFromDraft` MUST default to `true` for any PENDING citation.

## 8. TESTING REQUIREMENTS

- Every new feature MUST be tested against at least 3 test cases from `test-cases/`.
- Self-assessment score MUST be ≥ 8/10 before any commit.
- Test cases MUST cover: discharge application, bail application, written submission, cross-reference matrix.

## 9. MARKETING / DEMO REQUIREMENTS

- `test-cases/` folder MUST contain 21 diverse case types for demonstration.
- Each test case MUST have: FIR details, charges, defence strategy, expected output type.
- Marketing spec MUST be updated when new features are added.
