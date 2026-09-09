import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, ChevronLeft, CheckCircle2, Circle, 
  FilePlus, Search, Edit3, ShieldCheck, PlayCircle, Clock
} from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";

export type GuidedFlowStep = "intake" | "research" | "chronology" | "draft" | "review";

export interface DocumentType {
  id: string;
  label: string;
  labelHi: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "discharge-application",
    label: "Discharge Application",
    labelHi: "उन्मोचन प्रार्थना-पत्र",
    description: "Application for discharge of accused",
    icon: () => <span className="text-lg">⚖️</span>
  },
  {
    id: "bail-application",
    label: "Bail Application",
    labelHi: "जमानत याचिका",
    description: "Application for bail",
    icon: () => <span className="text-lg">🔓</span>
  },
  {
    id: "written-submission",
    label: "Written Submission",
    labelHi: "लिखित जमानत",
    description: "Written arguments and submissions",
    icon: () => <span className="text-lg">📝</span>
  },
  {
    id: "defence-reply",
    label: "Defence Reply",
    labelHi: "बचाव जवाब",
    description: "Reply to prosecution arguments",
    icon: () => <span className="text-lg">🛡️</span>
  },
  {
    id: "notice-reply",
    label: "Notice Reply",
    labelHi: "नोटिस जवाब",
    description: "Reply to legal notices",
    icon: () => <span className="text-lg">📨</span>
  },
];

const STEPS = [
  { id: "intake" as GuidedFlowStep, label: "Intake", labelHi: "इनटेक", icon: FilePlus },
  { id: "research" as GuidedFlowStep, label: "Research", labelHi: "शोध", icon: Search },
  { id: "chronology" as GuidedFlowStep, label: "Chronology", labelHi: "कालक्रम", icon: Clock },
  { id: "draft" as GuidedFlowStep, label: "Draft", labelHi: "प्रारूपण", icon: Edit3 },
  { id: "review" as GuidedFlowStep, label: "Review", labelHi: "समीक्षा", icon: ShieldCheck },
];

interface GuidedFlowProps {
  onComplete?: () => void;
  onStartNew?: () => void;
}

