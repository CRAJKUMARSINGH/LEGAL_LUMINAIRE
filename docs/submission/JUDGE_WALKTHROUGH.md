# Legal Luminaire — Judge Walkthrough Script

**Version:** Week 13 Foundation Lock  
**Date:** 2026-09-12  
**Live Demo URL:** https://legal-luminaire.netlify.app  
**Total Walkthrough Time:** ≤ 5 minutes  

---

## Pre-Requisites

No login required. No API keys. No backend setup.  
Open the live URL in **Chrome or Edge** (latest). Desktop viewport preferred (1280×800+).

---

## Step 0 — Landing (30 seconds)

1. Navigate to **https://legal-luminaire.netlify.app**
2. **Observe:** Hero dashboard loads with "SYNTHETIC / DEMO" banner visible.
3. **Observe:** Bilingual toggle (EN / हिंदी) is visible in the top navigation.
4. **Observe:** Active case defaults to *Hemraj v State* (Case 01 — building collapse forensic defence).

> **Talking Point:** Zero backend required. All demo state is seeded from `case01-data.ts` into
> localStorage on first load (ADR-002: local-first fallback).

---

## Step 1 — Case Intake & Document Drop (45 seconds)

1. Click **"New Case Ingest"** in the left sidebar (or navigate to `/new-case-ingest`).
2. Drag any PDF or image file into the **OmniDropzone** area (or click to upload).
3. **Observe:** File is classified, entities extracted, and a registration preview is shown.
4. **Observe:** PII redaction runs entirely in-browser — no file leaves the client.

> **Talking Point:** Smart document ingest + client-side redaction. Zero telemetry. Demo mode
> shows pre-classified extraction without a real file if no file is dropped.

---

## Step 2 — Case Copilot (Ask Luminaire) (60 seconds)

1. Click **"Copilot"** in the sidebar or navigate to `/copilot`.
2. Ask: *"What are the main defences available in the Hemraj case?"*
3. **Observe:** Response cites only indexed case records. Every citation shows a deep-link
   button (🔗) linking to the pinpoint paragraph source.
4. **Observe:** Response includes a **Verification Report** showing citation tiers
   (COURT_SAFE / VERIFIED / SECONDARY / PENDING).
5. Ask: *"What happened in the World Cup final last week?"*
6. **Observe:** Copilot refuses — out-of-scope, not in case record. Grounding gate enforced.

> **Talking Point:** Read-only, grounded copilot. Cannot invent facts. Every claim is
> traceable to a citation deep-link. (ADR-003: Copilot read-only + grounded.)

---

## Step 3 — Deadline Board & Chronology Studio (60 seconds)

1. Navigate to `/case/case-01/deadlines`.
2. **Observe:** Kanban board with 4 columns: Overdue / This Week / Upcoming / Filed.
3. **Observe:** Each deadline card shows EN + HI label, rule ID, and statutory basis.
4. Switch to **Month Calendar** view — click the calendar toggle.
5. **Observe:** Deadline chips on calendar days; click any chip for full detail.
6. Navigate to `/case/case-01/chronology`.
7. **Observe:** Source-cited timeline entries with confidence tier and deep-link icon.
8. **Observe:** "Needs Dating" amber lane for undated entries — never silently guessed.

> **Talking Point:** Deterministic limitation engine + review-first chronology. Every entry
> requires advocate acceptance before appearing in any export.

---

## Step 4 — Standards Explorer & Forensic FAQ (45 seconds)

1. Navigate to `/standards-index`.
2. Search for *"IS 2250"*.
3. **Observe:** IS 2250:1981 card shown with scope, key clause, and source URL (bis.gov.in).
4. **Observe:** IS 1199:2018 card carries a red warning: "FRESH CONCRETE ONLY — never apply
   to hardened masonry mortar".
5. Navigate to `/forensic-faq`.
6. **Observe:** Plain-language Q&A translating ASTM C1324 and IS 2250 into courtroom language.

> **Talking Point:** IS/ASTM standard guard is hardwired — the system enforces the correct
> standard and will not let an advocate cite IS 1199:2018 for a hardened mortar dispute.

---

## Step 5 — Accuracy Academy (30 seconds)

1. Navigate to `/academy`.
2. Start a scenario (e.g., *"Should I use a PENDING citation?"*).
3. **Observe:** Branching walkthrough with animated trade-off meters:
   - Verification Depth
   - Time Spent
   - Client Safety Risk
4. Choose "Yes, use the PENDING citation" → **Observe:** Red safety-risk meter, "BLOCKED"
   outcome. Cannot proceed to draft.
5. Choose "No, verify first" → **Observe:** Green outcome, draft gate unlocked.

> **Talking Point:** Accuracy Academy teaches the accuracy-first trade-off to advocates
> before they encounter it in a live case. The UX mirrors the real citation gate logic.

---

## Step 6 — Safe Draft Editor & Citation Gate (30 seconds)

1. Navigate to `/case/case-01/safe-draft`.
2. Type a draft paragraph referencing a PENDING citation.
3. **Observe:** CitationGatePanel (right sidebar) immediately flags BLOCKED status with red
   indicator. Draft export button is disabled.
4. Remove the PENDING citation → **Observe:** Gate clears to SAFE. Export unlocked.

> **Talking Point:** The citation gate is live — no draft can be accidentally filed with
> an unverified citation. (Protected file: citation-gate.ts — always wired, never removable.)

---

## Full Workflow Summary

```
Landing → [Case Intake] → [Copilot / Grounded Q&A] → [Deadlines & Chronology]
       → [Standards Explorer] → [Accuracy Academy] → [Safe Draft + Citation Gate]
```

Total time: **< 5 minutes** on live Netlify deployment.

---

## Known Limitations (Honest Disclosure for Judges)

1. **Safari print headers:** CSS `@page` margin boxes render suboptimally in Safari.
   Use Chrome/Edge for print-to-PDF.
2. **Full offline OCR:** Low-res scanned Hindi images require Tesseract backend (demo mode
   uses pre-processed synthetic text).
3. **Phase 2–6 research features** (citation graph, judge analytics, case similarity) are
   behind `false`-default feature flags — not visible in the demo by default.
4. **Real court API integration:** By design (ADR-004), no live Manupatra/SCC Online API
   calls are made. All citations reference verified synthetic records.

---

## Screenshot Checklist (Required for Competition Submission)

| # | File | Route | Captures |
|---|------|-------|---------|
| 01 | `01_home_dashboard.png` | `/` | Hero dashboard + SYNTHETIC banner + bilingual toggle |
| 02 | `02_smart_drop_ingest.png` | `/new-case-ingest` | OmniDropzone + extraction preview |
| 03 | `03_grounded_copilot.png` | `/copilot` | Copilot response + citation deep-links |
| 04 | `04_citation_gate_blocked.png` | `/case/case-01/safe-draft` | BLOCKED state in CitationGatePanel |
| 05 | `05_deadline_board.png` | `/case/case-01/deadlines` | Kanban 4-column + bilingual labels |
| 06 | `06_chronology_studio.png` | `/case/case-01/chronology` | Timeline + needs-dating amber lane |
| 07 | `07_standards_explorer.png` | `/standards-index` | IS 2250 + IS 1199 warning card |
| 08 | `08_accuracy_academy.png` | `/academy` | Trade-off meters + BLOCKED outcome |

---

*Prepared by Kiro — Week 13 Foundation Lock — 2026-09-12*
