"""Pydantic request/response models for the API."""
from __future__ import annotations

from typing import Literal, Optional, Any
from pydantic import BaseModel, ConfigDict, Field


class ResearchRequest(BaseModel):
    case_id: str = Field(..., description="Unique case identifier")
    query: str = Field(..., description="What to research or draft")
    incident_type: str = Field(default="", description="Type of incident")
    evidence_type: str = Field(default="", description="Type of evidence")
    procedural_defects: list[str] = Field(default_factory=list)
    mode: str = Field(
        default="research",
        description="'research' = precedent search only; 'draft' = full discharge application",
    )
    use_harvey: bool = Field(default=False, description="Use Harvey.ai for legal-grade AI responses")
    expertise_hint: str = Field(default="senior", description="Expertise level: junior, senior, layperson")
    offline_mock: bool = Field(default=False, description="Run offline mock pipeline (no API keys required)")
    mock_scenario: str = Field(default="TC-01", description="Offline mock scenario selector")


class TaskOutput(BaseModel):
    agent: str
    output: str


class ResearchResponse(BaseModel):
    success: bool
    case_id: str
    mode: str
    draft: str = ""
    tasks_output: list[TaskOutput] = Field(default_factory=list)
    error: Optional[str] = None
    doc_count: int = 0
    citation_gate: dict = Field(default_factory=dict)


class UploadResponse(BaseModel):
    success: bool
    case_id: str
    indexed: list[dict] = Field(default_factory=list)
    skipped: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    total_chunks: int = 0


class SimpleUploadResponse(BaseModel):
    success: bool
    message: str = ""
    case_id: str = ""
    indexed_count: int = 0
    total_chunks: int = 0


class CaseStatusResponse(BaseModel):
    case_id: str
    has_documents: bool
    doc_count: int


class HealthResponse(BaseModel):
    status: str
    openai_configured: bool
    tavily_configured: bool
    chroma_ready: bool


class ContradictionItem(BaseModel):
    id: str
    type: str = Field(description="DATE_MISMATCH | NAME_DISCREPANCY | AMOUNT_MISMATCH | LOCATION_MISMATCH | FACTUAL_CONTRADICTION")
    description: str
    evidence_a: str
    evidence_b: str
    source_a: str = "primary"
    source_b: str = "primary"
    target_field: Optional[str] = None
    severity: str = "HIGH"


class ContradictionDetectionResponse(BaseModel):
    success: bool
    case_id: str = ""
    contradictions: list[ContradictionItem] = Field(default_factory=list)
    summary: str = ""
    by_type: dict[str, int] = Field(default_factory=dict)
    error: Optional[str] = None


class TraceSpan(BaseModel):
    span_id: str
    parent_span_id: Optional[str] = None
    name: str
    agent: str = ""
    start_time: float
    end_time: Optional[float] = None
    duration_ms: Optional[float] = None
    status: str = "pending"
    metadata: dict[str, Any] = Field(default_factory=dict)


class SessionUsageReport(BaseModel):
    session_id: str
    case_id: str = ""
    total_requests: int = 0
    total_tokens_approx: int = 0
    total_cost_usd_approx: float = 0.0
    breakdown_by_endpoint: dict[str, int] = Field(default_factory=dict)
    spans: list[TraceSpan] = Field(default_factory=list)
    started_at: float
    last_active: float


class ObservabilityResponse(BaseModel):
    success: bool
    session: Optional[SessionUsageReport] = None
    case_summary: dict[str, Any] = Field(default_factory=dict)
    recent_sessions: list[dict[str, Any]] = Field(default_factory=list)
    error: Optional[str] = None


# ── Week 5: Ask Copilot (Vyaas contract — citation-or-refuse, read-only) ─────

class CopilotAskRequest(BaseModel):
    """
    Request body for POST /api/v1/copilot/ask.

    Read-only by design: extra="forbid" rejects any additional fields so the
    endpoint can never be coerced into accepting write operations.
    """
    model_config = ConfigDict(extra="forbid")

    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Natural-language question about the active case book.",
    )
    case_id: str = Field(
        ...,
        description="Identifier of the case whose documents/timeline answer the question.",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Optional session token for log correlation.",
    )


class CopilotCitation(BaseModel):
    """A single grounding citation returned with a copilot answer."""
    type: Literal["document", "timeline", "register", "standard", "deadline"] = Field(
        description=(
            "Source type of this citation. "
            "'deadline' added in Week 9: cites a deterministic engine result "
            "(rule_id + basis string) — never an invented date."
        )
    )
    id: str = Field(description="Unique identifier of the source item.")
    snippet: str = Field(
        description="Verbatim extract from the source (≤300 chars).",
        max_length=300,
    )


