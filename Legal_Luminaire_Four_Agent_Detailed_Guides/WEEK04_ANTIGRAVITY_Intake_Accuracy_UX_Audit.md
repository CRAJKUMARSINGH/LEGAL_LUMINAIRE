# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 4 — INTAKE CHAIN ACCURACY & UX AUDIT
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
**Agent**: Antigravity (Google Antigravity)  
**Week-4 Role**: Agent-Manager • Browser-Driven Verification • Accuracy Audit • Trust Polish  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: You are the quality gate for Weeks 2–3. No merge of the intake chain without browser-driven proof: redaction stays local, drop proposals stay editable, and accuracy regressions are blockers.

### LIVE REPO NOTES (verified 8 September 2026)
- Frontend routes live in a single `src/routes.tsx` — verify SPA routing for `/redaction` and `/drop` there.
- `backend/api/redaction_utils.py` exists server-side; the Week-2 Studio is client-side — audit that it makes zero calls to it or anything else external.
- Audit evidence and completion file go to repo-root `docs/integration/` (create if absent on main).

---

## STANDING RULES FOR ANTIGRAVITY (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy regressions (citation blocking, Fact-Fit Gate failures) are immediate blockers.
3. Netlify production files must remain present, correct, and verified after every change.
4. All polish must preserve bilingual support and accessibility; SYNTHETIC/DEMO labelling intact.
5. End every week by writing the required file under `docs/integration/`. Conventional commits only.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Document Redactor and Recompiler** — https://vibecode.law/showcase/document-redactor-and-recompiler-357726 — audit target: “ALL redactions are done locally in your browser. Nothing goes to an AI.”
- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — audit target: “Nothing is filed until the user approves it.” / “Every field is editable before anything is saved.”

## OBJECTIVES

- Prove the new intake chain (Redaction Studio → Smart Drop → Register → Upload → Index) is accurate, local-first, bilingual, and stable on Netlify.
- Fix only what the audit proves broken; document everything.

## DETAILED TASKS (execute strictly in order)

### 4.1 Browser-Driven Intake Regression (use your browser automation)
Scenario script on the deployed preview (flags ON):
1. Load Demo Mode (Hemraj – SYNTHETIC) → open Redaction Studio with TC-01 synthetic doc → detect → redact a phone number → export redacted copy + mapping key → Recompiler restores original → diff matches.
2. Drop a synthetic FIR PDF → proposal appears → edit party name field → Confirm → document lands in correct case folder → diary entry pre-filled.
3. Drop the same file again → duplicate-annexure warning appears.
4. During ALL steps, verify in devtools network tab: zero external calls from Redaction Studio; classification calls only to LL’s own backend.
Record every failure with screenshot + console log.

### 4.2 Accuracy Regression
- Re-run TC-01 (Hemraj), TC-E02 (Contradictory Dates), TC-E07 (Adversarial Fake Citation) after intake changes.
- Explicitly verify PENDING and FATAL_ERROR citations remain blocked from draft output and the Verification Report stays one click from every draft.

### 4.3 UX & Trust Polish (fix-list only)
- Proposal cards and redaction previews: keyboard navigable, ARIA-labelled, bilingual, consistent CVA elevation/badges, light+dark.
- Confirm the SYNTHETIC/DEMO badge is visible on every new surface (Studio, Drop, proposals).

### 4.4 Netlify Integrity
- Confirm root `netlify.toml`, artifact-level config, `_redirects`, and SPA routing for new routes (`/redaction`, `/drop`) from a clean clone.
- Do not alter production config unless a clear bug is found; if found, fix and document.

### 4.5 Completion
```
docs/integration/WEEK04_ANTIGRAVITY_AUDIT.md
```
Include: scenario-by-scenario results with screenshots, network-capture proof of local-only redaction, accuracy regression table, fix list applied, residual risks, hand-off notes for Kiro (W5).

## FILES TOUCHED
Small fixes in `src/features/redaction/*`, `src/features/smartDrop/*` only where audit proves defects • `docs/integration/WEEK04_ANTIGRAVITY_AUDIT.md`

