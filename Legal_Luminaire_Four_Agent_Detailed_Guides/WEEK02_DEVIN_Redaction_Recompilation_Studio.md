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

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 2 deliverables must undergo comprehensive verification following Week 5 production lock standards:

**Testing Methodology**:
1. **Static Code Review**: Analyze component structure and logic for security and privacy compliance
2. **Network Call Verification**: Verify zero network calls during redaction flow using browser DevTools
3. **Unit Test Coverage**: Ensure all PII detection patterns and redaction logic are tested
4. **Integration Testing**: Verify round-trip redaction/export/recompilation with TC-01 synthetic document
5. **Accessibility Audit**: Verify keyboard navigation, ARIA live regions, and screen reader compatibility
6. **Bilingual Compliance Check**: Ensure all user-facing strings exist in both English and Hindi

**Testing Coverage**:
- ✅ Document loader for PDF/DOCX/image OCR preview
- ✅ PII detection patterns (names, phones, emails, addresses, ID numbers, amounts)
- ✅ Redaction canvas with click-to-toggle spans
- ✅ Bulk accept high-confidence spans functionality
- ✅ Export redacted copy + mapping key generation
- ✅ Recompiler restore with diff preview
- ✅ Intake gate bilingual CTAs and warnings
- ✅ Zero network calls assertion in unit tests
- ✅ Demo mode SYNTHETIC/DEMO labeling
- ✅ Keyboard-navigable span review
- ✅ ARIA live regions for detection progress

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings in the Redaction Studio must include both English and Hindi labels:

**Intake Gate Labels**:
- ✅ "Protect client information" / "क्लाइंट जानकारी सुरक्षित करें"
- ✅ "Redact before AI" / "AI से पहले संपादित करें"
- ✅ "Skip — I understand the risk" / "छोड़ें — मुझे जोखिम समझ है"

**Redaction Studio Labels**:
- ✅ "Redaction Studio" / "संपादन स्टूडियो"
- ✅ "Load Document" / "दस्तावेज़ लोड करें"
- ✅ "Detect PII" / "PII का पता लगाएं"
- ✅ "Export Redacted" / "संपादित निर्यात करें"
- ✅ "Mapping Key" / "मैपिंग कुंजी"
- ✅ "Recompiler" / "पुनर्संकलक"

**Status**: All user-facing strings must include both English and Hindi labels as required.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode and sample cases must be clearly labeled as SYNTHETIC/DEMO:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" badge in Demo Mode hero card
- ✅ "SYNTHETIC / DEMO" badge in Redaction Studio header
- ✅ Red styling for demo badges to distinguish from real cases
- ✅ Sample document button clearly labelled "SYNTHETIC / DEMO"

**Demo Case Flagging**:
- ✅ `isDemo` property in CaseRecord type for synthetic cases
- ✅ Demo cases properly flagged in data layer
- ✅ Demo badge display logic integrated throughout Redaction Studio UI
- ✅ Warning messages about synthetic data in Demo Mode

**Status**: All synthetic/demo cases must be clearly labeled and visually distinguished from real cases.

---

### NETLIFY COMPATIBILITY VERIFICATION

Redaction Studio must be compatible with existing Netlify SPA routing:

**SPA Routing Check**:
- ✅ No breaking changes to route structure
- ✅ New redaction routes use existing wouter routing system
- ✅ Case-scoped routes maintained (`/case/:id/redaction`)
- ✅ Breadcrumb trail compatible with SPA routing
- ✅ No new dependencies that could affect build process

**Build Compatibility**:
- ✅ All new components use existing UI library
- ✅ TypeScript strict mode compatible
- ✅ No build errors or warnings introduced
- ✅ Follows existing code patterns and conventions
- ✅ Zero network calls won't affect Netlify build process

**Status**: All changes must be compatible with existing Netlify configuration and SPA routing.

---

### ACCURACY RULES COMPLIANCE

Redaction Studio must not alter accuracy controls or verification logic:

**Verification Tiers**:
- ✅ Citation tiers (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) remain unchanged
- ✅ Fact-Fit Gate scoring remains unchanged
- ✅ PENDING citation blocking remains unchanged
- ✅ Standards verification remains unchanged

**Accuracy Signals**:
- ✅ Verification Report remains accessible and unchanged
- ✅ Citation tier badges remain displayed throughout
- ✅ No hiding of verification status or accuracy signals
- ✅ Redaction gate does not block accuracy logic

**Zero Network Call Guarantee**:
- ✅ All redaction operations performed client-side
- ✅ No API calls to backend during redaction flow
- ✅ No external service dependencies for PII detection
- ✅ Local browser-based processing only

**Status**: Redaction Studio must be completely isolated from accuracy logic and verification systems.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 2 acceptance criteria, Week 5 enrichment requires:

- [ ] Documentation is complete, accurate, and professional
- [ ] All bilingual labels verified and consistent
- [ ] Synthetic-only labeling maintained throughout
- [ ] Zero network calls proven with unit tests and DevTools verification
- [ ] Netlify SPA routing verified after new routes
- [ ] Accessibility compliance verified (keyboard navigation, ARIA, screen readers)
- [ ] Clean-clone Netlify deploy succeeds
- [ ] WEEK02_DEVIN_COMPLETION.md committed with Week 5 verification sections

---

### WEEK 5 HAND-OFF NOTES

**For Future Development**:
1. **OCR Enhancement**: Consider adding Tesseract.js for client-side OCR when running outside Demo Mode
2. **PII Pattern Expansion**: Add more sophisticated PII detection patterns based on user feedback
3. **Redaction Preview**: Consider adding more granular redaction controls (partial redaction, different redaction styles)
4. **Mapping Key Security**: Consider adding encryption for mapping keys when stored locally

**For Documentation Maintenance**:
1. Keep bilingual labels updated when new PII patterns are added
2. Update redaction patterns documentation when new detection rules are implemented
3. Maintain zero-network call guarantee documentation
4. Ensure accessibility compliance is maintained with UI changes

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: WEEK02_DEVIN_Redaction_Recompilation_Studio.md  
**Lines Added**: ~100 (Week 5 enrichment sections)  
**Lines Removed**: 0

**Suggested Commit Message**:
```
docs: Apply Week 5 enrichment standards to Week 2 Redaction Studio guide

- Add Week 5 verification methodology section
- Add bilingual compliance verification section
- Add synthetic case labeling verification section
- Add Netlify compatibility verification section
- Add accuracy rules compliance section
- Enhance acceptance criteria with Week 5 standards
- Add hand-off notes for future development

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```
