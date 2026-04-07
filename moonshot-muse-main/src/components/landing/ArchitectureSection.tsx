import { motion } from "framer-motion";
import { Monitor, Server, Cloud } from "lucide-react";

const layers = [
  {
    icon: Monitor,
    label: "Frontend",
    tech: "React 19 + TypeScript + Vite + Tailwind CSS + Radix UI",
    color: "text-blue-400",
  },
  {
    icon: Server,
    label: "Backend",
    tech: "FastAPI + CrewAI + LangChain + ChromaDB (RAG)",
    color: "text-primary",
  },
  {
    icon: Cloud,
    label: "Deploy",
    tech: "Streamlit Cloud / Netlify / Vercel / Docker Compose",
    color: "text-emerald-400",
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-primary mb-3 block">
            Engineering
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Built for <span className="text-gradient-gold">Scale</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-6 p-6 rounded-xl bg-glass hover:shadow-gold transition-all group"
            >
              <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <layer.icon className={`h-7 w-7 ${layer.color}`} />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-foreground mb-1">{layer.label}</div>
                <div className="font-mono text-sm text-muted-foreground">{layer.tech}</div>
              </div>
              <div className="ml-auto hidden sm:block">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-gold" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector lines visual */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground font-mono">
            MIT Licensed · Open Source · Production Ready
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
