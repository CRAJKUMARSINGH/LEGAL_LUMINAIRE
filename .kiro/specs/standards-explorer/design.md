# Standards Explorer — Design
**Flag**: `standards_explorer`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Trae (Week 11)
**Source**: Local Law Explorer showcase (vibecode.law/showcase/local-law-explorer-812278)

---

## Architecture

```
Frontend                                  Backend
───────────────────────────────────────   ──────────────────────────────────────────
StandardsExplorerPage (/standards-explorer)
  │  [flag-gated: standards_explorer]     GET /api/v1/standards
  │                                         ├─ Flag check → 404 if OFF
  ├── SearchBar                             ├─ q: query string (optional)
  │     ├── text input (debounced 300ms)    ├─ body: "IS" | "ASTM" | "NABL" | all
  │     └── BodyFilter (IS / ASTM / NABL)  ├─ page, per_page (default 20)
  │                                         └─ returns: StandardsSearchResponse
  ├── ResultsList
  │     └── StandardCard × N             GET /api/v1/standards/{id}
  │           ├─ code + body badge          ├─ Flag check → 404 if OFF
  │           ├─ title (EN)                 └─ returns: Standard (full detail)
  │           ├─ relevanceScore badge
  │           └─ onClick → open detail    (read-only, no write endpoints)
  │
  └── StandardDetailPanel (drawer/modal)
        ├── CodeHeader: code + body badge
        ├── TitleBilingual: title (EN) + titleHi
        ├── PlainLanguageSummary (EN + HI tabs)
        ├── LegalContext (EN + HI tabs)
        ├── SourceLink → official body URL (opens new tab)
        ├── LastVerified date
        └── DisclaimerBanner (bilingual, always visible — never hidden)
```

---

## Data Model

```typescript
// src/types/standards.ts — NEW

export type StandardsBody = "IS" | "ASTM" | "NABL";

export interface Standard {
  id: string;
  code: string;                // e.g. "IS 1448", "ASTM D7777", "NABL 112"
  title: string;               // English title
  titleHi: string;             // Hindi title
  body: StandardsBody;
  summary: string;             // plain-language English summary (human-reviewed)
  summaryHi: string;           // plain-language Hindi summary (human-reviewed)
  legalContext: string;        // typical legal use context (EN)
  legalContextHi: string;      // typical legal use context (HI)
  sourceUrl?: string;          // official body URL — never a third-party mirror
  lastVerified: string;        // ISO-8601 date — when summaries were last reviewed
  applicableCategories: string[];  // e.g. ["forensic", "construction", "food_safety"]
}

export interface StandardsSearchResult {
  standard: Standard;
  relevanceScore: number;    // 0.0–1.0
  matchedTerms: string[];    // highlighted query terms
}

export interface StandardsSearchResponse {
  results: StandardsSearchResult[];
  total: number;
  page: number;
  perPage: number;
  query: string;
  bodyFilter: StandardsBody | "all";
}
```

```python
# backend/api/models.py extensions

class Standard(BaseModel):
    id: str
    code: str
    title: str
    title_hi: str
    body: Literal["IS", "ASTM", "NABL"]
    summary: str
    summary_hi: str
    legal_context: str
    legal_context_hi: str
    source_url: str | None = None
    last_verified: str
    applicable_categories: list[str] = []

class StandardsSearchResult(BaseModel):
    standard: Standard
    relevance_score: float
    matched_terms: list[str]

class StandardsSearchResponse(BaseModel):
    results: list[StandardsSearchResult]
    total: int
    page: int
    per_page: int
    query: str
    body_filter: str
```

---

## Search Strategy

```
GET /api/v1/standards?q=<query>&body=<IS|ASTM|NABL>

1. If q is empty: return all standards for selected body (paginated), sorted by code
2. If q is present:
   a. Keyword match: exact and partial code match (e.g. "1448" matches "IS 1448")
   b. Title full-text search (EN + HI): case-insensitive contains
   c. Summary full-text search: matches in summary or summaryHi
   d. Legal context search: matches in legalContext or legalContextHi
   e. relevanceScore = weighted combination:
      code_match × 0.50 + title_match × 0.30 + summary_match × 0.20
3. Results sorted by relevanceScore descending
4. body filter applied before scoring if specified
```

