# LEGAL LUMINAIRE — 12-WEEK FEATURE INTEGRATION FORMULA
**Package Version**: 1.0  
**Date**: 8 September 2026  
**Purpose**: Professional-grade, incremental, accuracy-first integration of the best verified features from six vibecode.law showcase projects into Legal Luminaire over 12 weeks — one primary agent per week, rotating **Kiro → Devin → Trae → Antigravity**.

**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE

### ⚠️ LIVE REPO STATE (re-verified 8 September 2026 via GitHub API)
- Your enrichment commits are on working branches, **not on main**: `devin/1788707153-week1-devin-audit` and `devin/1788709797-week2-enrichment` carry repo-root `docs/enrichment/WEEK1_DEVIN_AUDIT.md` (16.3 KB) and `docs/enrichment/WEEK2_DEVIN_COMPLETION.md` (9.4 KB). Main HEAD = `5c25f15` (2026-05-25, Harvey AI integration).
- **Prerequisite before Week 1**: merge both enrichment branches into main (and verify the clean-clone Netlify deploy after the merge).
- Structure facts now baked into every week file: flat `backend/api/routes_*.py` convention (registered in `backend/main.py`), pages-based frontend with single `src/routes.tsx` (no `src/features/` yet — week files create it), repo-root `docs/` for `integration/` and `submission/`, `.kiro/` at root, TC-01 at `backend/uploaded_cases/TC-01/`, 343-test Vitest suite from `7182915` must stay green.

---

## 1. Source Projects (all features verified from showcase pages, 8 Sept 2026)

> **Provenance note**: all six showcase pages below were fetched live on 8 September 2026 and every “verified” quote in this package traces to text actually present on those pages. Where a guide adapts rather than copies a pattern (e.g., Accuracy Academy scales the source’s 7 scenarios / 5 meters down to 3 / 3; the Recompiler is credited to the Redactor project’s paired name rather than quoted page text), the adaptation is labelled inside the relevant week file.

| # | Project | Link | Verified essence |
|---|---------|------|------------------|
| S1 | **Vaadhan** | https://vibecode.law/showcase/vaadhan-723173 | Integrated litigation workspace: AI research, drafting, citation verification, **case chronology generation**, **limitation & deadline tracking**, case/document management |
| S2 | **Vyaas Docket** | https://vibecode.law/showcase/vyaas-docket-508140 | **Document Drop** (AI proposes matter/folder/name, one-click confirm, nothing filed until approved), **new matter from documents**, **"Ask Vyaas" docket copilot** that never invents matters/dates/orders, research with **every cited case linked to its source PDF**, **per-feature cost tracking**, local-first |
| S3 | **AI Law: A Simulation** | https://vibecode.law/showcase/ai-law-a-simulation-in-working-with-ai-495228 | Branching scenario training with **visible trade-off meters**; every choice has a cost; teaches *judgment* about when to trust AI (**7 scenarios & 5 meters per module** in the source; adopted compactly) |
| S4 | **Document Redactor & Recompiler** | https://vibecode.law/showcase/document-redactor-and-recompiler-357726 | **ALL redaction done locally in the browser — nothing goes to an AI**; protect client PII before any LLM sees a document |
| S5 | **Local Law Explorer** | https://vibecode.law/showcase/local-law-explorer-812278 | Browsable law corpus, **plain-language report cards phrased as honest percentiles, never verdicts**, everyday **"Can I?" questions** answered by surfacing the actual rules |
| S6 | **vibecode-submit skill** | https://vibecode.law/showcase/skill-for-submitting-a-project-to-vibecodelaw-525107 | Agent skill that drafts every showcase submission field from a repo and captures **real** screenshots; **never submits for you, never fabricates a screenshot** |

---

## 2. Feature Selection — ADOPT vs NEGLECT (the "neglect inferior features" cut)

