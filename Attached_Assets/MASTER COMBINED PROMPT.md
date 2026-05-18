
## What’s already strong

- The repo already presents a differentiated promise: ingest case docs, build timelines and cross-reference matrices, score precedents with a Fact-Fit Gate, block unverified citations, and generate court-ready documents in Hindi and English. That is a real wedge, not generic AI varnish. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- Your marketing/docs are also smarter than average: you already mapped demo stories, personas, use-case cards, and a “Marketing Demo Mode” concept that explicitly targets advocates, law firm partners, investors, and reviewers. That means the growth engine is already sketched—you just need to productize it. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)
- The 21-case breadth is a major asset. Most legal AI products show one toy example; you already have a showcase portfolio across criminal, civil, writ, consumer, commercial, and family matters. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)

## The real blockers

If I’m being blunt, your biggest problems are **not capability gaps**. They are **activation gaps**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

- The audit says the backend can fail to boot because of an import-time issue, which is a total-outage class problem. If the backend doesn’t reliably start, the product story collapses before the user ever feels the value. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)
- The audit and manual together show onboarding friction around API keys and local setup. That means trial users can’t get to “aha” fast enough, which is deadly for adoption. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)
- Your own modernization plan identifies the UX issues: 40+ nav items, no onboarding flow, blank empty states, weak loading states, no recent-cases panel, no test-case browser, and no dedicated demo path. That is exactly where user grab is leaking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)
- Your marketing docs explicitly define a “Try Demo” flow with no API key, 21 case cards, demo banners, verification panels, PDF download, and a CTA into real-case mode—so the winning growth funnel is already known, just not fully shipped. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

## Artemis-level priority order

### Phase 1: Win the first 5 minutes

This is the highest ROI sprint.

1. **Make demo mode the default first experience.**  
   On first load, don’t ask users to configure anything. Give them one giant CTA: **Try Demo**. Load the most polished case immediately, ideally TC-01 forensic defence, because your own showcase map says it’s the signature story. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

2. **Fix backend stability before adding net-new features.**  
   Any import crash, mutable-default bug, or SSRF exposure is more damaging in legal tech than in ordinary SaaS because trust is the product. Reliability work here is not “backend hygiene”; it is brand infrastructure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)

3. **Turn the home page into a mission-control dashboard.**  
   Replace link soup with 3 paths: **Start Real Case**, **Try Demo**, **Open Recent Case**. Your modernization plan already calls for recent cases, task-oriented cards, and grouped navigation—ship that before any fancy AI flourish. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

4. **Kill blank states.**  
   Every empty page should explain what happens here, why it matters, and what the next click is. In legal workflows, uncertainty feels like risk. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

5. **Add visible progress and evidence.**  
   When drafting or researching, show step progress like: ingesting → extracting facts → matching precedents → verifying citations → building draft. Users trust AI more when they can see the chain of work. Your docs already call for skeleton loaders and stronger audit-trail linking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

### Phase 2: Convert “interesting” into “indispensable”

6. **Build the guided legal workflow.**  
   Intake → timeline → contradictions → precedent fit → draft → verification report → pre-filing checklist. This should feel like a single conveyor belt, not separate pages. Your roadmap already points in this direction. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

7. **Make the verification engine your hero UI, not a hidden subsystem.**  
   Show why a citation is VERIFIED, SECONDARY, PENDING, or blocked. Your marketing spec even calls for a real-time accuracy showcase panel and “Why was this citation blocked?” tooltip. That’s one of your best differentiators. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

8. **Ship the 21-case browser as a product feature.**  
   Not just docs. Actual card-based browsing with filters like Criminal / Civil / Writ / Consumer / Commercial. That becomes both onboarding and sales collateral. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

9. **Polish output presentation hard.**  
   Legal users judge quality by visual seriousness. Add print CSS, court-ready typography, badges, watermarking in demo mode, download-ready PDFs, and better formatting around verification reports and checklists. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

10. **Standardize setup and reduce cognitive overhead.**  
   Your repo signals monorepo/workspace complexity, while the user manual focuses on local frontend/backend setup. Tighten the setup story so contributors and evaluators see one crisp path, one demo path, and one production path. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/package.json)

## The features that will make users say “damn, this is useful”

These are the ones I’d bet on for actual user pull:

- **Contradiction Finder**: a dedicated screen that surfaces prosecution inconsistencies, missing chain-of-custody links, timeline conflicts, and wrong standards application. This is already implicit in your Hemraj positioning—make it explicit as a feature card and first-click action. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- **Case Strength Snapshot**: one-page summary showing risk areas, strongest defence points, blocked citations, and draft readiness. Law-firm partners love summary intelligence. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **Why-this-precedent panel**: expose the Fact-Fit Gate visually, with score, fit reason, factual alignment, and para references. That makes your RAG feel accountable instead of magical. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- **Demo-to-real handoff**: after a user explores a demo case, offer “Start with your own case → upload FIR / charge-sheet / FSL report.” Your marketing task spec literally defines this CTA. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)
- **Recents + templates by case type**: criminal defence advocates should feel the product “understands their practice” the moment they open it. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

## How to improve “user grab”

Your acquisition story should be: **show value before asking for effort**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

### The best funnel for this product

**Ad / post / outreach → Try Demo → Pick case type → See contradiction / verified output → Download watermarked sample → Start real case**

That funnel is already basically described in your marketing spec. Make the product mirror the spec exactly. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

### Messaging I would sharpen

Your current copy is powerful, but a bit too absolute in places. “No hallucinations” and “That’s not a feature. That’s a weapon.” are memorable, but for law firms and serious practitioners, absolute claims can backfire unless instrumented and auditable. Even your marketing docs say some performance claims are still assumptions, not measured benchmarks. I’d shift the tone from swagger to **defensible trust**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)

A stronger positioning line would be something like:

**“Verification-gated AI drafting for Indian advocates.”**

That lands cleaner than “no hallucinations,” while still preserving your core advantage around blocked PENDING citations and verified outputs. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)

### Three growth assets to ship immediately

- **A 90-second demo video** using the forensic defence walkthrough. You already have the showcase script structure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **Use-case landing pages** for Criminal Defence, Bail, Writs, and Consumer/Commercial—your brochure/use-case cards are already written. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **A free “Case Readiness Scan” demo CTA** that drops users into synthetic case exploration before they ever touch setup. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

## What I’d put in the next sprint board

If this were my repo, these would be the first 10 issues:

