# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 1 — INTEGRATION FOUNDATION: SPECS, FEATURE FLAGS, CI, ADRs
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Kiro (AWS Kiro / Spec-Driven Development)  
**Week-1 Role**: Foundation • Spec Baseline • Feature Flags • CI Extension • Architecture Decision Records  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Nothing ships unflagged. Every feature of the 12-week plan gets a written spec before any code exists. Netlify production files remain committed and functional.

### LIVE REPO STATE (verified 8 September 2026 via GitHub API)
- Enrichment output lives on working branches, NOT on main: `devin/1788707153-week1-devin-audit` and `devin/1788709797-week2-enrichment` carry `docs/enrichment/WEEK1_DEVIN_AUDIT.md` (16.3 KB) and `docs/enrichment/WEEK2_DEVIN_COMPLETION.md` (9.4 KB) at repo root. Main HEAD = `5c25f15` (2026-05-25, Harvey AI integration).
- **Prerequisite**: merge both enrichment branches into main before starting Week 1.
- Structure facts: backend = `artifacts/legal-luminaire/backend/` with FLAT `api/routes_*.py` convention (`routes.py`, `routes_cases.py`, `routes_drafting.py`, `routes_verify.py`, `routes_analytics.py`, `api/models.py`), registered in `backend/main.py`. Frontend `src/` is pages-based (`src/pages`, `src/components`, `src/lib`, single `src/routes.tsx`) — there is no `src/features/` yet and no `src/routes/` directory. `.kiro/` exists at root. TC-01 lives at `backend/uploaded_cases/TC-01/`.

---

## STANDING RULES FOR KIRO (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Prefer minimal, high-confidence, reversible diffs.
3. Always run `pnpm install --frozen-lockfile` and full typecheck + build before committing.
4. After any change that touches build or routing, verify clean-clone Netlify deploy still succeeds.
5. Preserve bilingual (Hindi + English) UI strings. Never introduce real case data.
6. End every week by writing the required completion file under `docs/integration/`.
7. Conventional commit messages only. If a task conflicts with accuracy rules → stop and document.

---

## SOURCE CONTEXT

