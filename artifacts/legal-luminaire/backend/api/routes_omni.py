"""
Omni-Modal Ingestion Routes — Week 2: PDF Parsing Engine
Supports PDF (page-level chunking), Image OCR, DOCX.
Provides /omni-preview for text extraction preview and /omni-ingest for full case creation.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
import shutil
from pathlib import Path
import os
import uuid
import logging
from rag.standards_index import find_relevant_standards
from api.redaction_utils import redact_indian_pii

router = APIRouter()
logger = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────
MAX_FILE_SIZE_MB = 50
CHUNK_SIZE_CHARS = 2000  # Each chunk ≈ 500 tokens
CHUNK_OVERLAP_CHARS = 200


# ── Models ─────────────────────────────────────────────────────────────────────

class PageChunk(BaseModel):
    page_number: int
    chunk_index: int
    text: str
    char_count: int

class ExtractionMetadata(BaseModel):
    filename: str
    file_type: str
    total_pages: int
    total_chars: int
    total_chunks: int
    preview_text: str = Field(description="First 2000 chars for quick preview")

class PreviewResponse(BaseModel):
    success: bool
    file_id: str
    metadata: ExtractionMetadata | None = None
    chunks: list[PageChunk] = []
    errors: list[str] = []

class NewCaseExtraction(BaseModel):
    incident_type: str = Field(description="e.g. Building Collapse, Check Bounce")
    jurisdiction: str = Field(description="Court name or general jurisdiction")
    accused_names: list[str] = Field(description="List of accused individuals")
    timeline_events: list[dict] = Field(description="Chronological events with dates. Include 'grounding' key if it relates to a standard violation.")
    statutes_involved: list[str] = Field(description="IPC/BNS or standard codes mentioned")
    forensic_grounding: list[dict] = Field(default=[], description="List of matched standards or procedural gaps")

class OmniIngestResponse(BaseModel):
    success: bool
    case_id: str
    extraction: NewCaseExtraction | None = None
    metadata: ExtractionMetadata | None = None
    errors: list[str] = []


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_temp_dir() -> Path:
    temp_dir = Path(os.environ.get("TEMP", "C:/Temp")) / "omni_ingest" if os.name == 'nt' else Path("/tmp/omni_ingest")
    temp_dir.mkdir(parents=True, exist_ok=True)
    return temp_dir


def _chunk_text(text: str, chunk_size: int = CHUNK_SIZE_CHARS, overlap: int = CHUNK_OVERLAP_CHARS) -> list[str]:
    """Split text into overlapping chunks for downstream processing."""
    if len(text) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


def _extract_pdf_pages(filepath: Path) -> tuple[list[dict], list[str]]:
    """
    Week 2 PDF Parsing Engine:
    - Page-level extraction with metadata
    - Robust chunking for large documents (100+ pages)
    - Handles encrypted/malformed PDFs gracefully
    """
    pages = []
    errors = []
    try:
        from langchain_community.document_loaders import PyPDFLoader
        loader = PyPDFLoader(str(filepath))
        docs = loader.load()

        for doc in docs:
            page_num = doc.metadata.get("page", 0) + 1
            raw_text = doc.page_content.strip()
            if not raw_text:
                errors.append(f"Page {page_num}: empty (possibly scanned image — use OCR)")
                continue
            pages.append({
                "page_number": page_num,
                "text": raw_text,
                "char_count": len(raw_text),
            })
    except Exception as e:
        errors.append(f"PyPDF extraction failed: {e}")

    return pages, errors


def _extract_image_text(filepath: Path) -> tuple[str, list[str]]:
    """Extract text from image using Tesseract OCR."""
    errors = []
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(filepath)
        # Week 15: Regional Language Audit — Adding Hindi and Gujarati support
        # Requires 'hin' and 'guj' tesseract-data packages to be installed on host
        text = pytesseract.image_to_string(img, lang='hin+guj+eng')
        return text.strip(), errors
    except Exception as e:
        errors.append(f"Tesseract OCR error: {e}. Ensure Tesseract is installed.")
        return "", errors


def _extract_docx_text(filepath: Path) -> tuple[str, list[str]]:
    """Extract text from DOCX."""
    errors = []
    try:
        from langchain_community.document_loaders import Docx2txtLoader
        loader = Docx2txtLoader(str(filepath))
        docs = loader.load()
        text = "\n".join(d.page_content for d in docs)
        return text.strip(), errors
    except Exception as e:
        errors.append(f"Docx extraction error: {e}")
        return "", errors


def _save_upload(file: UploadFile) -> tuple[Path, str, str, list[str]]:
    """Save uploaded file to temp and return (path, file_id, extension, errors)."""
    file_id = str(uuid.uuid4())[:8]
    temp_dir = _get_temp_dir()
    file_ext = Path(file.filename or "").suffix.lower()
    dest = temp_dir / f"{file_id}{file_ext}"
    errors = []
    try:
        with dest.open("wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        errors.append(f"Failed to save file: {e}")
    return dest, file_id, file_ext, errors


# ── PREVIEW ENDPOINT ──────────────────────────────────────────────────────────

@router.post("/omni-preview", response_model=PreviewResponse)
async def omni_preview(file: UploadFile = File(...)):
    """
    Week 2: Preview extracted text before committing to case creation.
    Returns page-level chunks and metadata so the advocate can review accuracy.
    """
    dest, file_id, file_ext, save_errors = _save_upload(file)
    if save_errors:
        return PreviewResponse(success=False, file_id=file_id, errors=save_errors)

    all_chunks: list[PageChunk] = []
    all_errors: list[str] = []
    full_text = ""

    if file_ext == ".pdf":
        pages, pdf_errors = _extract_pdf_pages(dest)
        all_errors.extend(pdf_errors)

        for page in pages:
            text_chunks = _chunk_text(page["text"])
            for ci, chunk in enumerate(text_chunks):
                all_chunks.append(PageChunk(
                    page_number=page["page_number"],
                    chunk_index=ci,
                    text=chunk,
                    char_count=len(chunk),
                ))
        full_text = "\n".join(p["text"] for p in pages)
        total_pages = len(pages)

    elif file_ext in [".png", ".jpg", ".jpeg"]:
        text, ocr_errors = _extract_image_text(dest)
        all_errors.extend(ocr_errors)
        full_text = text
        total_pages = 1
        if text:
            all_chunks.append(PageChunk(page_number=1, chunk_index=0, text=text, char_count=len(text)))

    elif file_ext == ".docx":
        text, docx_errors = _extract_docx_text(dest)
        all_errors.extend(docx_errors)
        full_text = text
        total_pages = 1
        text_chunks = _chunk_text(text)
        for ci, chunk in enumerate(text_chunks):
            all_chunks.append(PageChunk(page_number=1, chunk_index=ci, text=chunk, char_count=len(chunk)))
    else:
        return PreviewResponse(success=False, file_id=file_id, errors=[f"Unsupported file type: {file_ext}"])

    if not full_text:
        return PreviewResponse(success=False, file_id=file_id, errors=all_errors or ["No text could be extracted."])

    metadata = ExtractionMetadata(
        filename=file.filename or "unknown",
        file_type=file_ext,
        total_pages=total_pages,
        total_chars=len(full_text),
        total_chunks=len(all_chunks),
        preview_text=full_text[:2000],
    )

    return PreviewResponse(
        success=True,
        file_id=file_id,
        metadata=metadata,
        chunks=all_chunks[:50],  # Cap at 50 chunks in preview response
        errors=all_errors,
    )


# ── FULL INGEST ENDPOINT ──────────────────────────────────────────────────────

@router.post("/omni-ingest", response_model=OmniIngestResponse)
async def omni_ingest(file: UploadFile = File(...)):
    """
    Omni-modal ingestion endpoint for NEW CASE creation.
    Accepts images, PDFs, or DOCX. Extracts text, chunks it, then
    passes to Gemini for structured case extraction.
    """
    dest, file_id, file_ext, save_errors = _save_upload(file)
    if save_errors:
        return OmniIngestResponse(success=False, case_id="", errors=save_errors)

    # Week 15 Pen-Test: Ensure file size isn't malicious
    file_size = os.path.getsize(dest)
    if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
        os.remove(dest)
        return OmniIngestResponse(success=False, case_id="", errors=[f"File too large (Max {MAX_FILE_SIZE_MB}MB)"])

    extracted_text = ""
    total_pages = 0
    all_errors: list[str] = []

    if file_ext == ".pdf":
        pages, pdf_errors = _extract_pdf_pages(dest)
        all_errors.extend(pdf_errors)
        extracted_text = "\n".join(p["text"] for p in pages)
        total_pages = len(pages)
        logger.info(f"PDF parsed: {total_pages} pages, {len(extracted_text)} chars")

    elif file_ext in [".png", ".jpg", ".jpeg"]:
        text, ocr_errors = _extract_image_text(dest)
        all_errors.extend(ocr_errors)
        extracted_text = text
        total_pages = 1

    elif file_ext == ".docx":
        text, docx_errors = _extract_docx_text(dest)
        all_errors.extend(docx_errors)
        extracted_text = text
        total_pages = 1
    else:
        return OmniIngestResponse(success=False, case_id="", errors=[f"Unsupported file type: {file_ext}"])

    if not extracted_text.strip():
        return OmniIngestResponse(success=False, case_id="", errors=all_errors or ["No text could be extracted."])

    # ── Week 5: LEGAL PII REDACTION (PRIVACY) ────────────
    # Mask Aadhar/PAN/Phone before deep-reasoning processing
    redacted_text = redact_indian_pii(extracted_text)

    # ── Week 15: HEAD-TAIL TEXT SEGMENTING FOR MASSIVE FILES ────────────
    # For a 500-page document, we focus on the top (Head) and bottom (Tail)
    if len(redacted_text) > 15000:
        head = redacted_text[:10000]
        tail = redacted_text[-5000:]
        focused_text = f"--- START OF DOCUMENT (HEAD) ---\n{head}\n\n[... OMITTED PAGES ...]\n\n--- END OF DOCUMENT (TAIL) ---\n{tail}"
    else:
        focused_text = redacted_text

    # Build metadata
    metadata = ExtractionMetadata(
        filename=file.filename or "unknown",
        file_type=file_ext,
        total_pages=total_pages,
        total_chars=len(extracted_text),
        total_chunks=len(_chunk_text(extracted_text)),
        preview_text=extracted_text[:2000],
    )

    # PHASE 3: STRUCTURED OUTPUT AGENT (Gemini Free Tier)
    extraction = None
    gemini_key = os.environ.get("GOOGLE_API_KEY", "")

    if gemini_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.prompts import ChatPromptTemplate

            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=gemini_key,
                temperature=0.1,
            )
            structured_llm = llm.with_structured_output(NewCaseExtraction)

            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a senior Indian legal analyst specializing in criminal and forensic law. "
                           "Your task is to extract structured case information from the provided text. "
                           "MULTILINGUAL REGIONAL SUPPORT (Week 15): The text may contain Hindi (Devanagari) or Gujarati script (e.g., FIRs/Panchnamas). "
                           "Accurately translate names and places to English but preserve statute numbers and official designations. "
                           "CRITICAL: If the text mentions sampling or structural failure, look for procedural gaps related to Indian Standards (BIS/IS). "
                           "In 'timeline_events', look for dates and specific police actions."),
                ("human", "{text}")
            ])

            chain = prompt | structured_llm
            extraction = chain.invoke({"text": focused_text})
            
            # Post-process with local RAG grounding
            relevant_stds = find_relevant_standards(extracted_text)
            if extraction:
                extraction.forensic_grounding = relevant_stds
                # Double-check timeline for missing grounding
                for event in extraction.timeline_events:
                    desc = event.get("event", "").lower()
                    if "sample" in desc or "sampling" in desc:
                        event["grounding"] = "Possible Violation: IS 1199 (Sampling Protocol)"
        except Exception as e:
            logger.warning(f"Gemini extraction failed: {e}")
            extraction = None

    if extraction is None:
        extraction = NewCaseExtraction(
            incident_type="Auto-Detected (Gemini API key not set — using mock)",
            jurisdiction="Special Sessions Court (Mock)",
            accused_names=["Extracted from document (Mock)"],
            timeline_events=[{"date": "Pending", "event": "Set GOOGLE_API_KEY env variable for real extraction."}],
            statutes_involved=["Set GOOGLE_API_KEY for real statute detection"]
        )

    new_case_id = f"case-{file_id}"

    return OmniIngestResponse(
        success=True,
        case_id=new_case_id,
        extraction=extraction,
        metadata=metadata,
    )

