import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Authority } from "@/data/citations";
import { highlight } from "@/lib/search";
import { HighlightedText } from "./HighlightedText";
import { MatchedTermChips } from "./MatchedTermChips";
import { cn } from "@/lib/utils";

interface AuthorityCardProps {
  authority: Authority;
  score: number;
  matchedTerms: string[];
  isTopMatch?: boolean;
  rank: number;
}

export function AuthorityCard({
  authority,
  score,
  matchedTerms,
  isTopMatch = false,
  rank,
}: AuthorityCardProps) {
  const kindLabels = {
    case: "Case Law",
    statute: "Statute",
    standard: "Standard",
  };

  const kindColors = {
    case: "bg-primary text-primary-foreground",
    statute: "bg-secondary text-secondary-foreground border-secondary-border border",
    standard: "bg-muted text-muted-foreground border-muted-border border",
  };

  const snippet = isTopMatch
    ? authority.holding
    : authority.holding.length > 250
    ? authority.holding.substring(0, 250) + "..."
    : authority.holding;

  const highlightedSnippet = highlight(snippet, matchedTerms);

  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both", `delay-[${Math.min(rank * 100, 500)}ms]`)}>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md border-border/60",
          isTopMatch ? "border-primary/30 shadow-md ring-1 ring-primary/10" : ""
        )}
      >
        {isTopMatch && (
          <div className="bg-primary/5 border-b border-primary/10 px-6 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Top Match</span>
            <span className="text-xs text-muted-foreground font-mono">Score {score.toFixed(1)}</span>
          </div>
        )}
        <CardContent className={cn("p-6", isTopMatch ? "pt-5" : "")}>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("rounded-sm font-sans uppercase tracking-widest text-[10px]", kindColors[authority.kind])}>
                    {kindLabels[authority.kind]}
                  </Badge>
                  {!isTopMatch && (
                    <span className="text-xs text-muted-foreground font-mono">Score {score.toFixed(1)}</span>
                  )}
                  {authority.year && (
                    <span className="text-xs text-muted-foreground font-serif">{authority.year}</span>
                  )}
                </div>
                <div className="text-sm font-serif italic text-muted-foreground text-right">
                  {authority.court || authority.jurisdiction}
                </div>
              </div>
              
              <Link href={`/authority/${authority.id}`} className="inline-block group">
                <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {authority.title}
                </h3>
              </Link>
              
              {authority.citation && (
                <div className="text-sm font-serif text-muted-foreground mt-1">
                  {authority.citation}
                </div>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none font-sans text-muted-foreground leading-relaxed">
              <HighlightedText text={highlightedSnippet} />
            </div>

            {isTopMatch && authority.application && (
              <div className="bg-muted/30 p-4 rounded-md border border-border/50 mt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Application</h4>
                <p className="text-sm text-foreground/80 font-serif leading-relaxed">
                  {authority.application.length > 200 
                    ? authority.application.substring(0, 200) + "..." 
                    : authority.application}
                </p>
              </div>
            )}

            {matchedTerms.length > 0 && (
              <div className="mt-2 pt-4 border-t border-border/40">
                <MatchedTermChips terms={matchedTerms} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