No external feature this week. This is the enabling week for all features adopted from:
- Statutory (https://vibecode.law/showcase/Statutory-723173)
- Vyaas Docket (https://vibecode.law/showcase/vyaas-docket-508140)
- AI Law (https://vibecode.law/showcase/ai-law-a-simulation-in-working-with-ai-495228)
- Document Redactor (https://vibecode.law/showcase/document-redactor-and-recompiler-357726)
- Local Law Explorer (https://vibecode.law/showcase/local-law-explorer-812278)
- vibecode-submit (https://vibecode.law/showcase/skill-for-submitting-a-project-to-vibecodelaw-525107)

## OBJECTIVES

- Write machine-readable specs for every adopted feature so later weeks implement against a contract, not vibes.
- Ship a feature-flag system so no experimental feature can ever destabilize the Netlify demo.
- Extend CI to cover the new spec/flag surface.
- Record every integration decision in ADRs.

## DETAILED TASKS (execute strictly in order)

### 1.1 Spec Pack (spec-driven, `.kiro/specs/`)
Create one spec directory per adopted feature; each contains `requirements.md`, `design.md`, `tasks.md`:
- `.kiro/specs/redaction-studio/` (W2 — client-side PII redaction + recompile)
- `.kiro/specs/smart-drop/` (W3 — document drop classification + register proposal)
- `.kiro/specs/ask-copilot/` (W5–W8 — grounded case-book Q&A)
- `.kiro/specs/citation-deeplink/` (W7 — every citation links to source PDF)
- `.kiro/specs/deadline-engine/` (W9 — limitation periods, synthetic dates only)
- `.kiro/specs/chronology-studio/` (W10 — chronology + board + calendar)
- `.kiro/specs/standards-explorer/` (W11 — standards browse, plain-language, honest framing)
- `.kiro/specs/accuracy-academy/` (W12 — branching walkthrough + trade-off meters)
Each spec must state: scope, data model, API contract, accuracy guardrails, bilingual requirement, flag name, rollback.

### 1.2 Feature Flag System
- Create `artifacts/legal-luminaire/src/lib/featureFlags.ts`:
  - Flags: `redaction_studio`, `smart_drop`, `ask_copilot`, `citation_deeplink`, `deadline_engine`, `chronology_studio`, `standards_explorer`, `accuracy_academy`
  - All default **OFF**; typed as a const object; no stringly-typed lookups.
- Add a hidden `/system/flags` dev route (bilingual labels) to toggle flags locally; route must work under Netlify SPA redirects (`/* → /index.html` 200).

### 1.3 CI Extension (extend the EXISTING `.github/workflows/` pipeline — a Vitest suite with 343 tests was added in commit `7182915`; reuse that workflow file, do not create a parallel one)
- Keep existing: `pnpm install --frozen-lockfile`, typecheck, frontend build, backend `python -m py_compile`.
- Add: flag-type check (fail if a flag is referenced but not declared), spec-lint (each spec dir must contain all three files).

### 1.4 Architecture Decision Records
- `docs/integration/ADR-001-feature-flags.md`
- `docs/integration/ADR-002-local-first-redaction-before-ai.md` (records the adopted principle from the Document Redactor showcase: redaction happens in-browser, nothing goes to an AI)
- `docs/integration/ADR-003-copilot-read-only-grounded.md` (records the adopted Vyaas contract: the copilot never invents matters, dates or orders)
- `docs/integration/ADR-004-no-live-court-apis.md` (records why live court-status lookups were NEGLECTED: third-party API breaks local-first + clean-clone demo + synthetic-only rule)

### 1.5 Completion
```
docs/integration/WEEK01_KIRO_COMPLETION.md
```
(repo-root `docs/` — the same convention the enrichment branches use for `docs/enrichment/`; this directory does not exist on main yet, create it)
Include: files changed, commands run, Netlify verification result, flag registry table, hand-off notes for Devin (W2).

## FILES TOUCHED
`artifacts/legal-luminaire/src/lib/featureFlags.ts` (new) • `artifacts/legal-luminaire/src/routes.tsx` (flags-route wiring — routes live in this single file, not a `src/routes/` dir) • `.kiro/specs/*` (new) • existing `.github/workflows/` pipeline (extend) • `docs/integration/ADR-00*.md` (repo-root docs/) • `netlify.toml` (verify only — do not alter)

## TOOL PROMPT FOR KIRO (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 1 of the 12-week integration plan: foundation only, no feature code. (1) Write spec packs under `.kiro/specs/` for redaction-studio, smart-drop, ask-copilot, citation-deeplink, deadline-engine, chronology-studio, standards-explorer, accuracy-academy — each with requirements.md, design.md, tasks.md, stating flag name, bilingual requirement, accuracy guardrails, rollback. (2) Create a fully typed feature-flag module at `artifacts/legal-luminaire/src/lib/featureFlags.ts` with all eight flags defaulting to OFF, plus a hidden bilingual `/system/flags` dev route that works under Netlify SPA redirects. (3) Extend `.github/workflows/ci.yml` with flag-declaration and spec-lint checks. (4) Write ADR-001…004 under `docs/integration/` recording the flag system, local-first redaction, grounded read-only copilot, and the decision to reject live court APIs. Run `pnpm install --frozen-lockfile`, typecheck, build; verify a clean clone still deploys to Netlify (publish dir per existing root `netlify.toml` + `artifacts/legal-luminaire/netlify.toml` — both confirmed present; verify rather than assume the publish path). Commit conventionally and write `docs/integration/WEEK01_KIRO_COMPLETION.md`.

## WEEK 1 ACCEPTANCE CRITERIA
- [ ] All 8 spec packs exist and lint clean in CI
- [ ] `featureFlags.ts` typed, all flags OFF, flags route functional bilingually
- [ ] CI green including new checks
- [ ] Clean-clone Netlify deploy succeeds; SPA routing intact
- [ ] `WEEK01_KIRO_COMPLETION.md` committed

## ACCURACY GUARDRAILS
No user-facing feature ships this week; nothing may alter drafts, citations, Fact-Fit Gate, or verification tiers. Flags default OFF everywhere.

## ROLLBACK
Delete the flags route and spec dirs; `git revert` the flag module. Zero runtime impact since nothing consumes flags yet.