1. Fix backend boot failure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)  
2. Add default **Try Demo** CTA on Home. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
3. Build 21-card demo case selector with filters. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
4. Add persistent demo banner and watermarking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
5. Group nav into Setup / Research / Draft / Review. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
6. Add empty-state CTAs everywhere. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
7. Add skeleton loaders and visible draft-generation progress. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
8. Link verification report directly from every generated draft. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
9. Add recent cases + template shortcuts on Home. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
10. Patch SSRF risk, mutable defaults, and dependency pinning. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)  

## My strongest recommendation

If you only do **one** thing, do this:

**Ship a ridiculously polished no-key demo path that shows one jaw-dropping legal win in under 60 seconds.**

Because right now the repo already proves you know the domain. What you need is a product journey that lets users **feel** that competence instantly. The marketing docs already point to the exact vehicle: Demo Mode, 21 case cards, verification visibility, downloadable sample output, then a handoff into real-case intake. That is your orbit-insertion burn. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md) >>>>>>>>>>**Here’s my sharp, actionable extension to the excellent feedback you already have.**  
I’ve reviewed your repo (structure, recent commits, cases like Hemraj/Pitambara, docs, etc.) and layered on top of the provided analysis.

### 1. Immediate “Ship This Week” Wins (Beyond the 10 Issues Listed)
These are the highest-leverage things not fully covered yet:

| Priority | Suggestion | Why It Moves the Needle | Effort |
|----------|----------|-------------------------|--------|
| **P0** | **One-click “Launch Demo” button** that auto-starts backend + loads TC-01 (Hemraj) in <15s | Solves the #1 activation gap. Users feel the weapon in 30 seconds. | Low (Streamlit + cached case) |
| **P0** | **Fix the 5 audit blockers** (especially KERO-001 import crash + mutable defaults + SSRF) | Without this, everything else is theater. Legal users smell instability instantly. | Medium (1-2 days) |
| **P1** | **Demo banner + permanent watermark** on all generated PDFs (“DEMO — Synthetic Case — Not for Court”) | Builds trust and prevents misuse while marketing. | Low |
| **P1** | **Case browser as real UI page** (21 cards with filters: Criminal/Civil/Writ etc.) | Turns your best asset (breadth) into a product feature instead of static docs. | Medium |

### 2. Product Ideas That Will Make Users Say “I Need This Yesterday”

**Core Differentiators to Double Down On** (Indian legal market is hungry for these):

- **“Prosecution Killer” Dashboard** — One screen that highlights:
  - Timeline conflicts
  - Wrong standards applied (expand your IS 1199 vs 2250 logic)
  - Missing links in chain of custody
  - Weakest prosecution citations (with Fact-Fit scores)

- **Contradiction Radar** (make this a hero feature card) — Dedicated page/tab that surfaces inconsistencies automatically. Market this hard — it’s your Hemraj magic generalized.

- **Voice-to-Draft** (Hinglish → Formal Hindi/English) — Record oral arguments or client notes on phone → instant draft. Huge for busy advocates in Rajasthan/U.P./Bihar courts.

- **Offline-First Mode** — Since you already run locally, lean into it. Add local vector DB sync + “Sync when online” for citations. This beats every cloud legal AI on privacy + reliability.

- **Bar Council Compliance Pack** — Auto-generate “AI Usage Disclosure” statements + audit trail for ethics filings. Very few tools do this.

### 3. Technical & Architecture Suggestions (Next 30-60 Days)

**RAG/Accuracy Stack Upgrades** (building on the roadmap you shared):
- Add **Hybrid Retrieval** (Chroma dense + BM25 sparse) — legal citations need exact matching.
- Implement **RAGAS** or simple faithfulness evaluator in the pipeline so you can actually measure “no hallucinations” claim.
- Fine-tune a small **LegalBERT** or use **Gemma-2-9B** / **Llama-3.1-8B** quantized for local inference (better Hindi + legal domain than generic models).

**Deployment & Accessibility**:
- **Streamlit Community Cloud + Local fallback** — Make the demo publicly accessible without any setup.
- **Docker Compose** one-liner for full stack (frontend + backend + Chroma).
- **Web version + Desktop (Tauri/Electron)** — Many senior advocates prefer desktop apps.

**Security & Reliability**:
- Pin every dependency (no `*`).
- Add basic rate limiting + input sanitization even for local use.
- Consider optional **Ollama** integration for users who want fully air-gapped.

### 4. Growth & Positioning Sharpens

**Better Tagline Options** (more defensible):
- “Verification-Gated AI for Indian Advocates”
- “Local. Accurate. Court-Ready.”
- “The AI that prosecution fears”

**Content Ideas**:
- 60-second Loom/YouTube shorts: “How Legal Luminaire destroyed this FSL report in 47 seconds”
- Free “Case Readiness Scorecard” lead magnet (upload FIR → get 5 red flags)
- Hindi + English landing pages
- Target: Rajasthan High Court Bar, Jodhpur/Udaipur advocates first (leverage your location)

**Monetization Path** (keep core free/local):
- Premium cloud verification (Manupatra/SCC live APIs)
- Enterprise (law firms) — multi-user + audit logs
- Template marketplace (custom bail formats per court)

### 5. Sprint Board Suggestion (Next 2 Weeks)

1. Fix audit criticals + stable backend boot
2. Default “Try Demo” flow with Hemraj case
3. Case browser UI
4. Contradiction Radar page
5. Polish one full end-to-end demo flow (intake → draft → verification report → PDF)
6. Record 90-second demo video
7. Update README with new screenshots + one-click demo badge

### Final Strongest Recommendation

**Ship the polished no-setup demo first.**  
Everything else (advanced RAG, predictive analytics, multilingual, etc.) is worthless if people can’t experience the “damn, this is useful” moment in under 60 seconds.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# 🚀 **AUTO-FOLDER GENERATOR PROMPT (GitHub-Ready)**

```id="infra-auto-folder-v1"
You are an expert Legal + DevOps AI system.

Your task is to GENERATE a COMPLETE GitHub-ready folder structure for an Infrastructure Arbitration Case under Indian law.

---

## 🎯 OBJECTIVE

Automatically create:

1. Folder name (standardized)
2. Full directory structure
3. All required files (.lex, .md)
4. Realistic legal content inside each file

The output must be COPY-PASTE READY into a GitHub repository.

---

## 📁 FOLDER NAMING RULE

Use this format:

INFRA_ARB_<ID>_<PROJECT_TYPE>_<YEAR>

Examples:
- INFRA_ARB_01_BUILDING_HOSPITAL_2026
- INFRA_ARB_02_ROAD_HIGHWAY_2026
- INFRA_ARB_03_DAM_IRRIGATION_2026
- INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026
- INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026

---

## 📂 DIRECTORY STRUCTURE (MANDATORY)

Generate EXACT structure:

```

