# ADR-008: Competition Readiness Lock (vibecode.law / Emergent Builder)

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead (Kiro — Week 13 Foundation Lock)  

---

## Context

Legal Luminaire is targeting the vibecode.law Vibeathon / Emergent Builder contest circuit.  
Competition judges evaluate on three axes:
1. **One-click live demo** — clean-clone Netlify deploy, zero friction from landing page to
   full accuracy-gated workflow.
2. **Polish** — no empty states, no residual legacy routes, no broken offline paths.
3. **Submission package** — title, tagline, screenshots, feature list, short video script.

The post-Week-12 repo is technically strong but requires packaging and demo hardening
before it is judge-safe.

## Decision

Weeks 13–16 are locked to the following per-agent scope:

| Week | Agent | Scope |
|------|-------|-------|
| 13 | Kiro | Foundation lock: ADRs, feature-flag matrix, CI gates, netlify.toml hardening, Competition Readiness Spec |
| 14 | Devin | UX/demo polish: one-click demo path, skeleton loaders, empty-state CTAs, SYNTHETIC banner, legacy route cleanup |
| 15 | Trae | Backend/accuracy hardening: copilot grounding, citation deep-links, limitation engine determinism, offline coverage |
| 16 | Antigravity | Release/submission: browser-driven E2E verify, final submission kit, v2.3.0-competition tag, CHANGELOG |

**Non-negotiables for ALL weeks 13–16:**
- Protected files (see `legal-luminaire-protected-files.md`) MUST NOT be adversely modified.
- All accuracy rules (see `accuracy-rules.md`) remain in force.
- Feature flags stay behind `VITE_FF_*` env vars defaulting `false` for new features.
- `pnpm install --frozen-lockfile + typecheck + build` must pass before every merge.
- Bilingual (EN + HI) parity must be maintained on any UI changes.
- SYNTHETIC/DEMO labelling must remain visible on all demo case views.

## Consequences

- **DO NOT PROCEED TO WEEK 14** until `WEEK13_KIRO_COMPETITION_LOCK.md` is committed to
  `docs/enrichment/` and this ADR is merged.
- `docs/submission/` folder is the single source of truth for competition materials.
- Any new feature added in Weeks 14–16 must be routed via `routes.tsx` (additive only,
  never replacing `App.tsx`).
- A judge-walkthrough path document (`JUDGE_WALKTHROUGH.md`) is mandatory output of Week 13.

---
