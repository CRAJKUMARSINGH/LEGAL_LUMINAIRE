# FEATURE FLAGS REFERENCE GUIDE
## Legal Intelligence Hybrid Integration

**Version**: 2.0.0  
**Last Updated**: April 29, 2026

---

## OVERVIEW

This document provides a complete reference for all feature flags in the Legal Luminaire system. Feature flags allow controlled rollout of new features and instant rollback if issues arise.

---

## HOW TO USE FEATURE FLAGS

### Environment Variables

Create a `.env` file in the root directory:

```bash
# artifacts/legal-luminaire/.env

# === EXISTING HYBRID FEATURES ===
VITE_FF_HYBRID_STANDARDS_VALIDITY=true
VITE_FF_HYBRID_SESSION_WORKSPACE=true
VITE_FF_HYBRID_DRAFT_VIEWER=true
VITE_FF_HYBRID_DRAFT_STREAMING=true
VITE_FF_REFERENCE_QUICK_CASE_DIALOG=true

# === SEARCH ENGINE V2 (Phase 2) ===
VITE_FF_ENABLE_ADVANCED_SEARCH_V2=false
VITE_FF_ENABLE_QUERY_EXPANSION=false
VITE_FF_ENABLE_ENHANCED_RANKING=false
VITE_FF_ENABLE_SEARCH_ANALYTICS=false

# === CITATION INTELLIGENCE (Phase 3) ===
VITE_FF_ENABLE_CITATION_GRAPH=false
VITE_FF_ENABLE_CITATION_EXTRACTION=false
VITE_FF_ENABLE_AUTHORITY_RANKING=false
VITE_FF_ENABLE_GRAPH_CROSS_REFERENCE=false

# === AI REASONING LAYER (Phase 4) ===
VITE_FF_ENABLE_CASE_SIMILARITY=false
VITE_FF_ENABLE_MULTI_LAYER_SCORING=false
VITE_FF_ENABLE_EXPLANATION_GENERATOR=false
VITE_FF_ENABLE_QUERY_UNDERSTANDING=false

# === ANALYTICS LAYER (Phase 5) ===
VITE_FF_ENABLE_JUDGE_ANALYTICS=false
VITE_FF_ENABLE_COURT_ANALYTICS=false
VITE_FF_ENABLE_OUTCOME_PREDICTION=false
VITE_FF_ENABLE_JUDGE_PROFILES=false
VITE_FF_ENABLE_COURT_HEATMAPS=false

# === GRAPH VISUALIZATION (Phase 6) ===
VITE_FF_ENABLE_GRAPH_VISUALIZATION=false
VITE_FF_ENABLE_INTERACTIVE_GRAPH=false
VITE_FF_ENABLE_TIMELINE_MODE=false
VITE_FF_ENABLE_TOPIC_CLUSTERING=false
VITE_FF_ENABLE_INFLUENTIAL_PATH=false

# === ADVANCED FEATURES (Future) ===
VITE_FF_ENABLE_NEO4J_INTEGRATION=false
VITE_FF_ENABLE_COLLABORATION=false
VITE_FF_ENABLE_VECTOR_SEARCH=false
```

### Accepted Values

Feature flags accept the following values:

**Enable** (true):
- `true`
- `1`
- `yes`
- `on`

**Disable** (false):
- `false`
- `0`
- `no`
- `off`
- (empty/undefined)

---

## FEATURE FLAG CATALOG

### EXISTING HYBRID FEATURES (Wave 1 & 2)

#### `hybridStandardsValidity`
**Default**: `true` (enabled)  
**Phase**: Wave 1  
**Status**: ✅ Production

**Description**: Standards validity page for court-ready annexure format.

**Files**:
- `src/pages/StandardsValidity.tsx`

**Route**: `/case/:id/standards-validity`

---

#### `hybridSessionWorkspace`
**Default**: `true` (enabled)  
**Phase**: Wave 1  
**Status**: ✅ Production

**Description**: Hybrid workspace with session-centric pattern.

**Files**:
- `src/pages/session-workspace.tsx`

**Route**: `/case/:id/session-workspace`

---

#### `hybridDraftViewer`
**Default**: `true` (enabled)  
**Phase**: Wave 1  
**Status**: ✅ Production

