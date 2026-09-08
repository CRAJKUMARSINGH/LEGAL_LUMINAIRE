/**
 * EmptyState — bilingual (Hindi + English) empty state component.
 * Used on every page that can have zero data (no case loaded, no results, etc.)
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export interface EmptyStateAction {
  label: string;
  labelHi?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
  icon?: ReactNode;
}

export interface EmptyStateProps {
  /** SVG icon / illustration element */
  icon: ReactNode;
  /** Primary heading (English) */
  title: string;
  /** Primary heading (Hindi) */
  titleHi?: string;
  /** Secondary description (English) */
  description?: string;
  /** Secondary description (Hindi) */
  descriptionHi?: string;
  /** CTA buttons — first is primary */
  actions?: EmptyStateAction[];
  className?: string;
  /** Compact size for inline / panel usage */
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  titleHi,
  description,
  descriptionHi,
  actions = [],
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4 gap-3" : "py-16 px-6 gap-4",
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground",
          compact ? "h-12 w-12" : "h-16 w-16"
        )}
      >
        {icon}
      </div>

      {/* Bilingual heading */}
      <div className="space-y-1">
        <h3
          className={cn(
            "font-semibold text-foreground",
            compact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h3>
        {titleHi && (
          <p
            className={cn(
              "text-muted-foreground font-medium",
              compact ? "text-xs" : "text-sm"
            )}
            lang="hi"
          >
            {titleHi}
          </p>
        )}
      </div>

      {/* Bilingual description */}
      {(description || descriptionHi) && (
        <div className="space-y-0.5 max-w-sm">
          {description && (
            <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
              {description}
            </p>
          )}
          {descriptionHi && (
            <p
              className={cn(
                "text-muted-foreground",
                compact ? "text-xs" : "text-sm"
              )}
              lang="hi"
            >
              {descriptionHi}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className={cn("flex flex-wrap justify-center gap-2", compact ? "mt-1" : "mt-2")}>
          {actions.map((action, idx) =>
            action.href ? (
              <Link key={idx} href={action.href}>
                <Button
                  variant={action.variant ?? (idx === 0 ? "default" : "outline")}
                  size={compact ? "sm" : "default"}
                  className="gap-1.5"
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.labelHi && (
                    <span lang="hi" className="text-xs opacity-70">
                      &nbsp;/ {action.labelHi}
                    </span>
                  )}
                </Button>
              </Link>
            ) : (
              <Button
                key={idx}
                variant={action.variant ?? (idx === 0 ? "default" : "outline")}
                size={compact ? "sm" : "default"}
                onClick={action.onClick}
                className="gap-1.5"
              >
                {action.icon}
                <span>{action.label}</span>
                {action.labelHi && (
                  <span lang="hi" className="text-xs opacity-70">
                    &nbsp;/ {action.labelHi}
                  </span>
                )}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
