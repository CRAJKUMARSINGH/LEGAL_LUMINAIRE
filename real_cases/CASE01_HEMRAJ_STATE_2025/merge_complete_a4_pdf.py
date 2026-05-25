from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parent
SOURCES = [
    ROOT / "HEMRAJ_FINAL_REPLY_HINDI_MERGED_PRINT.pdf",
    ROOT / "HEMRAJ_PRECEDENTS_CODES_COMPENDIUM.pdf",
    ROOT / "HEMRAJ_SEARCH_AND_CHECKLIST_REPORT.pdf",
]
OUT = ROOT / "HEMRAJ_COMPLETE_COMBINED_A4_PORTRAIT.pdf"


def main() -> None:
    writer = PdfWriter()
    total = 0
    for source in SOURCES:
        reader = PdfReader(str(source))
        for page in reader.pages:
            writer.add_page(page)
            total += 1
    with OUT.open("wb") as handle:
        writer.write(handle)
    print(f"Wrote {OUT}")
    print(f"pages {total}")


if __name__ == "__main__":
    main()