export function GuidedFlow({ onComplete, onStartNew }: GuidedFlowProps) {
  const { selectedCase } = useCaseContext();
  const [currentStep, setCurrentStep] = useState<GuidedFlowStep>("intake");
  const [completedSteps, setCompletedSteps] = useState<Set<GuidedFlowStep>>(new Set());
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(selectedCase?.isDemo || false);

  useEffect(() => {
    setIsDemoMode(selectedCase?.isDemo || false);
  }, [selectedCase]);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: GuidedFlowStep) => {
    const stepIndex = STEPS.findIndex(s => s.id === stepId);
    // Allow navigation to completed steps or next step
    if (completedSteps.has(stepId) || stepIndex === currentStepIndex + 1) {
      setCurrentStep(stepId);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "intake":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <FilePlus className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Case Intake / केस इनटेक</h3>
              <p className="text-muted-foreground text-sm">
                Enter case details, upload documents, and set up your case file.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = "/intake"}
              >
                <FilePlus className="h-5 w-5" />
                <span className="text-sm">New Case Intake</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = "/new-case-ingest"}
              >
                <span className="text-lg">📤</span>
                <span className="text-sm">AI Case Ingest</span>
              </Button>
            </div>
          </div>
        );

      case "research":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Research / शोध</h3>
              <p className="text-muted-foreground text-sm">
                Research case law, standards, and precedents for your case.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/case-law`}
              >
                <Search className="h-5 w-5" />
                <span className="text-sm">Case Law Research</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/standards`}
              >
                <span className="text-lg">🔬</span>
                <span className="text-sm">Forensic Standards</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/ai-research`}
              >
                <span className="text-lg">🤖</span>
                <span className="text-sm">AI Research Engine</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/chat`}
              >
                <span className="text-lg">💬</span>
                <span className="text-sm">AI Chat Assistant</span>
              </Button>
            </div>
          </div>
        );

      case "chronology":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chronology Studio / कालक्रम स्टूडियो</h3>
              <p className="text-muted-foreground text-sm">
                Generate and review a source-cited timeline from your case documents.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/chronology`}
              >
                <Clock className="h-5 w-5" />
                <span className="text-sm">Open Chronology Studio</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/deadlines`}
              >
                <span className="text-lg">📅</span>
                <span className="text-sm">View Deadline Board</span>
              </Button>
            </div>
          </div>
        );

      case "draft":
        return (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Edit3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drafting / प्रारूपण</h3>
              <p className="text-muted-foreground text-sm">
                Select document type and generate your legal draft.
              </p>
            </div>
            
            {!selectedDocumentType ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-center">Select Document Type / दस्तावेज़ प्रकार चुनें</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOCUMENT_TYPES.map((docType) => (
                    <Button
                      key={docType.id}
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2 text-left"
                      onClick={() => setSelectedDocumentType(docType.id)}
                    >
                      <docType.icon />
                      <div className="text-center">
                        <span className="text-sm font-medium block">{docType.label}</span>
                        <span className="text-xs text-muted-foreground block">{docType.labelHi}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      {DOCUMENT_TYPES.find(d => d.id === selectedDocumentType)?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {DOCUMENT_TYPES.find(d => d.id === selectedDocumentType)?.labelHi}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedDocumentType(null)}
                  >
                    Change
                  </Button>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    const docRoutes: Record<string, string> = {
                      "discharge-application": `/case/${selectedCase?.id || 'case-01'}/discharge-application`,
                      "bail-application": `/case/${selectedCase?.id || 'case-01'}/discharge-application`,
                      "written-submission": `/case/${selectedCase?.id || 'case-01'}/drafting`,
                      "defence-reply": `/case/${selectedCase?.id || 'case-01'}/defence-reply`,
                      "notice-reply": `/case/${selectedCase?.id || 'case-01'}/notice-reply`,
                    };
                    window.location.href = docRoutes[selectedDocumentType] || `/case/${selectedCase?.id || 'case-01'}/drafting`;
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Open Draft Editor
                </Button>
              </div>
            )}
          </div>
        );

      case "review":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review & Verify / समीक्षा और सत्यापन</h3>
              <p className="text-muted-foreground text-sm">
                Review your draft, verify citations, and complete filing checklist.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/verification`}
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm">Verification Report</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.location.href = `/case/${selectedCase?.id || 'case-01'}/filing-checklist`}
              >
                <span className="text-lg">✅</span>
                <span className="text-sm">Filing Checklist</span>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isDemoMode && <PlayCircle className="h-5 w-5 text-amber-500" />}
            Guided Workflow / मार्गदर्शित कार्यप्रवाह
          </CardTitle>
          {isDemoMode && (
            <Badge className="bg-red-500/10 text-red-700 border-red-500/30 text-xs">
              SYNTHETIC / DEMO
            </Badge>
          )}
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = completedSteps.has(step.id) || index === currentStepIndex + 1;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${
                    isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className={`relative p-2 rounded-full transition-all ${
                    isCompleted ? "bg-primary text-primary-foreground" :
                    isCurrent ? "bg-primary/20 text-primary border-2 border-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <span className={`text-xs font-medium block ${
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                    <span className={`text-[10px] block ${
                      isCurrent ? "text-primary/70" : "text-muted-foreground/70"
                    }`}>
                      {step.labelHi}
                    </span>
                  </div>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`px-2 ${
                    isCompleted ? "text-primary" : "text-muted-foreground/30"
                  }`}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] mb-6">
          {getStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {onStartNew && (
              <Button
                variant="ghost"
                onClick={onStartNew}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Start New Case
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {currentStepIndex === STEPS.length - 1 ? "Complete" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
