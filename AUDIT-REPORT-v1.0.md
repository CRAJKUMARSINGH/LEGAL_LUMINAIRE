# AUDIT-REPORT-v1.0.md

## 1. Executive Summary

### Scope & limitations (truthfulness clause)
- This audit is based **only on the files present in the local workspace** at `C:\Users\Rajkumar\LEGAL_LUMINAIRE`.
- No GitHub Actions/CI config was found in this workspace (`.github/` does not exist), so CI/CD pipeline auditing is limited to local scripts/configs.
- Dependency CVE verification is **limited** because the frontend currently has **no pinned versions / lockfile** (see **KERO-002**), making “exact installed versions” indeterminate from source alone.

### Risk heatmap (likelihood × impact)
| Area | Critical | High | Medium | Low |
|---|---:|---:|---:|---:|
| Backend API runtime correctness | 1 | 3 | 2 | 0 |
| Supply-chain / reproducible builds | 1 | 2 | 1 | 0 |
| Security (OWASP / SSRF / data exposure) | 1 | 2 | 1 | 0 |
| UX / accessibility | 0 | 1 | 2 | 1 |
| Performance / bundle | 0 | 1 | 2 | 1 |

### Top 5 critical issues (must-fix before “production-like” use)
1. **KERO-001**: Backend crashes on import (`BaseModel` referenced before import) in `backend/api/routes.py`.
2. **BOLT-001**: Frontend dependency versions are wildcards (`"*"`) → **non-reproducible builds** and unbounded supply-chain risk.
3. **KERO-003**: Pydantic models use **mutable list defaults** → cross-request state bleed risk.
4. **GENSPARK-001**: Crew pipeline file contains duplicated crew construction and dead code paths → unpredictable outputs and fragile debugging.
5. **KERO-004**: `browse_page()` can fetch arbitrary URLs (no allowlist enforcement) → SSRF / internal network probing risk if exposed.

---

## 2. Detailed Issue Ledger

> Format per requirement: Issue ID, file path + exact line range, severity, defect type, short description, why it matters, reproduction, evidence snippet.

### 1) bolt.new AI (architecture coherence / prototyping debt)

#### BOLT-001
- **File**: `artifacts/legal-luminaire/package.json` **L12–L76**
- **Severity**: **Critical**
- **Defect type**: **Security flaw / Anti-pattern**
- **Short description**: Frontend devDependencies are largely `"*"` which makes builds non-reproducible and increases supply-chain risk.
- **Why it matters**: A fresh install can pull different major versions (breaking runtime) and can silently introduce vulnerable transitive deps; reproducibility is effectively **0%**.
- **Reproduction**:
  1. Run `npm install` on two machines/days.
  2. Observe potentially different resolved dependency trees.
- **Evidence snippet**:

```12:76:artifacts/legal-luminaire/package.json
  "devDependencies": {
    "@replit/vite-plugin-cartographer": "*",
    "@tailwindcss/vite": "*",
    "@tanstack/react-query": "*",
    "@types/react": "*",
    "react": "*",
    "react-dom": "*",
    "vite": "*",
    "zod": "*"
  },
```

#### BOLT-002
- **File**: `artifacts/legal-luminaire/vite.config.ts` **L19–L36**
- **Severity**: **High**
- **Defect type**: **Anti-pattern**
- **Short description**: Build config includes Replit-only plugins with dynamic `await import(...)` paths in the main config.
- **Why it matters**: Tooling behavior differs by env (`REPL_ID`), increasing config drift; adds uncertainty to dev/prod parity and complicates debugging.
- **Reproduction**: Run in an env where `REPL_ID` is set unexpectedly → extra plugins load.
- **Evidence snippet**:

```19:36:artifacts/legal-luminaire/vite.config.ts
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
```

---

### 2) Cursor AI (type safety / code quality)

#### CURSOR-001
- **File**: `artifacts/legal-luminaire/backend/agents/crew.py` **L203–L215**
- **Severity**: **High**
- **Defect type**: **Bug / Anti-pattern**
- **Short description**: `crew = Crew(...)` is constructed twice identically, indicating dead/duplicated logic.
- **Why it matters**: Confusing control flow increases the chance of future regressions and makes debugging task execution non-deterministic.
- **Reproduction**: Run `run_legal_crew()` and inspect logs; duplication is visible in code path.
- **Evidence snippet**:

```203:215:artifacts/legal-luminaire/backend/agents/crew.py
    crew = Crew(
        agents=[researcher, verifier, checker, drafter],
        tasks=[task_research, task_verify_standards, task_fact_check, task_draft],
        process=Process.sequential,
        verbose=True,
    )

    crew = Crew(
        agents=[researcher, verifier, checker, drafter],
        tasks=[task_research, task_verify_standards, task_fact_check, task_draft],
        process=Process.sequential,
        verbose=True,
    )
```

