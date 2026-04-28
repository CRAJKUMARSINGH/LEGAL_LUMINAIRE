# Hybrid Feature Comparison Matrix

This matrix tracks the zero-loss merge between the production baseline (`OUR_APP`) and the imported improvements from `REFERENCE-APP00`.

**Diff-only inventory (no merges):** see `docs/HYBRID_DIFF_ONLY_REPORT.md` — file-level stats, paths only in REFERENCE vs only in OUR_APP, and reproduce commands.

Status legend:
- `Kept` = existing production behavior preserved
- `Improved` = production behavior preserved with a better implementation
- `New` = new capability from REFERENCE-APP00 added without replacing existing behavior
- `Merged` = both implementations combined
- `Pending` = identified but not fully integrated yet

## Matrix (Wave 1)

| Area | OUR_APP Baseline | REFERENCE-APP00 Input | Final Hybrid Decision | Status | Justification |
|---|---|---|---|---|---|
| Global navigation shell | Multi-group sidebar, case-scoped routing | Enhanced workspace/navigation blocks | Keep OUR_APP shell and absorb new pages into existing nav groups | Merged | Preserves user familiarity while adding high-value modules |
| Case management | Case selector, case-scoped route model | Session-centric workspace pattern | Keep case-scoped architecture; add hybrid session workspace route | Improved | No workflow loss; adds alternate high-productivity surface |
| Draft generation UI | Existing drafting pages and safe drafting | Streaming draft generation panel | Add `DraftGenerator` without removing existing drafting surfaces | New | Enables richer generation UX while retaining legacy drafting |
| Streaming hook | Existing request/response drafting flow | SSE streaming state machine (`researcher` -> `complete`) | Added hook and connected generator | New | Better feedback loop and progressive rendering |
| Standards validity page | Standards page plus forensic rules in docs | One-page printable standards validity note | Added `StandardsValidity` route and screen | New | Court-ready annexure format improves practical usage |
| Draft viewer route | Existing document pages | Dedicated draft viewer | Added route and page; fixed routing mismatch to `/draft/:id` | Improved | Prevents broken navigation and keeps new viewer usable |
| Legacy drafting features | Safe Draft, Notice Reply, Discharge print | Different reference drafting surfaces | Keep all legacy routes untouched | Kept | Zero-loss requirement enforced |
| Infra arbitration browser | Existing infra-arb path and content | No superior replacement identified | Keep production module unchanged | Kept | Existing implementation already complete |
| Demo case browser | Existing 26 demo case browser | No superior replacement identified | Keep production module unchanged | Kept | Production capability is broader |
| Verification/filing workflows | Existing verification and filing checklist | No strict replacement | Keep current flows; no rewrite | Kept | Avoids regression in pre-filing process |
| Error prevention (compile/runtime) | Stable baseline | Imported code had missing icon import and route mismatch | Fixed import and route mapping | Improved | Removes merge-induced defects |

## Imported Files (Current)

- `artifacts/legal-luminaire/src/pages/StandardsValidity.tsx`
- `artifacts/legal-luminaire/src/pages/session-workspace.tsx`
- `artifacts/legal-luminaire/src/pages/draft-viewer.tsx`
- `artifacts/legal-luminaire/src/components/draft-generator.tsx`
- `artifacts/legal-luminaire/src/hooks/use-draft-stream.ts`

## Modified Integration Files

- `artifacts/legal-luminaire/src/App.tsx`
- `artifacts/legal-luminaire/src/components/draft-generator.tsx` (route consistency fix)

## Matrix (Wave 2 — routing parity)

| Area | OUR_APP Baseline | REFERENCE-APP00 Input | Final Hybrid Decision | Status | Justification |
|---|---|---|---|---|---|
| Case Research page | Implemented but not routed | N/A | Expose `/case/:id/case-research` + sidebar | Improved | Removes dead feature; same UI, now reachable |
| Cross-Reference Matrix page | Implemented but not routed | N/A | Expose `/case/:id/cross-reference` + sidebar | Improved | Court matrix view was ship-ready but unreachable |
| AI Research Engine page | Implemented but not routed | N/A | Expose `/case/:id/ai-research` + sidebar | Improved | Full research UI uses `CaseContext`; needs route |
| AI Draft Engine page | Implemented but not routed | N/A | Expose `/case/:id/ai-draft-engine` + sidebar | Improved | Multi-agent draft UI aligned with backend APIs |

## Feature flags (REFERENCE-origin hybrid modules)

Implemented in `artifacts/legal-luminaire/src/config/featureFlags.ts` (Vite `import.meta.env`):

| Flag | Env variable | Default |
|------|----------------|---------|
| hybridStandardsValidity | `VITE_FF_HYBRID_STANDARDS_VALIDITY` | on (`true`) |
| hybridSessionWorkspace | `VITE_FF_HYBRID_SESSION_WORKSPACE` | on (`true`) |
| hybridDraftViewer | `VITE_FF_HYBRID_DRAFT_VIEWER` | on (`true`) |
| hybridDraftStreaming | `VITE_FF_HYBRID_DRAFT_STREAMING` | on (`true`) |

Set to `0`, `false`, `off`, or `no` to disable.

## Pending Waves (Post-Approval Backlog)

1. ~~Add feature flags around reference-origin modules~~ — Done (see table above). Optional: add flags for Wave 2 research routes if rollout needs a kill-switch.
2. Align draft viewer data source with real generated draft IDs/endpoints.
3. Expand automated regression coverage for new hybrid routes and SSE flow.
4. Capture before/after performance and security metrics in a reproducible report.
5. ~~Produce spreadsheet export~~ — See `docs/hybrid_feature_matrix_export.csv` (machine-readable summary).
