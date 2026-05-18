# Hybrid Merge Audit and Rollback Plan

## Scope

This document records the active merge of REFERENCE-APP00 capabilities into the production Legal Luminaire codebase with a strict zero-regression policy.

## Completed in Current Wave

- **Wave 2:** Routed four legacy engine pages that were bundled but had no `Route` entries: Case Research, Cross-Reference Matrix, AI Research Engine, AI Draft Engine (`artifacts/legal-luminaire/src/App.tsx`).
- Added reference-origin pages and draft-generation modules:
  - `StandardsValidity`
  - `session-workspace`
  - `draft-viewer`
  - `draft-generator`
  - `use-draft-stream`
- Integrated routes and navigation wiring in `App.tsx`.
- Corrected two merge defects:
  - Missing `AlertCircle` icon import in `App.tsx`
  - Route mismatch corrected from `/drafts/:id` to `/draft/:id`
- Lint check passed for edited files.

## Regression Checklist (Current Wave)

- [x] Existing production routes remain present.
- [x] Existing drafting and safety workflows remain present.
- [x] New hybrid routes resolve in router.
- [x] Merge-introduced route mismatch fixed.
- [x] Merge-introduced icon import issue fixed.
- [ ] Full frontend typecheck run in CI/local shell.
- [ ] End-to-end route smoke tests for all case-scoped pages.
- [ ] API compatibility test for `/api/legal/draft` SSE streaming behavior.

## Feature flags (live)

Vite exposes boolean flags via `artifacts/legal-luminaire/src/config/featureFlags.ts`:

| Intent | Environment variable |
|--------|------------------------|
| Standards validity page + nav | `VITE_FF_HYBRID_STANDARDS_VALIDITY` |
| Hybrid session workspace + streaming panel | `VITE_FF_HYBRID_SESSION_WORKSPACE` |
| Draft viewer route + generator links | `VITE_FF_HYBRID_DRAFT_VIEWER` |
| SSE draft stream in workspace | `VITE_FF_HYBRID_DRAFT_STREAMING` |
| Quick new case dialog (from REFERENCE session dialog, wired) | `VITE_FF_REFERENCE_QUICK_CASE_DIALOG` |

Values `1`, `true`, `yes`, `on` enable; `0`, `false`, `no`, `off` disable. Defaults are **enabled** for local/dev parity.

## Feature Flag Plan (historical note)

REFERENCE-origin surfaces can be toggled with the variables above.

Rollout order:
1. Internal testing only
2. Beta users
3. General availability

## Rollback Strategy

If regression is observed:

1. Disable relevant feature flag(s) immediately.
2. Revert only the affected hybrid module commit(s), not unrelated production functionality.
3. Re-run route smoke tests and drafting sanity tests.
4. Publish hotfix notes and retain incident timeline.

## Deployment Safety Gates

Before production enablement of hybrid modules:

- All route smoke tests pass.
- Draft generation success/failure paths tested.
- Verification and filing checklist pages unaffected.
- No unresolved lint/typecheck failures.
- Rollback toggle path validated in staging.
