"""
Legal Luminaire — Court-Ready PDF Engine
Artemis-II Accuracy: Hindi/Devanagari support + 1-inch margins + watermark
Antigravity Logbook Phase 3: Mangal.ttf registered for Devanagari support.
"""
import os
import sys
from fpdf import FPDF
from io import BytesIO

# ── Font paths ─────────────────────────────────────────────────────────────────
# Try system Mangal font (Windows) first, then fallback to DejaVu/Noto
_FONT_SEARCH_PATHS = [
    # Windows system fonts
    r"C:\Windows\Fonts\mangal.ttf",
    r"C:\Windows\Fonts\Mangal.ttf",
    # Linux / Docker
    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    # Bundled fallback (place in backend/fonts/ if needed)
    os.path.join(os.path.dirname(__file__), "..", "fonts", "NotoSansDevanagari-Regular.ttf"),
    os.path.join(os.path.dirname(__file__), "..", "fonts", "mangal.ttf"),
]

def _find_devanagari_font() -> str | None:
    """Return path to first available Devanagari-capable font, or None."""
    for path in _FONT_SEARCH_PATHS:
        if os.path.isfile(path):
            return path
    return None

_DEVANAGARI_FONT_PATH = _find_devanagari_font()
_HAS_HINDI_FONT = _DEVANAGARI_FONT_PATH is not None


class LegalPDF(FPDF):
    """
    Court-ready PDF with:
    - 1-inch (25.4mm) margins on all sides
    - 1.5 line spacing
    - Devanagari/Hindi font support (Mangal or Noto Sans Devanagari)
    - High-contrast diagonal watermark
    - Standard header/footer with page numbers
    """

    def __init__(self, watermark_text: str = "DEMO / VERIFIED CASE", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.watermark_text = watermark_text
        # 1-inch court margins
        self.set_margins(left=25.4, top=25.4, right=25.4)
        self.set_auto_page_break(auto=True, margin=25.4)

        # Register Devanagari font if available
        if _HAS_HINDI_FONT:
            try:
                self.add_font("Devanagari", "", _DEVANAGARI_FONT_PATH)
                self._hindi_font_loaded = True
            except Exception:
                self._hindi_font_loaded = False
        else:
            self._hindi_font_loaded = False

    def header(self):
        # Diagonal watermark
        if self.watermark_text:
            self.set_font("helvetica", "B", 48)
            self.set_text_color(210, 210, 210)
            with self.rotation(angle=45, x=105, y=148):
                self.text(x=20, y=148, text=self.watermark_text)

        # Header line
        self.set_font("helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(
            0, 10,
            "Legal Luminaire - Verification-Gated AI Draft Output",
            align="R", new_x="LMARGIN", new_y="NEXT"
        )
        self.set_y(25.4)
        self.set_text_color(0, 0, 0)

    def footer(self):
        self.set_y(-20)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def write_legal_text(self, text: str, font_size: int = 12, line_height: float = 7.5):
        """
        Write text with proper encoding.
        Detects Hindi/Devanagari content and switches font automatically.
        Line height 7.5 = ~1.5 line spacing at 12pt.
        """
        self.set_text_color(0, 0, 0)

        # Detect if text contains Devanagari Unicode (U+0900–U+097F)
        has_devanagari = any('\u0900' <= ch <= '\u097F' for ch in text)

        if self._hindi_font_loaded:
            self.set_font("Devanagari", size=font_size)
        else:
            self.set_font("helvetica", size=font_size)
            # Safe encode for standard font
            # Specifically replace common non-latin-1 but "safe" characters
            text = text.replace("\u00A0", " ").replace("\u2013", "-").replace("\u2014", "-")
            text = text.encode("latin-1", "replace").decode("latin-1")

        self.multi_cell(0, line_height, text)


def generate_court_pdf(
    text_content: str,
    watermark: str = "DEMO / UNVERIFIED",
    title: str = "Legal Luminaire — Court Draft",
    font_size: int = 12,
) -> bytes:
    """
    Generate a court-ready PDF from text content.
    Supports Hindi/Devanagari via Mangal or Noto Sans Devanagari font.
    Returns raw bytes suitable for API response or Streamlit download.

    Args:
        text_content: The draft text (Hindi or English or mixed).
        watermark: Diagonal watermark text (e.g. "DEMO / VERIFIED CASE").
        title: Document title for metadata.
        font_size: Base font size (default 12pt).

    Returns:
        PDF as bytes.
    """
    pdf = LegalPDF(watermark_text=watermark)
    pdf.set_title(title)
    pdf.set_author("Legal Luminaire — Verification-Gated AI")
    pdf.alias_nb_pages()
    pdf.add_page()

    # Write content with auto Hindi detection
    pdf.write_legal_text(text_content, font_size=font_size)

    output = pdf.output(dest="S")
    if isinstance(output, str):
        return output.encode("latin-1")
    return bytes(output)


def generate_bilingual_pdf(
    english_content: str,
    hindi_content: str,
    watermark: str = "DEMO / VERIFIED CASE",
    title: str = "Legal Luminaire — Bilingual Court Draft",
) -> bytes:
    """
    Generate a bilingual PDF with English section followed by Hindi section.
    Each section starts on a new page.
    """
    pdf = LegalPDF(watermark_text=watermark)
    pdf.set_title(title)
    pdf.set_author("Legal Luminaire — Verification-Gated AI")
    pdf.alias_nb_pages()

    # English section
    pdf.add_page()
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, "ENGLISH VERSION", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.write_legal_text(english_content)

    # Hindi section
    pdf.add_page()
    if pdf._hindi_font_loaded:
        pdf.set_font("Devanagari", "B", 14)
    else:
        pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, "HINDI VERSION / हिंदी संस्करण", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.write_legal_text(hindi_content)

    output = pdf.output(dest="S")
    if isinstance(output, str):
        return output.encode("latin-1")
    return bytes(output)


def get_hindi_font_status() -> dict:
    """Return status of Hindi font availability for health check endpoint."""
    return {
        "hindi_font_available": _HAS_HINDI_FONT,
        "font_path": _DEVANAGARI_FONT_PATH,
        "font_name": os.path.basename(_DEVANAGARI_FONT_PATH) if _DEVANAGARI_FONT_PATH else None,
    }
