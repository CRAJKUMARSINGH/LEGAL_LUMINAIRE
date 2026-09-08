import { Badge } from "@/components/ui/badge";

type LabelMap = Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "courtSafe" | "verified" | "secondaryTier" | "pending" | "fatal"; label?: string }>;

export function CaseStatusBadge({ status }: { status: string }) {
  const MAP: LabelMap = {
    open:     { variant: "courtSafe" },
    closed:   { variant: "secondaryTier" },
    pending:  { variant: "pending" },
    disputed: { variant: "fatal" },
  };
  const cfg = MAP[status.toLowerCase()] || { variant: "outline" };
  return <Badge variant={cfg.variant} className="capitalize tracking-wide">{status}</Badge>;
}

export function NoticeStatusBadge({ status }: { status: string }) {
  const MAP: LabelMap = {
    received:     { variant: "verified" },
    responded:    { variant: "courtSafe" },
    overdue:      { variant: "fatal" },
    acknowledged: { variant: "secondaryTier" },
  };
  const cfg = MAP[status.toLowerCase()] || { variant: "outline" };
  return <Badge variant={cfg.variant} className="capitalize tracking-wide">{status}</Badge>;
}

export function DraftStatusBadge({ status }: { status: string }) {
  const MAP: LabelMap = {
    draft:     { variant: "secondaryTier" },
    finalized: { variant: "verified" },
    sent:      { variant: "courtSafe" },
  };
  const cfg = MAP[status.toLowerCase()] || { variant: "outline" };
  return <Badge variant={cfg.variant} className="capitalize tracking-wide">{status}</Badge>;
}

export function BillStatusBadge({ status }: { status: string }) {
  const MAP: LabelMap = {
    pending:  { variant: "pending" },
    paid:     { variant: "courtSafe" },
    disputed: { variant: "fatal" },
    overdue:  { variant: "fatal" },
  };
  const cfg = MAP[status.toLowerCase()] || { variant: "outline" };
  return <Badge variant={cfg.variant} className="capitalize tracking-wide">{status}</Badge>;
}
