"""
Pre-load CASE_01_HemrajG documents into ChromaDB on startup.
Run: python preload_case01.py
Or called automatically from main.py lifespan.
"""
from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def preload_hemraj_case(workspace_root: Path | None = None) -> dict:
    """Index all CASE_01_HemrajG documents into ChromaDB for case01."""
    from config import settings
    from rag.document_store import ingest_files, case_has_documents, get_case_doc_count

    case_id = "case01"

    # Find the case directory
    if workspace_root is None:
        # Try relative paths from backend/
        candidates = [
            Path("../../CASE_01_HemrajG"),
            Path("../../../CASE_01_HemrajG"),
            Path("CASE_01_HemrajG"),
        ]
        for c in candidates:
            if c.exists():
                workspace_root = c.parent
                break

    if workspace_root is None:
        logger.warning("Could not find CASE_01_HemrajG directory. Skipping preload.")
        return {"success": False, "error": "Directory not found"}

    case_dir = workspace_root / "CASE_01_HemrajG"
    if not case_dir.exists():
        logger.warning(f"CASE_01_HemrajG not found at {case_dir}")
        return {"success": False, "error": str(case_dir)}

    # If both v3 and v4 artefacts exist, we want retrieval to prefer the latest.
    # Exclude old v3 defence reply from indexing to avoid conflicting content in RAG.
    excluded_filenames = {
        "DEFENCE_REPLY_FINAL_v3.lex",
        "DEFENCE_REPLY_FINAL_v3.pdf",
        "DEFENCE_REPLY_FINAL_v3.pdf.txt",
    }

    # Priority files to index (most important first)
    priority_files = [
        # Latest Hemraj defence reply (v4) — ensure it is indexed first
        "DEFENCE_REPLY_FINAL_v4.lex",
        "DEFENCE_REPLY_FINAL_v4.pdf",
        "WRITTEN_SUBMISSION_RHC_FINAL_v3.lex",
        "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md",
        "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md",
        "Case_Law_Matrix_Verified_Pending.md",
        "Standards_Matrix_IS_ASTM_NABL.md",
        "Argument_Bank_And_Annexure_Builder.md",
        "Cross_Reference_Matrix_Detailed.lex",
        "Forensic_Protocol_Checklist.md",
        "Case_Facts_Timeline.md",
        "Legal_Case_References_Brief_Notes.md",
        "DEEPsEARCH.md",
        "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex",
        "Stadium_Collapse_Defence_Hindi.lex",
        "DISCHARGE_APPLICATION_UPDATED_v2.lex",
        "DEFENCE_REPLY_UPDATED_v2.lex",
    ]

    files_to_index: list[Path] = []

    # Add priority files first
    for fname in priority_files:
        p = case_dir / fname
        if p.exists():
            files_to_index.append(p)

    # Add any remaining .md, .lex, .txt files
    extensions = {".md", ".lex", ".txt"}
    for f in case_dir.rglob("*"):
        if (
            f.suffix.lower() in extensions
            and f.is_file()
            and f.name not in excluded_filenames
            and f not in files_to_index
        ):
            files_to_index.append(f)

    # Add PDFs from INPUT_DATA
    input_dir = case_dir / "INPUT_DATA"
    if input_dir.exists():
        for f in input_dir.glob("*.pdf"):
            files_to_index.append(f)

    if not files_to_index:
        return {"success": False, "error": "No files to index"}

    logger.info(f"Pre-loading {len(files_to_index)} files for case01...")
    summary = ingest_files(case_id, files_to_index)
    total_chunks = sum(item.get("chunks", 0) for item in summary["indexed"])

    logger.info(
        f"Case01 preload complete: {len(summary['indexed'])} files, "
        f"{total_chunks} chunks, {len(summary['skipped'])} skipped"
    )

    return {
        "success": True,
        "case_id": case_id,
        "files_indexed": len(summary["indexed"]),
        "total_chunks": total_chunks,
        "skipped": summary["skipped"],
        "errors": summary["errors"],
    }


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO)
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    result = preload_hemraj_case(root)
    print(result)
