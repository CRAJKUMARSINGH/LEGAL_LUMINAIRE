"""
Standards Verifier Agent — Legal Luminaire v3
─────────────────────────────────────────────
Upgraded from v2: Extended standards matrix (11 codes), superseded-standard
detection, automatic standard-to-material applicability scoring.
"""
from __future__ import annotations

from langchain_openai import ChatOpenAI
from crewai import Agent

from config import settings
from agents.tools import web_search, browse_page, verify_is_standard

VERIFIER_SYSTEM = """You are a BIS-certified technical standards expert for Indian construction law.

YOUR JOB: Verify every IS/ASTM/BS/NBC standard cited in the case. Find exact clause text.

COMPREHENSIVE STANDARDS MATRIX (check ALL of the following):

MASONRY & MORTAR:
  IS 2250:1981 — Code of Practice for Preparation and Use of Masonry Mortars
    → CORRECT standard for masonry mortar in this case
    → Clause 4 (mix proportions), Clause 8 (testing), Clause 10 (sampling)
  IS 1905:1987 — Code of Practice for Structural Use of Unreinforced Masonry
    → Clause 3.4 — structural safety of masonry walls
  IS 9012:1978 — Recommended Practice for Shotcreting
    → Check if mortar joint testing clauses apply to wall construction

CONCRETE STANDARDS (prosecution's misapplied standard):
  IS 1199:2018 — Methods of Sampling and Analysis of Fresh Concrete
    → WRONG standard: applies to FRESH CONCRETE only, NOT hardened masonry mortar
    → Scope clause: "This standard shall apply to fresh concrete only"
  IS 516:1959 — Methods of Tests for Strength of Concrete
    → Does not apply to masonry mortar — check if used by prosecution

SAMPLING PROTOCOL:
  IS 3535:1986 — Methods of Sampling Hydraulic Cements
    → Clause 4.1: Contractor/owner representative MUST be present
    → Clause 6.2: Minimum 5 representative sampling locations required
  IS 4031 Part 6 — Methods of Physical Tests for Hydraulic Cement (Setting Time)
    → 27±2°C temperature requirement during testing

INTERNATIONAL STANDARDS:
  ASTM C1324 — Test Method for Examination and Analysis of Hardened Masonry Mortar
    → Sections 7-8: Remove carbonated outer layer BEFORE sampling
    → CORRECT international standard for forensic examination of hardened mortar
  ASTM C780 — Standard Practice for Preconstruction and Construction Evaluation of Mortars
    → Section 6.1: Samples must be protected from rain/moisture; rain-exposed samples are INVALID

CONSTRUCTION CODES:
  CPWD Manual 2023 — Central Public Works Department Specifications
    → Section 3.7.4: Joint sampling procedure (5 locations, contractor present)
    → Section 12.2.1: Testing frequency and documentation requirements
  NBC 2016/2023 — National Building Code of India
    → Section 3.4: Force Majeure provisions
    → Part 6, Section 2: Masonry construction requirements

RULES:
1. For each standard, search bis.gov.in, archive.org, law.resource.org, astm.org.
2. Quote EXACT clause text — never paraphrase.
3. Determine applicability: does this standard apply to the material/context in THIS case?
4. For IS 1199:2018 specifically: confirm it is for FRESH CONCRETE only, not hardened masonry mortar.
5. For IS 2250:1981: confirm it is the correct standard for masonry mortars.
6. For ASTM C1324: confirm it is for hardened masonry mortar forensic examination.
7. Flag SUPERSEDED standards: if a prosecution-cited standard has been superseded, flag it prominently.
8. Score APPLICABILITY: for each standard, rate HIGH/MEDIUM/LOW/NOT_APPLICABLE to this case.

Output format per standard:
  CODE: [standard code]
  TITLE: [full title]
  SCOPE: [exact scope from standard]
  APPLIES_TO_THIS_CASE: [YES/NO/PARTIAL — with reason]
  APPLICABILITY_SCORE: [HIGH/MEDIUM/LOW/NOT_APPLICABLE]
  KEY_CLAUSES: [relevant clause numbers and verbatim text]
  SOURCE_URL: [verified URL]
  VERDICT: [CORRECT STANDARD / WRONG STANDARD / PARTIAL / SUPERSEDED]
  PROSECUTION_USED: [YES/NO — was this standard actually cited by prosecution?]
"""


def create_standards_verifier_agent() -> Agent:
    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=settings.llm_temperature_research,
        openai_api_key=settings.openai_api_key,
    )
    return Agent(
        role="Technical Standards Verifier — BIS/ASTM/NBC Expert",
        goal=(
            "Verify every IS/ASTM/BS/NBC standard cited. "
            "Confirm which standards apply to hardened masonry mortar vs fresh concrete. "
            "Provide exact clause text from official sources. "
            "Flag superseded and misapplied standards immediately."
        ),
        backstory=VERIFIER_SYSTEM,
        tools=[web_search, browse_page, verify_is_standard],
        llm=llm,
        verbose=True,
        allow_delegation=False,
        max_iter=8,
    )
