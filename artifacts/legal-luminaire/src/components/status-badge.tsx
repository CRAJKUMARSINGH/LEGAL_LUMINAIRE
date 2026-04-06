import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// Map extended status values to the Badge variants that actually exist
function toVariant(v: string): BadgeVariant {
  if (v === "success") return "default";
  if (v === "warning") return "secondary";
  return v as BadgeVariant;
}

type Status = "open" | "closed" | "pending" | "disputed" | string;

export function CaseStatusBadge({ status }: { status: Status }) {
  let v = "outline";
  switch (status.toLowerCase()) {
    case "open":     v = "success"; break;
    case "closed":   v = "secondary"; break;
    case "pending":  v = "warning"; break;
    case "disputed": v = "destructive"; break;
  }
  return <Badge variant={toVariant(v)} className="capitalize font-medium">{status}</Badge>;
}

export function NoticeStatusBadge({ status }: { status: string }) {
  let v = "outline";
  switch (status.toLowerCase()) {
    case "received":     v = "default"; break;
    case "responded":    v = "success"; break;
    case "overdue":      v = "destructive"; break;
    case "acknowledged": v = "secondary"; break;
  }
  return <Badge variant={toVariant(v)} className="capitalize font-medium">{status}</Badge>;
}

export function DraftStatusBadge({ status }: { status: string }) {
  let v = "outline";
  switch (status.toLowerCase()) {
    case "draft":     v = "secondary"; break;
    case "finalized": v = "default"; break;
    case "sent":      v = "success"; break;
  }
  return <Badge variant={toVariant(v)} className="capitalize font-medium">{status}</Badge>;
}

export function BillStatusBadge({ status }: { status: string }) {
  let v = "outline";
  switch (status.toLowerCase()) {
    case "pending":  v = "warning"; break;
    case "paid":     v = "success"; break;
    case "disputed": v = "destructive"; break;
    case "overdue":  v = "destructive"; break;
  }
  return <Badge variant={toVariant(v)} className="capitalize font-medium">{status}</Badge>;
}
