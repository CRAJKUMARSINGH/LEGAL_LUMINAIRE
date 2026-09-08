# ADR-002 — Local-First Redaction Before AI
**Status**: Accepted  
**Date**: 2026-09-08  
**Author**: Kiro (Week 1)  
**Source principle**: Document Redactor showcase (vibecode.law/showcase/document-redactor-and-recompiler-357726)

---

## Context

Legal documents submitted for AI-assisted research or drafting may contain sensitive PII: client names, Aadhaar numbers, PAN, phone numbers, case file numbers, addresses, amounts. Sending unredacted documents to an external AI API (OpenAI, Tavily, Harvey) creates the following risks:

1. **Data-sovereignty risk** — PII leaves the user's device and enters third-party infrastructure governed by the provider's retention policies.
2. **Privilege risk** — Uploading a client's original document to a cloud AI may be interpreted as a waiver of legal professional privilege in some jurisdictions.
3. **Audit trail risk** — If the AI provider logs inputs, the unredacted document becomes part of a log the legal practitioner does not control.

The adopted showcase (Document Redactor) demonstrates that PII detection and redaction can be performed entirely client-side using regex patterns and lightweight NLP — no network call required.

---

## Decision

**Redaction happens in-browser first, before any document content is sent to an AI.**

Specifically:

1. The Redaction Studio feature (`redaction_studio` flag, Week 2) runs entirely in a Web Worker — no document text is transmitted to any server during the redaction step.
2. Only after the user has reviewed and confirmed all redactions is the redacted text eligible for submission to the backend AI pipeline.
3. The backend pipeline must never receive the original (unredacted) document content from the Redaction Studio flow.
4. The existing document upload flow (`/api/v1/cases/upload-document`) is unaffected by this ADR — it handles documents where the user has made an explicit upload decision. This ADR governs only the Redaction Studio workflow.

---

## Consequences

**Positive**
- PII stays on the user's device until they explicitly confirm and export.
- No dependency on a server-side redaction service — the feature works offline.
- Consistent with the "clean-clone demo" principle: the redaction feature is fully functional without any API keys.
- User must confirm each redaction — over-redaction preferred to under-redaction.

**Negative / Trade-offs**
- Browser-side PII detection has lower recall than a fine-tuned NLP model. Users must be informed to review all proposals carefully.
- Web Worker adds complexity to the frontend build (Vite worker config).
- The "confirm every redaction" UX adds friction — acceptable for legal-grade accuracy requirements.

---

## Rollback

Set `redaction_studio` flag to OFF. The existing document upload flow is unaffected.