**Description**: Dedicated draft viewer for generated documents.

**Files**:
- `src/pages/draft-viewer.tsx`

**Route**: `/draft/:id`

---

#### `hybridDraftStreaming`
**Default**: `true` (enabled)  
**Phase**: Wave 1  
**Status**: ✅ Production

**Description**: SSE streaming for draft generation with progressive rendering.

**Files**:
- `src/hooks/use-draft-stream.ts`
- `src/components/draft-generator.tsx`

---

#### `referenceQuickCaseDialog`
**Default**: `true` (enabled)  
**Phase**: Wave 1  
**Status**: ✅ Production

**Description**: Quick case creation dialog wired to CaseContext.

**Files**:
- `src/components/create-case-quick-dialog.tsx`

---

### SEARCH ENGINE V2 (Phase 2)

#### `enableAdvancedSearchV2`
**Default**: `false` (disabled)  
**Phase**: 2  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Master switch for enhanced search engine with improved relevance ranking.

**Features**:
- Query expansion
- Enhanced ranking
- Advanced filters
- Search analytics

**Dependencies**: None

**Files** (to be created):
- `src/lib/search-engine-v2.ts`
- `backend/modules/search/`

**Testing Required**:
- Search accuracy ≥ baseline
- Response time ≤ baseline
- Relevance ranking validation

---

#### `enableQueryExpansion`
**Default**: `false` (disabled)  
**Phase**: 2  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Legal terminology mapping and query expansion.

**Features**:
- Synonym expansion (e.g., "murder" → "IPC 302", "homicide")
- Legal term mapping
- Section number expansion
- Court name normalization

**Dependencies**: `enableAdvancedSearchV2`

**Files** (to be created):
- `src/lib/query-expansion.ts`
- `backend/modules/search/query_expander.py`

**Testing Required**:
- Query expansion accuracy
- Legal terminology coverage
- Performance impact

---

#### `enableEnhancedRanking`
**Default**: `false` (disabled)  
**Phase**: 2  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Multi-factor relevance ranking combining semantic, legal, and citation factors.

**Ranking Factors**:
- Semantic similarity (text matching)
- Legal issue relevance
- Citation strength
- Court hierarchy
- Recency

**Dependencies**: `enableAdvancedSearchV2`

**Files** (to be created):
- `src/lib/relevance-ranking.ts`
- `backend/modules/search/ranking_engine.py`

**Testing Required**:
- Ranking accuracy (Precision@5, NDCG)
- A/B testing vs baseline
- Performance benchmarking

---

#### `enableSearchAnalytics`
**Default**: `false` (disabled)  
**Phase**: 2  
**Status**: 🟡 Planned  
**Priority**: 🟢 P2

**Description**: Search performance tracking and analytics.

**Metrics**:
- Query latency
- Result relevance
- Click-through rate
- User satisfaction
- Popular queries

**Dependencies**: `enableAdvancedSearchV2`

**Files** (to be created):
- `src/lib/search-analytics.ts`
- `backend/modules/search/analytics.py`

---

### CITATION INTELLIGENCE (Phase 3)

#### `enableCitationGraph`
**Default**: `false` (disabled)  
**Phase**: 3  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Interactive citation graph visualization showing case relationships.

**Features**:
- Directed citation graph
- Node sizing by influence
- Color coding by court
- Interactive navigation

**Dependencies**: None

**Files** (to be created):
- `src/lib/citation-graph-engine.ts`
- `src/components/CitationGraphPanel.tsx`
- `backend/modules/citation/graph_builder.py`

**Testing Required**:
- Graph accuracy
- Performance with large graphs
- UI responsiveness

---

#### `enableCitationExtraction`
**Default**: `false` (disabled)  
**Phase**: 3  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Advanced citation extraction from legal judgments.

**Extracts**:
- Case names
- Citations (e.g., "2020 SCC 123")
- Courts
- Dates
- Paragraph numbers

**Dependencies**: None

**Files** (to be created):
- `src/lib/citation-extraction.ts`
- `backend/modules/citation/extractor.py`

**Testing Required**:
- Extraction accuracy ≥ 95%
- Format validation
- Edge case handling

---

