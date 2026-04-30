"""
Graph API Routes
FastAPI routes for Phase 6: Citation Graph
"""

from __future__ import annotations
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/graph", tags=["graph"])


class CitationExtractionRequest(BaseModel):
    text: str
    document_id: Optional[str] = None


class GraphNode(BaseModel):
    id: str
    case_name: str
    year: int
    court: str
    reporter: str
    in_degree: int = 0
    out_degree: int = 0
    page_rank: float = 0.0
    is_landmark: bool = False
    is_bridge: bool = False


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float
    year: int


#  Citation extraction 

_CITATION_PATTERNS = [
    (re.compile(r"\((\d{4})\)\s*(\d+)\s*SCC\s*(\d+)", re.I), "SCC", 0.95),
    (re.compile(r"AIR\s*(\d{4})\s*SC\s*(\d+)", re.I), "AIR", 0.92),
    (re.compile(r"\((\d{4})\)\s*(\d+)\s*SCR\s*(\d+)", re.I), "SCR", 0.90),
    (re.compile(r"(\d{4})\s*Cri(?:minal)?\s*LJ\s*(\d+)", re.I), "CriLJ", 0.88),
    (re.compile(r"\((\d{4})\)\s*(\d+)\s*SCALE\s*(\d+)", re.I), "SCALE", 0.87),
]

_CASE_NAME_RE = re.compile(
    r"([A-Z][A-Za-z\s&.,'()-]{5,80}?)\s+(?:v\.?s?\.?|versus)\s+([A-Z][A-Za-z\s&.,'()-]{3,60}?)(?=\s*[\[(]?\d{4})"
)


def _extract_citations(text: str) -> list[dict]:
    citations = []
    seen = set()
    for pat, reporter, confidence in _CITATION_PATTERNS:
        for m in pat.finditer(text):
            try:
                if reporter == "AIR":
                    year, page = int(m.group(1)), int(m.group(2))
                    volume = None
                elif reporter == "CriLJ":
                    year, page = int(m.group(1)), int(m.group(2))
                    volume = None
                else:
                    year, volume, page = int(m.group(1)), int(m.group(2)), int(m.group(3))
                if year < 1947 or year > 2030: continue
                cid = f"{reporter}_{year}_{page}"
                if cid in seen: continue
                seen.add(cid)
                # Try to find case name
                lookback = text[max(0, m.start() - 120):m.start()]
                case_name = None
                for nm in _CASE_NAME_RE.finditer(lookback):
                    case_name = f"{nm.group(1).strip()} v. {nm.group(2).strip()}"
                court = "Supreme Court of India" if reporter in ("SCC", "SCR", "SCALE") else "Unknown"
                citations.append({
                    "id": cid, "raw": m.group(0), "case_name": case_name,
                    "year": year, "volume": volume, "reporter": reporter,
                    "page": page, "court": court, "confidence": confidence,
                })
            except (ValueError, IndexError):
                continue
    return citations


#  Routes 

@router.post("/extract")
async def extract_citations(req: CitationExtractionRequest):
    """Extract citations from text and return graph-ready data."""
    try:
        citations = _extract_citations(req.text)
        nodes = [
            {"id": c["id"], "case_name": c["case_name"] or c["raw"],
             "year": c["year"], "court": c["court"], "reporter": c["reporter"],
             "confidence": c["confidence"]}
            for c in citations
        ]
        edges = []
        if req.document_id:
            for c in citations:
                edges.append({
                    "source": req.document_id, "target": c["id"],
                    "weight": c["confidence"], "year": c["year"],
                })
        return {
            "citations": citations,
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total": len(citations),
                "by_reporter": {r: sum(1 for c in citations if c["reporter"] == r)
                                for r in {c["reporter"] for c in citations}},
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schema")
async def get_neo4j_schema():
    """Return the Neo4j graph schema for citation intelligence."""
    return {
        "node_types": {
            "Case": ["case_id", "title", "court", "year", "citation_count", "influence_score", "pagerank"],
            "Judge": ["judge_id", "name", "normalized_name"],
            "Court": ["court_id", "name", "level"],
            "Statute": ["name", "act", "section"],
            "Topic": ["name", "category"],
        },
        "relationships": [
            {"type": "CITES", "from": "Case", "to": "Case", "properties": ["weight", "year"]},
            {"type": "HEARD_BY", "from": "Case", "to": "Judge", "properties": []},
            {"type": "IN_COURT", "from": "Case", "to": "Court", "properties": []},
            {"type": "REFERS_TO", "from": "Case", "to": "Statute", "properties": ["section"]},
            {"type": "HAS_TOPIC", "from": "Case", "to": "Topic", "properties": ["confidence"]},
            {"type": "OVERRULES", "from": "Case", "to": "Case", "properties": ["year"]},
            {"type": "DISTINGUISHES", "from": "Case", "to": "Case", "properties": ["year"]},
        ],
        "cypher_examples": {
            "top_cited": "MATCH (c:Case)<-[:CITES]-(o:Case) RETURN c.title, count(o) AS citations ORDER BY citations DESC LIMIT 10",
            "citation_path": "MATCH path=shortestPath((a:Case {case_id:$id1})-[:CITES*]->(b:Case {case_id:$id2})) RETURN path",
            "judge_decisions": "MATCH (c:Case)-[:HEARD_BY]->(j:Judge {name:$name}) RETURN c.title, c.year ORDER BY c.year DESC",
        },
    }