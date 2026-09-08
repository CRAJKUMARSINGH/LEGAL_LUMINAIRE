"""Pydantic request/response models for the API."""
from __future__ import annotations

from typing import Optional, Any
from pydantic import BaseModel, Field


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
