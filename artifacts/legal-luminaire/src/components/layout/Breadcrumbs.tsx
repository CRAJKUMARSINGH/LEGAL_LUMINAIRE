import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import { ALL_NAV_ITEMS, findNavGroup } from "@/config/navigation";

type Crumb = { label: string; labelEn?: string; href?: string };

function titleFromSlug(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Persistent breadcrumb trail. Case-scoped pages render
 * Home › {case} › {group} › {page}; non-case pages render Home › {page}.
 */
export function Breadcrumbs() {
  const [location] = useLocation();
  const { selectedCase, isDemoMode } = useCaseContext();

  if (location === "/") return null;

  const crumbs: Crumb[] = [{ label: "मुख्य", labelEn: "Home", href: "/" }];
  const caseMatch = location.match(/^\/case\/([^/]+)(\/.*)?$/);

  if (caseMatch) {
    const subPath = caseMatch[2] || "";
    const item = ALL_NAV_ITEMS.find((i) => i.caseScoped && i.path === subPath);
    const group = item ? findNavGroup(item) : undefined;
    crumbs.push({
      label: selectedCase.title.replace(/^\[DEMO\]\s*/, ""),
      labelEn: isDemoMode ? "SYNTHETIC / DEMO" : selectedCase.caseNo,
      href: `/case/${selectedCase.id}/dashboard`,
    });
    if (group) crumbs.push({ label: group.groupLabel, labelEn: group.groupLabelEn });
    crumbs.push(item
      ? { label: item.label, labelEn: item.labelEn }
      : { label: titleFromSlug(subPath.replace(/^\//, "")) });
  } else {
    const item = ALL_NAV_ITEMS.find((i) => !i.caseScoped && i.path === location);
    const group = item ? findNavGroup(item) : undefined;
    if (group) crumbs.push({ label: group.groupLabel, labelEn: group.groupLabelEn });
    crumbs.push(item
      ? { label: item.label, labelEn: item.labelEn }
      : { label: titleFromSlug(location.split("/")[1] || "") });
  }

  return (
    <nav aria-label="ब्रेडक्रम्ब / Breadcrumb" className="px-4 py-1.5 border-b border-border bg-muted/30 no-print">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const text = (
            <span className="inline-flex items-baseline gap-1 max-w-[16rem] truncate">
              {i === 0 && <Home className="h-3 w-3 shrink-0 self-center" aria-hidden="true" />}
              <span className={last ? "font-semibold text-foreground" : ""}>{c.label}</span>
              {c.labelEn && <span className="opacity-60 text-[10px]">{c.labelEn}</span>}
            </span>
          );
          return (
            <li key={i} className="flex items-center gap-1" aria-current={last ? "page" : undefined}>
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" aria-hidden="true" />}
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-0.5">
                  {text}
                </Link>
              ) : text}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
