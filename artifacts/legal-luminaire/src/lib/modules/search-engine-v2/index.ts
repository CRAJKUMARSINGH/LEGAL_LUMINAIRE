/**
 * Search Engine V2 - Main Integration Module
 * Enhanced search with query expansion, multi-factor ranking, and analytics
 * Part of Phase 2: Legal Intelligence Hybrid Integration
 */

export * from "./query-expansion";
export * from "./relevance-ranking";
export * from "./search-analytics";

import { featureFlags } from "@/config/featureFlags";
import { expandQuery, calculateQueryComplexity } from "./query-expansion";
import { rankResults, type RankedResult, DEFAULT_WEIGHTS, type RankingWeights } from "./relevance-ranking";
import { trackSearch, trackNoResults, trackSearchError } from "./search-analytics";

/**
 * Enhanced search options
 */
export interface SearchOptions {
  // Basic options
  query: string;
  caseId?: string;
  k?: number; // Number of results
  
  // Ranking weights
  weights?: RankingWeights;
  
  // Filters
  filters?: {
    court?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sections?: string[];
    minCitationCount?: number;
  };
  
  // Analytics
  userId?: string;
  sessionId?: string;
  
  // Feature flags override (for testing)
  enableQueryExpansion?: boolean;
  enableEnhancedRanking?: boolean;
  enableSearchAnalytics?: boolean;
}

/**
 * Enhanced search result
 */
export interface EnhancedSearchResult {
  // Results
  results: RankedResult[];
  
  // Query information
  originalQuery: string;
  expandedQuery: string;
  queryComplexity: number;
  
  // Metadata
  totalResults: number;
  searchTimeMs: number;
  
  // Analytics
  searchId?: string;
  
  // Query expansion details
  expansion?: {
    tokens: string[];
    expandedTokens: string[];
    ipcSections: string[];
    crpcSections: string[];
    synonymsUsed: Record<string, string[]>;
  };
  
  // Ranking statistics
  rankingStats?: {
    avgSemanticScore: number;
    avgKeywordScore: number;
    avgLegalRelevanceScore: number;
    avgCitationScore: number;
    avgCourtScore: number;
    avgRecencyScore: number;
    avgFinalScore: number;
  };
}

/**
 * Perform enhanced search with all V2 features
 * 
 * This is the main entry point for Search Engine V2
 */
export async function enhancedSearch(
  options: SearchOptions,
  // Backend search function (from existing system)
  backendSearch: (query: string, k: number, filters?: any) => Promise<Array<{
    id: string;
    content: string;
    metadata: Record<string, any>;
    semanticScore: number;
    keywordScore: number;
    matchedTerms: string[];
  }>>
): Promise<EnhancedSearchResult> {
  const startTime = performance.now();
  
  try {
    // Step 1: Query Expansion
    const expansion = featureFlags.enableQueryExpansion || options.enableQueryExpansion
      ? expandQuery(options.query)
      : {
          originalQuery: options.query,
          expandedQuery: options.query,
          tokens: [],
          expandedTokens: [],
          ipcSections: [],
          crpcSections: [],
          synonymsUsed: {},
        };
    
    const queryComplexity = calculateQueryComplexity(options.query);
    
    // Step 2: Execute backend search with expanded query
    const searchQuery = expansion.expandedQuery;
    const k = options.k || 10;
    
    const rawResults = await backendSearch(searchQuery, k * 2, options.filters); // Get more results for better ranking
    
    // Step 3: Enhanced Ranking
    const weights = options.weights || DEFAULT_WEIGHTS;
    const rankedResults = featureFlags.enableEnhancedRanking || options.enableEnhancedRanking
      ? rankResults(rawResults, options.query, weights)
      : rawResults.map((r, i) => ({
          ...r,
          legalRelevanceScore: 0,
          citationScore: 0,
          courtScore: 0,
          recencyScore: 0,
          finalScore: (r.semanticScore * 0.6) + (r.keywordScore * 0.4),
          rank: i + 1,
          matchedSections: [],
          matchedCourts: [],
          explanation: [],
        }));
    
    // Take top k results
    const topResults = rankedResults.slice(0, k);
    
    // Step 4: Calculate statistics
    const rankingStats = topResults.length > 0 ? {
      avgSemanticScore: topResults.reduce((sum, r) => sum + r.semanticScore, 0) / topResults.length,
      avgKeywordScore: topResults.reduce((sum, r) => sum + r.keywordScore, 0) / topResults.length,
      avgLegalRelevanceScore: topResults.reduce((sum, r) => sum + r.legalRelevanceScore, 0) / topResults.length,
      avgCitationScore: topResults.reduce((sum, r) => sum + r.citationScore, 0) / topResults.length,
      avgCourtScore: topResults.reduce((sum, r) => sum + r.courtScore, 0) / topResults.length,
      avgRecencyScore: topResults.reduce((sum, r) => sum + r.recencyScore, 0) / topResults.length,
      avgFinalScore: topResults.reduce((sum, r) => sum + r.finalScore, 0) / topResults.length,
    } : undefined;
    
    const searchTimeMs = performance.now() - startTime;
    
    // Step 5: Track analytics
    let searchId: string | undefined;
    if (featureFlags.enableSearchAnalytics || options.enableSearchAnalytics) {
      if (topResults.length === 0) {
        const event = trackNoResults({
          query: options.query,
          caseId: options.caseId,
          userId: options.userId,
          sessionId: options.sessionId,
          queryLength: options.query.length,
          queryComplexity: queryComplexity.score,
        });
        searchId = event.id;
      } else {
        const event = trackSearch({
          query: options.query,
          caseId: options.caseId,
          userId: options.userId,
          sessionId: options.sessionId,
          latencyMs: searchTimeMs,
          resultCount: topResults.length,
          queryLength: options.query.length,
          queryComplexity: queryComplexity.score,
          expandedTermsCount: expansion.expandedTokens.length,
          avgRelevanceScore: rankingStats?.avgFinalScore || 0,
          topResultScore: topResults[0]?.finalScore || 0,
          filtersApplied: options.filters,
        });
        searchId = event.id;
      }
    }
    
    // Step 6: Return enhanced results
    return {
      results: topResults,
      originalQuery: options.query,
      expandedQuery: expansion.expandedQuery,
      queryComplexity: queryComplexity.score,
      totalResults: topResults.length,
      searchTimeMs,
      searchId,
      expansion,
      rankingStats,
    };
    
  } catch (error) {
    const searchTimeMs = performance.now() - startTime;
    
    // Track error
    if (featureFlags.enableSearchAnalytics || options.enableSearchAnalytics) {
      trackSearchError({
        query: options.query,
        caseId: options.caseId,
        userId: options.userId,
        sessionId: options.sessionId,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
    }
    
    // Re-throw error
    throw error;
  }
}

/**
 * Check if Search Engine V2 is enabled
 */
export function isSearchV2Enabled(): boolean {
  return featureFlags.enableAdvancedSearchV2;
}

/**
 * Get Search Engine V2 status
 */
export function getSearchV2Status(): {
  enabled: boolean;
  features: {
    queryExpansion: boolean;
    enhancedRanking: boolean;
    searchAnalytics: boolean;
  };
} {
  return {
    enabled: featureFlags.enableAdvancedSearchV2,
    features: {
      queryExpansion: featureFlags.enableQueryExpansion,
      enhancedRanking: featureFlags.enableEnhancedRanking,
      searchAnalytics: featureFlags.enableSearchAnalytics,
    },
  };
}
