"""
Backend Citation Verification Route — Week 12 Safety Enforcement
Ensures that AI-generated drafts do not contain fabricated legal precedents.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import re
import logging
from api.routes_search import _load_law_db

router = APIRouter()
logger = logging.getLogger(__name__)

class VerifyRequest(BaseModel):
    citations: List[str]

class CitationStatus(BaseModel):
    citation: str
    verified: bool
    details: Optional[str] = None
    reason: Optional[str] = None

class VerifyResponse(BaseModel):
    success: bool
    results: List[CitationStatus]
    all_verified: bool

@router.post("/verify-citations", response_model=VerifyResponse)
async def verify_citations(req: VerifyRequest):
    """Check a list of citations against the internal ground-truth database."""
    db = _load_law_db()
    precedents = db.get("precedents", [])
    
    results = []
    all_verified = True
    
    # Pre-process database citations for fuzzy matching
    db_citations = {p.get("citation", "").lower(): p for p in precedents}
    db_cases = {p.get("case", "").lower(): p for p in precedents}
    
    for cite in req.citations:
        cite_clean = cite.strip().lower()
        
        # Check by strict citation
        match = db_citations.get(cite_clean)
        if not match:
            # Check by case name
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
            
    return VerifyResponse(
        success=True,
        results=results,
        all_verified=all_verified
    )
