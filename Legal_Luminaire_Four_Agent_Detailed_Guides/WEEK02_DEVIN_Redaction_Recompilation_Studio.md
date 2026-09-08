# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 2 — REDACTION & RECOMPILATION STUDIO
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Devin (Cognition Devin)  
**Week-2 Role**: Autonomous PR-scale UX build • Client-Side Privacy Gate  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: ALL redaction happens locally in the browser — nothing goes to any AI. No document proceeds into the pipeline without the user passing (or consciously skipping) the redaction gate. All UI bilingual.

### LIVE REPO NOTES (verified 8 September 2026)
- Create `src/features/redaction/` as a NEW feature-module dir: current `artifacts/legal-luminaire/src/` is pages-based (`src/pages`, `src/components`, `src/lib`, `src/context`, single `src/routes.tsx`) with no `src/features/` yet.
- A server-side `backend/api/redaction_utils.py` already exists (confirmed). The Studio must remain 100% client-side and must NOT route through it — keep it as-is.
- Completion files go to repo-root `docs/integration/` (create the dir; same convention as `docs/enrichment/` on the enrichment branches).
- Wire new routes through `src/routes.tsx` (single routes file, confirmed).

---

## STANDING RULES FOR DEVIN (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Every user-facing string must exist in both English and Hindi.
3. Demo Mode and sample cases remain clearly labelled “SYNTHETIC / DEMO”.
4. After any route change, verify Netlify SPA routing still works.
5. End every week by writing the required completion file under `docs/integration/`.
6. Conventional commit messages only. If a UI change risks accuracy (e.g. hiding verification status) → stop and document.

---

## SOURCE PROJECT (verified 8 Sept 2026)

**Document Redactor and Recompiler** — https://vibecode.law/showcase/document-redactor-and-recompiler-357726  
Verified principle: “ALL redactions are done locally in your browser. Nothing goes to an AI.” Purpose: protect personally identifiable / client-confidential information before any document is processed by an LLM. Provenance note: the showcase page verifies the local-redaction principle verbatim; the Recompiler (mapping-key restore) is adopted from the project’s paired name/scope and credited accordingly. Adopted because it matches Legal Luminaire’s local-first identity and strengthens the privacy posture required by the Vibeathon participant guide (§8 Privacy and Data Protection).

## OBJECTIVES

- A **Redaction Studio**: load a case document (PDF/DOCX/image), detect and review likely PII, redact locally, export a redacted copy + a mapping key.
- A **Recompiler**: use the original + mapping key to restore the original text (reversible redaction).
- An **intake gate**: before any document enters Upload → Index, offer redaction first (skippable with a clear bilingual warning).

## DETAILED TASKS (execute strictly in order)

### 2.1 Studio Module (all client-side)
- New feature folder: `artifacts/legal-luminaire/src/features/redaction/`
  - `documentLoader.ts` — extract text layer (PDF/DOCX) or route to OCR preview (image). Reuse existing ingestion helpers; do NOT call the backend.
  - `piiDetector.ts` — pattern-based candidate detection: person names, phone numbers, email addresses, address-like lines, ID-number-like sequences (Aadhaar/PAN-shaped patterns), bank/amount figures. Return spans with confidence + reason. Pattern pack ships with synthetic examples only.
  - `redactionCanvas.tsx` — side-by-side viewer: original text vs redacted preview; click a span to redact/unredact; bulk accept high-confidence spans.
  - `exporter.ts` — produce (a) redacted copy, (b) `mapping-<hash>.json` mapping key (span → original text), stored locally per case folder naming standard `CASENO_PARTY1_PARTY2_YEAR`.
- **Zero network calls** during detect/redact/export. Verify in devtools; assert in a unit test (`no fetch/XHR during redaction flow`).

### 2.2 Recompiler
- `recompiler.tsx` — load original + mapping key → restore original document; show diff preview before saving.

### 2.3 Intake Gate (flag-gated: `redaction_studio`)
- In the existing Upload flow, insert step 0 “Protect client information” when flag is ON:
  - Primary CTA: “Redact before AI” / “AI से पहले संपादित करें”
  - Secondary CTA: “Skip — I understand the risk” / “छोड़ें — मुझे जोखिम समझ है” with persistent warning styling
- The gate must not change any downstream behaviour of Research/Draft/Verification.

### 2.4 UX & Accessibility
- Match the existing CVA card elevation system, status badges, and dark/light contexts.
- Keyboard-navigable span review; ARIA live region for detection progress.
- SYNTHETIC/DEMO-labelled sample document button in Demo Mode (uses TC-01 synthetic docs).

### 2.5 Completion
```
docs/integration/WEEK02_DEVIN_COMPLETION.md
```
Include: component architecture, PII pattern list, zero-network proof, accessibility findings, bilingual check, Netlify status, hand-off notes for Trae (W3).

## FILES TOUCHED
`artifacts/legal-luminaire/src/features/redaction/*` (new module, wired via `src/routes.tsx`) • Upload flow gate component in `src/pages/` • `src/lib/featureFlags.ts` (consume only) • completion doc in repo-root `docs/integration/`

## TOOL PROMPT FOR DEVIN (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 2 of the 12-week integration plan, behind flag `redaction_studio` (already defined in `artifacts/legal-luminaire/src/lib/featureFlags.ts`, currently OFF). Build a fully client-side Redaction & Recompilation Studio inspired by the verified principle of vibecode.law project “Document Redactor and Recompiler”: ALL redaction happens locally in the browser; nothing goes to any AI. Create `src/features/redaction/` with documentLoader (PDF/DOCX text layer; image → OCR preview), pattern-based piiDetector (names, phones, emails, addresses, ID-shaped numbers, amounts — synthetic examples only), a side-by-side redactionCanvas with click-to-toggle spans and bulk accept, and an exporter that writes a redacted copy plus a local `mapping-<hash>.json` key; add a Recompiler that restores the original from original + key with a diff preview. Insert a bilingual intake gate “Protect client information / क्लाइंट जानकारी सुरक्षित करें” as step 0 of Upload (skippable with an explicit warning). Zero network calls in the whole flow — prove it with a unit test. Everything English + Hindi, accessible, matching existing card/badge design. Never touch accuracy logic, citations, Fact-Fit Gate, or verification tiers. Verify Netlify SPA routing after the new route. Write `docs/integration/WEEK02_DEVIN_COMPLETION.md` and commit conventionally.

## WEEK 2 ACCEPTANCE CRITERIA
- [ ] Redact + export + recompile round-trips TC-01 synthetic document correctly
- [ ] Zero network calls during detect/redact/export (asserted in CI)
- [ ] Intake gate appears before Upload when flag ON; skippable; fully bilingual
- [ ] Accuracy regression: PENDING/FATAL_ERROR citations still blocked; Fact-Fit Gate untouched
- [ ] Clean-clone Netlify deploy succeeds; `WEEK02_DEVIN_COMPLETION.md` committed

## ACCURACY GUARDRAILS
Redaction must never alter verification status, citation tiers, or draft content. The gate is advisory (skippable) and never blocks a user who declines.

## ROLLBACK
Flag `redaction_studio` OFF → gate and route disappear; module is tree-shaken. No backend or data-model changes exist to revert.
