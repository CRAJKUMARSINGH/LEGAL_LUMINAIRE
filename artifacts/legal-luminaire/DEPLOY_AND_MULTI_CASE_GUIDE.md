# Deploy + Multi-Case Guide

## 1) Deploy on Vercel

1. Import `artifacts/legal-luminaire` as project root in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Keep `vercel.json` in root (already added) for SPA route fallback.

## 2) Deploy on Netlify

1. Import the same folder as site root.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. `netlify.toml` + `public/_redirects` (already added) handle SPA routing.

## 3) If build fails on cloud

This repo currently uses workspace-style dependencies (`catalog:` / `workspace:*`).
If your cloud install fails:

- deploy from the same monorepo/package-manager context used during development, or
- replace workspace-only dependency references with direct package versions in `package.json`.

## 4) How to use this app for other cases

Current app content is case-specific (Case 01). To support multiple advocates/cases:

1. Create a `cases/` data layer (JSON or Markdown per case), e.g.:
   - `cases/case-01/`
   - `cases/case-02/`
2. Store shared templates separately:
   - discharge template
   - cross-reference template
   - filing checklist template
3. Add a case selector in UI (dropdown) and route pattern:
   - `/case/:caseId/discharge-application`
   - `/case/:caseId/cross-reference`
4. Render all pages from selected case data instead of hardcoded strings.
5. Keep print workflow same for all cases (already fixed).

## 5) Minimum case data fields

- Court name, case number, FIR details
- Parties and accused profile
- Facts timeline
- Standards matrix rows
- Case-law links
- Prayer clauses
- Verification/affidavit blocks

With this, one codebase can generate court-ready outputs for unlimited cases.
