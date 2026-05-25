from __future__ import annotations

import base64
import html
import re
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BIB = ROOT / "bibliography"
ASSETS = ROOT / "Attached_Assets"
FINAL_REPLY = ROOT / "HEMRAJ_FINAL_REPLY_HINDI_MERGED_v1.lex"

OUT_HTML = ROOT / "HEMRAJ_PRECEDENTS_CODES_COMPENDIUM_PRINT.html"
OUT_CHECKLIST = ROOT / "HEMRAJ_ANNEXURE_A_TO_X_PDF_CHECKLIST.md"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig", errors="replace").replace("\r\n", "\n").replace("\r", "\n")


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def esc(text: str) -> str:
    return html.escape(text)


def expected_annexures() -> list[tuple[str, str]]:
    text = read_text(FINAL_REPLY)
    rows: list[tuple[str, str]] = []
    pattern = re.compile(r"अनुलग्नक\s+([A-X])\s+│\s+([A-Za-z0-9_().\-]+\.pdf)")
    for match in pattern.finditer(text):
        rows.append((match.group(1), match.group(2)))
    return rows


def all_local_files() -> list[Path]:
    files: list[Path] = []
    for base in [BIB, ASSETS]:
        if base.exists():
            files.extend(p for p in base.rglob("*") if p.is_file())
    files.extend(p for p in ROOT.glob("*.pdf") if p.is_file())
    return sorted(files, key=lambda p: rel(p).lower())


def find_exact(filename: str, files: list[Path]) -> Path | None:
    lower = filename.lower()
    for path in files:
        if path.name.lower() == lower:
            return path
    return None


def find_candidates(filename: str, files: list[Path]) -> list[Path]:
    tokens = [t for t in re.split(r"[_\W]+", filename.lower()) if len(t) >= 4]
    scored: list[tuple[int, Path]] = []
    for path in files:
        haystack = path.name.lower()
        score = sum(1 for token in tokens if token in haystack)
        if score:
            scored.append((score, path))
    scored.sort(key=lambda item: (-item[0], rel(item[1]).lower()))
    return [path for _, path in scored[:4]]


def write_checklist(files: list[Path]) -> None:
    lines = [
        "# Hemraj Annexure A-X PDF Availability Checklist",
        "",
        f"Generated: {date.today().isoformat()}",
        "",
        "Rule: exact certified/official PDFs should be attached before filing. Local notes/screenshots are research aids unless verified.",
        "",
        "| Annexure | Expected PDF | Exact local file | Local candidates | Status |",
        "|---|---|---|---|---|",
    ]
    for letter, filename in expected_annexures():
        exact = find_exact(filename, files)
        candidates = find_candidates(filename, files)
        exact_text = rel(exact) if exact else "-"
        candidate_text = "<br>".join(rel(p) for p in candidates) if candidates else "-"
        status = "EXACT FOUND" if exact else "EXACT PDF MISSING - attach certified copy"
        lines.append(f"| {letter} | `{filename}` | {exact_text} | {candidate_text} | {status} |")
    OUT_CHECKLIST.write_text("\n".join(lines) + "\n", encoding="utf-8")


def render_markdown_like(path: Path) -> str:
    text = esc(read_text(path))
    title = esc(rel(path))
    return f"<section><h2>{title}</h2><pre>{text}</pre></section>"


def render_image(path: Path) -> str:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    title = esc(rel(path))
    return f'<section><h2>{title}</h2><img src="data:{mime};base64,{data}" alt="{title}"></section>'


def render_pdf_listing(path: Path) -> str:
    title = esc(rel(path))
    size_kb = path.stat().st_size / 1024
    return f"<li><strong>{title}</strong> ({size_kb:.1f} KB)</li>"


def make_html(files: list[Path]) -> str:
    pdfs = [p for p in files if p.suffix.lower() == ".pdf"]
    texts = [p for p in files if p.suffix.lower() in {".md", ".lex", ".txt", ".html"}]
    images = [p for p in files if p.suffix.lower() in {".png", ".jpg", ".jpeg"}]

    text_sections = "\n".join(render_markdown_like(p) for p in texts)
    image_sections = "\n".join(render_image(p) for p in images)
    pdf_listing = "\n".join(render_pdf_listing(p) for p in pdfs)
    checklist_text = esc(read_text(OUT_CHECKLIST)) if OUT_CHECKLIST.exists() else ""

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hemraj Precedents and Codes Compendium</title>
  <style>
    @page {{ size: A4; margin: 16mm; }}
    body {{
      margin: 0;
      color: #111;
      font-family: "Nirmala UI", "Mangal", Arial, sans-serif;
      font-size: 10.8pt;
      line-height: 1.45;
    }}
    h1 {{ font-size: 20pt; text-align: center; margin: 0 0 8mm; }}
    h2 {{ font-size: 13pt; margin: 0 0 4mm; border-bottom: 1px solid #999; padding-bottom: 2mm; }}
    section {{ break-before: page; }}
    pre {{
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font: inherit;
      margin: 0;
    }}
    img {{
      display: block;
      max-width: 100%;
      height: auto;
      margin: 4mm auto;
      border: 1px solid #bbb;
    }}
    .note {{
      border: 1px solid #999;
      padding: 4mm;
      margin: 0 0 5mm;
      background: #f7f7f7;
    }}
    li {{ margin-bottom: 2mm; }}
  </style>
</head>
<body>
  <h1>Hemraj Matter - Precedents, Codes and Standards Compendium</h1>
  <div class="note">
    Generated {date.today().isoformat()}. This compendium includes available local research notes, precedent notes,
    standards/code notes, technical manuals, image extracts, and a listing of local PDFs. Exact certified judgments,
    official standards, and para numbers must be verified before filing.
  </div>
  <section>
    <h2>Annexure A-X PDF Availability Checklist</h2>
    <pre>{checklist_text}</pre>
  </section>
  <section>
    <h2>Available Local PDFs</h2>
    <ul>{pdf_listing}</ul>
  </section>
  {text_sections}
  {image_sections}
</body>
</html>
"""


def main() -> None:
    files = all_local_files()
    write_checklist(files)
    OUT_HTML.write_text(make_html(files), encoding="utf-8")
    print(f"Wrote {OUT_CHECKLIST}")
    print(f"Wrote {OUT_HTML}")


if __name__ == "__main__":
    main()
