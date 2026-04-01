"""
Legal Luminaire Multi-Agent Crew.
Orchestrates: Researcher → Standards Verifier → Fact Checker → Drafter
"""
from __future__ import annotations

import logging
from typing import Optional

from crewai import Crew, Task, Process

from agents.researcher import create_researcher_agent
from agents.standards_verifier import create_standards_verifier_agent
from agents.fact_checker import create_fact_checker_agent
from agents.drafter import create_drafter_agent

logger = logging.getLogger(__name__)


def build_research_tasks(
    query: str,
    case_context: str,
    incident_type: str,
    evidence_type: str,
    procedural_defects: list[str],
) -> tuple[list, list]:
    """Build tasks and agents for a research + draft run."""

    researcher = create_researcher_agent()
    verifier = create_standards_verifier_agent()
    checker = create_fact_checker_agent()
    drafter = create_drafter_agent()

    defects_str = ", ".join(procedural_defects) if procedural_defects else "not specified"

    task_research = Task(
        description=f"""
Search and verify ALL precedents relevant to this case.

CASE CONTEXT FROM UPLOADED DOCUMENTS:
{case_context[:3000]}

USER QUERY: {query}

INCIDENT TYPE: {incident_type}
EVIDENCE TYPE: {evidence_type}
PROCEDURAL DEFECTS: {defects_str}

MANDATORY SEARCHES:
1. Search indiankanoon.org for: "chain of custody forensic evidence 2025"
2. Search for: "Kattavellai Devakar Tamil Nadu 2025 INSC 845"
3. Search for: "discharge application section 250 BNSS prima facie"
4. Search for: "IS 1199 2018 fresh concrete scope"
5. Search for: "IS 2250 1981 masonry mortar"
6. Search for: "ASTM C1324 hardened masonry mortar"
7. Search for: "panchnama admissibility evidence 2025 2026"
8. Search for: "natural justice representative sampling forensic"

For EACH precedent found: score it for fact-fit against this case.
Reject any precedent with fit score < 30.
""",
        agent=researcher,
        expected_output=(
            "A structured list of verified precedents with: name, citation, court, date, "
            "URL, fit score (0-100), fit level, verbatim holding, application to this case, "
            "and verification status. Plus a REJECTED list with reasons."
        ),
    )

    task_standards = Task(
        description=f"""
Verify all IS/ASTM/BS standards relevant to this case.

CASE CONTEXT:
{case_context[:2000]}

STANDARDS TO VERIFY (mandatory):
1. IS 1199:2018 — confirm scope is FRESH CONCRETE only
2. IS 2250:1981 — confirm it covers masonry mortars
3. IS 3535:1986 — sampling discipline, representative presence
4. IS 4031 (Parts 1-15) — hydraulic cement testing
5. IS 13311 (Parts 1-2) — NDT of concrete/masonry
6. IS 1905:1987 — unreinforced masonry
7. ASTM C1324 — hardened masonry mortar examination
8. ASTM C780 — mortar sampling, weather protection
9. BS EN 1015-2 — mortar testing, carbonation layer removal
10. NBC 2016/2023 — force majeure / extreme weather
11. CPWD Manual 2023 — contractor representative requirement

For each: find exact clause text, confirm applicability to hardened masonry mortar context.
""",
        agent=verifier,
        expected_output=(
            "For each standard: code, title, exact scope, applicability verdict "
            "(CORRECT/WRONG/PARTIAL), key clause numbers and text, source URL."
        ),
    )

    task_factcheck = Task(
        description="""
Review the researcher's precedent list and verifier's standards list.

1. Cross-check each precedent URL — is it real and accessible?
2. Confirm each IS standard scope matches the case material (hardened masonry mortar).
3. Flag IS 1199:2018 as WRONG STANDARD if used for hardened mortar.
4. Produce final VERIFIED_PRECEDENTS list (with fit levels).
5. Produce REJECTED_PRECEDENTS list with reasons.
6. Flag any FATAL ERRORS (factually mismatched precedents used as primary authority).
7. Assign OVERALL_CONFIDENCE: HIGH/MEDIUM/LOW.
""",
        agent=checker,
        expected_output=(
            "VERIFIED_PRECEDENTS list, REJECTED_PRECEDENTS list, FATAL_ERRORS list, "
            "STANDARDS_VERDICT for each standard, OVERALL_CONFIDENCE rating."
        ),
        context=[task_research, task_standards],
    )

    task_draft = Task(
        description=f"""
Generate a complete, superior Hindi discharge application.

USER REQUEST: {query}

CASE CONTEXT FROM UPLOADED DOCUMENTS:
{case_context[:4000]}

Use ONLY the VERIFIED_PRECEDENTS from the fact checker's output.
Use ONLY the CORRECT standards from the verifier's output.
Do NOT use any REJECTED precedents.
Do NOT use IS 1199:2018 as a valid standard for this case — it is the WRONG standard.

Generate:
1. Complete Hindi discharge application u/s 250 BNSS 2023 (25-30 pages)
2. Cross-reference matrix (violation → IS clause → precedent)
3. Standards validity note (1 page court annexure)
4. Prayer clause with specific reliefs

Mark any uncertain fact as [VERIFY BEFORE FILING].
""",
        agent=drafter,
        expected_output=(
            "Complete court-ready Hindi discharge application with: "
            "court heading, facts, 10+ legal grounds with IS clauses and verified citations, "
            "detailed legal arguments, prayer clause, verification affidavit, "
            "cross-reference matrix, and standards validity note."
        ),
        context=[task_factcheck],
    )

    agents = [researcher, verifier, checker, drafter]
    tasks = [task_research, task_standards, task_factcheck, task_draft]
    return agents, tasks


def run_legal_crew(
    query: str,
    case_context: str,
    incident_type: str = "",
    evidence_type: str = "",
    procedural_defects: Optional[list[str]] = None,
) -> dict:
    """
    Run the full multi-agent crew and return structured results.
    """
    if procedural_defects is None:
        procedural_defects = []

    agents, tasks = build_research_tasks(
        query=query,
        case_context=case_context,
        incident_type=incident_type,
        evidence_type=evidence_type,
        procedural_defects=procedural_defects,
    )

    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
        memory=False,  # Stateless per request; RAG handles memory
    )

    try:
        result = crew.kickoff()
        return {
            "success": True,
            "draft": str(result),
            "tasks_output": [
                {
                    "agent": t.agent.role if t.agent else "unknown",
                    "output": str(t.output) if hasattr(t, "output") else "",
                }
                for t in tasks
            ],
        }
    except Exception as e:
        logger.error(f"Crew execution failed: {e}")
        return {"success": False, "error": str(e), "draft": "", "tasks_output": []}
