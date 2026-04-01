"""
Shared tools for all agents.
- web_search: Tavily real-time search (primary)
- browse_page: fetch + summarize a URL
- rag_search: search case documents
- indian_kanoon_search: targeted Indian Kanoon search
"""
from __future__ import annotations

import logging
import re
from typing import Optional

import requests
from bs4 import BeautifulSoup
from langchain_core.tools import tool
from tavily import TavilyClient

from config import settings

logger = logging.getLogger(__name__)

# ── Tavily client (lazy init) ──────────────────────────────────────────────────
_tavily: Optional[TavilyClient] = None


def _get_tavily() -> TavilyClient:
    global _tavily
    if _tavily is None:
        if not settings.tavily_api_key:
            raise ValueError("TAVILY_API_KEY not set in .env")
        _tavily = TavilyClient(api_key=settings.tavily_api_key)
    return _tavily


# ── Tools ──────────────────────────────────────────────────────────────────────

@tool
def web_search(query: str) -> str:
    """
    Search the web for legal citations, IS standards, and court judgments.
    Use for verifying case names, citations, IS clause numbers, and ASTM standards.
    Always search on: indiankanoon.org, livelaw.in, scconline.com, bis.gov.in, astm.org
    """
    try:
        client = _get_tavily()
        results = client.search(
            query=query,
            search_depth="advanced",
            max_results=5,
            include_domains=[
                "indiankanoon.org", "livelaw.in", "scconline.com",
                "barandbench.com", "bis.gov.in", "astm.org",
                "archive.org", "law.resource.org", "manupatra.com",
                "cpwd.gov.in", "legislative.gov.in",
            ],
        )
        if not results.get("results"):
            return "No results found."
        lines = []
        for r in results["results"]:
            lines.append(f"SOURCE: {r.get('url', '')}")
            lines.append(f"TITLE: {r.get('title', '')}")
            lines.append(f"CONTENT: {r.get('content', '')[:600]}")
            lines.append("---")
        return "\n".join(lines)
    except Exception as e:
        logger.error(f"web_search error: {e}")
        return f"Search failed: {e}"


@tool
def browse_page(url: str) -> str:
    """
    Fetch and extract text from a specific URL.
    Use to read full judgment text from indiankanoon.org or IS standard from archive.org.
    Returns first 3000 chars of clean text.
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (LegalLuminaire/1.0)"}
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        # Remove scripts/styles
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        # Collapse whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text[:3000]
    except Exception as e:
        logger.error(f"browse_page error for {url}: {e}")
        return f"Failed to fetch {url}: {e}"


@tool
def indian_kanoon_search(query: str) -> str:
    """
    Search Indian Kanoon for specific case citations.
    Use for: SC/HC judgments, exact citation verification.
    Query format: 'case name year court' e.g. 'Kattavellai Devakar Tamil Nadu 2025'
    """
    try:
        search_url = f"https://indiankanoon.org/search/?formInput={requests.utils.quote(query)}&pagenum=0"
        headers = {"User-Agent": "Mozilla/5.0 (LegalLuminaire/1.0)"}
        resp = requests.get(search_url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
        results = []
        for result in soup.select(".result")[:5]:
            title = result.select_one(".result_title")
            snippet = result.select_one(".snippet")
            link = result.select_one("a")
            if title:
                results.append(
                    f"CASE: {title.get_text(strip=True)}\n"
                    f"URL: https://indiankanoon.org{link['href'] if link else ''}\n"
                    f"SNIPPET: {snippet.get_text(strip=True)[:300] if snippet else ''}\n---"
                )
        return "\n".join(results) if results else "No results on Indian Kanoon."
    except Exception as e:
        return f"Indian Kanoon search failed: {e}"


@tool
def verify_is_standard(standard_code: str) -> str:
    """
    Verify an IS (Indian Standard) code on BIS portal and archive.org.
    Input: standard code like 'IS 1199:2018' or 'IS 2250:1981'
    Returns: scope, applicability, and key clauses if found.
    """
    try:
        client = _get_tavily()
        query = f"{standard_code} scope applicability clauses site:bis.gov.in OR site:archive.org OR site:law.resource.org"
        results = client.search(query=query, search_depth="advanced", max_results=3)
        if not results.get("results"):
            return f"Could not verify {standard_code} online. Mark as UNVERIFIED."
        lines = [f"VERIFICATION RESULTS FOR {standard_code}:"]
        for r in results["results"]:
            lines.append(f"SOURCE: {r.get('url', '')}")
            lines.append(f"CONTENT: {r.get('content', '')[:500]}")
            lines.append("---")
        return "\n".join(lines)
    except Exception as e:
        return f"IS standard verification failed: {e}"
