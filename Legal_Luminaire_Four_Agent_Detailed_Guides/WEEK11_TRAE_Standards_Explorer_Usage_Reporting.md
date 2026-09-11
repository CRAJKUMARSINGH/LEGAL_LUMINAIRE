# LEGAL LUMINAIRE — 12-WEEK INTEGRATION
## WEEK 11 — STANDARDS EXPLORER & USAGE/COST REPORTING
**Version**: 1.1 | Professional Grade | Accuracy-First | Enriched  
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

---

## WEEK 5 ENRICHMENT STANDARDS

### WEEK 5 VERIFICATION METHODOLOGY

As part of the 5-week enrichment program, Week 11 deliverables must undergo comprehensive verification following Week 5 production lock standards:

**Testing Methodology**:
1. **Endpoint Contract Review**: Static review of `routes_standards.py`, `routes_usage.py` schemas, Pydantic models, and error paths against the documented API contract.
2. **Catalog Provenance Audit**: Walk every `standards_catalog.json` entry to confirm `source_note` points at an existing repo authority (TC-01 matrix or root `docs/` accuracy docs).
3. **Honest-Framing & No-Verdict Audit**: Inspect every explorer output template, banner, question chip label, and summary field to confirm no verdict, ranking, or scoring language is present; only honest descriptions and links.
4. **Pipeline Integration Test**: Exercise Standards route → Search/Filter → Detail → Related case contexts → "Can I?" question chip → Copilot handoff end-to-end with TC-01 and one edge-case scenario.
5. **Usage Aggregation Test**: Run a scripted session with known per-feature request counts; compare `GET /api/v1/usage/summary` output to raw observability logs (± rounding); verify all costs are labelled "approximate".
6. **Bilingual Input & Display Test**: Confirm all scope summaries render in EN+HI; question chips display bilingual; Settings Usage panel labels and error messages are bilingual.
7. **Frontend Accessibility Audit**: Keyboard-only navigation through standards list, filters, detail, question chips, and usage table; ARIA live regions for search loading and errors.
8. **Netlify Clean-Clone Verification**: Fresh clone → install → build → deploy with `standards_explorer` flag ON and OFF; confirm SPA routing, `/standards` route, and Settings usage panel all work with backend optional.

**Testing Coverage**:
- ✅ `GET /api/v1/standards` list + filters (domain, applied-in) payload validation and response shape
- ✅ `GET /api/v1/standards/{standard_id}` detail + related case contexts + related precedents shape
- ✅ `GET /api/v1/standards/questions?case_id=` bilingual question chips, no generated advice outside copilot handoff
- ✅ `GET /api/v1/usage/summary?range=` per-feature {requests, tokens, est_cost} aggregation
- ✅ 100% of catalog entries carry `source_note` pointing to existing repo authority
- ✅ Honest-basis banner renders on list, detail, and question-chip result views
- ✅ PENDING / FATAL_ERROR citations remain fully blocked; explorer never bypasses copilot verification
- ✅ Demo Mode standards entries carry `isDemo` flag and visual badge
- ✅ Usage summary values labelled "approximate" and match observability logs for scripted sessions
- ✅ `/standards` route registered in `src/routes.tsx` and functional under Netlify SPA redirect

---

### BILINGUAL COMPLIANCE VERIFICATION

All user-facing strings in the Standards Explorer and Usage Reporting surfaces must include both English and Hindi labels:

**Standards Explorer Labels**:
- ✅ "Standards Explorer" / "मानक एक्सप्लोरर"
- ✅ "Search standards" / "मानक खोजें"
- ✅ "Filter by domain" / "डोमेन द्वारा फ़िल्टर करें"
- ✅ "Applied in case contexts" / "केस संदर्भों में लागू"
- ✅ "Scope summary (English)" / "सारांश (अंग्रेज़ी)"
- ✅ "Scope summary (Hindi)" / "सारांश (हिंदी)"
- ✅ "Related precedents" / "संबंधित पूर्वनिर्णय"
- ✅ "Governing source" / "शासी स्रोत"
- ✅ "Plain-language summary — not a legal verdict." / "सरल भाषा का सारांश — कानूनी निर्णय नहीं।"

**Question Chip Labels**:
- ✅ "Can I ask the court?" / "क्या मैं अदालत से पूछ सकता/सकती हूँ?"
- ✅ "What standard applies?" / "कौन सा मानक लागू होता है?"
- ✅ "How is this used in my case?" / "मेरे केस में इसका उपयोग कैसे होता है?"

