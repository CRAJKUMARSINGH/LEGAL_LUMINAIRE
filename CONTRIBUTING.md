# Contributing to Legal Luminaire

Welcome! Legal Luminaire is an accuracy-first AI legal workbench for Indian courts. We're excited to have you contribute.

## Before You Start

Read the [Accuracy Rules](docs/accuracy-governance/ACCURACY_RULES.md) — they govern every feature.

**Non-negotiables:**
- No fabricated citations — every legal authority must be traceable and verifiable
- All demo assets must be marked **SYNTHETIC / DEMO** (never real case data)
- No secrets — never commit .env, API keys, credentials, or real court documents
- The Citation Gate must remain wired — it's the core of the accuracy promise
- New routes go into src/routes.tsx only (never replace App.tsx)

## Quick Dev Setup

### Frontend (React + TypeScript + Vite)
`ash
git clone https://github.com/CRAJKUMARSINGH/legal-luminaire.git
cd legal-luminaire
pnpm install
pnpm --filter @workspace/legal-luminaire run dev
# Opens at http://localhost:5173
`

### Backend (FastAPI, optional)
`ash
cd artifacts/legal-luminaire/backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
`

### Before submitting a PR
`ash
pnpm --filter @workspace/legal-luminaire run typecheck   # must exit 0
pnpm --filter @workspace/legal-luminaire run test        # 343+ tests must pass
pnpm --filter @workspace/legal-luminaire run build       # must build cleanly
python -m compileall artifacts/legal-luminaire/backend   # syntax check
`

## Pull Request Guidelines

1. **Small, focused PRs** — one feature or fix per PR
2. **Branch name**: eat/your-feature or ix/your-bug
3. **PR description** must include:
   - What problem it solves
   - How to test it
   - Whether it affects any Accuracy Rules
4. **New features** must be behind a VITE_FF_* feature flag defaulting alse
5. **New pages** must be added to src/routes.tsx only (additive, never replace)

## Adding Demo / Test Data

- Use 	est-assets/ folder for reusable templates
- All test data must be completely synthetic (no real names, FIR numbers, or orders)
- Add SYNTHETIC / DEMO labels to any UI showing demo data

## Code Style

- TypeScript strict mode — no ny types in new code
- Bilingual strings — new UI text needs both English and Hindi labels
- Accessibility — ria-label on all icon-only buttons

## Questions?

Open a [GitHub Discussion](https://github.com/CRAJKUMARSINGH/legal-luminaire/discussions) or reach out via [LinkedIn](https://in.linkedin.com/in/rajkumar-singh-chauhan-76627b18).

Thank you for helping make Indian legal practice more accurate! ⚖️
