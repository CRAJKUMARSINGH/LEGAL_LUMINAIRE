# TASK SPECIFICATION — MARKETING DEMO MODE
## Legal Luminaire | Version 1.0 | April 3, 2026

---

## TASK ID: FEAT-DEMO-001

## PURPOSE
Implement a "Try Demo" mode that lets any user — without an API key or real case data —
experience the full Legal Luminaire workflow using pre-loaded synthetic test cases.
This is an essential marketing and conversion feature.

## USER PERSONAS
- Advocate evaluating the app before subscribing
- Law firm partner assessing breadth of coverage
- Investor or journalist verifying accuracy claims
- Sales team running live demonstrations

## WORKFLOW
```
Home → "Try Demo" button
  → Demo Case Selector (21 cards, filterable)
    → Select case (e.g., TC-01 Building Collapse)
      → Case pre-loaded from static JSON (no API call)
        → Dashboard: facts, charges, defence strategy
          → "Generate Draft" button
            → Draft output (from static pre-generated file)
              → Verification Report (VERIFIED/SECONDARY/PENDING tiers)
                → Pre-Filing Checklist
                  → "Start with your own case →" CTA
```

## REQUIRED UI ELEMENTS

| Element | Description | Priority |
|---------|-------------|----------|
| "Try Demo" button | On Home page, prominent | P0 |
| Demo Case Selector | 21 cards, filter by type | P0 |
| Demo Banner | Amber banner: "DEMO MODE — Synthetic data" | P0 |
| Accuracy Showcase Panel | Live Fact-Fit Gate scores | P1 |
| Standards Warning | IS 1199 flagged wrong — highlighted | P0 |
| Verification Report | Colour-coded tiers | P0 |
| Pre-Filing Checklist | Interactive checkboxes | P1 |
| Download Button | PDF with demo watermark | P1 |
| CTA to real case | Persistent "Start with real case →" | P0 |

## OUTPUT TYPES
See `docs/marketing/MARKETING_TASK_SPEC.md` for full output type matrix.

## SUCCESS CRITERIA
| Criterion | Target |
|-----------|--------|
| Works without API key | Yes — static data only |
| All 21 cases selectable | Yes |
| Demo banner always visible | Yes |
| No PENDING citation in demo draft | Yes — accuracy gate active |
| Mobile responsive | Yes |
| Load time < 2 seconds | Yes — static data |

## DATA REQUIREMENTS
- Static JSON/TS data files for all 21 cases
- Pre-generated draft outputs in `artifacts/demo-outputs/`
- Verification reports pre-computed
- Pre-filing checklists pre-computed

## ACCURACY COMPLIANCE
- All demo outputs carry `[DEMO PLACEHOLDER]` on citations
- Demo banner visible on all demo pages
- Accuracy gate active even in demo mode
- PENDING citations blocked even in demo mode
- Watermark: "LEGAL LUMINAIRE DEMO — NOT FOR FILING"

## TRACEABILITY
| Requirement | Source |
|-------------|--------|
| 21 case types | `test-assets/test-cases/functional/TC-01 to TC-21` |
| Demo outputs | `artifacts/demo-outputs/` |
| Accuracy rules | `docs/accuracy-governance/ACCURACY_RULES.md` |
| Marketing copy | `docs/marketing/MARKETING_SHOWCASE_MAP.md` |

## IMPLEMENTATION NOTES
- Use `CaseContext` to load demo case data
- Add `isDemoMode: boolean` flag to context
- Demo data lives in `src/data/demo-cases/` (one JSON per case)
- Demo banner component: `src/components/DemoBanner.tsx`
- Demo case selector: `src/pages/DemoCaseSelector.tsx`
- Route: `/demo` → selector, `/demo/:caseId` → case workspace