<CASE_FOLDER>/
├── INPUT_DATA/
├── Attached_Assets/
├── OUTPUTS/
├── Case_Facts_Timeline.md
├── Claim_Matrix_Verified_Pending.md
├── Standards_Matrix_CPWD_FIDIC_IS.md
├── WORK_ORDER_2024.lex
├── LEGAL_NOTICE_DEMAND_01.lex
├── STANDING_COMMITTEE_MINUTES_01.md
├── NO_SATISFACTION_LETTER_01.lex
├── ARB_APPOINTMENT_APPLICATION_SEC11.lex
├── CLAIM_STATEMENT_FULL.lex
├── CLAIM_STATEMENT_HINDI.lex
├── COUNTER_CLAIM_REPLY.lex
├── WITNESS_AFFIDAVIT_01.lex
├── CROSS_EXAMINATION_TRANSCRIPT_EXCERPT.lex
├── FINAL_ARBITRAL_AWARD.lex
├── EXECUTION_STAY_APPLICATION.lex

```

---

## ⚖️ CONTENT RULES (CRITICAL)

### 1. FACT-FIT GATE (MANDATORY)
Each claim must be tagged:
- VERIFIED
- SECONDARY
- PENDING

### 2. NO HALLUCINATION POLICY
- Use realistic clauses (CPWD, FIDIC, NHAI, IS)
- If unsure → mark “Requires Evidence”

### 3. REAL INFRASTRUCTURE SCENARIOS
Include combinations of:
- Delay in site handover
- EOT (Extension of Time)
- Price escalation (10CC / IEEMA)
- Idle machinery/labour
- Variation orders
- RoW / forest clearance
- Geological surprises

### 4. LEGAL STRUCTURE
Follow:
- Arbitration & Conciliation Act, 1996
- Section 11 (appointment)
- Section 34/36 (challenge/execution)

---

## 📄 FILE CONTENT REQUIREMENTS

### Case_Facts_Timeline.md
- Chronological timeline
- Include delays, EOT, termination, arbitration invocation

---

### Claim_Matrix_Verified_Pending.md
Table format:

| Claim | Amount | Fact-Fit Score | Status | Evidence |

---

### WORK_ORDER_2024.lex
- Contract value
- Time period
- Arbitration clause

---

### CLAIM_STATEMENT_FULL.lex (MOST IMPORTANT)

For EACH claim include:

- Title
- Amount
- Facts
- Clause relied (CPWD/FIDIC/etc.)
- Calculation (with numbers)
- Evidence list
- Fact-Fit Status

---

### FINAL_ARBITRAL_AWARD.lex
- 60–70% realistic award
- Interest %
- Counter-claim handling

---

### HINDI FILE
CLAIM_STATEMENT_HINDI.lex must include:
- Proper legal Hindi drafting

---

## 📊 STANDARDS MATRIX

Include:
- IS Codes
- CPWD Specs
- FIDIC clauses
- IRC / MoRTH (if road)

---

## 🎬 DEMO OPTIMIZATION (IMPORTANT)

Ensure output highlights:
- Claim Matrix (Hero)
- Fact-Fit Gate
- Contradiction points
- Strong narrative for demo

---

## 📥 INPUT FORMAT

Project Type: <Building / Highway / Dam / Electrical / Township>  
Contract Value: ₹<Amount>  
Location: Rajasthan (default)  
Key Issues: <list>  

---

## 📤 OUTPUT FORMAT (STRICT)

Return in this order:

1. Folder Name
2. Full Folder Tree (code block)
3. Each file with:
   - File name
   - Content in separate code block

---

## 🚫 DO NOT

- Do not skip files
- Do not leave placeholders
- Do not generate generic text
- Do not omit calculations

---

## ✅ FINAL GOAL

Produce a COMPLETE, REALISTIC, HIGH-VALUE arbitration case repository that can be:

- Directly uploaded to GitHub
- Used in Demo Mode
- Shown to lawyers / contractors
- Integrated into Legal Luminaire system

```

---

# 🔥 How you can use this immediately

### 1. In ChatGPT / AI Agent

Just append:

```
Project Type: Road Highway
Contract Value: ₹112.65 Crore
Key Issues: Site delay, RoW, price escalation
```

---

### 2. For your repo automation

You can plug this into:

* CLI generator script
* Backend API (FastAPI / Node)
* Batch generation for TC-22 → TC-26

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

# 🚀 **UI-READY API RESPONSE FORMAT (v1.0)**

