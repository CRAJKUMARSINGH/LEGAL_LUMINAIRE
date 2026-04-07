import { motion } from "framer-motion";
import { Scale, Code2, ExternalLink } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Legal <span className="text-gradient-gold">Luminaire</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#cases" className="hover:text-primary transition-colors">Test Cases</a>
          <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
          <a href="#accuracy" className="hover:text-primary transition-colors">Accuracy</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold-subtle text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-gold text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Launch App
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