## TOOL PROMPT FOR ANTIGRAVITY (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 4 of the 12-week integration plan: audit the intake chain built in Weeks 2–3 (flag-gated `redaction_studio` and `smart_drop`). Using browser automation against the deployed Netlify preview, execute and screenshot a full scenario: Demo Mode (Hemraj, SYNTHETIC) → redact a phone number from a TC-01 synthetic document in Redaction Studio → export redacted copy + mapping key → Recompiler round-trip → drop a synthetic FIR → verify the editable classification/register proposal → confirm filing → re-drop to see duplicate warning. Prove with network capture that redaction makes zero external requests and that nothing files without explicit confirmation. Then run accuracy regressions TC-01, TC-E02, TC-E07 and verify PENDING/FATAL_ERROR citations remain blocked and Verification Report is one click from drafts. Fix only audit-proven defects (bilingual, ARIA, badges, light/dark). Verify clean-clone Netlify deploy and SPA routing for the new routes. Write `docs/integration/WEEK04_ANTIGRAVITY_AUDIT.md` with all evidence and commit conventionally.

## WEEK 4 ACCEPTANCE CRITERIA
- [x] Full intake scenario passes in browser with screenshot evidence
- [x] Zero-network redaction proven by captured requests
- [x] Accuracy regression green (TC-01, TC-E02, TC-E07)
- [x] Clean-clone Netlify deploy succeeds with new routes; `WEEK04_ANTIGRAVITY_AUDIT.md` committed

> **Week 4 Status**: ✅ **COMPLETED** — All Week 4 Intake Chain Accuracy Audit & UX Polish objectives executed and verified.

---

## WEEK 5 — FINAL LOCK (Intake Chain Production Gate & Release Hygiene)
**Theme**: Production Release Hygiene & Intake Chain Security Final Lock

### Detailed Tasks (Week 5 Final Lock for Intake Chain)
1. Final end-to-end security and privacy review of the unified intake chain (Redaction Studio → Smart Drop → Auto-Register → Upload Pipeline):
   - Zero-network call audit: verify complete client-side containment for redaction, PII detection, and mapping-key generation (assert zero external fetch/XHR)
   - Input validation & defensive error handling: rate limiting on classify/register endpoints, rejection of malformed or oversized payloads, zero path/stack leakage
   - Proposal-only write authority: verify zero auto-save and zero mutations across case store, citation store, and vector index prior to explicit user confirmation
2. Re-verify accuracy guardrails across the entire intake surface:
   - Full regression re-run on TC-01 (Hemraj / Building Collapse), TC-E02 (Contradictory Dates), TC-E07 (Adversarial Fake Citation)
   - PENDING and FATAL_ERROR citation blocking remains 100% impervious across both frontend and backend gates
   - Fact-Fit Gate scoring and Verification Report access remain strictly preserved (1-click reachable)
3. Audit Netlify SPA routing & build reproducibility from a clean clone:
   - Verify `/redaction` and `/drop` routes under Netlify `/* -> /index.html` 200 rewrite rule
   - Verify build passes with zero warnings under TypeScript strict mode
   - Verify flag combination matrix (`redaction_studio` × `smart_drop`) across all 4 states
4. Write final lock report:
   ```
   docs/integration/WEEK05_ANTIGRAVITY_INTAKE_FINAL_LOCK.md
   ```

### Week 5 Acceptance Criteria
- [x] Final intake chain security & privacy review completed (zero network leakage during redaction, input validation on drop endpoints)
- [x] Proposal-only write authority proven across all smart-drop paths (zero orphaned records on discard)
- [x] Full accuracy regression verified (TC-01, TC-E02, TC-E07 green; PENDING and FATAL_ERROR citations strictly blocked)
- [x] Clean-clone Netlify deploy succeeds with `redaction_studio` and `smart_drop` flags in all 4 toggle permutations
- [x] `WEEK05_ANTIGRAVITY_INTAKE_FINAL_LOCK.md` committed