```json id="ui-api-response-v1"
{
  "meta": {
    "case_id": "TC-23",
    "title": "45 km NH Highway Arbitration",
    "project_type": "Road Highway",
    "status": "Arbitration Invoked",
    "location": "Rajasthan",
    "contract_value_display": "₹112.65 Cr",
    "last_updated": "2026-04-09",
    "demo_mode": true,
    "watermark": "DEMO MODE"
  },

  "dashboard": {
    "summary_cards": [
      {
        "label": "Total Claim",
        "value": "₹55.30 Cr"
      },
      {
        "label": "Award (Expected/Actual)",
        "value": "₹41.65 Cr"
      },
      {
        "label": "Verified Claims",
        "value": "4 / 6"
      },
      {
        "label": "Risk Level",
        "value": "Moderate"
      }
    ],

    "highlight": {
      "title": "Strongest Claim",
      "description": "Delay in Site Possession (78 days)",
      "badge": "VERIFIED",
      "amount": "₹14.85 Cr"
    }
  },

  "timeline_ui": [
    {
      "date": "2024-06-10",
      "title": "Work Order Issued",
      "tag": "Contract",
      "description": "₹112.65 Cr project awarded"
    },
    {
      "date": "2024-09-12",
      "title": "Delayed Site Possession",
      "tag": "Delay",
      "highlight": true,
      "description": "78 days delay due to forest clearance"
    },
    {
      "date": "2026-02-20",
      "title": "Termination Notice",
      "tag": "Dispute"
    },
    {
      "date": "2026-03-05",
      "title": "Arbitration Invoked",
      "tag": "Legal"
    }
  ],

  "claim_matrix_ui": {
    "columns": ["Claim", "Amount", "Status", "Score"],
    "rows": [
      {
        "id": "C1",
        "claim": "Delay in Site Possession",
        "amount": "₹14.85 Cr",
        "status": "VERIFIED",
        "score": 96,
        "color": "green",
        "expandable": true
      },
      {
        "id": "C2",
        "claim": "Price Escalation",
        "amount": "₹9.75 Cr",
        "status": "VERIFIED",
        "score": 93,
        "color": "green"
      },
      {
        "id": "C5",
        "claim": "Loss of Profit",
        "amount": "₹8.90 Cr",
        "status": "SECONDARY",
        "score": 68,
        "color": "orange"
      }
    ]
  },

  "claim_details": {
    "C1": {
      "title": "Delay in Site Possession",
      "amount": "₹14.85 Cr",
      "status": "VERIFIED",
      "facts": "Site possession delayed by 78 days...",
      "clauses": ["FIDIC 2.1", "GCC Clause 5"],
      "calculation": [
        { "label": "Overheads", "value": "₹3.60 Cr" },
        { "label": "Machinery Idle", "value": "₹4.75 Cr" },
        { "label": "Labour Idle", "value": "₹1.20 Cr" }
      ],
      "evidence": [
        "LOA Document",
        "Possession Memo",
        "Progress Reports"
      ]
    }
  },

  "contradiction_panel": [
    {
      "issue": "Delay Denied by Respondent",
      "finding": "Official letters confirm 78-day delay",
      "severity": "High",
      "impact": "Strengthens Claim C1"
    },
    {
      "issue": "Missing Formal Notice",
      "finding": "Only email communication found",
      "severity": "Medium",
      "impact": "May weaken claim compliance"
    }
  ],

  "documents_ui": {
    "tabs": [
      {
        "id": "claim_statement_en",
        "label": "Claim (English)",
        "content": "Full English draft content...",
        "downloadable": true
      },
      {
        "id": "claim_statement_hi",
        "label": "Claim (Hindi)",
        "content": "पूर्ण हिंदी दावा कथन...",
        "downloadable": true
      },
      {
        "id": "legal_notice",
        "label": "Legal Notice",
        "content": "LEGAL NOTICE text..."
      }
    ]
  },

  "award_ui": {
    "awarded": "₹41.65 Cr",
    "interest": "8.5%",
    "decision_summary": "Major claims allowed, minor LD imposed",
    "status_badge": "FAVOURABLE"
  },

  "verification_ui": {
    "bars": [
      { "label": "Verified", "value": 4, "color": "green" },
      { "label": "Secondary", "value": 1, "color": "orange" },
      { "label": "Pending", "value": 1, "color": "red" }
    ],
    "note": "Only VERIFIED claims are strongly supported by evidence"
  },

  "actions": [
    {
      "label": "Download PDF",
      "type": "primary",
      "action": "download_pdf"
    },
    {
      "label": "View Full Claim",
      "type": "secondary",
      "action": "open_claim"
    },
    {
      "label": "Start Your Own Case",
      "type": "cta",
      "action": "new_case"
    }
  ]
}
```

---

# 🎯 Why this is UI-perfect

## 1. Zero transformation needed

Frontend can directly map:

| UI Component        | JSON Field                |
| ------------------- | ------------------------- |
| Dashboard cards     | `dashboard.summary_cards` |
| Timeline            | `timeline_ui`             |
| Claim table         | `claim_matrix_ui`         |
| Claim detail drawer | `claim_details`           |
| Contradiction panel | `contradiction_panel`     |
| Document viewer     | `documents_ui.tabs`       |
| Award card          | `award_ui`                |

---

## 2. Built for Demo Mode 🔥

* `highlight`
* `contradiction_panel`
* `verification_ui`
* `watermark`

→ Perfect for your **90-sec pitch**

---

## 3. Supports expandable UX

* Click claim → `claim_details`
* Tabs → `documents_ui`
* Buttons → `actions`

---

## 4. Clean separation

* Data (meta)
* UI-ready (formatted strings)
* Interaction (actions)

---

# ⚡ If you want next step (highly recommended)

I can now generate:

### 🔹 React UI components (ready)

* Claim Matrix table
* Timeline component
* Contradiction panel
* Document viewer

### 🔹 FastAPI endpoint

```bash
POST /api/generate-case
GET /api/case/{id}
```

### 🔹 Full end-to-end architecture

* AI → JSON → DB → UI

---
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

# 🚀 **PYTHON ONE-CLICK TC GENERATOR (PRO VERSION)**

## 📁 **Project Structure**

```
infra_generator/
├── generator.py
├── config.json
├── templates/
│   ├── default.txt
└── output/
```

---

# ⚙️ **1. config.json (TC-22 → TC-26)**

```json
{
  "base_output_path": "./output",
  "cases": [
    {
      "id": "TC-22",
      "folder": "INFRA_ARB_01_BUILDING_HOSPITAL_2026",
      "project_type": "Building Hospital",
      "value": "₹48.75 Cr",
      "location": "Rajasthan",
      "issues": ["Site Delay", "Variation", "Idle Resources"]
    },
    {
      "id": "TC-23",
      "folder": "INFRA_ARB_02_ROAD_HIGHWAY_2026",
      "project_type": "Road Highway",
      "value": "₹112.65 Cr",
      "location": "Rajasthan",
      "issues": ["Site Delay", "RoW", "Price Escalation"]
    },
    {
      "id": "TC-24",
      "folder": "INFRA_ARB_03_DAM_IRRIGATION_2026",
      "project_type": "Dam Irrigation",
      "value": "₹87.40 Cr",
      "location": "Rajasthan",
      "issues": ["Geological Surprise", "Design Change"]
    },
    {
      "id": "TC-25",
      "folder": "INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026",
      "project_type": "Electrical Substation",
      "value": "₹68.25 Cr",
      "location": "Rajasthan",
      "issues": ["Material Delay", "Testing Delay"]
    },
    {
      "id": "TC-26",
      "folder": "INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",
      "project_type": "Township Landscape",
      "value": "₹34.80 Cr",
      "location": "Rajasthan",
      "issues": ["Scope Creep", "Delayed Payment"]
    }
  ]
}
```

---

# 🧠 **2. generator.py (MAIN ENGINE)**

