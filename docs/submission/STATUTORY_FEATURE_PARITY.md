# Legal Luminaire — Statutory Feature Parity Map

**Source:** https://vibecode.law/showcase/Statutory-723173  
**Date:** 2026-09-12  
**Status:** All 12 Statutory key features implemented ✅  

---

## Feature-by-Feature Mapping

| # | Statutory Feature Bullet | Legal Luminaire Implementation | Route | Status |
|---|----------------------|-------------------------------|-------|--------|
| 1 | AI-Powered Legal Research | AI Research Engine + Case Research + 3-axis Fact-Fit Gate + 25+ verified authorities | `/case/:id/ai-research` `/case/:id/case-research` | ✅ Core |
| 2 | AI Legal Drafting | AI Draft Engine + Safe Draft Editor + bilingual (EN+HI) + inline verbatim citations | `/case/:id/ai-draft-engine` `/case/:id/safe-draft` | ✅ Core |
| 3 | Citation Verification | 5-tier system (COURT_SAFE/VERIFIED/SECONDARY/PENDING/FATAL_ERROR) + live Citation Gate + deep-links | `/case/:id/verification` `/case/:id/safe-draft` | ✅ Core |
| 4 | Case Chronology Generation | Chronology Studio — 3-parser, accept/edit/reject, source-cited, Needs-Dating lane | `/case/:id/chronology` | ✅ W10 |
| 5 | Case Management | 26 demo cases, localStorage-first, guided flow, dashboard, documents, upload | `/cases` `/case/:id/dashboard` | ✅ Core |
| 6 | Court & Case Tracking | Court & Case Tracker — hearing history, court orders, next dates, case info | `/court-tracker` | ✅ NEW |
| 7 | Limitation & Deadline Tracking | Deadline Board (Kanban 4-col) + Month Calendar + Limitation Act engine | `/case/:id/deadlines` | ✅ W10 |
| 8 | Document Management | OmniDropzone smart ingest + PII redaction + auto-classification + document library | `/new-case-ingest` `/case/:id/documents` | ✅ Core |
| 9 | Client & Matter Management | Client & Matter page — client profiles, matter status, next dates, localStorage | `/client-matter` | ✅ NEW |
| 10 | Litigation Workflow Automation | Workflow Automation — 4 workflow types (discharge/bail/written/trial), step-by-step | `/litigation-workflow` | ✅ NEW |
| 11 | AI Agents for Legal Workflows | AI Agents Dashboard — 8 dedicated agents with scope, capabilities, launch buttons | `/ai-agents` | ✅ NEW |
| 12 | Integrated Litigation Workspace | Full integrated workspace — 4 sidebar groups, guided flow, Home dashboard | `/` | ✅ Core |

**Bonus (beyond Statutory):**
| + | IS/ASTM Standards Explorer | Forensic Standards Explorer — 50+ IS/ASTM/NABL standards, plain-language courtroom translation | `/standards-index` `/forensic-faq` | ✅ W11 |
| + | Accuracy Academy | Interactive AI trade-off simulation with live meters | `/academy` | ✅ W12 |
| + | Ask Luminaire Copilot | Grounded read-only copilot, citation deep-links, streaming | `/copilot` | ✅ W7–9 |
| + | How To Use Manual | Complete bilingual user manual — all 12 features, step-by-step | `/how-to-use` | ✅ NEW |

---

## New Pages Added (Statutory Parity Sprint)

| File | Route | Feature |
|------|-------|---------|
| `src/pages/CourtCaseTrackerPage.tsx` | `/court-tracker` | Court & Case Tracking |
| `src/pages/ClientMatterPage.tsx` | `/client-matter` | Client & Matter Management |
| `src/pages/LitigationWorkflowPage.tsx` | `/litigation-workflow` | Litigation Workflow Automation |
| `src/pages/AIAgentsDashboardPage.tsx` | `/ai-agents` | AI Agents for Legal Workflows |
| `src/pages/HowToUsePage.tsx` | `/how-to-use` `/manual` | Complete User Manual |

---

## Accuracy Differentiators vs Statutory

Legal Luminaire goes beyond Statutory in one critical dimension: **accuracy enforcement**.

| Dimension | Statutory | Legal Luminaire |
|-----------|---------|----------------|
| Citation verification | Citation verification feature | 5-tier system + hard-block (PENDING/FATAL_ERROR physically prevents export) |
| Standard guard | General research | IS 2250:1981 vs IS 1199:2018 — auto-flagged, never swappable |
| Fact-Fit scoring | Not described | 3-axis gate (0–100): score < 30 = auto-rejected from all output |
| Holdings | Not specified | Verbatim only — paraphrasing forbidden in all code paths |
| Draft gate | Not described | Live Citation Safety Gate — draft export button disabled until SAFE |
| Demo labelling | Not specified | SYNTHETIC/DEMO badge on every view — mandatory by ADR-006 |

---

*Legal Luminaire Statutory Feature Parity Sprint — 2026-09-12*