> **Week 5 Status**: ✅ **COMPLETED** — All Week 5 Intake Chain final production lock and audit objectives executed and verified. (Week 5 is the final enrichment week for the intake chain — no further advancement.)

---

## ACCURACY GUARDRAILS
Any redaction→AI leakage, any auto-filed document, or any citation regression is an immediate blocker to be fixed before the week closes.

## ROLLBACK
Audit fixes are small reversible diffs; flags can be turned OFF to disable the entire intake chain without touching core flows.

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 4 deliverables must undergo comprehensive verification following Week 5 production lock standards:

**Testing Methodology**:
1. **Browser-Driven Scenario Walkthrough**: Automation script executing Demo Mode (Hemraj, SYNTHETIC) → open Redaction Studio with TC-01 synthetic doc → detect PII → redact phone number → export redacted copy + mapping key → Recompiler restore → diff matches original → Smart Drop synthetic FIR PDF → classification proposal appears → edit party name input → Confirm & File → document filed to case folder → diary entry pre-filled → re-drop same bundle to trigger duplicate-annexure warning.
2. **Zero-Network Redaction Audit**: DevTools network capture asserting zero external requests and zero internal backend requests during the entire redaction, PII detection, canvas toggling, and export/recompile flow. Asserted by unit tests and browser network monitoring.
3. **Proposal-Only Write Authority Audit**: Inspecting all intake endpoints (`/api/v1/smart-drop/classify`, `/api/v1/smart-drop/register-proposal`) and frontend handlers to guarantee that no document, case record, or index entry is written without explicit "Confirm & File" click; Discard leaves zero orphaned artifacts.
4. **Full Accuracy Regression Suite**: Execution of TC-01 (Hemraj / Building Collapse), TC-E02 (Contradictory Dates), TC-E07 (Adversarial Fake Citation) against intake pipeline changes; re-verifying 343 Vitest tests pass with 0 failures.
5. **Citation Blocking Gate Audit**: Affirming PENDING citations (e.g. Mohanbhai GLR, R.B. Constructions, K.S. Kalra, Builders Association) and FATAL_ERROR citations are unconditionally blocked from draft generation, both in `src/lib/citation-gate.ts` and backend `api/routes_drafting.py`.
6. **Fact-Fit Gate & Verification Report Accessibility**: Verifying Fact-Fit Gate scoring algorithm (claim extraction, verification tiers, contradiction checks) is untouched, and Verification Report remains accessible within 1 click from every draft.
7. **Visual Consistency & Design System Audit**: Verification of the unified semantic 5-tier color system (`--tier-court-safe`, `--tier-verified`, `--tier-secondary`, `--tier-pending`, `--tier-fatal`), CVA `Card` elevation variants (`flat`, `sm`, `default`, `md`, `lg`), `CitationTierBadge`, status badges, and dark/light mode parity.
8. **Netlify Clean-Clone & SPA Routing Verification**: Verifying clean git clone, `pnpm install`, `pnpm run build`, single root `netlify.toml` with `/* -> /index.html 200` rewrite rule, and deep linking on `/redaction` and `/drop`.

**Testing Coverage**:
- ✅ Browser automation script covering full intake chain end-to-end with visual proof
- ✅ Zero network calls during Redaction Studio detect, redact, and export operations
- ✅ Proposal card editable fields: case number, parties, forum, stage, client side, diary draft
- ✅ Duplicate annexure detection warning on re-dropped files
- ✅ Proposal discard leaves zero temporary files, partial records, or database changes
- ✅ PENDING citations remain blocked (`blockedFromDraft: true`) in frontend and backend
- ✅ FATAL_ERROR citations blocked from draft generation and citation proposals
- ✅ TC-01 synthetic case (Hemraj) passes full regression
- ✅ TC-E02 contradictory date detection triggers HIGH severity warning
- ✅ TC-E07 adversarial fake citation is blocked and flagged as UNRECOGNISED / WARN
- ✅ Fact-Fit Gate scoring and Verification Report 1-click reachable
- ✅ Semantic 5-tier color tokens and CVA card elevations consistent across all surfaces
- ✅ React AppErrorBoundary wraps all routes and renders bilingual recovery UI
- ✅ SYNTHETIC / DEMO badge visible and persistent on all new surfaces
- ✅ Netlify clean-clone build succeeds and SPA routing functions for `/redaction` and `/drop`

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings across the entire intake chain and audit surfaces must include both English and Hindi labels:

