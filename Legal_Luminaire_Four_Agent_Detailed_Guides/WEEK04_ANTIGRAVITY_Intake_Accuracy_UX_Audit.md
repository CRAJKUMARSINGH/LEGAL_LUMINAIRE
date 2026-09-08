# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 4 — INTAKE CHAIN ACCURACY & UX AUDIT
**Version**: 1.0 | Professional Grade | Accuracy-First  
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
- [ ] Full intake scenario passes in browser with screenshot evidence
- [ ] Zero-network redaction proven by captured requests
- [ ] Accuracy regression green (TC-01, TC-E02, TC-E07)
- [ ] Clean-clone Netlify deploy succeeds with new routes; `WEEK04_ANTIGRAVITY_AUDIT.md` committed

## ACCURACY GUARDRAILS
Any redaction→AI leakage, any auto-filed document, or any citation regression is an immediate blocker to be fixed before the week closes.

## ROLLBACK
Audit fixes are small reversible diffs; flags can be turned OFF to disable the entire intake chain without touching core flows.
