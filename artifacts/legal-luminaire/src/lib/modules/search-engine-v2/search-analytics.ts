/**
 * Search Analytics Module
 * Track and analyze search performance and user behavior
 * Part of Phase 2: Search Engine V2
 */

import { featureFlags } from "@/config/featureFlags";

/**
 * Search event types
 */
export type SearchEventType = 
  | "search_executed"
  | "result_clicked"
  | "query_refined"
  | "filter_applied"
  | "no_results"
  | "error";

/**
 * Search event data
 */
export interface SearchEvent {
  id: string;
  type: SearchEventType;
  timestamp: number;
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  
  // Performance metrics
  latencyMs?: number;
  resultCount?: number;
  
  // User interaction
  clickedResultRank?: number;
  clickedResultId?: string;
  timeToClick?: number;
  
  // Query details
  queryLength?: number;
  queryComplexity?: number;
  expandedTermsCount?: number;
  
  // Results quality
  avgRelevanceScore?: number;
  topResultScore?: number;
  
  // Filters
  filtersApplied?: Record<string, any>;
  
  // Error details
  errorMessage?: string;
  errorType?: string;
}

/**
 * Search analytics aggregation
 */
export interface SearchAnalytics {
  // Time period
  startDate: Date;
  endDate: Date;
  
  // Volume metrics
  totalSearches: number;
  uniqueQueries: number;
  uniqueUsers: number;
  
  // Performance metrics
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  
  // Quality metrics
  avgResultCount: number;
  avgRelevanceScore: number;
  noResultsRate: number;
  errorRate: number;
  
  // User engagement
  clickThroughRate: number;
  avgTimeToClick: number;
  avgClickedRank: number;
  
  // Query analysis
  avgQueryLength: number;
  avgQueryComplexity: number;
  topQueries: Array<{ query: string; count: number }>;
  topNoResultQueries: Array<{ query: string; count: number }>;
  
  // Filter usage
  filterUsageRate: number;
  topFilters: Array<{ filter: string; count: number }>;
}

/**
 * In-memory event store (replace with database in production)
 */
class SearchEventStore {
  private events: SearchEvent[] = [];
  private maxEvents: number = 10000;
  
  /**
   * Add event to store
   */
  addEvent(event: Omit<SearchEvent, "id" | "timestamp">): SearchEvent {
    if (!featureFlags.enableSearchAnalytics) {
      return { ...event, id: "", timestamp: Date.now() };
    }
    
    const fullEvent: SearchEvent = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now(),
    };
    
    this.events.push(fullEvent);
    
    // Trim old events if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    return fullEvent;
  }
  
  /**
   * Get events by type
   */
  getEventsByType(type: SearchEventType, limit?: number): SearchEvent[] {
    const filtered = this.events.filter(e => e.type === type);
    return limit ? filtered.slice(-limit) : filtered;
  }
  
  /**
   * Get events by time range
   */
  getEventsByTimeRange(startDate: Date, endDate: Date): SearchEvent[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }
  
  /**
   * Get events by query
   */
  getEventsByQuery(query: string): SearchEvent[] {
    return this.events.filter(e => e.query === query);
  }
  
  /**
   * Get all events
   */
  getAllEvents(): SearchEvent[] {
    return [...this.events];
  }
  
  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Global event store
const eventStore = new SearchEventStore();

/**
 * Track search execution
 */
export function trackSearch(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  latencyMs: number;
  resultCount: number;
  queryLength: number;
  queryComplexity: number;
  expandedTermsCount: number;
  avgRelevanceScore: number;
  topResultScore: number;
  filtersApplied?: Record<string, any>;
}): SearchEvent {
  return eventStore.addEvent({
    type: "search_executed",
    ...params,
  });
}

/**
 * Track result click
 */
export function trackResultClick(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  clickedResultRank: number;
  clickedResultId: string;
  timeToClick: number;
}): SearchEvent {
  return eventStore.addEvent({
    type: "result_clicked",
    ...params,
  });
}

/**
 * Track query refinement
 */
export function trackQueryRefinement(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
}): SearchEvent {
  return eventStore.addEvent({
    type: "query_refined",
    ...params,
  });
}

/**
 * Track filter application
 */
export function trackFilterApplied(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  filtersApplied: Record<string, any>;
}): SearchEvent {
  return eventStore.addEvent({
    type: "filter_applied",
    ...params,
  });
}

/**
 * Track no results
 */
export function trackNoResults(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  queryLength: number;
  queryComplexity: number;
}): SearchEvent {
  return eventStore.addEvent({
    type: "no_results",
    ...params,
  });
}

/**
 * Track search error
 */
export function trackSearchError(params: {
  query: string;
  caseId?: string;
  userId?: string;
  sessionId?: string;
  errorMessage: string;
  errorType: string;
}): SearchEvent {
  return eventStore.addEvent({
    type: "error",
    ...params,
  });
}

/**
 * Calculate percentile
 */
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Get search analytics for time period
 */
