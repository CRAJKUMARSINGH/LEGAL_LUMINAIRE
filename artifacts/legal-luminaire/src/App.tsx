import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DischargeApplication from "@/pages/DischargeApplication";
import CaseResearch from "@/pages/CaseResearch";
import CrossReferenceMatrix from "@/pages/CrossReferenceMatrix";
import FilingChecklist from "@/pages/FilingChecklist";
import OralArguments from "@/pages/OralArguments";
import { Scale, BookOpen, Table2, CheckSquare, Mic, Home as HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";

const queryClient = new QueryClient();

const navItems = [
  { path: "/", label: "मुख्य पृष्ठ", labelEn: "Home", icon: HomeIcon },
  { path: "/discharge-application", label: "प्रार्थना-पत्र", labelEn: "Discharge App", icon: Scale },
  { path: "/case-research", label: "विधिक शोध", labelEn: "Legal Research", icon: BookOpen },
  { path: "/cross-reference", label: "क्रॉस-रेफरेंस", labelEn: "Cross Reference", icon: Table2 },
  { path: "/oral-arguments", label: "मौखिक तर्क", labelEn: "Oral Arguments", icon: Mic },
  { path: "/filing-checklist", label: "फाइलिंग चेकलिस्ट", labelEn: "Filing Checklist", icon: CheckSquare },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-sidebar text-sidebar-foreground transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
          w-72 flex flex-col shadow-xl`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-sidebar-foreground">Legal Luminaire</h1>
              <p className="text-xs text-sidebar-accent-foreground opacity-80">अधिवक्ता शोध मंच</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground opacity-60 mb-3 px-2">
            मेनू
          </p>
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70">{item.labelEn}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <p className="text-xs text-sidebar-accent-foreground opacity-80 leading-relaxed">
              Special Session Case No. 1/2025
            </p>
            <p className="text-xs font-semibold text-sidebar-primary mt-1">
              हेमराज वर्दार — महाराणा प्रताप स्टेडियम
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const currentNav = navItems.find((n) => n.path === location);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {currentNav?.label || "Legal Luminaire"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {currentNav?.labelEn || "Advocate Research Platform"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-medium">
              Session Case 1/2025 · Udaipur
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discharge-application" component={DischargeApplication} />
        <Route path="/case-research" component={CaseResearch} />
        <Route path="/cross-reference" component={CrossReferenceMatrix} />
        <Route path="/oral-arguments" component={OralArguments} />
        <Route path="/filing-checklist" component={FilingChecklist} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
