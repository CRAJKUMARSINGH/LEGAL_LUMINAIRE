# User Manual (Local PC + Browser)

This guide is for running Legal Luminaire **locally** on your PC and using it in a browser.

## What you get
- A **React/Vite** UI in your browser
- An optional **FastAPI backend** for RAG indexing + multi-agent research/drafting
- Case packs like `CASE_01_HemrajG/` preloaded for demo usage

## Prerequisites
- **Node.js**: 18+
- **Python**: 3.11+

## Run the frontend (browser UI)

From repo root:

```powershell
cd artifacts\legal-luminaire
npm install --ignore-scripts
npm run dev
```

Open:
- `http://localhost:5173/`

## Run the backend (optional, enables RAG + multi-agent drafting)

```powershell
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and set:
- `OPENAI_API_KEY=...`
- `TAVILY_API_KEY=...` (recommended for verification)

Start:

```powershell
uvicorn main:app --reload
```

Backend health:
- `http://127.0.0.1:8000/api/v1/health`

## Run with Docker (optional)

If you prefer a one-command full stack run:

```powershell
docker compose up --build
```

Then open:
- Frontend: `http://localhost:5173/`
- Backend health: `http://127.0.0.1:8000/api/v1/health`

## Uploading documents (RAG)
1. In the UI, open **Upload**.
2. Upload PDFs/MD/DOCX/images.
3. (If backend is running) documents are indexed into ChromaDB per case ID.

## Accuracy Gate (what it does)
In **New Case Intake**, the app now enforces:
- **Input quality warnings** (OCR noise, placeholders, too-short text)
- **Date consistency checks** (incident ≤ FIR ≤ arrest ≤ remand; charge-sheet ≥ arrest)
- **Duplicate document detection** (hash-based)

If a gate blocks drafting, you can only proceed by explicitly acknowledging the risk.

## Cleaning caches (safe)

```powershell
.\scripts\clean.ps1
```

To also delete environment-specific RAG data:

```powershell
.\scripts\clean.ps1 -All
```

