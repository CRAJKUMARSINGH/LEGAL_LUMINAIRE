"""Pydantic request/response models for the API."""
from __future__ import annotations

from typing import Optional
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


class CaseStatusResponse(BaseModel):
    case_id: str
    has_documents: bool
    doc_count: int


class HealthResponse(BaseModel):
    status: str
    openai_configured: bool
    tavily_configured: bool
    chroma_ready: bool
