import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardView } from "@/components/views/DashboardView";
import { ChatView } from "@/components/views/ChatView";
import { TimelineView } from "@/components/views/TimelineView";
import { CaseLawView } from "@/components/views/CaseLawView";
import { StandardsView } from "@/components/views/StandardsView";
import { DocumentsView } from "@/components/views/DocumentsView";
import { UploadView } from "@/components/views/UploadView";

type View = "dashboard" | "chat" | "timeline" | "caseLaw" | "standards" | "documents" | "upload";

const views: Record<View, React.ComponentType> = {
  dashboard: DashboardView,
  chat: ChatView,
  timeline: TimelineView,
  caseLaw: CaseLawView,
  standards: StandardsView,
  documents: DocumentsView,
  upload: UploadView,
};

const Index = () => {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const ActiveComponent = views[activeView];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default Index;
