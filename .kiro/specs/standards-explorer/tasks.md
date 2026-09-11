# Standards Explorer — Tasks
**Flag**: `standards_explorer`
**Owner**: Trae (Week 11)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**Depends on**: `featureFlags.ts` (Week 1), `backend/rag/standards_index.py` (existing), `backend/rag/law_db.json` (existing — extend), `lucide-react` (already in tree)

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.standards_explorer` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm `backend/rag/standards_index.py` is importable (reuse for search — do not replace)
- [ ] Confirm `backend/rag/law_db.json` exists — extend it with a `"standards"` array
- [ ] Confirm `backend/api/models.py` compiles cleanly before adding new models
- [ ] Confirm `lucide-react` exports `Search`, `ExternalLink`, `AlertCircle`, `ChevronRight` icons

---

## T11.1 — Types
- [ ] Create `src/types/standards.ts`:
  - Export `StandardsBody` type: `"IS" | "ASTM" | "NABL"`
  - Export `Standard` interface (see design.md for full shape)
  - Export `StandardsSearchResult` interface: `{ standard, relevanceScore, matchedTerms }`
  - Export `StandardsSearchResponse` interface: `{ results, total, page, perPage, query, bodyFilter }`
- [ ] Add exports to `src/types/index.ts` barrel if one exists

## T11.2 — Seed data
- [ ] Extend `backend/rag/law_db.json` with a `"standards"` array containing ≥ 10 entries (see design.md seed table)
  - Every entry must have: `id`, `code`, `title`, `title_hi`, `body`, `summary`, `summary_hi`, `legal_context`, `legal_context_hi`, `source_url` (official body URL), `last_verified`, `applicable_categories`
  - `source_url` must be an official body domain (bis.gov.in, astm.org, nabl.gov.in)
  - Hindi fields (`title_hi`, `summary_hi`, `legal_context_hi`) must be non-empty for all entries

## T11.3 — Backend: Data models
- [ ] Add `Standard`, `StandardsSearchResult`, `StandardsSearchResponse` to `backend/api/models.py`
  - See design.md for field definitions
  - `Standard.body` must use `Literal["IS", "ASTM", "NABL"]`
  - `ConfigDict(extra="forbid")` on all models

## T11.4 — Backend: Standards index extension
- [ ] Extend `backend/rag/standards_index.py`:
  - Add `load_standards(law_db_path: str) -> list[Standard]` — loads from `law_db.json["standards"]`
  - Add `search_standards(query: str, body_filter: str | None, page: int, per_page: int) -> StandardsSearchResponse`
    - Implements the weighted scoring: code_match × 0.50 + title_match × 0.30 + summary_match × 0.20
    - Searches both EN and HI title/summary fields
    - Empty query → returns all (paginated), sorted by code
    - `body_filter` applied before scoring

## T11.5 — Backend: Router
- [ ] Create `backend/api/routes_standards_explorer.py` (flat convention)
  - `GET /api/v1/standards` — search endpoint
    - Check `FEATURE_STANDARDS_EXPLORER` env flag → 404 if OFF
    - Query params: `q` (optional), `body` (optional: IS|ASTM|NABL), `page` (default 1), `per_page` (default 20)
    - Returns `StandardsSearchResponse`
  - `GET /api/v1/standards/{standard_id}` — detail endpoint
    - Check `FEATURE_STANDARDS_EXPLORER` env flag → 404 if OFF
    - Returns `Standard` or 404 if not found
- [ ] Register router in `backend/main.py` under prefix `/api/v1`

## T11.6 — Frontend: API client
- [ ] Add `searchStandards(q: string, body?: StandardsBody, page?: number)` to `src/lib/api.ts`
- [ ] Add `getStandard(id: string)` to `src/lib/api.ts`
- [ ] Both functions must check `integrationFlags.standards_explorer` and throw if OFF

## T11.7 — Frontend: DisclaimerBanner component
- [ ] Create `src/components/standards/DisclaimerBanner.tsx`
  - Always visible — no toggle, no collapse, no dismiss
  - Bilingual text (see design.md)
  - `role="note"`, `aria-label="Standards disclaimer / मानक अस्वीकरण"`
  - Amber background to draw visual attention

## T11.8 — Frontend: SearchBar component
- [ ] Create `src/components/standards/SearchBar.tsx`
  - Props: `onSearch: (q: string, body: StandardsBody | "all") => void`
  - Text input: debounced 300ms, bilingual placeholder
  - BodyFilter: `<select>` or `<RadioGroup>` — options: All / IS / ASTM / NABL (bilingual labels)
  - Clear button (X icon) when query is non-empty
  - `aria-label` on input: `"Search standards / मानक खोजें"`

## T11.9 — Frontend: StandardCard component
- [ ] Create `src/components/standards/StandardCard.tsx`
  - Props: `result: StandardsSearchResult`, `onClick: (id: string) => void`
  - Shows: code (bold), body badge (IS/ASTM/NABL colour-coded), title (EN), relevance score as `{score*100}%` badge
  - Matched terms highlighted in the title (use `matchedTerms` array)
  - `role="button"`, `tabIndex={0}`, keyboard-accessible (Enter/Space triggers onClick)
  - Hover: subtle background change

## T11.10 — Frontend: StandardDetailPanel component
- [ ] Create `src/components/standards/StandardDetailPanel.tsx`
  - Props: `standard: Standard | null`, `onClose: () => void`
  - Renders as a slide-over drawer or modal (match existing app pattern)
  - Sections (in order):
    1. Code + body badge + title (EN + HI)
    2. Plain-language summary — tabbed: EN | HI
    3. Legal context — tabbed: EN | HI
    4. Source link: `ExternalLink` icon + "View official standard / आधिकारिक मानक देखें" → `sourceUrl` in new tab
    5. Last verified date (bilingual label)
    6. `DisclaimerBanner` — always visible, at the bottom
  - `role="dialog"`, `aria-labelledby` wired to title, close on Escape + click-outside
  - Keyboard focus trapped while open

## T11.11 — Frontend: StandardsExplorerPage
- [ ] Create `src/pages/StandardsExplorerPage.tsx`
  - Flag gate: if `!integrationFlags.standards_explorer` → render `<Navigate to="/" />`
  - Compose: `SearchBar` → `ResultsList` (with `StandardCard × N`) → `StandardDetailPanel` (when a card is clicked)
  - Initial load: call `searchStandards("")` to show all standards
  - Loading skeleton while fetching
  - Empty state: bilingual "No standards match your search / आपकी खोज से कोई मानक मेल नहीं खाता"
  - Page `<main aria-label="Standards Explorer / मानक अन्वेषक">`
  - `<h1>` bilingual: "Standards Explorer / मानक अन्वेषक"

## T11.12 — Frontend: Route wiring
- [ ] Add to `src/routes.tsx` using existing `Wrap()` + lazy import pattern:
  ```tsx
  const StandardsExplorerPage = lazy(() => import("@/pages/StandardsExplorerPage"));
  // inside <Switch>:
  {integrationFlags.standards_explorer && (
    <Route path="/standards-explorer" component={() => Wrap(<StandardsExplorerPage />, "StandardsExplorerPage")} />
  )}
  ```

## T11.13 — Testing
- [ ] Backend: unit test `search_standards("1448")` → assert IS 1448 in results with `relevance_score > 0.5`
- [ ] Backend: unit test `search_standards("", body_filter="NABL")` → assert only NABL standards returned
- [ ] Backend: unit test `GET /api/v1/standards` with flag OFF → assert 404
- [ ] Backend: unit test `GET /api/v1/standards/{id}` with unknown id → assert 404
- [ ] Frontend: render test `StandardCard` — assert code, title, and relevance score all visible
- [ ] Frontend: render test `StandardDetailPanel` — assert `DisclaimerBanner` always present regardless of standard content
- [ ] Frontend: render test `StandardsExplorerPage` with flag OFF → assert redirect, no page content
- [ ] Frontend: keyboard test — `StandardCard` responds to Enter key

## T11.14 — Completion doc
- [ ] Write `docs/integration/WEEK11_TRAE_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Include: files changed, CI result, seed data summary (entries count, bodies covered), hand-off notes for Week 12

---

## Acceptance Criteria
- [ ] Search returns ranked results for IS/ASTM/NABL codes and keywords (EN + HI fields searched)
- [ ] Every entry shows plain-language summary in both EN and HI tabs
- [ ] `DisclaimerBanner` visible on every standard detail view — never hidden
- [ ] `sourceUrl` on every entry points to official body domain
- [ ] No standard automatically marked applicable/inapplicable — user determination only
- [ ] Route `/standards-explorer` not registered when flag is OFF
- [ ] All interactive elements keyboard-accessible with correct `aria-*` attributes
- [ ] CI green after Week 11 changes
