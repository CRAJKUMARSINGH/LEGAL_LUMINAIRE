/**
 * EmptyState — reusable empty state component.
 * Used when a page has no data loaded yet.
 */
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="rounded-full bg-muted p-5 mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button size="sm">{actionLabel}</Button>
          </Link>
        )}
        {secondaryLabel && secondaryHref && (
          <Link href={secondaryHref}>
            <Button variant="outline" size="sm">{secondaryLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