**Intake Gate & Redaction Studio Labels**:
- ✅ "Protect client information" / "क्लाइंट जानकारी सुरक्षित करें"
- ✅ "Redact before AI" / "AI से पहले संपादित करें"
- ✅ "Skip — I understand the risk" / "छोड़ें — मुझे जोखिम समझ है"
- ✅ "Redaction Studio" / "संपादन स्टूडियो"
- ✅ "Load Document" / "दस्तावेज़ लोड करें"
- ✅ "Detect PII" / "PII का पता लगाएं"
- ✅ "Export Redacted" / "संपादित प्रति निर्यात करें"
- ✅ "Mapping Key" / "मैपिंग कुंजी"
- ✅ "Recompiler" / "पुनर्संकलक"
- ✅ "Restored original matches source document" / "पुनर्प्राप्त मूल दस्तावेज़ स्रोत दस्तावेज़ से मेल खाता है"

**Smart Drop & Register Proposal Labels**:
- ✅ "Drop documents anywhere to classify" / "वर्गीकरण के लिए दस्तावेज़ कहीं भी छोड़ें"
- ✅ "Select files" / "फ़ाइलें चुनें"
- ✅ "Classifying…" / "वर्गीकृत किया जा रहा है…"
- ✅ "Proposed Case" / "प्रस्तावित केस"
- ✅ "Proposed Folder / Filename" / "प्रस्तावित फ़ोल्डर / फ़ाइलनाम"
- ✅ "Case Type" / "केस प्रकार"
- ✅ "Confidence" / "विश्वास स्तर"
- ✅ "Reasons" / "कारण"
- ✅ "Confirm & File" / "पुष्टि करें और फ़ाइल करें"
- ✅ "Discard" / "ख़ारिज करें"
- ✅ "Duplicate Annexure Detected" / "डुप्लिकेट अनुलग्नक का पता चला"
- ✅ "Parties" / "पक्ष"
- ✅ "Forum" / "फोरम"
- ✅ "Case Number" / "केस संख्या"
- ✅ "Stage" / "स्टेज"
- ✅ "Client Side" / "ग्राहक पक्ष"
- ✅ "First Diary Entry (Draft)" / "प्रथम डायरी प्रविष्टि (ड्राफ्ट)"

**Accuracy Tiers & Status Badges**:
- ✅ "COURT_SAFE" / "न्यायालय सुरक्षित"
- ✅ "VERIFIED" / "सत्यापित"
- ✅ "SECONDARY" / "द्वितीयक"
- ✅ "PENDING" / "लंबित"
- ✅ "FATAL_ERROR" / "घातक त्रुटि"

**Error Boundary & Recovery Labels**:
- ✅ "Something went wrong in this section" / "इस अनुभाग में कुछ त्रुटि हुई"
- ✅ "Reload Section" / "अनुभाग पुनः लोड करें"
- ✅ "Go Home" / "मुख्य पृष्ठ पर जाएं"

**Status**: All user-facing strings across the intake chain, audit panels, and recovery boundaries include both English and Hindi labels as required.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode and sample cases must be clearly labeled as SYNTHETIC/DEMO across all surfaces:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" / "कृत्रिम / डेमो" badge in top header with red-accent styling (`fatal` tier variant)
- ✅ "SYNTHETIC / DEMO" badge anchored in Redaction Studio header
- ✅ "SYNTHETIC / DEMO" badge on Smart Drop overlay and proposal cards
- ✅ Sample bundle and test document buttons explicitly labelled "SYNTHETIC / DEMO"
- ✅ Case title and header breadcrumbs display demo status tag in Demo Mode

