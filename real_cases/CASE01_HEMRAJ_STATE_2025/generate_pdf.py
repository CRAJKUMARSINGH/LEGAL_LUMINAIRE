#!/usr/bin/env python3
"""Generate PDF for DEFENCE_REPLY_FINAL_v3.lex"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, sys

LEX_FILE = os.path.join(os.path.dirname(__file__), "DEFENCE_REPLY_FINAL_v3.lex")
PDF_FILE = os.path.join(os.path.dirname(__file__), "DEFENCE_REPLY_FINAL_v3.pdf")

# Read source
with open(LEX_FILE, encoding="utf-8") as f:
    lines = f.readlines()

doc = SimpleDocTemplate(
    PDF_FILE,
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=2.5*cm, bottomMargin=2.5*cm,
    title="Defence Reply Final v3 — Hemraj Vardar",
    author="Legal Luminaire",
)

styles = getSampleStyleSheet()

# Custom styles
header_style = ParagraphStyle(
    "Header", parent=styles["Normal"],
    fontSize=11, leading=16, alignment=TA_CENTER,
    fontName="Helvetica-Bold", spaceAfter=4,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Normal"],
    fontSize=10, leading=14, alignment=TA_CENTER,
    fontName="Helvetica-Bold", spaceBefore=8, spaceAfter=4,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontSize=9, leading=14, alignment=TA_JUSTIFY,
    fontName="Helvetica", spaceBefore=2, spaceAfter=2,
    leftIndent=0,
)
mono_style = ParagraphStyle(
    "Mono", parent=styles["Normal"],
    fontSize=8, leading=12, alignment=TA_LEFT,
    fontName="Courier", spaceBefore=1, spaceAfter=1,
    leftIndent=10,
)
caution_style = ParagraphStyle(
    "Caution", parent=styles["Normal"],
    fontSize=8, leading=12, alignment=TA_LEFT,
    fontName="Helvetica-Oblique", spaceBefore=2, spaceAfter=2,
    leftIndent=10, textColor=(0.6, 0, 0),
)

story = []

def is_separator(line):
    s = line.strip()
    return s.startswith("━") or s.startswith("=") or s.startswith("─")

def is_section_header(line):
    s = line.strip()
    return (s.startswith("भाग-") or s.startswith("तर्क-ब्लॉक") or
            s.startswith("━━ आधार") or s.startswith("━━ OA-") or
            s.startswith("━━ पूर्व") or s.startswith("━━ तर्क"))

def escape(text):
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;"))

for line in lines:
    raw = line.rstrip("\n")
    stripped = raw.strip()

    if not stripped:
        story.append(Spacer(1, 4))
        continue

    if is_separator(stripped):
        story.append(HRFlowable(width="100%", thickness=0.5, color=(0.3,0.3,0.3), spaceAfter=2, spaceBefore=2))
        continue

    if stripped.startswith("✅") or stripped.startswith("DEFENCE REPLY") or stripped.startswith("स्रोत") or stripped.startswith("सत्यापन"):
        story.append(Paragraph(escape(stripped), header_style))
        continue

    if stripped.startswith("भाग-") and ":" in stripped:
        story.append(Paragraph(escape(stripped), section_style))
        continue

    if stripped.startswith("━━"):
        story.append(Paragraph(escape(stripped.replace("━━", "").strip()), section_style))
        continue

    if stripped.startswith("माननीय न्यायालय,") or stripped.startswith("अतः सोत्सव"):
        story.append(Paragraph(escape(stripped), body_style))
        continue

    if stripped.startswith("Q") and stripped[1:3].strip().isdigit():
        story.append(Paragraph(escape(stripped), mono_style))
        continue

    if stripped.startswith("[ ]") or stripped.startswith("[x]") or stripped.startswith("✓") or stripped.startswith("⚠"):
        story.append(Paragraph(escape(stripped), caution_style))
        continue

    if stripped.startswith("⚠") or "PENDING" in stripped and stripped.startswith("⚠"):
        story.append(Paragraph(escape(stripped), caution_style))
        continue

    if stripped.startswith("│") or stripped.startswith("├") or stripped.startswith("┌") or stripped.startswith("└") or stripped.startswith("┤"):
        story.append(Paragraph(escape(stripped), mono_style))
        continue

    if stripped.startswith('"') or stripped.startswith('"'):
        story.append(Paragraph(escape(stripped), mono_style))
        continue

    story.append(Paragraph(escape(stripped), body_style))

doc.build(story)
print(f"PDF generated: {PDF_FILE}")