**Usage & Cost Panel Labels**:
- ✅ "Usage & Cost" / "उपयोग और लागत"
- ✅ "Feature" / "फ़ीचर"
- ✅ "Requests" / "अनुरोध"
- ✅ "Tokens (approx.)" / "टोकन (अनुमानित)"
- ✅ "Estimated cost (approx.)" / "अनुमानित लागत (अनुमानित)"
- ✅ "Date range" / "दिनांक सीमा"
- ✅ "Values are approximate estimates based on logged requests." / "लॉग किए गए अनुरोधों के आधार पर मान अनुमानित हैं।"

**Status**: All user-facing strings must include both English and Hindi labels as required, including validation errors, empty states, and loading messages on both surfaces.

---

### SYNTHETIC CASE LABELING VERIFICATION

Demo Mode standards entries, question chips derived from demo cases, and usage reports in Demo Mode must be clearly labeled as SYNTHETIC/DEMO:

**Visual Indicators**:
- ✅ "SYNTHETIC / DEMO" badge on standards detail page when the standard's `applied_in` references only demo cases
- ✅ "SYNTHETIC / DEMO" badge on question chips generated from a Demo Mode active case
- ✅ Demo Mode usage report panel header labelled "SYNTHETIC / DEMO session"
- ✅ Red-accent styling for demo badges matching the existing design system

**Demo Case Flagging**:
- ✅ Catalog entries with `applied_in` limited to demo cases carry `isDemo: true` metadata
- ✅ Question chips served via `GET /api/v1/standards/questions?case_id=` for a demo case include the `isDemo` flag
- ✅ Usage aggregation for Demo Mode sessions is clearly separated; demo requests are excluded from real-case totals
- ✅ No demo-case-only standard is surfaced when the active case is real (non-demo)

**Status**: All synthetic/demo standards, question chips, and usage sessions must be clearly labeled and visually distinguished from real-case output, with data segregation enforced.

---

### NETLIFY COMPATIBILITY VERIFICATION

Standards Explorer routes and Usage Reporting modules must be compatible with existing Netlify SPA routing and the clean-clone build:

**SPA Routing Check**:
- ✅ `/standards` route registered in `src/routes.tsx` and functional under Netlify `/* → /index.html` 200 redirect
- ✅ Settings → "Usage & Cost" panel renders without route navigation (in-panel mount/unmount)
- ✅ Case-context switch on question chip click preserves SPA state (no full reload)
- ✅ Breadcrumb trail and multi-case tabs remain consistent after standards route navigation

**Build Compatibility**:
- ✅ `src/pages/StandardsIndex.tsx` and Settings usage panel use existing UI library (CVA cards, badges, tables, filters, empty states)
- ✅ TypeScript strict mode: all catalog entry, filter response, question chip, and usage summary types are fully typed
- ✅ No build errors or warnings introduced by the standards explorer module
- ✅ Backend endpoints (`routes_standards.py`, `routes_usage.py`) are additive; disabling `standards_explorer` flag leaves no broken imports on frontend
- ✅ `python -m py_compile` passes on `routes_standards.py`, `routes_usage.py`, and catalog schema validation

**Flag Isolation**:
- ✅ `standards_explorer` OFF: `/standards` route guarded, menu entry hidden, question chips tree-shaken, Settings usage panel section hidden
- ✅ Backend endpoints still respond with HTTP 404 (or flag-guard) when feature disabled; no 500 errors
- ✅ Catalog JSON is inert data and does not load or parse when flag OFF

**Status**: All changes must be compatible with existing Netlify configuration, SPA routing, and the clean-clone build with `standards_explorer` flag both ON and OFF.

---

### ACCURACY RULES COMPLIANCE

Standards Explorer and Usage Reporting must never alter accuracy controls, verification tiers, Fact-Fit Gate, citation blocking, or Honest-Framing rules:

**Citation Blocking Re-Verification**:
- ✅ PENDING citations remain fully blocked from all explorer output and copilot handoff
- ✅ FATAL_ERROR citations remain fully blocked; no standard detail or related-precedent panel ever references them
- ✅ Citation tiers (COURT_SAFE, VERIFIED, SECONDARY, PENDING, FATAL_ERROR) unchanged by explorer or usage endpoints
- ✅ `citation_tier` badges and filtering logic untouched by `routes_standards.py` or standards frontend

**Fact-Fit Gate & Verification Tiers**:
- ✅ Fact-Fit Gate scoring unchanged; explorer "Related precedents" links do not trigger any Fact-Fit re-run or override
- ✅ Verification tiers (1/2/3) unchanged; catalog indexing does not alter document verification status
- ✅ Related precedents shown in standards detail already carry their pre-existing Fact-Fit scores (no recalculation)

**Honest-Framing Guarantee (Critical)**:
- ✅ No standard detail, scope summary, or question-chip answer contains a verdict, ranking, scoring, or sufficiency statement
- ✅ All summaries are phrased as honest descriptions; percentiles/metrics are never "verdict-adjacent"
- ✅ "Can I?" questions are answered by surfacing governing rule text + case context link; no advisory text outside copilot handoff
- ✅ Honest-basis banner ("Plain-language summary — not a legal verdict") is present on list, detail, and chip result views

