import { useGetDashboardSummary, useGetRecentActivity, useGetPendingBillsSummary } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertCircle, FileText, IndianRupee, Activity, Clock, ScrollText } from "lucide-react";
import { formatINR, formatDate, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: recentActivity, isLoading: isLoadingActivity } = useGetRecentActivity({ limit: 10 });
  const { data: pendingBills, isLoading: isLoadingBills } = useGetPendingBillsSummary();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your legal cases and pending actions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary?.totalCases || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary?.openCases || 0} open, {summary?.disputedCases || 0} disputed
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">{formatINR(summary?.totalPendingAmountRs || 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all pending bills
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Notices</CardTitle>
              <AlertCircle className={`h-4 w-4 ${summary?.overdueNotices ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className={`text-2xl font-bold ${summary?.overdueNotices ? 'text-destructive' : ''}`}>
                    {summary?.overdueNotices || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires immediate attention
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts to Finalize</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary?.totalDrafts ? summary.totalDrafts - (summary.finalizedDrafts || 0) : 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary?.totalDrafts || 0} total drafts
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates across all your cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No recent activity</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    When actions are taken on cases, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivity?.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="bg-secondary p-2 rounded-full mt-0.5">
                        {activity.activityType.includes('notice') ? <FileText className="h-4 w-4" /> :
                         activity.activityType.includes('bill') ? <IndianRupee className="h-4 w-4" /> :
                         activity.activityType.includes('draft') ? <ScrollText className="h-4 w-4" /> :
                         <Briefcase className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          <Link href={`/cases/${activity.caseId}`} className="hover:underline">
                            {activity.caseTitle}
                          </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(activity.occurredAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" /> Pending Bills Breakdown
              </CardTitle>
              <CardDescription>
                Outstanding amounts by bill type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBills ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : pendingBills?.breakdown && pendingBills.breakdown.length > 0 ? (
                <div className="space-y-4">
                  {pendingBills.breakdown.map((item) => (
                    <div key={item.billType} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{snakeToTitle(item.billType)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} bill{item.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatINR(item.totalRs)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-border space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overdue ({pendingBills.overdueCount})</span>
                      <span className="font-medium text-destructive">{formatINR(pendingBills.overdueRs)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Disputed ({pendingBills.disputedCount})</span>
                      <span className="font-medium text-warning">{formatINR(pendingBills.disputedRs)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">No pending bills found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
