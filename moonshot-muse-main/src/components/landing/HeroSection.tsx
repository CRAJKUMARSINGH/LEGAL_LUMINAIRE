import { motion } from "framer-motion";
import { ArrowRight, Shield, Brain, FileText } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-subtle bg-primary/5 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-gold" />
            <span className="text-xs font-mono tracking-wider uppercase text-primary">
              Artemis-II Grade Legal AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6"
          >
            Stop Researching.
            <br />
            <span className="text-gradient-gold">Start Winning.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered legal document drafting for Indian courts. From bail applications to 
            constitutional writs — every citation verified, every holding verbatim, every 
            standard correctly applied.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-all"
            >
              Explore on GitHub
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-gold-subtle text-foreground hover:bg-secondary transition-colors"
            >
              See Capabilities
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
          >
            {[
              { icon: FileText, value: "21", label: "Test Cases" },
              { icon: Shield, value: "6", label: "Accuracy Rules" },
              { icon: Brain, value: "∞", label: "AI Precision" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
