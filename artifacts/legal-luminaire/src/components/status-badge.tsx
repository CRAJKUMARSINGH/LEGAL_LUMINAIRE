import { Badge } from "@/components/ui/badge";

type Status = "open" | "closed" | "pending" | "disputed" | string;

export function CaseStatusBadge({ status }: { status: Status }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";
  
  switch (status.toLowerCase()) {
    case "open":
      variant = "success";
      break;
    case "closed":
      variant = "secondary";
      break;
    case "pending":
      variant = "warning";
      break;
    case "disputed":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize font-medium">
      {status}
    </Badge>
  );
}

export function NoticeStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";
  
  switch (status.toLowerCase()) {
    case "received":
      variant = "default";
      break;
    case "responded":
      variant = "success";
      break;
    case "overdue":
      variant = "destructive";
      break;
    case "acknowledged":
      variant = "secondary";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize font-medium">
      {status}
    </Badge>
  );
}

export function DraftStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";
  
  switch (status.toLowerCase()) {
    case "draft":
      variant = "secondary";
      break;
    case "finalized":
      variant = "default";
      break;
    case "sent":
      variant = "success";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize font-medium">
      {status}
    </Badge>
  );
}

export function BillStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";
  
  switch (status.toLowerCase()) {
    case "pending":
      variant = "warning";
      break;
    case "paid":
      variant = "success";
      break;
    case "disputed":
      variant = "destructive";
      break;
    case "overdue":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="capitalize font-medium">
      {status}
    </Badge>
  );
}
