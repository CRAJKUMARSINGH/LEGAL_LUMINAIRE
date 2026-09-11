# Smart Drop — Design
**Flag**: `smart_drop`
**Version**: 1.1 (enriched Week 1 — September 2026)
**Owner**: Trae (Week 3)

---

## Architecture

```
Frontend                                Backend
─────────────────────────────────────   ────────────────────────────────────────
SmartDropPage (flag-gated)              POST /api/v1/smart-drop/classify
  └── DropZone                            ├─ Flag check → 404 if OFF
        │ drop / paste event              ├─ Keyword match (FIR markers, headers)
        ├─ reads file preview             ├─ Short embedding similarity
        │  (first 2 KB, client-side)      ├─ confidence = weighted avg
        └─ POST /classify                 └─ returns: type, confidence, proposed_entry
              │
              │ { type, confidence,      POST /api/v1/smart-drop/confirm
              │   proposed_entry }         ├─ Flag check → 404 if OFF
              ▼                            ├─ Validate register_entry schema
          ProposalCard                     ├─ Write to case register (case_manager)
            ├─ ConfidenceBadge            └─ returns: { success, register_entry_id }
            ├─ TypeLabel (EN + HI)
            ├─ WarningBanner              (confidence < 0.6 — bilingual)
            ├─ EditableRegisterFields
            └─ ConfirmButton → POST /confirm
```

---

## Data Flow

1. User drops a file onto `DropZone`.
2. Browser reads the first 2 KB as `content_preview` (no full file upload to classify).
3. `POST /classify` returns `{ type, confidence, proposed_entry }`.
4. `ProposalCard` renders the proposal. If `confidence < 0.6`, `WarningBanner` shows.
5. User reviews and optionally edits `proposed_entry` fields in place.
6. `ConfirmButton` triggers `POST /confirm` — only then does the register entry get written.
7. On success, `DropZone` resets; the new register entry appears in the case document list.

The actual file upload follows the **existing** `/api/v1/cases/upload-document` flow — Smart Drop only adds classification + confirm-before-register on top. It does not replace the existing upload path.

---

## Classification Strategy

```
confidence = 0.55 × keyword_score + 0.45 × embedding_score

keyword_score:
  - Scan content_preview for document-type markers:
    "प्रथम सूचना रिपोर्ट" / "First Information Report" / "FIR No." → type="fir"
    "आरोप पत्र" / "Charge Sheet" / "Challan" → type="charge_sheet"
    "जमानत आदेश" / "Bail Order" / "Bail Application" → type="bail_order"
    "फोरेंसिक रिपोर्ट" / "FSL Report" / "Forensic Science Laboratory" → type="forensic_report"
    "साक्ष्य सूची" / "Evidence List" / "Exhibit No." → type="evidence_list"
    fallback → type="general_document"

embedding_score:
  - Embed content_preview with existing embedding model (reuse rag/document_store.py embedder)
  - Cosine similarity against 6 type exemplars stored in backend/data/smart_drop_exemplars.json
  - Score in [0, 1]
```

**Confidence display rules:**
- `confidence ≥ 0.80` → green badge, no warning
- `0.60 ≤ confidence < 0.80` → amber badge, soft prompt to review
- `confidence < 0.60` → red badge, `WarningBanner` (bilingual), confirm button requires checkbox

---

## Key Files

| File | Action |
|------|--------|
| `src/pages/SmartDropPage.tsx` | NEW — flag-gated on `smart_drop` |
| `src/components/smart-drop/DropZone.tsx` | NEW — drag-and-drop zone, reads preview |
| `src/components/smart-drop/ProposalCard.tsx` | NEW — proposal display + edit + confirm |
| `src/components/smart-drop/ConfidenceBadge.tsx` | NEW — colour-coded confidence indicator |
| `backend/api/routes_smart_drop.py` | NEW — flat-convention router, 2 endpoints |
| `backend/data/smart_drop_exemplars.json` | NEW — 6 type exemplars for embedding match |
| `backend/api/models.py` | EXTEND — `DroppedDocument`, `RegisterEntry`, `ClassifyRequest/Response`, `ConfirmRequest/Response` |
| `backend/main.py` | EXTEND — register `smart_drop_router` with prefix `/api/v1` |

---

## Pydantic Models (backend/api/models.py extensions)

```python
class ClassifyRequest(BaseModel):
    case_id: str
    filename: str
    content_preview: str  # max 2000 chars

class ClassifyResponse(BaseModel):
    type: Literal["fir","charge_sheet","bail_order","forensic_report","evidence_list","general_document"]
    type_hi: str          # Hindi label
    confidence: float     # 0.0–1.0
    proposed_entry: dict  # RegisterEntry fields pre-filled

class ConfirmRequest(BaseModel):
    case_id: str
    document_id: str
    register_entry: dict
    model_config = ConfigDict(extra="forbid")

class ConfirmResponse(BaseModel):
    success: bool
    register_entry_id: str
```

---

## Bilingual Labels

| Document Type | English | Hindi |
|---|---|---|
| `fir` | First Information Report | प्रथम सूचना रिपोर्ट |
| `charge_sheet` | Charge Sheet / Challan | आरोप-पत्र / चालान |
| `bail_order` | Bail Order | जमानत आदेश |
| `forensic_report` | Forensic / FSL Report | फोरेंसिक / एफएसएल रिपोर्ट |
| `evidence_list` | Evidence List | साक्ष्य सूची |
| `general_document` | General Document | सामान्य दस्तावेज़ |

Warning banner text:
> **Low confidence — please review carefully.**  
> **कम विश्वसनीयता — कृपया ध्यान से जांचें।**

---

## Route

`/smart-drop` added to `routes.tsx` behind `integrationFlags.smart_drop` check.  
Follows the existing `Wrap()` + lazy import pattern.

---

## Accuracy Guardrails

- The system **never** auto-confirms a register entry — human confirmation is always required.
- `confidence < 0.6` blocks the confirm button until the user explicitly checks a bilingual acknowledgement checkbox.
- `content_preview` (2 KB max) means the full document text never leaves the client during classification — only a preview is sent.
- Register entries written by this flow are tagged `source: "smart_drop"` for audit trail.

---

## Rollback

Set `smart_drop` flag to OFF. The `/smart-drop` route and both API endpoints return 404.  
Existing register entries created via this flow are **preserved** — nothing is deleted.  
The existing `/api/v1/cases/upload-document` flow is unaffected.

---

## Hand-off to Week 3 (Trae)

1. Read `.kiro/specs/smart-drop/requirements.md` and this design before writing code.
2. Import flag: `import { integrationFlags } from "@/lib/featureFlags"` — gate the route and API behind `integrationFlags.smart_drop`.
3. Reuse `backend/rag/document_store.py` embedder for `embedding_score` — do not introduce a new embedding model.
4. The confirm endpoint must call the existing `case_manager` register-write logic, not bypass it.
5. All confidence values must be stored in the DB / case JSON alongside the register entry (audit trail).
6. Completion doc: `docs/integration/WEEK03_TRAE_COMPLETION.md`.
