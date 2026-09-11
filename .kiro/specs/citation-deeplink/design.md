# Citation Deep-Link — Design
**Flag**: `citation_deeplink`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Kiro (Week 7)

---

## Architecture

```
Frontend                                Backend
─────────────────────────────────────   ────────────────────────────────────────
CitationBadge (enriched)                GET /api/v1/citations/{citation_id}/deeplink
  ├─ existing render (unchanged)          ├─ Flag check → 404 if OFF
  ├─ DeepLinkIcon (new, flag-gated)       ├─ Look up citation record
  └─ onClick → open in new tab            ├─ Returns { url, page, para, confidence }
                                          └─ 404 if citation has no verified URL

CitationDeepLinkPanel (new)             (no new write endpoints — read-only)
  ├─ Shows source info for hovered
  │  citation (URL, page, para, tier)
  └─ ExternalLink → open source PDF

VerificationReport (extended)
  └─ Each row: + ExternalLink icon
     when sourceUrl is VERIFIED/COURT_SAFE
```

---

## Data Flow

1. User views a citation in any panel (VerificationReport, CaseResearch, SafeDraftEditor).
2. If `citation_deeplink` flag is ON, each citation badge renders a small `ExternalLink` icon.
3. On click, the icon opens `sourceUrl` in a new tab — no backend call needed for COURT_SAFE/VERIFIED citations (URL is already in the citation record).
4. For SECONDARY citations, a tooltip warns: *"Secondary source — not verified on official database / द्वितीयक स्रोत — आधिकारिक डेटाबेस पर सत्यापित नहीं।"*
5. PENDING / FATAL_ERROR citations: deep-link icon is disabled (greyed out) with tooltip: *"Citation unverified — link unavailable."*

---

## Citation Tier → Deep-Link Behaviour

| Tier | Icon shown | Clickable | Tooltip (EN / HI) |
|---|---|---|---|
| `COURT_SAFE` | `ExternalLink` (green) | Yes — `sourceUrl` | Certified source / प्रमाणित स्रोत |
| `VERIFIED` | `ExternalLink` (blue) | Yes — `sourceUrl` | Official source / आधिकारिक स्रोत |
| `SECONDARY` | `ExternalLink` (amber) | Yes — `sourceUrl` | Secondary source — verify before filing / द्वितीयक स्रोत — दाखिल करने से पहले सत्यापित करें |
| `PENDING` | `Link2Off` (grey) | No | Unverified — link unavailable / असत्यापित |
| `FATAL_ERROR` | `Link2Off` (red) | No | Factual error — do not cite / तथ्यात्मक त्रुटि |

---

## Key Files

| File | Action |
|------|--------|
| `src/components/CitationBadge.tsx` | EXTEND — add `DeepLinkIcon` when flag ON |
| `src/components/CitationDeepLinkPanel.tsx` | NEW — hover panel showing source metadata |
| `src/pages/VerificationPanel.tsx` | EXTEND — add deep-link icon per row |
| `src/lib/featureFlags.ts` | READ — import `integrationFlags.citation_deeplink` |
| `src/lib/case01-data.ts` | READ — `sourceUrl` already present on VERIFIED/COURT_SAFE entries |
| `backend/api/routes_citations.py` | EXTEND (if needed) — `/citations/{id}/deeplink` endpoint |

---

## Data Model

Citation records already carry `sourceUrl` in `case01-data.ts`.  
No schema changes needed — deep-linking is a pure read of existing data.

```typescript
// Existing shape (no changes required)
interface CasePrecedent {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  date: string;
  status: "COURT_SAFE" | "VERIFIED" | "SECONDARY" | "PENDING" | "FATAL_ERROR";
  sourceUrl: string;       // ← deep-link target
  paraNumber?: string;
  blockedFromDraft: boolean;
  // ...
}
```

---

## Component API

```typescript
// Additions to CitationBadge props
interface CitationBadgeProps {
  citation: CasePrecedent;
  showDeepLink?: boolean;  // defaults to integrationFlags.citation_deeplink
}

// New component
interface CitationDeepLinkPanelProps {
  citation: CasePrecedent;
  anchorRef: React.RefObject<HTMLElement>;
}
```

---

## Accuracy Guardrails

- Deep-link icon is **never** shown for PENDING or FATAL_ERROR citations — these are blocked from all output per accuracy Rule 6.
- `sourceUrl` values are **never** constructed or inferred — they must be present in the citation record as-is (Rule 1: verified URL required).
- SECONDARY citation links display a persistent amber warning; users cannot suppress this warning.
- The feature is strictly read-only — it opens an external tab but does not alter citation data, drafts, or verification tiers.
- `blockedFromDraft: true` citations remain blocked even if a deep-link is somehow visible — the draft-gate in `citation-gate.ts` is the final authority.

---

## Rollback

Set `citation_deeplink` flag OFF. The `ExternalLink` icons and hover panel are hidden.  
No citation records, drafts, or verification tiers are affected.  
The `CitationBadge` falls back to its pre-Week-7 appearance.

---

## Hand-off to Week 7 (Kiro)

1. Read `.kiro/specs/citation-deeplink/requirements.md` and this design before writing code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — all new UI elements must be wrapped in `integrationFlags.citation_deeplink` checks.
3. Do **not** mutate `case01-data.ts` — `sourceUrl` fields are already correct; only consume them.
4. Icon components: use `lucide-react` `ExternalLink` and `Link2Off` (already in the dependency tree).
5. Hover panel must be keyboard-accessible (focus-visible ring, `role="tooltip"`, `aria-describedby`).
6. Bilingual tooltips required for all five tier states (see table above).
7. Completion doc: `docs/integration/WEEK07_KIRO_COMPLETION.md`.
