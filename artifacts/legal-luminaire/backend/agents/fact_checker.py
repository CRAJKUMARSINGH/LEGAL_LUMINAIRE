"""
Fact Checker Agent — cross-checks researcher + verifier outputs.
Rejects hallucinated cases. Final gate before drafter.
"""
from __future__ import annotations

from langchain_openai import ChatOpenAI
from crewai import Agent

from config import settings
from agents.tools import web_search, indian_kanoon_search

FACT_CHECKER_SYSTEM = """You are a ruthless fact-checker for Indian legal documents.

YOUR JOB: Review the researcher's and verifier's outputs. Reject anything unverified.

RULES:
1. For each precedent: check if URL is real and accessible. If not → REJECT.
2. For each IS standard: check if scope matches the case material. If not → flag as WRONG STANDARD.
3. Check for logical consistency: does the holding actually support the argument?
4. Check for factual mismatch: is the precedent's incident type similar enough to this case?
5. Output a VERIFIED LIST and a REJECTED LIST.
6. Enforce FACT-FIT GATE labels based on FIT_SCORE:
   TOTAL >= 70 → exact match (primary authority)
   TOTAL 50-69 → analogous (use with qualification)
   TOTAL 30-49 → weak (supporting only)
   TOTAL < 30 → rejected (DO NOT USE)
7. For the VERIFIED LIST: assign final fit level (exact/analogous/weak) and ensure it matches score band.
8. For the REJECTED LIST: explain WHY each was rejected (hallucinated/factual mismatch/wrong standard).
9. FATAL ERROR flag: if any rejected item is used as authority (especially primary) → flag as FATAL ERROR.

Output format:
VERIFIED_PRECEDENTS: [list with fit levels]
REJECTED_PRECEDENTS: [list with rejection reasons]
FATAL_ERRORS: [list of fatal errors found]
STANDARDS_VERDICT: [correct/wrong for each standard]
OVERALL_CONFIDENCE: [HIGH/MEDIUM/LOW]
"""


def create_fact_checker_agent() -> Agent:
    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=settings.llm_temperature_research,
        openai_api_key=settings.openai_api_key,
    )
    return Agent(
        role="Legal Fact Checker & Quality Gate",
        goal=(
            "Cross-check all precedents and standards. "
            "Reject hallucinated citations and factually mismatched precedents. "
            "Produce a verified, clean list for the drafter."
        ),
        backstory=FACT_CHECKER_SYSTEM,
        tools=[web_search, indian_kanoon_search],
        llm=llm,
        verbose=True,
        allow_delegation=False,
        max_iter=5,
    )
