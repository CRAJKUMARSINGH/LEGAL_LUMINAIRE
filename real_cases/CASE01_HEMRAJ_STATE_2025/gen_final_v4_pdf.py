"""
Generate DEFENCE_REPLY_FINAL_v4.pdf from DEFENCE_REPLY_FINAL_v4.lex
Run: python gen_final_v4_pdf.py
Requires: pip install reportlab
"""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import re, os, sys

# ── paths ──────────────────────────────────────────────────────────────────────
BASE = Path(__file__).parent
LEX  = BASE / "DEFENCE_REPLY_FINAL_v4.lex"
OUT  = BASE / "DEFENCE_REPLY_FINAL_v4.pdf"

# ── document setup ─────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=25*mm, rightMargin=20*mm,
    topMargin=20*mm,  bottomMargin=20*mm,
    title="Defence Reply — Hemraj Vardar — Final v4",
    author="Legal Luminaire",
    subject="Written Submission — Rajasthan High Court",
)

W = A4[0] - 45*mm   # usable width

# ── styles ─────────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, parent=base["Normal"], **kw)

title_s   = S("Title",   fontSize=11, leading=15, alignment=TA_CENTER,
               fontName="Helvetica-Bold", spaceAfter=4)
court_s   = S("Court",   fontSize=10, leading=14, alignment=TA_CENTER,
               fontName="Helvetica-Bold", spaceAfter=2)
party_s   = S("Party",   fontSize=9,  leading=13, alignment=TA_CENTER,
               fontName="Helvetica",    spaceAfter=6)
head_s    = S("Head",    fontSize=10, leading=14, alignment=TA_LEFT,
               fontName="Helvetica-Bold", spaceBefore=8, spaceAfter=4)
body_s    = S("Body",    fontSize=9,  leading=14, alignment=TA_JUSTIFY,
               fontName="Helvetica",    spaceAfter=4)
quote_s   = S("Quote",   fontSize=8.5,leading=13, alignment=TA_JUSTIFY,
               fontName="Helvetica-Oblique", leftIndent=12, rightIndent=8,
               spaceAfter=4, spaceBefore=4)
check_s   = S("Check",   fontSize=8.5,leading=13, alignment=TA_LEFT,
               fontName="Courier",      spaceAfter=2)
rule_s    = S("Rule",    fontSize=7,  leading=10, alignment=TA_CENTER,
               fontName="Helvetica",    textColor=colors.grey)

# ── helpers ────────────────────────────────────────────────────────────────────
RULE = HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=4)

def is_separator(line):
    return set(line.strip()) <= {"━", "─", "=", "-", " "} and len(line.strip()) > 10

def is_heading(line):
    m = re.match(r'^(I{1,3}V?|V?I{0,3}|X{0,2}I{0,3}|[IVXLC]+)\.\s+', line.strip())
    return bool(m) and len(line.strip()) < 90

def is_table_row(line):
    return line.strip().startswith("│") or line.strip().startswith("┌") or \
           line.strip().startswith("├") or line.strip().startswith("└")

def is_checklist(line):
    return line.strip().startswith("[ ]") or line.strip().startswith("[x]")

def clean(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# ── parse lex → flowables ──────────────────────────────────────────────────────
text = LEX.read_text(encoding="utf-8")
lines = text.splitlines()

story = []
i = 0
in_table = False
table_rows = []

def flush_table():
    global table_rows, in_table
    if not table_rows:
        in_table = False
        return
    # convert box-drawing rows to plain text rows
    data = []
    for row in table_rows:
        cells = [c.strip() for c in row.split("│") if c.strip()]
        if cells:
            data.append(cells)
    if not data:
        in_table = False
        table_rows = []
        return
    # normalise column count
    ncols = max(len(r) for r in data)
    for r in data:
        while len(r) < ncols:
            r.append("")
    col_w = W / ncols
    ts = TableStyle([
        ("FONTNAME",    (0,0),(-1,-1), "Helvetica"),
        ("FONTSIZE",    (0,0),(-1,-1), 7.5),
        ("LEADING",     (0,0),(-1,-1), 11),
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
        ("GRID",        (0,0),(-1,-1), 0.4, colors.grey),
        ("BACKGROUND",  (0,0),(-1, 0), colors.HexColor("#f0f0f0")),
        ("FONTNAME",    (0,0),(-1, 0), "Helvetica-Bold"),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#fafafa")]),
        ("LEFTPADDING",  (0,0),(-1,-1), 4),
        ("RIGHTPADDING", (0,0),(-1,-1), 4),
        ("TOPPADDING",   (0,0),(-1,-1), 3),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
    ])
    tbl = Table([[Paragraph(clean(c), body_s) for c in row] for row in data],
                colWidths=[col_w]*ncols, repeatRows=1)
    tbl.setStyle(ts)
    story.append(tbl)
    story.append(Spacer(1, 4))
    table_rows = []
    in_table = False

while i < len(lines):
    line = lines[i]

    # separator lines → HR
    if is_separator(line):
        if in_table:
            flush_table()
        story.append(RULE)
        i += 1
        continue

    # table rows
    if is_table_row(line):
        in_table = True
        if "─" not in line and "┌" not in line and "├" not in line and "└" not in line:
            table_rows.append(line)
        i += 1
        continue
    else:
        if in_table:
            flush_table()

    stripped = line.strip()
    if not stripped:
        story.append(Spacer(1, 3))
        i += 1
        continue

    # checklist items
    if is_checklist(stripped):
        story.append(Paragraph(clean(stripped), check_s))
        i += 1
        continue

    # section headings (Roman numerals)
    if is_heading(stripped):
        story.append(Paragraph(clean(stripped), head_s))
        i += 1
        continue

    # quoted text (indented with spaces or starts with quote marks)
    if stripped.startswith('"') or stripped.startswith("'"):
        story.append(Paragraph(clean(stripped), quote_s))
        i += 1
        continue

    # court / party lines (centred block at top)
    if "IN THE HIGH COURT" in stripped or "CRIMINAL MISCELLANEOUS" in stripped:
        story.append(Paragraph(clean(stripped), court_s))
        i += 1
        continue

    if "... Petitioner" in stripped or "... Respondent" in stripped:
        story.append(Paragraph(clean(stripped), party_s))
        i += 1
        continue

    if "WRITTEN SUBMISSION" in stripped and "RAJASTHAN" in stripped:
        story.append(Paragraph(clean(stripped), title_s))
        i += 1
        continue

    # default body
    story.append(Paragraph(clean(stripped), body_s))
    i += 1

if in_table:
    flush_table()

# ── footer callback ────────────────────────────────────────────────────────────
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(colors.grey)
    w, h = A4
    canvas.drawString(25*mm, 12*mm,
        "Legal Luminaire | DEFENCE_REPLY_FINAL_v4 | Hemraj Vardar | 03-04-2026")
    canvas.drawRightString(w - 20*mm, 12*mm, f"Page {doc.page}")
    canvas.restoreState()

# ── build ──────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"PDF generated: {OUT}")
