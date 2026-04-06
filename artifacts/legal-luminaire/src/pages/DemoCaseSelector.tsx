import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoBanner } from "@/components/DemoBanner";
import { demoCasesList } from "@/data/demo-cases/demo01";
import { ArrowRight, Star } from "lucide-react";

export default function DemoCaseSelector() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DemoBanner />
      <div className="p-8 max-w-6xl mx-auto w-full flex-1">
        <div className="mb-12 text-center mt-6">
          <Badge variant="secondary" className="mb-4 text-xs font-mono">Legal Luminaire Beta</Badge>
          <h1 className="text-4xl font-bold mb-4 font-serif text-foreground">Interactive Demo Cases</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience our zero-hallucination accuracy gate without an API key or sensitive data.
            Select a synthetic case below to explore the AI workflow, verification tiers, and output matrices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCasesList.map((demoCase, idx) => (
            <Card key={demoCase.id} className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer group flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="font-mono text-xs shadow-sm bg-background">
                    {demoCase.id}
                  </Badge>
                  {idx === 0 && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </Badge>
                  )}
                  {idx === 3 && (
                    <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none gap-1 shadow-sm">
                      <Star className="w-3 h-3" /> Showcase
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {demoCase.title.replace("[DEMO] ", "")}
                </CardTitle>
                <CardDescription className="text-xs font-mono mt-1">
                  {demoCase.court} | {demoCase.charges}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">
                  {demoCase.summary}
                </p>
                <Link href={`/case/case01/dashboard`} className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-auto shadow-sm">
                  Launch Workspace <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
