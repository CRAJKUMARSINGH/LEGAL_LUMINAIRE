import { AppLayout } from "@/components/layout/app-layout";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import CasesList from "./pages/cases";
import CreateCase from "./pages/create-case";
import CaseDetail from "./pages/case-detail";
import DraftEditor from "./pages/draft-editor";
import NoticesList from "./pages/notices";
import BillsList from "./pages/bills";
import DraftsList from "./pages/drafts";
import PartiesList from "./pages/parties";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/cases" component={CasesList} />
      <Route path="/cases/new" component={CreateCase} />
      <Route path="/cases/:id/draft" component={DraftEditor} />
      <Route path="/cases/:id" component={CaseDetail} />
      <Route path="/notices" component={NoticesList} />
      <Route path="/bills" component={BillsList} />
      <Route path="/drafts" component={DraftsList} />
      <Route path="/parties" component={PartiesList} />
      <Route>
        <AppLayout>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-4xl font-bold font-serif">404 Not Found</h1>
            <p className="text-muted-foreground mt-2">The page you are looking for does not exist.</p>
          </div>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