The standards index is `backend/rag/standards_index.py` (already exists).
`backend/rag/law_db.json` is extended with a `"standards"` array.
No new database — pure JSON + in-memory search for the demo scale.

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/StandardsExplorerPage.tsx` | NEW — flag-gated on `standards_explorer` |
| `src/components/standards/SearchBar.tsx` | NEW — query input + body filter dropdown |
| `src/components/standards/StandardCard.tsx` | NEW — summary card in results list |
| `src/components/standards/StandardDetailPanel.tsx` | NEW — drawer/modal with full detail |
| `src/components/standards/DisclaimerBanner.tsx` | NEW — bilingual disclaimer, always visible |
| `src/types/standards.ts` | NEW — `Standard`, `StandardsSearchResult`, `StandardsSearchResponse` |
| `backend/api/routes_standards_explorer.py` | NEW — flat-convention router, 2 endpoints |
| `backend/rag/standards_index.py` | EXTEND — add bilingual `summary_hi`, `legal_context_hi`, `applicable_categories` fields |
| `backend/rag/law_db.json` | EXTEND — add `"standards"` array with seed data (≥10 entries) |
| `backend/api/models.py` | EXTEND — `Standard`, `StandardsSearchResult`, `StandardsSearchResponse` |
| `backend/main.py` | EXTEND — register `standards_explorer_router` with prefix `/api/v1` |
| `src/routes.tsx` | EXTEND — add `/standards-explorer` route (flag-gated) |
| `docs/integration/WEEK11_TRAE_COMPLETION.md` | NEW |

---

## Seed Standards Data

Minimum 10 standards required for demo; seeded in `law_db.json`:

| Code | Body | Legal context |
|------|------|---------------|
| IS 1448 (Part 34) | IS | FSL petroleum analysis — arson cases |
| IS 2062 | IS | Structural steel — construction dispute cases |
| IS 3025 (Part 18) | IS | Water quality / BOD — environmental cases |
| IS 14543 | IS | Packaged drinking water — food safety cases |
| ASTM D7777 | ASTM | Density of solids — forensic evidence |
| ASTM E1412 | ASTM | Fire debris analysis — forensic |
| ASTM D6971 | ASTM | Motor oil condition — vehicle accident evidence |
| NABL 112 | NABL | Accreditation requirements for testing labs |
| NABL 130 | NABL | Requirements for medical testing labs |
| ASTM E1492 | ASTM | DNA evidence collection — forensic |

All summaries are human-authored. Hindi translations required before W11 ships.

---

## DisclaimerBanner

Always visible on the detail panel. Never hidden behind a toggle. Bilingual:

> **This is a summary only. Refer to the full standard text for authoritative content.**  
> **यह केवल सारांश है। प्रामाणिक सामग्री के लिए पूर्ण मानक पाठ देखें।**

`role="note"`, `aria-label="Standards disclaimer / मानक अस्वीकरण"`

---

## Bilingual UI Strings

| Element | English | Hindi |
|---|---|---|
| Page title | "Standards Explorer" | "मानक अन्वेषक" |
| Search placeholder | "Search by code or keyword…" | "कोड या कीवर्ड से खोजें…" |
| Body filter label | "Standards body" | "मानक निकाय" |
| Relevance badge | "Relevance: {score}%" | "प्रासंगिकता: {score}%" |
| Source link | "View official standard" | "आधिकारिक मानक देखें" |
| Last verified | "Last verified: {date}" | "अंतिम सत्यापित: {date}" |
| No results | "No standards match your search" | "आपकी खोज से कोई मानक मेल नहीं खाता" |

---

## Accuracy Guardrails

- All standard summaries are **human-reviewed, not AI-generated freehand**. A source review date (`lastVerified`) is mandatory on every entry.
- `sourceUrl` must point to the **official body's page** (bis.gov.in for IS, astm.org for ASTM, nabl.gov.in for NABL) — never a third-party mirror.
- The disclaimer is never hidden or suppressed, regardless of screen size or user preference.
- No standard is ever automatically marked "applicable" or "not applicable" — this is the user's expert determination.
- `relevanceScore` is a search-rank aid only — it does not imply legal applicability.

---

## Route

```tsx
// src/routes.tsx — add inside <Switch>:
const StandardsExplorerPage = lazy(() => import("@/pages/StandardsExplorerPage"));
...
{integrationFlags.standards_explorer && (
  <Route path="/standards-explorer" component={() => Wrap(<StandardsExplorerPage />, "StandardsExplorerPage")} />
)}
```

---

## Rollback

Set `standards_explorer` flag to OFF.
- `/standards-explorer` route disappears.
- Backend endpoints return 404.
- `law_db.json` standards data is preserved — read-only, nothing is deleted.

---

## Hand-off to Week 11 (Trae)

1. Read `.kiro/specs/standards-explorer/requirements.md` and this design before writing code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — gate the route and API behind `integrationFlags.standards_explorer`.
3. Reuse `backend/rag/standards_index.py` for search — do not introduce a new search engine or vector store.
4. `DisclaimerBanner` is **non-negotiable** — it must appear on every standard detail view.
5. `sourceUrl` values must be verified against the official body URL before merging.
6. Bilingual summaries (`summaryHi`, `legalContextHi`) must be present on all seed entries — no English-only entries allowed.
7. Completion doc: `docs/integration/WEEK11_TRAE_COMPLETION.md`.
