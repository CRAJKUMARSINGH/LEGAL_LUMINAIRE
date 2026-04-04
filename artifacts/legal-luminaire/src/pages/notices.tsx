import { AppLayout } from "@/components/layout/app-layout";
import { Link } from "wouter";
import { Search, Filter, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoticeStatusBadge } from "@/components/status-badge";
import { formatDate, getDaysRemaining, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListNotices } from "@workspace/api-client-react";

export default function NoticesList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: notices, isLoading } = useListNotices();

  const filteredNotices = notices?.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          (n.noticeNumber && n.noticeNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Notices</h1>
            <p className="text-muted-foreground mt-1">Track and manage all formal legal notices.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search notices by title or number..." 
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
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[150px]">Notice No.</TableHead>
                <TableHead>Title & Case</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead className="text-right">Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredNotices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No notices found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices?.map((notice) => {
                  const daysLeft = getDaysRemaining(notice.responseDeadline);
                  const isOverdue = daysLeft !== null && daysLeft < 0 && notice.status !== 'responded';
                  
                  return (
                    <TableRow key={notice.id} className={`hover:bg-muted/30 transition-colors ${isOverdue ? 'bg-destructive/5' : ''}`}>
                      <TableCell className="font-mono text-sm text-muted-foreground">{notice.noticeNumber || 'N/A'}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div className="font-medium">{notice.title}</div>
                        <Link href={`/cases/${notice.caseId}`} className="text-xs text-muted-foreground hover:underline hover:text-primary transition-colors mt-1 block">
                          View Case →
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{snakeToTitle(notice.noticeType)}</TableCell>
                      <TableCell>
                        <NoticeStatusBadge status={isOverdue && notice.status !== 'responded' ? 'overdue' : notice.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(notice.issuedDate)}</TableCell>
                      <TableCell className="text-right">
                        {notice.responseDeadline ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm whitespace-nowrap">{formatDate(notice.responseDeadline)}</span>
                            {daysLeft !== null && notice.status !== 'responded' && (
                              <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${
                                isOverdue ? 'text-destructive' : daysLeft <= 3 ? 'text-warning font-bold' : 'text-muted-foreground'
                              }`}>
                                {isOverdue && <AlertCircle className="h-3 w-3" />}
                                {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? 'Today' : 'Overdue'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