```python
import os
import json
from datetime import datetime

# =========================
# CONFIG
# =========================

FILES = [
    "Case_Facts_Timeline.md",
    "Claim_Matrix_Verified_Pending.md",
    "Standards_Matrix_CPWD_FIDIC_IS.md",
    "WORK_ORDER_2024.lex",
    "LEGAL_NOTICE_DEMAND_01.lex",
    "STANDING_COMMITTEE_MINUTES_01.md",
    "NO_SATISFACTION_LETTER_01.lex",
    "ARB_APPOINTMENT_APPLICATION_SEC11.lex",
    "CLAIM_STATEMENT_FULL.lex",
    "CLAIM_STATEMENT_HINDI.lex",
    "COUNTER_CLAIM_REPLY.lex",
    "WITNESS_AFFIDAVIT_01.lex",
    "CROSS_EXAMINATION_TRANSCRIPT_EXCERPT.lex",
    "FINAL_ARBITRAL_AWARD.lex",
    "EXECUTION_STAY_APPLICATION.lex"
]

SUBFOLDERS = ["INPUT_DATA", "Attached_Assets", "OUTPUTS"]

# =========================
# CONTENT GENERATOR
# =========================

def generate_content(case, file_name):
    """Basic content generator (replace with AI later)"""

    header = f"# {file_name}\n\n"
    meta = f"""
Case ID: {case['id']}
Project: {case['project_type']}
Value: {case['value']}
Location: {case['location']}
Generated On: {datetime.now().strftime('%Y-%m-%d')}
"""

    # Simple specialization
    if "Timeline" in file_name:
        body = """
## Timeline

- Work Order Issued
- Site Delay Observed
- Dispute Raised
- Arbitration Invoked
"""
    elif "Claim_Matrix" in file_name:
        body = """
| Claim | Amount | Status | Score |
|-------|--------|--------|-------|
| Delay | ₹10 Cr | VERIFIED | 95 |
| Escalation | ₹5 Cr | VERIFIED | 90 |
| Profit Loss | ₹3 Cr | SECONDARY | 65 |
"""
    elif "AWARD" in file_name.upper():
        body = """
## Final Award

- Majority claims allowed
- Interest @ 8.5%
- Partial counter claim allowed
"""
    else:
        body = f"""
## Details

This document relates to {case['project_type']} arbitration.

Key Issues:
{', '.join(case['issues'])}

(Replace with AI-generated legal drafting)
"""

    return header + meta + body


# =========================
# CORE FUNCTIONS
# =========================

def create_case_structure(base_path, case):
    case_path = os.path.join(base_path, case["folder"])
    os.makedirs(case_path, exist_ok=True)

    # Subfolders
    for sub in SUBFOLDERS:
        os.makedirs(os.path.join(case_path, sub), exist_ok=True)

    return case_path


def create_files(case_path, case):
    for file_name in FILES:
        file_path = os.path.join(case_path, file_name)

        content = generate_content(case, file_name)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)


def generate_all_cases(config):
    base_path = config["base_output_path"]

    os.makedirs(base_path, exist_ok=True)

    for case in config["cases"]:
        print(f"🚀 Generating {case['id']}...")

        case_path = create_case_structure(base_path, case)
        create_files(case_path, case)

        print(f"✅ Created: {case['folder']}\n")

    print("🎉 ALL CASES GENERATED SUCCESSFULLY!")


# =========================
# ENTRY POINT
# =========================

if __name__ == "__main__":
    with open("config.json", "r", encoding="utf-8") as f:
        config = json.load(f)

    generate_all_cases(config)
```

---

# ▶️ **3. HOW TO RUN**

### Step 1: Open terminal

```bash
cd infra_generator
```

### Step 2: Run

```bash
python generator.py
```

---

# 📦 **OUTPUT**

```
output/
├── INFRA_ARB_01_BUILDING_HOSPITAL_2026/
├── INFRA_ARB_02_ROAD_HIGHWAY_2026/
├── INFRA_ARB_03_DAM_IRRIGATION_2026/
├── INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026/
├── INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026/
```

Each folder:
✔ 15 structured legal files
✔ Ready for editing / AI injection
✔ GitHub upload ready

---

# 🤖 **4. ADD AI (UPGRADE)**

Replace this:

```python
content = generate_content(case, file_name)
```

With:

```python
content = call_openai_api(case, file_name)
```

---

# 🔥 **5. PRO FEATURES YOU CAN ADD NEXT**

### ✅ CLI Command Mode

```bash
python generator.py --case TC-22
```

### ✅ Demo vs Real Mode

```python
mode = "demo"  # or "real"
```

### ✅ Auto Git Commit

```python
os.system("git add . && git commit -m 'Generated cases'")
```

### ✅ PDF Auto Export

### ✅ Direct UI integration

---

# 🎯 FINAL RESULT

You now have:

✔ One-click generator
✔ Scalable architecture
✔ AI-ready system
✔ GitHub-ready outputs
✔ Foundation for SaaS

---

%%%%%%%%%%%%%%%%%
You are an expert Legal AI system specializing in Indian infrastructure arbitration, construction contracts, and dispute resolution under CPWD, FIDIC, NHAI, and Rajasthan GCC frameworks.

Your task is to generate a COMPLETE, COURT-READY, FACT-VERIFIED arbitration case file based on the provided project details.

### OBJECTIVE
Produce a full lifecycle arbitration case including:
Work Order → Disputes → Notices → Standing Committee → No Satisfaction → Arbitration Invocation → Claim + Counter Claim → Evidence → Witness → Cross Examination → Final Arbitral Award → Execution/Stay

### CORE PRINCIPLES (MANDATORY)
1. FACT-FIT GATE:
   - Classify every claim as:
     - VERIFIED (strong documentary support)
     - SECONDARY (formula-based / partial proof)
     - PENDING (needs evidence)
   - Do NOT fabricate facts or citations.

2. NO HALLUCINATION RULE:
   - Only use legally valid clauses (CPWD, FIDIC, NHAI, IS codes).
   - If uncertain → mark as "Requires Evidence".

3. DUAL LANGUAGE OUTPUT:
   - Generate both English + Hindi versions for key documents.

4. INFRASTRUCTURE REALISM:
   - Use real-world patterns:
     - Site delay
     - EOT (Extension of Time)
     - Price escalation (Clause 10CC / IEEMA)
     - Idle machinery
     - Variation orders
     - Geological surprises
     - RoW / forest clearance issues

5. LEGAL STRUCTURE STRICTNESS:
   - Follow Arbitration & Conciliation Act, 1996
   - Include Section 11 (appointment), Section 34/36 (challenge/execution)

---

### OUTPUT STRUCTURE (STRICT)

Generate the following files:

#### 1. Case_Facts_Timeline.md
- Chronological events
- Delays, EOTs, termination, arbitration invocation

#### 2. Claim_Matrix_Verified_Pending.md
Table:
| Claim | Amount | Fact-Fit Score | Status | Evidence |

#### 3. WORK_ORDER_2024.lex
- Contract details
- Arbitration clause
- Time & value

#### 4. LEGAL_NOTICE_DEMAND_01.lex
- Demand + breach + arbitration warning

#### 5. STANDING_COMMITTEE_MINUTES_01.md
- Employer decision (termination/penalty)

#### 6. NO_SATISFACTION_LETTER_01.lex
- Formal dispute escalation

#### 7. ARB_APPOINTMENT_APPLICATION_SEC11.lex
- Court-ready draft

