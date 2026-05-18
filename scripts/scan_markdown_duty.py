#!/usr/bin/env python3
"""
Duty scan: read every *.md under the repo (excluding common vendor/huge dirs),
extract instruction-adjacent lines. Output machine + human report.

Run from repo root: py -3 scripts/scan_markdown_duty.py
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

BASE_SKIP = {
    "node_modules",
    ".git",
    "dist",
    ".pnpm-store",
    ".turbo",
    "__pycache__",
    ".expo",
}

# Line must match one of these (case-insensitive) to be "instruction-adjacent"
PATTERNS = [
    re.compile(r"^\s*#+\s+", re.I),  # any markdown heading
    re.compile(
        r"(TODO|FIXME|NOTE:|WARNING:|IMPORTANT:|ACTION REQUIRED|MUST NOT|MUST\b|"
        r"DO NOT\b|SHALL\b|Run\s|Execute\s|pnpm\s|npm\s|yarn\s|pip\s|uvicorn|"
        r"docker\s|git\s|kubectl|curl\s|wget\s|powershell|\.ps1|\.sh\b|"
        r"Instruction|INSTRUCTION|Prerequisite|Quick Start|Deploy\b)",
        re.I,
    ),
]


def skip_names(include_local: bool) -> set[str]:
    s = set(BASE_SKIP)
    if not include_local:
        s.add(".local")
    return s


def should_skip_dir(rel: Path, names: set[str]) -> bool:
    parts = {p.lower() for p in rel.parts}
    return any(s.lower() in parts for s in names)


def iter_md_files(root: Path, include_local: bool) -> list[Path]:
    names = skip_names(include_local)
    out: list[Path] = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if p.suffix.lower() not in (".md",):
            continue
        try:
            rel = p.relative_to(root)
        except ValueError:
            continue
        if should_skip_dir(rel, names):
            continue
        out.append(p)
    return sorted(out)


def is_instruction_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    return any(p.search(line) for p in PATTERNS)


def scan_file(path: Path) -> dict:
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")

    lines = text.splitlines()
    hits: list[dict] = []
    for i, line in enumerate(lines, start=1):
        if is_instruction_line(line):
            hits.append({"line": i, "text": line.rstrip()[:500]})

    rel = str(path.relative_to(REPO)).replace("\\", "/")
    return {
        "path": rel,
        "bytes": len(raw),
        "lines": len(lines),
        "hit_count": len(hits),
        "hits": hits,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Read every .md under repo; extract instruction-adjacent lines.")
    ap.add_argument(
        "--include-local",
        action="store_true",
        help="Also scan .local/ (Cursor skill mirrors). Default: skip.",
    )
    args = ap.parse_args()

    md_files = iter_md_files(REPO, include_local=args.include_local)
    results: list[dict] = []
    errors: list[str] = []

    for p in md_files:
        try:
            results.append(scan_file(p))
        except OSError as e:
            errors.append(f"{p}: {e}")

    total_hits = sum(r["hit_count"] for r in results)
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "repo": str(REPO),
        "include_local": args.include_local,
        "markdown_files_read": len(results),
        "total_instruction_adjacent_lines": total_hits,
        "read_errors": errors,
        "files": results,
    }

    out_dir = REPO / "scripts" / "reports"
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / "markdown_duty_scan.json"
    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    # Compact index: paths with hit counts only
    index_path = out_dir / "markdown_duty_index.txt"
    lines_out = [
        f"# Markdown duty scan — {report['markdown_files_read']} files, {total_hits} flagged lines",
        f"# Full JSON: {json_path.relative_to(REPO).as_posix()}",
        "",
    ]
    for r in sorted(results, key=lambda x: (-x["hit_count"], x["path"])):
        lines_out.append(f"{r['hit_count']:5d}  {r['lines']:6d}  {r['path']}")
    index_path.write_text("\n".join(lines_out) + "\n", encoding="utf-8")

    print(f"Read {len(results)} markdown files.")
    print(f"Flagged {total_hits} instruction-adjacent lines.")
    print(f"JSON: {json_path}")
    print(f"Index: {index_path}")
    if errors:
        print(f"Errors: {len(errors)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
