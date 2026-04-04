import { AppLayout } from "@/components/layout/app-layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DraftStatusBadge } from "@/components/status-badge";
import { formatDate, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListDrafts } from "@workspace/api-client-react";

export default function DraftsList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: drafts, isLoading } = useListDrafts(
    statusFilter !== "all" ? { status: statusFilter as any } : undefined
  );

  const filteredDrafts = drafts?.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Drafts</h1>
            <p className="text-muted-foreground mt-1">Manage legal replies, notices, and correspondence drafts.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search drafts by title or subject..." 
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredDrafts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No drafts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrafts?.map((draft) => (
                  <TableRow key={draft.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/cases/${draft.caseId}/draft?id=${draft.id}`} className="hover:underline hover:text-primary transition-colors">
                        {draft.title}
                      </Link>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px] mt-1">{draft.subject}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{snakeToTitle(draft.draftType)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{draft.toParty}</TableCell>
                    <TableCell><DraftStatusBadge status={draft.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(draft.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/cases/${draft.caseId}/draft?id=${draft.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
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