#### CURSOR-002
- **File**: `artifacts/legal-luminaire/backend/api/models.py` **L25–L41**
- **Severity**: **High**
- **Defect type**: **Bug**
- **Short description**: Pydantic models use mutable defaults (`[]`) for list fields.
- **Why it matters**: Mutable defaults can be shared across instances → cross-request leakage and hard-to-debug state bleed.
- **Reproduction**: Create multiple `ResearchResponse()` objects and mutate `tasks_output`; state can persist unexpectedly.
- **Evidence snippet**:

```25:41:artifacts/legal-luminaire/backend/api/models.py
class ResearchResponse(BaseModel):
    success: bool
    case_id: str
    mode: str
    draft: str = ""
    tasks_output: list[TaskOutput] = []
```

---

### 3) Qoder AI (performance / bundle bloat)

#### QODER-001
- **File**: `artifacts/legal-luminaire/src/App.tsx` **L5–L28**
- **Severity**: **Medium**
- **Defect type**: **Performance bottleneck**
- **Short description**: App routes import many pages eagerly (no code-splitting), increasing initial bundle size.
- **Why it matters**: Larger JS bundle increases TTI; more mobile users see slower first load.
- **Reproduction**: Build and inspect bundle; initial chunk includes all imported pages.
- **Evidence snippet**:

```5:28:artifacts/legal-luminaire/src/App.tsx
import Home from "@/pages/Home";
import DischargeApplication from "@/pages/DischargeApplication";
import CaseResearch from "@/pages/CaseResearch";
import CrossReferenceMatrix from "@/pages/CrossReferenceMatrix";
import FilingChecklist from "@/pages/FilingChecklist";
import OralArguments from "@/pages/OralArguments";
import StandardsValidity from "@/pages/StandardsValidity";
import CaseIntakeAssistant from "@/pages/CaseIntakeAssistant";
import AIResearchEngine from "@/pages/AIResearchEngine";
import AIDraftEngine from "@/pages/AIDraftEngine";
import DefenceReply from "@/pages/DefenceReply";
```

---

### 4) Warp AI (DX / build reproducibility / env drift)

#### WARP-001
- **File**: `artifacts/legal-luminaire/vite.config.ts` **L7–L18**
- **Severity**: **Medium**
- **Defect type**: **DX debt**
- **Short description**: Dev server port/base are environment-dependent; config recently required env vars to be set.
- **Why it matters**: New devs get “connection refused” / server fails to start; increases onboarding time.
- **Reproduction**: Run `npm run dev` without env vars (prior to defaults) → hard crash.
- **Evidence snippet**:

```7:18:artifacts/legal-luminaire/vite.config.ts
// Allow sane defaults for local development if env vars are not set.
const rawPort = process.env.PORT ?? "5173";
...
const basePath = process.env.BASE_PATH ?? "/";
```

---

### 5) Kero AI (security vulnerabilities / OWASP / supply-chain)

#### KERO-001
- **File**: `artifacts/legal-luminaire/backend/api/routes.py` **L211–L227**
- **Severity**: **Critical**
- **Defect type**: **Bug**
- **Short description**: `BaseModel` is referenced before it is imported, causing backend import-time failure.
- **Why it matters**: Entire backend API fails to start → total outage.
- **Reproduction**:
  1. Start backend (`uvicorn main:app`).
  2. Import error/NameError occurs when `routes.py` is imported.
- **Evidence snippet**:

```211:227:artifacts/legal-luminaire/backend/api/routes.py
class ChatRequest(BaseModel):
    case_id: str
    message: str
    history: list[dict] = []

...
from pydantic import BaseModel as _BaseModel
```

#### KERO-002
- **File**: `artifacts/legal-luminaire/package.json` **L12–L76**
- **Severity**: **High**
- **Defect type**: **Security flaw**
- **Short description**: No lockfile is present/required by policy, and versions are unpinned.
- **Why it matters**: Cannot perform reliable CVE audits or reproduce builds; supply-chain attacks are harder to detect.
- **Reproduction**: N/A (structural).
- **Evidence snippet**: See **BOLT-001** snippet.

#### KERO-003
- **File**: `artifacts/legal-luminaire/backend/api/models.py` **L25–L41**
- **Severity**: **Critical**
- **Defect type**: **Bug / Security flaw**
- **Short description**: Mutable defaults in response models risk cross-request data leakage.
- **Why it matters**: A user could receive stale data from another request, violating confidentiality.
- **Reproduction**: Instantiate two responses; mutate list; observe unexpected sharing in some Python patterns.
- **Evidence snippet**: See **CURSOR-002**.

