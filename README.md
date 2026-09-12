<div align="center">

# Legal Luminaire ⚖️

**Accuracy-first AI legal research + drafting for Indian courts**

*Runs locally · No subscription · No hallucinations · Hindi + English*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://your-netlify-url.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Made for India](https://img.shields.io/badge/Made%20for-Indian%20Courts-FF9933?style=for-the-badge)]()
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()

</div>

---

> **Surgical precision.** The app catches what the prosecution misses.

**Real example from the included Hemraj case pack:**
The prosecution's FSL report applied **IS 1199:2018** (fresh concrete standard) to hardened masonry mortar.
The correct standard is **IS 2250:1981**.
Legal Luminaire flags this automatically — instantly destroying the scientific basis of the prosecution's case.

*That's not a feature. That's a weapon.*

---

## What it does

| Capability | Description |
|---|---|
| **Document Ingestion** | FIRs, charge-sheets, FSL reports, handwritten notes (PDF, DOCX, images) |
| **Fact-Fit Gate** | Scores every precedent 0–100 on factual fit |
| **Verification Tiers** | COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR |
| **Citation Blocking** | PENDING and FATAL_ERROR citations are blocked from all drafts |
| **Court-ready Drafts** | Discharge applications · Defence replies · Bail applications · Written submissions · Oral argument notes |
| **Bilingual** | Full Hindi + English UI and output |
| **Guided Workflow** | Intake → Research → Draft → Review |
| **One-click Demo** | 26 pre-loaded synthetic cases — no API keys required |
| **Multi-case** | Case switching + recent cases widget |
| **Local-first** | Core features run on your machine |

Every draft includes a **Verification Report** and a **Pre-Filing Checklist**.

---

## Verification Tiers

| Tier | Meaning | Draft Output |
|---|---|---|
| `COURT_SAFE` | Certified copy + para number confirmed | ✅ Allowed |
| `VERIFIED` | Confirmed on official source | ✅ Allowed |
| `SECONDARY` | Credible secondary source | ⚠️ With qualification note |
| `PENDING` | Unverified | ❌ Blocked |
| `FATAL_ERROR` | Factually mismatched | ❌ Blocked |

---

## Quick Start

### Frontend (recommended first)

```bash
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire
pnpm install
pnpm --filter @workspace/legal-luminaire run dev
```

Open `http://localhost:5173` → click **Demo Mode**.
The Hemraj stadium collapse case loads automatically.

### Full stack (with AI backend)

```bash
cd artifacts/legal-luminaire/backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # Add OPENAI_API_KEY / TAVILY_API_KEY
uvicorn main:app --reload
```

### Docker (everything at once)

```bash
docker compose up --build
```

---

## Deploy

### Netlify (recommended)

