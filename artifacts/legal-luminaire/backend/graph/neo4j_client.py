# Neo4j Client for Legal Luminaire
from __future__ import annotations
import os
from typing import Optional

try:
    from neo4j import GraphDatabase
    NEO4J_AVAILABLE = True
except ImportError:
    NEO4J_AVAILABLE = False


class Neo4jClient:
    def __init__(self, uri=None, user=None, password=None):
        self.uri = uri or os.getenv('NEO4J_URI', 'bolt://localhost:7687')
        self.user = user or os.getenv('NEO4J_USER', 'neo4j')
        self.password = password or os.getenv('NEO4J_PASSWORD', '')
        self._driver = None

    def connect(self) -> bool:
        if not NEO4J_AVAILABLE: return False
        try:
            self._driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            self._driver.verify_connectivity()
            return True
        except Exception:
            self._driver = None
            return False

    def close(self):
        if self._driver:
            self._driver.close()
            self._driver = None

    def is_connected(self) -> bool:
        return self._driver is not None

    def run_query(self, cypher: str, params=None) -> list:
        if not self._driver: return []
        with self._driver.session() as session:
            return [dict(r) for r in session.run(cypher, params or {})]

    def create_constraints(self):
        stmts = [
            'CREATE CONSTRAINT IF NOT EXISTS FOR (c:Case) REQUIRE c.case_id IS UNIQUE',
            'CREATE CONSTRAINT IF NOT EXISTS FOR (j:Judge) REQUIRE j.judge_id IS UNIQUE',
        ]
        for s in stmts:
            self.run_query(s)

    def upsert_case(self, case_id, title, court, year, citation_count=0, influence_score=0.0):
        cypher = 'MERGE (c:Case {case_id: $case_id}) SET c.title=$title, c.court=$court, c.year=$year, c.citation_count=$cc, c.influence_score=$is RETURN c'
        return bool(self.run_query(cypher, {'case_id': case_id, 'title': title, 'court': court, 'year': year, 'cc': citation_count, 'is': influence_score}))

    def get_top_cited(self, limit=10):
        cypher = 'MATCH (c:Case) RETURN c.case_id, c.title, c.citation_count ORDER BY c.citation_count DESC LIMIT $limit'
        return self.run_query(cypher, {'limit': limit})


_client = None

def get_neo4j_client():
    global _client
    if _client is None:
        _client = Neo4jClient()
        _client.connect()
    return _client
