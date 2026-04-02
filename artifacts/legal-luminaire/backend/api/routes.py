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


# ── On-demand Citation Verification ───────────────────────────────────────────

@router.get("/verify-citation")
async def verify_citation(case_name: str, citation: str = ""):
    """
    On-demand verification of a single case citation.
    Searches Indian Kanoon + web for the case.
    Returns: found/not_found, URL, snippet, confidence.
    """
    from agents.tools import indian_kanoon_search, web_search
    try:
        ik_result = indian_kanoon_search.invoke(case_name)
        web_result = web_search.invoke(f"{case_name} {citation} judgment holding")
        found = "NOT FOUND" not in ik_result.upper()
        return {
            "case_name": case_name,
            "citation": citation,
            "found_on_indian_kanoon": found,
            "indian_kanoon_result": ik_result[:800],
            "web_result": web_result[:800],
            "confidence": "HIGH" if found else "LOW",
            "recommendation": "SAFE TO USE" if found else "PENDING — obtain certified copy",
        }
    except Exception as e:
        return {"error": str(e), "case_name": case_name}


# ── On-demand Standards Verification ──────────────────────────────────────────

@router.get("/verify-standard")
async def verify_standard(code: str):
    """
    On-demand verification of an IS/ASTM/BS standard.
    Returns: scope, applicability, key clauses, source URL.
    """
    from agents.tools import verify_is_standard
    try:
        result = verify_is_standard.invoke(code)
        return {"code": code, "result": result}
    except Exception as e:
        return {"error": str(e), "code": code}


# ── Chat / Iterative Refinement ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    case_id: str
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []
    verification_notes: list[str] = []


from pydantic import BaseModel as _BaseModel


class _ChatRequest(_BaseModel):
    case_id: str
    message: str
    history: list[dict] = []


@router.post("/chat")
async def chat(req: _ChatRequest):
    """
    Chat interface for iterative refinement.
    Supports follow-up questions on the current case.
    Uses RAG context + web search for answers.
    """
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY not configured.")

    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

    # Build context from RAG
    case_context = ""
    if case_has_documents(req.case_id):
        try:
            retriever = get_retriever(req.case_id, k=5)
            docs = retriever.invoke(req.message)
            case_context = "\n".join(
                f"[{d.metadata.get('source_file', 'doc')}]: {d.page_content[:400]}"
                for d in docs
            )
        except Exception:
            pass

    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=0.1,
        openai_api_key=settings.openai_api_key,
    )

    system = f"""You are a senior advocate specialising in Indian construction-law defence.
You are assisting with Special Session Case No. 1/2025 (Hemraj Vardar, Stadium Wall Collapse, Udaipur).

CASE CONTEXT FROM UPLOADED DOCUMENTS:
{case_context or '[No documents uploaded]'}

RULES:
- Answer only from verified facts and uploaded documents.
- If you cite a case, include the full citation.
- If you are unsure, say so and recommend verification.
- Use Hindi legal terminology where appropriate.
- Never hallucinate citations or IS clause numbers."""

    messages = [SystemMessage(content=system)]
    for h in req.history[-6:]:  # last 6 turns
        if h.get("role") == "user":
            messages.append(HumanMessage(content=h["content"]))
        elif h.get("role") == "assistant":
            messages.append(AIMessage(content=h["content"]))
    messages.append(HumanMessage(content=req.message))

    try:
        response = llm.invoke(messages)
        return {
            "reply": response.content,
            "sources": [d.metadata.get("source_file", "") for d in (docs if case_context else [])],
            "verification_notes": [],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Preload Case 01 Documents ──────────────────────────────────────────────────

@router.post("/cases/case01/preload")
async def preload_case01():
    """
    Pre-load all CASE_01_HemrajG documents into ChromaDB.
    Indexes: defence reports, discharge applications, standards matrices, etc.
    """
    from pathlib import Path as _Path
    case_id = "case01"
    case_dir = _Path("../../CASE_01_HemrajG")  # relative to backend/

    if not case_dir.exists():
        # Try absolute path from workspace root
        import os
        workspace = _Path(os.getcwd()).parent.parent
        case_dir = workspace / "CASE_01_HemrajG"

    if not case_dir.exists():
        return {"success": False, "error": f"CASE_01_HemrajG directory not found at {case_dir}"}

    # Collect all indexable files
    extensions = {".md", ".txt", ".lex", ".pdf"}
    files = [f for f in case_dir.rglob("*") if f.suffix.lower() in extensions and f.is_file()]

    if not files:
        return {"success": False, "error": "No indexable files found in CASE_01_HemrajG"}

    summary = ingest_files(case_id, files)
    total = sum(item.get("chunks", 0) for item in summary["indexed"])

    return {
        "success": True,
        "case_id": case_id,
        "files_indexed": len(summary["indexed"]),
        "total_chunks": total,
        "skipped": summary["skipped"],
        "errors": summary["errors"],
    }
