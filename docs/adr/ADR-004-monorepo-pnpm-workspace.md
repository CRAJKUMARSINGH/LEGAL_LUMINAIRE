# ADR-004: pnpm Workspace Monorepo

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

The project has a React frontend, a FastAPI backend, and shared utility scripts. A monorepo with a single lockfile simplifies dependency management and CI.

## Decision

Use pnpm workspaces with a root `pnpm-workspace.yaml`. The frontend package is `@workspace/legal-luminaire` at `artifacts/legal-luminaire/`. All installs use `pnpm install --frozen-lockfile` to guarantee reproducibility.

## Consequences

- `npm install` must not be used — always `pnpm install`.
- Dev server: `pnpm --filter @workspace/legal-luminaire run dev` (port 5173).
- Build: `pnpm --filter @workspace/legal-luminaire run build`.
- Netlify build command uses the frozen-lockfile form (see `netlify.toml`).
- Node 22 + pnpm 10 are the minimum required versions (enforced in `netlify.toml` build environment).

---
