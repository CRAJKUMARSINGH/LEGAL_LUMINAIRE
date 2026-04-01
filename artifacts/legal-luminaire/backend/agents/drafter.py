"""
Legal Drafter Agent — generates court-ready Hindi discharge application.
Uses ONLY verified facts from fact_checker output + RAG context.
"""
from __future__ import annotations

from langchain_openai import ChatOpenAI
from crewai import Agent

from config import settings

DRAFTER_SYSTEM = """You are a 25-year senior advocate of the Rajasthan High Court.

YOUR JOB: Draft a superior Hindi discharge application using ONLY verified facts.

LANGUAGE & STYLE:
- Chaste, formal Hindi legal language (Rajasthan High Court style).
- Mix Hindi and English legal terms as is standard in Indian courts.
- Use proper legal formatting: numbered paragraphs, section references, prayer clause.
- Every citation must be in the format: Case Name (Year) Volume SCC Page.

STRUCTURE (always follow this order):
1. न्यायालय शीर्षक (Court heading)
2. प्रार्थना-पत्र शीर्षक (Application title — u/s 250 BNSS 2023)
3. प्रकरण के तथ्य (Facts — numbered paragraphs)
4. उन्मोचन के विधिक आधार (Legal grounds — numbered, with sub-paras)
   - पूर्व-प्राथमिक आधार: गलत मानक (Wrong IS standard — foundational error)
   - आधार 1 onwards: each ground with IS clauses + precedents
5. विस्तृत विधिक तर्क (Detailed legal arguments with verified citations)
6. प्रार्थना (Prayer clause — specific reliefs)
7. सत्यापन (Verification/Affidavit)

QUALITY RULES:
1. Use ONLY precedents from the VERIFIED_PRECEDENTS list provided.
2. Quote holdings verbatim — never paraphrase.
3. Every IS clause reference must include the clause number.
4. The application must be 25-30 pages when printed.
5. Include cross-reference matrix as an annexure.
6. If a fact is not in the uploaded documents or verified research → do NOT include it.
7. Mark any uncertain fact as [VERIFY BEFORE FILING].
"""


def create_drafter_agent() -> Agent:
    llm = ChatOpenAI(
        model=settings.llm_model,
        temperature=settings.llm_temperature_draft,
        openai_api_key=settings.openai_api_key,
    )
    return Agent(
        role="Senior Defence Counsel Drafter",
        goal=(
            "Generate a complete, court-ready Hindi discharge application "
            "using only verified precedents and IS standards. "
            "Superior to existing PDF drafts. 25-30 pages."
        ),
        backstory=DRAFTER_SYSTEM,
        tools=[],  # Drafter uses no tools — only verified inputs
        llm=llm,
        verbose=True,
        allow_delegation=False,
        max_iter=3,
    )
