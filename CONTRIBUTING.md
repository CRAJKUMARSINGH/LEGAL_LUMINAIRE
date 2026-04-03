# Contributing to Legal Luminaire

## Ground rules (accuracy + safety)
- **No fabricated citations**: any legal authority added must be traceable and verifiable.
- **Synthetic vs real**: demo assets must be clearly marked **SYNTHETIC / DEMO**.
- **No secrets**: do not commit `.env`, API keys, credentials, or private case documents.
- **Respect governance**: follow `docs/accuracy-governance/ACCURACY_RULES.md`.

## Dev quickstart

### Frontend
```powershell
cd artifacts\legal-luminaire
npm install --ignore-scripts
npm run dev
```

### Backend (optional)
```powershell
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Pull requests
- Keep PRs **small** and focused.
- Include a short **test plan** in the PR description:
  - `pnpm run typecheck`
  - `python -m compileall artifacts/legal-luminaire/backend`
- If changing prompts/agents, describe how the change affects:
  - verification tiers (VERIFIED/SECONDARY/PENDING)
  - Fact-Fit Gate scoring

## Adding demo/test assets
- Put reusable templates under `test-assets/` (not inside production runtime paths).
- Keep file names stable; avoid duplicates that differ only by case (Windows compatibility).

