from typing import Dict, Any

COURT_STYLES: Dict[str, Dict[str, Any]] = {
    "RAJASTHAN_HIGH_COURT": {
        "label": "Rajasthan High Court (Jodhpur/Jaipur)",
        "prompt_fragment": (
            "IMPORTANT RAJASTHAN HC STYLE: "
            "1. Bold the names of the Parties in the header exactly как 'IN THE HIGH COURT OF JUDICATURE FOR RAJASTHAN'. "
            "2. Ensure the 'Petitioner' vs 'State' is separated by a clear '---VERSUS---' line. "
            "3. Use specific section headers: 'NARRATIVE OF FACTS' and 'FORENSIC DISCREPANCIES'. "
        ),
        "css_class": "style-rajasthan-hc"
    },
    "SUPREME_COURT_IN": {
        "label": "Supreme Court of India (New Delhi)",
        "prompt_fragment": (
            "IMPORTANT SUPREME COURT STYLE: "
            "1. Header must be 'IN THE SUPREME COURT OF INDIA'. "
            "2. Use 'Special Leave Petition' (Criminal) terminology. "
            "3. Ensure 'Coram' and 'Advocate for Petitioner' placeholders are at the bottom. "
            "4. Indent each paragraph manually with '    ' for double-space simulation."
        ),
        "css_class": "style-supreme-court"
    },
    "DISTRICT_COURT": {
        "label": "District / Sessions Court",
        "prompt_fragment": (
            "IMPORTANT DISTRICT COURT STYLE: "
            "1. Highlight the FIR Number and Police Station at the absolute top. "
            "2. Use bold numbering for 'Arguments 1', 'Arguments 2'."
        ),
        "css_class": "style-district-court"
    }
}

def get_style_for_court(court_name: str) -> Dict[str, Any]:
    name_upper = court_name.upper()
    if "RAJASTHAN" in name_upper:
        return COURT_STYLES["RAJASTHAN_HIGH_COURT"]
    elif "SUPREME" in name_upper:
        return COURT_STYLES["SUPREME_COURT_IN"]
    return COURT_STYLES["DISTRICT_COURT"]
