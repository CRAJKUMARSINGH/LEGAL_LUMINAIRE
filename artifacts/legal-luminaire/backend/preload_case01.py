"""
Pre-load Case 01 (Hemraj Vardar) documents into ChromaDB.
Run once: python preload_case01.py
Documents sourced from CASE_01_HemrajG/ folder.
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from config import settings
from rag.document_store import ingest_files, get_case_doc_count

CASE_ID = "case-01"

# All Case 01 documents (relative to workspace root)
WORKSPACE_ROOT = Path(__file__).parent.parent.parent.parent  # adjust if needed
CASE_DOCS_ROOT = WORKSPACE_ROOT / "CASE_01_HemrajG"

CASE01_FILES = [
    CASE_DOCS_ROOT / "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md",
    CASE_DOCS_ROOT / "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md",
    CASE_DOCS_ROOT / "Case_Facts_Timeline.md",
    CASE_DOCS_ROOT / "Case_Law_Matrix_Verified_Pending.md",
    CASE_DOCS_ROOT / "Standards_Matrix_IS_ASTM_NABL.md",
    CASE_DOCS_ROOT / "Forensic_Protocol_Checklist.md",
    CASE_DOCS_ROOT / "Argument_Bank_And_Annexure_Builder.md",
    CASE_DOCS_ROOT / "DEEPsEARCH.md",
    CASE_DOCS_ROOT / "bibliography" / "forensic_defense_report.md",
    CASE_DOCS_ROOT / "bibliography" / "Full_Case_References.md",
    CASE_DOCS_ROOT / "bibliography" / "Bibliography_Index.md",
    CASE_DOCS_ROOT / "bibliography" / "Kattavellai_Supreme_Court_DNA_Guidelines_2025.md",
    CASE_DOCS_ROOT / "Attached_Assets" / "grok_01042026.md",
    CASE_DOCS_ROOT / "INPUT_DATA" / "discharge.pdf",
    CASE_DOCS_ROOT / "INPUT_DATA" / "DOC-20260222-WA0003..pdf",
]

# Also include .lex files (treated as text)
LEX_FILES = [
    CASE_DOCS_ROOT / "Stadium_Collapse_Defence_Hindi.lex",
    CASE_DOCS_ROOT / "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex",
    CASE_DOCS_ROOT / "Cross_Reference_Matrix_Detailed.lex",
    CASE_DOCS_ROOT / "bibliography" / "forensic_defense_hindi.lex",
]


def main():
    print(f"=== Pre-loading Case 01 into ChromaDB ===")
    print(f"Case ID: {CASE_ID}")
    print(f"ChromaDB path: {settings.chroma_path.resolve()}")

    if not settings.openai_api_key:
        print("ERROR: OPENAI_API_KEY not set in .env")
        print("Copy .env.example to .env and add your key.")
        sys.exit(1)

    # Ensure case docs dir exists
    case_dir = settings.case_docs_path / CASE_ID
    case_dir.mkdir(parents=True, exist_ok=True)

    # Copy files to case dir and collect paths
    import shutil
    paths_to_index: list[Path] = []

    all_files = CASE01_FILES + LEX_FILES
    for src in all_files:
        if not src.exists():
            print(f"  SKIP (not found): {src.name}")
            continue
        dest = case_dir / src.name
        shutil.copy2(src, dest)
        paths_to_index.append(dest)
        print(f"  Copied: {src.name}")

    if not paths_to_index:
        print("No files found to index.")
        sys.exit(1)

    print(f"\nIndexing {len(paths_to_index)} files...")
    summary = ingest_files(CASE_ID, paths_to_index)

    print(f"\n=== Indexing Complete ===")
    print(f"Indexed: {len(summary['indexed'])} files")
    for item in summary["indexed"]:
        print(f"  ✓ {item['file']} → {item['chunks']} chunks")
    if summary["skipped"]:
        print(f"Skipped: {summary['skipped']}")
    if summary["errors"]:
        print(f"Errors: {summary['errors']}")

    total = get_case_doc_count(CASE_ID)
    print(f"\nTotal chunks in ChromaDB for {CASE_ID}: {total}")
    print("Case 01 is ready for AI research queries.")


if __name__ == "__main__":
    main()