| Source | Feature | Verdict | Reason (evidence-based) |
|--------|---------|---------|--------------------------|
| S4 | Local in-browser PII **Redaction Studio** | ✅ ADOPT (W2) | S4's core principle ("nothing goes to an AI") matches Legal Luminaire's local-first, privacy-first identity; strengthens §8 Privacy of the Vibeathon participant guide |
| S4 | **Recompiler** (restore from mapping key) | ✅ ADOPT (W2) | Cheap, reversible, pairs with redaction |
| S2 | **Smart Document Drop** (propose case/folder/name → one-click confirm) | ✅ ADOPT (W3) | Direct upgrade of existing ingestion; "nothing is filed until the user approves" fits Fact-Fit Gate philosophy |
| S2 | **New Matter from Documents** (auto-classify case type, pre-fill register, first diary entry) | ✅ ADOPT (W3) | Removes manual case-setup friction; every field stays editable |
| S2 | **"Ask Luminaire" copilot** over the live case book | ✅ ADOPT (W5–W8) | Flagship Vyaas feature; grounded Q&A ("it never invents matters, dates or orders") is the perfect copilot contract for an accuracy-first app |
| S2 | **Citation deep-links to source PDFs** | ✅ ADOPT (W7) | Extends Fact-Fit Gate + Verification Report; every citation becomes click-to-source |
| S1 | **Limitation & deadline engine** | ✅ ADOPT (W9) | Verified Vaadhan feature; pure-computation, synthetic-data-safe |
| S1 | **Chronology generation** from case documents | ✅ ADOPT (W10) | Extends the existing timeline + cross-reference matrix |
| S2 | **Limitation board + calendar view** | ✅ ADOPT (W10) | UI layer for W9 engine |
| S5 | **Standards Explorer** (browse laws/standards, plain-language, honest non-verdict framing, "Can I?" question surfacing) | ✅ ADOPT (W11, adapted to Indian IS-standards/statutes) | Interaction pattern adopted; US corpus rejected |
| S2 | **Per-feature usage/cost reporting** | ✅ ADOPT (W11) | Extends the existing observability baseline |
| S3 | **Accuracy Academy** walkthrough (branching + trade-off meters) | ✅ ADOPT (W12, one compact module) | Teaches *when to trust AI output* — reinforces Fact-Fit Gate brand story for judges |
| S6 | **Showcase Submission Kit** (repo → drafted fields + real screenshots) | ✅ ADOPT (W12) | Directly serves the Vibeathon submission (11 Sept 2026, 5:00 PM IST); "never submits for you, never fabricates" is kept |
| S1 | Client & matter management (CRM) | ❌ NEGLECT | Firm-admin bloat; dilutes LL's court-document focus; duplicates scope |
| S2 | Cause list, team chat, user management | ❌ NEGLECT | Multi-user firm infrastructure conflicts with single-machine local-first demo; adds auth surface with no demo value |
| S2 | Live Delhi High Court case-status lookup | ❌ NEGLECT | Third-party court API breaks offline/local-first + clean-clone Netlify demo; risks real-case data in a synthetic-only product |
| S2 | Scanned-document transcription | ❌ NEGLECT (already exists) | LL already ingests images/FSL reports/handwritten notes via OCR — duplication |
| S3 | Group session mode + anonymized analytics | ❌ NEGLECT | Training-firm delivery infrastructure; out of scope for a case-prep tool |
| S5 | LOCUS-v1 US corpus, choropleth map, cross-town percentiles | ❌ NEGLECT | US municipal corpus is irrelevant to Indian courts; only the interaction patterns are adopted |
| S2 | Research corpus (12M judgments, Open India Law / Vaquill CC BY 4.0, local SQLite FTS indexing) | ❌ NEGLECT | LL already ships research (`backend/rag/law_db.json`, `api/routes_search.py`, `api/routes_auto_research.py`); a 12M-corpus local index conflicts with the clean-clone Netlify demo and adds heavy runtime deps; the W5–W8 copilot covers grounded research over the case book |

