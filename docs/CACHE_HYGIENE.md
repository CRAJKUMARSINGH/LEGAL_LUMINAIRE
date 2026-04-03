# LEGAL LUMINAIRE — CACHE & ARTIFACT HYGIENE
## Version 1.0 | April 3, 2026

---

## CACHE DIRECTORIES TO CLEAN

### Python
| Path | Type | Clean Command | Notes |
|------|------|---------------|-------|
| `.pytest_cache/` | pytest cache | `Remove-Item -Recurse -Force .pytest_cache` | Clean before each test run |
| `**/__pycache__/` | Python bytecode | `Get-ChildItem -Recurse -Filter __pycache__ \| Remove-Item -Recurse -Force` | Auto-regenerated |
| `artifacts/legal-luminaire/backend/chroma_db/` | ChromaDB vector store | Manual — only if re-indexing | Contains RAG embeddings |

### Node.js / Frontend
| Path | Type | Clean Command | Notes |
|------|------|---------------|-------|
| `artifacts/legal-luminaire/dist/` | Vite build output | `Remove-Item -Recurse -Force artifacts/legal-luminaire/dist` | Rebuild with `pnpm build` |
| `artifacts/api-server/dist/` | esbuild output | `Remove-Item -Recurse -Force artifacts/api-server/dist` | Rebuild with `pnpm build` |
| `node_modules/.cache/` | Vite/esbuild cache | `Remove-Item -Recurse -Force node_modules/.cache` | Clears transform cache |
| `lib/*/dist/` | TypeScript declaration output | `pnpm run typecheck` regenerates | Safe to delete |

### TypeScript
| Path | Type | Clean Command | Notes |
|------|------|---------------|-------|
| `tsconfig.tsbuildinfo` | TS incremental build | `Get-ChildItem -Recurse -Filter *.tsbuildinfo \| Remove-Item` | Forces full rebuild |
| `lib/*/tsconfig.tsbuildinfo` | Per-package TS cache | Same as above | |

---

## GITIGNORE ADDITIONS RECOMMENDED

Add to `.gitignore` if not already present:
```
# Python
__pycache__/
*.pyc
*.pyo
.pytest_cache/
*.egg-info/

# ChromaDB
artifacts/legal-luminaire/backend/chroma_db/

# Build outputs
dist/
*.tsbuildinfo

# Vite
node_modules/.vite/
node_modules/.cache/

# OS
.DS_Store
Thumbs.db
```

---

## CLEAN RUN PROCEDURE

Before a fresh test run:
1. `Get-ChildItem -Recurse -Filter __pycache__ | Remove-Item -Recurse -Force`
2. `Remove-Item -Recurse -Force .pytest_cache`
3. `Get-ChildItem -Recurse -Filter *.tsbuildinfo | Remove-Item`
4. `pnpm run typecheck` — rebuild TS declarations
5. Run tests

After improvements:
1. Repeat steps 1-3
2. `pnpm run build` — verify clean build
3. Commit only non-generated files

---

## STALE ARTIFACT AUDIT (April 3, 2026)

| File/Folder | Status | Action |
|-------------|--------|--------|
| `TEST_CASES/MARKETING_DEMO_CASES/` | 3 .lex files present | Expand to full 21 cases |
| `CASE_01_HemrajG/` | Working docs at root | Move to `docs/case-docs/CASE_01/` |
| `Attached_Assets/` | Unknown contents | Audit and move to `docs/` |
| `due task if any.md` | Stale task note | Archive to `docs/` |
| `ACCURACY_GUIDELINES.md` | Superseded by v2 | Keep for traceability |

---

## REPEATABLE CLEAN STRATEGY

- All generated files are in `dist/`, `__pycache__/`, `.pytest_cache/` — all gitignored.
- Source files are never auto-generated — safe to commit.
- ChromaDB data is environment-specific — never commit.
- pnpm lockfile (`pnpm-lock.yaml`) IS committed — do not delete.
