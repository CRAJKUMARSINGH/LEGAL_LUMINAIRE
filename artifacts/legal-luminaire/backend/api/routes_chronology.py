"""
routes_chronology.py — Chronology Studio API (Week 10)
======================================================

Endpoints:
  POST /api/v1/case/{case_id}/chronology/propose  — generate proposed chronology entries
  POST /api/v1/case/{case_id}/chronology/action   — accept/edit/reject entries
  GET  /api/v1/case/{case_id}/chronology          — fetch current chronology state
  GET  /api/v1/chronology/health                  — feature flag state check

Design rules enforced here:
  1. Flag-gated   — FEATURE_CHRONOLOGY_STUDIO must be "true" or endpoints return 404.
                    /health always responds regardless of flag state.
  2. Source-cited — every proposed entry carries a deep-linked source citation.
  3. Review-first — entries are PROPOSALS until accepted; export includes only accepted.
  4. SYNTHETIC    — is_synthetic: true on all entries; disclaimer in every response.
  5. Undated handling — entries with missing dates go to "Needs dating" lane, never guessed.
"""
from __future__ import annotations

import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException

from .models import (
    ChronologyEntry,
    ChronologyProposalRequest,
    ChronologyProposalResponse,
    ChronologyActionRequest,
    ChronologyActionResponse,
)

logger = logging.getLogger(__name__)

# ── Feature-flag guard ─────────────────────────────────────────────────────────
_FLAG_ON = os.getenv("FEATURE_CHRONOLOGY_STUDIO", "false").strip().lower() in (
    "1", "true", "yes", "on"
)

_SYNTHETIC_DISCLAIMER = (
    "All chronology entries are SYNTHETIC/DEMO proposals. "
    "Review and accept entries before using in official documents. "
    "/ सभी कालक्रम प्रविष्टियाँ संश्लेषित/डेमो प्रस्ताव हैं। "
    "आधिकारिक दस्तावेजों में उपयोग करने से पहले समीक्षा करें और स्वीकार करें।"
)

# ── Router ─────────────────────────────────────────────────────────────────────
router = APIRouter(tags=["chronology"])

# ── In-memory storage for chronology state (in production, use database) ────────
_chronology_store: Dict[str, List[ChronologyEntry]] = {}


def _get_case_path(case_id: str) -> Path:
    """Get the path to a case's uploaded files directory."""
    from config import settings
    return settings.case_docs_path / case_id


