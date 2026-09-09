# Vibecode.law Project Showcase — Draft Submission Package

**Project Name**: Legal Luminaire  
**Repository**: [https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE](https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE)  
**Live Production URL**: [https://legal-luminaire.netlify.app](https://legal-luminaire.netlify.app)  
**Submission Window Deadline**: **11 September 2026, 5:00 PM IST**  
**Submission Form Reference**: [vibecode.law/showcase](https://vibecode.law/showcase)

---

## 1. Project Title
**Legal Luminaire: Accuracy-First Indian Legal AI & Forensic Defense Suite**

---

## 2. One-Line Pitch
*An accuracy-first legal AI workbench for Indian advocates that enforces zero-hallucination citation gating, forensic standards verification, and bilingual case analysis across 26 synthetic trial scenarios.*

---

## 3. Executive Summary (150–200 Words)
Legal Luminaire is an accuracy-first legal AI workbench engineered specifically for Indian trial litigation, criminal defense, and forensic evidence analysis. Built on the core principle that "no legal draft should reach court without deterministic verification," the platform rejects opaque generative claims in favor of verifiable judicial workflows. 

At its core, Legal Luminaire integrates a grounded Case Copilot bounded strictly to indexed evidentiary books, the Fact-Fit Gate citation verifier, and the Citation Deep-Link viewer connecting every precedent to its pinpoint paragraph. For complex trials, the platform offers Chronology Studio with source-cited timelines, an automated Limitation Deadline Engine, and a Forensic Standards Explorer translating 50+ IS, ASTM, and NABL ISO/IEC 17025 laboratory protocols into plain-language courtroom arguments. 

Complementing the workbench is the Accuracy Academy, an interactive simulation teaching advocates how to evaluate AI trade-offs across speed, verification depth, and client safety. With 100% client-side PII redaction, full English-Hindi bilingual parity, and a comprehensive suite of 26 synthetic trial cases, Legal Luminaire bridges cutting-edge agentic workflows with uncompromising courtroom ethics.

---

## 4. Key Features & Capabilities

1. **Grounded Case Copilot (`/copilot`)**: Read-only conversational agent bounded strictly to active case records; refuses queries outside the factual record and generates pinpoint-cited responses.
2. **Fact-Fit Gate & Pinpoint Citation Verifier (`/verification`)**: Deterministic multi-point citation validator checking reporter codes, court jurisdiction, and paragraph relevance with automated blocking of unverified citations.
3. **Smart Ingest & Client-Side Redaction (`/new-case-ingest`)**: Secure in-browser document classification and PII redaction with zero external telemetry.
4. **Chronology Studio (`/case/:id/chronology`)**: Source-cited multi-track event timelines with list, Kanban, and calendar visualizations.
5. **Procedural Limitation & Deadline Engine (`/case/:id/deadlines`)**: Statutory deadline calculator applying Indian Limitation Act exclusion rules and court vacation calendars.
6. **Forensic Standards Explorer (`/standards-index`, `/forensic-faq`)**: Searchable database of 50+ forensic testing standards (BIS, ASTM, NABL) with plain-language courtroom translation.
7. **Accuracy Academy (`/academy`)**: Interactive branching simulation with live trade-off meters (Verification Depth, Time Spent, Client Safety) based on verified AI Law mechanics.
8. **26 Synthetic Demo Case Ecosystem (`/demo-browser`)**: Complete end-to-end trial dossiers covering criminal defense, electronic evidence (Sec 65B), commercial arbitration, and ballistics.

---

## 5. Practice Area Tags
- Criminal Defense & Trial Advocacy
- Forensic Science & Electronic Evidence (Section 65B BSA / IEA)
- Commercial & Infrastructure Arbitration
- Constitutional & Writ Jurisprudence
- Legal Tech Ethics & AI Governance
- Bilingual Legal Practice (English / हिंदी)

---

## 6. AI-Assisted Development Disclosure Table

| Agent / Tool | Primary Role & Responsibilities | Underlying Models | Human vs. AI Contribution |
|---|---|---|---|
| **Human Architect & Lead Counsel** | Domain requirements, Indian statutory rules, forensic test design, code review, quality gate | N/A (Human) | 100% human oversight, final production approval |
| **Google Antigravity** | Architecture management, Copilot integration, Week 12 Accuracy Academy, submission kit, final release gate | Gemini 1.5 Pro / Claude 3.5 Sonnet | 45% AI generation / 55% Human guidance & test verification |
| **Kiro** | Spec authoring, ADR design, feature flag architecture, initial prototype foundations | Claude 3.5 Sonnet | 50% AI generation / 50% Human review |
| **Devin (Cognition)** | Full-stack test harness setup, Vitest suite expansion (340+ tests), refactoring automation | GPT-4o / Claude 3.5 Sonnet | 60% AI execution / 40% Human prompt steering |
| **Trae (ByteDance)** | UI component modularization, Tailwind layout refinement, accessibility audit | Claude 3.5 Sonnet | 50% AI scaffolding / 50% Human styling polish |

---

## 7. Accuracy, Reliability & Safety Framework

- **Deterministic Citation Gating**: Draft exports are physically blocked if citations carry a `PENDING` or `FATAL_ERROR` status.
- **Pinpoint Deep-Linking**: Every citation rendered in Copilot responses or draft pleadings contains a direct URL / page offset link to the source document.
- **No Autonomous Legal Conclusions**: System outputs are strictly structured as evidentiary cross-check aids, never as ungrounded legal counsel.
- **Synthetic-Only Data Assurance**: All 26 demo cases, names, FIR details, and dates are completely synthetic, preventing PII contamination.

---

## 8. Privacy & Confidentiality Statement

- **Zero External Telemetry**: PII redaction and document text extraction execute entirely within the client's web browser memory.
- **Stateless Verification**: No case files, pleadings, or client notes are uploaded to third-party model providers without explicit user consent.
- **Local Persistence Option**: Session workspace and chronology edits persist in local browser storage, allowing completely offline operation.

---

## 9. Real Screenshot Checklist

*All captures taken from live Netlify deployment ([https://legal-luminaire.netlify.app](https://legal-luminaire.netlify.app)) on 8–9 September 2026:*

| File Name | Description | Captured View | Verified Real Capture |
|---|---|---|:---:|
| `01_home_dashboard.png` | Main Hub with bilingual toggle and case stats | `/` | [x] |
| `02_smart_drop_ingest.png` | Smart document ingest and auto-classification | `/new-case-ingest` | [x] |
| `03_grounded_copilot_citations.png` | Grounded Copilot response with yellow deep-links | `/copilot` | [x] |
| `04_chronology_studio.png` | Chronology Studio 3-column timeline editor | `/case/demo-1/chronology` | [x] |
| `05_deadline_board.png` | Kanban board with limitation period countdowns | `/case/demo-1/deadlines` | [x] |
| `06_standards_explorer.png` | Standards Explorer with plain-language forensic guide | `/standards-index` | [x] |
| `07_accuracy_academy.png` | Accuracy Academy with animated trade-off meters | `/academy` | [x] |
