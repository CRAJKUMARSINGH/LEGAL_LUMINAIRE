import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Files, Clock, ArrowRight, BookOpen, FlaskConical, MessageSquare, LayoutDashboard } from "lucide-react";

// Static case session for Hemraj Vardar (Case 01)
const SESSIONS = [
  {
    id: "case01",
    title: "Hemraj Vardar — Stadium Wall Collapse Defence",
    caseNumber: "1/2025-Udaipur",
    court: "Special Session Court, Udaipur (Rajasthan)",
    accusedName: "Hemraj Vardar (Contractor / Director)",
    sections: "IPC 304A, 337, 338 + PC Act | BNSS §250 Discharge",
    documentCount: 16,
    draftCount: 3,
    status: "Active — Defence Preparation",
    createdAt: "2026-04-02",
  },
];

const QUICK_LINKS = [
  { href: "/case/case01/dashboard", label: "Case Dashboard", icon: LayoutDashboard, color: "text-primary" },
  { href: "/case/case01/discharge-application", label: "Discharge Application", icon: Scale, color: "text-emerald-600" },
  { href: "/case/case01/defence-reply", label: "Defence Reply v3", icon: FileText, color: "text-blue-600" },
  { href: "/case/case01/case-law", label: "Case Law Matrix", icon: BookOpen, color: "text-violet-600" },
  { href: "/case/case01/standards", label: "Standards Matrix", icon: FlaskConical, color: "text-amber-600" },
  { href: "/case/case01/timeline", label: "Case Timeline", icon: Clock, color: "text-rose-600" },
  { href: "/case/case01/chat", label: "AI Drafter Chat", icon: MessageSquare, color: "text-teal-600" },
  { href: "/case/case01/documents", label: "Documents", icon: Files, color: "text-slate-600" },
];

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Legal Luminaire — Chamber Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Zero-hallucination defence AI · Manage case sessions, analyze documents, generate court-ready drafts.
          </p>
        </div>
        <Link href="/intake">
          <Button className="gap-2">
            <FileText className="h-4 w-4" /> New Case Session
          </Button>
        </Link>
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4 text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Active Case Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SESSIONS.map((session) => (
            <Link key={session.id} href={`/case/${session.id}/dashboard`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group bg-card hover:bg-card/90">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="font-mono text-xs bg-background">
                      {session.caseNumber}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{session.createdAt}</span>
                  </div>
                  <CardTitle className="font-serif text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {session.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">{session.court}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">Client:</span> {session.accusedName}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 line-clamp-1">{session.sections}</div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Files className="h-3.5 w-3.5" /> {session.documentCount} Docs
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" /> {session.draftCount} Drafts
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4 text-foreground">Quick Access — Case 01</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                    <Icon className={`h-6 w-6 ${link.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium text-foreground">{link.label}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