#### `enableAuthorityRanking`
**Default**: `false` (disabled)  
**Phase**: 3  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: PageRank-style authority scoring for legal precedents.

**Metrics**:
- Citation count
- Citation depth
- Court hierarchy weight
- Recency factor
- Influence score

**Dependencies**: `enableCitationGraph`

**Files** (to be created):
- `src/lib/authority-ranking.ts`
- `backend/modules/citation/authority_ranker.py`

**Testing Required**:
- Ranking accuracy
- Landmark case identification
- Performance with large graphs

---

#### `enableGraphCrossReference`
**Default**: `false` (disabled)  
**Phase**: 3  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Enhanced cross-reference matrix with graph view.

**Features**:
- Graph visualization of cross-references
- Interactive exploration
- Citation path finding

**Dependencies**: `enableCitationGraph`

**Files** (to be created):
- `src/components/GraphCrossReferenceView.tsx`

---

### AI REASONING LAYER (Phase 4)

#### `enableCaseSimilarity`
**Default**: `false` (disabled)  
**Phase**: 4  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Multi-layer case similarity engine for finding relevant precedents.

**Similarity Layers**:
1. Semantic similarity (35%)
2. Legal issue matching (30%)
3. Citation strength (20%)
4. Court relevance (15%)

**Dependencies**: None

**Files** (to be created):
- `src/lib/case-similarity-engine.ts`
- `src/components/CaseSimilarityPanel.tsx`
- `backend/modules/similarity/engine.py`

**Testing Required**:
- Similarity accuracy
- Relevance validation
- Performance benchmarking

---

#### `enableMultiLayerScoring`
**Default**: `false` (disabled)  
**Phase**: 4  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: 4-layer scoring system for case similarity.

**Layers**:
- **Layer 1**: Semantic similarity (embeddings)
- **Layer 2**: Legal issue matching (NER)
- **Layer 3**: Citation strength (graph metrics)
- **Layer 4**: Court relevance (hierarchy)

**Dependencies**: `enableCaseSimilarity`

**Files** (to be created):
- `src/lib/multi-layer-scoring.ts`
- `backend/modules/similarity/scoring.py`

---

#### `enableExplanationGenerator`
**Default**: `false` (disabled)  
**Phase**: 4  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: AI-powered explanation generator for case relevance.

**Generates**:
- "Why this case is relevant"
- Matched sections and issues
- Citation strength indicators
- Court hierarchy relevance

**Dependencies**: `enableCaseSimilarity`

**Files** (to be created):
- `src/lib/explanation-generator.ts`
- `backend/modules/similarity/explainer.py`

---

#### `enableQueryUnderstanding`
**Default**: `false` (disabled)  
**Phase**: 4  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Legal NER and query understanding.

**Extracts**:
- Legal entities (judges, courts, parties)
- Sections (IPC, CrPC, etc.)
- Legal issues
- Case types

**Dependencies**: None

**Files** (to be created):
- `src/lib/query-understanding.ts`
- `src/lib/legal-feature-extractor.ts`
- `backend/modules/similarity/ner.py`

---

### ANALYTICS LAYER (Phase 5)

#### `enableJudgeAnalytics`
**Default**: `false` (disabled)  
**Phase**: 5  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Judge-wise decision pattern analytics.

**Metrics**:
- Decision patterns (% in favor)
- Bail grant/rejection rate
- Conviction/acquittal trends
- Legal issue specialization
- Statute usage frequency
- Citation behavior
- Strictness/leniency index
- Consistency score
- Appeal reversal rate

**Dependencies**: None

**Files** (to be created):
- `src/lib/judge-analytics.ts`
- `src/pages/JudgeAnalytics.tsx`
- `backend/modules/analytics/judge_analyzer.py`

---

#### `enableCourtAnalytics`
**Default**: `false` (disabled)  
**Phase**: 5  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Court-wise performance and trend analytics.

**Metrics**:
- Case outcome trends
- Bail approval rates
- Appeal success rates
- Disposal speed
- Precedent preference
- Case load heatmaps

**Dependencies**: None

**Files** (to be created):
- `src/lib/court-analytics.ts`
- `src/pages/CourtAnalytics.tsx`
- `backend/modules/analytics/court_analyzer.py`

---