export function getSearchAnalytics(
  startDate: Date,
  endDate: Date
): SearchAnalytics {
  if (!featureFlags.enableSearchAnalytics) {
    return {
      startDate,
      endDate,
      totalSearches: 0,
      uniqueQueries: 0,
      uniqueUsers: 0,
      avgLatencyMs: 0,
      p50LatencyMs: 0,
      p95LatencyMs: 0,
      p99LatencyMs: 0,
      avgResultCount: 0,
      avgRelevanceScore: 0,
      noResultsRate: 0,
      errorRate: 0,
      clickThroughRate: 0,
      avgTimeToClick: 0,
      avgClickedRank: 0,
      avgQueryLength: 0,
      avgQueryComplexity: 0,
      topQueries: [],
      topNoResultQueries: [],
      filterUsageRate: 0,
      topFilters: [],
    };
  }
  
  const events = eventStore.getEventsByTimeRange(startDate, endDate);
  const searchEvents = events.filter(e => e.type === "search_executed");
  const clickEvents = events.filter(e => e.type === "result_clicked");
  const noResultEvents = events.filter(e => e.type === "no_results");
  const errorEvents = events.filter(e => e.type === "error");
  const filterEvents = events.filter(e => e.type === "filter_applied");
  
  // Volume metrics
  const totalSearches = searchEvents.length;
  const uniqueQueries = new Set(searchEvents.map(e => e.query)).size;
  const uniqueUsers = new Set(searchEvents.map(e => e.userId).filter(Boolean)).size;
  
  // Performance metrics
  const latencies = searchEvents.map(e => e.latencyMs || 0).filter(l => l > 0);
  const avgLatencyMs = latencies.length > 0 
    ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length 
    : 0;
  const p50LatencyMs = percentile(latencies, 50);
  const p95LatencyMs = percentile(latencies, 95);
  const p99LatencyMs = percentile(latencies, 99);
  
  // Quality metrics
  const resultCounts = searchEvents.map(e => e.resultCount || 0);
  const avgResultCount = resultCounts.length > 0
    ? resultCounts.reduce((sum, c) => sum + c, 0) / resultCounts.length
    : 0;
  
  const relevanceScores = searchEvents.map(e => e.avgRelevanceScore || 0).filter(s => s > 0);
  const avgRelevanceScore = relevanceScores.length > 0
    ? relevanceScores.reduce((sum, s) => sum + s, 0) / relevanceScores.length
    : 0;
  
  const noResultsRate = totalSearches > 0 ? noResultEvents.length / totalSearches : 0;
  const errorRate = totalSearches > 0 ? errorEvents.length / totalSearches : 0;
  
  // User engagement
  const clickThroughRate = totalSearches > 0 ? clickEvents.length / totalSearches : 0;
  
  const timesToClick = clickEvents.map(e => e.timeToClick || 0).filter(t => t > 0);
  const avgTimeToClick = timesToClick.length > 0
    ? timesToClick.reduce((sum, t) => sum + t, 0) / timesToClick.length
    : 0;
  
  const clickedRanks = clickEvents.map(e => e.clickedResultRank || 0).filter(r => r > 0);
  const avgClickedRank = clickedRanks.length > 0
    ? clickedRanks.reduce((sum, r) => sum + r, 0) / clickedRanks.length
    : 0;
  
  // Query analysis
  const queryLengths = searchEvents.map(e => e.queryLength || 0).filter(l => l > 0);
  const avgQueryLength = queryLengths.length > 0
    ? queryLengths.reduce((sum, l) => sum + l, 0) / queryLengths.length
    : 0;
  
  const queryComplexities = searchEvents.map(e => e.queryComplexity || 0).filter(c => c > 0);
  const avgQueryComplexity = queryComplexities.length > 0
    ? queryComplexities.reduce((sum, c) => sum + c, 0) / queryComplexities.length
    : 0;
  
  // Top queries
  const queryCounts = new Map<string, number>();
  searchEvents.forEach(e => {
    queryCounts.set(e.query, (queryCounts.get(e.query) || 0) + 1);
  });
  const topQueries = Array.from(queryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Top no-result queries
  const noResultQueryCounts = new Map<string, number>();
  noResultEvents.forEach(e => {
    noResultQueryCounts.set(e.query, (noResultQueryCounts.get(e.query) || 0) + 1);
  });
  const topNoResultQueries = Array.from(noResultQueryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Filter usage
  const filterUsageRate = totalSearches > 0 ? filterEvents.length / totalSearches : 0;
  
  const filterCounts = new Map<string, number>();
  filterEvents.forEach(e => {
    if (e.filtersApplied) {
      Object.keys(e.filtersApplied).forEach(filter => {
        filterCounts.set(filter, (filterCounts.get(filter) || 0) + 1);
      });
    }
  });
  const topFilters = Array.from(filterCounts.entries())
    .map(([filter, count]) => ({ filter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    startDate,
    endDate,
    totalSearches,
    uniqueQueries,
    uniqueUsers,
    avgLatencyMs,
    p50LatencyMs,
    p95LatencyMs,
    p99LatencyMs,
    avgResultCount,
    avgRelevanceScore,
    noResultsRate,
    errorRate,
    clickThroughRate,
    avgTimeToClick,
    avgClickedRank,
    avgQueryLength,
    avgQueryComplexity,
    topQueries,
    topNoResultQueries,
    filterUsageRate,
    topFilters,
  };
}

/**
 * Get recent search events
 */
export function getRecentSearchEvents(limit: number = 100): SearchEvent[] {
  return eventStore.getAllEvents().slice(-limit);
}

/**
 * Get search events by query
 */
export function getSearchEventsByQuery(query: string): SearchEvent[] {
  return eventStore.getEventsByQuery(query);
}

/**
 * Clear analytics data
 */
export function clearAnalytics(): void {
  eventStore.clearEvents();
}

/**
 * Export analytics data
 */
export function exportAnalyticsData(
  startDate: Date,
  endDate: Date
): {
  analytics: SearchAnalytics;
  events: SearchEvent[];
} {
  return {
    analytics: getSearchAnalytics(startDate, endDate),
    events: eventStore.getEventsByTimeRange(startDate, endDate),
  };
}
