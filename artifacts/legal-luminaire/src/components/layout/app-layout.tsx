import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Scale, LayoutDashboard, Briefcase, FileText, IndianRupee, ScrollText, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 font-semibold md:hidden">
        <Scale className="h-6 w-6 text-primary" />
        <span>Legal Luminaire</span>
      </div>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
    </header>
  );
}

export function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cases", href: "/cases", icon: Briefcase },
    { name: "Notices", href: "/notices", icon: FileText },
    { name: "Drafts", href: "/drafts", icon: ScrollText },
    { name: "Bills", href: "/bills", icon: IndianRupee },
    { name: "Parties", href: "/parties", icon: Users },
  ];

  return (
    <div className="hidden border-r bg-sidebar md:block md:w-64 lg:w-72 shadow-lg">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-serif font-bold text-xl text-sidebar-foreground">
            <Scale className="h-6 w-6 text-sidebar-primary" />
            <span>Legal Luminaire</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cases", href: "/cases", icon: Briefcase },
    { name: "Notices", href: "/notices", icon: FileText },
    { name: "Drafts", href: "/drafts", icon: ScrollText },
    { name: "Bills", href: "/bills", icon: IndianRupee },
    { name: "Parties", href: "/parties", icon: Users },
  ];

  // Close on navigate
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="md:hidden ml-2 mt-2 absolute top-1 left-2 z-40" onClick={() => setOpen(!open)}>
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {open && (
        <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar p-6 shadow-lg border-r border-sidebar-border">
            <Link href="/" className="flex items-center gap-3 font-serif font-bold text-xl mb-8 text-sidebar-foreground">
              <Scale className="h-6 w-6 text-sidebar-primary" />
              <span>Legal Luminaire</span>
            </Link>
            <nav className="grid gap-2">
              {navigation.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-background font-sans">
      <Sidebar />
      <MobileNav />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
