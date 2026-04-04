import { AppLayout } from "@/components/layout/app-layout";
import { Search, Filter, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BillStatusBadge } from "@/components/status-badge";
import { formatDate, formatINR, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListBills } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function BillsList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: bills, isLoading } = useListBills(
    statusFilter !== "all" ? { status: statusFilter as any } : undefined
  );

  const filteredBills = bills?.filter(b => 
    b.billNumber.toLowerCase().includes(search.toLowerCase()) || 
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Bills & Claims</h1>
            <p className="text-muted-foreground mt-1">Track financial claims, consultancy fees, and damages.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search bills by number or description..." 
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[150px]">Bill No.</TableHead>
                <TableHead>Description & Case</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
              ) : filteredBills?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No bills found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills?.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm text-muted-foreground">{bill.billNumber}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="font-medium truncate max-w-[250px]">{bill.description}</div>
                      <Link href={`/cases/${bill.caseId}`} className="text-xs text-muted-foreground hover:underline hover:text-primary transition-colors mt-1 block">
                        View Case →
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{snakeToTitle(bill.billType)}</TableCell>
                    <TableCell><BillStatusBadge status={bill.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(bill.billDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      <div className={bill.status === 'disputed' ? 'text-destructive' : bill.status === 'pending' ? 'text-warning font-semibold' : ''}>
                        {formatINR(bill.totalAmountRs)}
                      </div>
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
