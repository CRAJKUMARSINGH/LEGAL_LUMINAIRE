import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CaseProvider } from "@/context/CaseContext";
import { AccuracyProvider } from "@/context/AccuracyContext";
import { Router } from "./routes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccuracyProvider>
        <CaseProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </CaseProvider>
      </AccuracyProvider>
    </QueryClientProvider>
  );
}

