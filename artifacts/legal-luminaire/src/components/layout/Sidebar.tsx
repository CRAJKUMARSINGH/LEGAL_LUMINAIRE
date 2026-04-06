import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Scale,
  FileText,
  MessageSquare,
  Clock,
  BookOpen,
  FlaskConical,
  Upload,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

type View = "dashboard" | "chat" | "timeline" | "caseLaw" | "standards" | "documents" | "upload";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "AI Drafter", icon: MessageSquare },
  { id: "timeline", label: "Case Timeline", icon: Clock },
  { id: "caseLaw", label: "Case Law Matrix", icon: BookOpen },
  { id: "standards", label: "Standards Matrix", icon: FlaskConical },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "upload", label: "Upload Files", icon: Upload },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <Scale className="h-7 w-7 text-primary shrink-0" />
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              LEGAL LUMINAIRE
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Zero-Hallucination Defence AI
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeView === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};
