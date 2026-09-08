/**
 * BreadcrumbTrail - Persistent breadcrumb trail for case-scoped pages
 * Shows navigation hierarchy: Home > Case Setup > [Page Name]
 */
import { useLocation } from "wouter";
import { useCaseContext } from "@/context/CaseContext";
import { NAV_GROUPS } from "@/config/navigation";
import { Link } from "wouter";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export function BreadcrumbTrail() {
  const [location] = useLocation();
  const { selectedCase } = useCaseContext();

  // Check if this is a case-scoped page
  const caseScopedMatch = location.match(/^\/case\/[^/]+(.+)$/);
  if (!caseScopedMatch) return null;

  const path = caseScopedMatch[1];
  
  // Find the matching nav item
  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const navItem = allItems.find(n => n.path === path);
  if (!navItem) return null;

  // Find the group this item belongs to
  const navGroup = NAV_GROUPS.find(g => g.items.includes(navItem));
  if (!navGroup) return null;

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/case/${selectedCase.id}/dashboard`}>
            {selectedCase.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/case/${selectedCase.id}${navGroup.items[0].path}`}>
            {navGroup.groupLabel.split(' / ')[1]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{navItem.labelEn}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
