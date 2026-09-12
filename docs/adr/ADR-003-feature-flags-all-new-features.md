# ADR-003: All New Features Behind Feature Flags

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

The integration arc (Weeks 1–12) introduced multiple phases of new functionality. Any broken flag-gated feature must not affect the stable core workflow.

## Decision

Every new feature is gated by a `VITE_FF_*` environment variable defaulting to `false`. Core accuracy features (Fact-Fit Gate, verification tiers, Citation Safety System, IS standards guard) are always-on and not flag-gated.

## Consequences

- New pages added to the router go into `App.tsx` only — no wholesale replacement of `App.tsx`.
- Feature flags live in `artifacts/legal-luminaire/.env.local` for development and are documented in `docs/FEATURE_FLAGS_REFERENCE.md`.
- Rollback: set the relevant flag to `false` and restart dev server. No code changes needed.
- CI gate: `pnpm --filter @workspace/legal-luminaire run typecheck` and `pnpm --filter @workspace/legal-luminaire run build` must pass on every merge.

---
