import { AppLayout } from "@/components/layout/app-layout";
import { useListCases } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CaseStatusBadge } from "@/components/status-badge";
import { formatDate, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CasesList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: cases, isLoading } = useListCases(
    statusFilter !== "all" ? { status: statusFilter as any } : undefined
  );

  const filteredCases = cases?.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.caseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Cases</h1>
            <p className="text-muted-foreground mt-1">Manage construction contract disputes and legal cases.</p>
          </div>
          <Link href="/cases/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Case
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search cases by title or number..." 
              className="pl-9 bg-background w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">Case No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCases?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases?.map((caseItem) => (
                  <TableRow key={caseItem.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm text-muted-foreground">{caseItem.caseNumber}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/cases/${caseItem.id}`} className="hover:underline hover:text-primary transition-colors">
                        {caseItem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{snakeToTitle(caseItem.category)}</TableCell>
                    <TableCell><CaseStatusBadge status={caseItem.status} /></TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{formatDate(caseItem.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/cases/${caseItem.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
