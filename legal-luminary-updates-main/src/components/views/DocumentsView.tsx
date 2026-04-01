import { caseDocuments } from "@/data/caseData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCode, FileCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const typeIcons: Record<string, React.ElementType> = {
  report: FileCheck,
  draft: FileText,
  application: FileCode,
  text: FileText,
  timeline: FileText,
  matrix: FileText,
  arguments: FileText,
  checklist: FileCheck,
  references: FileText,
  research: Search,
};

const typeColors: Record<string, string> = {
  report: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-blue-500/10 text-blue-600",
  application: "bg-violet-500/10 text-violet-600",
  matrix: "bg-amber-500/10 text-amber-600",
  research: "bg-rose-500/10 text-rose-600",
  checklist: "bg-teal-500/10 text-teal-600",
};

export const DocumentsView = () => {
  const [search, setSearch] = useState("");
  const filtered = caseDocuments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Case Documents</h2>
          <p className="text-muted-foreground text-sm mt-1">
            CASE_01_HemrajG — {caseDocuments.length} files indexed
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((doc) => {
          const Icon = typeIcons[doc.type] || FileText;
          const color = typeColors[doc.type] || "bg-muted text-muted-foreground";
          return (
            <Card key={doc.name} className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg p-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {doc.type}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
