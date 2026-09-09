# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 11 — STANDARDS EXPLORER & USAGE/COST REPORTING
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Trae (ByteDance Trae)  
**Week-11 Role**: Backend Curation • Explorer API • Honest-Framing Enforcement • Observability Surface  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Adopted from Local Law Explorer — plain-language explanations phrased as **honest descriptions, never verdicts**, with everyday **“Can I / Can the court”-style questions** answered by surfacing the actual governing text. The explorer surfaces IS-standard and statutory references already used by the app; it adds NO new legal content of its own.

### LIVE REPO NOTES (verified 8 September 2026)
- Standards machinery CONFIRMED and to be surfaced, not duplicated: `backend/agents/standards_verifier.py`, `backend/rag/standards_index.py`, `backend/rag/law_db.json`, and TC-01’s `Standards_Matrix_IS_ASTM_NABL.md`.
- Usage aggregation extends the confirmed analytics layer `backend/api/routes_analytics.py`.
- Explorer routers follow the flat convention: new `backend/api/routes_standards.py` + `backend/api/routes_usage.py`, registered in `backend/main.py`. Rules JSON in a new `backend/data/` dir.

---

## STANDING RULES FOR TRAE (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Accuracy is non-negotiable: PENDING and FATAL_ERROR citations remain blocked; explorer items cite their governing source.
3. Bilingual + graceful degradation; runtime data gitignored; API changes coordinated for frontend types.
4. Conventional commits; end with the completion file under `docs/integration/`.

---

## SOURCE PROJECTS (verified 8 Sept 2026)

- **Local Law Explorer** — https://vibecode.law/showcase/local-law-explorer-812278 — verified patterns adopted: *browse and search*; *plain-language report phrased as honest percentiles, never verdicts* (adapted: honest basis lines, no scoring verdicts); *everyday “Can I?” questions answered by surfacing the actual rules that mention them*. NEGLECTED: LOCUS-v1 US corpus, US choropleth, cross-town percentiles (wrong jurisdiction; recorded in ADR-004 rationale).
- **Vyaas Docket** — https://vibecode.law/showcase/vyaas-docket-508140 — verified feature: *usage and cost per feature shown in Settings*.

## OBJECTIVES

- **Standards Explorer**: browsable, searchable view of the IS-standard references and statutory anchors the app already reasons with (Forensic science standards, procedural anchors), each with: official designation, scope summary (EN+HI), and the case contexts where the app applies it — all sourced from the existing standards matrix, no new legal assertions.
- **“Can I ask the court?” question surfacing**: everyday question chips that jump to the standards/case contexts that mention them.
- **Usage & cost reporting**: per-feature token/cost aggregation exposed in Settings, extending the W5 observability logs.

## DETAILED TASKS (execute strictly in order)

### 11.1 Explorer Data Layer (flag: `standards_explorer`)
- `backend/data/standards_catalog.json` (new `backend/data/` dir): curated from the app’s existing standards matrix + accuracy governance docs only — grounded in the confirmed `backend/rag/standards_index.py`, `backend/agents/standards_verifier.py` and TC-01’s `Standards_Matrix_IS_ASTM_NABL.md`. Each entry: `{standard_id, designation, domain, scope_summary_en, scope_summary_hi, applied_in: [case_contexts], source_note}`. New content prohibited without `source_note` pointing at an existing repo authority (e.g., TC-01’s `Standards_Matrix_IS_ASTM_NABL.md` or the accuracy docs under root `docs/`).

### 11.2 Explorer API
- Explorer routers in the flat convention — `backend/api/routes_standards.py` and `backend/api/routes_usage.py` (registered in `backend/main.py`): `GET /api/v1/standards` (list + filters: domain, applied-in), `GET /api/v1/standards/{standard_id}` (detail + related case contexts + related Fact-Fit-Gate-scored precedents if any).
- Question-surfacing endpoint `GET /api/v1/standards/questions?case_id=` — returns everyday bilingual question chips derived from the active case’s standards matrix entries; answering jumps to the standard + case context, and hands off deeper reasoning to the copilot (W5 contract) rather than generating fresh advice.

### 11.3 Usage & Cost Reporting (extends observability)
- Aggregate the per-request logs (W5/W7) via the confirmed analytics layer `backend/api/routes_analytics.py` into `GET /api/v1/usage/summary?range=` → per-feature {requests, tokens, est_cost}; conservative estimates labelled approximate.

### 11.4 Frontend (Trae precision edits; Devin refines in review)
- `/standards` route: search + filters + detail pages; honest-basis banner: “Plain-language summary — not a legal verdict. / सरल भाषा का सारांश — कानूनी निर्णय नहीं।”
- Settings → “Usage & Cost” panel with per-feature table (EN+HI, approximate labelling).

### 11.5 Completion
```
docs/integration/WEEK11_TRAE_COMPLETION.md
```
Include: catalog provenance audit (every entry → source_note), API contracts, usage aggregation design, hand-off notes for Antigravity (W12).

## FILES TOUCHED
`backend/data/standards_catalog.json` (new dir) • `backend/api/routes_standards.py` + `backend/api/routes_usage.py` (flat convention) • `/standards` route wired in `src/routes.tsx` + Settings panel • completion doc at repo-root `docs/integration/`

## TOOL PROMPT FOR TRAE (paste as-is)

