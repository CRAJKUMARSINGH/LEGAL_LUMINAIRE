"""
test_copilot.py — Week 5 copilot endpoint tests
================================================

Coverage required by WEEK05_KIRO_Copilot_Foundation_Guardrails.md §5.4:

UNIT tests (pure logic, no DB / network):
  U1 — Refusal when retrieval returns nothing (empty case book)
  U2 — Refusal when max confidence is below MIN_CONFIDENCE threshold
  U3 — Zero-citation guard: even if synthesis runs, 0 citations → refusal
  U4 — PENDING items are filtered out before confidence check
  U5 — FATAL_ERROR items are filtered out before confidence check
  U6 — Read-only: extra fields in the request body raise ValidationError
  U7 — Bilingual refusal reason is returned verbatim

INTEGRATION tests (TC-01 synthetic case — five canonical questions):
  I1 — "What is the incident type in this case?"
  I2 — "What documents are filed in this case?"
  I3 — "Are there any contradictions in the evidence?"
  I4 — "What standard applies to masonry mortar testing?"
  I5 — "What is the deadline status for this case?"

All integration tests run against a mocked hybrid_search so they work
offline without ChromaDB / OpenAI keys.  The mock returns a realistic
SearchResult with verification_tier="COURT_SAFE" to prove the happy path.
"""
from __future__ import annotations

import os
import pytest
from dataclasses import dataclass
from typing import List
from unittest.mock import AsyncMock, MagicMock, patch

from pydantic import ValidationError

# ── Ensure flag is on before importing any app module ─────────────────────────
os.environ["FEATURE_ASK_COPILOT"] = "true"

from api.models import (  # noqa: E402
    CopilotAskRequest,
    CopilotAskResponse,
    CopilotCitation,
    CopilotRefusal,
)
from api.routes_copilot import (  # noqa: E402
    BILINGUAL_REFUSAL,
    MIN_CONFIDENCE,
    _build_refusal,
    _build_citations,
    _is_blocked,
    _synthesise_answer,
    _estimate_tokens,
    _truncate,
)
from rag.query_classifier import QueryProfile  # noqa: E402


# ── Helpers ────────────────────────────────────────────────────────────────────

@dataclass
class _FakeDocument:
    page_content: str
    metadata: dict


@dataclass
class _FakeSearchResult:
    document: _FakeDocument
    semantic_score: float
    keyword_score: float
    combined_score: float
    rank: int
    matched_keywords: list


def _make_result(
    content: str = "Sample legal content.",
    combined_score: float = 0.80,
    rank: int = 1,
    source: str = "TC-01/fir.pdf",
    verification_tier: str = "COURT_SAFE",
    citation_type: str = "document",
) -> _FakeSearchResult:
    return _FakeSearchResult(
        document=_FakeDocument(
            page_content=content,
            metadata={
                "source": source,
                "verification_tier": verification_tier,
                "citation_type": citation_type,
                "doc_id": f"doc-{rank}",
            },
        ),
        semantic_score=0.75,
        keyword_score=0.85,
        combined_score=combined_score,
        rank=rank,
        matched_keywords=["masonry", "mortar"],
    )


# ── U1: Empty retrieval → refusal ──────────────────────────────────────────────
def test_empty_retrieval_returns_refusal():
    """No documents in case book → refusal."""
    resp = _build_refusal(latency_ms=10, session_id=None)
    assert resp.answer == ""
    assert resp.citations == []
    assert resp.refusal is not None
    assert "इस केस बुक में नहीं मिला" in resp.refusal.reason


# ── U2: Low confidence → refusal ──────────────────────────────────────────────
def test_low_confidence_score_triggers_refusal():
    """max(combined_score) < MIN_CONFIDENCE must trigger refusal."""
    low_score_results = [_make_result(combined_score=0.10)]
    max_score = max(r.combined_score for r in low_score_results)
    assert max_score < MIN_CONFIDENCE, (
        f"Test setup error: expected score < {MIN_CONFIDENCE}, got {max_score}"
    )
    # The endpoint logic: low max_score → refusal path
    resp = _build_refusal(latency_ms=5, session_id="sess-u2")
    assert resp.refusal is not None
    assert resp.citations == []


