"""
Query Intelligence Classifier — Legal Luminaire v3
───────────────────────────────────────────────────
Classifies an incoming legal query across two axes:

  1. Complexity  : simple | standard | complex
     • simple   — factual lookup (case number, FIR date, accused name)
     • standard — single-jurisdiction, clear statutory question
     • complex  — multi-jurisdictional, cross-statute, comparative analysis

  2. Expertise   : layperson | junior | senior
     • layperson — lay client; needs plain-language explanation
     • junior    — law student / junior advocate; needs detailed walkthrough
     • senior    — senior counsel / judge; needs surgical precision, no hand-holding

Both axes together drive:
  - Chunk size passed to the RAG ingestor / retriever
  - Number of top-k chunks retrieved
  - Response tone / verbosity sent to the Drafter agent
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, Any

# ── Classification config ──────────────────────────────────────────────────────

# Keyword sets for heuristic pre-pass (LLM used only if heuristics are ambiguous)
_SIMPLE_KEYWORDS = {
    "accused name", "fir number", "case number", "date of incident",
    "court name", "charge", "section", "act", "what is", "definition of",
    "full form", "meaning of", "when was",
}

_COMPLEX_KEYWORDS = {
    "multi-jurisdictional", "international", "constitutional validity",
    "cross-border", "conflict of laws", "PIL", "writ", "habeas corpus",
    "extradition", "foreign judgment", "compare", "analyse",
    "forensic standard", "chain of custody", "discharge", "quash",
    "anticipatory bail", "expert opinion", "scientific evidence",
    "IS 1199", "IS 2250", "ASTM", "DNA", "forensic", "ballistics",
    "handwriting", "digital evidence",
}

_SENIOR_KEYWORDS = {
    "precise", "verbatim", "binding authority", "ratio decidendi",
    "obiter", "per incuriam", "full bench", "constitutional bench",
    "nine-judge", "seven-judge", "conflicting decisions",
}

_LAYPERSON_KEYWORDS = {
    "explain", "what does", "simple", "easy words", "layman",
    "I don't understand", "means what", "plain language",
}


@dataclass
class QueryProfile:
    complexity: str       # simple | standard | complex
    expertise: str        # layperson | junior | senior
    chunk_strategy: str   # simple | standard | complex  (maps to chunk size)
    k_retrieval: int      # number of chunks to retrieve
    response_mode: str    # concise | detailed | surgical

    def to_dict(self) -> Dict[str, Any]:
        return {
            "complexity": self.complexity,
            "expertise": self.expertise,
            "chunk_strategy": self.chunk_strategy,
            "k_retrieval": self.k_retrieval,
            "response_mode": self.response_mode,
        }


# ── Classifier ─────────────────────────────────────────────────────────────────

def classify_query(query: str, expertise_hint: str | None = None) -> QueryProfile:
    """
    Classify a legal query into a QueryProfile.

    Parameters
    ----------
    query          : raw query string from the user
    expertise_hint : optional override from UI ('layperson'|'junior'|'senior')
    """
    q = query.lower()
    tokens = set(re.findall(r"[\w\s]+", q))

    # ── Complexity ────────────────────────────────────────────────────────
    complex_hits = sum(1 for kw in _COMPLEX_KEYWORDS if kw in q)
    simple_hits  = sum(1 for kw in _SIMPLE_KEYWORDS  if kw in q)

    if complex_hits >= 2 or len(query.split()) > 35:
        complexity = "complex"
    elif simple_hits >= 2 or len(query.split()) < 10:
        complexity = "simple"
    else:
        complexity = "standard"

    # ── Expertise ─────────────────────────────────────────────────────────
    if expertise_hint and expertise_hint in ("layperson", "junior", "senior"):
        expertise = expertise_hint
    elif any(kw in q for kw in _SENIOR_KEYWORDS):
        expertise = "senior"
    elif any(kw in q for kw in _LAYPERSON_KEYWORDS):
        expertise = "layperson"
    else:
        expertise = "junior"   # safe default

    # ── Derived parameters ────────────────────────────────────────────────
    profile_map = {
        # (complexity, expertise) → (chunk_strategy, k, response_mode)
        ("simple",   "layperson"): ("simple",   4, "concise"),
        ("simple",   "junior"):    ("simple",   5, "detailed"),
        ("simple",   "senior"):    ("simple",   4, "surgical"),
        ("standard", "layperson"): ("standard", 6, "concise"),
        ("standard", "junior"):    ("standard", 8, "detailed"),
        ("standard", "senior"):    ("standard", 8, "surgical"),
        ("complex",  "layperson"): ("complex",  8, "detailed"),
        ("complex",  "junior"):    ("complex", 10, "detailed"),
        ("complex",  "senior"):    ("complex", 12, "surgical"),
    }

    chunk_strategy, k_retrieval, response_mode = profile_map[(complexity, expertise)]

    return QueryProfile(
        complexity=complexity,
        expertise=expertise,
        chunk_strategy=chunk_strategy,
        k_retrieval=k_retrieval,
        response_mode=response_mode,
    )


def get_drafter_style_instruction(profile: QueryProfile) -> str:
    """
    Return a style instruction string injected into the Drafter agent's prompt.
    """
    if profile.response_mode == "surgical":
        return (
            "AUDIENCE: Senior counsel / judge. "
            "Be surgically precise. No introductions or explanations. "
            "Lead with the strongest legal argument. "
            "Quote only binding precedents. Omit weak analogical cases."
        )
    elif profile.response_mode == "detailed":
        return (
            "AUDIENCE: Junior advocate / law student. "
            "Provide thorough explanation of each legal point. "
            "Define technical terms. Explain why each precedent is relevant. "
            "Structure arguments step by step."
        )
    else:  # concise
        return (
            "AUDIENCE: Lay client. "
            "Use plain language. Avoid Latin and legal jargon. "
            "Explain the core issue in simple terms first, then state the outcome."
        )
