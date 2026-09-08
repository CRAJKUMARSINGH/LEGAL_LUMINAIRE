# User Manual (Local PC + Browser)

This guide is for running Legal Luminaire **locally** on your PC and using it in a browser.

## What you get
- A **React/Vite** UI in your browser
- An optional **FastAPI backend** for RAG indexing + multi-agent research/drafting
- Case packs like `CASE01_HEMRAJ_STATE_2025/` preloaded for demo usage
- **Guided workflow** with 4-step process (Intake → Research → Draft → Review)
- **One-click demo mode** with 26 pre-loaded synthetic cases
- **Multi-case system** with case switching and recent cases widget
- **Document-type selector** for targeted legal drafting

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

## Guided Workflow

Legal Luminaire provides a **guided 4-step workflow** to help you complete legal cases systematically:

### Step 1: Intake (इनटेक)
- **New Case Intake**: Manual case entry with form validation
- **AI Case Ingest**: AI-powered document ingestion and analysis
- Enter case details, upload documents, and set up your case file

### Step 2: Research (शोध)
- **Case Law Research**: Search and analyze legal precedents
- **Forensic Standards**: Access IS/ASTM/NABL standards database
- **AI Research Engine**: AI-powered legal research assistant
- **AI Chat Assistant**: Interactive AI chat for legal queries

### Step 3: Draft (प्रारूपण)
- **Document-Type Selector**: Choose your document type:
  - Discharge Application (उन्मोचन प्रार्थना-पत्र)
  - Bail Application (जमानत याचिका)
  - Written Submission (लिखित जमानत)
  - Defence Reply (बचाव जवाब)
  - Notice Reply (नोटिस जवाब)
- **AI Drafting**: Generate court-ready documents with citations
- **Safe Draft Editor**: Edit drafts with accuracy safeguards

### Step 4: Review (समीक्षा)
- **Verification Report**: Check citation accuracy and verification status
- **Filing Checklist**: Complete pre-filing requirements checklist
- Review your draft, verify citations, and ensure filing readiness

### Accessing Guided Workflow
1. Click **"Start Guided Flow"** on the Home page dashboard
2. Follow the 4-step process with visual progress indicators
3. Navigate between steps using Next/Back buttons
4. Click on completed steps to revisit them
5. Complete the workflow when all steps are finished

## Demo Mode

### One-Click Demo Access
- **26 Pre-Loaded Cases**: Explore different case types without setup
- **No API Keys Required**: Demo mode works entirely offline
- **Full Feature Access**: Test all capabilities with synthetic data

### Using Demo Mode
1. On the Home page, click **"Load Demo Case"** in the hero card
2. Browse available demo cases in the Demo Browser
3. Select a case type (e.g., Hemraj stadium collapse, NDPS bail, infrastructure arbitration)
4. The case loads instantly with pre-filled data
5. **SYNTHETIC / DEMO** badges appear throughout to indicate demo status

### Demo Case Types
- Criminal law (building collapse, NDPS, domestic violence, cyber fraud)
- Civil law (land acquisition, landlord/tenant, insurance, contracts)
- Infrastructure arbitration (NHAI, CPWD, FIDIC disputes)
- Consumer complaints and election petitions

## Multi-Case System

### Case Switching
- **Global Case Selector**: Available in sidebar for quick case switching
- **Case Context**: All pages respect the currently selected case
- **Recent Cases Widget**: Shows last 5 recently worked cases on Home

### Managing Cases
1. Use the case selector dropdown in the sidebar
2. Click **"Manage Cases"** to view all cases
3. Create new cases, duplicate existing ones, or delete cases
4. Switch between cases to work on multiple matters

### Case Data Structure
Each case includes:
- Court information and case number
- Parties involved
- Facts timeline
- Standards matrix
- Case law references
- Prayer clauses
- Verification blocks

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

