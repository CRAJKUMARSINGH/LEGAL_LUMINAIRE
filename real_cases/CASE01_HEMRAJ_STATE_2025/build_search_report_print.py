from __future__ import annotations

import html
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CHECKLIST = ROOT / "HEMRAJ_ANNEXURE_A_TO_X_PDF_CHECKLIST.md"
SEARCH_REPORT = ROOT / "HEMRAJ_MISSING_ANNEXURE_WEB_SEARCH_REPORT.md"
OUT_HTML = ROOT / "HEMRAJ_SEARCH_AND_CHECKLIST_REPORT_PRINT.html"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig", errors="replace").replace("\r\n", "\n").replace("\r", "\n")


def main() -> None:
    body = "\n\n".join(
        [
            "HEMRAJ MATTER - ANNEXURE CHECKLIST AND WEB SEARCH REPORT",
            f"Generated: {date.today().isoformat()}",
            "A4 Portrait print copy. Certified/official copies and para markings remain required before filing.",
            "=" * 86,
            read_text(CHECKLIST),
            "\n" + "=" * 86 + "\n",
            read_text(SEARCH_REPORT),
        ]
    )
    OUT_HTML.write_text(
        f"""<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <title>Hemraj Search and Checklist Report</title>
  <style>
    @page {{ size: A4 portrait; margin: 16mm; }}
    body {{
      margin: 0;
      color: #111;
      font-family: "Nirmala UI", "Mangal", Arial, sans-serif;
      font-size: 10.8pt;
      line-height: 1.45;
    }}
    pre {{
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font: inherit;
      margin: 0;
    }}
  </style>
</head>
<body><pre>{html.escape(body)}</pre></body>
</html>
""",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_HTML}")


if __name__ == "__main__":
    main()
