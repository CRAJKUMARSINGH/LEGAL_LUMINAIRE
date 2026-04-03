# Video Guide Script (Record-ready)

## Title
Legal Luminaire — Local PC Demo (Cases, RAG, Defence Drafts)

## Target length
6–10 minutes

## Audience
Advocates, law firm partners, litigation teams evaluating accuracy-first drafting.

---

## Scene 1 — Hook (0:00–0:30)
- Show the dashboard.
- Voiceover:
  - “This is Legal Luminaire: an accuracy-first legal research + drafting workspace. It runs locally on your PC and works in your browser.”

## Scene 2 — Start locally (0:30–1:30)
- On screen: terminal commands (quick cuts).

```powershell
cd artifacts\legal-luminaire
npm install --ignore-scripts
npm run dev
```

- Open `http://localhost:5173/`

Optional backend:

```powershell
cd artifacts\legal-luminaire\backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Scene 3 — Demo case navigation (1:30–3:00)
- Click “Try Demo”.
- Open Hemraj case (Case 01).
- Show:
  - Documents
  - Case law matrix
  - Standards matrix
  - Defence Reply v4

## Scene 4 — Upload documents (RAG) (3:00–4:30)
- Go to Upload.
- Upload a PDF and a `.md`.
- Explain:
  - “These files are indexed into the case’s local vector database and used as primary sources for drafting.”

## Scene 5 — Accuracy Gate (4:30–6:30)
- Open “New Case Intake”.
- Paste noisy OCR text to trigger warnings.
- Add contradictory dates to trigger conflicts.
- Upload the same file twice to show dedup summary.
- Voiceover:
  - “If quality is too low, the system blocks drafting unless you explicitly acknowledge the risk—so it doesn’t silently hallucinate.”

## Scene 6 — Generate / view draft outputs (6:30–8:30)
- Navigate to AI Draft / Chat.
- Explain how verification tiers work:
  - VERIFIED / SECONDARY / PENDING

## Scene 7 — Close (8:30–9:30)
- Show `CASE_01_HemrajG/DEFENCE_REPLY_FINAL_v4.pdf` and `.lex`.
- Voiceover:
  - “This repo includes a full case pack with standards, matrices, and a court-ready defence reply draft.”

---

## Recording notes (practical)
- Record at 1080p, 30fps.
- Zoom in on verification tiers and warnings.
- Keep terminal text large (16–18pt).

