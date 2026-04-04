import { AppLayout } from "@/components/layout/app-layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send, Eye, FileText, CheckCircle2, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetCase, useCreateDraft, useUpdateDraft, useGetDraft } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function DraftEditor({ params }: { params: { id: string } }) {
  const caseId = parseInt(params.id);
  const draftId = new URLSearchParams(window.location.search).get("id");
  const parsedDraftId = draftId ? parseInt(draftId) : null;
  const isEditing = !!parsedDraftId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: caseData, isLoading: isLoadingCase } = useGetCase(caseId);
  const { data: existingDraft, isLoading: isLoadingDraft } = useGetDraft(parsedDraftId || 0, { query: { enabled: isEditing } });
  const createDraft = useCreateDraft();
  const updateDraft = useUpdateDraft();

  const [title, setTitle] = useState("");
  const [draftType, setDraftType] = useState("reply_to_show_cause");
  const [subject, setSubject] = useState("");
  const [toParty, setToParty] = useState("");
  const [fromParty, setFromParty] = useState("");
  const [content, setContent] = useState("");
  const [legalBasis, setLegalBasis] = useState("");
  const [enclosures, setEnclosures] = useState("");
  const [status, setStatus] = useState("draft");

  const initializedRef = useRef(false);

  useEffect(() => {
    if (isEditing && existingDraft && !initializedRef.current) {
      setTitle(existingDraft.title);
      setDraftType(existingDraft.draftType);
      setSubject(existingDraft.subject);
      setToParty(existingDraft.toParty);
      setFromParty(existingDraft.fromParty);
      setContent(existingDraft.content);
      setLegalBasis(existingDraft.legalBasis || "");
      setEnclosures(existingDraft.enclosures || "");
      setStatus(existingDraft.status);
      initializedRef.current = true;
    } else if (!isEditing && caseData && !initializedRef.current) {
      setTitle(`Draft Reply - ${caseData.title}`);
      setSubject(`Ref: Case No. ${caseData.caseNumber} - Reply to notice`);
      initializedRef.current = true;
    }
  }, [existingDraft, caseData, isEditing]);

  const handleSave = async (newStatus: "draft" | "finalized" | "sent" = status as any) => {
    if (!title || !subject || !content) {
      toast({
        title: "Missing Fields",
        description: "Title, Subject, and Content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && parsedDraftId) {
        await updateDraft.mutateAsync({
          id: parsedDraftId,
          data: {
            title,
            subject,
            content,
            status: newStatus,
            legalBasis: legalBasis || null,
            enclosures: enclosures || null,
          }
        });
        setStatus(newStatus);
        toast({ title: "Draft Updated", description: "Changes saved successfully." });
      } else {
        const res = await createDraft.mutateAsync({
          data: {
            caseId,
            title,
            draftType: draftType as any,
            status: newStatus,
            subject,
            toParty,
            fromParty,
            content,
            legalBasis: legalBasis || null,
            enclosures: enclosures || null,
          }
        });
        toast({ title: "Draft Created", description: "New draft saved successfully." });
        setLocation(`/cases/${caseId}/draft?id=${res.id}`);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save draft.", variant: "destructive" });
    }
  };

  const isSaving = createDraft.isPending || updateDraft.isPending;

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingCase || (isEditing && isLoadingDraft)) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-2xl" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2"><Skeleton className="h-[600px] w-full" /></div>
            <div><Skeleton className="h-[400px] w-full" /></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-serif tracking-tight">
                  {isEditing ? "Edit Draft" : "New Draft"}
                </h1>
                {status === 'draft' && <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded font-medium">Draft</span>}
                {status === 'finalized' && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium">Finalized</span>}
                {status === 'sent' && <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded font-medium">Sent</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Case: {caseData?.caseNumber} - {caseData?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={isSaving || status === 'sent'}>
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <Button 
              variant="default" 
              onClick={() => handleSave("finalized")} 
              disabled={isSaving || status === 'sent' || status === 'finalized'}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Final
            </Button>
            <Button 
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={() => handleSave("sent")} 
              disabled={isSaving || status === 'sent' || status === 'draft'}
            >
              <Send className="h-4 w-4 mr-2" /> Mark Sent
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              title="Print as A4"
            >
              <Printer className="h-4 w-4 mr-2" /> Print A4
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 pb-10">
          <div className="lg:col-span-8 space-y-4">
            <Card className="shadow-md border-muted">
              <CardContent className="p-0">
                {/* Letter Editor UI mimicking a physical paper */}
                <div className="bg-card text-card-foreground min-h-[800px] p-8 md:p-12 font-serif text-[15px] leading-relaxed">
                  
                  <div className="flex justify-between items-start border-b pb-6 mb-6">
                    <div className="space-y-4 w-1/2">
                      <div>
                        <label className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider block mb-1">To</label>
                        <Input 
                          variant="ghost" 
                          className="h-auto py-1 px-2 -ml-2 text-base font-serif font-bold h-auto resize-none border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20" 
                          placeholder="Recipient Name & Address..."
                          value={toParty}
                          onChange={(e) => setToParty(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 w-1/3 text-right">
                      <div>
                        <label className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider block mb-1">Date</label>
                        <div className="py-1">{format(new Date(), "dd MMMM yyyy")}</div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider block mb-1">From</label>
                        <Input 
                          variant="ghost" 
                          className="h-auto py-1 px-2 -mr-2 text-right text-base font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20" 
                          placeholder="Sender Name..."
                          value={fromParty}
                          onChange={(e) => setFromParty(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex">
                    <span className="font-bold mr-2 mt-2">Sub:</span>
                    <Textarea 
                      className="text-base font-bold font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20 resize-none min-h-[60px]" 
                      placeholder="Subject of the letter..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">Sir/Madam,</div>

                  <Textarea 
                    className="w-full min-h-[400px] text-[15px] leading-relaxed font-serif border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20 resize-y p-2 -mx-2"
                    placeholder="Start drafting the letter body here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="mt-12 space-y-6">
                    <div>
                      <div>Yours faithfully,</div>
                      <div className="mt-8 border-b w-48 mb-2"></div>
                      <div className="text-muted-foreground italic text-sm">Authorized Signatory</div>
                    </div>
                    
                    <div className="pt-8 border-t">
                      <label className="text-xs text-muted-foreground font-sans font-medium uppercase tracking-wider block mb-1">Enclosures (if any)</label>
                      <Input 
                        variant="ghost" 
                        className="h-auto py-1 px-2 -ml-2 font-serif text-sm border-transparent focus-visible:ring-1 focus-visible:ring-muted focus-visible:bg-muted/20" 
                        placeholder="List enclosures..."
                        value={enclosures}
                        onChange={(e) => setEnclosures(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Internal Title</label>
                  <Input 
                    placeholder="e.g. First Reply to Show Cause" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Draft Type</label>
                  <Select value={draftType} onValueChange={setDraftType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reply_to_show_cause">Reply to Show Cause</SelectItem>
                      <SelectItem value="counter_notice">Counter Notice</SelectItem>
                      <SelectItem value="legal_objection">Legal Objection</SelectItem>
                      <SelectItem value="payment_demand">Payment Demand</SelectItem>
                      <SelectItem value="time_extension_request">Time Extension Request</SelectItem>
                      <SelectItem value="general_correspondence">General Correspondence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" /> Legal Basis / Clauses
                  </label>
                  <Textarea 
                    placeholder="Internal notes on legal clauses to invoke..." 
                    className="min-h-[100px] text-sm"
                    value={legalBasis}
                    onChange={(e) => setLegalBasis(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Not printed on final letter.</p>
                </div>
              </CardContent>
            </Card>

            {caseData?.legalGrounds && (
              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Case Legal Grounds Reference
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {caseData.legalGrounds}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ── Hidden A4 Print Area ─────────────────────────────── */}
      <div id="print-letter-area" aria-hidden="true">
        <div className="print-header">
          <div>
            <div style={{ fontWeight: "bold", fontSize: "13pt" }}>{toParty || "Recipient"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>{format(new Date(), "dd MMMM yyyy")}</div>
            <div style={{ marginTop: "6pt", fontWeight: "bold" }}>{fromParty}</div>
          </div>
        </div>

        <div className="print-subject">
          <span>Sub: </span>{subject}
        </div>

        <div className="print-salutation">Sir/Madam,</div>

        <div className="print-body">{content}</div>

        <div className="print-signature">
          <div>Yours faithfully,</div>
          <div style={{ marginTop: "48pt" }}>
            <div className="print-sig-line" />
            <div style={{ fontStyle: "italic", fontSize: "10pt" }}>Authorized Signatory</div>
            <div style={{ fontWeight: "bold" }}>{fromParty}</div>
          </div>
        </div>

        {enclosures && (
          <div className="print-enclosures">
            <strong>Enclosures:</strong> {enclosures}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
