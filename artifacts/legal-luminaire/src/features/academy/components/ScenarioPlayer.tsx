import React from "react";
import { Sparkles, AlertCircle, FileText, ChevronRight, Check } from "lucide-react";
import { Scenario, ScenarioOption } from "../types";

interface ScenarioPlayerProps {
  scenario: Scenario;
  selectedOptionId: string | null;
  onSelectOption: (option: ScenarioOption) => void;
  language: "en" | "hi";
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  selectedOptionId,
  onSelectOption,
  language,
}) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {scenario.moduleCode}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {language === "hi" ? scenario.contextCard.badgeHi : scenario.contextCard.badgeEn}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{language === "hi" ? scenario.contextCard.urgencyHi : scenario.contextCard.urgencyEn}</span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">
            {language === "hi" ? scenario.titleHi : scenario.titleEn}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "hi" ? scenario.subtitleHi : scenario.subtitleEn}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 bg-secondary/30 p-3.5 rounded-lg border border-border/50">
          {language === "hi" ? scenario.contextCard.situationHi : scenario.contextCard.situationEn}
        </p>

        {scenario.contextCard.syntheticArtifactSnippet && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "दस्तावेज़ स्निपेट (सिंथेटिक)" : "Synthetic Document Extract"}</span>
            </div>
            <pre className="text-xs font-mono bg-muted/60 p-3 rounded-lg border border-border text-foreground/90 whitespace-pre-wrap overflow-x-auto">
              {scenario.contextCard.syntheticArtifactSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Decision Prompt */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-bold text-sm text-foreground">
          {language === "hi"
            ? "आप क्या कार्रवाई करेंगे? (प्रत्येक विकल्प की अपनी वास्तविक लागत है)"
            : "Choose Your Course of Action (Every option carries an explicit cost):"}
        </h3>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenario.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? "bg-primary/10 border-primary shadow-md ring-1 ring-primary"
                  : "bg-card hover:bg-secondary/40 border-border hover:border-primary/50"
              }`}
            >
              {/* Option Top Bar */}
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="font-bold text-xs text-foreground leading-tight">
                    {language === "hi" ? opt.titleHi : opt.titleEn}
                  </span>
                </div>

                {isSelected ? (
                  <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>

              {/* Action summary */}
              <p className="text-xs text-muted-foreground leading-normal">
                {language === "hi" ? opt.actionHi : opt.actionEn}
              </p>

              {/* Explicit Cost Callout (AI Law design pattern) */}
              <div className="pt-2 border-t border-border/60 w-full">
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] leading-tight">
                  <span className="font-bold mr-1">
                    {language === "hi" ? "लागत / परिणाम:" : "Explicit Cost:"}
                  </span>
                  <span>{language === "hi" ? opt.costHi : opt.costEn}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
