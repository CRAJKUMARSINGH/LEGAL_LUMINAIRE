import { Scale, Code2, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              Legal <span className="text-gradient-gold">Luminaire</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-md">
            All synthetic documents, test cases, and examples are entirely fictional. This platform is not a substitute for professional legal advice.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Code2 className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-mono">MIT License · Built with conviction · © 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
