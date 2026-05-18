# ETERNAL_RESEARCH_CHILD — Legal Luminaire Research Daemon

Background research daemon synchronized for **artifacts/legal-luminaire**.

Every 15 minutes it wakes up, picks a random file from `Attached_Assets/`,
analyses it for legal engine refinements, and asks for your approval before
anything is changed.

---

## What it does

| Step | Action |
|------|--------|
| 1 | Scans `Attached_Assets/` for `.md .lex .txt .pdf .docx .doc` files |
| 2 | Runs an app health check (all protected + patchable files present?) |
| 3 | Picks one file at random and pattern-matches its content |
| 4 | Generates a typed proposal (category + target file + code hint) |
| 5 | Asks `y/N` — never modifies anything without explicit approval |
| 6 | Logs every finding to `research_findings.log` |
| 7 | Sleeps 15 minutes, repeats |

---

## Proposal categories

| Category | Source asset type | Target file |
|----------|-------------------|-------------|
| `CITATION_GATE_RULE` | Citation risk plans | `citation-gate.ts` |
| `PRECEDENT_UPGRADE` | Case law files, Kattavellai | `case01-data.ts` |
| `STANDARD_CORRECTION` | IS/ASTM/BIS standards | `case01-data.ts` |
| `VERIFICATION_RECLASSIFY` | Verification plans | `case01-data.ts` |
| `DEMO_CASE_ENRICHMENT` | Arbitration drafts, ARBITRATE.MD | `infra-arb-cases.ts` |
| `FACT_FIT_THRESHOLD` | Scoring docs | `fact_fit_engine.py` |
| `ROADMAP_ITEM` | Logbooks, action plans | `ROADMAP.md` |
| `ACCURACY_RULE` | Prompts, master prompts | `accuracy-rules.md` |
| `DRAFTING_GROUND` | Any legal document | `case01-data.ts` |

---

## Protected vs Patchable

**Protected** (propose only — you apply manually):
- `src/lib/case01-data.ts`
- `src/lib/citation-gate.ts`
- `src/lib/verification-engine.ts`
- `src/context/CaseContext.tsx`
- `src/App.tsx`

**Patchable** (daemon can apply with `y` approval):
- `src/data/all-demo-cases.ts`
- `src/data/demo-cases/infra-arb-cases.ts`
- `src/lib/case-templates.ts`
- `backend/agents/fact_fit_engine.py`
- `backend/agents/standards_verifier.py`
- `ROADMAP.md`

---

## How to run

```powershell
# From workspace root — uses tsx (already installed globally)
tsx ETERNAL_RESEARCH_CHILD/research_daemon.ts

# Or from inside the folder
cd ETERNAL_RESEARCH_CHILD
npm install
npm start
```

---

## Accuracy rules enforced

All proposals follow `.kiro/steering/accuracy-rules.md`:
- Holdings must be **verbatim** — paraphrasing forbidden
- PENDING citations must have `blockedFromDraft: true`
- Every new precedent must carry `status / statusNote / sourceUrl / tags`
- IS 1199:2018 → fresh concrete only (never hardened masonry mortar)
- IS 2250:1981 → correct standard for masonry mortar
- Fact-Fit Gate: score ≥ 70 = exact, 50–69 = analogous, 30–49 = weak, < 30 = rejected

---

## Files tracked

| Folder | Contents |
|--------|----------|
| `Attached_Assets/` | 12 legal assets (citation plans, roadmaps, logbooks, prompts, arbitration drafts) |
| `real_cases/` | 7 real case folders (Hemraj, Pitambara, TC-22..TC-26) |

After approval, run:
```powershell
pnpm --filter @workspace/legal-luminaire test
pnpm --filter @workspace/legal-luminaire run typecheck
```
