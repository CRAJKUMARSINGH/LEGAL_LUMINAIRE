import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { getById, getRelated } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Scale, BookText, FileText, ChevronRight } from "lucide-react";
import NotFound from "@/pages/not-found";

export default function AuthorityDetail() {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!id) return <NotFound />;

  const authority = getById(id);
  if (!authority) return <NotFound />;

  const related = getRelated(authority);

  const kindLabels = {
    case: "Case Law",
    statute: "Statute",
    standard: "Standard",
  };

  const KindIcon = {
    case: Scale,
    statute: BookText,
    standard: FileText,
  }[authority.kind];

  return (
    <div className="flex-1 w-full max-w-[1100px] mx-auto px-4 py-8 md:py-12">
      <Link href="/citation-search" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Citation Search
      </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <article className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={authority.kind === 'case' ? 'default' : authority.kind === 'statute' ? 'secondary' : 'outline'} className="rounded-sm font-sans uppercase tracking-widest text-xs px-2.5 py-1">
                  <KindIcon className="mr-1.5 h-3 w-3" />
                  {kindLabels[authority.kind]}
                </Badge>
                {authority.year && (
                  <span className="text-sm font-serif text-muted-foreground">
                    {authority.year}
                  </span>
                )}
                <span className="text-sm font-serif italic text-muted-foreground ml-auto">
                  {authority.jurisdiction}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight tracking-tight mb-4">
                {authority.title}
              </h1>

              <div className="flex flex-col gap-2">
                {authority.citation && (
                  <div className="text-lg font-serif italic text-muted-foreground">
                    {authority.citation}
                  </div>
                )}
                {authority.court && (
                  <div className="text-base font-serif text-foreground/80 font-medium">
                    {authority.court}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-10">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center">
                  <span className="bg-muted w-8 h-[1px] mr-4 inline-block"></span>
                  Holding
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-loose text-foreground/90 relative">
                  <span className="float-left text-6xl leading-[0.8] mr-3 font-bold text-primary opacity-20 font-serif">
                    {authority.holding.charAt(0)}
                  </span>
                  <p className="indent-0 mt-0">
                    {authority.holding.substring(1)}
                  </p>
                </div>
              </section>

              {authority.application && (
                <section className="bg-card border border-border/50 p-6 md:p-8 rounded-xl shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center">
                    Application
                  </h2>
                  <div className="prose prose-base dark:prose-invert max-w-none font-sans leading-relaxed text-muted-foreground">
                    <p>{authority.application}</p>
                  </div>
                </section>
              )}
            </div>

            <Separator className="my-10" />
            
            <div className="flex flex-wrap items-center gap-2 mb-10">
              <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
              {authority.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
                  {tag}
                </Badge>
              ))}
            </div>

            {authority.source && (
              <div className="mt-8">
                <Button asChild variant="outline" className="font-serif">
                  <a href={authority.source} target="_blank" rel="noopener noreferrer">
                    View Original Source
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              
              {related.length > 0 && (
                <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-muted/30 px-5 py-4 border-b border-border/50">
                    <h3 className="font-serif font-bold text-foreground">Related Authorities</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-border/40">
                    {related.map(rel => (
                      <Link 
                        key={rel.id} 
                        href={`/authority/${rel.id}`}
                        className="p-5 hover:bg-accent/50 transition-colors group flex items-start gap-3"
                      >
                        <div className="mt-0.5 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
                          {rel.kind === 'case' ? <Scale className="h-4 w-4" /> : 
                           rel.kind === 'statute' ? <BookText className="h-4 w-4" /> : 
                           <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-medium text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                            {rel.shortTitle || rel.title}
                          </h4>
                          {rel.citation && (
                            <div className="text-xs font-serif italic text-muted-foreground line-clamp-1">
                              {rel.citation}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all self-center" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <h3 className="font-serif font-bold text-primary mb-2 text-sm">Citation Format</h3>
                <div className="font-mono text-xs text-muted-foreground bg-background border border-border/50 p-3 rounded-md break-words select-all">
                  {authority.title}{authority.citation ? `, ${authority.citation}` : ''} ({authority.year || 'n.d.'})
                </div>
              </div>

            </div>
          </aside>
        </div>
    </div>
  );
}