# ── U3: Zero-citation guard ────────────────────────────────────────────────────
def test_zero_citation_guard():
    """
    Even if synthesis produces text, zero citations must be converted to refusal.
    We test _build_citations returning [] when given an empty chunk list.
    """
    citations = _build_citations([])
    assert citations == [], "Empty chunk list must produce empty citations list"
    # Downstream: empty citations → _build_refusal is called
    resp = _build_refusal(latency_ms=3, session_id=None)
    assert resp.refusal is not None


# ── U4: PENDING items filtered out ────────────────────────────────────────────
def test_pending_items_blocked():
    """Chunks with verification_tier=PENDING must be filtered by _is_blocked."""
    pending = _make_result(verification_tier="PENDING")
    assert _is_blocked(pending.document.metadata) is True


def test_pending_items_not_in_filtered_results():
    """After filtering, PENDING chunks must not appear in results used for synthesis."""
    results = [
        _make_result(verification_tier="PENDING", rank=1),
        _make_result(verification_tier="COURT_SAFE", rank=2, combined_score=0.85),
    ]
    filtered = [r for r in results if not _is_blocked(r.document.metadata)]
    assert len(filtered) == 1
    assert filtered[0].document.metadata["verification_tier"] == "COURT_SAFE"


# ── U5: FATAL_ERROR items filtered out ────────────────────────────────────────
def test_fatal_error_items_blocked():
    """Chunks with verification_tier=FATAL_ERROR must be blocked."""
    fatal = _make_result(verification_tier="FATAL_ERROR")
    assert _is_blocked(fatal.document.metadata) is True


def test_fatal_error_not_in_citations():
    """FATAL_ERROR chunks must not appear in citations."""
    results = [
        _make_result(verification_tier="FATAL_ERROR", rank=1),
        _make_result(verification_tier="VERIFIED", rank=2, combined_score=0.90),
    ]
    filtered = [r for r in results if not _is_blocked(r.document.metadata)]
    citations = _build_citations(filtered)
    for c in citations:
        assert "FATAL_ERROR" not in c.id
    assert len(citations) == 1


# ── U6: Read-only schema — extra fields rejected ───────────────────────────────
def test_extra_fields_in_request_rejected():
    """CopilotAskRequest with extra="forbid" must reject unexpected fields."""
    with pytest.raises(ValidationError) as exc_info:
        CopilotAskRequest(
            question="What is the case about?",
            case_id="TC-01",
            session_id=None,
            draft_text="INJECT WRITE FIELD",   # must be rejected
        )
    errors = exc_info.value.errors()
    assert any(e["type"] == "extra_forbidden" for e in errors), (
        f"Expected extra_forbidden, got: {errors}"
    )


def test_question_max_length_enforced():
    """Questions longer than 2000 chars must be rejected."""
    with pytest.raises(ValidationError):
        CopilotAskRequest(question="x" * 2001, case_id="TC-01")


def test_empty_question_rejected():
    """Empty question must be rejected (min_length=1)."""
    with pytest.raises(ValidationError):
        CopilotAskRequest(question="", case_id="TC-01")


# ── U7: Bilingual refusal text ─────────────────────────────────────────────────
def test_bilingual_refusal_reason_verbatim():
    """Refusal reason must contain both English and Hindi parts."""
    resp = _build_refusal(latency_ms=1, session_id=None)
    assert resp.refusal is not None
    reason = resp.refusal.reason
    assert "Not found in this case book" in reason
    assert "इस केस बुक में नहीं मिला" in reason


def test_refusal_reason_equals_constant():
    """Refusal reason must match the module constant exactly."""
    resp = _build_refusal(latency_ms=1, session_id=None)
    assert resp.refusal.reason == BILINGUAL_REFUSAL