Root `netlify.toml` is pre-configured.

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/legal-luminaire run build
# Publish directory: artifacts/legal-luminaire/dist/public
```

Connect the repo in Netlify → leave Base directory blank → Deploy.

> **After deploy:** update the Live Demo badge URL at the top of this file.

### Vercel

Root `vercel.json` is ready. Just import the repository — no extra config needed.

---

## Key Features at a Glance

### Guided Workflow
4-step process with a task-oriented dashboard and progress indicators.

### Demo Mode
26 synthetic cases across criminal, civil, arbitration, and infrastructure matters. Clear **SYNTHETIC / DEMO** badges everywhere.

### Accuracy Controls
- Fact-Fit Gate (0–100 pts, auto-reject below 30)
- Verification tiers with automatic citation blocking
- IS / ASTM / NABL standards verification
- Verification Report + Pre-Filing Checklist on every draft

### Multi-case System
Global case selector, recent cases widget, and case-scoped context across all pages.

---

## Included Case Pack

`CASE01_HEMRAJ_STATE_2025` — Hemraj Vardar, Special Sessions Case No. 1/2025, Udaipur

Contains:
- Defence Reply (v3–v5)
- Discharge Application
- Written Submission (HC Writ)
- Standards Matrix (IS / ASTM / NABL)
- Case Law Matrix (with verification tiers)
- Cross-Reference Matrix
- Forensic Protocol Checklist

### Case Folder Naming Standard

```
CASENO_PARTY1_PARTY2_YEAR
```
Example: `CASE02_PITAMBARA_ROOPAM_2026`

---

## 21 Synthetic Test Cases

| # | Type | Court | Key Charges |
|---|---|---|---|
| 01 | Building collapse / forensic | Sessions, Udaipur | IPC 304A + PCA |
| 02 | Bail — NDPS | HC Rajasthan | NDPS §8/21/29 |
| 03 | Discharge — NI Act | MM Court Delhi | NI Act §138 |
| 04 | Bail — Domestic Violence | Sessions, Jaipur | IPC 498A + DV Act |
| 05 | Bail — Cyber Fraud | Sessions, Mumbai | IT Act §66C/66D |
| 06 | Writ — Land Acquisition | HC Rajasthan | Art. 226 |
| 07 | Discharge — Medical Negligence | Sessions, Delhi | IPC 304A |
| 08 | Bail — Road Accident | Sessions, Jodhpur | IPC 304A/279 |
| 09 | Bail — Forest Offence | Sessions, Udaipur | Forest Act §26 |
| 10 | Discharge — Arms Act | Sessions, Jaipur | Arms Act §25/27 |
| 11 | Discharge — Corruption | Special Court | PCA §7/13 |
| 12 | Bail — Murder | HC Rajasthan | IPC 302 |
| 13 | Discharge — POCSO | Sessions, Kota | POCSO §4 + IPC 376 |
| 14 | Bail — GST Fraud | Sessions, Delhi | CGST Act §132 |
| 15 | Writ — Environment | NGT | EP Act + Water Act |
| 16 | Written Submission — Landlord/Tenant | HC Rajasthan | Transfer of Property Act |
| 17 | Writ — Service Matter | HC Rajasthan | Art. 226 |
| 18 | Written Submission — Insurance | Consumer Forum | Consumer Protection Act |
| 19 | Written Submission — Contract | Commercial Court | Contract Act §73/74 |
| 20 | Application — Maintenance | Family Court | CrPC §125 / BNSS §144 |
| 21 | Written Submission — Election | HC Rajasthan | RPA §100 |

---

## Architecture

```
Frontend  →  React 19 + TypeScript + Vite + Tailwind CSS + Radix UI + Wouter
Backend   →  FastAPI + CrewAI + LangChain + ChromaDB (RAG)
Deploy    →  Netlify · Vercel · Docker Compose · Streamlit Cloud
State     →  Context API + localStorage (no backend required for demo mode)
```

---

## Accuracy Rules (non-negotiable)

- Every citation must include: full case name + citation + court + date + verified URL + para number
- Holdings are verbatim quotes only — paraphrasing is **forbidden**
- IS 1199:2018 applies to **fresh concrete only** — never to hardened masonry mortar
- IS 2250:1981 is the correct standard for masonry mortar
- ASTM C1324 is the correct standard for hardened masonry mortar forensics
- PENDING citations are **blocked** from all draft output
- Fact-Fit Gate score < 30 → citation is rejected, never used as primary authority

Full rules: [docs/accuracy-governance/ACCURACY_RULES.md](docs/accuracy-governance/ACCURACY_RULES.md)

---

## Documentation

| Doc | Purpose |
|---|---|
| [User Manual](docs/USER_MANUAL.md) | Local run guide + case folder setup |
| [Harvey.ai Integration](docs/HARVEY_AI_INTEGRATION.md) | Harvey.ai setup and usage |
| [Video Script](docs/VIDEO_MANUAL_SCRIPT.md) | Record your own 8-min demo |
| [Accuracy Rules](docs/accuracy-governance/ACCURACY_RULES.md) | Mandatory governance |
| [Test Case Matrix](docs/testing/TEST_CASE_MATRIX_21.md) | All 21 test cases |
| [Deploy & Multi-case Guide](artifacts/legal-luminaire/DEPLOY_AND_MULTI_CASE_GUIDE.md) | Deployment + multi-case setup |
| [Modernization Plan](docs/MODERNIZATION_PLAN.md) | Q2 2026 roadmap |
| [Contributing](CONTRIBUTING.md) | Dev quickstart + PR guidelines |
| [Changelog](CHANGELOG.md) | Version history |

---

## Disclaimer

All synthetic documents, test cases, and examples are entirely fictional and do not represent any real legal matters, persons, or proceedings.
This platform is not a substitute for professional legal advice.

---

<div align="center">

**Legal Luminaire** — *Stop researching. Start winning.*

`legal-tech` · `indian-law` · `ai-drafting` · `zero-hallucination` · `bilingual` · `react` · `fastapi` · `bnss` · `ipc`

MIT License

</div>
