import { Badge } from "@/components/ui/badge";

export function MatchedTermChips({ terms, max = 12 }: { terms: string[]; max?: number }) {
  if (!terms || terms.length === 0) return null;

  const displayTerms = terms.slice(0, max);
  const remaining = terms.length - max;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mr-1 font-semibold">Matched:</span>
      {displayTerms.map((term) => (
        <Badge
          key={term}
          variant="secondary"
          className="text-[10px] py-0 px-1.5 h-5 bg-secondary/50 text-secondary-foreground/80 hover:bg-secondary transition-colors"
        >
          {term}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 text-muted-foreground border-dashed">
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}
