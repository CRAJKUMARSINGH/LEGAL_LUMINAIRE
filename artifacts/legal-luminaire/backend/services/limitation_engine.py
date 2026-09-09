"""
limitation_engine.py — Deterministic deadline computation (Week 9)
====================================================================

Week-9 Primary Principle (from WEEK09_KIRO_Limitation_Deadline_Engine.md):
  "Deadlines are computed deterministically from SYNTHETIC DATES ONLY and always
   displayed with their governing basis. This is a pure-computation feature —
   it must never call an LLM. Bilingual throughout."

Guarantees enforced in this module:
  1. DETERMINISTIC — same inputs always produce same outputs. No randomness,
     no network calls, no LLM calls.
  2. TRACEABLE — every ComputedDeadline carries rule_id, event_date, basis_en,
     basis_hi so the user can independently verify.
  3. CANNOT-COMPUTE SAFETY — missing event date → explicit "cannot compute"
     status, never a silently omitted or estimated deadline.
  4. WORKING-DAY AWARENESS — rules with period_basis="working" use a simple
     calendar-day approximation (×1.4 factor) with an explicit caveat in the
     basis string. No court-holiday calendar is embedded.
  5. SYNTHETIC-ONLY — event dates supplied by callers must come from the
     synthetic case data layer (TC-01 demo). No live court API.

Public surface:
  load_rules()                     → list[LimitationRule]
  compute_deadline(rule, event_date) → ComputedDeadline
  compute_all(case_events)         → list[ComputedDeadline]
  compute_for_case(case_id)        → list[ComputedDeadline]  (reads TC-xx events file)
  format_deadline_summary(deadline) → str  (EN + HI bilingual single line)
"""
from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# ── Paths ──────────────────────────────────────────────────────────────────────
_SERVICES_DIR = Path(__file__).parent
_RULES_PATH   = _SERVICES_DIR / "limitation_rules.json"
_CASES_DIR    = _SERVICES_DIR.parent / "uploaded_cases"

# ── Working-day approximation factor ──────────────────────────────────────────
# No court-holiday calendar is embedded.  Rules with period_basis="working" use
# period_days × WORKING_DAY_FACTOR as a conservative calendar-day estimate.
WORKING_DAY_FACTOR = 1.4   # 5-day week / 7-day week ≈ 0.71 → inverse ≈ 1.40

# ── Status thresholds ─────────────────────────────────────────────────────────
_URGENT_DAYS  = 14   # ≤ 14 days remaining → URGENT
_WARNING_DAYS = 30   # ≤ 30 days remaining → WARNING


# ── Data classes ──────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class LimitationRule:
    """Immutable representation of one row from limitation_rules.json."""
    id: str
    name: str
    name_hi: str
    statute: str
    section: str
    event_type: str
    period_days: int
    period_basis: str          # "calendar" | "working"
    applies_to: str = ""
    extension_rule: str = ""
    consequence: str = ""
    consequence_hi: str = ""
    source_note: str = ""
    blocked_from_draft: bool = False


@dataclass
class ComputedDeadline:
    """
    A single deadline computed from a LimitationRule + event_date.

    Status values:
      OVERDUE    — due_date < today
      URGENT     — 0 ≤ days_remaining ≤ 14
      WARNING    — 15 ≤ days_remaining ≤ 30
      UPCOMING   — days_remaining > 30
      COMPLETED  — explicitly marked via the completed flag
      CANNOT_COMPUTE — event_date was None / missing
    """
    rule_id: str
    case_id: str
    event_type: str
    event_date: Optional[date]        # None → CANNOT_COMPUTE
    due_date: Optional[date]          # None → CANNOT_COMPUTE
    days_remaining: Optional[int]     # None → CANNOT_COMPUTE; negative → overdue
    status: str                       # OVERDUE|URGENT|WARNING|UPCOMING|COMPLETED|CANNOT_COMPUTE
    name: str                         # EN
    name_hi: str                      # HI
    basis_en: str                     # full EN basis string
    basis_hi: str                     # full HI basis string
    statute: str
    section: str
    source_note: str
    period_days: int
    period_basis: str
    consequence: str
    consequence_hi: str
    computed_at: str                  # ISO-8601 date string
    is_synthetic: bool = True         # always True for demo data
    completed: bool = False


