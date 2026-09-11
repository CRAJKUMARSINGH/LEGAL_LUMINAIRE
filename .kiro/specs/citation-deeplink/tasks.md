# Citation Deep-Link — Tasks
**Flag**: `citation_deeplink`
**Owner**: Kiro (Week 7)
**Spec version**: 1.1 (enriched Week 1 — September 2026)
**Depends on**: `featureFlags.ts` (Week 1), `case01-data.ts` (existing `sourceUrl` fields), `lucide-react` (already in tree)

---

## Pre-requisites (verify before starting)
- [ ] Confirm `integrationFlags.citation_deeplink` is `false` in `src/lib/featureFlags.ts`
- [ ] Confirm `src/lib/case01-data.ts` has `sourceUrl` on all COURT_SAFE and VERIFIED entries
- [ ] Confirm `lucide-react` exports `ExternalLink` and `Link2Off` icons
- [ ] Confirm `CitationBadge.tsx` exists and renders without the deep-link icon (baseline)

---

## T7.1 — Types and helpers
- [ ] Add `CitationDeepLinkInfo` type to `src/types/` (or extend existing citation types):
  ```typescript
  interface CitationDeepLinkInfo {
    url: string;
    tier: "COURT_SAFE" | "VERIFIED" | "SECONDARY" | "PENDING" | "FATAL_ERROR";
    tooltipEn: string;
    tooltipHi: string;
    clickable: boolean;
  }
  ```
- [ ] Add `getDeepLinkInfo(citation: CasePrecedent): CitationDeepLinkInfo` helper in `src/lib/citationResolver.ts` (new file)
  - Returns correct tooltip and `clickable` based on tier (see design.md table)
  - Returns `clickable: false` for PENDING and FATAL_ERROR regardless of `sourceUrl` presence

## T7.2 — CitationBadge extension
- [ ] Extend `src/components/CitationBadge.tsx` (or equivalent component that renders citation pills)
  - Add optional prop `showDeepLink?: boolean` (defaults to `integrationFlags.citation_deeplink`)
  - When `showDeepLink` is true: render `DeepLinkIcon` inline after the citation text
  - `DeepLinkIcon`:
    - COURT_SAFE → `<ExternalLink size={12} className="text-green-600" />`
    - VERIFIED → `<ExternalLink size={12} className="text-blue-600" />`
    - SECONDARY → `<ExternalLink size={12} className="text-amber-500" />`
    - PENDING / FATAL_ERROR → `<Link2Off size={12} className="text-muted-foreground opacity-50" />`
  - Wrap icon in `<a href={sourceUrl} target="_blank" rel="noopener noreferrer">` for clickable tiers
  - Non-clickable tiers: `<span aria-disabled="true">` with `cursor-not-allowed`
  - `aria-label` on anchor: `"Open source: {caseName} ({tier}) / स्रोत खोलें"`

## T7.3 — Tooltip component
- [ ] Create or reuse a `Tooltip` wrapper (check if shadcn/ui `Tooltip` is already in `components/ui/`)
- [ ] Attach bilingual tooltip to the `DeepLinkIcon`:
  - COURT_SAFE: `"Certified source / प्रमाणित स्रोत"`
  - VERIFIED: `"Official source / आधिकारिक स्रोत"`
  - SECONDARY: `"Secondary source — verify before filing / द्वितीयक स्रोत — दाखिल करने से पहले सत्यापित करें"`
  - PENDING: `"Unverified — link unavailable / असत्यापित"`
  - FATAL_ERROR: `"Factual error — do not cite / तथ्यात्मक त्रुटि"`

## T7.4 — CitationDeepLinkPanel (hover panel)
- [ ] Create `src/components/CitationDeepLinkPanel.tsx`
  - Props: `citation: CasePrecedent`, `anchorRef: React.RefObject<HTMLElement>`
  - Renders: source DB name, page/para number, verification tier badge, external link button
  - `role="tooltip"`, `aria-describedby` wired to the anchor element
  - Closes on Escape key and click-outside
  - Bilingual field labels

## T7.5 — VerificationPanel extension
- [ ] Extend `src/pages/VerificationPanel.tsx` (already exists)
  - When `integrationFlags.citation_deeplink` is ON: add `ExternalLink` icon column to the citation table
  - Only for COURT_SAFE / VERIFIED tiers; amber icon for SECONDARY; disabled icon for PENDING/FATAL_ERROR
  - No change to the existing verification tier logic

## T7.6 — SafeDraftEditor extension (optional, flag-gated)
- [ ] If `integrationFlags.citation_deeplink` is ON: inline citation references in `SafeDraftEditor.tsx` get the same `DeepLinkIcon` treatment
- [ ] Must not alter `citation-gate.ts` blocking logic — deep-link is purely additive

## T7.7 — Backend endpoint (if needed)
- [ ] Assess whether a backend endpoint is needed (frontend already has `sourceUrl` — likely not)
- [ ] If yes: add `GET /api/v1/citations/{citation_id}/deeplink` to `backend/api/routes_citations.py`
  - Returns `{ url, page, para, confidence }` or 404 if no verified URL
  - Flag check → 404 if OFF

## T7.8 — Testing
- [ ] Unit test `getDeepLinkInfo()` for all 5 tiers — assert `clickable`, `tooltipEn`, `tooltipHi` correct
- [ ] Render test for `CitationBadge` with `showDeepLink=true` — PENDING tier must not render a clickable anchor
- [ ] Render test for `CitationBadge` with `showDeepLink=false` (flag OFF) — icon must be absent
- [ ] Accessibility: verify anchor has `target="_blank"` with `rel="noopener noreferrer"`

## T7.9 — Completion doc
- [ ] Write `docs/integration/WEEK07_KIRO_COMPLETION.md` using `WEEK01_KIRO_COMPLETION.md` as template
  - Include: files changed, CI result, tier-behaviour table, hand-off notes for Week 8

---

## Acceptance Criteria
- [ ] Deep-link icon visible on COURT_SAFE / VERIFIED / SECONDARY citations when flag ON
- [ ] PENDING and FATAL_ERROR citations never have a clickable deep-link icon
- [ ] SECONDARY citations show persistent amber icon and bilingual tooltip warning
- [ ] All icons keyboard-accessible with correct `aria-label`
- [ ] Zero changes to `citation-gate.ts` blocking logic
- [ ] Zero changes to `case01-data.ts` citation records
- [ ] `citation_deeplink` flag OFF → no icons rendered, no behaviour change
- [ ] CI green after Week 7 changes
