/**
 * Virtualized List Component for handling large datasets efficiently.
 * Uses @tanstack/react-virtual for optimal performance.
 */
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number | ((index: number) => number);
  className?: string;
  containerHeight?: number;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 50,
  className,
  containerHeight = 400,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // estimateSize must always be a function
  const estimateSizeFn = typeof itemHeight === "function"
    ? itemHeight
    : () => itemHeight as number;

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSizeFn,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className={cn("h-full overflow-auto", className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const height = typeof itemHeight === "function"
            ? itemHeight(virtualItem.index)
            : itemHeight;
          return (
            <div
              key={virtualItem.key}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${height}px`, transform: `translateY(${virtualItem.start}px)` }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Virtualized Table Component for case data and citations.
 */
interface VirtualizedTableProps<T> {
  items: T[];
  columns: {
    key: keyof T;
    header: string;
    width?: number;
    render?: (value: unknown, item: T, index: number) => React.ReactNode;
  }[];
  rowHeight?: number;
  className?: string;
  containerHeight?: number;
}

export function VirtualizedTable<T>({
  items,
  columns,
  rowHeight = 60,
  className,
  containerHeight = 400,
}: VirtualizedTableProps<T>) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-muted border-b px-4 py-2 flex" style={{ height: rowHeight }}>
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className="font-medium text-sm"
            style={{ width: col.width || "auto", flex: col.width ? "none" : 1 }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div ref={bodyRef} className="overflow-auto" style={{ height: containerHeight - rowHeight }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              className="border-b px-4 py-2 flex items-center hover:bg-muted/50"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${rowHeight}px`, transform: `translateY(${virtualItem.start}px)` }}
            >
              {columns.map((col) => {
                const value = items[virtualItem.index][col.key];
                const content = col.render
                  ? col.render(value, items[virtualItem.index], virtualItem.index)
                  : String(value ?? "");
                return (
                  <div
                    key={String(col.key)}
                    className="text-sm truncate"
                    style={{ width: col.width || "auto", flex: col.width ? "none" : 1 }}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