#### 8. CLAIM_STATEMENT_FULL.lex (DETAILED)
For EACH claim include:
- Facts
- Clause relied
- Calculation
- Evidence
- Precedents (if confident)

#### 9. CLAIM_STATEMENT_HINDI.lex

#### 10. COUNTER_CLAIM_REPLY.lex
- LD, incomplete work, re-tender cost

#### 11. WITNESS_AFFIDAVIT_01.lex
- Engineer / Project Manager

#### 12. CROSS_EXAMINATION_TRANSCRIPT_EXCERPT.lex
- Admissions + contradictions

#### 13. FINAL_ARBITRAL_AWARD.lex
- Reasoned award (60–70% realistic success)

#### 14. EXECUTION_STAY_APPLICATION.lex

---

### DOMAIN-SPECIFIC ENHANCEMENTS

Include:

✔ CPWD / FIDIC / IS Standards Matrix  
✔ Claim Calculations (realistic numbers)  
✔ Delay Analysis (days/months)  
✔ Contradiction Points (for demo use)  
✔ Evidence List (emails, logs, photos, reports)

---

### DEMO MODE OPTIMIZATION (IMPORTANT)

Ensure output is:
- Visually structured
- Easy to showcase in 60–90 sec demo
- Highlights:
  - Claim Matrix (hero feature)
  - Fact-Fit Gate
  - Contradiction points
  - Final Award

---

### STYLE

- Professional legal drafting tone
- No fluff, no generic AI language
- Use bullet clarity + structured headings
- Maintain court-ready seriousness

---

### INPUT (TO BE PROVIDED BY USER)

Project Type: [Hospital / Highway / Dam / Electrical / Township]  
Contract Value: ₹_____  
Key Issues: [Delay / Escalation / Variation / etc.]  
Jurisdiction: India (Rajasthan preferred)  

---

### FINAL OUTPUT GOAL

A COMPLETE, REALISTIC, HIGH-VALUE arbitration case file suitable for:
- Demo Mode
- Law firm presentation
- Contractor dispute simulation
- Legal drafting showcase
You are an expert Legal + DevOps AI system.

Your task is to GENERATE a COMPLETE GitHub-ready folder structure for an Infrastructure Arbitration Case under Indian law.

---

## 🎯 OBJECTIVE

Automatically create:

1. Folder name (standardized)
2. Full directory structure
3. All required files (.lex, .md)
4. Realistic legal content inside each file

The output must be COPY-PASTE READY into a GitHub repository.

---

## 📁 FOLDER NAMING RULE

Use this format:

INFRA_ARB_<ID>_<PROJECT_TYPE>_<YEAR>

Examples:
- INFRA_ARB_01_BUILDING_HOSPITAL_2026
- INFRA_ARB_02_ROAD_HIGHWAY_2026
- INFRA_ARB_03_DAM_IRRIGATION_2026
- INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026
- INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026

---

## 📂 DIRECTORY STRUCTURE (MANDATORY)

Generate EXACT structure:
{
  "case_meta": {
    "case_id": "TC-23",
    "folder_name": "INFRA_ARB_02_ROAD_HIGHWAY_2026",
    "title": "45 km NH Highway Arbitration Case",
    "project_type": "Road Highway",
    "location": "Rajasthan, India",
    "year": 2026,
    "contract_value_inr": 1126500000,
    "currency": "INR",
    "status": "Arbitration Invoked",
    "demo_priority": "highest",
    "tags": ["NHAI", "FIDIC", "Delay", "EOT", "Price Escalation"]
  },

  "parties": {
    "claimant": {
      "name": "M/s. Rajputana Infra Projects Pvt. Ltd.",
      "role": "Contractor"
    },
    "respondent": {
      "name": "National Highways Authority of India",
      "role": "Employer"
    }
  },

  "timeline": [
    {
      "event": "Tender Issued",
      "date": "2024-02-18",
      "notes": ""
    },
    {
      "event": "Work Order (LOA)",
      "date": "2024-06-10",
      "notes": "₹112.65 Cr, 24 months"
    },
    {
      "event": "Site Possession",
      "date": "2024-09-12",
      "delay_days": 78,
      "notes": "Forest clearance + protests"
    },
    {
      "event": "Termination Notice",
      "date": "2026-02-20"
    },
    {
      "event": "Arbitration Invocation",
      "date": "2026-03-05"
    }
  ],

  "claim_matrix": [
    {
      "claim_id": "C1",
      "title": "Delay in Site Possession",
      "amount_inr": 148500000,
      "fact_fit_score": 96,
      "status": "VERIFIED",
      "category": "Delay",
      "clauses": ["FIDIC 2.1", "GCC Clause 5"],
      "evidence": [
        "LOA Document",
        "Possession Memo",
        "Progress Reports"
      ]
    },
    {
      "claim_id": "C2",
      "title": "Price Escalation",
      "amount_inr": 97500000,
      "fact_fit_score": 93,
      "status": "VERIFIED",
      "category": "Escalation",
      "clauses": ["Clause 10CC"],
      "evidence": ["WPI Index Data"]
    },
    {
      "claim_id": "C5",
      "title": "Loss of Profit",
      "amount_inr": 89000000,
      "fact_fit_score": 68,
      "status": "SECONDARY",
      "category": "Profit",
      "evidence": ["Hudson Formula"]
    }
  ],

  "documents": {
    "work_order": {
      "file_type": "lex",
      "content": "WORK ORDER NO: ...",
      "clauses": ["Arbitration Clause 25", "LD Clause"]
    },

    "legal_notice": {
      "file_type": "lex",
      "date": "2026-01-10",
      "content": "LEGAL NOTICE ...",
      "demand_amount_inr": 385000000
    },

    "no_satisfaction_letter": {
      "file_type": "lex",
      "date": "2026-02-20",
      "content": "We record dissatisfaction..."
    },

    "arb_application_sec11": {
      "court": "High Court of Rajasthan",
      "file_type": "lex",
      "content": "Application under Section 11(6)..."
    }
  },

  "claim_statement": {
    "language_versions": {
      "english": {
        "claims": [
          {
            "claim_id": "C1",
            "title": "Delay in Site Possession",
            "amount_inr": 148500000,
            "facts": "Site delayed by 78 days...",
            "clauses": ["FIDIC 2.1"],
            "calculation": {
              "overheads": 36000000,
              "machinery_idle": 47500000,
              "labour_idle": 12000000
            },
            "evidence": [
              "Emails",
              "Site Logs",
              "Photos"
            ],
            "fact_fit_status": "VERIFIED"
          }
        ]
      },
      "hindi": {
        "claims": [
          {
            "claim_id": "C1",
            "title": "साइट कब्जा में देरी",
            "amount_inr": 148500000,
            "facts": "78 दिन की देरी...",
            "fact_fit_status": "VERIFIED"
          }
        ]
      }
    }
  },

  "counter_claims": [
    {
      "title": "Recovery for incomplete work",
      "amount_inr": 225000000
    },
    {
      "title": "Liquidated Damages",
      "amount_inr": 112600000
    }
  ],

  "witnesses": [
    {
      "name": "Anil Kumar Meena",
      "role": "Resident Engineer",
      "statement": "Site possession delayed due to forest clearance"
    }
  ],

  "cross_examination": [
    {
      "question": "Did you give written notice within 28 days?",
      "answer": "Yes via emails",
      "impact": "Adverse inference possible"
    }
  ],

  "award": {
    "date": "2026-12-20",
    "awarded_amount_inr": 416500000,
    "interest_rate_percent": 8.5,
    "counter_claim_status": "Partially Allowed",
    "summary": "Major claims allowed, minor LD imposed"
  },

  "execution": {
    "section_36": {
      "status": "Filed",
      "stay_requested": true
    }
  },

  "standards_matrix": {
    "codes": [
      "FIDIC 2.1",
      "FIDIC 8.4",
      "MoRTH Specifications",
      "IRC SP 84",
      "IS 2386"
    ]
  },

  "verification_summary": {
    "total_claims": 5,
    "verified": 3,
    "secondary": 1,
    "pending": 1,
    "risk_level": "Moderate",
    "strongest_claim": "Delay in Site Possession"
  },

  "demo_features": {
    "highlight_claim": "C1",
    "show_contradictions": true,
    "watermark": "DEMO MODE",
    "cta": "Start Your Own Case"
  }
}

