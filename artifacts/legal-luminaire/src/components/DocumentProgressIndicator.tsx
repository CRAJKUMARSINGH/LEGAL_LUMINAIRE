import { CheckCircle2, Loader2, Circle, Upload, Database, Search, FileText } from "lucide-react";

type PipelineStep = "upload" | "index" | "research" | "draft";

interface StepConfig {
  id: PipelineStep;
  label: string;
  labelHi: string;
  icon: React.ElementType;
  description: string;
  descriptionHi: string;
}

const STEPS: StepConfig[] = [
  {
    id: "upload",
    label: "Upload",
    labelHi: "अपलोड",
    icon: Upload,
    description: "Upload case documents",
    descriptionHi: "केस दस्तावेज़ अपलोड करें",
  },
  {
    id: "index",
    label: "Index",
    labelHi: "इंडेक्स",
    icon: Database,
    description: "Index documents for search",
    descriptionHi: "खोज के लिए दस्तावेज़ इंडेक्स करें",
  },
  {
    id: "research",
    label: "Research",
    labelHi: "शोध",
    icon: Search,
    description: "AI-powered legal research",
    descriptionHi: "AI-संचालित कानूनी शोध",
  },
  {
    id: "draft",
    label: "Draft",
    labelHi: "प्रारूप",
    icon: FileText,
    description: "Generate legal documents",
    descriptionHi: "कानूनी दस्तावेज़ तैयार करें",
  },
];

interface DocumentProgressIndicatorProps {
  currentStep?: PipelineStep;
  completedSteps?: PipelineStep[];
  loadingSteps?: PipelineStep[];
}

export function DocumentProgressIndicator({
  currentStep = "upload",
  completedSteps = [],
  loadingSteps = [],
}: DocumentProgressIndicatorProps) {
  const getStepStatus = (stepId: PipelineStep): "completed" | "loading" | "current" | "pending" => {
    if (completedSteps.includes(stepId)) return "completed";
    if (loadingSteps.includes(stepId)) return "loading";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const getStepIcon = (step: StepConfig, status: string) => {
    const Icon = step.icon;
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "loading":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case "current":
        return <Icon className="w-4 h-4 text-primary" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 border-emerald-200";
      case "loading":
        return "bg-blue-50 border-blue-200";
      case "current":
        return "bg-primary/10 border-primary";
      default:
        return "bg-muted/30 border-border";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === STEPS.length - 1;
          
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border min-w-max ${getStepStyles(status)}`}>
                {getStepIcon(step, status)}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">{step.label}</span>
                  <span className="text-[10px] text-muted-foreground">{step.labelHi}</span>
                </div>
              </div>
              
              {!isLast && (
                <div className={`h-px w-6 ${status === "completed" ? "bg-emerald-400" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {STEPS.find(s => s.id === currentStep)?.description} / {STEPS.find(s => s.id === currentStep)?.descriptionHi}
        </p>
      </div>
    </div>
  );
}