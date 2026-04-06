# Legal Luminaire — Video Training Manual

**Format**: Screen-recorded walkthrough + voiceover  
**Target length**: 6–10 minutes  
**Audience**: Trial court litigators, High Court advocates, corporate legal teams, law students  
**Tone**: Professional, authoritative, demo-first  

---

## Scene 1 — Hook (0:00–0:30)

**[Visual: Fast-paced montage — lawyer shuffling through hundreds of pages of forensics, FIRs, charge-sheets.]**

**Voiceover (VO):**  
"You're an advocate dealing with impossible deadlines, thousands of pages of police reports, and highly technical forensic evidence. How do you find the fatal flaw in the prosecution's case before tomorrow's cross-examination?"

**[Visual: Screen clears. The dark-mode Legal Luminaire dashboard appears.]**

**VO:**  
"Enter Legal Luminaire — the accuracy-first Virtual Senior Advocate. It runs locally on your PC and works in your browser."

---

## Scene 2 — Start Locally (0:30–1:15)

**[Visual: Terminal window. User types commands.]**

```powershell
cd artifacts\legal-luminaire
npm install --ignore-scripts
npm run dev
```

Open: `http://localhost:5173/`

**Optional backend (for RAG + AI drafting):**

```powershell
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

**VO:**  
"Two commands. Frontend is live. Add the backend for full AI research and drafting."

---

## Scene 3 — Upload & Ingest (1:15–2:00)

**[Visual: User clicks Upload. Drags in PDFs, blurry FIR photos, handwritten Panchnamas.]**

**VO:**  
"Step 1: Ingest. Upload anything — FIRs, charge-sheets, FSL reports, handwritten notes. The pipeline digitises English, Hindi, and Gujarati documents and indexes them into the case's local vector database."

**[Visual: Progress bar snaps to 100%. Original Hindi document on left, extracted text on right.]**

**VO:**  
"Legal Luminaire doesn't just read words — it builds a tactical timeline of your entire case."

---

## Scene 4 — The Surgical Strike (2:00–3:00)

**[Visual: User selects Case 01 — Hemraj Vardar / Special Sessions Case 1/2025. FORENSIC DISCREPANCIES widget zooms in.]**

**VO:**  
"Step 2: Destroy their evidence. This is where cases are won."

**[Visual: User clicks Generate Trial Strategy. AI streams a structured defence reply. Camera pans to highlighted text: 'IS 1199:2018 vs IS 2250:1981'.]**

**VO:**  
"Watch the AI instantly catch what the prosecution missed. It flags that the forensics lab applied the fresh concrete standard — IS 1199:2018 — to hardened masonry mortar. The correct standard is IS 2250:1981. The prosecution's report is now empirically void."

---

## Scene 5 — Accuracy Gate (3:00–4:30)

**[Visual: User opens New Case Intake. Pastes noisy OCR text — warnings appear. Adds contradictory dates — conflict alert fires. Uploads same file twice — dedup summary shown.]**

**VO:**  
"Step 3: The Accuracy Gate. If input quality is too low, the system blocks drafting unless you explicitly acknowledge the risk. No silent hallucinations. Every citation carries a verification tier — VERIFIED, SECONDARY, or PENDING."

**[Visual: Zoom in on PENDING badge — red. VERIFIED badge — green.]**

**VO:**  
"PENDING citations are blocked from all draft output. Only VERIFIED and COURT_SAFE citations make it into your filing."

---

## Scene 6 — Generate Draft Output (4:30–6:30)

**[Visual: User navigates to AI Draft Engine. Clicks Regenerate. Text streams down — Supreme Court citations embedded.]**

**VO:**  
"Step 4: Draft like a Senior Advocate. Legal Luminaire merges Trial Court vernacular with High Court precision. Need your Section 138 NI Act reply in standard Hindi? Done. Need exact Supreme Court citations embedded seamlessly? Done."

**[Visual: Verification Report panel — each citation shows its tier.]**

**VO:**  
"Every draft includes a Verification Report and a Pre-Filing Checklist. You know exactly what's court-safe before you file."

---

## Scene 7 — Deploy & Share (6:30–8:00)

**[Visual: Streamlit Cloud deploy screen. Three clicks. App live.]**

**VO:**  
"Step 5: Deploy. For maximum privacy, run locally. For cloud access, deploy to Streamlit Community Cloud in three clicks — no credit card required."

**[Visual: Netlify/Vercel deploy for frontend-only demo.]**

**VO:**  
"Or deploy the frontend-only demo to Netlify or Vercel for client presentations."

---

## Scene 8 — Close (8:00–9:00)

**[Visual: DEFENCE_REPLY_FINAL_v4.pdf and .lex files shown. Full case pack visible.]**

**VO:**  
"This repo includes a complete case pack — standards matrices, case law matrices, and a court-ready defence reply draft for the Hemraj stadium collapse case. 21 diverse test cases. Bilingual output. Zero hallucinations."

**[Visual: Text on screen: "Visit the GitHub Repository. Deploy privately. Start destroying the opposition's case."]**

**VO:**  
"Legal Luminaire. Stop researching. Start winning."

---

## Recording Notes

- Record at 1080p, 30fps using OBS Studio or similar
- Launch local app via `npm run dev` before recording
- Zoom in on verification tier badges and accuracy warnings
- Keep terminal text at 16–18pt for readability
- Use `CASE01_HEMRAJ_STATE_2025/` as the primary demo case
- Highlight the IS 1199:2018 vs IS 2250:1981 distinction — this is the viral moment

## Deploy as Interactive Guide

To embed this script as an in-app walkthrough:
1. Add a "Video Guide" button to the Home page linking to this file
2. Or record the walkthrough and host on YouTube — embed the link in README.md
3. Use the Streamlit app (`streamlit_app.py`) for a live interactive demo

---

> **Director's Note**: The IS 1199:2018 vs IS 2250:1981 moment (Scene 4) is the core demo hook. Lead with it in any marketing material.
