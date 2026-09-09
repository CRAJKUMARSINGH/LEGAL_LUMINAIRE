import React, { useState } from "react";
import {
  GraduationCap,
  Globe,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ACADEMY_SCENARIOS } from "./data/scenarios";
import { ScenarioOption } from "./types";
import { TradeOffMeters } from "./components/TradeOffMeters";
import { ScenarioPlayer } from "./components/ScenarioPlayer";
import { OutcomeReflection } from "./components/OutcomeReflection";

export const AccuracyAcademy: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, ScenarioOption>>({});

  const baselineMeters = {
    verificationDepth: 50,
    timeSpent: 50,
    clientSafety: 50,
  };

  // Calculate cumulative meters from all selected options
  const cumulativeMeters = Object.values(selections).reduce(
    (acc, opt) => ({
      verificationDepth: Math.max(0, Math.min(100, acc.verificationDepth + opt.deltas.verificationDepth)),
      timeSpent: Math.max(0, Math.min(100, acc.timeSpent + opt.deltas.timeSpent)),
      clientSafety: Math.max(0, Math.min(100, acc.clientSafety + opt.deltas.clientSafety)),
    }),
    { ...baselineMeters }
  );

  const currentScenario = ACADEMY_SCENARIOS[currentScenarioIndex];
  const currentSelection = selections[currentScenario.id] || null;

  const handleSelectOption = (option: ScenarioOption) => {
    setSelections((prev) => ({
      ...prev,
      [currentScenario.id]: option,
    }));
  };

  const handleResetCurrent = () => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[currentScenario.id];
      return next;
    });
  };

  const handleResetAll = () => {
    setSelections({});
    setCurrentScenarioIndex(0);
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < ACADEMY_SCENARIOS.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
    }
  };

  const completedCount = Object.keys(selections).length;
  const isAllCompleted = completedCount === ACADEMY_SCENARIOS.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Source Attribution Banner */}
      <div className="bg-gradient-to-r from-card via-card/90 to-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {language === "hi" ? "सटीकता अकादमी (Accuracy Academy)" : "Accuracy Academy"}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.2 Production
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "hi"
                  ? "विधिक AI आउटपुट के परीक्षण, सत्यापन और सुरक्षा का इंटरएक्टिव प्रशिक्षण"
                  : "Interactive simulation for evaluating AI legal drafts, verifying citations & managing court risk"}
              </p>
            </div>
          </div>

          {/* Controls: Language Toggle & Reset */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/60 hover:bg-secondary text-xs font-semibold text-foreground transition-all"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === "en" ? "हिंदी संस्करण" : "English Version"}</span>
            </button>
            <button
              onClick={handleResetAll}
              title={language === "hi" ? "सभी उत्तर रीसेट करें" : "Reset all scenarios"}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "रीसेट" : "Reset All"}</span>
            </button>
          </div>
        </div>

        {/* Source Project Attribution (AI Law design pattern) */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-primary/5 p-3 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-foreground/90 font-medium">
              {language === "hi"
                ? "स्रोत प्रेरणा: 'AI Law — A Simulation' (vibecode.law)। सिद्धांत: 'कोई विकल्प मुफ़्त नहीं है — हर निर्णय की वास्तविक लागत होती है'।"
                : "Adapted from 'AI Law — A Simulation' (vibecode.law). Core principle: 'No choice is free — every decision carries an explicit cost'."}
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            {language === "hi" ? "सिंथेटिक केस परिदृश्य" : "100% Synthetic Case Engine"}
          </span>
        </div>
      </div>

      {/* Live Trade-Off Meters Panel */}
      <TradeOffMeters
        currentMeters={cumulativeMeters}
        activeDeltas={null}
        language={language}
      />

      {/* Scenario Progress Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-border">
        <div className="flex items-center gap-2">
          {ACADEMY_SCENARIOS.map((sc, idx) => {
            const isCompleted = !!selections[sc.id];
            const isCurrent = idx === currentScenarioIndex;

            return (
              <button
                key={sc.id}
                onClick={() => setCurrentScenarioIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isCompleted
                    ? "bg-secondary/70 text-foreground border border-emerald-500/30"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                }`}
              >
                <span>{sc.moduleCode}</span>
                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-muted-foreground shrink-0">
          {completedCount}/{ACADEMY_SCENARIOS.length} {language === "hi" ? "पूर्ण" : "Completed"}
        </span>
      </div>

      {/* Main Scenario Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scenario Player (Left / Center) */}
        <div className="lg:col-span-8 space-y-6">
          <ScenarioPlayer
            scenario={currentScenario}
            selectedOptionId={currentSelection?.id || null}
            onSelectOption={handleSelectOption}
            language={language}
          />
        </div>

        {/* Outcome Reflection & Feature Links (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          {currentSelection ? (
            <OutcomeReflection
              selectedOption={currentSelection}
              language={language}
              onRetry={handleResetCurrent}
              onNext={handleNextScenario}
              hasNextScenario={currentScenarioIndex < ACADEMY_SCENARIOS.length - 1}
              teachingPointEn={currentScenario.teachingPointEn}
              teachingPointHi={currentScenario.teachingPointHi}
            />
          ) : (
            <div className="bg-card border border-border/80 border-dashed rounded-xl p-6 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">
                {language === "hi" ? "निर्णय की प्रतीक्षा" : "Awaiting Decision"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "hi"
                  ? "बाईं ओर 4 विकल्पों में से किसी एक को चुनें ताकि उसके परिणाम और इन-ऐप लिंक का विश्लेषण देखा जा सके।"
                  : "Select one of the 4 options on the left to see trade-off repercussions and mapped app guardrails."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All Scenarios Completion Certificate Card */}
      {isAllCompleted && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-card to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {language === "hi"
                  ? "सटीकता अकादमी पूर्ण: विधिक AI परिपक्वता प्रमाणपत्र"
                  : "Accuracy Academy Completed: Legal AI Maturity Milestone"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === "hi"
                  ? "आपने सभी 3 परिदृश्यों में गति, सत्यापन गहराई और मुवक्किल सुरक्षा के संतुलन का अभ्यास कर लिया है।"
                  : "You have mastered the trade-offs between speed, pinpoint verification, and client safety across all 3 modules."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-background/60 border border-border text-center space-y-1">
              <span className="text-xs text-muted-foreground">
                {language === "hi" ? "अंतिम सत्यापन गहराई" : "Final Verification Depth"}
              </span>
              <p className="text-lg font-bold font-mono text-blue-400">{cumulativeMeters.verificationDepth}%</p>
            </div>
            <div className="p-3 rounded-lg bg-background/60 border border-border text-center space-y-1">
              <span className="text-xs text-muted-foreground">
                {language === "hi" ? "अंतिम समय दक्षता" : "Final Time Efficiency"}
              </span>
              <p className="text-lg font-bold font-mono text-amber-400">{cumulativeMeters.timeSpent}%</p>
            </div>
            <div className="p-3 rounded-lg bg-background/60 border border-border text-center space-y-1">
              <span className="text-xs text-muted-foreground">
                {language === "hi" ? "अंतिम मुवक्किल सुरक्षा" : "Final Client Safety"}
              </span>
              <p className="text-lg font-bold font-mono text-emerald-400">{cumulativeMeters.clientSafety}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
