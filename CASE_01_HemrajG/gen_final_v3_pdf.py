#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import os

SRC = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_RHC_FINAL_v3.lex")
OUT = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_RHC_FINAL_v3.pdf")

with open(SRC, encoding="utf-8") as f:
    lines = [l.rstrip("\n") for l in f.readlines()]

doc = SimpleDocTemplate(OUT, pagesize=A4,
    rightMargin=2.8*cm, leftMargin=2.8*cm, topMargin=2.8*cm, bottomMargin=2.8*cm,
    title="Written Submission RHC Final v3 — Hemraj Vardar",
    author="Legal Luminaire")

def e(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

court = ParagraphStyle("C", fontName="Helvetica-Bold",    fontSize=10, leading=15, alignment=TA_CENTER, spaceAfter=3)
hdg   = ParagraphStyle("H", fontName="Helvetica-Bold",    fontSize=9,  leading=13, alignment=TA_LEFT,   spaceBefore=8, spaceAfter=4)
body  = ParagraphStyle("B", fontName="Helvetica",         fontSize=9,  leading=15, alignment=TA_JUSTIFY,spaceBefore=0, spaceAfter=5, firstLineIndent=18)
quote = ParagraphStyle("Q", fontName="Helvetica-Oblique", fontSize=8.5,leading=13, alignment=TA_JUSTIFY,leftIndent=22, rightIndent=10, spaceBefore=4, spaceAfter=4)
mono  = ParagraphStyle("M", fontName="Courier",           fontSize=7.5,leading=11, alignment=TA_LEFT,   leftIndent=8,  spaceBefore=1, spaceAfter=1)
warn  = ParagraphStyle("W", fontName="Helvetica-Oblique", fontSize=7.5,leading=11, textColor=(0.5,0,0), leftIndent=8)
chk   = ParagraphStyle("K", fontName="Courier",           fontSize=8,  leading=12, alignment=TA_LEFT,   leftIndent=8,  spaceBefore=1, spaceAfter=1)

story = []
for raw in lines:
    s = raw.strip()
    if not s:
        story.append(Spacer(1, 4)); continue
    if s.startswith("━") or s.startswith("─"):
        story.append(HRFlowable(width="100%", thickness=0.6, spaceAfter=2, spaceBefore=2)); continue
    # Table lines
    if s.startswith("│") or s.startswith("├") or s.startswith("┌") or s.startswith("└") or s.startswith("┤"):
        story.append(Paragraph(e(s), mono)); continue
    # Court heading
    if ("HIGH COURT" in s or "CRIMINAL MISC" in s or "IN THE MATTER" in s
            or "WRITTEN SUBMISSION" in s and "BEHALF" in s
            or s.startswith("Hemraj Vardar") or s.startswith("State of Rajasthan")):
        story.append(Paragraph(e(s), court)); continue
    # Section headings
    if (s[:4] in ("I.  ", "II. ", "III.", "IV. ", "V.  ", "VI. ", "VII.", "VIII", "IX. ", "X.  ")
            or s.startswith("PRAYER") or s.startswith("PRECEDENTS")
            or s.startswith("STANDARDS RELIED") or s.startswith("PRE-FILING")):
        story.append(Paragraph(e(s), hdg)); continue
    # Quoted holdings
    if s.startswith('"') or s.startswith('\u201c'):
        story.append(Paragraph(e(s), quote)); continue
    # Checklist
    if s.startswith("[ ]"):
        story.append(Paragraph(e(s), chk)); continue
    # Warning / doc footer
    if s.startswith("⚠") or s.startswith("Document:"):
        story.append(Paragraph(e(s), warn)); continue
    # Numbered precedent list
    if len(s) > 2 and s[0].isdigit() and s[1] in ". ":
        story.append(Paragraph(e(s), body)); continue
    story.append(Paragraph(e(s), body))

doc.build(story)
print(f"PDF: {OUT}")
