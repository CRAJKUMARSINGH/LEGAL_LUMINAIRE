# ADR-005: Bilingual Hindi + English UI and Drafts

**Status:** ACCEPTED — Frozen Week 13  
**Date:** 2026-09-12  
**Deciders:** Project Lead  

---

## Context

Indian district and sessions courts commonly use Hindi. Lawyers drafting discharge applications or bail applications for Rajasthan courts need Hindi output. English output is required for High Court submissions.

## Decision

- The UI provides language toggle (Hindi / English) at a global level.
- Draft generation supports both languages. The output language is set by the case context.
- All synthetic demo cases include both Hindi and English drafts where applicable.
- The included Hemraj case pack has Defence Replies in Hindi (v3–v5).

## Consequences

- Any new page or draft template must respect the active language setting.
- Hindi text must not be hardcoded in non-localised strings — use the translation map.
- Do not remove or disable the language toggle — it is a core differentiator for Indian court practitioners.

---
