# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 9 — LIMITATION & DEADLINE ENGINE
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Kiro (AWS Kiro / Spec-Driven Development)  
**Week-9 Role**: Spec-Driven Engine • Deterministic Date Computation • Type Safety • CI  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Deadlines are computed deterministically from **synthetic dates only** and always displayed with their governing basis. This is a pure-computation feature — it must never call an LLM. Bilingual throughout.

### LIVE REPO NOTES (verified 8 September 2026)
- The backend has NO `services/` directory today (confirmed: backend root holds `main.py`, `config.py`, `cache.py`, `repo_paths.py` plus `api/`, `agents/`, `rag/`, `graph/`, `scripts/`) — create `backend/services/` as a new, additive directory.
- Endpoint router follows the flat convention: new `backend/api/routes_deadlines.py`, registered in `backend/main.py`.
- TC-01 confirmed at `backend/uploaded_cases/TC-01/` (contains `Case_Facts_Timeline.md`, `Cross_Reference_Matrix_Detailed.lex`, `Standards_Matrix_IS_ASTM_NABL.md`).

---

## STANDING RULES FOR KIRO (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Minimal, high-confidence, reversible diffs; `pnpm install --frozen-lockfile` + typecheck + build before committing.
3. Verify clean-clone Netlify deploy after build/routing changes; never introduce real case data; bilingual strings preserved.
4. Conventional commits; end with the completion file under `docs/integration/`.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Vaadhan** — https://vibecode.law/showcase/vaadhan-723173 — verified feature *Limitation & Deadline Tracking*: “Keep track of important limitation periods, filing deadlines, and case-related dates.”
- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified feature *limitation and tasks board* within the docketing system (board UI itself lands in W10; this week is the engine).

## OBJECTIVES

- A deterministic **limitation calculator** for common Indian criminal-procedure and filing deadlines, driven by a versioned, human-reviewable rule table.
- Deadline derivation from the synthetic case data layer (FIR date, arrest date, charge-sheet stage, hearing dates) with explicit basis strings.
- Copilot integration: deadline questions answered from the engine’s deterministic output (never invented — satisfies the W5 contract).

## DETAILED TASKS (execute strictly in order)

### 9.1 Rule Table & Spec Update
- Update `.kiro/specs/deadline-engine/`; create a NEW `backend/services/` directory containing `limitation_rules.json` — versioned rule table, each rule: `{id, event_basis, period_days, period_basis (calendar/working), extension_rule, source_note}`. Seed with a small, clearly documented synthetic-oriented set (e.g., default 90/60-day filing windows, remission/exclusion placeholders) marked **“illustrative — verify against current statute text before professional use”**. No rule ships without `source_note`.

### 9.2 Deterministic Engine (flag: `deadline_engine`)
- `backend/services/limitation_engine.py`: pure functions — inputs (event dates from the case data layer + rule ids) → outputs `{deadline_date, basis_string (EN+HI), rule_id, computed_at}`. No LLM calls. Property-based tests for boundary dates, month-ends, excluded periods.
- `GET /api/v1/case/{case_id}/deadlines` in a new flat-convention router `backend/api/routes_deadlines.py` (registered in `backend/main.py`) returns the computed schedule; recalculated on case-data change; every item traceable to rule id + event date.

### 9.3 Copilot Hook
- Copilot citation type `deadline` added (W5 contract): answers about deadlines cite the engine’s rule id + basis string, never generate dates themselves.

### 9.4 Demo Data
- Extend TC-01 synthetic case (`backend/uploaded_cases/TC-01/` — confirmed) with event dates producing a visible deadline schedule; label all dates SYNTHETIC/DEMO.

### 9.5 Completion
```
docs/integration/WEEK09_KIRO_COMPLETION.md
```
Include: rule table contents, engine test matrix, copilot hook proof, hand-off notes for Devin (W10).

## FILES TOUCHED
`.kiro/specs/deadline-engine/*` • `backend/services/limitation_rules.json` + `backend/services/limitation_engine.py` (new dir) • `backend/api/routes_deadlines.py` (flat convention) • copilot citation type • TC-01 data at `backend/uploaded_cases/TC-01/` • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR KIRO (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 9 of the 12-week integration plan, behind flag `deadline_engine`. Implement the verified Vaadhan feature *Limitation & Deadline Tracking* as a deterministic engine: a versioned `backend/services/limitation_rules.json` table in a NEW backend/services/ dir (each rule with id, event basis, period, calendar/working basis, extension rule, and a mandatory source_note marked illustrative-synthetic), a pure-function Python engine at backend/services/limitation_engine.py computing deadlines from synthetic case event dates (FIR date, arrest, charge-sheet stage, hearings) — absolutely no LLM in the computation path; property-based tests for boundaries, month-ends, exclusions; `GET /api/v1/case/{case_id}/deadlines` in a new backend/api/routes_deadlines.py router (existing flat routes convention, registered in backend/main.py) returning `{deadline_date, basis_string EN+HI, rule_id}`; add a `deadline` citation type to the W5 copilot so deadline answers cite rule id + basis and never invent dates; extend TC-01 (backend/uploaded_cases/TC-01/) with synthetic event dates and label everything SYNTHETIC/DEMO. Update the `.kiro/specs/deadline-engine` spec first. Typecheck, build, clean-clone Netlify verify. Write `docs/integration/WEEK09_KIRO_COMPLETION.md` and commit conventionally.

## WEEK 9 ACCEPTANCE CRITERIA
- [ ] Engine output for TC-01 matches hand-computed expected dates 100%
- [ ] Every deadline carries rule id + bilingual basis string; SYNTHETIC labelling visible
- [ ] Copilot deadline answers cite engine output (zero invented dates across 10 probes)
- [ ] Clean-clone Netlify deploy succeeds; `WEEK09_KIRO_COMPLETION.md` committed

## ACCURACY GUARDRAILS
Deterministic only: no LLM date math; no silent rule defaults; missing event date → explicit “cannot compute” state, never an estimate presented as a deadline.

## ROLLBACK
Flag OFF hides the endpoint, copilot type, and demo dates; rule table and engine are additive files.