# ── Rule loader ───────────────────────────────────────────────────────────────

def load_rules(rules_path: Path = _RULES_PATH) -> list[LimitationRule]:
    """
    Load and parse limitation_rules.json.

    Raises FileNotFoundError if the rules file is missing.
    Raises ValueError if a rule entry is malformed.
    """
    with open(rules_path, encoding="utf-8") as fh:
        raw = json.load(fh)

    rules: list[LimitationRule] = []
    for entry in raw.get("rules", []):
        try:
            rules.append(LimitationRule(
                id=entry["id"],
                name=entry["name"],
                name_hi=entry["name_hi"],
                statute=entry["statute"],
                section=entry["section"],
                event_type=entry["event_type"],
                period_days=int(entry["period_days"]),
                period_basis=entry.get("period_basis", "calendar"),
                applies_to=entry.get("applies_to", ""),
                extension_rule=entry.get("extension_rule", ""),
                consequence=entry.get("consequence", ""),
                consequence_hi=entry.get("consequence_hi", ""),
                source_note=entry.get("source_note", ""),
                blocked_from_draft=bool(entry.get("blocked_from_draft", False)),
            ))
        except (KeyError, TypeError) as exc:
            raise ValueError(
                f"Malformed rule entry id={entry.get('id', '<unknown>')}: {exc}"
            ) from exc

    logger.info("Loaded %d limitation rules from %s", len(rules), rules_path)
    return rules


# ── Core computation ──────────────────────────────────────────────────────────

def _calendar_days(rule: LimitationRule) -> int:
    """
    Return the effective calendar-day period for a rule.

    For "working" rules, apply WORKING_DAY_FACTOR and document it.
    For "calendar" rules, return period_days unchanged.
    """
    if rule.period_basis == "working":
        return int(rule.period_days * WORKING_DAY_FACTOR)
    return rule.period_days


def _compute_status(
    due_date: date,
    today: date,
    completed: bool = False,
) -> tuple[str, int]:
    """
    Return (status_string, days_remaining).

    days_remaining is negative when overdue.
    """
    if completed:
        return "COMPLETED", 0

    delta = (due_date - today).days
    if delta < 0:
        return "OVERDUE", delta
    elif delta <= _URGENT_DAYS:
        return "URGENT", delta
    elif delta <= _WARNING_DAYS:
        return "WARNING", delta
    else:
        return "UPCOMING", delta


def _build_basis_en(rule: LimitationRule, event_date: date, due_date: date) -> str:
    """Build the English basis string for a deadline."""
    working_note = (
        f" (≈{rule.period_days} working days × {WORKING_DAY_FACTOR} factor; "
        "no court-holiday calendar embedded)"
        if rule.period_basis == "working" else ""
    )
    return (
        f"{rule.name} | {rule.statute} {rule.section} | "
        f"Event ({rule.event_type}): {event_date.isoformat()} + "
        f"{_calendar_days(rule)} calendar days{working_note} = {due_date.isoformat()} | "
        f"Applies to: {rule.applies_to} | "
        f"[SYNTHETIC/DEMO — {rule.source_note}]"
    )


def _build_basis_hi(rule: LimitationRule, event_date: date, due_date: date) -> str:
    """Build the Hindi basis string for a deadline."""
    working_note = (
        f" (≈{rule.period_days} कार्य-दिवस × {WORKING_DAY_FACTOR} गुणक; "
        "न्यायालय अवकाश कैलेंडर सम्मिलित नहीं)"
        if rule.period_basis == "working" else ""
    )
    return (
        f"{rule.name_hi} | {rule.statute} {rule.section} | "
        f"घटना ({rule.event_type}): {event_date.isoformat()} + "
        f"{_calendar_days(rule)} कैलेंडर दिन{working_note} = {due_date.isoformat()} | "
        f"[संश्लेषित/डेमो — {rule.source_note}]"
    )


def compute_deadline(
    rule: LimitationRule,
    event_date: Optional[date],
    case_id: str = "",
    today: Optional[date] = None,
    completed: bool = False,
) -> ComputedDeadline:
    """
    Compute a single deadline from a rule and an event date.

    If event_date is None, returns a CANNOT_COMPUTE deadline — never an estimate.

    Parameters
    ----------
    rule        : LimitationRule from load_rules()
    event_date  : the date the triggering event occurred (None → CANNOT_COMPUTE)
    case_id     : identifier of the synthetic case
    today       : reference date for days_remaining (defaults to date.today())
    completed   : mark this deadline as already completed

    Returns
    -------
    ComputedDeadline
    """
    from datetime import date as _date
    _today = today or _date.today()
    computed_at = _today.isoformat()

    if event_date is None:
        return ComputedDeadline(
            rule_id=rule.id,
            case_id=case_id,
            event_type=rule.event_type,
            event_date=None,
            due_date=None,
            days_remaining=None,
            status="CANNOT_COMPUTE",
            name=rule.name,
            name_hi=rule.name_hi,
            basis_en=(
                f"{rule.name} | {rule.statute} {rule.section} | "
                f"Event '{rule.event_type}' date not available — cannot compute. "
                "[SYNTHETIC/DEMO]"
            ),
            basis_hi=(
                f"{rule.name_hi} | {rule.statute} {rule.section} | "
                f"'{rule.event_type}' की तिथि उपलब्ध नहीं — गणना संभव नहीं। "
                "[संश्लेषित/डेमो]"
            ),
            statute=rule.statute,
            section=rule.section,
            source_note=rule.source_note,
            period_days=rule.period_days,
            period_basis=rule.period_basis,
            consequence=rule.consequence,
            consequence_hi=rule.consequence_hi,
            computed_at=computed_at,
            is_synthetic=True,
            completed=False,
        )

    effective_days = _calendar_days(rule)
    due = event_date + timedelta(days=effective_days)
    status, days_rem = _compute_status(due, _today, completed)

    return ComputedDeadline(
        rule_id=rule.id,
        case_id=case_id,
        event_type=rule.event_type,
        event_date=event_date,
        due_date=due,
        days_remaining=days_rem,
        status=status,
        name=rule.name,
        name_hi=rule.name_hi,
        basis_en=_build_basis_en(rule, event_date, due),
        basis_hi=_build_basis_hi(rule, event_date, due),
        statute=rule.statute,
        section=rule.section,
        source_note=rule.source_note,
        period_days=rule.period_days,
        period_basis=rule.period_basis,
        consequence=rule.consequence,
        consequence_hi=rule.consequence_hi,
        computed_at=computed_at,
        is_synthetic=True,
        completed=completed,
    )


def compute_all(
    case_events: dict[str, Optional[date]],
    case_id: str = "",
    rules: Optional[list[LimitationRule]] = None,
    today: Optional[date] = None,
) -> list[ComputedDeadline]:
    """
    Compute deadlines for all matching rules given a dict of case events.

    Parameters
    ----------
    case_events : mapping of event_type → date (or None for unavailable events)
                  e.g. {"fir_date": date(2023,3,15), "arrest_date": date(2023,3,20)}
    case_id     : case identifier (propagated to each ComputedDeadline)
    rules       : optional pre-loaded rules list (loaded from file if None)
    today       : reference date for days_remaining

    Returns
    -------
    List of ComputedDeadline, sorted: CANNOT_COMPUTE last, then by due_date asc.
    """
    if rules is None:
        rules = load_rules()

    results: list[ComputedDeadline] = []
    for rule in rules:
        event_date = case_events.get(rule.event_type)
        dl = compute_deadline(
            rule=rule,
            event_date=event_date,
            case_id=case_id,
            today=today,
        )
        results.append(dl)

    # Sort: computable items by due_date asc; CANNOT_COMPUTE at the end
    computable   = sorted(
        [d for d in results if d.due_date is not None],
        key=lambda d: d.due_date,  # type: ignore[arg-type]
    )
    uncomputable = [d for d in results if d.due_date is None]
    return computable + uncomputable


def compute_for_case(
    case_id: str,
    today: Optional[date] = None,
) -> list[ComputedDeadline]:
    """
    Load case event dates from the case's TC-xx_Deadline_Events.json file
    and compute all matching deadlines.

    File expected at: backend/uploaded_cases/<case_id>/<case_id>_Deadline_Events.json

    Returns CANNOT_COMPUTE entries for all rules when file is missing —
    never silently omits a deadline.
    """
    events_file = _CASES_DIR / case_id / f"{case_id}_Deadline_Events.json"
    case_events: dict[str, Optional[date]] = {}

    if events_file.exists():
        try:
            with open(events_file, encoding="utf-8") as fh:
                raw_events: dict = json.load(fh)
            from datetime import date as _date
            for event_type, date_str in raw_events.get("events", {}).items():
                if date_str:
                    try:
                        case_events[event_type] = _date.fromisoformat(str(date_str))
                    except ValueError:
                        logger.warning(
                            "Invalid date '%s' for event_type '%s' in case %s — "
                            "treating as missing.",
                            date_str, event_type, case_id,
                        )
                        case_events[event_type] = None
                else:
                    case_events[event_type] = None
            logger.info(
                "Loaded %d event dates for case %s from %s",
                len(case_events), case_id, events_file,
            )
        except (json.JSONDecodeError, OSError) as exc:
            logger.error(
                "Could not read events file for case %s: %s", case_id, exc
            )
    else:
        logger.info(
            "No deadline events file found for case %s at %s — "
            "all deadlines will be CANNOT_COMPUTE.",
            case_id, events_file,
        )

    return compute_all(case_events=case_events, case_id=case_id, today=today)


# ── Formatting helpers ────────────────────────────────────────────────────────

def format_deadline_summary(deadline: ComputedDeadline) -> str:
    """
    Return a single bilingual summary line for a deadline.

    Example output:
      Charge-sheet filing deadline (90D) [COURT_SAFE] | आरोप-पत्र दाखिल करने की
      समय-सीमा (90D) | Due: 2023-06-16 | 14 days remaining | STATUS: URGENT
    """
    if deadline.status == "CANNOT_COMPUTE":
        return (
            f"{deadline.name} | {deadline.name_hi} | "
            "STATUS: CANNOT_COMPUTE — event date not available / घटना तिथि उपलब्ध नहीं"
        )

    due_str = deadline.due_date.isoformat() if deadline.due_date else "N/A"
    rem = deadline.days_remaining
    rem_str = (
        f"{abs(rem)} days overdue / {abs(rem)} दिन पहले" if rem is not None and rem < 0
        else f"{rem} days remaining / {rem} दिन शेष"
    )
    return (
        f"{deadline.name} | {deadline.name_hi} | "
        f"Due: {due_str} | {rem_str} | STATUS: {deadline.status}"
    )


def format_copilot_citation_snippet(deadline: ComputedDeadline) -> str:
    """
    Build a ≤300-char citation snippet for the copilot's 'deadline' citation type.

    The snippet carries rule_id + basis so the copilot never invents a date.
    """
    if deadline.status == "CANNOT_COMPUTE":
        snippet = (
            f"[{deadline.rule_id}] {deadline.name} — CANNOT_COMPUTE: "
            f"event '{deadline.event_type}' date missing. "
            f"{deadline.statute} {deadline.section}. [SYNTHETIC/DEMO]"
        )
    else:
        due_str = deadline.due_date.isoformat() if deadline.due_date else "N/A"
        snippet = (
            f"[{deadline.rule_id}] {deadline.name} | Due: {due_str} | "
            f"STATUS: {deadline.status} | "
            f"{deadline.statute} {deadline.section} | "
            f"Event: {deadline.event_type} {deadline.event_date} | [SYNTHETIC/DEMO]"
        )
    # Hard truncate to 300 chars preserving readability
    if len(snippet) > 297:
        snippet = snippet[:296] + "…"
    return snippet
