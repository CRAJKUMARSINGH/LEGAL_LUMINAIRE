# ADR-001 — Feature Flag System
**Status**: Accepted  
**Date**: 2026-09-08  
**Author**: Kiro (Week 1)  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE

---

## Context

The 12-week integration plan introduces eight new features across four AI agents. Each feature carries meaningful risk to the Netlify production demo: an unstable UI component or a broken backend route would compromise the live showcase. We needed a mechanism to ship foundation code incrementally without any experimental feature ever destabilising production.

The existing codebase already used a `featureFlags` object in `src/config/featureFlags.ts` for Phase 3–6 intelligence features (citation graph, case similarity, judge analytics…). That module used a generic `isEnabled()` helper and environment variables.

---

## Decision

Introduce a parallel **integration flag module** at `artifacts/legal-luminaire/src/lib/featureFlags.ts` covering exactly the eight Week 1–12 integration features. The module:

1. **All flags default OFF** — `flag(env.VITE_FF_*, false)`. No integration feature can ever be ON in a clean-clone Netlify deploy unless explicitly opted in via env var.
2. **Typed as `as const`** — the `IntegrationFlags` type is exported; no stringly-typed flag lookups anywhere.
3. **Env-var override pattern** — each flag is overridable via `VITE_FF_<FLAG_NAME>=true` in `.env.local`. No code change required to enable a flag locally.
4. **Bilingual labels map** — `integrationFlagLabels` exports EN + HI display text for every flag, consumed by the `/system/flags` dev route.
5. **`/system/flags` hidden route** — a read-only bilingual inspector page wired in `routes.tsx`, works under the Netlify SPA `/* → /index.html 200` redirect. Production-safe: the page contains no sensitive data.

The existing `src/config/featureFlags.ts` is preserved untouched — it covers the prior Phase 3–6 flags. The two modules are intentionally separate to avoid merge conflicts with prior work.

---

## Flag Registry

| Flag | Default | Week | Feature |
|------|---------|------|---------|
| `redaction_studio` | OFF | W2 | Client-side PII redaction + recompile |
| `smart_drop` | OFF | W3 | Document drop classification + register proposal |
| `ask_copilot` | OFF | W5–8 | Grounded read-only copilot over active case book |
| `citation_deeplink` | OFF | W7 | Every citation links to source PDF page |
| `deadline_engine` | OFF | W9 | Limitation periods, synthetic dates only |
| `chronology_studio` | OFF | W10 | Chronology editor: list, board, calendar |
| `standards_explorer` | OFF | W11 | IS/ASTM/NABL standards browser, plain-language |
| `accuracy_academy` | OFF | W12 | Branching walkthrough + trade-off meters |

---

## Consequences

**Positive**
- Zero-risk production deploys. Netlify always builds with all integration flags OFF unless the deploy context explicitly sets env vars.
- Type-safe flag consumption — missing or misspelled flag names are caught at compile time.
- CI spec-lint and flag-declaration checks (Week 1 CI extension) enforce that every flag remains declared and OFF by default.
- The `/system/flags` page gives developers a single at-a-glance view of flag state in any environment.

**Negative / Trade-offs**
- Two flag modules exist (`src/config/featureFlags.ts` for Phase 3–6 and `src/lib/featureFlags.ts` for Week 1–12 integration). A future consolidation pass should merge them once the integration cycle is complete (post Week 12).
- Flags are build-time only (Vite bakes `import.meta.env.*` at build time). Runtime toggling requires a rebuild; the `/system/flags` page is read-only.

---

## Rollback

Delete `src/lib/featureFlags.ts`, `src/pages/SystemFlagsPage.tsx`, remove the `/system/flags` route from `routes.tsx`, and revert the CI Week 1 section. Zero runtime impact since no feature code consumes these flags yet.
