# Legal Luminaire — Feature Flag Matrix (Post-Week 13 Freeze)

**Frozen:** 2026-09-12 — Week 13 Kiro Foundation Lock  
**Reference file:** `artifacts/legal-luminaire/src/config/featureFlags.ts`  
**Env file (dev):** `artifacts/legal-luminaire/.env.local`

---

## Legend

| Default | Meaning |
|---------|---------|
| `true (always-on)` | Cannot be turned off — core accuracy feature |
| `true` | On by default (safe, stable, competition-ready) |
| `false` | Off by default — experimental or future feature |

---

## 1. Core Accuracy Features (Always-On — Not Flag-Gated)

These are hardwired `true` and must never be placed behind a `VITE_FF_*` gate:

| Feature | Location | Rule |
|---------|----------|------|
| Fact-Fit Gate (3-axis scoring) | `src/lib/verification-engine.ts` | accuracy-rules.md §2 |
| Verification Tiers (5-tier) | `src/lib/verification-engine.ts` | accuracy-rules.md §5 |
| Citation Safety System (SAFE/WARN/BLOCKED) | `src/lib/citation-gate.ts` | accuracy-rules.md §6 |
| IS 2250:1981 / ASTM C1324 standard guard | `src/lib/case01-data.ts` | accuracy-rules.md §3 |
| PENDING citation hard-block | `src/lib/citation-gate.ts` | accuracy-rules.md §6, protected-files rule 6 |
| Hindi + English bilingual parity | Throughout UI | ADR-005 |
| SYNTHETIC/DEMO labelling | `DemoBanner.tsx` | ADR-006 |
| localStorage fallback | `src/context/CaseContext.tsx` | ADR-002, protected-files rule 3 |

---

## 2. Hybrid / Wave-1 Flags (Default: `true` — Competition-Ready)

| Flag | Env Var | Default | Feature | Status |
|------|---------|---------|---------|--------|
| `hybridStandardsValidity` | `VITE_FF_HYBRID_STANDARDS_VALIDITY` | `true` | Standards Validity page | ✅ Stable |
| `hybridSessionWorkspace` | `VITE_FF_HYBRID_SESSION_WORKSPACE` | `true` | Session Workspace page | ✅ Stable |
| `hybridDraftViewer` | `VITE_FF_HYBRID_DRAFT_VIEWER` | `true` | Draft Viewer page | ✅ Stable |
| `hybridDraftStreaming` | `VITE_FF_HYBRID_DRAFT_STREAMING` | `true` | Streaming draft output | ✅ Stable |
| `referenceQuickCaseDialog` | `VITE_FF_REFERENCE_QUICK_CASE_DIALOG` | `true` | Quick Case Dialog | ✅ Stable |

---

## 3. Eight Integration Flags (Default: `false` — Stable but gated; set true in .env.local for dev/demo)

> These flags correspond to the 8-week integration arc. All default `false` in production.  
> Set `VITE_FF_*=true` in `.env.local` to enable during local development.

| # | Flag | Env Var | Week Delivered | Feature |
|---|------|---------|---------------|---------|
| 1 | `redaction_studio` | `VITE_FF_REDACTION_STUDIO` | Wk 6 | Client-side PII redaction + recompilation studio |
| 2 | `smart_drop` | `VITE_FF_SMART_DROP` | Wk 7 | Smart document drop + auto-register |
| 3 | `ask_copilot` | `VITE_FF_ASK_COPILOT` | Wk 7–9 | Ask Luminaire copilot (grounded, streaming) |
| 4 | `citation_deeplink` | `VITE_FF_CITATION_DEEPLINK` | Wk 9 | Citation deep-links + authority viewer |
| 5 | `deadline_engine` | `VITE_FF_DEADLINE_ENGINE` | Wk 9 | Limitation / procedural deadline engine |
| 6 | `chronology_studio` | `VITE_FF_CHRONOLOGY_STUDIO` | Wk 10 | Source-cited chronology studio |
| 7 | `standards_explorer` | `VITE_FF_STANDARDS_EXPLORER` | Wk 11 | Forensic standards explorer + usage reporting |
| 8 | `accuracy_academy` | `VITE_FF_ACCURACY_ACADEMY` | Wk 12 | Accuracy Academy + branching walkthrough |

---

## 4. Phase 2–6 Research Flags (Default: `false` — Experimental)

