import { useState, useCallback, useEffect } from "react";
import {
  Search, Sparkles, ExternalLink, Loader2, AlertTriangle,
  ShieldCheck, BookOpen, Scale, Database, X,
} from "lucide-react";
import {
  searchLegalCorpus, getCorpusStats,
  type LegalSearchHit, type LegalSearchResponse, type LegalCorpusStats,
} from "@/lib/legal-search-client";
import { Badge } from "@/components/ui/badge";

const PRESET_QUERIES = [
  "erroneous bridge design / collapse / 17 died / contractor acquitted / Kota Rajasthan",
  "stadium wall collapse forensic mortar sampling chain of custody",
  "flyover collapse deferred maintenance multi-agency Kolkata",
  "discharge application 250 BNSS prima facie standard",
  "FSL report wrong IS standard mortar concrete sampling",
  "stepwell roof collapse owner knowledge concealment",
];

const PRIORITY_STYLES: Record<LegalSearchHit["priority"], string> = {
  binding: "bg-emerald-100 text-emerald-800 border-emerald-300",
  persuasive: "bg-blue-100 text-blue-800 border-blue-300",
  secondary: "bg-amber-100 text-amber-800 border-amber-300",
};

const KIND_ICONS = {
  precedent: Scale,
  statute: BookOpen,
  standard: ShieldCheck,
} as const;

function HitCard({ hit }: { hit: LegalSearchHit }) {
  const Icon = KIND_ICONS[hit.kind];
  return (
    <div className="border border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 text-primary shrink-0" />
          <h4 className="font-semibold text-sm text-foreground truncate">{hit.name}</h4>
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <Badge variant="outline" className={`text-xs ${PRIORITY_STYLES[hit.priority]}`}>
            {hit.priority.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs font-mono">
            score {hit.score}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-mono mb-1">{hit.citation}</p>
      {hit.court && <p className="text-xs text-muted-foreground">{hit.court}{hit.date ? ` · ${hit.date}` : ""}</p>}

      {hit.incident && (
        <p className="text-xs text-foreground/90 mt-2 italic">
          <span className="font-semibold">Incident:</span> {hit.incident}
        </p>
      )}

      <div className="mt-3 p-3 bg-muted/40 rounded-lg">
        <p className="text-xs font-semibold text-foreground mb-1">Holding</p>
        <p className="text-xs text-foreground/80 leading-relaxed">{hit.holding}</p>
      </div>

      <div className="mt-2 p-3 bg-accent/30 rounded-lg">
        <p className="text-xs font-semibold text-accent-foreground mb-1">Application</p>
        <p className="text-xs text-accent-foreground/80 leading-relaxed">{hit.application}</p>
      </div>

      {hit.matchedTerms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Matched:</span>
          {hit.matchedTerms.slice(0, 8).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {t}
            </span>
          ))}
          {hit.matchedTerms.length > 8 && (
            <span className="text-[10px] text-muted-foreground">+{hit.matchedTerms.length - 8} more</span>
          )}
        </div>
      )}

      <a href={hit.sourceUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3">
        <ExternalLink className="w-3 h-3" /> Verify on source
      </a>
    </div>
  );
}

function readUrlQuery(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("q")?.trim() ?? "";
}

export default function SmartCitationSearch() {
  const initialQuery = readUrlQuery();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LegalSearchResponse | null>(null);
  const [stats, setStats] = useState<LegalCorpusStats | null>(null);
  const [activeKind, setActiveKind] = useState<"all" | "precedent" | "statute" | "standard">("all");

  useEffect(() => {
    getCorpusStats().then(setStats).catch(() => setStats(null));
  }, []);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await searchLegalCorpus(q, { limit: 25, kind: activeKind });
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [activeKind]);

  // Auto-run search if URL has a ?q= parameter on mount
  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run when kind filter changes (if we already have a query)
  useEffect(() => {
    if (result && result.query) {
      runSearch(result.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKind]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handlePreset = (preset: string) => {
    setQuery(preset);
    runSearch(preset);
  };

  const allHits = result
    ? [...result.precedents, ...result.statutes, ...result.standards].sort((a, b) => b.score - a.score)
    : [];

  return (
    <section className="border border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 via-card to-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" /> Smart Citation Search
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Free-text search across {stats ? `${stats.totalItems} ` : ""}Indian precedents, statutes & engineering standards.
            Synonym-aware (collapse/fall, contractor/builder, acquit/discharge). Top match is the most legally relevant authority.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. erroneous bridge design collapse 17 died contractor acquitted Kota Rajasthan"
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResult(null); setError(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium">Try:</span>
        {PRESET_QUERIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePreset(p)}
            className="text-xs px-2.5 py-1 rounded-full border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
            title={p}
          >
            {p.length > 60 ? p.slice(0, 57) + "…" : p}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Search failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
            <p className="text-xs text-muted-foreground">{result.summary}</p>
            <div className="flex gap-1">
              {([
                { id: "all" as const,        label: "All",        count: result.total },
                { id: "precedent" as const,  label: "Precedents", count: result.precedents.length },
                { id: "statute" as const,    label: "Statutes",   count: result.statutes.length },
                { id: "standard" as const,   label: "Standards",  count: result.standards.length },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveKind(tab.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeKind === tab.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {result.tokens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[10px]">
              <Database className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground uppercase tracking-wide">Tokens:</span>
              {result.tokens.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                  {t}
                </span>
              ))}
            </div>
          )}

          {allHits.length === 0 && !loading && (
            <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-lg">
              No matches in this category. Try widening the filter to "All".
            </div>
          )}

          <div className="grid gap-3">
            {allHits.map((hit) => (
              <HitCard key={hit.id} hit={hit} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
