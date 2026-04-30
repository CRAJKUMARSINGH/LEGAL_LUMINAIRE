"""
Judgment Parser Agent
Extracts structured data from Indian court judgments
Phase 5: Analytics Layer
"""

from __future__ import annotations
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ParsedJudgment:
    case_id: str
    raw_text: str
    judge_names: list[str] = field(default_factory=list)
    court: str = "Unknown"
    year: int = 0
    month: int = 1
    outcome: str = "UNKNOWN"
    bail_decision: Optional[str] = None   # GRANTED | REJECTED | None
    ipc_sections: list[str] = field(default_factory=list)
    crpc_sections: list[str] = field(default_factory=list)
    offences: list[str] = field(default_factory=list)
    is_constitutional: bool = False
    disposal_days: Optional[int] = None
    appeal_result: Optional[str] = None   # UPHELD | REVERSED | MODIFIED


#  Judge name extraction 

_JUDGE_PATTERNS = [
    re.compile(r"(?:Hon'?ble\s+)?(?:Justice|J\.)\s+([A-Z][A-Za-z\s.]+?)(?:\s*,|\s+J\.|\s+CJ|\s+and\b|\n)", re.I),
    re.compile(r"CORAM\s*:\s*([A-Z][A-Za-z\s.,]+?)(?:\n|$)", re.I),
    re.compile(r"BEFORE\s*:\s*([A-Z][A-Za-z\s.,]+?)(?:\n|$)", re.I),
]

_TITLE_RE = re.compile(r"^(?:Hon'?ble\s+)?(?:Justice|J\.|CJ|ACJ)\s*", re.I)
_SUFFIX_RE = re.compile(r"\s*,?\s*(?:J\.|CJ|ACJ)$", re.I)

def _normalize_judge(name: str) -> str:
    name = _TITLE_RE.sub("", name)
    name = _SUFFIX_RE.sub("", name)
    return " ".join(name.split()).title()

def extract_judges(text: str) -> list[str]:
    names: list[str] = []
    for pat in _JUDGE_PATTERNS:
        for m in pat.finditer(text):
            raw = m.group(1)
            for part in re.split(r"\s+and\s+|,\s*", raw):
                n = _normalize_judge(part.strip())
                if len(n) > 3 and n not in names:
                    names.append(n)
    return names[:5]  # cap at 5 judges


#  Court extraction 

_KNOWN_COURTS = [
    "Supreme Court of India",
    "Delhi High Court", "Bombay High Court", "Calcutta High Court",
    "Madras High Court", "Allahabad High Court", "Karnataka High Court",
    "Gujarat High Court", "Rajasthan High Court", "Punjab and Haryana High Court",
    "Patna High Court", "Gauhati High Court",
]

def extract_court(text: str) -> str:
    lower = text.lower()
    for court in _KNOWN_COURTS:
        if court.lower() in lower:
            return court
    if "supreme court" in lower: return "Supreme Court of India"
    if "high court" in lower:
        m = re.search(r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+High\s+Court", text)
        if m: return f"{m.group(1)} High Court"
        return "High Court"
    return "Unknown"


#  Year/month extraction 

_YEAR_RE = re.compile(r"\b(20\d{2}|19[5-9]\d)\b")
_MONTH_MAP = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

def extract_year_month(text: str) -> tuple[int, int]:
    years = [int(m.group(1)) for m in _YEAR_RE.finditer(text)]
    year = max(years) if years else 0
    lower = text.lower()
    month = 1
    for name, num in _MONTH_MAP.items():
        if name in lower:
            month = num
            break
    return year, month


#  Outcome detection 

_OUTCOME_PATTERNS = [
    (re.compile(r"\b(?:appeal|petition)\s+(?:is\s+)?allowed\b", re.I), "ALLOWED"),
    (re.compile(r"\b(?:appeal|petition)\s+(?:is\s+)?dismissed\b", re.I), "DISMISSED"),
    (re.compile(r"\b(?:bail\s+(?:is\s+)?granted|released\s+on\s+bail|granted\s+bail)\b", re.I), "BAIL_GRANTED"),
    (re.compile(r"\b(?:bail\s+(?:is\s+)?(?:rejected|refused|denied))\b", re.I), "BAIL_REJECTED"),
    (re.compile(r"\b(?:acquitted|acquittal|not\s+guilty)\b", re.I), "ACQUITTED"),
    (re.compile(r"\b(?:convicted|conviction\s+upheld|found\s+guilty|sentenced)\b", re.I), "CONVICTED"),
    (re.compile(r"\b(?:remanded|matter\s+remanded)\b", re.I), "REMANDED"),
]

def extract_outcome(text: str) -> str:
    for pat, outcome in _OUTCOME_PATTERNS:
        if pat.search(text):
            return outcome
    return "UNKNOWN"

def extract_bail_decision(text: str) -> Optional[str]:
    outcome = extract_outcome(text)
    if outcome == "BAIL_GRANTED": return "GRANTED"
    if outcome == "BAIL_REJECTED": return "REJECTED"
    return None


#  Section extraction 

_IPC_RE = re.compile(
    r"(?:(?:IPC|Indian\s+Penal\s+Code)\s+(\d+[A-Z]?)"
    r"|(?:section|sec\.?)\s*(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC))",
    re.IGNORECASE,
)
_CRPC_RE = re.compile(
    r"(?:(?:CrPC|Cr\.?P\.?C\.?)\s+(\d+[A-Z]?)"
    r"|(?:section|sec\.?)\s*(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC))",
    re.IGNORECASE,
)

def extract_sections(text: str) -> tuple[list[str], list[str]]:
    ipc = list({(m.group(1) or m.group(2)).upper() for m in _IPC_RE.finditer(text) if m.group(1) or m.group(2)})
    crpc = list({(m.group(1) or m.group(2)).upper() for m in _CRPC_RE.finditer(text) if m.group(1) or m.group(2)})
    return ipc, crpc


#  Offence extraction 

_OFFENCES = [
    "murder", "homicide", "rape", "sexual assault", "theft", "robbery",
    "dacoity", "fraud", "cheating", "forgery", "extortion", "kidnapping",
    "abduction", "dowry harassment", "cruelty", "negligence", "corruption",
    "bribery", "defamation", "sedition", "rioting", "assault", "grievous hurt",
]

def extract_offences(text: str) -> list[str]:
    lower = text.lower()
    return [o for o in _OFFENCES if o in lower]


#  Main parser 

def parse_judgment(case_id: str, text: str) -> ParsedJudgment:
    year, month = extract_year_month(text)
    ipc, crpc = extract_sections(text)
    return ParsedJudgment(
        case_id=case_id,
        raw_text=text,
        judge_names=extract_judges(text),
        court=extract_court(text),
        year=year,
        month=month,
        outcome=extract_outcome(text),
        bail_decision=extract_bail_decision(text),
        ipc_sections=ipc,
        crpc_sections=crpc,
        offences=extract_offences(text),
        is_constitutional=bool(re.search(r"\b(?:article\s+(?:14|19|21|32|226)|fundamental\s+rights|constitution)\b", text, re.I)),
    )