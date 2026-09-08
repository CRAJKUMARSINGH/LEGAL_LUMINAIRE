"""
Shared pytest fixtures for Legal Luminaire backend tests.

Sets FEATURE_ASK_COPILOT=true in the process environment BEFORE the app module
is imported, so the flag is ON for all copilot tests.  Individual test modules
can override the env var by patching os.environ or monkeypatching _FLAG_ON.
"""
from __future__ import annotations

import os
import pytest
import pytest_asyncio  # noqa: F401  — registers async fixture support

# Activate the copilot feature flag for the test session
os.environ.setdefault("FEATURE_ASK_COPILOT", "true")


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"
