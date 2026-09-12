<div align="center">

# ⚖️ Legal Luminaire

### *The AI legal workbench that blocks wrong citations before they reach court.*

**Accuracy-first · Zero hallucinations · Hindi + English · 26 demo cases · No API key needed**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://legal-luminaire.netlify.app)
[![GitHub Stars](https://img.shields.io/github/stars/CRAJKUMARSINGH/legal-luminaire?style=for-the-badge&logo=github)](https://github.com/CRAJKUMARSINGH/legal-luminaire/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()
[![Made for India](https://img.shields.io/badge/Made_for-Indian_Courts-FF9933?style=for-the-badge)]()

</div>

---

## ✨ What Makes This Brilliant?

Indian advocates waste hours on research that hallucinates citations, misapplies IS standards, and paraphrases holdings that are wrong in court.
**Legal Luminaire fixes this at the source.**

Every precedent is scored on a **3-axis Fact-Fit Gate** before it reaches your draft. PENDING citations are **physically blocked** — the export button stays disabled until every citation clears verification. The system knows that IS 1199:2018 is for *fresh concrete*, not masonry mortar — and it will flag it automatically.

Built by **Rajkumar Singh Chauhan** (Senior Counsel + Civil Engineer, 30+ years in Indian courts), every accuracy rule in this app is a scar from a real case.

> *"I built this because I needed it. Every accuracy rule is a scar from a real case."*
> — Rajkumar Singh Chauhan

---

## 🚀 Key Features

- 🎯 **Fact-Fit Gate** — scores every precedent 0–100 on 3 axes; score < 30 = auto-rejected
- 🔒 **5-Tier Citation Verification** — COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR
- 🚫 **Hard Citation Block** — PENDING/FATAL_ERROR citations disable the draft export button
- �� **IS Standard Guard** — IS 2250:1981 (masonry mortar) vs IS 1199:2018 (fresh concrete) enforced
- 📝 **Verbatim Holdings** — paraphrasing is forbidden in all code paths
- ⚖️ **Bilingual Drafts** — Hindi + English discharge applications, bail, written submissions
- 🕐 **Chronology Studio** — source-cited timeline with accept/reject workflow
- 📅 **Deadline Engine** — Limitation Act 1963 rules + court vacation exclusions
- 🔬 **Standards Explorer** — 50+ IS/ASTM/NABL standards in plain courtroom language
- 🤖 **8 AI Agents** — Research, Drafting, Citation, Chronology, Deadlines, Standards, Copilot, Academy
- 🏛️ **Court & Case Tracking** — hearing history, orders, next dates
- 👥 **Client & Matter Management** — client profiles, matter status, localStorage-private
- 📋 **Pre-Filing Checklist** — 12-point advocate sign-off on every draft
- 🎓 **Accuracy Academy** — interactive simulation teaching AI trade-offs
- 📁 **26 Synthetic Demo Cases** — criminal, civil, NDPS, NI Act, arbitration, infrastructure

---

## 📸 Demo / Screenshots

> 📹 **Recommended**: Record a 20–40s screen recording at https://legal-luminaire.netlify.app and add it here as a GIF.

| Home + OnboardingHero | Safe Draft + Citation Gate | Deadline Board |
|:---:|:---:|:---:|
| ![Home](docs/screenshots/01_home.png) | ![Citation Gate](docs/screenshots/04_citation_gate.png) | ![Deadlines](docs/screenshots/05_deadline_board.png) |
| *What is this / how to use panel* | *BLOCKED state — export disabled* | *Kanban 4-column* |

**Screenshot checklist** (capture from live Netlify deploy):
- [ ] `docs/screenshots/01_home.png` — Home page with OnboardingHero
- [ ] `docs/screenshots/02_demo_cases.png` — 26 Demo Cases browser
- [ ] `docs/screenshots/03_copilot.png` — Grounded Copilot + citation deep-links
- [ ] `docs/screenshots/04_citation_gate.png` — BLOCKED state in CitationGatePanel
- [ ] `docs/screenshots/05_deadline_board.png` — Kanban + bilingual labels
- [ ] `docs/screenshots/06_chronology.png` — Chronology Studio timeline
- [ ] `docs/screenshots/07_standards.png` — Standards Explorer IS 2250 card
- [ ] `docs/screenshots/08_accuracy_academy.png` — Trade-off meters

---

## ⚡ Quick Start

**Option A — Live demo (no setup needed)**

```
https://legal-luminaire.netlify.app
```
Click **"Try 26 Demo Cases"** → select a case → explore the full workflow. No login, no API key.

---

**Option B — Run locally (< 90 seconds)**

**Prerequisites:** Node.js 22+, pnpm 10+, Git

```bash
# 1. Clone
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire

# 2. Install
pnpm install

# 3. Run
pnpm --filter @workspace/legal-luminaire run dev
```

Open **http://localhost:5173** → click **"Load Demo Case (Hemraj)"** → the full accuracy-first workflow loads instantly.

**Option C — Full stack with AI backend**

```bash
cd artifacts/legal-luminaire/backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Add OPENAI_API_KEY and TAVILY_API_KEY
uvicorn main:app --reload
```

**Option D — Docker (everything at once)**

```bash
docker compose up --build
```

---

## 📖 How to Use

### The 5-Step Accuracy-First Workflow

| Step | What you do | Route |
|------|-------------|-------|
| **1. Intake** | Upload FIR, charge-sheet, FSL report | `/intake` or `/new-case-ingest` |
| **2. Research** | AI searches 25+ authorities; Fact-Fit Gate scores each | `/case/:id/case-research` |
| **3. Verify** | Check citation tiers; resolve PENDING before proceeding | `/case/:id/verification` |
| **4. Draft** | Bilingual draft with verbatim holdings; Citation Gate live | `/case/:id/safe-draft` |
| **5. Review** | Pre-filing checklist + Verification Report | `/case/:id/filing-checklist` |

### User Manual

| Format | Link |
|--------|------|
| 📱 Interactive (in-app) | [/how-to-use](https://legal-luminaire.netlify.app/how-to-use) |
| 🖨️ Print / Save as PDF | [/user-manual-pdf](https://legal-luminaire.netlify.app/user-manual-pdf) → File → Print → Save as PDF |
| 📋 Judge Walkthrough | [docs/submission/JUDGE_WALKTHROUGH.md](docs/submission/JUDGE_WALKTHROUGH.md) |

### Navigation (sidebar groups)

```
Case Setup   → Home · All Cases · 26 Demo Cases · Intake · Dashboard
Research     → Case Law · AI Research · Standards · Copilot · Citation Explorer
Drafting     → AI Draft Engine · Safe Draft Editor · Discharge App · Oral Arguments
Review       → Verification · Filing Checklist · Accuracy Academy · AI Agents · How To Use
```

---

## 🔧 Configuration

All feature flags default to `false` — experimental features never break the stable core.

```bash
# Enable integration features in .env.local
VITE_FF_ASK_COPILOT=true          # Grounded case-book copilot
VITE_FF_CHRONOLOGY_STUDIO=true    # Chronology Studio
VITE_FF_DEADLINE_ENGINE=true      # Deadline & limitation engine
VITE_FF_STANDARDS_EXPLORER=true   # IS/ASTM standards browser
VITE_FF_ACCURACY_ACADEMY=true     # Accuracy Academy simulation
VITE_FF_CITATION_DEEPLINK=true    # Citation deep-links to source PDFs
VITE_FF_REDACTION_STUDIO=true     # Client-side PII redaction
VITE_FF_SMART_DROP=true           # Smart document classification
```

Dev tools: navigate to `/system/flags` (hidden route) to toggle flags at runtime.

Full flag reference: [`docs/FEATURE_FLAGS_MATRIX_W13.md`](docs/FEATURE_FLAGS_MATRIX_W13.md)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS v4 · Radix UI · Wouter |
| **State** | Context API + localStorage (no backend for demo mode) |
| **Charts** | Recharts · Recharts Radar |
| **Backend** | FastAPI · CrewAI · LangChain · ChromaDB (RAG) |
| **Deploy** | Netlify (primary) · Vercel · Docker Compose |
| **Testing** | Vitest (343 tests) · Python compileall |
| **CI** | GitHub Actions (typecheck + build + test + security audit) |

---

## 🗺 Roadmap

- [ ] **Week 14 (Devin)** — skeleton loaders, empty-state CTAs, SYNTHETIC banner on all pages
- [ ] **Week 15 (Trae)** — copilot grounding hardening, offline stub coverage for all 26 cases
- [ ] **Week 16 (Antigravity)** — v2.3.0-competition release, full submission kit, demo video
- [ ] **Phase 2** — citation graph visualization, case similarity engine, judge analytics
- [ ] **Phase 3** — e-Courts India API integration, court-specific stamp formatters
- [ ] **Phase 4** — on-device SLM (WebGPU + Gemma-2B) for zero-backend drafting

Track progress: [`docs/submission/JUDGE_WALKTHROUGH.md`](docs/submission/JUDGE_WALKTHROUGH.md)

---

## 👨‍⚖️ About the Creator

**Rajkumar Singh Chauhan** · राजकुमार सिंह चौहान

*Senior Counsel · Civil Engineer · 30+ Years · B.E. + LL.B.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://in.linkedin.com/in/rajkumar-singh-chauhan-76627b18)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/CRAJKUMARSINGH)

**Practice Areas:** Criminal Law · Civil Litigation · Infrastructure Contracts & Arbitration · Forensic Engineering Evidence

The IS standard guard (IS 2250:1981 vs IS 1199:2018) is not a feature a technologist would think to build — it came from standing in a sessions court watching the prosecution's expert witness crumble under cross-examination on standard misapplication.

Full profile: [`/about`](https://legal-luminaire.netlify.app/about)

---

## 🤝 How to Contribute

We welcome contributions that improve accuracy, add verified precedents, or enhance the UX.

**Key rules:**
- 🚫 No fabricated citations — every legal authority must be traceable
- 🏷️ Demo assets must be marked **SYNTHETIC / DEMO**
- 🔒 No secrets — never commit `.env`, API keys, or real case documents
- ✅ Run `pnpm run typecheck` and `pnpm run test` before submitting

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full guide.

---

## 📜 License

MIT © 2026 Rajkumar Singh Chauhan · [LICENSE](LICENSE)

---

## ❤️ Shout-outs

- **vibecode.law** — for the ILTN Vibeathon that pushed this to competition shape
- **Kiro · Devin · Trae · Antigravity** — the four-agent arc that enriched Weeks 1–13
- **Indian Kanoon · Manupatra · SCC Online** — for the verified legal database foundation
- **BIS (bis.gov.in)** — for publicly accessible IS standards

---

<div align="center">

### ⭐ If Legal Luminaire saves you from filing a wrong citation — star the repo and share it!

[🚀 Try the live demo](https://legal-luminaire.netlify.app) · [📖 Read the manual](https://legal-luminaire.netlify.app/how-to-use) · [⭐ Star on GitHub](https://github.com/CRAJKUMARSINGH/legal-luminaire)

`legal-tech` · `indian-law` · `ai-agent` · `legal-ai` · `zero-hallucination` · `bilingual` · `react` · `fastapi` · `citation-verification` · `court-documents` · `bnss` · `ipc`

</div>