class CopilotRefusal(BaseModel):
    """Returned when the copilot cannot cite any existing case-book item."""
    reason: str = Field(
        default="Not found in this case book. / इस केस बुक में नहीं मिला।",
        description="Bilingual refusal reason (EN + HI). Never a guessed answer.",
    )


class CopilotAskResponse(BaseModel):
    """
    Response for POST /api/v1/copilot/ask.

    Either `answer` + `citations` (non-empty) OR `refusal` is populated — never both.
    Zero-citation answers are structurally prevented by the endpoint logic.
    """
    answer: str = Field(default="", description="Synthesised answer grounded in citations.")
    citations: list[CopilotCitation] = Field(
        default_factory=list,
        description="Source items that ground the answer. Empty only when refusal is set.",
    )
    refusal: Optional[CopilotRefusal] = Field(
        default=None,
        description="Populated when no case-book item can support an answer.",
    )
    latency_ms: int = Field(default=0, description="End-to-end request latency in milliseconds.")
    session_id: Optional[str] = Field(default=None, description="Echoed from request for correlation.")


# ── Week 9: Limitation & Deadline Engine ──────────────────────────────────────

class DeadlineItem(BaseModel):
    """
    A single computed deadline entry in a case's deadline schedule.

    Every field is traceable: rule_id links back to limitation_rules.json,
    basis_en/basis_hi contain the full computation chain,
    source_note carries the illustrative disclaimer.
    is_synthetic is always True for demo data.
    """
    rule_id: str = Field(description="Unique rule identifier from limitation_rules.json.")
    case_id: str = Field(description="Case this deadline belongs to.")
    event_type: str = Field(description="Event type that triggered this rule (e.g. 'arrest_date').")
    event_date: Optional[str] = Field(
        default=None,
        description="ISO-8601 date of the triggering event. Null → CANNOT_COMPUTE.",
    )
    due_date: Optional[str] = Field(
        default=None,
        description="ISO-8601 computed deadline date. Null when event_date is missing.",
    )
    days_remaining: Optional[int] = Field(
        default=None,
        description=(
            "Days until due_date from reference date. "
            "Negative = overdue. Null = CANNOT_COMPUTE."
        ),
    )
    status: str = Field(
        description=(
            "OVERDUE | URGENT (≤14d) | WARNING (≤30d) | UPCOMING | "
            "COMPLETED | CANNOT_COMPUTE"
        ),
    )
    name: str = Field(description="Rule name in English.")
    name_hi: str = Field(description="Rule name in Hindi.")
    basis_en: str = Field(
        description=(
            "Full English computation chain: rule + statute + event + period = due_date. "
            "Includes SYNTHETIC/DEMO disclaimer."
        ),
    )
    basis_hi: str = Field(
        description="Full Hindi computation chain (mirrors basis_en).",
    )
    statute: str = Field(description="Governing statute (e.g. 'CrPC / BNSS').")
    section: str = Field(description="Specific section / provision.")
    source_note: str = Field(
        description="Illustrative disclaimer — verify against current statute text.",
    )
    period_days: int = Field(description="Rule period in days (calendar or working).")
    period_basis: str = Field(description="'calendar' or 'working'.")
    consequence: str = Field(default="", description="Legal consequence if deadline is missed (EN).")
    consequence_hi: str = Field(default="", description="Legal consequence in Hindi.")
    computed_at: str = Field(description="ISO-8601 date computation was performed.")
    is_synthetic: bool = Field(
        default=True,
        description="Always True — all event dates are SYNTHETIC/DEMO.",
    )
    completed: bool = Field(
        default=False,
        description="True if the deadline has been marked completed by the user.",
    )


class DeadlineScheduleResponse(BaseModel):
    """
    Response for GET /api/v1/case/{case_id}/deadlines.

    Contains the full computed deadline schedule for one synthetic case.
    Every item is traceable to a rule_id + event_date.
    disclaimer is present on every response — never suppressed.
    """
    case_id: str = Field(description="Case identifier.")
    computed_at: str = Field(description="ISO-8601 reference date used for computation.")
    total: int = Field(description="Total number of deadline items in the schedule.")
    status_counts: dict[str, int] = Field(
        default_factory=dict,
        description="Count of items per status (OVERDUE, URGENT, WARNING, UPCOMING, CANNOT_COMPUTE).",
    )
    items: list[DeadlineItem] = Field(
        default_factory=list,
        description="Computed deadline items, sorted by due_date ascending (CANNOT_COMPUTE last).",
    )
    disclaimer: str = Field(
        default=(
            "All dates and deadlines are SYNTHETIC/DEMO only. "
            "Verify every rule against current statute text before professional use. "
            "/ सभी तिथियाँ और समय-सीमाएँ संश्लेषित/डेमो हैं। "
            "व्यावसायिक उपयोग से पहले वर्तमान विधि-पाठ से सत्यापित करें।"
        ),
        description="Mandatory illustrative disclaimer — always present, never suppressed.",
    )


