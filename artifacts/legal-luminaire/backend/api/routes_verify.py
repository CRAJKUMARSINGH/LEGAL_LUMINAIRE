"""
Backend Citation Verification Route — Week 12 Safety Enforcement
Ensures that AI-generated drafts do not contain fabricated legal precedents.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import re
import logging
from api.routes_search import _load_law_db

router = APIRouter()
logger = logging.getLogger(__name__)

class VerifyRequest(BaseModel):
    citations: List[str]
    case_id: Optional[str] = Field(default=None, description="Optional case context for verification scope")

class CitationStatus(BaseModel):
    citation: str
    verified: bool
    details: Optional[str] = None
    reason: Optional[str] = None

class VerifyResponse(BaseModel):
    success: bool
    results: List[CitationStatus]
    all_verified: bool

async def _verify_citations_impl(citations: List[str], case_id: Optional[str] = None):
    """Internal implementation shared by both routes."""
    logger.info(
        "case_event",
        extra={
            "event": "citation_verify_start",
            "case_id": case_id or "unspecified",
            "citations_count": len(citations),
        }
    )

    db = _load_law_db()
    precedents = db.get("precedents", [])

    results = []
    all_verified = True

    db_citations = {p.get("citation", "").lower(): p for p in precedents}
    db_cases = {p.get("case", "").lower(): p for p in precedents}

    for cite in citations:
        cite_clean = cite.strip().lower()

        match = db_citations.get(cite_clean)
        if not match:
            match = next((v for k, v in db_cases.items() if k in cite_clean or cite_clean in k), None)

        if match:
            results.append(CitationStatus(
                citation=cite,
                verified=True,
                details=f"Verified: {match.get('citation')}"
            ))
        else:
            all_verified = False
            results.append(CitationStatus(
                citation=cite,
                verified=False,
                reason="Not found in database. Possible AI Hallucination."
            ))

    verified_count = sum(1 for r in results if r.verified)
    logger.info(
        "case_event",
        extra={
            "event": "citation_verify_complete",
            "case_id": case_id or "unspecified",
            "verified_count": verified_count,
            "total_count": len(results),
            "all_verified": all_verified,
        }
    )

    return VerifyResponse(
        success=True,
        results=results,
        all_verified=all_verified
    )


@router.post("/verify-citations", response_model=VerifyResponse)
async def verify_citations(req: VerifyRequest):
    """Check a list of citations against the internal ground-truth database.
    Legacy route: optional case_id in request body.
    Prefer /cases/{case_id}/verify-citations for new integrations."""
    return await _verify_citations_impl(req.citations, req.case_id)


@router.post("/cases/{case_id}/verify-citations", response_model=VerifyResponse)
async def verify_citations_for_case(case_id: str, citations: List[str] = Body(..., embed=False)):
    """Check citations against the ground-truth database within a specific case context.
    Week 2 multi-case route: case_id provided via URL path."""
    return await _verify_citations_impl(citations, case_id)
