"""
Hallucination Circuit Breaker — Legal Luminaire v3
───────────────────────────────────────────────────
Compares the Drafter's output against the retrieved RAG chunks.
If the draft contains legal citations, case names, or IS standard codes
that are NOT grounded in the retrieved context, it raises a
HallucinationDetectedError and returns a BLOCKED status.

Algorithm
─────────
1. Extract all potential citations from draft (regex patterns):
   - Case citations: "XYZ v. ABC (YYYY)" or "(YYYY) N SCC N"
   - IS/ASTM codes: "IS NNNN:YYYY", "ASTM CNNNN"
   - Section references: "s. N", "§ N", "Section N"
2. For each extracted item, check if it appears in ANY retrieved chunk.
3. Items not found in ANY chunk → UNGROUNDED → increment hallucination count.
4. hallucination_score = ungrounded / total_extracted
5. If score > THRESHOLD (default 0.25) → BLOCK output, raise error.
6. Return detailed audit report regardless.
"""
from __future__ import annotations

import hashlib
import logging
import re
from dataclasses import dataclass, field
from typing import List, Dict, Any

from langchain_core.documents import Document

logger = logging.getLogger(__name__)

# Hallucination block threshold (block if >25% items are ungrounded)
HALLUCINATION_THRESHOLD = 0.25

# Regex patterns for extractable legal anchors
_CITATION_PATTERNS = [
    # (YYYY) N SCC N  or  YYYY INSC NNN  or  YYYY SCC OnLine
    r"\(\d{4}\)\s+\d+\s+SCC\s+\d+",
    r"\d{4}\s+INSC\s+\d+",
    r"\d{4}\s+SCC\s+OnLine\s+\w+\s+\d+",
    r"\d{4}\s+\(\d+\)\s+SCC\s+\d+",
    # "State of X v. Y" or "X vs Y"  (first 40 chars captured)
    r"[A-Z][A-Za-z\s]{3,30}\s+[vV](?:s\.?|ersus)\s+[A-Z][A-Za-z\s]{3,30}",
    # IS codes
    r"IS\s+\d{3,5}(?:[:‑\-]\d{4})?(?:\s+Part\s+\d+)?",
    # ASTM codes
    r"ASTM\s+[A-Z]\d{2,5}(?:[-/]\d+)?",
    # Bare section refs inside text
    r"(?:Section|Clause|s\.|§)\s+\d+(?:\.\d+)*",
    # IPC/BNSS/CrPC references
    r"(?:Section|s\.)\s*\d+\s*(?:IPC|BNSS|CrPC|Cr\.P\.C\.?|BNS)",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in _CITATION_PATTERNS]


class HallucinationDetectedError(Exception):
    """Raised when the circuit breaker blocks a hallucinated draft."""
    def __init__(self, report: "HallucinationReport"):
        super().__init__(f"Hallucination detected: score={report.hallucination_score:.2%}")
        self.report = report


@dataclass
class HallucinationReport:
    """Full audit trail produced by the circuit breaker."""
    total_extracted: int = 0
    grounded: List[str] = field(default_factory=list)
    ungrounded: List[str] = field(default_factory=list)
    hallucination_score: float = 0.0
    blocked: bool = False
    verdict: str = "PASS"
    context_hashes: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "verdict": self.verdict,
            "blocked": self.blocked,
            "hallucination_score": round(self.hallucination_score, 4),
            "total_extracted": self.total_extracted,
            "grounded_count": len(self.grounded),
            "ungrounded_count": len(self.ungrounded),
            "ungrounded_items": self.ungrounded[:20],  # cap for UI display
        }


def _extract_anchors(text: str) -> List[str]:
    """Extract all legal anchors (citations, codes, section refs) from text."""
    anchors = []
    for pattern in _COMPILED:
        anchors.extend(m.group().strip() for m in pattern.finditer(text))
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for a in anchors:
        norm = re.sub(r"\s+", " ", a).lower()
        if norm not in seen:
            seen.add(norm)
            unique.append(a)
    return unique


def _build_context_corpus(chunks: List[Document]) -> str:
    """Concatenate all retrieved chunk texts for fast substring search."""
    return "\n".join(c.page_content for c in chunks).lower()


def _normalise(text: str) -> str:
    """Normalise for fuzzy matching (collapse whitespace, lowercase)."""
    return re.sub(r"\s+", " ", text).lower()


def check_hallucination(
    draft_text: str,
    retrieved_chunks: List[Document],
    threshold: float = HALLUCINATION_THRESHOLD,
) -> HallucinationReport:
    """
    Run the hallucination circuit breaker.

    Parameters
    ----------
    draft_text       : full text output from the Drafter agent
    retrieved_chunks : documents returned by hybrid_search / RAG retrieval
    threshold        : hallucination ratio above which output is BLOCKED

    Returns
    -------
    HallucinationReport — always returned; raise flag is set if blocked
    """
    report = HallucinationReport()
    report.context_hashes = [
        hashlib.md5(c.page_content.encode()).hexdigest() for c in retrieved_chunks
    ]

    anchors = _extract_anchors(draft_text)
    report.total_extracted = len(anchors)

    if not anchors:
        # No citations in draft — nothing to verify (pass through)
        report.verdict = "PASS_NO_CITATIONS"
        logger.info("Circuit breaker: no citations detected — pass")
        return report

    corpus = _build_context_corpus(retrieved_chunks)

    for anchor in anchors:
        norm_anchor = _normalise(anchor)
        # A grounded anchor must appear (even partially) in the retrieved corpus
        # We use a sliding substring match for robustness
        found = False
        # Full match
        if norm_anchor in corpus:
            found = True
        else:
            # Partial match: all tokens of the anchor present in corpus
            tokens = norm_anchor.split()
            if len(tokens) >= 2 and all(t in corpus for t in tokens):
                found = True

        if found:
            report.grounded.append(anchor)
        else:
            report.ungrounded.append(anchor)
            logger.warning(f"Ungrounded anchor: '{anchor}'")

    if report.total_extracted > 0:
        report.hallucination_score = len(report.ungrounded) / report.total_extracted

    if report.hallucination_score > threshold:
        report.blocked = True
        report.verdict = f"BLOCKED (score={report.hallucination_score:.2%} > threshold={threshold:.2%})"
        logger.error(
            f"HALLUCINATION CIRCUIT BREAKER TRIGGERED — "
            f"{len(report.ungrounded)}/{report.total_extracted} anchors ungrounded"
        )
    else:
        report.verdict = (
            f"PASS (score={report.hallucination_score:.2%}, "
            f"{len(report.ungrounded)} minor ungrounded items)"
        )
        logger.info(f"Circuit breaker: PASS — score={report.hallucination_score:.2%}")

    return report


def enforce_hallucination_gate(
    draft_text: str,
    retrieved_chunks: List[Document],
    threshold: float = HALLUCINATION_THRESHOLD,
) -> str:
    """
    Run circuit breaker and raise HallucinationDetectedError if blocked.
    Returns the draft text unchanged if it passes.
    """
    report = check_hallucination(draft_text, retrieved_chunks, threshold)
    if report.blocked:
        raise HallucinationDetectedError(report)
    return draft_text
