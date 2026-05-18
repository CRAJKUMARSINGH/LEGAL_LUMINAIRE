import { defenceGrounds } from "@/data/defenceGrounds";
import { FlaskConical, AlertTriangle } from "lucide-react";

export default function StandardsPage() {
  const allStandards = defenceGrounds.flatMap((g) =>
    g.isStandards.map((s) => ({ ...s, groundId: g.id, groundTitle: g.shortTitle }))
  );

  const uniqueCodes = new Set<string>();
  const deduped = allStandards.filter((s) => {
    if (uniqueCodes.has(s.code)) return false;
    uniqueCodes.add(s.code);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Indian Standards Reference</h1>
            <p className="text-muted-foreground text-sm">All IS codes relied upon — violations mapped to defence grounds</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {deduped.map((std, i) => {
          const inGrounds = allStandards.filter((s) => s.code === std.code);
          return (
            <div key={i} className="rounded-xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="font-mono text-sm font-bold bg-primary/10 text-primary rounded-lg px-3 py-2 block">{std.code}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{std.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {inGrounds.map((g, j) => (
                      <span key={j} className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-medium">
                        Ground {g.groundId}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    {inGrounds.map((g, j) => (
                      <div key={j}>
                        <div className="text-xs font-semibold text-muted-foreground">Relevant Clause (Ground {g.groundId} — {g.groundTitle}):</div>
                        <p className="text-sm text-foreground">{g.relevantClause}</p>
                        <div className="flex items-start gap-1.5 mt-1 text-sm text-destructive">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{g.violation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="font-bold text-foreground mb-4">The Critical Standard Mix-Up: IS 1199:2018 vs IS 2250:1981</h3>
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-sm leading-relaxed">
            One of the most powerful arguments in the Legal Luminaire case library is the <strong>standard mix-up</strong>. In the Hemraj stadium collapse case, the prosecution's FSL report applied <span className="font-mono font-bold text-destructive">IS 1199:2018</span> (fresh concrete testing) to test <em>hardened masonry mortar</em>. The correct standard was <span className="font-mono font-bold text-primary">IS 2250:1981</span>.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3">
              <div className="font-bold text-destructive text-sm mb-2">IS 1199:2018 — WRONG</div>
              <ul className="text-xs space-y-1 text-foreground">
                <li>Designed for <strong>fresh concrete</strong> during construction</li>
                <li>Sampling from freshly mixed batch</li>
                <li>Tests slump, flow, and fresh properties</li>
                <li>Strength benchmarks for fresh-cast specimens</li>
                <li><strong>Cannot be applied to post-facto hardened mortar</strong></li>
              </ul>
            </div>
            <div className="border border-primary/30 bg-primary/5 rounded-lg p-3">
              <div className="font-bold text-primary text-sm mb-2">IS 2250:1981 — CORRECT</div>
              <ul className="text-xs space-y-1 text-foreground">
                <li>Designed for <strong>masonry mortar</strong> (plaster, pointing, bedding)</li>
                <li>Sampling from hardened, in-situ structures</li>
                <li>Tests compressive strength of mortar cubes</li>
                <li>Appropriate benchmarks for completed plastering work</li>
                <li><strong>Correct standard for this case</strong></li>
              </ul>
            </div>
          </div>
          <p className="text-sm leading-relaxed mt-4 text-destructive font-medium">
            If the test report does not mention the IS applied, the contractor must demand disclosure and challenge whether the correct standard was used. Applying the wrong standard renders ALL test values meaningless.
          </p>
        </div>
      </div>
    </div>
  );
}
