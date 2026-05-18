import { defenceGrounds } from "@/data/defenceGrounds";
import { Scale, BookOpen, FlaskConical, Beaker, FileText, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

const navCards = [
  {
    icon: Shield,
    label: "Nine Defence Grounds",
    desc: "All grounds elaborated with IS standards and SC/HC precedents",
    route: "defence",
    color: "bg-primary/10 text-primary",
    badge: "9 Grounds",
  },
  {
    icon: Beaker,
    label: "Sample Integrity Analysis",
    desc: "Scientific proof: falling 1–6m into water destroys authenticity",
    route: "analysis",
    color: "bg-destructive/10 text-destructive",
    badge: "KEY SCIENCE",
  },
  {
    icon: BookOpen,
    label: "SC / HC Precedents",
    desc: "Organised by verification tier — cite with confidence",
    route: "precedents",
    color: "bg-blue-100 text-blue-700",
    badge: "20+ Cases",
  },
  {
    icon: FlaskConical,
    label: "IS Standards Reference",
    desc: "All Indian Standards with violation mapping to each ground",
    route: "standards",
    color: "bg-emerald-100 text-emerald-700",
    badge: "9 Standards",
  },
  {
    icon: FileText,
    label: "Print Representation Letter",
    desc: "Formal defence letter with all 9 grounds — print-ready for submission",
    route: "print",
    color: "bg-amber-100 text-amber-700",
    badge: "PRINTABLE",
  },
];

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Legal Luminaire</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
          Precision defence for contractors targeted by improper sampling and testing.
          Every ground. Every standard. Every precedent — verified.
        </p>
      </div>

      <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/30 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-destructive mb-1">Case Overview</div>
            <p className="text-sm text-foreground leading-relaxed">
              Samples were collected on a <strong>stormy day</strong> without the contractor's representative, using a <strong>hammer by umbrella-holding workmen on a steel ladder</strong>, 
              while the ground was <strong>flooded with ~2 feet of water</strong> — no tarpaulin spread, no proper randomisation, insufficient quantity. 
              Samples fell <strong>1–6 metres directly into the flood water</strong>. 
              The test report names <strong>no Indian Standard</strong>, does not specify whether results are a maiden test or average of three specimens, 
              and no counterpart sample was retained for independent re-testing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {navCards.map((card) => (
          <button
            key={card.route}
            onClick={() => onNavigate(card.route)}
            className="text-left rounded-xl border border-border bg-card shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{card.label}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{card.badge}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Nine Grounds — Summary
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {defenceGrounds.map((g) => (
            <button
              key={g.id}
              onClick={() => onNavigate("defence")}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-primary/30 hover:bg-muted/30 transition-all"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                {g.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{g.shortTitle}</div>
                <div className="text-xs text-muted-foreground truncate">{g.synopsis.substring(0, 80)}...</div>
              </div>
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {g.precedents.length} cases
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-5 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Verification Note:</strong> COURT_SAFE citations are from landmark decisions confirmed by multiple authoritative sources. VERIFIED citations are confirmed on official sources. SECONDARY citations are from credible secondary sources and should be cited with a qualification note. Always verify current binding value before filing. This tool does not constitute legal advice — consult a qualified advocate for formal proceedings.
      </div>
    </div>
  );
}
