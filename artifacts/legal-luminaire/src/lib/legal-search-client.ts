/**
 * Client for the API server's free-text legal citation search.
 * Calls /api/legal-search?q=… on the workspace's api-server artifact.
 */

const API_BASE = (import.meta.env.VITE_LEGAL_SEARCH_API as string | undefined) ?? "/api";

export type SearchKind = "precedent" | "statute" | "standard";

export interface LegalSearchHit {
  kind: SearchKind;
  id: string;
  name: string;
  citation: string;
  court?: string;
  date?: string;
  holding: string;
  application: string;
  incident?: string;
  tags: string[];
  priority: "binding" | "persuasive" | "secondary";
  sourceUrl: string;
  score: number;
  matchedTerms: string[];
  matchedFields: string[];
}

export interface LegalSearchResponse {
  query: string;
  tokens: string[];
  total: number;
  precedents: LegalSearchHit[];
  statutes: LegalSearchHit[];
  standards: LegalSearchHit[];
  summary: string;
}

export interface LegalCorpusStats {
  totalItems: number;
  breakdown: Record<string, number>;
}

export async function searchLegalCorpus(
  query: string,
  options: { limit?: number; kind?: "all" | SearchKind } = {},
): Promise<LegalSearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (options.limit) params.set("limit", String(options.limit));
  if (options.kind) params.set("kind", options.kind);

  const res = await fetch(`${API_BASE}/legal-search?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<LegalSearchResponse>;
}

export async function getCorpusStats(): Promise<LegalCorpusStats> {
  const res = await fetch(`${API_BASE}/legal-search/corpus-stats`);
  if (!res.ok) {
    throw new Error(`Stats failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<LegalCorpusStats>;
}
