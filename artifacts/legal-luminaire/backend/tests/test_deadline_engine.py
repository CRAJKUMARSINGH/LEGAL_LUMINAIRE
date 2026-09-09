"""
test_deadline_engine.py — Week 9 Limitation & Deadline Engine tests
====================================================================

Coverage required by WEEK09_KIRO_Limitation_Deadline_Engine.md §9.2 + §9.4:

UNIT tests (pure engine logic — no file I/O):
  U01 — load_rules() returns non-empty list of LimitationRule objects
  U02 — every rule has a non-empty source_note
  U03 — every rule has a non-empty id (no duplicates)
  U04 — compute_deadline with valid date returns ComputedDeadline with due_date set
  U05 — compute_deadline with None event_date → CANNOT_COMPUTE, due_date is None
  U06 — CANNOT_COMPUTE basis_en contains bilingual "cannot compute" text
  U07 — CANNOT_COMPUTE days_remaining is None (never 0 or negative)
  U08 — calendar rule: due_date = event_date + period_days exactly
  U09 — working-day rule: effective calendar days = period_days × 1.4
  U10 — working-day basis_en contains the factor note
  U11 — compute_all returns one item per rule
  U12 — compute_all sort: computable items before CANNOT_COMPUTE
  U13 — compute_all sort: computable items ordered by due_date ascending
  U14 — format_deadline_summary CANNOT_COMPUTE contains bilingual text
  U15 — format_deadline_summary non-compute contains status and due_date
  U16 — format_copilot_citation_snippet ≤ 300 chars always
  U17 — format_copilot_citation_snippet contains rule_id

BOUNDARY / PROPERTY tests:
  B01 — month-end date (31 Jan + 31 days → 3 Mar, non-leap)
  B02 — month-end date (28 Feb + 1 day → 1 Mar, non-leap)
  B03 — leap-year boundary (29 Feb + 1 day → 1 Mar)
  B04 — year-boundary (31 Dec + 1 day → 1 Jan next year)
  B05 — large period (1095 days / 3 years)
  B06 — period of 1 day
  B07 — status OVERDUE when due_date < today
  B08 — status URGENT when 0 ≤ days_remaining ≤ 14
  B09 — status WARNING when 15 ≤ days_remaining ≤ 30
  B10 — status UPCOMING when days_remaining > 30

TC-01 HAND-COMPUTED VERIFICATION tests:
  V01 — CRPC-167-90D: arrest 2023-03-20 + 90d = 2023-06-18 (OVERDUE vs 2026-09-08)
  V02 — CRPC-167-60D: arrest 2023-03-20 + 60d = 2023-05-19 (OVERDUE)
  V03 — CRPC-173-FINAL: fir 2023-03-15 + 90d = 2023-06-13 (OVERDUE)
  V04 — FSL-REPORT-RECEIPT: fsl_sample 2023-03-22 + 60d = 2023-05-21 (OVERDUE)
  V05 — APPEAL-SC-SLP-90D: hc_order_date=null → CANNOT_COMPUTE

COPILOT HOOK tests:
  C01 — format_copilot_citation_snippet for CANNOT_COMPUTE contains rule_id + event_type
  C02 — format_copilot_citation_snippet for computed deadline contains due_date
  C03 — snippet is always ≤ 300 chars regardless of long rule name
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Optional
from unittest.mock import patch

import pytest

# ── Engine imports ────────────────────────────────────────────────────────────
from services.limitation_engine import (
    WORKING_DAY_FACTOR,
    ComputedDeadline,
    LimitationRule,
    _build_basis_en,
    _build_basis_hi,
    _calendar_days,
    _compute_status,
    compute_all,
    compute_deadline,
    format_copilot_citation_snippet,
    format_deadline_summary,
    load_rules,
)

# ── Paths ─────────────────────────────────────────────────────────────────────
_SERVICES_DIR = Path(__file__).parent.parent / "services"
_RULES_PATH   = _SERVICES_DIR / "limitation_rules.json"
_TC01_EVENTS  = (
    Path(__file__).parent.parent
    / "uploaded_cases" / "TC-01" / "TC-01_Deadline_Events.json"
)

# ── Reference date for status tests (fixed so tests never go stale) ───────────
# All TC-01 event dates are in 2023 → all computable items are OVERDUE vs 2026-09-08
_REF_DATE = date(2026, 9, 8)


# ── Helper factories ──────────────────────────────────────────────────────────

def _make_rule(
    rule_id: str = "TEST-RULE",
    event_type: str = "arrest_date",
    period_days: int = 90,
    period_basis: str = "calendar",
    name: str = "Test Rule",
    name_hi: str = "परीक्षण नियम",
    source_note: str = "ILLUSTRATIVE. Test only.",
) -> LimitationRule:
    return LimitationRule(
        id=rule_id,
        name=name,
        name_hi=name_hi,
        statute="CrPC",
        section="§167(2)",
        event_type=event_type,
        period_days=period_days,
        period_basis=period_basis,
        applies_to="Test applies_to",
        extension_rule="Test extension",
        consequence="Test consequence",
        consequence_hi="परीक्षण परिणाम",
        source_note=source_note,
        blocked_from_draft=False,
    )


# ══════════════════════════════════════════════════════════════════════════════
# UNIT TESTS
# ══════════════════════════════════════════════════════════════════════════════

class TestLoadRules:

    def test_u01_load_rules_returns_nonempty_list(self):
        """U01 — load_rules() returns a non-empty list."""
        rules = load_rules(_RULES_PATH)
        assert isinstance(rules, list)
        assert len(rules) >= 10, f"Expected ≥ 10 rules, got {len(rules)}"

    def test_u02_every_rule_has_source_note(self):
        """U02 — every rule has a non-empty source_note (accuracy requirement)."""
        rules = load_rules(_RULES_PATH)
        for r in rules:
            assert r.source_note, f"Rule {r.id} has empty source_note"
            assert len(r.source_note) > 10, (
                f"Rule {r.id} source_note too short: '{r.source_note}'"
            )

    def test_u03_rule_ids_are_unique(self):
        """U03 — no duplicate rule IDs."""
        rules = load_rules(_RULES_PATH)
        ids = [r.id for r in rules]
        assert len(ids) == len(set(ids)), "Duplicate rule IDs found in limitation_rules.json"

    def test_u03b_all_rules_have_nonempty_ids(self):
        """U03b — every rule has a non-empty id."""
        rules = load_rules(_RULES_PATH)
        for r in rules:
            assert r.id and r.id.strip(), "Found rule with empty id"

    def test_u03c_all_rules_have_bilingual_names(self):
        """U03c — every rule has non-empty name (EN) and name_hi (HI)."""
        rules = load_rules(_RULES_PATH)
        for r in rules:
            assert r.name, f"Rule {r.id}: empty English name"
            assert r.name_hi, f"Rule {r.id}: empty Hindi name"

    def test_u03d_period_days_positive(self):
        """U03d — every rule has period_days > 0."""
        rules = load_rules(_RULES_PATH)
        for r in rules:
            assert r.period_days > 0, f"Rule {r.id}: period_days must be > 0"

    def test_u03e_period_basis_valid(self):
        """U03e — period_basis is always 'calendar' or 'working'."""
        rules = load_rules(_RULES_PATH)
        for r in rules:
            assert r.period_basis in {"calendar", "working"}, (
                f"Rule {r.id}: invalid period_basis '{r.period_basis}'"
            )


class TestComputeDeadline:

    def test_u04_valid_date_returns_computed_deadline(self):
        """U04 — compute_deadline with a valid date returns a ComputedDeadline."""
        rule = _make_rule(period_days=90)
        event = date(2023, 3, 20)
        dl = compute_deadline(rule, event, case_id="TC-01", today=_REF_DATE)
        assert isinstance(dl, ComputedDeadline)
        assert dl.due_date is not None
        assert dl.event_date == event
        assert dl.rule_id == "TEST-RULE"

    def test_u05_none_event_date_returns_cannot_compute(self):
        """U05 — None event_date → status CANNOT_COMPUTE, due_date is None."""
        rule = _make_rule()
        dl = compute_deadline(rule, None, today=_REF_DATE)
        assert dl.status == "CANNOT_COMPUTE"
        assert dl.due_date is None
        assert dl.event_date is None

    def test_u06_cannot_compute_basis_is_bilingual(self):
        """U06 — CANNOT_COMPUTE basis_en contains English + Hindi text."""
        rule = _make_rule()
        dl = compute_deadline(rule, None, today=_REF_DATE)
        assert "cannot compute" in dl.basis_en.lower()
        assert "गणना संभव नहीं" in dl.basis_hi

    def test_u07_cannot_compute_days_remaining_is_none(self):
        """U07 — CANNOT_COMPUTE days_remaining is None (never 0 or an estimate)."""
        rule = _make_rule()
        dl = compute_deadline(rule, None, today=_REF_DATE)
        assert dl.days_remaining is None

    def test_u08_calendar_rule_due_date_exact(self):
        """U08 — calendar rule: due_date = event_date + period_days exactly."""
        rule = _make_rule(period_days=90, period_basis="calendar")
        event = date(2023, 3, 20)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        from datetime import timedelta
        assert dl.due_date == event + timedelta(days=90)

    def test_u09_working_day_rule_applies_factor(self):
        """U09 — working-day rule: effective calendar days = period_days × WORKING_DAY_FACTOR."""
        rule = _make_rule(period_days=7, period_basis="working")
        event = date(2023, 3, 28)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        from datetime import timedelta
        expected_days = int(7 * WORKING_DAY_FACTOR)
        assert dl.due_date == event + timedelta(days=expected_days)

    def test_u10_working_day_basis_en_contains_factor_note(self):
        """U10 — working-day basis_en documents the approximation factor."""
        rule = _make_rule(period_days=7, period_basis="working")
        event = date(2023, 3, 28)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert str(WORKING_DAY_FACTOR) in dl.basis_en
        assert "working" in dl.basis_en.lower() or "कार्य-दिवस" in dl.basis_hi

    def test_u11_is_synthetic_always_true(self):
        """U11 — is_synthetic is always True (no real case data)."""
        rule = _make_rule()
        dl_computed  = compute_deadline(rule, date(2023, 3, 20), today=_REF_DATE)
        dl_cannot    = compute_deadline(rule, None, today=_REF_DATE)
        assert dl_computed.is_synthetic is True
        assert dl_cannot.is_synthetic is True

    def test_u12_basis_contains_synthetic_demo_label(self):
        """U12 — basis_en always contains [SYNTHETIC/DEMO] label."""
        rule = _make_rule()
        for evt in [date(2023, 3, 20), None]:
            dl = compute_deadline(rule, evt, today=_REF_DATE)
            assert "SYNTHETIC" in dl.basis_en or "SYNTHETIC" in dl.basis_hi


class TestComputeAll:

    def test_u13_returns_one_item_per_rule(self):
        """U13 — compute_all returns exactly one item per rule."""
        rules = load_rules(_RULES_PATH)
        case_events = {"arrest_date": date(2023, 3, 20)}
        results = compute_all(case_events, case_id="TC-01", rules=rules, today=_REF_DATE)
        assert len(results) == len(rules)

    def test_u14_computable_items_before_cannot_compute(self):
        """U14 — CANNOT_COMPUTE items are always last in sort order."""
        rules = load_rules(_RULES_PATH)
        case_events = {"arrest_date": date(2023, 3, 20)}  # only some rules will compute
        results = compute_all(case_events, case_id="TC-01", rules=rules, today=_REF_DATE)
        statuses = [r.status for r in results]
        first_cannot = next(
            (i for i, s in enumerate(statuses) if s == "CANNOT_COMPUTE"), len(statuses)
        )
        for i, s in enumerate(statuses):
            if s != "CANNOT_COMPUTE":
                assert i < first_cannot, (
                    f"Computable item at index {i} appears after CANNOT_COMPUTE"
                )

    def test_u15_computable_items_sorted_by_due_date(self):
        """U15 — computable items are sorted by due_date ascending."""
        rules = [
            _make_rule("RULE-A", period_days=30, event_type="fir_date"),
            _make_rule("RULE-B", period_days=90, event_type="fir_date"),
            _make_rule("RULE-C", period_days=10, event_type="fir_date"),
        ]
        case_events = {"fir_date": date(2023, 3, 15)}
        results = compute_all(case_events, rules=rules, today=_REF_DATE)
        due_dates = [r.due_date for r in results if r.due_date is not None]
        assert due_dates == sorted(due_dates)


class TestFormatHelpers:

    def test_u16_format_summary_cannot_compute(self):
        """U16 — format_deadline_summary for CANNOT_COMPUTE is bilingual."""
        rule = _make_rule()
        dl = compute_deadline(rule, None, today=_REF_DATE)
        summary = format_deadline_summary(dl)
        assert "CANNOT_COMPUTE" in summary
        assert "घटना तिथि" in summary or "event date" in summary.lower()

    def test_u17_format_summary_computed_contains_status(self):
        """U17 — format_deadline_summary for computed item contains status + due_date."""
        rule = _make_rule(period_days=90)
        dl = compute_deadline(rule, date(2023, 3, 20), today=_REF_DATE)
        summary = format_deadline_summary(dl)
        assert dl.status in summary
        assert dl.due_date.isoformat() in summary  # type: ignore[union-attr]


# ══════════════════════════════════════════════════════════════════════════════
# BOUNDARY / PROPERTY TESTS
# ══════════════════════════════════════════════════════════════════════════════

class TestBoundaryDates:

    def test_b01_month_end_jan_31_plus_31_days(self):
        """B01 — 31 Jan + 31 days = 3 Mar (non-leap year 2023)."""
        rule = _make_rule(period_days=31)
        dl = compute_deadline(rule, date(2023, 1, 31), today=_REF_DATE)
        assert dl.due_date == date(2023, 3, 3)

    def test_b02_feb_28_plus_1_day_non_leap(self):
        """B02 — 28 Feb + 1 day = 1 Mar (non-leap 2023)."""
        rule = _make_rule(period_days=1)
        dl = compute_deadline(rule, date(2023, 2, 28), today=_REF_DATE)
        assert dl.due_date == date(2023, 3, 1)

    def test_b03_leap_year_feb_29_plus_1_day(self):
        """B03 — 29 Feb + 1 day = 1 Mar (leap year 2024)."""
        rule = _make_rule(period_days=1)
        dl = compute_deadline(rule, date(2024, 2, 29), today=_REF_DATE)
        assert dl.due_date == date(2024, 3, 1)

    def test_b04_year_boundary_dec_31_plus_1(self):
        """B04 — 31 Dec + 1 day = 1 Jan next year."""
        rule = _make_rule(period_days=1)
        dl = compute_deadline(rule, date(2023, 12, 31), today=_REF_DATE)
        assert dl.due_date == date(2024, 1, 1)

    def test_b05_large_period_1095_days(self):
        """B05 — 1095-day period (≈3 years) computes correctly."""
        from datetime import timedelta
        rule = _make_rule(period_days=1095)
        event = date(2023, 3, 15)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.due_date == event + timedelta(days=1095)

    def test_b06_period_of_1_day(self):
        """B06 — minimum period of 1 day works correctly."""
        from datetime import timedelta
        rule = _make_rule(period_days=1)
        event = date(2023, 6, 1)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.due_date == event + timedelta(days=1)

    def test_b07_status_overdue_when_past_due(self):
        """B07 — status is OVERDUE when due_date < today."""
        rule = _make_rule(period_days=30)
        # event 400 days before reference → due 370 days before → OVERDUE
        from datetime import timedelta
        event = _REF_DATE - timedelta(days=400)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.status == "OVERDUE"
        assert dl.days_remaining is not None and dl.days_remaining < 0

    def test_b08_status_urgent_when_14_days_remaining(self):
        """B08 — status is URGENT when exactly 14 days remaining."""
        rule = _make_rule(period_days=14)
        from datetime import timedelta
        event = _REF_DATE  # due = REF_DATE + 14 days
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.status == "URGENT"
        assert dl.days_remaining == 14

    def test_b09_status_warning_when_15_to_30_days(self):
        """B09 — status is WARNING when 15 ≤ days_remaining ≤ 30."""
        rule = _make_rule(period_days=25)
        from datetime import timedelta
        event = _REF_DATE  # due = REF_DATE + 25 days
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.status == "WARNING"
        assert 15 <= dl.days_remaining <= 30  # type: ignore[operator]

    def test_b10_status_upcoming_when_over_30_days(self):
        """B10 — status is UPCOMING when days_remaining > 30."""
        rule = _make_rule(period_days=90)
        from datetime import timedelta
        event = _REF_DATE  # due = REF_DATE + 90 days
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.status == "UPCOMING"
        assert dl.days_remaining is not None and dl.days_remaining > 30

    def test_b11_status_boundary_exactly_0_days(self):
        """B11 — due_date == today → days_remaining = 0 → URGENT."""
        rule = _make_rule(period_days=0)
        # period_days=0 means due == event; set event == today
        dl = compute_deadline(rule, _REF_DATE, today=_REF_DATE)
        assert dl.days_remaining == 0
        assert dl.status == "URGENT"

    def test_b12_completed_overrides_status(self):
        """B12 — completed=True gives status COMPLETED regardless of due_date."""
        rule = _make_rule(period_days=30)
        from datetime import timedelta
        event = _REF_DATE - timedelta(days=400)  # would be OVERDUE
        dl = compute_deadline(rule, event, today=_REF_DATE, completed=True)
        assert dl.status == "COMPLETED"
        assert dl.completed is True


# ══════════════════════════════════════════════════════════════════════════════
# TC-01 HAND-COMPUTED VERIFICATION TESTS
# ══════════════════════════════════════════════════════════════════════════════

class TestTC01HandComputed:
    """
    These tests verify the engine against hand-computed expected dates for
    TC-01 synthetic case.  All dates are SYNTHETIC/DEMO.

    Reference: TC-01_Deadline_Events.json
      incident_date              = 2023-03-15
      fir_date                   = 2023-03-15
      arrest_date                = 2023-03-20
      fsl_sample_submission_date = 2023-03-22
      bail_application_date      = 2023-03-28
      discharge_petition_date    = 2023-06-10
      last_hearing_date          = 2026-08-05
      hc_order_date              = null

    Hand-computed:
      CRPC-167-90D  : arrest 2023-03-20 + 90d  = 2023-06-18  (OVERDUE vs 2026-09-08)
      CRPC-167-60D  : arrest 2023-03-20 + 60d  = 2023-05-19  (OVERDUE)
      CRPC-173-FINAL: fir   2023-03-15 + 90d   = 2023-06-13  (OVERDUE)
      FSL-REPORT    : fsl   2023-03-22 + 60d   = 2023-05-21  (OVERDUE)
      BAIL-439      : bail  2023-03-28 + int(7×1.4)=9d = 2023-04-06  (OVERDUE)
      DISCHARGE     : disc  2023-06-10 + 30d   = 2023-07-10  (OVERDUE)
      CRPC-309      : hear  2026-08-05 + 30d   = 2026-09-04  (OVERDUE, 4d past ref)
      LIMIT-468-3Y  : inc   2023-03-15 + 1095d = 2026-03-14  (OVERDUE)
      LIMIT-468-1Y  : inc   2023-03-15 + 365d  = 2024-03-15  (OVERDUE)
      SLP-90D       : hc_order_date=null        = CANNOT_COMPUTE
    """

    def _get_rule(self, rule_id: str) -> LimitationRule:
        rules = load_rules(_RULES_PATH)
        found = [r for r in rules if r.id == rule_id]
        assert found, f"Rule {rule_id} not found in limitation_rules.json"
        return found[0]

    def test_v01_crpc_167_90d_due_date(self):
        """V01 — CRPC-167-90D: arrest 2023-03-20 + 90d = 2023-06-18."""
        rule = self._get_rule("CRPC-167-90D")
        dl = compute_deadline(rule, date(2023, 3, 20), today=_REF_DATE)
        assert dl.due_date == date(2023, 6, 18), (
            f"Expected 2023-06-18, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"
        assert dl.days_remaining is not None and dl.days_remaining < 0

    def test_v02_crpc_167_60d_due_date(self):
        """V02 — CRPC-167-60D: arrest 2023-03-20 + 60d = 2023-05-19."""
        rule = self._get_rule("CRPC-167-60D")
        dl = compute_deadline(rule, date(2023, 3, 20), today=_REF_DATE)
        assert dl.due_date == date(2023, 5, 19), (
            f"Expected 2023-05-19, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"

    def test_v03_crpc_173_final_due_date(self):
        """V03 — CRPC-173-FINAL: fir 2023-03-15 + 90d = 2023-06-13."""
        rule = self._get_rule("CRPC-173-FINAL")
        dl = compute_deadline(rule, date(2023, 3, 15), today=_REF_DATE)
        assert dl.due_date == date(2023, 6, 13), (
            f"Expected 2023-06-13, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"

    def test_v04_fsl_report_receipt_due_date(self):
        """V04 — FSL-REPORT-RECEIPT: fsl_sample 2023-03-22 + 60d = 2023-05-21."""
        rule = self._get_rule("FSL-REPORT-RECEIPT")
        dl = compute_deadline(rule, date(2023, 3, 22), today=_REF_DATE)
        assert dl.due_date == date(2023, 5, 21), (
            f"Expected 2023-05-21, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"

    def test_v05_appeal_slp_cannot_compute(self):
        """V05 — APPEAL-SC-SLP-90D: hc_order_date=null → CANNOT_COMPUTE."""
        rule = self._get_rule("APPEAL-SC-SLP-90D")
        dl = compute_deadline(rule, None, today=_REF_DATE)
        assert dl.status == "CANNOT_COMPUTE"
        assert dl.due_date is None
        assert dl.days_remaining is None

    def test_v06_bail_application_working_day_rule(self):
        """V06 — BAIL-439-APPLICATION: bail 2023-03-28 + int(7×1.4)=9 calendar days."""
        rule = self._get_rule("BAIL-439-APPLICATION")
        from datetime import timedelta
        event = date(2023, 3, 28)
        expected_days = int(7 * WORKING_DAY_FACTOR)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.due_date == event + timedelta(days=expected_days), (
            f"Expected {event + timedelta(days=expected_days)}, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"

    def test_v07_limitation_468_3y_due_date(self):
        """V07 — LIMITATION-468-3Y: incident 2023-03-15 + 1095d = 2026-03-14."""
        rule = self._get_rule("LIMITATION-468-3Y")
        from datetime import timedelta
        event = date(2023, 3, 15)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        assert dl.due_date == event + timedelta(days=1095), (
            f"Expected {event + timedelta(days=1095)}, got {dl.due_date}"
        )
        assert dl.status == "OVERDUE"

    def test_v08_tc01_events_file_exists_and_valid(self):
        """V08 — TC-01_Deadline_Events.json exists and parses correctly."""
        assert _TC01_EVENTS.exists(), f"Events file missing: {_TC01_EVENTS}"
        with open(_TC01_EVENTS, encoding="utf-8") as fh:
            data = json.load(fh)
        assert "events" in data
        assert data["events"]["fir_date"] == "2023-03-15"
        assert data["events"]["arrest_date"] == "2023-03-20"
        assert data["events"]["hc_order_date"] is None  # proves CANNOT_COMPUTE scenario

    def test_v09_tc01_produces_exactly_one_cannot_compute(self):
        """V09 — TC-01 event file produces exactly 1 CANNOT_COMPUTE (hc_order_date=null)."""
        from services.limitation_engine import compute_for_case
        results = compute_for_case("TC-01", today=_REF_DATE)
        cannot_items = [r for r in results if r.status == "CANNOT_COMPUTE"]
        assert len(cannot_items) == 1, (
            f"Expected exactly 1 CANNOT_COMPUTE (for APPEAL-SC-SLP-90D), "
            f"got {len(cannot_items)}: {[c.rule_id for c in cannot_items]}"
        )
        assert cannot_items[0].rule_id == "APPEAL-SC-SLP-90D"

    def test_v10_tc01_total_items_equals_rule_count(self):
        """V10 — compute_for_case TC-01 returns one item per rule."""
        from services.limitation_engine import compute_for_case
        rules = load_rules(_RULES_PATH)
        results = compute_for_case("TC-01", today=_REF_DATE)
        assert len(results) == len(rules), (
            f"Expected {len(rules)} items, got {len(results)}"
        )


# ══════════════════════════════════════════════════════════════════════════════
# COPILOT HOOK TESTS
# ══════════════════════════════════════════════════════════════════════════════

class TestCopilotSnippet:

    def test_c01_snippet_cannot_compute_contains_rule_id_and_event(self):
        """C01 — CANNOT_COMPUTE snippet contains rule_id and event_type."""
        rule = _make_rule(rule_id="APPEAL-SC-SLP-90D", event_type="hc_order_date")
        dl = compute_deadline(rule, None, today=_REF_DATE)
        snippet = format_copilot_citation_snippet(dl)
        assert "APPEAL-SC-SLP-90D" in snippet
        assert "hc_order_date" in snippet

    def test_c02_snippet_computed_contains_due_date(self):
        """C02 — Computed deadline snippet contains the due_date string."""
        rule = _make_rule(rule_id="CRPC-167-90D", period_days=90)
        event = date(2023, 3, 20)
        dl = compute_deadline(rule, event, today=_REF_DATE)
        snippet = format_copilot_citation_snippet(dl)
        assert dl.due_date.isoformat() in snippet  # type: ignore[union-attr]

    def test_c03_snippet_always_under_300_chars(self):
        """C03 — snippet is always ≤ 300 chars regardless of rule name length."""
        long_name = "A" * 200
        rule = _make_rule(rule_id="VERY-LONG-RULE", name=long_name, period_days=90)
        for event in [date(2023, 3, 20), None]:
            dl = compute_deadline(rule, event, today=_REF_DATE)
            snippet = format_copilot_citation_snippet(dl)
            assert len(snippet) <= 300, (
                f"Snippet length {len(snippet)} exceeds 300 chars"
            )

    def test_c04_snippet_contains_synthetic_demo_label(self):
        """C04 — snippet always contains SYNTHETIC/DEMO label."""
        rule = _make_rule(period_days=90)
        for event in [date(2023, 3, 20), None]:
            dl = compute_deadline(rule, event, today=_REF_DATE)
            snippet = format_copilot_citation_snippet(dl)
            assert "SYNTHETIC" in snippet

    def test_c05_snippet_contains_rule_id_always(self):
        """C05 — snippet always starts with [rule_id] bracket."""
        rule = _make_rule(rule_id="CRPC-167-90D", period_days=90)
        dl = compute_deadline(rule, date(2023, 3, 20), today=_REF_DATE)
        snippet = format_copilot_citation_snippet(dl)
        assert "CRPC-167-90D" in snippet

    def test_c06_copilot_citation_type_deadline_accepted(self):
        """
        C06 — CopilotCitation model now accepts type='deadline' (Week 9 extension).
        Validates that models.py was correctly updated.
        """
        from api.models import CopilotCitation
        c = CopilotCitation(
            type="deadline",
            id="CRPC-167-90D",
            snippet="[CRPC-167-90D] Charge-sheet filing. Due: 2023-06-18. [SYNTHETIC/DEMO]",
        )
        assert c.type == "deadline"
        assert c.id == "CRPC-167-90D"

    def test_c07_copilot_citation_old_types_still_valid(self):
        """C07 — Original citation types (document, timeline, register, standard) still valid."""
        from api.models import CopilotCitation
        for t in ["document", "timeline", "register", "standard"]:
            c = CopilotCitation(type=t, id="test-id", snippet="Test snippet.")
            assert c.type == t
