# ADR-006: Synthetic / Demo Data Only in Repo

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

The repository is public. Real client data, PII, or actual court documents must never be committed.

## Decision

All case data in the repository is synthetic or clearly labelled as demo/training material. The included Hemraj case pack (Case 01) uses a fictionalised version of a real case type for illustrative purposes. Every synthetic document carries a **SYNTHETIC / DEMO** badge in the UI and a disclaimer in file headers.

## Consequences

- No real party names, real FIR numbers, or real court orders may be committed to the repo.
- The disclaimer in `README.md` is mandatory and must not be removed.
- The **SYNTHETIC / DEMO** banner component (`DemoBanner.tsx`) must remain wired to all demo case views.
- CI must not expose any real data through test fixtures.

---
