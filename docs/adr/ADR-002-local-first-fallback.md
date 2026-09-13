# ADR-002: Local-First with localStorage Fallback

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

The app must work as a demo without a running backend. Judges at competition events and lawyers on secure networks cannot be expected to run FastAPI + ChromaDB locally.

## Decision

`CaseContext.tsx` always tries the backend (`localhost:8000`) first, but falls back to localStorage for all case state. The UI must be fully functional for the demo workflow (Case 01 — Hemraj) with zero API keys.

## Consequences

- `CaseContext.tsx` MUST NOT be replaced with a version that only fetches from `localhost:8000`.
- `vite.config.ts` MUST NOT require `PORT` or `BASE_PATH` env vars — the working local dev version is frozen.
- Demo mode seeds Case 01 from `case01-data.ts` into localStorage on first load.
- All 26 synthetic demo cases must be accessible without a backend.

---