---

## 3. Tool Rotation (one primary per week, by real tool strengths)

| Agent | Verified strength used for | Weeks (primary) |
|-------|---------------------------|------------------|
| **Kiro** (AWS Kiro) | Spec-driven specs, hooks, type safety, CI | **W1, W5, W9** |
| **Devin** (Cognition Devin) | Autonomous PR-scale refactors, multi-file UX | **W2, W6, W10** |
| **Trae** (ByteDance Trae) | IDE-level precision edits, backend pipeline | **W3, W7, W11** |
| **Antigravity** (Google Antigravity) | Agent-manager, browser-driven verification, release | **W4, W8, W12** |

---

## 4. Week Map

| Week | Primary | Theme | Source |
|------|---------|-------|--------|
| 1 | Kiro | Integration Foundation: Specs, Feature Flags, CI, ADRs | — |
| 2 | Devin | Redaction & Recompilation Studio | S4 |
| 3 | Trae | Smart Document Drop & Auto-Register | S2 |
| 4 | Antigravity | Intake Chain Accuracy & UX Audit | S4+S2 |
| 5 | Kiro | Ask Luminaire — Copilot Foundation & Guardrails | S2 |
| 6 | Devin | Ask Luminaire — Copilot UX & Streaming | S2 |
| 7 | Trae | Ask Luminaire — Grounding & Citation Deep-Links | S2+S1 |
| 8 | Antigravity | Copilot Accuracy Audit & Trust Polish | S2 |
| 9 | Kiro | Limitation & Deadline Engine | S1+S2 |
| 10 | Devin | Chronology Studio, Deadline Board & Calendar | S1+S2 |
| 11 | Trae | Standards Explorer & Usage/Cost Reporting | S5+S2 |
| 12 | Antigravity | Accuracy Academy, Submission Kit & Release Lock | S3+S6 |

---

## 5. How to Use

1. Give **each agent only its own week file** (this README + its file). Every week file carries a "LIVE REPO NOTES" block with paths verified against the current tree.
2. Execute week by week in the rotation above. Supporting agents only do what their week file lists.
3. Every week ends by committing its completion file under `docs/integration/`.
4. Every new feature ships behind a **feature flag** (W1 creates them) so the Netlify production demo stays stable at all times.

## 6. Non-Negotiable Constraints (All Agents, All Weeks)

- Never allow **PENDING** or **FATAL_ERROR** citations into any draft or copilot output.
- Never introduce real case data. Everything stays **SYNTHETIC / DEMO**-labelled.
- All UI stays **bilingual (Hindi + English)**.
- Root `netlify.toml`, `_redirects`, and artifact-level production files stay committed and functional after every week; clean-clone Netlify deploy must always succeed.
- Accuracy rules (`docs/accuracy-governance/ACCURACY_RULES.md`), Fact-Fit Gate, verification tiers (COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR), and IS-standard logic are untouched.
- Conventional commit messages only. `pnpm install --frozen-lockfile` + typecheck + build before every commit.

## 7. Feature Flags (created in W1, consumed W2–W12)

`redaction_studio`, `smart_drop`, `ask_copilot`, `citation_deeplink`, `deadline_engine`, `chronology_studio`, `standards_explorer`, `accuracy_academy`

## 8. Success Definition (end of Week 12)

- Clean clone → Netlify deploy → working bilingual demo with all flags ON.
- A lawyer can: redact locally → drop documents → get a proposed case register → confirm → ask the case-book copilot with source-linked citations → track limitation deadlines → generate a chronology → explore applicable standards → print court-ready drafts — all synthetic, all verified.
- `docs/integration/ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md` committed; release tagged `v2.2.0-integration`.
- Showcase Submission Kit has produced a complete vibecode.law submission folder.

**Legal Luminaire** — *Stop researching. Start winning.* (Accuracy first. Always.)
