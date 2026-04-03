"""
Backend Lab Report Extraction Routes — Week 8
Specialized parsing for NABL/FSL lab reports.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class LabTestResult(BaseModel):
    parameter: str = Field(description="e.g. Compressive Strength, C/S Ratio")
    observed_value: str = Field(description="The value found by the lab")
    specified_value: str = Field(description="The value required by the standard (e.g. IS 456)")
    unit: str = Field(description="e.g. N/mm2, %")
    status: str = Field(description="PASS / FAIL / MARGINAL")

class LabReportExtraction(BaseModel):
    report_no: str
    date_of_issue: str
    sample_description: str
    results: List[LabTestResult]
    conclusion: str
    standard_applied: str

@router.post("/extract-lab-report", response_model=LabReportExtraction)
async def extract_lab_report(file: UploadFile = File(...)):
    """Extract structured data from a NABL Lab Report (PDF/Image)."""
    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        raise HTTPException(status_code=500, detail="Gemini key not configured.")

    # 1. Save and Extract Text (Reuse logic from omni-ingest or simplified here)
    # For Week 8, we assume the file is small and we can extract text via OCR/PDF
    import shutil
    from pathlib import Path
    temp_path = Path(f"C:/Temp/lab_{file.filename}") if os.name == 'nt' else Path(f"/tmp/lab_{file.filename}")
    temp_path.parent.mkdir(parents=True, exist_ok=True)
    
    with temp_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    extracted_text = ""
    ext = Path(file.filename).suffix.lower()
    
    try:
        if ext == ".pdf":
            from langchain_community.document_loaders import PyPDFLoader
            loader = PyPDFLoader(str(temp_path))
            docs = loader.load()
            extracted_text = "\n".join(d.page_content for d in docs)
        elif ext in [".png", ".jpg", ".jpeg"]:
            import pytesseract
            from PIL import Image
            extracted_text = pytesseract.image_to_string(Image.open(temp_path))
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to read file.")

    # 2. Gemini Structured Extraction
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.1,
        )
        structured_llm = llm.with_structured_output(LabReportExtraction)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a professional forensic lab validator. Extract the following table data from the lab report. "
                       "Ensure you capture 'Observed' vs 'Specified/Requirement' values accurately. "
                       "Identify the IS/BIS standard applied to the test."),
            ("human", "{text}")
        ])
        
        chain = prompt | structured_llm
        result = chain.invoke({"text": extracted_text[:12000]})
        return result
    except Exception as e:
        logger.error(f"Lab extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
