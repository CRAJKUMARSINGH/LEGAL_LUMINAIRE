import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AccuracyTier } from "@/lib/verification-engine";

interface CitationTierBadgeProps {
  tier: AccuracyTier | string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const TIER_CONFIG: Record<string, {
  label: string;
  labelHi: string;
  icon: React.ElementType;
  variant: "courtSafe" | "verified" | "secondaryTier" | "pending" | "fatal";
}> = {
  COURT_SAFE: {
    label: "Court-Safe",
    labelHi: "न्यायालय-सुरक्षित",
    icon: ShieldCheck,
    variant: "courtSafe",
  },
  VERIFIED: {
    label: "Verified",
    labelHi: "सत्यापित",
    icon: CheckCircle2,
    variant: "verified",
  },
  SECONDARY: {
    label: "Secondary",
    labelHi: "गौण",
    icon: Info,
    variant: "secondaryTier",
  },
  PENDING: {
    label: "Pending",
    labelHi: "लंबित",
    icon: AlertTriangle,
    variant: "pending",
  },
  FATAL_ERROR: {
    label: "Fatal",
    labelHi: "घातक",
    icon: XCircle,
    variant: "fatal",
  },
};

function resolveConfig(tier: string) {
  const upper = tier.toUpperCase().trim();
  return TIER_CONFIG[upper] || TIER_CONFIG.SECONDARY;
}

export function CitationTierBadge({
  tier,
  size = "md",
  showIcon = true,
}: CitationTierBadgeProps) {
  const cfg = resolveConfig(tier);
  const Icon = cfg.icon;
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <Badge variant={cfg.variant} className={`${sizeClasses} tracking-wide`}>
      {showIcon && <Icon className={iconSize} aria-hidden="true" />}
      <span className="font-semibold">{cfg.label}</span>
      <span className="hidden sm:inline opacity-75 ml-0.5">
        / {cfg.labelHi}
      </span>
    </Badge>
  );
}

export function getTierRowStyle(tier: AccuracyTier | string): string {
  const upper = tier.toUpperCase().trim();
  const map: Record<string, string> = {
    COURT_SAFE:  "bg-tier-court-safe-row border-tier-court-safe-border",
    VERIFIED:    "bg-tier-verified-row border-tier-verified-border",
    SECONDARY:   "bg-tier-secondary-row border-tier-secondary-border",
    PENDING:     "bg-tier-pending-row border-tier-pending-border",
    FATAL_ERROR: "bg-tier-fatal-row border-tier-fatal-border",
  };
  return map[upper] || "bg-tier-secondary-row border-tier-secondary-border";
}

export function getTierBadgeClass(tier: AccuracyTier | string): string {
  const upper = tier.toUpperCase().trim();
  const map: Record<string, string> = {
    COURT_SAFE:  "bg-tier-court-safe-bg text-tier-court-safe border-tier-court-safe-border",
    VERIFIED:    "bg-tier-verified-bg text-tier-verified border-tier-verified-border",
    SECONDARY:   "bg-tier-secondary-bg text-tier-secondary border-tier-secondary-border",
    PENDING:     "bg-tier-pending-bg text-tier-pending border-tier-pending-border",
    FATAL_ERROR: "bg-tier-fatal-bg text-tier-fatal border-tier-fatal-border",
  };
  return map[upper] || "bg-tier-secondary-bg text-tier-secondary border-tier-secondary-border";
}