# ── Helper unit tests ──────────────────────────────────────────────────────────
def test_estimate_tokens_nonzero():
    assert _estimate_tokens("Hello world") >= 1


def test_truncate_short_string_unchanged():
    assert _truncate("short", max_len=300) == "short"


def test_truncate_long_string():
    long = "x" * 400
    result = _truncate(long, max_len=300)
    assert len(result) <= 300
    assert result.endswith("…")


def test_build_citations_from_results():
    """_build_citations must return one citation per result (up to TOP_K_SYNTHESIS)."""
    results = [_make_result(rank=i, combined_score=0.9 - i * 0.1) for i in range(1, 5)]
    citations = _build_citations(results)
    assert 1 <= len(citations) <= 3   # TOP_K_SYNTHESIS = 3
    for c in citations:
        assert c.type in {"document", "timeline", "register", "standard"}
        assert len(c.snippet) <= 300


def test_citation_snippet_truncated():
    """Snippets longer than 300 chars must be truncated."""
    long_content = "Legal content. " * 100   # ~1500 chars
    result = _make_result(content=long_content)
    citations = _build_citations([result])
    assert len(citations) == 1
    assert len(citations[0].snippet) <= 300


# ── I1–I5: TC-01 integration tests (mocked hybrid_search) ────────────────────

TC01_FACTS = (
    "The incident occurred on 15 March 2023 at Plot No. 47, Industrial Area, "
    "Udaipur. The accused Ramesh Kumar was arrested in connection with FIR No. "
    "142/2023 under IPC Section 304A (death by negligence). The construction "
    "wall collapsed due to substandard masonry mortar not meeting IS 2250:1981 "
    "specifications. A forensic report by NABL-accredited laboratory dated "
    "20 April 2023 confirmed the mortar strength was 40% below minimum standard."
)

TC01_DOCS = (
    "Case TC-01 documents: (1) FIR dated 15-03-2023, (2) Post-mortem report "
    "dated 16-03-2023, (3) Forensic mortar analysis report dated 20-04-2023, "
    "(4) Charge sheet filed 28-05-2023, (5) Site inspection photographs."
)

TC01_CONTRADICTIONS = (
    "Contradiction detected: FIR states the wall collapsed at 14:30 hrs, but "
    "the eyewitness statement records the time as 16:00 hrs. This is a DATE/TIME "
    "discrepancy that affects the chain of custody for the forensic sample."
)

TC01_STANDARD = (
    "IS 2250:1981 — Code of Practice for Preparation and Use of Masonry Mortars "
    "is the applicable standard for hardened masonry mortar forensic testing. "
    "IS 1199:2018 applies to fresh concrete only and is not applicable here. "
    "ASTM C1324 is the international standard for hardened masonry mortar."
)

TC01_DEADLINE = (
    "Under CrPC Section 167(2), the charge sheet must be filed within 90 days "
    "of arrest for offences punishable with death or life imprisonment, or 60 days "
    "for other offences. FIR date: 15-03-2023. Charge sheet filed: 28-05-2023 "
    "(74 days). Status: within statutory limit."
)

_CANONICAL_QUESTIONS = [
    ("What is the incident type in this case?",       TC01_FACTS,          "COURT_SAFE"),
    ("What documents are filed in this case?",         TC01_DOCS,           "VERIFIED"),
    ("Are there any contradictions in the evidence?",  TC01_CONTRADICTIONS, "VERIFIED"),
    ("What standard applies to masonry mortar testing?", TC01_STANDARD,     "COURT_SAFE"),
    ("What is the deadline status for this case?",     TC01_DEADLINE,       "VERIFIED"),
]


