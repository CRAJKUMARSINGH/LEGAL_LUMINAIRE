const RECENT_KEY = "legal_luminaire_recent_cases_v1";
export const RECENT_CASES_LIMIT = 5;

export type RecentCaseEntry = { id: string; openedAt: string };

export function loadRecentCases(): RecentCaseEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentCaseEntry =>
        typeof e === "object" && e !== null && typeof (e as RecentCaseEntry).id === "string",
    );
  } catch {
    return [];
  }
}

export function pushRecentCase(id: string): RecentCaseEntry[] {
  const next = [
    { id, openedAt: new Date().toISOString() },
    ...loadRecentCases().filter((e) => e.id !== id),
  ].slice(0, RECENT_CASES_LIMIT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function removeRecentCase(id: string): RecentCaseEntry[] {
  const next = loadRecentCases().filter((e) => e.id !== id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}
