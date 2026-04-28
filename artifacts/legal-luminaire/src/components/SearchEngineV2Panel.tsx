/**
 * Search Engine V2 Panel Component
 * Demonstrates enhanced search features with query expansion and analytics
 * Part of Phase 2: Legal Intelligence Hybrid Integration
 */

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, TrendingUp, Info, Clock, Target } from "lucide-react";
import { featureFlags } from "@/config/featureFlags";
import { 
  expandQuery, 
  calculateQueryComplexity, 
  suggestQueryImprovements,
  formatExpandedQuery 
} from "@/lib/modules/search-engine-v2/query-expansion";
import type { RankedResult } from "@/lib/modules/search-engine-v2/relevance-ranking";

interface SearchEngineV2PanelProps {
  onSearch?: (query: string) => void;
  results?: RankedResult[];
  isLoading?: boolean;
}

export function SearchEngineV2Panel({ onSearch, results = [], isLoading = false }: SearchEngineV2PanelProps) {
  const [query, setQuery] = useState("");
  const [showExpansion, setShowExpansion] = useState(false);
  
  if (!featureFlags.enableAdvancedSearchV2) {
    return null;
  }
  
  const expansion = query ? expandQuery(query) : null;
  const complexity = query ? calculateQueryComplexity(query) : null;
  const suggestions = query ? suggestQueryImprovements(query) : [];
  
  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Enhanced Search V2
            <Badge variant="secondary" className="ml-auto">BETA</Badge>
          </CardTitle>
          <CardDescription>
            Powered by query expansion, multi-factor ranking, and AI intelligence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search legal precedents, sections, or concepts..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
            {featureFlags.enableQueryExpansion && (
              <Button
                variant="outline"
                onClick={() => setShowExpansion(!showExpansion)}
                disabled={!query.trim()}
              >
                <Info className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Query Expansion Info */}
          {showExpansion && expansion && featureFlags.enableQueryExpansion && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Expanded Query:</p>
                  <p className="text-sm text-muted-foreground">{formatExpandedQuery(expansion)}</p>
                </div>
                
                {expansion.ipcSections.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">IPC Sections Detected:</p>
                    <div className="flex flex-wrap gap-1">
                      {expansion.ipcSections.map(section => (
                        <Badge key={section} variant="secondary">{section}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {expansion.crpcSections.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">CrPC Sections Detected:</p>
                    <div className="flex flex-wrap gap-1">
                      {expansion.crpcSections.map(section => (
                        <Badge key={section} variant="secondary">{section}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(expansion.synonymsUsed).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Synonyms Added:</p>
                    <div className="space-y-1">
                      {Object.entries(expansion.synonymsUsed).slice(0, 3).map(([term, synonyms]) => (
                        <p key={term} className="text-xs text-muted-foreground">
                          <span className="font-medium">{term}:</span> {synonyms.slice(0, 3).join(", ")}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Query Complexity */}
          {complexity && query && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Complexity:</span>
                <Badge variant={complexity.score > 50 ? "default" : "secondary"}>
                  {complexity.score}/100
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{complexity.factors.length} terms</span>
                {complexity.factors.sections > 0 && (
                  <span>• {complexity.factors.sections} sections</span>
                )}
                {complexity.factors.legalTerms > 0 && (
                  <span>• {complexity.factors.legalTerms} legal terms</span>
                )}
              </div>
            </div>
          )}
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggestions:</p>
              <ul className="space-y-1">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
            <CardDescription>
              Ranked by multi-factor relevance scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="results">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-3 mt-4">
                {results.map((result) => (
                  <Card key={result.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{result.rank}</Badge>
                            <span className="text-sm font-medium">
                              Score: {(result.finalScore * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          <p className="text-sm line-clamp-2">{result.content}</p>
                          
                          {/* Matched Terms */}
                          {result.matchedTerms.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.matchedTerms.slice(0, 5).map(term => (
                                <Badge key={term} variant="secondary" className="text-xs">
                                  {term}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Explanation */}
                          {featureFlags.enableEnhancedRanking && result.explanation.length > 0 && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {result.explanation.slice(0, 3).map((exp, i) => (
                                <p key={i}>• {exp}</p>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Score Breakdown */}
                        {featureFlags.enableEnhancedRanking && (
                          <div className="text-xs space-y-1 min-w-[120px]">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Semantic:</span>
                              <span>{(result.semanticScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Keyword:</span>
                              <span>{(result.keywordScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Legal:</span>
                              <span>{(result.legalRelevanceScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Citation:</span>
                              <span>{(result.citationScore * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-4">
                {featureFlags.enableSearchAnalytics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Avg Score</span>
                          </div>
                          <p className="text-2xl font-bold">
                            {(results.reduce((sum, r) => sum + r.finalScore, 0) / results.length * 100).toFixed(1)}%
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Results</span>
                          </div>
                          <p className="text-2xl font-bold">{results.length}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-medium mb-2">Score Distribution</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Semantic</span>
                            <span>{(results.reduce((sum, r) => sum + r.semanticScore, 0) / results.length * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Keyword</span>
                            <span>{(results.reduce((sum, r) => sum + r.keywordScore, 0) / results.length * 100).toFixed(0)}%</span>
                          </div>
                          {featureFlags.enableEnhancedRanking && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Legal Relevance</span>
                                <span>{(results.reduce((sum, r) => sum + r.legalRelevanceScore, 0) / results.length * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Citation</span>
                                <span>{(results.reduce((sum, r) => sum + r.citationScore, 0) / results.length * 100).toFixed(0)}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Enable search analytics to see detailed metrics
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
