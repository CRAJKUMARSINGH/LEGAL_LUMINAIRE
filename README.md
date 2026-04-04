# Legal Luminaire ⚖️

**Accuracy-first AI legal research + drafting for Indian courts.**  
Runs locally on your PC. No subscription. No hallucinations.

[![Deploy to Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com/)

---

## Why Legal Luminaire?

**Surgical precision.** The app catches what the prosecution misses.

Real example from the included Hemraj case pack:  
The prosecution's FSL report applied **IS 1199:2018** (fresh concrete standard) to hardened masonry mortar. The correct standard is **IS 2250:1981**. Legal Luminaire flags this automatically — instantly destroying the scientific basis of the prosecution's case.

That's not a feature. That's a weapon.

---

## What it does

- Ingests FIRs, charge-sheets, FSL reports, and handwritten notes (PDF, DOCX, images)
- Builds a case timeline and cross-reference matrix automatically
- Researches precedents and scores them via the **Fact-Fit Gate** (0–100 pts)
- Blocks unverified (PENDING) citations from all draft output
- Generates court-ready documents in Hindi and English:
  - Discharge applications
  - Defence replies
  - Bail applications
  - Written submissions
  - Oral argument notes
- Every draft includes a **Verification Report** and **Pre-Filing Checklist**

---

## Verification Tiers

| Tier | Meaning | Draft Output |
|------|---------|-------------|
| `COURT_SAFE` | Certified copy + para number confirmed | ✅ Allowed |
| `VERIFIED` | Confirmed on official source | ✅ Allowed |
| `SECONDARY` | Credible secondary source | ⚠️ With qualification note |
| `PENDING` | Unverified | ❌ Blocked |
| `FATAL_ERROR` | Factually mismatched | ❌ Blocked |

---

## Quick Start (Local PC)

**Prerequisites**: Node.js 18+, Python 3.11+ (optional)

```powershell
# Frontend (browser UI)
cd artifacts\legal-luminaire
npm install --ignore-scripts
npm run dev
```

Open `http://localhost:5173/` — the demo case (Hemraj stadium collapse) loads automatically.

```powershell
# Backend (optional — enables RAG + multi-agent AI drafting)
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env: set OPENAI_API_KEY and TAVILY_API_KEY
uvicorn main:app --reload
```

**Or run everything with Docker:**

```powershell
docker compose up --build
```

---

## Deploy

### Streamlit Cloud (Python client — free, no credit card)

1. Go to [share.streamlit.io](https://share.streamlit.io/)
2. Connect your GitHub account and select this repo
3. Set main file path: `streamlit_app.py`
4. Click Deploy

### Netlify / Vercel (frontend-only static demo)

- Netlify: root `netlify.toml` is pre-configured — just connect the repo
- Vercel: root `vercel.json` is pre-configured — just connect the repo

Both deploy the React SPA with SPA route rewrites. No backend required for demo mode.

---

## Included Case Pack

`CASE_01_HemrajG/` — Hemraj Vardar, Special Sessions Case No. 1/2025, Udaipur

Includes:
- Defence Reply v3, v4, v5 (`.lex` + `.pdf`)
- Discharge Application
- Written Submission (HC Writ)
- Standards Matrix (IS/ASTM/NABL)
- Case Law Matrix (VERIFIED/SECONDARY/PENDING)
- Cross-Reference Matrix
- Forensic Protocol Checklist

---

## 21 Test Cases

Covers the full spectrum of Indian criminal and civil law:

| # | Type | Court | Charges |
|---|------|-------|---------|
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
Frontend  →  React 19 + TypeScript + Vite + Tailwind CSS + Radix UI
Backend   →  FastAPI + CrewAI + LangChain + ChromaDB (RAG)
Deploy    →  Streamlit Cloud / Netlify / Vercel / Docker Compose
```

---

## Documentation

- [User Manual](docs/USER_MANUAL.md) — local run guide
- [Video Script](docs/VIDEO_MANUAL_SCRIPT.md) — record your own 8-minute demo
- [Accuracy Rules](docs/accuracy-governance/ACCURACY_RULES.md) — mandatory governance
- [Test Case Matrix](docs/testing/TEST_CASE_MATRIX_21.md) — 21 test cases
- [Modernization Plan](docs/MODERNIZATION_PLAN.md) — Q2 2026 roadmap
- [Contributing](CONTRIBUTING.md) — dev quickstart + PR guidelines
- [Changelog](CHANGELOG.md) — version history
- [Audit Report](AUDIT-REPORT-v1.0.md) — known issues + remediation plan

---

## Accuracy Rules (non-negotiable)

- Every citation: full case name + citation + court + date + verified URL + para number
- Holdings: verbatim quotes only — paraphrasing is forbidden
- IS 1199:2018 applies to **fresh concrete only** — never to hardened masonry mortar
- IS 2250:1981 is the correct standard for masonry mortar
- PENDING citations are blocked from all draft output
- Fact-Fit Gate score < 30 → citation rejected, never used as primary authority

---

## Disclaimer

All synthetic documents, test cases, and examples are entirely fictional and do not represent any real legal matters, persons, or proceedings. This platform is not a substitute for professional legal advice.

---

**Legal Luminaire** — *Stop researching. Start winning.*

MIT License