#### `enableOutcomePrediction`
**Default**: `false` (disabled)  
**Phase**: 5  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Outcome prediction based on historical patterns.

**Predictions**:
- Bail likelihood
- Conviction probability
- Appeal success chance
- Disposal time estimate

**Dependencies**: `enableJudgeAnalytics`, `enableCourtAnalytics`

**Files** (to be created):
- `src/lib/outcome-predictor.ts`
- `backend/modules/analytics/predictor.py`

---

#### `enableJudgeProfiles`
**Default**: `false` (disabled)  
**Phase**: 5  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Judge profile cards with decision metrics.

**Features**:
- Judge photo (optional)
- Key statistics
- Trend graphs
- Specialization areas

**Dependencies**: `enableJudgeAnalytics`

**Files** (to be created):
- `src/components/JudgeProfileCard.tsx`

---

#### `enableCourtHeatmaps`
**Default**: `false` (disabled)  
**Phase**: 5  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Court heatmaps and comparative analysis.

**Features**:
- Geographic heatmaps
- Performance comparisons
- Case load visualization
- Disposal speed maps

**Dependencies**: `enableCourtAnalytics`

**Files** (to be created):
- `src/components/CourtHeatmap.tsx`

---

### GRAPH VISUALIZATION (Phase 6)

#### `enableGraphVisualization`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Interactive citation graph with D3.js/Cytoscape/Sigma.js.

**Features**:
- Interactive graph rendering
- Node/edge visualization
- Layout algorithms
- Export capabilities

**Dependencies**: `enableCitationGraph`

**Files** (to be created):
- `src/lib/graph-visualization.ts`
- `src/components/CitationGraphVisualization.tsx`
- `src/pages/CitationGraphPage.tsx`

---

#### `enableInteractiveGraph`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🔥 P0

**Description**: Interactive graph features (zoom, pan, filter).

**Features**:
- Zoom and pan
- Node selection
- Edge highlighting
- Smart filters
- Search and focus

**Dependencies**: `enableGraphVisualization`

**Files** (to be created):
- `src/components/GraphControls.tsx`
- `src/components/GraphFilters.tsx`

---

#### `enableTimelineMode`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Timeline mode for citation evolution over time.

**Features**:
- Time slider
- Citation evolution animation
- Historical view
- Trend analysis

**Dependencies**: `enableGraphVisualization`

**Files** (to be created):
- `src/components/GraphTimeline.tsx`

---

#### `enableTopicClustering`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Topic clustering and community detection.

**Features**:
- Automatic clustering
- Topic labeling
- Community detection
- Cluster visualization

**Dependencies**: `enableGraphVisualization`

**Files** (to be created):
- `src/lib/topic-clustering.ts`
- `backend/modules/graph/clustering.py`

---

#### `enableInfluentialPath`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Most influential path finder between cases.

**Features**:
- Shortest path
- Strongest path (by citation weight)
- Path visualization
- Precedent chain analysis

**Dependencies**: `enableGraphVisualization`

**Files** (to be created):
- `src/lib/path-finder.ts`
- `backend/modules/graph/path_finder.py`

---

### ADVANCED FEATURES (Future)

#### `enableNeo4jIntegration`
**Default**: `false` (disabled)  
**Phase**: 6  
**Status**: 🟡 Planned  
**Priority**: 🟡 P1

**Description**: Neo4j graph database integration.

**Features**:
- Graph database storage
- Cypher query support
- Graph algorithms (PageRank, centrality)
- Scalable graph operations

**Dependencies**: `enableGraphVisualization`

**Files** (to be created):
- `backend/graph/neo4j_client.py`
- `backend/graph/schema.cypher`

**Requirements**:
- Neo4j server installation
- Database configuration
- Schema migration

---

#### `enableCollaboration`
**Default**: `false` (disabled)  
**Phase**: Future  
**Status**: 🔵 Future  
**Priority**: 🟢 P3

**Description**: Real-time collaboration features.

**Features**:
- Multi-user editing
- Real-time sync
- Comments and annotations
- Version control

**Dependencies**: None

---

#### `enableVectorSearch`
**Default**: `false` (disabled)  
**Phase**: Future  
**Status**: 🔵 Future  
**Priority**: 🟡 P1

**Description**: Vector database for semantic search (FAISS/Pinecone).

