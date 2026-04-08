# Citation Accuracy & 6-Month Code Update Roadmap

> Source: AI Technical Advisor feedback — April 2026  
> Applies to: Legal Luminaire — AI-Powered Case Management Platform

---

## On Citation Accuracy

The citations in the app are safe because they're sourced directly from your own case documents — you wrote them, the app just displays them. The risk zone is when the AI generates **new citations during drafting**.

Your **3-stage pipeline (Researcher → Verifier → Drafter)** is the right defence against hallucination. The `PENDING` badges on cases like *R.B. Constructions* and *State of Gujarat v. Mohanbhai* are doing their job — honestly flagging what hasn't been verified yet. That is the correct posture.

---

## Your 6-Month Code Update Roadmap

### Month 1 — Persistent Storage *(Critical)*

Cases currently live in `localStorage` — one browser clear and all work is lost.

**Action:** Move case storage to your PostgreSQL database (Drizzle ORM is already set up in your backend).

> This is the **single most important fix** before you use this for real cases.

---

### Month 2 — Live Citation Verification

Connect to **Indian Kanoon's free API** or SCC Online. When a citation is entered, auto-check if it exists and pull the headnote.

**Action:** Upgrade your `PENDING` / `SECONDARY` / `VERIFIED` system from manual labels to **API-backed checks**.

---

### Month 3 — PDF Document Intelligence

Right now documents are uploaded but only their filenames are stored.

**Action:** Wire up actual text extraction from PDFs and `.lex` files so the AI Drafter reads your real uploaded documents — not just the static demo data.

---

### Month 4 — Multi-Lawyer Chamber Mode

**Action:** Add login (Replit Auth is already available here). Support multiple users in a chamber:

- Junior associate uploads documents
- Senior advocate reviews and approves drafts
- **Role-based access:** `Associate` / `Advocate` / `Admin`

---

### Month 5 — Court-Specific Formatting

Each High Court has different caption formats, cause title conventions, and prayer structures.

**Action:** Build a **court formatter engine** — user selects Rajasthan HC / Supreme Court / NCLT and the discharge application, defence reply, and oral arguments auto-format to that court's style.

---

### Month 6 — Outcome Prediction + Hearing Tracker

**Action (two-part):**

1. Add a **next hearing date** field to each case. Show a countdown on the dashboard.
2. Use your accumulated case law matrix data to generate a **"probability assessment" card** — how strong is each ground based on citation verification status and standards coverage.

---

## Summary Table

| Month | Focus Area | Key Deliverable |
|-------|-----------|-----------------|
| 1 | Persistent Storage | PostgreSQL-backed case storage via Drizzle ORM |
| 2 | Live Citation Verification | Indian Kanoon / SCC API integration |
| 3 | PDF Document Intelligence | Full text extraction for AI Drafter |
| 4 | Multi-Lawyer Chamber Mode | Role-based auth (Associate / Advocate / Admin) |
| 5 | Court-Specific Formatting | Court formatter engine (Rajasthan HC, SC, NCLT) |
| 6 | Outcome Prediction + Tracker | Hearing countdown + probability assessment card |
