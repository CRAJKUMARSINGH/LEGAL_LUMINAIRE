# ADR-007: CI Gates & Release Lock for Post-Integration State

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead (Kiro — Week 13 Foundation Lock)  

---

## Context

After the 12-week multi-agent integration arc (Weeks 1–12), the codebase carries:
- 8 feature-flagged integration modules (redaction_studio, smart_drop, ask_copilot,
  citation_deeplink, deadline_engine, chronology_studio, standards_explorer, accuracy_academy)
- 3 hybrid feature flags (hybridStandardsValidity, hybridSessionWorkspace, hybridDraftViewer)
- 40+ routes in `routes.tsx`
- Python FastAPI backend with ChromaDB

Any merge that silently breaks typecheck, build, or spec-lint could ship a broken deploy to Netlify without a human noticing.

## Decision

Every merge to `main` must pass these mandatory CI gates, in order:

1. **`pnpm install --frozen-lockfile`** — reproducible dependency graph.
2. **`pnpm run typecheck:libs && pnpm --filter @workspace/legal-luminaire run typecheck`** — zero TypeScript errors.
3. **`pnpm --filter @workspace/legal-luminaire run test`** — Vitest suite (≥ 343 tests) exits 0.
4. **`pnpm --filter @workspace/legal-luminaire run build`** — Vite production bundle exits 0.
5. **`test -d artifacts/legal-luminaire/dist/public`** — publish directory exists.
6. **SPA integrity checks** — `index.html`, `_redirects`, `/assets` directory all present.
7. **Spec-lint** — all 8 spec packs under `.kiro/specs/` have `requirements.md + design.md + tasks.md`.
8. **Flag-type-check** — all 8 integration `VITE_FF_*` flags declared in `featureFlags.ts`.
9. **Python compile** — `python -m compileall artifacts/legal-luminaire/backend` exits 0.
10. **Security audit** — `pnpm audit --audit-level high` and `pip-audit` pass on every Monday.

## Consequences

- No direct pushes to `main` that skip CI.
- A failing typecheck or build is a hard block — no exceptions.
- The CI `ci.yml` workflow is the authoritative gate definition. Any new week's deliverable
  must add its smoke-tests to `ci.yml` before the week is considered complete.
- Release tags follow `v{major}.{minor}.{patch}-{label}` (current: `v2.1.0-enrichment`).
  Week 13 lock tag: `v2.2.0-competition-lock`.
- `netlify.toml` is FROZEN — no env-var changes, no command changes, no publish-dir changes
  without a new ADR.

---
