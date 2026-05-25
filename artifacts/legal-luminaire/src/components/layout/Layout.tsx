import React, { useState } from "react";
import { useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useCaseContext } from "@/context/CaseContext";
import { NAV_GROUPS } from "@/config/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { selectedCase } = useCaseContext();

  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const currentNav = allItems.find(n => n.path !== "/" && (location.endsWith(n.path) || location === `/case/${selectedCase.id}${n.path}`)) || allItems.find(n => n.path === "/");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card shrink-0 no-print">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{currentNav?.label || "Legal Luminaire"}</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">{currentNav?.labelEn || "Advocate Research Platform"}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:inline text-[9px] font-black tracking-widest bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg">
              NATIONAL BETA 2026
            </span>
            <span className="hidden md:inline text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-bold">
              Professional Edition
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
