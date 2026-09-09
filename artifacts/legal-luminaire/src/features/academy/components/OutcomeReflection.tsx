import React from "react";
import { Link } from "wouter";
import { ExternalLink, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { ScenarioOption } from "../types";

interface OutcomeReflectionProps {
  selectedOption: ScenarioOption;
  language: "en" | "hi";
  onRetry: () => void;
  onNext?: () => void;
  hasNextScenario: boolean;
  teachingPointEn: string;
  teachingPointHi: string;
}

export const OutcomeReflection: React.FC<OutcomeReflectionProps> = ({
  selectedOption,
  language,
  onRetry,
  onNext,
  hasNextScenario,
  teachingPointEn,
  teachingPointHi,
}) => {
  const isRecommended = selectedOption.letter === "C" || selectedOption.letter === "B" && selectedOption.id.includes("s3");
  const isHighRisk = selectedOption.deltas.clientSafety < -20;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Banner */}
      <div
        className={`p-3.5 rounded-lg border flex items-start gap-3 ${
          isHighRisk
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : isRecommended
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
        }`}
      >
        {isHighRisk ? (
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
        ) : isRecommended ? (
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
        ) : (
          <Award className="h-5 w-5 mt-0.5 shrink-0" />
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">
              {language === "hi"
                ? `विकल्प ${selectedOption.letter} का परिणाम`
                : `Option ${selectedOption.letter} Outcome`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-background/60 border border-current">
              {language === "hi" ? selectedOption.titleHi : selectedOption.titleEn}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-foreground">
            {language === "hi" ? selectedOption.consequenceHi : selectedOption.consequenceEn}
          </p>
        </div>
      </div>

      {/* Trade-Off Breakdown (AI Law pattern: what was optimized vs what was sacrificed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            {language === "hi" ? "आपने क्या प्राथमिकता दी (Optimized For)" : "What You Optimized For"}
          </span>
          <p className="text-xs font-medium text-foreground">
            {language === "hi" ? selectedOption.optimizedForHi : selectedOption.optimizedForEn}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
            {language === "hi" ? "आपने क्या त्याग किया (Sacrificed / Cost)" : "What You Gave Up (Cost)"}
          </span>
          <p className="text-xs font-medium text-foreground">
            {language === "hi" ? selectedOption.sacrificedHi : selectedOption.sacrificedEn}
          </p>
        </div>
      </div>

      {/* Teaching Point Card */}
      <div className="p-3.5 rounded-lg bg-secondary/50 border border-border space-y-1.5">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
          {language === "hi" ? "प्रमुख शिक्षण बिंदु (Key Takeaway)" : "Key Accuracy Principle"}
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {language === "hi" ? teachingPointHi : teachingPointEn}
        </p>
      </div>

      {/* Linked In-App Feature Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-card to-background border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/20">
              {selectedOption.linkedFeature.badge}
            </span>
            <span className="text-xs font-bold text-foreground">
              {language === "hi" ? selectedOption.linkedFeature.nameHi : selectedOption.linkedFeature.nameEn}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === "hi" ? selectedOption.linkedFeature.descriptionHi : selectedOption.linkedFeature.descriptionEn}
          </p>
        </div>

        <Link
          href={selectedOption.linkedFeature.path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-sm"
        >
          <span>{language === "hi" ? "ऐप में खोलें" : "Open in App"}</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{language === "hi" ? "अन्य विकल्प आज़माएं" : "Try Another Option"}</span>
        </button>

        {hasNextScenario && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow"
          >
            <span>{language === "hi" ? "अगला परिदृश्य" : "Next Scenario"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
