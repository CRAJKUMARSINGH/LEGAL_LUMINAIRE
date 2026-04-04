import { AppLayout } from "@/components/layout/app-layout";
import { Link, useParams } from "wouter";
import { 
  useGetCase, 
  useGetCaseNotices, 
  useGetCaseCorrespondence, 
  useGetCaseBills,
  useListDrafts,
  useUpdateCase,
  useListParties
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ScrollText, IndianRupee, MessageSquare, Clock, Plus, PencilLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseStatusBadge, NoticeStatusBadge, BillStatusBadge, DraftStatusBadge } from "@/components/status-badge";
import { formatDate, formatINR, getDaysRemaining, snakeToTitle } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function CaseDetail() {
  const params = useParams();
  const caseId = parseInt(params.id || "0");
  const { toast } = useToast();

  const { data: caseData, isLoading: isLoadingCase } = useGetCase(caseId);
  const { data: notices, isLoading: isLoadingNotices } = useGetCaseNotices(caseId);
  const { data: correspondence, isLoading: isLoadingCorr } = useGetCaseCorrespondence(caseId);
  const { data: bills, isLoading: isLoadingBills } = useGetCaseBills(caseId);
  const { data: drafts, isLoading: isLoadingDrafts } = useListDrafts({ caseId });
  const { data: parties } = useListParties();
  const updateCase = useUpdateCase();

  const handleStatusChange = (status: string) => {
    updateCase.mutate({ id: caseId, data: { status: status as any } }, {
      onSuccess: () => {
        toast({
          title: "Status Updated",
          description: `Case status has been updated to ${status}.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoadingCase) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!caseData) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Case Not Found</h2>
          <p className="text-muted-foreground mt-2">The case you're looking for doesn't exist or you don't have access.</p>
          <Link href="/cases">
            <Button className="mt-4">Back to Cases</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const clientParty = parties?.find(p => p.id === caseData.clientPartyId);
  const contractorParty = parties?.find(p => p.id === caseData.contractorPartyId);

  // Chronological correspondence timeline
  const timeline = [...(correspondence || [])].sort((a, b) => 
    new Date(a.correspondenceDate).getTime() - new Date(b.correspondenceDate).getTime()
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()} className="mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-serif tracking-tight">{caseData.title}</h1>
                <CaseStatusBadge status={caseData.status} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="font-mono">{caseData.caseNumber}</span>
                <span>•</span>
                <span>{snakeToTitle(caseData.category)}</span>
                <span>•</span>
                <span>Created {formatDate(caseData.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select defaultValue={caseData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notices">Notices</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="bills">Bills</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{caseData.description || "No description provided."}</p>
                  </CardContent>
                </Card>
                
                {caseData.legalGrounds && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Legal Grounds & Clauses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground bg-muted/50 p-4 rounded-md border">{caseData.legalGrounds}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="notices" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Notices</CardTitle>
                      <CardDescription>Formal notices associated with this case.</CardDescription>
                    </div>
                    {/* Placeholder for Add Notice button, wiring to be done if notice creation page exists */}
                    <Button variant="outline" size="sm" disabled>
                      <Plus className="mr-2 h-4 w-4" /> Add Notice
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoadingNotices ? (
                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : notices?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No notices found for this case.</p>
                    ) : (
                      <div className="space-y-4">
                        {notices?.map(notice => {
                          const daysLeft = getDaysRemaining(notice.responseDeadline);
                          const isOverdue = daysLeft !== null && daysLeft < 0 && notice.status !== 'responded';
                          
                          return (
                            <div key={notice.id} className={`border rounded-lg p-4 ${isOverdue ? 'border-destructive/50 bg-destructive/5' : 'bg-card'}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{notice.title}</h4>
                                    <NoticeStatusBadge status={notice.status} />
                                    {isOverdue && <span className="text-xs font-semibold text-destructive uppercase">Overdue</span>}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    <span className="font-mono">{notice.noticeNumber}</span> • {snakeToTitle(notice.noticeType)}
                                  </p>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDate(notice.issuedDate)}</span>
                              </div>
                              
                              <div className="text-sm mt-3 grid grid-cols-2 gap-2 bg-muted/30 p-2 rounded">
                                <div><span className="text-muted-foreground text-xs">Issued By:</span> {notice.issuedBy}</div>
                                <div><span className="text-muted-foreground text-xs">Issued To:</span> {notice.issuedTo}</div>
                              </div>
                              
                              {notice.clauseReferences && (
                                <div className="mt-3 text-sm">
                                  <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Clauses:</span>
                                  <p className="mt-1">{notice.clauseReferences}</p>
                                </div>
                              )}
                              
                              {notice.responseDeadline && (
                                <div className="mt-4 flex items-center justify-between border-t pt-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Deadline: <strong>{formatDate(notice.responseDeadline)}</strong></span>
                                  </div>
                                  {daysLeft !== null && notice.status !== 'responded' && (
                                    <div className={`text-sm font-medium ${daysLeft <= 3 ? 'text-destructive' : ''}`}>
                                      {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Correspondence Timeline</CardTitle>
                      <CardDescription>Chronological history of all communications.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingCorr ? (
                      <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : timeline?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No correspondence recorded.</p>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-muted space-y-8 py-4">
                        {timeline?.map((item) => (
                          <div key={item.id} className="relative">
                            <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-background ${item.direction === 'incoming' ? 'bg-destructive/80' : 'bg-primary'}`} />
                            
                            <div className="bg-card border rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {item.direction === 'incoming' ? (
                                    <span className="text-xs font-semibold text-destructive uppercase tracking-wider bg-destructive/10 px-2 py-0.5 rounded">Incoming</span>
                                  ) : (
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">Outgoing</span>
                                  )}
                                  <h4 className="font-medium text-sm">{item.subject}</h4>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(item.correspondenceDate)}</span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mt-2">{item.summary}</p>
                              
                              <div className="text-xs mt-3 flex items-center gap-4 text-muted-foreground">
                                <span>From: {item.fromParty}</span>
                                <span>To: {item.toParty}</span>
                                {item.referenceNumber && <span>Ref: {item.referenceNumber}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="drafts" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Legal Drafts</CardTitle>
                      <CardDescription>Draft replies, notices, and correspondence.</CardDescription>
                    </div>
                    <Link href={`/cases/${caseId}/draft`}>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> New Draft
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDrafts ? (
                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : drafts?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No drafts have been created yet.</p>
                        <Link href={`/cases/${caseId}/draft`}>
                          <Button variant="outline">Create First Draft</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {drafts?.map(draft => (
                          <div key={draft.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-3">
                              <ScrollText className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">{draft.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <DraftStatusBadge status={draft.status} />
                                  <span className="text-xs text-muted-foreground">{snakeToTitle(draft.draftType)}</span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/cases/${caseId}/draft?id=${draft.id}`}>
                              <Button variant="ghost" size="sm">
                                <PencilLine className="h-4 w-4 mr-2" /> Edit
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bills" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Associated Bills</CardTitle>
                      <CardDescription>Financial claims and bills related to this case.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bill No.</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingBills ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-4"><Skeleton className="h-4 w-full" /></TableCell></TableRow>
                          ) : bills?.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No bills associated with this case.</TableCell></TableRow>
                          ) : (
                            bills?.map(bill => (
                              <TableRow key={bill.id}>
                                <TableCell className="font-mono text-sm">{bill.billNumber}</TableCell>
                                <TableCell className="text-sm">{snakeToTitle(bill.billType)}</TableCell>
                                <TableCell className="font-medium">{formatINR(bill.totalAmountRs)}</TableCell>
                                <TableCell><BillStatusBadge status={bill.status} /></TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(bill.billDate)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parties Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Client / Principal</h4>
                  {clientParty ? (
                    <div className="bg-muted/30 p-3 rounded-md border">
                      <p className="font-medium">{clientParty.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{snakeToTitle(clientParty.partyType)}</p>
                      {clientParty.contactPerson && <p className="text-xs mt-2">Attn: {clientParty.contactPerson}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Not specified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contractor</h4>
                  {contractorParty ? (
                    <div className="bg-muted/30 p-3 rounded-md border">
                      <p className="font-medium">{contractorParty.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{snakeToTitle(contractorParty.partyType)}</p>
                      {contractorParty.contactPerson && <p className="text-xs mt-2">Attn: {contractorParty.contactPerson}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Not specified</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.contractReference && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Reference</span>
                    <span className="font-mono text-sm">{caseData.contractReference}</span>
                  </div>
                )}
                {caseData.contractDate && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Contract Date</span>
                    <span className="text-sm">{formatDate(caseData.contractDate)}</span>
                  </div>
                )}
                {caseData.scheduledStartDate && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Scheduled Start</span>
                    <span className="text-sm">{formatDate(caseData.scheduledStartDate)}</span>
                  </div>
                )}
                {caseData.scheduledCompletionDate && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Scheduled Completion</span>
                    <span className="text-sm">{formatDate(caseData.scheduledCompletionDate)}</span>
                  </div>
                )}
                {caseData.actualStartDate && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Actual Start</span>
                    <span className="text-sm">{formatDate(caseData.actualStartDate)}</span>
                  </div>
                )}
                
                {!caseData.contractReference && !caseData.contractDate && (
                  <p className="text-sm text-muted-foreground italic">No contract details provided.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
