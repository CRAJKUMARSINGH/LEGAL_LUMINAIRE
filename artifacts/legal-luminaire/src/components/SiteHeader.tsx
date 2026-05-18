import { Link } from "wouter";
import { BookOpen, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-[1100px] h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-sm shadow-sm">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
            Legal Luminaire
          </span>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline-block">About</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-5 shadow-lg">
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Legal Luminaire
              </h4>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                A scholarly legal-research tool designed for advocates and researchers. 
                It uses advanced semantic search to return highly relevant Indian case-law, 
                statutes, and engineering standards based on natural language queries.
              </p>
              <div className="text-xs text-muted-foreground/80 font-mono bg-muted p-2 rounded-md">
                For demonstration purposes only. Not legal advice.
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
