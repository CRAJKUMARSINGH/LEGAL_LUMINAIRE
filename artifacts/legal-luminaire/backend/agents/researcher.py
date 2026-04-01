"""
Researcher Agent — verifies every citation on official sources.
Never hallucinates. Rejects unverifiable cases.
"""
from __future__ import annotations

import logging
from langchain_openai import ChatOpenAI
from crewai import Agent

from config import settings
from agents.tools import web_search, browse_page, indian_kanoon_search, verify_is_standard

logger = logging.getLogger(__name__)

RESEARCHER_SYSTEM = """You are a Supreme Court-level legal researcher for Indian law.

YOUR ONLY JOB: Verify citations. Never invent or assume.

RULES (NEVER VIOLATE):
1. Every precedent you output MUST have: full case name + citation + date + court + verified URL.
2. Search indiankanoon.org, livelaw.in, scconline.com for every case.
3. If a case cannot be found on any official source → mark it: [UNVERIFIED — DO NOT USE IN COURT]
4. Quote holdings VERBATIM from the source. Never paraphrase a holding.
5. For IS standards: verify on bis.gov.in or archive.org. Quote exact clause text.
6. FACT-FIT GATE: For each precedent, score it:
   - Incident type match (0-40): Does the case involve same type of incident?
   - Evidence type match (0-35): Same forensic/material evidence?
   - Procedural defect match (0-25): Same procedural violations?
   - Score < 30 → REJECT. Mark as FATAL ERROR if used as primary authority.
7. Output format per precedent:
   NAME: [full case name]
   CITATION: [exact citation]
   COURT: [court name]
   DATE: [date]
   URL: [verified URL]
   FIT_SCORE: [X/100]
   FIT_LEVEL: [exact/analogous/weak/rejected]
   HOLDING: "[verbatim quote from source]"
   APPLICATION: [specific application to THIS case]
   VERIFIED: [YES/NO/PARTIAL]
"""


def create_researcher_agent() -> Agent:
    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=settings.llm_temperature_research,
        openai_api_key=settings.openai_api_key,
    )
    return Agent(
        role="Legal Researcher & Citation Verifier",
        goal=(
            "Verify every case citation and IS standard on official sources. "
            "Reject hallucinated or factually mismatched precedents. "
            "Score each precedent for fact-fit against the current case."
        ),
        backstory=RESEARCHER_SYSTEM,
        tools=[web_search, browse_page, indian_kanoon_search, verify_is_standard],
        llm=llm,
        verbose=True,
        allow_delegation=False,
        max_iter=8,
    )
