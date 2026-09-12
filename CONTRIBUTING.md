# Contributing to Legal Luminaire 🤝⚖️

## Welcome 👋

Thank you for your interest in contributing to **Legal Luminaire**!

We welcome **everybody** — first-time contributors, seasoned open-source maintainers, Indian advocates and juniors, forensic engineers, legal-tech hackers, legal-AI researchers, and anyone who has ever read a legal citation and thought, "Wait — is that even real?"

If you are an advocate who has *ever* caught a misapplied standard or a hallucinated citation in your opponent's filings? You are exactly who we built this for. Please jump in. 👇

> **No PR is too small.** Fix a typo. Clarify a doc. Verify one `PENDING` citation to `VERIFIED` tier. That's how great work.

---

## Code of Conduct 🧡

This project follows the **Contributor Covenant v2.1**. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before participating.

Quick TL;DR: Be kind. Be precise. Be rigorous. We're all here to make the filing rack a safer place for advocates and their clients.

Enforcement issues? **Open a GitHub Issue and tag `@CRAJKUMARSINGH`.

---

## Ground Rules (Accuracy + Safety — NON-NEGOTIABLE) ⚠️

These 4 rules are the **foundation** of the project. They were written in courtrooms, not product meetings. Please take them seriously.

1. **No fabricated citations**: any legal authority added must be traceable and verifiable.
2. **Synthetic vs real**: demo assets must be clearly marked **SYNTHETIC / DEMO**.
3. **No secrets**: do not commit `.env`, API keys, credentials, or private case documents.
4. **Respect governance**: follow `docs/accuracy-governance/ACCURACY_RULES.md`.

If a PR you are reviewing or submitting *softens* any of these rules, it will be closed politely but firmly. Accuracy is not a feature toggle.

---

## Dev Quickstart 🧑‍💻

### Prerequisites

- **Node.js 22+** with **pnpm 10** (use corepack)
- **Python 3.11+** *(only for backend work — frontend demo mode does not need it)*

---

### Frontend

```powershell
# Windows (PowerShell)
cd artifacts\legal-luminaire
corepack enable
corepack prepare pnpm@10 --activate
pnpm install --frozen-lockfile
pnpm run dev
# App opens on http://localhost:5173 → click 🎬 Demo Mode
```

```bash
# macOS / Linux (bash)
cd artifacts/legal-luminaire
corepack enable
corepack prepare pnpm@10 --activate
pnpm install --frozen-lockfile
pnpm run dev
# App opens on http://localhost:5173 → click 🎬 Demo Mode
```

Verify your work:

```bash
# From repo root (runs libs + frontend typecheck + tests)
pnpm run typecheck
pnpm --filter @workspace/legal-luminaire run test
```

---

### Backend (optional)

Only needed if you are changing agents, RAG, routes, or AI research paths.

```powershell
# Windows (PowerShell)
cd artifacts\legal-luminaire\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # Add OPENAI_API_KEY + TAVILY_API_KEY
uvicorn main:app --reload
```

```bash
# macOS / Linux (bash)
cd artifacts/legal-luminaire/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # Add OPENAI_API_KEY + TAVILY_API_KEY
uvicorn main:app --reload
```

Verify your work:

```bash
python -m compileall artifacts/legal-luminaire/backend
```

---

## Pull Request Guidelines 🛠

Keep PRs **small** and focused. One ticket → one PR. One concern → one PR.

**PR title format:**
```
[area] Brief description (one line)
```
Examples: `[docs] Fix typo in Accuracy Rules IS 2250 note`, `[citation-gate] Cover FATAL_ERROR tier in scanDraft`, `[demo-cases] Add new NDPS bail demo stub`

**PR body checklist (copy-paste this into every PR description):**
```markdown
## Summary

(What does this PR do, briefly?)

## Test Plan

- [ ] `pnpm run typecheck` (from repo root)
- [ ] `pnpm --filter @workspace/legal-luminaire run test`
- [ ] `python -m compileall artifacts/legal-luminaire/backend` (if backend changed)
- [ ] Manual QA: Loaded CASE01_HEMRAJ_STATE_2025 → Discharge → Print view renders

## Accuracy / Governance Impact

- [ ] Affects citation verification tiers (VERIFIED / SECONDARY / PENDING / FATAL_ERROR / COURT_SAFE)
- [ ] Affects Fact-Fit Gate scoring (<30 auto-reject behavior)
- [ ] Changes prompts / agents / drafting templates
- [ ] No accuracy impact — docs / UI polish / refactor only

## References

- Closes #XX
```

**Additional guidelines:**

- Link to the GitHub Issue if one exists.
- Changelog: If the change is user-visible (not just internal), add a 1-line entry to `CHANGELOG.md` under a new `## UNRELEASED` heading.
- Large refactors: Please file a discussion issue first so we can plan together before the work happens.
- First-time contributors: You don't need to know everything. Ship it — we'll review together and get it right. ✅

---

## Adding Demo / Test Assets 📁

- Put reusable templates under `test-assets/` (not inside production runtime paths).
- Mark every synthetic asset **SYNTHETIC / DEMO** at the top of the file.
- Keep file names **stable** — rename only when there's a real semantic change.
- **Windows compat:** the filesystem is case-**insensitive**. Do not add two files that differ only by letter case (e.g., `CaseData.ts` vs `casedata.ts`) — one will be overwritten on clone.
- If you're adding a **new demo case pack**, follow the folder naming standard:
  ```
  CASE##_PARTY1_PARTY2_YEAR
  ```
  Example: `CASE27_YOURNAME_OTHER_2026`

---

## Bug Reports & Feature Requests 📝

Please use our modern **form-based YAML issue templates** — they make triage much faster for everyone.

- **🐛 Bug Report:** [`.github/ISSUE_TEMPLATE/bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml)
  → Steps to reproduce, expected vs actual, full environment field (OS / Node / Python / Browser), screenshots.

- **💡 Feature Request:** [`.github/ISSUE_TEMPLATE/feature_request.yml`](.github/ISSUE_TEMPLATE/feature_request.yml)
  → What problem does it solve, your proposed solution, alternatives you considered, and the all-important **Accuracy / Governance Impact checkboxes.

---

## Community 🌟

Legal Luminaire is more than code. It's a community of advocates and engineers who believe:

> *"Every accuracy rule in this app is a scar from a real case."*
> — Rajkumar Singh Chauhan

If you believe accuracy matters. If you've ever had a judge ask you a citation question you couldn't answer. If you want the future of Indian legal AI to be **for the bar, not just made of bytes — you're already one of us.

**Join us.** Open a PR. Open an issue. Star the repo. Tell a colleague.

The filing rack is waiting. ⚖️