{
  "meta": {
    "case_id": "TC-23",
    "title": "45 km NH Highway Arbitration",
    "project_type": "Road Highway",
    "status": "Arbitration Invoked",
    "location": "Rajasthan",
    "contract_value_display": "₹112.65 Cr",
    "last_updated": "2026-04-09",
    "demo_mode": true,
    "watermark": "DEMO MODE"
  },

  "dashboard": {
    "summary_cards": [
      {
        "label": "Total Claim",
        "value": "₹55.30 Cr"
      },
      {
        "label": "Award (Expected/Actual)",
        "value": "₹41.65 Cr"
      },
      {
        "label": "Verified Claims",
        "value": "4 / 6"
      },
      {
        "label": "Risk Level",
        "value": "Moderate"
      }
    ],

    "highlight": {
      "title": "Strongest Claim",
      "description": "Delay in Site Possession (78 days)",
      "badge": "VERIFIED",
      "amount": "₹14.85 Cr"
    }
  },

  "timeline_ui": [
    {
      "date": "2024-06-10",
      "title": "Work Order Issued",
      "tag": "Contract",
      "description": "₹112.65 Cr project awarded"
    },
    {
      "date": "2024-09-12",
      "title": "Delayed Site Possession",
      "tag": "Delay",
      "highlight": true,
      "description": "78 days delay due to forest clearance"
    },
    {
      "date": "2026-02-20",
      "title": "Termination Notice",
      "tag": "Dispute"
    },
    {
      "date": "2026-03-05",
      "title": "Arbitration Invoked",
      "tag": "Legal"
    }
  ],

  "claim_matrix_ui": {
    "columns": ["Claim", "Amount", "Status", "Score"],
    "rows": [
      {
        "id": "C1",
        "claim": "Delay in Site Possession",
        "amount": "₹14.85 Cr",
        "status": "VERIFIED",
        "score": 96,
        "color": "green",
        "expandable": true
      },
      {
        "id": "C2",
        "claim": "Price Escalation",
        "amount": "₹9.75 Cr",
        "status": "VERIFIED",
        "score": 93,
        "color": "green"
      },
      {
        "id": "C5",
        "claim": "Loss of Profit",
        "amount": "₹8.90 Cr",
        "status": "SECONDARY",
        "score": 68,
        "color": "orange"
      }
    ]
  },

  "claim_details": {
    "C1": {
      "title": "Delay in Site Possession",
      "amount": "₹14.85 Cr",
      "status": "VERIFIED",
      "facts": "Site possession delayed by 78 days...",
      "clauses": ["FIDIC 2.1", "GCC Clause 5"],
      "calculation": [
        { "label": "Overheads", "value": "₹3.60 Cr" },
        { "label": "Machinery Idle", "value": "₹4.75 Cr" },
        { "label": "Labour Idle", "value": "₹1.20 Cr" }
      ],
      "evidence": [
        "LOA Document",
        "Possession Memo",
        "Progress Reports"
      ]
    }
  },

  "contradiction_panel": [
    {
      "issue": "Delay Denied by Respondent",
      "finding": "Official letters confirm 78-day delay",
      "severity": "High",
      "impact": "Strengthens Claim C1"
    },
    {
      "issue": "Missing Formal Notice",
      "finding": "Only email communication found",
      "severity": "Medium",
      "impact": "May weaken claim compliance"
    }
  ],

  "documents_ui": {
    "tabs": [
      {
        "id": "claim_statement_en",
        "label": "Claim (English)",
        "content": "Full English draft content...",
        "downloadable": true
      },
      {
        "id": "claim_statement_hi",
        "label": "Claim (Hindi)",
        "content": "पूर्ण हिंदी दावा कथन...",
        "downloadable": true
      },
      {
        "id": "legal_notice",
        "label": "Legal Notice",
        "content": "LEGAL NOTICE text..."
      }
    ]
  },

  "award_ui": {
    "awarded": "₹41.65 Cr",
    "interest": "8.5%",
    "decision_summary": "Major claims allowed, minor LD imposed",
    "status_badge": "FAVOURABLE"
  },

  "verification_ui": {
    "bars": [
      { "label": "Verified", "value": 4, "color": "green" },
      { "label": "Secondary", "value": 1, "color": "orange" },
      { "label": "Pending", "value": 1, "color": "red" }
    ],
    "note": "Only VERIFIED claims are strongly supported by evidence"
  },

  "actions": [
    {
      "label": "Download PDF",
      "type": "primary",
      "action": "download_pdf"
    },
    {
      "label": "View Full Claim",
      "type": "secondary",
      "action": "open_claim"
    },
    {
      "label": "Start Your Own Case",
      "type": "cta",
      "action": "new_case"
    }
  ]
}

Perfect—this is where everything comes together: **AI → API → UI → Demo Mode**.

Below is a **UI-ready API response format (production-grade)** designed specifically for your Legal Luminaire frontend. It is optimized for:

