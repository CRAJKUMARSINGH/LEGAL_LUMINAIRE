"""
Case Similarity Agent
Multi-layer case similarity scoring for Indian legal precedents
Phase 4: AI Reasoning Layer
"""

from __future__ import annotations
import re
import math
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


class SimilarityTier(str, Enum):
    EXACT = "EXACT"          # >= 70 — primary authority
    ANALOGOUS = "ANALOGOUS"  # 50-69 — use with qualification
    WEAK = "WEAK"            # 30-49 — supporting only
    REJECTED = "REJECTED"    # < 30  — do not use as primary


@dataclass
class CaseFeatures:
    case_id: str
    title: str
    court: str
    year: int
    text: str
    ipc_sections: list[str] = field(default_factory=list)
    crpc_sections: list[str] = field(default_factory=list)
    issues: list[str] = field(default_factory=list)
    key_terms: list[str] = field(default_factory=list)
    outcome: str = "UNKNOWN"
    citation_count: int = 0
    court_level: str = "UNKNOWN"


@dataclass
class SimilarityScore:
    case_id: str
    title: str
    court: str
    year: int
    total_score: float
    keyword_score: float
    issue_score: float
    citation_score: float
    court_score: float
    tier: SimilarityTier
    matched_issues: list[str]
    matched_sections: list[str]
    explanation: str


#  Court hierarchy weights 

COURT_WEIGHTS = {
    "supreme": 1.0,
    "high": 0.75,
    "sessions": 0.45,
    "magistrate": 0.30,
    "tribunal": 0.50,
}

def _court_weight(court: str) -> float:
    c = court.lower()
    for key, w in COURT_WEIGHTS.items():
        if key in c:
            return w
    return 0.40


def _court_level(court: str) -> str:
    c = court.lower()
    if "supreme" in c: return "SUPREME"
    if "high" in c: return "HIGH"
    if "sessions" in c: return "SESSIONS"
    if "magistrate" in c: return "MAGISTRATE"
    if "tribunal" in c: return "TRIBUNAL"
    return "UNKNOWN"


#  Section extraction 

_IPC_RE = re.compile(
    r"(?:(?:IPC|Indian\s+Penal\s+Code)\s+(\d+[A-Z]?)"
    r"|(?:(?:section|sec\.?)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Indian\s+Penal\s+Code|IPC))",
    re.IGNORECASE,
)
_CRPC_RE = re.compile(
    r"(?:(?:CrPC|Cr\.?P\.?C\.?|Code\s+of\s+Criminal\s+Procedure)\s+(\d+[A-Z]?)"
    r"|(?:(?:section|sec\.?)\s*)?(\d+[A-Z]?)\s*(?:of\s+)?(?:the\s+)?(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?|CrPC))",
    re.IGNORECASE,
)

_ISSUE_PATTERNS = [
    (re.compile(r"\b(?:bail|anticipatory bail)\b", re.I), "BAIL"),
    (re.compile(r"\b(?:discharge|discharge petition)\b", re.I), "DISCHARGE"),
    (re.compile(r"\b(?:quash|quashing|section 482)\b", re.I), "QUASHING"),
    (re.compile(r"\b(?:evidence|admissibility|witness)\b", re.I), "EVIDENCE"),
    (re.compile(r"\b(?:jurisdiction)\b", re.I), "JURISDICTION"),
    (re.compile(r"\b(?:sentence|sentencing|punishment)\b", re.I), "SENTENCING"),
    (re.compile(r"\b(?:appeal|revision|review)\b", re.I), "APPEAL"),
    (re.compile(r"\b(?:fundamental rights|article 21|constitution)\b", re.I), "CONSTITUTIONAL"),
    (re.compile(r"\b(?:negligence|negligent|rash)\b", re.I), "NEGLIGENCE"),
]

_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "has", "have", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "this", "that", "these", "those",
    "it", "its", "he", "she", "they", "we", "i", "you", "not", "no",
    "court", "case", "matter", "order", "judgment", "petition", "application",
}


def extract_features(case_id: str, title: str, court: str, year: int, text: str,
                     citation_count: int = 0) -> CaseFeatures:
    ipc = list({m.group(1) or m.group(2) for m in _IPC_RE.finditer(text) if m.group(1) or m.group(2)})
    crpc = list({m.group(1) or m.group(2) for m in _CRPC_RE.finditer(text) if m.group(1) or m.group(2)})
    issues = [label for pat, label in _ISSUE_PATTERNS if pat.search(text)]
    words = re.sub(r"[^a-z0-9\s]", " ", text.lower()).split()
    key_terms = list(dict.fromkeys(w for w in words if len(w) > 3 and w not in _STOPWORDS))[:20]
    return CaseFeatures(
        case_id=case_id, title=title, court=court, year=year, text=text,
        ipc_sections=ipc, crpc_sections=crpc, issues=issues, key_terms=key_terms,
        citation_count=citation_count, court_level=_court_level(court),
    )


