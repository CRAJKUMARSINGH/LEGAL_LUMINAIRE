"""
Optimized Fact-Fit Gate Engine
Implements batch scoring, caching, and early termination for performance
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple
import numpy as np

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from config import settings
from cache import cache, cached_async

logger = logging.getLogger(__name__)

@dataclass
class PrecedentScore:
    """Score result for a single precedent."""
    precedent_id: str
    citation: str
    title: str
    relevance_score: float
    factual_match: float
    legal_principle_match: float
    combined_score: float
    processing_time: float
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BatchScoreResult:
    """Result of batch scoring operation."""
    scores: List[PrecedentScore]
    total_processed: int
    processing_time: float
    cache_hits: int
    early_terminations: int

class FactFitEngine:
    """Optimized fact-fit gate with batch processing and caching."""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="fact_fit")
        self.embeddings_cache: Dict[str, np.ndarray] = {}
        self.tfidf_vectorizer: Optional[TfidfVectorizer] = None
        self.precedent_embeddings: Dict[str, np.ndarray] = {}
        
    async def _get_embeddings(self, texts: List[str]) -> List[np.ndarray]:
        """Get embeddings with caching."""
        embeddings = []
        uncached_texts = []
        uncached_indices = []
        
        # Check cache first
        for i, text in enumerate(texts):
            text_hash = hashlib.md5(text.encode()).hexdigest()
            if text_hash in self.embeddings_cache:
                embeddings.append(self.embeddings_cache[text_hash])
            else:
                uncached_texts.append(text)
                uncached_indices.append(i)
                embeddings.append(None)  # Placeholder
        
        # Get embeddings for uncached texts
        if uncached_texts:
            try:
                embedding_model = OpenAIEmbeddings(
                    model=settings.embedding_model,
                    openai_api_key=settings.openai_api_key,
                )
                
                # Batch embedding generation
                new_embeddings = await asyncio.get_event_loop().run_in_executor(
                    self.executor,
                    embedding_model.embed_documents,
                    uncached_texts
                )
                
                # Update cache and results
                for i, (text, embedding) in enumerate(zip(uncached_texts, new_embeddings)):
                    text_hash = hashlib.md5(text.encode()).hexdigest()
                    embedding_array = np.array(embedding)
                    self.embeddings_cache[text_hash] = embedding_array
                    embeddings[uncached_indices[i]] = embedding_array
                    
            except Exception as e:
                logger.error(f"Failed to generate embeddings: {e}")
                # Use zero embeddings as fallback
                for i in uncached_indices:
                    embeddings[i] = np.zeros(1536)  # Default embedding size
        
        return embeddings
    
    def _calculate_factual_similarity(
        self, 
        case_facts: str, 
        precedent_facts: str,
        tfidf_vectorizer: TfidfVectorizer
    ) -> float:
        """Calculate factual similarity using TF-IDF."""
        try:
            # Transform texts
            case_vector = tfidf_vectorizer.transform([case_facts])
            precedent_vector = tfidf_vectorizer.transform([precedent_facts])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(case_vector, precedent_vector)[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Factual similarity calculation failed: {e}")
            return 0.0
    
    def _calculate_legal_principle_similarity(
        self, 
        case_principles: str, 
        precedent_principles: str,
        case_embedding: np.ndarray,
        precedent_embedding: np.ndarray
    ) -> float:
        """Calculate legal principle similarity using embeddings."""
        try:
            # Reshape for cosine similarity
            case_emb = case_embedding.reshape(1, -1)
            precedent_emb = precedent_embedding.reshape(1, -1)
            
            similarity = cosine_similarity(case_emb, precedent_emb)[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Legal principle similarity calculation failed: {e}")
            return 0.0
    
    async def _score_single_precedent(
        self,
        case_facts: str,
        case_principles: str,
        precedent: Dict[str, Any],
        case_embedding: np.ndarray,
        precedent_embedding: np.ndarray,
        tfidf_vectorizer: TfidfVectorizer,
        threshold: float = 0.3
    ) -> Optional[PrecedentScore]:
        """Score a single precedent with early termination."""
        start_time = time.time()
        
        precedent_id = precedent.get('id', '')
        precedent_facts = precedent.get('facts', '')
        precedent_principles = precedent.get('legal_principles', '')
        
        # Calculate factual similarity
        factual_match = self._calculate_factual_similarity(
            case_facts, precedent_facts, tfidf_vectorizer
        )
        
        # Early termination if factual match is too low
        if factual_match < threshold * 0.5:
            return None
        
        # Calculate legal principle similarity
        legal_principle_match = self._calculate_legal_principle_similarity(
            case_principles, precedent_principles,
            case_embedding, precedent_embedding
        )
        
        # Calculate combined score
        combined_score = (factual_match * 0.6) + (legal_principle_match * 0.4)
        
        # Early termination if combined score is below threshold
        if combined_score < threshold:
            return None
        
        processing_time = time.time() - start_time
        
        return PrecedentScore(
            precedent_id=precedent_id,
            citation=precedent.get('citation', ''),
            title=precedent.get('title', ''),
            relevance_score=combined_score,
            factual_match=factual_match,
            legal_principle_match=legal_principle_match,
            combined_score=combined_score,
            processing_time=processing_time,
            metadata=precedent.get('metadata', {})
        )
    
    async def batch_score_precedents(
        self,
        case_facts: str,
        case_principles: str,
        precedents: List[Dict[str, Any]],
        threshold: float = 0.3,
        batch_size: int = 10
    ) -> BatchScoreResult:
        """
        Score multiple precedents in parallel batches.
        
        Args:
            case_facts: Facts of the current case
            case_principles: Legal principles of the current case
            precedents: List of precedent documents
            threshold: Minimum score threshold
            batch_size: Size of processing batches
        
        Returns:
            BatchScoreResult with scores and metadata
        """
        start_time = time.time()
        
        # Check cache first
        case_hash = hashlib.md5(f"{case_facts}_{case_principles}".encode()).hexdigest()
        cache_key = f"batch_score:{case_hash}:{len(precedents)}:{threshold}"
        cached_result = cache.get("fact_fit", cache_key)
        if cached_result:
            return cached_result
        
        # Prepare texts for embedding
        case_texts = [case_facts, case_principles]
        precedent_texts = []
        for precedent in precedents:
            precedent_texts.extend([
                precedent.get('facts', ''),
                precedent.get('legal_principles', '')
            ])
        
        # Get all embeddings
        all_texts = case_texts + precedent_texts
        all_embeddings = await self._get_embeddings(all_texts)
        
        case_facts_embedding = all_embeddings[0]
        case_principles_embedding = all_embeddings[1]
        
        # Prepare precedent embeddings
        precedent_embeddings = []
        for i in range(0, len(precedent_texts), 2):
            facts_emb = all_texts[2 + i] if (2 + i) < len(all_embeddings) else np.zeros(1536)
            principles_emb = all_texts[2 + i + 1] if (2 + i + 1) < len(all_embeddings) else np.zeros(1536)
            precedent_embeddings.append((facts_emb, principles_emb))
        
        # Create TF-IDF vectorizer for factual similarity
        all_facts = [case_facts] + [p.get('facts', '') for p in precedents]
        tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        tfidf_vectorizer.fit(all_facts)
        
        # Process in batches
        all_scores = []
        cache_hits = 0
        early_terminations = 0
        
        for i in range(0, len(precedents), batch_size):
            batch = precedents[i:i + batch_size]
            batch_embeddings = precedent_embeddings[i:i + batch_size]
            
            # Create tasks for batch
            tasks = []
            for precedent, (facts_emb, principles_emb) in zip(batch, batch_embeddings):
                # Check individual precedent cache
                precedent_hash = hashlib.md5(
                    f"{case_hash}_{precedent.get('id', '')}".encode()
                ).hexdigest()
                individual_cache_key = f"single_score:{precedent_hash}"
                
                cached_score = cache.get("fact_fit", individual_cache_key)
                if cached_score:
                    all_scores.append(cached_score)
                    cache_hits += 1
                    continue
                
                task = self._score_single_precedent(
                    case_facts,
                    case_principles,
                    precedent,
                    case_principles_embedding,
                    principles_emb,
                    tfidf_vectorizer,
                    threshold
                )
                tasks.append((task, precedent, individual_cache_key))
            
            # Execute batch tasks
            if tasks:
                results = await asyncio.gather(*[task for task, _, _ in tasks], return_exceptions=True)
                
                for result, precedent, cache_key in zip(results, *[t[1:] for t in tasks]):
                    if isinstance(result, Exception):
                        logger.error(f"Precedent scoring failed: {result}")
                        early_terminations += 1
                    elif result is None:
                        early_terminations += 1
                    else:
                        all_scores.append(result)
                        # Cache individual result
                        cache.set("fact_fit", result, ttl=3600, key=cache_key)
        
        # Sort by combined score
        all_scores.sort(key=lambda x: x.combined_score, reverse=True)
        
        processing_time = time.time() - start_time
        
        result = BatchScoreResult(
            scores=all_scores,
            total_processed=len(precedents),
            processing_time=processing_time,
            cache_hits=cache_hits,
            early_terminations=early_terminations
        )
        
        # Cache batch result
        cache.set("fact_fit", result, ttl=1800, key=cache_key)
        
        return result
    
    async def get_top_precedents(
        self,
        case_facts: str,
        case_principles: str,
        precedents: List[Dict[str, Any]],
        top_k: int = 10,
        threshold: float = 0.3
    ) -> List[PrecedentScore]:
        """Get top k precedents above threshold."""
        result = await self.batch_score_precedents(
            case_facts, case_principles, precedents, threshold
        )
        
        # Filter by threshold and return top k
        filtered_scores = [s for s in result.scores if s.combined_score >= threshold]
        return filtered_scores[:top_k]
    
    def clear_cache(self) -> None:
        """Clear all cached data."""
        self.embeddings_cache.clear()
        self.precedent_embeddings.clear()
        cache.delete_prefix("fact_fit")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            "embeddings_cached": len(self.embeddings_cache),
            "precedent_embeddings": len(self.precedent_embeddings),
            "cache_stats": cache.get_stats()
        }

# Global fact-fit engine instance
fact_fit_engine = FactFitEngine()
