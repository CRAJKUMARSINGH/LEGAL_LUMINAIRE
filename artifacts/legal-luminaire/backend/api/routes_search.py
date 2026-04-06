"""
Backend Search Routes — Week 6 Intelligent Search
Fuzzy and semantic search across statutes, standards, and precedents.
"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
import json
from pathlib import Path
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

LAW_DB_PATH = Path(__file__).parent.parent / "rag" / "law_db.json"

def _load_law_db() -> Dict[str, Any]:
    if not LAW_DB_PATH.exists():
        return {"standards": [], "precedents": [], "statutes": []}
    with LAW_DB_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/legal-search", response_model=Dict[str, List[Any]])
async def legal_search(q: str = Query(..., min_length=2)):
    """Search for relevant law, standards, and precedents."""
    db = _load_law_db()
    q = q.lower()
    
    results = {
        "statutes": [],
        "standards": [],
        "precedents": []
    }

    # Search Statutes
    for s in db.get("statutes", []):
        if q in s.get("code", "").lower() or q in s.get("title", "").lower():
            results["statutes"].append(s)

    # Search Standards
    for std in db.get("standards", []):
        if q in std.get("code", "").lower() or q in std.get("title", "").lower():
            results["standards"].append(std)

    # Search Precedents
    for p in db.get("precedents", []):
        if q in p.get("case", "").lower() or q in p.get("citation", "").lower() or q in p.get("holding", "").lower():
            results["precedents"].append(p)

    return results

@router.get("/legal-db", response_model=Dict[str, List[Any]])
async def get_legal_db():
    """Return the entire law database (for offline/browsing)."""
    return _load_law_db()
