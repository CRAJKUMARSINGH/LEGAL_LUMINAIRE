/**
 * Ported from REFERENCE-APP00 create-session-dialog.tsx — wired to CaseContext + real routes
 * (reference used a simulated delay and did not persist cases).
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCaseContext } from "@/context/CaseContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import type { CaseRecord } from "@/lib/case-store";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  accusedName: z.string().optional(),
  sections: z.string().optional(),
  description: z.string().optional(),
});

export function CreateCaseQuickDialog({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { addCase } = useCaseContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      caseNumber: "",
      court: "",
      accusedName: "",
      sections: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const id = `case-${Date.now()}`;
      const charges = values.sections
        ? values.sections
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const record: CaseRecord = {
        id,
        title: values.title.trim(),
        court: values.court?.trim() || "To be specified",
        caseNo: values.caseNumber?.trim() || "—",
        brief: values.description?.trim() || "New case — add factual matrix from intake or documents.",
        createdAt: new Date().toISOString(),
        files: [],
        case_type: "other",
        status: "draft",
        charges: charges.length ? charges : undefined,
        parties: values.accusedName?.trim()
          ? [{ name: values.accusedName.trim(), role: "accused" }]
          : undefined,
      };

      addCase(record);
      toast({
        title: "Case created",
        description: `"${record.title}" is now active. Open the dashboard to continue.`,
      });
      setOpen(false);
      form.reset();
      setLocation(`/case/${id}/dashboard`);
    } catch {
      toast({
        title: "Could not create case",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="default" className={`gap-2 ${triggerClassName ?? ""}`}>
          <Plus className="h-4 w-4" /> Quick new case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New case (quick)</DialogTitle>
          <DialogDescription>
            Creates a saved case and opens its dashboard. Use full intake for structured templates.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. State v. Sharma — bail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="caseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case / FIR no.</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. FIR 123/2023" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="court"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Delhi High Court" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accusedName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client / accused</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rahul Sharma" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sections / offences</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 420, 468 IPC" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief facts or instructions…"
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create & open dashboard
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
