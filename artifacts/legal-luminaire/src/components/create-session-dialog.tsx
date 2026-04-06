import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  accusedName: z.string().optional(),
  sections: z.string().optional(),
  description: z.string().optional(),
});

export function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", caseNumber: "", court: "", accusedName: "", sections: "", description: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // Simulate session creation — real backend via /api/legal/sessions
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Session created", description: "New case session initialized." });
    setOpen(false);
    form.reset();
    setLoading(false);
    setLocation("/");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Case Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Initialize New Case Session</DialogTitle>
          <DialogDescription>Enter case details. Documents and drafts can be added later.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Session Title *</FormLabel>
                <FormControl><Input placeholder="e.g. State v. Sharma Bail" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="caseNumber" render={({ field }) => (
                <FormItem><FormLabel>Case/FIR Number</FormLabel><FormControl><Input placeholder="e.g. FIR 123/2023" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="court" render={({ field }) => (
                <FormItem><FormLabel>Court</FormLabel><FormControl><Input placeholder="e.g. Delhi High Court" {...field} /></FormControl></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="accusedName" render={({ field }) => (
                <FormItem><FormLabel>Accused/Client Name</FormLabel><FormControl><Input placeholder="e.g. Rahul Sharma" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="sections" render={({ field }) => (
                <FormItem><FormLabel>Sections/Offences</FormLabel><FormControl><Input placeholder="e.g. 420, 468 IPC" {...field} /></FormControl></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description / Notes</FormLabel>
                <FormControl><Textarea placeholder="Brief factual matrix or instructions..." className="resize-none" {...field} /></FormControl>
              </FormItem>
            )} />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Initialize Session
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