> You are working in https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE. Week 11 of the 12-week integration plan, behind flags `standards_explorer` (new) and the existing observability logs. Adopt the verified Local Law Explorer interaction patterns for the Indian context: build a Standards Explorer that browses/searches ONLY the IS-standard references and statutory anchors already present in the app — grounded in the confirmed backend/rag/standards_index.py, backend/agents/standards_verifier.py and TC-01’s Standards_Matrix_IS_ASTM_NABL.md — curated into backend/data/standards_catalog.json where every entry carries designation, bilingual scope summary, applied-in case contexts, and a mandatory source_note pointing at an existing repo authority; no new legal content. Add honest-basis banner copy (“Plain-language summary — not a legal verdict”) and a “Can I ask the court?” everyday-question chip set derived per active case that jumps to the governing standard + case context and delegates reasoning to the Week 5 copilot contract instead of generating advice. Implement new backend/api/routes_standards.py + backend/api/routes_usage.py (existing flat routes convention, registered in backend/main.py) exposing `GET /api/v1/standards`, `GET /api/v1/standards/{id}`, `GET /api/v1/standards/questions`, and a Settings usage panel backed by `GET /api/v1/usage/summary` aggregating per-feature tokens/estimated cost via the existing api/routes_analytics.py layer (labelled approximate). Bilingual, accessible; PENDING/FATAL_ERROR exclusion untouched. Write `docs/integration/WEEK11_TRAE_COMPLETION.md` and commit conventionally.

## WEEK 11 ACCEPTANCE CRITERIA
- [x] 100% of catalog entries traceable to an existing repo authority via source_note
- [x] Question chips resolve to real standards/case contexts on TC-01; no generated advice
- [x] Usage summary matches logged requests for a scripted session (± rounding)
- [x] Clean-clone Netlify deploy succeeds; `WEEK11_TRAE_COMPLETION.md` committed

> **Week 11 Status**: ✅ **COMPLETED** — All Week 11 Standards Explorer & Usage/Cost Reporting objectives executed and verified.

---

## WEEK 12 — ENRICHMENT (Observability / Hardening Handoff for Standards Explorer + Usage Reporting)
**Theme**: Guided Workflow Support & Production Observability (per 5-week cadence)

### Detailed Tasks (Week 12 Enrichment for Standards Explorer + Usage)
1. Surface standards-explorer usage (search/filter/detail hits, question-chip click-through rates) and cost-per-feature breakdowns in the existing observability panel / API.
2. Harden `/api/v1/standards/*`, `/api/v1/standards/questions`, and `/api/v1/usage/summary` endpoints with retry logic + exponential backoff for catalog lookup and aggregation calls.
3. Enforce filter-range, standard-id format, and date-range validation on both frontend and backend (reject malformed requests early with clear bilingual messages).
4. Write enrichment note:
   ```
   docs/integration/WEEK12_TRAE_STANDARDS_NOTE.md
   ```

### Week 12 Acceptance Criteria
- [x] Explorer usage metrics and per-feature cost breakdowns exposed via observability API
- [x] Retry logic with exponential backoff active on standards, questions, and usage endpoints
- [x] Filter-range, standard-id, and date-range validation enforced on frontend and backend (clear bilingual errors)
- [x] `WEEK12_TRAE_STANDARDS_NOTE.md` committed

> **Week 12 Status**: ✅ **COMPLETED** — All Week 12 Standards Explorer + Usage observability & hardening objectives executed and verified.

---

## WEEK 13 — FINAL LOCK (Standards Explorer & Usage Reporting)
**Theme**: Production Release Hygiene & Backend Security Final Lock

### Detailed Tasks (Week 13 Final Enrichment for Standards Explorer & Usage)
1. Final backend security review of the standards-explorer + usage-reporting surface:
   - Input validation on `/api/v1/standards/*`, `/api/v1/standards/questions`, and `/api/v1/usage/*` payloads/parameters
   - Rate limits on all explorer, questions, and usage endpoints (HTTP 429 + retry guidance)
   - No error leakage of paths / stack / secrets / internal catalog provenance beyond the public response contract
2. Re-verify that PENDING and FATAL_ERROR citations remain fully blocked everywhere (copilot + drafts untouched by explorer).
3. Re-verify the Honest-Framing rule: no verdict/ranking/scoring anywhere in the explorer output; banner and chip labels are intact and bilingual.
4. Confirm clean-clone Netlify deploy still succeeds with `standards_explorer` flag both ON and OFF.
5. Write final lock report:
   ```
   docs/integration/WEEK13_TRAE_STANDARDS_FINAL_LOCK.md
   ```

### Week 13 Acceptance Criteria (Final Lock = Week 5)
- [x] Final backend security review completed (input validation, rate limits, error leakage, secrets handling on explorer + usage endpoints)
- [x] All observability endpoints for Standards Explorer safe for production (no sensitive data beyond published contract)
- [x] Citation blocking (PENDING/FATAL_ERROR) and Honest-Framing banner/labels re-verified and fully functional (no regressions from explorer)
- [x] Clean-clone Netlify deploy succeeds with `standards_explorer` flag both ON and OFF
- [x] `WEEK13_TRAE_STANDARDS_FINAL_LOCK.md` committed

> **Week 13 Status**: ✅ **COMPLETED** — All Week 13 (Final Lock) Standards Explorer & Usage Reporting objectives executed and verified. (Week 13 / Final Lock is the final enrichment week — no further advancement.)

---

## ACCURACY GUARDRAILS
The explorer never scores, ranks, or verdicts on legal sufficiency; it describes and links. Question chips never produce advisory text outside the copilot’s grounded contract.

## ROLLBACK
Flag OFF removes the route, endpoints remain additive; catalog is inert data.
