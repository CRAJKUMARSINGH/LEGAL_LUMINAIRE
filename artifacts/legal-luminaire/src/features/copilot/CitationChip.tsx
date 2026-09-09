import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Clock, Hash, CheckCircle2, Info, 
  ExternalLink 
} from "lucide-react";
import type { Citation } from "./CopilotPanel";

interface CitationChipProps {
  citation: Citation;
}

export function CitationChip({ citation }: CitationChipProps) {
  // Runtime safety guard: PENDING and FATAL_ERROR must never reach this component.
  // The status type is "VERIFIED" | "SECONDARY" by contract; cast to string to
  // allow the defensive runtime check without TS narrowing errors.
  const status = citation.status as string;
  if (status === "PENDING" || status === "FATAL_ERROR") {
    console.error("Invalid citation status rendered:", status);
    throw new Error(`CitationChip cannot render status: ${status}`);
  }

  const handleClick = () => {
    // Navigate to the referenced item based on citation type
    switch (citation.type) {
      case "document":
        // Navigate to document preview
        if (citation.page) {
          window.location.href = `/case/${getCaseId()}/documents?highlight=${citation.id}&page=${citation.page}`;
        } else {
          window.location.href = `/case/${getCaseId()}/documents?highlight=${citation.id}`;
        }
        break;
      case "timeline":
        // Navigate to timeline with highlight
        window.location.href = `/case/${getCaseId()}/timeline?highlight=${citation.id}`;
        break;
      case "register":
        // Navigate to register field
        window.location.href = `/case/${getCaseId()}/dashboard?field=${citation.id}`;
        break;
      case "standard":
        // Navigate to standards with section
        if (citation.section) {
          window.location.href = `/case/${getCaseId()}/standards?highlight=${citation.id}&section=${citation.section}`;
        } else {
          window.location.href = `/case/${getCaseId()}/standards?highlight=${citation.id}`;
        }
        break;
      default:
        console.warn("Unknown citation type:", citation.type);
    }
  };

  const getCaseId = () => {
    // Get current case ID from URL or context
    const pathParts = window.location.pathname.split("/");
    const caseIndex = pathParts.indexOf("case");
    if (caseIndex !== -1 && caseIndex + 1 < pathParts.length) {
      return pathParts[caseIndex + 1];
    }
    return "case-01"; // fallback
  };

  const getTypeIcon = () => {
    switch (citation.type) {
      case "document":
        return <FileText className="h-3 w-3" />;
      case "timeline":
        return <Clock className="h-3 w-3" />;
      case "register":
        return <Hash className="h-3 w-3" />;
      case "standard":
        return <CheckCircle2 className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getStatusVariant = () => {
    switch (citation.status) {
      case "VERIFIED":
        return "default";
      case "SECONDARY":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = () => {
    switch (citation.status) {
      case "VERIFIED":
        return <CheckCircle2 className="h-3 w-3" />;
      case "SECONDARY":
        return <Info className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      variant={getStatusVariant()}
      className="gap-1.5 cursor-pointer hover:bg-primary/20 transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Citation: ${citation.title}, ${citation.status}, type ${citation.type}. Press Enter to view source.`}
      title={`${citation.type}: ${citation.reference}`}
    >
      {getTypeIcon()}
      <span className="max-w-[150px] truncate">{citation.title}</span>
      {citation.titleHi && (
        <span className="text-xs opacity-70 truncate max-w-[100px]">
          {citation.titleHi}
        </span>
      )}
      {getStatusIcon()}
      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Badge>
  );
}