**Proposal-Only / Read-Only Guarantee**:
- ✅ All Standards Explorer endpoints are strictly GET; no POST/PUT/DELETE; catalog is read-only at runtime
- ✅ Usage aggregation is read-only; no usage endpoint writes or mutates logs
- ✅ No explorer or usage call path writes to case store, draft store, citation store, or verification tiers
- ✅ Disabling the feature leaves zero state changes and zero side effects

**Status**: Standards Explorer and Usage Reporting must be completely isolated from accuracy logic, strictly read-only, with Honest-Framing enforced on every output surface.

---

### WEEK 5 ACCEPTANCE CRITERIA ENHANCEMENT

In addition to Week 11 acceptance criteria, Week 5 enrichment requires:

- [ ] Catalog provenance audit completed: every `standards_catalog.json` entry has a `source_note` pointing at an existing repo authority, with pass/fail documented per entry
- [ ] Honest-Framing guarantee proven by code walk-through and a UI audit that asserts zero verdict/ranking/scoring language on every explorer surface
- [ ] All bilingual labels verified end-to-end through standards list → filter → detail → question chip → copilot handoff, plus Settings usage panel
- [ ] SYNTHETIC/DEMO badge and `isDemo` flag maintained across demo-case standards, question chips, and Demo Mode usage reports
- [ ] Netlify clean-clone deploy succeeds with `standards_explorer` flag both ON and OFF
- [ ] Bilingual scope summaries render correctly for all catalog entries; mixed-script and long-Hindi strings wrap without layout breakage
- [ ] Usage summary aggregation matches raw observability logs for a scripted session (± rounding), with all values labelled "approximate"
- [ ] Accessibility compliance verified (keyboard navigation, ARIA live regions, screen-reader announcement of search results and usage refresh)
- [ ] PENDING / FATAL_ERROR citation blocking and Honest-Framing rules re-verified after standards explorer integration
- [ ] WEEK11_TRAE_COMPLETION.md committed with Week 5 verification sections appended

---

### WEEK 5 HAND-OFF NOTES

**For Future Development (Antigravity UX polish → Kiro copilot integration)**:
1. **Catalog Expansion**: Add a pattern-registry file for new standards entries so additions do not require schema refactors; keep `source_note` mandatory for every new entry.
2. **Explorer Comparison View**: Add a side-by-side comparison mode for two standards (e.g., IS vs ASTM) with bilingual diff of scopes, no verdict language allowed.
3. **Question Chip Suggestion Engine**: Extend "Can I?" chips to include per-user suggestions based on standards already opened in the active case, strictly grounded in existing catalog text.
4. **Usage Trend Visualization**: Extend the usage panel to show per-week trend charts and budget-threshold alerts, keeping all numbers labelled approximate.

**For Documentation & Governance Maintenance**:
1. Keep the standards catalog bilingual when new entries are added; maintain an audit trail of `source_note` provenance for every entry.
2. Re-verify the Honest-Framing Guarantee after any change to scope summaries, question chips, or explorer templates; add a regression test that scans output strings for verdict/ranking keywords.
3. Maintain the flag-isolation matrix (`standards_explorer` × other feature flags) and re-test every combination on Netlify before release.
4. Keep Demo Mode standards entries and usage-report segregation in sync with TC-01 synthetic content so benchmark outputs remain stable.

---

### WEEK 5 COMMIT INFORMATION

**Files Changed**: WEEK11_TRAE_Standards_Explorer_Usage_Reporting.md
**Lines Added**: ~180 (Week 5 enrichment sections)
**Lines Removed**: 0

**Suggested Commit Message**:
```
docs(week11): enrich Standards Explorer & Usage Reporting guide to v1.1 + Week5 enrichment standards

- Bump guide version to 1.1 (enriched)
- Add Week 5 verification methodology section (endpoint contract, catalog provenance audit, honest-framing audit, pipeline + usage aggregation + bilingual tests, a11y, Netlify)
- Add bilingual compliance verification section (explorer UI, question chips, usage panel EN+HI labels)
- Add synthetic case labeling verification section (demo standards badges, question chip isDemo, usage segregation)
- Add Netlify compatibility verification section (SPA routing, build/TS strict, standards_explorer flag isolation)
- Add accuracy rules compliance section (citation blocking, Fact-Fit Gate, critical honest-framing guarantee, read-only guarantee)
- Enhance acceptance criteria with Week 5 enrichment-specific checks
- Add hand-off notes for catalog expansion and honest-framing governance maintenance
```
