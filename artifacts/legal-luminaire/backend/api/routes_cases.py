"""
Backend Case CRUD Routes — Week 1 persistence layer
Provides API for multi-case storage on the backend.
"""
from fastapi import APIRouter, HTTPException, Path, Body
from typing import Any, Dict, List
import logging
import uuid
from datetime import datetime
from api.case_manager import case_manager

router = APIRouter()
logger = logging.getLogger(__name__)

# ── Models (Simplified for JSON storage) ──────────────────────────────────────

@router.get("/cases", response_model=List[Dict[str, Any]])
async def list_cases():
    """List all available cases."""
    return case_manager.list_cases()


@router.get("/cases/{case_id}", response_model=Dict[str, Any])
async def get_case(case_id: str = Path(...)):
    """Fetch detail for a specific case."""
    case = case_manager.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    return case


@router.post("/cases", response_model=Dict[str, Any])
async def create_case(data: Dict[str, Any] = Body(...)):
    """
    Create a new case recorded on the backend.
    Used by Omni-Modal Ingestion to 'commit' an auto-detected case.
    """
    case_id = data.get("id") or str(uuid.uuid4())[:12]
    # Ensure mandatory fields
    data["id"] = case_id
    data["createdAt"] = data.get("createdAt") or datetime.now().isoformat()
    data["updatedAt"] = datetime.now().isoformat()
    
    success = case_manager.save_case(case_id, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save case to disk.")
    
    return data


@router.put("/cases/{case_id}", response_model=Dict[str, Any])
async def update_case(case_id: str, data: Dict[str, Any] = Body(...)):
    """Update an existing case's record."""
    if not case_manager.get_case(case_id):
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    
    data["id"] = case_id
    data["updatedAt"] = datetime.now().isoformat()
    
    success = case_manager.save_case(case_id, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update case record.")
    
    return data


@router.delete("/cases/{case_id}")
async def delete_case(case_id: str):
    """Delete a case and all associated records/files."""
    success = case_manager.delete_case(case_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found or deletion failed.")
    
    return {"success": True, "message": f"Case {case_id} deleted."}


@router.get("/cases/{case_id}/stats", response_model=Dict[str, Any])
async def get_case_stats(case_id: str):
    """Compute case analytics for dashboard visualizations (Week 5)."""
    case = case_manager.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    # 1. Forensic Risk Radar Data
    grounding = case.get("forensic_grounding", [])
    categories = {
        "Sampling": 0,
        "Chain of Custody": 0,
        "Lab Environment": 0,
        "Legal Procedural": 0,
        "Structural/Engineering": 0
    }
    
    for g in grounding:
        title = g.get("title", "").lower()
        v_count = len(g.get("violations", []))
        if "sampling" in title: categories["Sampling"] += v_count
        elif "chain" in title or "protocol" in title: categories["Chain of Custody"] += v_count
        elif "test" in title or "strength" in title: categories["Lab Environment"] += v_count
        elif "code" in title or "reinforced" in title: categories["Structural/Engineering"] += v_count
        else: categories["Legal Procedural"] += v_count

    radar_data = [{"subject": k, "A": v, "fullMark": 5} for k, v in categories.items()]

    # 2. Timeline Heatmap Data
    timeline = case.get("timeline", [])
    activity = {}
    for e in timeline:
        date_str = e.get("date", "Unknown")
        # Simple clustering by Year-Month
        if "-" in date_str:
            month = date_str[:7] # YYYY-MM
            activity[month] = activity.get(month, 0) + 1
    
    heatmap_data = [{"date": k, "count": v} for k, v in sorted(activity.items())]

    return {
        "radar": radar_data,
        "heatmap": heatmap_data,
        "total_violations": sum(categories.values()),
        "total_events": len(timeline)
    }