**Features**:
- Embedding-based search
- Semantic similarity
- Fast approximate nearest neighbor
- Scalable vector storage

**Dependencies**: None

**Requirements**:
- Vector database setup (FAISS/Pinecone)
- Embedding model (Legal-BERT)
- Index building

---

## FEATURE FLAG DEPENDENCIES

```
enableAdvancedSearchV2
├── enableQueryExpansion
├── enableEnhancedRanking
└── enableSearchAnalytics

enableCitationGraph
├── enableAuthorityRanking
├── enableGraphCrossReference
└── enableGraphVisualization
    ├── enableInteractiveGraph
    ├── enableTimelineMode
    ├── enableTopicClustering
    ├── enableInfluentialPath
    └── enableNeo4jIntegration

enableCaseSimilarity
├── enableMultiLayerScoring
├── enableExplanationGenerator
└── enableQueryUnderstanding

enableJudgeAnalytics
├── enableJudgeProfiles
└── enableOutcomePrediction

enableCourtAnalytics
├── enableCourtHeatmaps
└── enableOutcomePrediction
```

---

## ROLLBACK PROCEDURES

### Quick Rollback (30 seconds)

Disable all new features:

```bash
# Create .env file with all flags set to false
cat > artifacts/legal-luminaire/.env << EOF
VITE_FF_ENABLE_ADVANCED_SEARCH_V2=false
VITE_FF_ENABLE_QUERY_EXPANSION=false
VITE_FF_ENABLE_ENHANCED_RANKING=false
VITE_FF_ENABLE_SEARCH_ANALYTICS=false
VITE_FF_ENABLE_CITATION_GRAPH=false
VITE_FF_ENABLE_CITATION_EXTRACTION=false
VITE_FF_ENABLE_AUTHORITY_RANKING=false
VITE_FF_ENABLE_GRAPH_CROSS_REFERENCE=false
VITE_FF_ENABLE_CASE_SIMILARITY=false
VITE_FF_ENABLE_MULTI_LAYER_SCORING=false
VITE_FF_ENABLE_EXPLANATION_GENERATOR=false
VITE_FF_ENABLE_QUERY_UNDERSTANDING=false
VITE_FF_ENABLE_JUDGE_ANALYTICS=false
VITE_FF_ENABLE_COURT_ANALYTICS=false
VITE_FF_ENABLE_OUTCOME_PREDICTION=false
VITE_FF_ENABLE_JUDGE_PROFILES=false
VITE_FF_ENABLE_COURT_HEATMAPS=false
VITE_FF_ENABLE_GRAPH_VISUALIZATION=false
VITE_FF_ENABLE_INTERACTIVE_GRAPH=false
VITE_FF_ENABLE_TIMELINE_MODE=false
VITE_FF_ENABLE_TOPIC_CLUSTERING=false
VITE_FF_ENABLE_INFLUENTIAL_PATH=false
VITE_FF_ENABLE_NEO4J_INTEGRATION=false
VITE_FF_ENABLE_COLLABORATION=false
VITE_FF_ENABLE_VECTOR_SEARCH=false
EOF

# Restart services
pnpm --filter @workspace/legal-luminaire run dev
```

### Selective Rollback

Disable specific phase:

```bash
# Disable Phase 2 (Search Engine V2)
VITE_FF_ENABLE_ADVANCED_SEARCH_V2=false
VITE_FF_ENABLE_QUERY_EXPANSION=false
VITE_FF_ENABLE_ENHANCED_RANKING=false
VITE_FF_ENABLE_SEARCH_ANALYTICS=false
```

---

## TESTING CHECKLIST

Before enabling any feature flag:

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Performance benchmarks acceptable
- [ ] Legal accuracy validated
- [ ] UI/UX reviewed
- [ ] Documentation updated
- [ ] Rollback plan tested

---

## MONITORING

Monitor these metrics after enabling features:

- **Performance**: Response time, latency, throughput
- **Accuracy**: Search relevance, citation correctness
- **Errors**: Error rate, exception count
- **Usage**: Feature adoption, user satisfaction
- **System**: CPU, memory, database load

---

**Document Version**: 1.0  
**Last Updated**: April 29, 2026  
**Next Review**: After each phase completion