* ⚡ Instant rendering (no transformation needed)
* 📊 Claim Matrix UI
* 📅 Timeline UI
* ⚖️ Draft viewer
* 🚨 Contradiction panel
* 🎬 Demo Mode

---

# 🚀 **UI-READY API RESPONSE FORMAT (v1.0)**

```json id="ui-api-response-v1"
{
  "meta": {
    "case_id": "TC-23",
    "title": "45 km NH Highway Arbitration",
    "project_type": "Road Highway",
    "status": "Arbitration Invoked",
    "location": "Rajasthan",
    "contract_value_display": "₹112.65 Cr",
    "last_updated": "2026-04-09",
    "demo_mode": true,
    "watermark": "DEMO MODE"
  },

  "dashboard": {
    "summary_cards": [
      {
        "label": "Total Claim",
        "value": "₹55.30 Cr"
      },
      {
        "label": "Award (Expected/Actual)",
        "value": "₹41.65 Cr"
      },
      {
        "label": "Verified Claims",
        "value": "4 / 6"
      },
      {
        "label": "Risk Level",
        "value": "Moderate"
      }
    ],

    "highlight": {
      "title": "Strongest Claim",
      "description": "Delay in Site Possession (78 days)",
      "badge": "VERIFIED",
      "amount": "₹14.85 Cr"
    }
  },

  "timeline_ui": [
    {
      "date": "2024-06-10",
      "title": "Work Order Issued",
      "tag": "Contract",
      "description": "₹112.65 Cr project awarded"
    },
    {
      "date": "2024-09-12",
      "title": "Delayed Site Possession",
      "tag": "Delay",
      "highlight": true,
      "description": "78 days delay due to forest clearance"
    },
    {
      "date": "2026-02-20",
      "title": "Termination Notice",
      "tag": "Dispute"
    },
    {
      "date": "2026-03-05",
      "title": "Arbitration Invoked",
      "tag": "Legal"
    }
  ],

  "claim_matrix_ui": {
    "columns": ["Claim", "Amount", "Status", "Score"],
    "rows": [
      {
        "id": "C1",
        "claim": "Delay in Site Possession",
        "amount": "₹14.85 Cr",
        "status": "VERIFIED",
        "score": 96,
        "color": "green",
        "expandable": true
      },
      {
        "id": "C2",
        "claim": "Price Escalation",
        "amount": "₹9.75 Cr",
        "status": "VERIFIED",
        "score": 93,
        "color": "green"
      },
      {
        "id": "C5",
        "claim": "Loss of Profit",
        "amount": "₹8.90 Cr",
        "status": "SECONDARY",
        "score": 68,
        "color": "orange"
      }
    ]
  },

  "claim_details": {
    "C1": {
      "title": "Delay in Site Possession",
      "amount": "₹14.85 Cr",
      "status": "VERIFIED",
      "facts": "Site possession delayed by 78 days...",
      "clauses": ["FIDIC 2.1", "GCC Clause 5"],
      "calculation": [
        { "label": "Overheads", "value": "₹3.60 Cr" },
        { "label": "Machinery Idle", "value": "₹4.75 Cr" },
        { "label": "Labour Idle", "value": "₹1.20 Cr" }
      ],
      "evidence": [
        "LOA Document",
        "Possession Memo",
        "Progress Reports"
      ]
    }
  },

  "contradiction_panel": [
    {
      "issue": "Delay Denied by Respondent",
      "finding": "Official letters confirm 78-day delay",
      "severity": "High",
      "impact": "Strengthens Claim C1"
    },
    {
      "issue": "Missing Formal Notice",
      "finding": "Only email communication found",
      "severity": "Medium",
      "impact": "May weaken claim compliance"
    }
  ],

  "documents_ui": {
    "tabs": [
      {
        "id": "claim_statement_en",
        "label": "Claim (English)",
        "content": "Full English draft content...",
        "downloadable": true
      },
      {
        "id": "claim_statement_hi",
        "label": "Claim (Hindi)",
        "content": "पूर्ण हिंदी दावा कथन...",
        "downloadable": true
      },
      {
        "id": "legal_notice",
        "label": "Legal Notice",
        "content": "LEGAL NOTICE text..."
      }
    ]
  },

  "award_ui": {
    "awarded": "₹41.65 Cr",
    "interest": "8.5%",
    "decision_summary": "Major claims allowed, minor LD imposed",
    "status_badge": "FAVOURABLE"
  },

  "verification_ui": {
    "bars": [
      { "label": "Verified", "value": 4, "color": "green" },
      { "label": "Secondary", "value": 1, "color": "orange" },
      { "label": "Pending", "value": 1, "color": "red" }
    ],
    "note": "Only VERIFIED claims are strongly supported by evidence"
  },

  "actions": [
    {
      "label": "Download PDF",
      "type": "primary",
      "action": "download_pdf"
    },
    {
      "label": "View Full Claim",
      "type": "secondary",
      "action": "open_claim"
    },
    {
      "label": "Start Your Own Case",
      "type": "cta",
      "action": "new_case"
    }
  ]
}
```

---

# 🎯 Why this is UI-perfect

## 1. Zero transformation needed

Frontend can directly map:

| UI Component        | JSON Field                |
| ------------------- | ------------------------- |
| Dashboard cards     | `dashboard.summary_cards` |
| Timeline            | `timeline_ui`             |
| Claim table         | `claim_matrix_ui`         |
| Claim detail drawer | `claim_details`           |
| Contradiction panel | `contradiction_panel`     |
| Document viewer     | `documents_ui.tabs`       |
| Award card          | `award_ui`                |

---

## 2. Built for Demo Mode 🔥

* `highlight`
* `contradiction_panel`
* `verification_ui`
* `watermark`

→ Perfect for your **90-sec pitch**

---

## 3. Supports expandable UX

* Click claim → `claim_details`
* Tabs → `documents_ui`
* Buttons → `actions`

---

## 4. Clean separation

* Data (meta)
* UI-ready (formatted strings)
* Interaction (actions)

---

# ⚡ If you want next step (highly recommended)

I can now generate:

### 🔹 React UI components (ready)

* Claim Matrix table
* Timeline component
* Contradiction panel
* Document viewer

### 🔹 FastAPI endpoint

```bash
POST /api/generate-case
GET /api/case/{id}
```

### 🔹 Full end-to-end architecture

* AI → JSON → DB → UI

---

Just say:

👉 **“Make React UI”**
👉 **“Make FastAPI endpoints”**
👉 **“Full system architecture”**

and I’ll wire your entire Legal Luminaire system like a production SaaS 🚀
