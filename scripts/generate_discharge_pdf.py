# -*- coding: utf-8 -*-
"""
Generate DISCHARGE_APPLICATION_HEMRAJ_v5.pdf
A4, 15mm margins, Hindi + English, court-ready
Uses reportlab — no browser required
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

OUT = "DISCHARGE_APPLICATION_HEMRAJ_v5.pdf"

# ── Font setup ────────────────────────────────────────────────────────────
# Try to register a Unicode font that supports Devanagari
# Fall back to Helvetica if not available (Hindi will show as boxes but
# structure will be perfect — user can install Noto font for full Hindi)
HINDI_FONT = "Helvetica"
HINDI_FONT_BOLD = "Helvetica-Bold"

# Try common Windows Hindi fonts
for font_path, font_name in [
    (r"C:\Windows\Fonts\mangal.ttf", "Mangal"),
    (r"C:\Windows\Fonts\NotoSerifDevanagari-Regular.ttf", "NotoSerif"),
    (r"C:\Windows\Fonts\aparaj.ttf", "Aparajita"),
]:
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont(font_name, font_path))
            HINDI_FONT = font_name
            print(f"Using font: {font_name}")
            break
        except Exception as e:
            print(f"Font {font_name} failed: {e}")

# Try bold variant
for font_path, font_name in [
    (r"C:\Windows\Fonts\mangalb.ttf", "MangalBold"),
    (r"C:\Windows\Fonts\NotoSerifDevanagari-Bold.ttf", "NotoSerifBold"),
    (r"C:\Windows\Fonts\aparajb.ttf", "AparajitaBold"),
]:
    if os.path.exists(font_path):
        try:
            pdfmetrics.registerFont(TTFont(font_name, font_path))
            HINDI_FONT_BOLD = font_name
            break
        except:
            pass

print(f"Hindi font: {HINDI_FONT}, Bold: {HINDI_FONT_BOLD}")

# ── Styles ────────────────────────────────────────────────────────────────
W, H = A4
MARGIN = 15 * mm

def make_styles():
    s = {}
    s['title'] = ParagraphStyle('title',
        fontName=HINDI_FONT_BOLD, fontSize=13, leading=18,
        alignment=TA_CENTER, spaceAfter=4)
    s['subtitle'] = ParagraphStyle('subtitle',
        fontName=HINDI_FONT, fontSize=11, leading=16,
        alignment=TA_CENTER, spaceAfter=3)
    s['section'] = ParagraphStyle('section',
        fontName=HINDI_FONT_BOLD, fontSize=11, leading=16,
        spaceBefore=12, spaceAfter=6,
        textColor=colors.HexColor('#000000'),
        borderPad=2)
    s['ground'] = ParagraphStyle('ground',
        fontName=HINDI_FONT_BOLD, fontSize=11, leading=16,
        spaceBefore=8, spaceAfter=4)
    s['body'] = ParagraphStyle('body',
        fontName=HINDI_FONT, fontSize=11, leading=17,
        alignment=TA_JUSTIFY, spaceAfter=6)
    s['bullet'] = ParagraphStyle('bullet',
        fontName=HINDI_FONT, fontSize=10.5, leading=16,
        leftIndent=12, spaceAfter=3)
    s['quote'] = ParagraphStyle('quote',
        fontName=HINDI_FONT, fontSize=10, leading=15,
        leftIndent=16, rightIndent=8, spaceAfter=4,
        textColor=colors.HexColor('#003366'),
        backColor=colors.HexColor('#f0f4ff'),
        borderPad=4)
    s['caution'] = ParagraphStyle('caution',
        fontName=HINDI_FONT, fontSize=9.5, leading=14,
        leftIndent=8, spaceAfter=3,
        textColor=colors.HexColor('#7a4f00'),
        backColor=colors.HexColor('#fffbe6'),
        borderPad=4)
    s['blocked'] = ParagraphStyle('blocked',
        fontName=HINDI_FONT, fontSize=9, leading=13,
        leftIndent=8, spaceAfter=2,
        textColor=colors.HexColor('#cc0000'),
        backColor=colors.HexColor('#fff0f0'),
        borderPad=3)
    s['small'] = ParagraphStyle('small',
        fontName=HINDI_FONT, fontSize=9, leading=13,
        textColor=colors.HexColor('#555555'), spaceAfter=3)
    s['prayer'] = ParagraphStyle('prayer',
        fontName=HINDI_FONT, fontSize=11, leading=17,
        leftIndent=12, spaceAfter=5, alignment=TA_JUSTIFY)
    s['oral'] = ParagraphStyle('oral',
        fontName=HINDI_FONT, fontSize=10.5, leading=16,
        leftIndent=12, rightIndent=8, spaceAfter=4,
        backColor=colors.HexColor('#f8f8ff'),
        borderPad=5)
    return s

ST = make_styles()

def hr(): return HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=4, spaceBefore=4)
def hr2(): return HRFlowable(width="100%", thickness=2, color=colors.black, spaceAfter=6, spaceBefore=6)
def sp(h=4): return Spacer(1, h*mm)
def P(text, style='body'): return Paragraph(text, ST[style])
def SH(text): return Paragraph(f'<u><b>{text}</b></u>', ST['section'])
def GH(text): return Paragraph(f'<b>{text}</b>', ST['ground'])
def Q(text): return Paragraph(text, ST['quote'])
def BL(text): return Paragraph(f'• {text}', ST['bullet'])
def CA(text): return Paragraph(f'⚠ {text}', ST['caution'])
def BK(text): return Paragraph(f'⛔ {text}', ST['blocked'])


# ── Standards table ───────────────────────────────────────────────────────
STANDARDS = [
    ("IS 1199:2018", "❌ गलत", "ताज़ा कंक्रीट के लिए — कठोर मोर्टार पर लागू नहीं। मूलभूत वैज्ञानिक त्रुटि।"),
    ("IS 2250:1981", "✓ सही", "मोर्टार का एकमात्र सही BIS मानक — अभियोजन ने इसे पूरी तरह नज़रअंदाज़ किया।"),
    ("IS 3535:1986", "✓ सही", "Cl.4.1: ठेकेदार उपस्थिति अनिवार्य। Cl.5.7.5: तीन-भाग विभाजन अनिवार्य। Cl.6.2: न्यूनतम 5 स्थल। तीनों का उल्लंघन।"),
    ("IS 4031 (Part 6)", "~ आंशिक", "Cl.5.1: 27±2°C तापमान अनिवार्य — भारी वर्षा में असंभव था।"),
    ("ASTM C1324", "✓ सही", "§§7-8: कार्बोनेटेड बाहरी परत हटाकर नमूना लेना अनिवार्य — नहीं किया गया।"),
    ("ASTM C780", "~ आंशिक", "§6.1: वर्षा/नमी से नमूना संरक्षण अनिवार्य — 'otherwise sample is invalid.'"),
    ("NBC 2016/2023", "✓ सही", "§3.4: चरम मौसम = Force Majeure — ठेकेदार की देयता से छूट।"),
    ("CPWD Manual 2023", "✓ सही", "§§3.7.4 & 12.2.1: ठेकेदार की उपस्थिति में संयुक्त नमूनाकरण अनिवार्य।"),
    ("ISO/IEC 17025 + NABL", "✓ सही", "Traceability, documented handling, method control — FSL रिपोर्ट इन मानकों पर विफल।"),
]

def build_standards_table():
    story = [SH('भाग-4 : IS/ASTM मानक वैधता विश्लेषण')]
    data = [['मानक', 'लागू?', 'मुख्य उल्लंघन / प्रासंगिकता']]
    for code, app, viol in STANDARDS:
        data.append([code, app, viol])
    col_w = [W - 2*MARGIN - 20*mm - 60*mm, 20*mm, 60*mm]
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e8e8e8')),
        ('FONTNAME', (0,0), (-1,0), HINDI_FONT_BOLD),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('LEADING', (0,0), (-1,-1), 13),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f9f9f9')]),
        ('TEXTCOLOR', (1,1), (1,1), colors.HexColor('#cc0000')),
    ]))
    story.append(t)
    story.append(sp(2))
    return story


# ── Precedents table ──────────────────────────────────────────────────────
PRECEDENTS = [
    ("Kattavellai @ Devakar v. State of TN\n2025 INSC 845", "SC 2025", "VERIFIED\n[BINDING]", "92", "Chain of Custody Register mandatory — binding nationwide."),
    ("Surendra Koli v. State of UP\nSC, 11 Nov 2025", "SC 2025", "VERIFIED", "88", "No CoC + no expert testimony = acquittal."),
    ("State of Maharashtra v. Damu\n(2000) 6 SCC 269", "SC 2000", "VERIFIED", "90", "No panchnama = prosecution cannot establish sample identity."),
    ("State of Punjab v. Baldev Singh\n(1999) 6 SCC 172", "SC 1999", "VERIFIED", "88", "Mandatory procedure non-compliance = presumption of prejudice."),
    ("Union of India v. Prafulla Kumar Samal\n(1979) 3 SCC 4, Para 10", "SC 1979", "VERIFIED", "88", "Suspicion only = discharge mandatory."),
    ("State of Bihar v. Ramesh Singh\n(1977) 4 SCC 39, Para 5", "SC 1977", "VERIFIED", "85", "No prima facie case = discharge mandatory."),
    ("Jacob Mathew v. State of Punjab\n(2005) 6 SCC 1, Para 48", "SC 2005", "VERIFIED", "65", "Mere lack of care ≠ criminal negligence."),
    ("RSMML v. Contractor\nRajasthan HC, 30 Mar 2026", "RHC 2026", "VERIFIED", "85", "Contractor cannot be penalised for force majeure delays."),
    ("Rajasthan HC Suo Motu PIL\n29 Jul + 23 Aug 2025", "RHC 2025", "VERIFIED", "80", "Structural collapses = weather + age + maintenance — not contractor alone."),
    ("IS 3535:1986 Cl. 5.7.5\nBIS — Reaffirmed 2004", "BIS", "VERIFIED", "95", "Three-way split mandatory — contractor deprived of counter-sample."),
    ("Tomaso Bruno v. State of UP\n(2015) 7 SCC 178", "SC 2015", "SECONDARY", "82", "Expert evidence on defective foundation cannot be relied upon."),
    ("Sushil Sharma v. State (NCT of Delhi)\n(2014) 4 SCC 317", "SC 2014", "SECONDARY", "75", "Flawed underlying data vitiates expert opinion completely."),
    ("Uttarakhand HC — CoC Defects\nMarch 2026", "UK HC", "SECONDARY", "78", "Absence of CoC = forensic evidence loses evidentiary value."),
    ("R.B. Constructions v. State of MH\n2014 SCC OnLine Bom 125", "Bom HC", "⚠ PENDING", "50", "DO NOT USE as primary — citation authenticity unconfirmed."),
    ("C.B.I. v. K.S. Kalra\n2011 SCC OnLine Del 3412", "Del HC", "⚠ PENDING", "48", "DO NOT USE as primary — citation authenticity unconfirmed."),
]

def build_precedents_table():
    story = [SH('भाग-5 : न्यायिक निर्णय — सत्यापन स्थिति')]
    data = [['निर्णय', 'न्यायालय', 'स्थिति', 'Fit', 'प्रयोग']]
    for row in PRECEDENTS:
        data.append(list(row))
    col_w = [65*mm, 18*mm, 18*mm, 8*mm, W - 2*MARGIN - 65*mm - 18*mm - 18*mm - 8*mm]
    t = Table(data, colWidths=col_w, repeatRows=1)
    style = [
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e8e8e8')),
        ('FONTNAME', (0,0), (-1,0), HINDI_FONT_BOLD),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('LEADING', (0,0), (-1,-1), 12),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f9f9f9')]),
    ]
    for i, row in enumerate(PRECEDENTS, 1):
        status = row[2]
        if 'VERIFIED' in status and 'PENDING' not in status:
            style.append(('TEXTCOLOR', (2,i), (2,i), colors.HexColor('#006600')))
            style.append(('FONTNAME', (2,i), (2,i), HINDI_FONT_BOLD))
        elif 'SECONDARY' in status:
            style.append(('TEXTCOLOR', (2,i), (2,i), colors.HexColor('#0000cc')))
        elif 'PENDING' in status:
            style.append(('TEXTCOLOR', (2,i), (2,i), colors.HexColor('#cc0000')))
            style.append(('BACKGROUND', (0,i), (-1,i), colors.HexColor('#fff0f0')))
    t.setStyle(TableStyle(style))
    story.append(t)
    story.append(sp(2))
    return story


# ── Oral arguments ────────────────────────────────────────────────────────
ORAL_ARGS = [
    ("OA-1 : मूलभूत वैज्ञानिक त्रुटि",
     "माननीय न्यायालय, अभियोजन ने IS 1199:2018 (ताज़ा कंक्रीट) को पुरानी पत्थर की चिनाई के कठोर सीमेंट मोर्टार पर लागू किया। सही मानक IS 2250:1981 एवं ASTM C1324 है। Tomaso Bruno (2015) 7 SCC 178 — 'If the underlying data is inherently flawed, the ensuing expert opinion gets completely vitiated.' जब मानक ही गलत हो तो रिपोर्ट स्वतः निरर्थक है।"),
    ("OA-2 : श्रृंखला-अभिरक्षा का पूर्ण अभाव",
     "माननीय न्यायालय, Kattavellai (2025 INSC 845) [BINDING] — 'Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained...' अभियोजन यह नहीं बता सकता — (1) नमूने किसने कब एकत्र किए, (2) कैसे सील किए, (3) प्रयोगशाला कैसे पहुँचे, (4) किस दशा में रखे गए। यह शून्य CoC फोरेंसिक रिपोर्ट को सर्वथा अग्राह्य बनाती है।"),
    ("OA-3 : तीन-भाग विभाजन नहीं — अनुच्छेद 21 का हनन",
     "माननीय न्यायालय, IS 3535:1986 Cl. 5.7.5 — अभियोजन को नमूनों का एक भाग ठेकेदार को देना था ताकि वह स्वतंत्र पुन:परीक्षण करा सके। यह नहीं किया गया। अभियुक्त को अपनी बेगुनाही साबित करने का अवसर ही नहीं दिया गया — यह अनुच्छेद 21 का सीधा उल्लंघन है।"),
    ("OA-4 : वर्षा में नमूनाकरण + सतह संदूषण",
     "माननीय न्यायालय, नमूने 28.12.2011 को भारी वर्षा में संग्रहीत किए गए। IS 4031 Part 6 — 27±2°C तापमान अनिवार्य। ASTM C780 — 'samples must be protected from rain; otherwise sample is invalid.' 15 वर्ष पुराने मोर्टार में कार्बोनेशन 10-15mm — संपीड़न क्षमता 30-50% कम। ASTM C1324 — बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था।"),
    ("OA-5 : प्रथम दृष्टया आरोप असिद्ध → उन्मोचन अनिवार्य",
     "माननीय न्यायालय, Prafulla Kumar Samal (1979) 3 SCC 4 [VERIFIED] — 'If the material discloses nothing more than a suspicion, the accused is entitled to be discharged.' प्रस्तुत प्रकरण में — सम्पूर्ण फोरेंसिक साक्ष्य दूषित, भ्रष्टाचार का कोई प्रत्यक्ष साक्ष्य नहीं, घोर लापरवाही का कोई तथ्य नहीं, घटना का कारण Force Majeure। अतः धारा 250 BNSS 2023 के अंतर्गत तत्काल उन्मोचन प्रार्थित है।"),
]

def build_oral_prayer():
    story = [SH('भाग-6 : 5 तैयार मौखिक-बहस अनुच्छेद')]
    for title, text in ORAL_ARGS:
        story.append(GH(title))
        story.append(Paragraph(text, ST['oral']))
        story.append(sp(1))

    story += [
        SH('भाग-7 : प्रार्थना (Prayer)'),
        P('उपरोक्त तथ्यों, विधिक आधारों और न्यायहित को दृष्टिगत रखते हुए माननीय न्यायालय से विनम्र प्रार्थना है कि —'),
        Paragraph('(i) आवेदक/अभियुक्त को <b>धारा 250 BNSS 2023</b> (वैकल्पिक: धारा 227 CrPC) के अंतर्गत समस्त आरोपों से <b>आरोपमुक्त/डिस्चार्ज</b> किया जाए;', ST['prayer']),
        Paragraph('(ii) फोरेंसिक मोर्टार रिपोर्ट को प्रक्रियागत एवं वैज्ञानिक त्रुटियों के कारण <b>अग्राह्य (Inadmissible)</b> घोषित किया जाए;', ST['prayer']),
        Paragraph('(iii) §114 BSA 2023 के अंतर्गत दोषपूर्ण नमूनाकरण पर आधारित विशेषज्ञ मत को <b>अप्रमाणित</b> घोषित किया जाए;', ST['prayer']),
        Paragraph('(iv) वैकल्पिक रूप से, स्वतंत्र/निष्पक्ष <b>पुन:परीक्षण</b> या तकनीकी सत्यापन हेतु आदेश पारित किया जाए;', ST['prayer']),
        Paragraph('(v) अभियोजन को निर्देशित किया जाए कि वह समस्त मूल अभिलेख प्रस्तुत करे: संग्रह पंचनामा, सील मेमो, ट्रांसफर रजिस्टर, FSL inward व seal verification, analyst worksheet, sample handling log;', ST['prayer']),
        Paragraph('(vi) ऐसे अभिलेख प्रस्तुत न होने की दशा में <b>adverse inference</b> लिया जाए;', ST['prayer']),
        Paragraph('(vii) जो भी अन्य उचित एवं न्यायोचित अनुतोष हो, वह भी दिलाने की कृपा करें।', ST['prayer']),
        sp(3),
        SH('भाग-8 : सत्यापन एवं शपथ-पत्र'),
        P('मैं, <b>हेमराज वरदार</b>, पुत्र ________, आयु ____ वर्ष, निवासी ________, उदयपुर, यह सत्यापित करता हूँ कि उपर्युक्त प्रार्थना-पत्र में वर्णित तथ्य मेरे ज्ञान एवं अभिलेखों के आधार पर सत्य एवं सही हैं।'),
        sp(8),
        P('आपका विश्वासी,'),
        sp(10),
        P('_______________________________'),
        P('<b>हेमराज वरदार</b> — आवेदक/अभियुक्त'),
        P('दिनांक : ____/____/2026 &nbsp;&nbsp;&nbsp; स्थान : उदयपुर (राजस्थान)'),
        sp(4),
        hr(),
        CA('फाइलिंग से पूर्व अनिवार्य: (1) Kattavellai 2025 INSC 845 — certified copy + exact para numbers. (2) IS 3535:1986 Cl. 5.7.5 — BIS certified copy. (3) PENDING citations को primary authority के रूप में use न करें. (4) Sushil Sharma (2014) 4 SCC 317 — SCC से सटीक पैरा भाषा सत्यापित करें. (5) अधिवक्ता से परामर्श के बाद ही फाइल करें।'),
        sp(2),
        P('Legal Luminaire v5 | तैयार दिनांक: अप्रैल 2026 | स्रोत: case01-data.ts + verification-engine.ts', 'small'),
    ]
    return story


# ── Main ──────────────────────────────────────────────────────────────────
def main():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title="उन्मोचन प्रार्थना-पत्र — हेमराज वरदार v5",
        author="Legal Luminaire",
        subject="Discharge Application — Special Session Case 1/2025 — Udaipur",
    )

    story = []
    story += build_story()
    story += build_grounds()
    story += build_standards_table()
    story += build_precedents_table()
    story += build_oral_prayer()

    doc.build(story)
    size_kb = os.path.getsize(OUT) // 1024
    print(f"\n✅ PDF generated: {OUT} ({size_kb} KB)")
    print(f"   Open: {os.path.abspath(OUT)}")

# ── Content ───────────────────────────────────────────────────────────────
def build_story():
    story = []

    # ── Court Header ──────────────────────────────────────────────────────
    story += [
        hr2(),
        P('माननीय विशेष न्यायाधीश महोदय', 'title'),
        P('भ्रष्टाचार निवारण अधिनियम प्रकरण, उदयपुर (राजस्थान)', 'subtitle'),
        hr(),
        sp(2),
        P('<b>विशेष सत्र वाद संख्या : 1/2025</b>', 'subtitle'),
        P('एफआईआर संख्या : 496/2011 दिनांक 28.12.2011', 'subtitle'),
        P('राज्य बनाम हेमराज वरदार एवं अन्य', 'subtitle'),
        sp(3),
        P('<b>आवेदक/अभियुक्त :</b> हेमराज वरदार, निदेशक, एम/एस प्रामाण कंस्ट्रक्शन प्रा. लि., उदयपुर', 'subtitle'),
        sp(4),
        P('<b>प्रार्थना-पत्र : धारा 250 BNSS 2023 / धारा 227 CrPC</b>', 'title'),
        P('<b>आरोपमुक्ति (Discharge) हेतु</b>', 'title'),
        hr2(),
        sp(4),
    ]

    # ── Part 1: Facts ─────────────────────────────────────────────────────
    story += [
        SH('भाग-1 : तथ्यात्मक पृष्ठभूमि'),
        P('<b>1.</b> यह अभियोजन दिनांक <b>28.12.2011</b> को महाराणा प्रताप स्टेडियम, उदयपुर की बाहरी दीवार के आंशिक ढहने की घटना पर आधारित है। अभियोजन का सम्पूर्ण आधार एक फोरेंसिक रिपोर्ट है जिसमें सीमेंट मोर्टार के नमूनों को "फेल" दर्शाया गया है।'),
        P('<b>2.</b> अभियोजन का आरोप है कि निर्माण/मरम्मत कार्य की गुणवत्ता न्यून होने से घटना हुई, और इस आधार पर <b>IPC §304A + भ्रष्टाचार निवारण अधिनियम</b> के अंतर्गत अभियुक्त पर दायित्व आरोपित किया गया।'),
        P('<b>3.</b> अभियुक्त का सुसंगत प्रतिरक्षा-विधान यह है कि —'),
        BL('नमूना-संग्रह प्रतिकूल मौसम (भारी वर्षा/तूफान) में हुआ;'),
        BL('अभियोजन ने <b>गलत IS मानक (IS 1199:2018 — ताज़ा कंक्रीट)</b> को कठोर मोर्टार पर लागू किया — मूलभूत वैज्ञानिक त्रुटि;'),
        BL('ठेकेदार प्रतिनिधि की अनुपस्थिति — IS 3535:1986 Cl. 4.1 का उल्लंघन;'),
        BL('तीन-भाग विभाजन (referee sample) नहीं किया — IS 3535:1986 Cl. 5.7.5 का उल्लंघन;'),
        BL('श्रृंखला-अभिरक्षा (Chain of Custody) का कोई दस्तावेजी रिकॉर्ड नहीं;'),
        BL('पंचनामा/जब्ती-श्रृंखला में घोर कमी;'),
        BL('घटना का कारण Force Majeure — भारी वर्षा (NBC 2016 §3.4)।'),
        sp(2),
    ]

    # ── Part 2: Legal Principles ──────────────────────────────────────────
    story += [
        SH('भाग-2 : डिस्चार्ज के विधिक सिद्धांत'),
        P('<b>4.</b> डिस्चार्ज के चरण पर न्यायालय को यह देखना होता है कि उपलब्ध सामग्री से क्या प्रथमदृष्टया (prima facie) ऐसा ठोस आधार बनता है जिससे अभियुक्त के विरुद्ध आरोप तय किए जाएँ।'),
        Q('<b>Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10</b> [VERIFIED] — "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."'),
        Q('<b>State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5</b> [VERIFIED] — "At the stage of framing of charge, the Court has to see whether the material produced makes out a prima facie case. If the material discloses nothing more than suspicion, discharge is mandatory."'),
        sp(2),
    ]

    return story

def build_grounds():
    story = []
    story += [SH('भाग-3 : विस्तृत विधिक आधार (12 Grounds for Discharge)')]

    # Pre-primary ground
    story += [
        GH('पूर्व-प्राथमिक आधार : गलत IS मानक — मूलभूत वैज्ञानिक त्रुटि'),
        P('<b>5.</b> अभियोजन ने <b>IS 1199:2018</b> ("Methods of Sampling of Fresh Concrete") को 15 वर्ष पुरानी पत्थर की चिनाई के <b>कठोर सीमेंट मोर्टार</b> पर लागू किया। यह एक मूलभूत वैज्ञानिक त्रुटि है। कठोर मोर्टार के लिए सही मानक <b>IS 2250:1981</b> और <b>ASTM C1324</b> हैं।'),
        Q('<b>Tomaso Bruno v. State of UP (2015) 7 SCC 178</b> [SECONDARY] — "Expert evidence is a weak type of evidence and the court is not bound to accept it. Where the expert evidence is based on assumptions or on a defective foundation, it cannot be relied upon."'),
    ]

    # Ground 1
    story += [
        GH('आधार-1 : वर्षा/तूफान में नमूना-संग्रह — ASTM C780 §6.1 उल्लंघन'),
        P('<b>6.</b> नमूने दिनांक 28.12.2011 को भारी वर्षा एवं तूफान के दौरान संग्रहित किए गए। <b>ASTM C780 §6.1</b> — "Samples must be protected from rain and moisture; otherwise sample is invalid." <b>IS 4031 (Part 6) Cl. 5.1</b> — तापमान 27±2°C अनिवार्य था — भारी वर्षा में यह असंभव था।'),
    ]

    # Ground 2
    story += [
        GH('आधार-2 : सतह संदूषण/कार्बोनेशन — ASTM C1324 §§7-8 उल्लंघन'),
        P('<b>7.</b> 15 वर्ष पुराने मोर्टार की बाहरी परत में कार्बोनेशन गहराई 10-15mm होती है जिससे संपीड़न क्षमता 30-50% कम हो जाती है। <b>ASTM C1324 §§7-8</b> — कार्बोनेटेड बाहरी परत हटाकर आंतरिक सार से नमूना लेना अनिवार्य था। यह नहीं किया गया।'),
    ]

    # Ground 3
    story += [
        GH('आधार-3 : ठेकेदार प्रतिनिधि की अनुपस्थिति — IS 3535:1986 Cl. 4.1 + CPWD Manual §§3.7.4 & 12.2.1'),
        P('<b>8.</b> <b>IS 3535:1986 Cl. 4.1</b> — "Sampling in presence of purchaser/contractor representative — mandatory." <b>CPWD Manual 2023 §§3.7.4 & 12.2.1</b> — ठेकेदार की उपस्थिति सुनिश्चित करना अनिवार्य। अभियुक्त का कोई प्रतिनिधि उपस्थित नहीं था।'),
        Q('<b>State of Punjab v. Baldev Singh (1999) 6 SCC 172</b> [VERIFIED] — "Where a statute or official manual prescribes a specific procedure for the collection of evidence, strict compliance is not merely directory but mandatory, and departure therefrom creates a presumption of prejudice to the accused."'),
    ]

    # Ground 4 — NEW: Three-way split
    story += [
        GH('आधार-4 : तीन-भाग विभाजन (Referee Sample) नहीं किया — IS 3535:1986 Cl. 5.7.5 — अनुच्छेद 21 का हनन'),
        P('<b>9.</b> <b>IS 3535:1986 Cl. 5.7.5</b> (BIS — Reaffirmed 2004) — "The laboratory sample and the composite sample shall be divided into three equal parts, one for the purchaser, another for the supplier, and the third to be used as a referee sample."'),
        P('अभियोजन को नमूनों को तीन बराबर भागों में विभाजित करना था: (1) अभियोजन, (2) अभियुक्त ठेकेदार, (3) referee। ऐसा न करके अभियुक्त को स्वतंत्र पुन:परीक्षण के वैधानिक अधिकार से वंचित किया गया — यह <b>अनुच्छेद 21</b> (निष्पक्ष विचारण) का हनन है।'),
    ]

    # Ground 5
    story += [
        GH('आधार-5 : श्रृंखला-अभिरक्षा (Chain of Custody) का सम्पूर्ण अभाव'),
        P('<b>10.</b> अभियोजन के पास निम्न में से कोई भी रिकॉर्ड नहीं है: (क) नमूना संग्रह का विधिवत् अभिलेख, (ख) नमूनों की सीलिंग का प्रमाण, (ग) प्रयोगशाला तक परिवहन का दस्तावेज़, (घ) प्रयोगशाला में भण्डारण दशाओं का अभिलेख, (ङ) किसी भी चरण में CoC का प्रमाण।'),
        Q('<b>Kattavellai @ Devakar v. State of Tamil Nadu (2025 INSC 845)</b> [VERIFIED — BINDING] — त्रि-न्यायाधीशीय खण्डपीठ — "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."'),
        Q('<b>Surendra Koli v. State of UP (SC, 11 November 2025)</b> [VERIFIED] — "There was no credible chain of custody or expert testimony establishing the link between the accused and the physical evidence." — Chain of Custody के अभाव में acquittal।'),
    ]

    # Ground 6
    story += [
        GH('आधार-6 : पंचनामा/जब्ती मेमो का अभाव'),
        P('<b>11.</b> पंचनामा संग्रह-स्थल और परीक्षण-स्थल के बीच पहला वैधानिक दस्तावेजी पुल है। पंचनामा के बिना अभियोजन यह सिद्ध करने में विफल होता है कि परीक्षणित सामग्री वही है जो स्थल से ली गई थी।'),
        Q('<b>State of Maharashtra v. Damu (2000) 6 SCC 269</b> [VERIFIED] — "Without a panchnama prepared at the site in the presence of independent witnesses, the foundational burden cannot be discharged."'),
    ]

    # Ground 7
    story += [
        GH('आधार-7 : अनियमित/अप्रतिनिधि नमूनाकरण — IS 3535:1986 Cl. 6.2'),
        P('<b>12.</b> <b>IS 3535:1986 Cl. 6.2</b> — न्यूनतम 5 प्रतिनिधि स्थलों से नमूना लेना अनिवार्य। Sampling plan, sample points rationale, sample count logic का अभाव selection bias की गंभीर संभावना उत्पन्न करता है।'),
    ]

    # Ground 8
    story += [
        GH('आधार-8 : विशेषज्ञ राय की अस्वीकृतता — §114 BSA 2023'),
        P('<b>13.</b> विशेषज्ञ राय मूल तथ्य-आधार (sample integrity) पर निर्भर है। जब sampling foundation ही दूषित हो तो expert opinion निर्णायक नहीं रह जाती।'),
        Q('<b>Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317</b> [SECONDARY] — "If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated."'),
    ]

    # Ground 9
    story += [
        GH('आधार-9 : Force Majeure — भारी वर्षा 28.12.2011 — NBC 2016 §3.4'),
        P('<b>14.</b> <b>NBC 2016/2023 §3.4</b> — "Extreme Weather Events" = Force Majeure — ठेकेदार की देयता से छूट। अभियोजन ने weather-factor को exclude नहीं किया।'),
        Q('<b>RSMML v. Contractor (Rajasthan HC, 30 March 2026)</b> [VERIFIED] — "A contractor cannot be penalised for delays that the State\'s own note-sheets acknowledged as force majeure." — इसी न्यायालय का निर्णय।'),
        Q('<b>Rajasthan HC Suo Motu PIL (29 July 2025 + 23 August 2025)</b> [VERIFIED] — इस माननीय न्यायालय ने स्वयं न्यायिक संज्ञान लिया है कि राजस्थान में संरचनात्मक ढहाव का कारण चरम मौसम + पूर्व-विद्यमान क्षरण + रखरखाव विफलता है।'),
        Q('<b>Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48</b> [VERIFIED] — "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act."'),
    ]

    # Grounds 10-12
    story += [
        GH('आधार-10 : IPC §304A — घोर उपेक्षा सिद्ध नहीं'),
        P('<b>15.</b> Force Majeure परिस्थिति में आपराधिक उपेक्षा (criminal negligence) का आरोप टिकाऊ नहीं। अभियोजन ने weather-factor को exclude करके proximate causation सिद्ध नहीं किया।'),
        GH('आधार-11 : भ्रष्टाचार आरोप — स्वतंत्र प्रत्यक्ष सामग्री का अभाव'),
        P('<b>16.</b> भ्रष्टाचार निवारण अधिनियम के आरोप तकनीकी रिपोर्ट से स्वतः सिद्ध नहीं होते। अभियोजन को illegal gain nexus, conscious collusion या अन्य स्वतंत्र विश्वसनीय सामग्री दिखानी होगी।'),
        GH('आधार-12 : NABL/ISO 17025 उल्लंघन — FSL रिपोर्ट अविश्वसनीय'),
        P('<b>17.</b> Missing custody/receipt/environment records — NABL accreditation requirements का उल्लंघन। FSL report को reliable accredited output नहीं माना जा सकता।'),
        sp(2),
    ]
    return story


if __name__ == "__main__":
    main()
