import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { useAccuracyContext } from "@/context/AccuracyContext";

interface AccuracyBadgeProps {
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AccuracyBadge({ showDetails = false, size = "md" }: AccuracyBadgeProps) {
  const { metrics, accuracyLevel } = useAccuracyContext();

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3.5 py-2",
    lg: "text-base px-5 py-3",
  };

  const levelConfig: Record<string, {
    className: string;
    icon: React.ElementType;
    label: string;
    labelHi: string;
    description: string;
  }> = {
    CRITICAL: {
      className: "border-tier-court-safe-border bg-tier-court-safe-bg text-tier-court-safe",
      icon: ShieldCheck,
      label: "CRITICAL ACCURACY",
      labelHi: "अति महत्वपूर्ण सटीकता",
      description: "10/10 - Ready for deployment / परिनियोजन के लिए तैयार",
    },
    HIGH: {
      className: "border-tier-verified-border bg-tier-verified-bg text-tier-verified",
      icon: CheckCircle2,
      label: "HIGH ACCURACY",
      labelHi: "उच्च सटीकता",
      description: "8.0-9.4/10 - Good quality / अच्छी गुणवत्ता",
    },
    MEDIUM: {
      className: "border-tier-secondary-border bg-tier-secondary-bg text-tier-secondary",
      icon: AlertTriangle,
      label: "MEDIUM ACCURACY",
      labelHi: "मध्यम सटीकता",
      description: "6.0-7.9/10 - Needs improvement / सुधार की आवश्यकता",
    },
    LOW: {
      className: "border-tier-fatal-border bg-tier-fatal-bg text-tier-fatal",
      icon: XCircle,
      label: "LOW ACCURACY",
      labelHi: "कम सटीकता",
      description: "Below 6.0/10 - Requires review / समीक्षा आवश्यक",
    },
  };

  const config = levelConfig[accuracyLevel];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 border rounded-xl shadow-xs ${sizeClasses[size]} ${config.className}`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <div className="flex flex-col leading-tight">
        <span className="font-bold tracking-wide">{config.label}</span>
        <span className="text-[10px] opacity-80 font-medium">{config.labelHi}</span>
      </div>
      {showDetails && (
        <div className="ml-4 text-xs border-l border-current/20 pl-4 space-y-1">
          <div><span className="font-semibold">Overall / कुल:</span> {metrics.overallScore.toFixed(1)}/10</div>
          <div><span className="font-semibold">Legal / वैधानिक:</span> {metrics.legalCitations.toFixed(1)}/10</div>
          <div><span className="font-semibold">Technical / तकनीकी:</span> {metrics.technicalStandards.toFixed(1)}/10</div>
          <div><span className="font-semibold">Factual / तथ्यात्मक:</span> {metrics.factualClaims.toFixed(1)}/10</div>
          <div><span className="font-semibold">Procedural / प्रक्रियात्मक:</span> {metrics.proceduralReferences.toFixed(1)}/10</div>
          <div className="mt-2 text-[10px] opacity-75 italic">{config.description}</div>
        </div>
      )}
    </div>
  );
}
