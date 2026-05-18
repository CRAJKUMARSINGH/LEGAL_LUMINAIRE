/**
 * CitationSearchPage — merged from Citation-Explorer repo
 * Full-text search across 25+ verified Indian legal authorities:
 * cases, statutes, IS/IRC standards. Synonym-aware, scored, with
 * related-authority graph. No API key required — runs entirely client-side.
 */
import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { search, TOTAL_AUTHORITIES, TOTAL_BY_KIND, type SearchResult } from "@/lib/search";
import { AuthorityCard } from "@/components/AuthorityCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Scale, BookText, FileText, Sparkles, Database } from "lucide-react";

const PRESET_QUERIES = [
  "erroneous bridge design collapse contractor acquitted Kota Rajasthan",
  "stadium wall collapse forensic mortar sampling chain of custody",
  "flyover collapse deferred maintenance multi-agency Kolkata",
  "discharge application 250 BNSS prima facie standard",
  "FSL report wrong IS standard mortar concrete sampling",
  "stepwell roof collapse owner knowledge concealment",
  "professional negligence standard of care Jacob Mathew",
  "res ipsa loquitur criminal negligence 304A",
];

function readUrlQuery(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
}

export default function CitationSearchPage() {
  const [query, setQuery] = useState(readUrlQuery);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setQuery(q);
    // Defer to next tick so loading state renders
    setTimeout(() => {
      setResult(search(q));
      setIsLoading(false);
    }, 0);
  }, []);

  // Auto-run if URL has ?q=
  useEffect(() => {
    const q = readUrlQuery();
    if (q) runSearch(q);
  }, [runSearch]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 shrink-0">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Citation Explorer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Free-text search across {TOTAL_AUTHORITIES} verified Indian legal authorities —
              cases, statutes &amp; engineering standards. Synonym-aware, scored, no API key needed.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-[11px]">
                <Scale className="h-3 w-3" /> {TOTAL_BY_KIND.case} Cases
              </Badge>
              <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 gap-1 text-[11px]">
                <BookText className="h-3 w-3" /> {TOTAL_BY_KIND.statute} Statutes
              </Badge>
              <Badge variant="outline" className="gap-1 text-[11px]">
                <FileText className="h-3 w-3" /> {TOTAL_BY_KIND.standard} Standards
              </Badge>
              <Badge variant="outline" className="gap-1 text-[11px]">
                <Database className="h-3 w-3" /> Client-side · No API key
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <SearchBar initialQuery={query} onSearch={runSearch} isLoading={isLoading} />

      {/* Preset queries */}
      {!result && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Try a sample query:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => runSearch(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
              >
                {p.length > 65 ? p.slice(0, 62) + "…" : p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-b border-border pb-3">
            <span>
              <strong className="text-foreground">{result.hits.length}</strong> result{result.hits.length !== 1 ? "s" : ""} for{" "}
              <em>"{result.hits.length > 0 ? query : query}"</em>
              {" · "}{result.durationMs}ms
            </span>
            {result.expandedTokens.length > result.queryTokens.length && (
              <span className="flex flex-wrap gap-1 items-center">
                <span className="text-muted-foreground">Expanded:</span>
                {result.expandedTokens
                  .filter((t) => !result.queryTokens.includes(t))
                  .slice(0, 8)
                  .map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">{t}</span>
                  ))}
              </span>
            )}
          </div>

          {result.hits.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No authorities matched your query.</p>
              <p className="text-sm mt-1">Try different keywords or a broader description.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {result.hits.map((hit, i) => (
                <AuthorityCard
                  key={hit.authority.id}
                  authority={hit.authority}
                  score={hit.score}
                  matchedTerms={hit.matchedTerms}
                  isTopMatch={i === 0}
                  rank={i}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
