# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 12 — ACCURACY ACADEMY, SUBMISSION KIT & RELEASE LOCK
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Antigravity (Google Antigravity)  
**Week-12 Role**: Agent-Manager • Training Module Build • Submission Package • Final Production Lock & Release  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: You are the final quality and production gate. No release without a clean Netlify deploy from a fresh clone and zero accuracy regressions across all eleven prior weeks. All training and submission material remains synthetic-only.

### LIVE REPO NOTES (verified 8 September 2026)
- Academy routes wire through the single `src/routes.tsx`; scenario JSON can live in `src/data/` (folder confirmed).
- The v2.0 Vitest suite (343 tests, commit `7182915`) must stay green alongside your new regression sweep.
- `docs/submission/` and `docs/integration/` sit under the repo-root `docs/` (present on the enrichment branches); CHANGELOG.md confirmed at root. Tag only from a merged, clean main.

---

## STANDING RULES FOR ANTIGRAVITY (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy regressions (citation blocking, Fact-Fit Gate failures) are immediate blockers.
3. Netlify production files must remain present, correct, verified; bilingual + accessibility preserved; SYNTHETIC/DEMO labelling intact.
4. Conventional commits; you own the final release tag — do not tag until every acceptance criterion is green.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **AI Law: A Simulation in Working With AI** — https://vibecode.law/showcase/ai-law-a-simulation-in-working-with-ai-495228 — verified patterns adopted: branching scenario with **“no choice is free. Every scenario offers four options, and each carries a genuine cost”**, with **visible trade-off meters** showing “what they optimized for and what they gave up”. NEGLECTED: group session mode, analytics, multi-module career tracks (infrastructure out of scope).
- **vibecode-submit skill** — https://vibecode.law/showcase/skill-for-submitting-a-project-to-vibecodelaw-525107 — verified pattern adopted: draft every submission field from the repo, **never submit for you, never fabricate a screenshot**; human pastes and submits.

## OBJECTIVES

- **Accuracy Academy**: one compact branching walkthrough (“The First Draft”) teaching when to trust AI output — choices trade off speed, verification depth, and client safety on visible meters.
- **Showcase Submission Kit**: a documented agent workflow that drafts the vibecode.law submission fields from this repo and captures REAL screenshots — human reviews and submits (deadline: 11 September 2026, 5:00 PM IST).
- Final regression across all flags, clean-clone deploy, summary doc, tag `v2.2.0-integration`.

## DETAILED TASKS (execute strictly in order)

### 12.1 Accuracy Academy (flag: `accuracy_academy`)
- `/academy` route, bilingual. One module, 3 branching scenarios, 4 options each, every option carries an explicit cost (per the verified AI Law design rule).
- 3 trade-off meters: **Verification Depth**, **Time Spent**, **Client Safety** — visible, animated on choice. (Compact adaptation of the source’s five meters per module; label the module intro “adapted from AI Law — A Simulation”.)
- Scenarios (synthetic, mapped to app mechanics): (1) copilot gives a well-cited answer — verify or ship? (2) deadline tomorrow, one citation still PENDING — file, re-verify, or disclose? (3) judge questions a standard — expand from Standards Explorer or improvise?
- Every ending shows which meters you optimized and links the in-app feature that would have helped (Fact-Fit Gate, Verification Report, Ask Luminaire refusals).
- Static content module (JSON scenarios) — no backend needed; works on the static Netlify demo.

### 12.2 Showcase Submission Kit
- `docs/submission/vibecode-submit-workflow.md` + `docs/submission/DRAFT_SUBMISSION.md`:
  - Drafts: title, one-line pitch (template from the participant guide), 100–200-word summary, feature list, practice-area tags, AI-assisted development disclosure table (tools: Kiro/Devin/Trae/Antigravity, models, human vs AI contribution), accuracy & safety section, privacy statement.
  - Screenshot checklist with REAL captures from the deployed demo (Studio, Drop proposal, Copilot with citations, Deadline Board, Chronology, Standards Explorer, Academy) — each capture named and dated; fabricated imagery prohibited.
  - Assemble a paste-ready submission folder (adopted vibecode-submit mechanic: “writes a folder you paste straight into this form”). Explicit human steps: review, upload screenshots, paste, submit on vibecode.law before 11 Sept 2026, 5:00 PM IST.

### 12.3 Full 12-Week Regression & Release Lock
- Browser-driven sweep with every flag ON: redaction round-trip → drop confirm → copilot adversarial probes (6) → deadlines → chronology → standards → academy.
- Accuracy regression: TC-01, TC-E02, TC-E07 + PENDING/FATAL_ERROR blocking proof.
- Clean-clone Netlify deploy; all production files verified; SPA routing for all new routes.
- Write `docs/integration/ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md` + `docs/integration/WEEK12_ANTIGRAVITY_FINAL.md`; update CHANGELOG.md.
- Tag `v2.2.0-integration` (annotated) only when everything is green.

## FILES TOUCHED
`src/features/academy/*` + scenario JSON (new, wired via `src/routes.tsx`) • `docs/submission/*` (new, repo-root docs/) • summary/final docs • CHANGELOG.md • release tag

## TOOL PROMPT FOR ANTIGRAVITY (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 12 of the 12-week integration plan: final build, audit, and release. (1) Behind flag `accuracy_academy`, build a bilingual `/academy` module adopting the verified AI Law design rule — branching scenarios where every one of four options carries a genuine cost, with three visible trade-off meters (Verification Depth, Time Spent, Client Safety) — three synthetic scenarios mapped to real app mechanics (copilot trust, PENDING citation before a deadline, standards reasoning), each ending linking the in-app feature that helps; static JSON content so it runs on the Netlify static demo. (2) Create `docs/submission/vibecode-submit-workflow.md` + `DRAFT_SUBMISSION.md` drafting every vibecode.law showcase field from this repo (pitch, summary, features, practice-area tags, AI disclosure table naming Kiro/Devin/Trae/Antigravity, accuracy and privacy sections) with a REAL-screenshot checklist from the deployed demo — never fabricate imagery, never auto-submit; note the 11 September 2026 5:00 PM IST deadline for the human submitter. (3) Run the full 12-week browser regression with all flags ON (intake chain, 6 copilot adversarial probes, deadline engine, chronology, standards, academy) plus TC-01/TC-E02/TC-E07 accuracy regression and PENDING/FATAL_ERROR blocking proof; verify clean-clone Netlify deploy and SPA routing. (4) Write `docs/integration/ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md` and `WEEK12_ANTIGRAVITY_FINAL.md`, update CHANGELOG.md, and tag `v2.2.0-integration` only when every criterion is green. Commit conventionally.

## WEEK 12 ACCEPTANCE CRITERIA
- [ ] Academy module complete, bilingual, static-demo compatible; meters behave as specified
- [ ] Submission Kit drafts complete; screenshot checklist uses only real captures; human-submit steps explicit
- [ ] Full 12-week regression + accuracy regression green with all flags ON
- [ ] Clean-clone Netlify deploy succeeds; summary + final docs committed; `v2.2.0-integration` tagged

## ACCURACY GUARDRAILS
Academy content describes app mechanics only — it never states legal conclusions. Submission drafts inherit the synthetic-only marketing rule.

## ROLLBACK
`accuracy_academy` flag OFF hides the route; submission docs are inert files; the tag can be deleted pre-publication if a blocker emerges.