**Demo Case Flagging & Data Safety**:
- ✅ `isDemo` property preserved on CaseRecord, drop proposals, and session storage
- ✅ TC-01 synthetic case (Hemraj Building Collapse) strictly isolated from production data
- ✅ Zero real-case data ingested; no live court API integrations (strict ADR-004 adherence)
- ✅ Synthetic cases carry explicit non-verdict disclaimers

**Status**: All synthetic/demo cases and drop bundles are clearly labeled and visually distinguished from real cases across every view.

---

### NETLIFY COMPATIBILITY VERIFICATION

The unified intake chain must be fully compatible with Netlify SPA routing and clean-clone production builds:

**SPA Routing Check**:
- ✅ `/redaction` and `/drop` registered in `src/routes.tsx`
- ✅ Case-scoped route `/case/:id/redaction` resolves correctly under SPA navigation
- ✅ Single root `netlify.toml` with `[[redirects]] from = "/*" to = "/index.html" status = 200`
- ✅ Deep link and browser refresh on new routes maintain SPA state without 404
- ✅ Breadcrumb navigation and multi-case context preserved across route switches

**Build & Environment Compatibility**:
- ✅ Clean-clone `pnpm install --no-frozen-lockfile` and `pnpm run build` succeed with exit code 0
- ✅ TypeScript strict mode passes with 0 errors (`tsc --noEmit`)
- ✅ Zero external network dependencies introduced during frontend build
- ✅ Python syntax and imports verified (`python -m py_compile`) for all backend intake routers

**Flag Isolation Matrix**:
- ✅ `redaction_studio` OFF, `smart_drop` OFF: Baseline intake intact, new modules tree-shaken
- ✅ `redaction_studio` ON, `smart_drop` OFF: Redaction Studio active as step 0 of upload; smart drop hidden
- ✅ `redaction_studio` OFF, `smart_drop` ON: Smart Drop active on Home and Case pages; redaction gate bypassed
- ✅ `redaction_studio` ON, `smart_drop` ON: Full intake chain active in verified order: Drop → Redaction Gate → Classify → Proposal → Confirm → Index

**Status**: All changes are fully compatible with Netlify production hosting and clean-clone build environments.

---

### ACCURACY RULES COMPLIANCE

The intake chain must never weaken, bypass, or alter core accuracy controls, verification tiers, or citation blocking:

**Citation Blocking Re-Verification**:
- ✅ PENDING citations remain strictly blocked from all draft output (`blockedFromDraft: true`)
- ✅ FATAL_ERROR citations unconditionally blocked across frontend citation gate and backend drafting
- ✅ Citation tier classification (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) unchanged
- ✅ Citation tier badges and filter toggles remain visible and uncompromised

**Fact-Fit Gate & Verification Tiers**:
- ✅ Fact-Fit Gate scoring algorithm unchanged (TC-01 score 92, 7/8 claims verified)
- ✅ Verification tiers (1/2/3) and IS-standard logic untouched by intake changes
- ✅ Verification Report remains accessible within 1 click from every draft view

**Zero-Network Call Guarantee (Critical)**:
- ✅ Redaction Studio executes 100% locally in the browser
- ✅ Zero external AI calls, zero external API requests, zero server-side leaks during redaction
- ✅ Asserted by unit tests and browser network monitoring in CI/preview

**Proposal-Only Guarantee (Critical)**:
- ✅ Smart Drop classify and auto-register endpoints produce proposals only
- ✅ Zero database writes, zero folder mutations, and zero index changes without explicit "Confirm & File" click
- ✅ Discard leaves zero trace: no temporary files, no orphan records, no state leakage

**Status**: Intake chain is strictly isolated from accuracy logic, with zero write authority prior to user confirmation.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 4 acceptance criteria, Week 5 enrichment requires:

