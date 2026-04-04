import { AppLayout } from "@/components/layout/app-layout";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCase, useListParties, CreateCaseBodyCategory, CreateCaseBodyStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  caseNumber: z.string().optional(),
  category: z.nativeEnum(CreateCaseBodyCategory),
  status: z.nativeEnum(CreateCaseBodyStatus),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clientPartyId: z.coerce.number().optional(),
  contractorPartyId: z.coerce.number().optional(),
  contractReference: z.string().optional(),
  contractDate: z.string().optional(),
  legalGrounds: z.string().optional(),
});

export default function CreateCase() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createCase = useCreateCase();
  const { data: parties } = useListParties();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      caseNumber: `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      category: "construction_contract",
      status: "open",
      description: "",
      contractReference: "",
      legalGrounds: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCase.mutate({ data: values }, {
      onSuccess: (data) => {
        toast({
          title: "Case Created",
          description: `Case ${data.caseNumber} has been successfully created.`,
        });
        setLocation(`/cases/${data.id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create case. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">New Case</h1>
            <p className="text-muted-foreground mt-1">Open a new legal case file.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
            <CardDescription>Enter the core information for this case. You can add notices and documents later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Case Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Delay in Phase 2 Execution" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Number / Docket ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Auto-generated if left blank</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="construction_contract">Construction Contract</SelectItem>
                            <SelectItem value="civil_dispute">Civil Dispute</SelectItem>
                            <SelectItem value="arbitration">Arbitration</SelectItem>
                            <SelectItem value="show_cause">Show Cause</SelectItem>
                            <SelectItem value="breach_of_contract">Breach of Contract</SelectItem>
                            <SelectItem value="payment_claim">Payment Claim</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientPartyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client / Principal</FormLabel>
                        <Select onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)} value={field.value?.toString() || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parties?.map(p => (
                              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractorPartyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contractor</FormLabel>
                        <Select onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)} value={field.value?.toString() || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contractor party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parties?.map(p => (
                              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. LOA/2023/45" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Case Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe the nature of the dispute, key events leading to it, and current status..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalGrounds"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Legal Grounds & Clauses</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. GCC Clause 43.1 (Delay by Employer), Section 73 of Indian Contract Act" 
                            className="min-h-[80px]"
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCase.isPending}>
                    {createCase.isPending ? "Creating..." : "Create Case File"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
