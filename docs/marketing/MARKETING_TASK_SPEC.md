# LEGAL LUMINAIRE — MARKETING TASK SPECIFICATION
## Marketing-from-Test-Cases as an Essential App Feature
## Version 1.0 | April 3, 2026

---

## 1. PURPOSE

This specification defines "Marketing Demo Mode" as a first-class feature of
Legal Luminaire. The feature allows advocates, investors, and potential clients
to experience the app's capabilities through pre-loaded, polished test cases
without requiring an API key or real case data.

All demo content is clearly labelled as SYNTHETIC / DEMO DATA.

---

## 2. USER PERSONAS

### Persona A — Advocate Evaluating the App
- Wants to see output quality before committing
- Needs to see Hindi draft quality, citation accuracy, checklist completeness
- Will judge by: "Would I file this in court?"

### Persona B — Law Firm Partner / Decision Maker
- Wants to see breadth of case types supported
- Needs to see time savings vs. manual research
- Will judge by: "Does this cover my practice areas?"

### Persona C — Investor / Demo Audience
- Wants to see impressive, polished output
- Needs to see the accuracy gate in action
- Will judge by: "Is this genuinely different from ChatGPT?"

### Persona D — Legal Tech Journalist / Reviewer
- Wants to verify accuracy claims
- Needs to see verification tiers and blocked citations
- Will judge by: "Does it actually prevent hallucinations?"

---

## 3. WORKFLOW

```
[Home Page]
    ↓
[Click "Try Demo" button]
    ↓
[Demo Case Selector — 21 cases shown as cards]
    ↓
[Select case — e.g., "Building Collapse — Forensic Defence"]
    ↓
[Case pre-loaded with synthetic data]
    ↓
[Dashboard shows: facts, charges, defence strategy]
    ↓
[User clicks "Generate Discharge Application"]
    ↓
[Draft generated — Hindi, court-ready format]
    ↓
[Verification Report shown — VERIFIED / SECONDARY / PENDING tiers]
    ↓
[Pre-filing Checklist shown]
    ↓
[User can download or share demo output]
    ↓
[CTA: "Start with your own case →"]
```

---

## 4. REQUIRED UI ELEMENTS

### Demo Case Selector
- 21 case cards in a grid
- Each card shows: case type, court, charges, complexity level
- Filter by: Criminal / Civil / Writ / Consumer / Commercial
- "Featured" badge on Case 01 (most polished)
- "Marketing Showcase" badge on Cases 18-21

### Demo Banner
- Persistent banner on all demo pages: "DEMO MODE — Synthetic data only"
- Yellow/amber colour to distinguish from real case mode
- Link to "Start with real case"

### Accuracy Showcase Panel
- Side panel showing Fact-Fit Gate scores in real time
- Colour-coded: Green (VERIFIED), Yellow (SECONDARY), Red (PENDING/BLOCKED)
- "Why was this citation blocked?" tooltip

### Output Quality Indicators
- "Court-Ready" badge on completed drafts
- Word count + estimated reading time
- "Download as PDF" button (demo watermark)
- "Share demo" link

---

## 5. OUTPUT TYPES

For each demo case, the following outputs should be available:

| Output | Cases | Format |
|--------|-------|--------|
| Discharge Application | TC-01, TC-03, TC-07, TC-10, TC-11, TC-13 | Hindi PDF |
| Bail Application | TC-02, TC-04, TC-05, TC-08, TC-09, TC-12, TC-14 | Hindi PDF |
| Writ Petition | TC-06, TC-15, TC-17 | Hindi/English PDF |
| Written Submission | TC-16, TC-18, TC-19, TC-21 | English PDF |
| Application | TC-20 | Hindi PDF |
| Cross-Reference Matrix | All cases | HTML table |
| Verification Report | All cases | HTML |
| Pre-Filing Checklist | All cases | HTML checklist |

---

## 6. SUCCESS CRITERIA

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Demo loads without API key | Yes | Static data files present |
| All 21 cases selectable | Yes | Case selector shows 21 cards |
| Draft generated in < 10 seconds | Yes | Static data — no API call |
| Verification report shown | Yes | All citations have tier |
| No PENDING citation in draft | Yes | Accuracy gate enforced |
| Demo banner visible | Yes | UI inspection |
| CTA to real case visible | Yes | UI inspection |
| Mobile responsive | Yes | Responsive design |

---

## 7. TRACEABILITY TO TEST ASSETS

| Marketing Asset | Source Test Case | Source File |
|----------------|-----------------|-------------|
| Building collapse demo | TC-01 | test-cases/CASE_01_HemrajG/ |
| NDPS bail demo | TC-02 | test-cases/CASE_02_BailNDPS/ |
| NI Act discharge demo | TC-03 | test-cases/CASE_03_ChequeDischarge/ |
| Murder bail demo | TC-12 | test-cases/CASE_12_MurderBail/ |
| POCSO discharge demo | TC-13 | test-cases/CASE_13_RapeDischarge/ |
| Showcase polished demo | TC-18 | test-cases/CASE_18_InsuranceClaim/ |

---

## 8. COMPLIANCE WITH ACCURACY RULES

- All demo citations carry `[DEMO PLACEHOLDER — verify before filing]` label
- No demo output may be presented as a real court filing
- Demo banner must be visible on all demo pages
- Accuracy gate must be active even in demo mode
- PENDING citations must be blocked even in demo mode
- Demo outputs must carry watermark: "LEGAL LUMINAIRE DEMO — NOT FOR FILING"

---

## 9. IMPLEMENTATION TASKS

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Add "Try Demo" button to Home | P0 | Low | Frontend |
| Create demo case selector page | P0 | Medium | Frontend |
| Create static data files for TC-02 to TC-21 | P0 | High | Data |
| Add demo banner component | P0 | Low | Frontend |
| Add accuracy showcase panel | P1 | Medium | Frontend |
| Add PDF download with watermark | P1 | Medium | Frontend |
| Add "Share demo" link | P2 | Low | Frontend |
| Mobile responsive demo flow | P1 | Medium | Frontend |