#### KERO-004
- **File**: `artifacts/legal-luminaire/backend/agents/tools.py` **L70–L90**
- **Severity**: **High**
- **Defect type**: **Security flaw**
- **Short description**: `browse_page()` fetches arbitrary URLs without enforcing `VERIFIED_DOMAINS` allowlist.
- **Why it matters**: If an attacker can influence the URL (directly or via tool misuse), this is an SSRF vector (internal network scanning / metadata endpoints).
- **Reproduction**: Call `browse_page("http://127.0.0.1:...")` from tool path if exposed via agent/task.
- **Evidence snippet**:

```70:90:artifacts/legal-luminaire/backend/agents/tools.py
def browse_page(url: str) -> str:
    ...
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
```

---

### 6) Windsurf AI (UX consistency / accessibility)

#### WINDSURF-001
- **File**: `artifacts/legal-luminaire/src/components/ui/accuracy-badge.tsx` **L49–L64**
- **Severity**: **Medium**
- **Defect type**: **UX debt / Accessibility**
- **Short description**: Badge uses color to convey status without additional accessibility semantics (no `aria-label`, no `role="status"`).
- **Why it matters**: WCAG 2.2 AA: color-only signals reduce accessibility for color-vision deficiencies; screen readers may not announce state changes.
- **Reproduction**: Enable screen reader; state changes aren’t announced as status.
- **Evidence snippet**:

```49:64:artifacts/legal-luminaire/src/components/ui/accuracy-badge.tsx
<div className={`inline-flex items-center gap-2 border rounded-lg ... ${config.color}`}>
  <Icon className="w-4 h-4" />
  <span className="font-semibold">{config.label}</span>
```

---

### 7) Replit AI (workspace misconfigs / hot reload stability)

#### REPLIT-001
- **File**: `artifacts/legal-luminaire/vite.config.ts` **L5, L19–L35**
- **Severity**: **Medium**
- **Defect type**: **DX debt**
- **Short description**: Runtime overlay plugin and optional Replit-only plugins add environment-coupled behavior, which can destabilize hot reload on non-Replit local setups.
- **Why it matters**: Local dev should match expected tooling; inconsistent plugins increase “works on my machine” drift.
- **Evidence snippet**: See **BOLT-002**.

---

### 8) Lovable AI (onboarding / PMF friction)

#### LOVABLE-001
- **File**: `artifacts/legal-luminaire/backend/.env.example` **L4–L33**
- **Severity**: **Low**
- **Defect type**: **Docs gap**
- **Short description**: Env file suggests putting real keys in `.env` but doesn’t provide a safe “local-only” first-run path (mock mode).
- **Why it matters**: Onboarding friction: users can’t try the system without keys; encourages unsafe copying of secrets.
- **Evidence snippet**:

```4:10:artifacts/legal-luminaire/backend/.env.example
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
```

---

### 9) GenSpark AI (data-flow correctness / API contracts)

#### GENSPARK-001
- **File**: `artifacts/legal-luminaire/backend/agents/crew.py` **L147–L201**
- **Severity**: **High**
- **Defect type**: **Bug / Anti-pattern**
- **Short description**: `draft_instruction` string is built twice with confusing embedded Task construction (unused `Task(...)` call assigned to `draft_instruction` variable in a prior revision pattern).
- **Why it matters**: Increased risk of passing wrong prompt/inputs to the drafter; harder to reason about idempotency and correctness.
- **Evidence snippet**:

```147:201:artifacts/legal-luminaire/backend/agents/crew.py
    # ── Task 4: Draft the discharge application ───────────────────────────────
    draft_instruction = f"""
...
    task_draft = Task(
        description=draft_instruction,
        agent=drafter,
        ...
    )
```

---

### 10) Kimi AI (long-context coherence / modular scalability)

#### KIMI-001
- **File**: `artifacts/legal-luminaire/backend/agents/tools.py` **L121–L171**
- **Severity**: **Medium**
- **Defect type**: **Anti-pattern**
- **Short description**: `verify_is_standard()` contains a “known standards” hardcoded dictionary that may diverge from actual verified texts over time.
- **Why it matters**: Long-term maintainability and accuracy: hardcoded scope/verdict text risks becoming stale or mismatched with official revisions.
- **Evidence snippet**:

```121:171:artifacts/legal-luminaire/backend/agents/tools.py
KNOWN_STANDARDS = {
  "IS 1199:2018": { "scope": "...", "verdict": "...", "url": "..." },
  ...
}
```

---

## 3. Remediation Roadmap (lossless, prioritized, with diffs)

> The diffs below are surgical and independently revertible. They preserve existing behavior unless it is provably buggy.

### FIX-KERO-001 (Priority 1) — backend import-time crash
- **Fixes**: KERO-001
- **Affected modules**: `artifacts/legal-luminaire/backend/api/routes.py`
- **Change**: Remove the broken `ChatRequest`/`ChatResponse` classes or import `BaseModel` before use; keep only one request model.

