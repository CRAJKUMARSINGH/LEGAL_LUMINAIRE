import { sampleIntegrityAnalysis } from "@/data/defenceGrounds";
import { Beaker, Zap, Droplets, AlertTriangle, Scale } from "lucide-react";

const icons = [Zap, Zap, Droplets, Beaker, AlertTriangle, Scale, Scale, Scale];

export default function SampleAnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sample Integrity Analysis</h1>
            <p className="text-muted-foreground text-sm">Scientific & legal analysis of falling-sample contamination</p>
          </div>
        </div>
        <p className="text-base text-foreground leading-relaxed">{sampleIntegrityAnalysis.overview}</p>
      </div>

      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-destructive text-sm uppercase tracking-wide mb-2">The Core Scientific Problem</div>
            <p className="text-sm text-foreground leading-relaxed">
              A plaster/mortar sample that falls from a height of <strong>1 to 6 metres</strong> into <strong>approximately 2 feet of standing water</strong> on the ground is irreversibly contaminated at the moment of impact. Its physical composition, chemical state, and particulate distribution are all altered — making any subsequent laboratory test result completely unrepresentative of the in-situ material quality.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sampleIntegrityAnalysis.factors.map((item, i) => {
          const Icon = icons[i] || Beaker;
          return (
            <div key={i} className="rounded-xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">{item.factor}</h3>
                  <p className="text-sm text-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <Scale className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground text-lg mb-3">Legal Conclusion</h3>
            <p className="text-sm text-foreground leading-relaxed font-medium">{sampleIntegrityAnalysis.conclusion}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="font-bold text-foreground mb-4">Velocity & Energy at Impact (Physics)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Drop Height</th>
                <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Impact Velocity</th>
                <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Kinetic Energy (100g fragment)</th>
                <th className="text-left py-2 font-semibold text-muted-foreground">Water Jet Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { h: "1 m", v: "4.4 m/s", ke: "~0.97 J", effect: "Moderate splash, fines dispersed in ~30 cm radius" },
                { h: "2 m", v: "6.3 m/s", ke: "~1.98 J", effect: "Significant splash, Worthington jet formation" },
                { h: "3 m", v: "7.7 m/s", ke: "~2.97 J", effect: "Strong jet, fines in 60–80 cm splash radius" },
                { h: "6 m", v: "10.8 m/s", ke: "~5.83 J", effect: "Violent impact, complete fragmentation, fines lost" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2 pr-4 font-mono font-bold text-primary">{row.h}</td>
                  <td className="py-2 pr-4 font-mono">{row.v}</td>
                  <td className="py-2 pr-4 font-mono">{row.ke}</td>
                  <td className="py-2 text-muted-foreground">{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * v = √(2gh); KE = ½mv²; m = 100g (0.1 kg). Higher energy = greater dispersal of fine particles = lower measured strength on recovered 'sample'.
        </p>
      </div>
    </div>
  );
}
