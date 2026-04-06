"""
Backend Auto-Query Research Routes — Week 10
Instantly fetches relevant precedents based on extracted case facts.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import logging
from api.routes_search import _load_law_db

router = APIRouter()
logger = logging.getLogger(__name__)

class AutoResearchRequest(BaseModel):
    case_summary: str
    incident_type: str
    statutes: List[str]

class PrecedentMatch(BaseModel):
    case: str
    citation: str
    court: str
    holding: str
    fit_score: int

class AutoResearchResponse(BaseModel):
    success: bool
    matches: List[PrecedentMatch]
    query_used: str

@router.post("/auto-research", response_model=AutoResearchResponse)
async def auto_research(req: AutoResearchRequest):
    """Automatically fetch the top 5 precedents based on extracted facts."""
    db = _load_law_db()
    precedents = db.get("precedents", [])
    
    # ── Simple Semantic / Keyword Match ────────────────────────────────────────
    # In production, this would use a vector search (ChromaDB)
    # For Week 10, we implement the logic for direct fact-to-query mapping
    
    query = f"{req.incident_type} {' '.join(req.statutes)} {req.case_summary}"
    query_words = set(query.lower().split())
    
    matches = []
    for p in precedents:
        text = f"{p['case']} {p['holding']} {p.get('citation', '')}".lower()
        score = sum(1 for word in query_words if word in text)
        if score > 0:
            matches.append(PrecedentMatch(
                case=p['case'],
                citation=p['citation'],
                court=p['court'],
                holding=p['holding'],
                fit_score=score * 10
            ))
            
    # Sort by score and take top 5
    matches = sorted(matches, key=lambda x: x.fit_score, reverse=True)[:5]
    
    return AutoResearchResponse(
        success=True,
        matches=matches,
        query_used=query
    )
