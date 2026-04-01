import { caseLawMatrix } from "@/data/caseData";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

const statusConfig = {
  VERIFIED: { icon: CheckCircle2, class: "text-emerald-600 border-emerald-500/30" },
  SECONDARY: { icon: Info, class: "text-blue-600 border-blue-500/30" },
  PENDING: { icon: AlertTriangle, class: "text-amber-600 border-amber-500/30" },
};

export const CaseLawView = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Case Law Matrix</h2>
      <p className="text-muted-foreground text-sm mt-1">
        Verified & pending precedents for defence — Stadium Wall Collapse
      </p>
    </div>

    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[30%]">Case</TableHead>
            <TableHead>Court</TableHead>
            <TableHead>Use for Defence</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action Before Filing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caseLawMatrix.map((row, i) => {
            const cfg = statusConfig[row.status];
            const Icon = cfg.icon;
            return (
              <TableRow key={i}>
                <TableCell className="font-medium text-foreground text-sm">{row.case}</TableCell>
                <TableCell className="text-sm">{row.court}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.useForDefence}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`gap-1 ${cfg.class}`}>
                    <Icon className="h-3 w-3" /> {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.action}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);
