#!/usr/bin/env python3
"""Generate PDF for WRITTEN_SUBMISSION_HC_WRIT.lex"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

LEX = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_HC_WRIT.lex")
PDF = os.path.join(os.path.dirname(__file__), "WRITTEN_SUBMISSION_HC_WRIT.pdf")

with open(LEX, encoding="utf-8") as f:
    lines = f.readlines()

doc = SimpleDocTemplate(PDF, pagesize=A4,
    rightMargin=2.5*cm, leftMargin=2.5*cm,
    topMargin=2.5*cm, bottomMargin=2.5*cm,
    title="Written Submission — Rajasthan HC — Hemraj Vardar",
    author="Legal Luminaire")

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

hdr  = ParagraphStyle("H", fontName="Helvetica-Bold", fontSize=10, leading=14, alignment=TA_CENTER, spaceAfter=3)
sub  = ParagraphStyle("S", fontName="Helvetica-Bold", fontSize=9,  leading=13, alignment=TA_LEFT,   spaceBefore=6, spaceAfter=3)
body = ParagraphStyle("B", fontName="Helvetica",      fontSize=8.5,leading=13, alignment=TA_JUSTIFY, spaceBefore=2, spaceAfter=2)
mono = ParagraphStyle("M", fontName="Courier",        fontSize=7.5,leading=11, alignment=TA_LEFT,   leftIndent=10, spaceBefore=1, spaceAfter=1)
note = ParagraphStyle("N", fontName="Helvetica-Oblique", fontSize=7.5, leading=11, textColor=(0.5,0,0), leftIndent=10)

story = []
for line in lines:
    raw = line.rstrip("\n")
    s = raw.strip()
    if not s: story.append(Spacer(1,4)); continue
    if s.startswith("━") or s.startswith("─"): story.append(HRFlowable(width="100%",thickness=0.5,spaceAfter=2,spaceBefore=2)); continue
    if s.startswith("✅") or "WRITTEN SUBMISSION" in s and s.startswith("✅"): story.append(Paragraph(esc(s), hdr)); continue
    if s.startswith("IN THE HIGH COURT") or s.startswith("CRIMINAL MISC") or s.startswith("IN THE MATTER"): story.append(Paragraph(esc(s), hdr)); continue
    if s.startswith("SUBMISSION ") or s.startswith("PART "): story.append(Paragraph(esc(s), sub)); continue
    if s.startswith("│") or s.startswith("├") or s.startswith("┌") or s.startswith("└") or s.startswith("┤"): story.append(Paragraph(esc(s), mono)); continue
    if s.startswith("⚠"): story.append(Paragraph(esc(s), note)); continue
    if s.startswith('"') or (s.startswith('"') and s.endswith('"')): story.append(Paragraph(esc(s), mono)); continue
    story.append(Paragraph(esc(s), body))

doc.build(story)
print(f"PDF: {PDF}")
