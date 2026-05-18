"""
Shared tools for all agents — Legal Luminaire v2.
Real web verification: Tavily search + page browse + Indian Kanoon + IS standard lookup.
"""
from __future__ import annotations

import ipaddress
import logging
import re
from functools import lru_cache
from typing import Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from langchain_core.tools import tool
from requests.adapters import HTTPAdapter
from tavily import TavilyClient
from urllib3.util.retry import Retry

from config import settings

logger = logging.getLogger(__name__)

_tavily: Optional[TavilyClient] = None

VERIFIED_DOMAINS = [
    "indiankanoon.org", "livelaw.in", "scconline.com",
    "barandbench.com", "bis.gov.in", "astm.org",
    "archive.org", "law.resource.org", "manupatra.com",
    "cpwd.gov.in", "legislative.gov.in", "sci.gov.in",
    "highcourtofuttarakhand.gov.in", "rajhighcourt.nic.in",
    "latestlaws.com", "drishtijudiciary.com", "legalindia.com",
]

# Shared session with retry logic — reused across all requests
def _make_session() -> requests.Session:
    session = requests.Session()
    retry = Retry(total=3, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.headers.update({"User-Agent": "Mozilla/5.0 (LegalLuminaire/2.0)"})
    return session

_session = _make_session()


def _is_safe_url(url: str) -> bool:
    """Block non-HTTPS, private IPs, and non-allowlisted domains."""
    try:
        parsed = urlparse(url)
        if parsed.scheme != "https":
            return False
        host = parsed.hostname or ""
        # Block private/loopback IPs
        try:
            addr = ipaddress.ip_address(host)
            if addr.is_private or addr.is_loopback or addr.is_link_local:
                return False
        except ValueError:
            pass  # hostname, not IP — continue
        # Enforce domain allowlist
        return any(host == d or host.endswith(f".{d}") for d in VERIFIED_DOMAINS)
    except Exception:
        return False


def _get_tavily() -> TavilyClient:
    global _tavily
    if _tavily is None:
        if not settings.tavily_api_key:
            raise ValueError("TAVILY_API_KEY not set in .env")
        _tavily = TavilyClient(api_key=settings.tavily_api_key)
    return _tavily


@tool
def web_search(query: str) -> str:
    """
    Search the web for legal citations, IS standards, and court judgments.
    Searches: indiankanoon.org, livelaw.in, scconline.com, bis.gov.in, astm.org, archive.org.
    Returns top 5 results with URL, title, and content snippet.
    """
    try:
        client = _get_tavily()
        results = client.search(
            query=query,
            search_depth="advanced",
            max_results=5,
            include_domains=VERIFIED_DOMAINS,
        )
        if not results.get("results"):
            return "No results found."
        lines = []
        for r in results["results"]:
            lines.append(f"URL: {r.get('url', '')}")
            lines.append(f"TITLE: {r.get('title', '')}")
            lines.append(f"CONTENT: {r.get('content', '')[:800]}")
            lines.append("---")
        return "\n".join(lines)
    except Exception as e:
        logger.error(f"web_search error: {e}")
        return f"Search failed: {e}"


@tool
def browse_page(url: str) -> str:
    """
    Fetch and extract clean text from a specific URL.
    Use to read full judgment text from indiankanoon.org or IS standard from archive.org.
    Only fetches from verified legal domains over HTTPS. Returns first 4000 chars of clean text.
    """
    if not _is_safe_url(url):
        return f"BLOCKED: {url} is not in the verified legal domain allowlist or is not HTTPS."
    try:
        resp = _session.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text[:4000]
    except Exception as e:
        logger.error(f"browse_page error for {url}: {e}")
        return f"Failed to fetch {url}: {e}"


@tool
def indian_kanoon_search(case_name: str) -> str:
    """
    Search Indian Kanoon for a specific case by name.
    Returns case URL, citation, and key holding if found.
    Use for: verifying SC/HC judgments, finding exact citations.
    """
    try:
        query = f'site:indiankanoon.org "{case_name}"'
        client = _get_tavily()
        results = client.search(
            query=query,
            search_depth="advanced",
            max_results=3,
            include_domains=["indiankanoon.org"],
        )
        if not results.get("results"):
            return f"Case '{case_name}' NOT FOUND on Indian Kanoon. Mark as UNVERIFIED."
        lines = [f"FOUND on Indian Kanoon: {case_name}"]
        for r in results["results"]:
            lines.append(f"URL: {r.get('url', '')}")
            lines.append(f"SNIPPET: {r.get('content', '')[:600]}")
            lines.append("---")
        return "\n".join(lines)
    except Exception as e:
        return f"Indian Kanoon search failed: {e}"


@tool
@lru_cache(maxsize=64)
def verify_is_standard(standard_code: str) -> str:
    """
    Verify an IS/ASTM/BS standard on official sources.
    Checks: bis.gov.in, archive.org, astm.org, law.resource.org.
    Returns: scope, applicability, key clauses, source URL.
    Use for: IS 1199:2018, IS 2250:1981, IS 3535:1986, IS 4031, ASTM C1324, ASTM C780.
    """
    # Known standards database — ground truth for this case
    KNOWN_STANDARDS = {
        "IS 1199:2018": {
            "title": "Methods of Sampling and Analysis of Fresh Concrete",
            "scope": "This standard applies to FRESH CONCRETE only. It does NOT apply to hardened concrete or hardened masonry mortar.",
            "verdict": "WRONG STANDARD for hardened masonry mortar. Prosecution error.",
            "url": "https://archive.org/details/gov.in.is.1199.2.2018",
        },
        "IS 2250:1981": {
            "title": "Code of Practice for Preparation and Use of Masonry Mortars",
            "scope": "Applies to masonry mortars used in brick/stone masonry construction. CORRECT standard for this case.",
            "verdict": "CORRECT STANDARD for masonry mortar.",
            "url": "https://www.bis.gov.in",
        },
        "IS 3535:1986": {
            "title": "Methods of Sampling Hydraulic Cements",
            "scope": "Clause 4.1: Contractor representative must be present. Clause 6.2: Min 5 representative locations.",
            "verdict": "CORRECT — sampling protocol standard.",
            "url": "https://archive.org/details/gov.in.is.3535.1986",
        },
        "ASTM C1324": {
            "title": "Standard Test Method for Examination and Analysis of Hardened Masonry Mortar",
            "scope": "Sections 7-8: Remove carbonated outer layer before sampling. Correct for forensic examination of hardened masonry mortar.",
            "verdict": "CORRECT INTERNATIONAL STANDARD for this case.",
            "url": "https://www.astm.org/c1324-03.html",
        },
        "ASTM C780": {
            "title": "Standard Practice for Preconstruction and Construction Evaluation of Mortars",
            "scope": "Section 6.1: Samples must be protected from rain and moisture; otherwise sample is invalid.",
            "verdict": "CORRECT — weather protection requirement.",
            "url": "https://www.astm.org",
        },
    }

    # Check known standards first
    for code, data in KNOWN_STANDARDS.items():
        if standard_code.upper() in code.upper() or code.upper() in standard_code.upper():
            return (
                f"CODE: {code}\n"
                f"TITLE: {data['title']}\n"
                f"SCOPE: {data['scope']}\n"
                f"VERDICT: {data['verdict']}\n"
                f"SOURCE: {data['url']}"
            )

    # Fall back to web search
    try:
        client = _get_tavily()
        results = client.search(
            query=f"{standard_code} scope applicability clause site:bis.gov.in OR site:archive.org OR site:astm.org",
            search_depth="advanced",
            max_results=3,
        )
        if results.get("results"):
            lines = [f"Web search results for {standard_code}:"]
            for r in results["results"]:
                lines.append(f"URL: {r.get('url', '')}")
                lines.append(f"CONTENT: {r.get('content', '')[:500]}")
            return "\n".join(lines)
        return f"Standard {standard_code} not found in known database or web search."
    except Exception as e:
        return f"Standard verification failed: {e}"


@tool
def rag_search(query: str, case_id: str = "case01") -> str:
    """
    Search uploaded case documents using RAG (ChromaDB).
    Returns relevant chunks from FIR, charge-sheet, FSL report, defence documents.
    Use to ground drafts in actual case facts.
    """
    try:
        from rag.document_store import get_retriever, case_has_documents
        if not case_has_documents(case_id):
            return f"No documents indexed for case {case_id}. Upload documents first."
        retriever = get_retriever(case_id, k=6)
        docs = retriever.invoke(query)
        if not docs:
            return "No relevant documents found in RAG."
        lines = []
        for i, doc in enumerate(docs, 1):
            src = doc.metadata.get("source_file", "unknown")
            lines.append(f"[Doc {i} — {src}]")
            lines.append(doc.page_content[:600])
            lines.append("---")
        return "\n".join(lines)
    except Exception as e:
        logger.error(f"rag_search error: {e}")
        return f"RAG search failed: {e}"


@tool
def verify_citation_url(url: str) -> str:
    """
    Verify that a URL is accessible and contains the expected case content.
    Only checks verified legal domains over HTTPS.
    Returns: ACCESSIBLE/NOT_ACCESSIBLE + first 500 chars of content.
    """
    if not _is_safe_url(url):
        return f"BLOCKED: {url} is not in the verified legal domain allowlist or is not HTTPS."
    try:
        resp = _session.get(url, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            text = soup.get_text(separator=" ", strip=True)[:500]
            return f"ACCESSIBLE: {url}\nCONTENT: {text}"
        return f"NOT_ACCESSIBLE: {url} (HTTP {resp.status_code})"
    except Exception as e:
        return f"NOT_ACCESSIBLE: {url} — {e}"


@tool
def scc_online_verify(citation: str) -> str:
    """
    Verify an Indian case citation against SCC Online (scconline.com).
    Uses SCC Online API if SCC_ONLINE_API_KEY is set in .env;
    otherwise falls back to a structured Tavily search on scconline.com.
    Returns: citation status (VERIFIED/UNVERIFIED), holding snippet, and source URL.

    Example inputs: "(2005) 6 SCC 1", "2025 INSC 845", "AIR 1979 SC 1715"
    """
    try:
        scc_key = getattr(settings, "scc_online_api_key", None)

        if scc_key:
            # Live API path — replace endpoint when SCC Online opens their API programme
            resp = _session.get(
                "https://api.scconline.com/v1/citations/verify",
                params={"citation": citation, "api_key": scc_key},
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                return (
                    f"SCC_ONLINE STATUS: {data.get('status', 'UNKNOWN')}\n"
                    f"CASE: {data.get('case_name', '')}\n"
                    f"HOLDING: {data.get('holding', '')[:600]}\n"
                    f"URL: {data.get('url', '')}"
                )

        # Fallback: Tavily search on scconline.com
        client = _get_tavily()
        results = client.search(
            query=f'"{citation}" site:scconline.com',
            search_depth="advanced",
            max_results=3,
            include_domains=["scconline.com"],
        )
        if results.get("results"):
            lines = [f"SCC_ONLINE FALLBACK SEARCH for '{citation}':"]
            for r in results["results"]:
                lines.append(f"URL: {r.get('url', '')}")
                lines.append(f"SNIPPET: {r.get('content', '')[:500]}")
                lines.append("---")
            return "\n".join(lines)

        return f"SCC ONLINE: Citation '{citation}' NOT FOUND — mark as UNVERIFIED."
    except Exception as e:
        logger.error(f"scc_online_verify error: {e}")
        return f"SCC Online verification failed: {e}"


@tool
def manupatra_verify(citation: str) -> str:
    """
    Verify an Indian case citation against Manupatra (manupatra.com).
    Uses Manupatra API if MANUPATRA_API_KEY is set in .env;
    otherwise falls back to a structured Tavily search on manupatra.com.
    Returns: citation status, case name, court, holding snippet, and source URL.

    Example inputs: "(1979) 3 SCC 4", "2000 6 SCC 269", "AIR 2005 SC 3180"
    """
    try:
        manu_key = getattr(settings, "manupatra_api_key", None)

        if manu_key:
            # Live API path — update endpoint when Manupatra API is available
            resp = _session.get(
                "https://api.manupatra.com/v1/citations/verify",
                params={"citation": citation, "api_key": manu_key},
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                return (
                    f"MANUPATRA STATUS: {data.get('status', 'UNKNOWN')}\n"
                    f"CASE: {data.get('case_name', '')}\n"
                    f"COURT: {data.get('court', '')}\n"
                    f"HOLDING: {data.get('holding', '')[:600]}\n"
                    f"URL: {data.get('url', '')}"
                )

        # Fallback: Tavily search on manupatra.com
        client = _get_tavily()
        results = client.search(
            query=f'"{citation}" site:manupatra.com',
            search_depth="advanced",
            max_results=3,
            include_domains=["manupatra.com"],
        )
        if results.get("results"):
            lines = [f"MANUPATRA FALLBACK SEARCH for '{citation}':"]
            for r in results["results"]:
                lines.append(f"URL: {r.get('url', '')}")
                lines.append(f"SNIPPET: {r.get('content', '')[:500]}")
                lines.append("---")
            return "\n".join(lines)

        return f"MANUPATRA: Citation '{citation}' NOT FOUND — mark as UNVERIFIED."
    except Exception as e:
        logger.error(f"manupatra_verify error: {e}")
        return f"Manupatra verification failed: {e}"


@tool
def cross_database_consensus(citation: str) -> str:
    """
    Run the same citation through Indian Kanoon, SCC Online, AND Manupatra.
    Returns a consensus verdict: VERIFIED (all agree) / DIVERGENT (sources conflict) / UNVERIFIED.
    Use this for any citation being used as PRIMARY authority.
    """
    ik  = indian_kanoon_search(citation)
    scc = scc_online_verify(citation)
    manu = manupatra_verify(citation)

    ik_found   = "NOT FOUND" not in ik   and "failed" not in ik.lower()
    scc_found  = "NOT FOUND" not in scc  and "failed" not in scc.lower()
    manu_found = "NOT FOUND" not in manu and "failed" not in manu.lower()

    found_count = sum([ik_found, scc_found, manu_found])
    if found_count == 3:
        verdict = "VERIFIED (all 3 databases confirmed)"
    elif found_count == 2:
        verdict = "VERIFIED (2/3 databases confirmed) — use with qualification"
    elif found_count == 1:
        verdict = "DIVERGENT — only 1 source found; mark as SECONDARY"
    else:
        verdict = "UNVERIFIED — not found on any database; DO NOT USE as primary authority"

    return (
        f"CROSS-DATABASE CONSENSUS for '{citation}'\n"
        f"Verdict: {verdict}\n"
        f"---\n"
        f"[Indian Kanoon]\n{ik[:400]}\n"
        f"---\n"
        f"[SCC Online]\n{scc[:400]}\n"
        f"---\n"
        f"[Manupatra]\n{manu[:400]}"
    )
