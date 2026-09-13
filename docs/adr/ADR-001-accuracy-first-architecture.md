# ADR-001: Accuracy-First Architecture

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

Legal AI tools commonly hallucinate citations, mis-cite standards, and paraphrase holdings. A court filing containing a hallucinated citation or wrong IS standard can cause immediate dismissal or professional embarrassment.

## Decision

All draft output is gated through a multi-layer accuracy stack:
1. **Fact-Fit Gate** — every precedent scored 0–100 on three axes (incident type, evidence type, procedural defect). Score < 30 → auto-rejected.
2. **Verification Tiers** — COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR. PENDING and FATAL_ERROR are hard-blocked from all draft output.
3. **Citation Safety System** — live scan of draft text returns SAFE / WARN / BLOCKED before filing.
4. **IS/ASTM Standards Guard** — IS 1199:2018 (fresh concrete) must never be applied to hardened mortar; IS 2250:1981 + ASTM C1324 are enforced.

## Consequences

- Every new feature must respect all four layers. No feature may bypass them.
- All new citations added to `case01-data.ts` must carry `status`, `statusNote`, `sourceUrl`, `tags`, and `blockedFromDraft: true` by default if PENDING.
- Holdings are verbatim — paraphrasing is forbidden in all code paths.

---
