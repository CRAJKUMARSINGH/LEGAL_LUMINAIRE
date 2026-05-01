import React from "react";

export function HighlightedText({ text }: { text: string }) {
  if (!text) return null;

  // The highlight helper wraps matches in \u0001 and \u0002
  const parts = text.split(/(\u0001[^\u0002]+\u0002)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("\u0001") && part.endsWith("\u0002")) {
          const match = part.substring(1, part.length - 1);
          return (
            <mark
              key={i}
              className="bg-primary/15 text-foreground rounded-sm px-0.5 font-medium"
            >
              {match}
            </mark>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