#  Jaccard similarity 

def _jaccard(a: list[str], b: list[str]) -> float:
    if not a and not b: return 1.0
    sa, sb = {x.lower() for x in a}, {x.lower() for x in b}
    inter = len(sa & sb)
    union = len(sa | sb)
    return inter / union if union else 0.0


def _term_overlap(a: list[str], b: list[str]) -> float:
    if not a or not b: return 0.0
    sb = {x.lower() for x in b}
    matches = sum(1 for t in a if t.lower() in sb)
    return matches / max(len(a), len(b))


#  Scoring layers 

def _score_keywords(q: CaseFeatures, c: CaseFeatures) -> tuple[float, list[str], list[str]]:
    term_sim = _term_overlap(q.key_terms, c.key_terms)
    ipc_sim = _jaccard(q.ipc_sections, c.ipc_sections)
    crpc_sim = _jaccard(q.crpc_sections, c.crpc_sections)
    section_sim = ipc_sim * 0.6 + crpc_sim * 0.4
    combined = term_sim * 0.6 + section_sim * 0.4
    score = round(combined * 35, 1)
    matched_terms = [t for t in q.key_terms if t.lower() in {x.lower() for x in c.key_terms}]
    matched_sections = (
        [f"IPC {s}" for s in q.ipc_sections if s in c.ipc_sections] +
        [f"CrPC {s}" for s in q.crpc_sections if s in c.crpc_sections]
    )
    return score, matched_terms, matched_sections


def _score_issues(q: CaseFeatures, c: CaseFeatures) -> tuple[float, list[str]]:
    sim = _jaccard(q.issues, c.issues)
    score = round(sim * 30, 1)
    matched = [i for i in q.issues if i in c.issues]
    return score, matched


def _score_citation(c: CaseFeatures) -> float:
    if c.citation_count == 0: return 0.0
    court_w = _court_weight(c.court)
    citation_w = min(1.0, math.log(c.citation_count + 1) / math.log(51))
    return round(citation_w * court_w * 20, 1)


def _score_court(q: CaseFeatures, c: CaseFeatures) -> float:
    cw = _court_weight(c.court)
    qw = _court_weight(q.court)
    score = cw * 15
    if q.court_level == c.court_level: score = min(15, score * 1.2)
    if cw > qw: score = min(15, score * 1.1)
    return round(score, 1)


def _assign_tier(score: float) -> SimilarityTier:
    if score >= 70: return SimilarityTier.EXACT
    if score >= 50: return SimilarityTier.ANALOGOUS
    if score >= 30: return SimilarityTier.WEAK
    return SimilarityTier.REJECTED


def score_similarity(query: CaseFeatures, candidate: CaseFeatures) -> SimilarityScore:
    kw_score, matched_terms, matched_sections = _score_keywords(query, candidate)
    issue_score, matched_issues = _score_issues(query, candidate)
    citation_score = _score_citation(candidate)
    court_score = _score_court(query, candidate)
    total = min(100.0, kw_score + issue_score + citation_score + court_score)
    tier = _assign_tier(total)

    parts = []
    if matched_issues: parts.append(f"Matches on: {', '.join(matched_issues)}")
    if matched_sections: parts.append(f"Common sections: {', '.join(matched_sections)}")
    if candidate.court_level == "SUPREME": parts.append("Supreme Court authority")
    explanation = ". ".join(parts) if parts else "Partial overlap — verify before citing"

    return SimilarityScore(
        case_id=candidate.case_id, title=candidate.title,
        court=candidate.court, year=candidate.year,
        total_score=round(total, 1),
        keyword_score=kw_score, issue_score=issue_score,
        citation_score=citation_score, court_score=court_score,
        tier=tier, matched_issues=matched_issues,
        matched_sections=matched_sections, explanation=explanation,
    )


def find_similar_cases(
    query: CaseFeatures,
    corpus: list[CaseFeatures],
    min_score: float = 0,
    max_results: int = 20,
) -> list[SimilarityScore]:
    results = [
        score_similarity(query, c)
        for c in corpus
        if c.case_id != query.case_id
    ]
    results = [r for r in results if r.total_score >= min_score]
    results.sort(key=lambda r: r.total_score, reverse=True)
    return results[:max_results]