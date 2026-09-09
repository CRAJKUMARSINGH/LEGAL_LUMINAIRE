import React from "react";
import { ShieldCheck, Clock, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MeterDeltas } from "../types";

interface TradeOffMetersProps {
  currentMeters: {
    verificationDepth: number; // 0 to 100
    timeSpent: number;         // 0 to 100 (higher = more efficient / time saved)
    clientSafety: number;      // 0 to 100 (higher = safer)
  };
  activeDeltas?: MeterDeltas | null;
  language: "en" | "hi";
  compact?: boolean;
}

export const TradeOffMeters: React.FC<TradeOffMetersProps> = ({
  currentMeters,
  activeDeltas,
  language,
  compact = false,
}) => {
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

  const meters = [
    {
      id: "verificationDepth",
      labelEn: "Verification Depth",
      labelHi: "सत्यापन गहराई",
      value: clamp(currentMeters.verificationDepth + (activeDeltas ? activeDeltas.verificationDepth : 0)),
      baseValue: currentMeters.verificationDepth,
      delta: activeDeltas?.verificationDepth ?? 0,
      icon: ShieldCheck,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500",
      trackClass: "bg-blue-950/40 border-blue-800/40",
      descEn: "Pinpoint citation integrity & evidentiary accuracy",
      descHi: "उद्धरण प्रामाणिकता और साक्ष्य सटीकता",
    },
    {
      id: "timeSpent",
      labelEn: "Drafting Velocity & Time",
      labelHi: "समय दक्षता व गति",
      value: clamp(currentMeters.timeSpent + (activeDeltas ? activeDeltas.timeSpent : 0)),
      baseValue: currentMeters.timeSpent,
      delta: activeDeltas?.timeSpent ?? 0,
      icon: Clock,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500",
      trackClass: "bg-amber-950/40 border-amber-800/40",
      descEn: "Speed to filing and meeting punctuality",
      descHi: "फाइलिंग गति और समयबद्धता",
    },
    {
      id: "clientSafety",
      labelEn: "Client Safety & Ethical Shield",
      labelHi: "मुवक्किल सुरक्षा व आचार कवच",
      value: clamp(currentMeters.clientSafety + (activeDeltas ? activeDeltas.clientSafety : 0)),
      baseValue: currentMeters.clientSafety,
      delta: activeDeltas?.clientSafety ?? 0,
      icon: CheckCircle2,
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500",
      trackClass: "bg-emerald-950/40 border-emerald-800/40",
      descEn: "Protection against court sanctions & flawed defense",
      descHi: "न्यायिक जुर्माने और कमजोर दलीलों से पूर्ण सुरक्षा",
    },
  ];

  return (
    <div className={`bg-card/90 backdrop-blur-md rounded-xl border border-border p-4 shadow-sm ${compact ? "space-y-3" : "space-y-4"}`}>
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
            {language === "hi" ? "व्यापार-बंद मीटर (Trade-Off Meters)" : "Live Trade-Off Meters"}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">
          {language === "hi" ? "वास्तविक लागत नियम" : "Verified AI Law Cost Model"}
        </span>
      </div>

      <div className={`grid ${compact ? "grid-cols-1 gap-3" : "grid-cols-1 md:grid-cols-3 gap-4"}`}>
        {meters.map((m) => {
          const Icon = m.icon;
          const isPositive = m.delta > 0;
          const isNegative = m.delta < 0;

          return (
            <div
              key={m.id}
              className={`p-3 rounded-lg border ${m.trackClass} bg-background/50 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${m.colorClass}`} />
                  <span className="text-xs font-bold text-foreground">
                    {language === "hi" ? m.labelHi : m.labelEn}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {m.value}%
                  </span>
                  {m.delta !== 0 && (
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        isPositive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {isPositive ? `+${m.delta}` : m.delta}
                    </span>
                  )}
                  {m.delta === 0 && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      <Minus className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-secondary/70 h-2 rounded-full overflow-hidden relative">
                <div
                  className={`h-full ${m.bgClass} transition-all duration-500 ease-out`}
                  style={{ width: `${m.value}%` }}
                />
              </div>

              <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
                {language === "hi" ? m.descHi : m.descEn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