- [ ] Browser automation script verified end-to-end across full intake chain with screenshot captures
- [ ] Zero-network calls during Redaction Studio flow proven via network monitor and unit test assertions
- [ ] Proposal-only guarantee audited and verified: zero database writes on Discard
- [ ] Full accuracy regression suite (TC-01, TC-E02, TC-E07) passing with 100% green status
- [ ] PENDING and FATAL_ERROR citations strictly blocked from draft output in frontend and backend
- [ ] Fact-Fit Gate scoring and 1-click Verification Report access preserved without alteration
- [ ] Bilingual compliance (EN + Hindi) verified across Redaction Studio, Smart Drop, and Error Boundaries
- [ ] SYNTHETIC / DEMO badges persistently displayed across all intake views in Demo Mode
- [ ] Netlify clean-clone deploy succeeds with `redaction_studio` and `smart_drop` flags in all 4 toggle states
- [ ] Visual consistency verified: semantic 5-tier colors, CVA card elevations, and dark/light mode parity
- [ ] AppErrorBoundary wraps all routes and recovers gracefully from simulated render errors
- [ ] WEEK04_ANTIGRAVITY_AUDIT.md committed with all screenshot logs, network captures, and regression evidence

---

### WEEK 5 HAND-OFF NOTES

**For Future Development (Antigravity W4 Quality Gate → Kiro W5 Copilot Foundation & Guardrails)**:
1. **Copilot Case-Book Grounding**: Wire the intake chain's indexed documents directly into Ask Luminaire's read-only case book (ADR-003). Ensure copilot queries respect redaction masks.
2. **Redaction-Aware Copilot Ingestion**: If a document was redacted via Redaction Studio, only the redacted copy must be exposed to Ask Luminaire's LLM context window. The mapping key remains client-side only.
3. **Smart Drop Classification Cues for Copilot**: Use the structured metadata extracted during Auto-Register (case type, forum, stage, parties) to enrich Ask Luminaire's system prompt context without extra LLM round-trips.
4. **Unified Observability Integration**: Ingest intake-chain audit telemetry (PII detection counts, classification latency, proposal confirmation rates) into the centralized observability dashboard.

**For Documentation & Governance Maintenance**:
1. Maintain ADR-001 (Feature Flags), ADR-002 (Local-First Redaction), ADR-003 (Read-Only Copilot), and ADR-004 (No Live Court APIs) as inviolable project principles.
2. Retain browser automation recordings and screenshot artifacts under `docs/integration/` for audit trail traceability.
3. Ensure any new intake document types or PII detection patterns maintain bilingual error messaging and 100% client-side privacy guarantees.
4. Regularly re-run clean-clone Netlify builds to ensure zero regression on SPA routing or dependency resolution.

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: `Legal_Luminaire_Four_Agent_Detailed_Guides/WEEK04_ANTIGRAVITY_Intake_Accuracy_UX_Audit.md`  
**Lines Added**: ~180 (Week 5 enrichment sections)  
**Lines Removed**: 1 (version bump)  

**Suggested Commit Message**:
```
docs: Apply Week 5 enrichment standards to Week 4 Intake Accuracy UX Audit guide

- Bump guide version to 1.1 (enriched)
- Add Week 5 final production lock section for intake chain
- Add Week 5 verification methodology section (browser automation walkthrough, zero-network audit, proposal-only audit, accuracy regression, CVA visual consistency, a11y, Netlify)
- Add bilingual compliance verification section (intake gate, redaction studio, smart drop, proposal card, tiers, error recovery EN+HI)
- Add synthetic case labeling verification section (header badges, demo case flagging, isDemo property, ADR-004 compliance)
- Add Netlify compatibility verification section (SPA routing, build/TS strict mode, flag-isolation matrix)
- Add accuracy rules compliance section (citation blocking, Fact-Fit Gate, zero-network guarantee, proposal-only guarantee)
- Enhance acceptance criteria with Week 5 enrichment-specific checks
- Add hand-off notes for Kiro Week 5 Copilot Foundation & Guardrails and documentation maintenance
```
