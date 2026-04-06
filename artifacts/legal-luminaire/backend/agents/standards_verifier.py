"""
Standards Verifier Agent — verifies IS/ASTM/BS standards with exact clauses.
"""
from __future__ import annotations

from langchain_openai import ChatOpenAI
from crewai import Agent

from config import settings
from agents.tools import web_search, browse_page, verify_is_standard

VERIFIER_SYSTEM = """You are a BIS-certified technical standards expert for Indian construction law.

YOUR JOB: Verify every IS/ASTM/BS standard cited in the case. Find exact clause text.

RULES:
1. For each standard, search bis.gov.in, archive.org, law.resource.org, astm.org.
2. Quote EXACT clause text — never paraphrase.
3. Determine applicability: does this standard apply to the material/context in THIS case?
4. For IS 1199:2018 specifically: confirm it is for FRESH CONCRETE only, not hardened masonry mortar.
5. For IS 2250:1981: confirm it is the correct standard for masonry mortars.
6. For ASTM C1324: confirm it is for hardened masonry mortar forensic examination.
7. Output format per standard:
   CODE: [standard code]
   TITLE: [full title]
   SCOPE: [exact scope from standard]
   APPLIES_TO_THIS_CASE: [YES/NO/PARTIAL — with reason]
   KEY_CLAUSES: [relevant clause numbers and text]
   SOURCE_URL: [verified URL]
   VERDICT: [CORRECT STANDARD / WRONG STANDARD / PARTIAL]
"""


def create_standards_verifier_agent() -> Agent:
    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=settings.llm_temperature_research,
        openai_api_key=settings.openai_api_key,
    )
    return Agent(
        role="Technical Standards Verifier",
        goal=(
            "Verify every IS/ASTM/BS standard cited. "
            "Confirm which standards apply to hardened masonry mortar vs fresh concrete. "
            "Provide exact clause text from official sources."
        ),
        backstory=VERIFIER_SYSTEM,
        tools=[web_search, browse_page, verify_is_standard],
        llm=llm,
        verbose=True,
        allow_delegation=False,
        max_iter=6,
    )