def _parse_date_from_text(text: str) -> Optional[str]:
    """
    Attempt to extract an ISO-8601 date from text.
    Returns None if no clear date is found.
    """
    # Look for patterns like DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, etc.
    date_patterns = [
        r'\b(\d{4}-\d{2}-\d{2})\b',  # YYYY-MM-DD
        r'\b(\d{2}-\d{2}-\d{4})\b',  # DD-MM-YYYY
        r'\b(\d{2}/\d{2}/\d{4})\b',  # DD/MM/YYYY
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            date_str = match.group(1)
            try:
                # Try to parse and normalize to YYYY-MM-DD
                if '-' in date_str and date_str.startswith('20'):
                    return date_str  # Already YYYY-MM-DD
                elif '-' in date_str:
                    # DD-MM-YYYY -> YYYY-MM-DD
                    parts = date_str.split('-')
                    return f"{parts[2]}-{parts[1]}-{parts[0]}"
                elif '/' in date_str:
                    # DD/MM/YYYY -> YYYY-MM-DD
                    parts = date_str.split('/')
                    return f"{parts[2]}-{parts[1]}-{parts[0]}"
            except Exception:
                continue
    
    return None


def _extract_from_case_facts_timeline(case_path: Path, case_id: str) -> List[ChronologyEntry]:
    """
    Extract chronology entries from Case_Facts_Timeline.md.
    """
    entries = []
    timeline_file = case_path / "Case_Facts_Timeline.md"
    
    if not timeline_file.exists():
        logger.warning(f"Case_Facts_Timeline.md not found for case {case_id}")
        return entries
    
    try:
        content = timeline_file.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        current_section = None
        entry_counter = 0
        
        for line in lines:
            line = line.strip()
            
            # Detect numbered entries (e.g., "1. **Project and role context**")
            numbered_match = re.match(r'^(\d+)\.\s+\*\*(.+?)\*\*', line)
            if numbered_match:
                entry_counter += 1
                event_text = numbered_match.group(2)
                
                # Look for status indicator in following lines
                status = "PENDING"
                status_match = re.search(r'Status:\s*`(\w+)`', content[content.find(line):content.find(line)+200])
                if status_match:
                    status = status_match.group(1)
                
                # Try to extract date
                date = _parse_date_from_text(line)
                
                entries.append(ChronologyEntry(
                    id=f"{case_id}-cft-{entry_counter}",
                    case_id=case_id,
                    date=date,
                    event=event_text,
                    event_hi=f"प्रविष्टि {entry_counter}",  # Placeholder Hindi
                    source_citation=f"Case_Facts_Timeline.md:line{content[:content.find(line)].count(chr(10)) + 1}",
                    source_type="case_facts_timeline",
                    confidence=status,
                    needs_review=True,
                    status="proposed",
                    is_synthetic=True,
                ))
        
        logger.info(f"Extracted {len(entries)} entries from Case_Facts_Timeline.md")
    except Exception as e:
        logger.error(f"Error parsing Case_Facts_Timeline.md: {e}", exc_info=True)
    
    return entries


def _extract_from_cross_reference_matrix(case_path: Path, case_id: str) -> List[ChronologyEntry]:
    """
    Extract chronology entries from Cross_Reference_Matrix_Detailed.lex.
    """
    entries = []
    matrix_file = case_path / "Cross_Reference_Matrix_Detailed.lex"
    
    if not matrix_file.exists():
        logger.warning(f"Cross_Reference_Matrix_Detailed.lex not found for case {case_id}")
        return entries
    
    try:
        content = matrix_file.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        entry_counter = 0
        
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Look for section headers that represent procedural violations
            section_match = re.match(r'^##\s*\d+\)\s*(.+)', line)
            if section_match:
                entry_counter += 1
                event_text = section_match.group(1)
                
                # Try to extract date
                date = _parse_date_from_text(line)
                
                entries.append(ChronologyEntry(
                    id=f"{case_id}-crm-{entry_counter}",
                    case_id=case_id,
                    date=date,
                    event=event_text,
                    event_hi=f"उल्लंघन {entry_counter}",  # Placeholder Hindi
                    source_citation=f"Cross_Reference_Matrix_Detailed.lex:line{i+1}",
                    source_type="cross_reference_matrix",
                    confidence="SECONDARY",
                    needs_review=True,
                    status="proposed",
                    is_synthetic=True,
                ))
        
        logger.info(f"Extracted {len(entries)} entries from Cross_Reference_Matrix_Detailed.lex")
    except Exception as e:
        logger.error(f"Error parsing Cross_Reference_Matrix_Detailed.lex: {e}", exc_info=True)
    
    return entries


def _extract_from_deadline_events(case_path: Path, case_id: str) -> List[ChronologyEntry]:
    """
    Extract chronology entries from TC-01_Deadline_Events.json.
    """
    entries = []
    events_file = case_path / f"{case_id}_Deadline_Events.json"
    
    if not events_file.exists():
        logger.warning(f"{case_id}_Deadline_Events.json not found for case {case_id}")
        return entries
    
    try:
        import json
        content = events_file.read_text(encoding='utf-8')
        data = json.loads(content)
        
        events = data.get("events", {})
        notes = data.get("notes", {})
        
        entry_counter = 0
        
        for event_key, event_date in events.items():
            if event_date:  # Skip null dates
                entry_counter += 1
                event_label = event_key.replace('_', ' ').title()
                note = notes.get(event_key, "")
                
                entries.append(ChronologyEntry(
                    id=f"{case_id}-de-{entry_counter}",
                    case_id=case_id,
                    date=event_date if event_date != "null" else None,
                    event=event_label,
                    event_hi=event_label,  # Placeholder - would need proper translation
                    source_citation=f"{case_id}_Deadline_Events.json:{event_key}",
                    source_type="document_extracted",
                    confidence="VERIFIED",
                    needs_review=True,
                    status="proposed",
                    notes=note,
                    is_synthetic=True,
                ))
        
        logger.info(f"Extracted {len(entries)} entries from {case_id}_Deadline_Events.json")
    except Exception as e:
        logger.error(f"Error parsing {case_id}_Deadline_Events.json: {e}", exc_info=True)
    
    return entries


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get(
    "/chronology/health",
    summary="Chronology studio feature health check",
    response_model=dict,
    description=(
        "Returns the current activation state of the chronology_studio feature flag. "
        "Always responds 200 regardless of flag state. Never rate-limited."
    ),
)
async def chronology_health() -> dict:
    """GET /api/v1/chronology/health — always 200, flag-state report."""
    return {
        "feature": "chronology_studio",
        "enabled": _FLAG_ON,
        "endpoints": [
            "POST /api/v1/case/{case_id}/chronology/propose",
            "POST /api/v1/case/{case_id}/chronology/action",
            "GET /api/v1/case/{case_id}/chronology",
        ],
        "disclaimer": _SYNTHETIC_DISCLAIMER,
    }


@router.post(
    "/case/{case_id}/chronology/propose",
    response_model=ChronologyProposalResponse,
    summary="Generate proposed chronology entries for a case",
    description=(
        "Merges TC-01's confirmed Case_Facts_Timeline.md + Cross_Reference_Matrix_Detailed.lex "
        "with document-extracted events to generate proposed chronology entries. "
        "Every proposed entry carries a deep-linked source citation, confidence, and needs_review flag. "
        "Entries with missing dates are flagged for the 'Needs dating' lane. "
        "Gated behind FEATURE_CHRONOLOGY_STUDIO."
    ),
)
async def propose_chronology(
    case_id: str,
    request: ChronologyProposalRequest,
) -> ChronologyProposalResponse:
    """
    POST /api/v1/case/{case_id}/chronology/propose

    Generates proposed chronology entries from the case's synthetic documents.
    """
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'chronology_studio' is not enabled. "
                "Set FEATURE_CHRONOLOGY_STUDIO=true to activate."
            ),
        )
    
    case_path = _get_case_path(case_id)
    
    if not case_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Case directory not found: {case_id}",
        )
    
    # Extract entries from all sources
    entries = []
    
    # From Case_Facts_Timeline.md
    entries.extend(_extract_from_case_facts_timeline(case_path, case_id))
    
    # From Cross_Reference_Matrix_Detailed.lex
    entries.extend(_extract_from_cross_reference_matrix(case_path, case_id))
    
    # From Deadline Events JSON (if requested)
    if request.include_document_events:
        entries.extend(_extract_from_deadline_events(case_path, case_id))
    
    # Sort entries: dated entries first (chronological), undated last
    dated_entries = [e for e in entries if e.date is not None]
    undated_entries = [e for e in entries if e.date is None]
    
    dated_entries.sort(key=lambda e: e.date or "")
    
    all_entries = dated_entries + undated_entries
    
    # Store in memory
    _chronology_store[case_id] = all_entries
    
    # Count entries needing dates
    entries_needing_date = len(undated_entries)
    
    return ChronologyProposalResponse(
        case_id=case_id,
        proposed_at=datetime.now().isoformat(),
        total_entries=len(all_entries),
        entries_needing_date=entries_needing_date,
        entries=all_entries,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )


@router.post(
    "/case/{case_id}/chronology/action",
    response_model=ChronologyActionResponse,
    summary="Accept, edit, or reject a chronology entry",
    description=(
        "Allows users to accept, edit, or reject individual chronology entries. "
        "Accepted entries form the official chronology. "
        "Rejected entries are logged but not included in exports. "
        "Gated behind FEATURE_CHRONOLOGY_STUDIO."
    ),
)
async def chronology_action(
    case_id: str,
    request: ChronologyActionRequest,
) -> ChronologyActionResponse:
    """
    POST /api/v1/case/{case_id}/chronology/action

    Performs accept/edit/reject actions on chronology entries.
    """
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'chronology_studio' is not enabled. "
                "Set FEATURE_CHRONOLOGY_STUDIO=true to activate."
            ),
        )
    
    if case_id not in _chronology_store:
        raise HTTPException(
            status_code=404,
            detail=f"No chronology found for case {case_id}. Generate proposals first.",
        )
    
    entries = _chronology_store[case_id]
    entry_index = None
    entry = None
    
    # Find the entry
    for i, e in enumerate(entries):
        if e.id == request.entry_id:
            entry_index = i
            entry = e
            break
    
    if entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Entry {request.entry_id} not found in chronology.",
        )
    
    # Perform the action
    if request.action == "accept":
        entry.status = "accepted"
        entry.needs_review = False
        message = f"Entry accepted. / प्रविष्टि स्वीकार की गई।"
    elif request.action == "reject":
        entry.status = "rejected"
        entry.needs_review = False
        message = f"Entry rejected. / प्रविष्टि अस्वीकार की गई।"
    elif request.action == "edit":
        entry.status = "edited"
        if request.edited_event:
            entry.event = request.edited_event
        if request.edited_event_hi:
            entry.event_hi = request.edited_event_hi
        if request.edited_date:
            entry.date = request.edited_date
        entry.needs_review = False
        message = f"Entry edited. / प्रविष्टि संपादित की गई।"
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid action: {request.action}. Must be 'accept', 'reject', or 'edit'.",
        )
    
    # Update the store
    entries[entry_index] = entry
    _chronology_store[case_id] = entries
    
    return ChronologyActionResponse(
        success=True,
        entry_id=entry.id,
        action=request.action,
        updated_entry=entry,
        message=message,
    )


@router.get(
    "/case/{case_id}/chronology",
    response_model=ChronologyProposalResponse,
    summary="Fetch current chronology state for a case",
    description=(
        "Returns the current chronology state including all entries "
        "with their current status (proposed, accepted, rejected, edited). "
        "Gated behind FEATURE_CHRONOLOGY_STUDIO."
    ),
)
async def get_chronology(case_id: str) -> ChronologyProposalResponse:
    """
    GET /api/v1/case/{case_id}/chronology

    Returns the current chronology state for the specified case.
    """
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'chronology_studio' is not enabled. "
                "Set FEATURE_CHRONOLOGY_STUDIO=true to activate."
            ),
        )
    
    if case_id not in _chronology_store:
        raise HTTPException(
            status_code=404,
            detail=f"No chronology found for case {case_id}. Generate proposals first.",
        )
    
    entries = _chronology_store[case_id]
    undated_count = len([e for e in entries if e.date is None])
    
    return ChronologyProposalResponse(
        case_id=case_id,
        proposed_at=datetime.now().isoformat(),
        total_entries=len(entries),
        entries_needing_date=undated_count,
        entries=entries,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )