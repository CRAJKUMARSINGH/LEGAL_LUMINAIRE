"""Resolve repository paths from backend code location (works in dev and CI)."""
from __future__ import annotations

from pathlib import Path


def workspace_root() -> Path:
    """LEGAL_LUMINAIRE monorepo root (parent of `artifacts/`)."""
    # backend/repo_paths.py → backend → legal-luminaire → artifacts → root
    return Path(__file__).resolve().parent.parent.parent.parent


def real_cases_dir() -> Path:
    return workspace_root() / "real_cases"


def hemraj_case_dir() -> Path:
    return real_cases_dir() / "CASE01_HEMRAJ_STATE_2025"