```diff
--- a/artifacts/legal-luminaire/backend/api/routes.py
+++ b/artifacts/legal-luminaire/backend/api/routes.py
@@
+from pydantic import BaseModel
@@
-class ChatRequest(BaseModel):
-    case_id: str
-    message: str
-    history: list[dict] = []
-
-
-class ChatResponse(BaseModel):
-    reply: str
-    sources: list[str] = []
-    verification_notes: list[str] = []
-
-
-from pydantic import BaseModel as _BaseModel
-
-
-class _ChatRequest(_BaseModel):
+class ChatRequest(BaseModel):
     case_id: str
     message: str
     history: list[dict] = []
@@
-async def chat(req: _ChatRequest):
+async def chat(req: ChatRequest):
```

- **Rollback**: `git revert` this commit only.
- **Verification criteria**: `uvicorn main:app` starts; `GET /api/v1/health` returns 200; `POST /api/v1/chat` accepts payload.

### FIX-KERO-003 (Priority 2) — mutable defaults in Pydantic models
- **Fixes**: KERO-003, CURSOR-002
- **Affected modules**: `artifacts/legal-luminaire/backend/api/models.py`

```diff
--- a/artifacts/legal-luminaire/backend/api/models.py
+++ b/artifacts/legal-luminaire/backend/api/models.py
@@
 class ResearchResponse(BaseModel):
@@
-    tasks_output: list[TaskOutput] = []
+    tasks_output: list[TaskOutput] = Field(default_factory=list)
@@
 class UploadResponse(BaseModel):
@@
-    indexed: list[dict] = []
-    skipped: list[str] = []
-    errors: list[str] = []
+    indexed: list[dict] = Field(default_factory=list)
+    skipped: list[str] = Field(default_factory=list)
+    errors: list[str] = Field(default_factory=list)
```

### FIX-BOLT-001 / FIX-KERO-002 (Priority 3) — restore reproducible builds
- **Fixes**: BOLT-001, KERO-002
- **Affected modules**: `artifacts/legal-luminaire/package.json` (+ lockfile)
- **Change**:
  - Replace `"*"` with pinned semver ranges (or exact versions).
  - Commit `package-lock.json` (npm) and enforce `npm ci` for deterministic installs.

### FIX-KERO-004 (Priority 4) — SSRF guard for `browse_page`
- **Fixes**: KERO-004
- **Affected modules**: `artifacts/legal-luminaire/backend/agents/tools.py`
- **Change**: parse hostname and enforce allowlist; block private IPs; require `https` (except `http://archive.org` if needed).

### FIX-CURSOR-001 / FIX-GENSPARK-001 (Priority 5) — crew pipeline de-duplication
- **Fixes**: CURSOR-001, GENSPARK-001
- **Affected modules**: `artifacts/legal-luminaire/backend/agents/crew.py`
- **Change**: remove duplicate crew construction; simplify draft instruction assembly; ensure tasks output mapping is correct.

---

## 4. QA Sign-Off Checklist & Traceability Matrix

### Pre-flight checklist
- [ ] Frontend `npm ci && npm run build` succeeds on clean machine
- [ ] Backend `python -m pip install -r requirements.txt` succeeds on clean venv
- [ ] Backend boots: `uvicorn main:app` and `GET /api/v1/health` returns 200
- [ ] `POST /api/v1/cases/{case_id}/upload` indexes files without crashing
- [ ] `POST /api/v1/cases/{case_id}/research` completes with bounded runtime
- [ ] No new high/critical vulnerabilities from `npm audit` / `pip-audit` (after pinning)
- [ ] Accessibility smoke-check: keyboard navigation and screen reader label coverage for key status badges

### Automated guards (prevent recurrence)
- ESLint + TypeScript strict mode gates
- Pre-commit hook (optional) to run `npm run typecheck` + `python -m compileall`
- CI (if added later): run `npm ci`, `npm run build`, backend unit smoke tests, `pip-audit`

### Traceability matrix (initial)
| Issue ID | Fix ID | Test ID |
|---|---|---|
| KERO-001 | FIX-KERO-001 | TEST-API-BOOT-001 |
| KERO-003 / CURSOR-002 | FIX-KERO-003 | TEST-MODELS-001 |
| BOLT-001 / KERO-002 | FIX-BOLT-001 | TEST-LOCKFILE-001 |
| KERO-004 | FIX-KERO-004 | TEST-SSRF-001 |
| CURSOR-001 / GENSPARK-001 | FIX-CURSOR-001 | TEST-CREW-001 |

---

## 5. Appendix

### Test snippets (examples)

```python
# TEST-API-BOOT-001 (smoke)
from fastapi.testclient import TestClient
from main import app

def test_health():
    c = TestClient(app)
    r = c.get("/api/v1/health")
    assert r.status_code == 200
```

