"""
Forensic & Legal Standards Index - Week 3 Legal RAG
Curated list of Indian Standards (BIS/IS) and procedural protocols for grounding.
"""
from typing import Dict, List, Optional

FORENSIC_STANDARDS = [
    {
        "code": "IS 456:2000",
        "title": "Plain and Reinforced Concrete - Code of Practice",
        "keywords": ["concrete", "beam", "slab", "curing", "reinforcement", "strength"],
        "violations": [
            "Inadequate curing time",
            "Improper placement of reinforcement",
            "Non-compliant water-cement ratio"
        ]
    },
    {
        "code": "IS 1199:1959",
        "title": "Methods of Sampling and Analysis of Concrete",
        "keywords": ["sampling", "fresh concrete", "mortar", "slump", "cubes"],
        "violations": [
            "Non-representative sampling",
            "Sampling without presence of contractor",
            "Improper storage of samples before testing",
            "Failure to document chain of custody"
        ]
    },
    {
        "code": "IS 516:1959",
        "title": "Methods of Tests for Strength of Concrete",
        "keywords": ["compressive strength", "testing", "FSL", "lab report", "core test"],
        "violations": [
            "Testing outside of specified age (e.g. 28 days)",
            "Incorrect loading rates in machine",
            "Use of uncalibrated testing equipment"
        ]
    },
    {
        "code": "IPC Section 409",
        "title": "Criminal Breach of Trust by Public Servant",
        "keywords": ["public servant", "government project", "misappropriation", "corruption"],
        "violations": ["Willful use of inferior materials to siphon funds"]
    },
    {
        "code": "BIS Procedural Manual (Sampling)",
        "title": "Protocol for Joint Sampling in Criminal Investigations",
        "keywords": ["joint sampling", "panchama", "seizure", "investigation officer"],
        "violations": [
            "Absence of independent witnesses",
            "Failure to seal samples on-site",
            "Haphazard collection from a single location"
        ]
    }
]

def find_relevant_standards(text: str) -> List[Dict]:
    """Simple keyword matching to find applicable standards for grounding."""
    text_lower = text.lower()
    matches = []
    for std in FORENSIC_STANDARDS:
        if any(kw.lower() in text_lower for kw in std["keywords"]):
            matches.append(std)
    return matches
