"""
Legal Luminaire Multi-Agent Crew v2.
Pipeline: Researcher → Standards Verifier → Fact Checker → Drafter
Each agent actively uses tools. Drafter uses only verified outputs.
"""
from __future__ import annotations

import logging
from typing import Any

from crewai import Crew, Task, Process

from agents.researcher import create_researcher_agent
from agents.standards_verifier import create_standards_verifier_agent
from agents.fact_checker import create_fact_checker_agent
from agents.drafter import create_drafter_agent

logger = logging.getLogger(__name__)


def run_legal_crew(
    query: str,
    case_context: str,
    incident_type: str = "construction wall collapse forensic mortar sampling",
    evidence_type: str = "material sampling forensic lab report chain of custody",
    procedural_defects: list[str] | None = None,
    mode: str = "draft",
) -> dict[str, Any]:
    """
    Run the full 4-agent pipeline.
    Returns dict with success, draft, tasks_output, error.
    """
    if procedural_defects is None:
        procedural_defects = [
            "no panchnama", "no chain of custody", "no contractor representative",
            "wrong IS standard (IS 1199 used instead of IS 2250)",
            "rain/storm sampling", "no sealing", "no FSL inward register",
        ]

    defects_str = "; ".join(procedural_defects)
    ctx_snippet = case_context[:2500] if case_context else "[No uploaded documents]"

    researcher = create_researcher_agent()
    verifier = create_standards_verifier_agent()
    checker = create_fact_checker_agent()
    drafter = create_drafter_agent()

    # ── Task 1: Research & verify precedents ──────────────────────────────────
    task_research = Task(
        description=f"""
CASE CONTEXT (from uploaded documents):
{ctx_snippet}

USER QUERY: {query}
INCIDENT TYPE: {incident_type}
EVIDENCE TYPE: {evidence_type}
PROCEDURAL DEFECTS: {defects_str}

YOUR TASK — Search and verify ALL relevant precedents:

DATABASES TO SEARCH (in order of priority; use best accessible source):
1. Manupatra — Indian SC/HC judgments (primary)
2. SCC Online — Supreme Court cases
3. Indian Kanoon — full-text search
4. Lexis Nexis India — annotated cases
5. BAILII / Westlaw — international precedents
6. BIS Portal — IS codes (bis.gov.in)
7. ASTM International — technical standards
8. CPWD Manual 2023 — construction norms

FACT-FIT GATE (MANDATORY — DO NOT SKIP):
For EACH precedent you retrieve, you MUST score it on:
  [A] Incident type match (0-40 pts)
  [B] Evidence type match (0-35 pts)
  [C] Procedural defect match (0-25 pts)
  TOTAL >= 70 → "exact match" (use as primary authority)
  TOTAL 50-69 → "analogous" (use with qualification)
  TOTAL 30-49 → "weak" (supporting only)
  TOTAL < 30 → "rejected" — DO NOT USE. Mark as FATAL ERROR if used.

MANDATORY SEARCHES (use web_search + indian_kanoon_search for each):
1. "Kattavellai Devakar State Tamil Nadu 2025 INSC 845 chain of custody"
2. "Union of India Prafulla Kumar Samal 1979 3 SCC 4 discharge"
3. "State Bihar Ramesh Singh 1977 4 SCC 39 discharge prima facie"
4. "Jacob Mathew State Punjab 2005 6 SCC 1 negligence"
5. "State Maharashtra Damu 2000 6 SCC 269 forensic evidence"
6. "State Punjab Baldev Singh 1999 6 SCC 172 mandatory procedure"
7. "Uttarakhand High Court chain of custody forensic 2026"
8. "Rajasthan High Court school collapse Piplodi Banswara 2025"
9. "Sushil Sharma State Delhi 2014 4 SCC 317 expert opinion"

For EACH precedent found:
- Verify on indiankanoon.org using indian_kanoon_search tool
- Use browse_page to read the actual judgment text
- Score fact-fit: incident match (0-40) + evidence match (0-35) + procedural match (0-25)
- Quote the EXACT holding verbatim from the source
- Mark as VERIFIED/SECONDARY/PENDING/REJECTED

Output structured list of verified precedents with all fields.
""",
        agent=researcher,
        expected_output="Structured list of verified precedents with citations, holdings, fit scores, and source URLs.",
    )

    # ── Task 2: Verify IS/ASTM standards ─────────────────────────────────────
    task_verify_standards = Task(
        description=f"""
CASE CONTEXT: {ctx_snippet[:1000]}

YOUR TASK — Verify ALL IS/ASTM/BS standards relevant to this case:

Use verify_is_standard tool for each:
1. IS 1199:2018 — confirm it is for FRESH CONCRETE only (prosecution's error)
2. IS 2250:1981 — confirm it is the CORRECT standard for masonry mortar
3. IS 3535:1986 — confirm Clause 4.1 (contractor representative) and Clause 6.2 (5 locations)
4. IS 4031 (Part 6) — confirm 27±2°C temperature requirement
5. ASTM C1324 — confirm Sections 7-8 (carbonated layer removal)
6. ASTM C780 — confirm Section 6.1 (rain/moisture protection)
7. CPWD Manual 2023 — confirm Sections 3.7.4 and 12.2.1 (joint sampling)
8. NBC 2016/2023 — confirm Section 3.4 (Force Majeure)

Also use web_search to find exact clause text from archive.org or bis.gov.in.

Output: For each standard — CODE, TITLE, SCOPE, APPLIES_TO_THIS_CASE, KEY_CLAUSES, SOURCE_URL, VERDICT.
""",
        agent=verifier,
        expected_output="Verified standards list with scope, applicability verdict, key clauses, and source URLs.",
        context=[task_research],
    )

    # ── Task 3: Fact-check and produce clean verified list ────────────────────
    task_fact_check = Task(
        description=f"""
Review the researcher's precedents and verifier's standards outputs.

YOUR TASK:
1. For each precedent: use verify_citation_url to check if the URL is accessible.
2. Check logical consistency: does the holding actually support the defence argument?
3. Check fact-fit: is the precedent's incident type similar enough to this case?
   - This case: stadium wall collapse, forensic mortar sampling, chain of custody failure
4. Separate into VERIFIED_LIST (safe to use) and REJECTED_LIST (do not use).
5. Flag FATAL ERRORS: any rejected item being used as primary authority.
6. For IS standards: confirm IS 1199:2018 is WRONG for hardened mortar.
7. Assign final confidence: HIGH/MEDIUM/LOW for each precedent.

KNOWN SAFE PRECEDENTS (always include if researcher found them):
- Kattavellai 2025 INSC 845 — VERIFIED, BINDING
- Prafulla Kumar Samal (1979) 3 SCC 4 — VERIFIED
- Ramesh Singh (1977) 4 SCC 39 — VERIFIED
- Jacob Mathew (2005) 6 SCC 1 — VERIFIED
- State of Maharashtra v. Damu (2000) 6 SCC 269 — VERIFIED
- State of Punjab v. Baldev Singh (1999) 6 SCC 172 — VERIFIED

KNOWN PENDING (flag, do not use as primary):
- R.B. Constructions (2014 SCC OnLine Bom 125) — PENDING
- K.S. Kalra (2011 SCC OnLine Del 3412) — PENDING
- Builders Association v. State of UP (2018) — PENDING
- Mohanbhai (2003) 4 GLR 3121 — PENDING

Output: VERIFIED_LIST, REJECTED_LIST, FATAL_ERRORS, STANDARDS_VERDICT, OVERALL_CONFIDENCE.
""",
        agent=checker,
        expected_output="Clean verified list of precedents and standards, with rejected list and fatal errors flagged.",
        context=[task_research, task_verify_standards],
    )

    # ── Task 4: Draft the discharge application ───────────────────────────────
    draft_instruction = (
        "Using ONLY the verified precedents and standards from the fact-checker's output,\n"
        "and the case context from uploaded documents:\n\n"
        f"CASE CONTEXT: {ctx_snippet}\n"
        f"USER QUERY: {query}\n"
        f"MODE: {mode}\n\n"
    )

    if mode == "draft":
        draft_instruction += (
            "GENERATE FULL HINDI DISCHARGE APPLICATION:\n\n"
            "Structure (mandatory):\n"
            "1. न्यायालय शीर्षक - Special Session Case No. 1/2025, Udaipur\n"
            "2. प्रार्थना-पत्र शीर्षक - u/s 250 BNSS 2023 / 227 CrPC\n"
            "3. प्रकरण के तथ्य - FIR 496/2011, stadium wall collapse, rain sampling\n"
            "4. पूर्व-प्राथमिक आधार - FOUNDATIONAL SCIENTIFIC ERROR: IS 1199:2018 WRONG STANDARD (fresh v. hardened mismatch)\n"
            "5. आधार 1-12 - each ground with IS 2250 / ASTM C1324 / IS 3535 clauses + verified precedents\n"
            "6. विस्तृत विधिक तर्क - 5 argument blocks\n"
            "7. क्रॉस-रेफरेंस मैट्रिक्स - violation -> IS clause -> precedent table\n"
            "8. 5 मौखिक-बहस अनुच्छेद - oral argument paragraphs\n"
            "9. प्रार्थना - 7 specific reliefs\n"
            "10. सत्यापन + शपथ-पत्र\n"
            "11. फाइलिंग चेकलिस्ट\n\n"
            "QUALITY RULES:\n"
            "- Chaste Hindi, Rajasthan High Court style\n"
            "- Quote holdings VERBATIM from verified list only\n"
            "- Every IS clause must have clause number\n"
            "- Mark uncertain facts as [VERIFY BEFORE FILING]\n"
            "- Target: 25-30 pages when printed\n"
        )
    else:
        draft_instruction += "GENERATE RESEARCH REPORT:\n"

    task_draft = Task(
        description=draft_instruction,
        agent=drafter,
        expected_output=(
            "Complete court-ready Hindi discharge application (25-30 pages) with "
            "cross-reference matrix, oral arguments, prayer, and filing checklist."
            if mode == "draft"
            else "Research report with verified precedents, standards analysis, and argument blocks."
        ),
        context=[task_research, task_verify_standards, task_fact_check],
    )

    crew = Crew(
        agents=[researcher, verifier, checker, drafter],
        tasks=[task_research, task_verify_standards, task_fact_check, task_draft],
        process=Process.sequential,
        verbose=True,
    )

    try:
        result = crew.kickoff()
        tasks_output = []
        agent_names = ["researcher", "standards_verifier", "fact_checker", "drafter"]
        for i, task_result in enumerate(crew.tasks):
            agent_name = agent_names[i] if i < len(agent_names) else f"agent_{i}"
            output_text = ""
            if hasattr(task_result, "output") and task_result.output:
                output_text = str(task_result.output)
            tasks_output.append({"agent": agent_name, "output": output_text})

        final_output = str(result) if result else ""
        return {
            "success": True,
            "draft": final_output,
            "tasks_output": tasks_output,
            "error": None,
        }
    except Exception as e:
        logger.error(f"Crew execution failed: {e}", exc_info=True)
        return {
            "success": False,
            "draft": "",
            "tasks_output": [],
            "error": str(e),
        }