| Flag | Env Var | Phase | Feature |
|------|---------|-------|---------|
| `enableAdvancedSearchV2` | `VITE_FF_ENABLE_ADVANCED_SEARCH_V2` | Phase 2 | Enhanced legal search |
| `enableQueryExpansion` | `VITE_FF_ENABLE_QUERY_EXPANSION` | Phase 2 | Legal query expansion |
| `enableEnhancedRanking` | `VITE_FF_ENABLE_ENHANCED_RANKING` | Phase 2 | Multi-factor relevance ranking |
| `enableSearchAnalytics` | `VITE_FF_ENABLE_SEARCH_ANALYTICS` | Phase 2 | Search performance tracking |
| `enableCitationGraph` | `VITE_FF_ENABLE_CITATION_GRAPH` | Phase 3 | Interactive citation graph |
| `enableCitationExtraction` | `VITE_FF_ENABLE_CITATION_EXTRACTION` | Phase 3 | Citation extraction from judgments |
| `enableAuthorityRanking` | `VITE_FF_ENABLE_AUTHORITY_RANKING` | Phase 3 | PageRank-style authority ranking |
| `enableGraphCrossReference` | `VITE_FF_ENABLE_GRAPH_CROSS_REFERENCE` | Phase 3 | Graph-view cross-reference matrix |
| `enableCaseSimilarity` | `VITE_FF_ENABLE_CASE_SIMILARITY` | Phase 4 | Multi-layer case similarity |
| `enableMultiLayerScoring` | `VITE_FF_ENABLE_MULTI_LAYER_SCORING` | Phase 4 | 4-layer scoring engine |
| `enableExplanationGenerator` | `VITE_FF_ENABLE_EXPLANATION_GENERATOR` | Phase 4 | Relevance explanation AI |
| `enableQueryUnderstanding` | `VITE_FF_ENABLE_QUERY_UNDERSTANDING` | Phase 4 | Legal NER + query understanding |
| `enableJudgeAnalytics` | `VITE_FF_ENABLE_JUDGE_ANALYTICS` | Phase 5 | Judge decision pattern analytics |
| `enableCourtAnalytics` | `VITE_FF_ENABLE_COURT_ANALYTICS` | Phase 5 | Court trend analytics |
| `enableOutcomePrediction` | `VITE_FF_ENABLE_OUTCOME_PREDICTION` | Phase 5 | Outcome prediction |
| `enableJudgeProfiles` | `VITE_FF_ENABLE_JUDGE_PROFILES` | Phase 5 | Judge profile cards |
| `enableCourtHeatmaps` | `VITE_FF_ENABLE_COURT_HEATMAPS` | Phase 5 | Court comparison heatmaps |
| `enableGraphVisualization` | `VITE_FF_ENABLE_GRAPH_VISUALIZATION` | Phase 6 | D3/Cytoscape citation graph |
| `enableInteractiveGraph` | `VITE_FF_ENABLE_INTERACTIVE_GRAPH` | Phase 6 | Interactive graph (zoom/pan/filter) |
| `enableTimelineMode` | `VITE_FF_ENABLE_TIMELINE_MODE` | Phase 6 | Citation timeline evolution |
| `enableTopicClustering` | `VITE_FF_ENABLE_TOPIC_CLUSTERING` | Phase 6 | Topic clustering + community detection |
| `enableInfluentialPath` | `VITE_FF_ENABLE_INFLUENTIAL_PATH` | Phase 6 | Influential citation path finder |
| `enableNeo4jIntegration` | `VITE_FF_ENABLE_NEO4J_INTEGRATION` | Future | Neo4j graph DB integration |
| `enableCollaboration` | `VITE_FF_ENABLE_COLLABORATION` | Future | Real-time collaboration |
| `enableVectorSearch` | `VITE_FF_ENABLE_VECTOR_SEARCH` | Future | Vector DB semantic search |

---

## 5. Week 10–12 Specific Flags (Default: `true` — Always-on post-integration)

| Flag | Env Var | Default | Feature |
|------|---------|---------|---------|
| `enableChronologyStudio` | `VITE_FF_ENABLE_CHRONOLOGY_STUDIO` | `true` | Chronology Studio (Wk 10) |
| `enableDeadlineBoard` | `VITE_FF_ENABLE_DEADLINE_BOARD` | `true` | Deadline Board (Wk 10) |
| `enableMonthCalendar` | `VITE_FF_ENABLE_MONTH_CALENDAR` | `true` | Month Calendar (Wk 10) |
| `accuracyAcademy` | `VITE_FF_ACCURACY_ACADEMY` | `true` | Accuracy Academy (Wk 12) |

---

## 6. Rollback Procedure

1. Set the offending `VITE_FF_*` flag to `false` in Netlify environment variables (UI → Site settings → Environment variables).
2. Trigger a new deploy (no code change needed).
3. The feature disappears from all routes and UI without a code revert.

**Core accuracy features cannot be rolled back** — they are always-on by design (ADR-001).

---

## 7. Adding a New Flag (Checklist for Weeks 14–16)

- [ ] Add `enableXxx: isEnabled(env.VITE_FF_ENABLE_XXX, false)` to `src/config/featureFlags.ts`
- [ ] Add `VITE_FF_ENABLE_XXX=false` to `.env.local` comment block
- [ ] Add row to this matrix
- [ ] Gate the new route in `routes.tsx` with `{featureFlags.enableXxx && <Route .../>}`
- [ ] Add CI smoke-test to `.github/workflows/ci.yml`

---

*Week 13 — Kiro Foundation Lock — 2026-09-12*
