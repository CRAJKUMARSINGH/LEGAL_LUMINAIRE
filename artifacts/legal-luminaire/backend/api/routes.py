"""
FastAPI routes for Legal Luminaire backend.
"""
from __future__ import annotations

import logging
import shutil
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from config import settings
from rag.document_store import (
    ingest_files,
    get_retriever,
    case_has_documents,
    get_case_doc_count,
)
from agents.crew import run_legal_crew
from api.models import (
    ResearchRequest,
    ResearchResponse,
    UploadResponse,
    CaseStatusResponse,
    HealthResponse,
    TaskOutput,
)

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".md", ".txt", ".lex", ".doc", ".docx", ".jpg", ".jpeg", ".png"}


# ── Health ─────────────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse)
async def health():
    chroma_ok = True
    try:
        settings.chroma_path.mkdir(parents=True, exist_ok=True)
    except Exception:
        chroma_ok = False

    return HealthResponse(
        status="ok",
        openai_configured=bool(settings.openai_api_key),
        tavily_configured=bool(settings.tavily_api_key),
        chroma_ready=chroma_ok,
    )


# ── File Upload & Indexing ─────────────────────────────────────────────────────

@router.post("/cases/{case_id}/upload", response_model=UploadResponse)
async def upload_documents(
    case_id: str,
    files: list[UploadFile] = File(...),
):
    """Upload case documents and index them into ChromaDB."""
    case_dir = settings.case_docs_path / case_id
    case_dir.mkdir(parents=True, exist_ok=True)

    saved_paths: list[Path] = []
    errors: list[str] = []

    for upload in files:
        suffix = Path(upload.filename or "").suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            errors.append(f"{upload.filename}: unsupported type {suffix}")
            continue
        dest = case_dir / (upload.filename or f"file{suffix}")
        try:
            with dest.open("wb") as f:
                shutil.copyfileobj(upload.file, f)
            saved_paths.append(dest)
        except Exception as e:
            errors.append(f"{upload.filename}: save failed — {e}")

    if not saved_paths:
        return UploadResponse(
            success=False,
            case_id=case_id,
            errors=errors or ["No valid files uploaded"],
        )

    summary = ingest_files(case_id, saved_paths)
    total_chunks = sum(item.get("chunks", 0) for item in summary["indexed"])

    return UploadResponse(
        success=True,
        case_id=case_id,
        indexed=summary["indexed"],
        skipped=summary["skipped"],
        errors=errors + summary["errors"],
        total_chunks=total_chunks,
    )


# ── Case Status ────────────────────────────────────────────────────────────────

@router.get("/cases/{case_id}/status", response_model=CaseStatusResponse)
async def case_status(case_id: str):
    return CaseStatusResponse(
        case_id=case_id,
        has_documents=case_has_documents(case_id),
        doc_count=get_case_doc_count(case_id),
    )


# ── Research & Draft ───────────────────────────────────────────────────────────

@router.post("/cases/{case_id}/research", response_model=ResearchResponse)
async def run_research(case_id: str, req: ResearchRequest):
    """
    Run the multi-agent research pipeline for a case.
    mode='research' → precedent search + verification only
    mode='draft' → full discharge application generation
    """
    if not settings.openai_api_key:
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY not configured. Add it to backend/.env",
        )

    # Retrieve RAG context from uploaded documents
    case_context = ""
    if case_has_documents(case_id):
        try:
            retriever = get_retriever(case_id, k=10)
            docs = retriever.invoke(req.query)
            case_context = "\n\n---\n\n".join(
                f"[Source: {d.metadata.get('source_file', 'unknown')}]\n{d.page_content}"
                for d in docs
            )
        except Exception as e:
            logger.warning(f"RAG retrieval failed for {case_id}: {e}")
            case_context = f"[RAG unavailable: {e}]"
    else:
        case_context = "[No documents uploaded for this case. Using query only.]"

    # Run the crew
    result = run_legal_crew(
        query=req.query,
        case_context=case_context,
        incident_type=req.incident_type,
        evidence_type=req.evidence_type,
        procedural_defects=req.procedural_defects,
    )

    return ResearchResponse(
        success=result["success"],
        case_id=case_id,
        mode=req.mode,
        draft=result.get("draft", ""),
        tasks_output=[
            TaskOutput(agent=t["agent"], output=t["output"])
            for t in result.get("tasks_output", [])
        ],
        error=result.get("error"),
        doc_count=get_case_doc_count(case_id),
    )
