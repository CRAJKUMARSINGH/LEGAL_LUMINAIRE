import { useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { CaseRouteSync } from "./CaseRouteSync";
import { DemoBanner } from "@/components/DemoBanner";
import { useCaseContext } from "@/context/CaseContext";
import { ALL_NAV_ITEMS } from "@/config/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { selectedCase, isDemoMode } = useCaseContext();

  const currentNav = ALL_NAV_ITEMS.find(
    n => n.path !== "/" &&
      (location === n.path || location === `/case/${selectedCase.id}${n.path}`)
  ) || ALL_NAV_ITEMS.find(n => n.path === "/");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CaseRouteSync />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="मेनू खोलें / Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">
              {currentNav?.label || "Legal Luminaire"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block truncate">
              {currentNav?.labelEn || "Advocate Research Platform"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {isDemoMode && (
              <span
                data-testid="demo-badge"
                className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-lg"
                title="कृत्रिम / डेमो डेटा — Synthetic demo data, not for filing"
              >
                SYNTHETIC / DEMO
              </span>
            )}
            <span className="hidden md:inline text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg">
              NATIONAL BETA 2026
            </span>
            <span className="hidden md:inline text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-bold">
              Professional Edition
            </span>
          </div>
        </header>
        {isDemoMode && <DemoBanner caseTitle={selectedCase.title} />}
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
