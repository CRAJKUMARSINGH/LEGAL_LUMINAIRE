# Deploy + Multi-Case Guide

---

## 1) Deploy on Netlify (Recommended — Monorepo Root)

### Prerequisites
- pnpm ≥ 10 installed locally (`npm i -g pnpm@10`)
- Node.js 22

### Clean-clone verification (run locally before connecting Netlify)
```bash
git clone https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE.git
cd LEGAL_LUMINAIRE
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @workspace/legal-luminaire run build
# Verify the publish directory exists:
ls artifacts/legal-luminaire/dist/public/index.html
```

### Netlify UI setup (one-time)
1. Click **Add new site → Import an existing project → GitHub**.
2. Select the **LEGAL_LUMINAIRE** repository.
3. Leave **Base directory** blank (use repo root).
4. Netlify will auto-detect `netlify.toml` — do **not** override:
   - Build command: `pnpm install --frozen-lockfile && pnpm --filter @workspace/legal-luminaire run build`
   - Publish directory: `artifacts/legal-luminaire/dist/public`
5. Click **Deploy site**.

### Verification after deploy
- Open the Netlify preview URL.
- Navigate to `/cases`, `/demo-browser`, `/case/case-01/discharge-application` — all must load (SPA redirect active).
- No 404 on direct URL access.

### What the config provides
| Setting | Value |
|---------|-------|
| Node version | 22 |
| pnpm version | 10 |
| Publish dir | `artifacts/legal-luminaire/dist/public` |
| SPA redirect | `/* → /index.html 200` |
| Asset caching | `max-age=31536000, immutable` on `/assets/*` |
| Security headers | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |

---

## 2) Deploy on Netlify (Sub-directory only — fallback)

> Use this only if you are connecting `artifacts/legal-luminaire/` as the site root in Netlify.

1. Set **Base directory** to `artifacts/legal-luminaire` in the Netlify UI.
2. The `artifacts/legal-luminaire/netlify.toml` will be picked up automatically:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist/public`

---

## 3) Deploy on Vercel

1. Import `artifacts/legal-luminaire` as project root in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist/public`
4. `vercel.json` in root handles SPA route fallback.

---

## 4) Local development

```bash
# From repo root:
pnpm install
pnpm --filter @workspace/legal-luminaire run dev
# App at http://localhost:5173/
```

---

## 5) If build fails on cloud (workspace dependency issue)

This repo uses workspace-style dependencies (`catalog:` / `workspace:*`).
If your cloud install fails with unresolved catalog references:

- Always deploy from **monorepo root** with the root `netlify.toml` (preferred).
- If sub-directory deploy is required, the `artifacts/legal-luminaire/netlify.toml` uses `npm install` which resolves all deps from the package.json directly.

---

## 6) Multi-case architecture

The app currently ships with Case 01 (Hemraj Vardar) pre-loaded. To support additional cases:

1. Create a `cases/` data layer (JSON or Markdown per case), e.g.:
   - `cases/case-01/`
   - `cases/case-02/`
2. Store shared templates separately:
   - discharge template
   - cross-reference template
   - filing checklist template
3. Add a case selector in UI (dropdown at `/cases` route) and use the route pattern:
   - `/case/:caseId/discharge-application`
   - `/case/:caseId/cross-reference`
4. Render all pages from selected case data instead of hardcoded strings.
5. Keep the print workflow the same for all cases.

---

## 7) Minimum case data fields

- Court name, case number, FIR details
- Parties and accused profile
- Facts timeline
- Standards matrix rows
- Case-law links (with verification tier)
- Prayer clauses
- Verification/affidavit blocks

With this, one codebase can generate court-ready outputs for unlimited cases.