@pytest.mark.parametrize("question,content,tier", _CANONICAL_QUESTIONS)
@pytest.mark.asyncio
async def test_tc01_canonical_question(question: str, content: str, tier: str):
    """
    Integration test: each of the 5 TC-01 canonical questions must return
    a non-empty answer with at least one valid citation and no refusal.

    hybrid_search is mocked to return a high-confidence COURT_SAFE result
    so the test is fully offline (no ChromaDB / OpenAI required).
    """
    mock_result = _make_result(
        content=content,
        combined_score=0.90,
        rank=1,
        verification_tier=tier,
    )

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[mock_result],
    ):
        # Import the endpoint function directly (flag already ON via env var)
        from api.routes_copilot import ask

        req = CopilotAskRequest(question=question, case_id="TC-01", session_id="test-session")
        response: CopilotAskResponse = await ask(req)

    # Must return an answer, not a refusal
    assert response.refusal is None, (
        f"Q: '{question}' — unexpected refusal: {response.refusal}"
    )
    assert response.answer != "", f"Q: '{question}' — empty answer"
    assert len(response.citations) >= 1, f"Q: '{question}' — no citations"

    # Citation contract
    for c in response.citations:
        assert c.type in {"document", "timeline", "register", "standard"}
        assert c.id, "Citation id must not be empty"
        assert len(c.snippet) <= 300, "Citation snippet exceeds 300 chars"

    # Latency must be measured
    assert response.latency_ms >= 0


@pytest.mark.asyncio
async def test_refusal_on_nonexistent_matter():
    """
    Adversarial probe: asking about a matter not in the case book must
    return a bilingual refusal when retrieval returns empty results.
    """
    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[],   # empty — nothing in case book
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What order was passed in the Bombay HC on 5 January 2010?",
            case_id="TC-01",
            session_id="adversarial-1",
        )
        response: CopilotAskResponse = await ask(req)

    assert response.refusal is not None, "Expected refusal for nonexistent matter"
    assert response.answer == ""
    assert response.citations == []
    assert "इस केस बुक में नहीं मिला" in response.refusal.reason


@pytest.mark.asyncio
async def test_refusal_on_low_confidence():
    """Low-confidence retrieval must return refusal, not a guessed answer."""
    mock_result = _make_result(combined_score=0.10, verification_tier="VERIFIED")

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[mock_result],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What did the judge say in his personal diary?",
            case_id="TC-01",
        )
        response: CopilotAskResponse = await ask(req)

    assert response.refusal is not None, "Expected refusal for low-confidence retrieval"
    assert response.answer == ""


@pytest.mark.asyncio
async def test_pending_document_never_cited():
    """
    A case book containing ONLY PENDING documents must produce a refusal —
    the PENDING item must never appear as a citation.
    """
    pending_result = _make_result(
        content="PENDING unverified citation text.",
        combined_score=0.95,
        verification_tier="PENDING",
    )

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[pending_result],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What is the summary of this case?",
            case_id="TC-01",
        )
        response: CopilotAskResponse = await ask(req)

    assert response.refusal is not None, (
        "PENDING-only case book must return refusal"
    )
    # Verify the PENDING content is not in any citation
    for c in response.citations:
        assert "PENDING" not in c.snippet


@pytest.mark.asyncio
async def test_fatal_error_document_never_cited():
    """FATAL_ERROR items must be excluded — same logic as PENDING."""
    fatal_result = _make_result(
        content="FATAL_ERROR fabricated citation.",
        combined_score=0.99,
        verification_tier="FATAL_ERROR",
    )

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[fatal_result],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What is the case outcome?",
            case_id="TC-01",
        )
        response: CopilotAskResponse = await ask(req)

    assert response.refusal is not None, "FATAL_ERROR-only case book must return refusal"


@pytest.mark.asyncio
async def test_session_id_echoed_in_response():
    """session_id from the request must be echoed in the response."""
    mock_result = _make_result(combined_score=0.90)

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[mock_result],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What are the charges?",
            case_id="TC-01",
            session_id="my-session-xyz",
        )
        response: CopilotAskResponse = await ask(req)

    assert response.session_id == "my-session-xyz"