# ── Week 10: Chronology Studio ─────────────────────────────────────────────────────

class ChronologyEntry(BaseModel):
    """
    A single proposed chronology entry.

    Every entry carries a deep-linked source citation, confidence score,
    and needs_review flag. Entries are PROPOSALS until accepted by the user.
    """
    id: str = Field(description="Unique entry identifier.")
    case_id: str = Field(description="Case this entry belongs to.")
    date: Optional[str] = Field(
        default=None,
        description="ISO-8601 date if known. Null → 'Needs dating' lane.",
    )
    event: str = Field(description="Event description in English.")
    event_hi: str = Field(description="Event description in Hindi.")
    source_citation: str = Field(
        description="Deep-linked source citation (document ID + section/line).",
    )
    source_type: str = Field(
        description="Source type: 'case_facts_timeline' | 'cross_reference_matrix' | 'document_extracted'.",
    )
    confidence: str = Field(
        description="Confidence level: 'VERIFIED' | 'SECONDARY' | 'PENDING'.",
    )
    needs_review: bool = Field(
        default=True,
        description="True if entry requires user review before acceptance.",
    )
    status: str = Field(
        default="proposed",
        description="Entry status: 'proposed' | 'accepted' | 'rejected' | 'edited'.",
    )
    notes: Optional[str] = Field(
        default=None,
        description="Additional notes or context for this entry.",
    )
    is_synthetic: bool = Field(
        default=True,
        description="Always True — all case data is SYNTHETIC/DEMO.",
    )


class ChronologyProposalRequest(BaseModel):
    """
    Request body for POST /api/v1/case/{case_id}/chronology/propose.

    Triggers generation of proposed chronology entries from the case's
    synthetic documents and data layer.
    """
    case_id: str = Field(description="Case identifier to generate chronology for.")
    include_document_events: bool = Field(
        default=True,
        description="Include events extracted from Week 3 document processing.",
    )


class ChronologyProposalResponse(BaseModel):
    """
    Response for POST /api/v1/case/{case_id}/chronology/propose.

    Returns a list of proposed chronology entries with source citations.
    Entries with missing dates are flagged for the 'Needs dating' lane.
    """
    case_id: str = Field(description="Case identifier.")
    proposed_at: str = Field(description="ISO-8601 timestamp when proposal was generated.")
    total_entries: int = Field(description="Total number of proposed entries.")
    entries_needing_date: int = Field(
        description="Count of entries missing dates (will appear in 'Needs dating' lane).",
    )
    entries: list[ChronologyEntry] = Field(
        default_factory=list,
        description="Proposed chronology entries, sorted by date (undated last).",
    )
    disclaimer: str = Field(
        default=(
            "All chronology entries are SYNTHETIC/DEMO proposals. "
            "Review and accept entries before using in official documents. "
            "/ सभी कालक्रम प्रविष्टियाँ संश्लेषित/डेमो प्रस्ताव हैं। "
            "आधिकारिक दस्तावेजों में उपयोग करने से पहले समीक्षा करें और स्वीकार करें।"
        ),
        description="Mandatory disclaimer — entries are proposals until accepted.",
    )


class ChronologyActionRequest(BaseModel):
    """
    Request body for POST /api/v1/case/{case_id}/chronology/action.

    Allows accept/edit/reject actions on individual chronology entries.
    """
    case_id: str = Field(description="Case identifier.")
    entry_id: str = Field(description="Entry identifier to act on.")
    action: str = Field(
        description="Action: 'accept' | 'reject' | 'edit'.",
    )
    edited_event: Optional[str] = Field(
        default=None,
        description="New event text if action is 'edit'.",
    )
    edited_event_hi: Optional[str] = Field(
        default=None,
        description="New event text in Hindi if action is 'edit'.",
    )
    edited_date: Optional[str] = Field(
        default=None,
        description="New date (ISO-8601) if action is 'edit'.",
    )


class ChronologyActionResponse(BaseModel):
    """
    Response for POST /api/v1/case/{case_id}/chronology/action.

    Confirms the action and returns the updated entry state.
    """
    success: bool = Field(description="True if action was successful.")
    entry_id: str = Field(description="Entry identifier that was acted on.")
    action: str = Field(description="Action that was performed.")
    updated_entry: Optional[ChronologyEntry] = Field(
        default=None,
        description="Updated entry state after action.",
    )
    message: str = Field(description="Bilingual success/error message.")
