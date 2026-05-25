# Legal Luminaire App Audit: Scattered Code

Date: 2026-05-20

## Scope

Audited the local React/Vite app under `artifacts/legal-luminaire`, the workspace docs, and the public Harvey LAB article supplied by the user.

Source used for enrichment:

- Harvey, "Open-Sourcing Harvey's Long Horizon Legal Agent Benchmark", May 6, 2026: https://www.harvey.ai/blog/introducing-harveys-legal-agent-benchmark

## Findings

### 1. App shell is carrying too much feature wiring

`artifacts/legal-luminaire/src/App.tsx` contains route declarations, sidebar navigation data, layout, case-scoped link rules, provider setup, and lazy imports in one file. This makes the app harder to audit when new modules are added.

Recommended consolidation:

- Move `NAV_GROUPS` to `src/config/navigation.ts`.
- Move route declarations to `src/routes.tsx`.
- Keep `App.tsx` focused on providers and the router shell.

### 2. Large domain datasets live directly in frontend source

Several files are large enough to behave like content databases:

- `src/data/defenceData.ts`
- `src/data/defenceHindi.ts`
- `src/data/defenceGrounds.ts`
- `src/lib/case01-data.ts`
- `src/lib/verification-engine.ts`

Recommended consolidation:

- Put static legal content under `src/data/legal-content/`.
- Keep engines under `src/lib/engines/`.
- Move generated or bulky case bundles out of hand-edited app code where practical.

### 3. Some source text appears encoding-corrupted

Several Hindi labels render as mojibake in `App.tsx`, `Home.tsx`, and `case01-data.ts`. This creates visual defects and makes search/review unreliable.

Recommended remediation:

- Re-encode affected files as UTF-8.
- Add a small text-integrity check for common mojibake sequences before release.

### 4. Harvey content should stay centralized

The app already had a Harvey integration guide, but the new LAB evaluation concepts were not represented in reusable app data. Adding them inline to a page would scatter the logic further.

Implemented consolidation:

- Added `src/data/harveyEvaluation.ts` for source-backed evaluation content.
- Added `src/components/HarveyEvaluationPanel.tsx` as the reusable UI.
- Mounted the panel on `src/pages/Home.tsx`.

## Harvey/LAB Enrichment Applied

The app now exposes:

- A legal-advice boundary that avoids case-specific negligence strategy for active matters.
- Evaluation workflows suitable for firms or in-house teams: report organization, inconsistency detection, chronology building, deposition-topic outlines, document-request lists, and counsel-review issue outlines.
- LAB-inspired concepts: closed client-matter workspace, reviewable work product, expert rubric criteria, and all-pass grading.
- Readiness checks for source anchoring, contradiction surfacing, human review, completeness, factual support, and privilege-safe wording.

## Next Refactor Targets

1. Extract navigation and route configuration from `App.tsx`.
2. Create a content registry for large case/citation datasets.
3. Add a lightweight `rg "Ã|Â|â"` CI check or Vitest text-integrity test for corrupted encoding.
4. Split `verification-engine.ts` into citation, standards, and evidence-gap modules.
