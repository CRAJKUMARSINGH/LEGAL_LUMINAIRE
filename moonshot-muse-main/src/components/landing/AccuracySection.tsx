import { motion } from "framer-motion";
import { AlertTriangle, Ban, Quote, FlaskConical, Target, Lock } from "lucide-react";

const rules = [
  { icon: Quote, rule: "Every citation must include full case name, citation, court, date, verified URL, and paragraph number" },
  { icon: Lock, rule: "Holdings are verbatim quotes only — paraphrasing is forbidden" },
  { icon: FlaskConical, rule: "IS 1199:2018 applies to fresh concrete only — never to hardened masonry mortar" },
  { icon: AlertTriangle, rule: "IS 2250:1981 is the correct standard for masonry mortar" },
  { icon: Ban, rule: "PENDING citations are blocked from all draft output" },
  { icon: Target, rule: "Fact-Fit Gate score < 30 → citation rejected, never used as primary authority" },
];

const AccuracySection = () => {
  return (
    <section id="accuracy" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-destructive/[0.02] to-transparent" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-destructive mb-3 block">
            Non-Negotiable
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Accuracy <span className="text-gradient-gold">Rules</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In legal AI, one wrong citation can destroy a case. These rules are hardcoded — no override, no bypass, no exception.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {rules.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-5 rounded-xl bg-glass border border-destructive/10 hover:border-primary/20 transition-colors"
            >
              <r.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/90 leading-relaxed">{r.rule}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccuracySection;
