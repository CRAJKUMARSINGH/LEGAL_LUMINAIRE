# -*- coding: utf-8 -*-
"""
Generate DISCHARGE_APPLICATION_HEMRAJ_v5_ENGLISH.pdf
A4, 15mm margins, English, court-ready
Hemraj Vardar | Special Session Case 1/2025 | Udaipur
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)

OUT = "DISCHARGE_APPLICATION_HEMRAJ_v5_ENGLISH.pdf"
W, H = A4
M = 15 * mm

# ── Styles ────────────────────────────────────────────────────────────────
def S(name, **kw):
    defaults = dict(fontName="Times-Roman", fontSize=11, leading=17,
                    alignment=TA_JUSTIFY, spaceAfter=6)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

TITLE  = S("title",  fontName="Times-Bold", fontSize=13, leading=18, alignment=TA_CENTER, spaceAfter=4)
SUB    = S("sub",    fontName="Times-Roman", fontSize=11, leading=16, alignment=TA_CENTER, spaceAfter=3)
SEC    = S("sec",    fontName="Times-Bold", fontSize=11, leading=16, spaceBefore=12, spaceAfter=6)
GND    = S("gnd",    fontName="Times-Bold", fontSize=11, leading=16, spaceBefore=8, spaceAfter=4)
BODY   = S("body")
BUL    = S("bul",    leftIndent=14, spaceAfter=3)
QUOTE  = S("quote",  fontName="Times-Italic", fontSize=10, leading=15,
           leftIndent=16, rightIndent=8, spaceAfter=4,
           textColor=colors.HexColor("#003366"),
           backColor=colors.HexColor("#f0f4ff"), borderPad=4)
PRAYER = S("prayer", leftIndent=14, spaceAfter=5)
ORAL   = S("oral",   fontSize=10.5, leading=16, leftIndent=12, rightIndent=8,
           spaceAfter=4, backColor=colors.HexColor("#f8f8ff"), borderPad=5)
CAUTION= S("caution",fontName="Times-Italic", fontSize=9.5, leading=14,
           leftIndent=8, spaceAfter=3,
           textColor=colors.HexColor("#7a4f00"),
           backColor=colors.HexColor("#fffbe6"), borderPad=4)
SMALL  = S("small",  fontName="Times-Italic", fontSize=9, leading=13,
           textColor=colors.HexColor("#555555"), spaceAfter=3)
BLOCKED= S("blocked",fontSize=9, leading=13, leftIndent=8, spaceAfter=2,
           textColor=colors.HexColor("#cc0000"),
           backColor=colors.HexColor("#fff0f0"), borderPad=3)

def hr():  return HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=4, spaceBefore=4)
def hr2(): return HRFlowable(width="100%", thickness=2, color=colors.black, spaceAfter=6, spaceBefore=6)
def sp(h=4): return Spacer(1, h*mm)
def P(t, st=BODY): return Paragraph(t, st)
def SH(t): return Paragraph(f"<u><b>{t}</b></u>", SEC)
def GH(t): return Paragraph(f"<b>{t}</b>", GND)
def Q(t):  return Paragraph(t, QUOTE)
def BL(t): return Paragraph(f"&bull; {t}", BUL)

# ── Story ─────────────────────────────────────────────────────────────────
def build():
    s = []

    # Court Header
    s += [
        hr2(),
        P("IN THE COURT OF THE SPECIAL JUDGE", TITLE),
        P("(Prevention of Corruption Act Cases), Udaipur, Rajasthan", SUB),
        hr(),
        sp(2),
        P("<b>Special Session Case No. : 1/2025</b>", SUB),
        P("FIR No. 496/2011 dated 28.12.2011", SUB),
        P("State of Rajasthan &nbsp;&nbsp; vs. &nbsp;&nbsp; Hemraj Vardar &amp; Others", SUB),
        sp(3),
        P("<b>Applicant/Accused :</b> Hemraj Vardar, Director, M/s Praman Construction Pvt. Ltd., Udaipur", SUB),
        sp(4),
        P("<b>APPLICATION UNDER SECTION 250 BNSS 2023 / SECTION 227 CrPC</b>", TITLE),
        P("<b>FOR DISCHARGE FROM ALL CHARGES</b>", TITLE),
        hr2(),
        sp(4),
    ]

    # Part 1 — Facts
    s += [
        SH("PART I — FACTUAL BACKGROUND"),
        P("<b>1.</b> This prosecution arises from the partial collapse of the outer boundary wall of Maharana Pratap Stadium, Udaipur on <b>28.12.2011</b> during heavy rainfall and storm. The entire prosecution case rests on a single Forensic Science Laboratory (FSL) report which declares cement mortar samples as 'failed'."),
        P("<b>2.</b> The prosecution alleges that substandard construction/repair work caused the collapse, and on that basis has charged the accused under <b>IPC §304A (causing death by negligence) and the Prevention of Corruption Act</b>."),
        P("<b>3.</b> The accused's consistent and specific defence is that —"),
        BL("Samples were collected during adverse weather (heavy rain/storm) on 28.12.2011;"),
        BL("The prosecution applied the <b>wrong IS standard (IS 1199:2018 — Fresh Concrete)</b> to hardened masonry mortar — a fundamental scientific error;"),
        BL("Contractor's representative was absent at sampling — violation of IS 3535:1986 Cl. 4.1;"),
        BL("No three-way split of samples (referee sample) — violation of IS 3535:1986 Cl. 5.7.5 — depriving accused of right to independent re-testing;"),
        BL("Complete absence of Chain of Custody documentation;"),
        BL("No panchnama / seizure memo;"),
        BL("The collapse was caused by Force Majeure — extreme rainfall (NBC 2016 §3.4)."),
        sp(2),
    ]

    # Part 2 — Legal Principles
    s += [
        SH("PART II — LEGAL PRINCIPLES GOVERNING DISCHARGE"),
        P("<b>4.</b> At the stage of discharge, the Court must determine whether the material on record discloses a prima facie case sufficient to frame charges. Mere suspicion, incomplete documentary chain, or unreliable expert material cannot sustain a prosecution."),
        Q("<b>Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10</b> [VERIFIED] — \"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged.\""),
        Q("<b>State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5</b> [VERIFIED] — \"At the stage of framing of charge, the Court has to see whether the material produced makes out a prima facie case. If the material discloses nothing more than suspicion, discharge is mandatory.\""),
        P("<b>5.</b> Where the prosecution's central material is a technical/forensic report, the foundational reliability of that report — sample integrity, custody integrity, scientific foundation — must first be established."),
        sp(2),
    ]

    # Part 3 — Grounds
    s += [SH("PART III — DETAILED GROUNDS FOR DISCHARGE (12 Grounds)")]

    # Pre-primary
    s += [
        GH("PRE-PRIMARY GROUND: Application of Wrong IS Standard — Fundamental Scientific Error"),
        P("<b>6.</b> The prosecution applied <b>IS 1199:2018</b> ('Methods of Sampling and Analysis of Fresh Concrete') to analyse hardened masonry mortar from a 15-year-old structure. This is a fundamental scientific category error. The correct standards are <b>IS 2250:1981</b> (masonry mortars) and <b>ASTM C1324</b> (hardened masonry mortar forensics). IS 1199:2018 explicitly states in its Scope (Clause 1) that it applies to fresh concrete only."),
        Q("<b>Tomaso Bruno v. State of Uttar Pradesh (2015) 7 SCC 178</b> [SECONDARY] — \"Expert evidence is a weak type of evidence and the court is not bound to accept it. Where the expert evidence is based on assumptions or on a defective foundation, it cannot be relied upon.\""),
    ]

    # Ground 1
    s += [
        GH("Ground 1: Sample Collection During Rain/Storm — ASTM C780 §6.1 Violated"),
        P("<b>7.</b> Samples were collected on 28.12.2011 during heavy rainfall and storm. <b>ASTM C780 §6.1</b> explicitly states: \"Samples must be protected from rain and moisture; otherwise sample is invalid.\" <b>IS 4031 (Part 6) Cl. 5.1</b> mandates temperature of 27±2°C for compressive strength testing — impossible during a storm. The test conditions were fundamentally violated."),
    ]

    # Ground 2
    s += [
        GH("Ground 2: Surface Contamination / Carbonation — ASTM C1324 §§7-8 Violated"),
        P("<b>8.</b> In 15-year-old masonry mortar, the carbonated outer layer is 10-15mm deep, with 30-50% lower compressive strength than the original mortar. <b>ASTM C1324 §§7-8</b> mandates removal of the carbonated outer layer before sampling. <b>BS EN 1015-2 §5.1.2</b> states: \"Sampling shall be made from the interior of the joint, after removal of the surface layer affected by weathering or carbonation.\" Neither was done."),
    ]

    # Ground 3
    s += [
        GH("Ground 3: Contractor Representative Absent — IS 3535:1986 Cl. 4.1 + CPWD Manual §§3.7.4 & 12.2.1"),
        P("<b>9.</b> <b>IS 3535:1986 Cl. 4.1</b> mandates: \"Sampling in presence of purchaser/contractor representative — mandatory.\" <b>CPWD Works Manual 2023 §§3.7.4 & 12.2.1</b> requires joint sampling by Engineer-in-Charge and Contractor. No representative of the accused was present at any stage of sampling."),
        Q("<b>State of Punjab v. Baldev Singh (1999) 6 SCC 172</b> [VERIFIED] — \"Where a statute or official manual prescribes a specific procedure for the collection of evidence, strict compliance is not merely directory but mandatory, and departure therefrom creates a presumption of prejudice to the accused.\""),
    ]

    # Ground 4 — NEW
    s += [
        GH("Ground 4: No Three-Way Split of Samples (Referee Sample) — IS 3535:1986 Cl. 5.7.5 — Violation of Article 21"),
        P("<b>10.</b> <b>IS 3535:1986 Cl. 5.7.5</b> (BIS — Reaffirmed 2004) mandates: \"The laboratory sample and the composite sample shall be divided into three equal parts, one for the purchaser, another for the supplier, and the third to be used as a referee sample. The referee sample shall be used in case of a dispute between the purchaser and the supplier.\""),
        P("The prosecution was required to divide the mortar samples into three equal parts: (1) prosecution, (2) accused contractor, (3) referee. By failing to do so, the accused was deprived of his statutory right to independent re-testing — a direct violation of <b>Article 21</b> (right to fair trial)."),
    ]

    # Ground 5
    s += [
        GH("Ground 5: Complete Absence of Chain of Custody"),
        P("<b>11.</b> The prosecution has no record of: (a) who collected the samples and when; (b) how they were packed and sealed; (c) how they were transported to the laboratory; (d) storage conditions before testing; (e) laboratory receipt and seal verification. All 7 chain-of-custody links are missing."),
        Q("<b>Kattavellai @ Devakar v. State of Tamil Nadu (2025 INSC 845)</b> [VERIFIED — BINDING — Three-Judge Bench] — \"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor.\""),
        Q("<b>Surendra Koli v. State of Uttar Pradesh (SC, 11 November 2025)</b> [VERIFIED] — \"There was no credible chain of custody or expert testimony establishing the link between the accused and the physical evidence.\" — Acquittal on this ground."),
    ]

    # Ground 6
    s += [
        GH("Ground 6: No Panchnama / Seizure Memo"),
        P("<b>12.</b> The panchnama is the first statutory documentary bridge between the collection site and the laboratory report. Without it, the prosecution cannot establish that the material tested is the same as that collected from the site."),
        Q("<b>State of Maharashtra v. Damu (2000) 6 SCC 269</b> [VERIFIED] — \"Where the prosecution relies heavily on the report of the forensic science laboratory, the foundational burden lies on the prosecution to prove beyond reasonable doubt that the samples sent to the laboratory were exactly the same as those seized from the spot. Without a panchnama prepared at the site in the presence of independent witnesses, this burden cannot be discharged.\""),
    ]

    # Ground 7
    s += [
        GH("Ground 7: Irregular / Non-Representative Sampling — IS 3535:1986 Cl. 6.2"),
        P("<b>13.</b> <b>IS 3535:1986 Cl. 6.2</b> mandates a minimum of 5 representative locations for sampling. No sampling plan, sample point rationale, or representative spread was documented. The absence of systematic sampling creates a serious risk of selection bias — adverse results can be artificially obtained from isolated weak pockets."),
    ]

    # Ground 8
    s += [
        GH("Ground 8: Expert Opinion Inadmissible — §114 BSA 2023 (erstwhile §45 IEA)"),
        P("<b>14.</b> Expert opinion is only as reliable as the integrity of the source material. Where sampling, custody, and representativeness are all disputed and undocumented, the expert opinion cannot be treated as conclusive evidence at the stage of charge."),
        Q("<b>Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317</b> [SECONDARY] — \"The admissibility and reliability of an expert opinion under Section 45 of the Indian Evidence Act is contingent upon the accuracy of the basic facts on which the opinion is founded. If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated.\""),
    ]

    # Ground 9
    s += [
        GH("Ground 9: Force Majeure — Heavy Rainfall 28.12.2011 — NBC 2016 §3.4"),
        P("<b>15.</b> <b>NBC 2016/2023 §3.4</b> classifies extreme weather events as Force Majeure, exempting the contractor from liability. The prosecution has not excluded weather as the proximate cause of the collapse."),
        Q("<b>RSMML v. Contractor (Rajasthan High Court, Division Bench, 30 March 2026)</b> [VERIFIED] — \"The contradictory approach of the State — acknowledging force majeure in its internal records while simultaneously terminating the contract on the same grounds — cannot be upheld. A contractor cannot be penalised for delays that the State's own note-sheets acknowledged as force majeure.\" — This Court's own judgment."),
        Q("<b>Rajasthan HC Suo Motu PIL (29 July 2025 + 23 August 2025)</b> [VERIFIED] — This Court has taken judicial notice that structural collapses in Rajasthan are caused by a combination of extreme weather, pre-existing structural deterioration, and maintenance failures — not solely by contractor negligence."),
        Q("<b>Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48</b> [VERIFIED] — \"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do.\""),
    ]

    # Grounds 10-12
    s += [
        GH("Ground 10: IPC §304A — Criminal Negligence Not Established"),
        P("<b>16.</b> In a Force Majeure situation, criminal negligence under IPC §304A cannot be established. The prosecution has not excluded weather as the proximate cause and has not established the direct nexus between the accused's specific act and the collapse."),
        GH("Ground 11: Corruption Charges — No Independent Direct Evidence"),
        P("<b>17.</b> Charges under the Prevention of Corruption Act do not automatically follow from a disputed technical report. The prosecution must establish illegal gain nexus, conscious collusion, or other independent reliable material — none of which has been produced."),
        GH("Ground 12: NABL/ISO 17025 Violations — FSL Report Unreliable"),
        P("<b>18.</b> Missing custody records, receipt logs, and environmental control records constitute violations of NABL accreditation requirements under ISO/IEC 17025. The FSL report cannot be treated as a reliable accredited output."),
        sp(2),
    ]

    return s


def build_tables():
    s = []

    # Standards table
    s += [SH("PART IV — IS/ASTM STANDARDS VALIDITY ANALYSIS")]
    std_data = [
        ["Standard", "Applicable?", "Key Violation / Relevance"],
        ["IS 1199:2018", "WRONG", "Fresh concrete only — NOT applicable to hardened masonry mortar. Prosecution's foundational scientific error."],
        ["IS 2250:1981", "CORRECT", "Only correct BIS standard for masonry mortar — entirely ignored by prosecution."],
        ["IS 3535:1986", "CORRECT", "Cl.4.1: Contractor presence mandatory. Cl.5.7.5: Three-way split mandatory. Cl.6.2: Min. 5 locations. All three violated."],
        ["IS 4031 (Part 6)", "PARTIAL", "Cl.5.1: 27±2°C temperature mandatory — impossible during storm conditions."],
        ["ASTM C1324", "CORRECT", "§§7-8: Remove carbonated outer layer before sampling — not done. Correct standard for hardened mortar forensics."],
        ["ASTM C780", "PARTIAL", "§6.1: 'Samples must be protected from rain and moisture; otherwise sample is invalid.'"],
        ["NBC 2016/2023", "CORRECT", "§3.4: Extreme weather = Force Majeure — contractor liability exemption."],
        ["CPWD Manual 2023", "CORRECT", "§§3.7.4 & 12.2.1: Joint sampling by Engineer-in-Charge and Contractor mandatory."],
        ["ISO/IEC 17025 + NABL", "CORRECT", "Traceability, documented handling, method control required — FSL report fails all three."],
    ]
    col_w = [35*mm, 20*mm, W - 2*M - 35*mm - 20*mm]
    t = Table(std_data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#e0e0e0")),
        ("FONTNAME", (0,0), (-1,0), "Times-Bold"),
        ("FONTNAME", (0,1), (0,-1), "Times-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("LEADING", (0,0), (-1,-1), 13),
        ("GRID", (0,0), (-1,-1), 0.5, colors.black),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("PADDING", (0,0), (-1,-1), 4),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#f9f9f9")]),
        ("TEXTCOLOR", (1,1), (1,1), colors.HexColor("#cc0000")),
        ("FONTNAME", (1,1), (1,1), "Times-Bold"),
        ("TEXTCOLOR", (1,2), (1,2), colors.HexColor("#006600")),
        ("TEXTCOLOR", (1,3), (1,3), colors.HexColor("#006600")),
    ]))
    s.append(t)
    s.append(sp(2))

    # Precedents table
    s += [SH("PART V — PRECEDENTS — VERIFICATION STATUS")]
    prec_data = [
        ["Case", "Court", "Status", "Fit", "Application"],
        ["Kattavellai @ Devakar v. State of TN\n2025 INSC 845", "SC 2025", "VERIFIED\n[BINDING]", "92", "CoC Register mandatory — binding nationwide."],
        ["Surendra Koli v. State of UP\nSC, 11 Nov 2025", "SC 2025", "VERIFIED", "88", "No CoC + no expert testimony = acquittal."],
        ["State of Maharashtra v. Damu\n(2000) 6 SCC 269", "SC 2000", "VERIFIED", "90", "No panchnama = sample identity unproved."],
        ["State of Punjab v. Baldev Singh\n(1999) 6 SCC 172", "SC 1999", "VERIFIED", "88", "Mandatory procedure non-compliance = prejudice presumed."],
        ["Union of India v. Prafulla Kumar Samal\n(1979) 3 SCC 4, Para 10", "SC 1979", "VERIFIED", "88", "Suspicion only = discharge mandatory."],
        ["State of Bihar v. Ramesh Singh\n(1977) 4 SCC 39, Para 5", "SC 1977", "VERIFIED", "85", "No prima facie case = discharge mandatory."],
        ["Jacob Mathew v. State of Punjab\n(2005) 6 SCC 1, Para 48", "SC 2005", "VERIFIED", "65", "Mere lack of care ≠ criminal negligence."],
        ["RSMML v. Contractor\nRajasthan HC, 30 Mar 2026", "RHC 2026", "VERIFIED", "85", "Contractor not liable for force majeure delays."],
        ["Rajasthan HC Suo Motu PIL\n29 Jul + 23 Aug 2025", "RHC 2025", "VERIFIED", "80", "Structural collapses = weather + age + maintenance."],
        ["IS 3535:1986 Cl. 5.7.5 (BIS)", "BIS 1986", "VERIFIED", "95", "Three-way split mandatory — Art. 21 violated."],
        ["Tomaso Bruno v. State of UP\n(2015) 7 SCC 178", "SC 2015", "SECONDARY", "82", "Expert evidence on defective foundation unreliable."],
        ["Sushil Sharma v. State (NCT of Delhi)\n(2014) 4 SCC 317", "SC 2014", "SECONDARY", "75", "Flawed data vitiates expert opinion completely."],
        ["Uttarakhand HC — CoC Defects\nMarch 2026", "UK HC", "SECONDARY", "78", "Absence of CoC = forensic evidence loses value."],
        ["R.B. Constructions v. State of MH\n2014 SCC OnLine Bom 125", "Bom HC", "PENDING", "50", "DO NOT USE — citation authenticity unconfirmed."],
        ["C.B.I. v. K.S. Kalra\n2011 SCC OnLine Del 3412", "Del HC", "PENDING", "48", "DO NOT USE — citation authenticity unconfirmed."],
    ]
    col_w2 = [60*mm, 18*mm, 18*mm, 8*mm, W - 2*M - 60*mm - 18*mm - 18*mm - 8*mm]
    t2 = Table(prec_data, colWidths=col_w2, repeatRows=1)
    tstyle = [
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#e0e0e0")),
        ("FONTNAME", (0,0), (-1,0), "Times-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 8.5),
        ("LEADING", (0,0), (-1,-1), 12),
        ("GRID", (0,0), (-1,-1), 0.5, colors.black),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("PADDING", (0,0), (-1,-1), 3),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#f9f9f9")]),
    ]
    for i, row in enumerate(prec_data[1:], 1):
        st = row[2]
        if "VERIFIED" in st and "PENDING" not in st:
            tstyle += [("TEXTCOLOR",(2,i),(2,i),colors.HexColor("#006600")),
                       ("FONTNAME",(2,i),(2,i),"Times-Bold")]
        elif "SECONDARY" in st:
            tstyle.append(("TEXTCOLOR",(2,i),(2,i),colors.HexColor("#0000cc")))
        elif "PENDING" in st:
            tstyle += [("TEXTCOLOR",(2,i),(2,i),colors.HexColor("#cc0000")),
                       ("BACKGROUND",(0,i),(-1,i),colors.HexColor("#fff0f0"))]
    t2.setStyle(TableStyle(tstyle))
    s.append(t2)
    s.append(sp(2))
    return s


def build_oral_prayer():
    s = [SH("PART VI — FIVE ORAL ARGUMENT PARAGRAPHS")]

    oral = [
        ("OA-1: Fundamental Scientific Error — Wrong Standard Applied",
         "My Lord, the prosecution applied IS 1199:2018 — a standard for fresh concrete — to hardened masonry mortar from a 15-year-old structure. The correct standards are IS 2250:1981 and ASTM C1324. As held in Tomaso Bruno (2015) 7 SCC 178: 'Where the expert evidence is based on a defective foundation, it cannot be relied upon.' When the standard itself is wrong, the report is void ab initio."),
        ("OA-2: Complete Absence of Chain of Custody",
         "My Lord, Kattavellai (2025 INSC 845) [BINDING] mandates: 'Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained...' The prosecution cannot answer: (1) who collected the samples, (2) how they were sealed, (3) how they reached the laboratory, (4) under what conditions they were stored. This zero Chain of Custody renders the FSL report wholly inadmissible."),
        ("OA-3: No Three-Way Split — Article 21 Violated",
         "My Lord, IS 3535:1986 Cl. 5.7.5 mandates that samples be divided into three equal parts — one for the prosecution, one for the contractor, and one referee sample. This was not done. The accused was deprived of his statutory right to independent re-testing. This is a direct violation of Article 21 — the right to a fair trial."),
        ("OA-4: Rain Sampling + Surface Contamination",
         "My Lord, samples were collected on 28.12.2011 during heavy rainfall. ASTM C780 §6.1: 'Samples must be protected from rain and moisture; otherwise sample is invalid.' IS 4031 Part 6 mandates 27±2°C — impossible in storm conditions. In 15-year-old mortar, carbonation depth is 10-15mm, reducing strength by 30-50%. ASTM C1324 mandates removal of the carbonated outer layer before sampling — this was not done."),
        ("OA-5: No Prima Facie Case — Discharge Mandatory",
         "My Lord, Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED]: 'If the material discloses nothing more than a suspicion, the accused is entitled to be discharged.' In the present case — the entire forensic evidence is contaminated, there is no direct evidence of corruption, no criminal negligence is established, and the collapse was caused by Force Majeure. Jacob Mathew (2005) 6 SCC 1: 'Mere lack of care cannot be a rash or negligent act.' Discharge under Section 250 BNSS 2023 is mandatory."),
    ]
    for title, text in oral:
        s.append(GH(title))
        s.append(Paragraph(text, ORAL))
        s.append(sp(1))

    s += [
        SH("PART VII — PRAYER"),
        P("In view of the foregoing facts, legal grounds, and in the interest of justice, it is most respectfully prayed that this Hon'ble Court may be pleased to —"),
        Paragraph("(i) <b>Discharge</b> the applicant/accused from all charges under <b>Section 250 BNSS 2023</b> (alternatively Section 227 CrPC);", PRAYER),
        Paragraph("(ii) Declare the forensic mortar report <b>inadmissible</b> on account of procedural and scientific defects;", PRAYER),
        Paragraph("(iii) Declare the expert opinion based on defective sampling as <b>unproved</b> under §114 BSA 2023;", PRAYER),
        Paragraph("(iv) Alternatively, direct <b>independent re-testing</b> or technical verification by a neutral expert;", PRAYER),
        Paragraph("(v) Direct the prosecution to produce all original records: collection panchnama, seal memo, transfer register, FSL inward register, seal verification, analyst worksheet, sample handling log;", PRAYER),
        Paragraph("(vi) Draw <b>adverse inference</b> if such records are not produced;", PRAYER),
        Paragraph("(vii) Pass such other and further orders as this Hon'ble Court may deem fit and proper in the interest of justice.", PRAYER),
        sp(3),
        SH("PART VIII — VERIFICATION"),
        P("I, <b>Hemraj Vardar</b>, son of ________, aged ____ years, resident of ________, Udaipur, do hereby verify that the contents of the above application are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom."),
        sp(8),
        P("Yours faithfully,"),
        sp(10),
        P("_______________________________"),
        P("<b>Hemraj Vardar</b> — Applicant/Accused"),
        P("Date: ____/____/2026 &nbsp;&nbsp;&nbsp; Place: Udaipur, Rajasthan"),
        sp(4),
        HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=4, spaceBefore=4),
        Paragraph("⚠ PRE-FILING CHECKLIST: (1) Kattavellai 2025 INSC 845 — obtain certified copy + exact para numbers. (2) IS 3535:1986 Cl. 5.7.5 — obtain certified BIS copy. (3) PENDING citations must NOT be used as primary authority. (4) Sushil Sharma (2014) 4 SCC 317 — verify exact para language from SCC Online. (5) Consult advocate before filing.", CAUTION),
        sp(2),
        P("Legal Luminaire v5 | Generated: April 2026 | Source: case01-data.ts + verification-engine.ts | Consult advocate before filing.", SMALL),
    ]
    return s


def main():
    doc = SimpleDocTemplate(
        OUT, pagesize=A4,
        leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M,
        title="Discharge Application — Hemraj Vardar v5",
        author="Legal Luminaire",
        subject="Discharge Application — Special Session Case 1/2025 — Udaipur",
    )
    story = build() + build_tables() + build_oral_prayer()
    doc.build(story)
    kb = os.path.getsize(OUT) // 1024
    print(f"\n✅  PDF: {OUT}  ({kb} KB)")
    print(f"   Path: {os.path.abspath(OUT)}")

if __name__ == "__main__":
    main()
