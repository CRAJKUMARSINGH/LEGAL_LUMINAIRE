from __future__ import annotations

import html
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent

PRIMARY_REPLY = ROOT / "DEFENCE_REPLY_HINDI_TOTAL_REPORT_v1.lex"
DISCHARGE_V4 = ROOT / "DISCHARGE_APPLICATION_UPDATED_v4.lex"
SUPERIOR_DRAFT = ROOT / "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex"
HC_V5 = ROOT / "DEFENCE_REPLY_FINAL_v5.lex"
STANDARDS_MATRIX = ROOT / "Standards_Matrix_IS_ASTM_NABL.md"
CASE_LAW_MATRIX = ROOT / "Case_Law_Matrix_Verified_Pending.md"
CASE_NOTES = ROOT / "Legal_Case_References_Brief_Notes.md"

OUT_LEX = ROOT / "HEMRAJ_FINAL_REPLY_HINDI_MERGED_v1.lex"
OUT_HTML = ROOT / "HEMRAJ_FINAL_REPLY_HINDI_MERGED_PRINT.html"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")


def extract_between(text: str, start_marker: str, end_marker: str | None = None) -> str:
    start = text.find(start_marker)
    if start == -1:
        return f"[स्रोत में अनुभाग नहीं मिला: {start_marker}]"
    if end_marker is None:
        return text[start:].strip()
    end = text.find(end_marker, start + len(start_marker))
    if end == -1:
        return text[start:].strip()
    return text[start:end].strip()


def rule(char: str = "━", width: int = 78) -> str:
    return char * width


def make_review_note() -> str:
    return f"""\
{rule()}
अंतिम समेकित हिंदी प्रत्युत्तर / लिखित निवेदन (PDF-PRINT)
प्रकरण: राज्य बनाम हेमराज वरदार एवं अन्य
विशेष सत्र वाद सं. 1/2025 | FIR No. 496/2011 | उदयपुर
तैयारी दिनांक: {date.today().strftime("%d-%m-%Y")}
{rule()}

महत्वपूर्ण काउंसल-रिव्यू नोट:
1. यह समेकित ड्राफ्ट उपलब्ध केस-फाइल, मानक-मैट्रिक्स, precedent notes और पूर्व
   Hindi drafts को मिलाकर तैयार किया गया है।
2. अंतिम दाखिले से पहले प्रत्येक निर्णय/मानक की certified/official copy, para
   number, annexure marking और मूल record से factual verification अनिवार्य है।
3. जिन स्रोतों पर SECONDARY/PENDING लिखा है, उन्हें final pleading में केवल
   सत्यापन के बाद ही binding proposition की तरह रखा जाए।
4. यह draft litigation strategy या legal advice के स्थान पर counsel-review
   formatting/research consolidation artifact है।

स्रोत-पठन और merge निर्णय:
- DEFENCE_REPLY_HINDI_TOTAL_REPORT_v1.lex: मुख्य Hindi body के रूप में merge।
- DISCHARGE_APPLICATION_UPDATED_v4.lex: detailed standards, cross-reference
  matrix, prayer, verification, annexure A-X और pre-filing checklist merge।
- SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex: framing और caution discipline
  reviewed; overlapping content only where consistent.
- DEFENCE_REPLY_FINAL_v5.lex: High Court petition forum का draft है; forum mismatch
  के कारण body में full merge नहीं किया, पर foundational scientific error theme
  पहले से merged v4/total report में रखा गया है।
- Standards_Matrix / Case_Law_Matrix / Brief_Notes: source-status appendices में
  merge, ताकि filing से पहले verification trail साफ रहे।
{rule()}
"""


