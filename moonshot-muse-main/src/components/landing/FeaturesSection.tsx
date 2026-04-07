import { motion } from "framer-motion";
import { Brain, FileSearch, BarChart3, Shield, Scale, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Drafting",
    desc: "CrewAI multi-agent pipeline generates defence replies, bail applications, discharge petitions, and writs with court-specific formatting.",
  },
  {
    icon: FileSearch,
    title: "Precedent Search & RAG",
    desc: "ChromaDB-powered retrieval-augmented generation ensures every citation is real, verified, and includes full case name, court, date, and paragraph number.",
  },
  {
    icon: Scale,
    title: "Case Dashboard",
    desc: "Track multiple cases with timeline views, document trees, correspondence logs, party details, and billing — all in one unified interface.",
  },
  {
    icon: Shield,
    title: "Accuracy Governance",
    desc: "Non-negotiable accuracy rules: verbatim holdings only, correct IS/ASTM standards, Fact-Fit Gate scoring, and PENDING citation blocking.",
  },
  {
    icon: BarChart3,
    title: "Standards Matrix",
    desc: "IS 1199:2018, IS 2250:1981, ASTM, NABL — automatically maps correct standards to case context. No misapplication possible.",
  },
  {
    icon: Zap,
    title: "Multi-Format Export",
    desc: "Generate .lex, .pdf, and structured JSON outputs. Seamless integration with existing legal workflows and court filing systems.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-primary mb-3 block">
            Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Mission-Critical <span className="text-gradient-gold">Legal AI</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every feature built with the precision of aerospace engineering applied to Indian jurisprudence.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group p-6 rounded-xl bg-glass hover:shadow-gold transition-all duration-500 hover:border-gold-subtle"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
