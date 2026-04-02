#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import os

SRC = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_RHC_PARA_v2.lex")
OUT = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_RHC_PARA_v2.pdf")

with open(SRC, encoding="utf-8") as f:
    lines = f.readlines()

doc = SimpleDocTemplate(OUT, pagesize=A4,
    rightMargin=3*cm, leftMargin=3*cm, topMargin=3*cm, bottomMargin=3*cm,
    title="Written Submission — Rajasthan HC — Stadium Wall Collapse",
    author="Legal Luminaire")

def e(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

court  = ParagraphStyle("C", fontName="Helvetica-Bold",    fontSize=10, leading=15, alignment=TA_CENTER, spaceAfter=4)
title  = ParagraphStyle("T", fontName="Helvetica-Bold",    fontSize=9,  leading=14, alignment=TA_CENTER, spaceAfter=3)
hdg    = ParagraphStyle("H", fontName="Helvetica-Bold",    fontSize=9,  leading=13, alignment=TA_LEFT,   spaceBefore=8, spaceAfter=4)
body   = ParagraphStyle("B", fontName="Helvetica",         fontSize=9,  leading=15, alignment=TA_JUSTIFY,spaceBefore=0, spaceAfter=6, firstLineIndent=18)
cite   = ParagraphStyle("Q", fontName="Helvetica-Oblique", fontSize=8.5,leading=13, alignment=TA_JUSTIFY,leftIndent=20, rightIndent=10, spaceBefore=4, spaceAfter=4)
note   = ParagraphStyle("N", fontName="Courier",           fontSize=7.5,leading=11, alignment=TA_LEFT,   leftIndent=10, spaceBefore=1, spaceAfter=1)
warn   = ParagraphStyle("W", fontName="Helvetica-Oblique", fontSize=7.5,leading=11, textColor=(0.55,0,0),leftIndent=10)

story = []
i = 0
lines_list = [l.rstrip("\n") for l in lines]

while i < len(lines_list):
    raw = lines_list[i]
    s = raw.strip()
    i += 1

    if not s:
        story.append(Spacer(1, 5))
        continue

    if s.startswith("━") or s.startswith("─"):
        story.append(HRFlowable(width="100%", thickness=0.6, spaceAfter=3, spaceBefore=3))
        continue

    # Court heading lines
    if ("HIGH COURT" in s or "CRIMINAL MISC" in s or "IN THE MATTER" in s
            or s.startswith("Hemraj Vardar") or s.startswith("State of Rajasthan")
            or "WRITTEN SUBMISSION" in s and "BEHALF" in s):
        story.append(Paragraph(e(s), court))
        continue

    # Section headings (Roman numerals)
    if (s[:3] in ("I. ", "II.", "III", "IV.", "V. ", "VI.", "VII") and "SUBMISSION" in s.upper()
            or s.startswith("PRAYER") or s.startswith("PRECEDENTS RELIED")
            or s.startswith("⚠ PRE-FILING")):
        story.append(Paragraph(e(s), hdg))
        continue

    # Quoted holdings (lines starting with " or containing "Right from" etc.)
    if s.startswith('"') or s.startswith('\u201c'):
        story.append(Paragraph(e(s), cite))
        continue

    # Checklist / numbered precedent list
    if s.startswith("[ ]") or (len(s) > 2 and s[0].isdigit() and s[1] in ".  "):
        story.append(Paragraph(e(s), note))
        continue

    if s.startswith("⚠") or s.startswith("Document:"):
        story.append(Paragraph(e(s), warn))
        continue

    # Everything else is body paragraph
    story.append(Paragraph(e(s), body))

doc.build(story)
print(f"PDF: {OUT}")