def make_merged_reply() -> str:
    primary = read_text(PRIMARY_REPLY).strip()
    v4 = read_text(DISCHARGE_V4)
    superior = read_text(SUPERIOR_DRAFT)
    standards = read_text(STANDARDS_MATRIX).strip()
    case_law = read_text(CASE_LAW_MATRIX).strip()
    case_notes = read_text(CASE_NOTES).strip()

    legal_standard = extract_between(v4, "भाग-X: आधार संख्या 9", "भाग-XI:")
    cross_matrix = extract_between(v4, "भाग-XI: क्रॉस-रेफरेंस मैट्रिक्स", "भाग-XII:")
    prayer = extract_between(v4, "भाग-XII: प्रार्थना", "भाग-XIII:")
    verification = extract_between(v4, "भाग-XIII: सत्यापन एवं शपथ-पत्र", "भाग-XIV:")
    annexures = extract_between(v4, "भाग-XIV: अनुलग्नक सूची", "भाग-XV:")
    checklist = extract_between(v4, "भाग-XV: दाखिल करने की चेकलिस्ट")
    superior_index = extract_between(superior, "## भाग-16: सुझावित अनुक्रमणिका", "## भाग-17:")
    superior_filing = extract_between(superior, "## भाग-18: फाइलिंग चेकलिस्ट")

    return "\n\n".join(
        [
            make_review_note(),
            "मुख्य समेकित प्रत्युत्तर / लिखित निवेदन\n" + rule("─") + "\n" + primary,
            "पूरक भाग-A: आरोप-मुक्ति का विधिक मानक (v4 से परिष्कृत)\n" + rule("─") + "\n" + legal_standard,
            "पूरक भाग-B: विस्तृत क्रॉस-रेफरेंस मैट्रिक्स\n" + rule("─") + "\n" + cross_matrix,
            "पूरक भाग-C: समेकित प्रार्थना\n" + rule("─") + "\n" + prayer,
            "पूरक भाग-D: सत्यापन एवं शपथ-पत्र stanza\n" + rule("─") + "\n" + verification,
            "पूरक भाग-E: अनुलग्नक A-X सूची\n" + rule("─") + "\n" + annexures,
            "पूरक भाग-F: दाखिल करने की चेकलिस्ट\n" + rule("─") + "\n" + checklist,
            "पूरक भाग-G: वैकल्पिक अनुक्रमणिका/चेकलिस्ट संकेत (Superior draft से)\n"
            + rule("─")
            + "\n"
            + superior_index
            + "\n\n"
            + superior_filing,
            "पूरक भाग-H: Standards Matrix - filing caution\n" + rule("─") + "\n" + standards,
            "पूरक भाग-I: Case Law Matrix - verified/pending status\n" + rule("─") + "\n" + case_law,
            "पूरक भाग-J: Brief Notes - counsel verification pack\n" + rule("─") + "\n" + case_notes,
        ]
    ).strip() + "\n"


def make_html(text: str) -> str:
    escaped = html.escape(text)
    return f"""<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <title>Hemraj Final Hindi Reply - Merged Print Draft</title>
  <style>
    @page {{
      size: A4;
      margin: 18mm 15mm 18mm 18mm;
    }}
    * {{
      box-sizing: border-box;
    }}
    body {{
      margin: 0;
      color: #111;
      background: #fff;
      font-family: "Nirmala UI", "Mangal", "Noto Serif Devanagari", "Kokila", serif;
      font-size: 12.2pt;
      line-height: 1.52;
    }}
    .page {{
      width: 100%;
    }}
    .draft-label {{
      position: running(header);
      font-size: 9pt;
      color: #444;
      border-bottom: 1px solid #bbb;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }}
    pre {{
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: normal;
      margin: 0;
      font: inherit;
      tab-size: 2;
    }}
    @media print {{
      body {{
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }}
    }}
  </style>
</head>
<body>
  <div class="page">
    <div class="draft-label">Counsel-review print draft | verify certified copies and para numbers before filing</div>
    <pre>{escaped}</pre>
  </div>
</body>
</html>
"""


def main() -> None:
    merged = make_merged_reply()
    OUT_LEX.write_text(merged, encoding="utf-8")
    OUT_HTML.write_text(make_html(merged), encoding="utf-8")
    print(f"Wrote {OUT_LEX}")
    print(f"Wrote {OUT_HTML}")


if __name__ == "__main__":
    main()