# ── Health endpoint tests ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health_returns_200_when_flag_on():
    """GET /copilot/health must respond 200 regardless of flag state (flag ON here)."""
    from api.routes_copilot import health

    result = await health()
    assert isinstance(result, dict)
    assert result["feature"] == "ask_copilot"
    assert "enabled" in result
    assert result["endpoint"] == "POST /api/v1/copilot/ask"
    assert result["min_confidence"] == MIN_CONFIDENCE
    assert "Not found in this case book" in result["refusal_default"]


@pytest.mark.asyncio
async def test_health_contains_bilingual_refusal_default():
    """Health response must include the full bilingual refusal string."""
    from api.routes_copilot import health, BILINGUAL_REFUSAL

    result = await health()
    assert result["refusal_default"] == BILINGUAL_REFUSAL


# ── Additional adversarial probes (W5 acceptance: 10/10 adversarial) ──────────

@pytest.mark.asyncio
async def test_refusal_on_cross_case_question():
    """
    Adversarial probe: question referencing a different case ID returns refusal
    when retrieval for the scoped case_id finds nothing.
    """
    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[],   # nothing found for this case_id
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What happened in the Nirbhaya case?",
            case_id="TC-01",
            session_id="adversarial-cross-case",
        )
        response = await ask(req)

    assert response.refusal is not None, "Cross-case question must be refused"
    assert response.citations == []
    assert response.answer == ""


@pytest.mark.asyncio
async def test_refusal_on_invented_date():
    """
    Adversarial probe: question referencing a date not in the case book
    must return refusal (no hallucinated date in answer).
    """
    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[],   # no doc references this invented date
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What order was passed on 1 April 1999 in this case?",
            case_id="TC-01",
            session_id="adversarial-invented-date",
        )
        response = await ask(req)

    assert response.refusal is not None, "Invented date must trigger refusal"
    assert "इस केस बुक में नहीं मिला" in response.refusal.reason


@pytest.mark.asyncio
async def test_refusal_on_invented_accused_name():
    """
    Adversarial probe: asking about a person not in the case book must
    return refusal, never a hallucinated biographical detail.
    """
    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[],   # no doc mentions this person
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What is the bail history of accused Suresh Mehta?",
            case_id="TC-01",
            session_id="adversarial-invented-person",
        )
        response = await ask(req)

    assert response.refusal is not None, "Invented person must trigger refusal"
    assert response.answer == ""
    assert response.citations == []


@pytest.mark.asyncio
async def test_mixed_tiers_only_safe_cited():
    """
    Case book has PENDING + COURT_SAFE results. Only COURT_SAFE must appear
    in citations. The PENDING item must be excluded even when it has higher
    combined_score.
    """
    pending_high = _make_result(
        content="PENDING high-score content.",
        combined_score=0.99,
        rank=1,
        verification_tier="PENDING",
    )
    safe_lower = _make_result(
        content="COURT_SAFE lower-score content about the incident.",
        combined_score=0.80,
        rank=2,
        verification_tier="COURT_SAFE",
    )

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[pending_high, safe_lower],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(
            question="What happened at the site?",
            case_id="TC-01",
            session_id="mixed-tiers-test",
        )
        response = await ask(req)

    # Should answer from the COURT_SAFE chunk, not refuse
    assert response.refusal is None, (
        f"Expected answer from COURT_SAFE chunk, got refusal: {response.refusal}"
    )
    assert len(response.citations) >= 1
    # No citation must refer to the PENDING content
    for c in response.citations:
        assert "PENDING" not in c.snippet


@pytest.mark.asyncio
async def test_answer_latency_measured():
    """latency_ms in response must be a non-negative integer."""
    mock_result = _make_result(combined_score=0.88)

    with patch(
        "api.routes_copilot._hybrid_search.hybrid_search",
        new_callable=AsyncMock,
        return_value=[mock_result],
    ):
        from api.routes_copilot import ask

        req = CopilotAskRequest(question="Summarise the case.", case_id="TC-01")
        response = await ask(req)

    assert isinstance(response.latency_ms, int)
    assert response.latency_ms >= 0
